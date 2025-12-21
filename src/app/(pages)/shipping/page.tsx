import ShippingPage from "@/components/pages/ShippingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "Learn about GLOW's shipping policies, rates, and delivery times for our premium beauty products.",
};

export default function Page() {
  return <ShippingPage />;
}
