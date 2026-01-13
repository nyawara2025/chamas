import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Settings = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            padding: '8px 16px',
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Settings</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          cursor: 'pointer'
        }}>
          <span style={{ color: '#1e293b' }}>🔔 Notifications</span>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          cursor: 'pointer'
        }}>
          <span style={{ color: '#1e293b' }}>🔐 Privacy & Security</span>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          cursor: 'pointer'
        }}>
          <span style={{ color: '#1e293b' }}>❓ Help & Support</span>
        </div>
        
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '16px',
          cursor: 'pointer'
        }}>
          <span style={{ color: '#1e293b' }}>ℹ️ About</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            marginTop: '24px',
            padding: '14px',
            background: '#fee2e2',
            border: 'none',
            borderRadius: '8px',
            color: '#dc2626',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Sign Out
        </button>
      </div>

      <p style={{
        marginTop: '32px',
        textAlign: 'center',
        color: '#9ca3af',
        fontSize: '0.75rem'
      }}>
        NHC Langata v1.0.0
      </p>
    </div>
  )
}

export default Settings
