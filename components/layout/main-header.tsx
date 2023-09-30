import Image from "next/image";
import Link from "next/link";

function MainHeader() {
  return (
    <header className="bg-gray-700 text-white p-6 flex justify-between w-full h-20 items-center fixed z-10">
      <div>
        <Link
          href="/"
          className="uppercase font-bold tracking-widest cursor-pointer hover:text-gray-300 text-lg"
        >
          <div className="flex gap-3 items-center">
            <Image src="/pokeball.png" alt="pokeball" width="28" height="28" />
            <div className="text-xl">Pokéstop</div>
          </div>
        </Link>
      </div>
      <nav>
        <ul className="flex gap-8 items-center justify-center">
          <li>
            <Link
              href="/showcase"
              className="font-bold cursor-pointer hover:text-gray-300 uppercase"
            >
              Showcase
            </Link>
          </li>
          <li>
            <Link
              href="/matching"
              className="font-bold cursor-pointer hover:text-gray-300 uppercase"
            >
              Matching
            </Link>
          </li>
          <li>
            <Link
              href="/pokedex"
              className="font-bold cursor-pointer hover:text-gray-300 uppercase"
            >
              Pokedex
            </Link>
          </li>
          <li>
            <Link
              href="/trainer-guess"
              className="font-bold cursor-pointer hover:text-gray-300 uppercase"
            >
              Trainer Guess
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainHeader;
