import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { philosopherAPI, quoteAPI } from '../services/api';

export default function PhilosopherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [philosopher, setPhilosopher] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [philRes, quotesRes] = await Promise.all([
        philosopherAPI.getById(id),
        quoteAPI.getByPhilosopherId(id),
      ]);
      setPhilosopher(philRes.data);
      setQuotes(quotesRes.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải thông tin nhà triết học');
      console.error(err);
    } finally {
      setLoading(false);
    }
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

  if (error || !philosopher) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error || 'Không tìm thấy nhà triết học'}</Alert>
        <Button onClick={() => navigate('/philosophers')} variant="secondary">
          ← Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button onClick={() => navigate('/philosophers')} variant="secondary" className="mb-4">
        ← Quay lại
      </Button>

      <Row className="mb-4">
        <Col md={4} className="text-center">
          <img
            src={philosopher.imageUrl}
            alt={philosopher.name}
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }}
          />
        </Col>
        <Col md={8}>
          <h1 className="text-primary mb-3">{philosopher.name}</h1>
          <p className="text-muted fs-5">{philosopher.birthDeathDate}</p>

          <div className="mb-4">
            <h3 className="text-secondary">📖 Tiểu sử</h3>
            <div style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
              {philosopher.bio && philosopher.bio.split(/(?=\d\.\s)/).map((section, idx) => (
                <p key={idx} style={{ marginBottom: '1rem' }}>
                  {section.trim()}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-secondary">💡 Tư tưởng chính</h3>
            <div style={{ lineHeight: '1.8', fontSize: '0.95rem' }}>
              {philosopher.corePhilosophy && philosopher.corePhilosophy.split(/(?=\d\.\s)/).map((section, idx) => (
                <p key={idx} style={{ marginBottom: '1rem' }}>
                  {section.trim()}
                </p>
              ))}
            </div>
          </div>
        </Col>
      </Row>

      <hr />

      <div>
        <h2 className="text-primary mb-4">💬 Những câu nói nổi tiếng</h2>
        {quotes.length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {quotes.map((quote) => (
              <div 
                key={quote.id} 
                style={{ 
                  padding: '16px', 
                  borderLeft: '4px solid #0dcaf0', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '6px',
                  lineHeight: '1.6',
                  fontSize: '0.95rem'
                }}
              >
                <em>"{quote.content}"</em>
              </div>
            ))}
          </div>
        ) : (
          <Alert variant="info">Chưa có câu nói nào được ghi lại.</Alert>
        )}
      </div>
    </Container>
  );
}
