import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";

import { ThemeSwitcher } from "./theme-switcher";

const NavbarElement = () => {
    return (
        <Navbar maxWidth="xl" isBordered>
            <NavbarBrand>
                <Icon icon="lucide:layout-dashboard" className="text-2xl" />
                <p className="ml-2 font-bold text-inherit">Project Name</p>
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
                    <Button color="primary" variant="flat" startContent={<Icon icon="lucide:user" />}>
                        Login
                    </Button>
                </NavbarItem>
                <NavbarItem>
                    <ThemeSwitcher />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};

export default NavbarElement;
