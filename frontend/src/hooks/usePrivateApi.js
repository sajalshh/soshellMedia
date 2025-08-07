// src/hooks/useAxiosPrivate.js
import { useEffect } from "react";
import { privateApi } from "../api/axiosConfig";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const useAxiosPrivate = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // This runs for every outgoing request
    const requestIntercept = privateApi.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // This runs for every incoming response
    const responseIntercept = privateApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          try {
            const refreshResponse = await privateApi.get("/auth/refresh");
            console.log(
              "🔁 Refreshed token:",
              refreshResponse.data.accessToken,
            );
            const newAccessToken = refreshResponse.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            setAuth((prev) => ({ ...prev, accessToken: newAccessToken }));
            prevRequest.headers = {
              ...prevRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };
            return privateApi(prevRequest);

          } catch (refreshError) {
            // If refresh fails, log the user out
            setAuth({});
            localStorage.removeItem("accessToken");
            navigate("/login");
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      },
    );

    // Cleanup function to remove interceptors
    return () => {
      privateApi.interceptors.request.eject(requestIntercept);
      privateApi.interceptors.response.eject(responseIntercept);
    };
  }, [auth, setAuth, navigate]);

  return privateApi;
};

export default useAxiosPrivate;
