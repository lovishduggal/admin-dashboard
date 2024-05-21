import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Alert, Breadcrumb, Button, Drawer, Flex, Space, Table } from 'antd';
import { Link, Navigate } from 'react-router-dom';
import { getTenants } from '../../http/api';
import Spinner from '../../components/spinner/Spinner';
import { useAuthStore } from '../../store';
import UserFilter from './tenantFilter';
import { useState } from 'react';

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
    const { user } = useAuthStore();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const {
        data: tenants,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => getTenants().then((res) => res.data),
        enabled: user?.role === 'admin',
    });

    if (user?.role !== 'admin') {
        return <Navigate to="/"></Navigate>;
    }
    console.log(tenants);

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
                        dataSource={tenants}
                        rowKey={'id'}
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
                            <Button>Cancel</Button>
                            <Button type="primary">Submit</Button>
                        </Space>
                    }>
                    <p>Some contents...</p>
                </Drawer>
            </Space>
        </>
    );
};

export default Tenants;
