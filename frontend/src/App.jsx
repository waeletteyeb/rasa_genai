import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Intents from './pages/Intents'
import Documents from './pages/Documents'
import Conversations from './pages/Conversations'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore()
    return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Dashboard />} />
                    <Route path="intents" element={<Intents />} />
                    <Route path="documents" element={<Documents />} />
                    <Route path="conversations" element={<Conversations />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
