"use client";

import React from "react";

import EventDetails from "@/app/representative/_components/event-details";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { Drawer, DrawerBody, DrawerContent } from "@heroui/react";

interface Props {
    isOpen: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    event: Record<string, string>;
}

export default function EventDialogOrDrawer({ isOpen, onOpenChange, event }: Props) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop ? EventDialog({ isOpen, onOpenChange, event }) : EventDrawer({ isOpen, onOpenChange, event });
}

function EventDialog({ isOpen, onOpenChange, event }: Props) {
    return (
        <Modal backdrop="blur" scrollBehavior="outside" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalBody className="p-5">
                    <EventDetails event={event} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

function EventDrawer({ isOpen, onOpenChange, event }: Props) {
    return (
        <Drawer placement="bottom" isOpen={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="p-4">
                <DrawerBody>
                    <EventDetails event={event} />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
