import { Table, Spin, Badge, Result } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getAllCustomers } from '../../api/customer.js';
import { useAlert } from '../../utils/useAlert.jsx';

import { Header, Heading } from "../Header.jsx";
import { CreateCustomer } from "./CreateCustomer.jsx";
import { EditCustomer } from "./EditCustomer.jsx";
import { DeleteCustomer } from "./DeleteCustomer.jsx";


export default function Customers() {
    const { alertComponent, showAlert } = useAlert();

    const { data, isLoading, error } = useQuery({
        queryKey: ["customers"],
        queryFn: getAllCustomers,
    });

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
                <Heading>Customers</Heading>
                <CreateCustomer showAlert={showAlert}/>
            </Header>

            <Table rowKey="customer_id" dataSource={data} scroll={{ x: 'max-content' }} columns={[
                { title: 'Customer Code', dataIndex: 'customer_code', key: 'customer_code' },
                { title: 'Customer Name', dataIndex: 'customer_name', key: 'customer_name' },
                { title: 'Customer Location', dataIndex: 'customer_location', key: 'customer_location' },
                {
                    title: 'Customer Status', dataIndex: 'customer_status', key: 'customer_status',
                    render: (value) => value ? 
                        <Badge count={"Active"} style={{ backgroundColor: '#52c41a' }}/>:
                        <Badge count={"Inactive"}/>
                },
                {
                    title: 'Action', key: 'action',
                    render: (_, record) => (
                        <div className='flex items-center gap-3'>
                            <EditCustomer customerData={record} showAlert={showAlert}/>
                            <DeleteCustomer customerID={record.customer_id} showAlert={showAlert}/>
                        </div>
                    )
                }
            ]}/>
        </>
    )
};