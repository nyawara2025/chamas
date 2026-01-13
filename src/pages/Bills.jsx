import React, { useState, useEffect, useRef } from 'react';
import { getPaymentHistory, initiateSTKPush, checkPaymentStatus, recordPayment, getStoredUser } from '../utils/apiClient';

const Bills = () => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [financials, setFinancials] = useState({
    resident_name: '',
    house_number: '',
    phase: '',
    monthly_rate: 200,
    months_count: 0,
    total_dues: 0,
    total_paid: 0,
    outstanding_balance: 0,
    payment_history: [],
  });
  const [formData, setFormData] = useState({
    phoneNumber: '',
    transactionCode: '',
    amount: 200,
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [paymentModal, setPaymentModal] = useState({
    show: false,
    status: 'idle', // idle, processing, success, failed, cancelled
    checkoutRequestId: '',
    message: '',
  });
  const [activeTab, setActiveTab] = useState('stk'); // 'stk' or 'manual'

  const user = getStoredUser();
  const residentId = user?.id;
  const pollTimerRef = useRef(null);

  useEffect(() => {
    if (residentId) {
      loadFinancials();
      // Pre-fill phone number from user profile
      if (user?.phone) {
        setFormData(prev => ({ ...prev, phoneNumber: user.phone.replace(/^0/, '254') }));
      }
    }

    return () => {
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
      }
    };
  }, [residentId]);

  const loadFinancials = async () => {
    try {
      setLoading(true);
      const data = await getPaymentHistory(residentId);
      setFinancials(data);
      setFormData(prev => ({ ...prev, amount: data.outstanding_balance || 200 }));
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSTKPush = async (e) => {
    e.preventDefault();

    if (!formData.phoneNumber) {
      setMessage({ type: 'error', text: 'Please enter your M-Pesa phone number' });
      return;
    }

    // Validate phone number format
    const phoneRegex = /^(254|0)[71]\d{8}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setMessage({ type: 'error', text: 'Please enter a valid M-Pesa phone number (e.g., 2547XXXXXXXX or 07XXXXXXXX)' });
      return;
    }

    try {
      setProcessing(true);
      setMessage({ type: '', text: '' });
      setPaymentModal({
        show: true,
        status: 'processing',
        checkoutRequestId: '',
        message: 'Initiating payment...',
      });

      const response = await initiateSTKPush(residentId, formData.phoneNumber, formData.amount);

      if (response.success) {
        setPaymentModal(prev => ({
          ...prev,
          checkoutRequestId: response.checkout_request_id,
          message: 'Please check your phone and enter your M-Pesa PIN',
        }));

        // Start polling for payment status
        startPolling(response.checkout_request_id);
      } else {
        setPaymentModal(prev => ({
          ...prev,
          status: 'failed',
          message: response.message || 'Failed to initiate payment',
        }));
      }
    } catch (error) {
      setPaymentModal(prev => ({
        ...prev,
        status: 'failed',
        message: error.message || 'An error occurred',
      }));
    } finally {
      setProcessing(false);
    }
  };

  const startPolling = (checkoutRequestId) => {
    let attempts = 0;
    const maxAttempts = 20; // Poll for up to 60 seconds (3s intervals)

    pollTimerRef.current = setInterval(async () => {
      attempts++;

      try {
        const status = await checkPaymentStatus(checkoutRequestId);

        if (status.status === 'COMPLETED') {
          clearInterval(pollTimerRef.current);
          setPaymentModal(prev => ({
            ...prev,
            status: 'success',
            message: `Payment successful! Receipt: ${status.receipt_number}`,
          }));
          loadFinancials();
        } else if (status.status === 'FAILED' || status.status === 'CANCELLED') {
          clearInterval(pollTimerRef.current);
          setPaymentModal(prev => ({
            ...prev,
            status: status.status === 'CANCELLED' ? 'cancelled' : 'failed',
            message: status.message || 'Payment was not completed',
          }));
        } else if (attempts >= maxAttempts) {
          clearInterval(pollTimerRef.current);
          setPaymentModal(prev => ({
            ...prev,
            status: 'timeout',
            message: 'Payment timed out. Please check your phone or use manual payment.',
          }));
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 3000);
  };

  const handleManualPayment = async (e) => {
    e.preventDefault();

    if (!formData.transactionCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter the M-Pesa transaction code' });
      return;
    }

    try {
      setProcessing(true);
      setMessage({ type: '', text: '' });

      const response = await recordPayment(residentId, formData.amount, formData.transactionCode.trim());

      if (response.success) {
        setMessage({ type: 'success', text: response.message });
        setFormData({ ...formData, transactionCode: '' });
        loadFinancials();
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to record payment' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setProcessing(false);
    }
  };

  const closeModal = () => {
    setPaymentModal({ show: false, status: 'idle', checkoutRequestId: '', message: '' });
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading payment information...</p>
      </div>
    );
  }

  return (
    <div className="bills-page">
      <h1>My Dues & Payments</h1>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Outstanding Balance Card */}
      <div className={`balance-card ${financials.outstanding_balance > 0 ? 'balance-due' : 'balance-paid'}`}>
        <div className="balance-content">
          <div className="balance-label">Outstanding Balance</div>
          <div className="balance-amount">{formatCurrency(financials.outstanding_balance)}</div>
          <div className="balance-period">Service Charge - {financials.months_count} month(s) due</div>
        </div>
        <div className="balance-actions">
          <button
            className="pay-now-btn"
            onClick={() => setPaymentModal({ show: true, status: 'idle', checkoutRequestId: '', message: '' })}
            disabled={financials.outstanding_balance <= 0}
          >
            Pay Now
          </button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="summary-grid">
        <div className="summary-item">
          <div className="summary-label">Monthly Charge</div>
          <div className="summary-value">{formatCurrency(financials.monthly_rate)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Total Paid</div>
          <div className="summary-value">{formatCurrency(financials.total_paid)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Resident</div>
          <div className="summary-value">{financials.resident_name || 'N/A'}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">House</div>
          <div className="summary-value">{financials.house_number || 'N/A'}</div>
        </div>
      </div>

      {/* Payment Methods Tabs */}
      <div className="payment-section">
        <h2>Record Payment</h2>

        <div className="payment-tabs">
          <button
            className={`tab-btn ${activeTab === 'stk' ? 'active' : ''}`}
            onClick={() => setActiveTab('stk')}
          >
            M-Pesa STK Push
          </button>
          <button
            className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Entry
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'stk' ? (
            <form onSubmit={handleSTKPush} className="payment-form">
              <div className="form-info">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
                <span>You will receive an M-Pesa prompt on your phone. Enter your PIN to pay.</span>
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">M-Pesa Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="e.g., 254712345678"
                  required
                />
                <small>Format: 254XXXXXXXXX</small>
              </div>

              <div className="form-group">
                <label htmlFor="stkAmount">Amount (Kshs)</label>
                <input
                  type="number"
                  id="stkAmount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  min="1"
                  max="10000"
                  required
                />
              </div>

              <button type="submit" className="btn-primary mpesa-btn" disabled={processing}>
                {processing ? 'Processing...' : 'Pay with M-Pesa'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleManualPayment} className="payment-form">
              <div className="form-info manual">
                <h3>Manual Payment Instructions</h3>
                <div className="paybill-details">
                  <p><strong>Paybill Number:</strong> NHC Welfare</p>
                  <p><strong>Account Number:</strong> {financials.house_number || 'Your House Number'}</p>
                  <p><strong>Amount:</strong> {formatCurrency(formData.amount)}</p>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="transactionCode">M-Pesa Transaction Code</label>
                <input
                  type="text"
                  id="transactionCode"
                  value={formData.transactionCode}
                  onChange={(e) => setFormData({ ...formData, transactionCode: e.target.value.toUpperCase() })}
                  placeholder="e.g., QWE123XYZ"
                  maxLength="10"
                  required
                />
              </div>

              <button type="submit" className="btn-primary manual-btn" disabled={processing}>
                {processing ? 'Recording...' : 'Record Payment'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="history-section">
        <h2>Payment History</h2>

        {financials.payment_history.length === 0 ? (
          <div className="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
            <p>No payment records found</p>
          </div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Transaction Code</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {financials.payment_history.map((payment) => (
                <tr key={payment.id}>
                  <td>{formatDate(payment.payment_date)}</td>
                  <td className="transaction-code">
                    {payment.transaction_code || payment.mpesa_receipt_number || 'N/A'}
                  </td>
                  <td className="amount">{formatCurrency(payment.amount)}</td>
                  <td>
                    <span className={`status ${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Payment Modal */}
      {paymentModal.show && (
        <div className="modal-overlay">
          <div className={`modal-content ${paymentModal.status}`}>
            <button className="modal-close" onClick={closeModal}>×</button>

            {paymentModal.status === 'processing' && (
              <>
                <div className="modal-icon processing">
                  <div className="spinner"></div>
                </div>
                <h3>Processing Payment</h3>
                <p>{paymentModal.message}</p>
                <div className="modal-hint">
                  <span className="pulse"></span>
                  Check your phone for M-Pesa prompt
                </div>
              </>
            )}

            {paymentModal.status === 'success' && (
              <>
                <div className="modal-icon success">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <h3>Payment Successful!</h3>
                <p>{paymentModal.message}</p>
                <button className="btn-primary" onClick={closeModal}>Done</button>
              </>
            )}

            {paymentModal.status === 'failed' && (
              <>
                <div className="modal-icon failed">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <h3>Payment Failed</h3>
                <p>{paymentModal.message}</p>
                <div className="modal-actions">
                  <button className="btn-primary" onClick={() => {
                    closeModal();
                    setActiveTab('manual');
                  }}>Try Manual Payment</button>
                  <button className="btn-secondary" onClick={closeModal}>Close</button>
                </div>
              </>
            )}

            {paymentModal.status === 'cancelled' && (
              <>
                <div className="modal-icon cancelled">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="8" y1="15" x2="16" y2="9" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <h3>Payment Cancelled</h3>
                <p>You cancelled the payment on your phone.</p>
                <button className="btn-primary" onClick={closeModal}>Try Again</button>
              </>
            )}

            {paymentModal.status === 'timeout' && (
              <>
                <div className="modal-icon timeout">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <h3>Payment Timeout</h3>
                <p>{paymentModal.message}</p>
                <div className="modal-actions">
                  <button className="btn-primary" onClick={() => {
                    closeModal();
                    setActiveTab('manual');
                  }}>Use Manual Payment</button>
                  <button className="btn-secondary" onClick={closeModal}>Close</button>
                </div>
              </>
            )}

            {paymentModal.status === 'idle' && (
              <>
                <div className="modal-icon idle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </div>
                <h3>Pay with M-Pesa</h3>
                <p className="payment-amount">{formatCurrency(formData.amount)}</p>
                <p className="payment-phone">{formData.phoneNumber}</p>
                <button
                  className="btn-primary mpesa-btn"
                  onClick={handleSTKPush}
                  disabled={processing}
                >
                  {processing ? 'Processing...' : 'Confirm Payment'}
                </button>
                <button className="btn-link" onClick={closeModal}>Cancel</button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .bills-page {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .bills-page h1 {
          font-size: 1.5rem;
          color: #1f2937;
          margin-bottom: 20px;
          font-weight: 600;
        }

        .bills-page h2 {
          font-size: 1.125rem;
          color: #1f2937;
          margin-bottom: 16px;
          font-weight: 600;
        }

        .message {
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.875rem;
        }

        .message.error {
          background-color: #fee2e2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .message.success {
          background-color: #dcfce7;
          color: #16a34a;
          border: 1px solid #bbf7d0;
        }

        /* Balance Card */
        .balance-card {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .balance-card.balance-due {
          background: linear-gradient(135deg, #dc2626 0%, #f87171 100%);
        }

        .balance-card.balance-paid {
          background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
        }

        .balance-label {
          font-size: 0.875rem;
          opacity: 0.9;
          margin-bottom: 4px;
        }

        .balance-amount {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .balance-period {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .pay-now-btn {
          background: white;
          color: #1e3a8a;
          border: none;
          padding: 12px 32px;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .pay-now-btn:hover:not(:disabled) {
          transform: scale(1.05);
        }

        .pay-now-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Summary Grid */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 24px;
        }

        .summary-item {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .summary-label {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
          margin-top: 4px;
        }

        /* Payment Section */
        .payment-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .payment-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .tab-btn {
          flex: 1;
          padding: 12px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab-btn.active {
          border-color: #3b82f6;
          color: #3b82f6;
          background: #eff6ff;
        }

        .tab-content {
          padding: 8px 0;
        }

        .payment-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-info {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #eff6ff;
          border-radius: 8px;
          color: #1e40af;
          font-size: 0.875rem;
        }

        .form-info svg {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .form-info.manual {
          background: #f3f4f6;
          color: #374151;
        }

        .paybill-details {
          margin-top: 8px;
          padding: 12px;
          background: white;
          border-radius: 6px;
        }

        .paybill-details p {
          margin-bottom: 4px;
          font-size: 0.875rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .form-group input {
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group small {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .btn-primary {
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-primary.mpesa-btn {
          background: #39B54A;
          color: white;
        }

        .btn-primary.mpesa-btn:hover:not(:disabled) {
          background: #2e8b3a;
        }

        .btn-primary.manual-btn {
          background: #3b82f6;
          color: white;
        }

        .btn-primary.manual-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-secondary {
          padding: 12px 24px;
          background: #e5e7eb;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-link {
          background: none;
          border: none;
          color: #6b7280;
          font-size: 0.875rem;
          cursor: pointer;
          text-decoration: underline;
        }

        /* History Section */
        .history-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 20px;
          color: #9ca3af;
        }

        .empty-state svg {
          width: 48px;
          height: 48px;
          margin-bottom: 12px;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.875rem;
        }

        .history-table th {
          text-align: left;
          padding: 12px 8px;
          border-bottom: 2px solid #e5e7eb;
          color: #6b7280;
          font-weight: 500;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .history-table td {
          padding: 12px 8px;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
        }

        .transaction-code {
          font-family: monospace;
          font-weight: 500;
        }

        .amount {
          font-weight: 500;
        }

        .status {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status.completed {
          background-color: #dcfce7;
          color: #16a34a;
        }

        .status.pending {
          background-color: #fef3c7;
          color: #d97706;
        }

        .status.failed {
          background-color: #fee2e2;
          color: #dc2626;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 32px;
          max-width: 400px;
          width: 100%;
          text-align: center;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #9ca3af;
          cursor: pointer;
        }

        .modal-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .modal-icon svg {
          width: 40px;
          height: 40px;
        }

        .modal-icon.processing {
          background: #eff6ff;
          color: #3b82f6;
        }

        .modal-icon.success {
          background: #dcfce7;
          color: #16a34a;
        }

        .modal-icon.failed, .modal-icon.cancelled {
          background: #fee2e2;
          color: #dc2626;
        }

        .modal-icon.timeout {
          background: #fef3c7;
          color: #d97706;
        }

        .modal-icon.idle {
          background: #f3f4f6;
          color: #6b7280;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .modal-content h3 {
          font-size: 1.25rem;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .modal-content p {
          color: #6b7280;
          margin-bottom: 16px;
        }

        .payment-amount {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937 !important;
        }

        .payment-phone {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .modal-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .pulse {
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }

        .modal-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Loading */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          color: #6b7280;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e5e7eb;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Bills;
