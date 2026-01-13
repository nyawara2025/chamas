import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

export default function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)

  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications') === 'true'
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setNotifications(savedNotifications)
    setDarkMode(savedDarkMode)
  }, [])

  const handleToggle = (setting, value) => {
    localStorage.setItem(setting, !value)
  }

  const SettingItem = ({ icon, title, description, toggle, value, onToggle }) => (
    <div className="setting-item">
      <div className="setting-icon">{icon}</div>
      <div className="setting-content">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {toggle && (
        <label className="toggle-switch">
          <input type="checkbox" checked={value} onChange={onToggle} />
          <span className="toggle-slider"></span>
        </label>
      )}
    </div>
  )

  return (
    <Layout>
      <div className="settings-container">
        <section className="settings-section">
          <h2 className="section-title">Notifications</h2>
          <div className="settings-list">
            <SettingItem icon="🔔" title="Push Notifications" description="Receive important updates" toggle={true} value={notifications} onToggle={() => { setNotifications(!notifications); handleToggle('notifications', notifications) }} />
            <SettingItem icon="📧" title="Email Updates" description="Receive weekly summaries" toggle={true} value={emailUpdates} onToggle={() => setEmailUpdates(!emailUpdates)} />
            <SettingItem icon="💬" title="SMS Alerts" description="Get instant SMS for urgent" toggle={true} value={smsAlerts} onToggle={() => setSmsAlerts(!smsAlerts)} />
          </div>
        </section>

        <section className="settings-section">
          <h2 className="section-title">Appearance</h2>
          <div className="settings-list">
            <SettingItem icon="🌙" title="Dark Mode" description="Switch between light and dark" toggle={true} value={darkMode} onToggle={() => { setDarkMode(!darkMode); handleToggle('darkMode', darkMode); document.body.classList.toggle('dark-mode', !darkMode) }} />
          </div>
        </section>

        <section className="settings-section">
          <h2 className="section-title">Support</h2>
          <div className="settings-list">
            <SettingItem icon="❓" title="Help Center" description="Find answers to questions" />
            <SettingItem icon="📞" title="Contact Support" description="Get help from our team" />
          </div>
        </section>
      </div>

      <style>{`
        .settings-container { padding: 20px 16px 100px; max-width: 600px; margin: 0 auto; }
        .settings-section { margin-bottom: 32px; }
        .section-title { font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 12px; }
        .settings-list { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
        .setting-item { display: flex; align-items: center; padding: 16px; gap: 16px; border-bottom: 1px solid #f1f5f9; }
        .setting-item:last-child { border-bottom: none; }
        .setting-icon { width: 44px; height: 44px; background: #f1f5f9; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
        .setting-content { flex: 1; }
        .setting-content h3 { font-size: 16px; font-weight: 600; color: #1e293b; margin: 0 0 4px 0; }
        .setting-content p { font-size: 13px; color: #64748b; margin: 0; }
        .toggle-switch { position: relative; width: 52px; height: 28px; }
        .toggle-switch input { opacity: 0; width: 0; height: 0; }
        .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; transition: 0.3s; border-radius: 28px; }
        .toggle-slider:before { position: absolute; content: ""; height: 22px; width: 22px; left: 3px; bottom: 3px; background-color: white; transition: 0.3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .toggle-switch input:checked + .toggle-slider { background-color: #22c55e; }
        .toggle-switch input:checked + .toggle-slider:before { transform: translateX(24px); }
        body.dark-mode .settings-list { background: #1e293b; }
        body.dark-mode .setting-item { border-bottom-color: #334155; }
        body.dark-mode .setting-icon { background: #334155; }
        body.dark-mode .setting-content h3 { color: #f1f5f9; }
        body.dark-mode .setting-content p { color: #94a3b8; }
        body.dark-mode .section-title { color: #94a3b8; }
      `}</style>
    </Layout>
  )
}
