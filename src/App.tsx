import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { authApi } from './services/auth';
import HomePage from './pages/HomePage';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!authApi.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

// Public Route component - giriş yapmış kullanıcıyı admin paneline yönlendir
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    if (authApi.isAuthenticated()) {
        return <Navigate to="/admin" replace />;
    }
    return <>{children}</>;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Ana sayfa - herkes erişebilir */}
                <Route path="/" element={<HomePage />} />

                {/* Login sayfası - sadece giriş yapmamış kullanıcılar */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />

                {/* Admin panel - sadece giriş yapmış kullanıcılar */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />

                {/* Bilinmeyen route'ları ana sayfaya yönlendir */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
