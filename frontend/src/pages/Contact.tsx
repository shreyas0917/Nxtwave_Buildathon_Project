import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <Layout>
      <div className="mx-auto max-w-lg">
        <h1 className="mb-8 font-display text-3xl font-bold text-foreground">{t('contact.title')}</h1>
        <Card className="border-0 shadow-card">
          <CardContent className="p-6">
            {sent ? (
              <div className="flex flex-col items-center py-8">
                <CheckCircle2 className="mb-4 h-16 w-16 text-success" />
                <p className="text-lg font-medium">{t('contact.sent')}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input placeholder={t('contact.name')} required className="h-12" />
                <Input type="email" placeholder={t('contact.email')} required className="h-12" />
                <Textarea placeholder={t('contact.message')} required className="min-h-[120px]" />
                <Button type="submit" className="w-full btn-large shadow-button"><Send className="mr-2 h-5 w-5" />{t('contact.send')}</Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Contact;
