const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const logoBase64Path = path.join(rootDir, 'public', 'logo_base64.txt');
let logoBase64 = '';
if (fs.existsSync(logoBase64Path)) {
  logoBase64 = fs.readFileSync(logoBase64Path, 'utf8').trim();
}

// Full standalone HTML with embedded base64 logo, Web Audio API engine, CSS and Vanilla JS
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <title>Freshers Party 2026 - Department of Mechanical Engineering</title>
  <meta name="description" content="Official Mechanical Engineering Freshers Party 2026 Invitation - Narayana Engineering College, Nellore" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
  <style>
    /* ── RESET & ROOTS ── */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    :root {
      --chrome-bright: #FFFFFF;
      --chrome-mid: #A0B4C8;
      --chrome-dark: #2A3644;
      --chrome-accent: #00E5FF;
      --amber-fire: #FF7700;
      --steel-plate: #0C121D;
    }
    html, body {
      width: 100%;
      height: 100%;
      background: #050A12;
      color: #DDE8F4;
      font-family: 'Rajdhani', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      overflow-x: hidden;
    }

    /* ── REALISTIC METALLIC CHROME BACKGROUND ── */
    .mechUniverse {
      min-height: 100vh;
      width: 100%;
      background: 
        radial-gradient(ellipse at 50% 0%, rgba(220, 235, 255, 0.16) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 80%, rgba(0, 229, 255, 0.14) 0%, transparent 50%),
        radial-gradient(ellipse at 15% 70%, rgba(255, 120, 0, 0.10) 0%, transparent 45%),
        repeating-linear-gradient(
          135deg,
          rgba(255, 255, 255, 0.025) 0px,
          rgba(255, 255, 255, 0.025) 1px,
          transparent 1px,
          transparent 4px
        ),
        linear-gradient(90deg, #0A101A 0%, #15202E 25%, #223246 50%, #15202E 75%, #0A101A 100%);
      position: relative;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
    }

    .steelDiamondGrid {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      background-image: 
        linear-gradient(45deg, rgba(255, 255, 255, 0.035) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(255, 255, 255, 0.035) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.035) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.035) 75%);
      background-size: 32px 32px;
      background-position: 0 0, 0 16px, 16px -16px, -16px 0px;
      opacity: 0.7;
    }

    .brushedMetalGrain {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 1;
      background: repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.015) 0px,
        rgba(0, 0, 0, 0.04) 2px,
        rgba(255, 255, 255, 0.02) 4px
      );
    }

    .chromePerimeterFrame {
      position: fixed;
      inset: 8px;
      pointer-events: none;
      z-index: 2;
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow: inset 0 0 45px rgba(0, 0, 0, 0.85);
    }

    .industrialFog {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2;
      background: 
        radial-gradient(ellipse at 50% 20%, rgba(0, 229, 255, 0.06) 0%, transparent 60%),
        radial-gradient(ellipse at 50% 85%, rgba(255, 119, 0, 0.06) 0%, transparent 60%);
    }

    /* ── BACKGROUND MECHANICAL ASSETS ── */
    .bgTwinEngineCutaway {
      position: fixed;
      left: 10px;
      bottom: 35px;
      width: 175px;
      height: 235px;
      pointer-events: none;
      z-index: 2;
      opacity: 0.55;
      filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.25));
      transition: opacity 0.3s ease, transform 0.2s ease;
      will-change: transform;
      transform: translateZ(0);
    }
    .piston1Reciprocate {
      animation: pistonCycleKinematics 0.8s cubic-bezier(0.42, 0, 0.58, 1) infinite;
      will-change: transform;
      transform: translateZ(0);
    }
    .piston2Reciprocate {
      animation: pistonCycleKinematics 0.8s cubic-bezier(0.42, 0, 0.58, 1) infinite;
      animation-delay: -0.6s;
      will-change: transform;
      transform: translateZ(0);
    }
    @keyframes pistonCycleKinematics {
      0% { transform: translate3d(0, 0px, 0); }
      50% { transform: translate3d(0, 42px, 0); }
      100% { transform: translate3d(0, 0px, 0); }
    }
    .crankshaftAssembly {
      transform-origin: 120px 235px;
      animation: crankSpin 0.8s linear infinite;
      will-change: transform;
      transform: translateZ(0);
    }
    @keyframes crankSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .sparkPlugFlash {
      animation: sparkPulse 0.45s infinite alternate;
    }
    @keyframes sparkPulse {
      from { fill: #FF4400; opacity: 0.3; }
      to { fill: #00E5FF; opacity: 1; filter: drop-shadow(0 0 6px #00E5FF); }
    }

    .engineCranking .piston1Reciprocate { animation-duration: 0.34s; }
    .engineCranking .piston2Reciprocate { animation-duration: 0.34s; animation-delay: -0.255s; }
    .engineCranking .crankshaftAssembly { animation-duration: 0.34s; }

    .engineRedline {
      opacity: 0.9 !important;
      filter: drop-shadow(0 0 25px rgba(255, 60, 0, 0.75)) !important;
      animation: engineBlockVibe 0.08s infinite alternate;
    }
    .engineRedline .piston1Reciprocate { animation-duration: 0.11s; }
    .engineRedline .piston2Reciprocate { animation-duration: 0.11s; animation-delay: -0.082s; }
    .engineRedline .crankshaftAssembly { animation-duration: 0.11s; }
    @keyframes engineBlockVibe {
      0% { transform: translate3d(-1px, 1px, 0); }
      100% { transform: translate3d(1px, -1px, 0); }
    }

    .bgRobotArmAssembly {
      position: fixed;
      right: 10px;
      bottom: 25px;
      width: 185px;
      height: 280px;
      pointer-events: none;
      z-index: 2;
      opacity: 0.55;
      filter: drop-shadow(0 0 20px rgba(0, 229, 255, 0.25));
      will-change: transform;
      transform: translateZ(0);
    }
    .robotArmBoom {
      transform-origin: 110px 280px;
      animation: robotArmSwing 7s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate;
      will-change: transform;
      transform: translateZ(0);
    }
    @keyframes robotArmSwing {
      0% { transform: rotate(0deg); }
      50% { transform: rotate(-18deg); }
      100% { transform: rotate(12deg); }
    }
    .robotForearm {
      transform-origin: 110px 150px;
      animation: robotForearmBend 4.5s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate;
      will-change: transform;
      transform: translateZ(0);
    }
    @keyframes robotForearmBend {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(28deg); }
    }
    .weldingArcFlare {
      animation: arcFlash 0.15s infinite alternate;
    }
    @keyframes arcFlash {
      from { opacity: 0.3; transform: scale(0.6); }
      to { opacity: 1; transform: scale(1.6); filter: drop-shadow(0 0 12px #00E5FF); }
    }
    .weldingSparkFountain {
      position: absolute;
      top: 30px;
      right: 80px;
      width: 10px;
      height: 10px;
      pointer-events: none;
    }
    .weldingSpark {
      position: absolute;
      border-radius: 50%;
      background: #FFFFFF;
      box-shadow: 0 0 6px #00E5FF, 0 0 12px #FFD700;
      opacity: 0;
      animation: weldSparkDrop linear infinite;
    }
    @keyframes weldSparkDrop {
      0% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
      100% { transform: translate3d(var(--dx), var(--dy), 0) scale(0); opacity: 0; }
    }

    .bgPatrolDrone {
      position: fixed;
      left: 20%;
      top: 75px;
      width: 150px;
      height: 120px;
      pointer-events: none;
      z-index: 2;
      opacity: 0.65;
      animation: dronePatrolFlight 18s cubic-bezier(0.42, 0, 0.58, 1) infinite alternate;
      will-change: transform;
      transform: translateZ(0);
    }
    @keyframes dronePatrolFlight {
      0% { transform: translate3d(0, 0, 0) rotate(0deg); }
      25% { transform: translate3d(90px, 15px, 0) rotate(4deg); }
      65% { transform: translate3d(220px, -8px, 0) rotate(-3.5deg); }
      100% { transform: translate3d(320px, 22px, 0) rotate(2.5deg); }
    }
    .rotorBlades {
      animation: rotorSpin 0.08s linear infinite;
    }
    @keyframes rotorSpin {
      from { transform: scaleX(1); }
      to { transform: scaleX(-1); }
    }
    .droneScanBeam {
      animation: beamSweep 3.2s ease-in-out infinite alternate;
    }
    @keyframes beamSweep {
      0% { opacity: 0.25; transform: skewX(-7deg); }
      100% { opacity: 0.65; transform: skewX(9deg); }
    }
    .droneSensorEye {
      animation: sensorBlink 1.2s infinite alternate;
    }
    @keyframes sensorBlink {
      from { fill: #00E5FF; }
      to { fill: #FF0055; filter: drop-shadow(0 0 8px #FF0055); }
    }
    .navStrobePort { animation: navFlashRed 0.8s infinite alternate; }
    @keyframes navFlashRed {
      0% { opacity: 0.2; }
      100% { opacity: 1; filter: drop-shadow(0 0 6px #FF0044); }
    }
    .navStrobeStarboard { animation: navFlashGreen 0.8s infinite alternate 0.4s; }
    @keyframes navFlashGreen {
      0% { opacity: 0.2; }
      100% { opacity: 1; filter: drop-shadow(0 0 6px #00FF66); }
    }

    .bgTurbochargerAssembly {
      position: fixed;
      left: 195px;
      bottom: 25px;
      width: 95px;
      height: 95px;
      pointer-events: none;
      z-index: 2;
      opacity: 0.4;
      filter: drop-shadow(0 0 14px rgba(0, 229, 255, 0.2));
    }
    .turboImpellerSpinning {
      transform-origin: 70px 70px;
      animation: turboSpin 0.3s linear infinite;
    }
    @keyframes turboSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .bgBremboBrakeAssembly {
      position: fixed;
      right: 205px;
      bottom: 25px;
      width: 95px;
      height: 95px;
      pointer-events: none;
      z-index: 2;
      opacity: 0.4;
      filter: drop-shadow(0 0 14px rgba(255, 40, 0, 0.2));
    }

    .ambientParticles {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 3;
    }
    .ambientParticle {
      position: absolute;
      width: 2px;
      height: 2px;
      background: #00E5FF;
      border-radius: 50%;
      box-shadow: 0 0 6px #00E5FF;
      opacity: 0;
      animation: ambientFloat linear infinite;
    }
    @keyframes ambientFloat {
      0% { transform: translateY(0); opacity: 0; }
      25% { opacity: 0.8; }
      75% { opacity: 0.4; }
      100% { transform: translateY(-160px); opacity: 0; }
    }

    /* ── TOP UTILITY BAR ── */
    .topUtilityBar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      backdrop-filter: blur(12px);
      background: rgba(8, 14, 24, 0.85);
      border-bottom: 2px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.8);
    }
    .deptBadge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Orbitron', sans-serif;
      font-size: 12px;
      letter-spacing: 2px;
      color: #00E5FF;
    }
    .badgeIcon {
      animation: spinSmall 10s linear infinite;
      display: inline-block;
    }
    @keyframes spinSmall {
      to { transform: rotate(360deg); }
    }

    .chromeAudioBtn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 20px;
      font-family: 'Orbitron', sans-serif;
      font-size: 11px;
      letter-spacing: 1.5px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s ease;
      background: linear-gradient(180deg, #243548 0%, #101B27 100%);
      color: #CFE0F0;
      border: 1px solid rgba(255, 255, 255, 0.35);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }
    .chromeAudioBtn:hover {
      border-color: #00E5FF;
      box-shadow: 0 0 14px rgba(0, 229, 255, 0.6);
      transform: translateY(-1px);
    }
    .audioOn {
      color: #00E5FF;
      border-color: rgba(0, 229, 255, 0.8);
      box-shadow: 0 0 14px rgba(0, 229, 255, 0.5);
    }

    /* ── CHROME TYPOGRAPHY ── */
    .chromeHeading {
      font-family: 'Orbitron', sans-serif;
      font-weight: 800;
      letter-spacing: 2px;
      background: linear-gradient(
        180deg,
        #FFFFFF 0%,
        #E0ECF6 22%,
        #94A8BC 46%,
        #32404E 50%,
        #1D2732 54%,
        #7A92A6 72%,
        #D4E2EE 90%,
        #FFFFFF 100%
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.9));
    }
    .chromeLarge {
      font-size: clamp(24px, 4.5vw, 42px);
      line-height: 1.15;
      text-align: center;
    }
    .chromeShimmer {
      background: linear-gradient(
        90deg,
        #8EA6BC 0%,
        #FFFFFF 25%,
        #00E5FF 50%,
        #FFFFFF 75%,
        #8EA6BC 100%
      );
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: chromeShimmerMove 4s linear infinite;
    }
    @keyframes chromeShimmerMove {
      to { background-position: 200% center; }
    }

    /* ── STAGES ── */
    .stageSection {
      position: relative;
      z-index: 10;
      width: 100%;
      min-height: 100vh;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 85px 20px 45px;
    }
    .stageActive {
      display: flex !important;
    }

    /* STAGE 1: GEARS */
    .stageGearsHeader {
      text-align: center;
      margin-bottom: 20px;
    }
    .subHeadingTag {
      font-family: 'Orbitron', sans-serif;
      font-size: clamp(14px, 3.2vw, 20px);
      font-weight: 700;
      letter-spacing: clamp(3px, 1vw, 6px);
      color: #00E5FF;
      margin: 0 0 10px;
      text-shadow: 0 0 14px rgba(0, 229, 255, 0.6);
    }
    .gearTrainContainer {
      position: relative;
      width: 100%;
      max-width: 560px;
      height: 340px;
      margin: 5px auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .gearNode {
      position: absolute;
      will-change: transform;
      transform: translateZ(0);
    }
    .gearNode1 {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) translateZ(0);
      z-index: 5;
    }
    .gearNode2 {
      left: 65%;
      top: 26%;
      z-index: 4;
    }
    .gearNode3 {
      left: 12%;
      top: 16%;
      z-index: 4;
    }

    .gearMeshPoint {
      position: absolute;
      z-index: 10;
      pointer-events: none;
    }
    .meshPoint1 { left: 69%; top: 46%; }
    .meshPoint2 { left: 36%; top: 35%; }

    .frictionHotspot {
      position: absolute;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle, #FFFFFF 0%, #FFD700 40%, #FF5500 70%, transparent 100%);
      box-shadow: 0 0 20px #FFAA00, 0 0 35px #FF5500;
      animation: frictionPulse 0.15s infinite alternate;
      will-change: transform;
    }
    @keyframes frictionPulse {
      from { transform: translate(-50%, -50%) scale(0.8); opacity: 0.7; }
      to { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
    }
    .meshSpark {
      position: absolute;
      border-radius: 50%;
      background: var(--sparkColor);
      box-shadow: 0 0 6px var(--sparkColor), 0 0 12px #FF5500;
      opacity: 0;
      animation: sparkFly linear infinite;
      will-change: transform, opacity;
      transform: translateZ(0);
    }
    @keyframes sparkFly {
      0% { transform: translate3d(0, 0, 0) scale(1.2); opacity: 1; }
      100% { transform: translate3d(var(--dx), var(--dy), 0) scale(0); opacity: 0; }
    }

    /* Question Armor Card */
    .questionCardArmor {
      position: relative;
      max-width: 520px;
      width: 100%;
      border-radius: 16px;
      padding: 3px;
      background: linear-gradient(
        135deg,
        #FFFFFF 0%,
        #8FA3B5 30%,
        #1A2532 50%,
        #B0C4D6 70%,
        #FFFFFF 100%
      );
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 229, 255, 0.2);
    }
    .qArmorCornerTL, .qArmorCornerTR, .qArmorCornerBL, .qArmorCornerBR {
      position: absolute;
      width: 12px;
      height: 12px;
      background: #FFFFFF;
      border-radius: 2px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
      z-index: 5;
    }
    .qArmorCornerTL { top: 8px; left: 8px; }
    .qArmorCornerTR { top: 8px; right: 8px; }
    .qArmorCornerBL { bottom: 8px; left: 8px; }
    .qArmorCornerBR { bottom: 8px; right: 8px; }

    .questionInner {
      background: linear-gradient(180deg, #14202E 0%, #0A111A 100%);
      border-radius: 14px;
      padding: 28px 24px 24px;
      text-align: center;
    }
    .qCardSub {
      font-family: 'Orbitron', sans-serif;
      font-size: 11px;
      letter-spacing: 4px;
      color: #00E5FF;
      margin: 0 0 8px;
    }
    .qCardTitle {
      font-size: clamp(20px, 4vw, 28px);
      line-height: 1.25;
      margin-bottom: 22px;
    }
    .qActionButtons {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      min-height: 60px;
      position: relative;
    }
    .chromeYesBtn {
      position: relative;
      padding: 14px 34px;
      border-radius: 10px;
      background: linear-gradient(180deg, #00E5FF 0%, #0088AA 100%);
      border: 1px solid #FFFFFF;
      color: #050B12;
      font-family: 'Orbitron', sans-serif;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 2px;
      cursor: pointer;
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.6), 0 4px 15px rgba(0, 0, 0, 0.8);
      transition: all 0.2s ease;
    }
    .chromeYesBtn:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 0 30px rgba(0, 229, 255, 0.8), 0 6px 20px rgba(0, 0, 0, 0.9);
    }
    .chromeNoBtn {
      padding: 12px 28px;
      border-radius: 8px;
      background: rgba(22, 34, 48, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #8BA2B6;
      font-family: 'Orbitron', sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 2px;
      cursor: pointer;
      transition: transform 0.15s cubic-bezier(0.2, 0.9, 0.3, 1.2);
    }
    .noAttemptWarning {
      font-family: 'Share Tech Mono', monospace;
      font-size: 12px;
      letter-spacing: 1.5px;
      color: #FF7700;
      margin-top: 14px;
    }

    /* STAGE 2: ENGINE */
    .smokeVessel {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 25;
      overflow: hidden;
      display: none;
    }
    .smokeVessel.active {
      display: block;
    }
    .exhaustTailpipe {
      position: absolute;
      bottom: 12px;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: #03060A;
      border: 4px solid #A2B6C8;
      box-shadow: 0 0 20px rgba(0,0,0,0.9), inset 0 0 15px rgba(255, 80, 0, 0.7);
    }
    .pipeLeft { left: 16%; }
    .pipeRight { right: 16%; }
    .pipeCoreGlow {
      position: absolute;
      inset: 6px;
      border-radius: 50%;
      background: radial-gradient(circle, #FFAA00 0%, #FF3300 60%, transparent 100%);
      box-shadow: 0 0 25px #FF5500;
      animation: pipePulse 0.2s infinite alternate;
    }
    @keyframes pipePulse {
      from { opacity: 0.7; transform: scale(0.9); }
      to { opacity: 1; transform: scale(1.15); }
    }
    .billowSmoke {
      position: absolute;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      filter: url(#realisticTurbulentSmoke) blur(14px);
      opacity: 0;
      animation: smokeVolumetricErupt ease-out forwards;
    }
    .smokePearl {
      background: radial-gradient(
        circle at 40% 40%,
        rgba(255, 255, 255, 0.96) 0%,
        rgba(205, 222, 238, 0.85) 35%,
        rgba(125, 145, 165, 0.5) 65%,
        rgba(40, 52, 65, 0.2) 85%,
        transparent 100%
      );
    }
    .smokeCharcoal {
      background: radial-gradient(
        circle at 40% 40%,
        rgba(165, 182, 198, 0.85) 0%,
        rgba(85, 102, 118, 0.7) 40%,
        rgba(35, 46, 58, 0.45) 70%,
        transparent 100%
      );
    }
    @keyframes smokeVolumetricErupt {
      0% { transform: translate(0, 0) scale(0.2) rotate(0deg); opacity: 0.98; }
      30% { opacity: 0.92; }
      70% { opacity: 0.65; }
      100% { transform: translate(var(--xDrift), -480px) scale(var(--targetScale)) rotate(180deg); opacity: 0; }
    }
    .rollingFloorFog {
      position: absolute;
      bottom: 0;
      left: -10%;
      right: -10%;
      height: 160px;
      background: radial-gradient(
        ellipse at 50% 100%,
        rgba(225, 238, 250, 0.55) 0%,
        rgba(165, 185, 205, 0.35) 45%,
        transparent 80%
      );
      filter: blur(25px);
      animation: fogRoll 2.5s ease-out infinite alternate;
    }
    @keyframes fogRoll {
      from { transform: translateY(0) scaleY(0.9); }
      to { transform: translateY(-20px) scaleY(1.2); }
    }
    .exhaustFlameBurst {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 380px;
      background: radial-gradient(
        ellipse at 50% 100%,
        rgba(255, 140, 0, 0.85) 0%,
        rgba(255, 60, 0, 0.5) 40%,
        rgba(0, 229, 255, 0.2) 65%,
        transparent 85%
      );
      animation: flamePulse 2.4s ease-out forwards;
      pointer-events: none;
    }
    @keyframes flamePulse {
      0% { opacity: 0; transform: scale(0.7); }
      15% { opacity: 1; transform: scale(1.25); }
      55% { opacity: 0.7; }
      100% { opacity: 0; transform: scale(1.4); }
    }

    /* Blast Doors */
    .blastDoorRig {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 15;
      display: flex;
    }
    .heavyDoor {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 50%;
      background: linear-gradient(90deg, #101824 0%, #172232 50%, #0F1622 100%);
      border: 2px solid rgba(255, 255, 255, 0.2);
      box-shadow: inset 0 0 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(0, 0, 0, 0.9);
      transition: transform 1.2s cubic-bezier(0.77, 0, 0.175, 1);
    }
    .heavyDoorLeft {
      left: 0;
      border-right: 3px solid #00E5FF;
      transform: translateX(0);
    }
    .heavyDoorRight {
      right: 0;
      border-left: 3px solid #00E5FF;
      transform: translateX(0);
    }
    .doorsOpen .heavyDoorLeft { transform: translateX(-102%); }
    .doorsOpen .heavyDoorRight { transform: translateX(102%); }
    .doorSeamGlow {
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      width: 4px;
      transform: translateX(-50%);
      background: #00E5FF;
      box-shadow: 0 0 25px #00E5FF, 0 0 60px #00E5FF;
      opacity: 0.8;
    }
    .doorsOpen .doorSeamGlow {
      opacity: 1;
      width: 14px;
      box-shadow: 0 0 70px #00E5FF, 0 0 140px #00E5FF;
    }

    .ignitionConsole {
      position: relative;
      z-index: 20;
      max-width: 560px;
      width: 100%;
      text-align: center;
      padding: 35px 25px;
      border-radius: 20px;
      background: linear-gradient(180deg, rgba(16, 26, 38, 0.96) 0%, rgba(8, 14, 22, 0.98) 100%);
      border: 2px solid rgba(255, 255, 255, 0.32);
      box-shadow: 
        0 0 40px rgba(0, 0, 0, 0.92),
        0 0 30px rgba(0, 229, 255, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.45);
    }
    .consoleEngaged {
      animation: consoleShake 0.25s infinite;
    }
    @keyframes consoleShake {
      0% { transform: translate(0, 0); }
      25% { transform: translate(2px, -2px); }
      50% { transform: translate(-2px, 1px); }
      75% { transform: translate(1px, -1px); }
      100% { transform: translate(0, 0); }
    }

    .racingCluster {
      background: #050B12;
      border: 2px solid rgba(255, 255, 255, 0.18);
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 22px;
      box-shadow: inset 0 2px 10px rgba(0,0,0,0.9), 0 0 15px rgba(0, 229, 255, 0.15);
    }
    .shiftLightArray {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 4px;
      padding: 4px 6px;
      background: #08101A;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 12px;
    }
    .shiftLed {
      flex: 1;
      height: 9px;
      border-radius: 2px;
      background: #141F2B;
      transition: all 0.1s ease;
    }
    .ledGreen.lit {
      background: #00FF66 !important;
      box-shadow: 0 0 8px #00FF66, 0 0 14px #00FF66;
    }
    .ledAmber.lit {
      background: #FFB300 !important;
      box-shadow: 0 0 8px #FFB300, 0 0 14px #FFB300;
    }
    .ledRed.lit {
      background: #FF2200 !important;
      box-shadow: 0 0 10px #FF2200, 0 0 18px #FF2200;
    }
    .flashingRedline {
      background: #FF0055 !important;
      box-shadow: 0 0 14px #FF0055, 0 0 25px #FF0055 !important;
      animation: redlineStrobe 0.12s infinite alternate;
    }
    @keyframes redlineStrobe {
      from { filter: brightness(0.9); transform: scaleY(0.9); }
      to { filter: brightness(1.6); transform: scaleY(1.3); }
    }

    .digitalRpmDisplay {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .rpmMainNumber {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }
    .rpmDigits {
      font-family: 'Share Tech Mono', monospace;
      font-size: clamp(28px, 6vw, 42px);
      font-weight: 700;
      color: #00E5FF;
      letter-spacing: 2px;
      text-shadow: 0 0 15px rgba(0, 229, 255, 0.6);
    }
    .rpmUnit {
      font-family: 'Orbitron', sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #8BA2B6;
    }
    .rpmRedlineActive {
      color: #FF0033 !important;
      text-shadow: 0 0 20px #FF0000, 0 0 35px #FF3300 !important;
      animation: redlineShake 0.15s infinite alternate;
    }
    @keyframes redlineShake {
      from { transform: scale(1); }
      to { transform: scale(1.05); }
    }
    .rpmScaleTicks {
      display: flex;
      justify-content: space-between;
      font-family: 'Orbitron', sans-serif;
      font-size: 10px;
      color: #6C8296;
      margin-bottom: 4px;
      padding: 0 2px;
    }
    .scaleRedline {
      color: #FF3B00;
      font-weight: 700;
    }
    .rpmTachometer {
      width: 100%;
      height: 10px;
      border-radius: 5px;
      background: #091018;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.8);
    }
    .rpmBarFill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #00E5FF 0%, #FFCC00 65%, #FF2200 85%, #FF0000 100%);
      transition: width 0.15s cubic-bezier(0.1, 0.9, 0.2, 1);
      box-shadow: 0 0 12px #FF5500;
    }
    .rpmBarMax {
      box-shadow: 0 0 20px #FF0000, 0 0 35px #FF5500 !important;
      animation: barFlash 0.12s infinite alternate;
    }
    @keyframes barFlash {
      from { filter: brightness(1); }
      to { filter: brightness(1.5); }
    }

    .engineStartHarness {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 10px 0 15px;
    }
    .knurledChromeRing {
      position: relative;
      width: 175px;
      height: 175px;
      border-radius: 50%;
      background: 
        radial-gradient(circle, #253342 0%, #0E1722 65%, #050A10 100%),
        repeating-conic-gradient(from 0deg, #FFFFFF 0deg 2deg, #6C8296 2deg 4deg, #1B2633 4deg 6deg);
      border: 4px solid #FFFFFF;
      box-shadow: 
        0 0 35px rgba(0, 0, 0, 0.9),
        0 0 25px rgba(255, 60, 0, 0.4),
        inset 0 0 20px rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hexBolt {
      position: absolute;
      width: 10px;
      height: 10px;
      background: #CCD8E4;
      border-radius: 2px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    }
    .b1 { top: 6px; left: 50%; transform: translateX(-50%); }
    .b2 { bottom: 6px; left: 50%; transform: translateX(-50%); }
    .b3 { left: 6px; top: 50%; transform: translateY(-50%); }
    .b4 { right: 6px; top: 50%; transform: translateY(-50%); }

    .ignitionHalo {
      width: 136px;
      height: 136px;
      border-radius: 50%;
      background: #000000;
      box-shadow: 0 0 18px rgba(255, 60, 0, 0.6), inset 0 0 14px rgba(255, 90, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    .haloActive {
      box-shadow: 0 0 35px rgba(255, 90, 0, 0.9), 0 0 60px rgba(255, 40, 0, 0.7);
    }
    .engineStartButton {
      position: relative;
      width: 118px;
      height: 118px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      background: linear-gradient(145deg, #1E2B38, #0D1620);
      box-shadow: 
        0 8px 18px rgba(0, 0, 0, 0.9),
        0 0 18px rgba(255, 60, 0, 0.45),
        inset 0 2px 3px rgba(255, 255, 255, 0.4),
        inset 0 -3px 8px rgba(0, 0, 0, 0.8);
      transition: transform 0.12s ease, box-shadow 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .engineStartButton:hover {
      transform: scale(1.04);
      box-shadow: 
        0 10px 24px rgba(0, 0, 0, 0.9),
        0 0 25px rgba(255, 80, 0, 0.75),
        inset 0 2px 4px rgba(255, 255, 255, 0.6);
    }
    .engineStartButton:active,
    .pressedState {
      transform: scale(0.94) translateY(3px);
      box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.9),
        0 0 45px rgba(255, 100, 0, 1),
        inset 0 4px 10px rgba(0, 0, 0, 0.9);
    }
    .buttonSteelFace {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: 'Orbitron', sans-serif;
      color: #FFFFFF;
      text-shadow: 0 0 10px rgba(255, 120, 0, 0.8);
    }
    .btnSubTop {
      font-size: 11px;
      letter-spacing: 3px;
      color: #A6BACD;
    }
    .btnMainText {
      font-size: 21px;
      font-weight: 900;
      letter-spacing: 3px;
      color: #FF5500;
      text-shadow: 0 0 12px #FF5500, 0 0 24px #FF2200;
    }
    .btnSubBottom {
      font-size: 10px;
      letter-spacing: 1.5px;
      color: #FFAA00;
    }

    .engineQuotePlaque {
      position: relative;
      max-width: 540px;
      width: 94%;
      margin: 18px auto 6px;
      padding: 16px 24px 14px;
      border-radius: 8px;
      background: linear-gradient(145deg, rgba(16, 26, 38, 0.94) 0%, rgba(6, 12, 18, 0.97) 100%);
      border: 1px solid rgba(0, 229, 255, 0.4);
      box-shadow: 
        0 12px 32px rgba(0, 0, 0, 0.85),
        inset 0 1px 2px rgba(255, 255, 255, 0.35),
        0 0 20px rgba(0, 229, 255, 0.18);
      text-align: center;
      backdrop-filter: blur(10px);
      overflow: hidden;
      animation: quotePlaqueGlow 4s ease-in-out infinite alternate;
    }
    @keyframes quotePlaqueGlow {
      0% {
        border-color: rgba(0, 229, 255, 0.35);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.85), 0 0 16px rgba(0, 229, 255, 0.15);
      }
      100% {
        border-color: rgba(0, 229, 255, 0.7);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.85), 0 0 26px rgba(0, 229, 255, 0.35);
      }
    }
    .quoteCornerBolt {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #A0B4C8;
      box-shadow: inset 0 1px 1px #FFFFFF, 0 1px 2px rgba(0, 0, 0, 0.9);
    }
    .qcb-tl { top: 6px; left: 8px; }
    .qcb-tr { top: 6px; right: 8px; }
    .qcb-bl { bottom: 6px; left: 8px; }
    .qcb-br { bottom: 6px; right: 8px; }
    .quoteEmblemRow {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .quoteGearIcon {
      font-size: 13px;
      filter: drop-shadow(0 0 6px #00E5FF);
      animation: spinSmall 8s linear infinite;
      display: inline-block;
    }
    .quoteBadgeText {
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px;
      letter-spacing: 3px;
      font-weight: 700;
      color: #00E5FF;
      text-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
    }
    .quoteStatement {
      margin: 0;
      font-family: 'Rajdhani', 'Orbitron', sans-serif;
      font-size: clamp(14px, 2.3vw, 17px);
      font-weight: 600;
      font-style: italic;
      letter-spacing: 0.8px;
      line-height: 1.45;
      color: #F0F6FC;
      text-shadow: 0 0 12px rgba(0, 229, 255, 0.45);
    }
    .quoteFooter {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-top: 8px;
    }
    .quoteDividerLine {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.4), transparent);
    }
    .quoteAuthor {
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      font-weight: 700;
      color: #FFAA00;
      text-shadow: 0 0 8px rgba(255, 170, 0, 0.6);
      white-space: nowrap;
    }

    /* STAGE 3: WELCOME TO THE CLUB */
    .stageWelcome { text-align: center; }
    .welcomeToTheClubBanner {
      position: relative;
      max-width: 580px;
      width: 94%;
      margin: 0 auto 25px;
      text-align: center;
      padding: 38px 26px 32px;
      border-radius: 20px;
      background: linear-gradient(180deg, rgba(16, 26, 38, 0.9) 0%, rgba(8, 14, 22, 0.96) 100%);
      border: 1.5px solid rgba(0, 229, 255, 0.35);
      box-shadow: 
        0 0 40px rgba(0, 0, 0, 0.92),
        0 0 30px rgba(0, 229, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    .voiceSoundWave {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      height: 40px;
      margin-bottom: 16px;
    }
    .voiceSoundWave .bar {
      width: 3px;
      background: #00E5FF;
      border-radius: 2px;
      box-shadow: 0 0 10px #00E5FF;
      animation: waveJump 0.8s ease-in-out infinite alternate;
    }
    .b1 { height: 14px; animation-delay: 0.1s; }
    .b2 { height: 26px; animation-delay: 0.3s; }
    .b3 { height: 38px; animation-delay: 0.5s; }
    .b4 { height: 22px; animation-delay: 0.2s; }
    .b5 { height: 34px; animation-delay: 0.4s; }
    .b6 { height: 24px; animation-delay: 0.15s; }
    .b7 { height: 16px; animation-delay: 0.35s; }
    @keyframes waveJump {
      from { transform: scaleY(0.4); opacity: 0.5; }
      to { transform: scaleY(1.35); opacity: 1; }
    }
    .welcomeSupTitle {
      font-family: 'Orbitron', sans-serif;
      font-size: 20px;
      font-weight: 500;
      letter-spacing: 8px;
      color: #E2ECF6;
      margin: 0;
    }
    .welcomeClubTitle {
      font-size: clamp(28px, 6vw, 54px);
      letter-spacing: clamp(4px, 2vw, 12px);
      margin: 8px 0 0;
    }
    .welcomeParticleStream {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .welcomeSparkle {
      position: absolute;
      bottom: 0;
      width: 2px;
      height: 2px;
      background: #00E5FF;
      border-radius: 50%;
      box-shadow: 0 0 6px #00E5FF;
      animation: sparkleRise linear infinite;
    }
    @keyframes sparkleRise {
      0% { transform: translateY(0); opacity: 0; }
      20% { opacity: 0.9; }
      80% { opacity: 0.4; }
      100% { transform: translateY(-130px); opacity: 0; }
    }
    .welcomeNextWrap {
      margin-top: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .chromeActionBtn {
      position: relative;
      padding: 2px;
      border-radius: 12px;
      background: linear-gradient(135deg, #FFFFFF 0%, #8FA4B8 40%, #202D3A 60%, #FFFFFF 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 0 25px rgba(0, 229, 255, 0.35), 0 8px 24px rgba(0, 0, 0, 0.7);
      transition: all 0.25s ease;
    }
    .chromeActionBtn:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 0 35px rgba(0, 229, 255, 0.6), 0 12px 30px rgba(0, 0, 0, 0.85);
    }
    .btnInnerChrome {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 32px;
      background: linear-gradient(180deg, #162230 0%, #0A1018 100%);
      border-radius: 10px;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 2px;
      color: #FFFFFF;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
    }
    .btnArrow {
      font-size: 18px;
      color: #00E5FF;
      transition: transform 0.2s ease;
    }
    .chromeActionBtn:hover .btnArrow {
      transform: translateX(5px);
    }

    /* STAGE 4: INVITATION */
    .invitationHeader {
      text-align: center;
      margin-bottom: 25px;
    }
    .eventMasterTitle {
      font-size: clamp(32px, 6.5vw, 54px);
      margin: 0;
      line-height: 1.1;
    }
    .titleFreshers { color: #FFFFFF; }
    .titleParty { color: #00E5FF; text-shadow: 0 0 25px rgba(0, 229, 255, 0.7); }
    .yearMedallion {
      display: inline-block;
      margin-top: 8px;
      padding: 4px 18px;
      background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.15), transparent);
      border-top: 1px solid rgba(0, 229, 255, 0.4);
      border-bottom: 1px solid rgba(0, 229, 255, 0.4);
    }
    .yearText {
      font-family: 'Orbitron', sans-serif;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #FFFFFF;
    }
    .deptSubtitle {
      font-family: 'Share Tech Mono', monospace;
      font-size: 13px;
      letter-spacing: 3px;
      color: #8CA0B2;
      margin-top: 8px;
    }
    .invitationArmorPlate {
      position: relative;
      max-width: 650px;
      width: 100%;
      margin: 0 auto 30px;
      border-radius: 20px;
      padding: 3px;
      background: linear-gradient(
        135deg,
        #FFFFFF 0%,
        #8FA3B5 25%,
        #1A2532 50%,
        #B0C4D6 75%,
        #FFFFFF 100%
      );
      box-shadow: 
        0 0 45px rgba(0, 0, 0, 0.95),
        0 0 30px rgba(0, 229, 255, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }
    .armorHexRivet {
      position: absolute;
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #FFFFFF, #6C8296);
      border-radius: 3px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.9);
      z-index: 5;
    }
    .rivetTL { top: 10px; left: 10px; }
    .rivetTR { top: 10px; right: 10px; }
    .rivetBL { bottom: 10px; left: 10px; }
    .rivetBR { bottom: 10px; right: 10px; }

    .armorPlateInner {
      background: linear-gradient(180deg, #101925 0%, #080D15 100%);
      border-radius: 18px;
      padding: 35px 25px 30px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .collegeLogoBezel {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: #FFFFFF;
      padding: 6px;
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.4), 0 6px 16px rgba(0, 0, 0, 0.8);
      border: 3px solid #8FA3B5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
    }
    .collegeLogoImg {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 50%;
    }
    .collegeLabelWrap { text-align: center; }
    .collegeHeading {
      font-family: 'Orbitron', sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #DDE7F0;
      margin: 0;
    }
    .deptTagline {
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      color: #00E5FF;
      margin: 4px 0 0;
    }
    .chromePlateDivider {
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), #00E5FF, rgba(255, 255, 255, 0.3), transparent);
      margin: 20px 0;
    }

    .heartyWelcomeCard {
      position: relative;
      margin: 18px 0 24px;
      padding: 22px 20px 20px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(12, 19, 29, 0.95) 50%, rgba(0, 229, 255, 0.06) 100%);
      border-radius: 12px;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      box-shadow: 
        inset 0 1px 0 rgba(255, 255, 255, 0.45),
        inset 0 -1px 0 rgba(0, 0, 0, 0.8),
        0 8px 30px rgba(0, 0, 0, 0.6),
        0 0 25px rgba(0, 229, 255, 0.15);
      text-align: center;
      overflow: hidden;
      width: 100%;
    }
    .heartyWelcomeAura {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: radial-gradient(circle at 50% 30%, rgba(0, 229, 255, 0.18) 0%, transparent 70%);
    }
    .welcomeEmblemRow {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .welcomeGearIcon {
      font-size: 15px;
      filter: drop-shadow(0 0 8px #00E5FF);
      display: inline-block;
    }
    .spinSlow { animation: emblemSpin 10s linear infinite; }
    .spinSlowRev { animation: emblemSpin 10s linear infinite reverse; }
    @keyframes emblemSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .welcomeBadgeText {
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      letter-spacing: 3px;
      color: #00E5FF;
      font-weight: 700;
      text-transform: uppercase;
    }
    .heartyWelcomeTitle {
      font-family: 'Orbitron', sans-serif;
      font-size: clamp(22px, 5.5vw, 36px);
      font-weight: 900;
      letter-spacing: clamp(2px, 0.8vw, 5px);
      margin: 0 0 10px 0;
      line-height: 1.15;
      text-transform: uppercase;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 229, 255, 0.4);
    }
    .heartyWelcomeSub {
      font-family: 'Rajdhani', sans-serif;
      font-size: clamp(13px, 2.5vw, 16px);
      font-weight: 600;
      color: #B5CBDD;
      letter-spacing: 2px;
      margin: 0 0 12px 0;
      text-transform: uppercase;
    }
    .welcomeDividerBar {
      position: relative;
      height: 1px;
      max-width: 280px;
      margin: 0 auto;
      background: linear-gradient(90deg, transparent 0%, rgba(0, 229, 255, 0.8) 50%, transparent 100%);
    }
    .welcomeDivDot {
      position: absolute;
      top: -2.5px;
      left: 50%;
      transform: translateX(-50%);
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #00E5FF;
      box-shadow: 0 0 10px #00E5FF;
    }

    .eventBadgesGrid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 15px;
    }
    .chromeBadgeCard {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border-radius: 12px;
      background: linear-gradient(180deg, #152230 0%, #0C1520 100%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .chromeBadgeCard:hover {
      transform: translateY(-2px);
      border-color: #00E5FF;
    }
    .badgeIconBox { font-size: 24px; }
    .badgeContent { display: flex; flex-direction: column; }
    .badgeLabel {
      font-family: 'Orbitron', sans-serif;
      font-size: 10px;
      letter-spacing: 2px;
      color: #00E5FF;
    }
    .badgeValue {
      font-family: 'Rajdhani', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 1px;
    }
    .badgeSub {
      font-family: 'Share Tech Mono', monospace;
      font-size: 10px;
      color: #7E94A8;
    }

    .creedSection {
      text-align: center;
      margin: 10px 0 20px;
    }
    .creedLine1 {
      font-family: 'Orbitron', sans-serif;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 4px;
      color: #FFFFFF;
      margin: 0;
    }
    .creedLine2 {
      font-family: 'Orbitron', sans-serif;
      font-size: 18px;
      font-weight: 800;
      letter-spacing: 4px;
      color: #00E5FF;
      text-shadow: 0 0 15px rgba(0, 229, 255, 0.6);
      margin: 4px 0 12px;
    }
    .creedSubPill {
      display: inline-block;
      padding: 6px 18px;
      border-radius: 20px;
      background: rgba(0, 229, 255, 0.08);
      border: 1px solid rgba(0, 229, 255, 0.25);
      font-family: 'Share Tech Mono', monospace;
      font-size: 12px;
      letter-spacing: 2px;
      color: #DDE8F4;
    }

    .armorActionsBar {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 10px;
    }
    @media (min-width: 600px) {
      .armorActionsBar { flex-direction: row; }
    }
    .plateBtn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 18px;
      border-radius: 10px;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 1.5px;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.25);
      transition: all 0.2s ease;
    }
    .whatsappPlateBtn {
      background: linear-gradient(180deg, #1E8E3E 0%, #135A27 100%);
      color: #FFFFFF;
      box-shadow: 0 4px 15px rgba(30, 142, 62, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    .whatsappPlateBtn:hover {
      background: linear-gradient(180deg, #24A84A 0%, #16682E 100%);
      box-shadow: 0 6px 20px rgba(30, 142, 62, 0.6);
      transform: translateY(-2px);
    }
    .calendarPlateBtn {
      background: linear-gradient(180deg, #E65100 0%, #9C3600 100%);
      color: #FFFFFF;
      box-shadow: 0 4px 15px rgba(230, 81, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
    .calendarPlateBtn:hover {
      background: linear-gradient(180deg, #FF6A00 0%, #B84000 100%);
      box-shadow: 0 6px 20px rgba(230, 81, 0, 0.6);
      transform: translateY(-2px);
    }
    .copyPlateBtn {
      background: linear-gradient(180deg, #1A2634 0%, #0E1620 100%);
      color: #FFFFFF;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    .copyPlateBtn:hover {
      border-color: #00E5FF;
      box-shadow: 0 0 15px rgba(0, 229, 255, 0.35);
      transform: translateY(-2px);
    }

    .replaySection { margin-top: 25px; }
    .replayExperienceBtn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 1px dashed rgba(255, 255, 255, 0.3);
      border-radius: 20px;
      padding: 8px 18px;
      color: #8EA4B8;
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .replayExperienceBtn:hover {
      color: #00E5FF;
      border-color: #00E5FF;
      background: rgba(0, 229, 255, 0.08);
    }

    /* ── BORDER BIKE TRACK STYLES ── */
    .cardBorderBikeTrack {
      position: absolute;
      top: -14px;
      left: -14px;
      right: -14px;
      bottom: -14px;
      pointer-events: none;
      z-index: 25;
      overflow: visible;
    }
    .bikeLaserSvg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
      pointer-events: none;
      filter: drop-shadow(0 0 5px rgba(0, 229, 255, 0.8));
    }
    .bikeRacerElement {
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      transform-origin: 0 0;
      will-change: transform;
      pointer-events: none;
      opacity: 0;
      z-index: 30;
    }

    @media (max-width: 600px) {
      .gearTrainContainer { transform: scale(0.85); margin: 0 auto 10px; }
      .heavyDoor { width: 50%; }
      .armorPlateInner { padding: 25px 15px 20px; }
      .bgTwinEngineCutaway, .bgRobotArmAssembly { opacity: 0.35; transform: scale(0.8); }
      .bgTurbochargerAssembly, .bgBremboBrakeAssembly { display: none; }
    }
  </style>
</head>
<body>
  <div class="mechUniverse">
    <!-- SVG DEFS -->
    <svg width="0" height="0" style="position: absolute; pointer-events: none;">
      <defs>
        <linearGradient id="globalChromeFace" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="14%" stop-color="#E2EBF4" />
          <stop offset="32%" stop-color="#8EA3B5" />
          <stop offset="48%" stop-color="#354452" />
          <stop offset="52%" stop-color="#1B2630" />
          <stop offset="68%" stop-color="#7E94A8" />
          <stop offset="85%" stop-color="#DDE7F2" />
          <stop offset="100%" stop-color="#FFFFFF" />
        </linearGradient>
        <linearGradient id="globalChromeBevel" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
          <stop offset="35%" stop-color="#9AB2C6" />
          <stop offset="65%" stop-color="#334350" />
          <stop offset="100%" stop-color="#0B1117" />
        </linearGradient>
        <radialGradient id="globalLatheTurnedHub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="20%" stop-color="#A8BCCF" />
          <stop offset="38%" stop-color="#3E4F5E" />
          <stop offset="58%" stop-color="#CBD9E7" />
          <stop offset="78%" stop-color="#222F3A" />
          <stop offset="92%" stop-color="#879DB0" />
          <stop offset="100%" stop-color="#4A5B6B" />
        </radialGradient>
        <filter id="globalGearMetalShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.85" />
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#00E5FF" flood-opacity="0.3" />
        </filter>
        <filter id="realisticTurbulentSmoke" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" result="smokeNoise" />
          <feDisplacementMap in="SourceGraphic" in2="smokeNoise" scale="36" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>

    <!-- BACKGROUND TEXTURES -->
    <div class="steelDiamondGrid"></div>
    <div class="brushedMetalGrain"></div>
    <div class="chromePerimeterFrame"></div>
    <div class="industrialFog"></div>

    <!-- 1. KAWASAKI INLINE-4 ENGINE CUTAWAY (Left Background) -->
    <aside id="bgTwinEngineCutaway" class="bgTwinEngineCutaway" title="Kawasaki 1000cc 16-Valve DOHC Inline-4 Mechanical Engine Block" aria-hidden="true">
      <svg viewBox="0 0 240 320" width="100%" height="100%">
        <defs>
          <linearGradient id="pistonMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="25%" stop-color="#B0C4D6" />
            <stop offset="55%" stop-color="#3A4A58" />
            <stop offset="100%" stop-color="#141E28" />
          </linearGradient>
          <linearGradient id="cylinderSleeveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#1A2530" />
            <stop offset="20%" stop-color="#4A5C6D" />
            <stop offset="80%" stop-color="#4A5C6D" />
            <stop offset="100%" stop-color="#1A2530" />
          </linearGradient>
        </defs>
        <rect x="15" y="20" width="210" height="280" rx="8" fill="#0A111A" stroke="url(#globalChromeFace)" stroke-width="2" />
        <text x="120" y="38" text-anchor="middle" fill="#00E5FF" font-size="9" font-family="'Share Tech Mono', monospace" letter-spacing="1.5">
          KAWASAKI 1000cc • 16-VALVE INLINE-4
        </text>
        <rect x="25" y="48" width="85" height="150" fill="url(#cylinderSleeveGrad)" stroke="#6C8296" stroke-width="1.5" />
        <line x1="30" y1="65" x2="105" y2="110" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="4 4" />
        <line x1="30" y1="110" x2="105" y2="65" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="4 4" />
        <rect x="130" y="48" width="85" height="150" fill="url(#cylinderSleeveGrad)" stroke="#6C8296" stroke-width="1.5" />
        <line x1="135" y1="65" x2="210" y2="110" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="4 4" />
        <line x1="135" y1="110" x2="210" y2="65" stroke="rgba(255,255,255,0.15)" stroke-width="1" stroke-dasharray="4 4" />

        <g class="piston1Reciprocate">
          <rect x="30" y="55" width="75" height="48" rx="4" fill="url(#pistonMetalGrad)" stroke="#FFFFFF" stroke-width="1.5" />
          <line x1="30" y1="64" x2="105" y2="64" stroke="#050B12" stroke-width="2.5" />
          <line x1="30" y1="72" x2="105" y2="72" stroke="#050B12" stroke-width="2.5" />
          <line x1="30" y1="80" x2="105" y2="80" stroke="#050B12" stroke-width="2.5" />
          <circle cx="67" cy="88" r="8" fill="#FFFFFF" stroke="#0F1720" stroke-width="2" />
          <path d="M62 88 L58 178 L76 178 L72 88 Z" fill="url(#pistonMetalGrad)" stroke="#111B24" stroke-width="1.5" />
          <circle cx="67" cy="178" r="13" fill="url(#globalLatheTurnedHub)" stroke="#FFFFFF" stroke-width="1.5" />
        </g>
        <g class="piston2Reciprocate">
          <rect x="135" y="55" width="75" height="48" rx="4" fill="url(#pistonMetalGrad)" stroke="#FFFFFF" stroke-width="1.5" />
          <line x1="135" y1="64" x2="210" y2="64" stroke="#050B12" stroke-width="2.5" />
          <line x1="135" y1="72" x2="210" y2="72" stroke="#050B12" stroke-width="2.5" />
          <line x1="135" y1="80" x2="210" y2="80" stroke="#050B12" stroke-width="2.5" />
          <circle cx="172" cy="88" r="8" fill="#FFFFFF" stroke="#0F1720" stroke-width="2" />
          <path d="M167 88 L163 178 L181 178 L177 88 Z" fill="url(#pistonMetalGrad)" stroke="#111B24" stroke-width="1.5" />
          <circle cx="172" cy="178" r="13" fill="url(#globalLatheTurnedHub)" stroke="#FFFFFF" stroke-width="1.5" />
        </g>
        <g class="crankshaftAssembly">
          <circle cx="120" cy="235" r="48" fill="none" stroke="rgba(0,229,255,0.35)" stroke-width="2" stroke-dasharray="6 4" />
          <path d="M72 235 A48 48 0 0 1 120 187 L120 235 Z" fill="url(#pistonMetalGrad)" stroke="#111922" stroke-width="2" />
          <path d="M120 235 L120 283 A48 48 0 0 1 168 235 Z" fill="url(#pistonMetalGrad)" stroke="#111922" stroke-width="2" />
          <circle cx="120" cy="235" r="16" fill="#060C14" stroke="#00E5FF" stroke-width="2.5" />
          <circle cx="120" cy="235" r="6" fill="#00E5FF" />
        </g>
        <g class="camshaftValves">
          <line x1="50" y1="48" x2="50" y2="28" stroke="#FFFFFF" stroke-width="3" />
          <circle cx="50" cy="28" r="6" fill="#FF7700" class="sparkPlugFlash" />
          <line x1="190" y1="48" x2="190" y2="28" stroke="#FFFFFF" stroke-width="3" />
          <circle cx="190" cy="28" r="6" fill="#FF7700" class="sparkPlugFlash" />
        </g>
      </svg>
    </aside>

    <!-- 2. ROBOT ARM (Right Background) -->
    <aside class="bgRobotArmAssembly" title="Industrial 6-Axis Welding Robot Arm" aria-hidden="true">
      <svg viewBox="0 0 220 340" width="100%" height="100%">
        <defs>
          <linearGradient id="robotArmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="25%" stop-color="#9AB2C6" />
            <stop offset="60%" stop-color="#2A3846" />
            <stop offset="100%" stop-color="#0E1620" />
          </linearGradient>
        </defs>
        <rect x="55" y="295" width="110" height="35" rx="5" fill="url(#robotArmGrad)" stroke="#FFFFFF" stroke-width="2" />
        <circle cx="70" cy="312" r="4" fill="#0B131C" stroke="#FFFFFF" stroke-width="1" />
        <circle cx="150" cy="312" r="4" fill="#0B131C" stroke="#FFFFFF" stroke-width="1" />
        <circle cx="110" cy="280" r="28" fill="#14202D" stroke="#00E5FF" stroke-width="2.5" />
        <circle cx="110" cy="280" r="12" fill="url(#robotArmGrad)" stroke="#0E1620" stroke-width="1.5" />
        <g class="robotArmBoom">
          <rect x="98" y="150" width="24" height="130" rx="6" fill="url(#robotArmGrad)" stroke="#0B121A" stroke-width="2" />
          <line x1="88" y1="265" x2="88" y2="165" stroke="#00E5FF" stroke-width="7" stroke-linecap="round" />
          <circle cx="110" cy="150" r="20" fill="#152230" stroke="#FFFFFF" stroke-width="2" />
          <g class="robotForearm">
            <rect x="100" y="50" width="20" height="100" rx="5" fill="url(#robotArmGrad)" stroke="#0B121A" stroke-width="2" />
            <circle cx="110" cy="50" r="16" fill="#101C28" stroke="#00E5FF" stroke-width="2" />
            <path d="M102 50 L110 12 L118 50 Z" fill="url(#robotArmGrad)" stroke="#080E14" stroke-width="1.5" />
            <circle cx="110" cy="10" r="8" fill="#00E5FF" class="weldingArcFlare" />
            <circle cx="110" cy="10" r="4" fill="#FFFFFF" />
          </g>
        </g>
      </svg>
      <div class="weldingSparkFountain">
        <div class="weldingSpark" style="--dx:-18px;--dy:45px;width:2px;height:4px;animation-delay:0.05s;animation-duration:0.35s"></div>
        <div class="weldingSpark" style="--dx:24px;--dy:55px;width:3px;height:6px;animation-delay:0.15s;animation-duration:0.42s"></div>
        <div class="weldingSpark" style="--dx:-8px;--dy:65px;width:2.5px;height:5px;animation-delay:0.25s;animation-duration:0.48s"></div>
        <div class="weldingSpark" style="--dx:15px;--dy:75px;width:2px;height:4px;animation-delay:0.38s;animation-duration:0.38s"></div>
        <div class="weldingSpark" style="--dx:-22px;--dy:58px;width:3px;height:6px;animation-delay:0.52s;animation-duration:0.45s"></div>
      </div>
    </aside>

    <!-- 3. DRONE (Top Area) -->
    <aside class="bgPatrolDrone" title="Autonomous Facility Patrol Drone" aria-hidden="true">
      <svg viewBox="0 0 200 160" width="100%" height="100%">
        <defs>
          <linearGradient id="droneTitaniumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="35%" stop-color="#A2B6C8" />
            <stop offset="70%" stop-color="#263442" />
            <stop offset="100%" stop-color="#0B1117" />
          </linearGradient>
          <linearGradient id="volumetricLaserCone" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stop-color="#00E5FF" stop-opacity="0.85" />
            <stop offset="40%" stop-color="#00E5FF" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#00E5FF" stop-opacity="0" />
          </linearGradient>
        </defs>
        <polygon points="100,72 15,160 185,160" fill="url(#volumetricLaserCone)" class="droneScanBeam" />
        <line x1="55" y1="58" x2="25" y2="44" stroke="url(#droneTitaniumGrad)" stroke-width="6" stroke-linecap="round" />
        <line x1="145" y1="58" x2="175" y2="44" stroke="url(#droneTitaniumGrad)" stroke-width="6" stroke-linecap="round" />
        <ellipse cx="25" cy="44" rx="22" ry="7" fill="#060C14" stroke="#00E5FF" stroke-width="1.5" />
        <line x1="5" y1="44" x2="45" y2="44" stroke="#FFFFFF" stroke-width="3" class="rotorBlades" />
        <ellipse cx="175" cy="44" rx="22" ry="7" fill="#060C14" stroke="#00E5FF" stroke-width="1.5" />
        <line x1="155" y1="44" x2="195" y2="44" stroke="#FFFFFF" stroke-width="3" class="rotorBlades" />
        <ellipse cx="100" cy="58" rx="44" ry="18" fill="url(#droneTitaniumGrad)" stroke="#FFFFFF" stroke-width="1.5" />
        <ellipse cx="100" cy="52" rx="26" ry="10" fill="#0A121B" stroke="#00E5FF" stroke-width="1.5" />
        <circle cx="100" cy="68" r="7" fill="#00E5FF" class="droneSensorEye" />
        <circle cx="25" cy="44" r="3.5" fill="#FF0044" class="navStrobePort" />
        <circle cx="175" cy="44" r="3.5" fill="#00FF66" class="navStrobeStarboard" />
      </svg>
    </aside>

    <!-- 4. TURBOCHARGER -->
    <aside class="bgTurbochargerAssembly" title="Twin-Scroll Turbocharger" aria-hidden="true">
      <svg viewBox="0 0 140 140" width="100%" height="100%">
        <path d="M70 15 A55 55 0 1 1 20 85 L20 125 L45 125 A55 55 0 0 0 125 70 A55 55 0 0 0 70 15 Z" fill="url(#globalChromeFace)" stroke="url(#globalChromeBevel)" stroke-width="2" />
        <circle cx="70" cy="70" r="34" fill="#080E16" stroke="url(#globalChromeFace)" stroke-width="2.5" />
        <g class="turboImpellerSpinning">
          <circle cx="70" cy="70" r="30" fill="none" stroke="#00E5FF" stroke-width="1" stroke-dasharray="3 3" />
          <path d="M 70 70 Q 85 75 98 70" stroke="#FFF" stroke-width="2" fill="none" />
          <path d="M 70 70 Q 77 84 90 90" stroke="#FFF" stroke-width="2" fill="none" />
          <path d="M 70 70 Q 65 85 70 98" stroke="#FFF" stroke-width="2" fill="none" />
          <path d="M 70 70 Q 55 77 50 90" stroke="#FFF" stroke-width="2" fill="none" />
          <path d="M 70 70 Q 54 65 42 70" stroke="#FFF" stroke-width="2" fill="none" />
          <path d="M 70 70 Q 62 55 50 50" stroke="#FFF" stroke-width="2" fill="none" />
          <path d="M 70 70 Q 75 54 70 42" stroke="#FFF" stroke-width="2" fill="none" />
          <path d="M 70 70 Q 84 62 90 50" stroke="#FFF" stroke-width="2" fill="none" />
          <circle cx="70" cy="70" r="7" fill="#CCD8E4" stroke="#0A1017" stroke-width="1.5" />
        </g>
      </svg>
    </aside>

    <!-- 5. BREMBO BRAKE -->
    <aside class="bgBremboBrakeAssembly" title="Racing Disc Brake" aria-hidden="true">
      <svg viewBox="0 0 140 140" width="100%" height="100%">
        <circle cx="70" cy="70" r="58" fill="url(#globalLatheTurnedHub)" stroke="#FFFFFF" stroke-width="1.5" />
        <circle cx="70" cy="70" r="42" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="1" stroke-dasharray="6 4" />
        <circle cx="70" cy="70" r="26" fill="#141E28" stroke="url(#globalChromeFace)" stroke-width="2" />
        <path d="M20 30 Q 70 12 110 32 L 105 54 Q 70 38 28 50 Z" fill="#D31010" stroke="#FFFFFF" stroke-width="1.5" />
        <text x="65" y="38" text-anchor="middle" fill="#FFFFFF" font-size="7" font-weight="bold" font-family="'Orbitron', sans-serif">BREMBO</text>
      </svg>
    </aside>

    <!-- AMBIENT PARTICLES -->
    <div class="ambientParticles">
      <div class="ambientParticle" style="left:5%;top:12%;animation-delay:0.5s;animation-duration:8s"></div>
      <div class="ambientParticle" style="left:94%;top:16%;animation-delay:1.2s;animation-duration:11s"></div>
      <div class="ambientParticle" style="left:20%;top:66%;animation-delay:2.1s;animation-duration:9s"></div>
      <div class="ambientParticle" style="left:76%;top:84%;animation-delay:3.4s;animation-duration:13s"></div>
      <div class="ambientParticle" style="left:48%;top:14%;animation-delay:0.2s;animation-duration:7s"></div>
      <div class="ambientParticle" style="left:86%;top:52%;animation-delay:1.8s;animation-duration:10s"></div>
      <div class="ambientParticle" style="left:12%;top:86%;animation-delay:4.1s;animation-duration:12s"></div>
      <div class="ambientParticle" style="left:52%;top:34%;animation-delay:0.8s;animation-duration:9.5s"></div>
    </div>

    <!-- TOP UTILITY BAR -->
    <header class="topUtilityBar">
      <div class="deptBadge">
        <span class="badgeIcon">⚙</span>
        <span class="badgeText">MECH DEPT • 2026</span>
      </div>
      <button type="button" id="audioToggleBtn" class="chromeAudioBtn audioOn" title="Toggle Rotating Gear Sound">
        <span id="audioSpeaker">🔊</span>
        <span id="audioLabel">GEAR SOUND: LOUD</span>
      </button>
    </header>

    <!-- ══════════════════════════════════════════════════════════════
         STAGE 1: GEARS + SPARKS + YES/NO QUESTION
    ══════════════════════════════════════════════════════════════ -->
    <section id="stageGears" class="stageSection stageGears stageActive">
      <div class="stageGearsHeader">
        <h1 class="subHeadingTag lightSweep">DEPARTMENT OF MECHANICAL ENGINEERING</h1>
      </div>

      <div class="gearTrainContainer">
        <!-- Gear 1 -->
        <div class="gearNode gearNode1" id="gear1Holder"></div>
        <!-- Gear 2 -->
        <div class="gearNode gearNode2" id="gear2Holder"></div>
        <!-- Gear 3 -->
        <div class="gearNode gearNode3" id="gear3Holder"></div>

        <!-- Sparks Mesh Point 1 -->
        <div class="gearMeshPoint meshPoint1">
          <div class="frictionHotspot"></div>
          <div class="meshSpark" style="--dx:42px;--dy:-32px;--sparkColor:#FFFFFF;width:3.5px;height:7px;animation-delay:0s;animation-duration:0.45s"></div>
          <div class="meshSpark" style="--dx:58px;--dy:14px;--sparkColor:#FFD000;width:4px;height:8px;animation-delay:0.12s;animation-duration:0.6s"></div>
          <div class="meshSpark" style="--dx:-38px;--dy:34px;--sparkColor:#FF7700;width:2.5px;height:5px;animation-delay:0.22s;animation-duration:0.5s"></div>
          <div class="meshSpark" style="--dx:48px;--dy:-44px;--sparkColor:#FFF6A0;width:3px;height:6px;animation-delay:0.35s;animation-duration:0.55s"></div>
          <div class="meshSpark" style="--dx:64px;--dy:-10px;--sparkColor:#FFAA00;width:4.5px;height:9px;animation-delay:0.48s;animation-duration:0.7s"></div>
          <div class="meshSpark" style="--dx:46px;--dy:38px;--sparkColor:#FFFFFF;width:3.5px;height:7px;animation-delay:0.72s;animation-duration:0.65s"></div>
        </div>

        <!-- Sparks Mesh Point 2 -->
        <div class="gearMeshPoint meshPoint2">
          <div class="frictionHotspot"></div>
          <div class="meshSpark" style="--dx:-35px;--dy:-38px;--sparkColor:#FFD700;width:3px;height:6px;animation-delay:0.05s;animation-duration:0.5s"></div>
          <div class="meshSpark" style="--dx:45px;--dy:-25px;--sparkColor:#FFFFFF;width:4px;height:8px;animation-delay:0.18s;animation-duration:0.62s"></div>
          <div class="meshSpark" style="--dx:-54px;--dy:26px;--sparkColor:#FF6600;width:2.5px;height:5px;animation-delay:0.3s;animation-duration:0.55s"></div>
          <div class="meshSpark" style="--dx:38px;--dy:42px;--sparkColor:#FFF8B0;width:3.5px;height:7px;animation-delay:0.45s;animation-duration:0.68s"></div>
        </div>
      </div>

      <!-- Question Card -->
      <div class="questionCardArmor" id="cardGears">
        <div class="qArmorCornerTL"></div>
        <div class="qArmorCornerTR"></div>
        <div class="qArmorCornerBL"></div>
        <div class="qArmorCornerBR"></div>

        <div class="questionInner">
          <p class="qCardSub">AUTHENTICATION CHALLENGE</p>
          <h2 class="qCardTitle chromeHeading">
            ARE YOU A <br />
            <span class="chromeShimmer">MECHANICAL ENGINEER?</span>
          </h2>

          <div class="qActionButtons">
            <button type="button" class="chromeYesBtn" id="yesBtn">
              <span class="yesBtnText">⚙️ YES, I AM</span>
            </button>
            <button type="button" class="chromeNoBtn" id="noBtn">
              <span class="noBtnText">NO</span>
            </button>
          </div>
          <p class="noAttemptWarning" id="noWarning" style="display:none"></p>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════
         STAGE 2: ENGINE IGNITION ROOM (10,000 RPM TACHOMETER + 3 CLICKS)
    ══════════════════════════════════════════════════════════════ -->
    <section id="stageEngine" class="stageSection stageEngine">
      <!-- Smoke Plumes Vessel -->
      <div class="smokeVessel" id="engineSmoke">
        <div class="exhaustTailpipe pipeLeft"><div class="pipeCoreGlow"></div></div>
        <div class="exhaustTailpipe pipeRight"><div class="pipeCoreGlow"></div></div>
        <div id="smokePuffsContainer"></div>
        <div class="rollingFloorFog"></div>
        <div class="exhaustFlameBurst"></div>
      </div>

      <!-- Heavy Blast Doors -->
      <div class="blastDoorRig" id="blastDoors">
        <div class="heavyDoor heavyDoorLeft"></div>
        <div class="heavyDoor heavyDoorRight"></div>
        <div class="doorSeamGlow"></div>
      </div>

      <!-- Ignition Console -->
      <div class="ignitionConsole" id="cardEngine">
        <div class="racingCluster">
          <!-- 16-Segment F1 Shift Light Bar -->
          <div class="shiftLightArray" id="shiftLeds">
            <span class="shiftLed ledGreen" data-min="1000"></span>
            <span class="shiftLed ledGreen" data-min="1800"></span>
            <span class="shiftLed ledGreen" data-min="2600"></span>
            <span class="shiftLed ledGreen" data-min="3400"></span>
            <span class="shiftLed ledAmber" data-min="4200"></span>
            <span class="shiftLed ledAmber" data-min="5000"></span>
            <span class="shiftLed ledAmber" data-min="5800"></span>
            <span class="shiftLed ledAmber" data-min="6600"></span>
            <span class="shiftLed ledRed" data-min="7400"></span>
            <span class="shiftLed ledRed" data-min="8200"></span>
            <span class="shiftLed ledRed" data-min="9000"></span>
            <span class="shiftLed ledRed" data-min="9500"></span>
            <span class="shiftLed ledRedline" data-min="10000"></span>
            <span class="shiftLed ledRedline" data-min="10000"></span>
          </div>

          <div class="digitalRpmDisplay">
            <div class="rpmMainNumber">
              <span class="rpmDigits" id="rpmDigits">0000</span>
              <span class="rpmUnit">RPM</span>
            </div>
          </div>

          <div class="rpmScaleTicks">
            <span>0</span>
            <span>2K</span>
            <span>4K</span>
            <span>6K</span>
            <span>8K</span>
            <span class="scaleRedline">10,000 RPM</span>
          </div>

          <div class="rpmTachometer">
            <div class="rpmBarFill" id="rpmBar"></div>
          </div>
        </div>

        <!-- Supercar Start Button -->
        <div class="engineStartHarness">
          <div class="knurledChromeRing">
            <div class="hexBolt b1"></div>
            <div class="hexBolt b2"></div>
            <div class="hexBolt b3"></div>
            <div class="hexBolt b4"></div>
            <div class="ignitionHalo" id="ignitionHalo">
              <button type="button" class="engineStartButton" id="engineStartBtn">
                <div class="buttonSteelFace">
                  <span class="btnSubTop">ENGINE</span>
                  <span class="btnMainText">START</span>
                  <span class="btnSubBottom" id="btnClickCounter">CLICK 1/3</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Quotation Plaque -->
          <div class="engineQuotePlaque">
            <span class="quoteCornerBolt qcb-tl"></span>
            <span class="quoteCornerBolt qcb-tr"></span>
            <span class="quoteCornerBolt qcb-bl"></span>
            <span class="quoteCornerBolt qcb-br"></span>
            <div class="quoteEmblemRow">
              <span class="quoteGearIcon">⚙️</span>
              <span class="quoteBadgeText">MECHANICAL ENGINEERS’ CREED</span>
              <span class="quoteGearIcon">⚙️</span>
            </div>
            <blockquote class="quoteStatement">
              “The engine is the heart of a machine, but the engineer is its soul.”
            </blockquote>
            <div class="quoteFooter">
              <span class="quoteDividerLine"></span>
              <span class="quoteAuthor">DEPARTMENT OF MECHANICAL ENGINEERING</span>
              <span class="quoteDividerLine"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════
         STAGE 3: "WELCOME TO THE CLUB"
    ══════════════════════════════════════════════════════════════ -->
    <section id="stageWelcome" class="stageSection stageWelcome">
      <div class="welcomeToTheClubBanner" id="cardWelcome">
        <div class="voiceSoundWave">
          <span class="bar b1"></span>
          <span class="bar b2"></span>
          <span class="bar b3"></span>
          <span class="bar b4"></span>
          <span class="bar b5"></span>
          <span class="bar b6"></span>
          <span class="bar b7"></span>
        </div>
        <p class="welcomeSupTitle lightSweep">WELCOME</p>
        <h2 class="welcomeClubTitle chromeLarge chromeShimmer">TO THE CLUB</h2>
        <div class="welcomeParticleStream" id="welcomeSparkles"></div>
        <div class="welcomeNextWrap">
          <button type="button" class="chromeActionBtn" id="proceedBtn">
            <span class="btnInnerChrome">
              <span>VIEW OFFICIAL INVITATION</span>
              <span class="btnArrow">→</span>
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════════════════════════════════════════
         STAGE 4: THE INVITATION
    ══════════════════════════════════════════════════════════════ -->
    <section id="stageInvitation" class="stageSection stageInvitation">
      <div class="invitationHeader">
        <h1 class="eventMasterTitle chromeHeading">
          <span class="titleFreshers">FRESHERS</span> <span class="titleParty">PARTY</span>
        </h1>
        <div class="yearMedallion">
          <span class="yearText">2026</span>
        </div>
        <p class="deptSubtitle">DEPARTMENT OF MECHANICAL ENGINEERING</p>
      </div>

      <div class="invitationArmorPlate" id="cardInvitation">
        <div class="armorHexRivet rivetTL"></div>
        <div class="armorHexRivet rivetTR"></div>
        <div class="armorHexRivet rivetBL"></div>
        <div class="armorHexRivet rivetBR"></div>

        <div class="armorPlateInner">
          <!-- College Logo -->
          <div class="collegeLogoBezel">
            <img src="${logoBase64 ? `data:image/png;base64,${logoBase64}` : 'logo.png'}" alt="Narayana Engineering College, Nellore" class="collegeLogoImg" />
          </div>

          <div class="collegeLabelWrap">
            <p class="collegeHeading">NARAYANA ENGINEERING COLLEGE (AUTONOMOUS), NELLORE</p>
            <p class="deptTagline">DEPARTMENT OF MECHANICAL ENGINEERING</p>
          </div>

          <div class="chromePlateDivider"></div>

          <!-- Heartily Welcome To All Banner -->
          <div class="heartyWelcomeCard">
            <div class="heartyWelcomeAura"></div>
            <div class="welcomeEmblemRow">
              <span class="welcomeGearIcon spinSlow">⚙️</span>
              <span class="welcomeBadgeText">GRAND INVITATION</span>
              <span class="welcomeGearIcon spinSlowRev">⚙️</span>
            </div>
            <h2 class="heartyWelcomeTitle chromeShimmer">HEARTILY WELCOME TO ALL</h2>
            <p class="heartyWelcomeSub">CORDIALLY INVITING ALL FACULTY MEMBERS &amp; FRESHERS</p>
            <div class="welcomeDividerBar">
              <span class="welcomeDivDot"></span>
            </div>
          </div>

          <div class="chromePlateDivider"></div>

          <!-- Event Badges Grid -->
          <div class="eventBadgesGrid">
            <div class="chromeBadgeCard">
              <div class="badgeIconBox">📅</div>
              <div class="badgeContent">
                <span class="badgeLabel">EVENT DATE</span>
                <strong class="badgeValue">10 OCTOBER 2026</strong>
                <span class="badgeSub">SATURDAY</span>
              </div>
            </div>

            <div class="chromeBadgeCard">
              <div class="badgeIconBox">⏰</div>
              <div class="badgeContent">
                <span class="badgeLabel">SCHEDULED TIME</span>
                <strong class="badgeValue">9:00 AM TO 1:00 PM</strong>
                <span class="badgeSub">IST (ASIA/KOLKATA)</span>
              </div>
            </div>

            <div class="chromeBadgeCard">
              <div class="badgeIconBox">📍</div>
              <div class="badgeContent">
                <span class="badgeLabel">EVENT VENUE</span>
                <strong class="badgeValue">MECHANICAL SEMINAR HALL</strong>
                <span class="badgeSub">CAMPUS MAIN BLOCK</span>
              </div>
            </div>
          </div>

          <div class="chromePlateDivider"></div>

          <div class="creedSection">
            <p class="creedLine1">WHERE GEARS TURN</p>
            <p class="creedLine2">AND LEGENDS BEGIN</p>
            <div class="creedSubPill">
              <span>START YOUR ENGINE</span> • <span>FEEL THE POWER</span> • <span>OWN THE LIFE.</span>
            </div>
          </div>

          <div class="armorActionsBar">
            <button type="button" class="plateBtn whatsappPlateBtn" id="shareWhatsAppBtn">
              <span class="btnIcon">💬</span>
              <span class="btnLabel">SHARE ON WHATSAPP</span>
            </button>
            <button type="button" class="plateBtn calendarPlateBtn" id="addCalendarBtn">
              <span class="btnIcon">📅</span>
              <span class="btnLabel">ADD TO CALENDAR</span>
            </button>
            <button type="button" class="plateBtn copyPlateBtn" id="copyLinkBtn">
              <span class="btnIcon">🔗</span>
              <span class="btnLabel" id="copyBtnLabel">COPY LINK</span>
            </button>
          </div>

          <div class="replaySection">
            <button type="button" class="replayExperienceBtn" id="replayBtn">
              <span class="replayIcon">🔄</span>
              <span class="replayText">REPLAY EXPERIENCE FROM STAGE 1</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>

  <script>
    /* ================================================================
       1. WEB AUDIO API SYNTHESIZER (KAWASAKI INLINE-4 & GEAR SOUNDS)
       ================================================================ */
    class MechanicalAudioEngine {
      constructor() {
        this.ctx = null;
        this.gearGainNode = null;
        this.isGearSoundRunning = false;
      }

      initContext() {
        if (!this.ctx && typeof window !== "undefined") {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC) this.ctx = new AC();
        }
        if (this.ctx && this.ctx.state === "suspended") {
          this.ctx.resume().catch(() => {});
        }
        return this.ctx;
      }

      startGearAmbience() {
        const ctx = this.initContext();
        if (!ctx) return;
        if (this.isGearSoundRunning && this.gearGainNode) {
          this.gearGainNode.gain.setValueAtTime(0.42, ctx.currentTime);
          return;
        }
        try {
          this.isGearSoundRunning = true;
          const now = ctx.currentTime;
          const masterGain = ctx.createGain();
          masterGain.gain.setValueAtTime(0.001, now);
          masterGain.gain.linearRampToValueAtTime(0.42, now + 0.3);
          masterGain.connect(ctx.destination);
          this.gearGainNode = masterGain;

          const motorOsc = ctx.createOscillator();
          motorOsc.type = "sawtooth";
          motorOsc.frequency.setValueAtTime(58, now);
          const motorFilter = ctx.createBiquadFilter();
          motorFilter.type = "lowpass";
          motorFilter.frequency.setValueAtTime(240, now);
          motorFilter.Q.setValueAtTime(2.2, now);
          const motorGain = ctx.createGain();
          motorGain.gain.setValueAtTime(0.7, now);
          motorOsc.connect(motorFilter);
          motorFilter.connect(motorGain);
          motorGain.connect(masterGain);
          motorOsc.start(now);

          const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
          const data = noiseBuf.getChannelData(0);
          for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.9;
          const noiseSrc = ctx.createBufferSource();
          noiseSrc.buffer = noiseBuf;
          noiseSrc.loop = true;
          const noiseFilter = ctx.createBiquadFilter();
          noiseFilter.type = "bandpass";
          noiseFilter.frequency.setValueAtTime(1580, now);
          noiseFilter.Q.setValueAtTime(4.0, now);
          const lfo = ctx.createOscillator();
          lfo.frequency.setValueAtTime(16, now);
          const noiseGain = ctx.createGain();
          noiseGain.gain.setValueAtTime(0.55, now);
          lfo.connect(noiseGain.gain);
          noiseSrc.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(masterGain);
          lfo.start(now);
          noiseSrc.start(now);
        } catch {
          this.isGearSoundRunning = false;
        }
      }

      stopGearAmbience() {
        if (!this.isGearSoundRunning || !this.gearGainNode || !this.ctx) return;
        try {
          const now = this.ctx.currentTime;
          this.gearGainNode.gain.linearRampToValueAtTime(0.001, now + 0.3);
          setTimeout(() => { this.isGearSoundRunning = false; }, 350);
        } catch {
          this.isGearSoundRunning = false;
        }
      }

      playLockClank() {
        const ctx = this.initContext();
        if (!ctx) return;
        try {
          const now = ctx.currentTime;
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(950, now);
          osc.frequency.exponentialRampToValueAtTime(180, now + 0.15);
          g.gain.setValueAtTime(0.6, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
        } catch {}
      }

      playEngineCrank1() {
        const ctx = this.initContext();
        if (!ctx) return;
        try {
          const now = ctx.currentTime;
          const relayOsc = ctx.createOscillator();
          const relayGain = ctx.createGain();
          relayOsc.type = "square";
          relayOsc.frequency.setValueAtTime(580, now);
          relayOsc.frequency.exponentialRampToValueAtTime(90, now + 0.04);
          relayGain.gain.setValueAtTime(0.85, now);
          relayGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
          relayOsc.connect(relayGain);
          relayGain.connect(ctx.destination);
          relayOsc.start(now);
          relayOsc.stop(now + 0.05);

          const starterOsc = ctx.createOscillator();
          const starterFilter = ctx.createBiquadFilter();
          const starterGain = ctx.createGain();
          starterOsc.type = "sawtooth";
          starterOsc.frequency.setValueAtTime(380, now + 0.03);
          starterOsc.frequency.linearRampToValueAtTime(680, now + 0.16);
          starterOsc.frequency.linearRampToValueAtTime(520, now + 0.28);
          starterOsc.frequency.linearRampToValueAtTime(820, now + 0.48);
          starterFilter.type = "bandpass";
          starterFilter.frequency.setValueAtTime(1400, now);
          starterGain.gain.setValueAtTime(0.001, now + 0.03);
          starterGain.gain.linearRampToValueAtTime(0.65, now + 0.14);
          starterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
          starterOsc.connect(starterFilter);
          starterFilter.connect(starterGain);
          starterGain.connect(ctx.destination);
          starterOsc.start(now + 0.03);
          starterOsc.stop(now + 0.6);

          [0.08, 0.20, 0.32, 0.44].forEach((tOffset, i) => {
            const t = now + tOffset;
            const compOsc = ctx.createOscillator();
            const compGain = ctx.createGain();
            compOsc.type = "triangle";
            compOsc.frequency.setValueAtTime(130 - i * 8, t);
            compOsc.frequency.exponentialRampToValueAtTime(45, t + 0.12);
            compGain.gain.setValueAtTime(0.95, t);
            compGain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
            compOsc.connect(compGain);
            compGain.connect(ctx.destination);
            compOsc.start(t);
            compOsc.stop(t + 0.14);
          });
        } catch {}
      }

      playEngineCrank2() {
        const ctx = this.initContext();
        if (!ctx) return;
        try {
          const now = ctx.currentTime;
          const starterOsc = ctx.createOscillator();
          const starterGain = ctx.createGain();
          starterOsc.type = "sawtooth";
          starterOsc.frequency.setValueAtTime(540, now + 0.02);
          starterOsc.frequency.linearRampToValueAtTime(940, now + 0.3);
          starterGain.gain.setValueAtTime(0.45, now + 0.02);
          starterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
          starterOsc.connect(starterGain);
          starterGain.connect(ctx.destination);
          starterOsc.start(now + 0.02);
          starterOsc.stop(now + 0.38);

          const fireT = now + 0.22;
          const thudOsc = ctx.createOscillator();
          const thudGain = ctx.createGain();
          thudOsc.type = "sine";
          thudOsc.frequency.setValueAtTime(180, fireT);
          thudOsc.frequency.exponentialRampToValueAtTime(42, fireT + 0.24);
          thudGain.gain.setValueAtTime(1.8, fireT);
          thudGain.gain.exponentialRampToValueAtTime(0.001, fireT + 0.26);
          thudOsc.connect(thudGain);
          thudGain.connect(ctx.destination);
          thudOsc.start(fireT);
          thudOsc.stop(fireT + 0.28);

          [0.24, 0.31, 0.38, 0.45, 0.52, 0.60].forEach((pOffset, idx) => {
            const pt = now + pOffset;
            const pOsc = ctx.createOscillator();
            const pFilter = ctx.createBiquadFilter();
            const pGain = ctx.createGain();
            pOsc.type = "sawtooth";
            pOsc.frequency.setValueAtTime(120 + idx * 12, pt);
            pFilter.type = "bandpass";
            pFilter.frequency.setValueAtTime(1400, pt);
            pGain.gain.setValueAtTime(0.95, pt);
            pGain.gain.exponentialRampToValueAtTime(0.001, pt + 0.11);
            pOsc.connect(pFilter);
            pFilter.connect(pGain);
            pGain.connect(ctx.destination);
            pOsc.start(pt);
            pOsc.stop(pt + 0.12);
          });
        } catch {}
      }

      playEngineRoarRaw() {
        const ctx = this.initContext();
        if (!ctx) return;
        try {
          const now = ctx.currentTime;
          const compressor = ctx.createDynamicsCompressor();
          compressor.threshold.setValueAtTime(-18, now);
          compressor.knee.setValueAtTime(12, now);
          compressor.ratio.setValueAtTime(4, now);
          compressor.connect(ctx.destination);

          const masterRoarGain = ctx.createGain();
          masterRoarGain.gain.setValueAtTime(1.4, now);
          masterRoarGain.connect(compressor);

          const chamberDelay = ctx.createDelay();
          chamberDelay.delayTime.setValueAtTime(0.0035, now);
          const chamberFeedback = ctx.createGain();
          chamberFeedback.gain.setValueAtTime(0.35, now);
          chamberDelay.connect(chamberFeedback);
          chamberFeedback.connect(chamberDelay);
          chamberDelay.connect(masterRoarGain);

          const osc1 = ctx.createOscillator();
          osc1.type = "triangle";
          osc1.frequency.setValueAtTime(120, now);
          osc1.frequency.exponentialRampToValueAtTime(330, now + 0.82);
          osc1.frequency.exponentialRampToValueAtTime(170, now + 1.25);

          const osc2 = ctx.createOscillator();
          osc2.type = "sawtooth";
          osc2.frequency.setValueAtTime(240, now);
          osc2.frequency.exponentialRampToValueAtTime(660, now + 0.82);
          osc2.frequency.exponentialRampToValueAtTime(340, now + 1.25);

          const oscSub = ctx.createOscillator();
          oscSub.type = "sine";
          oscSub.frequency.setValueAtTime(60, now);
          oscSub.frequency.exponentialRampToValueAtTime(165, now + 0.82);
          oscSub.frequency.exponentialRampToValueAtTime(85, now + 1.25);

          const exhaustFilter = ctx.createBiquadFilter();
          exhaustFilter.type = "lowpass";
          exhaustFilter.frequency.setValueAtTime(420, now);
          exhaustFilter.frequency.exponentialRampToValueAtTime(2600, now + 0.82);
          exhaustFilter.frequency.exponentialRampToValueAtTime(400, now + 1.25);

          const roarGain = ctx.createGain();
          roarGain.gain.setValueAtTime(0.001, now);
          roarGain.gain.linearRampToValueAtTime(0.7, now + 0.12);
          roarGain.gain.linearRampToValueAtTime(1.35, now + 0.82);
          roarGain.gain.setValueAtTime(1.2, now + 0.95);
          roarGain.gain.exponentialRampToValueAtTime(0.001, now + 1.28);

          osc1.connect(exhaustFilter);
          osc2.connect(exhaustFilter);
          oscSub.connect(exhaustFilter);
          exhaustFilter.connect(chamberDelay);
          exhaustFilter.connect(roarGain);
          roarGain.connect(masterRoarGain);

          osc1.start(now); osc2.start(now); oscSub.start(now);
          osc1.stop(now + 1.3); osc2.stop(now + 1.3); oscSub.stop(now + 1.3);
        } catch {}
      }

      playHydraulicHiss() {
        const ctx = this.initContext();
        if (!ctx) return;
        try {
          const now = ctx.currentTime;
          const buf = ctx.createBuffer(1, ctx.sampleRate * 0.9, ctx.sampleRate);
          const d = buf.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5);
          const src = ctx.createBufferSource();
          src.buffer = buf;
          const bp = ctx.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.setValueAtTime(2600, now);
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.5, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
          src.connect(bp);
          bp.connect(g);
          g.connect(ctx.destination);
          src.start(now);
          src.stop(now + 0.9);
        } catch {}
      }

      playWelcomeEntryChime() {
        const ctx = this.initContext();
        if (!ctx) return;
        try {
          const now = ctx.currentTime;
          const subOsc = ctx.createOscillator();
          const subGain = ctx.createGain();
          subOsc.type = "sine";
          subOsc.frequency.setValueAtTime(85, now);
          subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.45);
          subGain.gain.setValueAtTime(0.45, now);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          subOsc.connect(subGain);
          subGain.connect(ctx.destination);
          subOsc.start(now);
          subOsc.stop(now + 0.6);

          const chimeOsc = ctx.createOscillator();
          const chimeGain = ctx.createGain();
          chimeOsc.type = "sine";
          chimeOsc.frequency.setValueAtTime(880, now);
          chimeOsc.frequency.exponentialRampToValueAtTime(587.33, now + 0.55);
          chimeGain.gain.setValueAtTime(0.25, now);
          chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
          chimeOsc.connect(chimeGain);
          chimeGain.connect(ctx.destination);
          chimeOsc.start(now);
          chimeOsc.stop(now + 0.75);
        } catch {}
      }
    }

    const audio = new MechanicalAudioEngine();

    /* ================================================================
       2. SVG GEAR GENERATOR
       ================================================================ */
    function generateGearSvg(size, outerR, rootR, teeth, spokes, speed, cw) {
      const step = (Math.PI * 2) / teeth;
      const points = [];
      for (let i = 0; i < teeth; i++) {
        const a0 = i * step;
        const a1 = a0 + step * 0.22;
        const a2 = a0 + step * 0.44;
        const a3 = a0 + step * 0.66;
        const x0 = (Math.cos(a0) * rootR).toFixed(2);
        const y0 = (Math.sin(a0) * rootR).toFixed(2);
        const x1 = (Math.cos(a1) * outerR).toFixed(2);
        const y1 = (Math.sin(a1) * outerR).toFixed(2);
        const x2 = (Math.cos(a2) * outerR).toFixed(2);
        const y2 = (Math.sin(a2) * outerR).toFixed(2);
        const x3 = (Math.cos(a3) * rootR).toFixed(2);
        const y3 = (Math.sin(a3) * rootR).toFixed(2);
        if (i === 0) points.push(\`M \${x0} \${y0}\`);
        else points.push(\`L \${x0} \${y0}\`);
        points.push(\`L \${x1} \${y1} A \${outerR} \${outerR} 0 0 1 \${x2} \${y2} L \${x3} \${y3}\`);
      }
      points.push("Z");
      const gearPath = points.join(" ");

      const spokeHoleR = rootR * 0.48;
      const holeRadius = spokeHoleR * 0.38;
      let holes = "";
      for (let i = 0; i < spokes; i++) {
        const angle = (i * (Math.PI * 2)) / spokes;
        const hx = (Math.cos(angle) * spokeHoleR).toFixed(2);
        const hy = (Math.sin(angle) * spokeHoleR).toFixed(2);
        holes += \`<circle cx="\${hx}" cy="\${hy}" r="\${holeRadius.toFixed(2)}" fill="#070C14" stroke="url(#globalChromeFace)" stroke-width="2" />
                  <circle cx="\${hx}" cy="\${hy}" r="\${(holeRadius - 2).toFixed(2)}" fill="#070C14" stroke="#020509" stroke-width="1" />\`;
      }

      let bolts = "";
      for (let i = 0; i < 6; i++) {
        const angle = (i * (Math.PI * 2)) / 6;
        const bx = Number((Math.cos(angle) * (rootR * 0.28)).toFixed(2));
        const by = Number((Math.sin(angle) * (rootR * 0.28)).toFixed(2));
        bolts += \`<circle cx="\${bx}" cy="\${by}" r="4" fill="#0D141C" />
                 <polygon points="\${bx},\${by - 3} \${(bx + 2.6).toFixed(2)},\${(by - 1.5).toFixed(2)} \${(bx + 2.6).toFixed(2)},\${(by + 1.5).toFixed(2)} \${bx},\${by + 3} \${(bx - 2.6).toFixed(2)},\${(by + 1.5).toFixed(2)} \${(bx - 2.6).toFixed(2)},\${(by - 1.5).toFixed(2)}" fill="url(#globalChromeFace)" stroke="#FFFFFF" stroke-width="0.5" />\`;
      }

      return \`<div style="width:\${size}px;height:\${size}px;animation:\${cw ? 'gearRotateCW' : 'gearRotateCCW'} \${speed}s linear infinite;will-change:transform">
        <svg viewBox="-120 -120 240 240" width="100%" height="100%" style="display:block">
          <path d="\${gearPath}" fill="url(#globalChromeFace)" stroke="url(#globalChromeBevel)" stroke-width="2.2" filter="url(#globalGearMetalShadow)" />
          <circle cx="0" cy="0" r="\${(rootR * 0.94).toFixed(2)}" fill="none" stroke="url(#globalChromeBevel)" stroke-width="2.5" />
          <circle cx="0" cy="0" r="\${(rootR * 0.84).toFixed(2)}" fill="url(#globalLatheTurnedHub)" stroke="#111B24" stroke-width="1.5" />
          \${holes}
          <circle cx="0" cy="0" r="\${(rootR * 0.42).toFixed(2)}" fill="url(#globalChromeFace)" stroke="url(#globalChromeBevel)" stroke-width="2.5" />
          \${bolts}
          <circle cx="0" cy="0" r="\${(rootR * 0.16).toFixed(2)}" fill="url(#globalLatheTurnedHub)" stroke="#FFFFFF" stroke-width="1.2" />
          <circle cx="0" cy="0" r="\${(rootR * 0.08).toFixed(2)}" fill="#0A1017" stroke="url(#globalChromeFace)" stroke-width="1" />
        </svg>
      </div>\`;
    }

    document.getElementById("gear1Holder").innerHTML = generateGearSvg(250, 115, 92, 20, 6, 16, true);
    document.getElementById("gear2Holder").innerHTML = generateGearSvg(182, 82, 64, 14, 5, 11.2, false);
    document.getElementById("gear3Holder").innerHTML = generateGearSvg(134, 60, 47, 10, 4, 8, false);

    /* ================================================================
       3. BORDER BIKE RACER COMPONENT (GPU REQUESTANIMATIONFRAME)
       ================================================================ */
    function getBorderTrackPos(dist, w, h, r) {
      const safeR = Math.max(8, Math.min(r, Math.min(w, h) / 2 - 1));
      const lTop = Math.max(0, w - 2 * safeR);
      const arc = (Math.PI / 2) * safeR;
      const lRight = Math.max(0, h - 2 * safeR);
      const lBottom = lTop;
      const lLeft = lRight;
      const total = 2 * lTop + 2 * lRight + 4 * arc;
      if (total <= 0) return { x: 0, y: 0, angle: 0 };
      const d = ((dist % total) + total) % total;

      if (d <= lTop) return { x: safeR + d, y: 0, angle: 0 };
      let acc = lTop;

      if (d <= acc + arc) {
        const f = (d - acc) / arc;
        const theta = -Math.PI / 2 + f * (Math.PI / 2);
        return { x: w - safeR + safeR * Math.cos(theta), y: safeR + safeR * Math.sin(theta), angle: f * 90 };
      }
      acc += arc;

      if (d <= acc + lRight) return { x: w, y: safeR + (d - acc), angle: 90 };
      acc += lRight;

      if (d <= acc + arc) {
        const f = (d - acc) / arc;
        const theta = f * (Math.PI / 2);
        return { x: w - safeR + safeR * Math.cos(theta), y: h - safeR + safeR * Math.sin(theta), angle: 90 + f * 90 };
      }
      acc += arc;

      if (d <= acc + lBottom) return { x: w - safeR - (d - acc), y: h, angle: 180 };
      acc += lBottom;

      if (d <= acc + arc) {
        const f = (d - acc) / arc;
        const theta = Math.PI / 2 + f * (Math.PI / 2);
        return { x: safeR + safeR * Math.cos(theta), y: h - safeR + safeR * Math.sin(theta), angle: 180 + f * 90 };
      }
      acc += arc;

      if (d <= acc + lLeft) return { x: 0, y: h - safeR - (d - acc), angle: 270 };
      acc += lLeft;

      const f = Math.min(1, Math.max(0, (d - acc) / arc));
      const theta = Math.PI + f * (Math.PI / 2);
      return { x: safeR + safeR * Math.cos(theta), y: safeR + safeR * Math.sin(theta), angle: 270 + f * 90 };
    }

    function computePathD(w, h, r) {
      const safeR = Math.max(8, Math.min(r, Math.min(w, h) / 2 - 1));
      return \`M \${safeR} 0 L \${w - safeR} 0 Q \${w} 0 \${w} \${safeR} L \${w} \${h - safeR} Q \${w} \${h} \${w - safeR} \${h} L \${safeR} \${h} Q 0 \${h} 0 \${h - safeR} L 0 \${safeR} Q 0 0 \${safeR} 0 Z\`;
    }

    function attachBorderBike(cardElement, radius = 16, offset = 14) {
      const trackDiv = document.createElement("div");
      trackDiv.className = "cardBorderBikeTrack";
      trackDiv.style.cssText = \`position:absolute;top:-\${offset}px;left:-\${offset}px;right:-\${offset}px;bottom:-\${offset}px;pointer-events:none;z-index:25;overflow:visible;\`;

      trackDiv.innerHTML = \`
        <svg class="bikeLaserSvg">
          <path fill="none" stroke="#00E5FF" stroke-width="1.8" stroke-dasharray="8 6" opacity="0.8" />
        </svg>
        <div class="bikeRacerElement">
          <svg width="60" height="40" viewBox="-20 -25 60 40" style="position:absolute;left:0;top:0;overflow:visible;pointer-events:none">
            <defs>
              <linearGradient id="headlightBeam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.95" />
                <stop offset="40%" stop-color="#00E5FF" stop-opacity="0.5" />
                <stop offset="100%" stop-color="#00E5FF" stop-opacity="0" />
              </linearGradient>
              <linearGradient id="fairingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00E5FF" />
                <stop offset="50%" stop-color="#0088CC" />
                <stop offset="100%" stop-color="#00FFAA" />
              </linearGradient>
            </defs>
            <polygon points="9.5,-5.5 28,-11 28,1" fill="url(#headlightBeam)" />
            <circle cx="9.5" cy="-5.5" r="3" fill="#00E5FF" opacity="0.6" />
            <circle cx="9.5" cy="-5.5" r="1.5" fill="#FFFFFF" />
            <polygon points="-8,-3.8 -14,-3.4 -9,-4.6" fill="#FF5500" />
            <polygon points="-8,-3.8 -12,-3.6 -9,-4.2" fill="#FFDD00" />
            <line x1="-1" y1="-4.5" x2="-8" y2="-3.8" stroke="#B0C4D6" stroke-width="1.2" stroke-linecap="round" />
            <line x1="-7" y1="-2.8" x2="-1.5" y2="-4.5" stroke="#6C8296" stroke-width="1.2" />
            <line x1="7" y1="-2.8" x2="4" y2="-8.5" stroke="#B0C4D6" stroke-width="1.2" />
            <circle cx="-7" cy="-2.8" r="2.8" fill="#0A1118" stroke="#00E5FF" stroke-width="1" />
            <circle cx="-7" cy="-2.8" r="1" fill="#FFFFFF" />
            <circle cx="7" cy="-2.8" r="2.8" fill="#0A1118" stroke="#00E5FF" stroke-width="1" />
            <circle cx="7" cy="-2.8" r="1" fill="#FFFFFF" />
            <rect x="-3" y="-6" width="4.5" height="3.5" rx="0.8" fill="#1A2634" stroke="#486581" stroke-width="0.7" />
            <path d="M -7 -4.5 L -2 -8.5 L 4.5 -8.5 L 9.5 -5.5 L 6.5 -3.5 L 0 -4.2 L -6 -3.8 Z" fill="url(#fairingGrad)" stroke="#00E5FF" stroke-width="0.8" />
            <path d="M 3 -8.5 L 7 -8.5 L 6 -11 L 2 -9.5 Z" fill="#00E5FF" opacity="0.9" />
            <path d="M -4.5 -7.5 Q 0 -12 4.5 -9 L 3 -7 Z" fill="#101820" stroke="#334E68" stroke-width="0.8" />
            <circle cx="1.5" cy="-11" r="3.6" fill="#00E5FF" opacity="0.45" />
            <circle cx="1.5" cy="-11" r="2.7" fill="#00E5FF" stroke="#FFFFFF" stroke-width="0.6" />
            <path d="M 2.5 -11.5 Q 4.2 -11 4.2 -10.2 Q 3 -10.2 1.8 -10.8 Z" fill="#050A0F" />
          </svg>
        </div>
      \`;

      cardElement.style.position = "relative";
      cardElement.appendChild(trackDiv);

      const pathElem = trackDiv.querySelector("path");
      const bikeElem = trackDiv.querySelector(".bikeRacerElement");
      let w = 0, h = 0, dist = 0, lastTime = performance.now(), animId = 0, isVis = false;

      function measure() {
        w = trackDiv.clientWidth;
        h = trackDiv.clientHeight;
        if (w > 30 && h > 30) {
          pathElem.setAttribute("d", computePathD(w, h, radius + offset));
        }
      }
      measure();

      if (window.ResizeObserver) {
        new ResizeObserver(measure).observe(trackDiv);
      } else {
        window.addEventListener("resize", measure);
      }

      function loop(now) {
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;
        if (w > 30 && h > 30) {
          dist += dt * 200;
          const { x, y, angle } = getBorderTrackPos(dist, w, h, radius + offset);
          bikeElem.style.transform = \`translate3d(\${x}px, \${y}px, 0) rotate(\${angle}deg)\`;
          if (!isVis) { isVis = true; bikeElem.style.opacity = "1"; }
        }
        animId = requestAnimationFrame(loop);
      }
      animId = requestAnimationFrame(loop);
    }

    // Attach border bike racers to all 4 cards
    attachBorderBike(document.getElementById("cardGears"), 16, 14);
    attachBorderBike(document.getElementById("cardEngine"), 20, 14);
    attachBorderBike(document.getElementById("cardWelcome"), 20, 14);
    attachBorderBike(document.getElementById("cardInvitation"), 20, 14);

    /* ================================================================
       4. APPLICATION STATE & STAGE SEQUENCING
       ================================================================ */
    let currentStage = "gears";
    let isSoundOn = true;
    let engineClicks = 0;
    let displayedRpm = 0;
    let noAttempts = 0;

    const stages = {
      gears: document.getElementById("stageGears"),
      engine: document.getElementById("stageEngine"),
      welcome: document.getElementById("stageWelcome"),
      invitation: document.getElementById("stageInvitation")
    };

    function setStage(stageName) {
      currentStage = stageName;
      Object.keys(stages).forEach(key => {
        if (key === stageName) {
          stages[key].classList.add("stageActive");
        } else {
          stages[key].classList.remove("stageActive");
        }
      });

      if (stageName === "welcome") {
        runStageWelcome();
      }
    }

    // Sound toggle
    const audioToggleBtn = document.getElementById("audioToggleBtn");
    const audioSpeaker = document.getElementById("audioSpeaker");
    const audioLabel = document.getElementById("audioLabel");

    function toggleAudio() {
      if (isSoundOn) {
        audio.stopGearAmbience();
        isSoundOn = false;
        audioToggleBtn.classList.remove("audioOn");
        audioSpeaker.textContent = "🔇";
        audioLabel.textContent = "GEAR SOUND: MUTED";
      } else {
        audio.startGearAmbience();
        isSoundOn = true;
        audioToggleBtn.classList.add("audioOn");
        audioSpeaker.textContent = "🔊";
        audioLabel.textContent = "GEAR SOUND: LOUD";
      }
    }
    audioToggleBtn.addEventListener("click", toggleAudio);

    // Auto-start gear sound on first gesture
    audio.startGearAmbience();
    const handleGesture = () => {
      audio.startGearAmbience();
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
    };
    window.addEventListener("click", handleGesture);
    window.addEventListener("touchstart", handleGesture);

    // Stage 1 YES / NO Handlers
    document.getElementById("yesBtn").addEventListener("click", () => {
      audio.playLockClank();
      audio.stopGearAmbience();
      setStage("engine");
    });

    const noBtn = document.getElementById("noBtn");
    const noWarning = document.getElementById("noWarning");

    function escapeNo(e) {
      if (e) e.preventDefault();
      noAttempts++;
      audio.playLockClank();
      const dirX = Math.random() > 0.5 ? 1 : -1;
      const dirY = Math.random() > 0.5 ? 1 : -1;
      const ox = dirX * (60 + Math.floor(Math.random() * 90));
      const oy = dirY * (40 + Math.floor(Math.random() * 70));
      noBtn.style.transform = \`translate(\${ox}px, \${oy}px) rotate(\${noAttempts * 4}deg)\`;

      noWarning.style.display = "block";
      if (noAttempts === 1) noWarning.textContent = "ACCESS CANNOT BE CANCELLED • SELECT YES!";
      else if (noAttempts === 2) noWarning.textContent = "MECHANICAL BLOOD DETECTED • YOU CANNOT ESCAPE!";
      else noWarning.textContent = "NICE TRY! ONLY MECHANICAL ENGINEERS CAN PROCEED!";
    }
    noBtn.addEventListener("mouseenter", escapeNo);
    noBtn.addEventListener("touchstart", escapeNo);
    noBtn.addEventListener("click", escapeNo);

    // Stage 2 Engine Ignition Click Sequence
    const engineStartBtn = document.getElementById("engineStartBtn");
    const btnClickCounter = document.getElementById("btnClickCounter");
    const rpmDigits = document.getElementById("rpmDigits");
    const rpmBar = document.getElementById("rpmBar");
    const shiftLeds = document.querySelectorAll("#shiftLeds .shiftLed");
    const engineSmoke = document.getElementById("engineSmoke");
    const smokePuffsContainer = document.getElementById("smokePuffsContainer");
    const blastDoors = document.getElementById("blastDoors");
    const bgEngine = document.getElementById("bgTwinEngineCutaway");
    const ignitionHalo = document.getElementById("ignitionHalo");
    const cardEngine = document.getElementById("cardEngine");

    function updateRpmDisplay(rpm) {
      displayedRpm = rpm;
      rpmDigits.textContent = rpm === 0 ? "0000" : rpm.toLocaleString();
      const pct = Math.min(100, (rpm / 10000) * 100);
      rpmBar.style.width = pct + "%";

      if (rpm >= 10000) {
        rpmDigits.classList.add("rpmRedlineActive");
        rpmBar.classList.add("rpmBarMax");
      } else {
        rpmDigits.classList.remove("rpmRedlineActive");
        rpmBar.classList.remove("rpmBarMax");
      }

      shiftLeds.forEach(led => {
        const minVal = parseInt(led.getAttribute("data-min"), 10);
        if (rpm >= minVal) {
          led.classList.add("lit");
          if (minVal >= 10000) led.classList.add("flashingRedline");
        } else {
          led.classList.remove("lit", "flashingRedline");
        }
      });
    }

    function spawnSmokePuffs() {
      engineSmoke.classList.add("active");
      const puffs = [
        { left: "18%", color: "smokePearl", scale: 2.8, drift: "-80px" },
        { left: "22%", color: "smokeCharcoal", scale: 3.4, drift: "-60px" },
        { left: "78%", color: "smokePearl", scale: 2.8, drift: "80px" },
        { left: "74%", color: "smokeCharcoal", scale: 3.4, drift: "60px" },
        { left: "20%", color: "smokePearl", scale: 4.6, drift: "-75px" },
        { left: "76%", color: "smokeCharcoal", scale: 4.6, drift: "75px" }
      ];
      puffs.forEach((p, idx) => {
        const puff = document.createElement("div");
        puff.className = \`billowSmoke \${p.color}\`;
        puff.style.left = p.left;
        puff.style.bottom = "2%";
        puff.style.setProperty("--xDrift", p.drift);
        puff.style.setProperty("--targetScale", p.scale);
        puff.style.animationDelay = (idx * 0.08) + "s";
        puff.style.animationDuration = "2.4s";
        smokePuffsContainer.appendChild(puff);
      });
    }

    engineStartBtn.addEventListener("click", () => {
      if (engineClicks >= 3) return;
      engineClicks++;
      cardEngine.classList.add("consoleEngaged");
      ignitionHalo.classList.add("haloActive");

      if (engineClicks === 1) {
        btnClickCounter.textContent = "CLICK 2/3";
        updateRpmDisplay(2200);
        audio.playEngineCrank1();
        bgEngine.classList.add("engineCranking");
      } else if (engineClicks === 2) {
        btnClickCounter.textContent = "CLICK 3/3";
        updateRpmDisplay(5400);
        audio.playEngineCrank2();
        spawnSmokePuffs();
      } else if (engineClicks === 3) {
        btnClickCounter.textContent = "10,000 RPM";
        engineStartBtn.classList.add("pressedState");
        engineStartBtn.disabled = true;
        bgEngine.classList.remove("engineCranking");
        bgEngine.classList.add("engineRedline");
        audio.playEngineRoarRaw();
        spawnSmokePuffs();

        // Responsive climb to 10,000 RPM in ~0.82s
        let curRpm = 5400;
        const rpmTimer = setInterval(() => {
          curRpm += 165;
          if (curRpm >= 10000) {
            curRpm = 10000;
            updateRpmDisplay(10000);
            clearInterval(rpmTimer);
          } else {
            updateRpmDisplay(curRpm);
          }
        }, 30);

        // Blast doors slide open at 0.95s
        setTimeout(() => {
          audio.playHydraulicHiss();
          blastDoors.classList.add("doorsOpen");
        }, 950);

        // Transition to Stage 3 at 1.35s
        setTimeout(() => {
          setStage("welcome");
        }, 1350);
      }
    });

    // Stage 3 Welcome To The Club Voiceover
    let welcomeSpoken = false;
    function runStageWelcome() {
      if (welcomeSpoken) return;
      welcomeSpoken = true;

      // Particles
      const sparklesHolder = document.getElementById("welcomeSparkles");
      for (let i = 0; i < 12; i++) {
        const spk = document.createElement("div");
        spk.className = "welcomeSparkle";
        spk.style.left = (10 + i * 7) + "%";
        spk.style.animationDelay = (i * 0.15) + "s";
        spk.style.animationDuration = (3.5 + (i % 3) * 0.6) + "s";
        sparklesHolder.appendChild(spk);
      }

      audio.playWelcomeEntryChime();

      let finished = false;
      const onVoiceDone = () => {
        if (finished) return;
        finished = true;
        audio.playHydraulicHiss();
        setTimeout(() => {
          setStage("invitation");
        }, 1100);
      };

      if ("speechSynthesis" in window) {
        try {
          if (window.speechSynthesis.paused) window.speechSynthesis.resume();
          window.speechSynthesis.cancel();

          const u = new SpeechSynthesisUtterance("Welcome to the club.");
          u.rate = 0.92;
          u.pitch = 1.0;
          u.volume = 1.0;

          const voices = window.speechSynthesis.getVoices();
          if (voices && voices.length > 0) {
            const pv = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Neural") || v.name.includes("David") || v.name.includes("Google") || v.name.includes("Daniel"))) || voices.find(v => v.lang.startsWith("en")) || voices[0];
            if (pv) u.voice = pv;
          }

          u.onend = () => { setTimeout(onVoiceDone, 1000); };
          u.onerror = () => { setTimeout(onVoiceDone, 1000); };

          setTimeout(() => {
            if (window.speechSynthesis.paused) window.speechSynthesis.resume();
            window.speechSynthesis.speak(u);
          }, 80);
        } catch {
          setTimeout(onVoiceDone, 2000);
        }
      } else {
        setTimeout(onVoiceDone, 2000);
      }

      // Safe fallback timer
      setTimeout(onVoiceDone, 5000);
    }

    document.getElementById("proceedBtn").addEventListener("click", () => {
      audio.playHydraulicHiss();
      audio.playLockClank();
      setStage("invitation");
    });

    // Stage 4 Action Buttons
    document.getElementById("shareWhatsAppBtn").addEventListener("click", () => {
      const msg = "⚙️ *FRESHERS PARTY 2026*\\n🏛️ *Dept. of Mechanical Engineering*\\n📍 Mechanical Seminar Hall\\n🗓️ 10 OCTOBER 2026 (9:00 AM - 1:00 PM)\\n\\n👉 Open your interactive invitation:\\n" + window.location.href;
      window.open("https://api.whatsapp.com/send?text=" + encodeURIComponent(msg), "_blank");
    });

    document.getElementById("addCalendarBtn").addEventListener("click", () => {
      const calUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent("Mechanical Engineering Freshers Party 2026") + "&dates=20261010T033000Z/20261010T073000Z&details=" + encodeURIComponent("Department of Mechanical Engineering Freshers Party 2026. Where gears turn and legends begin!") + "&location=" + encodeURIComponent("Mechanical Seminar Hall, Narayana Engineering College, Nellore");
      window.open(calUrl, "_blank");
    });

    document.getElementById("copyLinkBtn").addEventListener("click", () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(() => {
          const lbl = document.getElementById("copyBtnLabel");
          lbl.textContent = "COPIED!";
          setTimeout(() => { lbl.textContent = "COPY LINK"; }, 2500);
        });
      }
    });

    // Replay Experience
    document.getElementById("replayBtn").addEventListener("click", () => {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      engineClicks = 0;
      displayedRpm = 0;
      noAttempts = 0;
      welcomeSpoken = false;
      blastDoors.classList.remove("doorsOpen");
      cardEngine.classList.remove("consoleEngaged");
      ignitionHalo.classList.remove("haloActive");
      bgEngine.classList.remove("engineRedline", "engineCranking");
      engineSmoke.classList.remove("active");
      smokePuffsContainer.innerHTML = "";
      btnClickCounter.textContent = "CLICK 1/3";
      engineStartBtn.disabled = false;
      engineStartBtn.classList.remove("pressedState");
      updateRpmDisplay(0);
      noBtn.style.transform = "translate(0px, 0px)";
      noWarning.style.display = "none";
      setStage("gears");
      audio.startGearAmbience();
    });
  </script>
</body>
</html>
`;

const outputPath = path.join(rootDir, 'freshers-party-2026.html');
fs.writeFileSync(outputPath, htmlContent, 'utf8');
console.log('Successfully generated standalone HTML at:', outputPath);
