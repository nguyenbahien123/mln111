import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Alert, Modal } from 'react-bootstrap';
import { philosopherAPI, quoteAPI } from '../services/api';

export default function FlappyPhilosopher() {
  const canvasRef = useRef(null);
  const quotesRef = useRef([]);
  const [score, setScore] = useState(0);
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [gameRunning, setGameRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const gameState = useRef({
    birdY: 200,
    birdVelocity: 0,
    gravity: 0.5,
    jumpPower: -8,
    pipes: [],
    score: 0,
    gameOverFlag: false,
    lastQuoteScore: 0,
    pipeSpeed: 3,
    frameCount: 0
  });

  const quoteAlertRef = useRef(null);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const philosophersRes = await philosopherAPI.getAll();
        const allQuotes = [];
        
        for (const philosopher of philosophersRes.data) {
          try {
            const quotesRes = await quoteAPI.getByPhilosopherId(philosopher.id);
            const quotesWithAuthor = quotesRes.data.map(q => ({
              ...q,
              philosopherName: philosopher.name
            }));
            allQuotes.push(...quotesWithAuthor);
          } catch (err) {
            console.error(`Failed to fetch quotes for philosopher ${philosopher.id}`, err);
          }
        }
        
        quotesRef.current = allQuotes;
        setQuotes(allQuotes);
      } catch (err) {
        console.error('Failed to fetch quotes', err);
      }
    };
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = gameState.current;
    const BIRD_X = 80;
    const BIRD_SIZE = 30;
    const PIPE_WIDTH = 60;
    const PIPE_GAP = 180;

    const handleKeyPress = (e) => {
      if ((e.key === 'w' || e.key === 'W') && state.birdY > 0) {
        e.preventDefault();
        state.birdVelocity = state.jumpPower;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const gameLoop = setInterval(() => {
      state.frameCount++;

      // Physics
      state.birdVelocity += state.gravity;
      state.birdY += state.birdVelocity;

      // Boundary check
      if (state.birdY <= 0) {
        state.birdY = 0;
        state.birdVelocity = 0;
      }

      if (state.birdY >= canvas.height - BIRD_SIZE) {
        state.gameOverFlag = true;
        setGameOver(true);
        setGameRunning(false);
      }

      // Generate pipes
      if (state.frameCount % 90 === 0) {
        const minHeight = 50;
        const maxHeight = canvas.height - PIPE_GAP - 100;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        
        state.pipes.push({
          x: canvas.width,
          topHeight: topHeight,
          bottomY: topHeight + PIPE_GAP,
          passed: false
        });
      }

      // Move and filter pipes
      state.pipes = state.pipes.filter(pipe => {
        pipe.x -= state.pipeSpeed;

        // Check if bird passed the pipe
        if (!pipe.passed && pipe.x + PIPE_WIDTH < BIRD_X) {
          pipe.passed = true;
          state.score++;
          setScore(state.score);

          // Show quote every 3 pipes
          if (state.score % 3 === 0 && state.score > state.lastQuoteScore) {
            state.lastQuoteScore = state.score;
            if (quotesRef.current.length > 0) {
              const randomQuote = quotesRef.current[Math.floor(Math.random() * quotesRef.current.length)];
              setCurrentQuote(randomQuote);
            }
          }
        }

        return pipe.x > -PIPE_WIDTH;
      });

      // Collision detection
      state.pipes.forEach(pipe => {
        // Check collision with top pipe
        if (
          BIRD_X + BIRD_SIZE > pipe.x &&
          BIRD_X < pipe.x + PIPE_WIDTH &&
          state.birdY < pipe.topHeight
        ) {
          state.gameOverFlag = true;
          setGameOver(true);
          setGameRunning(false);
        }

        // Check collision with bottom pipe
        if (
          BIRD_X + BIRD_SIZE > pipe.x &&
          BIRD_X < pipe.x + PIPE_WIDTH &&
          state.birdY + BIRD_SIZE > pipe.bottomY
        ) {
          state.gameOverFlag = true;
          setGameOver(true);
          setGameRunning(false);
        }
      });

      // Draw background
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw pipes
      ctx.fillStyle = '#228B22';
      state.pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);
        
        // Pipe border
        ctx.strokeStyle = '#006400';
        ctx.lineWidth = 3;
        ctx.strokeRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        ctx.strokeRect(pipe.x, pipe.bottomY, PIPE_WIDTH, canvas.height - pipe.bottomY);
      });

      // Draw bird
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(BIRD_X + BIRD_SIZE/2, state.birdY + BIRD_SIZE/2, BIRD_SIZE/2, 0, Math.PI * 2);
      ctx.fill();
      
      // Bird eye
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(BIRD_X + BIRD_SIZE/2 + 5, state.birdY + BIRD_SIZE/2 - 5, 4, 0, Math.PI * 2);
      ctx.fill();

      // Bird beak
      ctx.fillStyle = '#FF6347';
      ctx.beginPath();
      ctx.moveTo(BIRD_X + BIRD_SIZE, state.birdY + BIRD_SIZE/2);
      ctx.lineTo(BIRD_X + BIRD_SIZE + 10, state.birdY + BIRD_SIZE/2 - 5);
      ctx.lineTo(BIRD_X + BIRD_SIZE + 10, state.birdY + BIRD_SIZE/2 + 5);
      ctx.closePath();
      ctx.fill();

      // Draw score
      ctx.fillStyle = '#000';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Score: ${state.score}`, 10, 35);

      // Draw instructions
      ctx.font = '16px Arial';
      ctx.fillText('Nhấn W để nhảy', 10, 65);
    }, 30);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameRunning, gameOver]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (gameRunning && !gameOver) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePopState = (e) => {
      if (gameRunning && !gameOver) {
        e.preventDefault();
        setShowExitModal(true);
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [gameRunning, gameOver]);

  // Auto-scroll to show quote when it appears
  useEffect(() => {
    if (currentQuote && quoteAlertRef.current) {
      // Scroll to element with extra offset to ensure quote is fully visible
      const yOffset = -100; // Negative to scroll higher
      const element = quoteAlertRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [currentQuote]);

  const handleRestart = () => {
    gameState.current = {
      birdY: 200,
      birdVelocity: 0,
      gravity: 0.5,
      jumpPower: -8,
      pipes: [],
      score: 0,
      gameOverFlag: false,
      lastQuoteScore: 0,
      pipeSpeed: 3,
      frameCount: 0
    };
    setScore(0);
    setCurrentQuote(null);
    setGameOver(false);
    setGameRunning(true);
  };

  return (
    <Container className="py-5">
      <Card className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-3">🐦 Flappy Triết Học</h2>
          <p className="text-center text-muted mb-3">
            <small>Nhấn W để nhảy • Vượt qua 3 cột để nhận triết lý</small>
          </p>

          {currentQuote && (
            <Alert variant="success" className="text-center mb-3 py-2" ref={quoteAlertRef}>
              <small>
                <em>"{currentQuote.content}"</em>
                <div className="text-muted mt-1">— {currentQuote.philosopherName}</div>
              </small>
            </Alert>
          )}

          <div className="d-flex justify-content-center mb-3">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              style={{
                border: '3px solid #333',
                borderRadius: '8px',
                backgroundColor: '#87CEEB'
              }}
            />
          </div>

          {gameOver && (
            <Alert variant="danger" className="text-center mb-3">
              <h4>💀 Game Over!</h4>
              <p>Score cuối cùng: <strong>{score}</strong></p>
            </Alert>
          )}

          <div className="text-center">
            <Button
              variant="primary"
              onClick={handleRestart}
              className="me-2"
            >
              {gameOver ? '🔄 Chơi lại' : '🔄 Bắt đầu lại'}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showExitModal} onHide={() => setShowExitModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thoát</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc muốn thoát game Flappy? Tiến trình sẽ bị mất.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExitModal(false)}>
            Tiếp tục chơi
          </Button>
          <Button variant="danger" onClick={() => window.history.back()}>
            Thoát
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
