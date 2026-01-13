import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVacantHouses } from '../utils/apiClient';

const VacantHouses = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    total_vacant: 0,
    vacant_by_phase: [],
    apartments: [],
  });
  const [selectedPhase, setSelectedPhase] = useState('all');

  useEffect(() => {
    fetchVacantHouses();
  }, []);

  const fetchVacantHouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getVacantHouses();
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load vacant houses data');
    } finally {
      setLoading(false);
    }
  };

  // Get unique phases for the filter dropdown
  const phases = ['all', ...data.vacant_by_phase.map(p => p.phase_name)];

  // Filter apartments based on selected phase
  const filteredApartments = selectedPhase === 'all'
    ? data.apartments
    : data.apartments.filter(apt => apt.phase_name === selectedPhase);

  // Calculate filtered count
  const filteredCount = filteredApartments.length;

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading vacant houses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
          <button style={styles.retryButton} onClick={fetchVacantHouses}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 style={styles.title}>Vacant Houses</h1>
      </div>

      {/* Stats Section */}
      <div style={styles.statsSection}>
        {/* Total Vacant Card */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏠</div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>{data.total_vacant}</span>
            <span style={styles.statLabel}>Total Vacant</span>
          </div>
        </div>

        {/* Phases Count */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statContent}>
            <span style={styles.statValue}>{data.vacant_by_phase.length}</span>
            <span style={styles.statLabel}>Phases</span>
          </div>
        </div>
      </div>

      {/* Vacant by Phase Cards */}
      {data.vacant_by_phase.length > 0 && (
        <div style={styles.phasesSection}>
          <h2 style={styles.sectionTitle}>Vacant by Phase</h2>
          <div style={styles.phasesGrid}>
            {data.vacant_by_phase.map((phase, index) => (
              <div key={index} style={styles.phaseCard}>
                <span style={styles.phaseName}>{phase.phase_name}</span>
                <span style={styles.phaseCount}>{phase.count} vacant</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div style={styles.filterSection}>
        <label style={styles.filterLabel}>Filter by Phase:</label>
        <select
          style={styles.filterSelect}
          value={selectedPhase}
          onChange={(e) => setSelectedPhase(e.target.value)}
        >
          {phases.map(phase => (
            <option key={phase} value={phase}>
              {phase === 'all' ? 'All Phases' : phase}
            </option>
          ))}
        </select>
        <span style={styles.filterCount}>
          Showing {filteredCount} apartment{filteredCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Apartments List */}
      <div style={styles.listSection}>
        <h2 style={styles.sectionTitle}>Available Apartments</h2>

        {filteredApartments.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No vacant apartments found for the selected phase.</p>
          </div>
        ) : (
          <div style={styles.apartmentsList}>
            {filteredApartments.map((apt, index) => (
              <div key={index} style={styles.apartmentCard}>
                <div style={styles.apartmentHeader}>
                  <span style={styles.apartmentNumber}>Unit {apt.apartment_number}</span>
                  <span style={styles.apartmentBlock}>Block {apt.block_name}</span>
                </div>
                <div style={styles.apartmentDetails}>
                  <span style={styles.apartmentPhase}>Phase {apt.phase_name}</span>
                  <span style={styles.apartmentType}>{apt.bedrooms} Bedroom</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '16px',
    minHeight: '100vh',
    background: '#f8fafc',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  backButton: {
    padding: '8px 16px',
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1e293b',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e5e7eb',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '16px',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  errorText: {
    color: '#dc2626',
    marginBottom: '16px',
  },
  retryButton: {
    padding: '10px 24px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  statsSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statIcon: {
    fontSize: '1.5rem',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#eff6ff',
    borderRadius: '12px',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1e293b',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
  phasesSection: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 12px 0',
  },
  phasesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '8px',
  },
  phaseCard: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    background: '#f0fdf4',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
  },
  phaseName: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#166534',
  },
  phaseCount: {
    fontSize: '0.75rem',
    color: '#22c55e',
  },
  filterSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  filterLabel: {
    fontSize: '0.875rem',
    color: '#64748b',
    whiteSpace: 'nowrap',
  },
  filterSelect: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.875rem',
    background: 'white',
    cursor: 'pointer',
  },
  filterCount: {
    fontSize: '0.75rem',
    color: '#64748b',
    whiteSpace: 'nowrap',
  },
  listSection: {
    marginBottom: '40px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    background: 'white',
    borderRadius: '12px',
    color: '#64748b',
  },
  apartmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  apartmentCard: {
    padding: '16px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  apartmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  apartmentNumber: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1e293b',
  },
  apartmentBlock: {
    fontSize: '0.875rem',
    color: '#64748b',
    background: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  apartmentDetails: {
    display: 'flex',
    gap: '12px',
  },
  apartmentPhase: {
    fontSize: '0.75rem',
    color: '#166534',
    background: '#f0fdf4',
    padding: '4px 8px',
    borderRadius: '6px',
  },
  apartmentType: {
    fontSize: '0.75rem',
    color: '#64748b',
  },
};

// Add keyframe animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default VacantHouses;
