import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';

export default function ZodiacGame() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const getZodiacSign = (day, month) => {
    const zodiacSigns = [
      { name: 'Ma Kết ♑', start: [12, 22], end: [1, 19], traits: 'Kiên định, thực tế, có trách nhiệm, kỷ luật cao' },
      { name: 'Bảo Bình ♒', start: [1, 20], end: [2, 18], traits: 'Độc lập, sáng tạo, nhân đạo, thích tự do' },
      { name: 'Song Ngư ♓', start: [2, 19], end: [3, 20], traits: 'Nhạy cảm, giàu trí tưởng tượng, từ bi, nghệ sĩ' },
      { name: 'Bạch Dương ♈', start: [3, 21], end: [4, 19], traits: 'Dũng cảm, nhiệt huyết, quyết đoán, năng động' },
      { name: 'Kim Ngưu ♉', start: [4, 20], end: [5, 20], traits: 'Kiên nhẫn, đáng tin, thích ổn định, yêu vật chất' },
      { name: 'Song Tử ♊', start: [5, 21], end: [6, 20], traits: 'Thông minh, linh hoạt, giao tiếp tốt, tò mò' },
      { name: 'Cự Giải ♋', start: [6, 21], end: [7, 22], traits: 'Tình cảm, bảo vệ, trung thành, yêu gia đình' },
      { name: 'Sư Tử ♌', start: [7, 23], end: [8, 22], traits: 'Tự tin, hào phóng, lãnh đạo, tự tôn cao' },
      { name: 'Xử Nữ ♍', start: [8, 23], end: [9, 22], traits: 'Tỉ mỉ, hoàn hảo, thực tế, phân tích tốt' },
      { name: 'Thiên Bình ♎', start: [9, 23], end: [10, 22], traits: 'Công bằng, hòa nhã, thẩm mỹ, giao tiếp' },
      { name: 'Bọ Cạp ♏', start: [10, 23], end: [11, 21], traits: 'Đam mê, quyết liệt, bí ẩn, trung thành' },
      { name: 'Nhân Mã ♐', start: [11, 22], end: [12, 21], traits: 'Tự do, lạc quan, phiêu lưu, triết học' },
    ];

    for (const sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;
      
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        return { name: sign.name, traits: sign.traits };
      }
    }
    return zodiacSigns[0];
  };

  const getChineseZodiac = (year) => {
    const zodiacAnimals = [
      { name: 'Tý 🐭', traits: 'Thông minh, nhanh nhẹn, linh hoạt, quyến rũ' },
      { name: 'Sửu 🐮', traits: 'Chăm chỉ, kiên nhẫn, tin cậy, cẩn thận' },
      { name: 'Dần 🐯', traits: 'Dũng cảm, tự tin, cạnh tranh, quyến rũ' },
      { name: 'Mão 🐰', traits: 'Lịch thiệp, thận trọng, có trách nhiệm, tài năng' },
      { name: 'Thìn 🐉', traits: 'Mạnh mẽ, năng nổ, ấm áp, may mắn' },
      { name: 'Tỵ 🐍', traits: 'Khôn ngoan, huyền bí, trực giác, quyến rũ' },
      { name: 'Ngọ 🐴', traits: 'Năng động, hoạt bát, nhiệt tình, độc lập' },
      { name: 'Mùi 🐑', traits: 'Dịu dàng, thương cảm, nghệ thuật, nhút nhát' },
      { name: 'Thân 🐵', traits: 'Thông minh, tò mò, sáng tạo, tinh quái' },
      { name: 'Dậu 🐔', traits: 'Quan sát, chăm chỉ, dũng cảm, có tài' },
      { name: 'Tuất 🐶', traits: 'Trung thành, trung thực, thân thiện, thận trọng' },
      { name: 'Hợi 🐷', traits: 'Hào phóng, từ bi, chăm chỉ, trung thực' },
    ];

    const index = (year - 4) % 12;
    return zodiacAnimals[index];
  };

  const getFiveElements = (year) => {
    const elements = [
      { name: 'Kim 🔱', traits: 'Cứng rắn, kiên cường, quyết đoán, nghĩa khí' },
      { name: 'Mộc 🌳', traits: 'Nhân từ, phát triển, sáng tạo, linh hoạt' },
      { name: 'Thủy 💧', traits: 'Thông minh, linh hoạt, sâu sắc, bí ẩn' },
      { name: 'Hỏa 🔥', traits: 'Nhiệt tình, năng động, tự tin, nóng nảy' },
      { name: 'Thổ 🏔️', traits: 'Ổn định, tin cậy, trung thành, thực tế' },
    ];

    const index = Math.floor(((year - 4) % 10) / 2);
    return elements[index];
  };

  const validateDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (isNaN(date.getTime())) {
      return { valid: false, message: 'Ngày sinh không hợp lệ!' };
    }
    
    if (date > today) {
      return { valid: false, message: 'Ngày sinh không thể là tương lai!' };
    }
    
    const year = date.getFullYear();
    if (year < 1900 || year > today.getFullYear()) {
      return { valid: false, message: 'Năm sinh phải từ 1900 đến hiện tại!' };
    }
    
    return { valid: true, date };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    const validation = validateDate(birthDate);
    
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    const date = validation.date;
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const zodiac = getZodiacSign(day, month);
    const chineseZodiac = getChineseZodiac(year);
    const element = getFiveElements(year);

    setResult({
      zodiac,
      chineseZodiac,
      element,
      birthDate: date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      })
    });
  };

  const handleReset = () => {
    setBirthDate('');
    setResult(null);
    setError('');
  };

  return (
    <Container className="py-5">
      <Card className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-4">🔮 Chiêm Tinh - Tử Vi</h2>
          <p className="text-center text-muted mb-4">
            Nhập ngày sinh của bạn để khám phá bản thân qua góc nhìn chiêm tinh học!
          </p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Ngày sinh của bạn:</Form.Label>
              <Form.Control
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min="1900-01-01"
                required
                className="form-control-lg"
              />
              <Form.Text className="text-muted">
                Chọn ngày, tháng, năm sinh của bạn
              </Form.Text>
            </Form.Group>

            {error && (
              <Alert variant="danger" className="mb-3">
                {error}
              </Alert>
            )}

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" className="flex-grow-1">
                🔮 Xem tử vi
              </Button>
              {result && (
                <Button variant="secondary" onClick={handleReset}>
                  🔄 Làm lại
                </Button>
              )}
            </div>
          </Form>

          {result && (
            <div className="mt-5">
              <Alert variant="info" className="mb-4">
                <h5 className="mb-2">📅 Ngày sinh: {result.birthDate}</h5>
              </Alert>

              <Row className="g-4">
                <Col md={6}>
                  <Card className="h-100 border-primary">
                    <Card.Body>
                      <Card.Title className="text-primary">
                        ⭐ Cung Hoàng Đạo
                      </Card.Title>
                      <h4 className="my-3">{result.zodiac.name}</h4>
                      <Card.Text className="text-muted">
                        <strong>Tính cách:</strong> {result.zodiac.traits}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="h-100 border-success">
                    <Card.Body>
                      <Card.Title className="text-success">
                        🐉 Con Giáp
                      </Card.Title>
                      <h4 className="my-3">{result.chineseZodiac.name}</h4>
                      <Card.Text className="text-muted">
                        <strong>Tính cách:</strong> {result.chineseZodiac.traits}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={12}>
                  <Card className="border-warning">
                    <Card.Body>
                      <Card.Title className="text-warning">
                        ☯️ Ngũ Hành
                      </Card.Title>
                      <h4 className="my-3">{result.element.name}</h4>
                      <Card.Text className="text-muted">
                        <strong>Đặc điểm:</strong> {result.element.traits}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Alert variant="light" className="mt-4 border">
                <h5 className="mb-3">💫 Tổng Kết Tính Cách</h5>
                <p className="mb-2">
                  Bạn là người có cung {result.zodiac.name}, tuổi {result.chineseZodiac.name}, 
                  mệnh {result.element.name}. Sự kết hợp này tạo nên một con người:
                </p>
                <ul className="mb-0">
                  <li><strong>Cung hoàng đạo:</strong> {result.zodiac.traits}</li>
                  <li><strong>Con giáp:</strong> {result.chineseZodiac.traits}</li>
                  <li><strong>Ngũ hành:</strong> {result.element.traits}</li>
                </ul>
              </Alert>

              <div className="text-center mt-4">
                <p className="text-muted fst-italic">
                  "Tử vi chỉ là tham khảo, cuộc đời do chính bạn quyết định!" - Khổng Tử
                </p>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
