import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const ForgotPassword: React.FC = () => {
  const { t } = useLanguage();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await resetPassword(email);
      setIsSuccess(true);
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
            {t('auth.forgotTitle')}
          </h1>
          <p className="text-muted-foreground">
            {t('auth.forgotDesc')}
          </p>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center gap-4 py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <p className="text-center text-lg font-medium text-foreground">
                {t('auth.resetSent')}
              </p>
              <div className="flex items-center gap-2 rounded-xl bg-muted p-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{email}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  t('auth.sendResetLink')
                )}
              </Button>
            </form>
          )}

          <Link 
            to="/signin" 
            className="mt-6 flex items-center justify-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('auth.backToSignIn')}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
