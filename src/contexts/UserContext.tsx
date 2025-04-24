
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
        setSession(currentSession);
        
        if (currentSession?.user) {
          // Use setTimeout to avoid Supabase deadlocks
          setTimeout(async () => {
            try {
              // Fetch user profile from profiles table
              const { data: profile, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", currentSession.user.id)
                .maybeSingle();

              if (error) {
                console.error("Error fetching user profile:", error);
                setIsLoading(false);
                return;
              }

              if (profile) {
                setUser({
                  id: profile.id,
                  name: profile.name,
                  email: profile.email,
                  role: profile.role,
                  age: profile.age,
                  specialty: profile.specialty,
                  lastLogin: profile.last_login ? new Date(profile.last_login) : undefined
                });
              } else {
                // Create a mock user for demonstration if profile doesn't exist
                console.log("No profile found, creating mock user for demonstration");
                setUser({
                  id: currentSession.user.id,
                  email: currentSession.user.email || 'demo@example.com',
                  name: "Demo User",
                  role: "patient",
                  lastLogin: new Date()
                });
              }
            } catch (error) {
              console.error("Failed to fetch profile data", error);
            } finally {
              setIsLoading(false);
            }
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Checking for existing session:", currentSession?.user?.id);
      setSession(currentSession);
      
      if (currentSession?.user) {
        // Use setTimeout to avoid Supabase deadlocks
        setTimeout(async () => {
          try {
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", currentSession.user.id)
              .maybeSingle();

            if (error) {
              console.error("Error fetching user profile:", error);
              setIsLoading(false);
              return;
            }

            if (profile) {
              setUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                role: profile.role,
                age: profile.age,
                specialty: profile.specialty,
                lastLogin: profile.last_login ? new Date(profile.last_login) : undefined
              });
            } else {
              // Create a mock user for demonstration if profile doesn't exist
              console.log("No profile found, creating mock user for demonstration");
              setUser({
                id: currentSession.user.id,
                email: currentSession.user.email || 'demo@example.com',
                name: "Demo User",
                role: "patient",
                lastLogin: new Date()
              });
            }
          } catch (error) {
            console.error("Failed to fetch profile data", error);
          } finally {
            setIsLoading(false);
          }
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      
      // For demo purposes, immediately create a user object if login is successful
      // but no profile exists
      if (data.user) {
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.user?.id)
            .maybeSingle();
            
          if (!profile) {
            console.log("Creating mock profile for demo");
            setUser({
              id: data.user.id,
              email: data.user.email || 'demo@example.com',
              name: "Demo User",
              role: "patient",
              lastLogin: new Date()
            });
          }
        }, 0);
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
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
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
