"use client";

import { useRef } from "react";
import { ChatTextarea, ChatTextareaRef } from "@/app/chat/[id]/chat-textarea";
import { useChat } from "@ai-sdk/react";
import { ChatMessages } from "@/app/chat/[id]/chat-messages";
import { CharacterId, characters } from "@/app/characters";
import { Button } from "@headlessui/react";

export const Chat = ({ id }: { id: CharacterId }) => {
  const character = characters[id];
  const ref = useRef<ChatTextareaRef>(null);

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
          {messages.length === 2 && (
            <div className="grid w-full gap-2 sm:grid-cols-2">
              {character.suggestedQuestions.map((question, index) => (
                <div
                  // initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // exit={{ opacity: 0, y: 20 }}
                  // transition={{ delay: 0.05 * index }}
                  key={index}
                  className={index > 1 ? "hidden sm:block" : "block"}
                >
                  <Button
                    onClick={async () => {
                      await append({
                        role: "user",
                        content: question,
                      });
                    }}
                    className="w-full flex-1 items-start justify-start gap-1 rounded-xl border px-4 py-3.5 text-left text-sm hover:bg-zinc-100 sm:flex-col"
                  >
                    <span className="font-medium">{question}</span>
                    {/*<span className="text-zinc-500">*/}
                    {/*  {suggestedAction.label}*/}
                    {/*</span>*/}
                  </Button>
                </div>
              ))}
            </div>
          )}
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
