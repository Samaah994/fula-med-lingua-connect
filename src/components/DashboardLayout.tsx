
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, FileText, User, LogOut, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { t } = useLanguage();
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: t('home'), path: '/dashboard' },
    { icon: User, label: t('profile'), path: '/profile' },
    { icon: FileText, label: t('medicalHistory'), path: '/medical-history' },
    { icon: MessageSquare, label: t('translate'), path: '/translate' },
  ];

  return (
    <div className="min-h-screen bg-accent/30 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center gap-4">
            {user && (
              <div className="text-sm">
                <span className="block font-medium">{user.name}</span>
                <span className="block text-muted-foreground text-xs">
                  {t(user.role)}
                </span>
              </div>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="bg-white w-20 md:w-64 shadow-sm flex flex-col">
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-5 w-5 mr-2" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span className="hidden md:inline">{t('logout')}</span>
            </Button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-6">{title}</h1>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
