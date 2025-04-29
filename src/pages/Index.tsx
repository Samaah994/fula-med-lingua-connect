
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
          <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            <LanguageSwitcher />
            {!user ? (
              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/signup')}>
                  Sign Up
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate('/dashboard')}>
                Dashboard
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
            <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Breaking Language Barriers in Healthcare
                </h1>
                <p className="max-w-[600px] text-base sm:text-lg text-muted-foreground md:text-xl">
                  Empowering medical communication between healthcare providers and patients through seamless translation in English, French, and Fulfulde.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {!user ? (
                  <>
                    <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/signup')}>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Get Started
                    </Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
                      <LogIn className="mr-2 h-5 w-5" />
                      Login
                    </Button>
                  </>
                ) : (
                  <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/dashboard')}>
                    Go To Dashboard
                  </Button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center mt-8 lg:mt-0">
              <div className="relative w-full max-w-lg">
                <div className="absolute -right-4 top-4 h-72 w-72 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -left-4 bottom-4 h-72 w-72 rounded-full bg-secondary/10 blur-2xl" />
                <div className="relative rounded-2xl border bg-card p-6 sm:p-8 shadow">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl sm:text-2xl font-bold">Featured Features</h3>
                      <p className="text-muted-foreground">
                        Explore Our Services
                      </p>
                    </div>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 p-2 flex-shrink-0">
                          <MessageSquare className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">Real-Time Translation</h4>
                          <p className="text-sm text-muted-foreground">
                            Instant translation between languages during consultations
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 p-2 flex-shrink-0">
                          <Volume2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-medium">Voice Support</h4>
                          <p className="text-sm text-muted-foreground">
                            Speak naturally and get instant translations
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

      <section className="w-full py-8 sm:py-12 bg-accent/10">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Our Core Features</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureItem 
              title="Medical Translation"
              description="Accurate translations of medical terminology and conversations between patients and healthcare providers"
            />
            <FeatureItem 
              title="Voice & Text Support"
              description="Support for both voice and text-based communication to accommodate different preferences"
            />
            <FeatureItem 
              title="Patient-Doctor Connection"
              description="Secure platform for seamless communication between patients and healthcare providers"
            />
          </div>
        </div>
      </section>

      <footer className="border-t py-6 md:py-0 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            &copy; 2025 FulaMed. All Rights Reserved
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
