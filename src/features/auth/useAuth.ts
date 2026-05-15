import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "@/api/auth";

export const useAuth = () => {
    const query = useQuery({
        queryKey: ["me"],
        queryFn: getCurrentUser,
        retry: false,
        staleTime: 0,
    });

    return {
        user: query.data,
        isLoading: query.isLoading,
        isAuthenticated: !!query.data,
    };
};