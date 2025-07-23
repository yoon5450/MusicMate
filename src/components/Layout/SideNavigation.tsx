import S from "./SideNavigation.module.css";
import NavLink from "../NavLink";
import { getChannels, type ChannelsType } from "@/api";
import { useEffect, useState } from "react";
function SideNavigation() {
  const [channelList, setChannelList] = useState<ChannelsType[] | null>(null);

  useEffect(()=>{
    async function init() {
      const channels = await getChannels();
      setChannelList(channels)
    }
    init();
  }, [])

  return (
    <section className={S.component}>
      <h1>학습 주제 </h1>
      <nav>
        <h2 className="a11y-hidden">메인 메뉴</h2>
        <ul>
          {
            channelList &&
            channelList.map(({id,name})=>(
              <li key={id}>
                <NavLink to={`/Channel/${id}`}>{name}</NavLink>
              </li>
            ))
          }
        </ul>
      </nav>
    </section>
  )
}
export default SideNavigation