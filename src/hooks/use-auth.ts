"use client";

import { useSession } from "next-auth/react";

export const useAuth = () => {
    const { data: session, status } = useSession();

    return {
        user: session?.user,
        isLoading: status === "loading",
        isAuthenticated: status === "authenticated",
        role: session?.user.role,
    };
};
