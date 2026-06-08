import { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'antd';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heading } from "../Header.jsx";
import { updateMember } from '../../api/member.js';
import { MemberForm } from './MemberForm.jsx';


export const EditMember = ({ memberData, showAlert }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [form] = Form.useForm();

    useEffect(() => {
        if (isModalOpen && memberData) {
            form.setFieldsValue(memberData);
        }
    }, [isModalOpen, memberData, form]);

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, data }) => updateMember(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["members"] });
            form.resetFields();
            setIsModalOpen(false);
            showAlert("success", "Success", "Member updated successfully");
        },

        onError: (error) => {
            const msg = error?.response?.data?.message || "Something went wrong";
            showAlert("error", "Unable to Edit", msg);
        }
    });

    const onFormSubmit = values => {
        mutate({ id: memberData.member_id, data: values });
    };
    
    return (
        <>
            <Button color="primary" variant="solid" size="small" onClick={() => setIsModalOpen(true)}>
                Edit
            </Button>

            <Modal
                title={<Heading>Update Member</Heading>}
                centered
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={<></>}
                width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%'}}
            >
                <br />
                <MemberForm 
                    isEdit={true}
                    form={form}
                    onFormSubmit={onFormSubmit}
                    initialValues={memberData}
                    isSubmitting={isPending}
                />
            </Modal>
        </>
    )
};