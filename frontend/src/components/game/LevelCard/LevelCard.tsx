import { forwardRef } from 'react'
import './LevelCard.css'

export type LevelCardData =
  | {
      type: 'normal'
      id: string
      name: string
      emoji: string
      gradient: string
      badge: string
      badgeClass: 'badge-success' | 'badge-accent' | 'badge-danger' | 'badge-night'
    }
  | { type: 'upload'; id: 'upload' }
  | { type: 'locked'; id: string; name: string }
  | { type: 'soon'; id: 'soon' }

interface LevelCardProps {
  data: LevelCardData
  selected: boolean
  /** Não chamado para variantes 'locked' e 'soon' — essas não são clicáveis, igual ao original. */
  onSelect: () => void
}

export const LevelCard = forwardRef<HTMLDivElement, LevelCardProps>(({ data, selected, onSelect }, ref) => {
  if (data.type === 'upload') {
    return (
      <div ref={ref} className={`level-card upload-card${selected ? ' selected' : ''}`} onClick={onSelect}>
        <div className="level-thumb" style={{ flexDirection: 'column', gap: 4 }}>
          <span>📷</span>
          <span style={{ fontSize: 11, color: 'var(--accent2)', fontWeight: 600 }}>Minha Imagem</span>
        </div>
        <div className="level-name" style={{ color: 'var(--accent2)' }}>
          Imagem própria
        </div>
        <div className="upload-label">
          Envie sua foto e
          <br />
          monte o quebra-cabeça
        </div>
      </div>
    )
  }

  if (data.type === 'normal') {
    return (
      <div ref={ref} className={`level-card${selected ? ' selected' : ''}`} onClick={onSelect}>
        <div className="level-thumb" style={{ background: data.gradient }}>
          {data.emoji}
        </div>
        <div className="level-name">{data.name}</div>
        <span className={`badge ${data.badgeClass}`}>{data.badge}</span>
      </div>
    )
  }

  if (data.type === 'locked') {
    return (
      <div ref={ref} className="level-card locked">
        <div className="level-thumb" style={{ background: 'var(--border)' }}>
          🔒
        </div>
        <div className="level-name">{data.name}</div>
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>Bloqueado</span>
      </div>
    )
  }

  // data.type === 'soon'
  return (
    <div ref={ref} className="level-card soon">
      <div className="level-thumb" style={{ flexDirection: 'column', gap: 6 }}>
        <span>🚀</span>
        <span style={{ fontSize: 10, color: 'var(--muted)' }}>Novos níveis</span>
      </div>
      <div className="level-name" style={{ color: 'var(--muted)' }}>
        Mais níveis
      </div>
      <span className="badge-soon">Em Breve</span>
    </div>
  )
})

LevelCard.displayName = 'LevelCard'