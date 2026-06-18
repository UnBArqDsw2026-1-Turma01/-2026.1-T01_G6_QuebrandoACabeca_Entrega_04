// frontend/src/pages/Jogo/Vitoria/Vitoria.tsx
import React, { useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Vitoria.css";

const Vitoria: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Recebe os dados da navegação
  const { stars = 0, levelId = null, isCustomImage = false } = (location.state as any) || {};

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Renderiza as estrelas
  const renderStars = () => {
    const starsArray = [];
    for (let i = 0; i < 3; i++) {
      starsArray.push(
        <span key={i} style={{ opacity: i < stars ? 1 : 0.2, fontSize: '2.5rem' }}>
          ⭐
        </span>
      );
    }
    return starsArray;
  };

  // ── PRÓXIMO NÍVEL ──
  const handleNextLevel = () => {
    if (!levelId || isCustomImage || levelId >= 4) return;
    const nextLevel = levelId + 1;
    navigate('/selecao-dificuldade', { state: { levelId: nextLevel, isCustomImage: false } });
  };

  // ── JOGAR NOVAMENTE (mesmo nível ou mesma imagem) ──
  const handlePlayAgain = () => {
    if (isCustomImage) {
      // Volta para a seleção de dificuldade com a mesma imagem (já está no contexto)
      navigate('/selecao-dificuldade', { state: { levelId: null, isCustomImage: true } });
    } else if (levelId) {
      navigate('/selecao-dificuldade', { state: { levelId, isCustomImage: false } });
    } else {
      // Fallback: vai para seleção de níveis
      navigate('/selecao-nivel');
    }
  };

  // ── MENU PRINCIPAL ──
  const handleMenu = () => {
    navigate('/menu');
  };

  // Verifica se deve mostrar o botão "Próximo Nível"
  const showNextLevel = !isCustomImage && levelId && levelId >= 1 && levelId <= 3;

  // Determina o título da página
  let title = '';
  if (isCustomImage) {
    title = '📷 Imagem própria completa!';
  } else if (levelId) {
    title = `Nível ${levelId} Completo!`;
  } else {
    title = 'Parabéns!';
  }

  // Configuração do confetti
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = ["#7c6af7", "#f0a500", "#34c98a", "#f05c5c", "#e8e8f0"];

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    type ConfettiPiece = {
      x: number;
      y: number;
      r: number;
      color: string;
      speed: number;
      drift: number;
      rot: number;
      rotSpeed: number;
    };

    const pieces: ConfettiPiece[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 1.5,
      drift: Math.random() * 2 - 1,
      rot: Math.random() * 360,
      rotSpeed: Math.random() * 5 - 2.5,
    }));

    let animationId: number;

    const drawConfetti = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color + "cc";
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();

        p.y += p.speed;
        p.x += p.drift;
        p.rot += p.rotSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(drawConfetti);
    };

    drawConfetti();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="iu-body">
      <canvas ref={canvasRef} className="iu-confetti-canvas" />

      <div className="iu-card">
        <div className="iu-emoji">🎉</div>
        <div className="iu-title">{title}</div>
        <div className="iu-stars">{renderStars()}</div>

        <div className="iu-divider" />

        <div className="iu-actions">
          {showNextLevel ? (
            <button className="iu-btn iu-btn-primary" onClick={handleNextLevel}>
              Próximo Nível →
            </button>
          ) : levelId === 4 && !isCustomImage ? (
            <button className="iu-btn iu-btn-primary" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
              🏁 Todos os níveis concluídos!
            </button>
          ) : null}

          <button className="iu-btn iu-btn-warn" onClick={handlePlayAgain}>
            🔄 Jogar Novamente
          </button>

          <button className="iu-btn iu-btn-warn" onClick={handleMenu}>
            🏠 Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vitoria;