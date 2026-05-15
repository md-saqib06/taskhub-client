import { api } from "@/lib/axios";

export const getProjectActivities = async (
    projectId: string
) => {
    const response = await api.get(
        `/activities/project/${projectId}`
    );

    return response.data;
};