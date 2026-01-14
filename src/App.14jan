import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
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

function App() {
  return (
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
      </Routes>
    </AuthProvider>
  )
}

export default App
