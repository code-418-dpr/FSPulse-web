import AuthDialogOrDrawer from "@/components/auth/auth-modal-or-drawer";
import { Image, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";

import { ThemeSwitcher } from "./theme-switcher";

const NavbarElement = () => {
    return (
        <Navbar maxWidth="xl" isBordered>
            <NavbarBrand>
                <Image src="/images/FSPLogo.svg" alt="FSPulse Logo" className="h-8 w-8" />
                <p className="ml-2 text-2xl font-bold">FSPulse</p>
            </NavbarBrand>

            <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        Features
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="#">
                        About
                    </Link>
                </NavbarItem>
            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem>
                    <AuthDialogOrDrawer />
                </NavbarItem>
                <NavbarItem>
                    <ThemeSwitcher />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};

export default NavbarElement;
