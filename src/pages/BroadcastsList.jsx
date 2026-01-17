import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBroadcasts, markBroadcastRead, getUnreadBroadcastsCount } from '../utils/apiClient';
import { isAdmin } from '../utils/authUtils';

const BroadcastsList = () => {
  const navigate = useNavigate();
  const [broadcasts, setBroadcasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  // Get dynamic values from config
  const getConfig = () => {
    try {
      if (window.config) {
        return {
          title: window.config.labels?.broadcastName || 'Broadcasts',
          subtitle: window.config.labels?.broadcastSubtitle || 'Messages',
          icon: window.config.labels?.broadcastIcon || '📢',
          categories: window.config.modules?.broadcasts?.categories || [],
          primaryColor: window.config.theme?.colors?.primary || '#0891B2',
          secondaryColor: window.config.theme?.colors?.secondary || '#0E7490',
        };
      }
    } catch (e) {
      console.warn('Could not load config:', e);
    }
    return {
      title: 'Broadcasts',
      subtitle: 'Messages',
      icon: '📢',
      categories: [],
      primaryColor: '#0891B2',
      secondaryColor: '#0E7490',
    };
  };

  const config = getConfig();

  useEffect(() => {
    loadBroadcasts();
    setUserIsAdmin(isAdmin());
  }, []);

  const loadBroadcasts = async () => {
    setIsLoading(true);
    try {
      const data = await getBroadcasts();
      setBroadcasts(data || []);
      const unread = await getUnreadBroadcastsCount();
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error loading broadcasts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (broadcastId) => {
    try {
      await markBroadcastRead(broadcastId);
      // Update local state
      setBroadcasts(prev => prev.map(b =>
        b.id === broadcastId ? { ...b, read_status: true, read_at: new Date().toISOString() } : b
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking broadcast as read:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredBroadcasts = broadcasts.filter(b => {
    if (filter === 'unread') return !b.read_status;
    if (filter !== 'all' && config.categories.length > 0) return b.category === filter;
    return true;
  });

  return (
    <div style={{ padding: '16px' }}>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }}>
              {config.icon} {config.title}
            </h1>
            <p style={{ margin: '4px 0 0', color: '#64748b' }}>
              {config.subtitle}
            </p>
          </div>
          {unreadCount > 0 && (
            <div style={{
              background: '#ef4444',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: 600
            }}>
              {unreadCount} unread
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        borderBottom: '2px solid #e5e7eb',
        paddingBottom: '8px'
      }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '8px',
            background: filter === 'all' ? config.primaryColor : 'transparent',
            color: filter === 'all' ? 'white' : '#64748b',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all 0.2s ease'
          }}
        >
          All ({broadcasts.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '8px',
            background: filter === 'unread' ? config.primaryColor : 'transparent',
            color: filter === 'unread' ? 'white' : '#64748b',
            cursor: 'pointer',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          Unread
          {unreadCount > 0 && (
            <span style={{
              background: '#ef4444',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem'
            }}>
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Category Filters (for Sermons with categories) */}
      {config.categories.length > 0 && (
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 12px',
              border: '1px solid',
              borderColor: filter === 'all' ? config.primaryColor : '#e5e7eb',
              borderRadius: '16px',
              background: filter === 'all' ? config.primaryColor : 'white',
              color: filter === 'all' ? 'white' : '#64748b',
              cursor: 'pointer',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap'
            }}
          >
            All
          </button>
          {config.categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              style={{
                padding: '6px 12px',
                border: '1px solid',
                borderColor: filter === category ? config.primaryColor : '#e5e7eb',
                borderRadius: '16px',
                background: filter === category ? config.primaryColor : 'white',
                color: filter === category ? 'white' : '#64748b',
                cursor: 'pointer',
                fontSize: '0.875rem',
                whiteSpace: 'nowrap'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Broadcasts/Sermons List */}
      {isLoading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          color: '#64748b'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e5e7eb',
            borderTopColor: config.primaryColor,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }} />
          <p>Loading {config.title.toLowerCase()}...</p>
        </div>
      ) : filteredBroadcasts.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          color: '#64748b',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
          <p style={{ margin: 0 }}>
            {filter === 'unread' 
              ? `No unread ${config.title.toLowerCase()}` 
              : `No ${config.title.toLowerCase()} yet`
            }
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredBroadcasts.map((broadcast) => (
            <div
              key={broadcast.id}
              style={{
                padding: '16px',
                background: broadcast.read_status ? 'white' : `${config.primaryColor}10`,
                border: broadcast.read_status ? '1px solid #e5e7eb' : `1px solid ${config.primaryColor}40`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => !broadcast.read_status && handleMarkAsRead(broadcast.id)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#1e293b'
                    }}>
                      {broadcast.title}
                    </h3>
                    {!broadcast.read_status && (
                      <span style={{
                        width: '8px',
                        height: '8px',
                        background: config.primaryColor,
                        borderRadius: '50%',
                        flexShrink: 0
                      }} />
                    )}
                  </div>
                  <p style={{
                    margin: '4px 0 0',
                    fontSize: '0.75rem',
                    color: '#64748b'
                  }}>
                    {config.title === 'Sermons' && broadcast.speaker 
                      ? `${broadcast.speaker} • ${formatDate(broadcast.created_at)}`
                      : `From: ${broadcast.sender_name} • ${formatDate(broadcast.created_at)}`
                    }
                  </p>
                  {/* Show category if available */}
                  {broadcast.category && (
                    <span style={{
                      display: 'inline-block',
                      marginTop: '4px',
                      padding: '2px 8px',
                      background: `${config.primaryColor}20`,
                      color: config.primaryColor,
                      borderRadius: '12px',
                      fontSize: '0.75rem'
                    }}>
                      {broadcast.category}
                    </span>
                  )}
                </div>
              </div>

              <p style={{
                margin: 0,
                fontSize: '0.875rem',
                color: '#475569',
                lineHeight: 1.5
              }}>
                {broadcast.content}
              </p>

              {broadcast.read_status && broadcast.read_at && (
                <p style={{
                  margin: '12px 0 0',
                  fontSize: '0.75rem',
                  color: '#10b981'
                }}>
                  ✓ Read {formatDate(broadcast.read_at)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Admin: Create Button FAB */}
      {userIsAdmin && (
        <button
          onClick={() => navigate('/broadcast-admin')}
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)`,
            color: 'white',
            border: 'none',
            boxShadow: `0 4px 14px ${config.primaryColor}66`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            zIndex: 1000,
            transition: 'transform 0.2s ease'
          }}
          title={`Create ${config.title}`}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          +
        </button>
      )}
    </div>
  );
};

export default BroadcastsList;
