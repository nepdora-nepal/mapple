"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut, User as UserIcon, Package, ShieldCheck, MapPin, Camera, ChevronRight, Edit2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

import { toast } from "sonner";

const ProfilePage = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  
  // State for profile form initialized lazily or will be reset via key
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  // State for password change
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleUpdateProfile = async () => {
    // Mock functionality as backend support was removed by user request
    setIsEditing(false);
    toast.success("Profile updated (Simulation Only)");
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
        toast.error("Passwords do not match"); 
        return; 
    }
    // Mock functionality as backend support was removed by user request
    toast.success("Password changed (Simulation Only)");
    setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading profile...</p>
        </div>
      </div>
    );
  }

  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();

  const menuItems = [
    { id: "account", label: "Personal Info", icon: UserIcon },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "security", label: "Login & Security", icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-rose/5 rounded-full blur-3xl pointer-events-none" />

      <main className="pt-32 pb-20 relative z-10 container-luxury">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl md:text-4xl font-serif mb-2">My Profile</h1>
            <p className="text-muted-foreground mb-12">Manage your account settings and preferences.</p>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-12">
          
          {/* Sidebar Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            {/* User Snapshot */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative group cursor-pointer">
                    <Avatar className="h-16 w-16 border-2 border-background shadow-soft">
                        <AvatarImage src="" alt={user.first_name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div className="overflow-hidden">
                    <h3 className="font-medium truncate">{user.first_name} {user.last_name}</h3>
                    <p className="text-sm text-muted-foreground truncate opacity-80">{user.email}</p>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                            activeTab === item.id 
                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={cn("w-4 h-4", activeTab === item.id ? "opacity-100" : "opacity-70")} />
                            {item.label}
                        </div>
                        {activeTab === item.id && <ChevronRight className="w-4 h-4 opacity-50" />}
                    </button>
                ))}
            </nav>

            <div className="pt-8 mt-8 border-t border-border/50">
                 <Button 
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/5 px-4"
                    onClick={logout}
                >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                 </Button>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:pl-8 lg:border-l lg:border-border/40 min-h-[500px]">
            <AnimatePresence mode="wait">
                
                {/* ACCOUNT TAB */}
                {activeTab === "account" && (
                    <motion.div
                        key={user?.id ? `account-${user.id}` : "account"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8 max-w-2xl"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-medium mb-1">Personal Information</h2>
                                <p className="text-sm text-muted-foreground">Update your photo and personal details.</p>
                            </div>
                            {!isEditing ? (
                                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2">
                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2">
                                     <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm">Cancel</Button>
                                     <Button onClick={handleUpdateProfile} size="sm" className="gap-2">
                                        <Save className="w-3.5 h-3.5" /> Save
                                     </Button>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">First Name</Label>
                                    <Input 
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                        readOnly={!isEditing}
                                        className={cn("bg-transparent border-border/50 focus:bg-background transition-all", !isEditing && "border-transparent px-0 font-medium text-lg h-auto shadow-none -ml-1 cursor-default focus-visible:ring-0")}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Last Name</Label>
                                    <Input 
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                        readOnly={!isEditing}
                                        className={cn("bg-transparent border-border/50 focus:bg-background transition-all", !isEditing && "border-transparent px-0 font-medium text-lg h-auto shadow-none -ml-1 cursor-default focus-visible:ring-0")}
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Email Address</Label>
                                 <Input 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    readOnly={!isEditing}
                                    className={cn("bg-transparent border-border/50 focus:bg-background transition-all", !isEditing && "border-transparent px-0 font-medium text-lg h-auto shadow-none -ml-1 cursor-default focus-visible:ring-0")}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Phone Number</Label>
                                 <Input 
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    readOnly={!isEditing}
                                    placeholder={isEditing ? "+1 234 567 890" : "Not set"}
                                    className={cn("bg-transparent border-border/50 focus:bg-background transition-all", !isEditing && "border-transparent px-0 font-medium text-lg h-auto shadow-none -ml-1 cursor-default focus-visible:ring-0")}
                                />
                            </div>

                             <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Shipping Address</Label>
                                <div className="relative">
                                    {isEditing && <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />}
                                    <Input 
                                        value={formData.address}
                                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        readOnly={!isEditing}
                                        placeholder={isEditing ? "Enter your address" : "No address set"}
                                        className={cn(
                                            "bg-transparent border-border/50 focus:bg-background transition-all", 
                                            isEditing ? "pl-9" : "border-transparent px-0 font-medium text-lg h-auto shadow-none -ml-1 cursor-default focus-visible:ring-0"
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ORDERS TAB */}
                {activeTab === "orders" && (
                    <motion.div
                         key="orders"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-xl font-medium mb-1">Order History</h2>
                                <p className="text-sm text-muted-foreground">View and track your recent orders.</p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/20 p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-background rounded-full shadow-soft flex items-center justify-center mb-4">
                                <Package className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <h3 className="font-medium text-lg mb-2">No orders yet</h3>
                            <p className="text-muted-foreground max-w-sm mb-6">Looks like you haven&apos;t placed an order yet. Explore our collection and find something you love.</p>
                            <Button onClick={() => router.push('/products')} className="min-w-[150px]">Start Shopping</Button>
                        </div>
                    </motion.div>
                )}

                {/* SECURITY TAB */}
                {activeTab === "security" && (
                     <motion.div
                        key="security"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8 max-w-xl"
                    >
                         <div className="mb-6">
                            <h2 className="text-xl font-medium mb-1">Login & Security</h2>
                            <p className="text-sm text-muted-foreground">Manage your password and security settings.</p>
                        </div>

                        <div className="p-6 rounded-2xl border border-border bg-card/40 shadow-xs space-y-6">
                            <h3 className="font-medium flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                Change Password
                            </h3>
                             <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Current Password</Label>
                                    <Input
                                        type="password"
                                        className="bg-background"
                                        value={passwordData.old_password}
                                        onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>New Password</Label>
                                    <Input
                                        type="password"
                                        className="bg-background"
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Confirm New Password</Label>
                                    <Input
                                        type="password"
                                        className="bg-background"
                                        value={passwordData.confirm_password}
                                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                                    />
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button onClick={handleChangePassword} disabled={isLoading}>
                                        {isLoading ? "Updating..." : "Update Password"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
