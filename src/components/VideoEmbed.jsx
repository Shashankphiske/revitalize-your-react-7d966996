import React from 'react';

const VideoEmbed = ({ videoId, title = "Learn Algorithm from Video" }) => {
  if (!videoId) {
    return (
      <div className="mb-8 p-6 glass-card rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">Learn Algorithm from Video</h2>
        <p className="text-gray-400">Video tutorial not available for this algorithm yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 glass-card rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
        <span>🎥</span>
        <span>{title}</span>
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        Watch this video to understand the algorithm better before exploring the interactive visualization below.
      </p>
      <div className="youtube-embed-container">
        <iframe
          className="youtube-embed"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Algorithm Tutorial"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default VideoEmbed;
