import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Placar.css";

// Tipos para as entradas do ranking
interface RankEntry {
  id?: string | number;
  rank: number;
  name: string;
  score: number;
  isMe?: boolean;
  medal?: string | null;
}

// Props do componente
interface PlacarProps {
  globalRanking?: RankEntry[];
  semanalRanking?: RankEntry[];
  currentPlayerName?: string;
  onBack?: () => void;
  onTabChange?: (tabId: string) => void;
  isLoading?: boolean;
}

// Dados mockados padrão
const DEFAULT_GLOBAL_RANKING: RankEntry[] = [
  { rank: 1, name: "Ana Lima", score: 9840, medal: "🥇" },
  { rank: 2, name: "Carlos R.", score: 8210, medal: "🥈" },
  { rank: 3, name: "Mariana T.", score: 7500, medal: "🥉" },
  { rank: 4, name: "João E.", score: 6300, medal: null },
  { rank: 5, name: "Você", score: 5900, isMe: true, medal: null },
  { rank: 6, name: "Beatriz F.", score: 5100, medal: null },
  { rank: 7, name: "Rafael M.", score: 4870, medal: null },
  { rank: 8, name: "Fernanda L.", score: 4520, medal: null },
  { rank: 9, name: "Gustavo S.", score: 4210, medal: null },
  { rank: 10, name: "Patrícia M.", score: 3980, medal: null },
];

const DEFAULT_SEMANAL_RANKING: RankEntry[] = [
  { rank: 1, name: "Pedro A.", score: 4320, medal: "🥇" },
  { rank: 2, name: "Larissa V.", score: 3980, medal: "🥈" },
  { rank: 3, name: "Thiago N.", score: 3750, medal: "🥉" },
  { rank: 4, name: "Você", score: 3410, isMe: true, medal: null },
  { rank: 5, name: "Camila S.", score: 2990, medal: null },
  { rank: 6, name: "Lucas P.", score: 2640, medal: null },
  { rank: 7, name: "Amanda R.", score: 2310, medal: null },
  { rank: 8, name: "Ricardo A.", score: 1980, medal: null },
];

type TabId = "global" | "semanal" | "amigos";

const Placar: React.FC<PlacarProps> = ({
  globalRanking = DEFAULT_GLOBAL_RANKING,
  semanalRanking = DEFAULT_SEMANAL_RANKING,
  currentPlayerName = "Você",
  onBack,
  onTabChange,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("global");
  const [showWipModal, setShowWipModal] = useState(false);

  const handleTabClick = (tabId: TabId, isWip: boolean = false) => {
    if (isWip) {
      setShowWipModal(true);
      return;
    }
    setActiveTab(tabId);
    if (onTabChange) onTabChange(tabId);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/menu");
    }
  };

  const closeWipModal = () => {
    setShowWipModal(false);
  };

  const renderRankRow = (entry: RankEntry, index: number) => {
    const isTop3 = entry.rank <= 3;
    const displayRank = entry.medal || entry.rank.toString();
    const isMe = entry.isMe || entry.name === currentPlayerName;

    return (
      <div
        key={`rank-${entry.rank}-${index}`}
        className={`placar-rank-row ${isTop3 ? "top3" : ""} ${isMe ? "me" : ""}`}
      >
        <span className="placar-rank-num" style={isMe ? { color: "var(--accent2)" } : {}}>
          {displayRank}
        </span>
        <span
          className="placar-rank-name"
          style={isMe ? { color: "var(--accent2)", fontWeight: 700 } : {}}
        >
          {isMe ? "👤 " : ""}{entry.name}
        </span>
        <span className="placar-rank-score">{entry.score.toLocaleString()}</span>
      </div>
    );
  };

  const renderGlobalPanel = () => (
    <div className={`placar-tab-panel ${activeTab === "global" ? "active" : ""}`}>
      <div className="placar-rank-header">
        <span style={{ width: 40 }}>#</span>
        <span style={{ flex: 1 }}>Jogador</span>
        <span>Pontuação</span>
      </div>
      {globalRanking.map((entry, idx) => renderRankRow(entry, idx))}
    </div>
  );

  const renderSemanalPanel = () => (
    <div className={`placar-tab-panel ${activeTab === "semanal" ? "active" : ""}`}>
      <div className="placar-rank-header">
        <span style={{ width: 40 }}>#</span>
        <span style={{ flex: 1 }}>Jogador</span>
        <span>Pontuação</span>
      </div>
      {semanalRanking.map((entry, idx) => renderRankRow(entry, idx))}
    </div>
  );

  const renderAmigosPanel = () => (
    <div className={`placar-tab-panel ${activeTab === "amigos" ? "active" : ""}`}>
      <div className="placar-wip-container">
        <div className="placar-wip-icon">👥</div>
        <div className="placar-wip-pill">
          <span className="placar-wip-dot"></span>
          Em desenvolvimento
        </div>
        <div className="placar-wip-title">Placar de Amigos</div>
        <div className="placar-wip-desc">
          Em breve você poderá competir com seus amigos e ver quem monta os
          quebra-cabeças mais rápido.
        </div>
      </div>
    </div>
  );

  // Modal de "Trabalho em Progresso"
  const renderWipModal = () => {
    if (!showWipModal) return null;

    return (
      <div className="placar-modal-overlay" onClick={closeWipModal}>
        <div className="placar-modal" onClick={(e) => e.stopPropagation()}>
          <div className="placar-modal-icon">🚧</div>
          <div className="placar-modal-title">Trabalho em Progresso</div>
          <div className="placar-modal-desc">
            Estamos desenvolvendo o placar de amigos para você competir com seus amigos!
            <br /><br />
            Em breve estará disponível. 🎮
          </div>
          <button className="placar-modal-btn" onClick={closeWipModal}>
            Entendido ✓
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="placar-page">
        <header className="placar-header">
          <span className="placar-logo">🏆 Placar</span>
          <button className="placar-back" onClick={handleBack}>← Menu</button>
        </header>
        <div className="placar-loading">
          <div className="placar-wip-icon">⏳</div>
          <div>Carregando placar...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="placar-page">
      <header className="placar-header">
        <span className="placar-logo">🏆 Placar</span>
        <button className="placar-back" onClick={handleBack}>← Menu</button>
      </header>

      <div className="placar-layout">
        <aside className="placar-sidebar">
          <div
            className={`placar-sidebar-item ${activeTab === "global" ? "active" : ""}`}
            onClick={() => handleTabClick("global", false)}
          >
            Global
          </div>
          <div
            className={`placar-sidebar-item ${activeTab === "semanal" ? "active" : ""}`}
            onClick={() => handleTabClick("semanal", false)}
          >
            Semanal
          </div>
          <div
            className="placar-sidebar-item wip"
            onClick={() => handleTabClick("amigos", true)}
          >
            Amigos
            <span className="placar-wip-badge">Em dev.</span>
          </div>
        </aside>

        <main className="placar-content">
          <div className="placar-container">
            {renderGlobalPanel()}
            {renderSemanalPanel()}
            {renderAmigosPanel()}
          </div>
        </main>
      </div>

      {renderWipModal()}
    </div>
  );
};

export default Placar;