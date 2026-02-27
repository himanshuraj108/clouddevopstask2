import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isLoading: false,

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    const { data } = await api.post('/auth/login', { email, password });
                    set({ user: data.user, token: data.token, isLoading: false });
                    toast.success(`Welcome back, ${data.user.name}! 👋`);
                    return { success: true };
                } catch (err) {
                    set({ isLoading: false });
                    const msg = err.response?.data?.error || 'Login failed';
                    toast.error(msg);
                    return { success: false, error: msg };
                }
            },

            register: async (name, email, password) => {
                set({ isLoading: true });
                try {
                    const { data } = await api.post('/auth/register', { name, email, password });
                    set({ user: data.user, token: data.token, isLoading: false });
                    toast.success(`Account created! Welcome, ${data.user.name}! 🎉`);
                    return { success: true };
                } catch (err) {
                    set({ isLoading: false });
                    const msg = err.response?.data?.error || 'Registration failed';
                    toast.error(msg);
                    return { success: false, error: msg };
                }
            },

            logout: () => {
                set({ user: null, token: null });
                toast.success('Logged out successfully');
            },

            updateUser: (updatedUser) => {
                set({ user: { ...get().user, ...updatedUser } });
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ user: state.user, token: state.token }),
        }
    )
);
