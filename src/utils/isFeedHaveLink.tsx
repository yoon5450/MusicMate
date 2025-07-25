const regexList = [
  {
    regex:
      /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[\w\-?&=%.]+)/g,
    getEmbedUrl: (url: string) => {
      const match = url.match(/v=([\w-]+)/) || url.match(/youtu\.be\/([\w-]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : "";
    },
  },
  {
    regex:
      /(https?:\/\/open\.spotify\.com\/(track|album|playlist|artist|show)\/[\w?=&%-]+)/g,
    getEmbedUrl: (url: string) => {
      const parts = url.split("/");
      const type = parts[3];
      const id = parts[4]?.split("?")[0];
      return id ? `https://open.spotify.com/embed/${type}/${id}` : "";
    },
  },
  {
    regex: /(https?:\/\/soundcloud\.com\/[^\s)]+)/g,
    getEmbedUrl: (url: string) =>
      `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`,
  },
  {
    regex:
      /(https?:\/\/music\.apple\.com\/[a-z]{2}\/(album|song|playlist|artist)\/[^/\s?]+\/\d+)/g,
    getEmbedUrl: (url: string) => {
      const parts = url.split("/");
      const type = parts[4];
      const id = parts.pop();
      return id ? `https://embed.music.apple.com/kr/${type}/${id}` : "";
    },
  },
];

export function isFeedHaveMultipleLinks(content: string): boolean {
  let matchCount = 0;
  for (const regex of regexList) {
    const matches = content.match(regex.regex);
    if (matches) {
      matchCount += matches.length;
      if (matchCount > 1) return true;
    }
  }
  return false;
}

export function isFeedHaveLink(content: string) {
  let urlContained = "";
  let urlEmbed = "";
  let [topContent, bottomContent] = "";
  if (!content) return <p></p>;

  const youtubeMatch = content.match(
    /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w\-?&=%.]+)/i
  );
  const spotifyMatch = content.match(
    /(https?:\/\/open\.spotify\.com\/(track|album|playlist)\/[\w]+[\w?=&%]*)/i
  );
  const soundcloudMatch = content.match(
    /(https?:\/\/soundcloud\.com\/[^\s)]+)/i
  );
  const appleMusicMatch = content.match(
    /(https?:\/\/music\.apple\.com\/[a-z]{2}\/(album|song)\/[^/\s]+\/\d+)/
  );

  if (youtubeMatch) {
    urlContained = youtubeMatch[0];
    const videoIdMatch = urlContained.match(/v=([\w-]+)/);
    if (videoIdMatch) {
      urlEmbed = `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
  } else if (spotifyMatch) {
    urlContained = spotifyMatch[1];
    const type = spotifyMatch[2];
    const id = spotifyMatch[1].split("/").pop()?.split("?")[0];
    if (id) urlEmbed = `https://open.spotify.com/embed/${type}/${id}`;
  } else if (soundcloudMatch) {
    urlContained = soundcloudMatch[1];
    urlEmbed = `https://w.soundcloud.com/player/?url=${encodeURIComponent(urlContained)}`;
  } else if (appleMusicMatch) {
    urlContained = appleMusicMatch[1];
    const type = appleMusicMatch[2];
    const id = urlContained.split("/").pop();
    urlEmbed = `https://embed.music.apple.com/kr/${type}/${id}`;

    [topContent, bottomContent] = content.split(urlContained);
  }

  if (urlEmbed !== "") {
    [topContent, bottomContent] = content.split(urlContained);
    return (
      <>
        <p>{topContent}</p>
        <iframe src={urlEmbed} allow="encrypted-media" />
        <p>{bottomContent}</p>
      </>
    );
  }
  return <p>{content}</p>;
}
