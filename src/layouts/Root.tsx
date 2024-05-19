import { useQuery } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { self } from '../http/api';
import { useAuthStore } from '../store';
import { useEffect } from 'react';
import { AxiosError } from 'axios';
import { Flex } from 'antd';
import Spinner from '../components/spinner/Spinner';

const getSelf = async () => {
    const { data } = await self();
    return data;
};

const Root = () => {
    const { setUser } = useAuthStore();

    const { data, isLoading } = useQuery({
        queryKey: ['self'],
        queryFn: getSelf,
        retry: (failureCount: number, error) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
                return false;
            }
            return failureCount < 3;
        },
    });

    useEffect(() => {
        if (data) setUser(data);
    }, [data, setUser]);

    if (isLoading)
        return (
            <Flex
                style={{ height: '100vh' }}
                align="center"
                justify="center"
                gap="middle">
                <Spinner />
            </Flex>
        );
    return <Outlet />;
};

export default Root;
