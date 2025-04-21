"use client";

import { useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import AuthDialogOrDrawer from "@/components/auth/auth-modal-or-drawer";
import { Button, Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem, PressEvent, Spinner } from "@heroui/react";

import { ThemeSwitcher } from "./theme-switcher";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
const NavbarElement = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleNavigation = (e: PressEvent, tab: string) => {
        // Обновляем URL с параметром tab
        router.push(`/representative?tab=${tab}`);
        setActiveTab(tab);
    };

    // При монтировании проверяем параметр tab в URL
    useEffect(() => {
        const tab = searchParams.get("tab");
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
                <p className="ml-2 text-2xl font-bold">FSPulse</p>
            </NavbarBrand>

            <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                <NavbarItem>
                    <Link
                        color="foreground"
                        href="#"
                        onPress={(e) => {
                            handleNavigation(e, "requests");
                        }}
                        className={activeTab === "requests" ? "font-bold" : ""}
                    >
                        Заявки
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link
                        color="foreground"
                        href="#"
                        onPress={(e) => {
                            handleNavigation(e, "events");
                        }}
                        className={activeTab === "events" ? "font-bold" : ""}
                    >
                        Соревнования
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link
                        color="foreground"
                        href="#"
                        onPress={(e) => {
                            handleNavigation(e, "team");
                        }}
                        className={activeTab === "team" ? "font-bold" : ""}
                    >
                        Сборная
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                {isLoading ? (
            <Spinner size="sm" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block">{user?.name}</span>
              <Button 
                color="danger" 
                onPress={() => { 
                    handleLogout().catch(console.error);
                }}
                variant="flat"
              >
                Выход
              </Button>
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
};

export default NavbarElement;
