import Header from "./Header";
import SideNavigation from "./SideNavigation";
import S from "./Layout.module.css";
import { useState, type ReactNode } from "react";
import { useRouter } from "@/router/RouterProvider";
import { useMediaQuery } from "@/hook/useMediaQuery";

function Layout({ children }: { children: ReactNode }) {
  const { setHistoryRoute } = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <>
      <div className={S.container}>
        <header className={S.header}>
          <Header
            isMobile={isMobile}
            setHistoryRoute={setHistoryRoute}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </header>
        <main className={S.main}>
          <aside
            className={`${S.sidebar} ${
              isMobile
                ? isSidebarOpen
                  ? S.closed
                  : S.open
                : isSidebarOpen
                  ? S.open
                  : S.closed
            }`}
          >
            <SideNavigation />
          </aside>
          <section className={S.pageContent}>{children}</section>
        </main>
      </div>
    </>
  );
}

export default Layout;
