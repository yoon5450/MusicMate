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

function App() {
  return (
    <>
      <LoginModalProvider>
        <AuthProvider>
          <UserProfileProvider>
            <RouterProvider
              navigation={(routeElement) => (
                <Layout>
                  <section className={S.pageContent}>{routeElement}</section>
                </Layout>
              )}
              routes={routes}
            />
          </UserProfileProvider>
        </AuthProvider>
        <LoginModal />
      </LoginModalProvider>
    </>
  );
}

export default App;
