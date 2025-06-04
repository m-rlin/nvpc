import { memo } from "react";
import ReactMarkdown from "react-markdown";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return <ReactMarkdown>{children}</ReactMarkdown>;
};

//“”
export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
