"use client";

import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFAQs } from "@/hooks/use-faq";

const FAQPage = () => {
  const { data: faqs, isLoading, error } = useFAQs();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-16 flex items-center justify-center">
        <p className="text-muted-foreground">Loading FAQs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-28 pb-16 flex items-center justify-center">
        <p className="text-red-500">Failed to load FAQs. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="pt-28 pb-16">
        <div className="container-luxury">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-muted-foreground">
              Find answers to common questions about orders, shipping, returns, and more.
            </p>
          </motion.div>

          {/* FAQ Sections */}
          <div className="max-w-3xl mx-auto space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Accordion type="single" collapsible className="space-y-3">
                {faqs?.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={`faq-${faq.id}`}
                    className="bg-card border border-border rounded-2xl px-6"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>

          {/* Still Need Help */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-xl mx-auto mt-16 text-center p-8 bg-secondary rounded-3xl"
          >
            <h3 className="text-lg font-bold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Our customer service team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-block px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </main>

    </div>
  );
};

export default FAQPage;
