import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { breedAPI, riskAPI } from '@/services/api';

export interface ScanResult {
  id: string;
  imageUrl: string;
  scanDate: Date;
  scanType: 'full' | 'breed' | 'disease';
  isValid: boolean;
  cattleDetected: boolean;
  breed?: string;
  breedConfidence?: number;
  disease?: string;
  diseaseConfidence?: number;
}

interface ScanContextType {
  scans: ScanResult[];
  addScan: (scan: ScanResult) => void;
  deleteScan: (id: string) => void;
  getScanById: (id: string) => ScanResult | undefined;
  totalScans: number;
  topBreed: string | null;
  topDisease: string | null;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

// Sample breeds and diseases for demo
const BREEDS = ['Gir', 'Sahiwal', 'Red Sindhi', 'Tharparkar', 'Kankrej', 'Ongole', 'Hariana', 'Deoni'];
const DISEASES = ['Healthy', 'Foot and Mouth Disease', 'Lumpy Skin Disease', 'Mastitis', 'Bloat', 'Ringworm'];

export const ScanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scans, setScans] = useState<ScanResult[]>(() => {
    const saved = localStorage.getItem('cattlecare-scans');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((scan: any) => ({
        ...scan,
        scanDate: new Date(scan.scanDate),
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cattlecare-scans', JSON.stringify(scans));
  }, [scans]);

  const addScan = (scan: ScanResult) => {
    setScans(prev => [scan, ...prev]);
  };

  const deleteScan = (id: string) => {
    setScans(prev => prev.filter(scan => scan.id !== id));
  };

  const getScanById = (id: string) => {
    return scans.find(scan => scan.id === id);
  };

  const getTopItem = (items: (string | undefined)[]): string | null => {
    const filtered = items.filter(Boolean) as string[];
    if (filtered.length === 0) return null;
    
    const counts: Record<string, number> = {};
    filtered.forEach(item => {
      counts[item] = (counts[item] || 0) + 1;
    });
    
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  };

  const validScans = scans.filter(s => s.isValid);
  const topBreed = getTopItem(validScans.map(s => s.breed));
  const topDisease = getTopItem(validScans.filter(s => s.disease !== 'Healthy').map(s => s.disease));

  return (
    <ScanContext.Provider value={{
      scans,
      addScan,
      deleteScan,
      getScanById,
      totalScans: scans.length,
      topBreed,
      topDisease,
    }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const context = useContext(ScanContext);
  if (!context) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};

// Real AI detection using backend API
export const simulateDetection = async (
  imageUrl: string,
  scanType: 'full' | 'breed' | 'disease'
): Promise<ScanResult> => {
  try {
    // Convert base64 image URL to base64 string
    const imageBase64 = imageUrl.includes(',') ? imageUrl : `data:image/jpeg;base64,${imageUrl}`;
    
    let breedResult: any = null;
    let riskResult: any = null;
    
    // Call breed API if not disease-only scan
    if (scanType !== 'disease') {
      try {
        breedResult = await breedAPI.predictBreed(imageBase64);
      } catch (error) {
        console.error('Breed API error:', error);
      }
    }
    
    // Call risk API for disease detection (if not breed-only scan)
    if (scanType !== 'breed') {
      try {
        riskResult = await riskAPI.assessRisk(imageBase64, breedResult?.breed);
      } catch (error) {
        console.error('Risk API error:', error);
      }
    }
    
    // Determine if cattle was detected (both APIs should work)
    const cattleDetected = breedResult || riskResult;
    
    if (!cattleDetected) {
      return {
        id: `scan-${Date.now()}`,
        imageUrl,
        scanDate: new Date(),
        scanType,
        isValid: false,
        cattleDetected: false,
      };
    }
    
    // Map risk level to disease
    const riskToDisease: Record<string, string> = {
      'Low': 'Healthy',
      'Medium': 'Low Risk Condition',
      'High': 'High Risk Condition',
    };
    
    const disease = riskResult ? riskToDisease[riskResult.risk_level] || 'Unknown' : 'Healthy';
    const diseaseConfidence = riskResult ? riskResult.confidence * 100 : undefined;
    
    return {
      id: `scan-${Date.now()}`,
      imageUrl,
      scanDate: new Date(),
      scanType,
      isValid: true,
      cattleDetected: true,
      breed: breedResult?.breed,
      breedConfidence: breedResult ? breedResult.confidence * 100 : undefined,
      disease: scanType !== 'breed' ? disease : undefined,
      diseaseConfidence: scanType !== 'breed' ? diseaseConfidence : undefined,
    };
  } catch (error) {
    console.error('Detection error:', error);
    // Fallback to error state
    return {
      id: `scan-${Date.now()}`,
      imageUrl,
      scanDate: new Date(),
      scanType,
      isValid: false,
      cattleDetected: false,
    };
  }
};
