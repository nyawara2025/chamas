import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * ServiceDetail Component
 * Displays detailed content for a specific Sunday Service including:
 * - Service order PDF
 * - YouTube video embed
 * - Sermon notes/content
 */
const ServiceDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get service data from location state
  const serviceData = location.state?.serviceData || {};
  const config = location.state?.config || {};
  
  const {
    title = 'Sunday Service',
    content = '',
    speaker = '',
    serviceTime = '',
    pdfUrl = '',
    youtubeUrl = '',
    category = 'Sunday Service',
    createdAt = new Date().toISOString()
  } = serviceData;
  
  // Get service time label from config
  const getServiceTimeLabel = () => {
    if (!config.sundayServiceTimes) return serviceTime;
    const timeConfig = config.sundayServiceTimes.find(t => t.id === serviceTime);
    return timeConfig ? timeConfig.label : serviceTime;
  };
  
  // Extract YouTube video ID from URL
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    
    // If it's already an embed URL, return as is
    if (url.includes('youtube.com/embed')) {
      return url;
    }
    
    return null;
  };
  
  const embedUrl = getYoutubeEmbedUrl(youtubeUrl);
  const primaryColor = config.primaryColor || '#553C9A';
  const secondaryColor = config.secondaryColor || '#6B46C1';
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-KE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  return (
    <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'none',
          border: 'none',
          color: primaryColor,
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '16px',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        ← Back to Services
      </button>
      
      {/* Service Header */}
      <div style={{
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        borderRadius: '16px',
        padding: '24px',
        color: 'white',
        marginBottom: '24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '2rem' }}>⛪</span>
          <span style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.875rem'
          }}>
            {category}
          </span>
        </div>
        
        <h1 style={{
          margin: '0 0 8px',
          fontSize: '1.5rem',
          fontWeight: 600
        }}>
          {title}
        </h1>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.875rem',
          opacity: 0.9
        }}>
          {serviceTime && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              🕐 {getServiceTimeLabel()}
            </span>
          )}
          {speaker && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              🎤 {speaker}
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            📅 {formatDate(createdAt)}
          </span>
        </div>
      </div>
      
      {/* PDF Service Order Button */}
      {pdfUrl && (
        <div style={{ marginBottom: '24px' }}>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '16px 24px',
              background: '#fef3c7',
              border: '2px solid #f59e0b',
              borderRadius: '12px',
              color: '#92400e',
              textDecoration: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>📄</span>
            <span>View Service Order of Worship (PDF)</span>
          </a>
        </div>
      )}
      
      {/* YouTube Video Embed */}
      {embedUrl && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            margin: '0 0 12px',
            fontSize: '1.125rem',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🎥</span>
            <span>Watch Service Recording</span>
          </h3>
          
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            overflow: 'hidden',
            borderRadius: '12px',
            background: '#000'
          }}>
            <iframe
              src={embedUrl}
              title="Service Recording"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
      
      {/* Sermon Notes / Content */}
      {content && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            margin: '0 0 16px',
            fontSize: '1.125rem',
            color: '#1e293b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>📝</span>
            <span>Sermon Notes</span>
          </h3>
          
          <div style={{
            fontSize: '1rem',
            lineHeight: 1.8,
            color: '#475569',
            whiteSpace: 'pre-wrap'
          }}>
            {content}
          </div>
        </div>
      )}
      
      {/* No Content Message */}
      {!pdfUrl && !embedUrl && !content && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 20px',
          color: '#64748b',
          textAlign: 'center',
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
          <p style={{ margin: 0 }}>
            No service content available yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
