import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerConversations, getInquiryResponses, getStoredUser } from '../utils/apiClient';

const MyInquiries = () => {
const navigate = useNavigate();
const [conversations, setConversations] = useState([]);
const [selectedConversation, setSelectedConversation] = useState(null);
const [responses, setResponses] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [isLoadingResponses, setIsLoadingResponses] = useState(false);
const [error, setError] = useState('');
const [user, setUser] = useState(null);

useEffect(() => {
// Get stored user data
const storedUser = getStoredUser();
if (storedUser) {
setUser(storedUser);
}

loadConversations();
}, []);

const loadConversations = async () => {
try {
setIsLoading(true);
setError('');
const data = await getCustomerConversations();
setConversations(data);
} catch (err) {
console.error('Error loading conversations:', err);
setError(err.message || 'Failed to load conversations');
setConversations([]);
} finally {
setIsLoading(false);
}
};

const handleViewConversation = async (conversation) => {
setSelectedConversation(conversation);
setIsLoadingResponses(true);

try {
const data = await getInquiryResponses(conversation.inquiry_id);
setResponses(data);
} catch (err) {
console.error('Error loading responses:', err);
setResponses([]);
} finally {
setIsLoadingResponses(false);
}
};

const handleCloseDetail = () => {
setSelectedConversation(null);
setResponses([]);
};

const formatDate = (dateString) => {
if (!dateString) return '';
const date = new Date(dateString);
return date.toLocaleDateString('en-KE', {
day: 'numeric',
month: 'short',
year: 'numeric',
hour: '2-digit',
minute: '2-digit'
});
};

const getStatusColor = (status) => {
switch (status) {
case 'new':
return '#3B82F6';
case 'contacted':
return '#F59E0B';
case 'replied':
return '#10B981';
default:
return '#6B7280';
}
};

if (selectedConversation) {
// Detail view
return (
<div style={{ padding: '16px' }}>
{/* Header */}
<div style={{
display: 'flex',
alignItems: 'center',
gap: '12px',
marginBottom: '16px'
}}>
<button
onClick={handleCloseDetail}
style={{
background: 'none',
border: 'none',
fontSize: '1.5rem',
cursor: 'pointer',
padding: '4px',
color: '#1e293b'
}}
>
←
</button>
<h1 style={{ margin: 0, fontSize: '1.25rem', color: '#1e293b' }}>
Conversation Details
</h1>
</div>

{/* Inquiry Card */}
<div style={{
background: 'white',
borderRadius: '12px',
padding: '16px',
marginBottom: '16px',
border: '1px solid #e5e7eb'
}}>
<div style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: '12px'
}}>
<span style={{
fontSize: '0.875rem',
fontWeight: 600,
color: '#0891B2'
}}>
🏪 {selectedConversation.shop_name || 'Shop'}
</span>
<span style={{
fontSize: '0.75rem',
color: '#64748b'
}}>
{formatDate(selectedConversation.created_at)}
</span>
</div>

<div style={{
padding: '12px',
background: '#f0f9ff',
borderRadius: '8px',
borderLeft: '4px solid #0891B2'
}}>
<p style={{
margin: 0,
fontSize: '0.875rem',
color: '#1e293b',
fontWeight: 500
}}>
{selectedConversation.product_name || 'Product Inquiry'}
</p>
<p style={{
margin: '8px 0 0',
fontSize: '0.875rem',
color: '#475569'
}}>
{selectedConversation.customer_message}
</p>
</div>
</div>

{/* Responses */}
<h2 style={{
margin: '0 0 12px',
fontSize: '1rem',
color: '#1e293b'
}}>
💬 Shop Responses ({responses.length})
</h2>

{isLoadingResponses ? (
<div style={{
display: 'flex',
justifyContent: 'center',
padding: '40px',
color: '#64748b'
}}>
<div style={{
width: '32px',
height: '32px',
border: '3px solid #e5e7eb',
borderTopColor: '#0891B2',
borderRadius: '50%',
animation: 'spin 1s linear infinite'
}} />
</div>
) : responses.length > 0 ? (
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
{responses.map((response) => (
<div
key={response.id}
style={{
background: 'white',
borderRadius: '12px',
padding: '16px',
border: '1px solid #e5e7eb',
borderLeft: '4px solid #10B981'
}}
>
<div style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: '8px'
}}>
<span style={{
fontSize: '0.875rem',
fontWeight: 600,
color: '#10B981'
}}>
👤 {response.responder_name}
</span>
<span style={{
fontSize: '0.75rem',
color: '#64748b'
}}>
{formatDate(response.sent_at)}
</span>
</div>
<p style={{
margin: 0,
fontSize: '0.875rem',
color: '#475569',
lineHeight: 1.5
}}>
{response.message_body}
</p>
</div>
))}
</div>
) : (
<div style={{
background: '#f8fafc',
borderRadius: '12px',
padding: '32px',
textAlign: 'center',
color: '#64748b'
}}>
<p style={{ margin: 0 }}>No responses yet from this shop.</p>
<p style={{ margin: '8px 0 0', fontSize: '0.875rem' }}>
The shop owner will reply soon!
</p>
</div>
)}

