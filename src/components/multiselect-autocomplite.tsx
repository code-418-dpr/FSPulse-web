import React from "react";

import { Autocomplete, AutocompleteItem, Button, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Item {
    label: string;
    key: string;
    description?: string;
}

interface MultiSelectAutocompleteProps {
    items: Item[];
    label: string;
    placeholder?: string;
    selectedKeys: Set<string>;
    onSelectionChange: (keys: Set<string>) => void;
    variant?: "flat" | "bordered" | "faded" | "underlined";
}

export const MultiSelectAutocomplete: React.FC<MultiSelectAutocompleteProps> = ({
    items,
    label,
    placeholder,
    selectedKeys,
    onSelectionChange,
    variant = "bordered",
}) => {
    const [inputValue, setInputValue] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);

    // Filter items based on input value
    const filteredItems = React.useMemo(() => {
        if (!inputValue.trim()) return items;

        const lowerCaseInput = inputValue.toLowerCase();
        return items.filter(
            (item) =>
                item.label.toLowerCase().includes(lowerCaseInput) ||
                (item.description?.toLowerCase().includes(lowerCaseInput)),
        );
    }, [items, inputValue]);

    // Handle selection of an item
    const handleSelectionChange = (key: React.Key) => {
        const newSelectedKeys = new Set(selectedKeys);

        if (newSelectedKeys.has(key.toString())) {
            newSelectedKeys.delete(key.toString());
        } else {
            newSelectedKeys.add(key.toString());
        }

        onSelectionChange(newSelectedKeys);
        setInputValue("");
    };

    // Remove a selected item
    const handleRemove = (key: string) => {
        const newSelectedKeys = new Set(selectedKeys);
        newSelectedKeys.delete(key);
        onSelectionChange(newSelectedKeys);
    };

    // Clear all selected items
    const handleClearAll = () => {
        onSelectionChange(new Set());
    };

    // Render selected items as chips
    const renderSelectedItems = () => {
        if (selectedKeys.size === 0) return null;

        return (
            <div className="mt-2 flex flex-wrap gap-1">
                {Array.from(selectedKeys).map((key) => {
                    const item = items.find((i) => i.key === key);
                    if (!item) return null;

                    return (
                        <Chip
                            key={key}
                            onClose={() => { handleRemove(key); }}
                            variant="flat"
                            color="primary"
                            size="sm"
                            className="max-w-[200px]"
                        >
                            {item.label}
                        </Chip>
                    );
                })}

                {selectedKeys.size > 1 && (
                    <Button size="sm" variant="light" color="danger" onPress={handleClearAll} className="ml-1">
                        Clear all
                    </Button>
                )}
            </div>
        );
    };

    return (
        <div className="w-full">
            <Autocomplete
                label={label}
                placeholder={placeholder}
                variant={variant}
                defaultItems={filteredItems}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onOpenChange={setIsOpen}
                isOpen={isOpen}
                className="w-full"
                allowsCustomValue={false}
                menuTrigger="input"
                onSelectionChange={handleSelectionChange}
                endContent={
                    <Button isIconOnly size="sm" variant="light" onPress={() => { setIsOpen(!isOpen); }} className="mr-1">
                        <Icon
                            icon={isOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                            className="text-default-500"
                        />
                    </Button>
                }
            >
                {(item) => (
                    <AutocompleteItem key={item.key} textValue={item.label} className="flex items-center gap-2">
                        <div className="flex flex-1 items-center">
                            <span>{item.label}</span>
                            {item.description && (
                                <span className="text-default-400 ml-1 text-xs">({item.description})</span>
                            )}
                        </div>
                        {selectedKeys.has(item.key) && <Icon icon="lucide:check" className="text-primary-500" />}
                    </AutocompleteItem>
                )}
            </Autocomplete>

            {renderSelectedItems()}
        </div>
    );
};
