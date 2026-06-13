import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication
} from "../api/applications";

export function useApplications(filters) {
    const queryClient = useQueryClient();

    // 1. GET - Fetch Applications with current filters
    const { data, isLoading, error } = useQuery({
        queryKey: ['applications', filters],
        queryFn: () => getApplications(filters)
    });

    // 2. POST - Add new application
    const createMutation = useMutation({
        mutationFn: createApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
        }
    });

    // 3. PUT - Update application details
    const updateMutation = useMutation({
        mutationFn: ({ application_id, payload }) => updateApplication(application_id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
        }
    });

    // 4. DELETE - Remove application
    const deleteMutation = useMutation({
        mutationFn: deleteApplication,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['applications'] });
        }
    });

    // Wrappers to map arguments from existing components
    const addApplication = async (app) => {
        return createMutation.mutateAsync(app);
    };

    const updateApp = async (application_id, app) => {
        return updateMutation.mutateAsync({ application_id, payload: app });
    };

    const removeApplication = async (application_id) => {
        return deleteMutation.mutateAsync(application_id);
    };

    return {
        applications: data?.data || [],
        totalPages: data?.pagination?.totalPages || 0,
        totalCount: data?.pagination?.totalCount || 0,
        isLoading,
        error: error ? (error.message || "An error occurred") : null,
        addApplication,
        updateApplication: updateApp,
        deleteApplication: removeApplication
    };
}
