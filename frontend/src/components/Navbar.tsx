import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Scan, 
  History, 
  FileBarChart, 
  HelpCircle, 
  User, 
  Menu, 
  X,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LanguageSelector from './LanguageSelector';
import NotificationBell from './NotificationBell';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/detect', label: t('nav.detect'), icon: Scan },
    { path: '/history', label: t('nav.history'), icon: History },
    { path: '/reports', label: t('nav.reports'), icon: FileBarChart },
    { path: '/help', label: t('nav.help'), icon: HelpCircle },
    { path: '/profile', label: t('nav.profile'), icon: User },
  ];

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-14 md:h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-lg md:rounded-xl bg-primary">
            <span className="text-base md:text-lg font-bold text-primary-foreground">🐄</span>
          </div>
          <span className="hidden font-display text-lg md:text-xl font-bold text-foreground sm:inline-block">
            CattleCare AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                  ${isActive(item.path) 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 md:gap-2">
          <NotificationBell />
          <LanguageSelector variant="minimal" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="hidden gap-2 md:flex"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden lg:inline">{t('nav.signOut')}</span>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-card p-4">
              <div className="flex flex-col gap-3 pt-6">
                {/* User info */}
                <div className="mb-2 rounded-xl bg-muted p-3">
                  <p className="font-semibold text-foreground text-sm">{user?.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                {/* Nav items - larger touch targets */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 rounded-xl px-4 py-3.5 text-base font-medium transition-colors
                        ${isActive(item.path) 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-foreground hover:bg-muted active:bg-muted'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <hr className="my-2 border-border" />

                <Button
                  variant="outline"
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full justify-start gap-3 h-12"
                >
                  <LogOut className="h-5 w-5" />
                  {t('nav.signOut')}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
