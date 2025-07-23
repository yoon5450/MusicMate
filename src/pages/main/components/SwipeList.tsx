import S from "./style.SwiperList.module.css"

function SwipeList() {
  return (
    <>
    <h2 className={S.title}>타이틀 영역</h2>
    <div className={S.content} style={{marginBottom:'20px'}}>
      
      <div className={S.swiper}>
        스와이퍼 영역
      </div>
    </div>
    </>
  )
}

export default SwipeList