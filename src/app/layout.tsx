import React, { Suspense } from "react";

import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";

import Loading from "@/app/loading";
import AuthProvider from "@/components/auth-provider";
import { Providers } from "@/components/providres";
import siteMetadata from "@/conf/site-metadata";

import "../globals.css";

export const metadata: Metadata = {
    title: { default: siteMetadata.name, template: `%s | ${siteMetadata.name}` },
    applicationName: siteMetadata.name,
    description: siteMetadata.description,
    authors: [siteMetadata.authors],
    // icons: [{ url: siteMetadata.appIcon.src, sizes: siteMetadata.appIcon.sizes }],
};

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession();

    return (
        <html lang="ru" suppressHydrationWarning>
            <body className={inter.className}>
                <AuthProvider session={session}>
                    <Suspense fallback={<Loading />}>
                        <Providers>{children}</Providers>
                    </Suspense>
                </AuthProvider>
            </body>
        </html>
    );
}
