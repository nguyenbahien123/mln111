import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, ProgressBar } from 'react-bootstrap';

export default function ZenoRace() {
  const [progress, setProgress] = useState(0); // exact value in [0,100)
  const [steps, setSteps] = useState(0);
  const [message, setMessage] = useState(null);
  const trackWidth = 600; // px
  const MIN_GAP = 120; // minimum spacing between runner and turtle

  const messages = [
    (remaining) => `Cố lên em, còn ${remaining}% nữa thôi!`,
    () => 'Toán học bảo em không bao giờ về đích đâu 😅',
    () => 'Achilles đang đuổi kịp con rùa... gần như vậy 🏃🐢',
    () => 'Đi thêm nửa đường nữa nhé! 1/2, 1/4, 1/8...',
    () => 'Giới hạn ε → 0, nhưng 100% thì không tới 🌀',
    () => 'Về đích? Để mai tính nha 😎',
    (remaining) => `Còn xíu xiu: ${remaining}% thôi á 🤏`,
    () => 'Chuẩn bị ăn mừng... nhưng chưa đâu 🤭',
    () => 'Con rùa nói: chill đi bro 🐢',
    () => 'Tiến độ nhanh như deadline, mà vẫn thiếu 0.000001% ⏳',
    () => 'Đoạn cuối là vô cực nha 🤌',
    () => 'Thêm nửa đường nữa thôi, easyyyyy 💪',
    () => 'Đỉnh của chóp... hụt một xíu 😝',
    () => 'Sắp 100% rồi (ở đa vũ trụ) 🌀',
    () => 'Thắng lợi tinh thần là đủ rồi 🏆',
    () => '99.99999% là vibe ✨',
    () => 'Kiên nhẫn level: Achilles 🏃',
    () => 'Zeno: tôi hổng cho về đích đâu 😈'
  ];

  const displayValue = Math.min(progress, 99.99999);
  const finishLeft = trackWidth - 28;
  const runnerMarginFromFinish = 24; // allow runner to get very close to flag
  const runnerMax = Math.max(0, finishLeft - runnerMarginFromFinish);
  const runnerLeft = Math.max(0, Math.min(runnerMax, Math.round((displayValue / 100) * runnerMax)));
  const turtleLeft = Math.min(trackWidth - 32, runnerLeft + MIN_GAP);

  const handleStep = () => {
    const next = progress + (100 - progress) / 2;
    const remaining = (100 - next).toFixed(6);
    setProgress(next);
    setSteps((s) => s + 1);
    const m = messages[Math.floor(Math.random() * messages.length)];
    setMessage(m(remaining));
  };

  const handleReset = () => {
    setProgress(0);
    setSteps(0);
    setMessage(null);
  };

  useEffect(() => {
    // keyboard shortcut
    const onKey = (e) => { if (e.code === 'Space') { e.preventDefault(); handleStep(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [progress]);

  return (
    <Container className="py-5">
      <Card className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-3">🏁 Nghịch Lý Zeno: Cuộc Đua Vô Tận</h2>
          <p className="text-center text-muted mb-3">
            <small>Achilles và con rùa • Luôn đi nửa quãng đường còn lại</small>
          </p>

          {message && (
            <Alert variant="warning" className="text-center mb-3">{message}</Alert>
          )}

          <div className="mb-3">
            <div className="text-center mb-2">
              <strong>Tiến độ</strong> {displayValue.toFixed(5)}%
            </div>
            <ProgressBar now={displayValue} variant={displayValue > 75 ? 'success' : 'info'} animated className="mb-3" />
          </div>

          <div className="text-center mb-3">
            <div className="d-flex justify-content-center mb-2">
              <div style={{ position: 'relative', width: trackWidth, height: 60 }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '3px solid #333' }} />
                <span
                  style={{
                    position: 'absolute',
                    left: runnerLeft,
                    top: -6,
                    fontSize: '1.5rem',
                    transform: 'scaleX(-1)',
                    transition: 'left 0.12s ease-out'
                  }}
                >
                  🏃
                </span>
                <span style={{ position: 'absolute', left: trackWidth - 28, top: -14, fontSize: '1.6rem' }}>🏁</span>
                <span
                  style={{
                    position: 'absolute',
                    left: turtleLeft,
                    top: 30,
                    fontSize: '1.4rem',
                    transform: 'scaleX(-1)',
                    transition: 'left 0.12s ease-out'
                  }}
                >
                  🐢
                </span>
              </div>
            </div>
            <Button variant="primary" onClick={handleStep} className="me-2">
              Bước tiếp 1/2 quãng đường
            </Button>
            <Button variant="secondary" onClick={handleReset}>
              Reset
            </Button>
          </div>

          <div className="text-center text-muted">
            <small>Vô tri: {steps} lần bấm • Nhấn Space để bước tiếp</small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
