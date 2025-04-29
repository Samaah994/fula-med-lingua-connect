
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-accent to-white dark:from-accent/30 dark:to-background text-foreground">
      <header className="w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-4 sm:px-8">
          <Logo />
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {mounted && (
          <motion.div 
            className="max-w-3xl mx-auto space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Welcome To FulaMed
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
                {t('welcomeDescription')}
              </p>
            </motion.div>
            
            <motion.div 
              className="animate-bounce hidden sm:block"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <svg
                className="mx-auto h-12 w-12 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                className="text-xl py-6 px-8 w-full sm:w-auto" 
                onClick={() => navigate('/home')}
              >
                Get Started
              </Button>
            </motion.div>
          </motion.div>
        )}
      </main>

      <footer className="border-t py-4 sm:py-6 mt-auto">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16 px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; 2025 FulaMed. {t('allRightsReserved')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
