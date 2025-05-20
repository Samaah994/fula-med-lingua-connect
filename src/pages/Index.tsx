
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
import { motion } from 'framer-motion';

const FeatureItem = memo(({ title, description, index }: { title: string; description: string; index: number }) => {
  const { t } = useLanguage();
  return (
    <motion.div 
      className="bg-background/70 dark:bg-background/40 p-5 rounded-lg shadow-sm border border-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 * index, duration: 0.5 }}
    >
      <h3 className="text-lg font-medium mb-2">{t(title)}</h3>
      <p className="text-muted-foreground">{t(description)}</p>
    </motion.div>
  );
});

FeatureItem.displayName = 'FeatureItem';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-accent to-white">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-accent to-white text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <Logo />
          <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
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
                {t('home')}
              </Button>
            )}
            {!user && (
              <div className="sm:hidden">
                <Button size="sm" variant="ghost" onClick={() => navigate('/login')}>
                  <LogIn className="h-5 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="relative">
        <div className="container px-4 py-8 sm:py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
            <motion.div 
              className="flex flex-col justify-center space-y-6 sm:space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <motion.h1 
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {t('breakingLanguageBarriers')}
                </motion.h1>
                <motion.p 
                  className="max-w-[600px] text-base sm:text-lg text-muted-foreground md:text-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {t('empoweringMedicalCommunication')}
                </motion.p>
              </div>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {!user ? (
                  <>
                    <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/signup')}>
                      <UserPlus className="mr-2 h-5 w-5" />
                      {t('getStarted')}
                    </Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
                      <LogIn className="mr-2 h-5 w-5" />
                      {t('login')}
                    </Button>
                  </>
                ) : (
                  <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/dashboard')}>
                    {t('goToDashboard')}
                  </Button>
                )}
              </motion.div>
            </motion.div>
            <motion.div 
              className="flex items-center justify-center mt-8 lg:mt-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="relative w-full max-w-lg">
                <div className="absolute -right-4 top-4 h-72 w-72 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -left-4 bottom-4 h-72 w-72 rounded-full bg-secondary/10 blur-2xl" />
                <div className="relative rounded-2xl border bg-card p-6 sm:p-8 shadow">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold">{t('featuredFeatures')}</h3>
                      <p className="text-muted-foreground">
                        {t('exploreOurServices')}
                      </p>
                    </div>
                    <div className="grid gap-4">
                      <motion.div 
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 p-2 flex-shrink-0">
                          <MessageSquare className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">{t('realTimeTranslation')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('instantTranslation')}
                          </p>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <div className="h-10 w-10 rounded-lg bg-primary/10 p-2 flex-shrink-0">
                          <Volume2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">{t('voiceSupport')}</h4>
                          <p className="text-sm text-muted-foreground">
                            {t('speakNaturallyGetTranslations')}
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full py-8 sm:py-12 bg-accent/10">
        <div className="container px-4 md:px-6">
          <motion.h2 
            className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('ourCoreFeatures')}
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureItem 
              title="medicalTranslation"
              description="medicalTranslationDescription"
              index={1}
            />
            <FeatureItem 
              title="voiceTextSupport"
              description="voiceTextSupportDescription"
              index={2}
            />
            <FeatureItem 
              title="patientDoctorConnection"
              description="patientDoctorConnectionDescription"
              index={3}
            />
          </div>
        </div>
      </section>

      <footer className="border-t py-6 md:py-0 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; 2025 FulaMed. {t('allRightsReserved')}
          </p>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
