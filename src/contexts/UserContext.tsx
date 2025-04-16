
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
  logout: () => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("fulamedUser");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse saved user", error);
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("fulamedUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("fulamedUser");
    }
  }, [user]);

  // Mock login function until we integrate with Supabase
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This is a mock implementation
      // We'll replace with real Supabase auth later
      const mockUser: User = {
        id: "123",
        email,
        name: "Demo User",
        role: email.includes("doctor") ? "doctor" : "patient",
        lastLogin: new Date()
      };
      
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock signup function
  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    try {
      // This is a mock implementation
      // We'll replace with real Supabase auth later
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        email: userData.email || "",
        name: userData.name || "",
        role: userData.role || "patient",
        age: userData.age,
        specialty: userData.specialty,
        lastLogin: new Date()
      };
      
      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Signup failed", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
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
