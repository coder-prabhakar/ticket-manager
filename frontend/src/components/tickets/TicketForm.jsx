import { useData } from '../../context/DataContext';
import { Button, Typography, Form, Input, Select, DatePicker } from 'antd';
const { Title } = Typography;
const { TextArea } = Input;


export const TicketForm = ({ form, onFormSubmit, initialValues, isSubmitting }) => {
    const { user, MembersForDDL, CustomersForDDL, ProjectsForDDL, statusListForDDL } = useData();

    const selectedCustomer = Form.useWatch(
        "task_customer_code",
        form
    );

    const filteredProjects = selectedCustomer
        ? ProjectsForDDL.filter(project => project.customer_code === selectedCustomer)
        : [];

    return (
        <Form
            form={form}
            name="ticketForm" 
            layout="vertical"
            initialValues={initialValues}
            onFinish={onFormSubmit}
            autoComplete="off"
        >
            <Form.Item name="task_title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
                <Input 
                    placeholder="Enter a short summary of the issue or ticket" 
                    allowClear
                />
            </Form.Item>

            <Form.Item name="task_description" label="Description">
                <TextArea 
                    rows={3} 
                    placeholder="Describe the issue, requirements, expected outcome, and any relevant details" 
                    allowClear
                />
            </Form.Item>

            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                {user?.role !== "customer" && (
                    <Form.Item name="task_customer_code" label="Customer" rules={[{ required: true, message: 'Customer is required' }]}>
                        <Select 
                            showSearch={{ optionFilterProp: 'label' }}
                            placeholder="Select a Customer"
                            options={CustomersForDDL} 
                        />
                    </Form.Item>
                )}

                <Form.Item name="task_project_id" label="Project">
                    <Select 
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder="Select a Project"
                        options={user?.role === "customer" ? ProjectsForDDL : filteredProjects} 
                        allowClear
                    />
                </Form.Item>

                <Form.Item name="task_assigned_to" label="Assign To">
                    <Select 
                        mode="multiple"
                        maxTagCount="responsive"
                        showSearch={{ optionFilterProp: 'label' }}
                        placeholder="Assign To a Member"
                        options={MembersForDDL} 
                        allowClear
                    />
                </Form.Item>

                <Form.Item name="created_at" label="Created At" rules={[{ required: true, message: 'Created At is required' }]}>
                    <DatePicker className='w-full' allowClear={false}/>
                </Form.Item>

                {user?.role !== "customer" && (<>
                    <Form.Item name="task_deadline" label="Deadline">
                        <DatePicker className='w-full' allowClear/>
                    </Form.Item>

                    <Form.Item name="completed_at" label="Completed At">
                        <DatePicker className='w-full' allowClear/>
                    </Form.Item>
                            
                    <Form.Item name="task_status" label="Status" rules={[{ required: true, message: 'Status is required' }]}>
                        <Select placeholder="Assign To a Member" options={statusListForDDL} />
                    </Form.Item>
                </>)}
            </div>

            <div className='flex items-center justify-end gap-2 mt-3'>
                <Button type="primary" htmlType="submit" disabled={isSubmitting}>
                    { isSubmitting ? "Submit..." : "Submit" }
                </Button>

                <Button htmlType="reset">Reset</Button>
            </div>
        </Form>
    )
};