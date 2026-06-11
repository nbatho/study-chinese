import { Home, BookOpen, Dumbbell, RefreshCw, User, Sun, Moon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDueSrsCardsQuery } from "../api/srs/queries";
import { useUpdateProfileMutation } from "../api/users/queries";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAppearance } from "../store/modules/appSlice";

export default function Navigation() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useAppSelector((state) => state.app.appAppearance);
  const dueCardsQuery = useDueSrsCardsQuery(99);
  const updateProfileMutation = useUpdateProfileMutation();

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    dispatch(setAppearance(nextTheme));
    updateProfileMutation.mutate({ appAppearance: nextTheme });
    if (nextTheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  const path = location.pathname;
  let activeTab = "home";
  if (path.startsWith("/learn")) activeTab = "learn";
  else if (path.startsWith("/practice")) activeTab = "practice";
  else if (path.startsWith("/review")) activeTab = "review";
  else if (path.startsWith("/profile")) activeTab = "profile";

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "practice", label: "Practice", icon: Dumbbell },
    { id: "review", label: "Review", icon: RefreshCw, badge: dueCardsQuery.data?.cards.length ?? 0 },
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
            onClick={() => navigate(`/${tab.id}`)}
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
