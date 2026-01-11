import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string, remember: boolean) => Promise<boolean>;
  signUp: (fullName: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  resetPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for testing
const DEMO_USER: User = {
  id: 'demo-user-1',
  email: 'demo@cattlecare.ai',
  fullName: 'Demo Farmer',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('cattlecare-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string, remember: boolean): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, accept any email/password or demo credentials
    const loggedInUser: User = {
      id: `user-${Date.now()}`,
      email,
      fullName: email.split('@')[0],
    };
    
    setUser(loggedInUser);
    if (remember) {
      localStorage.setItem('cattlecare-user', JSON.stringify(loggedInUser));
    } else {
      sessionStorage.setItem('cattlecare-user', JSON.stringify(loggedInUser));
    }
    
    return true;
  };

  const signUp = async (fullName: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      fullName,
    };
    
    setUser(newUser);
    localStorage.setItem('cattlecare-user', JSON.stringify(newUser));
    
    return true;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('cattlecare-user');
    sessionStorage.removeItem('cattlecare-user');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signUp,
      signOut,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useDemoLogin = () => {
  const { signIn } = useAuth();
  return () => signIn(DEMO_USER.email, 'demo123', true);
};
