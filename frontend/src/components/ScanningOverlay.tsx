import React from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface ScanStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

interface ScanningOverlayProps {
  steps: ScanStep[];
  currentStep: number;
}

const ScanningOverlay: React.FC<ScanningOverlayProps> = ({ steps, currentStep }) => {
  return (
    <div className="absolute inset-0 rounded-2xl overflow-hidden">
      {/* Scanning line animation */}
      <div className="scan-line" />
      
      {/* Dark overlay with holographic effect */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm holographic" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
        {/* Animated waveform */}
        <div className="waveform mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="waveform-bar" />
          ))}
        </div>
        
        {/* AI Processing text */}
        <h3 className="text-xl font-display font-bold text-foreground mb-6 text-glow">
          AI Processing...
        </h3>
        
        {/* Steps */}
        <div className="space-y-3 w-full max-w-xs">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
                step.status === 'complete'
                  ? 'glass border-primary/30'
                  : step.status === 'active'
                  ? 'glass border-primary/50 glow-primary'
                  : 'opacity-50'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                step.status === 'complete'
                  ? 'bg-primary text-primary-foreground'
                  : step.status === 'active'
                  ? 'bg-primary/20 border-2 border-primary'
                  : 'bg-muted border border-border'
              }`}>
                {step.status === 'complete' ? (
                  <CheckCircle2 className="w-5 h-5 animate-scale-in" />
                ) : step.status === 'active' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="text-xs font-semibold text-muted-foreground">{index + 1}</span>
                )}
              </div>
              <span className={`font-medium ${
                step.status === 'complete' ? 'text-primary' : 'text-foreground'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanningOverlay;
