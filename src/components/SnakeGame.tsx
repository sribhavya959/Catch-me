import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, RotateCcw, Trophy } from 'lucide-react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 60;

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };
      const currentDir = nextDirection;
      setDirection(currentDir);

      switch (currentDir) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions
      if (
        head.x < 0 || head.x >= GRID_SIZE ||
        head.y < 0 || head.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food
      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [food, generateFood, isGameOver, isPaused, nextDirection, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setNextDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setNextDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setNextDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setNextDirection('RIGHT'); break;
        case ' ': 
          if (isGameOver) resetGame();
          else setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, isGameOver]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, speed, isPaused, isGameOver]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex justify-between w-full max-w-[400px] mb-2 font-mono text-cyan-400">
        <div className="flex items-center gap-2">
          <Trophy size={20} />
          <span>SCORE: {score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Gamepad2 size={20} />
          <span>BEST: {highScore}</span>
        </div>
      </div>

      <div className="relative p-2 border-2 border-cyan-500 rounded-lg bg-black/50 backdrop-blur-sm neon-border">
        <div 
          className="grid gap-px bg-zinc-900 overflow-hidden rounded"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(80vw, 400px)',
            height: 'min(80vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full rounded-sm transition-all duration-200 ${
                  isHead ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' :
                  isSnake ? 'bg-cyan-600/80' :
                  isFood ? 'bg-pink-500 shadow-[0_0_12px_#ec4899] animate-pulse' :
                  'bg-zinc-800/20'
                }`}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-lg"
            >
              {isGameOver ? (
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-pink-500 mb-4 neon-text-pink">GAME OVER</h2>
                  <p className="text-xl text-cyan-300 mb-8 font-mono">FINAL SCORE: {score}</p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20"
                  >
                    <RotateCcw size={20} />
                    TRY AGAIN
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-cyan-400 mb-8 neon-text-cyan">PAUSED</h2>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-all hover:scale-105 active:scale-95"
                  >
                    RESUME
                  </button>
                  <p className="mt-4 text-xs text-zinc-500 uppercase tracking-widest font-mono">Press SPACE to toggle</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-xs text-zinc-500 font-mono text-center max-w-xs uppercase tracking-widest">
        USE ARROWS OR WASD TO NAVIGATE. 
        PRESS SPACE TO PAUSE.
      </div>
    </div>
  );
};

export default SnakeGame;
