import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser } from '../utils/apiClient';

const MeetingNotes = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Get configuration
  const getConfig = () => {
    try {
      if (window.config) {
        return {
          categories: window.config.modules?.meetingNotes?.categories || ['Minutes', 'Agendas', 'Constitution', 'Reports', 'Policies'],
          primaryColor: window.config.theme?.colors?.primary || '#E31C23',
          secondaryColor: window.config.theme?.colors?.secondary || '#1F2937',
        };
      }
    } catch (e) {
      console.warn('Could not load config:', e);
    }
    return {
      categories: ['Minutes', 'Agendas', 'Constitution', 'Reports', 'Policies'],
      primaryColor: '#E31C23',
      secondaryColor: '#1F2937',
    };
  };

  const config = getConfig();
  const categories = ['All', ...config.categories];

  // Mock data - in production, this would come from N8N/webhook
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setNotes([
        {
          id: 1,
          title: 'June 2024 Monthly Meeting Minutes',
          category: 'Minutes',
          date: '2024-06-15',
          size: '245 KB',
          description: 'Full minutes from the monthly welfare meeting discussing finances and upcoming events.'
        },
        {
          id: 2,
          title: 'July 2024 AGM Agenda',
          category: 'Agendas',
          date: '2024-07-01',
          size: '125 KB',
          description: 'Agenda for the Annual General Meeting including election of new officials.'
        },
        {
          id: 3,
          title: 'Welfare Constitution 2024',
          category: 'Constitution',
          date: '2024-01-10',
          size: '512 KB',
          description: 'Updated constitution outlining rules, regulations, and membership terms.'
        },
        {
          id: 4,
          title: 'Q2 2024 Financial Report',
          category: 'Reports',
          date: '2024-06-30',
          size: '890 KB',
          description: 'Quarterly financial statement showing contributions, disbursements, and balances.'
        },
        {
          id: 5,
          title: 'Contribution Guidelines Policy',
          category: 'Policies',
          date: '2024-02-01',
          size: '156 KB',
          description: 'Policy document explaining monthly contribution amounts and payment procedures.'
        },
        {
          id: 6,
          title: 'May 2024 Meeting Minutes',
          category: 'Minutes',
          date: '2024-05-20',
          size: '198 KB',
          description: 'Minutes from May meeting covering member benefits and MPESA integration.'
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const filteredNotes = activeCategory === 'All' 
    ? notes 
    : notes.filter(note => note.category === activeCategory);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Minutes': '#3B82F6',
      'Agendas': '#8B5CF6',
      'Constitution': '#059669',
      'Reports': '#F59E0B',
      'Policies': '#EC4899'
    };
    return colors[category] || config.primaryColor;
  };

  const handleOpenNote = (note) => {
    // In production, this would open the PDF or navigate to a viewer
    alert(`Opening: ${note.title}\n\nThis would display the PDF document in production.`);
  };

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
          📋 {config.modules?.meetingNotes?.name || 'Meeting Notes'}
        </h1>
        <p style={{ 
          margin: '4px 0 0', 
          color: '#6B7280',
          fontSize: '0.875rem'
        }}>
          Access official documents, minutes, and policies
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '16px',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              background: activeCategory === category ? config.primaryColor : 'white',
              color: activeCategory === category ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              boxShadow: activeCategory === category 
                ? 'none' 
                : '0 1px 2px rgba(0,0,0,0.05)',
              border: activeCategory === category 
                ? 'none' 
                : '1px solid #e5e7eb',
              transition: 'all 0.2s ease'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading State */}
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
          <p>Loading documents...</p>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          color: '#6B7280',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📄</div>
          <p>No documents found in this category</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleOpenNote(note)}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                {/* Document Icon */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  background: `${getCategoryColor(note.category)}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  flexShrink: 0
                }}>
                  📄
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      background: `${getCategoryColor(note.category)}15`,
                      color: getCategoryColor(note.category),
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {note.category}
                    </span>
                    <span style={{ color: '#9CA3AF', fontSize: '0.75rem' }}>
                      {formatDate(note.date)} • {note.size}
                    </span>
                  </div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#1F2937',
                    lineHeight: 1.4
                  }}>
                    {note.title}
                  </h3>
                  <p style={{
                    margin: '4px 0 0',
                    fontSize: '0.8rem',
                    color: '#6B7280',
                    lineHeight: 1.5
                  }}>
                    {note.description}
                  </p>
                </div>

                {/* Download Arrow */}
                <div style={{
                  color: '#9CA3AF',
                  fontSize: '1.25rem'
                }}>
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        * {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default MeetingNotes;
