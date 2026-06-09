import React from 'react';
import './AppLayout.css';

interface AppLayoutProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  navigationContent?: React.ReactNode;
}

/**
 * AppLayout - Standard layout with TopBar, Sidebar (desktop)/TabBar (mobile), and main Content area.
 */
export default function AppLayout({ children, headerContent, navigationContent }: AppLayoutProps) {
  return (
    <div className="app-layout-wrapper">
      {/* TopBar / Header Area */}
      {headerContent && (
        <header className="app-layout-topbar">
          <div className="topbar-inner-container">
            {headerContent}
          </div>
        </header>
      )}

      {/* Main layout container (Sidebar + Content) */}
      <div className="app-layout-container">
        {/* Navigation Sidebar (Desktop) / Navigation is passed as content */}
        {navigationContent && (
          <aside className="app-layout-sidebar">
            {navigationContent}
          </aside>
        )}

        {/* Main Content Pane */}
        <main className="app-layout-content">
          <div className="content-inner-container">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile TabBar / Bottom Navigation is rendered inside the navigationContent if designed responsively */}
      {navigationContent && (
        <div className="app-layout-mobile-nav">
          {navigationContent}
        </div>
      )}
    </div>
  );
}
