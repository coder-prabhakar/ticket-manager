import { useState } from "react";
import { useAlert } from "../../utils/useAlert.jsx";
import { useReport } from "../../hooks/useReport.js";
import { useData } from "../../context/DataContext.jsx";
import { getDataFromLocalStorage } from "../../utils/localStorage.js";

import { Header, Heading } from "../Header.jsx";
import { TicketTable } from "../tickets/TicketTable.jsx";
import { Form, Select, DatePicker, Input, Button } from 'antd';

const { Search } = Input;


export default function Reports() {

    const [searchValue, setSearchValue] = useState("");
    const [filters, setFilters] = useState(null);

    const { user } = getDataFromLocalStorage() || {};
    const { alertComponent, showAlert } = useAlert();
    const { MembersForDDL, CustomersForDDL } = useData();

   // REPORT QUERY
    const {
        data: reportData,
        isPending: isReportLoading
    } = useReport({
        showAlert,
        filters
    });

    const onFormSubmit = values => {
        setSearchValue("");

        const payload = {
            ...values,
            from_date: values.from_date ? values.from_date.format("YYYY-MM-DD") : undefined,
            to_date: values.to_date ? values.to_date.format("YYYY-MM-DD") : undefined
        };

        setFilters(payload);
    };

    const filteredReportData = reportData?.filter((item) => 
        item.task_title?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.task_status?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.customer_name?.toLowerCase().includes(searchValue.toLowerCase()) || 
        item.member_name?.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <>
            {alertComponent}

            <Header>
                <Heading>Reports</Heading>

                <Search 
                    onSearch={(v) => setSearchValue(v.trim())} 
                    placeholder="Search..." 
                    className='max-w-75'
                    enterButton 
                    allowClear
                />
            </Header>

            <Form
                name="reportForm" 
                layout="vertical"
                onFinish={onFormSubmit}
                autoComplete="off"
                className='bg-white rounded-lg grid gap-3'
                style={{ padding: "24px 24px 0", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
            >
                <Form.Item name="from_date" label="From Date">
                    <DatePicker placeholder="Select from date" className='w-full' allowClear/>
                </Form.Item>

                <Form.Item name="to_date" label="To Date">
                    <DatePicker placeholder="Select to date" className='w-full' allowClear/>
                </Form.Item>

                {user?.role !== "customer" && (
                    <Form.Item name="task_customer_code" label="Customer">
                        <Select options={CustomersForDDL} placeholder="Select customer" allowClear/>
                    </Form.Item>
                )}

                {(user?.role === "admin" || user?.role === "customer") && (
                    <Form.Item name="task_assigned_to" label="Member">
                        <Select options={MembersForDDL} placeholder="Select member" allowClear/>
                    </Form.Item>
                )}

                <div className='flex items-end gap-2 mb-6'>
                    <Button type="primary" htmlType="submit">Submit</Button>
                    <Button htmlType="reset">Reset</Button>
                </div>
            </Form>

            <br /> 

            <TicketTable 
                isReportpage={true}
                isPending={isReportLoading} 
                data={filteredReportData}
                showAlert={showAlert}
                user={user}
            />
        </>
    )
};