import Header from "./Header";
import SideNavigation from "./SideNavigation";
import S from "./Layout.module.css";
import { useState, type ReactNode } from "react";
import { useRouter } from "@/router/RouterProvider";

function Layout({ children }: { children: ReactNode }) {
  const { title, setHistoryRoute } = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <div className={S.container}>
        <header className={S.header}>
          <Header
            setHistoryRoute={setHistoryRoute}
            currentPage={title}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </header>
        <main className={S.main}>
          <aside className={`${S.sidebar} ${isSidebarOpen ? S.open : S.closed}`}>
            <SideNavigation />
          </aside>
          <section className={S.pageContent}>{children}</section>
        </main>
      </div>
    </>
  );
}

export default Layout;
