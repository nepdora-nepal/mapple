import WishlistPage from "@/components/pages/WishlistPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View and manage your favorite GLOW skincare and beauty products saved in your wishlist.",
};

export default function Page() {
  return <WishlistPage />;
}
