import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import "./SelecaoDificuldade.css";

type DifficultyLevel = "facil" | "medio" | "dificil";

interface Difficulty {
  id: DifficultyLevel;
  icon: string;
  label: string;
  labelColor: string;
  pieces: string;
}

const difficulties: Difficulty[] = [
  { id: "facil",   icon: "🟢", label: "Fácil",  labelColor: "var(--success)", pieces: "16 peças" },
  { id: "medio",   icon: "🟡", label: "Médio",  labelColor: "var(--accent)",  pieces: "36 peças" },
  { id: "dificil", icon: "🔴", label: "Difícil", labelColor: "var(--danger)", pieces: "64 peças" },
];

const hintMap: Record<DifficultyLevel, number> = {
  facil: 5,
  medio: 3,
  dificil: 1,
};

const DifficultySelection: React.FC = () => {
  const [selected, setSelected] = useState<DifficultyLevel>("medio");
  const [timeLimitOn, setTimeLimitOn] = useState(true);
  const [shuffleOn, setShuffleOn] = useState(true);

  const navigate = useNavigate()

  return (
    <div className="ds-body">
      <header className="ds-header">
        <div className="ds-header-left">
          <img src="/assets/icone.png" alt="ícone" width={32} height={32} style={{ objectFit: "contain" }} />
          <div className="ds-logo">Quebrando a Cabeça</div>
        </div>
        <a className="ds-back" onClick={() => navigate('/selecao-nivel')}>← Voltar</a>
      </header>

      <main className="ds-main">
        <div className="ds-title">Escolha a dificuldade</div>

        <div className="ds-diff-grid">
          {difficulties.map((diff) => (
            <div
              key={diff.id}
              className={`diff-card${selected === diff.id ? " sel" : ""}`}
              onClick={() => setSelected(diff.id)}
            >
              <div className="diff-icon">{diff.icon}</div>
              <div className="diff-label" style={{ color: diff.labelColor }}>{diff.label}</div>
              <div className="diff-pieces">{diff.pieces}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="ds-section-label">Parâmetros da partida</div>
        </div>

        <div className="ds-options-panel">
          <div className="config-row">
            <span>⏱ Limite de tempo</span>
            <div
              className={`toggle${timeLimitOn ? "" : " off"}`}
              onClick={() => setTimeLimitOn((v) => !v)}
            />
          </div>
          <div className="config-row">
            <span>💡 Dicas disponíveis</span>
            <span className="mono-val">{hintMap[selected]}</span>
          </div>
          <div className="config-row">
            <span>🔀 Embaralhar peças</span>
            <div
              className={`toggle${shuffleOn ? "" : " off"}`}
              onClick={() => setShuffleOn((v) => !v)}
            />
          </div>
        </div>

        <button
          className="ds-btn btn-primary" onClick={() => navigate('/jogo')}
        >
          🎮 Começar Jogo
        </button>
      </main>
    </div>
  );
};

export default DifficultySelection;
