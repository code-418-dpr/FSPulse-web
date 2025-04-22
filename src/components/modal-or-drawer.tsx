"use client";

import React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react";

interface Props {
    label: string;
    isOpen: boolean;
    onOpenChangeAction: React.Dispatch<React.SetStateAction<boolean>>;
    children: React.ReactNode;
}

export default function ModalOrDrawer({ label, isOpen, onOpenChangeAction, children }: Props) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop
        ? ShowDialog({ label, isOpen, onOpenChangeAction, children })
        : ShowDrawer({ label, isOpen, onOpenChangeAction, children });
}

function ShowDialog({ label, isOpen, onOpenChangeAction, children }: Props) {
    return (
        <Modal backdrop="blur" scrollBehavior="outside" isOpen={isOpen} onOpenChange={onOpenChangeAction}>
            <ModalContent>
                <ModalHeader className="text-center text-2xl">{label}</ModalHeader>
                <ModalBody className="p-5">{children}</ModalBody>
            </ModalContent>
        </Modal>
    );
}

function ShowDrawer({ label, isOpen, onOpenChangeAction, children }: Props) {
    return (
        <Drawer placement="bottom" size="full" isOpen={isOpen} onOpenChange={onOpenChangeAction}>
            <DrawerContent className="p-4">
                <DrawerHeader className="text-center text-2xl">{label}</DrawerHeader>
                <DrawerBody>{children}</DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
