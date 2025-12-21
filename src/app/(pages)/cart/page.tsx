import CartPage from "@/components/pages/CartPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Review your selected beauty and skincare essentials in your GLOW shopping bag before checking out.",
};

export default function Page() {
  return <CartPage />;
}
