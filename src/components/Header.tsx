import Image from 'next/image';

export default function Header() {
  return (
    <header className="text-center mb-10">
      <div className="mb-4 bg-black inline-block p-4 rounded-lg">
        <Image
          src="/logo.svg"
          alt="Giuliato&Battistin"
          width={300}
          height={100}
          priority
          className="mx-auto"
        />
      </div>
      <div className="text-gray-600 space-y-1">
        <p>Corso SS. Felice e Fortunato, 29 - 36100 Vicenza (VI) Italy</p>
        <p>
          Tel:{" "}
          <a href="tel:+390444525447" className="text-blue-600 hover:underline">
            +39 0444 525447
          </a>
        </p>
        <div className="space-x-3">
          <a
            href="http://www.giuliatobattistin.it"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            www.giuliatobattistin.it
          </a>
          <span>|</span>
          <a
            href="mailto:info@giuliatobattistin.it"
            className="text-blue-600 hover:underline"
          >
            info@giuliatobattistin.it
          </a>
        </div>
      </div>
    </header>
  );
}