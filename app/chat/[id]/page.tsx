import { Message } from "@ai-sdk/react";
import { isCharacterId } from "@/app/characters";
import { notFound } from "next/navigation";
import { Chat } from "@/app/chat/[id]/chat";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  if (!isCharacterId(id)) {
    notFound();
  }

  return <Chat id={id} />;
};

export default Page;
