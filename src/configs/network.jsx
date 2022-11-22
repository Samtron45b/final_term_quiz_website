import axios from "axios";

const baseUrl = "";

const axiosPublic = axios.create({
    baseURL: `${baseUrl}`,
    headers: {
        "Content-Type": "application/json"
    }
});

axiosPublic.interceptors.request.use(
    (config) => {
        const accessToken = sessionStorage.getItem("accessToken");
        const newConfig = config;
        if (!newConfig.headers) {
            newConfig.headers = {
                ...config.headers,
                Authorization: `Bearer ${accessToken}`
            };
        }
        return newConfig;
    },
    (error) => Promise.reject(error)
);

axiosPublic.interceptors.response.use(
    (res) => res,
    (error) => {
        const status = error.response?.status ?? null;
        if (status === 401) {
            window.location.replace("/logout");
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");
        }
        // status might be undefined
        if (!status) {
            // refresh();
        }
        return Promise.reject(error);
    }
);

const refreshTokenFn = async () => {
    const curRefreshToken = JSON.parse(localStorage.getItem("refreshToken"));

    const response = await axiosPublic.post("/refreshToken", {
        refreshToken: curRefreshToken
    });
    axios.interceptors.request.use();

    const { accessToken } = response.data;

    if (accessToken) {
        localStorage.removeItem("session");
        localStorage.removeItem("user");
    }

    localStorage.setItem("session", JSON.stringify(accessToken));
};

export default axiosPublic;
export { refreshTokenFn };
