// API Configuration for Care Kenya Welfare App
// N8N Webhook Endpoints

export const API_ENDPOINTS = {
  // Authentication
  residentLogin: 'https://n8n.tenear.com/webhook/carekenya/login',
  
  // Broadcasts/Updates
  getBroadcasts: 'https://n8n.tenear.com/webhook/carekenya/broadcasts',
  markBroadcastRead: 'https://n8n.tenear.com/webhook/carekenya/broadcast-read',
  createBroadcast: 'https://n8n.tenear.com/webhook/carekenya/broadcast-create',
  getPhases: 'https://n8n.tenear.com/webhook/carekenya/phases',
  getBlocks: 'https://n8n.tenear.com/webhook/carekenya/blocks',
  
  // Marketplace (Sokoni)
  getActiveShops: 'https://n8n.tenear.com/webhook/carekenya/shops',
  getCustomerConversations: 'https://n8n.tenear.com/webhook/carekenya/customer-conversations',
  getInquiryResponses: 'https://n8n.tenear.com/webhook/carekenya/inquiry-responses',
  
  // MPESA Payments
  initiatePayment: 'https://n8n.tenear.com/webhook/carekenya/stk-push',
  checkPaymentStatus: 'https://n8n.tenear.com/webhook/carekenya/payment-status',
  recordPayment: 'https://n8n.tenear.com/webhook/carekenya/record-payment',
  getPaymentHistory: 'https://n8n.tenear.com/webhook/carekenya/payments',
  
  // Meeting Notes
  getMeetingNotes: 'https://n8n.tenear.com/webhook/carekenya/meeting-notes',
  
  // Chat Support
  sendChatMessage: 'https://n8n.tenear.com/webhook/welfare/chat',
  getChatHistory: 'https://n8n.tenear.com/webhook/welfare/chat-history',
  getAdminChatConversations: 'https://n8n.tenear.com/webhook/welfare/admin-chat-conversations',
  getChatMessages: 'https://n8n.tenear.com/webhook/welfare/chat-history',
  sendChatReply: 'https://n8n.tenear.com/webhook/welfare/chat-reply',
  
  // Welfare Support
  getSupportRequests: 'https://n8n.tenear.com/webhook/carekenya/support-requests',
  createSupportRequest: 'https://n8n.tenear.com/webhook/carekenya/support-request',
  makeDonation: 'https://n8n.tenear.com/webhook/carekenya/donate',
  
  // Profile
  updateProfile: 'https://n8n.tenear.com/webhook/carekenya/profile-update',
  getProfile: 'https://n8n.tenear.com/webhook/carekenya/profile',
};

export default API_ENDPOINTS;
