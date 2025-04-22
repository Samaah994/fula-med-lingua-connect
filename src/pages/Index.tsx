
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Loader2, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [navigate, user, isLoading]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">FulaMed</h1>
          <div className="mt-4 flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/10 to-white">
      <header className="p-4 flex justify-between items-center">
        <Logo size="large" />
        <LanguageSwitcher />
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            {t('welcomeToFulaMed')}
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            {t('landingPageDescription')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="gap-2" 
              onClick={handleLoginClick}
            >
              <LogIn size={20} />
              {t('login')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2" 
              onClick={handleSignupClick}
            >
              <UserPlus size={20} />
              {t('signup')}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <FeatureCard 
            title={t('featureTranslateTitle')} 
            description={t('featureTranslateDesc')} 
          />
          <FeatureCard 
            title={t('featureMedicalTitle')} 
            description={t('featureMedicalDesc')} 
          />
          <FeatureCard 
            title={t('featureConnectTitle')} 
            description={t('featureConnectDesc')} 
          />
        </div>
      </main>
      
      <footer className="p-6 bg-primary/5 text-center">
        <p className="text-gray-600">&copy; 2025 FulaMed. {t('allRightsReserved')}</p>
      </footer>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
    <h3 className="text-xl font-semibold text-primary mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
    <div className="mt-4 flex justify-end">
      <Button variant="ghost" size="sm" className="text-primary">
        {t('learnMore')} <ArrowRight size={16} className="ml-1" />
      </Button>
    </div>
  </div>
);

export default Index;
