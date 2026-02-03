import React, { useState, useEffect, useContext } from 'react';
import { 
  getStoredUser, 
  getTableBankingSummary, 
  logTableBankingSession, 
  getTableBankingHistory 
} from '../utils/apiClient';
import { ConfigContext } from '../App';

const TableBanking = () => {
  const user = getStoredUser();
  const config = useContext(ConfigContext);
  const primaryColor = config?.theme?.colors?.primary || '#E31C23';

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ balance: 0, due_date: null });
  const [history, setHistory] = useState([]);
  const [isAdmin, setIsAdmin] = useState(user?.role === 'admin' || user?.role === 'treasurer');

  // Treasurer Form State
  const [totalFundraised, setTotalFundraised] = useState('');
  const [allocations, setAllocations] = useState([{ member_id: '', amount: '' }]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBankingData();
  }, []);

  // Fetch summary and history
  const loadBankingData = async () => {
  try {
    setLoading(true);
    
    // Just call the function with the phone number
    // The apiClient will fetch the orgId itself from its internal cache
    const data = await getTableBankingSummary(user?.phone);
    
    setSummary(data);
    const historyData = await getTableBankingHistory();
    setHistory(historyData);
  } catch (err) {
    console.error('Error loading banking data:', err);
    // Remove the alert for now so it doesn't annoy you during debugging
  } finally {
    setLoading(false);
  }
};



  // Add another allocation input
  const handleAddAllocation = () => {
    setAllocations((allocs) => [...allocs, { member_id: '', amount: '' }]);
  };

  // Handle individual allocation input change
  const handleAllocationChange = (index, field, value) => {
    setAllocations((allocs) => {
      const newAlloc = [...allocs];
      newAlloc[index][field] = value;
      return newAlloc;
    });
  };

  // Validation helper: check allocations validity
  const isAllocationValid = (alloc) => {
    return (
      alloc.member_id.trim() !== '' &&
      !isNaN(alloc.member_id) &&
      alloc.amount.trim() !== '' &&
      !isNaN(alloc.amount) &&
      parseFloat(alloc.amount) > 0
    );
  };

  // Overall form validity
  const canSubmit = () => {
    if (!totalFundraised || isNaN(totalFundraised) || parseFloat(totalFundraised) <= 0) return false;
    if (allocations.length === 0) return false;
    for (const alloc of allocations) {
      if (!isAllocationValid(alloc)) return false;
    }
    return true;
  };

  // Submit meeting session
  const handleSubmitSession = async (e) => {
    e.preventDefault();
    if (!canSubmit()) {
      alert('Please fill all fields correctly before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        total_fundraised: parseFloat(totalFundraised),
        loans: allocations.map((a) => ({
          member_id: parseInt(a.member_id, 10),
          loan_amount: parseFloat(a.amount),
        })),
      };

      await logTableBankingSession(payload);
      alert('Meeting session logged successfully!');
      setTotalFundraised('');
      setAllocations([{ member_id: '', amount: '' }]);
      loadBankingData();
    } catch (err) {
      alert('Failed to log session: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
        Loading table banking data...
      </div>
    );

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Summary Card */}
      <section
        aria-labelledby="table-banking-summary"
        style={{
          background: primaryColor,
          color: 'white',
          padding: '24px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <p id="table-banking-summary" style={{ margin: 0, opacity: 0.9 }}>
          Current Soft Loan Balance
        </p>
        <h2 style={{ margin: '8px 0', fontSize: '2rem' }}>
          KES {parseFloat(summary.balance || 0).toLocaleString()}
        </h2>
        {summary.due_date && (
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Due by next meeting:{' '}
            {new Date(summary.due_date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        )}
      </section>

      {/* Treasurer Input Section */}
      {isAdmin && (
        <section
          aria-labelledby="treasurer-section"
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid #e5e7eb',
          }}
        >
          <h3 id="treasurer-section" style={{ marginTop: 0, color: '#1F2937' }}>
            Treasurer: Meeting Input
          </h3>
          <form onSubmit={handleSubmitSession} noValidate>
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="fundraised-input" style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem' }}>
                Total Fundraised Today (Impromptu)
              </label>
              <input
                id="fundraised-input"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                value={totalFundraised}
                onChange={(e) => setTotalFundraised(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                }}
                placeholder="Total amount collected"
                required
                aria-required="true"
                aria-describedby="fundraised-error"
              />
              {!totalFundraised || parseFloat(totalFundraised) <= 0 ? (
                <p id="fundraised-error" style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '4px' }}>
                  Please enter a valid fundraised amount
                </p>
              ) : null}
            </div>

            <fieldset style={{ border: 'none', padding: 0 }}>
              <legend style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Loan Allocations</legend>
              {allocations.map((alloc, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    aria-label={`Member ID for allocation #${i + 1}`}
                    value={alloc.member_id}
                    placeholder="Member ID"
                    onChange={(e) => handleAllocationChange(i, 'member_id', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                    }}
                    required
                  />
                  <input
                    type="number"
                    aria-label={`Amount for allocation #${i + 1}`}
                    value={alloc.amount}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    onChange={(e) => handleAllocationChange(i, 'amount', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                    }}
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddAllocation}
                style={{
                  color: primaryColor,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  marginBottom: '16px',
                  display: 'inline-block',
                }}
                aria-label="Add another loan allocation"
              >
                + Add another applicant
              </button>
            </fieldset>

            <button
              type="submit"
              disabled={!canSubmit() || submitting}
              style={{
                width: '100%',
                background: submitting ? '#a7f3d0' : '#10B981',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                transition: 'background-color 0.3s ease',
              }}
              aria-disabled={!canSubmit() || submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Meeting Records'}
            </button>
          </form>
        </section>
      )}

      {/* History Section */}
      <section aria-labelledby="history-section">
        <h3 id="history-section" style={{ color: '#1F2937' }}>
          Recent History
        </h3>
        {history.length > 0 ? (
          history.map((item, i) => (
            <article
              key={i}
              style={{
                background: 'white',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                border: '1px solid #f3f4f6',
              }}
              aria-label={`${item.type || 'Soft Loan'} on ${new Date(item.date).toLocaleDateString()}`}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{item.type || 'Soft Loan'}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>
                  {new Date(item.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: item.amount < 0 ? '#DC2626' : '#059669',
                }}
              >
                {item.amount < 0 ? '-' : '+'} KES {Math.abs(item.amount).toLocaleString()}
              </p>
            </article>
          ))
        ) : (
          <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>No recent activity found.</p>
        )}
      </section>
    </div>
  );
};

export default TableBanking;
