
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        
        if (currentSession?.user) {
          try {
            // Fetch user profile from profiles table
            const { data: profile, error } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", currentSession.user.id)
              .maybeSingle();

            if (error) {
              console.error("Error fetching user profile:", error);
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
              console.log("No profile found for user:", currentSession.user.id);
            }
          } catch (error) {
            console.error("Failed to fetch profile data", error);
          }
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      console.log("Checking for existing session:", currentSession?.user?.id);
      setSession(currentSession);
      
      if (currentSession?.user) {
        setIsLoading(true);
        try {
          // Fetch user profile from profiles table
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentSession.user.id)
            .maybeSingle();

          if (error) {
            console.error("Error fetching user profile:", error);
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
            console.log("No profile found for user:", currentSession.user.id);
          }
        } catch (error) {
          console.error("Failed to fetch profile data", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  // Signup function with Supabase authentication
  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Signing up with data:", { 
        email: userData.email, 
        role: userData.role, 
        metadata: {
          name: userData.name,
          role: userData.role,
          ...(userData.age && { age: userData.age }),
          ...(userData.specialty && { specialty: userData.specialty }),
        }
      });
      
      // Register user with Supabase Auth
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

      // Insert additional data into profiles table if needed
      if (data.user) {
        console.log("User created successfully:", data.user.id);
        // The trigger should handle this automatically, but we can add manual handling if required
        toast({
          title: "Signup successful",
          description: "Welcome to FulaMed! Please check your email to verify your account.",
        });
      }
      
      return true;
    } catch (error) {
      console.error("Signup failed", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later.",
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
