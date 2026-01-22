import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { philosopherAPI } from '../services/api';
import './PhilosopherList.css';

export default function PhilosopherList() {
  const [philosophers, setPhilosophers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhilosophers();
  }, []);

  const fetchPhilosophers = async () => {
    try {
      setLoading(true);
      const response = await philosopherAPI.getAll();
      setPhilosophers(response.data);
      setError(null);
    } catch (err) {
      setError('Không thể tải danh sách nhà triết học');
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
      <h1 className="mb-4 text-center text-primary">🧠 Các Nhà Triết Học Nổi Tiếng</h1>
      <Row className="g-4">
        {philosophers.map((philosopher) => (
          <Col key={philosopher.id} md={4} sm={6} xs={12}>
            <Card
              className="h-100 philosopher-card shadow-sm"
              onClick={() => navigate(`/philosophers/${philosopher.id}`)}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
            >
              <Card.Img
                variant="top"
                src={philosopher.imageUrl}
                alt={philosopher.name}
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title className="text-center fw-bold">{philosopher.name}</Card.Title>
                <Card.Text className="text-muted text-center">{philosopher.birthDeathDate}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
