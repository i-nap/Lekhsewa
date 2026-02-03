"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth0 } from "@auth0/auth0-react";
import { LogOut, ChevronDown } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
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
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
        useAuth0();
    const { plan } = useUser();
    const isPaidUser = plan && plan !== 'free';

    const navItems = [
        { name: "Home", link: "/", external: false },
        ...(isPaidUser ? [{ name: "Form Developer", link: "/form-developer", external: false }] : []),
        // { name: "Services", link: "/services", external: false },
        { name: "Pricing", link: "/pricing", external: false },
        { name: "Contact", link: "/contact", external: false },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const getFirstName = () => {
        if (user?.given_name) return user.given_name.split(" ")[0];
        if (user?.nickname) return user.nickname.split(" ")[0];
        if (user?.name) return user.name.split(" ")[0];
        return "User";
    };

    const avatarUrl =
        user?.picture ||
        `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
            getFirstName()
        )}`;

    const handleLogout = () => {
        logout({ logoutParams: { returnTo: window.location.origin } });
    };

    return (
        <div className="sticky top-0 z-40 w-full bg-neutral-950/80 backdrop-blur-lg border-b border-neutral-800/50">
            <Navbar>
                <NavBody>
                    <Link href="/" className="flex items-center bg-white rounded-md">
                        <Image
                            src="/Logo.png" 
                            alt="Lekhsewa Logo"
                            width={100}
                            height={100}
                            className="object-contain" 
                            priority 
                        />
                    </Link>
                    <NavItems items={navItems} />
                    <div className="relative flex items-center gap-4">
                        {isLoading ? (
                            <NavbarButton variant="secondary" disabled>
                                Loading...
                            </NavbarButton>
                        ) : isAuthenticated ? (
                            <>
                                {/* DESKTOP USER BUTTON */}
                                <button
                                    type="button"
                                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                                    className="hidden sm:flex items-center gap-2 pl-4 border-l border-neutral-800
                             cursor-pointer hover:opacity-80 transition-opacity outline-none"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={avatarUrl}
                                        alt={getFirstName()}
                                        className="w-8 h-8 rounded-full border border-neutral-700"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                                                getFirstName()
                                            )}`;
                                        }}
                                    />
                                    <span className="text-sm font-medium text-neutral-300 whitespace-nowrap max-w-[120px] truncate">
                                        {getFirstName()}
                                    </span>
                                    {isPaidUser ? (
                                        <span className="text-xs font-medium text-green-400 bg-green-900/30 px-2 py-1 rounded">
                                            Pro
                                        </span>
                                    ) : plan === 'free' ? (
                                        <span className="text-xs font-medium text-gray-400 bg-gray-800/30 px-2 py-1 rounded">
                                            Free
                                        </span>
                                    ) : null}

                                    <ChevronDown
                                        className={`w-4 h-4 text-neutral-500 transition-transform ${isUserMenuOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                {isUserMenuOpen && (
                                    <div
                                        className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-neutral-800 
                               bg-neutral-900 shadow-xl py-2 text-sm"
                                    >
                                        <div className="px-4 py-2 border-b border-neutral-800">
                                            <p className="text-xs text-neutral-500">Signed in as</p>
                                            <p className="text-sm font-semibold text-neutral-200 truncate">
                                                {user?.email || "No email"}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-400 
                                 hover:bg-red-500/10 focus:outline-none"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Log out</span>
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <NavbarButton
                                    variant="secondary"
                                    onClick={() => loginWithRedirect()}
                                >
                                    Login
                                </NavbarButton>
                                <NavbarButton
                                    variant="primary"
                                    onClick={() =>
                                        loginWithRedirect({
                                            authorizationParams: { screen_hint: "signup" },
                                        })
                                    }
                                >
                                    Sign Up
                                </NavbarButton>
                            </>
                        )}
                    </div>
                </NavBody>

                {/* MOBILE NAVIGATION */}
                <MobileNav>
                    <MobileNavHeader>
                    <Link href="/" className="flex items-center bg-white rounded-md">
                        <Image
                            src="/Logo.png" 
                            alt="Lekhsewa Logo"
                            width={80}
                            height={80}
                            className="object-contain" 
                            priority 
                        />
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
                                <NavbarButton
                                    variant="secondary"
                                    className="w-full"
                                    disabled
                                >
                                    Loading...
                                </NavbarButton>
                            ) : isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-3 px-2 mb-2">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={avatarUrl}
                                            alt={getFirstName()}
                                            className="w-10 h-10 rounded-full border border-neutral-700"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
                                                    getFirstName()
                                                )}`;
                                            }}
                                        />
                                        <div>
                                            <p className="text-neutral-200 font-medium">
                                                {getFirstName()}
                                            </p>
                                            {user?.email && (
                                                <p className="text-xs text-neutral-500">
                                                    {user.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <NavbarButton
                                        variant="secondary"
                                        className="w-full"
                                        onClick={handleLogout}
                                    >
                                        Log Out
                                    </NavbarButton>
                                </>
                            ) : (
                                <>
                                    <NavbarButton
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => loginWithRedirect()}
                                    >
                                        Login
                                    </NavbarButton>
                                    <NavbarButton
                                        variant="primary"
                                        className="w-full"
                                        onClick={() => loginWithRedirect()}
                                    >
                                        Sign Up
                                    </NavbarButton>
                                </>
                            )}
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>
        </div>
    );
}
