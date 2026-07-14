import type { TranslationKey } from "../../../i18n";
import type { ShopItem} from "../../../api/users";

export default function getActionLabel(item: ShopItem, t: (key: TranslationKey) => string) {
  if ((item.grantType === "avatar" || item.grantType === "ai_tutor_skin") && item.isOwned) {
    return item.isEquipped ? t("shop.action.equipped") : t("shop.action.equip");
  }

  if (item.grantType === "premium_days") {
    return t("shop.action.buyPremium");
  }

  return t("shop.action.buyNow");
}
