import dayjs from 'dayjs';
import { Form, Result, Button, Modal, Input } from 'antd';
import { useEffect, useState } from 'react';
import { TicketForm } from './TicketForm.jsx';
import { TicketTable } from './TicketTable.jsx';
import { Header, Heading } from '../Header.jsx';
import { useAlert } from '../../utils/useAlert.jsx';
import { useTickets, useCreateTicket, useUpdateTicket } from '../../hooks/useTickets.js';

const { Search } = Input;


export default function Ticket() {
    const [update, setUpdate] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const [form] = Form.useForm();

    useEffect(() => {
        if (isFormOpen) {
            if (update) {
                form.setFieldsValue({
                    ...update,
                    created_at: update.created_at ? dayjs(update.created_at) : undefined,
                    task_deadline: update.task_deadline ? dayjs(update.task_deadline) : undefined,
                    completed_at: update.completed_at ? dayjs(update.completed_at) : undefined
                });
            } else {
                form.setFieldsValue({
                    task_title: undefined,
                    task_description: undefined,
                    task_customer_code: undefined,
                    task_project_id: undefined,
                    task_assigned_to: undefined,
                    created_at: dayjs(),
                    task_deadline: undefined,
                    completed_at: undefined,
                    task_status: "pending",
                });
            }
        }
    }, [update, isFormOpen, form]);

    const closeForm = () => {
        form.resetFields();
        setUpdate(null);
        setIsFormOpen(false);
    };

    const onFormSubmit = values => {
        const payload = {
            ...values,
            created_at: values.created_at ? values.created_at.format("YYYY-MM-DD") : undefined,
            task_deadline: values.task_deadline ? values.task_deadline.format("YYYY-MM-DD") : undefined,
            completed_at: values.completed_at ? values.completed_at.format("YYYY-MM-DD") : undefined
        };

        if(update){
            updateTicket({ id: update.task_id, data: payload });
        } else {
            createTicket(payload);
        }
    };

    const { alertComponent, showAlert } = useAlert();

    const { data, isLoading, error } = useTickets();
    const { mutate: createTicket, isPending: isCreating } = useCreateTicket({ closeForm, showAlert });
    const { mutate: updateTicket, isPending: isUpdating } = useUpdateTicket({ closeForm, showAlert });
    console.log(data)
    if(error) return (
        <div className='w-full h-full flex items-center justify-center'>
            <Result status="warning" title={error?.message}/>
        </div>
    );

    return (
        <>
            {alertComponent}

            <Header>
                <Heading>Tickets</Heading>

                <div className="flex-1"></div>

                <Search 
                    onSearch={(v) => setSearchValue(v.trim())} 
                    placeholder="Search..." 
                    className='max-w-60'
                    enterButton 
                    allowClear
                />

                <Button type="primary" onClick={() => {
                    setUpdate(null);
                    setIsFormOpen(true);
                }}>
                    Create
                </Button>
            </Header>

            <TicketTable 
                isLoading={isLoading} 
                data={data?.filter((item) => 
                    item.task_title?.toLowerCase().includes(searchValue.toLowerCase()) || 
                    item.customer_name?.toLowerCase().includes(searchValue.toLowerCase()) || 
                    item.member_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item.project_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
                    dayjs(item.created_at).format("DD-MM-YYYY")?.includes(searchValue) || 
                    dayjs(item.completed_at).format("DD-MM-YYYY")?.includes(searchValue) || 
                    dayjs(item.task_deadline).format("DD-MM-YYYY")?.includes(searchValue) 
                )}
                showAlert={showAlert}
                setUpdate={setUpdate} 
                setIsFormOpen={setIsFormOpen}
            />

            <Modal
                title={<Heading>{update ? "Update" : "Create"} Ticket</Heading>}
                centered
                open={isFormOpen}
                onCancel={closeForm}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <br />
                <TicketForm 
                    form={form}
                    isSubmitting={update ? isUpdating : isCreating}
                    onFormSubmit={onFormSubmit}
                    initialValues={
                        update ? {
                            ...update,
                            created_at: update.created_at ? dayjs(update.created_at) : undefined,
                            task_deadline: update.task_deadline ? dayjs(update.task_deadline) : undefined,
                            completed_at: update.completed_at ? dayjs(update.completed_at) : undefined
                        } : { 
                            task_status: "pending",
                            created_at: dayjs(), 
                        }
                    }
                />
            </Modal>
        </>
    )
};