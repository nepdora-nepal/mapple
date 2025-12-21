import ReturnsPage from "@/components/pages/ReturnsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "Our return and exchange policy at GLOW. We want you to be completely satisfied with your skincare journey.",
};

export default function Page() {
  return <ReturnsPage />;
}
