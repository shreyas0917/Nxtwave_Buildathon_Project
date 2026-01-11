import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, Eye, Scan, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScan } from '@/contexts/ScanContext';
import { format } from 'date-fns';

const History: React.FC = () => {
  const { t } = useLanguage();
  const { scans } = useScan();
  
  const [breedFilter, setBreedFilter] = useState<string>('all');
  const [diseaseFilter, setDiseaseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique breeds and diseases for filters
  const breeds = [...new Set(scans.filter(s => s.breed).map(s => s.breed))];
  const diseases = [...new Set(scans.filter(s => s.disease).map(s => s.disease))];

  // Filter scans
  const filteredScans = scans.filter(scan => {
    if (breedFilter !== 'all' && scan.breed !== breedFilter) return false;
    if (diseaseFilter !== 'all' && scan.disease !== diseaseFilter) return false;
    return true;
  });

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          {t('history.title')}
        </h1>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-0 shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ID, breed, or disease..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Filter className="h-5 w-5" />
                <span className="font-medium">Filters:</span>
              </div>
              
              <Select value={breedFilter} onValueChange={setBreedFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={t('history.filterByBreed')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('history.allBreeds')}</SelectItem>
                  {breeds.map(breed => (
                    <SelectItem key={breed} value={breed!}>{breed}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder={t('history.filterByDisease')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('history.allDiseases')}</SelectItem>
                  {diseases.map(disease => (
                    <SelectItem key={disease} value={disease!}>{disease}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scans List */}
      {filteredScans.length === 0 ? (
        <Card className="border-0 shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Scan className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              {t('history.noHistory')}
            </h3>
            <p className="mb-4 text-center text-muted-foreground">
              {t('history.noHistoryDesc')}
            </p>
            <Link to="/detect">
              <Button>Start Scanning</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredScans.map((scan, index) => (
            <Link 
              key={scan.id} 
              to={`/scan/${scan.id}`}
              className="block animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <Card className="border-0 shadow-card transition-all hover:shadow-lg hover:-translate-y-0.5">
                <CardContent className="flex items-center gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                    {scan.imageUrl && (
                      <img
                        src={scan.imageUrl}
                        alt="Scan"
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge 
                        variant={scan.isValid ? "default" : "destructive"}
                        className={scan.isValid ? "bg-success hover:bg-success" : ""}
                      >
                        {scan.isValid ? t('history.valid') : t('history.invalid')}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(scan.scanDate, 'MMM d, yyyy • HH:mm')}
                      </span>
                    </div>
                    
                    {scan.isValid ? (
                      <div className="flex flex-wrap gap-4 text-sm">
                        {scan.breed && (
                          <div className="flex items-center gap-1">
                            <Scan className="h-4 w-4 text-primary" />
                            <span className="font-medium">{scan.breed}</span>
                            <span className="text-muted-foreground">
                              ({scan.breedConfidence?.toFixed(0)}%)
                            </span>
                          </div>
                        )}
                        {scan.disease && (
                          <div className="flex items-center gap-1">
                            <AlertCircle className={`h-4 w-4 ${scan.disease === 'Healthy' ? 'text-success' : 'text-warning'}`} />
                            <span className="font-medium">{scan.disease}</span>
                            <span className="text-muted-foreground">
                              ({scan.diseaseConfidence?.toFixed(0)}%)
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No cattle detected in image
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Eye className="h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default History;
