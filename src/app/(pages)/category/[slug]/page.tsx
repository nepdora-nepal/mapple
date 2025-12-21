import CategoryPage from "@/components/pages/CategoryPage";
import { Metadata } from "next";
import { productApi } from "@/services/product";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = (await params).slug;
  try {
    const categoriesResponse = await productApi.getCategories();
    const category = categoriesResponse.results.find((c) => c.slug === slug);
    
    if (category) {
      return {
        title: category.name,
        description: category.description || `Explore our ${category.name} collection at GLOW. Curated beauty and skincare essentials.`,
      };
    }
  } catch (error) {
    console.error("Error generating category metadata:", error);
  }

  return {
    title: "Category",
    description: "Browse our curated collection of beauty and skincare products.",
  };
}

export default async function Page({ params }: PageProps) {
  await params;
  
  return <CategoryPage />;
}
