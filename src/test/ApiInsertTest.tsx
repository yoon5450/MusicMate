import { getUserSession, login, getUserChannelsByUserId } from "@/api";
import { useEffect, useState } from "react";

function ApiInsertTest() {
  // const [count, setCount] = useState(6);
  const [userId, setUserId] = useState<string>('');

  async function onClick() {
    // const name = `test` + count;
    const data = await getUserChannelsByUserId('7c01635f-948e-4b4f-bd2b-131c69f2e732')
    console.log(data) ;
    console.log(userId)
  }

  useEffect(() => {
    async function loginAction(){
      const token = await getUserSession();
      if(token) setUserId(token.session!.user.id)
    }

    login("ssss@exam.com", "121212");
    loginAction()
  }, []);

  return (
    <div>
      ApiInsertTest
      <button type="button" onClick={onClick}>
        테스트 돌리기
      </button>
    </div>
  );
}
export default ApiInsertTest;
