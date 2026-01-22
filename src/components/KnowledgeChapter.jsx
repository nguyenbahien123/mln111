import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert, Card, Badge, Button } from 'react-bootstrap';
import { questionAPI, chapterAPI } from '../services/api';

export default function KnowledgeChapter() {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [chRes, qRes] = await Promise.all([
          chapterAPI.getById(chapterId),
          questionAPI.getByChapterId(chapterId),
        ]);
        setChapter(chRes.data);
        setQuestions(qRes.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Không thể tải dữ liệu kiến thức của chương này');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [chapterId]);

  const getOptions = (q) => ([
    { key: 'a', text: q.optionA },
    { key: 'b', text: q.optionB },
    { key: 'c', text: q.optionC },
    { key: 'd', text: q.optionD },
  ]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="mb-1" style={{ color: '#0d6efd', fontWeight: 700 }}>📘 Kiến thức chương {chapter?.id}</h2>
          <div className="text-muted">{chapter?.title}</div>
        </div>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={() => navigate('/learning')}>← Trung tâm Học tập</Button>
          <Button variant="primary" onClick={() => navigate(`/learning/${chapterId}`)}>✓ Làm bài kiểm tra</Button>
        </div>
      </div>

      

      {questions.map((q, idx) => (
        <Card
          key={idx}
          className="mb-3 shadow-sm"
          style={{
            borderRadius: '12px',
            border: '2px solid #0d6efd',
          }}
        >
          <Card.Body>
            <Card.Title style={{ fontSize: '1.05rem', color: '#212529', fontWeight: 600 }}>
              <Badge bg="light" text="dark" className="me-2" style={{ border: '1px solid #e9ecef' }}>Câu {idx + 1}</Badge>
              {q.content}
            </Card.Title>
            <div className="mt-3">
              {getOptions(q).map((opt) => (
                <div
                  key={opt.key}
                  className="d-flex align-items-center"
                  style={{
                    backgroundColor: opt.key === q.correctAnswer ? '#eaf7ea' : '#f8f9fa',
                    border: `1px solid ${opt.key === q.correctAnswer ? '#198754' : '#e9ecef'}`,
                    borderRadius: '10px',
                    padding: '10px 12px',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    className="me-2"
                    style={{
                      minWidth: 36,
                      textAlign: 'center',
                      padding: '4px 10px',
                      borderRadius: 9999,
                      border: `1px solid ${opt.key === q.correctAnswer ? '#198754' : '#dee2e6'}`,
                      color: opt.key === q.correctAnswer ? '#198754' : '#6c757d',
                      backgroundColor: '#fff',
                      fontWeight: 600,
                    }}
                  >
                    {opt.key.toUpperCase()}
                  </span>
                  <div style={{ lineHeight: 1.6, color: '#212529', flex: 1 }}>{opt.text}</div>
                  {opt.key === q.correctAnswer && (
                    <Badge bg="success" className="ms-2">Đáp án đúng</Badge>
                  )}
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      ))}

      {questions.length === 0 && (
        <Alert variant="warning">Chưa có câu hỏi cho chương này.</Alert>
      )}
    </Container>
  );
}
