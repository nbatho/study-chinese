
import type { TranslationKey } from "../../../i18n";

export default function formatPremiumDate(value: string | null | undefined, t: (key: TranslationKey) => string) {
    if (!value) return t("shop.notActive");
    return new Date(value).toLocaleDateString();
}