import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Alert, Modal } from 'react-bootstrap';
import { philosopherAPI, quoteAPI } from '../services/api';

export default function QuoteCollector() {
  const canvasRef = useRef(null);
  const quotesRef = useRef([]); // Store quotes in ref for game loop access
  const quoteAlertRef = useRef(null);
  
  const [score, setScore] = useState(0);
  const [quotes, setQuotes] = useState([]);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [gameRunning, setGameRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const gameState = useRef({
    playerX: 200,
    playerY: 200,
    quoteX: 400,
    quoteY: 400,
    score: 0,
    speed: 5
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
        
        console.log('Fetched quotes:', allQuotes); // Debug
        quotesRef.current = allQuotes; // Store in ref for game loop
        setQuotes(allQuotes); // Store in state
        if (allQuotes.length > 0) {
          const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
          console.log('Initial quote:', randomQuote); // Debug
          setCurrentQuote(randomQuote);
        }
      } catch (err) {
        console.error('Failed to fetch quotes', err);
      }
    };
    fetchQuotes();
  }, []);

  useEffect(() => {
    if (!gameRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const keys = {};

    const handleKeyDown = (e) => {
      keys[e.key] = true;
    };

    const handleKeyUp = (e) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const gameLoop = setInterval(() => {
      const state = gameState.current;

      // Handle player movement
      if (keys['ArrowUp'] || keys['w']) state.playerY = Math.max(20, state.playerY - state.speed);
      if (keys['ArrowDown'] || keys['s']) state.playerY = Math.min(canvas.height - 20, state.playerY + state.speed);
      if (keys['ArrowLeft'] || keys['a']) state.playerX = Math.max(20, state.playerX - state.speed);
      if (keys['ArrowRight'] || keys['d']) state.playerX = Math.min(canvas.width - 20, state.playerX + state.speed);

      // Draw background
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw player (circle)
      ctx.fillStyle = '#4A90E2';
      ctx.beginPath();
      ctx.arc(state.playerX, state.playerY, 15, 0, Math.PI * 2);
      ctx.fill();

      // Draw quote (rectangle)
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(state.quoteX - 20, state.quoteY - 20, 40, 40);

      // Check collision
      const distance = Math.sqrt(
        Math.pow(state.playerX - state.quoteX, 2) +
        Math.pow(state.playerY - state.quoteY, 2)
      );

      if (distance < 35) {
        state.score += 10;
        setScore(state.score);

        // New quote location
        state.quoteX = Math.random() * (canvas.width - 40) + 20;
        state.quoteY = Math.random() * (canvas.height - 40) + 20;

        // Show random quote
        console.log('Collision! Quotes available:', quotesRef.current.length); // Debug
        if (quotesRef.current.length > 0) {
          const randomQuote = quotesRef.current[Math.floor(Math.random() * quotesRef.current.length)];
          console.log('Selected quote:', randomQuote); // Debug
          setCurrentQuote(randomQuote);
        }

        // Increase speed
        state.speed = Math.min(8, state.speed + 0.2);
      }
    }, 50);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameRunning, quotes]);

  // Scroll to quote when it changes, keeping canvas visible in viewport
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
          <h2 className="text-center mb-4">🎮 Collector Triết Học</h2>
          
          <div className="text-center mb-3">
            <h4>Score: <span className="text-primary">{score}</span></h4>
          </div>

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
              <small>Ăn hình vuông vàng để thấy câu nói triết học!</small>
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
                backgroundColor: '#f9f9f9'
              }}
            />
          </div>

          <div className="text-center">
            <p className="text-muted">Hướng dẫn: Dùng mũi tên hoặc WASD để di chuyển</p>
            <p className="text-muted">Ăn các hình vuông vàng để thu thập câu nói triết học!</p>
            {/* <Button
              variant={gameRunning ? 'warning' : 'primary'}
              onClick={() => {
                setGameRunning(!gameRunning);
              }}
            >
              {gameRunning ? '⏸ Tạm dừng' : '▶ Tiếp tục'}
            </Button> */}
          </div>
        </Card.Body>
      </Card>

      <Modal show={showExitModal} onHide={() => setShowExitModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thoát</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc muốn thoát game Collector? Tiến trình sẽ bị mất.
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
