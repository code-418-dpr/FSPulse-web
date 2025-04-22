"use client";

import React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react";

interface Props {
    isOpen: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

export default function ModalOrDrawer({ isOpen, onOpenChange, children }: Props) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop ? ShowDialog({ isOpen, onOpenChange, children }) : ShowDrawer({ isOpen, onOpenChange, children });
}

function ShowDialog({ isOpen, onOpenChange, children }: Props) {
    return (
        <Modal backdrop="blur" scrollBehavior="outside" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalHeader className="text-center text-2xl">Авторизация</ModalHeader>
                <ModalBody className="p-5">{children}</ModalBody>
            </ModalContent>
        </Modal>
    );
}

function ShowDrawer({ isOpen, onOpenChange, children }: Props) {
    return (
        <Drawer placement="bottom" size="full" isOpen={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="p-4">
                <DrawerHeader className="text-center text-2xl">Авторизация</DrawerHeader>
                <DrawerBody>{children}</DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
