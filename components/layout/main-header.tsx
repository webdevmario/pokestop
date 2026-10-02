import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { GAME_ROUTES } from "@/lib/games";

function MainHeader() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClasses = (isActive: boolean) =>
    cn(
      "flex items-center gap-1.5 rounded-control px-3 py-1.5 text-sm font-medium",
      "transition-[background-color,color] duration-200",
      isActive
        ? "bg-primary text-white"
        : "text-text-muted hover:bg-border/5 hover:text-text"
    );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/5 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <Image
            src="/pokeball.png"
            alt=""
            width={28}
            height={28}
            className="group-hover:animate-spin-slow"
          />
          <span className="text-lg font-bold tracking-wide text-text">
            Pokéstop<span className="ml-1 text-primary">Arcade</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-1">
            {GAME_ROUTES.map(({ href, navLabel, icon: Icon }) => {
              const isActive = router.pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={linkClasses(isActive)}
                  >
                    <Icon aria-hidden className="h-4 w-4" />
                    {navLabel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="p-2 text-text md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? (
            <X aria-hidden className="h-6 w-6" />
          ) : (
            <Menu aria-hidden className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="border-t border-border/5 bg-bg/95 backdrop-blur-md md:hidden">
          <ul className="space-y-1 p-4">
            {GAME_ROUTES.map(({ href, navLabel, icon: Icon }) => {
              const isActive = router.pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={cn(linkClasses(isActive), "px-4 py-2.5")}
                  >
                    <Icon aria-hidden className="mr-1 h-4 w-4" />
                    {navLabel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}

export default MainHeader;
