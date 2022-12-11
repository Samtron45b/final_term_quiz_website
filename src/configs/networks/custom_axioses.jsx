import axios from "axios";

const baseUrl = process.env.REACT_APP_BASE_URL;

// use for requests that dont't need authorize token
const publicAxios = axios.create({
    baseURL: `${baseUrl}`,
    headers: {
        "Content-Type": "application/json"
    }
});

// use for requests that must include authorize token
const privateAxios = axios.create({
    baseURL: `${baseUrl}`,
    headers: {
        "Content-Type": "application/json"
    }
});

export default privateAxios;
export { publicAxios };
