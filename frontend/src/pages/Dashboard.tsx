import React from 'react';
import { Link } from 'react-router-dom';
import { Scan, Stethoscope, ClipboardList, History, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useScan } from '@/contexts/ScanContext';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { scans, totalScans, topBreed, topDisease } = useScan();

  const recentScans = scans.slice(0, 5);

  const actionCards = [
    {
      icon: Scan,
      title: t('dashboard.scanBreed'),
      path: '/detect?type=breed',
      color: 'action-card-primary',
    },
    {
      icon: Stethoscope,
      title: t('dashboard.scanDisease'),
      path: '/detect?type=disease',
      color: 'action-card-secondary',
    },
    {
      icon: ClipboardList,
      title: t('dashboard.fullScan'),
      subtitle: t('dashboard.fullScanDesc'),
      path: '/detect?type=full',
      color: 'action-card-accent',
    },
    {
      icon: History,
      title: t('dashboard.history'),
      path: '/history',
      color: 'bg-card border border-border hover:border-primary',
      textColor: 'text-foreground',
    },
  ];

  return (
    <Layout>
      {/* Welcome Section - mobile optimized */}
      <div className="mb-6 md:mb-8 animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-4xl">
          {t('dashboard.welcome')}, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p className="mt-1 md:mt-2 text-sm md:text-lg text-muted-foreground">
          Start scanning cattle images to detect breed and diseases.
        </p>
      </div>

      {/* Action Cards - mobile grid */}
      <div className="mb-6 md:mb-8 grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        {actionCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link 
              key={index} 
              to={card.path}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`${card.color} action-card flex flex-col items-center text-center p-4 md:p-6 min-h-[120px] md:min-h-[140px]`}>
                <Icon className={`mb-2 md:mb-3 h-8 w-8 md:h-10 md:w-10 ${card.textColor || ''}`} />
                <h3 className={`text-sm md:text-lg font-semibold leading-tight ${card.textColor || ''}`}>
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p className={`mt-1 text-xs opacity-80 hidden md:block ${card.textColor || ''}`}>
                    {card.subtitle}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Stats Section - mobile optimized */}
      <div className="mb-6 md:mb-8 grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-0 shadow-card">
          <CardContent className="flex items-center gap-3 md:gap-4 p-4 md:p-5">
            <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl bg-primary-light shrink-0">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-muted-foreground">{t('dashboard.totalScans')}</p>
              <p className="font-display text-xl md:text-2xl font-bold text-foreground">{totalScans}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card">
          <CardContent className="flex items-center gap-3 md:gap-4 p-4 md:p-5">
            <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl bg-secondary-light shrink-0">
              <Scan className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">{t('dashboard.topBreed')}</p>
              <p className="font-display text-lg md:text-xl font-bold text-foreground truncate">
                {topBreed || '—'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-card">
          <CardContent className="flex items-center gap-3 md:gap-4 p-4 md:p-5">
            <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl bg-accent/20 shrink-0">
              <AlertCircle className="h-5 w-5 md:h-6 md:w-6 text-accent-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-muted-foreground">{t('dashboard.topDisease')}</p>
              <p className="font-display text-lg md:text-xl font-bold text-foreground truncate">
                {topDisease || '—'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans - mobile optimized */}
      <Card className="border-0 shadow-card">
        <CardContent className="p-4 md:p-6">
          <div className="mb-3 md:mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg md:text-xl font-semibold text-foreground">
              {t('dashboard.recentScans')}
            </h2>
            {recentScans.length > 0 && (
              <Link to="/history">
                <Button variant="ghost" size="sm" className="text-xs md:text-sm">
                  View All →
                </Button>
              </Link>
            )}
          </div>

          {recentScans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 md:py-12">
              <div className="mb-3 md:mb-4 flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-muted">
                <Scan className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
              </div>
              <p className="text-center text-sm md:text-base text-muted-foreground">
                {t('dashboard.noScans')}
              </p>
              <Link to="/detect" className="mt-3 md:mt-4">
                <Button className="h-11 md:h-10">Start Scanning</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {recentScans.map((scan) => (
                <Link
                  key={scan.id}
                  to={`/scan/${scan.id}`}
                  className="flex items-center gap-3 md:gap-4 rounded-xl bg-muted/50 p-3 transition-colors hover:bg-muted active:bg-muted"
                >
                  <div className="h-12 w-12 md:h-14 md:w-14 overflow-hidden rounded-lg bg-muted shrink-0">
                    {scan.imageUrl && (
                      <img
                        src={scan.imageUrl}
                        alt="Scan"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {scan.isValid ? (
                        <span className="text-xs md:text-sm font-medium text-success">✓ {t('detect.cattleDetected')}</span>
                      ) : (
                        <span className="text-xs md:text-sm font-medium text-destructive">✗ {t('detect.cattleNotDetected')}</span>
                      )}
                    </div>
                    {scan.isValid && (
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        {scan.breed && `${t('detect.breed')}: ${scan.breed}`}
                        {scan.breed && scan.disease && ' • '}
                        {scan.disease && `${t('detect.disease')}: ${scan.disease}`}
                      </p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                    {format(scan.scanDate, 'MMM d, HH:mm')}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Dashboard;
