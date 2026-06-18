// frontend/src/pages/ConfiguracaoJogo/SelecaoNivel/SelecaoNivel.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../../context/GameContext';
import { getLevelProgress } from '../../../api/scoreApi';
import type { LevelProgress } from '../../../types';
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
    gradient: "linear-gradient(135deg, #34c98a33, #7c6af733)",
    badge: "★★★",
    badgeClass: "badge-success",
  },
  {
    id: "level2",
    type: "normal",
    name: "Nível 2",
    emoji: "🏙️",
    gradient: "linear-gradient(135deg, #7c6af733, #f0a50033)",
    badge: "★★☆",
    badgeClass: "badge-accent",
  },
  {
    id: "level3",
    type: "normal",
    name: "Nível 3",
    emoji: "🌆",
    gradient: "linear-gradient(135deg, #7c6af733, #c7050533)",
    badge: "★☆☆",
    badgeClass: "badge-danger",
  },
  {
    id: "level4",
    type: "normal",
    name: "Nível 4",
    emoji: "🌌",
    gradient: "linear-gradient(135deg, #7c6af733, #00264d33)",
    badge: "★☆☆",
    badgeClass: "badge-night",
  },
  { id: "soon", type: "soon" },
];

const LevelSelection: React.FC = () => {
  const navigate = useNavigate();
  const { loadAndSetLevelImage, setSelectedImageBase64 } = useGameContext();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  
  // Estado para progresso dos níveis
  const [progress, setProgress] = useState<LevelProgress[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Mapeia levelId (1-4) a partir do card id
  const levelMap: Record<string, number> = {
    level1: 1,
    level2: 2,
    level3: 3,
    level4: 4,
  };

  // Buscar progresso ao montar
  useEffect(() => {
    getLevelProgress()
      .then(data => {
        setProgress(data);
      })
      .catch(err => {
        console.error('Erro ao buscar progresso dos níveis:', err);
        setProgress([]);
      })
      .finally(() => {
        setLoadingProgress(false);
      });
  }, []);

  // Verifica se o nível está desbloqueado
  const isUnlocked = (levelId: number): boolean => {
    if (levelId === 1) return true;
    const previous = progress.find(p => p.level_id === levelId - 1);
    return previous?.completed === true;
  };

  // Obtém as estrelas de um nível
  const getStarsForLevel = (levelId: number): number => {
    const found = progress.find(p => p.level_id === levelId);
    return found?.best_stars ?? 0;
  };

  // Renderiza string de estrelas (ex: "★★☆")
  const renderStars = (stars: number): string => {
    return '★'.repeat(stars) + '☆'.repeat(3 - stars);
  };

  // ── CLICK DIRETO NO NÍVEL (SEM POPUP) ──
  const handleLevelClick = async (card: Level) => {
    const levelNum = levelMap[card.id];
    if (!levelNum) return;

    // Verifica se o nível está desbloqueado
    if (!isUnlocked(levelNum)) {
      setErro(`🔒 O ${card.name} ainda está bloqueado. Complete o nível anterior primeiro.`);
      return;
    }

    setIsLoading(card.id);
    setErro(null);

    try {
      console.log(`🔄 Carregando nível ${levelNum}...`);
      await loadAndSetLevelImage(levelNum);
      console.log(`✅ Nível ${levelNum} carregado com sucesso!`);
      
      // Vai para a seleção de dificuldade, passando o levelId
      navigate('/selecao-dificuldade', { state: { levelId: levelNum } });
    } catch (error) {
      console.error(`❌ Erro ao carregar nível ${levelNum}:`, error);
      setErro(`⚠ Não foi possível carregar a imagem do ${card.name}. Tente novamente.`);
      setIsLoading(null);
    }
  };

  // ── CLICK NO UPLOAD ──
  const handleUploadClick = () => {
    setSelectedImageBase64(null);
    navigate('/upload-imagem');
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

          {erro && (
            <div className="error-panel" style={{ 
              marginBottom: 16, 
              color: 'var(--danger)',
              background: 'rgba(240, 92, 92, 0.1)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--danger)',
              textAlign: 'center'
            }}>
              {erro}
            </div>
          )}

          <div className="ls-level-grid">
            {levels.map((card) => {
              // ── CARD DE UPLOAD ──
              if (card.type === "upload") {
                return (
                  <div
                    key={card.id}
                    className="level-card upload-card"
                    onClick={handleUploadClick}
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

              // ── CARD DE NÍVEL NORMAL ──
              if (card.type === "normal") {
                const levelNum = levelMap[card.id];
                const unlocked = isUnlocked(levelNum);
                const stars = getStarsForLevel(levelNum);
                const isThisLoading = isLoading === card.id;
                
                const starsDisplay = loadingProgress ? '•••' : renderStars(stars);
                const badgeText = loadingProgress ? 'Carregando...' : starsDisplay;

                return (
                  <div
                    key={card.id}
                    className={`level-card ${unlocked ? '' : 'locked'} ${isThisLoading ? 'loading' : ''}`}
                    onClick={() => handleLevelClick(card)}
                    style={{ cursor: (unlocked && !isThisLoading) ? 'pointer' : (unlocked ? 'wait' : 'not-allowed') }}
                  >
                    <div className="level-thumb" style={{ background: card.gradient }}>
                      {isThisLoading ? '⏳' : (unlocked ? card.emoji : '🔒')}
                    </div>
                    <div className="level-name">{card.name}</div>
                    <span className={`badge ${unlocked ? card.badgeClass : 'badge-locked'}`}>
                      {badgeText}
                    </span>
                    {!unlocked && !loadingProgress && (
                      <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
                        Complete o nível anterior
                      </div>
                    )}
                  </div>
                );
              }

              // ── CARD BLOQUEADO ──
              if (card.type === "locked") {
                return (
                  <div key={card.id} className="level-card locked">
                    <div className="level-thumb" style={{ background: "var(--border)" }}>🔒</div>
                    <div className="level-name">{card.name}</div>
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>Bloqueado</span>
                  </div>
                );
              }

              // ── CARD "EM BREVE" ──
              if (card.type === "soon") {
                return (
                  <div key={card.id} className="level-card soon">
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
    </div>
  );
};

export default LevelSelection;