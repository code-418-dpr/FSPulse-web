import { Prisma } from "@/app/generated/prisma";

import AgeGroupCreateManyInput = Prisma.AgeGroupCreateManyInput;

const ageGroups: AgeGroupCreateManyInput = [
    { name: "Мальчики, девочки", minAge: 12, maxAge: 14 },
    { name: "Юноши, девушки", minAge: 14, maxAge: 18 },
    { name: "Юноши, девушки", minAge: 15, maxAge: 18 },
    { name: "Юниоры, юниорки", minAge: 17, maxAge: 25 },
    { name: "Мужчины, женщины", minAge: 16 },
];

export default ageGroups;
