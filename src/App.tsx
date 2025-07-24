// import { useState } from 'react'
// import reactLogo from '@/assets/react.svg'
// import viteLogo from '/vite.svg'
import "@/App.css";
import ApiTestPage from "./Page/ApiTestPage";
import LoginModal from "./components/LoginModal";
import { LoginModalProvider } from "./context/LoginModalContext";

function App() {
  return (
    <>
      <LoginModalProvider>
        <ApiTestPage />
        <LoginModal />
      </LoginModalProvider>
    </>
  );
}

export default App;
