import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store';

export const Dashboard = () => {
    const { user } = useAuthStore();
    if (user == null) return <Navigate to="/auth/login" replace={true} />;
    return (
        <div>
            <h1> Dashboard</h1>
            <Outlet />
        </div>
    );
};
