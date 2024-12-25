import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  sub: string;
};

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoading: boolean;

  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  isLoading: true,

  userEmail: null,
  setUserEmail: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem("jwtToken");
        if (storedToken) {
          setTokenState(storedToken);
          try {
            const decoded = jwtDecode<JwtPayload>(storedToken);
            if (decoded?.sub) {
              setUserEmail(decoded.sub);
            }
          } catch (error) {
            console.log("Error decoding stored token:", error);
          }
        }
      } catch (error) {
        console.log("Error fetching token from storage:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setToken = async (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      await AsyncStorage.setItem("jwtToken", newToken);
      try {
        const decoded = jwtDecode<JwtPayload>(newToken);
        if (decoded?.sub) {
          setUserEmail(decoded.sub);
        }
      } catch (error) {
        console.log("Error decoding new token:", error);
        setUserEmail(null);
      }
    } else {
      await AsyncStorage.removeItem("jwtToken");
      setUserEmail(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isLoading,
        userEmail,
        setUserEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
