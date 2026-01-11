import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const Help: React.FC = () => {
  const { t } = useLanguage();
  const faqs = [
    { q: t('help.q1'), a: t('help.a1') },
    { q: t('help.q2'), a: t('help.a2') },
    { q: t('help.q3'), a: t('help.a3') },
    { q: t('help.q4'), a: t('help.a4') },
  ];

  return (
    <Layout>
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">{t('help.title')}</h1>
      <Card className="mx-auto max-w-2xl border-0 shadow-card">
        <CardContent className="p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-lg">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Help;
