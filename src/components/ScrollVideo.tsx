import { useRef, useEffect } from "react";
import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

interface ScrollVideoProps {
  src: string;
  className?: string;
  poster?: string;
}

const ScrollVideo = ({ src, className = "", poster }: ScrollVideoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (videoRef.current && videoRef.current.duration) {
      // Map scroll progress (0-1) to video duration
      const time = progress * videoRef.current.duration;
      videoRef.current.currentTime = time;
    }
  });

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      // Preload video
      video.load();
    }
  }, [src]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ScrollVideo;
