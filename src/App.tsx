// import { useState } from 'react'
// import reactLogo from '@/assets/react.svg'
// import viteLogo from '/vite.svg'
import { RouterProvider } from "./router/RouterProvider";
import { routes } from "./router/router";
import Layout from "./components/Layout";

import LoginModal from "./components/LoginModal";
import { LoginModalProvider } from "./context/LoginModalContext";
import S from "@/components/Layout/Layout.module.css";

import "@/App.css";
import { AuthProvider } from "./auth/AuthProvider";
import { UserProfileProvider } from "./context/UserProfileContext";
import { UserGenreProvider } from "./context/UserGenreContext";

function App() {
  return (
    <>
      <LoginModalProvider>
        <AuthProvider>
          <UserProfileProvider>
            <UserGenreProvider>
              <RouterProvider
                navigation={(routeElement) => (
                  <Layout>
                    <section className={S.pageContent}>{routeElement}</section>
                  </Layout>
                )}
                routes={routes}
              />
            </UserGenreProvider>
          </UserProfileProvider>
        </AuthProvider>
        <LoginModal />
      </LoginModalProvider>
    </>
  );
}

export default App;
