import S from './ChannelFeed.module.css';

function ChannelFeedSkeletron() {
  return (
    <div className={`${S.container}`}>
      <div className={S.userAvatarContainer}>
        <div className={`${S.userAvatar} ${S.skeleton}`} />
      </div>
      <div className={S.messageFeed}>
        <div
          className={S.skeleton}
          style={{ width: '10rem', height: '1.2rem', borderRadius: '4px' }}
        />
        <div
          className={S.skeleton}
          style={{ width: '80%', height: '4rem', borderRadius: '4px' }}
        />
      </div>
    </div>
  );
}
export default ChannelFeedSkeletron;