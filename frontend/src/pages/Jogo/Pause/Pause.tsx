import React from "react";
import { useNavigate } from "react-router-dom";
import "./Pause.css";

// Dados mockados do jogo (simulando o estado do jogo real)
const PUZZLE_SIZE = 36;
const DONE_INDICES = [0, 1, 3, 6, 7, 12, 18];
const ACTIVE_INDICES = [4];
const COLORS = ["var(--accent)", "var(--accent2)", "var(--success)", "#3b8bd4", "var(--danger)"];

// Props que o componente pode receber do estado real do jogo
interface PauseProps {
  elapsedTime?: string; // formato "MM:SS"
  piecesPlaced?: number;
  totalPieces?: number;
  doneIndices?: number[];
  activeIndices?: number[];
}

const Pause: React.FC<PauseProps> = ({
  elapsedTime = "02:34",
  piecesPlaced = 14,
  totalPieces = 36,
  doneIndices = DONE_INDICES,
  activeIndices = ACTIVE_INDICES,
}) => {
  const navigate = useNavigate();

  const progressPercent = (piecesPlaced / totalPieces) * 100;

  const handleContinue = () => {
    navigate("/jogo"); // Ajuste conforme a rota real do jogo
  };

  const handleRestart = () => {
    const confirmed = window.confirm("Reiniciar o jogo?");
    if (confirmed) {
      navigate("/jogo"); // Ajuste conforme a rota real do jogo
    }
  };

  const handleExitToMenu = () => {
    navigate("/menu"); // Ajuste conforme a rota real do menu
  };

  // Renderiza o fundo do jogo com blur
  const renderGameBackground = () => {
    const pieces = [];
    for (let i = 0; i < PUZZLE_SIZE; i++) {
      let background = "var(--card)";
      if (doneIndices.includes(i)) {
        background = COLORS[i % COLORS.length];
      } else if (activeIndices.includes(i)) {
        background = "var(--accent2)";
      }
      pieces.push(
        <div
          key={i}
          className="iu-puzzle-piece"
          style={{ background }}
        />
      );
    }
    return (
      <div className="iu-game-bg">
        <div className="iu-hud">
          <div className="iu-hud-value">{elapsedTime}</div>
          <div style={{ fontFamily: "var(--mono)", color: "var(--accent)", fontSize: 18 }}>🧩</div>
          <div className="iu-hud-value">
            {piecesPlaced}/{totalPieces}
          </div>
        </div>
        <div className="iu-canvas">
          <div className="iu-puzzle-grid">{pieces}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="iu-body">
      {renderGameBackground()}

      <div className="iu-overlay">
        <div className="iu-modal">
          <div className="iu-pause-icon">⏸</div>
          <div className="iu-modal-title">Pausado</div>
          <div className="iu-modal-sub">
            {elapsedTime} decorridos · {piecesPlaced}/{totalPieces} peças colocadas
          </div>

          <div className="iu-progress-bar">
            <div
              className="iu-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button className="iu-btn iu-btn-primary" onClick={handleContinue}>
            ▶ Continuar
          </button>
          <button className="iu-btn iu-btn-secondary" onClick={handleRestart}>
            🔄 Reiniciar
          </button>
          <button className="iu-btn iu-btn-danger" onClick={handleExitToMenu}>
            🚪 Sair para o Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pause;