import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, deleteProject, getAllProjects, updateProject } from "../api/project";


export const useProjects = () => {
    return useQuery({
        queryKey: ["projects"],
        queryFn: getAllProjects,
    });
};


export const useCreateProject = ({ closeForm, showAlert }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProject,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            closeForm();
            showAlert("success", "Created Successfully", "");
        },

        onError: (error) => {
            const msg = error?.response?.data?.message || "Something went wrong";
            showAlert("error", "Unable to Create", msg);
        }
    });
};


export const useUpdateProject = ({ closeForm, showAlert }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ project_id, data }) => updateProject(project_id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            closeForm();
            showAlert("success", "Updated Successfully", "");
        },

        onError: (error) => {
            const msg = error?.response?.data?.message || "Something went wrong";
            showAlert("error", "Unable to Update", msg);
        }
    });
};


export const useDeleteProject = ({ showAlert }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProject,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            showAlert("success", "Deleted successfully", "");
        },

        onError: (error) => {
            const msg = error?.response?.data?.message || "Delete failed";
            showAlert("error", "Unable to Delete", msg);
        }
    })
};