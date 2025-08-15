import { throttle } from "@/utils/throttle";
import { useCallback, useEffect, useRef } from "react";

type OnIntersect = () => void;

interface ParamsType {
  onIntersect: () => void;
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number | number[];
  disabled?: boolean;
}

export function useInfiniteScroll({
  onIntersect,
  root = null,
  rootMargin = "0px",
  threshold = 0.1,
  disabled = false,
}: ParamsType) {
  // 콜백 최신화
  const isIntersectingRef = useRef(false);
  const onIntersectRef = useRef<OnIntersect>(onIntersect);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastNodeRef = useRef<Element | null>(null);
  const throttleCallRef = useRef<() => void | null>(null);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    throttleCallRef.current = throttle(() => {
      onIntersectRef.current();
    }, 200);
  }, []);

  // 옵저버 setting 콜백
  const setObserverCallback = useCallback(
    (node: Element | null) => {
      // 옵저버가 이미 존재한다면 정리
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      lastNodeRef.current = node;

      if (disabled || !node) return;

      if (
        typeof window === "undefined" ||
        typeof IntersectionObserver !== "function"
      ) {
        console.log("스크롤 옵저버를 로드할 수 없습니다.");
        return;
      }

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          isIntersectingRef.current = entry.isIntersecting;

          if (entry.isIntersecting) {
            throttleCallRef.current?.();
          }
        },
        { threshold, root, rootMargin }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [root, rootMargin, threshold, disabled]
  );

  // 언마운트시 이벤트를 삭제
  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  const pause = useCallback(() => {
    observerRef.current?.disconnect();
  }, []);

  const resume = useCallback(() => {
    const node = lastNodeRef.current;
    if (!node || disabled) return;
    setObserverCallback(node);
  }, [disabled, setObserverCallback]);

  const getIsIntersecting = useCallback(() => isIntersectingRef.current, []);

  return { setObserverCallback, getIsIntersecting, pause, resume };
}
