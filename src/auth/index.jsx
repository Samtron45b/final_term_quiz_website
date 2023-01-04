import { useContext } from "react";
import AuthContext from "../components/contexts/auth_context";
import usePrivateAxios from "../configs/networks/usePrivateAxios";

// save token from server
export const saveToken = (token) => {
    const tokenJson = JSON.stringify(token);
    localStorage.setItem("token", tokenJson);
    localStorage.setItem("isLoggedIn", !!token);
};

// get token from localStorage
export const getToken = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        return accessToken;
    }
    return null;
};

export const getFullToken = () => {
    const tokenJson = localStorage.getItem("token");
    if (tokenJson) {
        return JSON.parse(tokenJson);
    }
    return null;
};

// delete token
export const deleteToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
};

export const getUserDataFromServer = () => {
    const privateAxios = usePrivateAxios();
    const { setUser } = useContext(AuthContext);

    const fetchUserData = async () => {
        await privateAxios
            .get("user/get")
            .then((userResponse) => {
                console.log(userResponse);
                const userData = userResponse.data;
                if (userData) {
                    userData.avatar =
                        userData.avatar ??
                        "https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg";
                    setUser({
                        displayName: userData.displayName,
                        username: userData.username,
                        email: userData.email,
                        avatar: userData.avatar,
                        active: userData.active
                    });
                    localStorage.setItem("userData", JSON.stringify(userData));
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    return fetchUserData;
};
