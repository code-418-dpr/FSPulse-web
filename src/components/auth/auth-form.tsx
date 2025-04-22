"use client";

import React from "react";

import SignInForm from "@/components/auth/signin-form";
import SpokesmanSignupForm from "@/components/auth/spokesman-signup-form";
import UserSignupForm from "@/components/auth/user-signup-form";
import { Button, DropdownMenuProps } from "@heroui/react";
import { Tab, Tabs } from "@heroui/react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";

export default function AuthForm() {
    return (
        <Tabs aria-label="RegisterForms" className="w-full" fullWidth>
            <Tab key="user" title="Вход">
                <SignInForm />
            </Tab>
            <Tab key="volunteer" title="Регистрация">
                <Register />
            </Tab>
        </Tabs>
    );
}

function Register() {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(new Set(["Спортсмен"]));

    const selectedValue = React.useMemo(() => Array.from(selectedKeys).join(", ").replace(/_/g, ""), [selectedKeys]);

    const handleSelectionChange: DropdownMenuProps["onSelectionChange"] = (keys) => {
        if (keys === "all") {
            setSelectedKeys(new Set(["Спортсмен", "Представитель"]));
        } else {
            const stringKeys = new Set<string>();
            (keys as Set<string>).forEach((key) => {
                stringKeys.add(key);
            });
            setSelectedKeys(stringKeys);
        }
    };

    return (
        <>
            <div className="my-4 flex justify-center">
                <Dropdown shouldBlockScroll={false}>
                    <DropdownTrigger>
                        <Button className="capitalize" variant="bordered">
                            {selectedValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        disallowEmptySelection
                        aria-label="Single selection example"
                        selectedKeys={selectedKeys}
                        selectionMode="single"
                        variant="flat"
                        onSelectionChange={handleSelectionChange}
                    >
                        <DropdownItem key="Спортсмен">Спортсмен</DropdownItem>
                        <DropdownItem key="Представитель">Представитель</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            {selectedValue === "Спортсмен" ? <UserSignupForm /> : <SpokesmanSignupForm />}
        </>
    );
}
