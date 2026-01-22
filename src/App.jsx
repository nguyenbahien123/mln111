import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import PhilosopherList from './components/PhilosopherList';
import PhilosopherDetail from './components/PhilosopherDetail';
import LearningHub from './components/LearningHub';
import QuizChapter from './components/QuizChapter';
import PracticeChapter from './components/PracticeChapter';
import KnowledgeChapter from './components/KnowledgeChapter';
import GameHub from './components/GameHub';

function NavbarComponent() {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand 
          onClick={() => navigate('/')} 
          style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '1.5rem' }}
        >
          📚 Triết Học Online
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link onClick={() => navigate('/philosophers')} className="me-3">
              🧠 Các nhà triết học
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/learning')} className="me-3">
              📚 Học đi chờ chi
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/games')}>
              🎮 Chơi xíu thôi nhá
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function App() {
  return (
    <Router>
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        <NavbarComponent />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<PhilosopherList />} />
            <Route path="/philosophers" element={<PhilosopherList />} />
            <Route path="/philosophers/:id" element={<PhilosopherDetail />} />
            <Route path="/learning" element={<LearningHub />} />
            <Route path="/learning/:chapterId" element={<QuizChapter />} />
            <Route path="/practice/:chapterId" element={<PracticeChapter />} />
            <Route path="/knowledge/:chapterId" element={<KnowledgeChapter />} />
            <Route path="/games" element={<GameHub />} />
          </Routes>
        </main>
        <footer className="bg-dark text-white py-4 mt-5 text-center">
          <Container>
            <p className="mb-0">
              © 2026 Ứng dụng Triết Học - Khám phá những tư tưởng vĩ đại 🌟
            </p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
