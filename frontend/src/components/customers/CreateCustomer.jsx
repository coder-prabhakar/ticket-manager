import { useState } from 'react';
import { Button, Modal, Form } from 'antd';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heading } from "../Header.jsx";
import { createCustomer } from '../../api/customer.js';
import { CustomerForm } from './CustomerForm.jsx';


export const CreateCustomer = ({ showAlert }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: createCustomer,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] })
            form.resetFields();
            setIsModalOpen(false);
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
            <Button type="primary"  onClick={() => setIsModalOpen(true)}>
                Create Customer
            </Button>

            <Modal
                title={<Heading>Create Customer</Heading>}
                centered
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={<></>}
                width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%'}}
            >
                <br />
                <CustomerForm 
                    form={form}
                    onFormSubmit={onFormSubmit}
                    initialValues={{ customer_status: true }}
                    isSubmitting={isPending}
                />
            </Modal>
        </>
    )
};