"use client";

import React from "react";

import SignInForm from "@/components/auth/signin-form";
import SpokesmanSignupForm from "@/components/auth/spokesman-signup-form";
import UserSignupForm from "@/components/auth/user-signup-form";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button, DropdownMenuProps, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react";
import { Tab, Tabs } from "@heroui/react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Props {
    isOpen: boolean;
    onOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AuthDialogOrDrawer() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop ? AuthDialog({ isOpen, onOpen, onOpenChange }) : AuthDrawer({ isOpen, onOpen, onOpenChange });
}

function AuthDialog({ isOpen, onOpen, onOpenChange }: Props) {
    return (
        <>
            <Button
                onPress={() => {
                    onOpen(true);
                }}
                color="primary"
                variant="flat"
                startContent={<Icon icon="lucide:user" />}
            >
                Login
            </Button>
            <Modal backdrop="blur" scrollBehavior="outside" isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader className="text-center text-2xl">Авторизация</ModalHeader>
                    <ModalBody className="p-5">
                        <AuthTabs />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

function AuthDrawer({ isOpen, onOpen, onOpenChange }: Props) {
    return (
        <>
            <Button
                onPress={() => {
                    onOpen(true);
                }}
                color="primary"
                variant="flat"
                startContent={<Icon icon="lucide:user" />}
            >
                Login
            </Button>
            <Drawer placement="bottom" isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="p-4">
                    <DrawerHeader className="text-center text-2xl">Авторизация</DrawerHeader>
                    <DrawerBody>
                        <AuthTabs />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}

function AuthTabs() {
    return (
        <Tabs aria-label="RegisterForms" className="w-full" fullWidth>
            <Tab key="user" title="Вход">
                <SignInForm />
            </Tab>
            <Tab key="volunteer" title="Регистрация">
                <Register />
            </Tab>
        </Tabs>
    );
}

function Register() {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(new Set(["Спортсмен"]));

    const selectedValue = React.useMemo(() => Array.from(selectedKeys).join(", ").replace(/_/g, ""), [selectedKeys]);

    const handleSelectionChange: DropdownMenuProps["onSelectionChange"] = (keys) => {
        if (keys === "all") {
            setSelectedKeys(new Set(["Спортсмен", "Представитель"]));
        } else {
            const stringKeys = new Set<string>();
            (keys as Set<string>).forEach((key) => {
                if (typeof key === "string") {
                    stringKeys.add(key);
                }
            });
            setSelectedKeys(stringKeys);
        }
    };

    return (
        <>
            <div className="my-4 flex justify-center">
                <Dropdown>
                    <DropdownTrigger>
                        <Button className="capitalize" variant="bordered">
                            {selectedValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Single selection example"
                        selectedKeys={selectedKeys}
                        selectionMode="single"
                        variant="flat"
                        onSelectionChange={handleSelectionChange}
                    >
                        <DropdownItem key="Спортсмен">Спортсмен</DropdownItem>
                        <DropdownItem key="Представитель">Представитель</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            {selectedValue === "Спортсмен" ? <UserSignupForm /> : <SpokesmanSignupForm />}
        </>
    );
}
