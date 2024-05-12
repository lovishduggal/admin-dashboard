import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoginPage from './login';

describe('Login Page', () => {
    it('should render with required fields', () => {
        render(<LoginPage />);
        // geyBy -> throws an error
        // findBy -> Async
        // queryBy -> returns null
        expect(screen.getByText('Sign in')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Log in' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('checkbox', { name: 'Remember me' })
        ).toBeInTheDocument();
        expect(screen.getByText('Forgot password')).toBeInTheDocument();
    });
});
