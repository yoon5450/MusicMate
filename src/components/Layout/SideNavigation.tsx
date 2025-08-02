import S from "./SideNavigation.module.css";
import NavLink from "../NavLink";
import { getChannels, type ChannelsType } from "@/api";
import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import ChannelCreateForm from "../channel/ChannelCreateForm";
import { useAuth } from "@/auth/AuthProvider";
import { useLoginModal } from "@/context/LoginModalContext";
import { filterChannels } from "@/utils/filterChannels";
import { useUserGenre } from "@/context/UserGenreContext";
import { useParams } from "@/router/RouterProvider";
import { alert } from "../common/CustomAlert";

function SideNavigation() {
  const [channelList, setChannelList] = useState<ChannelsType[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayedChannels, setDisplayedChannels] = useState<ChannelsType[]>(
    []
  ); //최종 보여줄 채널
  const [isChannelChanged, setIsChannelChanged] = useState<number>(Date.now());

  const { isAuth, user } = useAuth();
  const { openLogin } = useLoginModal();

  const { userGenre } = useUserGenre();

  const { id: currentChannelId } = useParams();

  useEffect(() => {
    const fetchChannels = async () => {
      // 채널 목록 가져오기
      const channels = await getChannels();
      setChannelList(channels);
    };
    fetchChannels();
  }, [isChannelChanged]);

  // 채널 목록, 선호 장르, 현재 사용자 ID가 변경될 때마다 표시 목록 재계산
  useEffect(() => {
    if (!channelList) return;

    const filterdList = filterChannels(
      channelList,
      userGenre,
      user ? user.id : null
    );
    setDisplayedChannels(filterdList);
  }, [channelList, user, userGenre]);

  // 모달에서 채널 생성 성공 시 실행
  const handleCreatedChannel = () => {
    setIsModalOpen(false);
    setIsChannelChanged(Date.now());
  };

  const handleAddChannel = () => {
    if (isAuth) {
      setIsModalOpen(true);
    } else {
      alert("로그인 후 이용해주세요.").then(() => openLogin());
    }
  };
  return (
    <section className={S.component}>
      <nav>
        <h2 className="a11y-hidden">메인 메뉴</h2>
        <ul>
          {displayedChannels.map(({ id, name }) => (
            <li key={id}>
              <NavLink
                to={`/Channel/${id}`}
                className={`${S.channelItem} ${
                  currentChannelId === String(id) ? S.active : ""
                }`}
              >
                {name}
              </NavLink>
            </li>
          ))}
        </ul>

        <button className={S.createChannelButton} onClick={handleAddChannel}>
          채널 만들기
        </button>
      </nav>

      {isModalOpen && (
        <Modal title="채널 만들기" onClose={() => setIsModalOpen(false)}>
          <ChannelCreateForm onSuccess={handleCreatedChannel} />
        </Modal>
      )}
    </section>
  );
}

export default SideNavigation;
