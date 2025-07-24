// context/RouterProvider.tsx
import NotFound from "@/pages/NotFound/NotFound";
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

export interface RouteItem {
  path: string; // 경로
  title: string; // 탭 제목
  element: ReactElement; // 렌더링할 컴포넌트
}

interface RouterContextType {
  currentPath: string; // 현재경로
  setHistoryRoute: (to: string) => void; // 페이지이동함수
  params: Record<string, string>; // 파라미터값 {파라미터이름 : 값 ... }
  title: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const RouterContext = createContext<RouterContextType | null>(null);

interface RouterProviderProps {
  routes: RouteItem[]; // RouteItem 배열 ({경로1, 탭제목1, 이동할컴포넌트1}, {경로2, 탭제목2, 이동할컴포넌트2} ... )
  navigation?: (routeElement: ReactNode) => ReactNode;
}

export function RouterProvider({ routes, navigation }: RouterProviderProps) {
  const [routeElement, setRouteElement] = useState<ReactNode>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname); // 현재 주소창의 주소 가져오기 (ex. www.naver.com/12345 -> /12345  가져옴)
  const [title, setTitle] = useState("");
  const [navKey, setNavKey] = useState(0);
  const [params, setParams] = useState<Record<string, string>>({});

  const matchRoute = (
    to: string
  ): { route: RouteItem | null; params: Record<string, string> } => {
    for (const route of routes) {
      // RouteItem 배열 { path : 경로, title : 탭제목, element }[ ]
      if (route.path.includes(":")) {
        // 경로에 : 이 포함된 경우

        /* paramNames에 : 뒤에 있는 값들 배열로 넣어줌
            (/:\w+/g) => : ___ 이런 형태
            route.path.match(/:\w+/g) => route.path에서  : ___ 이런 형태로 되어있는 애들 배열로 반환해줌
            map을 돌려서 앞에 : 잘라내서 paramNames에 저장
            ex. "/user/:id/post/:postId" -> [id, postId]
        */
        const paramNames =
          route.path.match(/:\w+/g)?.map((p) => p.slice(1)) ?? [];
        /*  pattern에 정규식 만들어서 넣어줌
            (/:\w+/g) => : ___ 이런 형태  -> "([^/]+)"로 바꿔주기 , $붙이기
                "[^/]+" = / 를 제외한 문자 1개이상 , $ = 끝 , () = 캡처그룹의미(match쓰기위한거)
            ex. "/user/:id" -> "/user/([^/]+)" 
        */
        const pattern = new RegExp(
          "^" + route.path.replace(/:\w+/g, "([^/]+)") + "$"
        );
        const match = to.match(pattern);
        /* match
            일치하는 경우 return [전체문자열, 캡처그룹1, 캡처그룹2 ... ] (캡처그룹은 ()로 감싸진 부분)
            일치하지 않는 경우 return null
            ex. route.path = "/user/:userId/post/:postId" , to = "/user/3/post/15"
                  pattern: ^/user/([^/]+)/post/([^/]+)$
                -> match: ["/user/3/post/15", "3", "15"]
        */
        if (match) {
          const params: Record<string, string> = {}; // params는 key랑 value 모두 string인 객체
          paramNames.forEach((name, i) => {
            // 경로에서 : 뒤에 있는 값들 배열(=paramNames) 돌면서 params에 {파라미터이름 : 값} 형태로 저장
            params[name] = match[i + 1];
          });
          return { route, params }; // { path : 경로, title : 탭제목, element }, {파라미터이름 : 값 ... } 반환
        }
      } else {
        // route.path에 : 가 포함되지 않는 경우
        if (route.path === to || `/${route.path}` === to) {
          // 매개변수로 전달받은 to랑 route.path가 같으면 params 빈 객체로 route랑 params 반환
          return { route, params: {} };
        }
      }
    }
    return { route: null, params: {} }; // 404NotFound 페이지
  };

  const setHistoryRoute = useCallback(
    (to: string) => {
      const { route, params } = matchRoute(to); // 이동할 경로에 맞는 route 찾고 파라미터 뽑아내기

      if (route) {
        // 이동할 route 있는 경우
        document.title = route.title; // 탭이름설정
        // console.log( route.element );
        setTitle(route.title);
        setRouteElement(route.element); // route의 element(컴포넌트) 렌더링
      } else {
        // 404NotFound 페이지렌더링
        document.title = "404 Not Found";
        setTitle("페이지를 찾을 수 없음");
        setRouteElement(<NotFound />);
      }

      setCurrentPath(to); // 현재경로업데이트
      setParams(params); // 파라미터 state로 저장
      setNavKey((k) => k + 1); // navKey 1 증가시키기(강제로 리렌더링하기위해서 - 같은 컴포넌트 보여줄 때도 데이터 달라졌을수도 있으니까)
    },
    [routes] // routes가 바뀌지 않으면 원래 함수참조유지
  );

  useLayoutEffect(() => {
    const { pathname } = window.location; // 페이지로딩 시 현재 주소 가져옴

    // 현재주소에 맞는 컴포넌트 렌더링
    const handler = () => setHistoryRoute(window.location.pathname);

    // 브라우저에서 뒤로가기/앞으로가기 버튼 누르는 경우 handler 실행
    window.addEventListener("popstate", handler);
    setHistoryRoute(pathname); // 현재주소에 맞는 컴포넌트 렌더링

    return () => {
      // 클린업함수 : popstate 이벤트리스너 제거

      window.removeEventListener("popstate", handler);
    };
  }, [setHistoryRoute]);

  /* value에 저장되는값
    { setHistoryRoute: (to: string) => { ... },  // 현재 페이지 이동 함수
      currentPath: "/user/3",                          // 현재 경로
      params: { id: "3" }                                   // 파라미터 추출값
    } 
  */
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
      {/* {value 전역공유해줌} */}
      {/* navigationBar같은거*/}
      {/* 현재 경로에 맞는 컴포넌트(있으면 해당컴포넌트 ,없으면 404NotFound)*/}
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
  // context value값 가져오기
  const ctx = useContext(RouterContext);
  if (!ctx)
    throw new Error("useRouter는 RouterProvider 안에서만 사용해야 합니다.");
  return ctx;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useParams() {
  // context value의 params 가져오기
  const ctx = useContext(RouterContext);
  if (!ctx)
    throw new Error("useParams는 RouterProvider 안에서만 사용해야 합니다.");
  return ctx.params;
}
