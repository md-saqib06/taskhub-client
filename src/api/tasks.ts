import { api } from "@/lib/axios";

export const getProjectTasks = async (
    projectId: string
) => {
    const response = await api.get(
        `/tasks/project/${projectId}`
    );

    return response.data;
};

export const createTask = async (
    data: {
        title: string;
        description?: string;
        priority: string;
        dueDate?: string;
        assignedUserId?: string;
        projectId: string;
    }
) => {
    const response = await api.post(
        "/tasks",
        data
    );

    return response.data;
};