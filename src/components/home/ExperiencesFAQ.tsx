import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do I need any prior pottery experience?",
    answer: "Not at all! Our experiences are designed for complete beginners. Our skilled guides will walk you through every step, ensuring you feel comfortable and creative throughout your session."
  },
  {
    question: "What should I wear to a session?",
    answer: "Wear comfortable clothes that you don't mind getting a little clay on. We provide aprons, but clay has a way of finding its way to unexpected places! Avoid loose sleeves and remove any rings or bracelets."
  },
  {
    question: "When do I receive my finished piece?",
    answer: "Your creations need time to dry and be fired in our kiln. This process takes approximately 2-3 weeks. We'll notify you when your piece is ready for pickup, or we can arrange delivery for an additional fee."
  },
  {
    question: "Can I book for a larger group?",
    answer: "Absolutely! For groups larger than 12, please contact us directly to discuss custom arrangements. We can accommodate corporate events, large celebrations, and special gatherings."
  },
  {
    question: "What's your cancellation policy?",
    answer: "We understand plans change. Cancellations made 48 hours or more before your session are eligible for a full refund. Cancellations within 48 hours can be rescheduled to another date subject to availability."
  },
  {
    question: "Is food and beverages included?",
    answer: "Light refreshments (tea, coffee, and snacks) are included in all experiences. For birthday sessions and farm parties, we can arrange additional catering at extra cost."
  },
  {
    question: "Can children participate?",
    answer: "Children aged 6 and above are welcome in our sessions. For younger children, we recommend our dedicated Kids Clay Play workshops. All children must be accompanied by an adult."
  },
  {
    question: "What happens if I'm running late?",
    answer: "Please let us know if you're running late. We can accommodate delays of up to 15 minutes, but longer delays may require rescheduling as we have sessions scheduled throughout the day."
  }
];

const ExperiencesFAQ = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="py-16 md:py-24"
    >
      <div className="container max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="font-sans text-sm tracking-widest uppercase text-terracotta"
          >
            Common Questions
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="font-serif text-3xl md:text-4xl text-deep-clay mt-4"
          >
            Everything You Need to Know
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card/50 border border-border/40 rounded-lg px-6 data-[state=open]:bg-card"
              >
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ExperiencesFAQ;
