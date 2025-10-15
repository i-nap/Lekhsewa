"use client";
import Link from "next/link";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";

export function AppNavbar() {
    const navItems = [
        { name: "Home", link: "/", external: false },
        { name: "About", link: "/about", external: false },
        { name: "Services", link: "/services", external: false },
        { name: "Contact US", link: "/contact-us", external: false },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="sticky top-0 z-50 w-full">
            <Navbar>
                <NavBody>
                    <Link href="/" className="flex items-center">
                        <span className="text-xl font-bold">Lekhsewa</span>
                    </Link>

                    <NavItems items={navItems} />
                    <div className="flex items-center gap-4">
                        <NavbarButton variant="secondary">Login</NavbarButton>
                        <NavbarButton variant="primary">Sign Up</NavbarButton>
                    </div>
                </NavBody>

                <MobileNav>
                    <MobileNavHeader>
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold">Lekhsewa</span>
                        </Link>

                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </MobileNavHeader>

                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        {navItems.map((item, idx) => (
                            <a
                                key={`mobile-link-${idx}`}
                                href={item.link}
                                // This logic correctly handles links without the 'external' property
                                target={item.external ? "_blank" : "_self"}
                                rel={item.external ? "noopener noreferrer" : ""}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-neutral-600 dark:text-neutral-300"
                            >
                                <span className="block p-2">{item.name}</span>
                            </a>
                        ))}
                        <div className="flex w-full flex-col gap-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                            <NavbarButton
                                onClick={() => setIsMobileMenuOpen(false)}
                                variant="secondary"
                                className="w-full"
                            >
                                Login
                            </NavbarButton>
                            <NavbarButton
                                onClick={() => setIsMobileMenuOpen(false)}
                                variant="primary"
                                className="w-full"
                            >
                                Sign Up
                            </NavbarButton>
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
}