import { useEffect, useRef, useTransition } from "react";
import { saveMarkdown } from "../../../actions";
import type TurndownService from "turndown";

const useContentEditable = () => {
  const [isPending, startTransition] = useTransition();
  const turndownServiceRef = useRef<TurndownService>(null);

  useEffect(() => {
    if (isPending) {
      document.body.setAttribute("data-is-saving", "true");
    } else {
      document.body.removeAttribute("data-is-saving");
    }
  }, [isPending]);

  const okKeyDown = (e: KeyboardEvent) => {
    if (e.metaKey && e.key === "s") {
      e.preventDefault();
      startTransition(async () => {
        await saveMarkdown(
          turndownServiceRef.current?.turndown(
            document.body.innerHTML.replaceAll(/<script>(.*?)<\/script>/g, "")!
          )!
        );
      });
    }
  };

  useEffect(() => {
    void (async () => {
      if (!turndownServiceRef.current) {
        const { default: Service } = (await import("turndown")) as {
          default: typeof TurndownService;
        };
        turndownServiceRef.current = new Service();
      }
    })();
    document.designMode = "on";
    document.body.setAttribute("data-design-mode", "true");
    document.addEventListener("keydown", okKeyDown, false);

    return () => {
      document.designMode = "off";
      document.body.removeAttribute("data-design-mode");
      document.removeEventListener("keydown", okKeyDown, false);
    };
  }, []);
};

export default useContentEditable;
