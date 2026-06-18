// frontend/src/context/GameContext.tsx
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ActivePuzzle, Difficulty, Effect } from '../types';
import { DEFAULT_DIFFICULTY, DEFAULT_EFFECT } from '../utils/constants';

// ── MAPEAMENTO DE NÍVEIS PARA IMAGENS ──
export const LEVEL_IMAGES: Record<number, string> = {
  1: '/assets/niveis/Nivel_1.jpg',
  2: '/assets/niveis/Nivel_2.jpg',
  3: '/assets/niveis/Nivel_3.jpg',
  4: '/assets/niveis/Nivel_4.jpg',
  5: '/assets/niveis/default.jpg', // fallback
};

// ── FUNÇÃO PARA CARREGAR IMAGEM DO NÍVEL ──
export async function loadLevelImage(level: number): Promise<string> {
  const imagePath = LEVEL_IMAGES[level];
  if (!imagePath) {
    throw new Error(`Imagem do nível ${level} não encontrada`);
  }

  try {
    console.log(`📥 Carregando imagem do nível ${level}: ${imagePath}`);
    const response = await fetch(imagePath);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const blob = await response.blob();
    console.log(`📦 Blob criado: ${blob.size} bytes, tipo: ${blob.type}`);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        console.log(`✅ Base64 gerado: ${base64.substring(0, 50)}... (${base64.length} caracteres)`);
        if (!base64.startsWith('data:image/')) {
          reject(new Error('Base64 gerado não é uma imagem válida'));
          return;
        }
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Erro ao converter imagem para base64'));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`❌ Erro ao carregar imagem do nível ${level}:`, error);
    if (level !== 1) {
      console.warn(`🔄 Usando imagem do nível 1 como fallback`);
      return loadLevelImage(1);
    }
    console.warn('🖼️ Usando placeholder gerado dinamicamente');
    return generatePlaceholderImage();
  }
}

function generatePlaceholderImage(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas não suportado');
  const gradient = ctx.createLinearGradient(0, 0, 400, 400);
  gradient.addColorStop(0, '#7c6af7');
  gradient.addColorStop(0.5, '#34c98a');
  gradient.addColorStop(1, '#f0a500');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 400);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🧩', 200, 180);
  ctx.font = '20px Arial';
  ctx.fillText('Quebra-Cabeça', 200, 240);
  return canvas.toDataURL('image/jpeg', 0.9);
}

interface GameContextValue {
  selectedDifficulty: Difficulty;
  selectedEffect: Effect;
  selectedLevel: number | null;
  selectedImageBase64: string | null;
  currentPuzzle: ActivePuzzle | null;
  timeLimitOn: boolean;
  shuffleOn: boolean;
  isCustomImage: boolean; // <-- NOVO

  setSelectedDifficulty: (difficulty: Difficulty) => void;
  setSelectedEffect: (effect: Effect) => void;
  setSelectedLevel: (level: number | null) => void;
  setSelectedImageBase64: (image: string | null) => void;
  setCurrentPuzzle: (puzzle: ActivePuzzle | null) => void;
  setTimeLimitOn: (value: boolean) => void;
  setShuffleOn: (value: boolean) => void;
  setIsCustomImage: (value: boolean) => void; // <-- NOVO
  resetGameConfig: () => void;
  loadAndSetLevelImage: (level: number) => Promise<void>;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
  const [selectedEffect, setSelectedEffect] = useState<Effect>(DEFAULT_EFFECT);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState<ActivePuzzle | null>(null);
  const [timeLimitOn, setTimeLimitOn] = useState(true);
  const [shuffleOn, setShuffleOn] = useState(true);
  const [isCustomImage, setIsCustomImage] = useState(false); // <-- NOVO

  const resetGameConfig = useCallback(() => {
    setSelectedDifficulty(DEFAULT_DIFFICULTY);
    setSelectedEffect(DEFAULT_EFFECT);
    setSelectedLevel(null);
    setSelectedImageBase64(null);
    setCurrentPuzzle(null);
    setTimeLimitOn(true);
    setShuffleOn(true);
    setIsCustomImage(false);
  }, []);

  const loadAndSetLevelImage = useCallback(async (level: number) => {
    try {
      console.log(`🔄 Carregando imagem do nível ${level}...`);
      const imageBase64 = await loadLevelImage(level);
      if (!imageBase64 || !imageBase64.startsWith('data:image/')) {
        throw new Error('Imagem carregada não é um base64 válido');
      }
      setSelectedImageBase64(imageBase64);
      setSelectedLevel(level);
      setIsCustomImage(false); // imagem de nível, não customizada
      console.log(`✅ Nível ${level} configurado com sucesso`);
    } catch (error) {
      console.error(`❌ Falha ao carregar nível ${level}:`, error);
      throw error;
    }
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      selectedDifficulty,
      selectedEffect,
      selectedLevel,
      selectedImageBase64,
      currentPuzzle,
      timeLimitOn,
      shuffleOn,
      isCustomImage,
      setSelectedDifficulty,
      setSelectedEffect,
      setSelectedLevel,
      setSelectedImageBase64,
      setCurrentPuzzle,
      setTimeLimitOn,
      setShuffleOn,
      setIsCustomImage,
      resetGameConfig,
      loadAndSetLevelImage,
    }),
    [
      selectedDifficulty,
      selectedEffect,
      selectedLevel,
      selectedImageBase64,
      currentPuzzle,
      timeLimitOn,
      shuffleOn,
      isCustomImage,
      resetGameConfig,
      loadAndSetLevelImage,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameContext(): GameContextValue {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext deve ser usado dentro de um GameProvider.');
  }
  return context;
}