// src/app/common/_components/statistics/Card.tsx
'use client';

import { Card as HCard, CardHeader, CardBody } from '@heroui/react';

interface CardProps {
    title: string;
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children }) => (
    <HCard
        className="
      w-full
      bg-foreground/5
      dark:bg-foreground/10
      border border-foreground/10 dark:border-foreground/20
      shadow-sm
      rounded-lg
      overflow-hidden
    "
    >
        <CardHeader
            className="
        bg-foreground/10 dark:bg-foreground/20
        px-4 py-2
        border-b border-foreground/10 dark:border-foreground/20
      "
        >
            <h3 className="text-lg font-semibold text-foreground dark:text-foreground/90">
                {title}
            </h3>
        </CardHeader>
        <CardBody className="p-4">{children}</CardBody>
    </HCard>
);
