import S from "./SideNavigation.module.css";
import '@/styles/_scroll.css';
import NavLink from "../NavLink";
import { getChannels, getUserPreferredGenre, type ChannelsType } from "@/api";
import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import ChannelCreateForm from "../channel/ChannelCreateForm";
import supabase from "@/utils/supabase";
import { useAuth } from "@/auth/AuthProvider";
import { useLoginModal } from "@/context/LoginModalContext";


function SideNavigation() {
  const [channelList, setChannelList] = useState<ChannelsType[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayedChannels, setDisplayedChannels] = useState<ChannelsType[]>([]);  //최종 보여줄 채널 
  const [preferredGenres, setPreferredGenres] = useState<number[]>([]);   //선호 장르
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);   //현재 로그인한 사용자의 ID
  const {isAuth} = useAuth();
  const {openLogin} = useLoginModal();

  const fetchChannels = async () => {   // 채널 목록 가져오기
    const channels = await getChannels();
    setChannelList(channels);
  };

  const fetchPreferredGenres = async () => {   // 선호 장르 목록 가져오기
    const genres = await getUserPreferredGenre();
    if (genres) {
      setPreferredGenres(genres);
    }
  };

  useEffect(() => {   // 현재 로그인한 사용자의 ID 가져오기
    async function fetchUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    }
    fetchUser();
    fetchChannels();
    fetchPreferredGenres();
  }, []);


  // 채널 목록, 선호 장르, 현재 사용자 ID가 변경될 때마다 표시 목록 재계산
  useEffect(() => {
    if (!channelList) return;
    
    if (!currentUserId || preferredGenres.length === 0) {  // 1. 비로그인 상태이거나 로그인했지만 선호 장르가 없는 경우 -> 전체 목록 보여주기
      setDisplayedChannels(channelList);
      return;
    }

    const preferred = channelList.filter((channel) =>     // 2. 로그인했고 선호 장르가 있는 경우
      preferredGenres.includes(channel.genre_code!)
    );

    const myChannels = channelList.filter(    // 내가 만든 채널 필터링
      (channel) => channel.owner_id === currentUserId
    );

    // 두 목록을 합치고 Map을 이용해 중복을 제거 -> 최종 목록
    const combineChannels = [...preferred, ...myChannels];
    const showChannels = Array.from(new Map(combineChannels.map(item => [item.id, item])).values());

    setDisplayedChannels(showChannels);
  }, [channelList, preferredGenres, currentUserId]);

  // 모달에서 채널 생성 성공 시 실행
  const handleCreatedChannel = () => {
    setIsModalOpen(false);
    fetchChannels(); // 새 채널 목록 다시 불러오기
  };

  const handleAddChannel = () => { 
    if(isAuth){
      setIsModalOpen(true);
    }else{
      alert("로그인 후 이용해주세요.");
      openLogin();
    }
   };
  return (
    <section className={`${S.component} scrollCustom`}>
      <nav>
        <h2 className="a11y-hidden">메인 메뉴</h2>
        <ul>
          {displayedChannels.map(({ id, name }) => (
            <li key={id}>
              <NavLink 
                to={`/Channel/${id}`} 
                className={`${S.channelItem}`} 
                activeClassName={S.active}
             >{name}</NavLink>
            </li>
          ))}
        </ul>

        <button
          className={S.createChannelButton}
          onClick={handleAddChannel}
        >
          채널 만들기
        </button>
      </nav>

      {isModalOpen && (
        <Modal
          title="채널 만들기"
          onClose={() => setIsModalOpen(false)}
        >
          <ChannelCreateForm onSuccess={handleCreatedChannel} />
        </Modal>
      )}
    </section>
  );
}

export default SideNavigation;
