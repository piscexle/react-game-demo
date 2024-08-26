import React, { useState, useEffect } from 'react';
import './App.css';

const getRandomPosition = (width, height, existingPoints) => {
  let position;
  let isOverlapping;
  const overlapThreshold = 0.3; // Allow up to 30% overlap

  do {
    position = {
      x: Math.random() * (width - 50),
      y: Math.random() * (height - 50),
    };
    isOverlapping = existingPoints.some(point => {
      const dx = point.position.x - position.x;
      const dy = point.position.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < 50 * (1 - overlapThreshold); // Allow some overlap
    });
  } while (isOverlapping);
  return position;
};

const Game = () => {
  const [points, setPoints] = useState([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalPoints, setTotalPoints] = useState(10);
  const [gameStatus, setGameStatus] = useState('');

  const initializePoints = () => {
    const newPoints = Array.from({ length: totalPoints }, (_, i) => ({
      id: i + 1,
      position: getRandomPosition(400, 400, points),
      clicked: false,
      isWrong: false,
    }));
    setPoints(newPoints);
  };

  useEffect(() => {
    if (isPlaying && score === points.length) {
      setGameStatus('You Win!');
      stopGame();
    }
  }, [score, isPlaying]);

  useEffect(() => {
    if (isPlaying && startTime) {
      const interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying, startTime]);

  const handlePointClick = (id) => {
    if (isPlaying && score + 1 === id) {
      setPoints(points.map(point => point.id === id ? { ...point, clicked: true } : point));
      setScore(score + 1);
    } else if (isPlaying) {
      setPoints(points.map(point => point.id === id ? { ...point, isWrong: true } : point));
      setGameStatus('Game Over');
      stopGame();
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setStartTime(new Date());
    setScore(0);
    setTime(0);
    setGameStatus('');
    initializePoints();
  };

  const stopGame = () => {
    setIsPlaying(false);
    setStartTime(null);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore(0);
    setTime(0);
    setStartTime(null);
    setGameStatus('');
    initializePoints();
  };

  return (
    <div className="game-container">
      <div className="game-info">
        <p>Points: {score}</p>
        <p>Time: {time.toFixed(1)}s</p>
        <input 
          type="number" 
          value={totalPoints} 
          onChange={(e) => setTotalPoints(Number(e.target.value))} 
          min="1" 
          max="1000"
          disabled={isPlaying}
        />
        <button onClick={isPlaying ? resetGame : startGame}>
          {isPlaying ? 'Restart' : 'Play'}
        </button>
        {gameStatus && <p className={gameStatus === 'Game Over' ? 'game-over' : 'game-win'}>{gameStatus}</p>}
      </div>
      <div className="game-board">
        {points.map((point) => (
          <div
            key={point.id}
            className="point"
            style={{
              top: point.position.y,
              left: point.position.x,
              backgroundColor: point.clicked ? 'green' : point.isWrong ? 'red' : '#2196F3',
            }}
            onClick={() => handlePointClick(point.id)}
          >
            {point.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
