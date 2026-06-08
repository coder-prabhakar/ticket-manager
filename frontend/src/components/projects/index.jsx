import { useState, useEffect } from 'react';
import { Header, Heading } from "../Header.jsx";
import { ProjectForm } from './ProjectForm.jsx';
import { Table, Spin, Badge, Result, Form, Button, Modal } from 'antd';
import { useAlert } from '../../utils/useAlert.jsx';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../../hooks/useProject.js';


export default function Projects() {
    const [update, setUpdate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [form] = Form.useForm();

    useEffect(() => {
        if (isModalOpen) {
            if (update) {
                form.setFieldsValue(update);
            } else {
                form.setFieldsValue({
                    customer_code: undefined,
                    project_name: '',
                    project_status: true
                });
            }
        }
    }, [update, isModalOpen, form]);

    const closeForm = () => {
        form.resetFields();
        setUpdate(null);
        setIsModalOpen(false);
    };
    
    const onFormSubmit = values => {
        if(update){
            updateProject({ project_id: update.project_id, data: values });
        } else {
            createProject(values);
        }
    };

    const { alertComponent, showAlert } = useAlert();

    const { data, isLoading, error } = useProjects();
    const { mutate: deleteProject, isLoading: isDeletingPending } = useDeleteProject({ showAlert });
    const { mutate: createProject, isPending: isCreatingPending } = useCreateProject({ closeForm, showAlert });
    const { mutate: updateProject, isPending: isUpdatingPending } = useUpdateProject({ closeForm, showAlert });

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
                <Heading>Projects</Heading>

                <Button type="primary" onClick={() => {
                    setUpdate(null);
                    setIsModalOpen(true);
                }}>
                    Create
                </Button>
            </Header>

            <Table rowKey="project_id" dataSource={data} scroll={{ x: 'max-content' }} columns={[
                { title: 'Customer Code', dataIndex: 'customer_code', key: 'customer_code' },
                { title: 'Customer Name', dataIndex: 'customer_name', key: 'customer_name' },
                { title: 'Project Name', dataIndex: 'project_name', key: 'project_name' },
                {
                    title: 'Project Status', dataIndex: 'project_status', key: 'project_status',
                    render: (value) => value ? 
                        <Badge count={"Active"} style={{ backgroundColor: '#52c41a' }}/>:
                        <Badge count={"Inactive"}/>
                },
                {
                    title: 'Action', key: 'action',
                    render: (_, record) => (
                        <div className='flex items-center gap-3'>
                            <Button color="primary" variant="solid" size="small" onClick={() => {
                                setUpdate(record);
                                setIsModalOpen(true);
                            }}>
                                Update
                            </Button>

                            <Button 
                                color="danger" variant="solid" size="small" 
                                onClick={() => deleteProject(record.project_id)}
                                disabled={isDeletingPending}
                            >
                                Delete
                            </Button>
                        </div>
                    )
                }
            ]}/>

            <Modal
                title={<Heading>{update ? "Update" : "Create"} Project</Heading>}
                centered
                open={isModalOpen}
                onCancel={closeForm}
                footer={null}
                width={{ xs: '90%', sm: '80%', md: '70%', lg: '60%', xl: '50%', xxl: '40%'}}
                destroyOnClose
            >
                <br />
                <ProjectForm 
                    form={form}
                    onFormSubmit={onFormSubmit}
                    initialValues={update ? update : { project_status: true }}
                    isSubmitting={update ? isUpdatingPending : isCreatingPending}
                />
            </Modal>
        </>
    )
};