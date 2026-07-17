import { formatDate } from "../../../i18n";
import type { Language, TranslationKey } from "../../../i18n";

export default function formatPremiumDate(
    value: string | null | undefined,
    t: (key: TranslationKey) => string,
    language: Language,
) {
    if (!value) return t("shop.notActive");
    return formatDate(value, language);
}
