import { SportsCategory } from "@/app/generated/prisma";

export interface AthleteData {
    email: string;
    password: string;
    lastname: string;
    firstname: string;
    middlename?: string | null;
    birthDate: Date;
    regionId: string;
    address: string;
    sportCategory: SportsCategory;
    phoneNumber: string;
}
