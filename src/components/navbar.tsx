"use client";

import React, { useEffect } from "react";

import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import AuthDialogOrDrawer from "@/components/auth/auth-modal-or-drawer";
import { useAuth } from "@/hooks/use-auth";
import { Tab } from "@/types";
import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownSection,
    DropdownTrigger,
    Image,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    PressEvent,
    Spinner,
    User,
} from "@heroui/react";

import { ThemeSwitcher } from "./theme-switcher";

interface NavbarProps {
    activeTab: Tab;
    setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
}

export default function NavbarElement({ activeTab, setActiveTab }: NavbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoading, isAuthenticated } = useAuth();
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

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/");
        router.refresh();
    };

    return (
        <Navbar maxWidth="xl" isBordered>
            <NavbarBrand>
                <Image src="/images/FSPLogo.svg" alt="FSPulse Logo" className="h-8 w-8" />
                <p className="ml-2 text-2xl font-bold">ФСПульс</p>
            </NavbarBrand>
            {isAuthenticated && (
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
            )}
            <NavbarContent justify="end">
                <NavbarItem>
                    {isLoading ? (
                        <Spinner size="sm" />
                    ) : isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Dropdown
                                showArrow
                                classNames={{
                                    base: "before:bg-default-200", // change arrow background
                                    content: "p-0 border-small border-divider bg-background",
                                }}
                                radius="sm"
                                shouldBlockScroll={false}
                            >
                                <DropdownTrigger>
                                    <Avatar
                                        showFallback
                                        src="https://images.unsplash.com/broken"
                                        isBordered
                                        color="danger"
                                        size="sm"
                                        classNames={{
                                            base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                                            icon: "text-black/80",
                                        }}
                                    />
                                </DropdownTrigger>
                                <DropdownMenu
                                    aria-label="UserIcon"
                                    className="p-3"
                                    disabledKeys={["profile"]}
                                    itemClasses={{
                                        base: [
                                            "rounded-md",
                                            "transition-opacity",
                                            "data-[hover=true]:bg-default-100",
                                            "dark:data-[hover=true]:bg-default-50",
                                            "data-[selectable=true]:focus:bg-default-50",
                                            "data-[pressed=true]:opacity-70",
                                            "data-[focus-visible=true]:ring-default-500",
                                        ],
                                    }}
                                >
                                    <DropdownSection showDivider aria-label="Profile & Actions">
                                        <DropdownItem key="profile" isReadOnly className="h-14 gap-2 opacity-100">
                                            <User
                                                avatarProps={{
                                                    size: "sm",
                                                    src: "https://avatars.githubusercontent.com/u/30373425?v=4",
                                                }}
                                                classNames={{
                                                    name: "font-bold",
                                                    description: "text-default-500",
                                                }}
                                                description={user?.email}
                                                name={user?.name}
                                            />
                                        </DropdownItem>
                                    </DropdownSection>
                                    <DropdownSection aria-label="Settings & Logout">
                                        <DropdownItem key="settings">Настройки</DropdownItem>
                                        <DropdownItem
                                            key="logout"
                                            className="text-danger data-[hover=true]:text-danger data-[focus-visible=true]:text-danger"
                                            onPress={() => {
                                                handleLogout().catch(console.error);
                                            }}
                                        >
                                            Выход
                                        </DropdownItem>
                                    </DropdownSection>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    ) : (
                        <AuthDialogOrDrawer />
                    )}
                </NavbarItem>
                <NavbarItem>
                    <ThemeSwitcher />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
