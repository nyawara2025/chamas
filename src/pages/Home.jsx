import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, getBroadcasts, getUnreadBroadcastsCount, getActiveShops, getTableBankingSummary } from '../utils/apiClient';
import { ConfigContext } from '../App';
import SokoniModal from '../components/SokoniModal';

const Home = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const config = useContext(ConfigContext);
  
  const [stats, setStats] = useState({
    balance: 3500,
    contributions: 500,
    events: 3,
    notices: 2
  });
  const [recentBroadcasts, setRecentBroadcasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sokoniOpen, setSokoniOpen] = useState(false);
  const [shops, setShops] = useState([]);

  // Get config values with fallbacks
  const title = config?.identity?.name || 'Care Kenya Welfare';
  const shortName = config?.identity?.shortName || 'NHC Women Chama';
  const primaryColor = config?.theme?.colors?.primary || '#E31C23';
  const secondaryColor = config?.theme?.colors?.secondary || '#1F2937';
  const paymentName = config?.labels?.paymentName || 'Contributions';
  const broadcastsLabel = config?.labels?.broadcastsLabel || 'Updates';
  const marketplaceLabel = config?.labels?.marketplaceLabel || 'Sokoni';
  const welcomeMessage = config?.labels?.welcomeMessage || `Welcome to ${title}`;
  const tagline = config?.branding?.tagline || 'Supporting Each Other';
  const currency = config?.localization?.currency || 'KES';
  const monthlyAmount = config?.modules?.payments?.monthlyAmount || 500;
  
  // Features
  const features = config?.features || {};
  const hasFinance = features.finance !== false;
  const hasMeetingNotes = features.meetingNotes !== false;
  const hasBroadcasts = features.broadcasts !== false;
  const hasTableBanking = features.tablebanking !== false;
  const hasMarketplace = features.marketplace !== false;
  const hasEvents = features.events !== false;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load broadcasts
        try {
          // const broadcasts = await getBroadcasts();
          // setRecentBroadcasts((broadcasts || []).slice(0, 3));
          // const unread = await getUnreadBroadcastsCount();
          // setUnreadCount(unread);
        } catch (e) {
          console.warn('Could not load broadcasts:', e);
        }


        // --- ADD THE TABLE BANKING SUMMARY CALL HERE ---
        try {
            const bankingSummary = await getTableBankingSummary();
            // Assuming setStats is used elsewhere for general stats
            setStats(prev => ({
                ...prev,
                balance: bankingSummary.balance || 0
            }));
        } catch (e) {
            console.warn('Could not load table banking summary:', e);
        }

        // Simulate other data loading
        setTimeout(() => {
          setLoading(false);
        }, 300);
      } catch (err) {
        console.error('Error loading home data:', err);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (amount) => {
    return `${currency} ${parseFloat(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getQuickActions = () => {
    const actions = [];
    
    if (hasFinance) {
      actions.push({
        id: 'pay',
        label: 'Pay Contribution',
        icon: '💰',
        color: primaryColor,
        route: '/finance'
      });
    }

    if (hasMeetingNotes) {
      actions.push({
        id: 'meetingNotes',
        label: 'Meeting Notes',
        icon: '📋',
        color: '#3B82F6',
        route: '/meeting-notes'
      });
    }

    if (hasBroadcasts) {
      actions.push({
        id: 'broadcasts',
        label: broadcastsLabel,
        icon: '📢',
        color: '#8B5CF6',
        route: '/broadcasts',
        badge: unreadCount > 0 ? unreadCount : null
      });
    }

    if (hasTableBanking) {
      actions.push({
        id: 'tablebanking',
        label: 'Table Banking',
        icon: '📋',
        color: '#F59E0B',
        route: '/table-banking'
      });
    }

    if (hasMarketplace) {
      actions.push({
        id: 'sokoni',
        label: marketplaceLabel,
        icon: '🛒',
        color: '#10B981',
        route: '/sokoni',
        isModal: true
      });
    }

    return actions;
  };

  function openSokoni() {
    setSokoniOpen(true);
    // Fetch shops when modal opens
    try {
      getActiveShops().then(shopsData => {
        setShops(shopsData);
      }).catch(error => {
        console.error('Error fetching shops:', error);
        setShops([]);
      });
    } catch (error) {
      console.error('Error fetching shops:', error);
      setShops([]);
    }
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#F3F4F6'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTopColor: primaryColor,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', paddingBottom: '80px' }}>
      {/* Welcome Section */}
      <div style={{
        marginBottom: '24px'
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.75rem', 
          fontWeight: 700,
          color: '#1F2937'
        }}>
          👋 Hello, {user?.first_name || user?.full_name || 'Member'}
        </h1>
        <p style={{ 
          margin: '4px 0 0', 
          color: '#6B7280',
          fontSize: '0.9rem'
        }}>
          {welcomeMessage}
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div 
          onClick={() => hasFinance && navigate('/finance')}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid #e5e7eb',
            cursor: hasFinance ? 'pointer' : 'default',
            opacity: hasFinance ? 1 : 0.6
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>💰</div>
          <p style={{ 
            margin: 0, 
            fontSize: '0.75rem', 
            color: '#6B7280',
            marginBottom: '4px'
          }}>
            Balance
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '1rem', 
            fontWeight: 700,
            color: '#1F2937'
          }}>
            {formatCurrency(stats.balance)}
          </p>
        </div>

        <div 
          onClick={() => hasFinance && navigate('/finance')}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid #e5e7eb',
            cursor: hasFinance ? 'pointer' : 'default',
            opacity: hasFinance ? 1 : 0.6
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📅</div>
          <p style={{ 
            margin: 0, 
            fontSize: '0.75rem', 
            color: '#6B7280',
            marginBottom: '4px'
          }}>
            Due
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '1rem', 
            fontWeight: 700,
            color: primaryColor
          }}>
            {formatCurrency(stats.contributions)}
          </p>
        </div>

        <div 
          onClick={() => hasEvents && navigate('/events')}
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            border: '1px solid #e5e7eb',
            cursor: hasEvents ? 'pointer' : 'default',
            opacity: hasEvents ? 1 : 0.6
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📅</div>
          <p style={{ 
            margin: 0, 
            fontSize: '0.75rem', 
            color: '#6B7280',
            marginBottom: '4px'
          }}>
            Events
          </p>
          <p style={{ 
            margin: 0, 
            fontSize: '1rem', 
            fontWeight: 700,
            color: '#1F2937'
          }}>
            {stats.events}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          margin: '0 0 12px', 
          fontSize: '1rem', 
          fontWeight: 600,
          color: '#1F2937'
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px'
        }}>
          {getQuickActions().map((action) => (
            <button
              key={action.id}
              onClick={() => action.isModal ? openSokoni() : navigate(action.route)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '16px 12px',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{action.icon}</div>
              <p style={{ 
                margin: 0, 
                fontSize: '0.75rem', 
                fontWeight: 500,
                color: '#374151',
                lineHeight: 1.3
              }}>
                {action.label}
              </p>
              {action.badge && (
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#EF4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '0.65rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600
                }}>
                  {action.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Updates */}
      {hasBroadcasts && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <h2 style={{ 
              margin: 0, 
              fontSize: '1rem', 
              fontWeight: 600,
              color: '#1F2937'
            }}>
              📢 {broadcastsLabel}
            </h2>
            <button
              onClick={() => navigate('/broadcasts')}
              style={{
                background: 'none',
                border: 'none',
                color: primaryColor,
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500
              }}
            >
              View All →
            </button>
          </div>

          {recentBroadcasts.length === 0 ? (
            <p style={{ 
              color: '#6B7280', 
              textAlign: 'center',
              padding: '20px',
              margin: 0
            }}>
              No recent updates
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentBroadcasts.map((broadcast) => (
                <div
                  key={broadcast.id}
                  onClick={() => navigate('/broadcasts')}
                  style={{
                    padding: '12px',
                    background: '#F9FAFB',
                    borderRadius: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <h3 style={{ 
                    margin: '0 0 4px', 
                    fontSize: '0.9rem', 
                    fontWeight: 600,
                    color: '#1F2937'
                  }}>
                    {broadcast.title}
                  </h3>
                  <p style={{ 
                    margin: '0 0 8px', 
                    fontSize: '0.8rem', 
                    color: '#6B7280',
                    lineHeight: 1.4
                  }}>
                    {broadcast.content?.substring(0, 80)}...
                  </p>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    color: '#9CA3AF'
                  }}>
                    {formatDate(broadcast.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sokoni Modal */}
      <SokoniModal
        isOpen={sokoniOpen}
        onClose={() => setSokoniOpen(false)}
        shops={shops}
      />

      {/* Footer */}
      <div style={{
        marginTop: '32px',
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: '0.75rem'
      }}>
        <p style={{ margin: 0 }}>
          © 2024 {shortName}
        </p>
        <p style={{ margin: '4px 0 0' }}>
          {tagline}
        </p>
      </div>
    </div>
  );
};

export default Home;
