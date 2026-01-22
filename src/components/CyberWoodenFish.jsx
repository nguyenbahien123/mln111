import React, { useState, useEffect, useRef } from 'react';
import { Container, Card, Button, Alert, Modal, ProgressBar } from 'react-bootstrap';

export default function CyberWoodenFish() {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const [score, setScore] = useState(0);
  const [enlightenment, setEnlightenment] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [gameRunning, setGameRunning] = useState(true);
  const [showExitModal, setShowExitModal] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#f8f9fa');
  const [showWarning, setShowWarning] = useState(false);
  const [warningText, setWarningText] = useState('⚠️ Tâm chưa tịnh, gõ chậm thôi thí chủ !');

  const gameState = useRef({
    score: 0,
    enlightenment: 0,
    floatingTexts: [],
    lastClickTime: 0,
    clickCount: 0,
    fishScale: 1,
    glowIntensity: 0
  });

  const floatingTextsRef = useRef([]);
  const warningAlertRef = useRef(null);
  const clickHandledRef = useRef(false);
  const warningCountRef = useRef(0);

  const messages = [
    { text: '+1 Công đức', color: '#FFD700' },
    { text: '+1 Tĩnh tâm', color: '#87CEEB' },
    { text: '-1 Nghiệp', color: '#FF6B6B' },
    { text: 'Mục đích là hành trình 🎓', color: '#9D4EDD' },
    { text: 'Tích tiểu thành đại 😇', color: '#06D6A0' },
    { text: 'Passed môn! 🎓', color: '#FFB703' },
    { text: 'Độ ta không độ nàng 🙏', color: '#FFD700' },
    { text: 'Lạy chúa ơi 🙏', color: '#9D4EDD' },
    { text: 'A di đà phật 🙏', color: '#9D4EDD' },
    { text: 'Tôi không gõ nhanh đâu 😇', color: '#87CEEB' },
    { text: 'Âm thầm bên em 🏆', color: '#FFD700' },
    { text: 'Hãy là chính mình 😇', color: '#06D6A0' },
    { text: 'Hứa không sân si 🙏', color: '#8B4513' }
    ];

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Function to play "KENGGGG" sound with reverb effect
  const playKnockSound = () => {
    if (!audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    const currentTime = audioContext.currentTime;
    
    // Create convolver for reverb effect
    const convolver = audioContext.createConvolver();
    const reverbGain = audioContext.createGain();
    const dryGain = audioContext.createGain();
    const masterGain = audioContext.createGain();
    const compressor = audioContext.createDynamicsCompressor();
    
    // Create impulse response for reverb (simulating large temple hall)
    const rate = audioContext.sampleRate;
    const length = rate * 2.5; // 2.5 seconds reverb
    const impulse = audioContext.createBuffer(2, length, rate);
    const impulseL = impulse.getChannelData(0);
    const impulseR = impulse.getChannelData(1);
    
    for (let i = 0; i < length; i++) {
      const n = length - i;
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 2.5);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(n / length, 2.5);
    }
    convolver.buffer = impulse;
    
    // Setup audio routing with compressor
    dryGain.connect(compressor);
    convolver.connect(reverbGain);
    reverbGain.connect(compressor);
    compressor.connect(masterGain);
    masterGain.connect(audioContext.destination);
    
    // Compression settings for punch
    compressor.threshold.value = -20;
    compressor.knee.value = 10;
    compressor.ratio.value = 8;
    compressor.attack.value = 0;
    compressor.release.value = 0.1;
    
    // More dry signal for clarity and punch
    dryGain.gain.value = 0.85;
    reverbGain.gain.value = 0.35; // Less reverb for clarity
    masterGain.gain.value = 1.8; // Even louder
    
    // Tần số tối ưu cho tiếng mõ mạnh mẽ (tránh bass quá thấp)
    const frequencies = [220, 350, 500, 700, 950, 1300];
    
    frequencies.forEach((freq, index) => {
      const osc = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Sử dụng sóng phù hợp
      if (index < 2) {
        osc.type = 'sine'; // Bass frequencies
      } else if (index < 4) {
        osc.type = 'triangle'; // Mid frequencies - warmer
      } else {
        osc.type = 'sine'; // High frequencies for brightness
      }
      
      osc.frequency.setValueAtTime(freq, currentTime);
      
      // --- CÚ ĐÁNH MẠNH MẼ - Attack cực nhanh và mạnh ---
      gainNode.gain.setValueAtTime(0, currentTime);
      
      // Âm lượng cực cao cho attack (tạo cú đánh mạnh)
      const peakGain = index === 0 ? 1.5 : (index === 1 ? 1.3 : (index === 2 ? 0.9 : (index === 3 ? 0.7 : 0.5)));
      
      // Attack cực nhanh (0.002s) để tạo độ "punch"
      gainNode.gain.linearRampToValueAtTime(peakGain, currentTime + 0.002);
      
      // Giảm nhanh một chút sau đó vang dài
      gainNode.gain.exponentialRampToValueAtTime(peakGain * 0.4, currentTime + 0.05);
      
      // Tiếng vang giảm dần (Decay) - bass vang lâu
      const decayTime = index === 0 ? 2.0 : (index === 1 ? 1.5 : (index === 2 ? 1.2 : 0.8));
      gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + decayTime);
      
      osc.connect(gainNode);
      gainNode.connect(dryGain);
      gainNode.connect(convolver);
      
      osc.start(currentTime);
      osc.stop(currentTime + decayTime);
    });
  };

  useEffect(() => {
    if (!gameRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = gameState.current;

    // Draw wooden moktak (mõ) icon (closer to the provided reference)
    const drawFish = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseSize = 70; // smaller overall size
      const size = baseSize * state.fishScale;

      ctx.save();

      // Glow effect
      ctx.shadowColor = 'rgba(255, 215, 0, ' + (0.3 + state.glowIntensity * 0.5) + ')';
      ctx.shadowBlur = 20 + state.glowIntensity * 20;

      // Ground shadow
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.beginPath();
      ctx.ellipse(centerX + size * 0.05, centerY + size * 0.9, size * 0.8, size * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body with subtle radial gradient
      const bodyGradient = ctx.createRadialGradient(
        centerX - size * 0.25,
        centerY - size * 0.45,
        size * 0.2,
        centerX,
        centerY,
        size * 1.1
      );
      bodyGradient.addColorStop(0, '#f4d39a');
      bodyGradient.addColorStop(0.5, '#d8a56a');
      bodyGradient.addColorStop(1, '#a56b36');

      ctx.shadowColor = 'rgba(255, 215, 0, ' + (0.25 + state.glowIntensity * 0.4) + ')';
      ctx.shadowBlur = 18 + state.glowIntensity * 16;

      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
      ctx.fill();

      // Slot cut
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#1b120b';
      ctx.beginPath();
      ctx.moveTo(centerX - size * 0.7, centerY - size * 0.12);
      ctx.quadraticCurveTo(centerX - size * 0.1, centerY - size * 0.45, centerX + size * 0.6, centerY - size * 0.05);
      ctx.quadraticCurveTo(centerX + size * 0.05, centerY + size * 0.3, centerX - size * 0.7, centerY - size * 0.12);
      ctx.closePath();
      ctx.fill();

      // Slot rim highlight
      ctx.strokeStyle = 'rgba(255, 220, 190, 0.35)';
      ctx.lineWidth = size * 0.08;
      ctx.stroke();

      // Top highlight
      ctx.fillStyle = 'rgba(255, 237, 200, 0.7)';
      ctx.beginPath();
      ctx.ellipse(centerX + size * 0.12, centerY - size * 0.52, size * 0.45, size * 0.28, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Small engraving dot
      ctx.fillStyle = '#d4af37';
      ctx.beginPath();
      ctx.arc(centerX - size * 0.22, centerY - size * 0.05, size * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Mallet handle
      const handleWidth = size * 0.12;
      const handleLength = size * 1.1;
      const handleX = centerX + size * 0.65;
      const handleY = centerY + size * 0.25;

      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#4B2E1A';
      ctx.save();
      ctx.translate(handleX, handleY);
      ctx.rotate(0.35);
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(0, -handleWidth / 2, handleLength, handleWidth, handleWidth * 0.4);
        ctx.fill();
      } else {
        ctx.fillRect(0, -handleWidth / 2, handleLength, handleWidth);
      }
      ctx.restore();

      // Mallet head
      const headRadius = size * 0.2;
      const headX = handleX + Math.cos(0.35) * handleLength;
      const headY = handleY + Math.sin(0.35) * handleLength;
      ctx.fillStyle = '#C19A6B';
      ctx.beginPath();
      ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Handle click
    const handleClick = (x, y) => {
      if (clickHandledRef.current) return; // Prevent double processing
      
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const clickX = x - rect.left;
      const clickY = y - rect.top;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const distance = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));

      if (distance < 80 * state.fishScale) {
        clickHandledRef.current = true;
        setTimeout(() => { clickHandledRef.current = false; }, 120); // Increased from 50 to 120
        
        // Enforce slow tapping: require >=500ms between taps
        const now = Date.now();
        const delta = now - state.lastClickTime;
        if (delta > 0 && delta < 500) {
          // Show escalating warning based on whether first violation or repeat
          if (warningCountRef.current === 0) {
            warningCountRef.current = 1; // Mark first violation
            setWarningText('⚠️ Tâm chưa tịnh, gõ chậm thôi thí chủ !');
          } else {
            // Already had first warning, show repeat warning
            setWarningText('😡 Bần tăng đã nói chậm thôi mà!');
          }

          setShowWarning(true);
          if (warningAlertRef.current) {
            const yOffset = -80;
            const element = warningAlertRef.current;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
          setTimeout(() => setShowWarning(false), 3000);
          state.clickCount = 0;
          state.lastClickTime = now;
          return; // skip scoring when too fast
        }
        state.clickCount = 0;
        state.lastClickTime = now;

        // Play knock sound
        playKnockSound();

        // Update score
        state.score += 1;
        state.enlightenment = Math.min(100, state.enlightenment + 5);
        state.fishScale = 1.1;

        setScore(state.score);
        setEnlightenment(state.enlightenment);

        // Add floating text messages
        const message = messages[Math.floor(Math.random() * messages.length)];
        floatingTextsRef.current.push({
          text: message.text,
          color: message.color,
          x: centerX + (Math.random() - 0.5) * 100,
          y: centerY - 100,
          life: 120, // Longer duration
          vy: -2 // Slower movement
        });
        
        // Add "Cốc cốc" text in italic
        floatingTextsRef.current.push({
          text: 'KENGGGG',
          color: '#8B4513',
          x: centerX + 120,
          y: centerY + 30,
          life: 100,
          vy: -1,
          italic: true
        });

        // Update background if enlightenment is full
        if (state.enlightenment >= 100) {
          setBackgroundColor('#FFFACD');
        }
      }
    };

    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        const canvas = canvasRef.current;
        handleClick(canvas.width / 2, canvas.height / 2);
      }
    };

    window.addEventListener('click', (e) => handleClick(e.clientX, e.clientY));
    window.addEventListener('keydown', handleKeyPress);

    const gameLoop = setInterval(() => {
      // Reset canvas
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw fish
      drawFish();

      // Update fish scale
      state.fishScale = Math.max(1, state.fishScale - 0.05);

      // Update glow
      state.glowIntensity = Math.max(0, state.glowIntensity - 0.05);
      if (state.enlightenment >= 100) {
        state.glowIntensity = 0.5;
      }

      // Draw floating texts
      floatingTextsRef.current = floatingTextsRef.current.filter(text => {
        text.y += text.vy;
        text.life--;

        if (text.life > 0) {
          ctx.fillStyle = text.color;
          ctx.globalAlpha = Math.min(1, text.life / 40); // Smoother fade
          ctx.font = (text.italic ? 'italic ' : '') + 'bold 22px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(text.text, text.x, text.y);
          ctx.globalAlpha = 1;
          return true;
        }
        return false;
      });

      // Draw score (moved to middle of canvas)
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#000';
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Công đức: ${state.score}`, canvas.width / 2, canvas.height / 2 + 100);

      ctx.font = '14px Arial';
      ctx.fillText('Click mõ gỗ hoặc nhấn Space', canvas.width / 2, canvas.height - 30);
    }, 30);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameRunning, backgroundColor]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (gameRunning) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handlePopState = (e) => {
      if (gameRunning) {
        e.preventDefault();
        setShowExitModal(true);
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [gameRunning]);

  const handleReset = () => {
    // Reset gameState completely
    gameState.current.score = 0;
    gameState.current.enlightenment = 0;
    gameState.current.floatingTexts = [];
    gameState.current.lastClickTime = Date.now(); // Reset last click time
    gameState.current.clickCount = 0;
    gameState.current.fishScale = 1;
    gameState.current.glowIntensity = 0;
    
    // Reset state
    setScore(0);
    setEnlightenment(0);
    setClicks(0);
    setBackgroundColor('#f8f9fa');
    setShowWarning(false);
    warningCountRef.current = 0; // Reset warning count
  };

  return (
    <Container className="py-5">
      <Card className="shadow-lg">
        <Card.Body>
          <h2 className="text-center mb-3">🥁 Mõ Kỹ Thuật Số</h2>
          <p className="text-center text-muted mb-3">
            <small>Sự tĩnh tâm và luật Nhân quả • Tích tiểu thành đại</small>
          </p>

          {showWarning && (
            <Alert variant="warning" className="text-center mb-3" ref={warningAlertRef}>
              {warningText}
            </Alert>
          )}

          <div className="mb-3">
            <div className="text-center mb-2">
              <strong>Giác Ngộ</strong> {enlightenment}%
            </div>
            <ProgressBar 
              now={enlightenment} 
              variant={enlightenment >= 100 ? 'success' : 'info'}
              animated
              className="mb-3"
            />
          </div>

          <div className="d-flex justify-content-center mb-3">
            <canvas
              ref={canvasRef}
              width={600}
              height={350}
              style={{
                border: '3px solid #333',
                borderRadius: '8px',
                backgroundColor: backgroundColor,
                cursor: 'pointer',
                transition: 'background-color 0.5s ease'
              }}
            />
          </div>

          <div className="text-center">
            <p className="mb-3">
              <strong>Công đức tích lũy:</strong> <span className="text-primary fs-5">{score}</span>
            </p>
            <Button
              variant="primary"
              onClick={handleReset}
              className="me-2"
            >
              🔄 Làm sạch tâm
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showExitModal} onHide={() => setShowExitModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thoát</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc muốn thoát? Công đức tích lũy sẽ mất.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExitModal(false)}>
            Tiếp tục gõ mõ
          </Button>
          <Button variant="danger" onClick={() => window.history.back()}>
            Thoát
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
