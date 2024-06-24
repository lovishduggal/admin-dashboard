import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
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
import { createUser, getUsers, updateUser } from '../../http/api';
import Spinner from '../../components/spinner/Spinner';
import { CreateUserData, FieldData, UserData } from '../../types';
import { useAuthStore } from '../../store';

import { useEffect, useMemo, useState } from 'react';
import UserForm from './forms/UserForm';
import { PER_PAGE } from '../../constants';
import { debounce } from 'lodash';
import UserFilter from './UserFilter';

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
    {
        title: 'Restaurant',
        dataIndex: 'tenant',
        key: 'tenant',
        render: (_text: string, record: UserData) => {
            return <div>{record.tenant?.name}</div>;
        },
    },
];

const Users = () => {
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();

    const [currentEditingUser, setCurrentEditingUser] =
        useState<UserData | null>(null);

    const queryClient = useQueryClient();

    const {
        token: { colorBgLayout },
    } = theme.useToken();

    const { user } = useAuthStore();

    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (currentEditingUser) {
            setDrawerOpen(true);
            form.setFieldsValue({
                ...currentEditingUser,
                tenantId: currentEditingUser.tenant?.name,
            });
        }
    }, [currentEditingUser, form]);

    const [queryParams, setQueryParams] = useState({
        perPage: PER_PAGE,
        currentPage: 1,
    });

    const {
        data: users,
        isFetching,
        isError,
        error,
    } = useQuery({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            const filteredParams = Object.entries(queryParams).filter(
                (item) => !!item[1]
            );

            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>
            ).toString();
            return getUsers(queryString).then((res) => res.data);
        },
        enabled: user?.role === 'admin',
        placeholderData: keepPreviousData,
    });

    const { mutate: userMutate } = useMutation({
        mutationKey: ['user'],
        mutationFn: (data: CreateUserData) =>
            createUser(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const { mutate: userUpdateMutate } = useMutation({
        mutationKey: ['userUpdate'],
        mutationFn: (data: CreateUserData) =>
            updateUser(data, currentEditingUser!.id).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            return;
        },
    });

    const debounceQUpdate = useMemo(() => {
        return debounce((q: string | undefined) => {
            setQueryParams((prev) => {
                return { ...prev, q, currentPage: 1 };
            });
        }, 500);
    }, []);

    const onFilterChange = (changeFields: FieldData[]) => {
        const changedFilterFields = changeFields
            .map((item) => ({
                [item.name[0]]: item.value,
            }))
            .reduce((prev, curr) => ({ ...prev, ...curr }), {});

        if ('q' in changedFilterFields) {
            debounceQUpdate(changedFilterFields.q);
        } else {
            setQueryParams((prev) => {
                return { ...prev, ...changedFilterFields, currentPage: 1 };
            });
        }
    };
    if (user?.role !== 'admin') {
        return <Navigate to="/"></Navigate>;
    }

    const onHandleSubmit = async () => {
        await form.validateFields();

        const isEditMode = !!currentEditingUser;
        if (isEditMode) await userUpdateMutate(form.getFieldsValue());
        else await userMutate(form.getFieldsValue());

        setDrawerOpen(false);
        form.resetFields();
        setCurrentEditingUser(null);
    };

    return (
        <>
            <Space
                direction="vertical"
                size={'large'}
                style={{ width: '100%' }}>
                <Flex justify="space-between" align="center">
                    <Breadcrumb
                        style={{ padding: '12px 0' }}
                        separator={<RightOutlined />}
                        items={[
                            { title: <Link to="/">Dashboard</Link> },
                            { title: 'Users' },
                        ]}
                    />
                    {isFetching && (
                        <Flex align="center" justify="center" gap="middle">
                            <Spinner />
                        </Flex>
                    )}
                    {isError && (
                        <Alert message={error.message} type="error" closable />
                    )}
                </Flex>
                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <UserFilter>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setDrawerOpen(true)}>
                            Create user
                        </Button>
                    </UserFilter>
                </Form>
                <Table
                    columns={[
                        ...columns,
                        {
                            title: 'Actions',
                            key: 'action',
                            render: (_: string, record: UserData) => {
                                return (
                                    <Space>
                                        <Button
                                            type="link"
                                            onClick={() => {
                                                setCurrentEditingUser(record);
                                            }}>
                                            Edit
                                        </Button>
                                    </Space>
                                );
                            },
                        },
                    ]}
                    dataSource={users?.data}
                    rowKey={'id'}
                    pagination={{
                        total: users?.total,
                        defaultPageSize: queryParams.perPage,
                        current: queryParams.currentPage,
                        onChange: (page) => {
                            setQueryParams((prev) => {
                                return { ...prev, currentPage: page };
                            });
                        },
                        showTotal: (total: number, range: number[]) =>
                            `Showing ${range[0]}-${range[1]} of ${total} items`,
                    }}
                />

                <Drawer
                    title={currentEditingUser ? 'Edit user' : 'Create user'}
                    width={720}
                    styles={{ body: { background: colorBgLayout } }}
                    open={drawerOpen}
                    destroyOnClose={true}
                    onClose={() => {
                        form.resetFields();
                        setDrawerOpen(false);
                        setCurrentEditingUser(null);
                    }}
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
                        {' '}
                        <UserForm isEditMode={!!currentEditingUser} />
                    </Form>
                </Drawer>
            </Space>
        </>
    );
};

export default Users;
