import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActiveMembers, logAttendance } from '../utils/apiClient';
import { ConfigContext } from '../App';

const AttendanceAdmin = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const config = useContext(ConfigContext);
  const primaryColor = config?.theme?.colors?.primary || '#E31C23';

  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getActiveMembers();
        setMembers(data);
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  const toggleMember = (id) => {
    setSelectedMembers(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (selectedMembers.length === 0) {
      alert('Please select at least one member');
      return;
    }
    setSubmitting(true);
    try {
      await logAttendance(meetingId, selectedMembers);
      alert('Attendance saved successfully!');
      navigate('/meeting-notes');
    } catch (err) {
      alert('Failed to save attendance');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Member List...</div>;

  return (
    <div style={{ padding: '16px', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '10px' }}>Mark Attendance</h2>
      <p style={{ color: '#64748b', marginBottom: '20px', fontSize: '0.9rem' }}>
        Select members present for Meeting ID: {meetingId}
      </p>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '20px' }}>
        {members.map(member => (
          <div 
            key={member.id} 
            onClick={() => toggleMember(member.id)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '12px 16px', 
              borderBottom: '1px solid #f3f4f6',
              cursor: 'pointer',
              background: selectedMembers.includes(member.id) ? '#fef2f2' : 'transparent'
            }}
          >
            <input 
              type="checkbox" 
              checked={selectedMembers.includes(member.id)}
              readOnly
              style={{ marginRight: '12px', transform: 'scale(1.2)' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: '#1f2937' }}>{member.first_name} {member.last_name}</div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Member #{member.membership_number}</div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleSave}
        disabled={submitting}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: primaryColor,
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '700',
          cursor: 'pointer',
          opacity: submitting ? 0.7 : 1
        }}
      >
        {submitting ? 'Saving Attendance...' : `Confirm Attendance (${selectedMembers.length})`}
      </button>
    </div>
  );
};

export default AttendanceAdmin;
