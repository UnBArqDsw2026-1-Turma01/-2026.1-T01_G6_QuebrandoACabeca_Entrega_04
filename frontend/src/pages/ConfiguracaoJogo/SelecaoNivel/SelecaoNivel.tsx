import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom'
import "./SelecaoNivel.css";

interface Level {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  badge: string;
  badgeClass: string;
  type: "normal";
}

interface UploadLevel {
  id: "upload";
  type: "upload";
}

interface LockedLevel {
  id: "locked";
  name: string;
  type: "locked";
}

interface SoonLevel {
  id: "soon";
  type: "soon";
}

type CardData = Level | UploadLevel | LockedLevel | SoonLevel;

const levels: CardData[] = [
  { id: "upload", type: "upload" },
  {
    id: "level1",
    type: "normal",
    name: "Nível 1",
    emoji: "🌅",
    gradient: "linear-gradient(135deg,#34c98a33,#7c6af733)",
    badge: "★★★",
    badgeClass: "badge-success",
  },
  {
    id: "level2",
    type: "normal",
    name: "Nível 2",
    emoji: "🏙️",
    gradient: "linear-gradient(135deg,#7c6af733,#f0a50033)",
    badge: "★★☆",
    badgeClass: "badge-accent",
  },
  {
    id: "level3",
    type: "normal",
    name: "Nível 3",
    emoji: "🌆",
    gradient: "linear-gradient(135deg,#7c6af733,#c7050533)",
    badge: "★☆☆",
    badgeClass: "badge-danger",
  },
  { id: "locked", type: "locked", name: "Nível 4" },
  { id: "soon", type: "soon" },
];

interface PopupState {
  visible: boolean;
  left: number;
  top: number;
  arrowLeft: number;
  label: string;
  isUpload: boolean;
}

const POPUP_W = 264;

const LevelSelection: React.FC = () => {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupState>({
    visible: false,
    left: 0,
    top: 0,
    arrowLeft: 0,
    label: "",
    isUpload: false,
  });
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const positionPopup = useCallback(
    (cardEl: HTMLDivElement, isUpload: boolean, levelName: string) => {
      const rect = cardEl.getBoundingClientRect();
      const margin = 10;
      const cardCenterX = rect.left + rect.width / 2;
      let left = cardCenterX - POPUP_W / 2;
      left = Math.max(margin, Math.min(left, window.innerWidth - POPUP_W - margin));
      const top = rect.bottom + 10;
      const arrowLeft = Math.max(10, Math.min(cardCenterX - left - 6, POPUP_W - 22));

      setPopup({
        visible: true,
        left,
        top,
        arrowLeft,
        label: isUpload ? "Pronto para enviar" : `${levelName} selecionado`,
        isUpload,
      });
    },
    []
  );

  const selectCard = useCallback(
    (id: string, isUpload: boolean, levelName: string) => {
      setSelectedId(id);
      const cardEl = cardRefs.current.get(id);
      if (cardEl) {
        positionPopup(cardEl, isUpload, levelName);
      }
    },
    [positionPopup]
  );

  const closePopup = useCallback(() => {
    setSelectedId(null);
    setPopup((p) => ({ ...p, visible: false }));
  }, []);

  const handlePlay = () => {
    if (popup.isUpload) {
      navigate('/upload-imagem');
    } else {
      navigate('/selecao-dificuldade');
    }
  };

  // Reposiciona ao rolar ou redimensionar
  useEffect(() => {
    const reposition = () => {
      if (selectedId) {
        const cardEl = cardRefs.current.get(selectedId);
        if (cardEl) {
          positionPopup(cardEl, popup.isUpload, popup.label.replace(" selecionado", ""));
        }
      }
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [selectedId, popup.isUpload, popup.label, positionPopup]);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".level-card") && !target.closest("#cardPopup")) {
        closePopup();
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [closePopup]);

  const setRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  };

  return (
    <div className="ls-body">
      <header className="ls-header">
        <div className="ls-header-left">
          <img src="/assets/icone.png" alt="ícone" width={32} height={32} style={{ objectFit: "contain" }} />
          <div className="ls-logo">Quebrando a Cabeça</div>
        </div>
        <a className="ls-back" onClick={() => navigate('/menu')}>← Menu</a>
      </header>

      <div className="ls-layout">
        <main className="ls-content">
          <div className="ls-content-title">Escolha um nível para começar</div>

          <div className="ls-level-grid">
            {levels.map((card) => {
              if (card.type === "upload") {
                return (
                  <div
                    key={card.id}
                    ref={setRef(card.id)}
                    className={`level-card upload-card${selectedId === card.id ? " selected" : ""}`}
                    onClick={() => selectCard(card.id, true, "Imagem própria")}
                  >
                    <div className="level-thumb" style={{ flexDirection: "column", gap: 4 }}>
                      <span>📷</span>
                      <span style={{ fontSize: 11, color: "var(--accent2)", fontWeight: 600 }}>Minha Imagem</span>
                    </div>
                    <div className="level-name" style={{ color: "var(--accent2)" }}>Imagem própria</div>
                    <div className="upload-label">Envie sua foto e<br />monte o quebra-cabeça</div>
                  </div>
                );
              }

              if (card.type === "normal") {
                return (
                  <div
                    key={card.id}
                    ref={setRef(card.id)}
                    className={`level-card${selectedId === card.id ? " selected" : ""}`}
                    onClick={() => selectCard(card.id, false, card.name)}
                  >
                    <div className="level-thumb" style={{ background: card.gradient }}>{card.emoji}</div>
                    <div className="level-name">{card.name}</div>
                    <span className={`badge ${card.badgeClass}`}>{card.badge}</span>
                  </div>
                );
              }

              if (card.type === "locked") {
                return (
                  <div key={card.id} ref={setRef(card.id)} className="level-card locked">
                    <div className="level-thumb" style={{ background: "var(--border)" }}>🔒</div>
                    <div className="level-name">{card.name}</div>
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>Bloqueado</span>
                  </div>
                );
              }

              if (card.type === "soon") {
                return (
                  <div key={card.id} ref={setRef(card.id)} className="level-card soon">
                    <div className="level-thumb" style={{ flexDirection: "column", gap: 6 }}>
                      <span>🚀</span>
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>Novos níveis</span>
                    </div>
                    <div className="level-name" style={{ color: "var(--muted)" }}>Mais níveis</div>
                    <span className="badge-soon">Em Breve</span>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </main>
      </div>

      {/* Popup flutuante */}
      <div
        id="cardPopup"
        className={`card-popup${popup.visible ? " show" : ""}`}
        style={{ width: POPUP_W, left: popup.left, top: popup.top }}
      >
        <div className="popup-inner">
          <div className="popup-arrow" style={{ left: popup.arrowLeft }} />
          <span className="popup-label">{popup.label}</span>
          <button
            className={`popup-btn${popup.isUpload ? " upload" : " primary"}`}
            onClick={handlePlay}
          >
            {popup.isUpload ? "📷 Usar minha imagem" : "🎮 Jogar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelSelection;
