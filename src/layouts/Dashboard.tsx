import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import {
    Avatar,
    Badge,
    Dropdown,
    Flex,
    Layout,
    Menu,
    Space,
    theme,
} from 'antd';
import Icon, {
    BellFilled,
    MoonFilled,
    SettingFilled,
    SunFilled,
} from '@ant-design/icons';
import { useState } from 'react';
import Logo from '../components/icons/Logo';
import Home from '../components/icons/Home';
import UserIcon from '../components/icons/UserIcon ';
import { foodIcon } from '../components/icons/foodIcon';
import BasketIcon from '../components/icons/BasketIcon';
import GiftIcon from '../components/icons/GiftIcon';
import { useMutation } from '@tanstack/react-query';
import { logout } from '../http/api';

const { Header, Content, Footer, Sider } = Layout;

const getMenuItems = (role: string, setMode: { (mode: string): void }) => {
    const baseItems = [
        {
            key: '/',
            icon: <Icon component={Home} />,
            label: <NavLink to="/">Home</NavLink>,
        },
        {
            key: '/restaurants',
            icon: <Icon component={foodIcon} />,
            label: <NavLink to="/restaurants">Restaurants</NavLink>,
        },
        {
            key: '/products',
            icon: <Icon component={BasketIcon} />,
            label: <NavLink to="/products">Products</NavLink>,
        },
        {
            key: '/promos',
            icon: <Icon component={GiftIcon} />,
            label: <NavLink to="/promos">Promos</NavLink>,
        },
        {
            key: '/setting',
            label: 'Setting',
            icon: <SettingFilled />,
            children: [
                {
                    key: 'light',
                    label: 'Light',
                    icon: <SunFilled />,
                    onClick: () => setMode('light'),
                },
                {
                    key: 'dark',
                    label: 'Dark',
                    icon: <MoonFilled />,
                    onClick: () => setMode('dark'),
                },
            ],
        },
    ];

    if (role === 'admin') {
        const menu = [...baseItems];
        menu.splice(1, 0, {
            key: '/users',
            icon: <Icon component={UserIcon} />,
            label: <NavLink to="/users">Users</NavLink>,
        });
        return menu;
    }
    return baseItems;
};

export const Dashboard = () => {
    const location = useLocation();
    const { user, logout: logoutFromStore, setMode } = useAuthStore();
    const items = getMenuItems(user?.role as string, setMode);

    const { mutate: logoutMutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: logout,
        onSuccess: () => {
            logoutFromStore();
        },
    });

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    if (user == null)
        return (
            <Navigate
                to={`/auth/login?returnTo=${location.pathname}`}
                replace={true}
            />
        );
    return (
        <div>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider
                    theme="light"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}>
                    <div className="logo">
                        <Logo />
                    </div>
                    <Menu
                        theme="light"
                        defaultSelectedKeys={[location.pathname]}
                        mode="inline"
                        items={items}
                    />
                </Sider>
                <Layout>
                    <Header
                        style={{
                            paddingRight: '16px',
                            paddingLeft: '16px',
                            background: colorBgContainer,
                        }}>
                        <Flex
                            gap={'middle'}
                            align="start"
                            justify="space-between">
                            {collapsed ? (
                                <Badge
                                    style={{ marginLeft: '50px' }}
                                    text={
                                        user?.role === 'admin'
                                            ? 'Global'
                                            : user?.tenant?.name
                                    }
                                    status="success"
                                />
                            ) : (
                                <Badge
                                    text={
                                        user?.role === 'admin'
                                            ? 'Global'
                                            : user?.tenant?.name
                                    }
                                    status="success"
                                />
                            )}

                            <Space size={'small'}>
                                <Badge dot={true}>
                                    <BellFilled />{' '}
                                </Badge>
                                <Dropdown
                                    menu={{
                                        items: [
                                            {
                                                key: 'logout',
                                                label: 'Logout',
                                                onClick: () => logoutMutate(),
                                            },
                                        ],
                                    }}
                                    placement="bottomRight">
                                    <Avatar
                                        style={{
                                            backgroundColor: '#fde3cf',
                                            color: '#f56a00',
                                            cursor: 'pointer',
                                        }}>
                                        U
                                    </Avatar>
                                </Dropdown>
                            </Space>
                        </Flex>
                    </Header>
                    <Content style={{ margin: '24px' }}>
                        {' '}
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Pizza shop</Footer>
                </Layout>
            </Layout>
        </div>
    );
};
