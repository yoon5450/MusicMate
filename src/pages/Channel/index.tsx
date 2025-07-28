import { useParams } from "@/router/RouterProvider";
import InputFeed from "./components/InputFeed";
import S from "./Channel.module.css";

function Channel() {
  const { id } = useParams();

  return (
    <>
      <div className={S.contentArea}>
        <div>{`${id} 채널입니다.`}</div>
        {/* <div className={S.test}>`${id.repeat(300)}`</div> */}
      </div>
      <InputFeed/>
    </>
  );
}

export default Channel;
