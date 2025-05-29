import Image from "next/image";
import { characters } from "@/app/characters";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <ul className="py-24 grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-16">
        {Object.entries(characters).map(([key, character]) => (
          <li key={key} className="relative">
            <Image
              className="rounded-2xl object-cover aspect-3/2 w-full"
              src={`/characters/${key}.webp`}
              alt="Character Icon"
              width={512}
              height={512}
            />
            <h3 className="mt-6 text-lg/8 font-semibold tracking-tight text-gray-900">
              {character.name}
            </h3>
            <p className="text-base/7 text-gray-600">{character.description}</p>
            <Link className="absolute inset-0" href={`/chat/${key}`} />
          </li>
        ))}
      </ul>
    </div>
  );
}
