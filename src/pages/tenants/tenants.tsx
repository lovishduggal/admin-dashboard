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
} from 'antd';
import { Link, Navigate } from 'react-router-dom';
import { createTenant, getTenants } from '../../http/api';
import Spinner from '../../components/spinner/Spinner';
import { useMemo, useState } from 'react';
import TenantForm from './forms/TenantForm';
import { CreateTenantData, FieldData } from '../../types';
import { PER_PAGE } from '../../constants';
import TenantFilter from './TenantFilter';
import { debounce } from 'lodash';
import { useAuthStore } from '../../store';

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
    const { user } = useAuthStore();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [form] = Form.useForm();
    const [filterForm] = Form.useForm();
    const [queryParams, setQueryParams] = useState({
        perPage: PER_PAGE,
        currentPage: 1,
    });

    const {
        data: tenants,
        isFetching,
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
        enabled: user?.role === 'admin',
        placeholderData: keepPreviousData,
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

    const debounceQUpdate = useMemo(() => {
        return debounce((q: string | undefined) => {
            setQueryParams((prev) => {
                return { ...prev, q, currentPage: 1 };
            });
        }, 500);
    }, []);

    if (user?.role !== 'admin') {
        return <Navigate to="/"></Navigate>;
    }

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
                            { title: 'Tenants' },
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
                    <TenantFilter>
                        {' '}
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setDrawerOpen(true)}>
                            Create Tenant
                        </Button>
                    </TenantFilter>
                </Form>

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
                            showTotal: (total: number, range: number[]) =>
                                `Showing ${range[0]}-${range[1]} of ${total} items`,
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
