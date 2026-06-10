import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Historico.css";

// Tipo para um item do histórico
interface HistoryItem {
  id: string | number;
  title: string;
  level?: number;
  pieces: number;
  time: string;
  date: string;
  stars: number;
  thumbnailGradient: string;
  levelType?: "custom" | "level";
  levelId?: string;
  imageData?: string;
}

interface HistoricoProps {
  items?: HistoryItem[];
  onBack?: () => void;
  onReplay?: (item: HistoryItem) => void;
  isLoading?: boolean;
  title?: string;
}

// Dados mockados padrão
const DEFAULT_HISTORY_ITEMS: HistoryItem[] = [
  {
    id: 1,
    title: "Paisagem Outono",
    level: 2,
    pieces: 36,
    time: "04:12",
    date: "17/05/2026",
    stars: 3,
    thumbnailGradient: "linear-gradient(135deg, #7c6af7, #f0a500)",
    levelType: "level",
  },
  {
    id: 2,
    title: "Cidade à Noite",
    level: 1,
    pieces: 16,
    time: "02:05",
    date: "15/05/2026",
    stars: 3,
    thumbnailGradient: "linear-gradient(135deg, #34c98a, #3b8bd4)",
    levelType: "level",
  },
  {
    id: 3,
    title: "Minha Foto",
    pieces: 64,
    time: "12:40",
    date: "10/05/2026",
    stars: 2,
    thumbnailGradient: "linear-gradient(135deg, #f05c5c, #f0a500)",
    levelType: "custom",
  },
  {
    id: 4,
    title: "Montanhas",
    level: 3,
    pieces: 64,
    time: "08:55",
    date: "05/05/2026",
    stars: 2,
    thumbnailGradient: "linear-gradient(135deg, #3b8bd4, #7c6af7)",
    levelType: "level",
  },
];

// Componente para renderizar as estrelas
const StarRating: React.FC<{ stars: number }> = ({ stars }) => {
  const fullStars = stars;
  const emptyStars = 3 - stars;

  return (
    <span className="hist-stars">
      {"⭐".repeat(fullStars)}
      {"☆".repeat(emptyStars)}
    </span>
  );
};

const Historico: React.FC<HistoricoProps> = ({
  items = DEFAULT_HISTORY_ITEMS,
  onBack,
  onReplay,
  isLoading = false,
  title = "📂 Histórico",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/menu");
    }
  };

  const handleReplay = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReplay) {
      onReplay(item);
    } else {
      navigate("/jogo", {
        state: {
          replayData: {
            title: item.title,
            pieces: item.pieces,
            levelType: item.levelType,
            levelId: item.levelId,
            imageData: item.imageData,
          },
        },
      });
    }
  };

  const handleItemClick = (item: HistoryItem) => {
    if (onReplay) {
      onReplay(item);
    }
  };

  const formatMeta = (item: HistoryItem): string => {
    const levelInfo = item.level ? ` · Nível ${item.level}` : "";
    const customInfo = item.levelType === "custom" ? " · Customizado" : "";
    return `${item.pieces} peças · ${item.time} · ${item.date}${levelInfo}${customInfo}`;
  };

  if (isLoading) {
    return (
      <div className="hist-page">
        <header className="hist-header">
          <span className="hist-logo">{title}</span>
          <button className="hist-back" onClick={handleBack}>← Menu</button>
        </header>
        <div className="hist-content">
          <div className="hist-container">
            <div className="hist-loading">
              <div className="hist-empty-icon">⏳</div>
              <div>Carregando histórico...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hist-page">
      <header className="hist-header">
        <span className="hist-logo">{title}</span>
        <button className="hist-back" onClick={handleBack}>← Menu</button>
      </header>

      <main className="hist-content">
        <div className="hist-container">
          <div className="hist-page-title">Partidas anteriores</div>

          {items.length === 0 ? (
            <div className="hist-empty">
              <div className="hist-empty-icon">📭</div>
              <div className="hist-empty-text">Nenhuma partida encontrada</div>
              <div className="hist-empty-sub">
                Complete um quebra-cabeça para vê-lo aqui
              </div>
            </div>
          ) : (
            <div className="hist-list">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="hist-item"
                  onClick={() => handleItemClick(item)}
                >
                  <div
                    className="hist-thumb"
                    style={{ background: item.thumbnailGradient }}
                  />
                  <div className="hist-info">
                    <StarRating stars={item.stars} />
                    <div className="hist-title">{item.title}</div>
                    <div className="hist-meta">{formatMeta(item)}</div>
                  </div>
                  <button
                    className="hist-btn"
                    onClick={(e) => handleReplay(item, e)}
                  >
                    Rejogar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Historico;