import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Customer {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    createdAt?: string;
}

interface AuthState {
    customer: Customer | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (customer: Customer, token: string) => void;
    logout: () => void;
    updateCustomer: (customer: Customer) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            customer: null,
            token: null,
            isAuthenticated: false,
            setAuth: (customer, token) => {
                localStorage.setItem('token', token);
                localStorage.setItem('customer', JSON.stringify(customer));
                set({ customer, token, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('customer');
                set({ customer: null, token: null, isAuthenticated: false });
            },
            updateCustomer: (customer) => {
                localStorage.setItem('customer', JSON.stringify(customer));
                set({ customer });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
