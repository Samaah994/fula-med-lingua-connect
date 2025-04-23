
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { useState, lazy, Suspense } from "react";

// Eagerly load the index page for immediate display
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
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
  </div>
);

// Protected route component with improved performance
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return <PageLoader />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  // Create QueryClient with aggressive performance settings
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 120000, // 2 minutes
        gcTime: 300000, // 5 minutes
        retry: 0, // No retries for faster failure
        refetchOnWindowFocus: false,
        refetchOnMount: false, // Prevent refetching when components mount
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <UserProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/medical-history" element={
                    <ProtectedRoute>
                      <MedicalHistoryPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/translate" element={
                    <ProtectedRoute>
                      <TranslatePage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/appointments" element={
                    <ProtectedRoute>
                      <AppointmentsPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
              <Sonner />
            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
