"use client";

import React from "react";

import SignInForm from "@/components/auth/signin-form";
import UserSignupForm from "@/components/auth/user-signup-form";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react";
import { Tab, Tabs } from "@heroui/react";
import { Card, CardBody, CardHeader } from "@heroui/react";

interface Props {
    isOpen: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AuthDialogOrDrawer() {
    const { isOpen, onOpenChange } = useDisclosure();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop ? AuthDialog({ isOpen, onOpenChange }) : AuthDrawer({ isOpen, onOpenChange });
}

function AuthDialog({ isOpen, onOpenChange }: Props) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader className="text-center text-2xl">Авторизация</ModalHeader>
                <ModalBody>
                    <LoginCard />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

function AuthDrawer({ isOpen, onOpenChange }: Props) {
    return (
        <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="p-4">
                <DrawerHeader className="text-center text-2xl">Авторизация</DrawerHeader>
                <DrawerBody>
                    <RegisterTabs />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}

function LoginCard() {
    return (
        <Card className="w-96 bg-zinc-950 p-2">
            <CardHeader className="justify-center">
                <p className="mx-2 my-4 text-2xl">Вход в аккаунт</p>
            </CardHeader>
            <CardBody>
                <SignInForm />
            </CardBody>
        </Card>
    );
}

function RegisterTabs() {
    return (
        <Card className="w-96 bg-zinc-950 p-2">
            <CardHeader className="justify-center">
                <p className="mx-2 my-4 text-2xl">Регистрация</p>
            </CardHeader>
            <CardBody>
                <Tabs aria-label="RegisterForms" className="w-full" fullWidth>
                    <Tab key="user" title="Пользователь">
                        <UserSignupForm />
                    </Tab>
                    <Tab key="volunteer" title="Волонтёр">
                        <UserSignupForm />
                    </Tab>
                </Tabs>
            </CardBody>
        </Card>
    );
}
