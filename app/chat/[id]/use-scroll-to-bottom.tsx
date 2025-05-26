import { useEffect, useRef, useCallback } from "react";

const remToPixels = (rem: number) => {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  return rem * rootFontSize;
};

export const useScrollToBottom = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const isNearBottom = () => {
        return (
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <=
          remToPixels(20)
        );
      };

      const observer = new MutationObserver(() => {
        if (
          isNearBottom() // 스크롤이 하단에 있을 때만 실행
        ) {
          end.scrollIntoView({ behavior: "instant", block: "end" });
        }
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        // attributes: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    endRef.current?.scrollIntoView({ behavior: "instant", block: "end" });
  }, []);

  return [containerRef, endRef, scrollToBottom] as const;
};
