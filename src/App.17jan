import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ConfigProvider } from './context/ConfigContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Chat from './pages/Chat'
import VacantHouses from './pages/VacantHouses'
import Notices from './pages/Notices'
import Bills from './pages/Bills'
import ShareOpinion from './pages/ShareOpinion'
import Announcements from './pages/Announcements'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import BroadcastAdmin from './pages/BroadcastAdmin'
import BroadcastsList from './pages/BroadcastsList'
import MyInquiries from './pages/MyInquiries'
import Complaints from './pages/Complaints'

/**
 * Main App Component
 * 
 * Wraps the application with:
 * - ConfigProvider: Loads configuration from /config.json and provides theme/feature settings
 * - AuthProvider: Handles user authentication state
 * 
 * Routes are protected and only accessible to authenticated users
 */
function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/vacant-houses" element={
            <ProtectedRoute>
              <VacantHouses />
            </ProtectedRoute>
          } />
          <Route path="/notices" element={
            <ProtectedRoute>
              <Notices />
            </ProtectedRoute>
          } />
          <Route path="/bills" element={
            <ProtectedRoute>
              <Bills />
            </ProtectedRoute>
          } />
          <Route path="/share-opinion" element={
            <ProtectedRoute>
              <ShareOpinion />
            </ProtectedRoute>
          } />
          <Route path="/announcements" element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/complaints" element={
            <ProtectedRoute>
              <Complaints />
            </ProtectedRoute>
          } />
          <Route path="/broadcast-admin" element={
            <ProtectedRoute>
              <BroadcastAdmin />
            </ProtectedRoute>
          } />
          <Route path="/broadcasts" element={
            <ProtectedRoute>
              <BroadcastsList />
            </ProtectedRoute>
          } />
          <Route path="/my-inquiries" element={
            <ProtectedRoute>
              <MyInquiries />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </ConfigProvider>
  )
}

export default App
