import { addChannels } from "@/api/channels"
import { login } from "@/api/login";
import { useEffect, useState } from "react"



function ApiInsertTest() {
  const [count, setCount] = useState(0);
  
  function onClick(){
    const id = `641411a2-703e-4a09-b874-33cbc6fc54e9`
    const name = `test` + count
    addChannels({name, owner_id:id})
    setCount(count+1);
  }

  useEffect(() => {
    login('ssss@exam.com', '121212')
  },[])

  return (
    <div>ApiInsertTest
      <button type="button" onClick={onClick}>테스트 돌리기</button>
    </div>
  )
}
export default ApiInsertTest