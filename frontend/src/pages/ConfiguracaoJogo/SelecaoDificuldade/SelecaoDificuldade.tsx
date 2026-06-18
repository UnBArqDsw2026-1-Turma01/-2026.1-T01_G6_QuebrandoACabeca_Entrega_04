import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameContext } from '../../../context/GameContext';
import { createPuzzle } from '../../../api/puzzleApi';
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
  { id: "facil",   icon: "🟢", label: "Fácil",  labelColor: "var(--success)", pieces: "25 peças" },
  { id: "medio",   icon: "🟡", label: "Médio",  labelColor: "var(--accent)" , pieces: "36 peças" },
  { id: "dificil", icon: "🔴", label: "Difícil",labelColor: "var(--danger)" , pieces: "64 peças" },
];

const hintMap: Record<DifficultyLevel, number> = {
  facil: 5,
  medio: 3,
  dificil: 1,
};

const DifficultySelection: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  // Recebe parâmetros da navegação
  const locationState = location.state as {
    levelId?: number | null;
    isCustomImage?: boolean;
  } | null;

  const levelId = locationState?.levelId ?? null;
  const isCustomImageFromState = locationState?.isCustomImage ?? false;

  const {
    selectedDifficulty,
    setSelectedDifficulty,
    selectedImageBase64,
    setCurrentPuzzle,
    setTimeLimitOn,
    setShuffleOn,
    loadAndSetLevelImage,
  } = useGameContext();

  // Estados locais para os toggles
  const [timeLimitOnLocal, setTimeLimitOnLocal] = useState(true);
  const [shuffleOnLocal, setShuffleOnLocal] = useState(true);

  // ── CARREGAR IMAGEM DO NÍVEL QUANDO NECESSÁRIO ──
  useEffect(() => {
    // Se for imagem própria, não carregamos imagem de nível
    if (isCustomImageFromState) {
      console.log('📷 Imagem própria, mantendo a imagem atual.');
      return;
    }

    // Se tem levelId válido, carrega a imagem
    if (levelId && levelId >= 1 && levelId <= 4) {
      setLoadingImage(true);
      loadAndSetLevelImage(levelId)
        .then(() => {
          console.log(`✅ Nível ${levelId} carregado com sucesso.`);
        })
        .catch((err) => {
          console.error(`❌ Erro ao carregar nível ${levelId}:`, err);
          setErro(`Não foi possível carregar a imagem do nível ${levelId}.`);
        })
        .finally(() => {
          setLoadingImage(false);
        });
    }
  }, [levelId, isCustomImageFromState, loadAndSetLevelImage]);

  // Quando a dificuldade mudar, aplica as regras
  useEffect(() => {
    if (selectedDifficulty === 'facil') {
      // Ambos configuráveis
    } else if (selectedDifficulty === 'medio') {
      setShuffleOnLocal(true);
    } else if (selectedDifficulty === 'dificil') {
      setShuffleOnLocal(true);
      setTimeLimitOnLocal(true);
    }
  }, [selectedDifficulty]);

  const isShuffleEnabled = selectedDifficulty === 'facil';
  const isTimerEnabled = selectedDifficulty !== 'dificil';

  const handleStartGame = async () => {
    console.log('🖼️ Imagem selecionada:', selectedImageBase64 ? 'Presente' : 'NULA');
    console.log('📏 Tamanho da string base64:', selectedImageBase64?.length || 0);

    if (!selectedImageBase64) {
      setErro('⚠ Nenhuma imagem selecionada. Volte e selecione uma imagem.');
      return;
    }

    const base64Data = selectedImageBase64.split(',')[1];
    console.log('📤 Enviando base64 puro, tamanho:', base64Data.length);

    setIsLoading(true);
    setErro(null);

    try {
      console.log('📡 Enviando requisição para /puzzle/create...');
      const result = await createPuzzle({
        image: base64Data,
        difficulty: selectedDifficulty,
        effect: 'grade',
      });

      console.log('✅ Resposta do backend:', result);

      setTimeLimitOn(timeLimitOnLocal);
      setShuffleOn(shuffleOnLocal);

      setCurrentPuzzle({
        puzzle_id: result.puzzle_id,
        difficulty: result.difficulty,
        num_pieces: result.num_pieces,
        pieces: result.pieces,
        effect_applied: result.effect_applied,
      });

      console.log('📦 Puzzle salvo no contexto, navegando para /jogo');

      navigate('/jogo', {
        state: {
          puzzleId: result.puzzle_id,
          levelId: levelId,
          timeLimitOn: timeLimitOnLocal,
          shuffleOn: shuffleOnLocal,
          difficulty: selectedDifficulty,
          isCustomImage: isCustomImageFromState,
        }
      });

    } catch (err) {
      console.error('❌ Erro detalhado:', err);
      if (err instanceof Error) {
        setErro(err.message);
      } else {
        setErro('Não foi possível iniciar o jogo. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Texto para exibir se é imagem própria ou nível
  const imageLabel = isCustomImageFromState 
    ? '📷 Imagem própria' 
    : (levelId ? `Nível ${levelId}` : 'Nível não definido');

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
        <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>
          {loadingImage ? '⏳ Carregando imagem...' : imageLabel}
        </div>

        {erro && (
          <div className="error-panel" style={{
            marginBottom: 16,
            color: 'var(--danger)',
            background: 'rgba(240, 92, 92, 0.1)',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid var(--danger)',
            width: '100%',
            textAlign: 'center'
          }}>
            {erro}
          </div>
        )}

        <div className="ds-diff-grid">
          {difficulties.map((diff) => (
            <div
              key={diff.id}
              className={`diff-card${selectedDifficulty === diff.id ? " sel" : ""}`}
              onClick={() => setSelectedDifficulty(diff.id)}
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
              className={`toggle${timeLimitOnLocal ? "" : " off"}${!isTimerEnabled ? " disabled" : ""}`}
              onClick={() => {
                if (isTimerEnabled) setTimeLimitOnLocal((v) => !v);
              }}
              style={{ opacity: isTimerEnabled ? 1 : 0.5, cursor: isTimerEnabled ? 'pointer' : 'not-allowed' }}
            />
          </div>
          <div className="config-row">
            <span>💡 Dicas disponíveis</span>
            <span className="mono-val">{hintMap[selectedDifficulty]}</span>
          </div>
          <div className="config-row">
            <span>🔀 Embaralhar peças</span>
            <div
              className={`toggle${shuffleOnLocal ? "" : " off"}${!isShuffleEnabled ? " disabled" : ""}`}
              onClick={() => {
                if (isShuffleEnabled) setShuffleOnLocal((v) => !v);
              }}
              style={{ opacity: isShuffleEnabled ? 1 : 0.5, cursor: isShuffleEnabled ? 'pointer' : 'not-allowed' }}
            />
          </div>
        </div>

        <button
          className="ds-btn btn-primary"
          onClick={handleStartGame}
          disabled={isLoading || loadingImage}
        >
          {isLoading ? '🔄 Criando jogo...' : '🎮 Começar Jogo'}
        </button>
      </main>
    </div>
  );
};

export default DifficultySelection;