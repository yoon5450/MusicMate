import Header from "./Header";
import SideNavigation from "./SideNavigation";
import S from "./Layout.module.css";
import { type ReactNode } from "react";
import { useRouter } from "@/router/RouterProvider";

function Layout({ children }: { children: ReactNode }) {
  const {title, setHistoryRoute} = useRouter()

  return (
    <>
      <div className={S.container}>
        <Header setHistoryRoute={setHistoryRoute} currentPage={title}/>
        <main className={S.main}>
          <aside>
            <SideNavigation />
          </aside>
          {children}
        </main>
      </div>
    </>
  );
}

export default Layout;
