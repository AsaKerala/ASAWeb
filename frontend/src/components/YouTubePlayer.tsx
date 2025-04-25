import React from 'react';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, title }) => {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <iframe 
        width="100%" 
        height="100%" 
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || "YouTube video player"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
};

export default YouTubePlayer; 