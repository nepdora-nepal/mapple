import ProductPage from "@/components/pages/ProductPage";
import { Metadata } from "next";
import { productApi } from "@/services/product";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  try {
    const product = await productApi.getProduct(id);
    return {
      title: product.name,
      description: product.description || `Buy ${product.name} at GLOW. Premium skincare products for your beauty routine.`,
      openGraph: {
        images: product.thumbnail_image ? [product.thumbnail_image] : [],
      },
    };
  } catch {
    return {
      title: "Product Details",
      description: "Discover our premium skincare products at GLOW.",
    };
  }
}

export default function Page() {
  return <ProductPage />;
}
