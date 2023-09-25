import Link from "next/link";

function MainHeader() {
  return (
    <header className="bg-gray-700 text-white p-6 flex justify-between w-full h-20 items-baseline">
      <div>
        <Link
          href="/"
          className="uppercase font-bold tracking-widest cursor-pointer hover:text-gray-300 text-lg"
        >
          Pokéstop
        </Link>
      </div>
      <nav>
        <ul className="flex gap-8">
          <li>
            <Link
              href="/pokedex"
              className="font-bold cursor-pointer hover:text-gray-300"
            >
              Pokedex
            </Link>
          </li>
          <li>
            <Link
              href="/trainer-guess"
              className="font-bold cursor-pointer hover:text-gray-300"
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
