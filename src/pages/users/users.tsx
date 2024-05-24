import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
    Alert,
    Breadcrumb,
    Button,
    Drawer,
    Flex,
    Form,
    Space,
    Table,
    theme,
} from 'antd';
import { Link, Navigate } from 'react-router-dom';
import { getUsers } from '../../http/api';
import Spinner from '../../components/spinner/Spinner';
import { UserData } from '../../types';
import { useAuthStore } from '../../store';
import UserFilter from './userFilter';
import { useState } from 'react';
import UserForm from './forms/UserForm';

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (_text: string, record: UserData) => {
            return (
                <div>
                    {record.firstName} {record.lastName}
                </div>
            );
        },
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
];

const Users = () => {
    const {
        token: { colorBgLayout },
    } = theme.useToken();
    const { user } = useAuthStore();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const {
        data: users,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['users'],
        queryFn: () => getUsers().then((res) => res.data),
        enabled: user?.role === 'admin',
    });

    if (user?.role !== 'admin') {
        return <Navigate to="/"></Navigate>;
    }

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
                        Create user
                    </Button>
                </UserFilter>

                {users && (
                    <Table columns={columns} dataSource={users} rowKey={'id'} />
                )}

                <Drawer
                    title="Create user"
                    width={720}
                    styles={{ body: { background: colorBgLayout } }}
                    open={drawerOpen}
                    destroyOnClose={true}
                    onClose={() => setDrawerOpen(false)}
                    extra={
                        <Space>
                            <Button>Cancel</Button>
                            <Button type="primary">Submit</Button>
                        </Space>
                    }>
                    <Form layout="vertical">
                        {' '}
                        <UserForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    );
};

export default Users;
