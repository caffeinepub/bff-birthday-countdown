import {
  Bell,
  Cake,
  Heart,
  Play,
  Share2,
  Star,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CountdownUnit } from "./components/CountdownUnit";
import { Sparkles } from "./components/Sparkles";
import { useCountdown } from "./hooks/useCountdown";

const BIRTHDAY = new Date("2026-04-05T00:00:00");
const DOB = new Date("2009-04-05");
const DAYS_ALIVE = Math.floor(
  (BIRTHDAY.getTime() - DOB.getTime()) / (1000 * 60 * 60 * 24),
);

const VIDEOS = [
  "/assets/VID_20260321_105637_164-1.mp4",
  "/assets/VID_20260321_105647_786-1.mp4",
];

// Audio source from video
const AUDIO_SRC = "/assets/VID_20260321_105647_786-1.mp4";

const MEMORIES = [
  {
    src: "/assets/uploads/IMG_20260321_232601_440-1.jpg",
    title: "Always Glowing",
    sub: "The way you light up every photo.",
  },
  {
    src: "/assets/uploads/IMG_20260321_232624_941-2.jpg",
    title: "Nights to Remember",
    sub: "You make ordinary nights feel like celebrations.",
  },
  {
    src: "/assets/uploads/Screenshot_20260320-073950_Instagram-3.png",
    title: "Just Being You",
    sub: "Effortlessly yourself — that's your superpower.",
  },
  {
    src: "/assets/uploads/IMG_20250921_165833_555-1.jpg",
    title: "Golden Hour",
    sub: "You were made for moments like this.",
  },
  {
    src: "/assets/uploads/IMG_20250801_003250_654-2.jpg",
    title: "Late Night Vibes",
    sub: "The best memories happen when the clock doesn't matter.",
  },
  {
    src: "/assets/uploads/IMG_20250801_003114_361-3.jpg",
    title: "Squad Energy",
    sub: "Better together, always.",
  },
  {
    src: "/assets/uploads/IMG_20250801_003110_228-4.jpg",
    title: "Candid & Carefree",
    sub: "The real ones are always the best ones.",
  },
  {
    src: "/assets/uploads/IMG_20250801_003107_147-5.jpg",
    title: "Pure Joy",
    sub: "This smile — absolutely infectious.",
  },
  {
    src: "/assets/uploads/IMG_20250801_003146_413-6.jpg",
    title: "Unfiltered",
    sub: "No filter needed when you're this real.",
  },
  {
    src: "/assets/uploads/IMG_20250801_003347_815-7.jpg",
    title: "Main Character",
    sub: "Because that's exactly what you are.",
  },
  {
    src: "/assets/uploads/IMG_20251206_232657_984-8.jpg",
    title: "December Magic",
    sub: "Some moments just feel like they were meant to last.",
  },
];

const VIDEO_MEMORIES = [
  {
    src: "/assets/VID_20260321_105637_164-1.mp4",
    poster: "/assets/uploads/IMG_20260321_232601_440-1.jpg",
    title: "A Moment in Time",
    sub: "Some moments are better experienced than described.",
  },
  {
    src: "/assets/VID_20260321_105647_786-1.mp4",
    poster: "/assets/uploads/IMG_20260321_232624_941-2.jpg",
    title: "Just Like That",
    sub: "The real ones never need a reason to make you smile.",
  },
];

const AGE_STATS = [
  { value: "17", label: "Years Young" },
  { value: `${DAYS_ALIVE.toLocaleString()}+`, label: "Days Alive" },
  { value: "∞", label: "Memories Made" },
  { value: "1", label: "Best Day Ahead" },
];

const SLIDESHOW_PHOTOS = MEMORIES.map((m) => m.src);

