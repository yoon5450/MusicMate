import ApiInsertTest from "@/test/ApiInsertTest";
// import ApiTest from "@/components/ApiTest";
import { useLoginModal } from "@/context/LoginModalContext";
import { signOut } from "@/api/auth";


function ApiTestPage() {
  
  const { openLogin } = useLoginModal();

  const handleLoginModal = () => {
    // 로그인 모달창 열기
    openLogin();
  };

  const handleLogout = () => {
    // 로그아웃 하기
    signOut();
  };

  return (
    <>
      <ApiInsertTest />
      <div>ApiTestPage</div>
      <button type="button" onClick={handleLoginModal}>모달창열기</button>
      <button type="button" onClick={handleLogout}>로그아웃</button>
    </>
  );
}
export default ApiTestPage;
