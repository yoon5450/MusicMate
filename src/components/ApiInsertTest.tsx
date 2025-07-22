import { addChannels } from "@/api/channels";
import { getUserSession, login } from "@/api/login";
import { useEffect, useState } from "react";

function ApiInsertTest() {
  const [count, setCount] = useState(3);
  const [userId, setUserId] = useState<string>('');

  function onClick() {
    const name = `test` + count;
    addChannels({ name, owner_id: userId });
    setCount(count + 1);
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
