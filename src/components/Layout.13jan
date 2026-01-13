import BottomNav from './BottomNav'

export default function Layout({ children, title, showBack = true }) {
  return (
    <>
      <main className="main-content">
        {children}
      </main>
      <BottomNav />
      <style>{`
        .main-content {
          flex: 1;
          padding-bottom: 80px;
          padding-top: env(safe-area-inset-top);
        }
      `}</style>
    </>
  )
}
