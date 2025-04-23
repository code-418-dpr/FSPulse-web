"use client";

import React, { useEffect, useRef } from "react";

import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import AuthForm from "@/components/auth/auth-form";
import UserEditForm from "@/components/edit-forms/user-edit-form";
import ModalOrDrawer from "@/components/modal-or-drawer";
import { NotificationList } from "@/components/notification-list";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { Tab } from "@/types";
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
    PressEvent,
    Spinner,
    User,
    useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";

import { ThemeSwitcher } from "./theme-switcher";

interface NavbarProps {
    activeTab: Tab;
    setActiveTabAction: React.Dispatch<React.SetStateAction<Tab>>;
}

export default function NavbarElement({ activeTab, setActiveTabAction }: NavbarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isLoading, isAuthenticated } = useAuth();

    // Модалки
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onOpenChange: onCreateOpenChange } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onOpenChange: onEditOpenChange } = useDisclosure();
    const {
        isOpen: isNotificationOpen,
        onOpen: onNotificationOpen,
        onOpenChange: onNotificationOpenChange,
    } = useDisclosure();

    // Уведомления
    const { notifications, unreadCount, markAllAsRead } = useNotifications();
    const prevOpenRef = useRef(isNotificationOpen);

    // Синхронизация tab из query
    useEffect(() => {
        const tab = searchParams.get("tab") as Tab | null;
        if (tab && ["requests", "events", "team", "achievement", "representative"].includes(tab)) {
            setActiveTabAction(tab);
        }
    }, [searchParams, setActiveTabAction]);

    // При закрытии уведомлений — пометить всё прочитанным
    useEffect(() => {
        if (prevOpenRef.current && !isNotificationOpen && unreadCount > 0) {
            markAllAsRead().catch((error: unknown) => {
                console.error("Form submission error:", error);
                if (error instanceof Error) {
                    console.error(error.message);
                } else {
                    console.error("Произошла неизвестная ошибка");
                }
            });
        }
        prevOpenRef.current = isNotificationOpen;
    }, [isNotificationOpen, unreadCount, markAllAsRead]);

    // Навигация между вкладками
    const handleNavigation = (e: PressEvent, tab: Tab) => {
        if (user?.role === "representative") router.push(`/representative?tab=${tab}`);
        else if (user?.role === "admin") router.push(`/admin?tab=${tab}`);
        setActiveTabAction(tab);
    };

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

            {isAuthenticated && user?.role === "representative" && (
                <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                    {(["requests", "events", "team", "achievement"] as Tab[]).map((tab) => (
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
                                        achievement: "Достижения",
                                        representative: "Представительства",
                                    }[tab]
                                }
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
            )}
            {isAuthenticated && user?.role === "admin" && (
                <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                    {(["representative", "requests", "events", "team"] as Tab[]).map((tab) => (
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
                                        achievement: "Достижения",
                                        representative: "Представительства",
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
                                        {user?.role !== "admin" ? (
                                            <DropdownItem key="settings" onPress={onEditOpen}>
                                                Настройки
                                            </DropdownItem>
                                        ) : null}

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

                            <ModalOrDrawer
                                label="Редактирование"
                                isOpen={isEditOpen}
                                onOpenChangeAction={onEditOpenChange}
                            >
                                <UserEditForm />
                            </ModalOrDrawer>
                        </div>
                    ) : (
                        <>
                            <Button
                                onPress={onCreateOpen}
                                color="primary"
                                variant="flat"
                                startContent={<Icon icon="lucide:user" />}
                            >
                                Вход
                            </Button>
                            <ModalOrDrawer
                                label="Авторизация"
                                isOpen={isCreateOpen}
                                onOpenChangeAction={onCreateOpenChange}
                            >
                                <AuthForm />
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
