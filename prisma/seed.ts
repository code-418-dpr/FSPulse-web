import { createDisciplines } from "@/data/discipline";
import { createRegions } from "@/data/region";

import disciplineNames from "./data/disciplines";
import regionNames from "./data/regions";

export async function main() {
    await createRegions(regionNames);
    await createDisciplines(disciplineNames);
}

void main();
