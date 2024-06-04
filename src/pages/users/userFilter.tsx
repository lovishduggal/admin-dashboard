import { Card, Col, Form, Input, Row, Select } from 'antd';

type UserFilterProps = {
    children: React.ReactNode;
};

const UserFilter = ({ children }: UserFilterProps) => {
    return (
        <Card>
            <Row justify={'space-between'}>
                <Col span={16}>
                    {' '}
                    <Row gutter={20}>
                        <Col span={8}>
                            <Form.Item name="q">
                                <Input.Search
                                    allowClear={true}
                                    style={{ width: '100%' }}
                                    placeholder="Search"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name={'role'}>
                                <Select
                                    placeholder={'Role'}
                                    style={{ width: '100%' }}
                                    allowClear>
                                    <Select.Option
                                        value="admin"
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
                        {/* <Col span={8}>
                            <Select
                                placeholder={'Status'}
                                style={{ width: '100%' }}
                                allowClear
                                onChange={(selectedItem) =>
                                    onFilterChange('statusFilter', selectedItem)
                                }>
                                <Select.Option value="ban" children={'Ban'} />
                                <Select.Option
                                    value="active"
                                    children={'Active'}
                                />
                            </Select>
                        </Col> */}
                    </Row>{' '}
                </Col>
                <Col
                    span={8}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {children}
                </Col>
            </Row>
        </Card>
    );
};

export default UserFilter;
