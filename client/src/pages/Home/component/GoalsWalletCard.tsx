import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Flame, Gem, RefreshCw, ShieldCheck } from "lucide-react";
import { usePurchaseShopItemMutation, useUserProfileQuery } from "../../../api";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../../i18n";
import { useAppSelector } from "../../../store/hooks";

export default function GoalsWalletCard() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const profileQuery = useUserProfileQuery(isAuthenticated);
  const purchaseMutation = usePurchaseShopItemMutation();
  const streak = profileQuery.data?.streak;
  const wallet = profileQuery.data?.wallet;

  const handleBuyFreeze = async () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    try {
      await purchaseMutation.mutateAsync("streak_freeze_1");
      toast.success(t("home.freezePurchaseSuccess"));
    } catch {
      toast.error(t("home.freezePurchaseError"));
    }
  };

  return (
    <section className="app-surface-padded min-w-0">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">{t("home.goalsWallet")}</h2>
          <p className="text-sm font-medium text-muted-foreground">{t("home.todayGoal")}</p>
        </div>
        <span className="flex size-14 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <Flame size={30} fill="currentColor" />
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-secondary/70 p-3">
          <Flame className="mx-auto mb-1 text-tone-4" size={20} />
          <strong className="block text-xl">{streak?.current ?? 0}</strong>
          <span className="text-xs font-bold text-muted-foreground">{t("home.streak")}</span>
        </div>
        <div className="rounded-xl bg-secondary/70 p-3">
          <Gem className="mx-auto mb-1 text-tone-1" size={20} />
          <strong className="block text-xl">{wallet?.gemBalance ?? 0}</strong>
          <span className="text-xs font-bold text-muted-foreground">{t("common.gems")}</span>
        </div>
        <div className="rounded-xl bg-secondary/70 p-3">
          <ShieldCheck className="mx-auto mb-1 text-tone-3" size={20} />
          <strong className="block text-xl">{wallet?.streakFreezes ?? 0}</strong>
          <span className="text-xs font-bold text-muted-foreground">{t("common.freeze")}</span>
        </div>
      </div>
      <Button
        type="button"
        onClick={handleBuyFreeze}
        disabled={purchaseMutation.isPending}
        className="mt-4 w-full rounded-xl"
      >
        {purchaseMutation.isPending ? <RefreshCw className="animate-spin" /> : <ShieldCheck size={17} />}
        {t("home.buyFreeze")}
      </Button>
    </section>
  );
}
