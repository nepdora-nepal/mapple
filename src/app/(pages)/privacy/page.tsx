import PrivacyPage from "@/components/pages/PrivacyPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read about how GLOW collects, uses, and protects your personal information and data.",
};

export default function Page() {
  return <PrivacyPage />;
}
