import { useState } from "react";




function TestLogin() {

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');

  const handleLogin = () => { 
    
   }

  return (
    <div>
      <h2>로그인</h2>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        />
      <input
      type="password"
      value={password}
      onChange={e=>setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>
    </div>
  )
}
export default TestLogin