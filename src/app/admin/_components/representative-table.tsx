"use client";

import { RepresentativeItem } from "@/data/representative";
import { Chip, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";

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
                                <TableRow key={rep.id}>
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
