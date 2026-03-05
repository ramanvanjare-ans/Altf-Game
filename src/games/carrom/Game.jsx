import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  Box, Paper, Typography, Button, Container, Stack, Avatar,
  Card, CardContent, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import { keyframes } from "@emotion/react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const BOARD_SIZE = 600;
const COIN_R     = 12;
const STRIKER_R  = 17;
const POCKET_R   = 25;
const FRICTION   = 0.985;
const WALL_BOUNCE= 0.7;
const CENTER     = BOARD_SIZE / 2;

const POCKETS = [
  { x: 35, y: 35 }, { x: BOARD_SIZE - 35, y: 35 },
  { x: 35, y: BOARD_SIZE - 35 }, { x: BOARD_SIZE - 35, y: BOARD_SIZE - 35 },
];

// ─── KEYFRAMES ───────────────────────────────────────────────────────────────
const glow = keyframes`
  0%,100%{ box-shadow:0 0 5px rgba(255,215,0,.2); }
  50%    { box-shadow:0 0 20px rgba(255,215,0,.6); }
`;
const burst = keyframes`
  0%  { transform:scale(0) rotate(0deg);   opacity:0; }
  60% { transform:scale(1.2) rotate(15deg);opacity:1; }
  100%{ transform:scale(1)  rotate(0deg);  opacity:1; }
`;
const rise = keyframes`
  from{ transform:translateY(30px); opacity:0; }
  to  { transform:translateY(0);    opacity:1; }
`;
const shimmer = keyframes`
  0%  { background-position:-200% center; }
  100%{ background-position: 200% center; }
`;
const pulse = keyframes`
  0%,100%{ transform:scale(1);    }
  50%    { transform:scale(1.06); }
`;

// ─── PATH SIMULATOR (aim line) ────────────────────────────────────────────────
function simulatePath(sx, sy, vx, vy, steps = 280) {
  const path = [{ x: sx, y: sy }];
  let x = sx, y = sy;
  const minB = STRIKER_R, maxB = BOARD_SIZE - STRIKER_R;
  for (let i = 0; i < steps; i++) {
    x += vx; y += vy;
    vx *= FRICTION; vy *= FRICTION;
    if (Math.abs(vx) < 0.4 && Math.abs(vy) < 0.4) break;
    if (x < minB) { x = minB; vx *= -WALL_BOUNCE; }
    if (x > maxB) { x = maxB; vx *= -WALL_BOUNCE; }
    if (y < minB) { y = minB; vy *= -WALL_BOUNCE; }
    if (y > maxB) { y = maxB; vy *= -WALL_BOUNCE; }
    path.push({ x, y });
  }
  return path;
}

// ─── SMART CPU AI ─────────────────────────────────────────────────────────────
function scoreShot(sx, sy, vx, vy, coinsArr, queenObj, queenState) {
  let x = sx, y = sy, svx = vx, svy = vy;
  const pieces = coinsArr.filter(c => c.active).map(c => ({ ...c, type: "coin" }));
  if (queenObj.active) pieces.push({ ...queenObj, type: "queen" });

  let strikerOn = true, foul = false, score = 0;
  const minB = STRIKER_R, maxB = BOARD_SIZE - STRIKER_R;

  for (let step = 0; step < 350; step++) {
    if (!strikerOn) break;
    x += svx; y += svy;
    svx *= FRICTION; svy *= FRICTION;
    if (Math.abs(svx) < 0.2 && Math.abs(svy) < 0.2) break;
    if (x < minB) { x = minB; svx *= -WALL_BOUNCE; }
    if (x > maxB) { x = maxB; svx *= -WALL_BOUNCE; }
    if (y < minB) { y = minB; svy *= -WALL_BOUNCE; }
    if (y > maxB) { y = maxB; svy *= -WALL_BOUNCE; }

    for (const pkt of POCKETS)
      if (Math.hypot(x - pkt.x, y - pkt.y) < POCKET_R) { foul = true; strikerOn = false; break; }
    if (!strikerOn) break;

    for (const p of pieces) {
      if (!p.active) continue;
      const dist = Math.hypot(x - p.x, y - p.y);
      const minD = STRIKER_R + COIN_R;
      if (dist < minD) {
        const nx = (p.x - x) / (dist || 1), ny = (p.y - y) / (dist || 1);
        const imp = (svx * nx + svy * ny) - (p.vx * nx + p.vy * ny);
        svx -= imp * nx; svy -= imp * ny;
        p.vx += imp * nx; p.vy += imp * ny;
        const ov = minD - dist;
        p.x += nx * ov * 0.55; p.y += ny * ov * 0.55;
        x   -= nx * ov * 0.45; y   -= ny * ov * 0.45;
      }
    }

    // mini-simulate each coin rolling into pocket
    for (const p of pieces) {
      if (!p.active) continue;
      let px = p.x, py = p.y;
      for (let s = 0; s < 80; s++) {
        px += p.vx; py += p.vy;
        p.vx *= FRICTION; p.vy *= FRICTION;
        if (Math.abs(p.vx) < 0.3 && Math.abs(p.vy) < 0.3) break;
        if (px < COIN_R) { px = COIN_R; p.vx *= -WALL_BOUNCE; }
        if (px > BOARD_SIZE - COIN_R) { px = BOARD_SIZE - COIN_R; p.vx *= -WALL_BOUNCE; }
        if (py < COIN_R) { py = COIN_R; p.vy *= -WALL_BOUNCE; }
        if (py > BOARD_SIZE - COIN_R) { py = BOARD_SIZE - COIN_R; p.vy *= -WALL_BOUNCE; }
        for (const pkt of POCKETS) {
          if (Math.hypot(px - pkt.x, py - pkt.y) < POCKET_R) {
            p.active = false;
            score += p.type === "queen" ? (queenState === "on_board" ? 60 : 30) : 30;
            break;
          }
        }
        if (!p.active) break;
      }
      if (p.active) { p.x = px; p.y = py; }
    }
  }

  if (foul) score -= 25;
  return score;
}

