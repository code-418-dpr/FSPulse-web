"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { CompetitionItem } from "@/types";
import { Drawer, DrawerBody, DrawerContent, Modal, ModalBody, ModalContent } from "@heroui/react";

import CompetitionDetails from "./competition-details";

interface Props {
    isOpen: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    competition: CompetitionItem;
}

export default function CompetitionDialogOrDrawer({ isOpen, onOpenChange, competition }: Props) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    return isDesktop ? (
        <ModalBackdrop {...{ isOpen, onOpenChange, competition }} />
    ) : (
        <DrawerBackdrop {...{ isOpen, onOpenChange, competition }} />
    );
}

function ModalBackdrop({ isOpen, onOpenChange, competition }: Props) {
    return (
        <Modal backdrop="blur" scrollBehavior="outside" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                <ModalBody className="p-5">
                    <CompetitionDetails competition={competition} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

function DrawerBackdrop({ isOpen, onOpenChange, competition }: Props) {
    return (
        <Drawer size="full" placement="bottom" isOpen={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="p-4">
                <DrawerBody>
                    <CompetitionDetails competition={competition} />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
}
