import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const session = localStorage.getItem("dailydost_session");
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const signup = (name: string, email: string, password: string): boolean => {
    // Get existing users
    const usersData = localStorage.getItem("dailydost_users");
    const users = usersData ? JSON.parse(usersData) : [];

    // Check if email already exists
    if (users.find((u: any) => u.email === email)) {
      return false;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, this should be hashed
      joinDate: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("dailydost_users", JSON.stringify(users));

    // Create session
    const userSession: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      joinDate: newUser.joinDate,
    };

    localStorage.setItem("dailydost_session", JSON.stringify(userSession));
    setUser(userSession);

    return true;
  };

  const login = (email: string, password: string): boolean => {
    const usersData = localStorage.getItem("dailydost_users");
    if (!usersData) return false;

    const users = JSON.parse(usersData);
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (!foundUser) return false;

    const userSession: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      joinDate: foundUser.joinDate,
    };

    localStorage.setItem("dailydost_session", JSON.stringify(userSession));
    setUser(userSession);

    return true;
  };

  const logout = () => {
    localStorage.removeItem("dailydost_session");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
