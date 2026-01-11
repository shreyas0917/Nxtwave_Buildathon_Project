import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import LanguageSelector from '@/components/LanguageSelector';
import ParticleBackground from '@/components/ParticleBackground';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SignIn: React.FC = () => {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await signIn(email, password, rememberMe);
      if (success) {
        toast({
          title: t('common.success'),
          description: 'Welcome back!',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to sign in. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen aurora-bg relative overflow-hidden">
      {/* Particle effect */}
      <ParticleBackground count={20} />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Language selector */}
      <div className="absolute right-4 top-4 z-20">
        <LanguageSelector />
      </div>

      {/* Left side - Animated illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="relative">
          {/* Glowing orbs */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-secondary/20 rounded-full blur-3xl animate-pulse-soft delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse-soft delay-1000" />
          
          {/* Main illustration container */}
          <div className="relative glass-card p-12 animate-float">
            {/* Animated cattle silhouette */}
            <div className="relative">
              <div className="text-[120px] leading-none filter drop-shadow-lg">🐄</div>
              {/* Scanning effect */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <div className="scan-line" />
              </div>
            </div>
            
            {/* AI indicators */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="waveform">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="waveform-bar" />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">AI Ready</span>
            </div>
          </div>
          
          {/* Floating badges */}
          <div className="absolute -top-4 -right-4 glass px-4 py-2 rounded-full animate-bounce-slow">
            <span className="text-sm font-semibold text-primary">99% Accuracy</span>
          </div>
          <div className="absolute -bottom-4 -left-4 glass px-4 py-2 rounded-full animate-bounce-slow delay-500">
            <span className="text-sm font-semibold text-secondary">Offline Ready</span>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="mb-8 flex items-center justify-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-400 shadow-lg">
                <span className="text-3xl">🐄</span>
              </div>
            </div>
            <span className="font-display text-3xl font-bold text-foreground">
              CattleCare AI
            </span>
          </Link>

          {/* Form card */}
          <div className="glass-card p-8 animate-scale-in">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground">
                {t('auth.signIn')}
              </h1>
              <p className="mt-2 text-muted-foreground">{t('auth.selectLanguage')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-base bg-muted/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">{t('auth.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pr-12 text-base bg-muted/50 border-white/10 focus:border-primary/50 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-white/20"
                  />
                  <Label htmlFor="remember" className="text-sm cursor-pointer text-muted-foreground">
                    {t('auth.rememberMe')}
                  </Label>
                </div>
                <Link 
                  to="/forgot-password" 
                  className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              <Button 
                type="submit" 
                className="btn-glow w-full h-12 text-lg text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    {t('auth.signIn')}
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                {t('auth.noAccount')}{' '}
                <Link to="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                  {t('auth.createHere')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
