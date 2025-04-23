"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, AutocompleteItem, Button } from "@heroui/react";
import { competitionRequestSchema } from "@/schemas/competition-request-schema";

interface RegionItem {
    key: string;
    label: string;
}

export const MultiSelectAutocomplete = ({
                                             regions,
                                         }: {
    regions: RegionItem[];
}) => {
    const { control, setValue, watch } = useFormContext<competitionRequestSchema>();
    const selectedRegionKeys = watch("regions") || [];

    const selectedRegions = selectedRegionKeys
        .map((key: string) => regions.find(r => r.key === key))
        .filter(Boolean) as RegionItem[];

    const addRegion = (key: string) => {
        if (!selectedRegionKeys.includes(key)) {
            setValue("regions", [...selectedRegionKeys, key]);
        }
    };

    const removeRegion = (key: string) => {
        setValue(
            "regions",
            selectedRegionKeys.filter(k => k !== key)
        );
    };

    return (
        <div className="space-y-4">
            {/* Отображение выбранных регионов */}
            <div className="flex flex-wrap gap-2">
                {selectedRegions.map((region) => (
                    <div key={`selected-${region.key}`} className="flex items-center bg-default-100 px-3 py-1 rounded-full">
                        <span>{region.label}</span>
                        <Button
                            type="button"
                            size="sm"
                            variant="light"
                            className="ml-2 text-danger-500"
                            onPress={() => removeRegion(region.key)}
                        >
                            ×
                        </Button>
                    </div>
                ))}
            </div>

            {/* Autocomplete для добавления новых регионов */}
            <Controller
                name="regionInput"
                control={control}
                render={({ field }) => (
                    <Autocomplete
                        label={selectedRegions.length === 0 ? "Регион" : "Добавить еще регион"}
                        defaultItems={regions.filter(r => !selectedRegionKeys.includes(r.key))}
                        selectedKey={field.value}
                        onSelectionChange={(key) => {
                            if (key) {
                                addRegion(key as string);
                                field.onChange(null); // Сбрасываем значение после выбора
                            }
                        }}
                        allowsCustomValue={false}
                    >
                        {(region) => <AutocompleteItem key={region.key}>{region.label}</AutocompleteItem>}
                    </Autocomplete>
                )}
            />
        </div>
    );
};