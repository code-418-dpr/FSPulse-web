import { SportsCategory } from "@/app/generated/prisma";

export function getCategoryLabel(key: SportsCategory): string {
    const map: Record<SportsCategory, string> = {
        HMS: "Заслуженный мастер спорта",
        MS: "Мастер спорта",
        CMS: "Кандидат в мастера спорта",
        A: "1 разряд",
        B: "2 разряд",
        C: "3 разряд",
        Ay: "1 юношеский разряд",
        By: "2 юношеский разряд",
        Cy: "3 юношеский разряд",
    };
    return map[key];
}
