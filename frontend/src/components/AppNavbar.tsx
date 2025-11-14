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
import { useAuth0 } from "@auth0/auth0-react";

export function AppNavbar() {

    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

    const navItems = [
        { name: "Home", link: "/", external: false },
        { name: "Form Developer", link: "/form-developer", external: false },
        { name: "Pricing", link: "/pricing", external: false },
        { name: "Services", link: "/services", external: false },
        { name: "Contact", link: "/contact", external: false },
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
                        {isLoading ? (
                            <NavbarButton variant="secondary" disabled>Loading...</NavbarButton>
                        ) : isAuthenticated ? (
                            <>
                                <span className="text-sm text-neutral-400 hidden sm:block">
                                    {user?.name || user?.email}
                                </span>
                                <NavbarButton
                                    variant="secondary"
                                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                >
                                    Log Out
                                </NavbarButton>
                            </>
                        ) : (
                            <>
                                <NavbarButton variant="secondary" onClick={() => loginWithRedirect()}>Login</NavbarButton>
                                <NavbarButton variant="primary" onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}>Sign Up</NavbarButton>
                            </>
                        )}
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
                                target={item.external ? "_blank" : "_self"}
                                rel={item.external ? "noopener noreferrer" : ""}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-neutral-600 dark:text-neutral-300"
                            >
                                <span className="block p-2">{item.name}</span>
                            </a>
                        ))}
                        <div className="flex w-full flex-col gap-4 border-t border-neutral-700 pt-4">
                            {isLoading ? (
                                <NavbarButton variant="secondary" className="w-full" disabled>Loading...</NavbarButton>
                            ) : isAuthenticated ? (
                                <NavbarButton
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                >
                                    Log Out
                                </NavbarButton>
                            ) : (
                                <>
                                    <NavbarButton variant="secondary" className="w-full" onClick={() => loginWithRedirect()}>Login</NavbarButton>
                                    <NavbarButton variant="primary" className="w-full" onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}>Sign Up</NavbarButton>
                                </>
                            )}
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
}