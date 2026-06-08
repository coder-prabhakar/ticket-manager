import { useData } from '../../context/DataContext';
import { Form, Input, Select, Checkbox, Button, InputNumber } from 'antd';


export const ContactForm = ({ form, onFormSubmit, initialValues, isSubmitting }) => {
    const { user, CustomersForDDL } = useData();

    return (
        <Form
            form={form}
            name="contactForm" 
            layout="vertical" 
            initialValues={initialValues}
            onFinish={onFormSubmit}
            autoComplete="off"
            className='md:grid md:grid-cols-2 md:gap-x-4'
        >
            {user.role === "admin" && (
                <Form.Item name="customer_code" label="Customer Name" rules={[{ required: true, message: 'Customer is required'  }]}>
                    <Select options={CustomersForDDL} allowClear/>
                </Form.Item>
            )}

            <Form.Item name="contact_person_name" label="Person Name" rules={[{ required: true, message: 'Name is required'  }]}>
                <Input />
            </Form.Item>

            <Form.Item
                name="contact_phone"
                label="Phone Number"
                rules={[
                    { required: true, message: "Phone is required" },
                    {
                        pattern: /^[6-9]\d{9}$/,
                        message: "Enter valid 10 digit phone number"
                    }
                ]}
            >
                <Input maxLength={10} />
            </Form.Item>

            <Form.Item
                name="contact_email"
                label="Email Address"
                rules={[
                    {
                        type: "email",
                        message: "Enter valid email"
                    }
                ]}
            >
                <Input />
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