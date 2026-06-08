import { Table, Spin, Badge, Result } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getAllContacts } from '../../api/contact.js';
import { useData } from '../../context/DataContext.jsx';

import { useAlert } from '../../utils/useAlert.jsx';
import { Header, Heading } from "../Header.jsx";
import { CreateContact } from "./CreateContact.jsx";
import { EditContact } from "./EditContact.jsx";
import { DeleteContact } from "./DeleteContact.jsx";


export default function Contacts() {
    const { user } = useData();
    const { alertComponent, showAlert } = useAlert();

    const { data, isLoading, error } = useQuery({
        queryKey: ["contacts"],
        queryFn: getAllContacts,
    });

    const COLUMNS_FOR_ADMIN = user?.role === "admin" ? [
        { title: 'Customer Code', dataIndex: 'customer_code', key: 'customer_code' },
        { title: 'Customer Name', dataIndex: 'customer_name', key: 'customer_name' }
    ] : [];

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
                <Heading>Contacts</Heading>
                <CreateContact showAlert={showAlert}/>
            </Header>

            <Table rowKey="contact_id" dataSource={data} scroll={{ x: 'max-content' }} columns={[
                ...COLUMNS_FOR_ADMIN,
                { title: 'Person Name', dataIndex: 'contact_person_name', key: 'contact_person_name' },
                { title: 'Phone Number', dataIndex: 'contact_phone', key: 'contact_phone' },
                { title: 'Email Address', dataIndex: 'contact_email', key: 'contact_email',
                    render: (value) => value ? value : "_"
                },
                {
                    title: 'Action', key: 'action',
                    render: (_, record) => (
                        <div className='flex items-center gap-3'>
                            <EditContact data={record} showAlert={showAlert}/>
                            <DeleteContact contactId={record.contact_id} showAlert={showAlert}/>
                        </div>
                    )
                }
            ]}/>
        </>
    )
};