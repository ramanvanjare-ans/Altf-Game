import { useState, useRef, useEffect, useCallback } from "react";
import Confetti from "react-confetti";

/* ─── STYLING & MATH HELPERS ────────────────────────────────── */
const PALETTE = [
  "#ffffff",
  "#4ade80",
  "#fbbf24",
  "#60a5fa",
  "#f87171",
  "#34d399",
  "#fcd34d",
  "#93c5fd",
];
const getCellBg = (cell) => {
  const patterns = [
    0, 1, 0, 2, 3, 1, 0, 2, 0, 2, 2, 0, 1, 0, 1, 2, 0, 1, 0, 1, 0, 1, 0, 2, 1,
    0, 2, 0, 2, 4, 4, 0, 4, 2, 0, 3, 2, 4, 4, 0, 0, 4, 0, 2, 4, 0, 2, 3, 3, 0,
    3, 4, 4, 2, 0, 0, 2, 3, 4, 3, 4, 2, 0, 2, 0, 3, 2, 5, 3, 0, 0, 3, 1, 0, 1,
    2, 0, 1, 2, 0, 1, 0, 2, 0, 2, 5, 0, 2, 3, 0, 3, 1, 3, 1, 0, 1, 0, 1, 2, 1,
  ];
  return PALETTE[patterns[(cell - 1) % patterns.length]] || "#ffffff";
};

const cellToGrid = (cell) => {
  const logRow = Math.floor((cell - 1) / 10);
  const logCol = (cell - 1) % 10;
  return [9 - logRow, logRow % 2 === 0 ? logCol : 9 - logCol];
};

const center = (cell, cs) => {
  const [r, c] = cellToGrid(cell);
  return { x: c * cs + cs / 2, y: r * cs + cs / 2 };
};

/* ─── RANDOM BOARD GENERATOR ───────────────────────────────── */
const generateRandomBoard = () => {
  const snakes = [];
  const ladders = [];
  const usedPositions = new Set([1, 100]);

  const getRandomRange = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  while (ladders.length < 8) {
    const from = getRandomRange(2, 85);
    const length = getRandomRange(10, 35);
    const to = from + length;
    if (to < 99 && !usedPositions.has(from) && !usedPositions.has(to)) {
      ladders.push({ from, to });
      usedPositions.add(from);
      usedPositions.add(to);
    }
  }

  while (snakes.length < 8) {
    const from = getRandomRange(20, 99);
    const length = getRandomRange(10, 40);
    const to = from - length;
    const snakeColors = ["#16a34a", "#2563eb", "#dc2626", "#ea580c", "#9333ea"];
    if (to > 2 && !usedPositions.has(from) && !usedPositions.has(to)) {
      snakes.push({
        from,
        to,
        color: snakeColors[getRandomRange(0, 4)],
        pattern: "#00000033",
      });
      usedPositions.add(from);
      usedPositions.add(to);
    }
  }

  return {
    snakes,
    ladders,
    snakesMap: Object.fromEntries(snakes.map((s) => [s.from, s.to])),
    laddersMap: Object.fromEntries(ladders.map((l) => [l.from, l.to])),
  };
};

/* ─── VISUAL COMPONENTS ─────────────────────────────────────── */
function RealisticSnake({ from, to, cs, color, patternColor }) {
  const h = center(from, cs),
    t = center(to, cs);
  const dx = t.x - h.x,
    dy = t.y - h.y;
  const cx1 = h.x + dx * 0.2 + dy * 0.5,
    cy1 = h.y + dy * 0.2 - dx * 0.5;
  const cx2 = h.x + dx * 0.8 - dy * 0.5,
    cy2 = h.y + dy * 0.8 + dx * 0.5;
  const bw = Math.max(cs * 0.32, 10);
  const pathData = `M${h.x},${h.y} C${cx1},${cy1} ${cx2},${cy2} ${t.x},${t.y}`;
  return (
    <g>
      <path
        d={pathData}
        fill="none"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth={bw + 4}
        strokeLinecap="round"
        style={{ filter: "blur(3px)" }}
      />
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={bw}
        strokeLinecap="round"
      />
      <path
        d={pathData}
        fill="none"
        stroke={patternColor}
        strokeWidth={bw * 0.4}
        strokeDasharray={`${bw / 2} ${bw / 3}`}
        opacity="0.6"
        strokeLinecap="round"
      />
      <g
        transform={`translate(${h.x},${h.y}) rotate(${(Math.atan2(cy1 - h.y, cx1 - h.x) * 180) / Math.PI})`}
      >
        <ellipse rx={bw * 0.7} ry={bw * 0.5} fill={color} />
        <circle cx={bw * 0.3} cy={-bw * 0.2} r={bw * 0.15} fill="white" />
        <circle cx={bw * 0.3} cy={bw * 0.2} r={bw * 0.15} fill="white" />
        <path
          d={`M${bw * 0.6},0 L${bw * 1.1},-2 M${bw * 0.6},0 L${bw * 1.1},2`}
          stroke="#ef4444"
          strokeWidth="2"
          fill="none"
        />
      </g>
    </g>
  );
}

