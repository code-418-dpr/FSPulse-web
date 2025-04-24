"use client";

import React from "react";

import Statistics from "@/app/athlete/_components/statistics/statistics";
import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Tab } from "@/types";
import { CircularProgress } from "@heroui/react";

export default function AthletePage() {
    const { isAuthenticated, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("statistics");
    if (isLoading) {
        return <CircularProgress size="lg" aria-label="Загрузка..." />;
    }
    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />

            <main className="space-y-8 p-6">
                <Statistics />
            </main>

            <FooterElement />
        </>
    );
}
