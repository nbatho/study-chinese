
import type { TranslationKey } from "../../../i18n";
import type { ShopItem } from "../../../api/users";

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


export default function getItemText(item: ShopItem, t: (key: TranslationKey) => string) {
    const keys = itemTextKeys[item.id];

    return {
        name: keys ? t(keys.name) : item.name,
        description: keys ? t(keys.description) : item.description,
    };
}