function Ladder({ from, to, cs }) {
  const b = center(from, cs),
    tp = center(to, cs);
  const dx = tp.x - b.x,
    dy = tp.y - b.y,
    len = Math.sqrt(dx * dx + dy * dy);
  const nx = -dy / len,
    ny = dx / len,
    w = cs * 0.12,
    steps = Math.max(3, Math.floor(len / (cs * 0.45)));
  return (
    <g>
      {[-1, 1].map((side, i) => (
        <line
          key={i}
          x1={b.x + nx * w * side}
          y1={b.y + ny * w * side}
          x2={tp.x + nx * w * side}
          y2={tp.y + ny * w * side}
          stroke="#451a03"
          strokeWidth="5"
          strokeLinecap="round"
        />
      ))}
      {Array.from({ length: steps + 1 }, (_, k) => {
        const tt = k / steps;
        return (
          <line
            key={k}
            x1={b.x + dx * tt + nx * w * 1.2}
            y1={b.y + dy * tt + ny * w * 1.2}
            x2={b.x + dx * tt - nx * w * 1.2}
            y2={b.y + dy * tt - ny * w * 1.2}
            stroke="#78350f"
            strokeWidth="4"
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
}

function AttractivePawn({ x, y, size, color, label }) {
  return (
    <g
      transform={`translate(${x},${y})`}
      className="transition-all duration-300 ease-in-out"
    >
      <circle
        r={size * 1.2}
        fill={color}
        opacity="0.3"
        style={{ filter: "blur(5px)" }}
      />
      <radialGradient id={`grad-${color}`} cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="white" stopOpacity="0.6" />
        <stop offset="100%" stopColor={color} />
      </radialGradient>
      <circle
        r={size}
        fill={`url(#grad-${color})`}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
      />
      <text
        y="1"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize={size * 0.9}
        fontWeight="900"
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
      >
        {label}
      </text>
    </g>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────────── */
export default function SnakesLadders() {
  const [mode, setMode] = useState(null);
  const [board, setBoard] = useState({
    snakes: [],
    ladders: [],
    snakesMap: {},
    laddersMap: {},
  });
  const [positions, setPos] = useState([1, 1]);
  const [current, setCurrent] = useState(0);
  const [diceVal, setDiceVal] = useState(1);
  const [rolling, setRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [winner, setWinner] = useState(null);
  const [boardSize, setBoardSize] = useState(300);

  useEffect(() => {
    const handleResize = () => {
      const size = Math.min(window.innerWidth - 32, window.innerHeight - 250);
      setBoardSize(Math.max(280, size));
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const triggerTurnRef = useRef(null);

  const executeMove = useCallback(
    async (playerIdx, roll) => {
      setIsMoving(true);
      let startPos = positions[playerIdx];
      const targetBase = startPos + roll;

      if (targetBase > 100) {
        setIsMoving(false);
        const nextP = 1 - playerIdx;
        setCurrent(nextP);
        if (mode === "computer" && nextP === 1)
          setTimeout(() => triggerTurnRef.current(1), 1000);
        return;
      }

      for (let i = 1; i <= roll; i++) {
        await new Promise((r) => setTimeout(r, 300));
        setPos((prev) => {
          const next = [...prev];
          next[playerIdx] = next[playerIdx] + 1;
          return next;
        });
      }

      await new Promise((r) => setTimeout(r, 400));

      const landPos = startPos + roll;
      let finalPos = landPos;
      if (board.snakesMap[landPos]) finalPos = board.snakesMap[landPos];
      else if (board.laddersMap[landPos]) finalPos = board.laddersMap[landPos];

      if (finalPos !== landPos) {
        setPos((prev) => {
          const next = [...prev];
          next[playerIdx] = finalPos;
          return next;
        });
      }

      setIsMoving(false);

      if (finalPos === 100) {
        setWinner(playerIdx);
      } else {
        const nextP = 1 - playerIdx;
        setCurrent(nextP);
        if (mode === "computer" && nextP === 1) {
          setTimeout(() => triggerTurnRef.current(1), 800);
        }
      }
    },
    [positions, mode, board],
  );

  const triggerTurn = useCallback(
    (playerIdx) => {
      if (rolling || isMoving || winner !== null) return;
      setRolling(true);
      let ticks = 0;
      const interval = setInterval(() => {
        setDiceVal(Math.floor(Math.random() * 6) + 1);
        if (++ticks > 12) {
          clearInterval(interval);
          const roll = Math.floor(Math.random() * 6) + 1;
          setDiceVal(roll);
          setRolling(false);
          executeMove(playerIdx, roll);
        }
      }, 50);
    },
    [rolling, isMoving, winner, executeMove],
  );

  useEffect(() => {
    triggerTurnRef.current = triggerTurn;
  }, [triggerTurn]);

  const startGame = (m) => {
    setBoard(generateRandomBoard());
    setPos([1, 1]);
    setWinner(null);
    setCurrent(0);
    setMode(m);
  };

  const cs = boardSize / 10;

  if (!mode)
    return (
      <div className="h-[100dvh] w-full flex items-center justify-center bg-[#0f172a] p-4">
        <div className="bg-[#1e293b] p-10 rounded-[2.5rem] text-center border border-white/10 shadow-2xl max-w-sm w-full">
          <h1 className="text-4xl font-black text-white mb-10 leading-tight">
            SNAKES & <span className="text-emerald-400">LADDERS</span>
          </h1>
          <button
            onClick={() => startGame("computer")}
            className="w-full py-5 mb-4 bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 transition-transform"
          >
            VS COMPUTER
          </button>
          <button
            onClick={() => startGame("2player")}
            className="w-full py-5 bg-slate-700 text-white rounded-2xl font-black text-lg active:scale-95 transition-transform"
          >
            2 PLAYERS
          </button>
        </div>
      </div>
    );

  return (
    <div className="h-[100dvh] w-full bg-[#0f172a] flex flex-col items-center justify-between py-6 px-4 overflow-hidden">
      {winner !== null && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <div className="w-full max-w-2xl flex justify-between items-center mb-2">
        <div
          className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${current === 0 ? "bg-red-500/20 border-red-500" : "bg-white/5 border-transparent opacity-40"}`}
        >
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg text-white">
            👤
          </div>
          <div>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
              Player 1
            </p>
            <p className="text-xl font-black text-white">Sq. {positions[0]}</p>
          </div>
        </div>
        <button
          onClick={() => setMode(null)}
          className="text-white/20 hover:text-white text-xs font-bold uppercase"
        >
          Menu
        </button>
        <div
          className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${current === 1 ? "bg-blue-500/20 border-blue-500" : "bg-white/5 border-transparent opacity-40"}`}
        >
          <div className="order-2 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shadow-lg text-white">
            {mode === "computer" ? "🤖" : "👤"}
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
              {mode === "computer" ? "CPU" : "Player 2"}
            </p>
            <p className="text-xl font-black text-white">Sq. {positions[1]}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <div
          className="relative bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden border-[6px] border-[#1e293b]"
          style={{ width: boardSize, height: boardSize }}
        >
          {Array.from({ length: 100 }, (_, i) => (
            <div
              key={i + 1}
              className="absolute border-[0.5px] border-black/5 flex items-start p-1"
              style={{
                left: cellToGrid(i + 1)[1] * cs,
                top: cellToGrid(i + 1)[0] * cs,
                width: cs,
                height: cs,
                background: getCellBg(i + 1),
              }}
            >
              <span className="text-[9px] font-black text-black/25">
                {i + 1}
              </span>
            </div>
          ))}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={boardSize}
            height={boardSize}
          >
            {board.ladders.map((l, i) => (
              <Ladder key={i} from={l.from} to={l.to} cs={cs} />
            ))}
            {board.snakes.map((s, i) => (
              <RealisticSnake
                key={i}
                from={s.from}
                to={s.to}
                cs={cs}
                color={s.color}
                patternColor={s.pattern}
              />
            ))}
            {positions.map((p, i) => (
              <AttractivePawn
                key={i}
                x={
                  center(p, cs).x +
                  (positions[0] === positions[1]
                    ? i === 0
                      ? -cs / 6
                      : cs / 6
                    : 0)
                }
                y={center(p, cs).y}
                size={cs * 0.38}
                color={i === 0 ? "#ef4444" : "#3b82f6"}
                label={i === 0 ? "1" : "2"}
              />
            ))}
          </svg>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-8 w-full justify-center">
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl border-4 ${rolling ? "animate-bounce" : ""}`}
          style={{ borderColor: current === 0 ? "#ef4444" : "#3b82f6" }}
        >
          <div className="grid grid-cols-3 gap-1 p-3">
            {[...Array(9)].map((_, i) => {
              const dots = {
                1: [4],
                2: [0, 8],
                3: [0, 4, 8],
                4: [0, 2, 6, 8],
                5: [0, 2, 4, 6, 8],
                6: [0, 2, 3, 5, 6, 8],
              }[diceVal];
              return (
                <div
                  key={i}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${dots?.includes(i) ? "" : "opacity-0"}`}
                  style={{
                    backgroundColor: current === 0 ? "#ef4444" : "#3b82f6",
                  }}
                />
              );
            })}
          </div>
        </div>
        <button
          onClick={() => triggerTurn(current)}
          disabled={rolling || isMoving || winner !== null}
          className="px-10 py-4 bg-white text-[#0f172a] rounded-2xl font-black text-xl shadow-xl active:scale-95 disabled:opacity-20 uppercase"
        >
          {winner !== null ? "Won!" : rolling || isMoving ? "..." : "Roll"}
        </button>
      </div>

      {/* WINNER POPUP OVERLAY */}
      {winner !== null && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0f172a]/90 backdrop-blur-md p-6">
          <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tight">
              {winner === 0
                ? "Player 1"
                : mode === "computer"
                  ? "CPU"
                  : "Player 2"}{" "}
              Wins!
            </h2>
            <p className="text-slate-500 font-bold mb-8 uppercase tracking-widest text-sm">
              Congratulations!
            </p>

            <div className="space-y-4">
              <button
                onClick={() => startGame(mode)}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-lg hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={() => setMode(null)}
                className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all"
              >
                MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}