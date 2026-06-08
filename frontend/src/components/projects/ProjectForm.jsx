import { useData } from '../../context/DataContext';
import { Form, Input, Select, Checkbox, Button, InputNumber } from 'antd';


export const ProjectForm = ({ form, onFormSubmit, initialValues, isSubmitting }) => {
    const { CustomersForDDL } = useData();

    return (
        <Form
            form={form}
            name="projectForm" 
            layout="vertical" 
            initialValues={initialValues}
            onFinish={onFormSubmit}
            autoComplete="off"
            className='md:grid md:grid-cols-2 md:gap-x-4'
        >
            <Form.Item name="customer_code" label="Customer" rules={[{ required: true, message: 'Customer is required' }]}>
                <Select options={CustomersForDDL} allowClear />
            </Form.Item>

            <Form.Item name="project_name" label="Project Name" rules={[{ required: true, message: 'Project name is required' }]}>
                <Input />
            </Form.Item>

            <Form.Item name="project_status" valuePropName="checked" label={null} style={{margin: '8px 0 0'}}>
                <Checkbox>Is Active</Checkbox>
            </Form.Item>

            <div className='flex items-center gap-2 mt-3'>
                <Button 
                    type="primary" 
                    htmlType="submit"
                    disabled={isSubmitting}
                >
                        { isSubmitting ? "Submit..." : "Submit" }
                </Button>

                <Button htmlType="reset">Reset</Button>
            </div>
        </Form>
    )
};