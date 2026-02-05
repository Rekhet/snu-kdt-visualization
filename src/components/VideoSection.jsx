import React, { useRef, useEffect, useState } from "react";
import ReactPlayer from "react-player";

const VideoSection = ({ progress, src, visible }) => {
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (visible && playerRef.current) {
      playerRef.current.seekTo(0);
    }
  }, [visible]);

  // Fade out only at the very end of the phase (last 5%)
  const opacity = progress > 0.95 ? (1 - progress) * 20 : 1;

  return (
    <div
      className="fixed top-16 inset-x-0 bottom-0 flex items-center justify-center bg-black transition-opacity duration-300 pointer-events-none"
      style={{
        opacity: visible ? Math.max(0, Math.min(1, opacity)) : 0,
        zIndex: 45, // Lowered slightly, but still above canvas
        visibility: visible ? "visible" : "hidden",
      }}
    >
      <div className="w-full h-full pointer-events-none">
        <ReactPlayer
          ref={playerRef}
          url={src}
          playing={visible}
          loop={true}
          muted={true}
          playsinline={true}
          width="100%"
          height="100%"
          // Explicitly disable any interaction at the player level
          config={{
            file: {
              attributes: {
                style: { objectFit: "contain", pointerEvents: "none" },
                controlsList: "nodownload nofullscreen noremoteplayback",
              },
            },
          }}
          onReady={() => setIsReady(true)}
          style={{ pointerEvents: "none" }}
        />
      </div>

      {!isReady && visible && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-white/20 text-xs font-mono animate-pulse uppercase tracking-widest">
            Buffering...
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSection;