function bestCPUShot(strikerY, coinsArr, queenObj, queenState) {
  const targets = queenObj.active
    ? [queenObj, ...coinsArr.filter(c => c.active)]
    : coinsArr.filter(c => c.active);
  if (!targets.length) return null;

  let best = -9999, move = null;
  const powers = [10, 14, 17.5, 20, 23];

  for (let sx = 120; sx <= 480; sx += 15) {
    for (const t of targets) {
      // direct shot
      const dx = t.x - sx, dy = t.y - strikerY;
      const dist = Math.hypot(dx, dy);
      if (dist < 1) continue;
      for (const pw of powers) {
        const s = scoreShot(sx, strikerY, (dx/dist)*pw, (dy/dist)*pw, coinsArr, queenObj, queenState);
        if (s > best) { best = s; move = { sx, vx: (dx/dist)*pw, vy: (dy/dist)*pw }; }
      }
      // pocket-angle shots
      for (const pkt of POCKETS) {
        const mx = (t.x + pkt.x)/2, my = (t.y + pkt.y)/2;
        const d2 = Math.hypot(mx - sx, my - strikerY);
        if (d2 < 1) continue;
        for (const pw of powers) {
          const vx = ((mx-sx)/d2)*pw, vy = ((my-strikerY)/d2)*pw;
          const s = scoreShot(sx, strikerY, vx, vy, coinsArr, queenObj, queenState);
          if (s > best) { best = s; move = { sx, vx, vy }; }
        }
      }
    }
  }
  return move;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function CarromProFinal() {
  const canvasRef = useRef(null);

  // winner state stored as ref AND state so dialog sees it instantly
  const [winner, setWinner]     = useState(null);
  const [gameMode, setGameMode] = useState("pvp");
  const [confetti, setConfetti] = useState([]);

  // UI display state
  const [uiState, setUiState] = useState({
    player: 1, score: { 1: 0, 2: 0 }, message: "White Breaks First", isMoving: false
  });
  // Stable ref mirror for use inside rAF loop (avoids stale closure)
  const uiRef = useRef(uiState);
  useEffect(() => { uiRef.current = uiState; }, [uiState]);

  // game logic (mutable, accessed in rAF)
  const logic = useRef({
    player: 1, score: { 1: 0, 2: 0 }, queenState: "on_board",
    coinsPocketed: 0, queenPocketed: false, strikerFouled: false, moving: false
  });

  const strikerRef = useRef({ x: CENTER, y: 515, vx: 0, vy: 0, active: true });
  const coinsRef   = useRef([]);
  const queenRef   = useRef({ x: CENTER, y: CENTER, vx: 0, vy: 0, active: true });

  // Aim-line refs (no re-render needed)
  const isDragging    = useRef(false);
  const isPositioning = useRef(false);
  const dragStart     = useRef({ x: 0, y: 0 });
  const dragCurrent   = useRef({ x: 0, y: 0 });
  const aimPath       = useRef([]);
  const showAim       = useRef(false);

  // winnerRef so finalizeTurn (inside rAF) can set state
  const setWinnerRef = useRef(setWinner);

  // ── confetti ──────────────────────────────────────────────────────────────
  const makeConfetti = useCallback(() => {
    const cols = ["#FFD700","#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#98FB98"];
    setConfetti(Array.from({ length: 60 }, (_, i) => ({
      id: i, x: Math.random()*100, y: Math.random()*100,
      color: cols[i % cols.length], size: Math.random()*8+4,
      rotation: Math.random()*360,
      shape: Math.random() > .5 ? "circle" : "rect",
      delay: Math.random()*1.5, dur: Math.random()*2+2,
    })));
  }, []);

  // ── init board ────────────────────────────────────────────────────────────
  const initBoard = useCallback(() => {
    const c = [];
    for (let i = 0; i < 9; i++) {
      const a = (i * Math.PI * 2) / 9;
      c.push({ x: CENTER + Math.cos(a)*38, y: CENTER + Math.sin(a)*38,
               vx: 0, vy: 0, color: i%2===0 ? "#fff" : "#212121", active: true });
    }
    coinsRef.current  = c;
    queenRef.current  = { x: CENTER, y: CENTER, vx: 0, vy: 0, active: true };
    strikerRef.current= { x: CENTER, y: 515,   vx: 0, vy: 0, active: true };
    aimPath.current   = [];
    showAim.current   = false;
    logic.current     = { player:1, score:{1:0,2:0}, queenState:"on_board",
                          coinsPocketed:0, queenPocketed:false, strikerFouled:false, moving:false };
    setWinner(null);
    setConfetti([]);
    const init = { player:1, score:{1:0,2:0}, message:"White Breaks First", isMoving:false };
    setUiState(init);
    uiRef.current = init;
  }, []);

  // ── collision ─────────────────────────────────────────────────────────────
  const resolveCollision = (p1, p2, r1, r2) => {
    if (!p1.active || !p2.active) return;
    const dx = p2.x-p1.x, dy = p2.y-p1.y;
    const dist = Math.hypot(dx, dy);
    if (dist < r1+r2) {
      const nx = dx/(dist||1), ny = dy/(dist||1);
      const ov = (r1+r2-dist)/2;
      p1.x -= nx*ov; p1.y -= ny*ov; p2.x += nx*ov; p2.y += ny*ov;
      const v1 = p1.vx*nx+p1.vy*ny, v2 = p2.vx*nx+p2.vy*ny, imp = v1-v2;
      p1.vx -= imp*nx; p1.vy -= imp*ny; p2.vx += imp*nx; p2.vy += imp*ny;
    }
  };

  // ── finalize turn ─────────────────────────────────────────────────────────
  const finalizeTurn = useCallback((currentGameMode) => {
    const st = logic.current;
    let nQueen = st.queenState;
    let keepTurn = (st.coinsPocketed > 0 || st.queenPocketed) && !st.strikerFouled;
    let msg = "";

    if (st.strikerFouled) {
      st.score[st.player] = Math.max(0, st.score[st.player] - 10);
      msg = "Foul! -10 pts";
      const dead = coinsRef.current.find(c => !c.active);
      if (dead) { dead.active=true; dead.x=CENTER; dead.y=CENTER; dead.vx=0; dead.vy=0; }
      if (st.queenPocketed || st.queenState === "pocketed_waiting_cover") {
        queenRef.current = { x:CENTER, y:CENTER, vx:0, vy:0, active:true };
        nQueen = "on_board";
      }
      keepTurn = false;
    } else if (st.queenPocketed) {
      nQueen = "pocketed_waiting_cover"; msg = "Queen! Now cover it."; keepTurn = true;
    } else if (st.queenState === "pocketed_waiting_cover") {
      if (st.coinsPocketed > 0) {
        st.score[st.player] += 50; nQueen = "covered"; msg = "Queen Covered! +50"; keepTurn = true;
      } else {
        queenRef.current = { x:CENTER, y:CENTER, vx:0, vy:0, active:true };
        nQueen = "on_board"; msg = "Cover failed!"; keepTurn = false;
      }
    }

    const remaining = coinsRef.current.filter(c => c.active).length;
    const queenDone = !queenRef.current.active && nQueen !== "pocketed_waiting_cover";

    if (remaining === 0 && queenDone) {
      const p1 = st.score[1], p2 = st.score[2];
      let name, isDraw = false;
      if      (p1 > p2) name = "Player 1";
      else if (p2 > p1) name = currentGameMode === "cpu" ? "Robot 🤖" : "Player 2";
      else              { name = "Draw"; isDraw = true; }
      const w = { name, p1, p2, isDraw };
      setWinnerRef.current(w);   // triggers React state → Dialog shows
      makeConfetti();
      const next = { ...uiRef.current, isMoving:false, message:"Match Over!" };
      setUiState(next); uiRef.current = next;
      return;
    }

    const nextP = keepTurn ? st.player : (st.player===1 ? 2 : 1);
    st.player = nextP; st.queenState = nQueen;
    st.coinsPocketed = 0; st.queenPocketed = false; st.strikerFouled = false;
    strikerRef.current = { x:CENTER, y: nextP===1 ? 515 : 85, vx:0, vy:0, active:true };
    const next = { player:nextP, score:{...st.score}, message: msg||`Player ${nextP}'s Turn`, isMoving:false };
    setUiState(next); uiRef.current = next;
  }, [makeConfetti]);

  // ── physics update (called in rAF, gameMode via ref) ──────────────────────
  const gameModeRef = useRef(gameMode);
  useEffect(() => { gameModeRef.current = gameMode; }, [gameMode]);

  const updatePhysics = useCallback(() => {
    const all = [strikerRef.current, queenRef.current, ...coinsRef.current];
    let moving = false;
    for (const p of all) {
      if (!p.active) continue;
      p.x += p.vx; p.y += p.vy;
      p.vx *= FRICTION; p.vy *= FRICTION;
      if (Math.abs(p.vx) < 0.2) p.vx = 0;
      if (Math.abs(p.vy) < 0.2) p.vy = 0;
      if (p.vx || p.vy) moving = true;
      const r = p === strikerRef.current ? STRIKER_R : COIN_R;
      if (p.x < r) { p.vx *= -WALL_BOUNCE; p.x = r; }
      if (p.x > BOARD_SIZE-r) { p.vx *= -WALL_BOUNCE; p.x = BOARD_SIZE-r; }
      if (p.y < r) { p.vy *= -WALL_BOUNCE; p.y = r; }
      if (p.y > BOARD_SIZE-r) { p.vy *= -WALL_BOUNCE; p.y = BOARD_SIZE-r; }
      for (const pkt of POCKETS) {
        if (Math.hypot(p.x-pkt.x, p.y-pkt.y) < POCKET_R) {
          p.active=false; p.vx=0; p.vy=0;
          if (p === strikerRef.current) logic.current.strikerFouled = true;
          else if (p === queenRef.current) logic.current.queenPocketed = true;
          else { logic.current.score[logic.current.player] += 20; logic.current.coinsPocketed++; }
        }
      }
    }
    for (let i = 0; i < all.length; i++)
      for (let j = i+1; j < all.length; j++)
        resolveCollision(all[i], all[j], i===0?STRIKER_R:COIN_R, j===0?STRIKER_R:COIN_R);

    if (logic.current.moving && !moving) {
      logic.current.moving = false;
      finalizeTurn(gameModeRef.current);
    }
  }, [finalizeTurn]);

  // ── draw aim line ─────────────────────────────────────────────────────────
  const drawAimLine = (ctx) => {
    const path = aimPath.current;
    if (!path || path.length < 2) return;
    const dx = dragStart.current.x - dragCurrent.current.x;
    const dy = dragStart.current.y - dragCurrent.current.y;
    const power = Math.min(Math.hypot(dx, dy) * 0.17 / 20, 1);
    if (power < 0.02) return;

    // Glowing gradient trail
    for (let i = 1; i < path.length; i++) {
      const t = 1 - i / path.length;
      const alpha = t * 0.9 * power;
      if (alpha < 0.015) break;
      ctx.beginPath();
      ctx.moveTo(path[i-1].x, path[i-1].y);
      ctx.lineTo(path[i].x, path[i].y);
      const r = Math.round(80 + 175*(1-t));
      const g = Math.round(200 - 80*(1-t));
      const b = Math.round(255*t);
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = 2.5*t + 0.5;
      ctx.setLineDash([]);
      ctx.stroke();
    }

    // Dashed overlay
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
      if (1 - i/path.length < 0.05) break;
      ctx.lineTo(path[i].x, path[i].y);
    }
    ctx.setLineDash([8, 5]);
    ctx.strokeStyle = `rgba(255,255,255,${0.22 * power})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Arrow from striker
    if (path.length >= 2) {
      const angle = Math.atan2(path[1].y - path[0].y, path[1].x - path[0].x);
      const aLen  = 26 * power;
      ctx.save();
      ctx.translate(path[0].x, path[0].y);
      ctx.rotate(angle);
      // shaft
      ctx.beginPath();
      ctx.moveTo(STRIKER_R + 2, 0);
      ctx.lineTo(STRIKER_R + 2 + aLen, 0);
      ctx.strokeStyle = `rgba(0,255,180,${power})`;
      ctx.lineWidth = 3;
      ctx.stroke();
      // head
      ctx.beginPath();
      ctx.moveTo(STRIKER_R+2+aLen, 0);
      ctx.lineTo(STRIKER_R+2+aLen-9, -5);
      ctx.lineTo(STRIKER_R+2+aLen-9,  5);
      ctx.closePath();
      ctx.fillStyle = `rgba(0,255,180,${power})`;
      ctx.fill();
      ctx.restore();
    }

    // Power dots
    const dots = Math.round(5 * power);
    for (let d = 1; d <= dots; d++) {
      const idx = Math.floor((d/(dots+1)) * Math.min(path.length-1, 70));
      if (idx < path.length) {
        const t = 1 - idx/path.length;
        ctx.beginPath();
        ctx.arc(path[idx].x, path[idx].y, 4*t, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,220,50,${t*0.85*power})`;
        ctx.fill();
      }
    }
  };

  // ── draw board ────────────────────────────────────────────────────────────
  const drawBoard = useCallback((ctx) => {
    ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);
    // board
    ctx.fillStyle = "#2a1b12"; ctx.fillRect(0, 0, BOARD_SIZE, BOARD_SIZE);
    ctx.fillStyle = "#e3c191"; ctx.fillRect(15, 15, BOARD_SIZE-30, BOARD_SIZE-30);
    // center circle
    ctx.strokeStyle = "#8b0000"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(CENTER, CENTER, 45, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(CENTER, CENTER, 48, 0, Math.PI*2); ctx.stroke();
    // baselines
    [[100,70,400,25],[100,505,400,25],[70,100,25,400],[505,100,25,400]].forEach(([bx,by,bw,bh]) => {
      ctx.strokeRect(bx, by, bw, bh);
      ctx.fillStyle = "#8b0000";
      if (bw > bh) {
        ctx.beginPath(); ctx.arc(bx,     by+12.5, 12, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx+bw, by+12.5, 12, 0, Math.PI*2); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(bx+12.5, by,    12, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(bx+12.5, by+bh, 12, 0, Math.PI*2); ctx.fill();
      }
    });
    // pockets
    POCKETS.forEach(p => {
      ctx.fillStyle="#111"; ctx.beginPath(); ctx.arc(p.x,p.y,POCKET_R,0,Math.PI*2); ctx.fill();
    });

    const piece = (x, y, r, c1, c2, ring) => {
      const g = ctx.createRadialGradient(x-r/3, y-r/3, r/6, x, y, r);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
      if (ring) { ctx.strokeStyle=ring; ctx.lineWidth=1.5; ctx.stroke(); }
    };

    // queen
    if (queenRef.current.active)
      piece(queenRef.current.x, queenRef.current.y, COIN_R, "#ff5f6d", "#8b0000", "gold");
    // coins
    coinsRef.current.forEach(c => {
      if (c.active) piece(c.x, c.y, COIN_R,
        c.color==="#fff" ? "#fff" : "#444",
        c.color==="#fff" ? "#ccc" : "#111",
        "rgba(0,0,0,0.3)");
    });

    // AIM LINE — drawn before striker so striker renders on top
    if (showAim.current && !logic.current.moving && strikerRef.current.active)
      drawAimLine(ctx);

    // striker
    if (strikerRef.current.active)
      piece(strikerRef.current.x, strikerRef.current.y, STRIKER_R, "#4fc3f7", "#0288d1", "#fff");
  }, []); // eslint-disable-line

  // ── rAF loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    initBoard();
    const ctx = canvasRef.current.getContext("2d", { alpha: false });
    let frame;
    const loop = () => { updatePhysics(); drawBoard(ctx); frame = requestAnimationFrame(loop); };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []); // eslint-disable-line

  // ── CPU move ──────────────────────────────────────────────────────────────
  const cpuTimeout = useRef(null);
  const performCPUMove = useCallback(() => {
    if (logic.current.moving || logic.current.player !== 2) return;
    const upd = { ...uiRef.current, message: "🤖 Thinking..." };
    setUiState(upd); uiRef.current = upd;

    cpuTimeout.current = setTimeout(() => {
      const move = bestCPUShot(85, coinsRef.current, queenRef.current, logic.current.queenState);
      if (!move) return;
      strikerRef.current.x = move.sx;

      cpuTimeout.current = setTimeout(() => {
        strikerRef.current.vx = move.vx;
        strikerRef.current.vy = move.vy;
        logic.current.moving  = true;
        const upd2 = { ...uiRef.current, isMoving: true, message: "🤖 Fires!" };
        setUiState(upd2); uiRef.current = upd2;
      }, 600);
    }, 900);
  }, []);

  useEffect(() => {
    if (gameMode === "cpu" && uiState.player === 2 && !uiState.isMoving && !winner) {
      performCPUMove();
    }
    return () => clearTimeout(cpuTimeout.current);
  }, [uiState.player, uiState.isMoving, gameMode, winner, performCPUMove]);

  // ── input helpers ─────────────────────────────────────────────────────────
  const getXY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scX = BOARD_SIZE / rect.width, scY = BOARD_SIZE / rect.height;
    const cl = e.touches ? e.touches[0] : e;
    return { x: (cl.clientX - rect.left)*scX, y: (cl.clientY - rect.top)*scY };
  };

  const handleStart = (e) => {
    if (uiRef.current.isMoving || (gameMode==="cpu" && uiRef.current.player===2)) return;
    const { x, y } = getXY(e);
    const sk = strikerRef.current;
    if (Math.hypot(sk.x-x, sk.y-y) < STRIKER_R*3) {
      isPositioning.current = true;
    } else {
      isDragging.current   = true;
      showAim.current      = true;
      dragStart.current    = { x, y };
      dragCurrent.current  = { x, y };
      aimPath.current      = [];
    }
  };

  const handleMove = (e) => {
    const { x, y } = getXY(e);
    dragCurrent.current = { x, y };
    if (isPositioning.current && x > 117 && x < 483) strikerRef.current.x = x;
    if (isDragging.current) {
      const dx = dragStart.current.x - x, dy = dragStart.current.y - y;
      if (Math.hypot(dx, dy) > 3)
        aimPath.current = simulatePath(strikerRef.current.x, strikerRef.current.y, dx*0.17, dy*0.17);
    }
  };

  const handleEnd = () => {
    if (isDragging.current) {
      const dx = dragStart.current.x - dragCurrent.current.x;
      const dy = dragStart.current.y - dragCurrent.current.y;
      if (Math.hypot(dx, dy) > 5) {
        strikerRef.current.vx = dx * 0.17;
        strikerRef.current.vy = dy * 0.17;
        logic.current.moving  = true;
        const upd = { ...uiRef.current, isMoving: true };
        setUiState(upd); uiRef.current = upd;
      }
    }
    isDragging.current    = false;
    isPositioning.current = false;
    showAim.current       = false;
    aimPath.current       = [];
  };

  // ── winner flags ──────────────────────────────────────────────────────────
  const isCPUWin = winner && winner.name === "Robot 🤖";
  const isP1Win  = winner && winner.name === "Player 1";

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ minHeight:"100vh", background:"#0a0a0f", py:2, px:1,
               display:"flex", justifyContent:"center", alignItems:"center" }}>

      {/* ═══ WINNER POPUP ═══════════════════════════════════════════════════ */}
      {winner && (
        <Box sx={{
          position:"fixed", inset:0, zIndex:9999,
          display:"flex", alignItems:"center", justifyContent:"center",
          background:"rgba(0,0,0,0.88)",
          backdropFilter:"blur(10px)",
        }}
          onClick={(e) => e.stopPropagation()}
        >
          <Box sx={{
            position:"relative", borderRadius:4, overflow:"hidden",
            width: { xs:"90vw", sm:460 },
            background: winner.isDraw
              ? "linear-gradient(135deg,#0d1b2a,#1b2838,#0d1b2a)"
              : isCPUWin
                ? "linear-gradient(135deg,#1a0033,#2d0057,#1a0033)"
                : "linear-gradient(135deg,#1a1200,#332200,#1a1200)",
            border: winner.isDraw ? "1.5px solid rgba(74,154,244,.5)"
              : isCPUWin ? "1.5px solid rgba(180,100,255,.6)"
              : "1.5px solid rgba(255,200,0,.6)",
            boxShadow: winner.isDraw ? "0 0 60px rgba(74,154,244,.25)"
              : isCPUWin ? "0 0 80px rgba(150,50,255,.35)"
              : "0 0 80px rgba(255,200,0,.35)",
          }}>

            {/* glow orb */}
            <Box sx={{
              position:"absolute", top:"50%", left:"50%",
              transform:"translate(-50%,-50%)", width:320, height:320,
              borderRadius:"50%",
              background: winner.isDraw
                ? "radial-gradient(circle,rgba(74,154,244,.08),transparent 70%)"
                : isCPUWin
                  ? "radial-gradient(circle,rgba(150,50,255,.12),transparent 70%)"
                  : "radial-gradient(circle,rgba(255,200,0,.12),transparent 70%)",
              pointerEvents:"none",
            }}/>

            {/* confetti */}
            {confetti.map(p => (
              <Box key={p.id} sx={{
                position:"absolute", left:`${p.x}%`, top:`${p.y}%`,
                width:p.size, height:p.shape==="rect"?p.size*.4:p.size,
                borderRadius:p.shape==="circle"?"50%":"2px",
                background:p.color, transform:`rotate(${p.rotation}deg)`,
                animation:`${rise} ${p.dur}s ${p.delay}s both`,
                zIndex:1, pointerEvents:"none",
              }}/>
            ))}

            <Box sx={{ position:"relative", zIndex:2, p:{ xs:3, sm:5 }, textAlign:"center" }}>

              {/* trophy emoji */}
              <Box sx={{ animation:`${burst} .7s cubic-bezier(.36,.07,.19,.97)`, display:"inline-block", mb:2 }}>
                <Typography sx={{
                  fontSize:"5.5rem", lineHeight:1,
                  filter:`drop-shadow(0 0 28px ${winner.isDraw?"#4a9af4":isCPUWin?"#b164ff":"#FFD700"})`,
                }}>
                  {winner.isDraw ? "🤝" : isCPUWin ? "🤖" : "🏆"}
                </Typography>
              </Box>

              {/* label */}
              <Typography sx={{
                fontSize:".78rem", letterSpacing:".35em", fontWeight:800,
                color: winner.isDraw?"#4a9af4":isCPUWin?"#b164ff":"#FFD700",
                textTransform:"uppercase", mb:.5,
                animation:`${rise} .5s .2s both`,
              }}>
                {winner.isDraw ? "Game Over" : "Victory!"}
              </Typography>

              {/* name */}
              <Typography sx={{
                fontSize:"2.4rem", fontWeight:900,
                background: winner.isDraw
                  ? "linear-gradient(90deg,#4a9af4,#74b9ff,#4a9af4)"
                  : isCPUWin
                    ? "linear-gradient(90deg,#b164ff,#e040fb,#b164ff)"
                    : "linear-gradient(90deg,#FFD700,#FFA500,#FFD700)",
                backgroundSize:"200% auto",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                animation:`${shimmer} 2.5s linear infinite, ${rise} .5s .35s both`,
              }}>
                {winner.isDraw ? "It's a Draw!" : winner.name}
              </Typography>
              {!winner.isDraw && (
                <Typography sx={{ color:"rgba(255,255,255,.4)", fontSize:".9rem", mb:3,
                                  animation:`${rise} .5s .5s both` }}>
                  wins the match!
                </Typography>
              )}

              {/* score cards */}
              <Stack direction="row" spacing={2} justifyContent="center"
                     sx={{ mb:4, animation:`${rise} .5s .6s both` }}>
                {[
                  { label:"PLAYER 1",                               score:winner.p1, win:isP1Win },
                  { label:gameMode==="cpu"?"ROBOT":"PLAYER 2",       score:winner.p2,
                    win: !winner.isDraw && !isP1Win },
                ].map((item, i) => (
                  <Box key={i} sx={{
                    flex:1, p:2.5, borderRadius:3,
                    background: item.win
                      ? (isCPUWin&&i===1 ? "rgba(177,100,255,.12)" : "rgba(255,215,0,.10)")
                      : "rgba(255,255,255,.04)",
                    border: item.win
                      ? (isCPUWin&&i===1 ? "1px solid rgba(177,100,255,.4)" : "1px solid rgba(255,215,0,.35)")
                      : "1px solid rgba(255,255,255,.08)",
                  }}>
                    <Typography sx={{ color:"rgba(255,255,255,.4)", fontSize:".7rem",
                                      letterSpacing:".1em", mb:.5 }}>{item.label}</Typography>
                    <Typography sx={{
                      color: item.win ? (isCPUWin&&i===1 ? "#b164ff" : "#FFD700") : "#fff",
                      fontSize:"2.5rem", fontWeight:900, lineHeight:1,
                    }}>{item.score}</Typography>
                    {item.win && !winner.isDraw && (
                      <Typography sx={{ color:isCPUWin&&i===1?"#b164ff":"#FFD700",
                                        fontSize:".65rem", mt:.5, letterSpacing:".15em" }}>
                        ★ WINNER
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>

              {/* play again */}
              <Button onClick={initBoard} sx={{
                px:6, py:1.8, fontSize:"1rem", fontWeight:900,
                borderRadius:3, textTransform:"uppercase", letterSpacing:".15em",
                background: winner.isDraw
                  ? "linear-gradient(135deg,#1e88e5,#4a9af4)"
                  : isCPUWin
                    ? "linear-gradient(135deg,#7b1fa2,#b164ff)"
                    : "linear-gradient(135deg,#FFD700,#FFA500)",
                color: winner.isDraw||isCPUWin ? "#fff" : "#1a1a00",
                boxShadow: isCPUWin ? "0 6px 30px rgba(150,50,255,.5)"
                  : winner.isDraw ? "0 6px 30px rgba(74,154,244,.4)"
                  : "0 6px 30px rgba(255,200,0,.5)",
                animation:`${pulse} 2s ease-in-out infinite`,
                "&:hover":{ transform:"scale(1.06)", filter:"brightness(1.1)" },
                transition:"transform .2s, filter .2s",
              }}>
                🎮 Play Again
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* ═══ GAME BOARD ══════════════════════════════════════════════════════ */}
      <Container maxWidth="md">
        <Card sx={{ bgcolor:"#1c1c1c", borderRadius:4, border:"1px solid #3e2723", overflow:"hidden" }}>
          <Stack direction={{xs:"column",sm:"row"}} p={2} bgcolor="#2a1b12"
                 justifyContent="space-between" alignItems="center">
            <Typography variant="h6" color="white" fontWeight="bold">CARROM MASTER PRO</Typography>
            <ToggleButtonGroup value={gameMode} exclusive size="small" sx={{ bgcolor:"white" }}
              onChange={(_, v) => { if(v){ setGameMode(v); initBoard(); } }}>
              <ToggleButton value="pvp"><PersonIcon/> PvP</ToggleButton>
              <ToggleButton value="cpu"><SmartToyIcon/> vs CPU</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Box sx={{ textAlign:"center", p:1, borderRadius:2,
                         animation:uiState.player===1?`${glow} 2s infinite`:"none" }}>
                <Avatar sx={{ bgcolor:"#fff", color:"#000", mx:"auto", mb:.5 }}>P1</Avatar>
                <Typography variant="h5" color="white">{uiState.score[1]}</Typography>
              </Box>

              <Box sx={{ textAlign:"center" }}>
                <Typography variant="caption" color="gold" fontWeight="bold"
                            sx={{ minHeight:"20px", display:"block" }}>{uiState.message}</Typography>
                <Button variant="text" size="small" onClick={initBoard}
                        sx={{ color:"#888", display:"block", mx:"auto" }}><ReplayIcon/></Button>
              </Box>

              <Box sx={{ textAlign:"center", p:1, borderRadius:2,
                         animation:uiState.player===2?`${glow} 2s infinite`:"none" }}>
                <Avatar sx={{ bgcolor:"#333", mx:"auto", mb:.5 }}>
                  {gameMode==="cpu" ? "🤖" : "P2"}
                </Avatar>
                <Typography variant="h5" color="white">{uiState.score[2]}</Typography>
              </Box>
            </Stack>

            <Box display="flex" justifyContent="center">
              <Paper elevation={24} sx={{ border:"12px solid #3e2723", borderRadius:2, bgcolor:"#3e2723",
                                          width:"100%", maxWidth:"600px", aspectRatio:"1/1", touchAction:"none" }}>
                <canvas ref={canvasRef} width={BOARD_SIZE} height={BOARD_SIZE}
                  onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd}
                  onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd}
                  style={{ cursor:"crosshair", display:"block", width:"100%", height:"100%" }}
                />
              </Paper>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}