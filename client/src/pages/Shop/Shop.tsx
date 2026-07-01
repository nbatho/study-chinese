import { Crown, Gem, RefreshCw, ShieldCheck, ShoppingBag, Sparkles, UserRound } from "lucide-react";
import { toast } from "sonner";
import LoginPromptCard from "../../components/LoginPromptCard";
import LoadingCard from "../../components/LoadingCard";
import { Button } from "../../components/ui/button";
import { usePurchaseShopItemMutation, useShopQuery } from "../../api/users/queries";
import type { ShopItem, ShopItemCategory } from "../../api/users";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";
import { useAppSelector } from "../../store/hooks";
import { cn } from "../../utils/cn";

const categoryConfig: Record<ShopItemCategory, { labelKey: TranslationKey; icon: typeof ShoppingBag; tone: string }> = {
  premium: { labelKey: "shop.category.premium", icon: Crown, tone: "text-gold" },
  streak: { labelKey: "shop.category.streak", icon: ShieldCheck, tone: "text-tone-1" },
  avatar: { labelKey: "shop.category.avatar", icon: UserRound, tone: "text-tone-2" },
  ai_tutor: { labelKey: "shop.category.aiTutor", icon: Sparkles, tone: "text-tone-3" },
};

const itemTextKeys: Record<string, { name: TranslationKey; description: TranslationKey }> = {
  streak_freeze_1: {
    name: "shop.item.streak_freeze_1.name",
    description: "shop.item.streak_freeze_1.description",
  },
  premium_30_days: {
    name: "shop.item.premium_30_days.name",
    description: "shop.item.premium_30_days.description",
  },
  avatar_panda: {
    name: "shop.item.avatar_panda.name",
    description: "shop.item.avatar_panda.description",
  },
  avatar_dragon: {
    name: "shop.item.avatar_dragon.name",
    description: "shop.item.avatar_dragon.description",
  },
  ai_skin_scholar: {
    name: "shop.item.ai_skin_scholar.name",
    description: "shop.item.ai_skin_scholar.description",
  },
  ai_skin_chef: {
    name: "shop.item.ai_skin_chef.name",
    description: "shop.item.ai_skin_chef.description",
  },
};

function formatPremiumDate(value: string | null | undefined, t: (key: TranslationKey) => string) {
  if (!value) return t("shop.notActive");
  return new Date(value).toLocaleDateString();
}

function getItemText(item: ShopItem, t: (key: TranslationKey) => string) {
  const keys = itemTextKeys[item.id];

  return {
    name: keys ? t(keys.name) : item.name,
    description: keys ? t(keys.description) : item.description,
  };
}

function getActionLabel(item: ShopItem, t: (key: TranslationKey) => string) {
  if ((item.grantType === "avatar" || item.grantType === "ai_tutor_skin") && item.isOwned) {
    return item.isEquipped ? t("shop.action.equipped") : t("shop.action.equip");
  }

  if (item.grantType === "premium_days") {
    return t("shop.action.buyPremium");
  }

  return t("shop.action.buyNow");
}

export default function Shop() {
  const { t } = useI18n();
  const isAuthenticated = useAppSelector((state) => state.auth.status === "authenticated");
  const shopQuery = useShopQuery(isAuthenticated);
  const purchaseMutation = usePurchaseShopItemMutation();
  const shop = shopQuery.data;
  const gemBalance = shop?.wallet.gemBalance ?? 0;

  const buyItem = async (item: ShopItem) => {
    try {
      const data = await purchaseMutation.mutateAsync(item.id);
      const itemText = getItemText(data.item, t);
      toast.success(
        t(data.purchased ? "shop.purchaseSuccess" : "shop.equipSuccess", {
          name: itemText.name,
        }),
      );
    } catch {
      toast.error(t("shop.purchaseError"));
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginPromptCard
        icon={ShoppingBag}
        title={t("shop.loginTitle")}
        description={t("shop.loginBody")}
      />
    );
  }

  if (shopQuery.isLoading || !shop) {
    return <LoadingCard label={t("shop.loading")} />;
  }

  const groupedItems = shop.items.reduce<Record<ShopItemCategory, ShopItem[]>>(
    (groups, item) => {
      groups[item.category].push(item);
      return groups;
    },
    { premium: [], streak: [], avatar: [], ai_tutor: [] },
  );

  return (
    <div className="anim-slide pb-10">
      <header className="mb-5 flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-secondary px-2.5 py-1 text-xs font-extrabold uppercase text-muted-foreground">
            <ShoppingBag size={14} />
            {t("shop.badge")}
          </div>
          <h1 className="text-2xl font-extrabold">{t("shop.title")}</h1>
          <p className="mt-1 max-w-2xl text-sm font-medium text-muted-foreground">
            {t("shop.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center sm:min-w-90">
          <div className="rounded-lg border bg-background px-3 py-3">
            <Gem className="mx-auto mb-1 text-tone-1" size={20} />
            <strong className="block text-xl">{shop.wallet.gemBalance}</strong>
            <span className="text-xs font-bold text-muted-foreground">{t("common.gems")}</span>
          </div>
          <div className="rounded-lg border bg-background px-3 py-3">
            <ShieldCheck className="mx-auto mb-1 text-tone-3" size={20} />
            <strong className="block text-xl">{shop.wallet.streakFreezes}</strong>
            <span className="text-xs font-bold text-muted-foreground">{t("common.freeze")}</span>
          </div>
          <div className="rounded-lg border bg-background px-3 py-3">
            <Crown className="mx-auto mb-1 text-gold" size={20} />
            <strong className="block text-sm">{shop.premium.isActive ? t("common.active") : t("common.free")}</strong>
            <span className="text-xs font-bold text-muted-foreground">{formatPremiumDate(shop.premium.expiresAt, t)}</span>
          </div>
        </div>
      </header>

      <div className="grid gap-5">
        {(Object.keys(groupedItems) as ShopItemCategory[]).map((category) => {
          const config = categoryConfig[category];
          const Icon = config.icon;
          const items = groupedItems[category];
          if (!items.length) return null;

          return (
            <section key={category} className="rounded-lg border bg-card p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <Icon size={19} className={config.tone} />
                <h2 className="text-base font-extrabold">{t(config.labelKey)}</h2>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => {
                  const itemText = getItemText(item, t);
                  const canAfford = gemBalance >= item.priceGems || item.isOwned;
                  const isEquipped = item.isOwned && item.isEquipped && (item.grantType === "avatar" || item.grantType === "ai_tutor_skin");

                  return (
                    <article key={item.id} className="flex min-h-45 flex-col rounded-lg border bg-background p-4">
                      <div className="mb-3 flex items-start gap-3">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-card text-3xl shadow-sm">
                          {item.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-extrabold">{itemText.name}</h3>
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{itemText.description}</p>
                        </div>
                      </div>
                      <div className="mt-auto flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2.5 py-1 text-sm font-extrabold text-foreground">
                          <Gem size={15} className="text-tone-1" />
                          {item.priceGems}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant={isEquipped ? "secondary" : "default"}
                          disabled={purchaseMutation.isPending || !canAfford || isEquipped}
                          onClick={() => buyItem(item)}
                          className={cn("min-w-24 rounded-lg", !canAfford && "opacity-60")}
                        >
                          {purchaseMutation.isPending ? <RefreshCw className="animate-spin" /> : getActionLabel(item, t)}
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
