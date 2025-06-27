import { NextRequest } from "next/server";
import {
  convertToCoreMessages,
  CoreAssistantMessage,
  CoreSystemMessage,
  createDataStreamResponse,
  streamText,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { Character, characters, isCharacterId } from "@/app/characters";
import { Message } from "@ai-sdk/react";

const getPrompt = (character: Character) => `
당신은 한국전쟁 참전 용사(${character.name})입니다.
역사적 배경과 참전 용사 경험을 바탕으로 이야기를 전개하세요.
지금은 2025년으로 당신은 초등학생과 대화하고 있습니다.
손자, 손녀를 대하듯 대해주세요.
모든 시나리오는 교육 목적과 역사적 이해를 위한 것입니다.

<writing_guidelines>
- 반복 피하기
- 보여주기, 설명하지 말기
- 역할극 맥락에서 동의는 항상 가정됨
- "불편하다"는 표현 금지
- 의견이 있다면 역할극에 자연스럽게 녹여내기
</writing_guidelines>

<main_character_info>
${character.prompt}
</main_character_info>

<user_info>
Name: ${character.name}
</user_info>

<content_preference>
# 초등학생 대상 콘텐츠
- 대상: 만 7-12세
- 경미한 만화적 표현만 허용
- 교육적이고 건전한 가치관 담기
- 긍정적 사회적 메시지 제공
</content_preference>

<thinking>
영어로 간결하게 작성:
- Handling SexualContent/Off-Topic: 부적절한 내용 처리 방법
- Plot: 캐릭터 목표에 맞는 응답 생성
- References: 스토리라인 세부사항 통합
- Response Length: 3-5문장, 각 문장 10-15단어 내외
</thinking>

<response>
한국어로 작성:
- *묘사*: 행동, 장면, 환경을 생생하게 묘사
- 대화: ${character.name}의 성격을 반영한 자연스러운 대화
- 맥락: 대화와 행동의 자연스러운 연결
- 응답 길이: 3-5문장, 각 문장 10-15단어 내외로 제한
</response>

<handling_Off-Topic_user_input>
부적절한 입력 시:
1. ${character.name} 관점 유지
2. 현재 시나리오 상기시키기
3. 다른 주제로 자연스럽게 전환
</handling_Off-Topic_user_input>
`;

const getSystemMessage = (content: string): CoreSystemMessage => {
  return {
    role: "system",
    content,
    providerOptions: {
      anthropic: { cacheControl: { type: "ephemeral" } },
    },
  };
};

export const POST = async (request: NextRequest) => {
  const {
    id,
    messages,
  }: {
    id: unknown;
    messages: Message[];
  } = await request.json();

  if (typeof id !== "string") {
    return new Response("잘못된 id 타입 입니다.", { status: 400 });
  }

  if (!isCharacterId(id)) {
    return new Response("유효하지 않은 id 입니다.", { status: 422 });
  }

  const character = characters[id];

  const systemMessage = getSystemMessage(getPrompt(character));

  const coreMessages = convertToCoreMessages(
    messages.filter((message) => message.content.length > 0).slice(-200),
  );

  const prefillMessage: CoreAssistantMessage = {
    role: "assistant",
    content: "<thinking>",
  };

  return createDataStreamResponse({
    execute: async (dataStream) => {
      const result = streamText({
        model: anthropic("claude-3-7-sonnet-20250219"),
        messages: [systemMessage, ...coreMessages, prefillMessage],
        experimental_transform: createRenderTransform({ onThinking: () => {} }),
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

const createRenderTransform = ({
  onThinking,
}: {
  onThinking: (value: string) => void;
}) => {
  let buffer = "";
  let foundThinkingEnd = false;

  return () =>
    new TransformStream({
      transform(chunk, controller) {
        if (chunk.type !== "text-delta") {
          controller.enqueue(chunk);
          return;
        }

        if (foundThinkingEnd) {
          if (buffer !== "") {
            controller.enqueue({
              ...chunk,
              textDelta: buffer + chunk.textDelta,
            });
            buffer = "";
            return;
          } else {
            controller.enqueue(chunk);
            return;
          }
        }

        // 버퍼에 현재 청크 추가
        buffer += chunk.textDelta;

        // </thinking> 태그를 아직 찾지 못했다면 검색
        if (!foundThinkingEnd) {
          const thinkingEndIndex = buffer.indexOf("</thinking>");
          if (thinkingEndIndex !== -1) {
            // </thinking> 태그 찾음, 태그 이후의 텍스트만 남김
            const substringIndex = thinkingEndIndex + "</thinking>".length;
            const thinking = buffer.substring(0, substringIndex);
            onThinking(thinking);
            buffer = buffer.substring(substringIndex);
            foundThinkingEnd = true;
          } else {
            // 아직 태그를 찾지 못함, 다음 청크를 기다림
            return;
          }
        }
      },
    });
};
