import React from 'react';
import { FileBarChart, Download, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScan } from '@/contexts/ScanContext';

const Reports: React.FC = () => {
  const { t } = useLanguage();
  const { scans, topBreed, topDisease } = useScan();
  const validScans = scans.filter(s => s.isValid);

  return (
    <Layout>
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">{t('reports.title')}</h1>
      
      {validScans.length < 3 ? (
        <Card className="border-0 shadow-card">
          <CardContent className="flex flex-col items-center py-16">
            <FileBarChart className="mb-4 h-16 w-16 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">{t('reports.noData')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <h3 className="mb-4 font-display text-xl font-semibold">{t('reports.topBreeds')}</h3>
              <p className="text-2xl font-bold text-primary">{topBreed || '—'}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-card">
            <CardContent className="p-6">
              <h3 className="mb-4 font-display text-xl font-semibold">{t('reports.topDiseases')}</h3>
              <p className="text-2xl font-bold text-secondary">{topDisease || 'Healthy'}</p>
            </CardContent>
          </Card>
          <div className="flex gap-4 md:col-span-2">
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />{t('reports.exportPdf')}</Button>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />{t('reports.exportCsv')}</Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Reports;
