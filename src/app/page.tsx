"use client";

import FooterElement from "@/components/footer";
import NavbarElement from "@/components/navbar";
import { Input } from "@heroui/input";

export default function App() {
    return (
        <>
            <NavbarElement />
            <main className="p-4">
                <div className="h-[100vh] w-full">
                    <Input className="mb-4" />
                </div>
            </main>
            <FooterElement />
        </>
    );
}
