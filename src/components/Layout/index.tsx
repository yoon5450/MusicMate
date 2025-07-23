import Header from "./Header";
import SideNavigation from "./SideNavigation";
import S from "./Layout.module.css";
import type { ReactNode } from "react";

function Layout({ children }: { children:ReactNode}) {

  console.log(children)
  return (
    <>
      <div className={S.container}>
        <Header />
        <main className={S.main}>
          <aside>
            <SideNavigation />
          </aside>
          <section className={S.pageContent}>
            {children}
          </section>
        </main>
      </div>
    </>
  );
}

export default Layout;
