import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, apiRequest } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';

const Finance = () => {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [balance, setBalance] = useState({ current: 0, due: 500, paid: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  // Get configuration
  const getConfig = () => {
    try {
      if (window.config) {
        return {
          monthlyAmount: window.config.modules?.payments?.monthlyAmount || 500,
          currency: window.config.localization?.currency || 'KES',
          primaryColor: window.config.theme?.colors?.primary || '#E31C23',
          secondaryColor: window.config.theme?.colors?.secondary || '#1F2937',
        };
      }
    } catch (e) {
      console.warn('Could not load config:', e);
    }
    return {
      monthlyAmount: 500,
      currency: 'KES',
      primaryColor: '#E31C23',
      secondaryColor: '#1F2937',
    };
  };

  const config = getConfig();

  // Load financial data
  useEffect(() => {
    const loadData = async () => {
      try {
        // In production, this would call N8N to get real data
        // For now, use mock data
        setTimeout(() => {
          setBalance({
            current: 3500,
            due: 500,
            paid: 500
          });
          setTransactions([
            { id: 1, type: 'in', amount: 500, description: 'January 2024 Contribution', date: '2024-01-15' },
            { id: 2, type: 'in', amount: 500, description: 'December 2023 Contribution', date: '2023-12-20' },
            { id: 3, type: 'in', amount: 500, description: 'November 2023 Contribution', date: '2023-11-18' },
            { id: 4, type: 'out', amount: 5000, description: 'Bereavement payout - John Mwangi', date: '2023-11-10' },
            { id: 5, type: 'in', amount: 500, description: 'October 2023 Contribution', date: '2023-10-22' },
          ]);
          setLoading(false);
        }, 600);
      } catch (err) {
        console.error('Error loading finance data:', err);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handlePayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) < 10) {
      alert('Please enter a valid amount (minimum 10)');
      return;
    }

    setProcessing(true);
    try {
      // In production, this would trigger N8N MPESA workflow
      // const response = await apiRequest(API_ENDPOINTS.initiatePayment, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     user_id: user.id,
      //     phone: user.phone,
      //     amount: paymentAmount
      //   })
      // });

      // For demo, simulate successful trigger
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`Payment request for ${config.currency} ${parseFloat(paymentAmount).toLocaleString()} sent to ${user.phone}. Please check your phone for the STK push prompt.`);
      setShowPaymentModal(false);
      setPaymentAmount('');
    } catch (err) {
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    return `${config.currency} ${parseFloat(amount || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Calculate progress
  const progressPercent = Math.min(100, (balance.paid / config.monthlyAmount) * 100);

  return (
    <div style={{ padding: '16px', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            color: config.primaryColor,
            cursor: 'pointer',
            fontSize: '0.875rem',
            marginBottom: '12px',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          ← Back
        </button>
        <h1 style={{ 
          margin: 0, 
          fontSize: '1.5rem', 
          fontWeight: 700,
          color: '#1F2937'
        }}>
          💰 {config.modules?.payments?.name || 'Contributions'}
        </h1>
        <p style={{ 
          margin: '4px 0 0', 
          color: '#6B7280',
          fontSize: '0.875rem'
        }}>
          Manage your monthly welfare contributions
        </p>
      </div>

      {loading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          color: '#6B7280'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid #e5e7eb',
            borderTopColor: config.primaryColor,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '12px'
          }} />
          <p>Loading financial data...</p>
        </div>
      ) : (
        <>
          {/* Balance Card */}
          <div style={{
            background: `linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%)`,
            borderRadius: '20px',
            padding: '24px',
            color: 'white',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative circles */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-20px',
              left: '-20px',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ 
                margin: 0, 
                fontSize: '0.875rem', 
                opacity: 0.9,
                marginBottom: '8px'
              }}>
                Total Contribution Balance
              </p>
              <h2 style={{ 
                margin: 0, 
                fontSize: '2.5rem', 
                fontWeight: 700,
                marginBottom: '24px'
              }}>
                {formatCurrency(balance.current)}
              </h2>

              {/* Monthly Progress */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontSize: '0.875rem'
                }}>
                  <span>Monthly Progress</span>
                  <span>{formatCurrency(balance.paid)} / {formatCurrency(config.monthlyAmount)}</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: 'white',
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Status */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px'
              }}>
                <span style={{
                  background: balance.paid >= config.monthlyAmount ? '#10B981' : '#F59E0B',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>
                  {balance.paid >= config.monthlyAmount ? '✅ Up to Date' : `⚠️ KES ${balance.due} Due`}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '12px',
            marginBottom: '24px'
          }}>
            <button
              onClick={() => {
                setPaymentAmount(config.monthlyAmount.toString());
                setShowPaymentModal(true);
              }}
              style={{
                background: config.primaryColor,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              💸 Pay Monthly
            </button>
            <button
              onClick={() => {
                setPaymentAmount('');
                setShowPaymentModal(true);
              }}
              style={{
                background: 'white',
                color: config.primaryColor,
                border: `1px solid ${config.primaryColor}`,
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}
            >
              🎁 Extra Contribution
            </button>
          </div>

          {/* Transaction History */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              margin: '0 0 16px', 
              fontSize: '1rem', 
              fontWeight: 600,
              color: '#1F2937'
            }}>
              Recent Transactions
            </h3>

            {transactions.length === 0 ? (
              <p style={{ color: '#6B7280', textAlign: 'center', padding: '20px' }}>
                No transactions yet
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {transactions.slice(0, 5).map((tx) => (
                  <div 
                    key={tx.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      borderBottom: '1px solid #f3f4f6'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: tx.type === 'in' ? '#d1fae5' : '#fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1rem'
                      }}>
                        {tx.type === 'in' ? '↓' : '↑'}
                      </div>
                      <div>
                        <p style={{ 
                          margin: 0, 
                          fontSize: '0.9rem', 
                          fontWeight: 500,
                          color: '#1F2937'
                        }}>
                          {tx.description}
                        </p>
                        <p style={{ 
                          margin: '2px 0 0', 
                          fontSize: '0.75rem', 
                          color: '#9CA3AF'
                        }}>
                          {formatDate(tx.date)}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: tx.type === 'in' ? '#10B981' : '#EF4444'
                    }}>
                      {tx.type === 'in' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {transactions.length > 5 && (
              <button
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '12px',
                  background: 'none',
                  border: 'none',
                  color: config.primaryColor,
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}
              >
                View All Transactions →
              </button>
            )}
          </div>
        </>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowPaymentModal(false)}>
          <div 
            style={{
              background: 'white',
              borderRadius: '20px 20px 0 0',
              padding: '24px',
              width: '100%',
              maxWidth: '500px',
              animation: 'slideUp 0.3s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ 
              margin: '0 0 20px', 
              fontSize: '1.25rem', 
              fontWeight: 600,
              textAlign: 'center'
            }}>
              Make a Contribution
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#374151'
              }}>
                Amount ({config.currency})
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
              {parseFloat(paymentAmount) > 0 && (
                <p style={{
                  margin: '8px 0 0',
                  fontSize: '0.875rem',
                  color: '#6B7280'
                }}>
                  M-PESA charges may apply
                </p>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={processing || !paymentAmount}
              style={{
                width: '100%',
                padding: '16px',
                background: processing ? '#9CA3AF' : config.primaryColor,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: processing ? 'not-allowed' : 'pointer',
                marginBottom: '12px'
              }}
            >
              {processing ? 'Processing...' : `Pay ${formatCurrency(paymentAmount)} via M-PESA`}
            </button>

            <button
              onClick={() => setShowPaymentModal(false)}
              style={{
                width: '100%',
                padding: '14px',
                background: 'none',
                border: 'none',
                color: '#6B7280',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Finance;
