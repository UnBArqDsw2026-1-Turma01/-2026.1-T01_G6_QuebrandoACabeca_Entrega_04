import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Vitoria.css";

interface VitoriaProps {
  // Stats do jogo
  time?: string; // formato "MM:SS"
  hintsUsed?: number;
  points?: number;
  starsCount?: number; // 1, 2 ou 3
  levelName?: string;
  // Callbacks (opcionais)
  onNextLevel?: () => void;
  onPlayAgain?: () => void;
  onMenu?: () => void;
}

const Vitoria: React.FC<VitoriaProps> = ({
  time = "03:42",
  hintsUsed = 1,
  points = 1200,
  starsCount = 3,
  levelName = "Nível",
  onNextLevel,
  onPlayAgain,
  onMenu,
}) => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleNextLevel = () => {
    if (onNextLevel) {
      onNextLevel();
    } else {
      navigate("/jogo/proximo-nivel"); // Ajuste conforme a rota real
    }
  };

  const handlePlayAgain = () => {
    if (onPlayAgain) {
      onPlayAgain();
    } else {
      navigate("/jogo"); // Ajuste conforme a rota real do jogo
    }
  };

  const handleMenu = () => {
    if (onMenu) {
      onMenu();
    } else {
      navigate("/menu"); // Ajuste conforme a rota real do menu
    }
  };

  // Renderiza as estrelas baseado no starsCount
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <span key={i} style={{ opacity: i < starsCount ? 1 : 0.2 }}>
          ⭐
        </span>
      );
    }
    return stars;
  };

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
        <div className="iu-title">{levelName} Completo!</div>
        <div className="iu-stars">{renderStars()}</div>

        <div className="iu-stats">
          <div className="iu-stat">
            <div className="iu-stat-value">{time}</div>
            <div className="iu-stat-label">Tempo</div>
          </div>
          <div className="iu-stat">
            <div className="iu-stat-value">{hintsUsed}</div>
            <div className="iu-stat-label">Dica usada</div>
          </div>
          <div className="iu-stat">
            <div className="iu-stat-value iu-success">{points.toLocaleString()}</div>
            <div className="iu-stat-label">Pontos</div>
          </div>
        </div>

        <div className="iu-divider" />

        <div className="iu-actions">
          <button className="iu-btn iu-btn-primary" onClick={handleNextLevel}>
            Próximo Nível →
          </button>
          <button className="iu-btn iu-btn-warn" onClick={handlePlayAgain}>
            🔄 Jogar Novamente
          </button>
          <button className="iu-btn iu-btn-secondary" onClick={handleMenu}>
            🏠 Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vitoria;