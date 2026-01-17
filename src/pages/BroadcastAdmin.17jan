import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBroadcast, getPhases, getBlocks, getStoredUser } from '../utils/apiClient';
import { isAdmin } from '../utils/authUtils';

const BroadcastAdmin = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recipientType, setRecipientType] = useState('all');
  const [recipientValue, setRecipientValue] = useState('');
  const [phases, setPhases] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is admin
    const user = getStoredUser();
    
    // Verify admin role - redirect if not authorized
    if (!user || !isAdmin()) {
      // User is not admin, redirect to broadcasts list
      navigate('/broadcasts');
      return;
    }

    loadFilters();
  }, [navigate]);

  const loadFilters = async () => {
    try {
      const [phasesData, blocksData] = await Promise.all([
        getPhases(),
        getBlocks()
      ]);
      setPhases(phasesData || []);
      setBlocks(blocksData || []);
    } catch (err) {
      console.error('Error loading filters:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      await createBroadcast({
        title,
        content,
        recipientType,
        recipientValue: recipientType === 'all' ? null : recipientValue
      });

      setSuccess('Broadcast sent successfully!');
      setTitle('');
      setContent('');
      setRecipientType('all');
      setRecipientValue('');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to send broadcast');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRecipientLabel = () => {
    switch (recipientType) {
      case 'all':
        return 'All Residents';
      case 'phase':
        return 'Select Phase';
      case 'block':
        return 'Select Block';
      default:
        return '';
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0891B2',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '12px',
            padding: 0
          }}
        >
          ← Back
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>
          📢 Send Broadcast
        </h1>
        <p style={{ margin: '4px 0 0', color: '#64748b' }}>
          Send messages to residents
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div style={{
          padding: '12px 16px',
          background: '#d1fae5',
          border: '1px solid #10b981',
          borderRadius: '8px',
          color: '#065f46',
          marginBottom: '16px'
        }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          color: '#991b1b',
          marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      {/* Broadcast Form */}
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '8px'
          }}>
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Important Notice - Water Maintenance"
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0891B2'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Recipient Type */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '8px'
          }}>
            Send to *
          </label>
          <select
            value={recipientType}
            onChange={(e) => {
              setRecipientType(e.target.value);
              setRecipientValue('');
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              backgroundColor: 'white',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            <option value="all">All Residents</option>
            <option value="phase">By Phase</option>
            <option value="block">By Block</option>
          </select>
        </div>

        {/* Recipient Value (Phase/Block) */}
        {recipientType !== 'all' && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '8px'
            }}>
              {getRecipientLabel()} *
            </label>
            <select
              value={recipientValue}
              onChange={(e) => setRecipientValue(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: 'white',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="">-- Select --</option>
              {recipientType === 'phase' && phases.map(phase => (
                <option key={phase.id} value={phase.id}>
                  {phase.phase_name}
                </option>
              ))}
              {recipientType === 'block' && blocks.map(block => (
                <option key={block.id} value={block.block_name}>
                  {block.block_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Message Content */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '8px'
          }}>
            Message *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your message here..."
            required
            rows={6}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '1rem',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              boxSizing: 'border-box',
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0891B2'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '14px 20px',
            fontSize: '1rem',
            fontWeight: 600,
            border: 'none',
            borderRadius: '12px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            background: isSubmitting ? '#e5e7eb' : 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
            color: isSubmitting ? '#9ca3af' : 'white',
            transition: 'all 0.2s ease'
          }}
        >
          {isSubmitting ? 'Sending...' : '📢 Send Broadcast'}
        </button>
      </form>
    </div>
  );
};

export default BroadcastAdmin;
