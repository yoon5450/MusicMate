import ApiInsertTest from "@/test/ApiInsertTest";
// import ApiTest from "@/components/ApiTest";
import { useLoginModal } from "@/context/LoginModalContext";
import { AuthProvider, useAuth } from "@/auth/AuthProvider";

function ApiTestPage() {
  const { openLogin } = useLoginModal();
  const { isAuth, logout } = useAuth();


  const handleLoginModal = () => {
    // 로그인 모달창 열기
    openLogin();
  };

  const handleLogout = () => {
    // 로그아웃 하기
    logout();
  };

  return (
    <>
      <ApiInsertTest />
      <div>ApiTestPage</div>
      <AuthProvider>
        {isAuth ? (
          <button type="button" onClick={handleLoginModal}>
            모달창열기
          </button>
        ) : (
          <button type="button" onClick={handleLogout}>
            로그아웃
          </button>
        )}
      </AuthProvider>
    </>
  );
}
export default ApiTestPage;
