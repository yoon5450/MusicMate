import { useState } from "react";




function useAlert() {
  const [message, setMessage] = useState<string | null>(null);

  const showAlert = (msg: string) => setMessage(msg);
  const closeAlert = () => setMessage(null);

  const AlertModal = message ? (
        <div className="alert-backdrop">
          <div className="alert-box">
            <p>{message}</p>
            <button onClick={closeAlert}>확인</button>
          </div>
        </div>
      ) : null;

  return { showAlert, AlertModal };
}

export default useAlert;
