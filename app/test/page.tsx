"use client";

import { ProgressBar } from "@/app/test/progress-bar";
import data from "./data.json";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import useSWRImmutable from "swr/immutable";
import { Button } from "@headlessui/react";

const useCurrentHash = () => {
  const router = useRouter();
  const { data: currentHash, mutate } = useSWRImmutable<string>("hash", null);

  const setCurrentHash = useCallback(
    (href: string) => {
      router.replace(href);
      void mutate(href);
    },
    [mutate, router],
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    setCurrentHash(window.location.hash);

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [setCurrentHash]);

  return [currentHash, setCurrentHash] as const;
};

const Page = () => {
  const [currentHash, setCurrentHash] = useCurrentHash();
  const index = data.findIndex((item) => item.value === currentHash);
  const current = data[index] ?? data[0];
  const ref = useRef<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const score = ref.current.reduce((a, c) => a + c, 0);

  return (
    <div className="mx-auto max-w-4xl space-y-18 px-4 py-24">
      <ProgressBar
        currentValue={currentHash}
        data={data}
        onSelect={setCurrentHash}
      />
      <div className="space-y-4">
        <h1 className="text-3xl">{current?.question}</h1>
        {current.name === "Result" ? (
          <div className="space-y-4">
            <div className="text-6xl">{score}점</div>
            <div>
              {score <= 4 ? (
                <div>
                  현재 참전용사와 한반도 평화에 대한 공감이 낮은 편입니다.
                  <br />이 주제에 대해 더 많이 배우고 생각해보는 것이
                  필요합니다.
                  <br />
                  역사나 사회 수업을 통해 이들의 희생과 평화의 중요성을 이해하는
                  기회를 가져보세요.
                </div>
              ) : score <= 7 ? (
                <div>
                  당신은 참전용사와 평화의 중요성을 어느 정도 이해하고 있습니다.
                  <br />
                  더 많은 정보와 경험을 통해 이 주제에 대한 공감을 더욱 깊게 할
                  수 있습니다.
                  <br />
                  친구들과 함께 평화에 대해 이야기해보는 것도 좋은 방법입니다.
                </div>
              ) : (
                <div>
                  당신은 참전용사의 희생과 한반도 평화에 대해 깊이 공감하고
                  있습니다.
                  <br />이 주제에 대해 더 많이 배우고, 주변 사람들과 이야기하며
                  평화의 중요성을 널리 알리는 것이 좋습니다.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            <Button
              className="rounded-xl border border-zinc-300 p-4 text-2xl hover:cursor-pointer hover:bg-zinc-200"
              onClick={() => {
                setCurrentHash(current.next);
                ref.current[index] = 1;
              }}
            >
              예
            </Button>
            <Button
              className="rounded-xl border border-zinc-300 p-4 text-2xl hover:cursor-pointer hover:bg-zinc-200"
              onClick={() => setCurrentHash(current.next)}
            >
              아니오
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
