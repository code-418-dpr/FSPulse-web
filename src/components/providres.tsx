"use client";

import React from "react";

import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { HeroUIProvider } from "@heroui/system";

export interface ProvidersProps {
    children: React.ReactNode;
    themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
    return (
        <HeroUIProvider locale="ru-RU">
            <NextThemesProvider attribute="class" {...themeProps}>
                {children}
            </NextThemesProvider>
        </HeroUIProvider>
    );
}
