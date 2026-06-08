import { useAlert } from "../../utils/useAlert.jsx";
import { useData } from "../../context/DataContext.jsx";

import { Header, Heading } from "../Header.jsx";
import { AiFillProfile } from "react-icons/ai";
import { Spin, Result, Table, Button, Typography, DatePicker, Divider, Form } from 'antd';
import { FaRegCircle, FaCircleHalfStroke, FaCircleCheck, FaCircleXmark } from "react-icons/fa6";

const { Title } = Typography;


export default function Dashboard() {
    const { alertComponent, showAlert } = useAlert();

    // showAlert("error", "title", "description");
    
    const { 
        user, 
        isLoading, 
        error, 
        fromDate, 
        toDate, 
        setFromDate, 
        setToDate, 
        DashboardStats, 
        MembersForDDL, 
        CustomersForDDL 
    } = useData();

    const cards = [
        { title: "Total Tickets", count: DashboardStats?.TotalTasks, icon: AiFillProfile, color: "text-[#B500B2]" },
        { title: "Closed", count: DashboardStats?.ClosedTasks, icon: FaCircleXmark, color: "text-gray-500" }, 
        { title: "Completed", count: DashboardStats?.CompletedTasks, icon: FaCircleCheck, color: "text-green-600" },
        { title: "In Progress", count: DashboardStats?.InProgressTasks, icon: FaCircleHalfStroke, color: "text-blue-600" },
        { title: "Pending", count: DashboardStats?.PendingTasks, icon: FaRegCircle, color: "text-yellow-600" },
    ];

    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        const selectedFromDate = values.fromDate;
        const selectedToDate = values.toDate;

        if (selectedFromDate && selectedToDate && selectedFromDate.isAfter(selectedToDate)) {
            showAlert(
                "error",
                "Invalid Date Range",
                "From Date cannot be greater than To Date."
            );
            return;
        }

        const formatedFromDate = selectedFromDate?.format("YYYY-MM-DD") || null;
        const formatedToDate = selectedToDate?.format("YYYY-MM-DD") || null;

        if (formatedFromDate === fromDate && formatedToDate === toDate) return;

        setFromDate(formatedFromDate);
        setToDate(formatedToDate);
    };

    const handleReset = () => {
        form.resetFields();
        setFromDate(null) 
        setToDate(null)
    };

    if (isLoading) return (
        <div className='h-full w-full flex items-center justify-center'>
            <Spin description="Loading" size="large"/>
        </div>
    );

    if(error) return (
        <div className='w-full h-full flex items-center justify-center'>
            <Result status="warning" title={error?.message}/>
        </div>
    );

    return (
        <>
            {alertComponent}

            <Header>
                <Heading>Dashboard</Heading>

                <Form
                    form={form}
                    layout="inline"
                    onFinish={handleSubmit}
                    className="w-full md:w-max"
                >
                    <div className="w-full md:w-max grid grid-cols-2 md:grid-cols-[160px_160px_auto_auto] gap-2">
                        <Form.Item
                            name="fromDate"
                            className="mb-0! mr-0! col-span-2 md:col-span-1"
                        >
                            <DatePicker
                                className="w-full"
                                placeholder="Select from date"
                                allowClear
                            />
                        </Form.Item>

                        <Form.Item
                            name="toDate"
                            className="mb-0! mr-0! col-span-2 md:col-span-1"
                        >
                            <DatePicker
                                className="w-full"
                                placeholder="Select to date"
                                allowClear
                            />
                        </Form.Item>

                        <Button
                            type="primary"
                            htmlType="submit"
                        >
                            Submit
                        </Button>

                        <Button
                            htmlType="button"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                    </div>
                </Form>
            </Header>

            <section className="grid gap-4 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))' }}>
                {cards.map((card, index) => (
                    <div key={index} className="bg-white p-4 rounded-sm shadow-sm">
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{card.title}</p>
                        <h3 className="text-xl font-medium text-gray-800 mt-2 flex items-center justify-between">
                            <span>{card.count}</span>
                            <card.icon className={card.color}/>
                        </h3>
                        <p className="text-gray-400 text-[10px] mt-2">Overall Data</p>
                    </div>
                ))}
            </section>

            {user?.role === "admin" && (
            <>
                <Divider titlePlacement="start">
                {(() => {
                    if (!fromDate && !toDate) {
                    return "Member Wise Tasks in This Month";
                    }

                    if (fromDate && !toDate) {
                    return `Member Wise Tasks From ${fromDate}`;
                    }

                    if (!fromDate && toDate) {
                    return `Member Wise Tasks Till ${toDate}`;
                    }

                    return `Member Wise Tasks From ${fromDate} To ${toDate}`;
                })()}
                </Divider>

                <Table rowKey="contact_id" dataSource={MembersForDDL} pagination={{ pageSize: 5 }} scroll={{ x: 'max-content' }} columns={[
                    { title: 'Member Name', dataIndex: 'label', key: 'label' },
                    { title: 'Total Tasks', dataIndex: 'TotalTasks', key: 'TotalTasks' },
                    { title: 'Closed Tasks', dataIndex: 'ClosedTasks', key: 'ClosedTasks' },
                    { title: 'Completed Tasks', dataIndex: 'CompletedTasks', key: 'CompletedTasks' },
                    { title: 'In Progress Tasks', dataIndex: 'InProgressTasks', key: 'InProgressTasks' },
                    { title: 'Pending Tasks', dataIndex: 'PendingTasks', key: 'PendingTasks' },
                ]}/>

                <Divider titlePlacement="start">
                {(() => {
                    if (!fromDate && !toDate) {
                    return "Customer Wise Tasks in This Month";
                    }

                    if (fromDate && !toDate) {
                    return `Customer Wise Tasks From ${fromDate}`;
                    }

                    if (!fromDate && toDate) {
                    return `Customer Wise Tasks Till ${toDate}`;
                    }

                    return `Customer Wise Tasks From ${fromDate} To ${toDate}`;
                })()}
                </Divider>

                <Table rowKey="contact_id" dataSource={CustomersForDDL} pagination={{ pageSize: 5 }} scroll={{ x: 'max-content' }} columns={[
                    { title: 'Customer Name', dataIndex: 'label', key: 'label' },
                    { title: 'Total Tasks', dataIndex: 'TotalTasks', key: 'TotalTasks' },
                    { title: 'Closed Tasks', dataIndex: 'ClosedTasks', key: 'ClosedTasks' },
                    { title: 'Completed Tasks', dataIndex: 'CompletedTasks', key: 'CompletedTasks' },
                    { title: 'In Progress Tasks', dataIndex: 'InProgressTasks', key: 'InProgressTasks' },
                    { title: 'Pending Tasks', dataIndex: 'PendingTasks', key: 'PendingTasks' },
                ]}/>
            </>
            )}
        </>
    )
};