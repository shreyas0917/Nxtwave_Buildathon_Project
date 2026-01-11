import React, { useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Image as ImageIcon, 
  Scan, 
  Stethoscope, 
  ClipboardList, 
  CheckCircle2, 
  XCircle, 
  Download,
  RefreshCw,
  Loader2,
  HelpCircle,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScan, simulateDetection, ScanResult } from '@/contexts/ScanContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type ScanType = 'full' | 'breed' | 'disease';

const Detection: React.FC = () => {
  const { t } = useLanguage();
  const { addScan } = useScan();
  const { toast } = useToast();
  const { sendDiseaseAlert } = useNotifications();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [scanType, setScanType] = useState<ScanType>((searchParams.get('type') as ScanType) || 'full');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: t('common.error'),
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: t('common.error'),
        description: 'Image size must be less than 10MB',
        variant: 'destructive',
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setStep(2);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleScan = async () => {
    if (!imagePreview) return;

    setIsScanning(true);
    setStep(3);

    try {
      const scanResult = await simulateDetection(imagePreview, scanType);
      setResult(scanResult);
      addScan(scanResult);

      if (scanResult.isValid) {
        toast({
          title: t('common.success'),
          description: t('detect.cattleDetected'),
        });

        // Send disease alert notification if disease detected (not healthy)
        if (scanResult.disease && scanResult.disease !== 'Healthy' && scanResult.diseaseConfidence) {
          sendDiseaseAlert(scanResult.disease, scanResult.diseaseConfidence, scanResult.id);
        }
      } else {
        toast({
          title: t('detect.cattleNotDetected'),
          description: t('detect.invalidInput'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Scan failed. Please try again.',
        variant: 'destructive',
      });
      setStep(2);
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setImageFile(null);
    setImagePreview('');
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;

    const report = `
CattleCare AI - Scan Report
============================
Scan ID: ${result.id}
Date: ${result.scanDate.toLocaleString()}
Scan Type: ${result.scanType}

Results:
--------
Cattle Detected: ${result.cattleDetected ? 'Yes' : 'No'}
${result.breed ? `Breed: ${result.breed} (${result.breedConfidence?.toFixed(1)}% confidence)` : ''}
${result.disease ? `Disease: ${result.disease} (${result.diseaseConfidence?.toFixed(1)}% confidence)` : ''}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-report-${result.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const scanTypeOptions = [
    { value: 'full', icon: ClipboardList, label: t('detect.fullDetection') },
    { value: 'breed', icon: Scan, label: t('detect.onlyBreed') },
    { value: 'disease', icon: Stethoscope, label: t('detect.onlyDisease') },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-0 md:px-0">
        {/* Header - mobile optimized */}
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-4xl">
            {t('detect.title')}
          </h1>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">
            {t(`detect.step${step}`)}
          </p>
        </div>

        {/* Progress Steps - mobile optimized */}
        <div className="mb-6 md:mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full font-semibold text-sm md:text-base transition-colors
                ${step >= s 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Step 1: Upload - mobile optimized */}
        {step === 1 && (
          <Card className="animate-fade-in border-0 shadow-card">
            <CardContent className="p-4 md:p-6">
              <div
                className={`
                  relative flex min-h-[250px] md:min-h-[300px] cursor-pointer flex-col items-center justify-center 
                  rounded-2xl border-2 border-dashed transition-colors
                  ${dragActive 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 active:border-primary/50'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                
                <div className="mb-3 md:mb-4 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-primary-light">
                  <Upload className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                </div>
                
                <p className="mb-2 text-base md:text-lg font-medium text-foreground text-center px-4">
                  {t('detect.dragDrop')}
                </p>
                <p className="text-sm text-muted-foreground">{t('detect.or')}</p>
                <Button variant="outline" className="mt-3 md:mt-4 h-11 md:h-10">
                  <Camera className="mr-2 h-5 w-5" />
                  {t('detect.browse')}
                </Button>
                <p className="mt-3 md:mt-4 text-xs md:text-sm text-muted-foreground text-center px-4">
                  {t('detect.supportedFormats')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Choose Scan Type - mobile optimized */}
        {step === 2 && (
          <div className="animate-fade-in space-y-4 md:space-y-6">
            {/* Image Preview */}
            <Card className="border-0 shadow-card overflow-hidden">
              <CardContent className="p-3 md:p-4">
                <div className="relative aspect-[4/3] md:aspect-video overflow-hidden rounded-xl bg-muted">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute right-2 top-2 rounded-lg bg-background/80 p-2.5 text-foreground hover:bg-background active:bg-background"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Scan Type Selection - mobile grid */}
            <div className="grid gap-2 md:gap-3 grid-cols-3">
              {scanTypeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = scanType === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => setScanType(option.value as ScanType)}
                    className={`
                      flex flex-col items-center gap-1 md:gap-2 rounded-xl md:rounded-2xl p-3 md:p-5 transition-all
                      ${isSelected 
                        ? 'bg-primary text-primary-foreground shadow-button' 
                        : 'bg-card border border-border hover:border-primary active:border-primary'
                      }
                    `}
                  >
                    <Icon className="h-6 w-6 md:h-8 md:w-8" />
                    <span className="font-medium text-xs md:text-base text-center leading-tight">{option.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scan Button - larger on mobile */}
            <Button
              size="lg"
              className="btn-large w-full shadow-button h-14 md:h-12 text-base"
              onClick={handleScan}
            >
              <Scan className="mr-2 h-5 w-5" />
              {t('detect.startScan')}
            </Button>
          </div>
        )}

        {/* Step 3: Results - mobile optimized */}
        {step === 3 && (
          <div className="animate-fade-in space-y-4 md:space-y-6">
            {isScanning ? (
              <Card className="border-0 shadow-card">
                <CardContent className="flex flex-col items-center justify-center py-12 md:py-16">
                  <Loader2 className="mb-3 md:mb-4 h-12 w-12 md:h-16 md:w-16 animate-spin text-primary" />
                  <p className="text-base md:text-lg font-medium text-foreground">
                    {t('detect.scanning')}
                  </p>
                  <Progress value={66} className="mt-3 md:mt-4 w-40 md:w-48" />
                </CardContent>
              </Card>
            ) : result && (
              <>
                {/* Cattle Detection Status */}
                <Card className={`border-0 shadow-card ${result.isValid ? 'bg-success/5' : 'bg-destructive/5'}`}>
                  <CardContent className="flex items-center gap-3 md:gap-4 p-4 md:p-6">
                    {result.isValid ? (
                      <CheckCircle2 className="h-10 w-10 md:h-12 md:w-12 text-success shrink-0" />
                    ) : (
                      <XCircle className="h-10 w-10 md:h-12 md:w-12 text-destructive shrink-0" />
                    )}
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-foreground">
                        {result.isValid ? t('detect.cattleDetected') : t('detect.cattleNotDetected')}
                      </h3>
                      {!result.isValid && (
                        <p className="mt-1 text-sm md:text-base text-destructive">
                          {t('detect.invalidInput')}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Results Cards - mobile optimized */}
                {result.isValid && (
                  <div className="grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2">
                    {result.breed && (
                      <Card className="border-0 shadow-card">
                        <CardContent className="p-4 md:p-6">
                          <div className="mb-2 md:mb-3 flex items-center gap-2">
                            <Scan className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                            <span className="text-xs md:text-sm text-muted-foreground">{t('detect.breed')}</span>
                          </div>
                          <p className="text-xl md:text-2xl font-bold text-foreground">{result.breed}</p>
                          <div className="mt-2 md:mt-3">
                            <div className="mb-1 flex justify-between text-xs md:text-sm">
                              <span className="text-muted-foreground">{t('detect.confidence')}</span>
                              <span className="font-medium text-foreground">
                                {result.breedConfidence?.toFixed(1)}%
                              </span>
                            </div>
                            <Progress value={result.breedConfidence} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {result.disease && (
                      <Card className="border-0 shadow-card">
                        <CardContent className="p-4 md:p-6">
                          <div className="mb-2 md:mb-3 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 md:h-5 md:w-5 text-secondary" />
                            <span className="text-xs md:text-sm text-muted-foreground">{t('detect.disease')}</span>
                          </div>
                          <p className={`text-xl md:text-2xl font-bold ${result.disease === 'Healthy' ? 'text-success' : 'text-warning'}`}>
                            {result.disease === 'Healthy' ? t('detect.healthy') : result.disease}
                          </p>
                          <div className="mt-2 md:mt-3">
                            <div className="mb-1 flex justify-between text-xs md:text-sm">
                              <span className="text-muted-foreground">{t('detect.confidence')}</span>
                              <span className="font-medium text-foreground">
                                {result.diseaseConfidence?.toFixed(1)}%
                              </span>
                            </div>
                            <Progress value={result.diseaseConfidence} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Action Buttons - mobile optimized */}
                <div className="flex flex-col gap-2 md:gap-3 sm:flex-row">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 h-12 md:h-11"
                    onClick={handleDownloadReport}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    {t('detect.downloadReport')}
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 shadow-button h-12 md:h-11"
                    onClick={handleReset}
                  >
                    <RefreshCw className="mr-2 h-5 w-5" />
                    {t('detect.scanAgain')}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Help Section - mobile optimized */}
        <Card className="mt-6 md:mt-8 border-0 shadow-card">
          <CardContent className="p-3 md:p-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="help" className="border-0">
                <AccordionTrigger className="py-2 md:py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <span className="font-medium text-sm md:text-base">{t('detect.helpTitle')}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-3 md:pb-4">
                  <ul className="space-y-2 text-xs md:text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {t('detect.helpTip1')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {t('detect.helpTip2')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {t('detect.helpTip3')}
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {t('detect.helpTip4')}
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Detection;
