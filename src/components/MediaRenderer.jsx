const MediaRenderer = ({ text }) => {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const imageRegex = /\.(jpeg|jpg|gif|png|webp|svg)$/i;
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;

  const parts = text.split(urlRegex);

  return parts.map((part, i) => {
    if (urlRegex.test(part)) {
      if (imageRegex.test(part)) {
        return <img key={i} src={part} alt="embed" className="embedded-img" />;
      } else if (youtubeRegex.test(part)) {
        const videoId = part.match(youtubeRegex)[1];
        return (
          <iframe
            key={i}
            width="250"
            height="140"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="embedded-video"
          ></iframe>
        );
      } else {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
    }
    return <span key={i}>{part}</span>;
  });
};

export default MediaRenderer;
