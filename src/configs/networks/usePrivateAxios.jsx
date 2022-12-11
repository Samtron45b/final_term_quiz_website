import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import privateAxios from "./custom_axioses";

export default function usePrivateAxios() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const requestInterceptor = privateAxios.interceptors.request.use(
            (config) => {
                const accessToken = localStorage.getItem("accessToken");
                const newConfig = config;
                newConfig.headers.Authorization = `Bearer ${accessToken}`;
                return newConfig;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = privateAxios.interceptors.response.use(
            (response) => response,
            (error) => {
                const status = error.response?.status ?? null;
                if (status === 401) {
                    localStorage.removeItem("access_token");
                    navigate("/login", { state: { from: location.pathname, replace: true } });
                }

                return Promise.reject(error);
            }
        );

        return () => {
            privateAxios.interceptors.request.eject(requestInterceptor);
            privateAxios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return privateAxios;
}
