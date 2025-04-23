"use client";

import type { z } from "zod";

import { Controller, useFormContext } from "react-hook-form";

import type { competitionRequestSchema } from "@/schemas/competition-request-schema";
import { Autocomplete, AutocompleteItem, Button } from "@heroui/react";

type CompetitionRequest = z.infer<typeof competitionRequestSchema>;

interface RegionItem {
    key: string;
    label: string;
}

export const MultiSelectAutocomplete = ({ regions }: { regions: RegionItem[] }) => {
    const { control, setValue, watch } = useFormContext<CompetitionRequest>();

    const selectedRegionKeys: string[] = watch("regions");

    const selectedRegions = regions.filter((region): region is RegionItem => selectedRegionKeys.includes(region.key));

    const addRegion = (key: string) => {
        if (!selectedRegionKeys.includes(key)) {
            setValue("regions", [...selectedRegionKeys, key]);
        }
    };

    const removeRegion = (key: string) => {
        setValue(
            "regions",
            selectedRegionKeys.filter((k) => k !== key),
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {selectedRegions.map((region) => (
                    <div
                        key={`selected-${region.key}`}
                        className="bg-default-100 flex items-center rounded-full px-3 py-1"
                    >
                        <span>{region.label}</span>
                        <Button
                            type="button"
                            size="sm"
                            variant="light"
                            className="text-danger-500 ml-2"
                            onPress={() => { removeRegion(region.key); }}
                        >
                            ×
                        </Button>
                    </div>
                ))}
            </div>

            <Controller
                name="regions"
                control={control}
                render={() => (
                    <Autocomplete
                        label={selectedRegions.length === 0 ? "Регион" : "Добавить еще регион"}
                        defaultItems={regions.filter((region) => !selectedRegionKeys.includes(region.key))}
                        selectedKey={null}
                        onSelectionChange={(key) => {
                            if (key) {
                                addRegion(key as string);
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
