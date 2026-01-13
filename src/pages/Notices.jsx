import React from 'react'
import { useNavigate } from 'react-router-dom'

const Notices = () => {
  const navigate = useNavigate()

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
        <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Notices</h1>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
        color: '#64748b'
      }}>
        <p style={{ fontSize: '3rem', margin: '0 0 16px' }}>📋</p>
        <h2 style={{ margin: '0 0 8px', color: '#1e293b' }}>Coming Soon</h2>
        <p style={{ margin: 0 }}>
          Notices from your elected representatives will appear here.
        </p>
      </div>
    </div>
  )
}

export default Notices
