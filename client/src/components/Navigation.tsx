import { BookOpen, Dumbbell, Home, RefreshCw, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDueSrsCardsQuery } from "../api/srs/queries";
import { useI18n } from "../i18n";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "../utils/cn";

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const dueCardsQuery = useDueSrsCardsQuery(99);
  const { t } = useI18n();

  const path = location.pathname;
  let activeTab = "home";
  if (path.startsWith("/learn")) activeTab = "learn";
  else if (path.startsWith("/practice")) activeTab = "practice";
  else if (path.startsWith("/review")) activeTab = "review";
  else if (path.startsWith("/profile")) activeTab = "profile";

  const tabs = [
    { id: "home", label: t("nav.home"), icon: Home },
    { id: "learn", label: t("nav.learn"), icon: BookOpen },
    { id: "practice", label: t("nav.practice"), icon: Dumbbell },
    { id: "review", label: t("nav.review"), icon: RefreshCw, badge: dueCardsQuery.data?.cards.length ?? 0 },
    { id: "profile", label: t("nav.profile"), icon: User },
  ];

  return (
    <nav className="glass-panel fixed inset-x-0 bottom-0 z-[900] flex h-[72px] items-center justify-around border-x-0 border-b-0 border-t px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <Button
            key={tab.id}
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${tab.id}`)}
            className={cn(
              "relative h-auto flex-col gap-1 rounded-lg px-3 py-2 text-xs",
              isActive ? "text-primary hover:text-primary" : "text-muted-foreground",
            )}
          >
            <Icon className={cn("transition-transform", isActive ? "size-[22px] scale-110" : "size-5")} />
            <span>{tab.label}</span>
            {!!tab.badge && tab.badge > 0 && (
              <Badge className="absolute right-3 top-1 flex size-4 items-center justify-center rounded-full p-0 text-[0.65rem] font-bold">
                {tab.badge}
              </Badge>
            )}
          </Button>
        );
      })}
    </nav>
  );
}
