import { Form, Input, Select, Checkbox, Button, InputNumber } from 'antd';


export const MemberForm = ({ isEdit, form, onFormSubmit, initialValues, isSubmitting }) => {
    return (
        <Form
            form={form}
            name="memberForm" 
            layout="vertical" 
            initialValues={initialValues}
            onFinish={onFormSubmit}
            autoComplete="off"
            className='md:grid md:grid-cols-2 md:gap-x-4'
        >
            <Form.Item name="member_name" label="Member Name" rules={[{ required: true, message: 'Member name is required'  }]}>
                <Input />
            </Form.Item>

            <Form.Item name="member_code" label="Member Code" rules={[{ required: true, message: 'Member code is required' }]}>
                <Input />
            </Form.Item>

            <Form.Item name="password" label="Password" rules={isEdit ? [] : [{ required: true, message: 'Password is required' }]}>
                <Input.Password />
            </Form.Item>

            <Form.Item name="member_role" label="Member Role" rules={[{ required: true, message: 'Member role is required'  }]}>
                <Select options={[
                    { label: "Admin", value: "admin" },
                    { label: "HR", value: "HR" },
                    { label: "Team Leader", value: "Team Leader" },
                    { label: "Project Manager", value: "Project Manager" },
                    { label: "Software Developer", value: "Software Developer" }
                ]} allowClear/>
            </Form.Item>

            <Form.Item
                name="member_phone"
                label="Member Phone"
                rules={[
                    {
                        pattern: /^[6-9]\d{9}$/,
                        message: "Enter valid 10 digit phone number"
                    }
                ]}
            >
                <Input maxLength={10} />
            </Form.Item>

            <Form.Item
                name="member_email"
                label="Member Email"
                rules={[
                    {
                        type: "email",
                        message: "Enter valid email"
                    }
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item name="member_status" valuePropName="checked" label={null} style={{margin: '8px 0 0'}}>
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