
import { useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

// Simpler feature description component without unnecessary reactivity
const FeatureItem = memo(({ title, description }: { title: string; description: string }) => (
  <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
));

FeatureItem.displayName = 'FeatureItem';

// Optimized main Index component with reduced rendering complexity
const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [navigate, user, isLoading]);

  const handleLoginClick = useCallback(() => navigate('/login'), [navigate]);
  const handleSignupClick = useCallback(() => navigate('/signup'), [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Simplified header */}
      <header className="p-4 flex justify-between items-center">
        <Logo size="medium" />
        <LanguageSwitcher />
      </header>
      
      {/* Simplified hero section */}
      <main className="flex-1">
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left content */}
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-3xl font-bold">
                  FulaMed: Medical Translation Made Simple
                </h1>
                <p className="text-gray-700">
                  Connect patients and healthcare providers across language divides.
                </p>
                <div className="flex gap-4">
                  <Button onClick={handleLoginClick}>
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('login')}
                  </Button>
                  <Button variant="outline" onClick={handleSignupClick}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t('signup')}
                  </Button>
                </div>
              </div>
              
              {/* Right image - ultra simplified */}
              <div className="md:w-1/2">
                <div className="bg-primary/10 rounded-xl p-8 text-center">
                  Medical Translation Made Simple
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Simplified features section */}
        <section className="py-8 px-4 bg-accent/10">
          <div className="container mx-auto">
            <h2 className="text-xl font-bold text-center mb-6">
              Key Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FeatureItem 
                title="Medical Translation" 
                description="Accurate translation of medical terms between patients and providers." 
              />
              <FeatureItem 
                title="Voice & Text Support" 
                description="Communicate through text and voice for natural conversations." 
              />
              <FeatureItem 
                title="Patient-Doctor Connect" 
                description="Schedule appointments and maintain communication easily." 
              />
            </div>
          </div>
        </section>
      </main>
      
      {/* Minimal footer */}
      <footer className="py-4 text-center text-gray-600">
        &copy; 2025 FulaMed. {t('allRightsReserved')}
      </footer>
    </div>
  );
};

export default Index;
