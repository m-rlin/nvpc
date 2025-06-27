import Image from "next/image";
import { characters } from "@/app/characters";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-24">
      <ul className="grid grid-cols-2 gap-x-8 gap-y-16 lg:grid-cols-3">
        {Object.entries(characters).map(([key, character]) => (
          <li key={key} className="relative">
            <Image
              className="aspect-3/2 w-full rounded-2xl object-cover"
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
      <Link
        href="/test"
        className="mt-24 flex w-fit items-center rounded-full bg-zinc-950 px-6 py-4 text-white"
      >
        공감점수 확인하기
      </Link>
    </div>
  );
}
