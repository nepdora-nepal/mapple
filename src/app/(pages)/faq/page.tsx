import FAQPage from "@/components/pages/FAQPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about shipping, returns, product ingredients, and more at GLOW.",
};

export default function Page() {
  return <FAQPage />;
}
