import React, { useState } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';

const scenarios = [
  {
    id: 1,
    title: 'Dilemma Đoàn Tàu Kinh Điển',
    description:
      'Một đoàn tàu đang chạy tới và sẽ cán chết 5 người trên đường ray. Bạn có thể nhấn cần để chuyển tàu sang đường ray khác, nhưng trên đó có 1 người. Bạn sẽ làm gì?',
    choice1: 'Cán chết 5 người',
    choice2: 'Nhấn cần để cán chết 1 người',
  },
  {
    id: 2,
    title: 'Bạn hay người lạ?',
    description: 'Bạn có thể cứu bạn thân nhất của mình hoặc 3 người lạ khác. Chọn nào?',
    choice1: 'Cứu bạn thân',
    choice2: 'Cứu 3 người lạ',
  },
];

export default function TrolleyProblem() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [result, setResult] = useState(null);
  const [percentage, setPercentage] = useState(null);

  const handleChoice = (choiceNumber) => {
    // Random percentage từ 40% đến 95%
    const randomPercentage = Math.floor(Math.random() * 55) + 40;
    setPercentage(randomPercentage);
    setResult({
      choice: choiceNumber,
      percentage: randomPercentage,
    });
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setResult(null);
      setPercentage(null);
    } else {
      setCurrentScenario(0);
      setResult(null);
      setPercentage(null);
    }
  };

  const scenario = scenarios[currentScenario];

  return (
    <Container className="py-5">
      <h2 className="text-center text-primary mb-5">{scenario.title}</h2>

      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h5 className="mb-4">{scenario.description}</h5>

          <div className="d-flex gap-2 mb-4 flex-column">
            <Button
              variant="outline-danger"
              size="lg"
              onClick={() => handleChoice(1)}
              className="py-3"
            >
              {scenario.choice1}
            </Button>
            <Button
              variant="outline-success"
              size="lg"
              onClick={() => handleChoice(2)}
              className="py-3"
            >
              {scenario.choice2}
            </Button>
          </div>

          {result && (
            <Alert variant="info" className="mt-4">
              <h5 className="mb-3">📊 Thống kê lựa chọn:</h5>
              <p>
                <strong>{percentage}%</strong> người chọi giống bạn!
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                className="mt-2"
              >
                {currentScenario === scenarios.length - 1
                  ? 'Chơi lại từ đầu'
                  : 'Tình huống tiếp theo →'}
              </Button>
            </Alert>
          )}
        </Card.Body>
      </Card>

      <p className="text-muted text-center">
        Tình huống {currentScenario + 1} / {scenarios.length}
      </p>
    </Container>
  );
}
