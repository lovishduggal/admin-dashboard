import { useQuery } from '@tanstack/react-query';
import { Card, Col, Form, Input, Row, Select, Space } from 'antd';
import { getTenants } from '../../../http/api';
import { Tenant } from '../../../types';
import { useAuthStore } from '../../../store';

const UserForm = () => {
    const { user } = useAuthStore();
    const { data: tenants } = useQuery({
        queryKey: ['tenants'],
        queryFn: () => getTenants().then((res) => res.data),
        enabled: user?.role === 'admin',
    });

    return (
        <Row>
            <Col span={24}>
                <Space direction="vertical" size={'large'}>
                    <Card title={'Basic info'} bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label={'First name'}
                                    name="firstName"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please input your first name!',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={'Last name'}
                                    name="lastName"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please input your last name!',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={'Email'}
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please input your last email!',
                                        },
                                        {
                                            type: 'email',
                                            message: 'Invalid email!',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card title={'Security info'} bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label={'Password'}
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please input your password!',
                                        },
                                    ]}>
                                    <Input size="large" type="password" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card title={'Role'} bordered={false}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label={'Role'}
                                    name="role"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select role!',
                                        },
                                    ]}>
                                    <Select
                                        size="large"
                                        placeholder={'Role'}
                                        style={{ width: '100%' }}
                                        allowClear
                                        onChange={() => {}}>
                                        <Select.Option
                                            value="amin"
                                            children={'Admin'}
                                        />
                                        <Select.Option
                                            value="manager"
                                            children={'Manager'}
                                        />
                                        <Select.Option
                                            value="customer"
                                            children={'Customer'}
                                        />
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label={'Restaurant'}
                                    name="tenantId"
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                'Please select restaurant!',
                                        },
                                    ]}>
                                    <Select
                                        size="large"
                                        placeholder={'Tenant'}
                                        style={{ width: '100%' }}
                                        allowClear
                                        onChange={() => {}}>
                                        {tenants &&
                                            tenants.map((tenant: Tenant) => (
                                                <Select.Option
                                                    key={tenant.id}
                                                    value={tenant.id}
                                                    children={tenant.name}
                                                />
                                            ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                </Space>
            </Col>
        </Row>
    );
};

export default UserForm;
