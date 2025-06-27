"use client";

import { useRef } from "react";
import { ChatTextarea, ChatTextareaRef } from "@/app/chat/[id]/chat-textarea";
import { useChat } from "@ai-sdk/react";
import { ChatMessages } from "@/app/chat/[id]/chat-messages";
import { CharacterId, characters } from "@/app/characters";
import { Button } from "@headlessui/react";
import { cn } from "@/utils/helpers";

export const Chat = ({ id }: { id: CharacterId }) => {
  const character = characters[id];
  const ref = useRef<ChatTextareaRef>(null);
  const selectedQuestionsRef = useRef(new Set<string>());

  const { messages, input, handleInputChange, handleSubmit, append, status } =
    useChat({
      initialMessages: [
        {
          id: "init-user-message",
          role: "user",
          content: "안녕하세요?",
        },
        {
          id: "init-assistant-message",
          role: "assistant",
          content: character.firstMessage,
        },
      ],
      body: {
        id,
      },
      onError: (error) => {
        console.error(error);
      },
    });

  return (
    <div className="flex h-dvh min-w-0 flex-col">
      <ChatMessages
        id={id}
        messages={messages}
        isLoading={status === "submitted"}
      />
      <form
        className="mx-auto flex w-full gap-2 px-4 pb-4 md:max-w-3xl md:pb-6"
        onSubmit={handleSubmit}
      >
        <div className="relative flex w-full flex-col gap-2">
          <div className="grid w-full gap-2 sm:grid-cols-2">
            {character.suggestedQuestions
              .filter((question) => !selectedQuestionsRef.current.has(question))
              .map((question, index) => (
                <Button
                  disabled={status !== "ready"}
                  onClick={async () => {
                    selectedQuestionsRef.current.add(question);
                    await append({
                      role: "user",
                      content: question,
                    });
                  }}
                  className={cn(
                    "h-20 rounded-xl border border-zinc-200 px-4 py-3.5 text-left text-sm",
                    "hover:cursor-pointer hover:bg-zinc-100 sm:flex-col",
                    "disabled:cursor-default disabled:text-zinc-500 disabled:hover:bg-white",
                    index > 1 ? "hidden sm:block" : "block",
                  )}
                  key={index}
                >
                  <span className="font-medium">{question}</span>
                </Button>
              ))}
          </div>
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
