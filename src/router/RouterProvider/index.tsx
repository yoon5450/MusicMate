// context/RouterProvider.tsx
import {
  Fragment,
  createContext,
  useLayoutEffect,
  useCallback,
  useState,
  useMemo,
  type ReactNode,
  type ReactElement,
  useContext,
} from "react";
import NotFound from "./NotFound";

export interface RouteItem {
  path: string;
  title: string;
  element: ReactElement;
}

interface RouterContextType {
  currentPath: string;
  setHistoryRoute: (to: string) => void;
  params: Record<string, string>;
  title: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const RouterContext = createContext<RouterContextType | null>(null);

interface RouterProviderProps {
  routes: RouteItem[];
  navigation?: (routeElement: ReactNode) => ReactNode;
}

export function RouterProvider({ routes, navigation }: RouterProviderProps) {
  const [routeElement, setRouteElement] = useState<ReactNode>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [title, setTitle] = useState("");
  const [navKey, setNavKey] = useState(0);
  const [params, setParams] = useState<Record<string, string>>({});

  const matchRoute = (
    to: string
  ): { route: RouteItem | null; params: Record<string, string> } => {
    for (const route of routes) {
      if (route.path.includes(":")) {
        const paramNames =
          route.path.match(/:\w+/g)?.map((p) => p.slice(1)) ?? [];
        const pattern = new RegExp(
          "^" + route.path.replace(/:\w+/g, "([^/]+)") + "$"
        );
        const match = to.match(pattern);
        if (match) {
          const params: Record<string, string> = {};
          paramNames.forEach((name, i) => {
            params[name] = match[i + 1];
          });
          return { route, params };
        }
      } else {
        if (route.path === to || `/${route.path}` === to) {
          return { route, params: {} };
        }
      }
    }
    return { route: null, params: {} };
  };

  const setHistoryRoute = useCallback(
    (to: string) => {
      const { route, params } = matchRoute(to);

      if (route) {
        document.title = route.title;
        setTitle(route.title);
        setRouteElement(route.element);
      } else {
        document.title = "404 Not Found";
        setTitle("페이지를 찾을 수 없음");
        setRouteElement(<NotFound />);
      }

      setCurrentPath(to);
      setParams(params); // ✅ 파라미터 저장
      setNavKey((k) => k + 1);
    },
    [routes]
  );

  useLayoutEffect(() => {
    const { pathname } = window.location;

    const handler = () => setHistoryRoute(window.location.pathname);

    window.addEventListener("popstate", handler);
    setHistoryRoute(pathname);

    return () => {
      window.removeEventListener("popstate", handler);
    };
  }, [setHistoryRoute]);

  const value = useMemo(
    () => ({
      setHistoryRoute,
      currentPath,
      params,
      title,
    }),
    [setHistoryRoute, currentPath, params, title]
  );

  // 네비게이션이 매번 리렌더링되므로 navigation을 밖으로 빼냄

  return (
    <RouterContext.Provider value={value}>
      {navigation && routeElement ? (
        navigation(routeElement)
      ) : (
        <Fragment key={navKey}>{routeElement}</Fragment>
      )}
    </RouterContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx)
    throw new Error("useRouter는 RouterProvider 안에서만 사용해야 합니다.");
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useParams() {
  const ctx = useContext(RouterContext);
  if (!ctx)
    throw new Error("useParams는 RouterProvider 안에서만 사용해야 합니다.");
  return ctx.params;
}
