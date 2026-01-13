import { useNavigate } from 'react-router-dom'

export default function Header({ title, showBack = true }) {
  const navigate = useNavigate()
  const handleBack = () => navigate(-1)

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          {showBack && (
            <button className="back-btn" onClick={handleBack}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
          )}
        </div>
        <h1 className="header-title">{title}</h1>
        <div className="header-right" />
      </div>
      <style>{`
        .app-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          padding: 0 16px;
          padding-top: env(safe-area-inset-top);
        }
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 600px;
          margin: 0 auto;
          height: 60px;
        }
        .header-left { display: flex; align-items: center; gap: 8px; min-width: 48px; }
        .header-right { display: flex; align-items: center; justify-content: flex-end; min-width: 48px; }
        .back-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: transparent;
          border: none;
          border-radius: 10px;
          color: #1e293b;
          cursor: pointer;
        }
        .back-btn:hover { background: #f1f5f9; color: #22c55e; }
        .header-title { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0; text-align: center; flex: 1; }
        body.dark-mode .app-header { background: #1e293b; border-bottom-color: #334155; }
        body.dark-mode .back-btn { color: #f1f5f9; }
        body.dark-mode .back-btn:hover { background: #334155; color: #22c55e; }
        body.dark-mode .header-title { color: #f1f5f9; }
      `}</style>
    </header>
  )
}
