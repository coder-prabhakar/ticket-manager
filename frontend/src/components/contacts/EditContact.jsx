import { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'antd';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateContact } from '../../api/contact.js';
import { Heading } from "../Header.jsx";
import { ContactForm } from './ContactForm.jsx';


export const EditContact = ({ data, showAlert }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [form] = Form.useForm();

    useEffect(() => {
        if (isModalOpen && data) {
            form.setFieldsValue(data);
        }
    }, [isModalOpen, data, form]);

    const { mutate, isPending } = useMutation({
        mutationFn: ({ contact_id, data }) => updateContact(contact_id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
            form.resetFields();
            setIsModalOpen(false);
            showAlert("success", "Success", "Contact updated successfully");
        },

        onError: (error) => {
            const msg = error?.response?.data?.message || "Something went wrong";
            showAlert("error", "Unable to Edit", msg);
        }
    });

    const onFormSubmit = values => {
        mutate({ contact_id: data.contact_id, data: values });
    };
    
    return (
        <>
            <Button color="primary" variant="solid" size="small" onClick={() => setIsModalOpen(true)}>
                Edit
            </Button>

            <Modal
                title={<Heading>Update Contact</Heading>}
                centered
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={<></>}
                width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%'}}
            >
                <br />
                <ContactForm 
                    isEdit={true}
                    form={form}
                    onFormSubmit={onFormSubmit}
                    initialValues={data}
                    isSubmitting={isPending}
                />
            </Modal>
        </>
    )
};