import S from "./SideNavigation.module.css";
import NavLink from "../NavLink";
import { getChannels, type ChannelsType } from "@/api";
import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import ChannelCreateForm from "../channel/ChannelCreateForm";

function SideNavigation() {
  const [channelList, setChannelList] = useState<ChannelsType[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);





//새로 생성된 채널들을 가져오는 함수
  const fetchChannels = async() =>{
    const channels = await getChannels();
    setChannelList(channels); 
  };

  useEffect(()=>{
    fetchChannels();
  },[])

  const handleCreatedChannel = () => {
    setIsModalOpen(false);
    fetchChannels();
  }
  // useEffect(()=>{
  //   async function init() {
  //     const channels = await getChannels();
  //     setChannelList(channels)
  //   }
  //   init();
  // }, [])

  return (
    <section className={S.component}>
      <h1>채널 목록 </h1>
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
        
        <button className={S.createChannelButton} onClick={() => setIsModalOpen(true)}>
          채널 추가하기
        </button>
      </nav>

      {isModalOpen && (
        <Modal title="채널 생성" onClose={() => setIsModalOpen(false)} >
          <ChannelCreateForm onSuccess={handleCreatedChannel} />
        </Modal>
      )}
    </section>
  )
}
export default SideNavigation