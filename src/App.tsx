
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useState, lazy, Suspense } from "react";

// Eagerly load essential pages for immediate display
import WelcomePage from "./pages/WelcomePage";
import Index from "./pages/Index";

// Lazily load other pages for better initial load performance
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const MedicalHistoryPage = lazy(() => import("./pages/MedicalHistoryPage"));
const TranslatePage = lazy(() => import("./pages/TranslatePage"));
const AppointmentsPage = lazy(() => import("./pages/AppointmentsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Ultra-simplified loading fallback for faster rendering
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-accent to-white dark:from-accent/30 dark:to-background">
    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
  </div>
);

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 120000,
        gcTime: 300000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <UserProvider>
            <TooltipProvider>
              <BrowserRouter>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="/home" element={<Index />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    
                    {/* Authenticated routes */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/medical-history" element={<MedicalHistoryPage />} />
                    <Route path="/translate" element={<TranslatePage />} />
                    <Route path="/appointments" element={<AppointmentsPage />} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <Toaster />
                <Sonner />
              </BrowserRouter>
            </TooltipProvider>
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
