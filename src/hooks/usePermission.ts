import { User } from '../store';

export const usePermission = () => {
    const allowedRoles = ['admin', 'manager'];

    const _hashPermission = (user: User | null) => {
        if (user) {
            return allowedRoles.includes(user.role);
        }
        return false;
    };

    return {
        isAllowed: _hashPermission,
    };
};
