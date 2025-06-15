import React, { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextType, IUser } from "../interfaces";

const AuthContext = createContext<AuthContextType | undefined>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

const useAuth = () => useContext(AuthContext);

// Auth Provider Component
const AuthProvider = ({ children } : {children : React.ReactNode}) => {
  const [user, setUser] = useState<{username: string, password: string} | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    
    if (savedToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (userData: {username: string, password: string}) => {
    try{

      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const responseData = await response.json();
      if(response.status !== 200) {
        console.error('Login failed:', responseData);
        return;
      }
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('token', responseData.access);
    }
    catch (error) {
      throw new Error(`Login failed: ${error}`);
    }

  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated
  };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
export { AuthProvider, AuthContext, useAuth };