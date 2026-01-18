import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredUser, apiRequest } from '../utils/apiClient';
import { API_ENDPOINTS } from '../config/apiConfig';

const Chat = () => {
  const navigate = useNavigate();
  const [user] = useState(() => getStoredUser());
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const messagesEndRef = useRef(null);
  const initialized = useRef(false);

  // Get config for WhatsApp number
  const getConfig = () => {
    try {
      if (window.config?.modules?.support) {
        return {
          whatsappNumber: window.config.modules.support.whatsappNumber || '+254700000000',
          orgName: window.config.identity?.name || 'Care Kenya Welfare',
        };
      }
    } catch (e) {
      console.warn('Could not load config:', e);
    }
    return {
      whatsappNumber: '+254700000000',
      orgName: 'Care Kenya Welfare',
    };
  };

  const config = getConfig();

  useEffect(() => {
    // Initialize with welcome message
    if (!initialized.current) {
      initialized.current = true;
      setMessages([
        {
          id: 1,
          text: `Welcome to ${config.orgName} Support! 🤝\n\nHow can we help you today? You can:\n\n• Ask questions about contributions or welfare support\n• Use the WhatsApp button below to chat directly with our team\n• Leave a message and we'll respond shortly`,
          sender: 'admin',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [user, config.orgName]);

  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      // Send to N8N for automated response
      const response = await apiRequest(API_ENDPOINTS.sendChatMessage, {
        method: 'POST',
        body: JSON.stringify({
          user_id: user?.id,
          user_name: user?.full_name || user?.first_name,
          phone: user?.phone,
          message: userMessage.text,
          timestamp: userMessage.timestamp
        })
      });

      // Get reply text
      let replyText = 'Thank you for your message. Our team will respond shortly.';
      
      if (response && response.reply) {
        replyText = response.reply;
      } else if (typeof response === 'string') {
        replyText = response;
      } else if (response && response.data) {
        replyText = response.data.reply || replyText;
      }

      const adminResponse = {
        id: Date.now() + 1,
        text: replyText,
        sender: 'admin',
        timestamp: new Date().toISOString()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, adminResponse]);
      }, 500);
      
    } catch (error) {
      console.error('Chat error:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: 'Thanks for your message! For urgent matters, please use the WhatsApp button below. We\'ll respond shortly.',
        sender: 'admin',
        timestamp: new Date().toISOString()
      };
      setTimeout(() => {
        setMessages(prev => [...prev, errorResponse]);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
  };

  const openWhatsApp = () => {
    const cleanNumber = config.whatsappNumber.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello ${config.orgName}, I need assistance with my welfare account.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div style={styles.headerInfo}>
          <h1 style={styles.title}>Support Chat</h1>
          <span style={styles.status}>● Online</span>
        </div>
        <button 
          style={styles.whatsappHeaderBtn}
          onClick={() => setShowWhatsApp(!showWhatsApp)}
        >
          💬
        </button>
      </div>

      {/* WhatsApp Quick Action */}
      {showWhatsApp && (
        <div style={styles.whatsappBanner}>
          <div style={styles.whatsappContent}>
            <span style={styles.whatsappIcon}>📱</span>
            <div>
              <p style={styles.whatsappTitle}>Chat on WhatsApp</p>
              <p style={styles.whatsappSubtitle}>Get instant response from our team</p>
            </div>
          </div>
          <button style={styles.whatsappButton} onClick={openWhatsApp}>
            Open WhatsApp
          </button>
        </div>
      )}

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => {
          // Show date separator
          const showDate = index === 0 || formatDate(msg.timestamp) !== formatDate(messages[index - 1].timestamp);
          
          return (
            <React.Fragment key={msg.id}>
              {showDate && (
                <div style={styles.dateSeparator}>
                  <span style={styles.dateLabel}>{formatDate(msg.timestamp)}</span>
                </div>
              )}
              <div
                style={{
                  ...styles.messageWrapper,
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  ...styles.messageBubble,
                  background: msg.sender === 'user' ? '#E31C23' : '#f3f4f6',
                  color: msg.sender === 'user' ? 'white' : '#1f2937',
                  borderRadius: msg.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                }}>
                  <p style={styles.messageText}>{msg.text}</p>
                  <span style={{
                    ...styles.timestamp,
                    color: msg.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#9ca3af'
                  }}>
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        
        {loading && (
          <div style={{ ...styles.messageWrapper, justifyContent: 'flex-start' }}>
            <div style={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        {['How do I pay?', 'My balance?', 'Welfare support', 'Meeting notes'].map((q) => (
          <button
            key={q}
            style={styles.quickButton}
            onClick={() => setInputText(q)}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div style={styles.inputContainer}>
        <button style={styles.whatsappBtn} onClick={openWhatsApp} title="Chat on WhatsApp">
          💬
        </button>
        <input
          style={styles.input}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          style={{
            ...styles.sendButton,
            opacity: inputText.trim() && !loading ? 1 : 0.5,
            cursor: inputText.trim() && !loading ? 'pointer' : 'not-allowed'
          }}
          onClick={handleSend}
          disabled={!inputText.trim() || loading}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#f3f4f6',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'white',
    borderBottom: '1px solid #e5e7eb',
    gap: '12px',
  },
  backButton: {
    padding: '8px 12px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1f2937',
  },
  status: {
    fontSize: '0.75rem',
    color: '#22c55e',
  },
  whatsappHeaderBtn: {
    padding: '8px 12px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  whatsappBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    background: '#25D366',
    color: 'white',
  },
  whatsappContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  whatsappIcon: {
    fontSize: '1.5rem',
  },
  whatsappTitle: {
    margin: 0,
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  whatsappSubtitle: {
    margin: '2px 0 0',
    fontSize: '0.75rem',
    opacity: 0.9,
  },
  whatsappButton: {
    padding: '8px 16px',
    background: 'white',
    color: '#25D366',
    border: 'none',
    borderRadius: '20px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  dateSeparator: {
    display: 'flex',
    justifyContent: 'center',
    margin: '8px 0',
  },
  dateLabel: {
    background: '#e5e7eb',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    color: '#6b7280',
  },
  messageWrapper: {
    display: 'flex',
    width: '100%',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: '12px 16px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  messageText: {
    margin: '0 0 4px 0',
    fontSize: '0.9375rem',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap',
  },
  timestamp: {
    fontSize: '0.6875rem',
  },
  typingIndicator: {
    display: 'flex',
    gap: '4px',
    padding: '12px 16px',
    background: '#f3f4f6',
    borderRadius: '16px',
  },
  quickActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    padding: '12px 16px',
    background: 'white',
    borderTop: '1px solid #e5e7eb',
  },
  quickButton: {
    padding: '8px 12px',
    background: '#f3f4f6',
    border: 'none',
    borderRadius: '16px',
    fontSize: '0.75rem',
    color: '#374151',
    cursor: 'pointer',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'white',
    borderTop: '1px solid #e5e7eb',
    gap: '12px',
  },
  whatsappBtn: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#25D366',
    border: 'none',
    color: 'white',
    fontSize: '1.25rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '24px',
    fontSize: '0.9375rem',
    outline: 'none',
  },
  sendButton: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: '#E31C23',
    border: 'none',
    color: 'white',
    fontSize: '1.125rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default Chat;
