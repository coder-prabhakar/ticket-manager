import { Button, Popconfirm } from 'antd';
import { deleteMember } from '../../api/member.js';
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const DeleteMember = ({ memberID, showAlert }) => {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: deleteMember,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["members"] });
            showAlert("success", "Success", "Deleted successfully");
        },

        onError: (error) => {
            const msg = error?.response?.data?.message || "Delete failed";
            showAlert("error", "Unable to Delete", msg);
        }
    });

    return (
        <Popconfirm okText="Yes" cancelText="No" title="Are you sure to delete this member?" onConfirm={() => mutate(memberID)}>
            <Button color="danger" variant="solid" size="small" disabled={isPending}>
                Delete
            </Button>
        </Popconfirm>
    )
};