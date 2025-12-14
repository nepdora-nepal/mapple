
import { siteConfig } from "@/config/siteConfig";
import {
  FAQ,

  GetFAQResponse,
} from "@/types/faq";

export const faqApi = {
  // Get all FAQs
  getFAQs: async (): Promise<FAQ[]> => {
    const API_BASE_URL = siteConfig.backendUrl;
    const url = `${API_BASE_URL}/api/faq/`;

    const response = await fetch(url, {
      method: "GET",
    });

    return response.json();
  },

  // Get single FAQ by ID
  getFAQ: async (id: number): Promise<GetFAQResponse> => {
    const API_BASE_URL = siteConfig.backendUrl;
    const response = await fetch(`${API_BASE_URL}/api/faq/${id}/`, {
      method: "GET",
    });
    return response.json();
  },
};
