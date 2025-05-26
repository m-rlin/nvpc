import Image from "next/image";
import { characters } from "@/app/characters";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-md">
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(characters).map(([key]) => (
          <div key={key} className="relative">
            <Image
              src={`/characters/${key}.webp`}
              alt="Character Icon"
              width={512}
              height={512}
            />
            <Link className="absolute inset-0" href={`/chat/${key}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
