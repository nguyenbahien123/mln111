import React, { useState, useEffect } from 'react';
import { Container, Card, Button, ProgressBar, Alert } from 'react-bootstrap';

export default function SisyphusClicker() {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Bắt đầu đẩy tảng đá...');
  const [clicks, setClicks] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleClick = () => {
    let newProgress = progress + 10;

    // 50% chance đá sẽ lăn xuống khi gần đầy
    if (newProgress > 70 && Math.random() < 0.5) {
      newProgress = 0;
      setMessage('💔 Đá lăn xuống! Đời là bể khổ... Hãy cố lên!');
      setClicks(0);
    } else if (newProgress >= 100) {
      newProgress = 100;
      setMessage('🎉 Bạn đã đẩy tảng đá lên đỉnh! Nhưng Sisyphus vẫn phải tiếp tục...');
      setGameOver(true);
    } else {
      setMessage(`Đã đẩy được ${newProgress}%... Hãy tiếp tục!`);
    }

    setProgress(Math.min(newProgress, 100));
    setClicks(clicks + 1);
  };

  const handleReset = () => {
    setProgress(0);
    setClicks(0);
    setMessage('Bắt đầu đẩy tảng đá...');
    setGameOver(false);
  };

  return (
    <Container className="py-5">
      <h2 className="text-center text-primary mb-5">🪨 Sisyphus Clicker</h2>

      <Card className="shadow-sm mb-4">
        <Card.Body className="text-center">
          <div style={{ fontSize: '80px' }} className="mb-4">
            🪨
          </div>

          <div className="mb-4">
            <ProgressBar now={progress} label={`${progress}%`} className="mb-3" />
            <p className="text-muted">Số lần đẩy: {clicks}</p>
          </div>

          <h5 className="mb-4">{message}</h5>

          <div className="d-flex gap-2 justify-content-center">
            <Button
              variant="success"
              size="lg"
              onClick={handleClick}
              disabled={gameOver}
              className="px-5"
            >
              ✊ Đẩy tảng đá
            </Button>
            {gameOver && (
              <Button
                variant="primary"
                size="lg"
                onClick={handleReset}
              >
                🔄 Chơi lại
              </Button>
            )}
          </div>

          {gameOver && (
            <Alert variant="success" className="mt-4">
              <p>
                <strong>Triết lý Sisyphus:</strong> Ngay cả trong tuyệt vọng, Sisyphus vẫn cố gắng. 
                Bạn cũng vậy - hãy tìm niềm vui trong chính quá trình, không chỉ kết quả.
              </p>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
