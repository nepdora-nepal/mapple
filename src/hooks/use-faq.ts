import { useQuery } from "@tanstack/react-query";
import { faqApi } from "@/services/faq";

// Query Keys
export const faqKeys = {
  all: ["faqs"] as const,
  lists: () => [...faqKeys.all, "list"] as const,
  details: () => [...faqKeys.all, "detail"] as const,
  detail: (id: number) => [...faqKeys.details(), id] as const,
};

// Get all FAQs
export const useFAQs = () => {
  return useQuery({
    queryKey: faqKeys.lists(),
    queryFn: () => faqApi.getFAQs(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single FAQ
export const useFAQ = (id: number) => {
  return useQuery({
    queryKey: faqKeys.detail(id),
    queryFn: () => faqApi.getFAQ(id),
    enabled: !!id,
  });
};

