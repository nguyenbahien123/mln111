import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Alert, Modal } from 'react-bootstrap';
import { philosopherAPI, quoteAPI } from '../services/api';

export default function DinoPhilosopher() {
  const canvasRef = useRef(null);
  const quotesRef = useRef([]);
  const quoteAlertRef = useRef(null);
  const [score, setScore] = useState(0);
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [gameRunning, setGameRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const gameState = useRef({
    dinoY: 300,
    dinoVelocity: 0,
    gravity: 0.7,
    jumping: false,
    obstacles: [],
    score: 0,   
    gameOverFlag: false,
    lastQuoteScore: 0
  });

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        // Fetch tất cả philosophers
        const philosophersRes = await philosopherAPI.getAll();
        const allQuotes = [];
        
        // Fetch quotes cho mỗi philosopher
        for (const philosopher of philosophersRes.data) {
          try {
            const quotesRes = await quoteAPI.getByPhilosopherId(philosopher.id);
            // Thêm tên philosopher vào mỗi quote
            const quotesWithAuthor = quotesRes.data.map(q => ({
              ...q,
              philosopherName: philosopher.name
            }));
            allQuotes.push(...quotesWithAuthor);
          } catch (err) {
            console.error(`Failed to fetch quotes for philosopher ${philosopher.id}`, err);
          }
        }
        
        console.log('Dino: Fetched quotes:', allQuotes); // Debug
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
    const DINO_X = 50;
    const GROUND_Y = 320;
    const DINO_SIZE = 40;

    const handleKeyPress = (e) => {
      if ((e.key === 'w' || e.key === 'W') && !state.jumping) {
        e.preventDefault();
        state.jumping = true;
        state.dinoVelocity = -18; // higher, faster jump like Chrome dino
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const gameLoop = setInterval(() => {
      // Physics
      state.dinoVelocity += state.gravity;
      state.dinoY += state.dinoVelocity;

      if (state.dinoY >= GROUND_Y) {
        state.dinoY = GROUND_Y;
        state.jumping = false;
        state.dinoVelocity = 0;
      }

      // Move obstacles
      state.obstacles = state.obstacles.filter(obs => {
        obs.x -= 8; // match faster jump cadence
        return obs.x > -50;
      });

      // Generate obstacles
      if (Math.random() < 0.02) {
        state.obstacles.push({
          x: canvas.width,
          y: GROUND_Y,
          width: 22,
          height: 46
        });
      }

      // Check collision
      state.obstacles.forEach(obs => {
        if (
          DINO_X < obs.x + obs.width &&
          DINO_X + DINO_SIZE > obs.x &&
          state.dinoY < obs.y + obs.height &&
          state.dinoY + DINO_SIZE > obs.y
        ) {
          state.gameOverFlag = true;
          setGameOver(true);
          setGameRunning(false);
        }
      });

      // Increase score
      state.score += 1;
      const displayedScore = Math.floor(state.score / 10);
      setScore(displayedScore);

      // Show quote every 10 points and keep until next quote
      if (displayedScore % 10 === 0 && displayedScore > state.lastQuoteScore) {
        state.lastQuoteScore = displayedScore;
        if (quotesRef.current.length > 0) {
          setCurrentQuote(quotesRef.current[Math.floor(Math.random() * quotesRef.current.length)]);
        }
      }

      // Draw background
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = '#90EE90';
      ctx.fillRect(0, GROUND_Y + DINO_SIZE, canvas.width, 60);

      // Draw dino
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(DINO_X, state.dinoY, DINO_SIZE, DINO_SIZE);
      
      // Draw dino eye
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(DINO_X + 28, state.dinoY + 10, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(DINO_X + 28, state.dinoY + 10, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw obstacles (red boxes)
      ctx.fillStyle = '#FF0000';
      state.obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      });

      // Draw score
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${Math.floor(state.score / 10)}`, 10, 30);

      // Draw instructions
      ctx.font = '14px Arial';
      ctx.fillText('Nhấn W để nhảy', 10, 60);
    }, 50);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameRunning, gameOver, quotes]);

  // Scroll to quote when it appears, keeping canvas visible
  useEffect(() => {
    if (!currentQuote || !quoteAlertRef.current || !canvasRef.current) return;
    const qRect = quoteAlertRef.current.getBoundingClientRect();
    const cRect = canvasRef.current.getBoundingClientRect();
    const pageYQuote = qRect.top + window.pageYOffset;
    const pageYCanvasBottom = cRect.bottom + window.pageYOffset;
    const viewportH = window.innerHeight;

    // Target: show quote near top while ensuring canvas bottom fits in viewport
    let targetTop = pageYQuote - 80; // slight offset so quote isn't glued to top
    const maxTop = pageYCanvasBottom - viewportH + 30; // keep canvas bottom visible with margin
    if (targetTop > maxTop) targetTop = Math.max(0, maxTop);
    if (targetTop < 0) targetTop = 0;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  }, [currentQuote]);

  const handleRestart = () => {
    gameState.current = {
      dinoY: 300,
      dinoVelocity: 0,
      gravity: 0.7,
      jumping: false,
      obstacles: [],
      score: 0,
      gameOverFlag: false,
      lastQuoteScore: 0
    };
    setScore(0);
    setCurrentQuote(null);
    setGameOver(false);
    setGameRunning(true);
  };

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

  return (
    <Container className="py-5">
      <Card className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4">🦖 Dino Triết Học</h2>

          {currentQuote ? (
            <Alert variant="success" className="text-center mb-3" ref={quoteAlertRef}>
              <div className="mb-2">
                <em>"{currentQuote.content}"</em>
              </div>
              <div className="text-muted">
                <small>— {currentQuote.philosopherName}</small>
              </div>
            </Alert>
          ) : (
            <Alert variant="info" className="text-center mb-3" ref={quoteAlertRef}>
              <small>Đạt mỗi 10 điểm để nhận câu nói triết học!</small>
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
              {gameOver ? '🔄 Chơi lại' : gameRunning ? '⏸ Tạm dừng' : '▶ Tiếp tục'}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showExitModal} onHide={() => setShowExitModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thoát</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc muốn thoát game Dino? Tiến trình sẽ bị mất.
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
