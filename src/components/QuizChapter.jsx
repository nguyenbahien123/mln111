import React, { useState, useEffect } from 'react';
import { Container, Card, Button, ProgressBar, Alert, Spinner, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { questionAPI, chapterAPI } from '../services/api';
import './QuizChapter.css';

export default function QuizChapter() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState({ correctCount: 0, total: 0, percentage: 0 });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [answersDetail, setAnswersDetail] = useState([]);

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
      // Xáo trộn các options cho mỗi câu hỏi
      const shuffled = questRes.data.map(q => {
        const options = [
          { letter: 'A', text: q.optionA },
          { letter: 'B', text: q.optionB },
          { letter: 'C', text: q.optionC },
          { letter: 'D', text: q.optionD }
        ];
        // Xáo trộn vị trí
        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
        return { ...q, shuffledOptions };
      });
      setShuffledQuestions(shuffled);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIndex]: answer,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    // Tính điểm và thu thập chi tiết đáp án
    let correctCount = 0;
    const details = [];
    
    questions.forEach((q, idx) => {
      const userAnswer = selectedAnswers[idx]?.toLowerCase();
      const correctAnswer = q.correctAnswer?.toLowerCase();
      const isCorrect = userAnswer === correctAnswer;
      
      if (isCorrect) {
        correctCount++;
      }
      
      details.push({
        questionIndex: idx + 1,
        content: q.content,
        userAnswer: userAnswer || 'Không trả lời',
        correctAnswer: correctAnswer,
        isCorrect,
        optionA: q.optionA,
        optionB: q.optionB,
        optionC: q.optionC,
        optionD: q.optionD
      });
    });
    
    const percentage = Math.round((correctCount / questions.length) * 100);
    setScore({ correctCount, total: questions.length, percentage });
    setAnswersDetail(details);
    setQuizFinished(true);
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

  if (quizFinished) {
    return <QuizResult score={score} answersDetail={answersDetail} onBackClick={() => navigate('/learning')} />;
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
  const currentShuffledQuestion = shuffledQuestions[currentIndex];
  const answered = selectedAnswers[currentIndex];

  return (
    <Container className="py-5">
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-primary mb-0">{chapter?.title}</h2>
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
        <ProgressBar now={((currentIndex + 1) / questions.length) * 100} className="mb-3" />
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          <h5 className="mb-4">{currentQuestion.content}</h5>

          <div className="mb-4">
            {currentShuffledQuestion?.shuffledOptions?.map((option) => {
              const isSelected = answered === option.letter;

              return (
                <div key={option.letter} className="mb-2">
                  <Button
                    variant={isSelected ? 'primary' : 'outline-primary'}
                    className="w-100 text-start"
                    onClick={() => handleAnswer(option.letter)}
                  >
                    <strong>{option.letter}.</strong> {option.text}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="d-flex gap-2 justify-content-between">
            <Button
              variant="secondary"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              ← Câu trước
            </Button>

            {currentIndex === questions.length - 1 ? (
              <Button variant="success" onClick={handleSubmit} disabled={!answered}>
                ✓ Nộp bài
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!answered}
              >
                Câu tiếp →
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
          Bạn có chắc chắn muốn thoát? Tiến độ bài thi sẽ không được lưu.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Tiếp tục làm bài
          </Button>
          <Button variant="danger" onClick={handleConfirmExit}>
            Thoát
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

function QuizResult({ score, answersDetail, onBackClick }) {
  const [showReview, setShowReview] = useState(false);
  
  let message = '';
  let backgroundColor = '';

  const percentage = score.percentage;

  if (percentage < 10) {
    message = "Em ơi... anh không biết nói gì cả. 😭 Anh sợ con người em rồi đấy!";
    backgroundColor = '#ffaaaa';
  } else if (percentage < 20) {
    message = "Em yếu quá. Anh chịu không nổi! 😢 Chép phạt 100 lần 'Tôi yêu triết học' nhé!";
    backgroundColor = '#ffbbbb';
  } else if (percentage < 30) {
    message = "Thôi thôi, em cần ôn lại từ đầu rồi. 😔 Anh sẽ giúp em mà!";
    backgroundColor = '#ffcccc';
  } else if (percentage < 40) {
    message = "Ặc! Cũng không tệ lắm. Cố lên em ơi! 😐 Chỉ cần thêm chút nữa thôi!";
    backgroundColor = '#ffd699';
  } else if (percentage < 50) {
    message = "Em làm sai thế này là do anh chiều em quá đúng không? 😕 Hãy thử lại nha!";
    backgroundColor = '#ffe6cc';
  } else if (percentage < 60) {
    message = "Tạm được! Nhưng chưa hết 'nợ' của em đâu. 😏 Cố gắng thêm chút nữa!";
    backgroundColor = '#ffffcc';
  } else if (percentage < 70) {
    message = "Khá tốt đấy! Anh thấy em đang cố gắng rồi. 😊 Chỉ cần thêm tí nữa!";
    backgroundColor = '#ffffdd';
  } else if (percentage < 80) {
    message = "Cũng tạm được. Nhưng chưa đủ trình làm 'nóc nhà' của anh đâu. 💪 Cố lên!";
    backgroundColor = '#f0ffcc';
  } else if (percentage < 90) {
    message = "Rất tốt! Em đang trở nên thông minh rồi. 🌟 Anh tự hào về em!";
    backgroundColor = '#e6ffcc';
  } else {
    message = "Tuyệt vời! Em đúng là ngoại lệ của anh. ✨ 10 điểm về chỗ! Anh yêu em! 💕";
    backgroundColor = '#ccffcc';
  }

  if (showReview) {
    return <AnswerReview answersDetail={answersDetail} onBack={() => setShowReview(false)} onBackToMain={() => onBackClick()} />;
  }

  return (
    <Container className="py-5">
      <Card className="shadow" style={{ backgroundColor }}>
        <Card.Body className="text-center">
          <h2 className="mb-4"> Kết quả bài thi</h2>
          <div className="display-1 text-primary mb-4">{score.percentage}%</div>
          <p className="fs-4 mb-3">
            <strong>Đúng {score.correctCount} / {score.total} câu</strong>
          </p>
          <p className="fs-5 mb-4">{message}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button onClick={() => setShowReview(true)} variant="info" size="lg">
              📝 Xem lại
            </Button>
            <Button onClick={onBackClick} variant="primary" size="lg">
              ← Quay lại
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

function AnswerReview({ answersDetail, onBack, onBackToMain }) {
  return (
    <Container className="py-5">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h2 className="text-primary mb-0">📝 Chi tiết lịch sử làm bài</h2>
        <Button onClick={onBack} variant="outline-secondary" size="sm">
          ← Quay lại
        </Button>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {answersDetail.map((answer, idx) => (
          <Card key={idx} style={{ borderLeft: `4px solid ${answer.isCorrect ? '#28a745' : '#dc3545'}` }}>
            <Card.Body>
              <div style={{ marginBottom: '12px' }}>
                <h5 style={{ marginBottom: '8px' }}>
                  <span style={{ backgroundColor: answer.isCorrect ? '#e8f5e9' : '#ffebee', padding: '4px 8px', borderRadius: '4px', marginRight: '8px' }}>
                    {answer.isCorrect ? '✓ Đúng' : '✗ Sai'}
                  </span>
                  Câu {answer.questionIndex}
                </h5>
                <p style={{ fontSize: '1rem', marginBottom: '12px' }}><strong>{answer.content}</strong></p>
              </div>
              
              <div style={{ backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '6px', marginBottom: '12px' }}>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Đáp án của bạn:</strong> <span style={{ color: answer.isCorrect ? '#28a745' : '#dc3545', fontWeight: '600' }}>{answer.userAnswer?.toUpperCase()}</span>
                </p>
                <p style={{ marginBottom: 0 }}>
                  <strong>Đáp án chính xác:</strong> <span style={{ color: '#28a745', fontWeight: '600' }}>{answer.correctAnswer?.toUpperCase()}</span>
                </p>
              </div>
              
              <div>
                <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong>A.</strong> {answer.optionA}</p>
                <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong>B.</strong> {answer.optionB}</p>
                <p style={{ fontSize: '0.9rem', marginBottom: '4px' }}><strong>C.</strong> {answer.optionC}</p>
                <p style={{ fontSize: '0.9rem', marginBottom: 0 }}><strong>D.</strong> {answer.optionD}</p>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      <div className="text-center mt-4">
        <Button onClick={onBackToMain} variant="primary" size="lg">
          ← Quay lại trang chính
        </Button>
      </div>
    </Container>
  );
}
