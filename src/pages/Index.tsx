import { useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Loader2, LogIn, UserPlus, MessageSquare, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';

const FeatureItem = memo(({ title, description }: { title: string; description: string }) => (
  <div className="bg-background/70 dark:bg-background/40 p-5 rounded-lg shadow-sm border border-border">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
));

FeatureItem.displayName = 'FeatureItem';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <Logo />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
            {!user ? (
              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  {t('login')}
                </Button>
                <Button onClick={() => navigate('/signup')}>
                  {t('signup')}
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/dashboard')}>
                {t('dashboard')}
              </Button>
            )}
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="container px-4 py-12 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Breaking Language Barriers in Healthcare
                </h1>
                <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                  Empowering medical communication between healthcare providers and patients through seamless translation in English, French, and Fulfulde.
                </p>
              </div>
              {!user ? (
                <>
                  <Button size="lg" onClick={() => navigate('/signup')}>
                    <UserPlus className="mr-2 h-5 w-5" />
                    {t('getStarted')}
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                    <LogIn className="mr-2 h-5 w-5" />
                    {t('login')}
                  </Button>
                </>
              ) : (
                <Button size="lg" onClick={() => navigate('/dashboard')}>
                  {t('goToDashboard')}
                </Button>
              )}
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -right-4 top-4 h-72 w-72 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -left-4 bottom-4 h-72 w-72 rounded-full bg-secondary/10 blur-2xl" />
                <div className="relative rounded-2xl border bg-card p-8 shadow">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">{t('featuredFeatures')}</h3>
                      <p className="text-muted-foreground">
                        {t('exploreOurServices')}
                      </p>
                    </div>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 p-2">
                          <MessageSquare className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">{t('realTimeTranslation')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('instantTranslationDesc')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 p-2">
                          <Volume2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">{t('voiceSupport')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('voiceSupportDesc')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 bg-accent/10">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Our Core Features</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <FeatureItem 
              title="Medical Translation"
              description="Accurate, real-time translation of medical terms and conversations between English, French, and Fulfulde."
            />
            <FeatureItem 
              title="Voice & Text Support"
              description="Seamless communication through both voice and text translation, making healthcare more accessible."
            />
            <FeatureItem 
              title="Patient-Doctor Connection"
              description="Bridge the communication gap between healthcare providers and patients for better care outcomes."
            />
          </div>
        </div>
      </section>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; 2025 FulaMed. {t('allRightsReserved')}
          </p>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <ThemeToggle />
            </Button>
            <LanguageSwitcher />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
