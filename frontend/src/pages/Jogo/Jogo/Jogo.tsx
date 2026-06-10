import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './Jogo.css'

// ════════════════════════════════════════════════
// CORES
// ════════════════════════════════════════════════
const C: Record<string, string> = {
  purple: '#7c6af7', amber: '#f0a500', green: '#34c98a',
  blue:   '#3b8bd4', red:   '#f05c5c', pink:  '#b45af7',
  teal:   '#2abfbf', coral: '#f07850',
}

function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`
}

// ════════════════════════════════════════════════
// TIPOS
// ════════════════════════════════════════════════
type CellKind = 'T' | 'B'
interface Cell { id: number; kind: CellKind; color: string | null; filled: boolean }
interface Piece { id: string; color: string }

// ════════════════════════════════════════════════
// DEFINIÇÃO DO TABULEIRO 6x6 (36 células)
// TODAS as 36 células são TARGET (precisam ser preenchidas)
// Nenhuma célula é BLANK ou LOCKED
// ════════════════════════════════════════════════
const BOARD_SIZE = 36 // 6x6

// Gerar cores para cada célula (36 cores únicas ou repetidas)
// Vou criar um padrão de cores diversificado para o puzzle 6x6
const CELL_COLORS: string[] = [
  // Row 0
  'purple', 'amber', 'green', 'blue', 'amber', 'teal',
  // Row 1
  'amber', 'purple', 'red', 'pink', 'blue', 'coral',
  // Row 2
  'green', 'teal', 'purple', 'amber', 'blue', 'red',
  // Row 3
  'coral', 'pink', 'teal', 'purple', 'green', 'amber',
  // Row 4
  'blue', 'red', 'coral', 'pink', 'teal', 'green',
  // Row 5
  'red', 'amber', 'purple', 'coral', 'pink', 'blue',
]

// Definir cada célula do tabuleiro 6x6
const DEF: { s: CellKind; c: string }[] = []
for (let i = 0; i < BOARD_SIZE; i++) {
  DEF.push({
    s: 'T',  // Todas as células são TARGET
    c: CELL_COLORS[i % CELL_COLORS.length]
  })
}

const TOTAL_TARGETS = DEF.length  // 36 peças no total

// ════════════════════════════════════════════════
// FUNÇÃO PARA EMBARALHAR AS PEÇAS (Fisher-Yates shuffle)
// ════════════════════════════════════════════════
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Cria as peças do tray (uma para cada célula) e EMBARALHA
const TRAY_INIT: Piece[] = shuffleArray(
  DEF.map((cell, idx) => ({
    id: `p${idx}`,
    color: cell.c
  }))
)

function buildBoard(): Cell[] {
  return DEF.map((d, i) => ({
    id: i,
    kind: d.s,
    color: d.c,
    filled: false,  // Todas as células começam vazias
  }))
}

function fmt(s: number) {
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0')
}

// ════════════════════════════════════════════════
// COMPONENTE
// ════════════════════════════════════════════════
export default function Jogo() {
  const navigate = useNavigate()

  const [board,       setBoard]       = useState<Cell[]>(buildBoard)
  const [tray,        setTray]        = useState<Piece[]>([...TRAY_INIT])
  const [placedCount, setPlacedCount] = useState(0)
  const [hintsLeft,   setHintsLeft]   = useState(3)
  const [elapsed,     setElapsed]     = useState(0)
  const [isPaused,    setIsPaused]    = useState(false)

  // feedback visual
  const [wrongToast,  setWrongToast]  = useState(false)
  const [hintToast,   setHintToast]   = useState(false)
  const [shakeCell,   setShakeCell]   = useState<number | null>(null)
  const [placeCell,   setPlaceCell]   = useState<number | null>(null)
  const [hintCellId,  setHintCellId]  = useState<number | null>(null)
  const [hintPieceId, setHintPieceId] = useState<string | null>(null)
  const [overCell,    setOverCell]    = useState<number | null>(null)
  const [overCorrect, setOverCorrect] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  // drag
  const dragPiece = useRef<Piece | null>(null)
  const ghostRef  = useRef<HTMLDivElement | null>(null)

  const wrongTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hintTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Timer ────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      if (!isPaused) setElapsed(e => e + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [isPaused])

  // ── HUD values ───────────────────────────────
  const pct = Math.round((placedCount / TOTAL_TARGETS) * 100)

  // ── Pause ────────────────────────────────────
  const handlePause = () => navigate('/jogo/pause')

  // ── Hint ─────────────────────────────────────
  const clearHint = useCallback(() => {
    clearTimeout(hintTimerRef.current ?? undefined)
    setHintCellId(null)
    setHintPieceId(null)
    setHintToast(false)
  }, [])

  const useHint = () => {
    if (hintsLeft <= 0 || isPaused) return
    clearHint()
    setHintsLeft(h => h - 1)
    navigate('/jogo/dica')
  }

  // ── Reset ────────────────────────────────────
  const confirmAndReset = () => setConfirmReset(true)

  const doReset = () => {
    setConfirmReset(false)
    clearHint()
    clearTimeout(wrongTimerRef.current ?? undefined)
    setBoard(buildBoard())
    // Recria o tray embaralhado novamente no reset
    setTray(shuffleArray([...TRAY_INIT]))
    setPlacedCount(0)
    setHintsLeft(3)
    setElapsed(0)
    setIsPaused(false)
    setWrongToast(false)
    setHintToast(false)
    setShakeCell(null)
    setPlaceCell(null)
    setOverCell(null)
    dragPiece.current = null
    ghostRef.current?.remove()
    ghostRef.current = null
  }

  // ── Wrong toast ──────────────────────────────
  const showWrongToast = () => {
    clearTimeout(wrongTimerRef.current ?? undefined)
    setWrongToast(true)
    wrongTimerRef.current = setTimeout(() => setWrongToast(false), 2000)
  }

  // ── Drag ─────────────────────────────────────
  const placeGhost = (x: number, y: number) => {
    if (!ghostRef.current) return
    ghostRef.current.style.left = (x - 18) + 'px'
    ghostRef.current.style.top  = (y - 18) + 'px'
  }

  const onPointerDown = (e: React.PointerEvent, piece: Piece) => {
    if (isPaused || dragPiece.current) return
    e.preventDefault()
    dragPiece.current = piece

    const ghost = document.createElement('div')
    ghost.className = 'jogo-drag-ghost'
    ghost.style.background = C[piece.color]
    ghost.style.left = (e.clientX - 18) + 'px'
    ghost.style.top  = (e.clientY - 18) + 'px'
    document.body.appendChild(ghost)
    ghostRef.current = ghost

    const onMove = (ev: PointerEvent) => {
      placeGhost(ev.clientX, ev.clientY)
      const els = document.elementsFromPoint(ev.clientX, ev.clientY)
      let found: Element | null = null
      for (const el of els) {
        const c = el.closest ? el.closest('[data-cellid]') : null
        if (c) { found = c; break }
      }
      if (found) {
        const id   = +(found as HTMLElement).dataset.cellid!
        const cell = board[id]
        if (cell && cell.kind === 'T' && !cell.filled) {
          setOverCell(id)
          setOverCorrect(cell.color === piece.color)
          return
        }
      }
      setOverCell(null)
    }

    const onUp = (ev: PointerEvent) => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onCancel)
      ghostRef.current?.remove()
      ghostRef.current = null
      setOverCell(null)

      const cur = dragPiece.current
      dragPiece.current = null

      if (!cur) return

      const els = document.elementsFromPoint(ev.clientX, ev.clientY)
      let found: Element | null = null
      for (const el of els) {
        const c = el.closest ? el.closest('[data-cellid]') : null
        if (c) { found = c; break }
      }
      if (!found) return

      const cellId = +(found as HTMLElement).dataset.cellid!
      const cell   = board[cellId]

      if (cell && cell.kind === 'T' && !cell.filled) {
        if (cell.color === cur.color) {
          // ✅ Correto
          clearHint()
          setBoard(prev => prev.map(c => c.id === cellId ? {...c, filled: true} : c))
          setTray(prev => prev.filter(p => p.id !== cur.id))
          setPlaceCell(cellId)
          setTimeout(() => setPlaceCell(null), 400)
          const next = placedCount + 1
          setPlacedCount(next)
          if (next === TOTAL_TARGETS) {
            setTimeout(() => navigate('/jogo/vitoria'), 350)
          }
        } else {
          // ❌ Errado
          setShakeCell(cellId)
          setTimeout(() => setShakeCell(null), 300)
          showWrongToast()
        }
      }
    }

    const onCancel = () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointercancel', onCancel)
      ghostRef.current?.remove()
      ghostRef.current = null
      dragPiece.current = null
      setOverCell(null)
    }

    document.addEventListener('pointermove', onMove, { passive: false })
    document.addEventListener('pointerup', onUp)
    document.addEventListener('pointercancel', onCancel)
  }

  // ════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════
  return (
    <div className="jogo-page">

      {/* ── HUD ── */}
      <div className="jogo-hud">
        <div className="jogo-hud-item">
          <div className="jogo-hud-val">{fmt(elapsed)}</div>
          <div className="jogo-hud-label">Tempo</div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <img src="/assets/icone.png" alt="ícone" width={32} height={32} style={{objectFit:'contain'}} />
        </div>
        <div className="jogo-hud-item">
          <div className="jogo-hud-val">{placedCount}/{TOTAL_TARGETS}</div>
          <div className="jogo-hud-label">Peças</div>
        </div>
        <div className="jogo-hud-item">
          <div className="jogo-hud-val" style={{color:'var(--accent2)'}}>💡 {hintsLeft}</div>
          <div className="jogo-hud-label">Dicas</div>
        </div>
        <div className="jogo-hud-item">
          <div
            className={`jogo-hud-val jogo-pause-btn${!isPaused ? ' pulse-anim' : ''}`}
            style={{color:'var(--accent2)'}}
            onClick={handlePause}
          >⏸</div>
          <div className="jogo-hud-label">Pause</div>
        </div>
      </div>

      {/* ── GAME LAYOUT ── */}
      <div className="jogo-layout">
        <div className="jogo-canvas-area">
          <div className="jogo-board">
            {board.map(cell => {
              const isOver    = overCell === cell.id
              const isCorrect = isOver && overCorrect
              const isWrong   = isOver && !overCorrect
              const isShake   = shakeCell === cell.id
              const isPlace   = placeCell === cell.id
              const isHint    = hintCellId === cell.id

              let cls = 'jogo-cell'
              if (cell.filled) {
                cls += ' placed'
              } else {
                cls += ' target'
              }
              if (isOver)    cls += ' over-cell'
              if (isCorrect) cls += ' correct-over'
              if (isWrong)   cls += ' wrong-over'
              if (isShake)   cls += ' shake'
              if (isPlace)   cls += ' place-anim'
              if (isHint)    cls += ' hint'

              const style: React.CSSProperties = {}
              if (cell.filled && cell.color) {
                style.background = C[cell.color]
                style.borderColor = 'transparent'
              } else if (cell.color) {
                style.background = rgba(C[cell.color], 0.13)
                style.borderColor = rgba(C[cell.color], 0.4)
              }

              return (
                <div key={cell.id} className={cls} style={style} data-cellid={cell.id}>
                  {!cell.filled && cell.color && (
                    <div className="jogo-cell-dot" style={{color: C[cell.color]}}>●</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="jogo-sidebar">
          <div
            className={`jogo-btn warn${hintsLeft <= 0 ? ' off' : ''}`}
            onClick={useHint}
          >💡<br />Dica</div>
          <div className="jogo-btn" onClick={confirmAndReset}>🔄<br />Reiniciar</div>
          <div className="jogo-progress-section">
            <div className="jogo-progress-bar">
              <div className="jogo-progress-fill" style={{width: pct + '%'}} />
            </div>
            <div className="jogo-progress-label">{pct}%</div>
          </div>
        </div>
      </div>

      {/* ── TRAY (com label fixo e container rolável) ── */}
      <div className="jogo-tray">
        <div className="jogo-tray-label">Peças:</div>
        <div className="jogo-tray-scroll">
          {tray.map(piece => (
            <div
              key={piece.id}
              className={`jogo-tray-piece${hintPieceId === piece.id ? ' hint-piece' : ''}`}
              style={{background: C[piece.color]}}
              data-pid={piece.id}
              title={`Peça ${piece.color}`}
              onPointerDown={e => onPointerDown(e, piece)}
            />
          ))}
        </div>
      </div>

      {/* ── CONFIRM MODAL ── */}
      {confirmReset && (
        <div className="jogo-modal-overlay">
          <div className="jogo-modal">
            <p className="jogo-modal-text">Reiniciar o jogo?<br /><span>O progresso será perdido.</span></p>
            <div className="jogo-modal-actions">
              <button className="jogo-modal-btn cancel" onClick={() => setConfirmReset(false)}>Cancelar</button>
              <button className="jogo-modal-btn confirm" onClick={doReset}>Reiniciar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOASTS ── */}
      <div className={`jogo-toast${hintToast ? ' show' : ''}`}>
        💡 Encontre a peça e célula piscando em laranja!
      </div>
      <div className={`jogo-wrong-toast${wrongToast ? ' show' : ''}`}>
        ❌ Cor errada! Tente outra peça.
      </div>

    </div>
  )
}