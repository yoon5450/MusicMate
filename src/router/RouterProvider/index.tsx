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
}

// eslint-disable-next-line react-refresh/only-export-components
export const RouterContext = createContext<RouterContextType | null>(null);

interface RouterProviderProps {
  routes: RouteItem[];
  navigation?: ReactNode;
}

export function RouterProvider({ routes, navigation }: RouterProviderProps) {
  const [routeElement, setRouteElement] = useState<ReactNode>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
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
        // console.log( route.element );
        
        setRouteElement(route.element);
      } else {
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
      params, // ✅ 추가됨
    }),
    [setHistoryRoute, currentPath, params]
  );

  return (
    <RouterContext.Provider value={value}>
      <Fragment key={navKey}>{navigation}</Fragment>
      {routeElement}
    </RouterContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useRouter(){
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
