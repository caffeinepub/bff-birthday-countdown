import {
  Bell,
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
import { useBirthdayTune } from "./hooks/useBirthdayTune";
import { useCountdown } from "./hooks/useCountdown";

const BIRTHDAY = new Date("2026-04-05T00:00:00");

const VIDEOS = [
  "/assets/VID_20260321_105637_164-1.mp4",
  "/assets/VID_20260321_105647_786-1.mp4",
];

const PHOTOS = [
  "/assets/uploads/IMG_20260321_232601_440-1.jpg",
  "/assets/uploads/IMG_20260321_232624_941-2.jpg",
  "/assets/uploads/Screenshot_20260320-073950_Instagram-3.png",
];

const PHOTO_LABELS = ["Always Glowing", "Nights to Remember", "Just Being You"];

const MEMORIES = [
  {
    src: PHOTOS[0],
    title: "Always Glowing",
    sub: "The way you light up every photo.",
  },
  {
    src: PHOTOS[1],
    title: "Nights to Remember",
    sub: "You make ordinary nights feel like celebrations.",
  },
  {
    src: PHOTOS[2],
    title: "Just Being You",
    sub: "Effortlessly yourself — that's your superpower.",
  },
];

export default function App() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showStartOverlay, setShowStartOverlay] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const galleryRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const { days, hours, minutes, seconds, isPast } = useCountdown(BIRTHDAY);
  const { isMuted, isStarted, start, toggleMute } = useBirthdayTune();

  // Cycle video every 18s
  useEffect(() => {
    if (showStartOverlay) return;
    const t = setInterval(() => {
      setCurrentVideo((p) => (p + 1) % VIDEOS.length);
    }, 18000);
    return () => clearInterval(t);
  }, [showStartOverlay]);

  // Auto-slide photos every 6s
  useEffect(() => {
    if (showStartOverlay) return;
    const t = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % PHOTOS.length);
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

  const handleStart = useCallback(() => {
    setShowStartOverlay(false);
    start();
    videoRefs.current[0]?.play().catch(() => {});
  }, [start]);

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
              <p style={{ color: "#B3B3B3" }} className="mb-8 text-lg">
                Something special is waiting for you inside.
              </p>
              <button
                type="button"
                {...ocid("start.primary_button")}
                onClick={handleStart}
                className="flex items-center gap-2 px-10 py-4 rounded font-bold text-lg uppercase tracking-wider transition-all hover:brightness-110 hover:scale-105"
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
                src={PHOTOS[2]}
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

        {/* Photo fallback when no video active (very brief) */}
        {PHOTOS.map((photo, i) => (
          <div
            key={photo}
            className="absolute inset-0 transition-opacity duration-[1500ms]"
            style={{
              opacity: i === currentSlide && showStartOverlay ? 1 : 0,
              zIndex: -1,
            }}
          >
            <img
              src={photo}
              alt={PHOTO_LABELS[i]}
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Cinematic dark overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.55) 65%, rgba(11,11,11,1) 100%)",
          }}
        />
        {/* Side vignettes for cinematic feel */}
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
        {/* Letterbox bars */}
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
            <p className="text-base md:text-lg mb-8" style={{ color: "#ccc" }}>
              You deserve every good thing that's coming your way — starting
              April 5.
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
            </div>
          </div>
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
                  src={PHOTOS[2]}
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
                  You make people around you feel genuinely seen. There's
                  something rare about the way you show up — honest, warm, and
                  always yourself. April 5 is just a date on the calendar, but
                  to the people who know you, it's the day someone truly special
                  came into this world. Here's to you, Anvi.
                </p>
                <div className="flex items-center gap-2">
                  <Heart size={14} fill="#E50914" color="#E50914" />
                  <span className="text-sm" style={{ color: "#B3B3B3" }}>
                    April 5, 2026 — Happy Birthday
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
            for Anvi · April 5, 2026
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
