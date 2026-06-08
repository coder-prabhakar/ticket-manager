import { Heading } from './Header.jsx';
import { Comments } from "./Comments.jsx";
import { getStatusColor } from "../utils/getStatusColor.js";
import { Modal, Spin, Typography, Divider, Input, Button, Dropdown, DatePicker } from 'antd';

const { Title, Text } = Typography;


export const PreviewTaskModal = ({ task, isOpen, onClose }) => {
    const { task_id, task_title, task_description, task_status, customer_name, member_name, task_deadline } = task;

    const statusData = [
        { label: 'Pending', value: 'pending' },
        { label: 'In Progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Closed', value: 'closed' }
    ];

    return (
        <Modal
            title={<Heading type="secondary">{customer_name}</Heading>}
            centered
            open={isOpen}
            onCancel={onClose}
            footer={<></>}
            width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%'}}
        >
            {/*====== Title + Description ======*/}
            <div className="mt-4">
                <Title level={5}>{task_title}</Title>
                <Text>{task_description}</Text>
            </div>
            
            <div className="grid gap-4 mt-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                
                {/*====== Status ======*/}
                <div className="flex flex-col gap-0.5">
                    <span className="text-gray-500">Status</span>
                    <span className={`text-sm capitalize ${getStatusColor(task_status)}`}>
                        { statusData.find(item => item.value === task_status)?.label }
                    </span>
                </div>

                {/*====== Deadline ======*/}
                <div className="flex flex-col gap-0.5">
                    <span className="text-gray-500">Deadline</span>
                    <span className="text-sm text-gray-700">
                        { task_deadline ? new Date(task_deadline).toLocaleDateString("en-CA") : "N/A" }
                    </span>
                </div>

                {/*====== Assign To ======*/}
                <div className="flex flex-col gap-0.5">
                    <span className="text-gray-500">Assign To</span>
                    <span className="text-sm text-gray-700">
                        { member_name ? member_name : "N/A" }
                    </span>
                </div>

            </div>

            <Comments taskId={task_id}/>
        </Modal>
    )
};