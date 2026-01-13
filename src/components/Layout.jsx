import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'

const Layout = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <main style={{ paddingBottom: '80px' }}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

export default Layout
