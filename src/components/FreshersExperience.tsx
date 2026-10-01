"use client";

import { useState, useRef, useEffect } from "react";
import NeonBorder from "@/components/NeonBorder";

type Stage = "question" | "bolt" | "welcome" | "invitation";
type BoltPhase = "idle" | "exiting";

interface FreshersExperienceProps {
  mode?: "mobile" | "pc" | "auto";
}

const EVENT = {
  title: "FRESHERS PARTY",
  year: "2026",
  date: "3 OCT 2026",
  day: "SATURDAY",
  time: "9 AM TO 1 PM",
  venue: "MECHANICAL SEMINAR HALL",
};

export default function FreshersExperience({ mode = "auto" }: FreshersExperienceProps) {
  const [stage, setStage] = useState<Stage>("question");
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [tapCount, setTapCount] = useState(0);
  const [boltPhase, setBoltPhase] = useState<BoltPhase>("idle");
  const [boltPulseKey, setBoltPulseKey] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState("");
  const lastTapTimeRef = useRef(0);
  const lastYesTimeRef = useRef(0);

  const isMobile = mode === "mobile";
  const isPC = mode === "pc";

  // =====================================
  // BOMB BLAST SOUND  💥
  // =====================================
  const playBombBlast = () => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Layer 1: White noise burst
      const bufferSize = ctx.sampleRate * 0.5;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        noiseData[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(1.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      const hpFilter = ctx.createBiquadFilter();
      hpFilter.type = "highpass";
      hpFilter.frequency.value = 200;

      noiseSource.connect(hpFilter);
      hpFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(now);
      noiseSource.stop(now + 0.5);

      // Layer 2: Deep bass boom
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = "sine";
      bassOsc.frequency.setValueAtTime(120, now);
      bassOsc.frequency.exponentialRampToValueAtTime(20, now + 0.8);

      bassGain.gain.setValueAtTime(0, now);
      bassGain.gain.linearRampToValueAtTime(1.4, now + 0.02);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.85);

      if ("vibrate" in navigator) {
        try { navigator.vibrate([70, 30, 100]); } catch {}
      }
    } catch {
      // Audio playback fails gracefully if muted
    }
  };

  // =====================================
  // DEEP BASS WELCOME VOICE
  // =====================================
  const speakWelcome = () => {
    if (!("speechSynthesis" in window)) {
      setTimeout(() => setStage("invitation"), 2500);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance("Welcome... to the club.");
      speech.rate = 0.68;
      speech.pitch = 0.35;
      speech.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const maleVoice =
        voices.find(
          (v) =>
            v.name.toLowerCase().includes("male") ||
            v.name.toLowerCase().includes("david") ||
            v.name.toLowerCase().includes("guy")
        ) || voices[0];

      if (maleVoice) speech.voice = maleVoice;

      speech.onend = () => {
        setTimeout(() => {
          playBombBlast();
          setStage("invitation");
        }, 500);
      };

      window.speechSynthesis.speak(speech);
    } catch {}

    setTimeout(() => {
      setStage((current) => (current === "welcome" ? "invitation" : current));
    }, 4500);
  };

  // =====================================
  // METALLIC CLANK SOUND
  // =====================================
  const playTapClick = () => {
    try {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);

      if ("vibrate" in navigator) {
        try { navigator.vibrate(25); } catch {}
      }
    } catch { /* ignore */ }
  };

  // =====================================
  // YES BUTTON HANDLER — Instant UI response
  // =====================================
  const handleYes = () => {
    const now = Date.now();
    if (now - lastYesTimeRef.current < 250) return;
    lastYesTimeRef.current = now;

    // Transition stage first so mobile UI reacts immediately
    setStage("bolt");
    setTapCount(0);
    setBoltPhase("idle");

    playBombBlast();
  };

  // =====================================
  // BOLT TAP HANDLER — 5 taps
  // =====================================
  const handleBoltTap = () => {
    if (boltPhase === "exiting") return;

    const now = Date.now();
    if (now - lastTapTimeRef.current < 100) return;
    lastTapTimeRef.current = now;

    const next = tapCount + 1;
    setTapCount(next);
    setBoltPulseKey((k) => k + 1);

    if (next >= 5) {
      setBoltPhase("exiting");
      playBombBlast();
      setTimeout(() => {
        setStage("welcome");
        setTimeout(() => speakWelcome(), 700);
      }, 2800);
    } else {
      playTapClick();
    }
  };

  // Keyboard shortcut for PC (Space or Enter to unscrew bolt)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (stage === "bolt" && (e.code === "Space" || e.code === "Enter")) {
        e.preventDefault();
        handleBoltTap();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stage, boltPhase, tapCount]);

  // =====================================
  // ESCAPING NO BUTTON
  // =====================================
  const escapeNo = () => {
    playBombBlast();
    const dirX = Math.random() > 0.5 ? 1 : -1;
    const dirY = Math.random() > 0.5 ? 1 : -1;
    const jumpX = dirX * (45 + Math.random() * 65);
    const jumpY = dirY * (35 + Math.random() * 55);
    setNoOffset({ x: jumpX, y: jumpY });
  };

  // =====================================
  // SHARING & COPYING
  // =====================================
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const fullUrl = window.location.href;
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopyFeedback("Copied!");
        setTimeout(() => setCopyFeedback(""), 2500);
      });
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== "undefined") {
      const fullUrl = window.location.href;
      const msg = `🎉 *FRESHERS PARTY 2026*\n🏛️ *Dept. of Mechanical Engineering*\n📍 Mechanical Seminar Hall\n🗓️ 3 OCT 2026 (9 AM - 1 PM)\n\n👉 Open your interactive invitation card here:\n${fullUrl}`;
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, "_blank");
    }
  };

  return (
    <main className={`page ${isMobile ? "mobileMode" : ""} ${isPC ? "pcMode" : ""}`}>
      {/* BACKGROUND */}
      <div className="grid" />
      <div className="gear gear1">⚙</div>
      <div className="gear gear2">⚙</div>
      <div className="gear gear3">⚙</div>
      <div className="piston piston1"><div /></div>
      <div className="piston piston2"><div /></div>

      {/* =========================================
          STAGE 1 — QUESTION
      ========================================= */}
      {stage === "question" && (
        <section className="stage fadeIn">
          <p className="smallTitle">DEPARTMENT OF MECHANICAL ENGINEERING</p>

          <div className="questionShell">
            <div className="borderLayer">
              <NeonBorder
                color="#FFD700"
                rounded={25}
                thickness={2}
                borderSize={isMobile ? 38 : 45}
                glow={isMobile ? 30 : 40}
                movement="continuous"
                speed={15}
              />
            </div>
            <div className="questionCard">
              <div className="miniGear">⚙</div>
              <h2>
                ARE YOU A
                <br />
                MECHANICAL ENGINEER?
              </h2>

              <div className="buttonRow">
                <button
                  type="button"
                  className="yesButton"
                  onClick={handleYes}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleYes();
                  }}
                >
                  YES
                </button>

                <button
                  type="button"
                  className="noButton"
                  style={{
                    transform: `translate(${noOffset.x}px, ${noOffset.y}px)`,
                  }}
                  onMouseEnter={escapeNo}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    escapeNo();
                  }}
                  onClick={escapeNo}
                >
                  NO
                </button>
              </div>
            </div>
          </div>

          <p className="hint">
            {isPC ? "CHOOSE CAREFULLY • HOVER OVER BUTTONS" : "CHOOSE CAREFULLY • TAP TO SELECT"}
          </p>
        </section>
      )}

      {/* =========================================
          STAGE 2 — BOLT + SPANNER (tap 5×)
      ========================================= */}
      {stage === "bolt" && (
        <section className="stage boltStage">
          <div className="boltScene">
            {/* Sparks — only shown when exiting */}
            {boltPhase === "exiting" && (
              <div className="sparks">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className={`spark spark${i + 1}`} />
                ))}
              </div>
            )}

            {/* Bolt — split into NUT + BOLT SHAFT on 5th tap */}
            <div
              className={`boltWrapper ${
                boltPhase === "exiting" ? "boltExiting" : "boltIdle"
              }`}
              onClick={handleBoltTap}
              onTouchEnd={(e) => {
                e.preventDefault();
                handleBoltTap();
              }}
              style={{ touchAction: "manipulation" }}
            >
              {boltPhase === "idle" ? (
                <>
                  <div
                    key={boltPulseKey}
                    className={`boltNut ${tapCount > 0 ? "boltPulse" : ""}`}
                  >
                    🔩
                  </div>
                  <div key={`ripple-${boltPulseKey}`} className="tapRipple" />
                </>
              ) : (
                <>
                  <div className="nutPiece">⬡</div>
                  <div className="boltShaft">▬</div>
                </>
              )}
            </div>

            {/* Spanner — only appears on 5th tap */}
            {boltPhase === "exiting" && (
              <div className="spannerWrapper spannerEntry">
                <div className="spannerArm">
                  <span className="spannerIcon">🔧</span>
                </div>
              </div>
            )}

            {/* Tap counter */}
            <div className="boltLabel">
              {boltPhase === "idle" ? (
                <>
                  <p className="tapInstruction">
                    {isPC ? "TAP THE BOLT (OR PRESS SPACE) TO UNLOCK" : "TAP THE BOLT TO UNLOCK"}
                  </p>
                  <div className="tapDots">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`tapDot ${i < tapCount ? "tapDotFilled" : ""}`}
                      />
                    ))}
                  </div>
                  <p className="tapSubhint">{5 - tapCount} TAPS REMAINING</p>
                </>
              ) : (
                <>
                  <p className="tapInstruction">UNLOCKING YOUR INVITATION...</p>
                  <div className="progressBar">
                    <div className="progressFill" />
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================
          STAGE 3 — WELCOME
      ========================================= */}
      {stage === "welcome" && (
        <section
          className="stage welcomeStage"
          ref={(el) => {
            if (el) {
              try {
                const AC = window.AudioContext || (window as any).webkitAudioContext;
                if (AC) {
                  const ctx2 = new AC();
                  if (ctx2.state === "suspended") ctx2.resume();
                  const now2 = ctx2.currentTime;
                  const buf = ctx2.createBuffer(1, ctx2.sampleRate * 0.25, ctx2.sampleRate);
                  const d = buf.getChannelData(0);
                  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
                  const src = ctx2.createBufferSource();
                  src.buffer = buf;
                  const g = ctx2.createGain();
                  g.gain.setValueAtTime(0.7, now2);
                  g.gain.exponentialRampToValueAtTime(0.001, now2 + 0.25);
                  src.connect(g); g.connect(ctx2.destination);
                  src.start(now2); src.stop(now2 + 0.25);

                  const o = ctx2.createOscillator();
                  const og = ctx2.createGain();
                  o.type = "sine";
                  o.frequency.setValueAtTime(80, now2);
                  o.frequency.exponentialRampToValueAtTime(25, now2 + 0.3);
                  og.gain.setValueAtTime(0.8, now2);
                  og.gain.exponentialRampToValueAtTime(0.001, now2 + 0.3);
                  o.connect(og); og.connect(ctx2.destination);
                  o.start(now2); o.stop(now2 + 0.3);
                }
              } catch {}
            }
          }}
        >
          <div className="welcomeShell">
            <div className="borderLayer">
              <NeonBorder
                color="#FFD700"
                rounded={25}
                thickness={2}
                borderSize={isMobile ? 40 : 55}
                glow={isMobile ? 40 : 55}
                movement="continuous"
                speed={18}
              />
            </div>
            <div className="welcomeCard">
              <div className="soundWave">
                <span /><span /><span /><span /><span /><span /><span />
              </div>
              <p>WELCOME</p>
              <h2>TO THE CLUB</h2>
            </div>
          </div>
        </section>
      )}

      {/* =========================================
          STAGE 4 — INVITATION
      ========================================= */}
      {stage === "invitation" && (
        <section className="stage invitationStage">
          <div className="inviteHeader">
            <p>DEPARTMENT OF</p>
            <h1>MECHANICAL ENGINEERING</h1>
          </div>

          <div className="inviteShell">
            <div className="borderLayer">
              <NeonBorder
                color="#FFD700"
                rounded={18}
                thickness={2}
                borderSize={isMobile ? 40 : 50}
                glow={isMobile ? 28 : 35}
                movement="continuous"
                speed={12}
              />
            </div>
            <div className="inviteCard">
              {/* College Logo with Nellore */}
              <div className="collegeLogo">
                <img src="/logo.png" alt="Narayana Engineering College, Nellore" />
              </div>

              <p className="department">DEPT. OF MECHANICAL ENGINEERING</p>
              <h2>{EVENT.title}</h2>
              <div className="year">{EVENT.year}</div>
              <p className="tagline">
                WHERE GEARS TURN
                <br />
                AND LEGENDS BEGIN
              </p>

              <div className="divider" />

              <div className="details">
                <div className="detail">
                  <div className="detailIcon">◫</div>
                  <span>DATE</span>
                  <strong>{EVENT.date}</strong>
                  <small>{EVENT.day}</small>
                </div>
                <div className="detail">
                  <div className="detailIcon">◷</div>
                  <span>TIME</span>
                  <strong>{EVENT.time}</strong>
                </div>
                <div className="detail">
                  <div className="detailIcon">◉</div>
                  <span>VENUE</span>
                  <strong>{EVENT.venue}</strong>
                </div>
              </div>

              <div className="divider" />

              <div className="closing">
                START YOUR ENGINE
                <br />
                FEEL THE POWER
                <br />
                <strong>OWN THE LIFE.</strong>
              </div>

              {/* ACTION BUTTONS (Share & Copy) */}
              <div className="cardActions">
                <button
                  type="button"
                  className="actionBtn whatsappBtn"
                  onClick={handleShareWhatsApp}
                >
                  📲 Share on WhatsApp
                </button>
                <button
                  type="button"
                  className="actionBtn copyInviteBtn"
                  onClick={handleCopyLink}
                >
                  📋 {copyFeedback || "Copy Invite Link"}
                </button>
              </div>
            </div>
          </div>

          <p className="footer">
            POWERED BY PASSION • DRIVEN BY MECHANICAL
          </p>
        </section>
      )}

      <style>{`
        * { box-sizing: border-box; }

        body {
          margin: 0;
          background: #000;
          -webkit-tap-highlight-color: transparent;
        }

        button { font-family: inherit; }

        .page {
          width: 100%;
          min-height: 100svh;
          overflow-x: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: radial-gradient(
            circle at 50% 45%,
            #171717 0%,
            #080808 34%,
            #000000 70%
          );
          font-family: Arial, Helvetica, sans-serif;
        }

        /* ── GRID & GEAR BACKGROUNDS ── */
        .grid {
          position: fixed;
          inset: 0;
          opacity: 0.12;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px);
          background-size: 55px 55px;
          mask-image: radial-gradient(circle, black, transparent 75%);
        }

        .gear {
          position: fixed;
          color: #fff;
          opacity: 0.07;
          user-select: none;
          pointer-events: none;
          animation: rotateGear 35s linear infinite;
        }
        .gear1 { font-size: 300px; left: -100px; top: -80px; }
        .gear2 { font-size: 250px; right: -80px; bottom: -90px; animation-direction: reverse; }
        .gear3 { font-size: 130px; right: 3%; top: 15%; }

        @keyframes rotateGear { to { transform: rotate(360deg); } }

        .piston {
          width: 32px;
          height: 150px;
          position: fixed;
          opacity: 0.15;
          border: 2px solid white;
          border-radius: 7px;
          pointer-events: none;
        }
        .piston::before {
          content: "";
          position: absolute;
          width: 58px;
          height: 35px;
          left: 50%;
          top: -20px;
          transform: translateX(-50%);
          border: 2px solid white;
          border-radius: 6px;
        }
        .piston div {
          position: absolute;
          width: 10px;
          height: 100px;
          background: white;
          left: 50%;
          transform: translateX(-50%);
          top: 30px;
        }
        .piston1 { left: 6%; bottom: 10%; transform: rotate(-30deg); }
        .piston2 { right: 6%; top: 15%; transform: rotate(30deg); }

        /* ── STAGES ── */
        .stage {
          width: 100%;
          min-height: 100svh;
          padding: 40px 18px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        .fadeIn { animation: fadeIn .6s ease; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .smallTitle {
          margin: 0 0 16px;
          letter-spacing: 7px;
          font-size: 11px;
          color: #aaa;
        }

        /* ── SHELLS ── */
        .questionShell,
        .welcomeShell,
        .inviteShell { position: relative; }

        .questionShell {
          width: min(520px, 92vw);
          height: 390px;
        }

        .borderLayer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .questionCard {
          position: absolute;
          inset: 2px;
          z-index: 2;
          overflow: hidden;
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(255,255,255,.08), rgba(255,255,255,.015));
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,.12);
          padding: 40px 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .miniGear {
          font-size: 38px;
          margin-bottom: 16px;
          animation: rotateGear 8s linear infinite;
        }

        .questionCard h2 {
          letter-spacing: 5px;
          font-weight: 500;
          line-height: 1.35;
          font-size: clamp(20px, 5vw, 32px);
          margin: 0 0 30px;
        }

        /* ── BUTTON ROW: Clean side-by-side without initial overlap ── */
        .buttonRow {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          position: relative;
          width: 100%;
          min-height: 60px;
        }

        .yesButton {
          width: 120px;
          height: 54px;
          border-radius: 100px;
          font-size: 17px;
          letter-spacing: 4px;
          cursor: pointer;
          background: #FFD700;
          color: #000;
          border: none;
          box-shadow: 0 0 24px rgba(255,215,0,.5);
          font-weight: 700;
          position: relative;
          z-index: 10;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          transition: transform .15s ease, box-shadow .2s ease;
        }

        .yesButton:active {
          transform: scale(0.92);
          box-shadow: 0 0 36px rgba(255,215,0,.8);
        }

        .noButton {
          width: 120px;
          height: 54px;
          border-radius: 100px;
          font-size: 17px;
          letter-spacing: 4px;
          cursor: pointer;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.3);
          color: white;
          transition: transform .18s cubic-bezier(0.2, 0.9, 0.3, 1.2);
          position: relative;
          z-index: 5;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .hint {
          margin-top: 25px;
          letter-spacing: 5px;
          font-size: 10px;
          color: #777;
        }

        /* ── BOLT STAGE ── */
        .boltStage { animation: flashIn .4s ease; }

        .boltScene {
          position: relative;
          width: 320px;
          height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .boltWrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
          cursor: pointer;
          user-select: none;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          padding: 20px;
        }

        .boltIdle .boltNut {
          font-size: 115px;
          line-height: 1;
          filter: drop-shadow(0 0 18px rgba(255,215,0,.8))
                  drop-shadow(0 0 40px rgba(255,215,0,.3));
          animation: boltIdlePulse 2.5s ease-in-out infinite;
          transition: transform .1s;
        }

        .boltIdle:active .boltNut {
          transform: scale(0.88);
        }

        @keyframes boltIdlePulse {
          0%, 100% { filter: drop-shadow(0 0 14px rgba(255,215,0,.6))
                              drop-shadow(0 0 30px rgba(255,215,0,.2)); }
          50%      { filter: drop-shadow(0 0 26px rgba(255,215,0,1))
                              drop-shadow(0 0 55px rgba(255,215,0,.5)); }
        }

        .boltPulse { animation: boltTapPulse .28s ease !important; }

        @keyframes boltTapPulse {
          0%   { transform: scale(1);    }
          40%  { transform: scale(1.22); }
          100% { transform: scale(1);    }
        }

        .tapRipple {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 130px;
          height: 130px;
          margin: -65px 0 0 -65px;
          border-radius: 50%;
          border: 3px solid rgba(255,215,0,.8);
          pointer-events: none;
          animation: tapRippleAnim .5s ease-out forwards;
        }

        @keyframes tapRippleAnim {
          from { transform: scale(0.6); opacity: 1; }
          to   { transform: scale(1.8); opacity: 0; }
        }

        .boltExiting { pointer-events: none; }

        .nutPiece {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 75px;
          line-height: 1;
          color: #FFD700;
          filter: drop-shadow(0 0 20px rgba(255,215,0,1))
                  drop-shadow(0 0 40px rgba(255,165,0,.7));
          animation: nutFly 2.6s cubic-bezier(.2,0,.6,1) forwards;
        }

        @keyframes nutFly {
          0%   { transform: translate(-50%,-50%) rotate(0deg) scale(1); opacity: 1; }
          20%  { transform: translate(-50%,-50%) rotate(180deg) scale(1.1); opacity: 1; }
          60%  { transform: translate(calc(-50% - 140px), calc(-50% - 170px))
                             rotate(540deg) scale(0.8); opacity: 1; }
          100% { transform: translate(calc(-50% - 220px), calc(-50% - 280px))
                             rotate(900deg) scale(0.1); opacity: 0; }
        }

        .boltShaft {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 80px;
          background: linear-gradient(180deg, #FFF4A0 0%, #FFD700 40%, #B8860B 100%);
          border-radius: 3px 3px 6px 6px;
          box-shadow: 0 0 14px rgba(255,215,0,.8), 0 0 30px rgba(255,165,0,.4);
          animation: shaftFly 2.6s cubic-bezier(.2,0,.6,1) forwards;
        }

        @keyframes shaftFly {
          0%   { transform: translate(-50%,-50%) rotate(0deg) scale(1); opacity: 1; }
          20%  { transform: translate(-50%,-50%) rotate(-90deg) scale(1.05); opacity: 1; }
          60%  { transform: translate(calc(-50% + 130px), calc(-50% + 160px))
                             rotate(-270deg) scale(0.7); opacity: 1; }
          100% { transform: translate(calc(-50% + 210px), calc(-50% + 270px))
                             rotate(-450deg) scale(0.05); opacity: 0; }
        }

        .spannerWrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          z-index: 6;
          pointer-events: none;
        }

        .spannerEntry { animation: spannerOrbit 2.8s ease forwards; }

        @keyframes spannerOrbit {
          0%   { transform: rotate(-160deg); opacity: 0; }
          15%  { transform: rotate(-160deg); opacity: 1; }
          55%  { transform: rotate(-10deg); opacity: 1; }
          80%  { transform: rotate(220deg); opacity: 1; }
          100% { transform: rotate(400deg); opacity: 0; }
        }

        .spannerArm {
          position: absolute;
          left: 55px;
          top: -28px;
          transform-origin: -55px 28px;
        }

        .spannerIcon {
          font-size: 68px;
          display: block;
          line-height: 1;
          filter: drop-shadow(0 0 12px rgba(255,215,0,.7));
          transform: rotate(-45deg) scaleX(-1);
        }

        .sparks {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .spark {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #FFD700;
          box-shadow: 0 0 6px #FFD700, 0 0 14px #FF8C00;
        }

        .spark1  { animation: spark .5s .1s  ease-out both; --sx: -120px; --sy: -80px;  }
        .spark2  { animation: spark .6s .15s ease-out both; --sx:  100px; --sy: -100px; }
        .spark3  { animation: spark .4s .1s  ease-out both; --sx:  -90px; --sy:  110px; }
        .spark4  { animation: spark .55s .2s ease-out both; --sx:  130px; --sy:   80px; }
        .spark5  { animation: spark .45s .1s ease-out both; --sx:  -60px; --sy: -130px; }
        .spark6  { animation: spark .5s .25s ease-out both; --sx:   80px; --sy:  130px; }
        .spark7  { animation: spark .6s .2s  ease-out both; --sx: -140px; --sy:   30px; }
        .spark8  { animation: spark .5s .3s  ease-out both; --sx:  140px; --sy:  -40px; }
        .spark9  { animation: spark .4s .35s ease-out both; --sx:  -30px; --sy:  140px; }
        .spark10 { animation: spark .55s .25s ease-out both; --sx:  50px; --sy: -140px; }
        .spark11 { animation: spark .45s .4s ease-out both; --sx: -110px; --sy:  -60px; }
        .spark12 { animation: spark .6s .3s  ease-out both; --sx:   90px; --sy:  110px; }

        @keyframes spark {
          0%   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--sx)), calc(-50% + var(--sy))) scale(0); opacity: 0; }
        }

        .boltLabel {
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 300px;
          text-align: center;
        }

        .tapInstruction {
          font-size: 10px;
          letter-spacing: 4px;
          color: #FFD700;
          margin: 0 0 12px;
          animation: fadeIn .5s .3s both;
        }

        .tapSubhint {
          font-size: 9px;
          letter-spacing: 2px;
          color: #888;
          margin: 8px 0 0;
        }

        .tapDots {
          display: flex;
          justify-content: center;
          gap: 12px;
        }

        .tapDot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255,215,0,.4);
          transition: background .15s, border-color .15s, box-shadow .15s;
        }

        .tapDotFilled {
          background: #FFD700;
          border-color: #FFD700;
          box-shadow: 0 0 10px rgba(255,215,0,.8);
        }

        .progressBar {
          width: 100%;
          height: 3px;
          background: rgba(255,215,0,.15);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 4px;
        }

        .progressFill {
          height: 100%;
          background: linear-gradient(90deg, #FFD700, #FFF4A0, #FFD700);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(255,215,0,.8);
          animation: progressGrow 2.6s ease forwards;
        }

        @keyframes progressGrow {
          from { width: 0%; }
          to   { width: 100%; }
        }

        /* ── WELCOME ── */
        .welcomeStage { animation: flashIn .8s ease; }

        @keyframes flashIn {
          from { filter: brightness(4); opacity: 0; transform: scale(1.1); }
          to   { filter: brightness(1); opacity: 1; transform: scale(1); }
        }

        .welcomeShell {
          width: min(650px, 92vw);
          height: 360px;
        }

        .welcomeCard {
          position: absolute;
          inset: 2px;
          z-index: 2;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at 50% 50%, rgba(255,215,0,.07), rgba(255,255,255,.02));
          backdrop-filter: blur(20px);
        }

        .welcomeCard p {
          font-size: clamp(38px, 9vw, 75px);
          letter-spacing: 12px;
          font-weight: 300;
          margin: 25px 0 5px;
        }

        .welcomeCard h2 {
          letter-spacing: 14px;
          font-weight: 300;
          font-size: 20px;
        }

        .soundWave {
          height: 65px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .soundWave span {
          width: 3px;
          height: 20px;
          background: #FFD700;
          box-shadow: 0 0 15px #FFD700;
          animation: soundBar .8s infinite alternate;
        }

        .soundWave span:nth-child(1) { animation-delay: 0s;    animation-duration: .7s; }
        .soundWave span:nth-child(2) { animation-delay: .1s;   animation-duration: .85s; }
        .soundWave span:nth-child(3) { animation-delay: .2s;   animation-duration: .6s; }
        .soundWave span:nth-child(4) { animation-delay: .05s;  animation-duration: .9s; }
        .soundWave span:nth-child(5) { animation-delay: .15s;  animation-duration: .75s; }
        .soundWave span:nth-child(6) { animation-delay: .25s;  animation-duration: .65s; }
        .soundWave span:nth-child(7) { animation-delay: .3s;   animation-duration: .8s; }

        @keyframes soundBar {
          from { height: 8px; opacity: .5; }
          to   { height: 55px; opacity: 1; }
        }

        /* ── INVITATION ── */
        .invitationStage {
          padding: 40px 18px 50px;
          animation: fadeIn .7s ease;
        }

        .inviteHeader {
          margin-bottom: 24px;
          text-align: center;
        }

        .inviteHeader p {
          margin: 0;
          letter-spacing: 9px;
          font-size: 11px;
          color: #aaa;
        }

        .inviteHeader h1 {
          margin: 6px 0 0;
          font-size: clamp(26px, 6.5vw, 56px);
          letter-spacing: clamp(5px, 1.4vw, 13px);
          font-weight: 500;
        }

        .inviteShell {
          width: min(560px, 94vw);
          position: relative;
        }

        .inviteCard {
          position: relative;
          z-index: 2;
          margin: 2px;
          border-radius: 17px;
          background: linear-gradient(160deg, rgba(255,255,255,.09), rgba(255,255,255,.02));
          backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,.1);
          padding: 34px 24px 30px;
          text-align: center;
        }

        .collegeLogo {
          margin: 0 auto 16px;
          width: 120px;
          border-radius: 12px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 8px 6px;
          box-shadow: 0 0 0 1px rgba(255,215,0,.3),
                      0 0 18px rgba(255,215,0,.25),
                      0 4px 20px rgba(0,0,0,.6);
          overflow: hidden;
        }

        .collegeLogo img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: contain;
          border-radius: 6px;
        }

        .department {
          font-size: 10px;
          letter-spacing: 4px;
          color: #FFD700;
          margin: 0 0 14px;
          text-shadow: 0 0 10px rgba(255,215,0,.4);
        }

        .inviteCard h2 {
          font-size: clamp(22px, 6vw, 42px);
          letter-spacing: clamp(4px, 1.2vw, 10px);
          font-weight: 600;
          margin: 0 0 10px;
        }

        .year {
          font-size: clamp(36px, 9vw, 72px);
          font-weight: 700;
          letter-spacing: 8px;
          color: rgba(255,255,255,.15);
          line-height: 1;
          margin-bottom: 14px;
        }

        .tagline {
          font-size: 11px;
          letter-spacing: 4px;
          color: #999;
          line-height: 1.7;
          margin: 0;
        }

        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,215,0,.3), transparent);
          margin: 20px 0;
        }

        .details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px 12px;
          text-align: left;
        }

        .detail {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .detailIcon {
          font-size: 18px;
          opacity: .7;
          margin-bottom: 2px;
        }

        .detail span {
          font-size: 9px;
          letter-spacing: 4px;
          color: #888;
        }

        .detail strong {
          font-size: 13px;
          letter-spacing: 2px;
          font-weight: 600;
          color: #fff;
        }

        .detail small {
          font-size: 10px;
          letter-spacing: 2px;
          color: #aaa;
        }

        .closing {
          font-size: 13px;
          letter-spacing: 4px;
          color: #ccc;
          line-height: 2;
        }

        .closing strong {
          color: #FFD700;
          font-size: 15px;
          letter-spacing: 5px;
          text-shadow: 0 0 15px rgba(255,215,0,.5);
        }

        /* CARD ACTION BUTTONS */
        .cardActions {
          margin-top: 24px;
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .actionBtn {
          padding: 11px 18px;
          border-radius: 30px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          touch-action: manipulation;
        }

        .whatsappBtn {
          background: #25D366;
          color: #000;
          box-shadow: 0 0 16px rgba(37, 211, 102, 0.4);
        }

        .whatsappBtn:active {
          transform: scale(0.95);
        }

        .copyInviteBtn {
          background: rgba(255, 215, 0, 0.15);
          color: #FFD700;
          border: 1px solid rgba(255, 215, 0, 0.4);
        }

        .copyInviteBtn:active {
          transform: scale(0.95);
        }

        .footer {
          margin-top: 24px;
          font-size: 9px;
          letter-spacing: 5px;
          color: #555;
        }

        /* ========================================================
           📱 MOBILE SPECIFIC OVERRIDES (mode="mobile")
        ======================================================== */
        .mobileMode {
          max-width: 480px;
          margin: 0 auto;
        }

        .mobileMode .stage {
          padding: 30px 14px 40px;
        }

        .mobileMode .questionShell {
          width: 100%;
          height: 380px;
        }

        .mobileMode .questionCard {
          padding: 32px 16px;
        }

        .mobileMode .questionCard h2 {
          font-size: 22px;
          letter-spacing: 4px;
          margin-bottom: 24px;
        }

        .mobileMode .boltNut {
          font-size: 125px;
        }

        .mobileMode .details {
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .mobileMode .detail {
          background: rgba(255,255,255,0.03);
          padding: 10px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .mobileMode .cardActions {
          flex-direction: column;
        }

        .mobileMode .actionBtn {
          width: 100%;
          padding: 13px;
        }

        /* ========================================================
           💻 PC / DESKTOP SPECIFIC OVERRIDES (mode="pc")
        ======================================================== */
        .pcMode .questionShell {
          width: 640px;
          height: 420px;
        }

        .pcMode .questionCard {
          padding: 50px 30px;
        }

        .pcMode .inviteShell {
          width: 600px;
        }

        .pcMode .inviteCard {
          padding: 42px 36px 36px;
        }

        .pcMode .details {
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        .pcMode .detail {
          background: rgba(255,255,255,0.03);
          padding: 14px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          text-align: center;
          align-items: center;
        }

        .pcMode .yesButton:hover {
          transform: scale(1.08);
        }
      `}</style>
    </main>
  );
}
