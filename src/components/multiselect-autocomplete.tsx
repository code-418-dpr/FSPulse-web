"use client";

import type { z } from "zod";

import { Controller, useFormContext } from "react-hook-form";

import { AgeGroup } from "@/app/generated/prisma";
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
                            onPress={() => {
                                removeRegion(region.key);
                            }}
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

interface MultiSelectAgeGroupsProps {
    ageGroups: AgeGroup[];
}

export const MultiSelectAgeGroups = ({ ageGroups }: MultiSelectAgeGroupsProps) => {
    const { control, setValue, watch } = useFormContext();
    const selectedAgeGroupKeys: string[] = (watch("ageGroups") as string[] | undefined) ?? [];
    const selectedAgeGroups = ageGroups.filter((group) => selectedAgeGroupKeys.includes(group.id));

    const addAgeGroup = (key: string) => {
        const newSelection = [...selectedAgeGroupKeys, key];
        updateAgeValues(newSelection);
    };

    const removeAgeGroup = (key: string) => {
        const newSelection = selectedAgeGroupKeys.filter((k) => k !== key);
        updateAgeValues(newSelection);
    };

    const updateAgeValues = (keys: string[]) => {
        const selectedGroups = ageGroups.filter((g) => keys.includes(g.id));
        const minAge = Math.min(...selectedGroups.map((g) => g.minAge));
        const maxAge = Math.max(...selectedGroups.map((g) => g.maxAge ?? g.minAge));

        setValue("ageGroups", keys);
        setValue("minAge", minAge);
        setValue("maxAge", maxAge);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
                {selectedAgeGroups.map((group) => (
                    <div
                        key={`selected-${group.id}`}
                        className="bg-default-100 flex items-center rounded-full px-3 py-1"
                    >
                        <span>{group.name}</span>
                        <Button
                            type="button"
                            size="sm"
                            variant="light"
                            className="text-danger-500 ml-2"
                            onPress={() => {
                                removeAgeGroup(group.id);
                            }}
                        >
                            ×
                        </Button>
                    </div>
                ))}
            </div>

            <Controller
                name="ageGroups"
                control={control}
                render={() => (
                    <Autocomplete
                        label={selectedAgeGroups.length === 0 ? "Возрастные категории" : "Добавить категорию"}
                        defaultItems={ageGroups.filter((g) => !selectedAgeGroupKeys.includes(g.id))}
                        selectedKey={null}
                        onSelectionChange={(key) => {
                            if (key) {
                                addAgeGroup(key as string);
                            }
                        }}
                        allowsCustomValue={false}
                    >
                        {(group) => (
                            <AutocompleteItem key={group.id}>
                                {group.name} ({group.minAge}-{group.maxAge ?? "+"})
                            </AutocompleteItem>
                        )}
                    </Autocomplete>
                )}
            />
        </div>
    );
};
