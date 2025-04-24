'use client';

import React from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

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
                                                                    exportId = 'exportable',
                                                                    fileName = 'statistics.pdf',
                                                                    label = 'Скачать PDF',
                                                                    tableColumns,
                                                                    tableData,
                                                                }) => {
    const generatePdf = async () => {
        const element = document.getElementById(exportId);
        if (!element) return;

        // temporarily disable dark mode for accurate screenshot
        const htmlEl = document.documentElement;
        const hadDark = htmlEl.classList.contains('dark');
        if (hadDark) htmlEl.classList.remove('dark');

        // 1) Захват области в PNG
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#fff',
        });
        const imgData = canvas.toDataURL('image/png');

        // restore dark mode if it was previously enabled
        if (hadDark) htmlEl.classList.add('dark');

        // 2) Создание PDF
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pageHeight = (imgProps.height * pageWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

        // 3) Если есть таблица — вставляем её на новую страницу
        if (tableColumns && tableData) {
            pdf.addPage();
            const head = [tableColumns.map(c => c.title)];
            const body = tableData.map(row =>
                tableColumns.map(c => String(row[c.key] ?? ''))
            );
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
