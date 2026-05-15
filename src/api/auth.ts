import { api } from "../lib/axios";

export const signup = async (data: {
    name: string;
    username: string;
    email: string;
    password: string;
}) => {
    const response = await api.post(
        "/auth/signup",
        data
    );

    return response.data;
};

export const login = async (data: {
    email: string;
    password: string;
}) => {
    const response = await api.post(
        "/auth/login",
        data
    );

    return response.data;
};

export const getCurrentUser = async () => {
    const response = await api.get("/auth/me");

    return response.data;
};