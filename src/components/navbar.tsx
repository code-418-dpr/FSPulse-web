"use client";

import React, { useEffect, useRef } from "react";

import { useAuth } from "@/hooks/use-auth";
import {
    Avatar,
    Badge,
    Button,
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
    Spinner,
    User,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { useNotifications } from "../hooks/use-notifications";
import ModalOrDrawer from "./modal-or-drawer";
import { NotificationList } from "./notification-list";
import { ThemeSwitcher } from "./theme-switcher";

// <-- импорт хука аутентификации

interface NavbarProps {
    activeTab: "requests" | "events" | "team";
    setActiveTabAction: React.Dispatch<React.SetStateAction<"requests" | "events" | "team">>;
}

export default function NavbarElement({ activeTab, setActiveTabAction }: NavbarProps) {
    const { isOpen: isAuthOpen, onOpen: onAuthOpen, onOpenChange: onAuthOpenChange } = useDisclosure();
    const { isOpen: isProfileOpen, onOpen: onProfileOpen, onOpenChange: onProfileOpenChange } = useDisclosure();
    const {
        isOpen: isNotificationOpen,
        onOpen: onNotificationOpen,
        onOpenChange: onNotificationOpenChange,
    } = useDisclosure();

    const { notifications, unreadCount, markAllAsRead } = useNotifications();
    const { user, isAuthenticated, isLoading } = useAuth();

    // Ref для отслеживания закрытия
    const prevOpenRef = useRef(isNotificationOpen);
    useEffect(() => {
        if (prevOpenRef.current && !isNotificationOpen && unreadCount > 0) {
            markAllAsRead();
        }
        prevOpenRef.current = isNotificationOpen;
    }, [isNotificationOpen, unreadCount, markAllAsRead]);

    const handleNavigation = (tab: "requests" | "events" | "team") => {
        setActiveTabAction(tab);
    };

    function handleLogout(): void {
        console.log("Logging out");
        // TODO: реальный выход
    }

    return (
        <Navbar maxWidth="xl" isBordered>
            <NavbarBrand>
                <Image src="/images/FSPLogo.svg" alt="FSPulse Logo" className="h-8 w-8" />
                <p className="ml-2 text-2xl font-bold">ФСПульс</p>
            </NavbarBrand>

            {isAuthenticated && (
                <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                    {(["requests", "events", "team"] as const).map((tab) => (
                        <NavbarItem key={tab}>
                            <Link
                                color="foreground"
                                href="#"
                                onPress={() => { handleNavigation(tab); }}
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
                {isAuthenticated && (
                    <NavbarItem>
                        <div className="relative">
                            <Button
                                isIconOnly
                                variant="light"
                                radius="full"
                                onPress={onNotificationOpen}
                                aria-label="Notifications"
                            >
                                <Icon icon="lucide:bell" className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <Badge color="primary" shape="circle" placement="top-right" size="sm">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </Badge>
                                )}
                            </Button>
                            <ModalOrDrawer
                                label="Уведомления"
                                isOpen={isNotificationOpen}
                                onOpenChangeAction={onNotificationOpenChange}
                                size="md"
                            >
                                <NotificationList notifications={notifications} />
                            </ModalOrDrawer>
                        </div>
                    </NavbarItem>
                )}

                <NavbarItem>
                    {isLoading ? (
                        <Spinner size="sm" />
                    ) : isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Dropdown
                                showArrow
                                classNames={{
                                    base: "before:bg-default-200",
                                    content: "p-0 border-small border-divider bg-background",
                                }}
                                radius="sm"
                                shouldBlockScroll={false}
                            >
                                <DropdownTrigger className="cursor-pointer">
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
                                                    className:
                                                        "bg-gradient-to-br from-[#FFB457] to-[#FF705B] text-black",
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
                                        <DropdownItem key="settings" onPress={onProfileOpen}>
                                            Настройки
                                        </DropdownItem>
                                        <DropdownItem
                                            key="logout"
                                            className="text-danger data-[hover=true]:text-danger data-[focus-visible=true]:text-danger"
                                            onPress={handleLogout}
                                        >
                                            Выход
                                        </DropdownItem>
                                    </DropdownSection>
                                </DropdownMenu>
                            </Dropdown>

                            <ModalOrDrawer
                                label="Редактирование"
                                isOpen={isProfileOpen}
                                onOpenChangeAction={onProfileOpenChange}
                            >
                                <div className="p-4">
                                    <p>User edit form would go here</p>
                                </div>
                            </ModalOrDrawer>
                        </div>
                    ) : (
                        <>
                            <Button
                                onPress={onAuthOpen}
                                color="primary"
                                variant="flat"
                                startContent={<Icon icon="lucide:user" />}
                            >
                                Вход
                            </Button>
                            <ModalOrDrawer
                                label="Авторизация"
                                isOpen={isAuthOpen}
                                onOpenChangeAction={onAuthOpenChange}
                            >
                                <div className="p-4">
                                    <p>Auth form would go here</p>
                                </div>
                            </ModalOrDrawer>
                        </>
                    )}
                </NavbarItem>

                <NavbarItem>
                    <ThemeSwitcher />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
