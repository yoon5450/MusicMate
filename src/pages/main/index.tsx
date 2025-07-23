// 예상 레이아웃 구조
/*
Main
ㄴ인기 클립 (Wapper 포함)
ㄴ인기 포스트 (데이터 기반)
ㄴ추천 플레이리스트 (Wapper 포함)
*/

import FeedList from './components/FeedList';
import SwipeList from './components/SwipeList';
import S from './style.module.css';

function Main() {
  return (
    <div className={S.container}>
      <SwipeList />
      <FeedList title='인기 게시글'/>
      <SwipeList />
    </div>
  )
}
export default Main