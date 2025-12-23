import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CraftStepsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || !videoRef.current) return;

    const ctx = gsap.context(() => {
      // Auto-play when section comes into view
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => {
          if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
          }
        },
        onLeave: () => {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        },
        onEnterBack: () => {
          if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
          }
        },
        onLeaveBack: () => {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        }
      });

      // Fade in animation
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Update progress bar
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      const currentProgress = (video.currentTime / video.duration) * 100;
      setProgress(currentProgress);
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = clickPosition * videoRef.current.duration;
  };

  return (
    <section ref={sectionRef} className="bg-charcoal py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Section header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-cream/40 mb-6">
            The Process
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-cream font-light">
            From Earth to Art
          </h2>
          <p className="mt-6 text-cream/50 font-sans text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Watch the journey of clay as it transforms through patient hands into lasting art
          </p>
        </motion.div>

        {/* Video container */}
        <div 
          ref={containerRef}
          className="relative max-w-5xl mx-auto rounded-lg overflow-hidden bg-charcoal/50 group"
        >
          {/* Video */}
          <video
            ref={videoRef}
            src="/video/crafting-process.mp4"
            className="w-full aspect-video object-cover"
            muted={isMuted}
            loop
            playsInline
            preload="metadata"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-charcoal/20 pointer-events-none" />

          {/* Play button overlay (shows when paused) */}
          {!isPlaying && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 flex items-center justify-center hover:bg-cream/20 transition-all duration-300">
                <Play className="w-8 h-8 md:w-10 md:h-10 text-cream ml-1" fill="currentColor" />
              </div>
            </motion.button>
          )}

          {/* Controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Progress bar */}
            <div 
              className="w-full h-1 bg-cream/20 rounded-full mb-4 cursor-pointer"
              onClick={handleProgressClick}
            >
              <motion.div 
                className="h-full bg-cream/60 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Control buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 flex items-center justify-center hover:bg-cream/20 transition-all duration-300"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 text-cream" />
                  ) : (
                    <Play className="w-4 h-4 text-cream ml-0.5" fill="currentColor" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 flex items-center justify-center hover:bg-cream/20 transition-all duration-300"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-cream" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-cream" />
                  )}
                </button>
              </div>

              <button
                onClick={toggleFullscreen}
                className="w-10 h-10 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 flex items-center justify-center hover:bg-cream/20 transition-all duration-300"
              >
                <Maximize className="w-4 h-4 text-cream" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftStepsSection;
