import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBroadcast, getPhases, getBlocks, getStoredUser } from '../utils/apiClient';
import { isAdmin } from '../utils/authUtils';

const BroadcastAdmin = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [recipientType, setRecipientType] = useState('all');
  const [recipientValue, setRecipientValue] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [phases, setPhases] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Get dynamic values from config
  const getConfig = () => {
    try {
      if (window.config) {
        return {
          pageTitle: window.config.labels?.broadcastName || 'Broadcasts',
          pageSubtitle: window.config.labels?.broadcastSubtitle || 'Messages',
          icon: window.config.labels?.broadcastIcon || '📢',
          categories: window.config.modules?.broadcasts?.categories || [],
          isSermons: window.config.labels?.broadcastName === 'Sermons',
          isPrayerRequests: window.config.labels?.complaintName === 'Prayer Requests',
          primaryColor: window.config.theme?.colors?.primary || '#0891B2',
          secondaryColor: window.config.theme?.colors?.secondary || '#0E7490',
          recipientOptions: window.config.modules?.broadcasts?.recipientOptions || ['all'],
          allowAnonymous: window.config.modules?.broadcasts?.allowAnonymous || false,
          maxMessageLength: window.config.modules?.broadcasts?.maxMessageLength || 2000,
        };
      }
    } catch (e) {
      console.warn('Could not load config:', e);
    }
    return {
      pageTitle: 'Broadcasts',
      pageSubtitle: 'Messages',
      icon: '📢',
      categories: [],
      isSermons: false,
      isPrayerRequests: false,
      primaryColor: '#0891B2',
      secondaryColor: '#0E7490',
      recipientOptions: ['all'],
      allowAnonymous: false,
      maxMessageLength: 2000,
    };
  };

  const config = getConfig();
  const gradient = `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)`;

  useEffect(() => {
    const user = getStoredUser();
    if (!user || !isAdmin()) {
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
        category: category || null,
        speaker: speaker || null,
        recipientType,
        recipientValue: recipientType === 'all' ? null : recipientValue,
        isAnonymous,
        type: config.isSermons ? 'sermon' : config.isPrayerRequests ? 'prayer_request' : 'broadcast'
      });

      setSuccess(`${config.pageTitle} sent successfully!`);
      setTitle('');
      setContent('');
      setCategory('');
      setSpeaker('');
      setRecipientType('all');
      setRecipientValue('');
      setIsAnonymous(false);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || `Failed to send ${config.pageTitle.toLowerCase()}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRecipientLabel = () => {
    if (config.isPrayerRequests) {
      return 'Share with';
    }
    switch (recipientType) {
      case 'all':
        return config.isSermons ? 'Congregation' : 'All Residents';
      case 'phase':
        return 'Select Phase';
      case 'block':
        return 'Select Block';
      case 'cell':
        return 'Select Cell Group';
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
            color: config.primaryColor,
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '12px',
            padding: 0
          }}
        >
          ← Back
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>
          {config.icon} {config.isPrayerRequests ? '🙏 New Prayer Request' : `Create ${config.pageTitle}`}
        </h1>
        <p style={{ margin: '4px 0 0', color: '#64748b' }}>
          {config.isPrayerRequests 
            ? 'Share prayer requests with the church' 
            : `Send ${config.pageTitle.toLowerCase()} to ${config.isSermons ? 'congregation' : 'residents'}`
          }
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

      {/* Form */}
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
            {config.isPrayerRequests ? 'Prayer Request Title' : 'Title'} *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={config.isSermons 
              ? "e.g., Sunday Sermon - Walking in Faith" 
              : config.isPrayerRequests
                ? "e.g., Pray for my family's health"
                : "e.g., Important Notice - Water Maintenance"
            }
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
            onFocus={(e) => e.target.style.borderColor = config.primaryColor}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Category - For Sermons and Prayer Requests */}
        {config.categories.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '8px'
            }}>
              {config.isSermons ? 'Service Type' : config.isPrayerRequests ? 'Category' : 'Category'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              {config.categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}

        {/* Speaker - For Sermons only */}
        {config.isSermons && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '8px'
            }}>
              Speaker/Pastor
            </label>
            <input
              type="text"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              placeholder="e.g., Rev. John Ochieng"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = config.primaryColor}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>
        )}

        {/* Recipient Type */}
        {!config.isPrayerRequests && (
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
              {config.recipientOptions.includes('all') && (
                <option value="all">{config.isSermons ? 'All Congregants' : 'All Residents'}</option>
              )}
              {config.recipientOptions.includes('phase') && (
                <option value="phase">By Phase</option>
              )}
              {config.recipientOptions.includes('block') && (
                <option value="block">By Block</option>
              )}
              {config.recipientOptions.includes('cell') && (
                <option value="cell">By Cell Group</option>
              )}
            </select>
          </div>
        )}

        {/* Prayer Requests specific: Share with option */}
        {config.isPrayerRequests && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '8px'
            }}>
              Share with *
            </label>
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
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
              <option value="all">Entire Church</option>
              <option value="cell">My Cell Group Only</option>
              <option value="wardens">Church Wardens Only</option>
              <option value="priest">Priest/Pastor Only</option>
            </select>
          </div>
        )}

        {/* Recipient Value (Phase/Block/Cell) */}
        {!config.isPrayerRequests && recipientType !== 'all' && (
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
              {recipientType === 'cell' && (
                <>
                  <option value="st-marys">St. Mary's Cell</option>
                  <option value="st-peters">St. Peter's Cell</option>
                  <option value="youth">Youth Fellowship</option>
                  <option value="women">Women's Ministry</option>
                  <option value="men">Men's Ministry</option>
                </>
              )}
            </select>
          </div>
        )}

        {/* Anonymous option - For Prayer Requests */}
        {config.allowAnonymous && (
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              color: '#374151'
            }}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
              />
              <span>Submit anonymously</span>
            </label>
            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
              Your name will not be shown with this prayer request
            </p>
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
            {config.isPrayerRequests ? 'Prayer Request Details' : 'Message'} *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={config.isSermons 
              ? "Write or paste the sermon message here..."
              : config.isPrayerRequests
                ? "Share the details of your prayer request..."
                : "Type your message here..."
            }
            required
            rows={6}
            maxLength={config.maxMessageLength}
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
            onFocus={(e) => e.target.style.borderColor = config.primaryColor}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          {content.length > 0 && (
            <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b', textAlign: 'right' }}>
              {content.length}/{config.maxMessageLength} characters
            </p>
          )}
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
            background: isSubmitting ? '#e5e7eb' : gradient,
            color: isSubmitting ? '#9ca3af' : 'white',
            transition: 'all 0.2s ease'
          }}
        >
          {isSubmitting 
            ? 'Sending...' 
            : `${config.isPrayerRequests ? '🙏' : config.icon} ${isSubmitting ? 'Sending...' : `Send ${config.pageTitle}`}`
          }
        </button>
      </form>
    </div>
  );
};

export default BroadcastAdmin;
