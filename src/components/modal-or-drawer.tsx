"use client";

import React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Props {
    isOpen: boolean;
    onOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

export default function ModalOrDrawer({ children }: { children: React.ReactNode }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop
        ? ShowDialog({ isOpen, onOpen, onOpenChange, children })
        : ShowDrawer({ isOpen, onOpen, onOpenChange, children });
}

function ShowDialog({ isOpen, onOpen, onOpenChange, children }: Props) {
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
                    <ModalBody className="p-5">{children}</ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}

function ShowDrawer({ isOpen, onOpen, onOpenChange, children }: Props) {
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
                    <DrawerBody>{children}</DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
