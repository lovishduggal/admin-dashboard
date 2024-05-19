import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Select } from 'antd';

const UserFilter = () => {
    return (
        <Card>
            <Row justify={'space-between'}>
                <Col span={16}>
                    {' '}
                    <Row gutter={20}>
                        <Col span={8}>
                            <Input.Search
                                style={{ width: '100%' }}
                                placeholder="Search"
                            />{' '}
                        </Col>
                        <Col span={8}>
                            <Select
                                placeholder={'Role'}
                                style={{ width: '100%' }}
                                allowClear>
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
                        </Col>
                        <Col span={8}>
                            <Select
                                placeholder={'Status'}
                                style={{ width: '100%' }}
                                allowClear>
                                <Select.Option value="ban" children={'Ban'} />
                                <Select.Option
                                    value="active"
                                    children={'Active'}
                                />
                            </Select>
                        </Col>
                    </Row>{' '}
                </Col>
                <Col
                    span={8}
                    style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="primary" icon={<PlusOutlined />}>
                        Create user
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};

export default UserFilter;
