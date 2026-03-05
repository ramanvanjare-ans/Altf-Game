import React, { useState, useEffect, useRef, useCallback } from "react";

const MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 1],
  [1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1],
  [1, 1, 1, 1, 2, 0, 0, 1, 1, 0, 1, 1, 0, 0, 2, 1, 1, 1, 1],
  [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
  [1, 1, 1, 1, 2, 0, 0, 1, 1, 1, 1, 1, 0, 0, 2, 1, 1, 1, 1],
  [1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 1, 1, 1],
  [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
  [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1],
  [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const ROWS = MAZE.length;
const COLS = MAZE[0].length;
const PACMAN_START = { row: 16, col: 9 };
const GHOST_HOME = { row: 9, col: 9 };

const GHOSTS_CONFIG = [
  {
    row: 9,
    col: 8,
    color: "#FF2222",
    name: "Blinky",
    type: "chaser",
    scatter: { row: 0, col: COLS - 1 },
  },
  {
    row: 9,
    col: 10,
    color: "#FFB8FF",
    name: "Pinky",
    type: "ambusher",
    scatter: { row: 0, col: 0 },
  },
  {
    row: 10,
    col: 8,
    color: "#00FFFF",
    name: "Inky",
    type: "flanker",
    scatter: { row: ROWS, col: COLS - 1 },
  },
  {
    row: 10,
    col: 10,
    color: "#FFB852",
    name: "Clyde",
    type: "random",
    scatter: { row: ROWS, col: 0 },
  },
];

const DIRS = {
  up: { row: -1, col: 0, angle: 270 },
  down: { row: 1, col: 0, angle: 90 },
  left: { row: 0, col: -1, angle: 180 },
  right: { row: 0, col: 1, angle: 0 },
};
const ALL_DIRS = Object.keys(DIRS);
const OPPOSITE = { up: "down", down: "up", left: "right", right: "left" };

// BFS pathfinding
function bfs(grid, start, target) {
  const queue = [{ ...start, path: [] }];
  const visited = new Set();
  visited.add(`${start.row},${start.col}`);
  while (queue.length) {
    const cur = queue.shift();
    if (cur.row === target.row && cur.col === target.col) return cur.path;
    for (const d of ALL_DIRS) {
      const nr = cur.row + DIRS[d].row;
      const nc = cur.col + DIRS[d].col;
      const k = `${nr},${nc}`;
      if (!visited.has(k) && grid[nr] && grid[nr][nc] !== 1) {
        visited.add(k);
        queue.push({ row: nr, col: nc, path: [...cur.path, d] });
      }
    }
  }
  return null;
}

function manhattan(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export default function PacManGame() {
  const [grid, setGrid] = useState(() => MAZE.map((r) => [...r]));
  const [pacman, setPacman] = useState({ ...PACMAN_START, mouthOpen: true });
  const [ghosts, setGhosts] = useState(
    GHOSTS_CONFIG.map((g) => ({
      ...g,
      dir: "left",
      frightened: false,
      eaten: false,
      releaseTimer: 0,
    })),
  );
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem("pm_hi") || "0");
    } catch {
      return 0;
    }
  });
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState("ready"); // ready, playing, dying, won, lost, pause
  const [powerMode, setPowerMode] = useState(false);
  const [powerTimer, setPowerTimer] = useState(0);
  const [flashScreen, setFlashScreen] = useState(false);
  const [combo, setCombo] = useState(0);
  const [comboDisplay, setComboDisplay] = useState(null); // {text, x, y, key}
  const [dotCount, setDotCount] = useState(
    () => MAZE.flat().filter((c) => c === 2 || c === 3).length,
  );

  const pacDirRef = useRef("right");
  const nextDirRef = useRef("right");
  const frameRef = useRef(0);
  const powerRef = useRef(false);
  const comboRef = useRef(0);
  const containerRef = useRef(null);
  const [cellSize, setCellSize] = useState(28);
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const pacRef = useRef(pacman);
  pacRef.current = pacman;
  const ghostsRef = useRef(ghosts);
  ghostsRef.current = ghosts;
  const scoreRef = useRef(score);
  scoreRef.current = score;

  useEffect(() => {
    const obs = new ResizeObserver(() => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth - 32;
        const h = containerRef.current.offsetHeight - 140;
        const cs = Math.max(
          20,
          Math.min(Math.floor(w / COLS), Math.floor(h / ROWS), 34),
        );
        setCellSize(cs);
      }
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const resetLevel = useCallback(() => {
    setGrid(MAZE.map((r) => [...r]));
    setPacman({ ...PACMAN_START, mouthOpen: true });
    setGhosts(
      GHOSTS_CONFIG.map((g, i) => ({
        ...g,
        dir: "left",
        frightened: false,
        eaten: false,
        releaseTimer: i * 60,
      })),
    );
    setPowerMode(false);
    powerRef.current = false;
    comboRef.current = 0;
    setCombo(0);
    pacDirRef.current = "right";
    nextDirRef.current = "right";
    frameRef.current = 0;
    setDotCount(MAZE.flat().filter((c) => c === 2 || c === 3).length);
  }, []);

  const startGame = () => {
    resetLevel();
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameState("playing");
  };

  const isWalkable = useCallback((r, c, forGhost = false) => {
    if (!gridRef.current[r] || gridRef.current[r][c] === 1) return false;
    return true;
  }, []);

  // Main game loop
  useEffect(() => {
    if (gameState !== "playing") return;
    // Slower base speed and ghosts move less frequently
    const speed = Math.max(160, 280 - level * 12); // increased base, reduced level effect

    const tick = setInterval(() => {
      frameRef.current++;
      const f = frameRef.current;
      const g = gridRef.current;
      const p = pacRef.current;

      // Try to turn
      const nd = nextDirRef.current;
      const tr = p.row + DIRS[nd].row;
      const tc = p.col + DIRS[nd].col;
      if (isWalkable(tr, tc)) pacDirRef.current = nd;

      const dir = pacDirRef.current;

      // Move pacman every 2 frames
      if (f % 2 === 0) {
        const nr = p.row + DIRS[dir].row;
        const nc = p.col + DIRS[dir].col;
        // Tunnel wrap
        const wnr = (nr + ROWS) % ROWS;
        const wnc = (nc + COLS) % COLS;

        if (isWalkable(wnr, wnc)) {
          let newScore = scoreRef.current;
          let newDots = dotCount;
          let newGrid = g;
          let powerActivated = false;

          if (g[wnr][wnc] === 2) {
            newGrid = g.map((r) => [...r]);
            newGrid[wnr][wnc] = 0;
            newScore += 10;
            newDots--;
          } else if (g[wnr][wnc] === 3) {
            newGrid = g.map((r) => [...r]);
            newGrid[wnr][wnc] = 0;
            newScore += 50;
            newDots--;
            powerActivated = true;
          }

          if (newGrid !== g) {
            setGrid(newGrid);
            setScore(newScore);
            scoreRef.current = newScore;
            setDotCount(newDots);
            if (newDots <= 0) {
              setGameState("won");
              return;
            }
          }

          if (powerActivated) {
            powerRef.current = true;
            setPowerMode(true);
            setPowerTimer(6000);
            comboRef.current = 0;
            setCombo(0);
            setGhosts((gs) =>
              gs.map((gh) => ({
                ...gh,
                frightened: !gh.eaten,
                dir: OPPOSITE[gh.dir] || "up",
              })),
            );
            setTimeout(() => {
              powerRef.current = false;
              setPowerMode(false);
              setGhosts((gs) => gs.map((gh) => ({ ...gh, frightened: false })));
            }, 6000);
          }

          setPacman({ row: wnr, col: wnc, mouthOpen: f % 4 < 2 });
        } else {
          setPacman((p2) => ({ ...p2, mouthOpen: f % 4 < 2 }));
        }
      }

      // Move ghosts only every 3 frames (slower than Pac-Man)
      if (f % 3 === 0) {
        setGhosts((gs) =>
          gs.map((gh, idx) => {
            if (gh.releaseTimer > 0)
              return { ...gh, releaseTimer: gh.releaseTimer - 1 };
            if (gh.eaten) {
              // Return to home
              const path = bfs(gridRef.current, gh, GHOST_HOME);
              if (!path || path.length === 0)
                return { ...gh, eaten: false, frightened: false };
              const d = path[0];
              return {
                ...gh,
                row: gh.row + DIRS[d].row,
                col: gh.col + DIRS[d].col,
                dir: d,
              };
            }

            const pac = pacRef.current;
            const choices = ALL_DIRS.filter((d) => {
              const nr = gh.row + DIRS[d].row;
              const nc = gh.col + DIRS[d].col;
              return (
                gridRef.current[nr] &&
                gridRef.current[nr][nc] !== 1 &&
                d !== OPPOSITE[gh.dir]
              );
            });
            if (choices.length === 0) return gh;

            let chosen;
            if (gh.frightened) {
              // Flee
              chosen = choices.reduce((best, d) => {
                const nr = gh.row + DIRS[d].row;
                const nc = gh.col + DIRS[d].col;
                const distNew = manhattan({ row: nr, col: nc }, pac);
                const distBest = manhattan(
                  { row: gh.row + DIRS[best].row, col: gh.col + DIRS[best].col },
                  pac,
                );
                return distNew > distBest ? d : best;
              }, choices[0]);
              // Add some randomness when fleeing
              if (Math.random() < 0.3)
                chosen = choices[Math.floor(Math.random() * choices.length)];
            } else {
              let target = pac;
              if (gh.type === "ambusher") {
                // Target 4 ahead of pacman
                target = {
                  row: pac.row + DIRS[pacDirRef.current].row * 4,
                  col: pac.col + DIRS[pacDirRef.current].col * 4,
                };
              } else if (gh.type === "flanker") {
                // Inky-style
                const blinky = ghostsRef.current[0];
                const pivot = {
                  row: pac.row + DIRS[pacDirRef.current].row * 2,
                  col: pac.col + DIRS[pacDirRef.current].col * 2,
                };
                target = {
                  row: pivot.row + (pivot.row - blinky.row),
                  col: pivot.col + (pivot.col - blinky.col),
                };
              } else if (gh.type === "random") {
                if (manhattan(gh, pac) > 8) {
                  chosen = choices[Math.floor(Math.random() * choices.length)];
                } else {
                  target = gh.scatter;
                }
              }
              if (!chosen) {
                // Use BFS toward target for smart chasing
                if (f % 3 === 0 && gh.type === "chaser") {
                  const path = bfs(gridRef.current, gh, target);
                  chosen = path?.[0] || choices[0];
                } else {
                  chosen = choices.reduce((best, d) => {
                    const nr = gh.row + DIRS[d].row;
                    const nc = gh.col + DIRS[d].col;
                    const dn = manhattan({ row: nr, col: nc }, target);
                    const db = manhattan(
                      {
                        row: gh.row + DIRS[best].row,
                        col: gh.col + DIRS[best].col,
                      },
                      target,
                    );
                    return dn < db ? d : best;
                  }, choices[0]);
                }
              }
            }

            const newRow = gh.row + DIRS[chosen].row;
            const newCol = gh.col + DIRS[chosen].col;
            return { ...gh, row: newRow, col: newCol, dir: chosen };
          }),
        );
      }
    }, speed);

    return () => clearInterval(tick);
  }, [gameState, level, isWalkable, dotCount]);

  // Collision detection
  useEffect(() => {
    if (gameState !== "playing") return;
    const pac = pacman;
    ghosts.forEach((g) => {
      if (g.releaseTimer > 0 || g.eaten) return;
      if (g.row === pac.row && g.col === pac.col) {
        if (powerMode && g.frightened) {
          // Eat ghost
          const pts = [200, 400, 800, 1600][Math.min(comboRef.current, 3)];
          comboRef.current++;
          setCombo(comboRef.current);
          setScore((s) => {
            const ns = s + pts;
            scoreRef.current = ns;
            return ns;
          });
          setComboDisplay({
            text: `+${pts}!`,
            row: g.row,
            col: g.col,
            key: Date.now(),
          });
          setTimeout(() => setComboDisplay(null), 800);
          setGhosts((gs) =>
            gs.map((gh) =>
              gh === g ? { ...gh, eaten: true, frightened: false } : gh,
            ),
          );
        } else if (!powerMode) {
          setFlashScreen(true);
          setTimeout(() => setFlashScreen(false), 500);
          if (lives > 1) {
            setLives((l) => l - 1);
            setGameState("dying");
            setTimeout(() => {
              setPacman({ ...PACMAN_START, mouthOpen: true });
              setGhosts(
                GHOSTS_CONFIG.map((gc, i) => ({
                  ...gc,
                  dir: "left",
                  frightened: false,
                  eaten: false,
                  releaseTimer: i * 60,
                })),
              );
              pacDirRef.current = "right";
              nextDirRef.current = "right";
              setGameState("playing");
            }, 1200);
          } else {
            setGameState("lost");
            setLives(0);
            setHighScore((hs) => {
              const ns = Math.max(hs, scoreRef.current);
              try {
                localStorage.setItem("pm_hi", ns);
              } catch {}
              return ns;
            });
          }
        }
      }
    });
  }, [pacman, ghosts, gameState, powerMode, lives]);

  // Level complete
  useEffect(() => {
    if (gameState === "won") {
      setTimeout(() => {
        setLevel((l) => l + 1);
        resetLevel();
        setGameState("playing");
      }, 2000);
    }
  }, [gameState, resetLevel]);

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      const map = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
        W: "up",
        S: "down",
        A: "left",
        D: "right",
      };
      if (map[e.key]) {
        nextDirRef.current = map[e.key];
        e.preventDefault();
      }
      if (e.key === "Escape" || e.key === "p" || e.key === "P") {
        setGameState((s) =>
          s === "playing" ? "pause" : s === "pause" ? "playing" : s,
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const W = cellSize * COLS;
  const H = cellSize * ROWS;

  const renderCell = (val, r, c) => {
    const key = `${r}-${c}`;
    const x = c * cellSize;
    const y = r * cellSize;
    const cs = cellSize;

    if (val === 1) {
      // Wall - check neighbors to create smooth look
      return (
        <rect
          key={key}
          x={x}
          y={y}
          width={cs}
          height={cs}
          fill="url(#wallGrad)"
          stroke="#0022aa"
          strokeWidth="0.5"
        />
      );
    }
    if (val === 2) {
      return (
        <circle
          key={key}
          cx={x + cs / 2}
          cy={y + cs / 2}
          r={cs * 0.12}
          fill="#ffee88"
          opacity="0.9"
        />
      );
    }
    if (val === 3) {
      return (
        <g key={key}>
          <circle
            cx={x + cs / 2}
            cy={y + cs / 2}
            r={cs * 0.28}
            fill="#ff8800"
            opacity="0.95"
          >
            <animate
              attributeName="r"
              values={`${cs * 0.28};${cs * 0.35};${cs * 0.28}`}
              dur="0.8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx={x + cs / 2}
            cy={y + cs / 2}
            r={cs * 0.18}
            fill="#ffdd00"
          />
        </g>
      );
    }
    return null;
  };

  const renderPacman = () => {
    const { row, col, mouthOpen } = pacman;
    const cx = col * cellSize + cellSize / 2;
    const cy = row * cellSize + cellSize / 2;
    const r = cellSize * 0.42;
    const angle = DIRS[pacDirRef.current]?.angle ?? 0;
    const mouth = mouthOpen ? 35 : 5;
    const startAngle = ((angle + mouth) * Math.PI) / 180;
    const endAngle = ((angle + 360 - mouth) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = 360 - mouth * 2 > 180 ? 1 : 0;

    return (
      <g key="pacman">
        <circle cx={cx} cy={cy} r={r + 2} fill="#ffaa00" opacity="0.3" />
        <path
          d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc},1 ${x2},${y2} Z`}
          fill="#FFE000"
          stroke="#cc9900"
          strokeWidth="1"
        />
        <circle
          cx={cx + r * 0.2 * Math.cos(((angle - 60) * Math.PI) / 180)}
          cy={cy + r * 0.2 * Math.sin(((angle - 60) * Math.PI) / 180)}
          r={r * 0.12}
          fill="#111"
        />
      </g>
    );
  };

  const renderGhost = (g, idx) => {
    if (g.releaseTimer > 0 && !g.frightened) {
      // Still in house, show dimly
      const cx = g.col * cellSize + cellSize / 2;
      const cy = g.row * cellSize + cellSize / 2;
      return (
        <circle
          key={`gh-${idx}`}
          cx={cx}
          cy={cy}
          r={cellSize * 0.3}
          fill={g.color}
          opacity="0.4"
        />
      );
    }
    const x = g.col * cellSize;
    const y = g.row * cellSize;
    const cs = cellSize;
    const fill = g.eaten
      ? "transparent"
      : g.frightened
        ? powerTimer < 2000 && Math.floor(Date.now() / 300) % 2 === 0
          ? "#ffffff"
          : "#2233ff"
        : g.color;

    const eyeColor = g.eaten ? "#00aaff" : g.frightened ? "#ffffff" : "#ffffff";
    const pupilColor = g.eaten ? "#ffffff" : "#000088";

    const bodyPath = `
      M${x + cs * 0.1},${y + cs * 0.95}
      L${x + cs * 0.1},${y + cs * 0.45}
      Q${x + cs * 0.5},${y + cs * 0.05} ${x + cs * 0.9},${y + cs * 0.45}
      L${x + cs * 0.9},${y + cs * 0.95}
      Q${x + cs * 0.8},${y + cs * 0.82} ${x + cs * 0.7},${y + cs * 0.95}
      Q${x + cs * 0.6},${y + cs * 0.82} ${x + cs * 0.5},${y + cs * 0.95}
      Q${x + cs * 0.4},${y + cs * 0.82} ${x + cs * 0.3},${y + cs * 0.95}
      Q${x + cs * 0.2},${y + cs * 0.82} ${x + cs * 0.1},${y + cs * 0.95}
      Z
    `;

    const dirOffset = {
      up: [-0.05, -0.05],
      down: [-0.05, 0.05],
      left: [-0.1, 0],
      right: [0.1, 0],
    };
    const [eo, evo] = dirOffset[g.dir] || [0, 0];

    return (
      <g key={`gh-${idx}`} opacity={g.eaten ? 0.5 : 1}>
        {!g.eaten && (
          <path
            d={bodyPath}
            fill={fill}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="0.5"
          />
        )}
        {/* Eyes */}
        <ellipse
          cx={x + cs * 0.32}
          cy={y + cs * 0.42}
          rx={cs * 0.12}
          ry={cs * 0.14}
          fill={eyeColor}
        />
        <ellipse
          cx={x + cs * 0.68}
          cy={y + cs * 0.42}
          rx={cs * 0.12}
          ry={cs * 0.14}
          fill={eyeColor}
        />
        <circle
          cx={x + cs * (0.32 + eo)}
          cy={y + cs * (0.42 + evo)}
          r={cs * 0.07}
          fill={pupilColor}
        />
        <circle
          cx={x + cs * (0.68 + eo)}
          cy={y + cs * (0.42 + evo)}
          r={cs * 0.07}
          fill={pupilColor}
        />
        {g.frightened && !g.eaten && (
          <path
            d={`M${x + cs * 0.28},${y + cs * 0.65} Q${x + cs * 0.36},${y + cs * 0.58} ${x + cs * 0.44},${y + cs * 0.65} Q${x + cs * 0.52},${y + cs * 0.72} ${x + cs * 0.6},${y + cs * 0.65} Q${x + cs * 0.68},${y + cs * 0.58} ${x + cs * 0.76},${y + cs * 0.65}`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        )}
      </g>
    );
  };

  const CELL = cellSize;

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #000008 0%, #00001a 50%, #000008 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Press Start 2P', 'Courier New', monospace",
        color: "#FFE000",
        padding: "16px",
        userSelect: "none",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes pop { 0%{transform:scale(0.5);opacity:0} 40%{transform:scale(1.3);opacity:1} 100%{transform:scale(1);opacity:0} }
        @keyframes flash { 0%,100%{background:transparent} 50%{background:rgba(255,50,50,0.4)} }
        @keyframes levelup { 0%{opacity:0;transform:scale(0.5) translateY(20px)} 50%{opacity:1;transform:scale(1.2)} 100%{opacity:0;transform:scale(1) translateY(-30px)} }
        .blink { animation: blink 1s infinite; }
        .maze-wrap { position: relative; box-shadow: 0 0 40px #0033ff, 0 0 80px #001166, inset 0 0 20px rgba(0,0,200,0.2); border: 2px solid #0044ff; border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: W + 32,
          marginBottom: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{ fontSize: Math.max(8, cellSize * 0.4), lineHeight: "1.8" }}
        >
          <div style={{ color: "#aaa", fontSize: "0.7em" }}>HIGH SCORE</div>
          <div style={{ color: "#ff88ff" }}>
            {highScore.toString().padStart(6, "0")}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: Math.max(10, cellSize * 0.55),
              color: "#FFE000",
              textShadow: "0 0 10px #ffaa00",
            }}
          >
            PAC-MAN
          </div>
          <div style={{ fontSize: "0.6em", color: "#4488ff" }}>
            LEVEL {level}
          </div>
        </div>
        <div
          style={{
            textAlign: "right",
            fontSize: Math.max(8, cellSize * 0.4),
            lineHeight: "1.8",
          }}
        >
          <div style={{ color: "#aaa", fontSize: "0.7em" }}>SCORE</div>
          <div style={{ color: "#FFE000", textShadow: "0 0 6px #ffaa00" }}>
            {score.toString().padStart(6, "0")}
          </div>
        </div>
      </div>

      {/* Lives & Power bar */}
      <div
        style={{
          width: "100%",
          maxWidth: W + 32,
          marginBottom: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <svg
              key={i}
              width={cellSize * 0.7}
              height={cellSize * 0.7}
              viewBox="0 0 20 20"
            >
              {i < lives ? (
                <path
                  d="M10,10 L13,7 A4,4 0 1,1 7,7 Z"
                  fill="#FFE000"
                  opacity="0.95"
                />
              ) : (
                <circle cx="10" cy="10" r="5" fill="#333" />
              )}
            </svg>
          ))}
        </div>
        {powerMode && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ fontSize: "0.5em", color: "#ff8800" }}>POWER!</div>
            <div
              style={{
                width: 80,
                height: 8,
                background: "#222",
                borderRadius: 4,
                border: "1px solid #ff8800",
              }}
            >
              <div
                style={{
                  width: `${(powerTimer / 6000) * 100}%`,
                  height: "100%",
                  background: "linear-gradient(90deg,#ff2200,#ff8800)",
                  borderRadius: 4,
                  transition: "width 0.1s",
                }}
              />
            </div>
          </div>
        )}
        {combo > 1 && (
          <div style={{ fontSize: "0.6em", color: "#ff4488" }}>
            COMBO x{combo}!
          </div>
        )}
      </div>

      {/* Maze */}
      <div
        ref={containerRef}
        className="maze-wrap"
        style={{
          width: "100vw",
          height: `calc(100vh - 180px)`,
          maxWidth: "100%",
          maxHeight: "100%",
          animation: flashScreen ? "flash 0.5s" : "none",
          margin: 0,
          padding: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block", maxWidth: "100vw", maxHeight: "100vh" }}
        >
          <defs>
            <linearGradient id="wallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0022cc" />
              <stop offset="50%" stopColor="#0011aa" />
              <stop offset="100%" stopColor="#000888" />
            </linearGradient>
            <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00001a" />
              <stop offset="100%" stopColor="#000008" />
            </radialGradient>
          </defs>

          {/* Background */}
          <rect width={W} height={H} fill="url(#bgGrad)" />

          {/* Cells */}
          {grid.map((row, r) => row.map((val, c) => renderCell(val, r, c)))}

          {/* Ghost house indicator */}
          <rect
            x={6 * CELL}
            y={8 * CELL}
            width={7 * CELL}
            height={5 * CELL}
            fill="none"
            stroke="#ff66ff"
            strokeWidth="1"
            strokeDasharray="3,3"
            opacity="0.4"
            rx="3"
          />

          {/* Ghosts */}
          {ghosts.map((g, i) => renderGhost(g, i))}

          {/* Pacman */}
          {gameState !== "lost" && renderPacman()}

          {/* Combo popup */}
          {comboDisplay && (
            <text
              x={comboDisplay.col * CELL + CELL / 2}
              y={comboDisplay.row * CELL}
              textAnchor="middle"
              fill="#ffff00"
              fontSize={CELL * 0.8}
              fontFamily="'Press Start 2P', monospace"
              style={{ animation: "pop 0.8s forwards" }}
            >
              {comboDisplay.text}
            </text>
          )}

          {/* Overlays */}
          {gameState === "ready" && (
            <g>
              <rect width={W} height={H} fill="rgba(0,0,0,0.75)" />
              <text
                x={W / 2}
                y={H / 2 - CELL * 3}
                textAnchor="middle"
                fill="#FFE000"
                fontSize={CELL * 1.1}
                fontFamily="'Press Start 2P',monospace"
                style={{ filter: "drop-shadow(0 0 8px #ffaa00)" }}
              >
                PAC-MAN
              </text>
              <text
                x={W / 2}
                y={H / 2 - CELL * 1.2}
                textAnchor="middle"
                fill="#aaa"
                fontSize={CELL * 0.45}
                fontFamily="'Press Start 2P',monospace"
              >
                ARROW KEYS / WASD
              </text>
              <text
                x={W / 2}
                y={H / 2 + CELL * 0.2}
                textAnchor="middle"
                fill="#aaa"
                fontSize={CELL * 0.45}
                fontFamily="'Press Start 2P',monospace"
              >
                P = PAUSE
              </text>
              <rect
                x={W / 2 - CELL * 3}
                y={H / 2 + CELL * 1.2}
                width={CELL * 6}
                height={CELL * 1.4}
                fill="#FFE000"
                rx={CELL * 0.3}
                style={{ cursor: "pointer" }}
                onClick={startGame}
              />
              <text
                x={W / 2}
                y={H / 2 + CELL * 2.1}
                textAnchor="middle"
                fill="#000"
                fontSize={CELL * 0.55}
                fontFamily="'Press Start 2P',monospace"
                style={{ cursor: "pointer", pointerEvents: "none" }}
              >
                START
              </text>
              {/* Ghost previews */}
              {GHOSTS_CONFIG.map((gc, i) => (
                <g key={i}>
                  <circle
                    cx={W / 2 - CELL * 2 + i * CELL * 1.3}
                    cy={H / 2 + CELL * 4}
                    r={CELL * 0.35}
                    fill={gc.color}
                  />
                  <text
                    x={W / 2 - CELL * 2 + i * CELL * 1.3}
                    y={H / 2 + CELL * 5.1}
                    textAnchor="middle"
                    fill={gc.color}
                    fontSize={CELL * 0.3}
                    fontFamily="'Press Start 2P',monospace"
                  >
                    {gc.name}
                  </text>
                </g>
              ))}
            </g>
          )}

          {gameState === "pause" && (
            <g>
              <rect width={W} height={H} fill="rgba(0,0,0,0.6)" />
              <text
                x={W / 2}
                y={H / 2}
                textAnchor="middle"
                fill="#FFE000"
                fontSize={CELL * 0.9}
                fontFamily="'Press Start 2P',monospace"
                className="blink"
              >
                PAUSED
              </text>
              <text
                x={W / 2}
                y={H / 2 + CELL * 1.5}
                textAnchor="middle"
                fill="#888"
                fontSize={CELL * 0.42}
                fontFamily="'Press Start 2P',monospace"
              >
                PRESS P TO RESUME
              </text>
            </g>
          )}

          {gameState === "dying" && (
            <g>
              <rect width={W} height={H} fill="rgba(100,0,0,0.3)" />
              <text
                x={W / 2}
                y={H / 2}
                textAnchor="middle"
                fill="#ff4444"
                fontSize={CELL * 0.75}
                fontFamily="'Press Start 2P',monospace"
                className="blink"
              >
                OUCH!
              </text>
            </g>
          )}

          {gameState === "won" && (
            <g>
              <rect width={W} height={H} fill="rgba(0,20,0,0.7)" />
              <text
                x={W / 2}
                y={H / 2 - CELL}
                textAnchor="middle"
                fill="#44ff44"
                fontSize={CELL * 0.85}
                fontFamily="'Press Start 2P',monospace"
                style={{ animation: "levelup 2s forwards" }}
              >
                LEVEL {level}
              </text>
              <text
                x={W / 2}
                y={H / 2 + CELL * 0.5}
                textAnchor="middle"
                fill="#FFE000"
                fontSize={CELL * 0.55}
                fontFamily="'Press Start 2P',monospace"
              >
                CLEAR!
              </text>
            </g>
          )}

          {gameState === "lost" && (
            <g>
              <rect width={W} height={H} fill="rgba(0,0,0,0.8)" />
              <text
                x={W / 2}
                y={H / 2 - CELL * 2.5}
                textAnchor="middle"
                fill="#ff2222"
                fontSize={CELL * 0.9}
                fontFamily="'Press Start 2P',monospace"
              >
                GAME OVER
              </text>
              <text
                x={W / 2}
                y={H / 2 - CELL * 0.8}
                textAnchor="middle"
                fill="#aaa"
                fontSize={CELL * 0.45}
                fontFamily="'Press Start 2P',monospace"
              >
                SCORE: {score}
              </text>
              {score >= highScore && score > 0 && (
                <text
                  x={W / 2}
                  y={H / 2 + CELL * 0.5}
                  textAnchor="middle"
                  fill="#ff88ff"
                  fontSize={CELL * 0.4}
                  fontFamily="'Press Start 2P',monospace"
                  className="blink"
                >
                  NEW HIGH SCORE!
                </text>
              )}
              <rect
                x={W / 2 - CELL * 3.5}
                y={H / 2 + CELL * 1.5}
                width={CELL * 7}
                height={CELL * 1.5}
                fill="#FFE000"
                rx={CELL * 0.3}
                style={{ cursor: "pointer" }}
                onClick={startGame}
              />
              <text
                x={W / 2}
                y={H / 2 + CELL * 2.5}
                textAnchor="middle"
                fill="#000"
                fontSize={CELL * 0.55}
                fontFamily="'Press Start 2P',monospace"
                style={{ pointerEvents: "none" }}
              >
                PLAY AGAIN
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* --- Mobile controls removed as requested --- */}

      <div
        style={{
          marginTop: 10,
          fontSize: Math.max(7, cellSize * 0.32),
          color: "#334",
          textAlign: "center",
        }}
      >
        DOT: 10pts • POWER: 50pts • GHOST: 200/400/800/1600pts
      </div>
    </div>
  );
}