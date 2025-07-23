// import { useState } from 'react'
// import reactLogo from '@/assets/react.svg'
// import viteLogo from '/vite.svg'
import { RouterProvider } from "./router/RouterProvider";
import { routes } from "./router/router";

import Layout from "./components/Layout";

function App() {
  return (
    <>
      <RouterProvider
        navigation={(routeElement) => <Layout>{routeElement}</Layout>}
        routes={routes}
      />
    </>
  );
}

export default App;
