// import { useState } from 'react'
// import reactLogo from '@/assets/react.svg'
// import viteLogo from '/vite.svg'
import { RouterProvider } from "./router/RouterProvider";
import { routes } from "./router/router";
import Layout from "./components/Layout";

import LoginModal from "./components/LoginModal";
import { LoginModalProvider } from "./context/LoginModalContext";

import "@/App.css";

function App() {
  return (
    <>
      <LoginModalProvider>
        <RouterProvider navigation={(routeElement) => <Layout>{routeElement}</Layout>} routes={routes} />
        <LoginModal />
      </LoginModalProvider>
    </>
  );
}

export default App;
