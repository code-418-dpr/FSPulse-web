"use client";

import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";

export default function App() {
    return (
        <>
            <NavbarElement />
            <main className="p-4">
                <div className="h-[100vh] w-full"></div>
            </main>
            <FooterElement />
        </>
    );
}
