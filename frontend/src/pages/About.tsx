import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const About: React.FC = () => {
  const { t } = useLanguage();
  const steps = [t('about.step1'), t('about.step2'), t('about.step3'), t('about.step4')];

  return (
    <Layout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 font-display text-3xl font-bold text-foreground">{t('about.title')}</h1>
        <p className="mb-8 text-lg text-muted-foreground">{t('about.description')}</p>
        <Card className="border-0 shadow-card">
          <CardContent className="p-6">
            <h2 className="mb-4 font-display text-xl font-semibold">{t('about.howItWorks')}</h2>
            <ol className="space-y-3">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{i + 1}</span>
                  <span className="text-foreground">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 rounded-xl bg-muted p-4 text-muted-foreground">{t('about.pipeline')}</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default About;
