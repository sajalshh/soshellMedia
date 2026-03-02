import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import api from "../api/axiosConfig";
import { privateApi } from "../api/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return token ? { accessToken: token } : {};
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async (token) => {
    try {
      const res = await privateApi.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
    } catch (err) {
      setAuth({});
      setUser(null);
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auth.accessToken) {
      fetchUserProfile(auth.accessToken);
    } else {
      setLoading(false);
    }
  }, [auth.accessToken, fetchUserProfile]);

  const login = async (identifier, password) => {
    const response = await api.post("/auth/login", { identifier, password });
    const accessToken = response.data.accessToken;
    localStorage.setItem("accessToken", accessToken);
    setAuth({ accessToken });
    return response;
  };

  const logout = async () => {
    try {
      await privateApi.post("/auth/logout");
    } catch (e) {
      /* ignore */
    }
    localStorage.removeItem("accessToken");
    setAuth({});
    setUser(null);
  };

  const hasPermission = useCallback(
    (feature, action) => {
      if (!user) return false;
      if (user.isSuperAdmin) return true;
      const perms = user.role?.permissions || [];
      const featurePerm = perms.find((p) => p.feature === feature);
      return featurePerm ? featurePerm.actions.includes(action) : false;
    },
    [user],
  );

  const isAdmin = useCallback(() => {
    if (!user) return false;
    if (user.isSuperAdmin) return true;
    return user.role?.name === "Admin";
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        user,
        loading,
        login,
        logout,
        hasPermission,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
