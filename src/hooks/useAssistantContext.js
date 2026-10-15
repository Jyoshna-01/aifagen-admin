import { useEffect } from "react";

export default function useAssistantContext(onContextChange, pageId, data, title = pageId) {
  const serialized = JSON.stringify(data ?? {});
  useEffect(() => {
    if (typeof onContextChange === "function") {
      onContextChange({
        status: "ready",
        pageId,
        title,
        data: JSON.parse(serialized),
      });
    }
  }, [onContextChange, pageId, serialized, title]);
}
