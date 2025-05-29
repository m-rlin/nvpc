import React, { ForwardedRef, forwardRef, useImperativeHandle } from "react";
import { Message } from "@ai-sdk/react";
import { cn } from "@/utils/helpers";
import { useScrollToBottom } from "@/app/chat/[id]/use-scroll-to-bottom";
import Image from "next/image";
import { CharacterId } from "@/app/characters";

export type ChatMessagesRef = {
  scrollToBottom: () => void;
};

export const ChatMessages = forwardRef(function ChatMessages(
  {
    id,
    className,
    messages,
  }: {
    id: CharacterId;
    className?: string;
    messages: Message[];
  },
  ref: ForwardedRef<ChatMessagesRef>,
) {
  const [messagesContainerRef, messagesEndRef, scrollToBottom] =
    useScrollToBottom();

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      scrollToBottom();
    },
  }));

  return (
    <div
      ref={messagesContainerRef}
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-4",
        className,
      )}
    >
      {messages.map((message) => (
        <ChatMessage key={message.id} id={id} message={message} />
      ))}
      <div
        ref={messagesEndRef}
        className="min-h-[60px] min-w-[24px] shrink-0"
      />
    </div>
  );
});

const ChatMessage = ({
  id,
  message,
}: {
  id: CharacterId;
  message: Message;
}) => {
  return (
    <div
      className="group/message mx-auto w-full max-w-3xl px-4"
      data-role={message.role}
    >
      <div className="flex w-full gap-4 group-data-[role=user]/message:ml-auto group-data-[role=user]/message:w-fit group-data-[role=user]/message:max-w-2xl">
        <Image
          className="size-16 rounded-xl group-data-[role=user]/message:hidden"
          src={`/characters/${id}.webp`}
          alt="Character Thumbnail"
          width={512}
          height={512}
        />
        <div className="flex w-full flex-col gap-4">
          {message.parts?.map((part, index) => {
            const key = `${message.id}-${index}`;
            if (part.type === "text") {
              return (
                <div key={key} className="flex flex-row items-start gap-2">
                  <div
                    className={cn(
                      "flex flex-col gap-4",
                      message.role === "user" &&
                        "rounded-xl bg-zinc-900 px-3 py-2 text-white",
                    )}
                  >
                    {part.text}
                  </div>
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};
