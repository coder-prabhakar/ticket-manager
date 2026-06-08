import { Button, Popconfirm } from 'antd';
import { deleteContact } from '../../api/contact.js';
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const DeleteContact = ({ contactId, showAlert }) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteContact,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            showAlert("success", "Success", "Deleted successfully");
        },

        onError: (error) => {
            const msg = error?.response?.data?.message || "Delete failed";
            showAlert("error", "Unable to Delete", msg);
        }
    });

    return (
        <Popconfirm okText="Yes" cancelText="No" title="Are you sure to delete this member?" onConfirm={() => mutate(contactId)}>
            <Button color="danger" variant="solid" size="small" disabled={isPending}>
                Delete
            </Button>
        </Popconfirm>
    )
};