import { SportsCategory } from "@/app/generated/prisma";

export interface UserBaseData {
    lastname: string;
    firstname: string;
    middlename?: string | null;
    email: string;
    phoneNumber: string;
    password: string;
    regionId: string;
    tg?: string | null;
}

export interface AthleteSpecificData {
    role: "athlete";
    birthDate: Date;
    address: string;
    sportCategoryId?: SportsCategory;
    github?: string;
}

export interface RepresentativeSpecificData {
    role: "representative";
    requestComment?: string;
}

export type RegistrationData = UserBaseData & (AthleteSpecificData | RepresentativeSpecificData);
