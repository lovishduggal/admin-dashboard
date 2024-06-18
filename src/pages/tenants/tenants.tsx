import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Alert,
    Breadcrumb,
    Button,
    Drawer,
    Flex,
    Form,
    Space,
    Table,
} from 'antd';
import { Link } from 'react-router-dom';
import { createTenant, getTenants } from '../../http/api';
import Spinner from '../../components/spinner/Spinner';
import UserFilter from './TenantFilter';
import { useState } from 'react';
import TenantForm from './forms/TenantForm';
import { CreateTenantData } from '../../types';
import { PER_PAGE } from '../../constants';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
];

const Tenants = () => {
    const queryClient = useQueryClient();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [form] = Form.useForm();
    const [queryParams, setQueryParams] = useState({
        perPage: PER_PAGE,
        currentPage: 1,
    });

    const {
        data: tenants,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['tenants', queryParams],
        queryFn: () => {
            const filteredParams = Object.entries(queryParams).filter(
                (item) => !!item[1]
            );

            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>
            ).toString();
            return getTenants(queryString).then((res) => res.data);
        },
    });

    const { mutate: tenantMutate } = useMutation({
        mutationKey: ['tenant'],
        mutationFn: (data: CreateTenantData) =>
            createTenant(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['tenants'] });
        },
    });

    const onHandleSubmit = async () => {
        await form.validateFields();
        await tenantMutate(form.getFieldsValue());
        setDrawerOpen(false);
        form.resetFields();
    };

    return (
        <>
            <Space
                direction="vertical"
                size={'large'}
                style={{ width: '100%' }}>
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        { title: <Link to="/">Dashboard</Link> },
                        { title: 'Users' },
                    ]}
                />
                {isLoading && (
                    <Flex
                        style={{ height: 'calc(100vh - 206px)' }}
                        align="center"
                        justify="center"
                        gap="middle">
                        <Spinner />
                    </Flex>
                )}
                {isError && (
                    <Alert message={error.message} type="error" closable />
                )}

                <UserFilter
                    onFilterChange={(filterName, filterValue) => {
                        console.log(filterName, filterValue);
                    }}>
                    {' '}
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setDrawerOpen(true)}>
                        Create Tenant
                    </Button>
                </UserFilter>

                {tenants && (
                    <Table
                        columns={columns}
                        dataSource={tenants?.data}
                        rowKey={'id'}
                        pagination={{
                            total: tenants?.total,
                            defaultPageSize: queryParams.perPage,
                            current: queryParams.currentPage,
                            onChange: (page) => {
                                setQueryParams((prev) => {
                                    return { ...prev, currentPage: page };
                                });
                            },
                        }}
                    />
                )}

                <Drawer
                    title="Create Tenant"
                    width={720}
                    open={drawerOpen}
                    destroyOnClose={true}
                    onClose={() => setDrawerOpen(false)}
                    extra={
                        <Space>
                            <Button
                                onClick={() => {
                                    setDrawerOpen(false);
                                    form.resetFields();
                                }}>
                                Cancel
                            </Button>
                            <Button type="primary" onClick={onHandleSubmit}>
                                Submit
                            </Button>
                        </Space>
                    }>
                    <Form layout="vertical" form={form}>
                        <TenantForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    );
};

export default Tenants;
