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

export const updateTaskStatus = async (
    taskId: string,
    status:
        | "TODO"
        | "IN_PROGRESS"
        | "DONE"
) => {
    const response = await api.patch(
        `/tasks/${taskId}/status`,
        {
            status,
        }
    );

    return response.data;
};

export const updateTask = async (
    taskId: string,
    data: {
        title: string;
        description?: string;
        priority: string;
        dueDate?: string;
        assignedUserId?: string;
        status: string;
    }
) => {
    const response = await api.patch(
        `/tasks/${taskId}`,
        data
    );

    return response.data;
};

export const deleteTask = async (
    taskId: string
) => {
    const response = await api.delete(
        `/tasks/${taskId}`
    );

    return response.data;
};