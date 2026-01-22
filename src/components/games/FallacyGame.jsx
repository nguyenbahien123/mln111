import React, { useState } from 'react';
import { Container, Card, Button, Alert, Row, Col } from 'react-bootstrap';

const statements = [
  {
    id: 1,
    text: 'Tất cả những người thành công đều làm việc chăm chỉ. Bạn chăm chỉ. Vậy bạn sẽ thành công.',
    fallacies: [
      { id: 'a', name: 'Công kích cá nhân', correct: false },
      { id: 'b', name: 'Khái niệm trùng đặc (Affirming Consequent)', correct: true },
      { id: 'c', name: 'Cơ sở sai lệch', correct: false },
      { id: 'd', name: 'Lệch vạch (Straw man)', correct: false },
    ],
  },
  {
    id: 2,
    text: 'Nếu trời mưa thì đất ướt. Đất ướt. Vậy trời mưa.',
    fallacies: [
      { id: 'a', name: 'Khái niệm trùng đặc (Affirming Consequent)', correct: true },
      { id: 'b', name: 'Công kích cá nhân', correct: false },
      { id: 'c', name: 'Cơ sở sai lệch', correct: false },
      { id: 'd', name: 'Lệch vạch (Straw man)', correct: false },
    ],
  },
  {
    id: 3,
    text: 'Giáo sư nói rằng khoa học là quan trọng, nhưng anh ta không phải là nhà khoa học, nên khoa học không quan trọng.',
    fallacies: [
      { id: 'a', name: 'Lệch vạch (Straw man)', correct: false },
      { id: 'b', name: 'Công kích cá nhân (Ad hominem)', correct: true },
      { id: 'c', name: 'Cơ sở sai lệch', correct: false },
      { id: 'd', name: 'Khái niệm trùng đặc', correct: false },
    ],
  },
];

export default function FallacyGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (fallacyId) => {
    const correct = statements[currentIndex].fallacies.find(
      (f) => f.id === fallacyId
    ).correct;

    if (correct) {
      setScore(score + 1);
    }
    setAnswered(fallacyId);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < statements.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(null);
      setShowResult(false);
    } else {
      handleReset();
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(null);
    setShowResult(false);
  };

  const statement = statements[currentIndex];
  const correctFallacy = statement.fallacies.find((f) => f.correct);

  return (
    <Container className="py-5">
      <h2 className="text-center text-primary mb-5">🎭 Vua Ngụy Biện</h2>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">Phát hiện ngụy biện logic:</h5>
          <Alert variant="light" className="mb-4">
            <p className="fs-5 mb-0">
              <em>"{statement.text}"</em>
            </p>
          </Alert>

          <p className="text-muted mb-4">
            Câu {currentIndex + 1} / {statements.length} | Điểm: {score}
          </p>

          {!showResult ? (
            <Row className="g-3">
              {statement.fallacies.map((fallacy) => (
                <Col md={6} key={fallacy.id}>
                  <Button
                    variant="outline-primary"
                    size="lg"
                    onClick={() => handleAnswer(fallacy.id)}
                    className="w-100 py-3"
                    style={{ textAlign: 'left' }}
                  >
                    <div className="fw-bold">{fallacy.name}</div>
                  </Button>
                </Col>
              ))}
            </Row>
          ) : (
            <div>
              <Alert
                variant={
                  statement.fallacies.find((f) => f.id === answered).correct
                    ? 'success'
                    : 'danger'
                }
              >
                <h5 className="mb-3">
                  {statement.fallacies.find((f) => f.id === answered).correct
                    ? '✓ Chính xác!'
                    : '✗ Sai rồi!'}
                </h5>
                <p>
                  <strong>Đáp án đúng:</strong> {correctFallacy.name}
                </p>
                <p>
                  {correctFallacy.name === 'Công kích cá nhân (Ad hominem)'
                    ? 'Lập luận này tấn công người nói thay vì lập luận của họ.'
                    : correctFallacy.name === 'Khái niệm trùng đặc (Affirming Consequent)'
                    ? 'Chỉ vì một hệ quả xảy ra không có nghĩa là cơ sở phải đúng.'
                    : 'Đây là một ngụy biện logic phổ biến.'}
                </p>
              </Alert>

              <Button
                variant="primary"
                onClick={handleNext}
                className="w-100 py-2"
              >
                {currentIndex === statements.length - 1 ? '🔄 Chơi lại' : 'Tiếp theo →'}
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
