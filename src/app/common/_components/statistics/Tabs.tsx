import React from "react";
import { Tabs as HTabs, Tab } from "@heroui/react";

interface TabItem {
    id: string;
    label: string;
    icon?: string;
}

interface TabsProps {
    tabs: TabItem[];
    onSelect?: (id: string) => void;
    defaultSelectedKey?: string;
}

export const Tabs: React.FC<TabsProps> = ({
                                              tabs,
                                              onSelect,
                                              defaultSelectedKey = tabs[0]?.id
                                          }) => {
    const [selected, setSelected] = React.useState(defaultSelectedKey);

    const handleSelectionChange = (key: React.Key) => {
        setSelected(key as string);
        if (onSelect) {
            onSelect(key as string);
        }
    };

    return (
        <HTabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={handleSelectionChange}
            color="primary"
            variant="underlined"
            classNames={{
                base: "w-full border-b border-content3 mb-4",
                tabList: "gap-6",
                cursor: "w-full bg-primary-500",
                tab: "max-w-fit px-0 h-10 data-[selected=true]:text-primary-500 data-[selected=true]:font-medium",
            }}
        >
            {tabs.map((tab) => (
                <Tab key={tab.id} title={tab.label} />
            ))}
        </HTabs>
    );
};