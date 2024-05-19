import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ConfigProvider, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store';

const queryClient = new QueryClient();

const App = () => {
    const mode = useAuthStore((state) => state.mode);
    return (
        <QueryClientProvider client={queryClient}>
            <ConfigProvider
                theme={{
                    algorithm:
                        mode === 'dark'
                            ? theme.darkAlgorithm
                            : theme.defaultAlgorithm,
                    token: {
                        colorPrimary: '#F65F42',
                        colorLink: '#F65F42',
                    },
                }}>
                <RouterProvider router={router} />
            </ConfigProvider>
        </QueryClientProvider>
    );
};

export default App;
