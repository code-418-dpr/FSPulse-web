import React from "react";

import { CardBody, CardHeader, Card as HCard } from "@heroui/react";
import { Icon } from "@iconify/react";

interface CardProps {
    title: string;
    children: React.ReactNode;
    icon?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, icon }) => (
    <HCard
        className="border-content3 bg-content1 w-full overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md"
        disableRipple
    >
        <CardHeader className="border-content3 bg-content2/50 flex items-center gap-2 border-b px-5 py-3">
            {icon && <Icon icon={icon} className="text-primary-500" width={20} />}
            <h3 className="text-foreground text-lg font-semibold">{title}</h3>
        </CardHeader>
        <CardBody className="p-5">{children}</CardBody>
    </HCard>
);
