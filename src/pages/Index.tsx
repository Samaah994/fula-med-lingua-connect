
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/5 to-background">
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
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  FulaMed: Breaking Language Barriers in Healthcare
                </h1>
                <p className="text-lg text-gray-700 max-w-lg leading-relaxed">
                  Connect patients and healthcare providers across language divides. Medical translations made simple.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button 
                    size="lg" 
                    className="text-base gap-2 h-12 px-6" 
                    onClick={handleLoginClick}
                  >
                    <LogIn className="w-5 h-5" />
                    {t('login')}
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-base gap-2 h-12 px-6" 
                    onClick={handleSignupClick}
                  >
                    <UserPlus className="w-5 h-5" />
                    {t('signup')}
                  </Button>
                </div>
              </div>
              
              {/* Right side image */}
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-primary/80 text-xl font-medium p-8 text-center">
                      Medical Translation Made Simple
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12 px-4 md:px-8 bg-gradient-to-b from-background to-accent/10">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
              Key Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                title="Medical Translation" 
                description="Accurate translation of medical terms and conversations between healthcare providers and patients." 
              />
              <FeatureCard 
                title="Voice & Text Support" 
                description="Communicate through both text and voice inputs for natural conversations." 
              />
              <FeatureCard 
                title="Patient-Doctor Connect" 
                description="Easily schedule appointments and maintain communication with healthcare providers." 
              />
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 bg-accent/5">
        <p className="text-center text-gray-600">&copy; 2025 FulaMed. {t('allRightsReserved')}</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      <Button variant="ghost" size="sm" className="text-primary font-medium">
        {t('learnMore')} <ArrowRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
};

export default Index;
