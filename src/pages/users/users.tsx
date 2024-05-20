import { RightOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { Alert, Breadcrumb, Flex, Space, Table } from 'antd';
import { Link, Navigate } from 'react-router-dom';
import { getUsers } from '../../http/api';
import Spinner from '../../components/spinner/Spinner';
import { UserData } from '../../types';
import { useAuthStore } from '../../store';
import UserFilter from './userFilter';

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

const User = () => {
    const { user } = useAuthStore();

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
                    }}
                />

                {users && (
                    <Table columns={columns} dataSource={users} rowKey={'id'} />
                )}
            </Space>
        </>
    );
};

export default User;
