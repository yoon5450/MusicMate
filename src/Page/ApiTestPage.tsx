import ApiInsertTest from "@/test/ApiInsertTest";
// import ApiTest from "@/components/ApiTest";
import { useLoginModal } from "@/context/LoginModalContext";


function ApiTestPage() {
  
  const { openLogin } = useLoginModal();
  const handleClick = () => {
    openLogin();
  };

  return (
    <>
      <ApiInsertTest />
      <div>ApiTestPage</div>
      <button type="button" onClick={handleClick}>로그인</button>
    </>
  );
}
export default ApiTestPage;
