import axios from "axios";

const axiosPublic = axios.create({
    baseURL: "http://localhost:3333/api",
    headers: {
        "Content-Type": "application/json"
    }
});

const refreshTokenFn = async () => {
    const session = JSON.parse(localStorage.getItem("session"));

    try {
        const response = await axiosPublic.post("/user/refresh", {
            refreshToken: session?.refreshToken
        });

        const { session } = response.data;

        if (!session?.accessToken) {
            localStorage.removeItem("session");
            localStorage.removeItem("user");
        }

        localStorage.setItem("session", JSON.stringify(session));

        return session;
    } catch (error) {
        localStorage.removeItem("session");
        localStorage.removeItem("user");
    }
};

export default axiosPublic;
