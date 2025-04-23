"use client";

import { useState } from "react";

import ModalOrDrawer from "@/components/modal-or-drawer";
import { RepresentativeItem } from "@/data/representative";
import {
    Chip,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from "@heroui/react";

import RepresentativeDetails from "./representative/representative-details";

export function RepresentativeTableWithPagination({
    data,
    onPageChange,
}: {
    data: {
        items: RepresentativeItem[];
        totalPages: number;
        currentPage: number;
    };
    onPageChange: (page: number) => void;
}) {
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const handleRowClick = (id: string) => {
        setSelectedId(id);
        onOpen();
    };
    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <Table aria-label="Представители">
                    <TableHeader>
                        <TableColumn>Регион</TableColumn>
                        <TableColumn>ФИО</TableColumn>
                        <TableColumn>Статус</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {data.items.length > 0 ? (
                            data.items.map((rep) => (
                                <TableRow
                                    key={rep.id}
                                    className="hover:bg-foreground/10 cursor-pointer"
                                    onClick={() => {
                                        handleRowClick(rep.id);
                                    }}
                                >
                                    <TableCell>{rep.region}</TableCell>
                                    <TableCell>{rep.fio}</TableCell>
                                    <TableCell>
                                        <Chip
                                            color={
                                                rep.status == "APPROVED"
                                                    ? "success"
                                                    : rep.status == "DECLINED"
                                                      ? "danger"
                                                      : "warning"
                                            }
                                            variant="solid"
                                        >
                                            {rep.status == "APPROVED"
                                                ? "Одобрено"
                                                : rep.status == "DECLINED"
                                                  ? "Отклонено"
                                                  : "На рассмотрении"}
                                        </Chip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-muted-foreground text-center">
                                    Данных нет
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {selectedId && (
                    <ModalOrDrawer
                        isOpen={isOpen}
                        onOpenChangeAction={onOpenChange}
                        label="Детали представителя"
                        size="xl"
                    >
                        <RepresentativeDetails representativeId={selectedId} onClose={onOpenChange} />
                    </ModalOrDrawer>
                )}
            </div>

            {data.totalPages > 1 && (
                <Pagination
                    total={data.totalPages}
                    page={data.currentPage}
                    onChange={onPageChange}
                    className="justify-center"
                />
            )}
        </div>
    );
}
