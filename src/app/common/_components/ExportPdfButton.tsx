// src/app/common/_components/exportPdfButton.tsx
"use client";

import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import React from "react";

// импорт функции
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

// src/app/common/_components/exportPdfButton.tsx

export interface Column {
    key: string;
    title: string;
}

export interface ExportPdfButtonProps {
    exportId?: string;
    fileName?: string;
    label?: string;
    tableColumns?: Column[];
    tableData?: Record<string, any>[];
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
    exportId = "exportable",
    fileName = "statistics.pdf",
    label = "Скачать PDF",
    tableColumns,
    tableData,
}) => {
    const generatePdf = async () => {
        const element = document.getElementById(exportId);
        if (!element) return;

        // 1) Захват экрана в PNG
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // 2) Создание PDF
        const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pageHeight = (imgProps.height * pageWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

        // 3) Если есть таблица — вставляем её на новую страницу
        if (tableColumns && tableData) {
            pdf.addPage();

            // формируем head и body для autoTable
            const head = [tableColumns.map((c) => c.title)];
            const body = tableData.map((row) => tableColumns.map((c) => String(row[c.key] ?? "")));

            // Вызов новой функции autoTable(pdf, ...)
            autoTable(pdf, {
                head,
                body,
                startY: 20,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [41, 98, 255] },
            });
        }

        // 4) Сохраняем файл
        pdf.save(fileName);
    };

    return (
        <Button onPress={generatePdf} size="md" className="flex items-center space-x-2">
            <Icon icon="iconoir:download" width={20} height={20} />
            <span>{label}</span>
        </Button>
    );
};
