
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, Stars, Sparkles, PartyPopper, Zap, Music, Volume2, VolumeX } from 'lucide-react';

// Confetti Particle Component
const Confetti = () => {
  const [particles, setParticles] = useState<{ id: number; left: number; top: number; color: string; angle: number; velocity: number; size: number; shape: 'rect' | 'circle' }[]>([]);

  useEffect(() => {
    const colors = ['#ff758c', '#ffdeeb', '#fecdd3', '#fb7185', '#e11d48', '#fbbf24', '#34d399', '#60a5fa'];
    const newParticles = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      left: 50, // Start from center
      top: 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
      velocity: 5 + Math.random() * 15,
      size: 8 + Math.random() * 12,
      shape: Math.random() > 0.5 ? 'rect' : 'circle' as 'rect' | 'circle',
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: p.shape === 'rect' ? `${p.size * 0.4}px` : `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            transform: `rotate(${p.angle}deg)`,
            animation: `confetti-burst-${p.id} 4s forwards cubic-bezier(0, .9, .57, 1)`,
          }}
        />
      ))}
      <style>{`
        ${particles.map((p) => `
          @keyframes confetti-burst-${p.id} {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(${Math.cos(p.angle * Math.PI / 180) * p.velocity * 40}px, ${Math.sin(p.angle * Math.PI / 180) * p.velocity * 40 + 500}px) rotate(${p.angle * 5}deg);
              opacity: 0;
            }
          }
        `).join('')}
      `}</style>
    </div>
  );
};

// Reusable Heart & Star Background Component
const FloatingElements = () => {
  const [elements, setElements] = useState<{ id: number; left: string; delay: string; size: number; type: string }[]>([]);

  useEffect(() => {
    const items = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      size: Math.floor(Math.random() * (40 - 10 + 1) + 10),
      type: Math.random() > 0.4 ? '💖' : Math.random() > 0.5 ? '✨' : '🍭',
    }));
    setElements(items);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute opacity-40 select-none pointer-events-none"
          style={{
            left: el.left,
            bottom: '-10%',
            animation: `floatUp 15s linear infinite`,
            animationDelay: el.delay,
            fontSize: `${el.size}px`,
          }}
        >
          {el.type}
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg) scale(0.5); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-120vh) rotate(1080deg) scale(1.8); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-5px, 5px); }
          50% { transform: translate(5px, -5px); }
          75% { transform: translate(-5px, -5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out;
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .animate-heart-beat {
          animation: heartBeat 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [accepted, setAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [dodgeMessage, setDodgeMessage] = useState("");
  const [yesScale, setYesScale] = useState(1);
  const [shaking, setShaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('https://www.bensound.com/bensound-music/bensound-love.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        console.log("Autoplay blocked. Waiting for interaction.");
      });
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (accepted && audioRef.current) {
      const fadeInterval = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume -= 0.05;
        } else if (audioRef.current) {
          audioRef.current.pause();
          clearInterval(fadeInterval);
        }
      }, 50);
    }
  }, [accepted]);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const messages = [
    "Too slow! 🏃‍♂️💨",
    "Not that one! ❌",
    "Over here! 👋",
    "Try harder! 😂",
    "Wrong choice! 🙊",
    "I'm a ninja! 🥷",
    "Hehehe! 😜",
    "Keep clicking! 🖱️",
    "Amna, look left! ⬅️",
    "Amna, look right! ➡️",
    "Try again, honey! 😘",
    "Can't touch this! 🕺",
    "Whoops! 🤭",
    "I'm over here now! ✨"
  ];

  const moveButton = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (audioRef.current && audioRef.current.paused && !accepted) {
      audioRef.current.play().catch(() => {});
    }

    let clientX = 0;
    let clientY = 0;
    if (e && 'clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e && 'touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }

    const padding = 120;
    const maxX = window.innerWidth - padding;
    const maxY = window.innerHeight - padding;
    
    let newX, newY;
    if (clientX > window.innerWidth / 2) {
      newX = Math.random() * (window.innerWidth / 2 - padding) + padding / 2;
    } else {
      newX = Math.random() * (window.innerWidth / 2 - padding) + window.innerWidth / 2;
    }

    if (clientY > window.innerHeight / 2) {
      newY = Math.random() * (window.innerHeight / 2 - padding) + padding / 2;
    } else {
      newY = Math.random() * (window.innerHeight / 2 - padding) + window.innerHeight / 2;
    }

    newX = Math.min(Math.max(padding / 2, newX), maxX);
    newY = Math.min(Math.max(padding / 2, newY), maxY);

    setNoButtonPos({ x: newX, y: newY });
    setHasMoved(true);
    setDodgeCount(prev => prev + 1);
    setDodgeMessage(messages[Math.floor(Math.random() * messages.length)]);
    setYesScale(prev => Math.min(prev + 0.25, 2.6));
    setShaking(true);
    setTimeout(() => setShaking(false), 200);
    setTimeout(() => setDodgeMessage(""), 1000);
  }, [messages, accepted]);

  const handleYesClick = () => {
    setAccepted(true);
  };

  const questionGif = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWh2bTJyY3NqZnZhZGxyZjg2Y2FlanZhYmI2Y3BqOGVlNWkxamRxMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YQYTflmPzgiwE9cudP/giphy.gif"; 
  const celebrationGif = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGRraWx3cTN1Yngxb2M2YWducDQ2MDltdWVqeG00hG02bnk1bnRrZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/75ZaxapnyMp2w/giphy.gif";

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center overflow-y-auto overflow-x-hidden transition-all duration-700 ${accepted ? 'bg-[#ff758c]' : 'bg-[#fff0f3]'} ${shaking ? 'animate-shake' : ''}`}>
      <FloatingElements />
      {accepted && <Confetti />}

      {/* Mute/Music Toggle */}
      <button 
        onClick={toggleMute}
        className="fixed top-6 right-6 z-[100] bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg border-2 border-rose-100 hover:scale-110 transition-transform text-rose-500"
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} className="animate-pulse" />}
      </button>

      <div className="z-10 text-center max-w-2xl w-full flex-1 flex flex-col items-center py-12 md:py-20 px-4">
        {!accepted ? (
          <div className="space-y-8 md:space-y-12 animate-in fade-in zoom-in duration-500 w-full flex flex-col items-center">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white p-2 md:p-3 rounded-full shadow-2xl border-4 border-rose-200 floating overflow-hidden">
                <img 
                  src={questionGif} 
                  alt="Cute Proposal"
                  className="w-36 h-36 md:w-56 md:h-56 object-cover rounded-full"
                />
              </div>
              <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 bg-white p-3 md:p-4 rounded-full shadow-xl z-20 border-2 border-rose-50 animate-heart-beat">
                <Heart className="text-rose-500 fill-rose-500 w-6 h-6 md:w-8 md:h-8" />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6 w-full">
              <h1 className="text-4xl md:text-8xl font-bold text-rose-600 font-pacifico drop-shadow-xl select-none leading-tight">
                Amna Shaheer
              </h1>
              <p className="text-xl md:text-4xl text-rose-500 font-bold tracking-tight animate-pulse flex items-center justify-center gap-2">
                Will you be my Valentine? 
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 mt-8 md:mt-16 relative min-h-[160px] md:min-h-[200px] w-full">
              {/* YES BUTTON */}
              <div className="flex items-center justify-center transition-all duration-300" style={{ transform: `scale(${yesScale})` }}>
                <button
                  onClick={handleYesClick}
                  className="px-10 py-4 md:px-14 md:py-6 bg-gradient-to-r from-rose-600 via-pink-600 to-rose-600 bg-[length:200%_auto] hover:bg-right text-white text-2xl md:text-4xl font-black rounded-full shadow-[0_15px_30px_-5px_rgba(244,63,94,0.5)] active:scale-95 transition-all duration-300 flex items-center gap-3 md:gap-4 group z-30"
                >
                  <span>YES!</span>
                  <Zap className="w-6 h-6 md:w-8 md:h-8 group-hover:fill-current group-hover:scale-125 transition-all" />
                </button>
              </div>

              {/* NO BUTTON - dodging logic */}
              <div className="relative h-16 md:h-20 flex items-center">
                {dodgeMessage && (
                  <div className="fixed pointer-events-none" style={{ 
                    left: `${noButtonPos.x}px`, 
                    top: `${noButtonPos.y - 60}px`, 
                    zIndex: 110,
                    transition: 'all 0.1s'
                  }}>
                    <div className="bg-white text-rose-500 px-4 py-1.5 md:px-6 md:py-2 rounded-2xl text-base md:text-lg font-black shadow-xl border-2 border-rose-100 whitespace-nowrap animate-bounce">
                      {dodgeMessage}
                    </div>
                  </div>
                )}
                <button
                  ref={noBtnRef}
                  onMouseEnter={(e) => moveButton(e)}
                  onTouchStart={(e) => { e.preventDefault(); moveButton(e); }}
                  onClick={(e) => { e.preventDefault(); moveButton(e); }}
                  style={hasMoved ? {
                    position: 'fixed',
                    left: `${noButtonPos.x}px`,
                    top: `${noButtonPos.y}px`,
                    transition: 'all 0.1s cubic-bezier(0.19, 1, 0.22, 1)',
                    zIndex: 100,
                    transform: `rotate(${dodgeCount * 15}deg)`
                  } : {}}
                  className="px-10 py-4 md:px-12 md:py-6 bg-white text-gray-300 text-2xl md:text-3xl font-bold rounded-full shadow-inner border-4 border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
            
            <div className="min-h-[4rem] flex items-center justify-center pb-20 md:pb-0">
              {dodgeCount > 2 && (
                <div className="text-rose-400 font-black text-lg md:text-xl animate-fade-in italic bg-white/50 py-2 px-6 rounded-full inline-block backdrop-blur-sm shadow-sm text-center">
                   Resistance is futile, Amna! Just say YES! 😂
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in zoom-in-50 duration-1000 pb-24 md:pb-32 flex flex-col items-center">
            <div className="space-y-6">
              <div className="flex justify-center gap-4 mb-4">
                <PartyPopper className="w-12 h-12 md:w-16 md:h-16 text-white animate-bounce" />
                <Music className="w-12 h-12 md:w-16 md:h-16 text-white animate-pulse" />
                <PartyPopper className="w-12 h-12 md:w-16 md:h-16 text-white animate-bounce delay-100" />
              </div>
              <h2 className="text-5xl md:text-9xl font-bold text-white font-pacifico drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)]">
                Yayyyy! 💖
              </h2>
              <p className="text-2xl md:text-5xl text-rose-100 font-black tracking-widest uppercase text-center">
                Best. Valentine. Ever.
              </p>
            </div>

            <div className="relative group mx-auto max-w-lg px-4 scale-100 md:scale-125 mt-10 md:mt-20">
              <div className="absolute inset-0 bg-white blur-[80px] md:blur-[100px] opacity-40 rounded-full animate-pulse"></div>
              <img 
                src={celebrationGif} 
                alt="Celebration"
                className="w-full h-auto rounded-3xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.4)] relative z-10 border-4 md:border-8 border-white animate-heart-beat"
              />
              <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 z-[70] scale-75 md:scale-100">
                 <div className="bg-white p-4 md:p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-2 animate-bounce rotate-12">
                    <Stars className="text-yellow-400 fill-yellow-400 w-8 h-8 md:w-12 md:h-12" />
                    <span className="font-black text-rose-600 text-lg md:text-xl whitespace-nowrap">SO HAPPY!</span>
                 </div>
              </div>
            </div>

            <div className="pt-16 md:pt-24 flex justify-center w-full z-20">
              <button 
                onClick={() => {
                  window.location.reload(); 
                }}
                className="bg-white/20 hover:bg-white/30 text-white px-10 py-4 rounded-full text-xl font-bold backdrop-blur-md transition-all border border-white/40 shadow-lg active:scale-95"
              >
                Start Over 😍
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Layer */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute top-20 left-20 text-rose-300 opacity-20 animate-bounce hidden md:block">
           <Heart size={120} className="fill-current" />
        </div>
        <div className="absolute bottom-20 right-20 text-rose-300 opacity-20 animate-pulse hidden md:block">
           <Heart size={150} className="fill-current" />
        </div>
      </div>
    </div>
  );
};

export default App;
