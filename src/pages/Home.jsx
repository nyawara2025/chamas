import { useState } from 'react'
import Layout from '../components/Layout'
import QuickActionButton from '../components/QuickActionButton'
import Header from '../components/Header'

export default function Home() {
  const [notifications] = useState([
    { id: 1, title: 'Vacant Houses', time: '2 hours ago', icon: '📅', read: false },
    { id: 2, title: 'Up-Coming Events', time: '1 day ago', icon: '👨‍🏫', read: false },
    { id: 3, title: 'Committee Briefs', time: '2 days ago', icon: '💰', read: true },
  ])

  return (
    <Layout showBack={false}>
      <Header title="NHC Court Langata" showBack={false} />
      <div className="home-container">
        <section className="welcome-section">
          <div className="welcome-card">
            <div className="welcome-icon">🏫</div>
            <div className="welcome-content">
              <h1>Welcome Back!</h1>
              <p>Feels like home!</p>
            </div>
          </div>
        </section>

        <section className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <QuickActionButton icon="💬" label="NHC AI Chat" color="#22c55e" />
            <QuickActionButton icon="📊" label="Notices" color="#3B82F6" />
            <QuickActionButton icon="📅" label="Up-coming events" color="#F59E0B" />
            <QuickActionButton icon="💰" label="Pay your monthly dues" color="#EF4444" />
          </div>
        </section>

        <section className="notifications-section">
          <div className="section-header">
            <h2 className="section-title">Recent Notifications</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div key={notification.id} className={`notification-item ${notification.read ? 'read' : ''}`}>
                <span className="notification-icon">{notification.icon}</span>
                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.time}</p>
                </div>
                {!notification.read && <span className="unread-dot" />}
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .home-container { padding: 20px 16px 100px; max-width: 600px; margin: 0 auto; }
        .welcome-section { margin-bottom: 32px; }
        .welcome-card {
          background: linear-gradient(135deg, #1E7D36 0%, #22c55e 100%);
          border-radius: 20px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
          color: white;
          box-shadow: 0 8px 32px rgba(30, 125, 54, 0.3);
        }
        .welcome-icon { font-size: 48px; }
        .welcome-content h1 { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
        .welcome-content p { font-size: 14px; opacity: 0.9; }
        .section-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 16px; }
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .notifications-section { margin-top: 32px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .view-all-btn { background: none; border: none; color: #22c55e; font-weight: 600; cursor: pointer; }
        .notifications-list { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .notification-item {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 12px;
          border-bottom: 1px solid #f1f5f9;
          transition: background-color 0.2s ease;
        }
        .notification-item:last-child { border-bottom: none; }
        .notification-item:hover { background-color: #f8fafc; }
        .notification-item.read { opacity: 0.7; }
        .notification-icon { font-size: 24px; }
        .notification-content { flex: 1; }
        .notification-content h3 { font-size: 15px; font-weight: 600; color: #1e293b; margin-bottom: 4px; }
        .notification-content p { font-size: 13px; color: #64748b; }
        .unread-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }
        body.dark-mode .welcome-card { box-shadow: 0 8px 32px rgba(34, 197, 94, 0.2); }
        body.dark-mode .notification-item { border-bottom-color: #334155; }
        body.dark-mode .notification-item:hover { background-color: #334155; }
        body.dark-mode .notification-content h3 { color: #f1f5f9; }
        @media (max-width: 360px) {
          .actions-grid { grid-template-columns: repeat(2, 1fr); }
          .welcome-card { flex-direction: column; text-align: center; }
        }
      `}</style>
    </Layout>
  )
}
