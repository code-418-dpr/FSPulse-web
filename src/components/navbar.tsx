// src/components/navbar.tsx
"use client";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import AuthDialogOrDrawer from "@/components/auth/auth-modal-or-drawer";
import { Tab } from "@/types";
import { Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, PressEvent } from "@heroui/react";

import { ThemeSwitcher } from "./theme-switcher";

// src/components/navbar.tsx

interface NavbarProps {
    activeTab: Tab;
    setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

export default function NavbarElement({ activeTab, setActiveTab }: NavbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleNavigation = (e: PressEvent, tab: Tab) => {
        router.push(`/representative?tab=${tab}`);
        setActiveTab(tab);
    };

    useEffect(() => {
        const tab = searchParams.get("tab") as Tab | null;
        if (tab && ["requests", "events", "team"].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams, setActiveTab]);

    return (
        <Navbar maxWidth="xl" isBordered>
            <NavbarBrand>
                <Image src="/images/FSPLogo.svg" alt="FSPulse Logo" className="h-8 w-8" />
                <p className="ml-2 text-2xl font-bold">FSPulse</p>
            </NavbarBrand>

            <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                {(["requests", "events", "team"] as Tab[]).map((tab) => (
                    <NavbarItem key={tab}>
                        <Link
                            color="foreground"
                            href="#"
                            onPress={(e) => {
                                handleNavigation(e, tab);
                            }}
                            className={activeTab === tab ? "font-bold" : ""}
                        >
                            {
                                {
                                    requests: "Заявки",
                                    events: "Соревнования",
                                    team: "Сборная",
                                }[tab]
                            }
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <AuthDialogOrDrawer />
                </NavbarItem>
                <NavbarItem>
                    <ThemeSwitcher />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
