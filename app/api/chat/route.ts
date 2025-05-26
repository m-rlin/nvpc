import { NextRequest } from "next/server";
import { createDataStreamResponse, streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export const POST = async (request: NextRequest) => {
  const { messages } = await request.json();

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const result = streamText({
        model: anthropic("claude-3-7-sonnet-20250219"),
        system: "",
        messages,
        // experimental_transform:
        //   transform === "sentence"
        //     ? createSentenceTransform
        //     : createWordTransform,
        // onFinish() {
        //   console.log(model);
        // },
        onError({ error }) {
          if (error instanceof Error) {
            console.error("에이전트에서 에러 발생", error);
          }
        },
      });
      result.mergeIntoDataStream(dataStream);
    },
  });
};
