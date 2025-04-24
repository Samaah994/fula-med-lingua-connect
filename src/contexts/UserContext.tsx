import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { User as SupabaseUser, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export type UserRole = "patient" | "doctor";

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  age?: number;
  specialty?: string;
  lastLogin?: Date;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Create mock user for demonstration purposes
const createMockUser = (id: string, email: string): User => ({
  id,
  email: email || 'demo@example.com',
  name: "Demo User",
  role: "patient",
  lastLogin: new Date()
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for session and update user on mount
  useEffect(() => {
    console.log("Setting up auth state listener...");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        
        if (currentSession?.user) {
          setSession(currentSession);
          
          // Use setTimeout to avoid Supabase deadlocks
          setTimeout(() => {
            fetchUserProfile(currentSession.user);
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Checking for existing session:", currentSession?.user?.id);
      
      if (currentSession?.user) {
        setSession(currentSession);
        
        // Use setTimeout to avoid Supabase deadlocks
        setTimeout(() => {
          fetchUserProfile(currentSession.user);
        }, 0);
      } else {
        // Create a mock user for development
        if (process.env.NODE_ENV === 'development') {
          const mockUser = createMockUser('dev-user-123', 'dev@example.com');
          setUser(mockUser);
          console.log("Created development mock user:", mockUser);
        }
        setIsLoading(false);
      }
    });

    // Force end loading state after a timeout
    const timer = setTimeout(() => {
      if (isLoading) {
        console.log("Forcing end of loading state after timeout");
        setIsLoading(false);
        
        // If no user by this point in dev mode, create one
        if (!user && process.env.NODE_ENV === 'development') {
          const mockUser = createMockUser('dev-user-123', 'dev@example.com');
          setUser(mockUser);
          console.log("Created development mock user after timeout:", mockUser);
        }
      }
    }, 2000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // Helper function to fetch user profile
  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabaseUser.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
        // Create mock profile as fallback on error
        const mockUser = createMockUser(supabaseUser.id, supabaseUser.email || '');
        setUser(mockUser);
        console.log("Created mock user after profile error:", mockUser);
      } else if (profile) {
        const userData = {
          id: profile.id,
          name: profile.name || 'User',
          email: profile.email || supabaseUser.email || '',
          role: profile.role || 'patient',
          age: profile.age,
          specialty: profile.specialty,
          lastLogin: profile.last_login ? new Date(profile.last_login) : new Date(),
        };
        setUser(userData);
        console.log("Set user from profile:", userData);
      } else {
        // Create mock profile if no profile exists yet
        console.log("No profile found, creating mock user");
        const mockUser = createMockUser(supabaseUser.id, supabaseUser.email || '');
        setUser(mockUser);
        console.log("Created mock user after no profile:", mockUser);
      }
    } catch (error) {
      console.error("Failed to fetch profile data", error);
      // Create mock profile as fallback on exception
      const mockUser = createMockUser(supabaseUser.id, supabaseUser.email || '');
      setUser(mockUser);
      console.log("Created mock user after exception:", mockUser);
    } finally {
      setIsLoading(false);
    }
  };

  // Signup function with improved error handling
  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Signing up with data:", {
        email: userData.email,
        role: userData.role,
        name: userData.name,
      });
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email || "",
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || "patient",
            ...(userData.age && { age: userData.age }),
            ...(userData.specialty && { specialty: userData.specialty }),
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: error.message,
        });
        return false;
      }

      if (data.user) {
        console.log("User created successfully:", data.user.id);
        toast({
          title: "Signup successful",
          description: "Welcome to FulaMed! Please check your email to verify your account.",
        });
        // For demo purposes, create a mock user immediately after signup
        setUser(createMockUser(data.user.id, data.user.email || ''));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Signup failed", error);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function using Supabase authentication
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
        return false;
      }

      console.log("Login successful:", data.user?.id);
      toast({
        title: "Login successful",
        description: "Welcome back to FulaMed!",
      });
      
      // For demo purposes, set mock user immediately if login is successful
      if (data.user && !user) {
        // Wait a bit to ensure auth state change trigger has priority
        setTimeout(() => {
          if (!user) {
            console.log("Creating immediate mock user");
            setUser(createMockUser(data.user!.id, data.user!.email || ''));
            setIsLoading(false);
          }
        }, 500);
      }
      
      return true;
    } catch (error) {
      console.error("Login failed", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
      });
      return false;
    } finally {
      // Allow delay for auth state change to take precedence
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      }, 1000);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error("Logout failed", error);
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An error occurred while logging out.",
      });
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, signup, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
