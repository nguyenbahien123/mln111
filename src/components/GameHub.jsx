import React, { useState } from 'react';
import { Container, Card, Button, Alert, Row, Col, Modal } from 'react-bootstrap';
import QuoteCollector from './QuoteCollector';
import DinoPhilosopher from './DinoPhilosopher';
import ZodiacGame from './ZodiacGame';
import FlappyPhilosopher from './FlappyPhilosopher';
import CyberWoodenFish from './CyberWoodenFish';
import ZenoRace from './ZenoRace';
import BuridanDonkey from './BuridanDonkey';
import CommunistSnake from './CommunistSnake';
import NormieSimulator from './NormieSimulator';

export default function GameHub() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);

  const handleBackClick = () => {
    setShowExitModal(true);
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    setSelectedGame(null);
  };

  if (selectedGame) {
    return (
      <Container className="py-5">
        <Button
          variant="secondary"
          onClick={handleBackClick}
          className="mb-4"
        >
          ← Quay lại danh sách trò chơi
        </Button>
        {selectedGame === 'collector' && <QuoteCollector />}
        {selectedGame === 'dino' && <DinoPhilosopher />}
        {selectedGame === 'zodiac' && <ZodiacGame />}
        {selectedGame === 'flappy' && <FlappyPhilosopher />}
        {selectedGame === 'fish' && <CyberWoodenFish />}
        {selectedGame === 'zeno' && <ZenoRace />}
        {selectedGame === 'buridan' && <BuridanDonkey />}
        {selectedGame === 'snake' && <CommunistSnake />}
        {selectedGame === 'normie' && <NormieSimulator />}

        <Modal show={showExitModal} onHide={() => setShowExitModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận thoát</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn có chắc muốn quay lại danh sách trò chơi? Tiến trình sẽ bị mất.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowExitModal(false)}>
              Tiếp tục chơi
            </Button>
            <Button variant="danger" onClick={handleConfirmExit}>
              Thoát
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center text-primary">🎮 Trò Chơi Triết Học</h1>
      <p className="text-center text-muted mb-5">Chọn một trò chơi để chơi</p>

      <Row className="g-4">
        <Col md={6} lg={4} xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary">🎮 Collector Triết Học</Card.Title>
              <Card.Text>
                Di chuyển để ăn các quote của các nhà triết học! Trò chơi càng lâu càng khó.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setSelectedGame('collector')}
                className="w-100"
              >
                Chơi →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary">🦖 Dino Triết Học</Card.Title>
              <Card.Text>
                Nhảy qua các chướng ngại vật! Mỗi 10 điểm sẽ nhận được một câu nói khôn ngoan.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setSelectedGame('dino')}
                className="w-100"
              >
                Chơi →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary">🔮 Chiêm Tinh - Tử Vi</Card.Title>
              <Card.Text>
                Khám phá cung hoàng đạo, con giáp và ngũ hành của bạn qua ngày sinh.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setSelectedGame('zodiac')}
                className="w-100"
              >
                Xem ngay →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary">🐦 Flappy Triết Học</Card.Title>
              <Card.Text>
                Bay qua các cột chướng ngại! Mỗi 3 điểm nhận một câu triết lý.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setSelectedGame('flappy')}
                className="w-100"
              >
                Chơi →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary">🥁 Mõ Kỹ Thuật Số</Card.Title>
              <Card.Text>
                Gõ mõ gỗ để tích luỹ công đức. Sự tĩnh tâm và nhân quả. Tích tiểu thành đại.
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setSelectedGame('fish')}
                className="w-100"
              >
                Gõ mõ →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary">🫏 Con Lừa Buridan</Card.Title>
              <Card.Text>
Một con lừa đói đứng giữa 2 bó cỏ ngon. Vì không biết chọn bên nào nên nó chết đói.              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setSelectedGame('buridan')}
                className="w-100"
              >
                Chơi →
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary">🏁 Nghịch Lý Zeno</Card.Title>
              <Card.Text>
                Mỗi lần chỉ đi 1/2 quãng đường còn lại. Tiến độ: 50%, 75%, 87.5%... không thể tới đích!
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setSelectedGame('zeno')}
                className="w-100"
              >
                Chơi →
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary">🐍 Rắn Cộng Sản</Card.Title>
              <Card.Text>
                Độ dài đại diện cho tuổi tác. Ăn táo để tăng "tài sản toàn dân"!
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setSelectedGame('snake')}
                className="w-100"
              >
                Chơi →
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4} xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary">🎭 Giả Lập "Người Bình Thường"</Card.Title>
              <Card.Text>
                Foucault: "Bình thường" là kiến tạo xã hội. Diễn để không bị loại bỏ!
              </Card.Text>
              <Button
                variant="primary"
                onClick={() => setSelectedGame('normie')}
                className="w-100"
              >
                Diễn đi →
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
