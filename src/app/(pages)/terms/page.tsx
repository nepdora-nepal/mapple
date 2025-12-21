import TermsPage from "@/components/pages/TermsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Read the terms and conditions for using the GLOW website and purchasing our beauty products.",
};

export default function Page() {
  return <TermsPage />;
}
