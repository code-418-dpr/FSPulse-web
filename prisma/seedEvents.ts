/* eslint-disable
    @typescript-eslint/no-unsafe-assignment,
    @typescript-eslint/no-unsafe-call,
    @typescript-eslint/no-unsafe-member-access,
    @typescript-eslint/no-misused-promises
*/
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const competitions = [
        /* …ваши данные для сидирования */
    ];

    // await inside for…of вместо forEach
    for (const comp of competitions) {
        await prisma.event.create({ data: comp });
    }
}

main()
    .catch((err: unknown) => {
        if (err instanceof Error) {
            console.error("Ошибка при сидировании событий:", err.message);
        } else {
            console.error("Неизвестная ошибка при сидировании событий:", err);
        }
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
