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
