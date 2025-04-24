// src/app/common/_components/statistics/Tabs.tsx
import React from 'react';

interface Tab {
    id: string;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    onSelect?: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, onSelect }) => {
    const [active, setActive] = React.useState(tabs[0].id);
    return (
        <div className="flex border-b mb-4">
            {tabs.map(t => (
                <button
                    key={t.id}
                    className={`px-4 py-2 -mb-px ${
                        active === t.id ? 'border-b-2 font-semibold' : 'text-gray-500'
                    }`}
                    onClick={() => {
                        setActive(t.id);
                        onSelect?.(t.id);
                    }}
                >
                    {t.label}
                </button>
            ))}
        </div>
    );
};
