import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import Admin from './pages/Admin.jsx';
import Advisory from './pages/Advisory.jsx';
import AdvisoryDetail from './pages/AdvisoryDetail.jsx';
import BuyRequests from './pages/BuyRequests.jsx';
import Calendar from './pages/Calendar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Home from './pages/Home.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import Login from './pages/Login.jsx';
import Marketplace from './pages/Marketplace.jsx';
import Markets from './pages/Markets.jsx';
import MyListings from './pages/MyListings.jsx';
import Profile from './pages/Profile.jsx';
import Register from './pages/Register.jsx';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="marketplace" element={<Marketplace />} />
              <Route path="marketplace/:id" element={<ListingDetail />} />
              <Route path="markets" element={<Markets />} />
              <Route path="advisory" element={<Advisory />} />
              <Route path="advisory/:id" element={<AdvisoryDetail />} />

              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="calendar"
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                }
              />
              <Route
                path="my-listings"
                element={
                  <ProtectedRoute roles={['farmer', 'admin']}>
                    <MyListings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="buy-requests"
                element={
                  <ProtectedRoute>
                    <BuyRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin"
                element={
                  <ProtectedRoute roles={['admin', 'extension_officer']}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
