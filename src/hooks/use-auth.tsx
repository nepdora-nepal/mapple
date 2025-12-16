"use client";

import  { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { loginUser, signupUser, changePasswordUser, updateUserDetails, requestPasswordReset, confirmPasswordReset, getUserDetails } from "@/services/auth";
import { User, AuthTokens, DecodedAccessToken, LoginResponse } from "@/types/auth";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/*                              TOKEN UTILITIES                               */
/* -------------------------------------------------------------------------- */

const AUTH_TOKENS_KEY = "glow-authTokens";

// Decode JWT token to get user info
const decodeToken = (token: string): DecodedAccessToken | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/* -------------------------------------------------------------------------- */
/*                              AUTH CONTEXT                                  */
/* -------------------------------------------------------------------------- */

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    address?: string;
  }) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  
  forgotPassword: (email: string) => Promise<void>;
  resetPasswordConfirm: (data: { uid: string; token: string; password: string }) => Promise<void>;
  changePassword: (data: { old_password: string; new_password: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* -------------------------------------------------------------------------- */
/*                              AUTH PROVIDER                                 */
/* -------------------------------------------------------------------------- */

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing tokens on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedTokens = localStorage.getItem(AUTH_TOKENS_KEY);
      if (storedTokens) {
        try {
          const parsedTokens: AuthTokens = JSON.parse(storedTokens);
          const decodedAccess = decodeToken(parsedTokens.access);

          if (decodedAccess && decodedAccess.exp * 1000 > Date.now()) {
            setTokens(parsedTokens);
            // Initial optimistic set from token
            setUser({
                id: decodedAccess.user_id,
                email: decodedAccess.email,
                username: decodedAccess.email,
                first_name: decodedAccess.first_name,
                last_name: decodedAccess.last_name,
                phone: decodedAccess.phone,
                address: decodedAccess.address,
            });

            // Fetch fresh user data
            try {
                const freshUser = await getUserDetails(parsedTokens.access);
                setUser(freshUser);
            } catch (error) {
                console.error("Failed to fetch fresh user details:", error);
                // Optionally handle token invalidation here if needed
            }

          } else {
            // Token expired
            localStorage.removeItem(AUTH_TOKENS_KEY);
            if (decodedAccess) {
              toast.error("Session expired. Please log in again.");
            }
          }
        } catch (error) {
          console.error("Failed to parse stored tokens:", error);
          localStorage.removeItem(AUTH_TOKENS_KEY);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Handle successful auth
  const handleAuthSuccess = (userData: User, tokenData: AuthTokens) => {
    setUser(userData);
    setTokens(tokenData);
    localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokenData));
  };

  // Get error message from API response
  const getErrorMessage = (error: Error & { response?: { status?: number; data?: Record<string, unknown> } }) => {
    if (error.response) {
      const data = error.response.data;
      
      if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        return (data.errors[0] as { message?: string }).message || "An error occurred";
      }
      
      return (data?.message || data?.error || data?.detail || error.message) as string;
    }
    return error.message || "An unexpected error occurred";
  };

  // Login function
  const login = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await loginUser(data);

      const accessToken = response.tokens.access;
      const refreshToken = response.tokens.refresh;

      if (!accessToken) {
        throw new Error("No access token received from server");
      }

      const decodedAccess = decodeToken(accessToken);
      if (!decodedAccess) {
        throw new Error("Failed to decode access token");
      }

      const loggedInUser: User = {
        id: decodedAccess.user_id,
        email: decodedAccess.email,
        username: decodedAccess.email,
        first_name: decodedAccess.first_name,
        last_name: decodedAccess.last_name,
        phone: decodedAccess.phone,
        address: decodedAccess.address,
      };

      handleAuthSuccess(loggedInUser, {
        access: accessToken,
        refresh: refreshToken,
      });

      toast.success("Login successful! Welcome back!");

      // Handle redirect
      const redirectUrl = sessionStorage.getItem("redirectAfterLogin");
      if (redirectUrl) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectUrl);
      } else {
        router.push("/");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error as Error);
      toast.error(errorMessage);
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    address?: string;
  }) => {
    setIsLoading(true);
    try {
      await signupUser({
        ...data,
        website_type: "ecommerce",
      });

      toast.success("Account created successfully! Please log in to continue.");
      router.push("/auth");
    } catch (error) {
      const errorMessage = getErrorMessage(error as Error);
      toast.error(errorMessage);
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Change Password function
  const changePassword = async (data: { old_password: string; new_password: string }) => {
    if (!tokens?.access) {
       toast.error("You must be logged in to change your password");
       return;
    }

    setIsLoading(true);
    try {
      await changePasswordUser({
        ...data,
        token: tokens.access,
      });
      toast.success("Password changed successfully");
    } catch (error) {
      const errorMessage = getErrorMessage(error as Error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update Profile function
  const updateProfile = async (data: Partial<User>) => {
    if (!tokens?.access) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateUserDetails({
        ...data,
        token: tokens.access,
      });

      setUser(updatedUser);
      toast.success("Profile updated successfully");
    } catch (error) {
       const errorMessage = getErrorMessage(error as Error);
       toast.error(errorMessage);
       throw error;
    } finally {
        setIsLoading(false);
    }
  };

  // Forgot Password function
  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await requestPasswordReset({ email });
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error) {
      const errorMessage = getErrorMessage(error as Error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Password Confirm function
  const resetPasswordConfirm = async (data: { uid: string; token: string; password: string }) => {
    setIsLoading(true);
    try {
      await confirmPasswordReset(data);
      toast.success("Password has been reset successfully. You can now log in.");
      router.push("/auth");
    } catch (error) {
      const errorMessage = getErrorMessage(error as Error);
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem(AUTH_TOKENS_KEY);
    sessionStorage.removeItem("redirectAfterLogin");
    toast.success("You have been successfully logged out.");
    router.push("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        login,
        signup,
        forgotPassword,
        resetPasswordConfirm,
        changePassword,
        updateProfile,
        logout,
        isLoading,
        isAuthenticated: !!user && !!tokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* -------------------------------------------------------------------------- */
/*                              USE AUTH HOOK                                 */
/* -------------------------------------------------------------------------- */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

/* -------------------------------------------------------------------------- */
/*                           TOKEN ACCESS HELPERS                             */
/* -------------------------------------------------------------------------- */

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const storedTokens = localStorage.getItem(AUTH_TOKENS_KEY);
    if (storedTokens) {
      const parsedTokens: AuthTokens = JSON.parse(storedTokens);
      return parsedTokens.access;
    }
  } catch {
    return null;
  }
  return null;
};

export const getRefreshToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const storedTokens = localStorage.getItem(AUTH_TOKENS_KEY);
    if (storedTokens) {
      const parsedTokens: AuthTokens = JSON.parse(storedTokens);
      return parsedTokens.refresh;
    }
  } catch {
    return null;
  }
  return null;
};
