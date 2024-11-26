import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Define the shape of the context
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType>({ 
  currentUser: null, 
  isLoading: true 
});

// Create a provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
        setIsLoading(false);
      });
  
      return () => unsubscribe();
    }, []);
  
    return (
      <AuthContext.Provider value={{ currentUser, isLoading }}>
        {!isLoading && children}
      </AuthContext.Provider>
    );
  };

// Custom hook to use the auth context
export const useAuth = () => {
    return useContext(AuthContext);
  };