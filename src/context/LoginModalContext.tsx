/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

interface LoginModalContextType {
  open: boolean;
  openLogin: () => void;
  closeLogin: () => void;
}

// Context 객체 생성
export const LoginModalContext = createContext<LoginModalContextType | null>(null);

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const openLogin = () => setOpen(true);
  const closeLogin = () => setOpen(false);

  // React 19부터는 .Provider 없이 바로 <LoginModalContext> 사용
  return (
    <LoginModalContext value={{ open, openLogin, closeLogin }}>
      {children}
    </LoginModalContext>
  );
}


export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) throw new Error("LoginModalProvider로 감싸야 합니다.");
  return ctx;
}
