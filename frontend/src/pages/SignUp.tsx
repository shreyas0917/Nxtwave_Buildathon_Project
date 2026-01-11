import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SignUp: React.FC = () => {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: t('common.error'),
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: t('common.error'),
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await signUp(fullName, email, password);
      if (success) {
        toast({
          title: t('common.success'),
          description: 'Account created successfully!',
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: t('common.error'),
        description: 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 gradient-hero">
      {/* Language selector */}
      <div className="absolute right-4 top-4">
        <LanguageSelector />
      </div>

      {/* Logo */}
      <Link to="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-button">
          <span className="text-2xl">🐄</span>
        </div>
        <span className="font-display text-2xl font-bold text-foreground">
          CattleCare AI
        </span>
      </Link>

      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t('auth.signUp')}
          </h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('auth.fullName')}</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Ram Singh"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-12 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 text-base"
              />
            </div>

            <Button 
              type="submit" 
              className="btn-large w-full shadow-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('auth.signUp')
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-muted-foreground">
            {t('auth.hasAccount')}{' '}
            <Link to="/signin" className="font-semibold text-primary hover:underline">
              {t('auth.signInHere')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
