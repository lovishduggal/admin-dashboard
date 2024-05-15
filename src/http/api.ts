import { Credentials } from './../types';
import { api } from './client';

// Auth service:
export const login = (credentials: Credentials) =>
    api.post('api/auth/login', credentials);
export const self = () => api.get('api/auth/self');
