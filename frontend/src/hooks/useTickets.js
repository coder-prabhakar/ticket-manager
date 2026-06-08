import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllTickets, createTicket, updateTicket } from "../api/ticket.js";

export const useTickets = () => {
    return useQuery({
        queryKey: ["tickets"],
        queryFn: getAllTickets,
    });
};

export const useCreateTicket = ({ closeForm, showAlert }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTicket,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            closeForm();
            showAlert("success", "Created Successfully", "");
        },

        onError: (error) => {
            const msg = error?.response?.data?.message || "Something went wrong";
            showAlert("error", "Unable to Create", msg);
        }
    });
};

export const useUpdateTicket = ({ closeForm, showAlert }) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateTicket(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets"] });
            queryClient.invalidateQueries({ queryKey: ["report"] });
            closeForm();
            showAlert("success", "Updated Successfully", "");
        },

        onError: (error) => {
            const msg = error?.response?.data?.message || "Something went wrong";
            showAlert("error", "Unable to Update", msg);
        }
    });
};