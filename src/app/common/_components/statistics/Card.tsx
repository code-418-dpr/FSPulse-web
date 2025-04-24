import React from "react";
import { Card as HCard, CardHeader, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

interface CardProps {
    title: string;
    children: React.ReactNode;
    icon?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, icon }) => (
    <HCard
        className="w-full overflow-hidden rounded-xl border border-content3 bg-content1 shadow-sm transition-all hover:shadow-md"
        disableRipple
    >
        <CardHeader className="flex items-center gap-2 border-b border-content3 bg-content2/50 px-5 py-3">
            {icon && <Icon icon={icon} className="text-primary-500" width={20} />}
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </CardHeader>
        <CardBody className="p-5">{children}</CardBody>
    </HCard>
);