import React, { useEffect, useRef, useState } from 'react';
import { Container, Card, Button, Alert, Modal, ProgressBar, Row, Col } from 'react-bootstrap';

export default function NormieSimulator() {
  const [normalcy, setNormalcy] = useState(100);
  const [realHappiness, setRealHappiness] = useState(90);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('Hãy duy trì vẻ bình thường...');
  const [visibleActions, setVisibleActions] = useState([]);
  const gameLoopRef = useRef(null);

  // Actions that increase normalcy (decrease happiness)
  const normalActions = [
    {
      id: 1,
      label: '😬 Cười xã giao khi sếp kể chuyện nhạt',
      normalcy: 12,
      happiness: -12,
      message: 'Bạn vừa fake laugh pro. Nhưng linh hồn đau...',
      type: 'normal'
    },
    {
      id: 2,
      label: '📸 Đăng ảnh sống ảo lên Story',
      normalcy: 15,
      happiness: -15,
      message: 'Filter + caption sâu cay. Đời thật vẫn buồn.',
      type: 'normal'
    },
    {
      id: 3,
      label: '🙂 Trả lời "Em ổn" khi được hỏi thăm',
      normalcy: 10,
      happiness: -10,
      message: 'Em ổn... Em ổn lắm... (Narrator: Không ổn)',
      type: 'normal'
    },
    {
      id: 4,
      label: '❤️ React tim story crush dù chả thích',
      normalcy: 13,
      happiness: -13,
      message: 'Simp tactics level 100. Tự trọng giảm.',
      type: 'normal'
    },
    {
      id: 5,
      label: '💼 Fake busy trên Slack',
      normalcy: 11,
      happiness: -11,
      message: 'Status: "Đang họp". Thực tế: Xem TikTok.',
      type: 'normal'
    },
    {
      id: 6,
      label: '🤝 Nói "Dạ em hiểu ạ" dù chả hiểu gì',
      normalcy: 14,
      happiness: -14,
      message: 'Gật đầu như con cá, trong đầu toàn dấu hỏi.',
      type: 'normal'
    },
    {
      id: 7,
      label: '👍 Bấm like bài sếp đăng',
      normalcy: 16,
      happiness: -16,
      message: 'Corporate slave đỉnh cao. Liêm sỉ: 0.',
      type: 'normal'
    },
    {
      id: 8,
      label: '🎭 Tỏ vẻ quan tâm đến chuyện của đồng nghiệp',
      normalcy: 12,
      happiness: -12,
      message: 'Gật gù, ừ hử. Trong đầu: "Khi nào về đây?"',
      type: 'normal'
    },
    {
      id: 9,
      label: '🎯 Nói "Mình sẽ cố gắng" với deadline vô lý',
      normalcy: 18,
      happiness: -18,
      message: 'Yes man mode: ON. Sức khỏe tinh thần: Chết.',
      type: 'normal'
    },
    {
      id: 10,
      label: '🌟 Share bài motivational quote lên Facebook',
      normalcy: 13,
      happiness: -13,
      message: '"Sống tích cực!" (Thực tế: Khủng hoảng tuổi 20)',
      type: 'normal'
    },
    {
      id: 21,
      label: '😂 Cười lăn khi xem TikTok bạn thân gửi',
      normalcy: 12,
      happiness: -12,
      message: 'Bạn thân vui vẻ, còn bạn thì không.',
      type: 'normal'
    }
  ];

  // Actions that increase happiness (decrease normalcy)
  const happyActions = [
    {
      id: 11,
      label: '😎 Nói thật cảm nghĩ của mình',
      normalcy: -12,
      happiness: 12,
      message: 'Refreshing! Nhưng giờ người ta nghĩ bạn weird.',
      type: 'happy'
    },
    {
      id: 12,
      label: '🎮 Từ chối đi nhậu để chơi game',
      normalcy: -12,
      happiness: 12,
      message: 'Solo gaming > social obligation. True to yourself!',
      type: 'happy'
    },
    {
      id: 13,
      label: '💤 Ngủ dậy muộn vì mệt thật',
      normalcy: -10,
      happiness: 10,
      message: 'Self-care thật sự. Nhưng đồng nghiệp nhìn lạ.',
      type: 'happy'
    },
    {
      id: 14,
      label: '🎨 Đăng meme dở hơi lên feed',
      normalcy: -15,
      happiness: 15,
      message: 'Cười sảng! Reputation: questionable.',
      type: 'happy'
    },
    {
      id: 15,
      label: '🍕 Ăn một mình thay vì lunch cùng team',
      normalcy: -11,
      happiness: 11,
      message: 'Peaceful meal. Nhưng tối nay sẽ bị gossip.',
      type: 'happy'
    },
    {
      id: 16,
      label: '📱 Seen tin nhắn sếp để nghỉ ngơi',
      normalcy: -16,
      happiness: 16,
      message: 'Mental health >>> work. Nhưng đừng mong thăng chức.',
      type: 'happy'
    },
    {
      id: 17,
      label: '🎭 Bỏ về sớm vì không muốn ở lại',
      normalcy: -13,
      happiness: 13,
      message: 'Đi về đúng giờ là quyền. Nhưng bị dè bỉu.',
      type: 'happy'
    },
    {
      id: 18,
      label: '💬 Nói "không" với yêu cầu vô lý',
      normalcy: -14,
      happiness: 14,
      message: 'Assertive king/queen! Boundary: set. Reputation: weird.',
      type: 'happy'
    },
    {
      id: 19,
      label: '🎵 Nghe nhạc ồn trong giờ làm',
      normalcy: -12,
      happiness: 12,
      message: 'Vibe tốt! Nhưng mọi người nghĩ bạn không tập trung.',
      type: 'happy'
    },
    {
      id: 20,
      label: '🌈 Ăn mặc theo style thật thay vì formal',
      normalcy: -15,
      happiness: 15,
      message: 'Express yourself! HR đang nhìn chằm chằm.',
      type: 'happy'
    },
    
  ];

  const getRandomActions = () => {
    const shuffledNormal = [...normalActions].sort(() => Math.random() - 0.5);
    const shuffledHappy = [...happyActions].sort(() => Math.random() - 0.5);
    return [...shuffledNormal.slice(0, 2), ...shuffledHappy.slice(0, 2)].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    setVisibleActions(getRandomActions());
  }, []);

  useEffect(() => {
    if (gameOver) return;

    gameLoopRef.current = setInterval(() => {
      let ended = false;

      setNormalcy(prev => {
        const newValue = Math.max(0, prev - 0.18);
        if (!ended && newValue <= 0) {
          ended = true;
          setGameOverReason('normalcy');
          setGameOver(true);
        }
        return newValue;
      });

      setRealHappiness(prev => {
        const newValue = Math.max(0, prev - 0.12);
        if (!ended && newValue <= 0) {
          ended = true;
          setGameOverReason('happiness');
          setGameOver(true);
        }
        return newValue;
      });
    }, 100);

    return () => clearInterval(gameLoopRef.current);
  }, [gameOver]);

  const handleAction = (action) => {
    if (gameOver) return;
    setNormalcy(prev => Math.min(100, Math.max(0, prev + action.normalcy)));
    setRealHappiness(prev => Math.max(0, Math.min(100, prev + action.happiness)));
    setCurrentMessage(action.message);
    
    // Shuffle actions after each click
    setVisibleActions(getRandomActions());
  };

  const handleReset = () => {
    setNormalcy(100);
    setRealHappiness(90);
    setGameOver(false);
    setGameOverReason(null);
    setCurrentMessage('Hãy duy trì vẻ bình thường...');
    setVisibleActions(getRandomActions());
  };

  const getNormalcyVariant = () => {
    if (normalcy > 60) return 'success';
    if (normalcy > 30) return 'warning';
    return 'danger';
  };

  const getHappinessVariant = () => {
    if (realHappiness > 60) return 'info';
    if (realHappiness > 30) return 'secondary';
    return 'dark';
  };

  const getNormalcyStatus = () => {
    if (normalcy > 80) return '😎 Hoàn hảo! Xã hội thích bạn!';
    if (normalcy > 60) return '😊 Khá ổn, tiếp tục diễn!';
    if (normalcy > 40) return '😰 Hơi lạ... Cẩn thận!';
    if (normalcy > 20) return '🚨 Nguy hiểm! Đang lộ bản thân!';
    return '💀 SẮP BỊ BẮT!';
  };

  const getHappinessStatus = () => {
    if (realHappiness > 80) return '🤩 Sung sướng thật sự!';
    if (realHappiness > 60) return '🙂 Ổn áp, còn năng lượng!';
    if (realHappiness > 40) return '😐 Bình bình, cố gắng giữ nhịp';
    if (realHappiness > 20) return '😫 Đuối dần, cần sạc lại!';
    return '💔 Kiệt sức cảm xúc!';
  };

  return (
    <Container className="py-5">
      <Card className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-3">🎭 Giả Lập "Người Bình Thường"</h2>
          <p className="text-center text-muted mb-3">
            <small>Michel Foucault • Kiểm soát xã hội • Quy chuẩn hóa con người</small>
          </p>

          <Row className="mb-3">
            <Col md={6}>
              <div className="text-center mb-2">
                <strong style={{ fontSize: '0.9rem' }}>Độ Bình Thường: {normalcy.toFixed(0)}%</strong>
              </div>
              <ProgressBar 
                now={normalcy} 
                variant={getNormalcyVariant()}
                style={{ height: '18px' }}
              />
              <div className="text-center mt-1">
                <small className="text-muted">{getNormalcyStatus()}</small>
              </div>
            </Col>
            <Col md={6}>
              <div className="text-center mb-2">
                <strong style={{ fontSize: '0.9rem' }}>Hạnh Phúc Thật: {realHappiness.toFixed(0)}%</strong>
              </div>
              <ProgressBar 
                now={realHappiness} 
                variant={getHappinessVariant()}
                style={{ height: '18px' }}
              />
              <div className="text-center mt-1">
                <small className="text-muted">{getHappinessStatus()}</small>
              </div>
            </Col>
          </Row>

          <Alert variant="light" className="text-center mb-4 py-2" style={{ border: '1px solid #dee2e6' }}>
            <em style={{ fontSize: '0.95rem' }}>"{currentMessage}"</em>
          </Alert>

          <Row className="g-3 mb-4">
            {visibleActions.map(action => (
              <Col xs={12} md={6} key={action.id}>
                <Card 
                  className="h-100 shadow-sm"
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: `2px solid ${action.type === 'normal' ? '#0d6efd' : '#198754'}`
                  }}
                  onClick={() => handleAction(action)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <Card.Body className="p-3">
                    <div style={{ fontSize: '1.05rem', lineHeight: '1.2', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {action.label}
                    </div>
                    <div 
                      className="d-flex justify-content-start align-items-center pt-2" 
                      style={{ borderTop: '1px solid #e9ecef', fontSize: '1rem', gap: '10px' }}
                    >
                      {action.type === 'normal' ? (
                        <span style={{ color: '#0d6efd' }}>
                          <strong>+{action.normalcy}</strong> Bình thường
                        </span>
                      ) : (
                        <span style={{ color: '#198754' }}>
                          <strong>+{action.happiness}</strong> Vui
                        </span>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center">
            
            <Button variant="danger" onClick={handleReset}>
              🔄 Reset
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal 
        show={gameOver} 
        onHide={() => {}} 
        backdrop="static" 
        keyboard={false} 
        centered
        size="lg"
      >
        <Modal.Header style={{ backgroundColor: '#8B0000', color: 'white' }}>
          <Modal.Title>
            {gameOverReason === 'happiness' ? '💔 KIỆT SỨC CẢM XÚC!' : '🚨 BỊ PHÁT HIỆN!'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center" style={{ backgroundColor: '#FFE4E4' }}>          
          <p className="mt-3" style={{ fontSize: '1.2rem', fontStyle: 'italic' }}>
            <strong>
              {gameOverReason === 'happiness'
                ? 'Bạn đã kiệt sức. Vui vẻ thật chạm đáy.'
                : 'Bị phát hiện rồi! Mời vào trại thương điên.'}
            </strong>
          </p>
          <p className="text-muted mt-3">
            {gameOverReason === 'happiness'
              ? 'Bạn đã diễn quá nhiều mà quên mất bản thân mình thực sự cần gì.'
              : 'Bạn đã không thể duy trì vẻ "bình thường" của mình. Xã hội phát hiện bạn không phải "normie" đúng nghĩa.'}
          </p>
          <div className="mt-3 p-3" style={{ backgroundColor: 'white', borderRadius: '8px' }}>
            <strong>Độ Bình Thường cuối cùng:</strong> {normalcy.toFixed(0)}%<br />
            <strong>Hạnh Phúc Thật còn lại:</strong> {realHappiness.toFixed(0)}%
          </div>
          
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="danger" onClick={handleReset}>
            🔄 Thử diễn lại lần nữa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
