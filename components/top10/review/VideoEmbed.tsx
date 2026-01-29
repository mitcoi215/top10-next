'use client';

interface VideoEmbedProps {
  url: string;
  autoplay?: boolean;
  muted?: boolean;
}

function getEmbedUrl(url: string, autoplay: boolean, muted: boolean): string | null {
  // YouTube
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    const params = new URLSearchParams({
      rel: '0',
      showinfo: '0',
      autoplay: autoplay ? '1' : '0',
      mute: muted ? '1' : '0',
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    const params = new URLSearchParams({
      autoplay: autoplay ? '1' : '0',
      muted: muted ? '1' : '0',
    });
    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  }

  // Dailymotion
  const dailymotionMatch = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
  if (dailymotionMatch) {
    const videoId = dailymotionMatch[1];
    return `https://www.dailymotion.com/embed/video/${videoId}?autoplay=${autoplay ? '1' : '0'}&mute=${muted ? '1' : '0'}`;
  }

  // Direct embed URL (already an embed link)
  if (url.includes('/embed/') || url.includes('player.')) {
    return url;
  }

  return null;
}

export default function VideoEmbed({
  url,
  autoplay = true,
  muted = true,
}: VideoEmbedProps) {
  const embedUrl = getEmbedUrl(url, autoplay, muted);

  if (!embedUrl) {
    return null;
  }

  return (
    <>
      <div data-testid="video-embed" className="video-container">
        <iframe
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          src={embedUrl}
          data-testid="styled-iframe"
          className="video-iframe"
        />
      </div>
      <style jsx>{`
        .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          margin: 24px 0;
          border-radius: 8px;
          overflow: hidden;
          background-color: #000;
        }

        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
      `}</style>
    </>
  );
}
