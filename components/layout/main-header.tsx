import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/showcase", label: "Showcase", emoji: "✨" },
  { href: "/pokedex", label: "Pokédex", emoji: "📖" },
  { href: "/matching", label: "Matching", emoji: "🎴" },
  { href: "/trainer-guess", label: "Who's That?", emoji: "❓" },
  { href: "/wordsearch", label: "Word Search", emoji: "🔍" },
];

function MainHeader() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#1a1b2e]/90 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Image
              src="/pokeball.png"
              alt="pokeball"
              width={28}
              height={28}
              className="group-hover:animate-spin-slow transition-transform"
            />
          </div>
          <span className="text-lg font-bold tracking-wide text-white">
            Pokéstop
            <span className="text-[var(--color-accent)] ml-1">Arcade</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[var(--color-accent)] text-white"
                        : "text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="mr-1.5">{item.emoji}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-white/5 bg-[#1a1b2e]/95 backdrop-blur-md">
          <ul className="p-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = router.pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[var(--color-accent)] text-white"
                        : "text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="mr-2">{item.emoji}</span>
                    {item.label}
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
