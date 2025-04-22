
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
      {/* Header */}
      <header className="p-4 md:p-6 flex justify-between items-center">
        <Logo size="large" />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="flex-1 flex flex-col">
        <section className="py-8 md:py-16 px-4 md:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10">
              {/* Left side content */}
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
                  {t('welcomeToFulaMed')}
                </h1>
                <p className="text-lg text-gray-600 max-w-lg">
                  {t('landingPageDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
              
              {/* Right side image */}
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md h-80 md:h-96 bg-accent rounded-xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-primary/30 text-xl font-medium">
                    Medical Illustration
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 px-4 md:px-8 bg-gradient-to-b from-white to-accent/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
              {t('ourFeatures')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 bg-primary/5 text-center">
        <p className="text-gray-600">&copy; 2025 FulaMed. {t('allRightsReserved')}</p>
      </footer>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <div className="mt-4 flex justify-end">
        <Button variant="ghost" size="sm" className="text-primary font-medium">
          {t('learnMore')} <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default Index;
