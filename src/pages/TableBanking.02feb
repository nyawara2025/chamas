import React, { useState, useEffect, useContext } from 'react';
import { getStoredUser, getTableBankingSummary, logTableBankingSession, getTableBankingHistory } from '../utils/apiClient';
import { ConfigContext } from '../App';

const TableBanking = () => {
  const user = getStoredUser();
  const config = useContext(ConfigContext);
  const primaryColor = config?.theme?.colors?.primary || '#E31C23';

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ balance: 0, next_payment: null });
  const [history, setHistory] = useState([]);
  const [isAdmin, setIsAdmin] = useState(user?.role === 'admin' || user?.role === 'treasurer');

  // Treasurer Form State
  const [totalFundraised, setTotalFundraised] = useState('');
  const [allocations, setAllocations] = useState([{ member_id: '', amount: '' }]);

  useEffect(() => {
    loadBankingData();
  }, []);

  const loadBankingData = async () => {
    try {
      setLoading(true);
      const data = await getTableBankingSummary();
      setSummary(data);
      const historyData = await getTableBankingHistory();
      setHistory(historyData);
    } catch (err) {
      console.error('Error loading banking data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllocation = () => {
    setAllocations([...allocations, { member_id: '', amount: '' }]);
  };

  const handleSubmitSession = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        total_fundraised: parseFloat(totalFundraised),
        loans: allocations.map(a => ({ 
          member_id: parseInt(a.member_id), 
          loan_amount: parseFloat(a.amount) 
        }))
      };
      await logTableBankingSession(payload);
      alert('Meeting session logged successfully!');
      setTotalFundraised('');
      setAllocations([{ member_id: '', amount: '' }]);
      loadBankingData();
    } catch (err) {
      alert('Failed to log session: ' + err.message);
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Member Summary Card */}
      <div style={{ 
        background: primaryColor, 
        color: 'white', 
        padding: '24px', 
        borderRadius: '16px', 
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: 0, opacity: 0.9 }}>Current Soft Loan Balance</p>
        <h2 style={{ margin: '8px 0', fontSize: '2rem' }}>
          KES {parseFloat(summary.balance || 0).toLocaleString()}
        </h2>
        {summary.due_date && (
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Due by next meeting: {new Date(summary.due_date).toLocaleDateString()}
          </p>
        )}
      </div>

      {/* Treasurer Section */}
      {isAdmin && (
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ marginTop: 0, color: '#1F2937' }}>Treasurer: Meeting Input</h3>
          <form onSubmit={handleSubmitSession}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '4px' }}>Total Fundraised Today (Impromptu)</label>
              <input 
                type="number" 
                value={totalFundraised} 
                onChange={(e) => setTotalFundraised(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                placeholder="Total amount collected"
                required
              />
            </div>

            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>Loan Allocations</p>
            {allocations.map((alloc, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input 
                  placeholder="Member ID" 
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                  onChange={(e) => {
                    const newAlloc = [...allocations];
                    newAlloc[index].member_id = e.target.value;
                    setAllocations(newAlloc);
                  }}
                  required
                />
                <input 
                  placeholder="Amount" 
                  type="number"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                  onChange={(e) => {
                    const newAlloc = [...allocations];
                    newAlloc[index].amount = e.target.value;
                    setAllocations(newAlloc);
                  }}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={handleAddAllocation} style={{ color: primaryColor, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', marginBottom: '16px' }}>
              + Add another applicant
            </button>
            <button type="submit" style={{ width: '100%', background: '#10B981', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600 }}>
              Submit Meeting Records
            </button>
          </form>
        </div>
      )}

      {/* History Section */}
      <h3 style={{ color: '#1F2937' }}>Recent History</h3>
      {history.length > 0 ? history.map((item, i) => (
        <div key={i} style={{ background: 'white', padding: '12px', borderRadius: '8px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', border: '1px solid #f3f4f6' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 600 }}>{item.type || 'Soft Loan'}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>{new Date(item.date).toLocaleDateString()}</p>
          </div>
          <p style={{ margin: 0, fontWeight: 700, color: item.amount < 0 ? '#DC2626' : '#059669' }}>
            {item.amount < 0 ? '-' : '+'} KES {Math.abs(item.amount).toLocaleString()}
          </p>
        </div>
      )) : <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>No recent activity found.</p>}
    </div>
  );
};

export default TableBanking;
