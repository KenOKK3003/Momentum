import React, { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "expo-router";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "../utils/firebaseConfig";

// Define user type from Web SDK
type FirebaseUser = User | null;

// Context shape
interface AuthContextType {
  user: FirebaseUser;
  setUser: React.Dispatch<React.SetStateAction<FirebaseUser>>;
  initializing: boolean;
  signInMethod: string | null;
  setSignInMethod: React.Dispatch<React.SetStateAction<string | null>>;
}

// Provide default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => null,
  initializing: true,
  signInMethod: null,
  setSignInMethod: () => null,
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<FirebaseUser>(null);
  const [initializing, setInitializing] = useState(true);
  const [signInMethod, setSignInMethod] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  const value: AuthContextType = {
    user,
    setUser,
    initializing,
    signInMethod,
    setSignInMethod,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}