// src/app/common/_components/ExportPdfButton.tsx
"use client";

import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";

import React from "react";

import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";

// src/app/common/_components/ExportPdfButton.tsx

export interface ExportPdfButtonProps {
    /** id элемента, который будем экспортировать в PDF */
    exportId?: string;
    /** имя сохраняемого файла */
    fileName?: string;
    /** текст на кнопке */
    label?: string;
}

export const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
    exportId = "exportable",
    fileName = "statistics.pdf",
    label = "Скачать PDF",
}) => {
    const generatePdf = async (): Promise<void> => {
        const element = document.getElementById(exportId);
        if (!element) {
            console.warn(`Element with id "${exportId}" not found`);
            return;
        }

        // temporarily disable dark mode for accurate screenshot
        const htmlEl = document.documentElement;
        const hadDark = htmlEl.classList.contains("dark");
        if (hadDark) htmlEl.classList.remove("dark");

        // 1) Захват области в PNG
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: "#fff",
        });
        const imgData = canvas.toDataURL("image/png");

        // restore dark mode if it was previously enabled
        if (hadDark) htmlEl.classList.add("dark");

        // 2) Создание PDF
        const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pageHeight = (imgProps.height * pageWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

        // 3) Сохраняем файл
        pdf.save(fileName);
    };

    return (
        <Button
            onPress={() => {
                void generatePdf();
            }}
            size="md"
            className="flex items-center space-x-2"
        >
            <Icon icon="iconoir:download" width={20} height={20} />
            <span>{label}</span>
        </Button>
    );
};