function VideoCard({
  video,
  index,
}: {
  video: (typeof VIDEO_MEMORIES)[0];
  index: number;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
    } else {
      v.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleEnded = () => setIsPlaying(false);

  return (
    <motion.div
      {...{ "data-ocid": `gallery.item.${MEMORIES.length + index + 1}` }}
      whileHover={{ scale: 1.04, zIndex: 10 }}
      transition={{ duration: 0.3 }}
      className="gallery-card flex-shrink-0 relative rounded-lg overflow-hidden snap-start cursor-pointer"
      style={{
        width: "clamp(200px, 30vw, 320px)",
        aspectRatio: "2/3",
        border: "1px solid #2A2A2A",
      }}
      onClick={handleClick}
    >
      <video
        ref={videoRef}
        src={video.src}
        poster={video.poster}
        muted
        playsInline
        onEnded={handleEnded}
        className="w-full h-full object-cover"
      />
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)",
        }}
      />
      {/* Badge */}
      <div
        className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-bold uppercase"
        style={{ backgroundColor: "#E50914", color: "#fff" }}
      >
        Video
      </div>
      {/* Play icon overlay */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            key="play-icon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(229,9,20,0.85)" }}
            >
              <Play size={28} fill="white" color="white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Title */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-semibold text-sm text-white">{video.title}</p>
        <p className="text-xs" style={{ color: "#B3B3B3" }}>
          {video.sub}
        </p>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [_currentSlide, setCurrentSlide] = useState(0);
  const [showStartOverlay, setShowStartOverlay] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [isMuted, setIsMuted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const audioRef = useRef<HTMLVideoElement>(null);

  const { days, hours, minutes, seconds, isPast } = useCountdown(BIRTHDAY);

  // Cycle video every 18s
  useEffect(() => {
    if (showStartOverlay) return;
    const t = setInterval(() => {
      setCurrentVideo((p) => (p + 1) % VIDEOS.length);
    }, 18000);
    return () => clearInterval(t);
  }, [showStartOverlay]);

  // Auto-slide photos (for overlay state)
  useEffect(() => {
    if (showStartOverlay) return;
    const t = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % SLIDESHOW_PHOTOS.length);
    }, 6000);
    return () => clearInterval(t);
  }, [showStartOverlay]);

  // Play/pause videos based on active index
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === currentVideo) {
        v.play().catch(() => {});
      } else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [currentVideo]);

  // Mute/unmute audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleStart = useCallback(() => {
    setShowStartOverlay(false);
    setIsStarted(true);
    videoRefs.current[0]?.play().catch(() => {});
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const toggleMute = useCallback(() => setIsMuted((m) => !m), []);

  const scrollTo = useCallback(
    (ref: React.RefObject<HTMLDivElement | null>) => {
      ref.current?.scrollIntoView({ behavior: "smooth" });
    },
    [],
  );

  const progress = isPast
    ? 100
    : Math.max(
        0,
        Math.min(
          100,
          ((new Date("2026-01-01").getTime() - new Date().getTime()) /
            (new Date("2026-01-01").getTime() - BIRTHDAY.getTime())) *
            100 *
            -1 +
            100,
        ),
      );

  const ocid = (id: string) => ({ "data-ocid": id });

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#0b0b0b",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Hidden audio player using video file */}
      <video
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        muted
        playsInline
        style={{ display: "none" }}
      />

      {/* Entrance overlay */}
      <AnimatePresence>
        {showStartOverlay && (
          <motion.div
            key="overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ backgroundColor: "#0b0b0b" }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center px-6"
            >
              <div
                className="text-8xl font-bold mb-4"
                style={{
                  color: "#E50914",
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              >
                N
              </div>
              <h1
                className="text-4xl md:text-5xl font-bold mb-3 tracking-widest uppercase"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Anvi&apos;s Birthday
              </h1>
              <p style={{ color: "#B3B3B3" }} className="mb-2 text-lg">
                Something special is waiting for you inside.
              </p>
              <p className="mb-8 text-sm" style={{ color: "#E50914" }}>
                Turning 17 · April 5, 2026
              </p>
              <button
                type="button"
                {...ocid("start.primary_button")}
                onClick={handleStart}
                className="flex items-center gap-2 px-10 py-4 rounded font-bold text-lg uppercase tracking-wider transition-all hover:brightness-110 hover:scale-105 mx-auto"
                style={{ backgroundColor: "#E50914", color: "#fff" }}
              >
                <Play size={20} fill="white" />
                Enter
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <header
        className="fixed top-0 left-0 right-0 z-40 nav-blur"
        style={{
          backgroundColor: "rgba(11,11,11,0.92)",
          borderBottom: "1px solid #2A2A2A",
        }}
        {...ocid("nav.panel")}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-3xl font-black leading-none"
              style={{
                color: "#E50914",
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              N
            </span>
            <span
              className="hidden sm:block text-sm font-bold uppercase tracking-widest"
              style={{ color: "#fff" }}
            >
              Anvi&apos;s Birthday
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {["Home", "Gallery", "About"].map((item) => (
              <button
                key={item}
                type="button"
                {...ocid(`nav.${item.toLowerCase()}.link`)}
                onClick={() => {
                  setActiveSection(item.toLowerCase());
                  if (item === "Gallery") scrollTo(galleryRef);
                  if (item === "About") scrollTo(aboutRef);
                  if (item === "Home")
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-sm font-medium transition-colors hover:text-white"
                style={{
                  color:
                    activeSection === item.toLowerCase() ? "#fff" : "#B3B3B3",
                }}
              >
                {item}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              {...ocid("nav.mute.toggle")}
              onClick={isStarted ? toggleMute : handleStart}
              className="p-2 rounded-full transition-colors hover:bg-white/10"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX size={18} color="#B3B3B3" />
              ) : (
                <Volume2 size={18} color={isStarted ? "#E50914" : "#B3B3B3"} />
              )}
            </button>
            <button
              type="button"
              className="p-2 rounded-full transition-colors hover:bg-white/10"
            >
              <Bell size={18} color="#B3B3B3" />
            </button>
            <div
              className="w-8 h-8 rounded overflow-hidden border-2"
              style={{ borderColor: "#E50914" }}
            >
              <img
                src={MEMORIES[2].src}
                alt="Anvi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* HERO — cinematic video bg */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "100svh", minHeight: "600px" }}
      >
        {/* Video backgrounds */}
        {VIDEOS.map((src, i) => (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={src}
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms]"
            style={{ opacity: i === currentVideo ? 1 : 0 }}
          />
        ))}

        {/* Cinematic dark overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.55) 65%, rgba(11,11,11,1) 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-32 z-[1]"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.6), transparent)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-32 z-[1]"
          style={{
            background:
              "linear-gradient(to left, rgba(0,0,0,0.6), transparent)",
          }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-14 z-[1]"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-14 z-[1]"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        />

        <Sparkles />

        {/* Hero content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 pt-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <p
              className="uppercase tracking-[0.5em] text-sm mb-2"
              style={{ color: "#E50914" }}
            >
              ✦ April 5, 2026 ✦
            </p>
            <h1
              className="leading-none mb-2"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3.5rem, 12vw, 10rem)",
              }}
            >
              <span style={{ color: "#fff" }}>ANVI&apos;S </span>
              <span style={{ color: "#E50914" }}>BIG DAY</span>
            </h1>

            {/* Age badge row */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold"
                style={{ backgroundColor: "#E50914", color: "#fff" }}
              >
                <Cake size={13} />
                17
              </span>
              <span className="text-sm" style={{ color: "#B3B3B3" }}>
                Born 2009 · Turning 17 on April 5
              </span>
            </div>

            <p className="text-base md:text-lg mb-8" style={{ color: "#ccc" }}>
              Turning 17 and absolutely thriving. You deserve every good thing
              that&apos;s coming your way — starting April 5.
            </p>

            {isPast ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-3xl md:text-5xl font-bold mb-8"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  color: "#E50914",
                }}
              >
                Happy Birthday Anvi!
              </motion.div>
            ) : (
              <div
                className="flex items-start justify-center gap-2 md:gap-6 mb-8"
                {...ocid("countdown.panel")}
              >
                <CountdownUnit value={days} label="Days" />
                <span
                  className="countdown-digit mt-0"
                  style={{
                    fontSize: "clamp(3rem, 9vw, 8rem)",
                    lineHeight: 1,
                    fontFamily: "'Bebas Neue', monospace",
                    color: "#E50914",
                  }}
                >
                  :
                </span>
                <CountdownUnit value={hours} label="Hours" />
                <span
                  className="countdown-digit"
                  style={{
                    fontSize: "clamp(3rem, 9vw, 8rem)",
                    lineHeight: 1,
                    fontFamily: "'Bebas Neue', monospace",
                    color: "#E50914",
                  }}
                >
                  :
                </span>
                <CountdownUnit value={minutes} label="Mins" />
                <span
                  className="countdown-digit"
                  style={{
                    fontSize: "clamp(3rem, 9vw, 8rem)",
                    lineHeight: 1,
                    fontFamily: "'Bebas Neue', monospace",
                    color: "#E50914",
                  }}
                >
                  :
                </span>
                <CountdownUnit value={seconds} label="Secs" />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <button
                type="button"
                {...ocid("hero.share.primary_button")}
                className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm uppercase tracking-wider transition-all hover:brightness-110 hover:scale-105"
                style={{ backgroundColor: "#E50914", color: "#fff" }}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Anvi's Birthday!",
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share2 size={16} />
                Share
              </button>
              <button
                type="button"
                {...ocid("hero.gallery.secondary_button")}
                className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm uppercase tracking-wider transition-all hover:bg-white hover:text-black border-2"
                style={{
                  borderColor: "#fff",
                  color: "#fff",
                  backgroundColor: "transparent",
                }}
                onClick={() => scrollTo(galleryRef)}
              >
                <Play size={16} fill="white" />
                Memories
              </button>
            </div>

            <div
              className="w-full max-w-md mx-auto h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: "#2A2A2A" }}
            >
              <div
                className="netflix-progress h-full rounded-full transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs mt-1" style={{ color: "#555" }}>
              Counting down to April 5
            </p>
          </motion.div>
        </div>

        {/* Video switch indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {VIDEOS.map((_, i) => (
            <button
              // biome-ignore lint/suspicious/noArrayIndexKey: index is position
              key={i}
              type="button"
              {...ocid("hero.video.toggle")}
              onClick={() => setCurrentVideo(i)}
              aria-label={`Go to video ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === currentVideo ? "28px" : "8px",
                height: "4px",
                borderRadius: "2px",
                backgroundColor: i === currentVideo ? "#E50914" : "#666",
              }}
            />
          ))}
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section
        ref={galleryRef}
        className="py-12 px-4 md:px-8"
        style={{ backgroundColor: "#0b0b0b" }}
        {...ocid("gallery.section")}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-1 h-8 rounded"
              style={{ backgroundColor: "#E50914" }}
            />
            <h2
              className="text-2xl md:text-3xl font-bold uppercase tracking-widest"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "0.2em",
              }}
            >
              Memories
            </h2>
          </div>

          <div className="relative">
            <div
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none" }}
            >
              {MEMORIES.map((m, i) => (
                <motion.div
                  key={m.src}
                  {...ocid(`gallery.item.${i + 1}`)}
                  whileHover={{ scale: 1.04, zIndex: 10 }}
                  transition={{ duration: 0.3 }}
                  className="gallery-card flex-shrink-0 relative rounded-lg overflow-hidden snap-start cursor-pointer"
                  style={{
                    width: "clamp(200px, 30vw, 320px)",
                    aspectRatio: "2/3",
                    border: "1px solid #2A2A2A",
                  }}
                >
                  <img
                    src={m.src}
                    alt={m.title}
                    className="gallery-card-img w-full h-full object-cover transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)",
                    }}
                  />
                  <div
                    className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-bold uppercase"
                    style={{ backgroundColor: "#E50914", color: "#fff" }}
                  >
                    Anvi
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-semibold text-sm text-white">
                      {m.title}
                    </p>
                    <p className="text-xs" style={{ color: "#B3B3B3" }}>
                      {m.sub}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Video cards */}
              {VIDEO_MEMORIES.map((v, i) => (
                <VideoCard key={v.src} video={v} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AGE MILESTONES SECTION */}
      <section
        className="py-16 px-4 md:px-8"
        style={{ backgroundColor: "#0b0b0b" }}
        {...ocid("milestones.section")}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-1 h-8 rounded"
              style={{ backgroundColor: "#E50914" }}
            />
            <h2
              className="text-2xl md:text-3xl font-bold uppercase tracking-widest"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "0.2em",
              }}
            >
              17 Years of Anvi
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-xl p-8 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #161616 0%, #0d0d0d 100%)",
              border: "1px solid #2A2A2A",
            }}
          >
            {/* Glow accent */}
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-15 blur-3xl"
              style={{ backgroundColor: "#E50914" }}
            />
            <div
              className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full opacity-10 blur-3xl"
              style={{ backgroundColor: "#E50914" }}
            />

            {/* Intro text */}
            <div className="mb-8 relative">
              <p
                className="text-base leading-relaxed"
                style={{ color: "#ccc" }}
              >
                From{" "}
                <span style={{ color: "#E50914", fontWeight: 700 }}>2009</span>{" "}
                to{" "}
                <span style={{ color: "#E50914", fontWeight: 700 }}>2026</span>{" "}
                — 17 years of being exactly who you are. Here&apos;s what those
                years look like in numbers:
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AGE_STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center justify-center p-5 rounded-lg text-center relative overflow-hidden"
                  style={{
                    background: "rgba(229,9,20,0.07)",
                    border: "1px solid rgba(229,9,20,0.25)",
                  }}
                >
                  <span
                    className="text-3xl md:text-4xl font-black leading-none mb-1"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      color: "#E50914",
                      textShadow: "0 0 20px rgba(229,9,20,0.5)",
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "#B3B3B3" }}
                  >
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Fun fact strip */}
            <div
              className="mt-6 p-4 rounded-lg flex items-center gap-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid #2A2A2A",
              }}
            >
              <Cake size={18} style={{ color: "#E50914", flexShrink: 0 }} />
              <p className="text-sm" style={{ color: "#B3B3B3" }}>
                Born <strong style={{ color: "#fff" }}>April 5, 2009</strong> ·
                That makes April 5, 2026 your official{" "}
                <strong style={{ color: "#E50914" }}>17th birthday</strong> · 17
                years of smiles, laughs, and being absolutely unforgettable.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT HER SECTION */}
      <section
        ref={aboutRef}
        className="py-16 px-4 md:px-8"
        style={{ backgroundColor: "#111" }}
        {...ocid("about.section")}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-1 h-8 rounded"
              style={{ backgroundColor: "#E50914" }}
            />
            <h2
              className="text-2xl md:text-3xl font-bold uppercase tracking-widest"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: "0.2em",
              }}
            >
              For Anvi
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-xl p-8 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
              border: "1px solid #2A2A2A",
            }}
          >
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: "#E50914" }}
            />
            <div className="flex items-start gap-6">
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-2 flex-shrink-0"
                style={{ borderColor: "#E50914" }}
              >
                <img
                  src={MEMORIES[2].src}
                  alt="Anvi"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} fill="#E50914" color="#E50914" />
                  <span
                    className="text-lg font-bold"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Anvi — @kanhapriyeh_
                  </span>
                </div>
                <p
                  className="text-base leading-relaxed mb-4"
                  style={{ color: "#ccc" }}
                >
                  You make people around you feel genuinely seen. There&apos;s
                  something rare about the way you show up — honest, warm, and
                  always yourself. April 5 is just a date on the calendar, but
                  to the people who know you, it&apos;s the day someone truly
                  special came into this world. Here&apos;s to you, Anvi.
                </p>
                <div className="flex items-center gap-2">
                  <Heart size={14} fill="#E50914" color="#E50914" />
                  <span className="text-sm" style={{ color: "#B3B3B3" }}>
                    Turning 17 on April 5, 2026
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="py-8 px-4 text-center"
        style={{ backgroundColor: "#0b0b0b", borderTop: "1px solid #2A2A2A" }}
      >
        <div className="flex flex-col items-center gap-3">
          <span
            className="text-2xl font-black"
            style={{ color: "#E50914", fontFamily: "'Bebas Neue', sans-serif" }}
          >
            N ANVI&apos;S BIRTHDAY
          </span>
          <p className="text-sm" style={{ color: "#666" }}>
            Made with{" "}
            <Heart
              size={12}
              className="inline"
              fill="#E50914"
              color="#E50914"
            />{" "}
            for Anvi · Turning 17 on April 5, 2026
          </p>
          <p className="text-xs" style={{ color: "#444" }}>
            © {new Date().getFullYear()}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              Built with love using caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
