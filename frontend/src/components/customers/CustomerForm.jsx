import { Form, Input, Checkbox, Button } from 'antd';


export const CustomerForm = ({ isEdit, form, onFormSubmit, initialValues, isSubmitting }) => {
    return (
        <Form
            form={form}
            name="customerForm" 
            layout="vertical" 
            initialValues={initialValues}
            onFinish={onFormSubmit}
            autoComplete="off"
            className='md:grid md:grid-cols-2 md:gap-x-4'
        >
            <Form.Item name="customer_name" label="Customer Name" rules={[{ required: true, message: 'Customer name is required'  }]}>
                <Input />
            </Form.Item>

            <Form.Item name="customer_code" label="Customer Code" rules={[{ required: true, message: 'Customer code is required' }]}>
                <Input />
            </Form.Item>

            <Form.Item name="password" label="Password" rules={isEdit ? [] : [{ required: true, message: 'Password is required' }]}>
                <Input.Password />
            </Form.Item>

            <Form.Item name="customer_location" label="Customer Location" rules={[{ required: true, message: 'Customer Location is required'  }]}>
                <Input />
            </Form.Item>

            <Form.Item name="customer_status" valuePropName="checked" label={null} style={{margin: '8px 0 0'}}>
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

                <Button htmlType="button" onClick={() => form.resetFields()}>Reset</Button>
            </div>
        </Form>
    )
};