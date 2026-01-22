import React, { useEffect, useRef, useState } from 'react';
import { Container, Card, Button, Alert, ProgressBar, Modal } from 'react-bootstrap';

export default function BuridanDonkey() {
  const arenaRef = useRef(null);
  const leftTimerRef = useRef(null);
  const rightTimerRef = useRef(null);

  const [health, setHealth] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState(null);

  const [leftPos, setLeftPos] = useState({ top: 40, left: 40 });
  const [rightPos, setRightPos] = useState({ top: 40, left: 560 });
  const [leftScale, setLeftScale] = useState(1.0);
  const [rightScale, setRightScale] = useState(1.0);
  const [leftGlow, setLeftGlow] = useState(false);
  const [rightGlow, setRightGlow] = useState(false);

  // Countdown: 5 seconds total
  useEffect(() => {
    if (gameOver) return;
    setMessage(null);
    const tickMs = 50;
    const interval = setInterval(() => {
      setHealth((h) => {
        const next = Math.max(0, h - 100 / (5000 / tickMs));
        if (next <= 0) {
          setGameOver(true);
        }
        return next;
      });
    }, tickMs);
    return () => clearInterval(interval);
  }, [gameOver]);

  const randomPos = () => {
    const arena = arenaRef.current;
    if (!arena) return { top: 40, left: 40 };
    const rect = arena.getBoundingClientRect();
    const padding = 20;
    const width = rect.width - 200; // button width room
    const height = rect.height - 100;
    const top = Math.max(padding, Math.random() * height);
    const left = Math.max(padding, Math.random() * width);
    return { top, left };
  };

  const startEvade = (side) => {
    const setPos = side === 'left' ? setLeftPos : setRightPos;
    const setScale = side === 'left' ? setLeftScale : setRightScale;
    const setOtherScale = side === 'left' ? setRightScale : setLeftScale;
    const setOtherGlow = side === 'left' ? setRightGlow : setLeftGlow;
    const timerRef = side === 'left' ? leftTimerRef : rightTimerRef;

    setScale(0.6); // smaller to dodge harder
    setOtherScale(1.35); // bigger lure
    setOtherGlow(true);
    timerRef.current && clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setPos(randomPos());
    }, 120); // faster jitter
  };

  const stopEvade = (side) => {
    const setScale = side === 'left' ? setLeftScale : setRightScale;
    const setOtherScale = side === 'left' ? setRightScale : setLeftScale;
    const setOtherGlow = side === 'left' ? setRightGlow : setLeftGlow;
    const timerRef = side === 'left' ? leftTimerRef : rightTimerRef;
    setScale(1.0);
    setOtherScale(1.0);
    setOtherGlow(false);
    timerRef.current && clearInterval(timerRef.current);
  };

  const handleEat = (side) => {
    if (gameOver) return;
    setMessage(side === 'left' ? 'Bạn đã chọn cỏ Trái! Nhưng đời là lựa chọn khó nghen.' : 'Bạn đã chọn cỏ Phải! Quyết định rồi đó nha.');
    // small heal to tease
    setHealth((h) => Math.min(100, h + 20));
  };

  const resetGame = () => {
    setHealth(100);
    setGameOver(false);
    setMessage(null);
    setLeftScale(1.0);
    setRightScale(1.0);
    setLeftGlow(false);
    setRightGlow(false);
    leftTimerRef.current && clearInterval(leftTimerRef.current);
    rightTimerRef.current && clearInterval(rightTimerRef.current);
    setLeftPos({ top: 40, left: 40 });
    setRightPos({ top: 40, left: 560 });
  };

  return (
    <Container className="py-5">
      <Card className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-3">🫏 Con Lừa Buridan: Thánh Lưỡng Lự</h2>
          <p className="text-center text-muted mb-3">
            <small>Đứng giữa hai bó cỏ ngon như nhau • Tự do ý chí và sự lựa chọn</small>
          </p>

          {message && (
            <Alert variant="warning" className="text-center mb-3">{message}</Alert>
          )}

          <div className="mb-3">
            <div className="text-center mb-2"><strong>Sức khỏe</strong> {Math.round(health)}%</div>
            <ProgressBar 
              now={health}
              variant={health < 30 ? 'danger' : 'success'}
              animated
              className="mb-3"
            />
          </div>

          <div ref={arenaRef} className="position-relative mx-auto" style={{ width: 800, height: 220 }}>
            <Button
              variant="success"
              style={{
                position: 'absolute',
                top: leftPos.top,
                left: leftPos.left,
                transform: `scale(${leftScale})`,
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={() => startEvade('left')}
              onMouseLeave={() => stopEvade('left')}
              onClick={() => handleEat('left')}
            >
              🌿 Ăn Cỏ Trái
            </Button>

            <Button
              variant="success"
              style={{
                position: 'absolute',
                top: rightPos.top,
                left: rightPos.left,
                transform: `scale(${rightScale})`,
                transition: 'transform 0.2s ease',
                boxShadow: rightGlow ? '0 0 18px 6px rgba(255,215,0,0.6)' : 'none'
              }}
              onMouseEnter={() => startEvade('right')}
              onMouseLeave={() => stopEvade('right')}
              onClick={() => handleEat('right')}
            >
              🌾 Ăn Cỏ Phải
            </Button>
          </div>

          <div className="text-center mt-3">
            <Button variant="secondary" onClick={resetGame} className="me-2">Chơi lại</Button>
          </div>

          <Modal show={gameOver} onHide={() => {}} backdrop="static" keyboard={false} centered>
            <Modal.Header>
              <Modal.Title>Game Over</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              🫏 Lừa lăn đùng ra chết vì lưỡng lự.<br />
              <strong>"Chọn nhanh lên má ơi!"</strong>
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
              <Button variant="danger" onClick={resetGame}>Chơi lại</Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
}
