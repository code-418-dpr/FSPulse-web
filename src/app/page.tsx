"use client";

import { useState } from "react";

import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";
import { Tab } from "@/types";

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>("requests");
    return (
        <>
            <NavbarElement activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="p-4">
                <div className="h-[100vh] w-full"></div>
            </main>
            <FooterElement />
        </>
    );
}
