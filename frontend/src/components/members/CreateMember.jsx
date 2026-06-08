import { useState } from 'react';
import { Button, Modal, Form } from 'antd';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heading } from "../Header.jsx";
import { createMember } from '../../api/member.js';
import { MemberForm } from './MemberForm.jsx';


export const CreateMember = ({ showAlert }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: createMember,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["members"] });
            form.resetFields();
            setIsModalOpen(false);
            showAlert("success", "Success", "Member created successfully");
        },

        onError: (error) => {
            const msg = error?.response?.data?.message || "Something went wrong";
            showAlert("error", "Unable to Create", msg);
        }
    });

    const [form] = Form.useForm();

    const onFormSubmit = values => {
        mutate(values);
    };

    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Create Member
            </Button>

            <Modal
                title={<Heading>Create Member</Heading>}
                centered
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={<></>}
                width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%'}}
            >
                <br />
                <MemberForm 
                    form={form}
                    onFormSubmit={onFormSubmit}
                    initialValues={{ member_status: true }}
                    isSubmitting={isPending}
                />
            </Modal>
        </>
    )
};