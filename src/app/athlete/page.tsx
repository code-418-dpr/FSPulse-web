"use client";

import React from "react";

import Statistics from "@/app/athlete/_components/statistics/statistics";
import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";
import { useAuth } from "@/hooks/use-auth";
import { CircularProgress } from "@heroui/react";

export default function AthletePage() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <CircularProgress size="lg" aria-label="Загрузка..." />;
    }
    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <NavbarElement activeTab="athlete" />

            <main className="space-y-8 p-6">
                <Statistics />
            </main>

            <FooterElement />
        </>
    );
}
