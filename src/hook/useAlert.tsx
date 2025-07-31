import { useState } from "react";
import S from './useAlert.module.css';


function useAlert() {
  const [message, setMessage] = useState<string | null>(null);
  const showAlert = (msg: string) => setMessage(msg);
  const closeAlert = () => setMessage(null);

  const AlertModal = message ? (
        <div className={S.alertBackdrop}>
          <div className={S.alertBox}>
            <p>{message}</p>
            <button onClick={closeAlert}>확인</button>
          </div>
        </div>
      ) : null;

  return { showAlert, AlertModal };
}

export default useAlert;
