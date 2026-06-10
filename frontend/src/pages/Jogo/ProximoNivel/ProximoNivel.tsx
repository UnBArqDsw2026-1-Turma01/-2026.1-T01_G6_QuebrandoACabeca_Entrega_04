import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProximoNivel.css";

interface ProximoNivelProps {
  // Dados do próximo nível
  currentLevel?: number;
  nextLevelName?: string;
  nextLevelPieces?: number;
  nextLevelDifficulty?: string;
  // Tempo de loading em ms
  loadingDuration?: number;
  // Callback ao finalizar loading
  onLoadingComplete?: () => void;
}

const ProximoNivel: React.FC<ProximoNivelProps> = ({
  currentLevel = 3,
  nextLevelName = "Floresta Encantada",
  nextLevelPieces = 64,
  nextLevelDifficulty = "Difícil",
  loadingDuration = 2400,
  onLoadingComplete,
}) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animação de progresso
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / loadingDuration) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= loadingDuration) {
        clearInterval(interval);
      }
    }, 16); // ~60fps

    // Timer para navegação
    const timer = setTimeout(() => {
      if (onLoadingComplete) {
        onLoadingComplete();
      } else {
        navigate("/jogo"); // Ajuste conforme a rota real do jogo
      }
    }, loadingDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [loadingDuration, onLoadingComplete, navigate]);

  return (
    <div className="iu-body">
      <div className="iu-loading-icon">⏳</div>
      <div className="iu-title">Nível {currentLevel}</div>
      <div className="iu-sub">Carregando...</div>

      <div className="iu-progress-bar">
        <div
          className="iu-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="iu-next-card">
        <div className="iu-next-label">Próximo nível</div>
        <div className="iu-next-name">{nextLevelName}</div>
        <div className="iu-next-info">
          {nextLevelPieces} peças · {nextLevelDifficulty}
        </div>
      </div>
    </div>
  );
};

export default ProximoNivel;