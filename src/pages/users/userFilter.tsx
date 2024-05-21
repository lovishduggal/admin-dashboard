import { Card, Col, Input, Row, Select } from 'antd';

type UserFilterProps = {
    children: React.ReactNode;
    onFilterChange: (filterName: string, filterValue: string) => void;
};

const UserFilter = ({ onFilterChange, children }: UserFilterProps) => {
    return (
        <Card>
            <Row justify={'space-between'}>
                <Col span={16}>
                    {' '}
                    <Row gutter={20}>
                        <Col span={8}>
                            <Input.Search
                                allowClear={true}
                                style={{ width: '100%' }}
                                placeholder="Search"
                                onChange={(e) =>
                                    onFilterChange(
                                        'UserSearchQuery',
                                        e.target.value
                                    )
                                }
                            />{' '}
                        </Col>
                        <Col span={8}>
                            <Select
                                placeholder={'Role'}
                                style={{ width: '100%' }}
                                allowClear
                                onChange={(selectedItem) =>
                                    onFilterChange('roleFilter', selectedItem)
                                }>
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
                        </Col>
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
