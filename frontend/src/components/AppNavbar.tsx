"use client";
import Link from "next/link";
import { useAuth0 } from '@auth0/auth0-react';
import { LogOut, User, ChevronDown } from "lucide-react";
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
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

export function AppNavbar() {
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

    const navItems = [
        { name: "Home", link: "/", external: false },
        { name: "Form Developer", link: "/form-developer", external: false },
        { name: "Services", link: "/services", external: false },
        { name: "Pricing", link: "/pricing", external: false },
        { name: "Contact", link: "/contact", external: false },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getFirstName = () => {
        if (user?.given_name) return user.given_name.split(' ')[0];
        if (user?.nickname) return user.nickname.split(' ')[0];
        if (user?.name) return user.name.split(' ')[0];
        return "User";
    }

    const handleDropdownAction = (key: React.Key) => {
        if (key === "logout") {
            logout({ logoutParams: { returnTo: window.location.origin } });
        }
    };

    return (
        <div className="sticky top-0 z-40 w-full bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800/50">
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
                                <Dropdown placement="bottom-end">
                                    <DropdownTrigger>
                                        <button
                                            className="hidden sm:flex items-center gap-2 pl-4 border-l border-neutral-800
                                                        cursor-pointer hover:opacity-80 transition-opacity outline-none"
                                        >
                                            {user?.picture ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={user.picture}
                                                    alt={user.name || "User"}
                                                    className="w-8 h-8 rounded-full border border-neutral-700"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800 border-neutral-700">
                                                    <User className="w-4 h-4 text-neutral-400" />
                                                </div>
                                            )}
                                            <span className="text-sm font-medium text-neutral-300">
                                                {getFirstName()}
                                            </span>
                                            <ChevronDown className="w-4 h-4 text-neutral-500" />
                                        </button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="User Actions"
                                        onAction={handleDropdownAction}
                                    >
                                        <DropdownItem
                                            key="profile"
                                            isReadOnly
                                            className="h-14 gap-2 opacity-100 cursor-default focus:!bg-transparent"
                                        >
                                            <div className="flex flex-col">
                                                <p className="text-sm font-semibold text-neutral-200">{getFirstName()}</p>
                                                <p className="text-xs text-neutral-400">{user?.email}</p>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            key="logout"
                                            className="text-red-400 hover:!bg-red-500/10 focus:!bg-red-500/10"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Log out
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </>
                        ) : (
                            <>
                                <NavbarButton variant="secondary" onClick={() => loginWithRedirect()}>Login</NavbarButton>
                                <NavbarButton variant="primary" onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}>Sign Up</NavbarButton>
                            </>
                        )}
                    </div>
                </NavBody>

                {/* Mobile Navigation */}
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
                            <Link
                                key={`mobile-link-${idx}`}
                                href={item.link}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="relative text-neutral-600 dark:text-neutral-300"
                            >
                                <span className="block p-2">{item.name}</span>
                            </Link>
                        ))}

                        <div className="flex w-full flex-col gap-4 border-t border-neutral-700 pt-4">
                            {isLoading ? (
                                <NavbarButton variant="secondary" className="w-full" disabled>Loading...</NavbarButton>
                            ) : isAuthenticated ? (
                                <>
                                    {/* This is the mobile user info section */}
                                    <div className="flex items-center gap-3 px-2 mb-2">
                                        {user?.picture ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={user.picture} alt="User" className="w-10 h-10 rounded-full border border-neutral-700" />
                                        ) : (
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 border-neutral-700">
                                                <User className="w-5 h-5 text-neutral-400" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-neutral-200 font-medium">{user?.name}</p>
                                            <p className="text-xs text-neutral-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <NavbarButton
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                                    >
                                        Log Out
                                    </NavbarButton>
                                </>
                            ) : (
                                <>
                                    <NavbarButton variant="secondary" className="w-full" onClick={() => loginWithRedirect()}>Login</NavbarButton>
                                    <NavbarButton variant="primary" className="w-full" onClick={() => loginWithRedirect()}>Sign Up</NavbarButton>
                                </>
                            )}
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
}