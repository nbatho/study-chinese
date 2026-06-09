import { Home, BookOpen, Dumbbell, RefreshCw, User, Sun, Moon } from "lucide-react";
import { useStore } from "../store/store";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: "home" | "learn" | "practice" | "review" | "profile") => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const store = useStore();
  const theme = store.profile.appAppearance;

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    store.updateProfile({ appAppearance: nextTheme });
    if (nextTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "practice", label: "Practice", icon: Dumbbell },
    { id: "review", label: "Review", icon: RefreshCw, badge: store.getDueSRSCardsCount() },
    { id: "profile", label: "Profile", icon: User }
  ];

  return (
    <nav className="glass-panel" style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      height: "72px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      borderTop: "1px solid var(--border-color)",
      padding: "0 12px",
      zIndex: 900,
      boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.03)"
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "none",
              color: isActive ? "var(--primary-red)" : "var(--text-muted)",
              cursor: "pointer",
              padding: "8px 12px",
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: isActive ? 700 : 500,
              gap: "4px",
              position: "relative",
              transition: "var(--transition-smooth)"
            }}
          >
            <Icon size={isActive ? 22 : 20} style={{
              transform: isActive ? "scale(1.1)" : "none",
              transition: "var(--transition-smooth)"
            }} />
            <span>{tab.label}</span>
            {!!tab.badge && tab.badge > 0 && (
              <span style={{
                position: "absolute",
                top: "4px",
                right: "12px",
                backgroundColor: "var(--primary-red)",
                color: "white",
                fontSize: "0.65rem",
                borderRadius: "50%",
                height: "16px",
                width: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700
              }}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}

      <button
        onClick={toggleTheme}
        style={{
          border: "none",
          background: "none",
          color: "var(--text-muted)",
          cursor: "pointer",
          padding: "8px 12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "4px",
          fontSize: "0.75rem",
          fontWeight: 500
        }}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        <span>Mode</span>
      </button>
    </nav>
  );
}
