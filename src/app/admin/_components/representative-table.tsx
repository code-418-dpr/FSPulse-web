"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { RepresentativeItem } from "@/data/representative";
import { RequestStatus } from "@/app/generated/prisma";

export default function RepresentativeTable({
  representatives,
}: {
  representatives: RepresentativeItem[];
}) {
  const statusColors: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: "text-yellow-600",
    [RequestStatus.APPROVED]: "text-green-600",
    [RequestStatus.DECLINED]: "text-red-600",
  };

  return (
    <Table aria-label="Таблица представителей">
      <TableHeader>
        <TableColumn>Регион</TableColumn>
        <TableColumn>ФИО</TableColumn>
        <TableColumn>Статус</TableColumn>
      </TableHeader>
      <TableBody>
        {representatives.map((rep) => (
          <TableRow key={rep.id}>
            <TableCell>{rep.region}</TableCell>
            <TableCell>{rep.fio}</TableCell>
            <TableCell className={statusColors[rep.status]}>
              {{
                [RequestStatus.PENDING]: "На рассмотрении",
                [RequestStatus.APPROVED]: "Одобрено",
                [RequestStatus.DECLINED]: "Отклонено",
              }[rep.status]}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}