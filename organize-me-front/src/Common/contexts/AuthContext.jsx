import { createContext, useState, useEffect } from "react";
import authApi from "../../Auth/services/auth.api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        await fetchUser();
      }
      setInitialLoading(false);
    };
    initializeAuth();
  }, [token]);

  const isLoggedIn = !initialLoading && !!user;

  const saveToken = (accessToken) => {
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
  };

  const login = (userData, accessToken) => {
    setUser(userData);
    saveToken(accessToken);
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const userData = await authApi.me();
      setUser(userData);
    } catch (err) {
      logout(); // Déconnexion en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn, loading, initialLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
