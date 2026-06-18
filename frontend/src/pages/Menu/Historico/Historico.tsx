import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyScores } from '../../../api/scoreApi'
import { useAuth } from '../../../hooks/useAuth'
import { formatTime } from '../../../utils/formaters'
import type { ScoreEntry } from '../../../types'
import './Historico.css'

// ── Gradientes fixos por nível ─────────────────
const LEVEL_GRADIENTS: Record<number, string> = {
  1: 'linear-gradient(135deg, #34c98a 0%, #7c6af7 100%)',
  2: 'linear-gradient(135deg, #7c6af7 0%, #f0a500 100%)',
  3: 'linear-gradient(135deg, #f0a500 0%, #f05c5c 100%)',
  4: 'linear-gradient(135deg, #3b8bd4 0%, #7c6af7 100%)',
}
const LEVEL_EMOJIS: Record<number, string> = { 1: '🌅', 2: '🏙️', 3: '🌆', 4: '🌉' }

// ── Helpers ────────────────────────────────────
function calcStars(score: number): number {
  if (score >= 800) return 3
  if (score >= 400) return 2
  return 1
}

function formatDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

// ── Sub-componentes ────────────────────────────
function StarRating({ stars }: { stars: number }) {
  return (
    <span className="hist-stars" aria-label={`${stars} estrelas de 3`}>
      {Array.from({ length: 3 }, (_, i) => (
        <span key={i} className={i < stars ? 'star-full' : 'star-empty'}>
          {i < stars ? '★' : '☆'}
        </span>
      ))}
    </span>
  )
}

function LevelThumbnail({ isCustom, levelId }: { isCustom: boolean; levelId: number }) {
  if (isCustom) {
    return (
      <div className="hist-thumb hist-thumb--custom">
        <div className="hist-thumb-camera">📷</div>
        <div className="hist-thumb-label">Própria</div>
      </div>
    )
  }
  const gradient = LEVEL_GRADIENTS[levelId] ?? LEVEL_GRADIENTS[1]
  const emoji    = LEVEL_EMOJIS[levelId]   ?? '🎮'
  return (
    <div className="hist-thumb hist-thumb--level" style={{ background: gradient }}>
      <span className="hist-thumb-emoji">{emoji}</span>
    </div>
  )
}

// ── Componente principal ───────────────────────
const Historico: React.FC = () => {
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const [items,     setItems]     = useState<ScoreEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!user) { setIsLoading(false); return }
    getMyScores()
      .then(data => {
        const sorted = [...data].sort((a, b) =>
          new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
        )
        setItems(sorted)
      })
      .catch(() => setError('Não foi possível carregar o histórico.'))
      .finally(() => setIsLoading(false))
  }, [user])

  const handleReplay = (entry: ScoreEntry, e: React.MouseEvent) => {
    e.stopPropagation()
    if (entry.level_id === 0) return
    navigate('/selecao-dificuldade', {
      state: { levelId: entry.level_id, isCustomImage: false },
    })
  }

  // ── Estados de loading / erro / vazio ──────────
  if (isLoading) return (
    <div className="hist-page">
      <HistHeader onBack={() => navigate('/menu')} />
      <div className="hist-feedback">
        <div className="hist-feedback-icon">⏳</div>
        <p>Carregando histórico...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="hist-page">
      <HistHeader onBack={() => navigate('/menu')} />
      <div className="hist-feedback">
        <div className="hist-feedback-icon">⚠️</div>
        <p>{error}</p>
        <button className="hist-retry-btn" onClick={() => window.location.reload()}>
          Tentar novamente
        </button>
      </div>
    </div>
  )

  return (
    <div className="hist-page">
      <HistHeader onBack={() => navigate('/menu')} />

      <main className="hist-content">
        <div className="hist-container">
          <p className="hist-section-label">Partidas anteriores</p>

          {items.length === 0 ? (
            <div className="hist-feedback">
              <div className="hist-feedback-icon">📭</div>
              <p className="hist-feedback-text">Nenhuma partida encontrada</p>
              <p className="hist-feedback-sub">Complete um quebra-cabeça para vê-lo aqui</p>
            </div>
          ) : (
            <ul className="hist-list">
              {items.map((entry, idx) => {
                const isCustom = (entry.level_id ?? 0) === 0
                const levelId  = entry.level_id ?? 1
                const stars    = entry.stars ?? calcStars(entry.score)

                return (
                  <li
                    key={entry.puzzle_id + idx}
                    className={`hist-item${isCustom ? ' hist-item--custom' : ''}`}
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <LevelThumbnail isCustom={isCustom} levelId={levelId} />

                    <div className="hist-body">
                      {/* Linha 1 — título */}
                      <div className="hist-row hist-row--top">
                        <span className="hist-title">
                          {isCustom ? 'Imagem própria' : `Nível ${levelId}`}
                        </span>
                      </div>

                      {/* Linha 2 — estrelas */}
                      <div className="hist-row hist-row--mid">
                        <StarRating stars={stars} />
                      </div>

                      {/* Linha 3 — tempo + data */}
                      <div className="hist-row hist-row--meta">
                        <span>⏱ {formatTime(entry.time_seconds)}</span>
                        <span>·</span>
                        <span>{formatDate(entry.created_at)}</span>
                      </div>
                    </div>

                    <button
                      className={`hist-replay-btn${isCustom ? ' hist-replay-btn--disabled' : ''}`}
                      onClick={e => handleReplay(entry, e)}
                      disabled={isCustom}
                      title={isCustom ? 'Imagens próprias não podem ser rejogadas' : 'Rejogar este nível'}
                      aria-label={isCustom ? 'Rejogar indisponível' : 'Rejogar'}
                    >
                      {isCustom ? '🔒 Rejogar' : '▶ Jogar'}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

// ── Header extraído pra evitar repetição ──────
function HistHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="hist-header">
      <span className="hist-logo">📂 Histórico</span>
      <button className="hist-back" onClick={onBack}>← Menu</button>
    </header>
  )
}

export default Historico