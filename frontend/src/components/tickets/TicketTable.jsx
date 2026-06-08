import dayjs from 'dayjs';
import { useState } from 'react';
import { Heading } from '../Header.jsx';
import { TicketDetails } from './TicketDetails.jsx';
import { StatusBadge } from '../StatusBadge.jsx';
import { FaAngleDown } from "react-icons/fa6";
import { MdRemoveRedEye, MdEdit } from "react-icons/md";
import { Modal, Checkbox, Table, Button, Dropdown, Space } from 'antd';

const columns = [
    { title: 'Customer Code', dataIndex: 'customer_code', key: 'customer_code' },
    { title: 'Customer Name', dataIndex: 'customer_name', key: 'customer_name' },
    { title: 'Project Name', dataIndex: 'project_name', key: 'project_name', 
        render: (value) => value ? value : "-"
    },
    { title: 'Task Title', dataIndex: 'task_title', key: 'task_title' },
    { title: 'Member Code', dataIndex: 'member_code', key: 'member_code', 
        render: (value) => value ? value : "-"
    },
    { title: 'Member Name', dataIndex: 'member_name', key: 'member_name', 
        render: (value) => value ? value : "-"
    },
    { title: 'Status', dataIndex: 'task_status', key: 'task_status',
        render: (status) => <StatusBadge status={status}/> 
    },
    { title: 'Days Taken', dataIndex: 'total_days', key: 'total_days' ,
        render: (v) => v > 1 ? v + ' Days' : v + ' Day'
    },
    { title: 'Created', dataIndex: 'created_at', key: 'created_at', 
        render: (date) => {
            if (!date) return "-";
            return dayjs(date).format("DD-MM-YYYY");
        }
    },
    { title: 'Completed', dataIndex: 'completed_at', key: 'completed_at', 
        render: (date) => {
            if (!date) return "-";
            return dayjs(date).format("DD-MM-YYYY");
        }
    },
    { title: 'Deadline', dataIndex: 'task_deadline', key: 'task_deadline',
        render: (date) => {
            if (!date) return "-";
            return dayjs(date).format("DD-MM-YYYY");
        }
    }
];

const defaultCheckedList = [
    "customer_name",
    "project_name",
    "task_title",
    "member_name",
    "task_status",
    "total_days"
];


export const TicketTable = ({ isReportpage, isLoading, data, showAlert, setUpdate, setIsFormOpen }) => {
    const [previewTicket, setPreviewTicket] = useState(null);
    
    const [open, setOpen] = useState(false);

    const handleOpenChange = (nextOpen, info) => {
        if (info.source === 'trigger' || nextOpen) {
            setOpen(nextOpen);
        }
    };

    const [checkedList, setCheckedList] = useState(defaultCheckedList);

    const options = columns.map(({ key, title }) => ({
        label: title,
        value: key,
    }));

    const newColumns = columns.map(item => ({
        ...item,
        hidden: !checkedList.includes(item.key),
    }));

    const renderContactItems = (contactListStr) => {
        try {
            const contacts = JSON.parse(contactListStr || "[]");
            
            if (contacts.length === 0) {
                return [{ key: 'empty', label: <span className="text-xs text-gray-400 px-2">No contact available</span> }];
            }

            return contacts.map((item, index) => ({
                key: `contact-${index}`,
                label: (
                    <div className="flex flex-col py-1 px-2 min-w-45">
                        <span className="font-semibold text-gray-800 text-sm">{item.name}</span>
                        <span className="text-xs text-gray-600 mt-0.5">{item.phone}</span>
                    </div>
                )
            }));
        } catch (e) {
            return [{ key: 'err', label: <span className="text-xs text-red-500">Invalid data</span> }];
        }
    };

    return (
        <>
            <Checkbox.Group
                value={checkedList}
                options={options}
                onChange={value => {
                    setCheckedList(value);
                }}
            />

            <Table 
                rowKey="task_id" 
                loading={isLoading} 
                dataSource={data} 
                scroll={{ x: 'max-content' }} 
                columns={[...newColumns, {
                    title: '', key: 'action', fixed: 'end',
                    render: (_, record) => (
                        <div className='flex items-center gap-3'>
                            <Button 
                                color="primary" variant="solid" size="medium" 
                                onClick={() => setPreviewTicket(record)}
                            >
                               <MdRemoveRedEye className='text-lg'/>
                            </Button>

                            {!isReportpage && (
                                <Button 
                                    color="gold" variant="solid" size="medium" 
                                    onClick={() => {
                                        setUpdate(record);
                                        setIsFormOpen(true);
                                    }}
                                >
                                    <MdEdit className='text-lg'/>
                                </Button>
                            )}
                        </div>
                    )
                }]} 
                style={{ marginTop: 16 }}
            />

            {/* ===== Preview Ticket Modal ===== */}
            {previewTicket  && (
                <Modal
                    title={
                        <div className='flex items-center justify-between gap-4 flex-wrap border-b border-slate-100 pb-4 pr-8 mb-6'>
                            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                                Ticket Details
                            </h2>
                            
                            <Dropdown 
                                menu={{ items: renderContactItems(previewTicket.contact_list) }} 
                                onOpenChange={handleOpenChange}
                                open={open}
                                className='overflow-y-auto'
                            >
                                <button className="px-3 py-1 text-sm font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                                    <span>Contacts</span> 
                                    <FaAngleDown />
                                </button>
                            </Dropdown>
                        </div>
                    }
                    centered
                    open={previewTicket}
                    onCancel={() => setPreviewTicket(null)}
                    footer={<></>}
                    width={1000}
                >
                    <div className="max-h-[80vh] overflow-y-auto">
                        <TicketDetails 
                            ticket={previewTicket} 
                            showAlert={showAlert}
                        />
                    </div>
                </Modal>
            )}
        </>
    )
}