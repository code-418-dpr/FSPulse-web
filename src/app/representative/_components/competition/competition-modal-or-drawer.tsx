"use client";

import React from "react";

import CompetitionDetails from "@/app/representative/_components/competition/competition-details";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { Drawer, DrawerBody, DrawerContent } from "@heroui/react";

interface Props {
    isOpen: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    competition: Record<string, string>;
}

export default function CompetitionDialogOrDrawer({ isOpen, onOpenChange, competition }: Props) {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop
        ? CompetitionDialog({ isOpen, onOpenChange, competition })
        : CompetitionDrawer({ isOpen, onOpenChange, competition });
}

function CompetitionDialog({ isOpen, onOpenChange, competition }: Props) {
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

function CompetitionDrawer({ isOpen, onOpenChange, competition }: Props) {
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