{/* CSS Animation */}
<style>{`
@keyframes spin {
to { transform: rotate(360deg); }
}
`}</style>
</div>
);
}

// List view
return (
<div style={{ padding: '16px' }}>
{/* Header */}
<div style={{ marginBottom: '24px' }}>
<h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', color: '#1e293b' }}>
💬 My Inquiries
</h1>
<p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
View responses from shops you've contacted
</p>
</div>

{/* Error Message */}
{error && (
<div style={{
background: '#FEF2F2',
border: '1px solid #FECACA',
borderRadius: '12px',
padding: '16px',
marginBottom: '16px',
color: '#DC2626'
}}>
<p style={{ margin: 0 }}>{error}</p>
{error.includes('Session ID') && (
<button
onClick={() => navigate('/')}
style={{
marginTop: '12px',
padding: '8px 16px',
background: '#DC2626',
color: 'white',
border: 'none',
borderRadius: '8px',
cursor: 'pointer',
fontSize: '0.875rem'
}}
>
Go to Home
</button>
)}
</div>
)}

{/* Loading State */}
{isLoading ? (
<div style={{
display: 'flex',
flexDirection: 'column',
alignItems: 'center',
justifyContent: 'center',
padding: '60px 20px',
color: '#64748b'
}}>
<div style={{
width: '40px',
height: '40px',
border: '3px solid #e5e7eb',
borderTopColor: '#0891B2',
borderRadius: '50%',
animation: 'spin 1s linear infinite',
marginBottom: '16px'
}} />
<p style={{ margin: 0 }}>Loading your conversations...</p>
</div>
) : conversations.length > 0 ? (
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
{conversations.map((conversation) => (
<div
key={conversation.inquiry_id}
onClick={() => handleViewConversation(conversation)}
style={{
background: 'white',
borderRadius: '12px',
padding: '16px',
border: '1px solid #e5e7eb',
cursor: 'pointer',
transition: 'all 0.2s ease'
}}
>
<div style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'flex-start',
marginBottom: '8px'
}}>
<div style={{ flex: 1 }}>
<span style={{
fontSize: '0.875rem',
fontWeight: 600,
color: '#0891B2'
}}>
🏪 {conversation.shop_name || 'Shop'}
</span>
<h3 style={{
margin: '4px 0 0',
fontSize: '0.9375rem',
color: '#1e293b',
fontWeight: 600
}}>
{conversation.product_name || 'Product Inquiry'}
</h3>
</div>
<span style={{
fontSize: '0.75rem',
color: '#64748b',
background: '#f1f5f9',
padding: '4px 8px',
borderRadius: '6px'
}}>
{formatDate(conversation.created_at)}
</span>
</div>

<p style={{
margin: '0 0 12px',
fontSize: '0.875rem',
color: '#64748b',
lineHeight: 1.4,
display: '-webkit-box',
WebkitLineClamp: 2,
WebkitBoxOrient: 'vertical',
overflow: 'hidden'
}}>
{conversation.customer_message}
</p>

<div style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center'
}}>
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
<span style={{
fontSize: '0.75rem',
color: getStatusColor(conversation.inquiry_status),
background: `${getStatusColor(conversation.inquiry_status)}15`,
padding: '4px 10px',
borderRadius: '20px',
fontWeight: 500,
textTransform: 'capitalize'
}}>
{conversation.inquiry_status || 'new'}
</span>
{conversation.response_count > 0 && (
<span style={{
fontSize: '0.75rem',
color: '#10B981',
background: '#10B98115',
padding: '4px 10px',
borderRadius: '20px',
fontWeight: 500
}}>
{conversation.response_count} response{conversation.response_count > 1 ? 's' : ''}
</span>
)}
</div>
<span style={{
fontSize: '0.875rem',
color: '#0891B2',
fontWeight: 500
}}>
View →
</span>
</div>
</div>
))}
</div>
) : (
<div style={{
background: '#f8fafc',
borderRadius: '16px',
padding: '48px 24px',
textAlign: 'center'
}}>
<div style={{ fontSize: '3rem', marginBottom: '16px' }}>💬</div>
<h3 style={{
margin: '0 0 8px',
fontSize: '1.125rem',
color: '#1e293b'
}}>
No Inquiries Yet
</h3>
<p style={{
margin: '0 0 20px',
color: '#64748b',
fontSize: '0.875rem'
}}>
Visit Sokoni and contact shops to start conversations
</p>
<button
onClick={() => navigate('/')}
style={{
padding: '12px 24px',
background: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
color: 'white',
border: 'none',
borderRadius: '10px',
fontSize: '0.9375rem',
fontWeight: 600,
cursor: 'pointer'
}}
>
Go to Sokoni
</button>
</div>
)}

{/* CSS Animation */}
<style>{`
@keyframes spin {
to { transform: rotate(360deg); }
}
`}</style>
</div>
);
};

export default MyInquiries;
