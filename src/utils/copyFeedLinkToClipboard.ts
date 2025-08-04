export const copyFeedLinkToClipboard = (channelId: string, feedId: string) => {
  const baseUrl = window.location.href.replace(window.location.pathname, "");
  const fullUrl = `${baseUrl}/Channel/${channelId}/feed/${feedId}`;

  navigator.clipboard.writeText(fullUrl)
    .then(() => {
      console.log("링크가 클립보드에 복사되었습니다:", fullUrl);
    })
    .catch((err) => {
      console.error("클립보드 복사 실패:", err);
    });
};