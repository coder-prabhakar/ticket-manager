import { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'antd';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heading } from "../Header.jsx";
import { updateCustomer } from '../../api/customer.js';
import { CustomerForm } from './CustomerForm.jsx';


export const EditCustomer = ({ customerData, showAlert }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const queryClient = useQueryClient();
    const [form] = Form.useForm();

    useEffect(() => {
        if (isModalOpen && customerData) {
            form.setFieldsValue(customerData);
        }
    }, [isModalOpen, customerData, form]);

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, data }) => updateCustomer(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["customers"] })
            setIsModalOpen(false);
        },

        onError: (error) => {
            const msg = error?.response?.data?.message || "Something went wrong";
            showAlert("error", "Unable to Edit", msg);
        }
    });

    const onFormSubmit = values => {
        mutate({ id: customerData.customer_id, data: values });
    };

    return (
        <>
            <Button color="primary" variant="solid" size="small" onClick={() => setIsModalOpen(true)}>
                Edit
            </Button>

            <Modal
                title={<Heading>Update Customer</Heading>}
                centered
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={<></>}
                width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%'}}
            >
                <br />
                <CustomerForm 
                    isEdit={true}
                    form={form}
                    onFormSubmit={onFormSubmit}
                    initialValues={customerData}
                    isSubmitting={isPending}
                />
            </Modal>
        </>
    )
};