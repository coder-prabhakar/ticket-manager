import dayjs from "dayjs";
import { useState } from "react";
import { Header, Heading } from "../Header.jsx";
import { TicketForm } from "../tickets/TicketForm.jsx";
import { useQuery } from "@tanstack/react-query";
import { TicketTable } from "../tickets/TicketTable.jsx";
import { Form, Select, DatePicker, Button, Modal } from 'antd';

import { getReport } from "../../api/report.js";
import { useAlert } from "../../utils/useAlert.jsx";
import { useData } from "../../context/DataContext.jsx";
import { useUpdateTicket } from "../../hooks/useTickets.js";
import { getDataFromLocalStorage } from "../../utils/localStorage.js";

const defaultFromDate = dayjs().startOf("month");
const defaultToDate = dayjs();

const ALL_VALUE = "all";

const withAllOption = (options = [], label = "All") => [
    { label, value: ALL_VALUE },
    ...options,
];


export default function Reports() {
    const [filterPayload, setFilterPayload] = useState(null);

    const [update, setUpdate] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [form] = Form.useForm();

    const { user } = getDataFromLocalStorage() || {};
    const { alertComponent, showAlert } = useAlert();
    const { MembersForDDL, CustomersForDDL, statusListForDDL } = useData();

    const closeForm = () => {
        setUpdate(null);
        setIsFormOpen(false);
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["report", filterPayload],
        queryFn: () => getReport(filterPayload),
        enabled: !!filterPayload, 
    });

    if(isError) {
        const msg = error?.response?.data?.message || "Something went wrong";
        showAlert(error, "Unable to Fetch Report", msg);
    };

    const { mutate: updateTicket, isPending: isUpdating } = useUpdateTicket({ 
        closeForm: () => {
            setUpdate(null);
            setIsFormOpen(false);
        }, 
        showAlert 
    });

    const handleMultiSelectChange = (label, values) => {
        const allWithOthers = values.includes(ALL_VALUE) && values.length > 1;

        if (allWithOthers) {
            const lastSelected = values[values.length - 1];

            if (lastSelected === ALL_VALUE) {
                form.setFieldsValue({ [label]: [ALL_VALUE] });
            } else {
                form.setFieldsValue({ [label]: values.filter(v => v !== ALL_VALUE) });
            }
        }
    }

    const onFormSubmit = values => {
        const payload = {
            ...values,
            from_date: values.from_date ? values.from_date.format("YYYY-MM-DD") : undefined,
            to_date: values.to_date ? values.to_date.format("YYYY-MM-DD") : undefined
        };

        setFilterPayload(payload);
    };

    const onUpdateSubmit = values => {
        const payload = {
            ...values,
            created_at: values.created_at ? values.created_at.format("YYYY-MM-DD") : undefined,
            task_deadline: values.task_deadline ? values.task_deadline.format("YYYY-MM-DD") : undefined,
            completed_at: values.completed_at ? values.completed_at.format("YYYY-MM-DD") : undefined
        };

        updateTicket({ id: update.task_id, data: payload });
    };

    return (
        <>
            {alertComponent}

            <Header>
                <Heading>Reports</Heading>
            </Header>

            <Form
                form={form}
                name="reportForm" 
                layout="vertical"
                onFinish={onFormSubmit}
                autoComplete="off"
                className='bg-white rounded-lg grid gap-3'
                style={{ padding: "24px 24px 0", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
                initialValues={{
                    from_date: defaultFromDate,
                    to_date: defaultToDate,
                    customers: ["all"],
                    members: ["all"],
                    task_status: ["pending"]
                }}
            >
                <Form.Item name="from_date" label="From Date">
                    <DatePicker placeholder="Select from date" className='w-full' allowClear/>
                </Form.Item>

                <Form.Item name="to_date" label="To Date">
                    <DatePicker placeholder="Select to date" className='w-full' allowClear/>
                </Form.Item>

                {user?.role !== "customer" && (
                    <Form.Item name="customers" label="Customer" rules={[{ required: true, message: 'Customer is required'  }]}>
                        <Select 
                            mode="multiple"
                            maxTagCount="responsive"
                            placeholder="Select customer"
                            allowClear 
                            options={withAllOption(CustomersForDDL, "All Customers")}
                            onChange={(e) => handleMultiSelectChange("customers", e)}
                        />
                    </Form.Item>
                )}
                
                {(user?.role === "admin" || user?.role === "customer") && (
                    <Form.Item name="members" label="Member" rules={[{ required: true, message: 'Member is required'  }]}>
                        <Select 
                            mode="multiple"
                            maxTagCount="responsive"
                            placeholder="Select member" 
                            allowClear 
                            options={withAllOption(MembersForDDL, "All Members")}
                            onChange={(e) => handleMultiSelectChange("members", e)}
                        />
                    </Form.Item>
                )}
                
                <Form.Item name="task_status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
                    <Select
                        mode="multiple"
                        maxTagCount="responsive"
                        placeholder="Select status"
                        allowClear 
                        options={withAllOption(statusListForDDL, "All Statuses")}
                        onChange={(e) => handleMultiSelectChange("task_status", e)}
                    />
                </Form.Item>

                <div className='flex items-end gap-2 mb-6'>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>Submit</Button>
                    <Button htmlType="reset">Reset</Button>
                </div>
            </Form>

            <br />

            {(Array.isArray(data) && data.length > 0) && (
                <div className="mb-6 flex items-center justify-between bg-blue-50 border border-blue-200 px-5 py-3 rounded-lg">
                    <span className="text-blue-800 font-medium text-base">
                        Total Reports Found
                    </span>
                    <span className="bg-blue-600 text-white font-bold text-sm px-4 py-1.5 rounded-full shadow-inner">
                        {data?.length || 0}
                    </span>
                </div>
            )}

            {Array.isArray(data) && (
                data.length > 0 
                ?
                <>
                    <TicketTable 
                        user={user}
                        data={data}
                        isPending={isLoading} 
                        showAlert={showAlert}
                        setUpdate={setUpdate} 
                        setIsFormOpen={setIsFormOpen}
                    /> 
                </>
                :
                <div className="text-gray-600 text-center leading-12 bg-white rounded-lg">
                    No Data Available
                </div>
            )}

            <Modal
                title={<Heading>Update Ticket</Heading>}
                centered
                open={isFormOpen}
                onCancel={closeForm}
                footer={null}
                width={1000}
                destroyOnClose
            >
                <br />
                <TicketForm 
                    isSubmitting={isUpdating}
                    onFormSubmit={onUpdateSubmit}
                    initialValues={{
                        ...update,
                        task_assigned_to: update?.task_assigned_to ? update.task_assigned_to.split(',') : [],
                        created_at: update?.created_at ? dayjs(update.created_at) : undefined,
                        task_deadline: update?.task_deadline ? dayjs(update.task_deadline) : undefined,
                        completed_at: update?.completed_at ? dayjs(update.completed_at) : undefined
                    }}
                />
            </Modal>
        </>
    )
};