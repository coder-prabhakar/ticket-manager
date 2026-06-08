import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCommentsByTaskId, createComment } from "../api/comment";


export const useCommentsByTaskId = (taskId) => {
    return useQuery({
        queryKey: ["comments", taskId],
        queryFn: () => getCommentsByTaskId(taskId),
        enabled: !!taskId,
    });
};


export const useCreateComment = ({ showAlert, clear }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createComment,

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["comments", variables.comment_task_id]
            });
            clear();
        },

        onError: (error) => {
            const msg = error?.response?.data?.message || "Something went wrong";
            showAlert("error", "Unable to Add Comment", msg);
        }
    });
};