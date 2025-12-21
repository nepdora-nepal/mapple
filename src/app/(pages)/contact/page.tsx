import ContactPage from "@/components/pages/ContactPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Have questions about our products or your order? Get in touch with the GLOW support team. We're here to help you achieve your best skin.",
};

export default function Page() {
  return <ContactPage />;
}
