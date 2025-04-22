"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { EventItem } from "@/types";
import { Drawer, DrawerBody, DrawerContent, Modal, ModalBody, ModalContent } from "@heroui/react";

import EventDetails from "./event-details";

interface Props {
    isOpen: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    event: EventItem;
}

export default function EventDialogOrDrawer({ isOpen, onOpenChange, event }: Props) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    return isDesktop ? (
        <EventModal {...{ isOpen, onOpenChange, event }} />
    ) : (
        <EventDrawer {...{ isOpen, onOpenChange, event }} />
    );
}

function EventModal({ isOpen, onOpenChange, event }: Props) {
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
        <Drawer size="full" placement="bottom" isOpen={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="p-4">
                <DrawerBody>
                    <EventDetails event={event} />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
