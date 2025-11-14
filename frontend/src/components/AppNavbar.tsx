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
import { User } from "lucide-react";

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
        <div className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800/50sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800/50">
            <Navbar>
                {/* Desktop Navigation */}
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
                                <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-neutral-800">
                                    {user?.picture ? (
                                        <img
                                            src={user.picture}
                                            alt={user.name || "User"}
                                            className="w-8 h-8 rounded-full border border-neutral-700"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700">
                                            <User className="w-4 h-4 text-neutral-400" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-neutral-300">
                                        {user?.given_name || user?.nickname || user?.name?.split(' ')[0]}
                                    </span>
                                </div>
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
                                    <div className="flex items-center gap-3 px-2 mb-2">
                                        {user?.picture ? (
                                            <img src={user.picture} alt="User" className="w-10 h-10 rounded-full border border-neutral-700" />
                                        ) : (
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700">
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