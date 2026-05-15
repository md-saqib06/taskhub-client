import { api } from "@/lib/axios";

export const getProjects = async () => {
    const response = await api.get(
        "/projects"
    );

    return response.data;
};

export const createProject = async (
    data: {
        name: string;
        description?: string;
    }
) => {
    const response = await api.post(
        "/projects",
        data
    );

    return response.data;
};

export const searchUsers = async (
    username: string
) => {
    const response = await api.get(
        `/users/search?username=${username}`
    );

    return response.data;
};

export const addProjectMember = async (
    projectId: string,
    userId: string
) => {
    const response = await api.post(
        `/projects/${projectId}/members`,
        {
            userId,
        }
    );

    return response.data;
};