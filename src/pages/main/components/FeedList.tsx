import type { Tables } from "@/@types/database.types";
import S from "./style.FeedList.module.css";

type Props = {
  title:string,
  contents?:Tables<"get_feeds_with_all">
}

function FeedList({title, contents}:Props) {

  console.log(contents);
  return (
    <>
      <h2 className={S.title}>{title}</h2>
      <div className={S.fcWrapper} style={{marginBottom:'20px'}}>
        <div className={S.container}>
          <div>
            <div className={S.feed}>
              <div>컨텐츠</div> <div>+16</div>
            </div>
            <hr />
          </div>
          <div>
            <div className={S.feed}>
              <div>컨텐츠</div> <div>+16</div>
            </div>
            <hr />
          </div>
          <div>
            <div className={S.feed}>
              <div>컨텐츠</div> <div>+16</div>
            </div>
            <hr />
          </div>
        </div>
      </div>
    </>
  );
}
export default FeedList;
