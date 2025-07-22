// import { useState } from 'react'
// import reactLogo from '@/assets/react.svg'
// import viteLogo from '/vite.svg'
import { RouterProvider } from "./router/RouterProvider";
import SideNavigation from "./components/Layout/SideNavigation";
import { routes } from "./router/router";
import Header from "./components/Layout/Header";

function App() {
  return (
    <>
      <Header />

      <div style={{ display: "flex" }}>
        <RouterProvider navigation={<SideNavigation />} routes={routes} />
      </div>
    </>
  );
}

export default App;
