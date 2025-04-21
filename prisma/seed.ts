import { Prisma, PrismaClient } from "@/app/generated/prisma";

import disciplines from "./data/disciplines";
import regions from "./data/regions";

const prisma = new PrismaClient();

const regionsData: Prisma.RegionCreateInput[] = regions.map((region) => ({ name: region }));
const disciplinesData: Prisma.DisciplineCreateInput[] = disciplines.map((discipline) => ({ name: discipline }));

export async function main() {
    for (const region of regionsData) {
        await prisma.region.create({ data: region });
    }
    for (const discipline of disciplinesData) {
        await prisma.discipline.create({ data: discipline });
    }
}

void main();
