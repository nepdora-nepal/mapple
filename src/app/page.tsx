import Index from "@/components/pages/Index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Welcome to GLOW - Your ultimate destination for luxury skincare and beauty essentials. Experience the best in skincare innovation.",
};

export default function Home() {
  return <Index />;
}
