import { useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import authApi from "../../Auth/services/auth.api";

const useAuth = () => {
  const { login: contextLogin, logout: contextLogout } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(credentials);
      contextLogin(response.user, response.accessToken, response.refreshToken);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.register(userData);
      contextLogin(response.user, response.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authApi.logout();
      contextLogout();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, register, logout, loading, error };
};

export default useAuth;
