import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scan, 
  Stethoscope, 
  Wifi, 
  ChevronRight, 
  Play, 
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import LanguageSelector from '@/components/LanguageSelector';
import ParticleBackground from '@/components/ParticleBackground';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDemoLogin } from '@/contexts/AuthContext';

const Landing: React.FC = () => {
  const { t } = useLanguage();
  const demoLogin = useDemoLogin();
  const navigate = useNavigate();
  const [videoOpen, setVideoOpen] = useState(false);

  const handleTryDemo = async () => {
    await demoLogin();
    navigate('/dashboard');
  };

  const features = [
    {
      icon: Scan,
      title: t('landing.breedDetection'),
      description: t('landing.breedDesc'),
      gradient: 'from-primary to-emerald-400',
      delay: '0s',
    },
    {
      icon: Stethoscope,
      title: t('landing.diseaseDetection'),
      description: t('landing.diseaseDesc'),
      gradient: 'from-secondary to-cyan-400',
      delay: '0.1s',
    },
    {
      icon: Wifi,
      title: t('landing.offlineCapable'),
      description: t('landing.offlineDesc'),
      gradient: 'from-purple-500 to-pink-500',
      delay: '0.2s',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Track health trends and generate detailed reports',
      gradient: 'from-accent to-orange-400',
      delay: '0.3s',
    },
  ];

  const stats = [
    { value: '99%', label: 'Accuracy Rate' },
    { value: '50+', label: 'Breeds Detected' },
    { value: '20+', label: 'Disease Types' },
    { value: '<2s', label: 'Scan Time' },
  ];

  return (
    <div className="min-h-screen aurora-hero relative overflow-hidden">
      {/* Particle effect - fewer on mobile */}
      <ParticleBackground count={15} />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20 md:opacity-30" />

      {/* Header - mobile optimized */}
      <header className="container relative z-10 flex items-center justify-between py-4 md:py-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-primary rounded-xl blur-lg opacity-50" />
            <div className="relative flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-400 shadow-lg">
              <span className="text-xl md:text-2xl">🐄</span>
            </div>
          </div>
          <span className="font-display text-lg md:text-2xl font-bold text-foreground">
            {t('landing.title')}
          </span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSelector />
          <Link to="/signin">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              {t('landing.signIn')}
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="btn-glow text-primary-foreground text-xs md:text-sm px-3 md:px-4">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section - mobile optimized */}
      <section className="container relative z-10 py-8 px-4 md:py-24 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-fade-in mb-4 md:mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-primary backdrop-blur-sm">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
            AI-Powered Cattle Healthcare
          </div>

          {/* Main heading - responsive sizes */}
          <h1 className="animate-slide-up font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-7xl">
            <span className="text-foreground">Smart </span>
            <span className="gradient-text">Cattle Health</span>
            <br />
            <span className="text-foreground">& Breed Detection</span>
          </h1>
          
          <p className="animate-slide-up delay-100 mx-auto mt-4 md:mt-6 max-w-2xl text-base md:text-lg lg:text-xl text-muted-foreground px-2">
            {t('landing.description')}
          </p>
          
          {/* CTA Buttons - larger touch targets on mobile */}
          <div className="animate-slide-up delay-200 mt-6 md:mt-10 flex flex-col items-center gap-3 md:gap-4 px-4 sm:flex-row sm:justify-center sm:px-0">
            <Button 
              size="lg" 
              className="btn-glow group w-full sm:w-auto text-primary-foreground h-14 md:h-12 text-base md:text-sm"
              onClick={handleTryDemo}
            >
              <Zap className="mr-2 h-5 w-5" />
              Start Scanning
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="group w-full sm:w-auto glass border-white/20 h-14 md:h-12 text-base md:text-sm"
                >
                  <div className="relative mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
                    <Play className="h-4 w-4 text-primary" />
                    <div className="absolute inset-0 rounded-full bg-primary/30 pulse-ring" />
                  </div>
                  Watch Demo
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card max-w-[95vw] md:max-w-3xl p-0 overflow-hidden mx-2">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Play className="mx-auto h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-sm md:text-base">Demo video placeholder</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats - mobile grid */}
          <div className="animate-slide-up delay-300 mt-8 md:mt-16 grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4 px-2 md:px-0">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="glass-card p-3 md:p-6 text-center"
              >
                <div className="text-2xl md:text-4xl font-display font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs md:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Preview Section - mobile optimized */}
      <section className="container relative z-10 py-6 md:py-12 px-4 md:px-6">
        <div className="animate-slide-up mx-auto max-w-4xl">
          <div className="glass-card p-2">
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] md:aspect-video bg-gradient-to-br from-card to-muted">
              {/* Mock scan interface */}
              <div className="absolute inset-0 grid-pattern opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {/* Animated scanner - smaller on mobile */}
                  <div className="relative inline-flex">
                    <div className="relative h-20 w-20 md:h-32 md:w-32 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-4xl md:text-6xl">🐄</span>
                      <div className="absolute inset-0 rounded-2xl">
                        <div className="scan-line" />
                      </div>
                    </div>
                    {/* Orbiting dots - smaller on mobile */}
                    <div className="absolute -inset-4 md:-inset-8 animate-spin-slow">
                      <div className="absolute top-0 left-1/2 h-2 w-2 md:h-3 md:w-3 -translate-x-1/2 rounded-full bg-primary glow-primary" />
                    </div>
                    <div className="absolute -inset-8 md:-inset-12 animate-spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
                      <div className="absolute top-0 left-1/2 h-1.5 w-1.5 md:h-2 md:w-2 -translate-x-1/2 rounded-full bg-secondary" />
                    </div>
                  </div>
                  <div className="mt-4 md:mt-8 space-y-1 md:space-y-2 px-4">
                    <p className="text-sm md:text-lg font-semibold text-foreground">Live AI Detection Preview</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Upload an image to start scanning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - mobile optimized */}
      <section className="container relative z-10 py-10 md:py-24 px-4 md:px-6">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-4xl">
            {t('landing.features')}
          </h2>
          <p className="mt-2 md:mt-4 text-sm md:text-base text-muted-foreground">
            Everything you need for smart cattle healthcare
          </p>
        </div>
        
        <div className="grid gap-3 md:gap-6 grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="animate-slide-up glass-card-hover p-4 md:p-6"
                style={{ animationDelay: feature.delay }}
              >
                <div className={`mb-3 md:mb-4 inline-flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}>
                  <Icon className="h-5 w-5 md:h-7 md:w-7" />
                </div>
                <h3 className="mb-1 md:mb-2 font-display text-sm md:text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-base text-muted-foreground line-clamp-3">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works - mobile optimized */}
      <section className="container relative z-10 py-10 md:py-24 px-4 md:px-6">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="font-display text-2xl font-bold text-foreground md:text-4xl">
            How It Works
          </h2>
        </div>
        
        <div className="mx-auto max-w-3xl">
          <div className="glass-card p-4 md:p-12">
            <div className="flex flex-row items-center justify-between gap-2 md:gap-8">
              {[
                { emoji: '📷', label: 'Upload', step: '01' },
                { emoji: '🤖', label: 'Analyze', step: '02' },
                { emoji: '📊', label: 'Results', step: '03' },
              ].map((item, index) => (
                <React.Fragment key={index}>
                  <div className="text-center group flex-1">
                    <div className="relative inline-flex">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative flex h-14 w-14 md:h-24 md:w-24 items-center justify-center rounded-full glass border-2 border-primary/20 text-2xl md:text-5xl group-hover:border-primary/50 transition-colors">
                        {item.emoji}
                      </div>
                      <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 flex h-5 w-5 md:h-8 md:w-8 items-center justify-center rounded-full bg-primary text-[10px] md:text-xs font-bold text-primary-foreground">
                        {item.step}
                      </div>
                    </div>
                    <p className="mt-2 md:mt-4 text-xs md:text-base font-semibold text-foreground">{item.label}</p>
                  </div>
                  {index < 2 && (
                    <div className="flex items-center shrink-0">
                      <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - mobile optimized */}
      <section className="container relative z-10 py-10 md:py-16 px-4 md:px-6">
        <div className="glass-card p-6 md:p-12 text-center gradient-border">
          <h2 className="font-display text-xl md:text-4xl font-bold text-foreground mb-2 md:mb-4">
            Ready to Transform Cattle Care?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto">
            Join thousands of farmers using AI-powered health detection
          </p>
          <div className="flex flex-col gap-3 md:gap-4 sm:flex-row sm:justify-center">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="btn-glow w-full text-primary-foreground h-12 md:h-11">
                {t('landing.createAccount')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto glass border-white/20 h-12 md:h-11"
              onClick={handleTryDemo}
            >
              {t('landing.tryDemo')}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer - mobile optimized */}
      <footer className="relative z-10 border-t border-white/10 mt-8 md:mt-16">
        <div className="container py-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:gap-6 md:flex-row">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-emerald-400">
                <span className="text-base md:text-xl">🐄</span>
              </div>
              <span className="font-display text-base md:text-xl font-bold text-foreground">CattleCare AI</span>
            </div>
            
            <div className="flex items-center gap-4 md:gap-8 text-sm md:text-base">
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                {t('landing.footer.contact')}
              </Link>
              <Link to="/help" className="text-muted-foreground hover:text-primary transition-colors">
                Help
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 -m-2">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 -m-2">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors p-2 -m-2">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/10 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">
              {t('landing.footer.version')} • Built with AI for farmers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
