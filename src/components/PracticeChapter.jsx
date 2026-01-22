import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { questionAPI, chapterAPI } from '../services/api';
import './QuizChapter.css';

export default function PracticeChapter() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [practiceFinished, setPracticeFinished] = useState(false);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    fetchData();
  }, [chapterId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [chapRes, questRes] = await Promise.all([
        chapterAPI.getById(chapterId),
        questionAPI.getByChapterId(chapterId),
      ]);
      setChapter(chapRes.data);
      setQuestions(questRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (letter) => {
    if (answered) return; // Không cho chọn lại
    
    setSelectedAnswer(letter);
    setAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      // Tính số câu đúng
      let correctCount = 0;
      questions.forEach((q, idx) => {
        const userAnswer = (idx === currentIndex) ? selectedAnswer : null;
        const correctAnswer = q.correctAnswer?.toLowerCase();
        if (userAnswer && userAnswer.toLowerCase() === correctAnswer) {
          correctCount++;
        }
      });
      setStats({ correct: correctCount, total: questions.length });
      setPracticeFinished(true);
    }
  };

  const handleBackClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmExit = () => {
    setShowConfirmModal(false);
    navigate('/learning');
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  if (practiceFinished) {
    return <PracticeResult stats={stats} onBackClick={() => navigate('/learning')} />;
  }

  if (questions.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="info">Chương này chưa có câu hỏi.</Alert>
        <Button onClick={() => navigate('/learning')} variant="secondary">
          ← Quay lại
        </Button>
      </Container>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer?.toLowerCase() === currentQuestion.correctAnswer?.toLowerCase();

  return (
    <Container className="py-5">
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-primary mb-0">{chapter?.title} - Ôn tập</h2>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleBackClick}
          >
            ← Quay lại
          </Button>
        </div>
        <p className="text-muted">
          Câu {currentIndex + 1} / {questions.length}
        </p>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-4">{currentQuestion.content}</h5>

          <div className="mb-4">
            {['optionA', 'optionB', 'optionC', 'optionD'].map((option, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isSelected = selectedAnswer === letter;
              const isCorrectOption = letter.toLowerCase() === currentQuestion.correctAnswer?.toLowerCase();

              let variant = 'outline-primary';
              if (answered) {
                if (isCorrectOption) {
                  variant = 'success';
                } else if (isSelected && !isCorrect) {
                  variant = 'danger';
                }
              } else if (isSelected) {
                variant = 'primary';
              }

              return (
                <div key={letter} className="mb-2">
                  <Button
                    variant={variant}
                    className="w-100 text-start"
                    onClick={() => handleAnswer(letter)}
                    disabled={answered}
                  >
                    <strong>{letter}.</strong> {currentQuestion[option]}
                  </Button>
                </div>
              );
            })}
          </div>

          {answered && (
            <Alert variant={isCorrect ? 'success' : 'danger'} className="mb-4">
              {isCorrect ? (
                <div>
                  <strong>✓ Chính xác!</strong> Bạn đã chọn đúng đáp án.
                </div>
              ) : (
                <div>
                  <strong>✗ Sai rồi!</strong> Đáp án đúng là: <strong>{currentQuestion.correctAnswer?.toUpperCase()}</strong>
                </div>
              )}
            </Alert>
          )}

          <div className="d-flex gap-2 justify-content-center">
            {answered && (
              <Button
                variant="primary"
                onClick={handleNext}
                size="lg"
              >
                {currentIndex === questions.length - 1 ? 'Xem kết quả →' : 'Tiếp tục →'}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Confirm Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thoát</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn thoát? Tiến độ ôn tập sẽ không được lưu.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Tiếp tục ôn tập
          </Button>
          <Button variant="danger" onClick={handleConfirmExit}>
            Thoát
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

function PracticeResult({ stats, onBackClick }) {
  const percentage = Math.round((stats.correct / stats.total) * 100);

  return (
    <Container className="py-5">
      <Card className="shadow" style={{ backgroundColor: '#ccffcc' }}>
        <Card.Body className="text-center">
          <h2 className="mb-4">🎓 Kết quả ôn tập</h2>
          <div className="display-1 text-primary mb-4">{stats.correct}/{stats.total}</div>
          <p className="fs-5 mb-4">
            Bạn đã trả lời đúng <strong>{stats.correct} / {stats.total}</strong> câu ({percentage}%)
          </p>
          <Button onClick={onBackClick} variant="primary" size="lg">
            ← Quay lại
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
