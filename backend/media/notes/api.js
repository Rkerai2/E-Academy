import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error)=> {
        return Promise.reject(error)
    }
)
export const checkAuthorization = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        return false;
    }

    try {
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            return await refreshToken();
        } else {
            return true;
        }
    } catch (error) {
        console.error('Error checking auth:', error);
        return false;
    }
};

// Define function to refresh token
const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
        const res = await api.post('/api/token/refresh/', { refresh: refreshToken });
        if (res.status === 200) {
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
        return false;
    }
};

export default api
