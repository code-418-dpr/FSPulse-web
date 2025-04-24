// src/app/common/_components/ExportPdfButton.tsx
'use client';

import React from 'react';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

export interface Column {
    key: string;
    title: string;
}

export interface ExportPdfButtonProps {
    /** id контейнера с экспортируемой статистикой */
    exportId?: string;
    /** имя сохраняемого файла */
    fileName?: string;
    /** надпись на кнопке */
    label?: string;
    /** опционально: колонки таблицы, которую нужно вывести в PDF */
    tableColumns?: Column[];
    /** опционально: данные таблицы */
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
        if (!element) {
            console.error(`Element "${exportId}" not found`);
            return;
        }

        // 1. Захватываем область в PNG
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        // 2. Создаём PDF
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pageHeight = (imgProps.height * pageWidth) / imgProps.width;

        // 3. Вставляем картинку (диаграммы, карточки)
        pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

        // 4. Если есть таблица — добавляем её на новую страницу
        if (tableColumns && tableData) {
            pdf.addPage();
            const head = [tableColumns.map((c) => c.title)];
            const body = tableData.map((row) =>
                tableColumns.map((c) => String(row[c.key] ?? ''))
            );
            // @ts-ignore автотайбл должжен подтягиваться из jspdf-autotable
            pdf.autoTable({
                head,
                body,
                startY: 20,
                styles: { fontSize: 10 },
                headStyles: { fillColor: [41, 98, 255] },
            });
        }

        // 5. Сохраняем
        pdf.save(fileName);
    };

    return (
        <Button onPress={generatePdf} size="md" className="flex items-center space-x-2">
            <Icon icon="iconoir:download" width={20} height={20} />
            <span>{label}</span>
        </Button>
    );
};
