import BrandPage from "@/components/pages/BrandPage";
import { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const brandName = id ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ") : "Brand";

  return {
    title: brandName,
    description: `Discover the best of ${brandName} at GLOW. Premium beauty products and skincare essentials selected for you.`,
  };
}

export default function Page() {
  return <BrandPage />;
}
