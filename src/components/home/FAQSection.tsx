"use client";

import { motion } from "framer-motion";
import { useFAQs } from "@/hooks/use-faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Loader2 } from "lucide-react";
import { FAQ } from "@/types/faq";

export const FAQSection = () => {
  const { data: faqs, isLoading, error } = useFAQs();

  if (isLoading) {
    return (
      <section className="py-24 bg-background">
        <div className="container-luxury flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  // If error or no FAQs, we might want to hide the section or show nothing
  // For now, let's just return null if no data to keep design clean
  if (error || !faqs || (Array.isArray(faqs) && faqs.length === 0)) {
    return null;
  }

  // Handle both array and paginated response (if API changes later, but currently types say it returns FAQ[])
  // Wait, let's verify what getFAQs returns. The hook types imply it returns the result of api.getFAQs().
  // Assuming it returns FAQ[] based on usage elsewhere or standard simple API. 
  // If it returns { results: FAQ[] }, I need to handle that. 
  // Let's assume generic for now and check safely.
  const faqList: FAQ[] = Array.isArray(faqs) ? faqs : [];

  if (faqList.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container-luxury max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 space-y-4"
        >
          <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Find answers to common questions about our products and services.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqList.map((faq) => (
              <AccordionItem 
                key={faq.id} 
                value={`item-${faq.id}`}
                className="bg-secondary/20 rounded-2xl border-none px-6"
              >
                <AccordionTrigger className="hover:no-underline py-6 text-lg font-medium text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
