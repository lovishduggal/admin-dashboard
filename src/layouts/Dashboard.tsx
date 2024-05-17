import { NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Layout, Menu, theme } from 'antd';
import Icon from '@ant-design/icons';
import { useState } from 'react';
import Logo from '../icons/Logo';
import Home from '../icons/Home';
import UserIcon from '../icons/UserIcon ';
import { foodIcon } from '../icons/foodIcon';
import BasketIcon from '../icons/BasketIcon';
import GiftIcon from '../icons/GiftIcon';

const { Header, Content, Footer, Sider } = Layout;

const items = [
    {
        key: '/',
        icon: <Icon component={Home} />,
        label: <NavLink to="/">Home</NavLink>,
    },
    {
        key: '/users',
        icon: <Icon component={UserIcon} />,
        label: <NavLink to="/users">Users</NavLink>,
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
];
export const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { user } = useAuthStore();
    if (user == null) return <Navigate to="/auth/login" replace={true} />;
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
                        defaultSelectedKeys={['/']}
                        mode="inline"
                        items={items}
                    />
                </Sider>
                <Layout>
                    <Header
                        style={{ padding: 0, background: colorBgContainer }}
                    />
                    <Content style={{ margin: '0 16px' }}>
                        {' '}
                        <Outlet />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Pizza shop</Footer>
                </Layout>
            </Layout>
        </div>
    );
};
