import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { chapterAPI } from '../services/api';

export default function LearningHub() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const response = await chapterAPI.getAll();
      setChapters(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách chương học');
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

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="mb-3 text-primary" style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>📚 Trung tâm Học tập</h1>
        <p className="text-muted" style={{ fontSize: '1.05rem' }}>Hãy chọn một chương để bắt đầu hành trình học tập của bạn</p>
        <div style={{ height: '3px', width: '120px', backgroundColor: '#0d6efd', margin: '20px auto 0', borderRadius: '2px' }}></div>
      </div>

      <Row className="g-4">
        {chapters.map((chapter) => (
          <Col key={chapter.id} md={6} lg={4} xs={12}>
            <div 
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                borderRadius: '12px',
                backgroundColor: '#fff',
                border: '1px solid #e9ecef',
                borderTop: '5px solid #0d6efd',
                padding: '24px',
                height: '100%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '2rem' }}>📖</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '600', color: '#0d6efd', margin: 0 }}>{chapter.title}</h3>
              </div>
              <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: '#555', marginBottom: '24px', flex: 1 }}>
                {chapter.description}
              </p>
              <div className="d-grid gap-2">
                <Button
                  variant="outline-success"
                  onClick={() => navigate(`/knowledge/${chapter.id}`)}
                  style={{ 
                    fontSize: '0.95rem', 
                    padding: '12px',
                    fontWeight: '500',
                    border: '2px solid #198754',
                    color: '#198754',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#198754';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.color = '#198754';
                  }}
                >
                  📘 Kiến thức
                </Button>
                <Button
                  variant="outline-info"
                  onClick={() => navigate(`/practice/${chapter.id}`)}
                  style={{ 
                    fontSize: '0.95rem', 
                    padding: '12px',
                    fontWeight: '500',
                    border: '2px solid #0dcaf0',
                    color: '#0dcaf0',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#0dcaf0';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.color = '#0dcaf0';
                  }}
                >
                  💡 Ôn tập
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/learning/${chapter.id}`)}
                  style={{ 
                    fontSize: '0.95rem', 
                    padding: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.filter = 'brightness(0.9)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.filter = 'brightness(1)';
                  }}
                >
                  ✓ Kiểm tra
                </Button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
