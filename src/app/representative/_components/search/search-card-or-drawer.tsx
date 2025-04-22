"use client";

import * as React from "react";

import { SearchForm } from "@/app/representative/_components/search/search-form";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { SearchParams } from "@/types/search";
import { Card, CardBody, CardHeader, useDisclosure } from "@heroui/react";
import { Button, Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react";
import { Icon } from "@iconify/react";

// Убедитесь что тип определен

interface Props {
    onSearch: (params: SearchParams) => void;
}

export function SearchCardOrDrawer({ onSearch }: Props) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return isDesktop ? SearchCard({ onSearch }) : SearchDrawer({ isOpen, onOpen, onOpenChange, onSearch });
}

function SearchCard({ onSearch }: { onSearch: Props["onSearch"] }) {
    return (
        <div className="w-full p-4 sm:w-1/4">
            <Card className="sticky top-20">
                <CardHeader className="text-xl">Поиск</CardHeader>
                <CardBody>
                    <SearchForm onSubmit={onSearch} />
                </CardBody>
            </Card>
        </div>
    );
}

interface DrawerProps extends Props {
    isOpen: boolean;
    onOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

function SearchDrawer({ isOpen, onOpen, onOpenChange, onSearch }: DrawerProps) {
    return (
        <>
            <Button
                variant="bordered"
                className="m-4 h-12 w-12"
                onPress={() => {
                    onOpen(true);
                }}
            >
                <span className="flex items-center">
                    <Icon icon="iconoir:search" width={18} height={18} className="mr-1" />
                </span>
            </Button>
            <Drawer placement="bottom" isOpen={isOpen} onOpenChange={onOpenChange}>
                <DrawerContent className="p-4">
                    <DrawerHeader className="text-center text-2xl">Поиск</DrawerHeader>
                    <DrawerBody>
                        <SearchForm onSubmit={onSearch} />
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
