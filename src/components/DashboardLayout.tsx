import React, { ReactNode, useState, memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, FileText, User, LogOut, MessageSquare, Calendar, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const NavItem = memo(({ icon: Icon, label, path, onClick }: { 
  icon: React.ElementType, 
  label: string, 
  path: string, 
  onClick: () => void 
}) => (
  <li>
    <Button
      variant="ghost"
      className="w-full justify-start px-3 py-2"
      onClick={onClick}
    >
      <Icon className="h-5 w-5 shrink-0 mr-2" />
      <span className="block">{label}</span>
    </Button>
  </li>
));

NavItem.displayName = "NavItem";

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Force ready state for development purposes
  useEffect(() => {
    console.log("DashboardLayout mount, user:", user);
    const timer = setTimeout(() => {
      setIsReady(true);
      console.log("Dashboard ready state forced");
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Also set ready when we have a user
  useEffect(() => {
    if (user) {
      setIsReady(true);
      console.log("Dashboard ready from user:", user);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: t('home'), path: '/dashboard' },
    { icon: User, label: t('profile'), path: '/profile' },
    { icon: FileText, label: t('medicalHistory'), path: '/medical-history' },
    { icon: MessageSquare, label: t('translate'), path: '/translate' },
    { icon: Calendar, label: t('appointments'), path: '/appointments' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 flex flex-col transition-colors duration-300">
      {/* Simplified header */}
      <header className="bg-background dark:bg-gray-800 shadow-sm p-4 z-20 relative transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 md:hidden" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Logo />
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 dark:bg-black/50 z-10 md:hidden transition-colors duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        <aside className={cn(
          "bg-card dark:bg-gray-800 w-64 shadow-sm flex flex-col fixed inset-y-0 pt-16 z-10 transition-all duration-300",
          "md:static md:translate-x-0 md:pt-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <NavItem 
                  key={item.path} 
                  icon={item.icon} 
                  label={item.label} 
                  path={item.path} 
                  onClick={() => handleNavigation(item.path)} 
                />
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t dark:border-gray-700 transition-colors duration-300">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 shrink-0 mr-2" />
              <span>{t('logout')}</span>
            </Button>
          </div>
        </aside>

        <main className="flex-1 p-4 pt-4 md:ml-64 transition-all duration-300">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default React.memo(DashboardLayout);
