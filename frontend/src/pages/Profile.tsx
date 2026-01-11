import React from 'react';
import { User, Globe, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Layout from '@/components/Layout';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { signOut(); navigate('/'); };

  return (
    <Layout>
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">{t('profile.title')}</h1>
      <div className="mx-auto max-w-md space-y-6">
        <Card className="border-0 shadow-card">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-3"><User className="h-5 w-5 text-primary" /><span className="font-medium">{t('profile.userInfo')}</span></div>
            <p className="text-lg font-semibold">{user?.fullName}</p>
            <p className="text-muted-foreground">{user?.email}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-card">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3"><Globe className="h-5 w-5 text-primary" /><span className="font-medium">{t('profile.language')}</span></div>
            <LanguageSelector />
          </CardContent>
        </Card>
        <Button variant="destructive" className="w-full" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />{t('profile.logout')}</Button>
      </div>
    </Layout>
  );
};

export default Profile;
