import React, { useMemo } from 'react';
import { FileBarChart, Download, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScan } from '@/contexts/ScanContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

const COLORS = ['hsl(142, 76%, 36%)', 'hsl(199, 89%, 48%)', 'hsl(280, 100%, 70%)', 'hsl(38, 92%, 50%)', 'hsl(0, 72%, 51%)', 'hsl(262, 83%, 58%)', 'hsl(173, 80%, 40%)', 'hsl(24, 95%, 53%)'];

const Reports: React.FC = () => {
  const { t } = useLanguage();
  const { scans, topBreed, topDisease } = useScan();
  const validScans = scans.filter(s => s.isValid);

  // Generate analytics data from scans
  const analyticsData = useMemo(() => {
    if (validScans.length === 0) {
      return {
        breedDistribution: [],
        diseaseDistribution: [],
        scansOverTime: [],
        scanTypeDistribution: [],
        averageConfidence: { breed: 0, disease: 0 },
        totalScans: 0,
        healthyCount: 0,
        unhealthyCount: 0,
      };
    }

    // Breed distribution
    const breedCounts: Record<string, number> = {};
    validScans.forEach(scan => {
      if (scan.breed) {
        breedCounts[scan.breed] = (breedCounts[scan.breed] || 0) + 1;
      }
    });
    const breedDistribution = Object.entries(breedCounts)
      .map(([breed, count]) => ({ name: breed, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // Disease distribution (excluding Healthy)
    const diseaseCounts: Record<string, number> = {};
    validScans.forEach(scan => {
      if (scan.disease && scan.disease !== 'Healthy') {
        diseaseCounts[scan.disease] = (diseaseCounts[scan.disease] || 0) + 1;
      }
    });
    const diseaseDistribution = Object.entries(diseaseCounts)
      .map(([disease, count]) => ({ name: disease, value: count }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Scans over time (last 30 days)
    const today = startOfDay(new Date());
    const daysData: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      daysData[format(date, 'MMM dd')] = 0;
    }
    validScans.forEach(scan => {
      const dateKey = format(startOfDay(scan.scanDate), 'MMM dd');
      if (daysData.hasOwnProperty(dateKey)) {
        daysData[dateKey] = (daysData[dateKey] || 0) + 1;
      }
    });
    const scansOverTime = Object.entries(daysData).map(([date, count]) => ({
      date,
      scans: count,
    }));

    // Scan type distribution
    const typeCounts: Record<string, number> = {};
    validScans.forEach(scan => {
      typeCounts[scan.scanType] = (typeCounts[scan.scanType] || 0) + 1;
    });
    const scanTypeDistribution = Object.entries(typeCounts).map(([type, count]) => ({
      name: type === 'full' ? 'Full Scan' : type === 'breed' ? 'Breed Only' : 'Disease Only',
      value: count,
    }));

    // Average confidence
    const breedConfidences = validScans
      .filter(s => s.breedConfidence !== undefined)
      .map(s => s.breedConfidence!);
    const diseaseConfidences = validScans
      .filter(s => s.diseaseConfidence !== undefined)
      .map(s => s.diseaseConfidence!);
    const averageBreedConfidence = breedConfidences.length > 0
      ? breedConfidences.reduce((a, b) => a + b, 0) / breedConfidences.length
      : 0;
    const averageDiseaseConfidence = diseaseConfidences.length > 0
      ? diseaseConfidences.reduce((a, b) => a + b, 0) / diseaseConfidences.length
      : 0;

    // Healthy vs Unhealthy
    const healthyCount = validScans.filter(s => s.disease === 'Healthy' || !s.disease).length;
    const unhealthyCount = validScans.length - healthyCount;

    return {
      breedDistribution,
      diseaseDistribution,
      scansOverTime,
      scanTypeDistribution,
      averageConfidence: {
        breed: averageBreedConfidence,
        disease: averageDiseaseConfidence,
      },
      totalScans: validScans.length,
      healthyCount,
      unhealthyCount,
    };
  }, [validScans]);

  const handleExportPDF = () => {
    // Generate PDF-like HTML content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CattleCare AI - Analytics Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
    h1 { color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px; }
    h2 { color: #0ea5e9; margin-top: 30px; }
    .summary { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
    .stat { background: #f3f4f6; padding: 15px; border-radius: 8px; }
    .stat-label { font-size: 14px; color: #666; }
    .stat-value { font-size: 24px; font-weight: bold; color: #333; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #16a34a; color: white; }
    .top-list { margin: 20px 0; }
    .top-item { padding: 10px; background: #f9fafb; margin: 5px 0; border-radius: 5px; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <h1>CattleCare AI - Analytics Report</h1>
  <p>Generated: ${new Date().toLocaleString()}</p>
  
  <h2>Summary Statistics</h2>
  <div class="summary">
    <div class="stat">
      <div class="stat-label">Total Scans</div>
      <div class="stat-value">${analyticsData.totalScans}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Healthy Cattle</div>
      <div class="stat-value">${analyticsData.healthyCount}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Average Breed Confidence</div>
      <div class="stat-value">${analyticsData.averageConfidence.breed.toFixed(1)}%</div>
    </div>
    <div class="stat">
      <div class="stat-label">Average Disease Confidence</div>
      <div class="stat-value">${analyticsData.averageConfidence.disease.toFixed(1)}%</div>
    </div>
  </div>
  
  <h2>Top Breeds</h2>
  <div class="top-list">
    ${analyticsData.breedDistribution.slice(0, 5).map((breed, i) => 
      `<div class="top-item">${i + 1}. ${breed.name} - ${breed.value} scans</div>`
    ).join('')}
  </div>
  
  <h2>Top Diseases</h2>
  <div class="top-list">
    ${analyticsData.diseaseDistribution.length > 0 
      ? analyticsData.diseaseDistribution.slice(0, 5).map((disease, i) => 
          `<div class="top-item">${i + 1}. ${disease.name} - ${disease.value} cases</div>`
        ).join('')
      : '<div class="top-item">All scans show healthy cattle</div>'
    }
  </div>
  
  <h2>Scan Details</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Type</th>
        <th>Breed</th>
        <th>Breed Confidence</th>
        <th>Disease</th>
        <th>Disease Confidence</th>
      </tr>
    </thead>
    <tbody>
      ${validScans.slice(0, 20).map(scan => `
        <tr>
          <td>${format(scan.scanDate, 'MMM dd, yyyy HH:mm')}</td>
          <td>${scan.scanType}</td>
          <td>${scan.breed || 'N/A'}</td>
          <td>${scan.breedConfidence?.toFixed(1) || 'N/A'}%</td>
          <td>${scan.disease || 'N/A'}</td>
          <td>${scan.diseaseConfidence?.toFixed(1) || 'N/A'}%</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  
  <div class="footer">
    <p>This report was generated by CattleCare AI Analytics System</p>
    <p>Report ID: ${Date.now()}</p>
  </div>
</body>
</html>
    `.trim();

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cattlecare-report-${format(new Date(), 'yyyy-MM-dd')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    // Generate CSV
    const headers = ['Scan ID', 'Date', 'Type', 'Breed', 'Breed Confidence', 'Disease', 'Disease Confidence'];
    const rows = validScans.map(scan => [
      scan.id,
      format(scan.scanDate, 'yyyy-MM-dd HH:mm'),
      scan.scanType,
      scan.breed || 'N/A',
      scan.breedConfidence?.toFixed(1) + '%' || 'N/A',
      scan.disease || 'N/A',
      scan.diseaseConfidence?.toFixed(1) + '%' || 'N/A',
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cattlecare-reports-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="mb-6 md:mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-4xl">
            {t('reports.title')}
          </h1>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-muted-foreground">
            Analytics and insights from your cattle scans
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            {t('reports.exportPdf')}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            {t('reports.exportCsv')}
          </Button>
        </div>
      </div>

      {validScans.length < 3 ? (
        <Card className="border-0 shadow-card">
          <CardContent className="flex flex-col items-center py-16">
            <FileBarChart className="mb-4 h-16 w-16 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">{t('reports.noData')}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Scan at least 3 cattle images to view analytics
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('dashboard.totalScans')}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">{analyticsData.totalScans}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileBarChart className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Healthy Cattle</p>
                    <p className="mt-1 text-2xl font-bold text-success">{analyticsData.healthyCount}</p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Breed Confidence</p>
                    <p className="mt-1 text-2xl font-bold text-primary">
                      {analyticsData.averageConfidence.breed.toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Disease Confidence</p>
                    <p className="mt-1 text-2xl font-bold text-secondary">
                      {analyticsData.averageConfidence.disease.toFixed(1)}%
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scans Over Time Chart */}
          <Card className="border-0 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scans Over Time (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.scansOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="scans" 
                    stroke="hsl(142, 76%, 36%)" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(142, 76%, 36%)', r: 4 }}
                    name="Number of Scans"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Breed Distribution and Scan Types */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>{t('reports.topBreeds')}</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.breedDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.breedDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(142, 76%, 36%)" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No breed data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Scan Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.scanTypeDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analyticsData.scanTypeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData.scanTypeDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No scan type data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Disease Distribution and Health Status */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>{t('reports.topDiseases')}</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.diseaseDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analyticsData.diseaseDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(199, 89%, 48%)" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No disease data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Health Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Healthy', value: analyticsData.healthyCount },
                        { name: 'Unhealthy', value: analyticsData.unhealthyCount },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="hsl(142, 76%, 36%)" />
                      <Cell fill="hsl(0, 72%, 51%)" />
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Breeds and Diseases Summary */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>{t('reports.topBreeds')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.breedDistribution.slice(0, 5).map((breed, index) => (
                    <div key={breed.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <span className="font-medium">{breed.name}</span>
                      </div>
                      <span className="font-bold text-primary">{breed.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>{t('reports.topDiseases')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.diseaseDistribution.slice(0, 5).map((disease, index) => (
                    <div key={disease.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center text-sm font-bold text-secondary">
                          {index + 1}
                        </div>
                        <span className="font-medium">{disease.name}</span>
                      </div>
                      <span className="font-bold text-secondary">{disease.value}</span>
                    </div>
                  ))}
                  {analyticsData.diseaseDistribution.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      All scans show healthy cattle! 🎉
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Reports;
