export const copyFeedLinkToClipboard = (channelId: string, feedId: string) => {
  const baseUrl = window.location.href.replace(window.location.pathname, "");
  const fullUrl = `${baseUrl}/Channel/${channelId}/feed/${feedId}`;

  navigator.clipboard.writeText(fullUrl)
    .catch((err) => {
      console.error("클립보드 복사 실패:", err);
    });
};