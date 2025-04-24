"use client";

import { AthleteItem } from "@/types";
import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

interface Props {
    athlete: AthleteItem;
}

export default function TeamDetails({ athlete }: Props) {
    return (
        <>
            <h3 className="text-2xl font-bold">
                {athlete.lastname} {athlete.firstname} {athlete.middlename ?? ""}
            </h3>
            <div className="grid grid-cols-1 space-y-2">
                {/* Email */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left">Email:</p>
                    <p className="pt-1 text-right">{athlete.email}</p>
                </div>
                {/* PhoneNumber */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left">Телефон:</p>
                    <p className="pt-1 text-right">{athlete.phoneNumber}</p>
                </div>
                {/* Region */}
                <div className="grid grid-cols-3 space-y-2">
                    <p className="pt-1 text-left">Регион:</p>
                    <Chip
                        startContent={
                            <span className="flex items-center">
                                <Icon icon="iconoir:map-pin" width={18} height={18} className="mr-1" />
                            </span>
                        }
                        className="col-span-2 place-self-end"
                        color="success"
                        variant="bordered"
                    >
                        {athlete.region}
                    </Chip>
                </div>
                {/* Birthday */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left">Дата рождения:</p>
                    <p className="pt-1 text-right">{athlete.birthday}</p>
                </div>
                {/* Membership */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left">Статус:</p>
                    <Chip
                        className="place-self-end"
                        color={
                            athlete.membership === "MAIN"
                                ? "primary"
                                : athlete.membership === "RESERVE"
                                    ? "secondary"
                                    : athlete.membership === "NONE"
                                        ? "warning"
                                        : "danger"
                        }
                        variant="bordered"
                    >
                        {athlete.membership === "MAIN"
                            ? "Основной состав"
                            : athlete.membership === "RESERVE"
                                ? "Резервный состав"
                                : athlete.membership === "NONE"
                                    ? "Не член сборной"
                                    : "Неизвестно"}
                    </Chip>
                </div>
                {/* SportCategory */}
                <div className="grid grid-cols-2 space-y-2">
                    <p className="pt-1 text-left">Спортивный разряд:</p>
                    <Chip className="place-self-end" color="primary" variant="bordered">
                        {athlete.sportCategory}
                    </Chip>
                </div>
                {/* About */}
                <div className="grid grid-cols-1 space-y-2">
                    <p className="pt-1">О себе:</p>
                    <p className="pt-1">{athlete.about}</p>
                </div>
                {/* About */}
                <div className="mt-4 grid grid-cols-3 space-y-2">
                    <p className="pt-1 text-left">Навыки:</p>
                    <div className="col-span-2 pt-1 text-right">
                        {athlete.skills.map((skill, index) => {
                            return (
                                <Chip key={`skill-${index + 1}`} color="primary" className="m-1" variant="bordered">
                                    {skill}
                                </Chip>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
