import { useState } from 'react';
import { Button, Modal, Form } from 'antd';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heading } from "../Header.jsx";
import { createContact } from '../../api/contact.js';
import { ContactForm } from './ContactForm.jsx';


export const CreateContact = ({ showAlert }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: createContact,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            form.resetFields();
            setIsModalOpen(false);
            showAlert("success", "Success", "Contact created successfully");
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
                Create Contact
            </Button>

            <Modal
                title={<Heading>Create Contact</Heading>}
                centered
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={<></>}
                width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%'}}
            >
                <br />
                <ContactForm 
                    form={form}
                    onFormSubmit={onFormSubmit}
                    initialValues={{}}
                    isSubmitting={isPending}
                />
            </Modal>
        </>
    )
};