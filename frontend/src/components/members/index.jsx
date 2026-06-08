import { Table, Spin, Badge, Result } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getAllMembers } from '../../api/member.js';
import { useAlert } from '../../utils/useAlert.jsx';

import { Header, Heading } from "../Header.jsx";
import { EditMember } from "./EditMember.jsx";
import { CreateMember } from './CreateMember.jsx';
import { DeleteMember } from './DeleteMember.jsx';


export default function Members() {
    const { alertComponent, showAlert } = useAlert();

    const { data, isLoading, error } = useQuery({
        queryKey: ["members"],
        queryFn: getAllMembers,
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
                <Heading>Members</Heading>
                <CreateMember showAlert={showAlert}/>
            </Header>

            <Table rowKey="member_id" dataSource={data} scroll={{ x: 'max-content' }} columns={[
                { title: 'Code', dataIndex: 'member_code', key: 'member_code' },
                { title: 'Name', dataIndex: 'member_name', key: 'member_name' },
                { title: 'Role', dataIndex: 'member_role', key: 'member_role',
                    render: (value) => <span className='capitalize'>{value}</span>
                },
                { title: 'Phone', dataIndex: 'member_phone', key: 'member_phone', 
                    render: (value) => value ? value : "_"
                },
                { title: 'Email', dataIndex: 'member_email', key: 'member_email',
                    render: (value) => value ? value : "_"
                },
                {
                    title: 'Member Status', dataIndex: 'member_status', key: 'member_status',
                    render: (value) => value ? 
                        <Badge count={"Active"} style={{ backgroundColor: '#52c41a' }}/>:
                        <Badge count={"Inactive"}/>
                },
                {
                    title: 'Action', key: 'action',
                    render: (_, record) => (
                        <div className='flex items-center gap-3'>
                            <EditMember memberData={record} showAlert={showAlert}/>
                            <DeleteMember memberID={record.member_id} showAlert={showAlert}/>
                        </div>
                    )
                }
            ]}/>
        </>
    )
};