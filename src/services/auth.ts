const API_URL = 'https://emlak-portal-backend.onrender.com/api';

export const authApi = {
    login: async (username: string, password: string) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Giriş yapılırken bir hata oluştu');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('token');
    },

    getToken: (): string | null => {
        return localStorage.getItem('token');
    }
}; 