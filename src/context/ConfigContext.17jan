import React, { createContext, useContext, useState, useEffect } from 'react';

const ConfigContext = createContext(null);

/**
 * ConfigProvider - Loads configuration and makes it available throughout the app
 * 
 * Configuration is loaded from /config.json at startup and includes:
 * - Organization identity (name, logo, etc.)
 * - Theme settings (colors, styling)
 * - Feature flags (enable/disable modules)
 * - Labels and text customization
 * - Module-specific settings
 */
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/config.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load config: ${response.status} ${response.statusText}`);
        }
        
        const configData = await response.json();
        
        // Apply theme colors as CSS custom properties
        if (configData.theme && configData.theme.colors) {
          const root = document.documentElement;
          const colors = configData.theme.colors;
          
          root.style.setProperty('--color-primary', colors.primary);
          root.style.setProperty('--color-secondary', colors.secondary);
          root.style.setProperty('--color-background', colors.background);
          root.style.setProperty('--color-text', colors.text);
          root.style.setProperty('--color-success', colors.success);
          root.style.setProperty('--color-warning', colors.warning);
          root.style.setProperty('--color-error', colors.error);
        }
        
        // Apply border radius
        if (configData.theme && configData.theme.borderRadius) {
          document.documentElement.style.setProperty(
            '--border-radius', 
            configData.theme.borderRadius === 'rounded-full' ? '9999px' : '8px'
          );
        }
        
        setConfig(configData);
        setLoading(false);
      } catch (err) {
        console.error('Config loading error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Helper to get feature state
  const isFeatureEnabled = (featureName) => {
    if (!config || !config.features) return false;
    return config.features[featureName] === true;
  };

  // Helper to get label
  const getLabel = (labelName, defaultValue = '') => {
    if (!config || !config.labels) return defaultValue;
    return config.labels[labelName] || defaultValue;
  };

  // Helper to get API endpoint
  const getApiEndpoint = (endpointName) => {
    if (!config || !config.api) return null;
    const baseUrl = config.api.webhookBaseUrl;
    const endpoints = {
      login: `${baseUrl}/nhc-login`,
      vacantHouses: `${baseUrl}/nhc-vacant-houses`,
      paymentHistory: `${baseUrl}/nhc-payment-history`,
      submitComplaint: `${baseUrl}/nhc-submit-complaint`,
      getComplaints: `${baseUrl}/nhc-complaints`,
      announcements: `${baseUrl}/nhc-announcements`,
      broadcasts: `${baseUrl}/nhc-broadcasts`,
      createBroadcast: `${baseUrl}/nhc-create-broadcast`,
      activeShops: `${baseUrl}/nhc-active-shops`,
      customerConversations: `${baseUrl}/nhc-customer-conversations`,
      inquiryResponses: `${baseUrl}/nhc-get-inquiry-responses`,
      markResponseRead: `${baseUrl}/nhc-mark-response-read`,
      chat: `${baseUrl}/nhc-chat`,
      submitOpinion: `${baseUrl}/nhc-submit-opinion`,
      notices: `${baseUrl}/nhc-notices`,
      stkPush: `${baseUrl}/nhc-stk-push`,
      paymentStatus: `${baseUrl}/nhc-payment-status`,
      recordPayment: `${baseUrl}/nhc-record-payment`
    };
    return endpoints[endpointName] || null;
  };

  // Helper to get API headers
  const getApiHeaders = () => {
    if (!config || !config.api) return {};
    return {
      'Content-Type': 'application/json',
      ...config.api.headers
    };
  };

  const value = {
    config,
    loading,
    error,
    isFeatureEnabled,
    getLabel,
    getApiEndpoint,
    getApiHeaders,
    // Expose full config for advanced use cases
    getFullConfig: () => config
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#F5F5F5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e0e0e0',
            borderTopColor: 'var(--color-primary, #25D366)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p>Loading configuration...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#F5F5F5',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h3 style={{ color: '#F44336', marginBottom: '12px' }}>Configuration Error</h3>
          <p style={{ color: '#666', marginBottom: '16px' }}>{error}</p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Please ensure config.json exists in the public directory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

/**
 * Hook to access configuration throughout the app
 * 
 * @returns {object} Configuration object with helpers
 */
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export default ConfigContext;
