
import React, { ReactNode, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, FileText, User, LogOut, MessageSquare, Calendar, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

// Memoized navigation item to prevent re-renders
const NavItem = memo(({ icon: Icon, label, path, onClick }: { 
  icon: React.ElementType, 
  label: string, 
  path: string, 
  onClick: () => void 
}) => (
  <li>
    <Button
      variant="ghost"
      className="w-full justify-start md:px-3 md:py-2 lg:px-4 lg:py-2"
      onClick={onClick}
    >
      <Icon className="h-5 w-5 shrink-0 mr-0 md:mr-0 lg:mr-2" />
      <span className="lg:inline hidden">{label}</span>
    </Button>
  </li>
));

NavItem.displayName = "NavItem";

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { t } = useLanguage();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-accent/30 flex flex-col">
      {/* Simplified header */}
      <header className="bg-white shadow-sm p-4 z-20 relative">
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
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Mobile menu overlay - simplified */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-10 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        
        {/* Simplified sidebar */}
        <aside className={cn(
          "bg-white w-64 shadow-sm flex flex-col fixed inset-y-0 pt-16 z-10 transition-transform",
          "md:static md:translate-x-0 md:pt-0 md:w-20 lg:w-64",
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
          <div className="p-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 shrink-0 mr-0 md:mr-0 lg:mr-2" />
              <span className="lg:inline hidden">{t('logout')}</span>
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 pt-4 md:ml-20 lg:ml-64">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
};

export default React.memo(DashboardLayout);
