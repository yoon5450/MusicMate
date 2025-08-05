import { useEffect, useState } from "react";
import { throttle } from "@/utils/Throttle";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(query);
    const updateMatches = throttle(
      () => setMatches(mediaQueryList.matches),
      200
    );

    mediaQueryList.addEventListener("change", updateMatches);

    setMatches(mediaQueryList.matches);

    return () => {
      mediaQueryList.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}
