import { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const state = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 0, y: -1 },
    nextDir: { x: 0, y: -1 },
    food: { x: 15, y: 5 },
    lastUpdate: 0,
  });

  // Game loop using requestAnimationFrame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const draw = () => {
      // Clear background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Draw grid (jarring)
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_SIZE; i += CELL_SIZE) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
      }

      // Draw food (Magenta)
      ctx.fillStyle = '#FF00FF';
      ctx.fillRect(state.current.food.x * CELL_SIZE, state.current.food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      // Draw snake (Cyan)
      state.current.snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#FFFFFF' : '#00FFFF';
        ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      });
    };

    const update = (time: number) => {
      animationFrameId = requestAnimationFrame(update);

      if (gameOver || isPaused) {
        draw(); // Keep drawing the static state
        return;
      }

      // Throttle to ~10 FPS
      if (time - state.current.lastUpdate < 100) return;
      state.current.lastUpdate = time;

      // Move snake
      state.current.dir = state.current.nextDir;
      const head = state.current.snake[0];
      const newHead = {
        x: head.x + state.current.dir.x,
        y: head.y + state.current.dir.y,
      };

      // Check collisions (walls or self)
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        state.current.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        return;
      }

      state.current.snake.unshift(newHead);

      // Check food collision
      if (newHead.x === state.current.food.x && newHead.y === state.current.food.y) {
        setScore((s) => s + 10);
        
        // Spawn new food, ensuring it doesn't land on the snake
        let newFood = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };
        while (state.current.snake.some(s => s.x === newFood.x && s.y === newFood.y)) {
          newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          };
        }
        state.current.food = newFood;
      } else {
        state.current.snake.pop();
      }

      draw();
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameOver, isPaused]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling for game controls
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const { dir } = state.current;
      switch (e.key) {
        case 'ArrowUp':
          if (dir.y !== 1) state.current.nextDir = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (dir.y !== -1) state.current.nextDir = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (dir.x !== 1) state.current.nextDir = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (dir.x !== -1) state.current.nextDir = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const resetGame = () => {
    state.current = {
      snake: [{ x: 10, y: 10 }],
      dir: { x: 0, y: -1 },
      nextDir: { x: 0, y: -1 },
      food: { x: 15, y: 5 },
      lastUpdate: performance.now(),
    };
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="mb-4 flex w-full max-w-[400px] justify-between items-center text-[#00FFFF] font-mono">
        <div className="text-xl font-bold uppercase">
          DATA_MINED: {score}
        </div>
        <div className="text-sm border-2 border-[#FF00FF] px-2 py-1 bg-black text-[#FF00FF]">
          [SPACE] HALT
        </div>
      </div>
      
      <div className="relative p-2 bg-black border-4 border-[#00FFFF] shadow-[8px_8px_0px_#FF00FF]">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="bg-black block"
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 border-4 border-[#FF00FF] m-2">
            <h2 className="text-2xl md:text-3xl font-mono text-[#FF00FF] mb-6 uppercase text-center glitch" data-text="FATAL_EXCEPTION">
              FATAL_EXCEPTION
            </h2>
            <p className="text-[#00FFFF] font-sans text-2xl mb-8">0xDEADBEEF</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-black text-[#00FFFF] border-4 border-[#00FFFF] hover:bg-[#00FFFF] hover:text-black transition-none font-mono uppercase text-xl shadow-[4px_4px_0px_#FF00FF] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-10 border-4 border-[#00FFFF] m-2">
            <h2 className="text-3xl font-mono text-[#00FFFF] mb-4 uppercase glitch" data-text="EXECUTION_HALTED">
              EXECUTION_HALTED
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
