// src/app/common/_components/statistics/TableContainer.tsx
'use client';

import React from 'react';
import { Pagination } from '@heroui/react';

interface Column {
    key: string;
    title: string;
}

interface TableContainerProps {
    columns: Column[];
    data: Record<string, any>[];
    pageSize?: number;
}

export const TableContainer: React.FC<TableContainerProps> = ({
                                                                  columns,
                                                                  data,
                                                                  pageSize = 10,
                                                              }) => {
    const [page, setPage] = React.useState(1);
    const totalPages = Math.ceil(data.length / pageSize);
    const start = (page - 1) * pageSize;
    const pageData = data.slice(start, start + pageSize);

    return (
        <div className="space-y-2">
            <table className="w-full table-auto">
                <thead>
                <tr>
                    {columns.map((c) => (
                        <th key={c.key} className="text-left py-2">
                            {c.title}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {pageData.map((row, i) => (
                    <tr key={i} className="border-t">
                        {columns.map((c) => (
                            <td key={c.key} className="py-2">
                                {row[c.key]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <Pagination
                        current={page}
                        total={totalPages}
                        onChange={setPage}
                    />
                </div>
            )}
        </div>
    );
};
