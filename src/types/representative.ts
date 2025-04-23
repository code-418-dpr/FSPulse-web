import { Prisma } from "@/app/generated/prisma";

export type RepresentativeDetails = Prisma.RepresentativeGetPayload<{
    include: {
        user: {
            include: {
                region: true;
            };
        };
        events: {
            include: {
                event: true;
            };
        };
    };
}>;
