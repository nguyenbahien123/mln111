import React, { useEffect, useRef, useState } from 'react';
import { Container, Card, Button, Alert, Modal } from 'react-bootstrap';

export default function CommunistSnake() {
  const canvasRef = useRef(null);
  const wealthAlertRef = useRef(null);
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    sharedWealth: 0,
    gameOver: false,
    speed: 100 // milliseconds per tick
  });

  const [sharedWealth, setSharedWealth] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(100);
  const [message, setMessage] = useState('Bắt đầu cuộc cách mạng...');
  const gameLoopRef = useRef(null);

  const GRID_SIZE = 20;
  const CANVAS_WIDTH = 400;
  const CANVAS_HEIGHT = 400;
  const CELL_SIZE = CANVAS_WIDTH / GRID_SIZE;

  const getMessageByWealth = (wealth) => {
    const messages = {
      0: 'Bắt đầu cuộc cách mạng...',
      10: 'Dân tộc chúng ta đang thức tỉnh 🌅',
      30: 'Sức mạnh của tập thể! 💪',
      50: 'Xã hội chủ nghĩa đang hình thành 🚀',
      70: 'Sự bình đẳng bắt đầu rõ ràng ✨',
      90: 'Địa ngục tư bản sụp đổ! 💥',
      130: 'CNXH toàn cầu sắp tới! 🌍',
      170: 'Từng người công dân mới của CNXH! 🏆',
      210: 'Thế giới không có giai cấp nữa! 👑'
    };

    let currentMessage = 'Bắt đầu cuộc cách mạng...';
    for (const [threshold, msg] of Object.entries(messages).reverse()) {
      if (wealth >= parseInt(threshold)) {
        currentMessage = msg;
        break;
      }
    }
    return currentMessage;
  };

  const getSacrificeMessage = (wealth) => {
    const sacrificeMessages = {
      0: 'Một bước nhỏ trên con đường dài.',
      20: 'Công lao bạn sẽ được ghi nhớ.',
      40: 'Bạn đã đóng góp cho tương lai tươi sáng.',
      60: 'Linh hồn anh hùng sẽ bất tử trong lịch sử.',
      80: 'Hy sinh cao cả vì đại cuộc cách mạng!',
      110: 'Một chiến sĩ giải phóng vĩ đại đã ngã tại trận!',
      150: 'Bạn là một huyền thoại! Chiến sĩ vô danh, công lao vô hạn! 🚩',
      190: 'Anh hùng! Bạn đã sáng suốt cách mạng với máu của mình! 👨‍🎖️',
      220: 'BẤT HỦ! Tên bạn sẽ được khắc vào tấm bia vinh quang của CNXH! ⭐'
    };

    let currentMessage = 'Một bước nhỏ trên con đường dài.';
    for (const [threshold, msg] of Object.entries(sacrificeMessages).reverse()) {
      if (wealth >= parseInt(threshold)) {
        currentMessage = msg;
        break;
      }
    }
    return currentMessage;
  };

  const generateFood = (snake) => {
    let newFood;
    let validPosition = false;
    while (!validPosition) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      validPosition = !snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') {
        if (state.direction.y === 0) state.nextDirection = { x: 0, y: -1 };
        e.preventDefault();
      }
      if (key === 'arrowdown' || key === 's') {
        if (state.direction.y === 0) state.nextDirection = { x: 0, y: 1 };
        e.preventDefault();
      }
      if (key === 'arrowleft' || key === 'a') {
        if (state.direction.x === 0) state.nextDirection = { x: -1, y: 0 };
        e.preventDefault();
      }
      if (key === 'arrowright' || key === 'd') {
        if (state.direction.x === 0) state.nextDirection = { x: 1, y: 0 };
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = () => {
      if (state.gameOver) return;

      state.direction = state.nextDirection;

      // Move snake head
      const head = state.snake[0];
      const newHead = {
        x: (head.x + state.direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + state.direction.y + GRID_SIZE) % GRID_SIZE
      };

      // Check collision with self
      if (state.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        state.gameOver = true;
        setGameOver(true);
        return;
      }

      state.snake.unshift(newHead);

      // Check food collision
      if (newHead.x === state.food.x && newHead.y === state.food.y) {
        // Increase shared wealth instead of snake length
        state.sharedWealth += 10;
        setSharedWealth(state.sharedWealth);
        setMessage(getMessageByWealth(state.sharedWealth));

        // Increase speed (progress toward communism)
        state.speed = Math.max(40, state.speed - 3);
        setGameSpeed(state.speed);

        // Generate new food
        state.food = generateFood(state.snake);
      } else {
        // Don't grow the snake (tư lợi is eliminated)
        state.snake.pop();
      }

      // Draw game
      ctx.fillStyle = '#2C3E50';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw grid
      ctx.strokeStyle = '#34495E';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        const pos = i * CELL_SIZE;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, CANVAS_HEIGHT);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(CANVAS_WIDTH, pos);
        ctx.stroke();
      }

      // Draw food (red apple - production material)
      ctx.fillStyle = '#E74C3C';
      ctx.fillRect(
        state.food.x * CELL_SIZE + 1,
        state.food.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );

      // Draw snake (red for communist)
      ctx.fillStyle = '#C0392B';
      state.snake.forEach((segment, index) => {
        const opacity = 1 - index * 0.05; // Fade out tail
        ctx.globalAlpha = Math.max(0.3, opacity);
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
      });
      ctx.globalAlpha = 1;

      // Draw head highlight
      const head2 = state.snake[0];
      ctx.fillStyle = '#FF6B6B';
      ctx.fillRect(
        head2.x * CELL_SIZE + 2,
        head2.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );
    };

    gameLoopRef.current = setInterval(gameLoop, state.speed);

    return () => {
      clearInterval(gameLoopRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameSpeed]);

  useEffect(() => {
    if (sharedWealth > 0 && wealthAlertRef.current && canvasRef.current) {
      const alertRect = wealthAlertRef.current.getBoundingClientRect();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const alertTop = alertRect.top + scrollTop;
      const canvasBottom = canvasRect.bottom + scrollTop;
      const viewportHeight = window.innerHeight;
      
      const totalHeight = canvasBottom - alertTop;
      const targetScrollTop = totalHeight > viewportHeight 
        ? alertTop - 20
        : alertTop - (viewportHeight - totalHeight) / 2;
      
      window.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth'
      });
    }
  }, [sharedWealth]);

  const handleReset = () => {
    gameStateRef.current = {
      snake: [{ x: 10, y: 10 }],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      food: { x: 15, y: 15 },
      sharedWealth: 0,
      gameOver: false,
      speed: 100
    };
    setSharedWealth(0);
    setGameOver(false);
    setGameSpeed(100);
    setMessage('Bắt đầu cuộc cách mạng...');
  };

  return (
    <Container className="py-5">
      <Card className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-3">🐍 Rắn Cộng Sản</h2>
          <p className="text-center text-muted mb-3">
            <small>Chủ nghĩa Mác - Lênin • Phân phối lại của cải • Tiến lên CNXH</small>
          </p>

          <Alert ref={wealthAlertRef} variant="info" className="text-center mb-3">
            <strong>Bạn đã cống hiến </strong> <span style={{ fontSize: '1.2rem', color: '#C0392B' }}>{sharedWealth}</span><strong> điểm tài sản cho toàn dân</strong>
            <br />
          </Alert>

          <Alert variant="success" className="text-center mb-3">
            <strong>{message}</strong>
          </Alert>

          <div className="d-flex justify-content-center mb-3">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              style={{
                border: '3px solid #C0392B',
                borderRadius: '8px',
                backgroundColor: '#2C3E50',
                boxShadow: '0 0 15px rgba(192, 57, 43, 0.5)'
              }}
            />
          </div>

          <div className="text-center">
            <p className="text-muted mb-3">
              <small>Điều khiển: Mũi tên hoặc WASD • Ăn tư liệu sản xuất (táo đỏ) để tăng tài sản toàn dân</small>
            </p>
            <Button variant="danger" onClick={handleReset} className="me-2">
              {gameOver ? '🔄 Chơi lại' : '🔄 Reset'}
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={gameOver} onHide={() => {}} backdrop="static" keyboard={false} centered>
        <Modal.Header style={{ backgroundColor: '#C0392B', color: 'white' }}>
          <Modal.Title>⚡ Hy Sinh Vì Đại Cuộc</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>
            <strong>Tài sản toàn dân cuối cùng:</strong> <span style={{ fontSize: '1.5rem', color: '#C0392B' }}>{sharedWealth}</span>
          </p>
          <p className="text-muted" style={{ fontSize: '1.1rem', fontStyle: 'italic', marginTop: '1.5rem' }}>
            "{getSacrificeMessage(sharedWealth)}" 🚩
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="danger" onClick={handleReset}>Chơi lại</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
