import React, {
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Button, Textarea } from "@headlessui/react";
import { cn } from "@/utils/helpers";
import { ArrowUpIcon } from "@heroicons/react/16/solid";

export type ChatTextareaRef = {
  submit: () => void;
};

const useAdjustHeight = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
    }
  }, []);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
    }
  };

  return { textareaRef, adjustHeight };
};

export const ChatTextarea = React.forwardRef(function ChatTextarea(
  {
    value,
    onChange,
    onSubmit,
  }: {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit: () => void;
  },
  ref: ForwardedRef<ChatTextareaRef>,
) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { textareaRef, adjustHeight } = useAdjustHeight();

  useImperativeHandle(ref, () => ({
    submit: () => {
      buttonRef.current?.click();
    },
  }));

  return (
    <div className="relative w-full">
      <Textarea
        rows={3}
        ref={textareaRef}
        className={cn(
          "flex w-full rounded-md border border-zinc-200 bg-zinc-100 px-3 py-2 text-base placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "max-h-[calc(75dvh)] min-h-[24px] resize-none overflow-hidden rounded-2xl !text-base",
        )}
        value={value}
        onChange={(event) => {
          onChange(event);
          adjustHeight();
        }}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault();
            onSubmit();
          }
        }}
        placeholder="여보세요?"
      />
      <Button
        ref={buttonRef}
        className="absolute right-2 bottom-2 flex w-fit flex-row justify-end rounded-full bg-zinc-900 p-1 text-white hover:cursor-pointer disabled:cursor-auto disabled:opacity-50"
        disabled={value.length === 0}
        type="submit"
      >
        <ArrowUpIcon className="size-5" />
      </Button>
    </div>
  );
});
