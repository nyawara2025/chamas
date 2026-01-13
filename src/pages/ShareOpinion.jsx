import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStoredUser, apiRequest } from '../utils/apiClient'
import { API_ENDPOINTS } from '../config/apiConfig'

const ShareOpinion = () => {
  const navigate = useNavigate()
  const [user] = useState(() => getStoredUser())
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [opinion, setOpinion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load opinion topics (mock data for now)
    setTopics([
      {
        id: 1,
        title: 'Estate Security',
        description: 'Share your thoughts on current security measures',
        icon: '🔒'
      },
      {
        id: 2,
        title: 'Cleanliness & Maintenance',
        description: 'Feedback on common areas and facilities',
        icon: '🧹'
      },
      {
        id: 3,
        title: 'Community Events',
        description: 'Suggestions for resident gatherings',
        icon: '🎉'
      },
      {
        id: 4,
        title: 'Parking & Traffic',
        description: 'Issues or suggestions about vehicle management',
        icon: '🚗'
      },
      {
        id: 5,
        title: 'General Feedback',
        description: 'Any other suggestions or concerns',
        icon: '💭'
      }
    ])
    setLoading(false)
  }, [])

  const handleSubmit = async () => {
    if (!opinion.trim()) return

    setSubmitting(true)
    try {
      await apiRequest(API_ENDPOINTS.submitOpinion, {
        method: 'POST',
        body: JSON.stringify({
          resident_id: user.id,
          topic_id: selectedTopic?.id,
          topic_title: selectedTopic?.title,
          opinion: opinion.trim(),
          timestamp: new Date().toISOString()
        })
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit opinion:', error)
      alert('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
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
          <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Share Your Opinion</h1>
        </div>

        <div style={{
          background: '#f0fdf4',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          border: '1px solid #bbf7d0'
        }}>
          <p style={{ fontSize: '3rem', margin: '0 0 16px' }}>✅</p>
          <h2 style={{ margin: '0 0 8px', color: '#166534' }}>Thank You!</h2>
          <p style={{ margin: '0 0 24px', color: '#22c55e' }}>
            Your opinion has been submitted successfully. Your elected representatives will review it.
          </p>
          <button
            onClick={() => {
              setSubmitted(false)
              setSelectedTopic(null)
              setOpinion('')
            }}
            style={{
              padding: '12px 24px',
              background: '#0891B2',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Submit Another Opinion
          </button>
        </div>
      </div>
    )
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
        <h1 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>Share Your Opinion</h1>
      </div>

      {selectedTopic ? (
        // Opinion Form
        <div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '2rem' }}>{selectedTopic.icon}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>{selectedTopic.title}</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#64748b' }}>{selectedTopic.description}</p>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151'
            }}>
              Your Opinion
            </label>
            <textarea
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              placeholder="Share your thoughts, suggestions, or concerns..."
              rows={6}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setSelectedTopic(null)}
              style={{
                flex: 1,
                padding: '14px',
                background: '#f3f4f6',
                border: 'none',
                borderRadius: '8px',
                color: '#374151',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!opinion.trim() || submitting}
              style={{
                flex: 1,
                padding: '14px',
                background: '#0891B2',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: (!opinion.trim() || submitting) ? 'not-allowed' : 'pointer',
                opacity: (!opinion.trim() || submitting) ? 0.6 : 1
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Opinion'}
            </button>
          </div>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          Loading topics...
        </div>
      ) : (
        // Topic Selection
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ margin: '0 0 8px', color: '#64748b', fontSize: '0.875rem' }}>
            Select a topic to share your opinion:
          </p>
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '2rem' }}>{topic.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>{topic.title}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#64748b' }}>{topic.description}</p>
              </div>
              <span style={{ color: '#d1d5db' }}>›</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ShareOpinion
