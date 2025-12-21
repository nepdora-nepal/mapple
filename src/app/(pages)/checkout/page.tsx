import CheckoutPage from "@/components/pages/CheckoutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase at GLOW. Secure checkout for your luxury skincare and beauty products.",
};

export default function Page() {
  return <CheckoutPage />;
}
