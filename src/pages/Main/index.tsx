// 예상 레이아웃 구조
/*
Main
ㄴ인기 클립 (Wapper 포함)
ㄴ인기 포스트 (데이터 기반)
ㄴ추천 플레이리스트 (Wapper 포함)
*/

import PlaylistSwiper from './components/PlaylistSwiper';
import FeedList from './components/FeedList';
import ClipSwiper from './components/ClipSwiper';
import S from './style.module.css';

function Main() {

  return (
    <div className={S.container}>
      <PlaylistSwiper/>
      <FeedList/>
      <ClipSwiper/>
    </div>
  );
}
export default Main;
