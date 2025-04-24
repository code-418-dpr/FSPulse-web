"use client";

// import { YMapComponentsProvider } from "ymap3-components";
import { useState } from "react";

import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";
import { Tab } from "@/types";

export default function App() {
    const [activeTab, setActiveTab] = useState<Tab>("requests");
    return (
        <>
            {/* <YMapComponentsProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY ?? "none"}> */}
            <NavbarElement activeTab={activeTab} setActiveTabAction={setActiveTab} />
            <main className="p-4">
                <div className="h-[100vh] w-full"></div>
            </main>
            <FooterElement />
            {/* </YMapComponentsProvider> */}
        </>
    );
}
