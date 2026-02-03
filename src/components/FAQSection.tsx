import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { FAQItem, Service, City } from '@/types';

interface FAQSectionProps {
    faqs: FAQItem[];
    service: Service;
    city: City;
}

export function FAQSection({ faqs, service, city }: FAQSectionProps) {
    // Generate JSON-LD structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return (
        <section className="space-y-6">
            {/* JSON-LD Script */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div>
                <h2 className="text-2xl font-bold mb-2">
                    Questions fréquentes sur {service.name.toLowerCase()} à {city.name}
                </h2>
                <p className="text-muted-foreground">
                    Retrouvez les réponses aux questions les plus posées par nos utilisateurs.
                </p>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                    <AccordionItem
                        key={index}
                        value={`item-${index}`}
                        className="border rounded-lg px-4"
                    >
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                            <span className="font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-muted-foreground">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}
