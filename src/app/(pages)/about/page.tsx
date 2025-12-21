import AboutPage from "@/components/pages/AboutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about GLOW's mission to provide premium, natural skincare and beauty essentials. Our journey towards radiance starts here.",
};

export default function Page() {
  return <AboutPage />;
}
