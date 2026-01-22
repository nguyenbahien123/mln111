import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';

export default function ZodiacGame() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const getZodiacSign = (day, month) => {
    const zodiacSigns = [
      { 
        name: 'Ma Kết ♑', 
        start: [12, 22], 
        end: [1, 19], 
        traits: 'Kiên định, thực tế, có trách nhiệm, kỷ luật cao',
        career: 'Quản lý, kinh doanh, kế hoạch, tài chính',
        love: 'Trung thành, ổn định, có kế hoạch',
        health: 'Cần vận động, tránh công việc căng thẳng',
        compatible: 'Sư Tử, Bạch Dương, Kim Ngưu'
      },
      { 
        name: 'Bảo Bình ♒', 
        start: [1, 20], 
        end: [2, 18], 
        traits: 'Độc lập, sáng tạo, nhân đạo, thích tự do',
        career: 'Công nghệ, nghiên cứu, sáng tạo, tuyên truyền',
        love: 'Cần độc lập, tự do, hiểu biết lẫn nhau',
        health: 'Lành mạnh, cần hoạt động vận động',
        compatible: 'Thiên Bình, Bọ Cạp, Nhân Mã'
      },
      { 
        name: 'Song Ngư ♓', 
        start: [2, 19], 
        end: [3, 20], 
        traits: 'Nhạy cảm, giàu trí tưởng tượng, từ bi, nghệ sĩ',
        career: 'Nghệ thuật, âm nhạc, thiết kế, giáo dục',
        love: 'Lãng mạn, cảm xúc, cần sự yêu thương',
        health: 'Cần xả stress, yoga, tâm linh',
        compatible: 'Cự Giải, Bọ Cạp, Xử Nữ'
      },
      { 
        name: 'Bạch Dương ♈', 
        start: [3, 21], 
        end: [4, 19], 
        traits: 'Dũng cảm, nhiệt huyết, quyết đoán, năng động',
        career: 'Kinh doanh, quân sự, lãnh đạo, thể thao',
        love: 'Cái tính, nóng nảy, cần đối tác mạnh mẽ',
        health: 'Tìm sở thích thể thao, tránh quá sức',
        compatible: 'Kim Ngưu, Sư Tử, Bảo Bình'
      },
      { 
        name: 'Kim Ngưu ♉', 
        start: [4, 20], 
        end: [5, 20], 
        traits: 'Kiên nhẫn, đáng tin, thích ổn định, yêu vật chất',
        career: 'Tài chính, bất động sản, nông nghiệp, xây dựng',
        love: 'Trung thành, ổn định, lâu dài',
        health: 'Cần chế độ ăn uống lành mạnh',
        compatible: 'Bạch Dương, Cự Giải, Xử Nữ'
      },
      { 
        name: 'Song Tử ♊', 
        start: [5, 21], 
        end: [6, 20], 
        traits: 'Thông minh, linh hoạt, giao tiếp tốt, tò mò',
        career: 'Truyền thông, giáo dục, bán hàng, du lịch',
        love: 'Cần giao tiếp, có chủ ý, hay thay đổi',
        health: 'Cần thư giãn tinh thần, hoạt động',
        compatible: 'Thiên Bình, Bảo Bình, Sư Tử'
      },
      { 
        name: 'Cự Giải ♋', 
        start: [6, 21], 
        end: [7, 22], 
        traits: 'Tình cảm, bảo vệ, trung thành, yêu gia đình',
        career: 'Giáo dục, xã hội, gia đình, chính trị',
        love: 'Tình cảm sâu sắc, yêu gia đình',
        health: 'Cần cân bằng cảm xúc, giảm lo âu',
        compatible: 'Kim Ngưu, Song Ngư, Thiên Bình'
      },
      { 
        name: 'Sư Tử ♌', 
        start: [7, 23], 
        end: [8, 22], 
        traits: 'Tự tin, hào phóng, lãnh đạo, tự tôn cao',
        career: 'Lãnh đạo, giải trí, quản lý, kinh doanh',
        love: 'Lãng mạn, cần khâm phục, cấp tiến',
        health: 'Cần hoạt động, thể thao, tự tin',
        compatible: 'Bạch Dương, Bảo Bình, Song Tử'
      },
      { 
        name: 'Xử Nữ ♍', 
        start: [8, 23], 
        end: [9, 22], 
        traits: 'Tỉ mỉ, hoàn hảo, thực tế, phân tích tốt',
        career: 'Kế toán, khoa học, phân tích, y tế',
        love: 'Cẩn thận, cần thời gian tìm hiểu',
        health: 'Cần kiểm tra sức khỏe định kỳ',
        compatible: 'Kim Ngưu, Song Ngư, Bọ Cạp'
      },
      { 
        name: 'Thiên Bình ♎', 
        start: [9, 23], 
        end: [10, 22], 
        traits: 'Công bằng, hòa nhã, thẩm mỹ, giao tiếp',
        career: 'Pháp luật, ngoại giao, thiết kế, thương mại',
        love: 'Cần sự cân bằng, công bằng, hòa hợp',
        health: 'Cần tránh lo lắng, giữ bình tĩnh',
        compatible: 'Song Tử, Cự Giải, Bảo Bình'
      },
      { 
        name: 'Bọ Cạp ♏', 
        start: [10, 23], 
        end: [11, 21], 
        traits: 'Đam mê, quyết liệt, bí ẩn, trung thành',
        career: 'Tâm lý, điều tra, tài chính, quân sự',
        love: 'Đam mê, sâu sắc, bí ẩn, trung thành',
        health: 'Cần giải tỏa stress, yoga, tâm linh',
        compatible: 'Song Ngư, Xử Nữ, Bảo Bình'
      },
      { 
        name: 'Nhân Mã ♐', 
        start: [11, 22], 
        end: [12, 21], 
        traits: 'Tự do, lạc quan, phiêu lưu, triết học',
        career: 'Du lịch, giáo dục, quản lý, thể thao',
        love: 'Tự do, lạc quan, cần phiêu lưu',
        health: 'Cần hoạt động, du lịch, tập luyện',
        compatible: 'Sư Tử, Bảo Bình, Ma Kết'
      },
    ];

    for (const sign of zodiacSigns) {
      const [startMonth, startDay] = sign.start;
      const [endMonth, endDay] = sign.end;
      
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        return sign;
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
                      <Card.Text className="text-muted small">
                        <strong>Tính cách:</strong> {result.zodiac.traits}
                      </Card.Text>
                      <Card.Text className="text-muted small">
                        <strong>Sự nghiệp:</strong> {result.zodiac.career}
                      </Card.Text>
                      <Card.Text className="text-muted small">
                        <strong>Tình cảm:</strong> {result.zodiac.love}
                      </Card.Text>
                      <Card.Text className="text-muted small">
                        <strong>Sức khỏe:</strong> {result.zodiac.health}
                      </Card.Text>
                      <Card.Text className="text-muted small">
                        <strong>Tương thích:</strong> {result.zodiac.compatible}
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
                <h5 className="mb-3">💫 Tổng Kết Bản Đồ Sao</h5>
                <p className="mb-3">
                  Bạn là người có cung <strong>{result.zodiac.name}</strong>, tuổi <strong>{result.chineseZodiac.name}</strong>, 
                  mệnh <strong>{result.element.name}</strong>.
                </p>
                <div className="row g-3">
                  <div className="col-md-6">
                    <h6>🎯 Tính Cách & Đặc Điểm:</h6>
                    <ul className="mb-0 small">
                      <li><strong>Cung:</strong> {result.zodiac.traits}</li>
                      <li><strong>Tuổi:</strong> {result.chineseZodiac.traits}</li>
                      <li><strong>Mệnh:</strong> {result.element.traits}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>💼 Sự Nghiệp & Công Việc:</h6>
                    <p className="mb-0 small">{result.zodiac.career}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>💕 Tình Cảm & Tình Yêu:</h6>
                    <p className="mb-0 small">{result.zodiac.love}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>❤️ Sức Khỏe & Sống:</h6>
                    <p className="mb-0 small">{result.zodiac.health}</p>
                  </div>
                  <div className="col-12">
                    <h6>🤝 Tương Thích Với:</h6>
                    <p className="mb-0 small">{result.zodiac.compatible}</p>
                  </div>
                </div>
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
