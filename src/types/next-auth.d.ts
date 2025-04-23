import "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        role: "athlete" | "representative" | "admin";
        name?: string;
        email?: string;
    }

    interface Session {
        user: {
            id: string;
            role: "athlete" | "representative" | "admin";
            name?: string;
            email?: string;
        };
    }
}
