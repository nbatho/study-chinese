import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../i18n";
import { Button } from "./ui/button";

interface LoginPromptCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}

export default function LoginPromptCard({
  icon: Icon,
  title,
  description,
  children,
}: LoginPromptCardProps) {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="anim-slide flex min-h-[calc(100vh-140px)] items-center justify-center px-0 py-6">
      <section className="w-full max-w-xl overflow-hidden rounded-lg border bg-card text-center shadow-[0_18px_60px_rgba(26,26,30,0.08)]">
        <div className="bg-[linear-gradient(135deg,var(--primary-red),var(--accent-red))] px-6 py-8 text-primary-foreground">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-lg border border-white/20 bg-white/15 shadow-sm">
            <Icon size={38} />
          </div>
          <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-md text-sm font-medium text-primary-foreground/85 sm:text-base">
            {description}
          </p>
        </div>

        <div className="space-y-5 px-6 py-6">
          {children}
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-lg font-bold"
              onClick={() => navigate("/")}
            >
              <ArrowLeft size={17} />
              {t("loginPrompt.backHome")}
            </Button>
            <Button
              type="button"
              className="h-11 rounded-lg font-bold"
              onClick={() => navigate("/auth")}
            >
              <LogIn size={17} />
              {t("loginPrompt.login")}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
