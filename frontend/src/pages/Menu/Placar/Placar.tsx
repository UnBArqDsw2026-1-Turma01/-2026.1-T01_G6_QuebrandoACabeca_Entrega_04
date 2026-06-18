import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRanking } from "../../../api/scoreApi";
import { useAuth } from "../../../hooks/useAuth";
import type { RankingEntry } from "../../../types";
import "./Placar.css";

type TabId = "global" | "semanal" | "amigos";

const Placar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("global");
  const [showWipModal, setShowWipModal] = useState(false);
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar ranking global
  useEffect(() => {
    if (activeTab === "global") {
      setIsLoading(true);
      setError(null);
      getRanking()
        .then((data) => {
          setRanking(data);
        })
        .catch((err) => {
          console.error("Erro ao buscar ranking:", err);
          setError("Não foi possível carregar o ranking. Tente novamente.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [activeTab]);

  const handleTabClick = (tabId: TabId, isWip: boolean = false) => {
    if (isWip) {
      setShowWipModal(true);
      return;
    }
    setActiveTab(tabId);
  };

  const handleBack = () => {
    navigate("/menu");
  };

  const closeWipModal = () => {
    setShowWipModal(false);
  };

  const getMedal = (rank: number): string | null => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return null;
  };

  // Obtém o ID do usuário de forma segura (pode ser id ou user_id)
  const getUserId = (): string | null => {
    if (!user) return null;
    return (user as any).id || (user as any).user_id || null;
  };

  const renderRankRow = (entry: RankingEntry, index: number) => {
    const rank = index + 1;
    const medal = getMedal(rank);
    const currentUserId = getUserId();
    const isMe = currentUserId === entry.user_id;

    return (
      <div
        key={entry.user_id}
        className={`placar-rank-row ${rank <= 3 ? "top3" : ""} ${isMe ? "me" : ""}`}
      >
        <span className="placar-rank-num" style={isMe ? { color: "var(--accent2)" } : {}}>
          {medal || rank}
        </span>
        <span
          className="placar-rank-name"
          style={isMe ? { color: "var(--accent2)", fontWeight: 700 } : {}}
        >
          {isMe ? "👤 " : ""}{entry.name}
        </span>
        <span className="placar-rank-score">{entry.best_score.toLocaleString()}</span>
      </div>
    );
  };

  const renderGlobalPanel = () => {
    if (isLoading) {
      return (
        <div className="placar-tab-panel active">
          <div className="placar-loading">
            <span>⏳</span>
            <span>Carregando ranking...</span>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="placar-tab-panel active">
          <div className="placar-error" style={{ textAlign: "center", padding: "40px 20px", color: "var(--danger)" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="placar-modal-btn"
              style={{ marginTop: 16 }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    if (ranking.length === 0) {
      return (
        <div className="placar-tab-panel active">
          <div className="placar-wip-container">
            <div className="placar-wip-icon">📭</div>
            <div className="placar-wip-title">Nenhuma pontuação ainda</div>
            <div className="placar-wip-desc">
              Complete um quebra-cabeça para aparecer no ranking!
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="placar-tab-panel active">
        <div className="placar-rank-header">
          <span style={{ width: 40 }}>#</span>
          <span style={{ flex: 1 }}>Jogador</span>
          <span>Pontuação</span>
        </div>
        {ranking.map((entry, idx) => renderRankRow(entry, idx))}
      </div>
    );
  };

  const renderSemanalPanel = () => (
    <div className={`placar-tab-panel ${activeTab === "semanal" ? "active" : ""}`}>
      <div className="placar-wip-container">
        <div className="placar-wip-icon">📅</div>
        <div className="placar-wip-pill">
          <span className="placar-wip-dot"></span>
          Em desenvolvimento
        </div>
        <div className="placar-wip-title">Ranking Semanal</div>
        <div className="placar-wip-desc">
          Em breve você poderá competir semanalmente e ver quem foi o melhor da semana.
        </div>
      </div>
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

  const renderWipModal = () => {
    if (!showWipModal) return null;

    return (
      <div className="placar-modal-overlay" onClick={closeWipModal}>
        <div className="placar-modal" onClick={(e) => e.stopPropagation()}>
          <div className="placar-modal-icon">🚧</div>
          <div className="placar-modal-title">Trabalho em Progresso</div>
          <div className="placar-modal-desc">
            Estamos desenvolvendo essa funcionalidade.
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