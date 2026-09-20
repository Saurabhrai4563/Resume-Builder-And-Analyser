import axios from 'axios';

const api = axios.create({
    baseURL: "https://resume-builder-analyser-backend.vercel.app",
    withCredentials: true
});

export async function register({ username, email, password }) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        });
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || "Registration failed. Please try again.";
        throw new Error(message);
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post('/api/auth/login', {
            email, password
        });
        return response.data;
    } catch (err) {
        const message = err.response?.data?.message || "Login failed. Please check credentials.";
        throw new Error(message);
    }
}

export async function logout() {
    try {
        const response = await api.get('/api/auth/logout');
        return response.data;
    } catch (err) {
        console.error("Logout failed:", err);
    }
}

export async function getMe() {
    try {
        const response = await api.get('/api/auth/get-me');
        return response.data;
    } catch (err) {
        return null;
    }
}