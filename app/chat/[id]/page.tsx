"use client";

import { Message, useChat } from "@ai-sdk/react";
import { ChatMessages } from "@/app/chat/[id]/chat-messages";
import { ChatTextarea, ChatTextareaRef } from "@/app/chat/[id]/chat-textarea";
import { useRef } from "react";

const initialMessages: Message[] = [
  {
    id: "init-user-message",
    role: "user",
    content: "안녕하세요?",
  },
  {
    id: "init-assistant-message",
    role: "assistant",
    content: "안녕하세요.",
  },
];

const Page = () => {
  const ref = useRef<ChatTextareaRef>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages,
    onError: (error) => {
      console.error(error);
    },
  });

  return (
    <div className="flex h-dvh min-w-0 flex-col">
      <ChatMessages messages={messages} />
      <form
        className="mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-3xl md:pb-6"
        onSubmit={handleSubmit}
      >
        <div className="relative flex w-full flex-col gap-2">
          <ChatTextarea
            ref={ref}
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
};

export default Page;
