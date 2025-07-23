import ContentEditorContext from "./contentEditorContext";
import type { ReactNode } from "react";
import { saveMarkdown, readMarkdown } from "./actions";
import { cookies } from "next/headers";
import "./styles.css";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const isContentEditor = (await cookies()).has("i-am-a-content-editor");
  saveMarkdown(await readMarkdown()); // Server Actions appear to need to be called in the server component first before they can be used in the client component... Hopefully Next will fix.
  return (
    <ContentEditorContext {...{ isContentEditor }}>
      {children}
    </ContentEditorContext>
  );
}
