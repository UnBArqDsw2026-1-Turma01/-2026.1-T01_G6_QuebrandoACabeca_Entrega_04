import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dica.css";

// Configurações do puzzle
const PUZZLE_SIZE = 36;
const DEFAULT_DONE_INDICES = [0, 1, 3, 6];
const DEFAULT_ACTIVE_INDICES = [4];
const COLORS = ["var(--accent)", "var(--success)", "#3b8bd4", "var(--danger)"];

interface DicaProps {
  // Dados do jogo
  elapsedTime?: string;
  hintsRemaining?: number;
  hintsAfterUse?: number;
  doneIndices?: number[];
  activeIndices?: number[];
  // Conteúdo da dica
  hintTitle?: string;
  hintDescription?: string;
  hintPreviewColor?: string;
  // Callback ao fechar
  onClose?: () => void;
}

const Dica: React.FC<DicaProps> = ({
  elapsedTime = "03:10",
  hintsRemaining = 2,
  hintsAfterUse = 2,
  doneIndices = DEFAULT_DONE_INDICES,
  activeIndices = DEFAULT_ACTIVE_INDICES,
  hintTitle = "Dica",
  hintDescription = "A peça destacada em laranja pertence ao <strong>canto superior direito</strong> do quebra-cabeça.",
  hintPreviewColor = "var(--accent2)",
  onClose,
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/jogo"); // Ajuste conforme a rota real do jogo
    }
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
          <span className="iu-hud-time">{elapsedTime}</span>
          <span className="iu-hud-icon">🧩</span>
          <span className="iu-hud-hints">💡 {hintsRemaining}</span>
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
          <div className="iu-hint-icon">💡</div>
          <div className="iu-modal-title">{hintTitle}</div>
          <div
            className="iu-hint-box"
            dangerouslySetInnerHTML={{ __html: hintDescription }}
          />
          <div
            className="iu-hint-preview"
            style={{ background: hintPreviewColor }}
          />
          <div className="iu-hint-counter">
            Dicas restantes após usar: <span>{hintsAfterUse}</span>
          </div>
          <button className="iu-btn iu-btn-primary" onClick={handleClose}>
            Entendido ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dica;