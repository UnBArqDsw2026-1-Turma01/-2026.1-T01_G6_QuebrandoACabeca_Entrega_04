import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGameContext } from '../../../context/GameContext'
import { getPuzzleState, movePiece, createPuzzle, deletePuzzle } from '../../../api/puzzleApi'
import { submitScore } from '../../../api/scoreApi'
import type { Difficulty, Piece as PuzzlePiece } from '../../../types'
import Pause from '../Pause/Pause'
import './Jogo.css'

// ── Chaves de sessão ───────────────────────────
const SK_PUZZLE_ID      = 'jogo_puzzleId'
const SK_DIFFICULTY     = 'jogo_difficulty'
const SK_IMAGE          = 'jogo_image'
const SK_TIME_LIMIT     = 'jogo_timeLimitOn'
const SK_SHUFFLE        = 'jogo_shuffleOn'
const SK_ELAPSED        = 'jogo_elapsed'
const SK_TIME_REMAINING = 'jogo_timeRemaining'
const SK_HINTS_LEFT     = 'jogo_hintsLeft'
const SK_BOARD          = 'jogo_board'   // estado visual completo (inclui células erradas)
const SK_TRAY           = 'jogo_tray'

// ── Dicas por dificuldade ──────────────────────
const HINTS_BY_DIFFICULTY: Record<Difficulty, number> = {
  facil:   5,
  medio:   3,
  dificil: 1,
}

// ── Tempo limite por dificuldade (segundos) ────
const TIME_LIMIT_BY_DIFFICULTY: Record<Difficulty, number> = {
  facil:   120,
  medio:   180,
  dificil: 300,
}

interface Cell {
  id: number
  pieceId: number | null
  filled: boolean
  posicao_x: number
  posicao_y: number
  posicao_x_certa: number
  posicao_y_certa: number
  placedPieceX: number | null
  placedPieceY: number | null
}

interface TrayPiece {
  id: number
  posicao_x_certa: number
  posicao_y_certa: number
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const seg = s % 60
  return `${String(m).padStart(2, '0')}:${String(seg).padStart(2, '0')}`
}

function gridSize(total: number): number {
  return Math.round(Math.sqrt(total))
}

function pieceImageStyle(imageUrl: string, col: number, row: number, n: number): React.CSSProperties {
  return {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${n * 100}% ${n * 100}%`,
    backgroundPosition: `${(col / (n - 1)) * 100}% ${(row / (n - 1)) * 100}%`,
    backgroundRepeat: 'no-repeat',
  }
}

// ── Helpers de sessionStorage ──────────────────
function ssGet(key: string): string | null {
  try { return sessionStorage.getItem(key) } catch { return null }
}
function ssSet(key: string, value: string): void {
  try { sessionStorage.setItem(key, value) } catch { /* quota excedida — silencioso */ }
}
function ssRemove(key: string): void {
  try { sessionStorage.removeItem(key) } catch { /* silencioso */ }
}

// ── Helpers de localStorage (para imagem — sem limite de 5MB do sessionStorage) ──
const LS_IMAGE_KEY = 'jogo_image_ls'
const LS_IMAGE_TTL = 'jogo_image_ttl'
const IMAGE_TTL_MS = 24 * 60 * 60 * 1000 // 24h

function lsSetImage(img: string): void {
  try {
    localStorage.setItem(LS_IMAGE_KEY, img)
    localStorage.setItem(LS_IMAGE_TTL, String(Date.now() + IMAGE_TTL_MS))
  } catch (e) {
    console.warn('localStorage cheio — imagem não persistida:', e)
  }
}

function lsGetImage(): string | null {
  try {
    const ttl = localStorage.getItem(LS_IMAGE_TTL)
    if (!ttl || Date.now() > parseInt(ttl, 10)) {
      localStorage.removeItem(LS_IMAGE_KEY)
      localStorage.removeItem(LS_IMAGE_TTL)
      return null
    }
    return localStorage.getItem(LS_IMAGE_KEY)
  } catch { return null }
}

function lsRemoveImage(): void {
  try {
    localStorage.removeItem(LS_IMAGE_KEY)
    localStorage.removeItem(LS_IMAGE_TTL)
  } catch { /* silencioso */ }
}

export default function Jogo() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    currentPuzzle, setCurrentPuzzle,
    selectedImageBase64: ctxImage,
    setSelectedImageBase64,
    selectedDifficulty,
  } = useGameContext()

  const locState = location.state as {
    puzzleId?: string;
    levelId?: number | null;
    timeLimitOn?: boolean;
    shuffleOn?: boolean;
    difficulty?: Difficulty;
    isCustomImage?: boolean;
  } | null

  // Recebe o levelId da navegação
  const levelId = locState?.levelId ?? null; // pode ser null
  const isCustomImage = locState?.isCustomImage ?? false;

  const [imageBase64, setImageBase64] = useState<string | null>(
    ctxImage ?? ssGet(SK_IMAGE) ?? lsGetImage()
  )

  const [isLoading,        setIsLoading]        = useState(true)
  const [board,            setBoard]            = useState<Cell[]>([])
  const [tray,             setTray]             = useState<TrayPiece[]>([])
  const [placedCount,      setPlacedCount]      = useState(0)
  const [totalPieces,      setTotalPieces]      = useState(0)
  const [hintsLeft,        setHintsLeft]        = useState(3)
  const [elapsed,          setElapsed]          = useState(0)
  const [isPaused,         setIsPaused]         = useState(false)
  const [puzzleId,         setPuzzleId]         = useState<string | null>(null)
  const [difficulty,       setDifficulty]       = useState<Difficulty>(
    locState?.difficulty ?? selectedDifficulty
  )
  const [scoreSubmitted,   setScoreSubmitted]   = useState(false)

  const [timeLimitOn, setTimeLimitOn] = useState<boolean>(() => {
    if (locState?.timeLimitOn !== undefined) return locState.timeLimitOn
    const s = ssGet(SK_TIME_LIMIT)
    return s !== null ? s === 'true' : true
  })

  const [shuffleOn, setShuffleOn] = useState<boolean>(() => {
    if (locState?.shuffleOn !== undefined) return locState.shuffleOn
    const s = ssGet(SK_SHUFFLE)
    return s !== null ? s === 'true' : true
  })

  const [timeRemaining,    setTimeRemaining]    = useState<number>(() => {
    const saved = ssGet(SK_TIME_REMAINING)
    if (saved) return parseInt(saved, 10)
    const diff = (locState?.difficulty ?? ssGet(SK_DIFFICULTY) ?? selectedDifficulty) as Difficulty
    const tl = locState?.timeLimitOn !== undefined ? locState.timeLimitOn : ssGet(SK_TIME_LIMIT) !== "false"
    return tl ? (TIME_LIMIT_BY_DIFFICULTY[diff] ?? 180) : 999999
  })
  const [gameOver,         setGameOver]         = useState(false)
  const [timeWarning,      setTimeWarning]      = useState(false)

  const [placeCell,        setPlaceCell]        = useState<number | null>(null)
  const [hintCellId,       setHintCellId]       = useState<number | null>(null)
  const [hintPieceId,      setHintPieceId]      = useState<number | null>(null)
  const [overCell,         setOverCell]         = useState<number | null>(null)
  const [confirmReset,     setConfirmReset]     = useState(false)
  const [confirmReturnAll, setConfirmReturnAll] = useState(false)
  const [returningPieceId, setReturningPieceId] = useState<number | null>(null)
  const [removingCellId,   setRemovingCellId]   = useState<number | null>(null)
  const [hintedPieces,     setHintedPieces]     = useState<Set<number>>(new Set())

  const boardRef       = useRef(board)
  const trayRef        = useRef(tray)
  const placedCountRef = useRef(placedCount)
  const totalPiecesRef = useRef(totalPieces)
  const elapsedRef     = useRef(elapsed)
  const timeRemRef     = useRef(timeRemaining)
  const hintsRef       = useRef(hintsLeft)

  useEffect(() => { boardRef.current = board },             [board])
  useEffect(() => { trayRef.current = tray },               [tray])
  useEffect(() => { placedCountRef.current = placedCount }, [placedCount])
  useEffect(() => { totalPiecesRef.current = totalPieces }, [totalPieces])
  useEffect(() => { elapsedRef.current = elapsed },         [elapsed])
  useEffect(() => { timeRemRef.current = timeRemaining },   [timeRemaining])
  useEffect(() => { hintsRef.current = hintsLeft },         [hintsLeft])

  const dragPiece           = useRef<TrayPiece | null>(null)
  const ghostRef            = useRef<HTMLDivElement | null>(null)
  const hintTimerRef        = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDraggingFromBoard = useRef(false)
  const draggedFromCellId   = useRef<number | null>(null)

  const N = useMemo(() => gridSize(totalPieces), [totalPieces])

  // ── Persistir estado completo no sessionStorage ───────────────────
  const persistAll = useCallback((
    id: string,
    diff: Difficulty,
    img: string | null,
    tl: boolean,
    sh: boolean,
    b: Cell[],
    tr: TrayPiece[],
    el: number,
    rem: number,
    hints: number,
    paused: boolean,
  ) => {
    ssSet(SK_PUZZLE_ID,      id)
    ssSet(SK_DIFFICULTY,     diff)
    ssSet(SK_TIME_LIMIT,     String(tl))
    ssSet(SK_SHUFFLE,        String(sh))
    ssSet(SK_ELAPSED,        String(el))
    ssSet(SK_TIME_REMAINING, String(rem))
    ssSet(SK_HINTS_LEFT,     String(hints))
    ssSet('jogo_isPaused',   String(paused))
    try { ssSet(SK_BOARD, JSON.stringify(b)) } catch { /* silencioso */ }
    try { ssSet(SK_TRAY,  JSON.stringify(tr)) } catch { /* silencioso */ }
    if (img) lsSetImage(img)
  }, [])

  const clearSession = useCallback(() => {
    [SK_PUZZLE_ID, SK_DIFFICULTY, SK_IMAGE, SK_TIME_LIMIT, SK_SHUFFLE,
     SK_ELAPSED, SK_TIME_REMAINING, SK_HINTS_LEFT, SK_BOARD, SK_TRAY]
      .forEach(ssRemove)
    lsRemoveImage()
  }, [])

  // ── Salva automaticamente ─────────────────────────────────────────
  useEffect(() => {
    if (isLoading || !puzzleId) return
    persistAll(
      puzzleId, difficulty, imageBase64, timeLimitOn, shuffleOn,
      board, tray,
      elapsed, timeRemaining, hintsLeft,
      isPaused,
    )
  }, [elapsed, board, tray, hintsLeft, isPaused]) // eslint-disable-line

  // ── Carregar puzzle ──────────────────────────────────────────────
  useEffect(() => {
    const id =
      locState?.puzzleId ||
      currentPuzzle?.puzzle_id ||
      ssGet(SK_PUZZLE_ID)

    if (!id) { navigate('/selecao-dificuldade'); return }
    setPuzzleId(id)

    const load = async () => {
      try {
        const savedBoardRaw = ssGet(SK_BOARD)
        const savedTrayRaw  = ssGet(SK_TRAY)
        const savedElapsed  = ssGet(SK_ELAPSED)
        const savedTimeRem  = ssGet(SK_TIME_REMAINING)
        const savedHints    = ssGet(SK_HINTS_LEFT)

        let diff: Difficulty =
          locState?.difficulty ||
          currentPuzzle?.difficulty ||
          (ssGet(SK_DIFFICULTY) as Difficulty | null) ||
          selectedDifficulty

        const tl = locState?.timeLimitOn !== undefined
          ? locState.timeLimitOn
          : ssGet(SK_TIME_LIMIT) === 'true'

        const sh = locState?.shuffleOn !== undefined
          ? locState.shuffleOn
          : ssGet(SK_SHUFFLE) === 'true'

        const img = ctxImage ?? ssGet(SK_IMAGE) ?? lsGetImage()
        if (img && img !== imageBase64) {
          setImageBase64(img)
          setSelectedImageBase64(img)
        }

        const hasValidSave = !!(savedBoardRaw && savedTrayRaw && savedHints)
        if (hasValidSave) {
          const savedBoard: Cell[]      = JSON.parse(savedBoardRaw)
          const savedTray:  TrayPiece[] = JSON.parse(savedTrayRaw)
          const savedEl    = savedElapsed ? parseInt(savedElapsed, 10) : 0
          const savedRem   = savedTimeRem ? parseInt(savedTimeRem, 10) : (tl ? TIME_LIMIT_BY_DIFFICULTY[diff] : 999999)
          const savedH     = parseInt(savedHints, 10)

          setDifficulty(diff)
          setTimeLimitOn(tl)
          setShuffleOn(sh)
          setBoard(savedBoard)
          setTray(savedTray)
          setTotalPieces(savedBoard.length)
          setPlacedCount(savedBoard.filter(c => c.filled).length)
          setElapsed(savedEl)
          setTimeRemaining(savedRem)
          setHintsLeft(savedH)
          setGameOver(false)
          setIsPaused(ssGet('jogo_isPaused') === 'true')
          setScoreSubmitted(false)
        } else {
          let pieces: PuzzlePiece[]

          if (currentPuzzle?.puzzle_id === id) {
            pieces = currentPuzzle.pieces
            diff   = currentPuzzle.difficulty
          } else {
            const puzzleState = await getPuzzleState(id)
            setCurrentPuzzle({
              puzzle_id:  puzzleState.puzzle_id,
              difficulty: puzzleState.difficulty,
              num_pieces: puzzleState.num_pieces,
              pieces:     puzzleState.pieces,
            })
            pieces = puzzleState.pieces
            diff   = puzzleState.difficulty
          }

          const limit = TIME_LIMIT_BY_DIFFICULTY[diff] || 180

          setDifficulty(diff)
          setTimeLimitOn(tl)
          setShuffleOn(sh)
          setHintsLeft(HINTS_BY_DIFFICULTY[diff] ?? 3)
          setElapsed(0)
          setTimeRemaining(tl ? limit : 999999)
          setHintedPieces(new Set())
          setGameOver(false)
          setIsPaused(false)
          setScoreSubmitted(false)

          initializeGame(pieces, sh)
        }

      } catch {
        navigate('/selecao-dificuldade')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, []) // eslint-disable-line

  // ── Inicializar jogo ──────────────────────────────────────────────
  const initializeGame = useCallback((pieces: PuzzlePiece[], shuffle?: boolean) => {
    const shouldShuffle = shuffle ?? shuffleOn
    const newBoard: Cell[] = pieces.map(p => ({
      id:              p.id,
      pieceId:         p.encaixada ? p.id : null,
      filled:          p.encaixada,
      posicao_x:       p.posicao_x,
      posicao_y:       p.posicao_y,
      posicao_x_certa: p.posicao_x_certa,
      posicao_y_certa: p.posicao_y_certa,
      placedPieceX:    p.encaixada ? p.posicao_x_certa : null,
      placedPieceY:    p.encaixada ? p.posicao_y_certa : null,
    }))
    const unplaced = pieces.filter(p => !p.encaixada)
    let newTray: TrayPiece[] = unplaced.map(p => ({
      id:              p.id,
      posicao_x_certa: p.posicao_x_certa,
      posicao_y_certa: p.posicao_y_certa,
    }))
    newTray = shouldShuffle
      ? shuffleArray(newTray)
      : newTray.sort((a, b) => a.id - b.id)

    setBoard(newBoard)
    setTray(newTray)
    setTotalPieces(pieces.length)
    setPlacedCount(pieces.filter(p => p.encaixada).length)
    setHintedPieces(new Set())
    setScoreSubmitted(false)
  }, [shuffleOn])

  // ── Timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isLoading || isPaused || gameOver) return

    const id = setInterval(() => {
      setElapsed(prev => prev + 1)
      setTimeRemaining(prev => {
        if (timeLimitOn && prev <= 1 && prev !== 999999) {
          setGameOver(true)
          clearInterval(id)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(id)
  }, [isLoading, isPaused, gameOver, timeLimitOn])

  useEffect(() => {
    setTimeWarning(timeLimitOn && timeRemaining <= 30)
  }, [timeRemaining, timeLimitOn])

  const pct = totalPieces > 0 ? Math.round((placedCount / totalPieces) * 100) : 0

  // ── Pause ─────────────────────────────────────────────────────────
  const handlePause   = useCallback(() => setIsPaused(true), [])
  const handleResume  = useCallback(() => setIsPaused(false), [])
  const handleRestartFromPause = useCallback(() => {
    setIsPaused(false)
    setConfirmReset(true)
  }, [])
  const handleExitToMenu = useCallback(async () => {
    // Deleta o puzzle ativo ao sair para o menu
    if (puzzleId) {
      try {
        await deletePuzzle(puzzleId)
      } catch (err) {
        console.warn('Falha ao deletar puzzle ao sair:', err)
      }
    }
    clearSession()
    navigate('/menu')
  }, [navigate, clearSession, puzzleId])

  // ── Hint ─────────────────────────────────────────────────────────
  const clearHint = useCallback(() => {
    clearTimeout(hintTimerRef.current ?? undefined)
    setHintCellId(null)
    setHintPieceId(null)
  }, [])

  const useHint = () => {
    if (hintsLeft <= 0 || isPaused || isLoading || gameOver) return
    const unhinted = tray.find(p => !hintedPieces.has(p.id))
    if (!unhinted) return
    clearHint()
    setHintsLeft(h => h - 1)
    setHintedPieces(prev => new Set(prev).add(unhinted.id))
    setHintPieceId(unhinted.id)
    const target = board.find(c =>
      c.posicao_x_certa === unhinted.posicao_x_certa &&
      c.posicao_y_certa === unhinted.posicao_y_certa &&
      !c.filled
    )
    if (target) setHintCellId(target.id)
    hintTimerRef.current = setTimeout(() => clearHint(), 3000)
  }

  // ── Vitória (submissão de score com estrelas) ───────────────────
  const handleVictory = useCallback(async () => {
    if (scoreSubmitted) return;
    setScoreSubmitted(true);

    // Calcular estrelas (mesma lógica)
    const baseStars = difficulty === 'facil' ? 1 : difficulty === 'medio' ? 2 : 3;
    const initialHints = HINTS_BY_DIFFICULTY[difficulty] ?? 0;
    const hintsUsed = initialHints - hintsLeft;
    let stars = baseStars;
    if (hintsUsed > 0) stars -= 1;
    if (difficulty === 'medio' && !timeLimitOn) stars -= 1;
    stars = Math.max(stars, 1);

    const baseScore = totalPieces * 10;
    const finalScore = Math.max(0, baseScore - elapsed);

    try {
      // Se for imagem própria, level_id = 0 (indica que não pertence a nenhum nível)
      const submitLevelId = isCustomImage ? 0 : (levelId ?? 0);
      
      await submitScore({
        puzzle_id: puzzleId!,
        level_id: submitLevelId,
        score: finalScore,
        time_seconds: elapsed,
        stars: stars,
        hints_used: hintsUsed,
        time_limit_on: timeLimitOn,
        shuffle_on: shuffleOn,
      });
    } catch (error) {
      console.warn('Falha ao submeter score:', error);
    } finally {
      clearSession();
      navigate('/jogo/vitoria', { state: { stars, levelId: isCustomImage ? null : levelId, isCustomImage } });
    }
  }, [puzzleId, levelId, difficulty, totalPieces, elapsed, hintsLeft, timeLimitOn, shuffleOn, isCustomImage, scoreSubmitted, clearSession, navigate]);

  // ── Reset (com deleção do puzzle antigo) ─────────────────────
  const doReset = () => {
    setConfirmReset(false)
    clearHint()
    clearSession()
    setIsLoading(true)
    setGameOver(false)
    setScoreSubmitted(false)

    const img = imageBase64
    const currentPuzzleId = puzzleId

    if (!img) {
      if (currentPuzzleId) {
        deletePuzzle(currentPuzzleId)
          .catch(err => console.warn('Falha ao deletar puzzle antigo:', err))
          .finally(() => {
            getPuzzleState(currentPuzzleId)
              .then(s => {
                const reset = s.pieces.map(p => ({ ...p, encaixada: false }))
                const limit = TIME_LIMIT_BY_DIFFICULTY[difficulty] || 180
                initializeGame(reset)
                setElapsed(0)
                setHintsLeft(HINTS_BY_DIFFICULTY[difficulty] ?? 3)
                setHintedPieces(new Set())
                setIsPaused(false)
                setTimeRemaining(timeLimitOn ? limit : 999999)
              })
              .catch(() => navigate('/selecao-dificuldade'))
              .finally(() => setIsLoading(false))
          })
      } else {
        navigate('/selecao-dificuldade')
      }
      return
    }

    const cleanBase64 = img.split(',')[1]

    const deletePromise = currentPuzzleId
      ? deletePuzzle(currentPuzzleId).catch(err => {
          console.warn('Falha ao deletar puzzle antigo:', err)
        })
      : Promise.resolve()

    deletePromise
      .then(() => createPuzzle({ image: cleanBase64, difficulty, effect: 'grade' }))
      .then(result => {
        const newId = result.puzzle_id
        const limit = TIME_LIMIT_BY_DIFFICULTY[difficulty] || 180

        setPuzzleId(newId)
        setCurrentPuzzle({
          puzzle_id:  result.puzzle_id,
          difficulty: result.difficulty,
          num_pieces: result.num_pieces,
          pieces:     result.pieces,
        })
        initializeGame(result.pieces)
        setElapsed(0)
        setHintsLeft(HINTS_BY_DIFFICULTY[difficulty] ?? 3)
        setHintedPieces(new Set())
        setIsPaused(false)
        setTimeRemaining(timeLimitOn ? limit : 999999)

        ssSet(SK_PUZZLE_ID, newId)
        ssSet(SK_ELAPSED, '0')
        ssSet(SK_TIME_REMAINING, String(timeLimitOn ? limit : 999999))
        ssSet(SK_HINTS_LEFT, String(HINTS_BY_DIFFICULTY[difficulty] ?? 3))
      })
      .catch(() => {
        if (currentPuzzleId) {
          getPuzzleState(currentPuzzleId)
            .then(s => {
              const reset = s.pieces.map(p => ({ ...p, encaixada: false }))
              const limit = TIME_LIMIT_BY_DIFFICULTY[difficulty] || 180
              initializeGame(reset)
              setElapsed(0)
              setHintsLeft(HINTS_BY_DIFFICULTY[difficulty] ?? 3)
              setHintedPieces(new Set())
              setIsPaused(false)
              setTimeRemaining(timeLimitOn ? limit : 999999)
            })
            .catch(() => navigate('/selecao-dificuldade'))
            .finally(() => setIsLoading(false))
        } else {
          navigate('/selecao-dificuldade')
        }
      })
      .finally(() => setIsLoading(false))
  }

  // ── Devolver todas ao tray (com sincronização backend) ───
  const doReturnAll = useCallback(async () => {
    setConfirmReturnAll(false)
    clearHint()

    const currentBoard = boardRef.current
    const piecesToReturn = currentBoard.filter(c => c.filled && c.pieceId !== null)

    if (piecesToReturn.length === 0) return

    try {
      await Promise.all(
        piecesToReturn.map(c =>
          movePiece({
            puzzle_id: puzzleId!,
            piece_id: c.pieceId!,
            new_x: -1,
            new_y: -1,
          })
        )
      )
    } catch (error) {
      console.error('Erro ao devolver peças para o backend:', error)
    }

    const returned: TrayPiece[] = []
    const newBoard = currentBoard.map(cell => {
      if (cell.filled && cell.pieceId !== null) {
        returned.push({
          id:              cell.pieceId,
          posicao_x_certa: cell.placedPieceX ?? cell.posicao_x_certa,
          posicao_y_certa: cell.placedPieceY ?? cell.posicao_y_certa,
        })
        return { ...cell, filled: false, pieceId: null, placedPieceX: null, placedPieceY: null }
      }
      return cell
    })

    setBoard(newBoard)
    setTray(prev => {
      const merged = [...returned, ...prev]
      return shuffleOn ? shuffleArray(merged) : merged
    })
    setPlacedCount(0)
    setHintedPieces(new Set())
  }, [clearHint, shuffleOn, puzzleId])

  // ── Devolver uma peça ao tray com animação ────
  const returnPieceToTray = useCallback((piece: TrayPiece) => {
    setTray(prev => [piece, ...prev])
    setReturningPieceId(piece.id)
    setTimeout(() => setReturningPieceId(null), 500)
  }, [])

  // ── Drag & Drop ───────────────────────────────
  const placeGhost = (x: number, y: number) => {
    if (!ghostRef.current) return
    ghostRef.current.style.left = (x - 18) + 'px'
    ghostRef.current.style.top  = (y - 18) + 'px'
  }

  const onPointerDown = (
    e: React.PointerEvent,
    pieceOrCell: TrayPiece | { cellId: number; pieceId: number },
    fromBoard = false,
  ) => {
    if (isPaused || isLoading || gameOver) return
    if (dragPiece.current || isDraggingFromBoard.current) return
    e.preventDefault()

    if (fromBoard) {
      const data = pieceOrCell as { cellId: number; pieceId: number }
      const cellSnap = boardRef.current.find(c => c.id === data.cellId)
      if (!cellSnap || !cellSnap.filled) return

      const cur: TrayPiece = {
        id:              data.pieceId,
        posicao_x_certa: cellSnap.placedPieceX!,
        posicao_y_certa: cellSnap.placedPieceY!,
      }

      const startX = e.clientX
      const startY = e.clientY
      const DRAG_THRESHOLD = 8
      let dragStarted = false

      const cleanupEarly = () => {
        document.removeEventListener('pointermove', onEarlyMove, true)
        document.removeEventListener('pointerup',   onEarlyUp,   true)
      }

      const beginDrag = (initX: number, initY: number) => {
        dragStarted = true
        isDraggingFromBoard.current = true
        draggedFromCellId.current   = data.cellId

        setBoard(prev => prev.map(c =>
          c.id === data.cellId
            ? { ...c, filled: false, pieceId: null, placedPieceX: null, placedPieceY: null }
            : c
        ))
        setPlacedCount(prev => prev - 1)

        const ghost = document.createElement('div')
        ghost.className = 'jogo-drag-ghost'
        ghost.style.setProperty('--grid-n', String(N))
        if (imageBase64 && N > 1) {
          const pieceSize = 1 / N
          const col = Math.round(cellSnap.placedPieceX! / pieceSize)
          const row = Math.round(cellSnap.placedPieceY! / pieceSize)
          const s = pieceImageStyle(imageBase64, col, row, N)
          ghost.style.backgroundImage    = s.backgroundImage as string
          ghost.style.backgroundSize     = s.backgroundSize as string
          ghost.style.backgroundPosition = s.backgroundPosition as string
          ghost.style.backgroundRepeat   = 'no-repeat'
        } else {
          ghost.style.background = 'var(--accent)'
        }
        ghost.style.left = (initX - 18) + 'px'
        ghost.style.top  = (initY - 18) + 'px'
        document.body.appendChild(ghost)
        ghostRef.current  = ghost
        dragPiece.current = cur

        document.addEventListener('pointermove', onMove, { passive: false })
        document.addEventListener('pointerup',   onUp)
        document.addEventListener('pointercancel', onCancel)
      }

      const onEarlyMove = (ev: PointerEvent) => {
        if (Math.abs(ev.clientX - startX) > DRAG_THRESHOLD || Math.abs(ev.clientY - startY) > DRAG_THRESHOLD) {
          cleanupEarly()
          beginDrag(ev.clientX, ev.clientY)
        }
      }

      const onEarlyUp = () => {
        cleanupEarly()
      }

      document.addEventListener('pointermove', onEarlyMove, true)
      document.addEventListener('pointerup',   onEarlyUp,   true)

      const onMove = (ev: PointerEvent) => {
        placeGhost(ev.clientX, ev.clientY)
        const els = document.elementsFromPoint(ev.clientX, ev.clientY)
        let found: Element | null = null
        for (const el of els) { const c = el.closest?.('[data-cellid]'); if (c) { found = c; break } }
        if (found) {
          const id   = +(found as HTMLElement).dataset.cellid!
          const hov  = boardRef.current.find(c => c.id === id)
          if (hov && !hov.filled) {
            setOverCell(id)
            if (ghostRef.current) ghostRef.current.classList.remove('ghost-leaving')
            return
          }
        }
        setOverCell(null)
        if (ghostRef.current) ghostRef.current.classList.add('ghost-leaving')
      }

      const onUp = async (ev: PointerEvent) => {
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup',   onUp)
        document.removeEventListener('pointercancel', onCancel)
        ghostRef.current?.remove(); ghostRef.current = null
        setOverCell(null); setRemovingCellId(null)
        const fromCellId = draggedFromCellId.current
        dragPiece.current = null; isDraggingFromBoard.current = false; draggedFromCellId.current = null

        if (!dragStarted || fromCellId === null) return

        const els = document.elementsFromPoint(ev.clientX, ev.clientY)
        let found: Element | null = null
        for (const el of els) { const c = el.closest?.('[data-cellid]'); if (c) { found = c; break } }

        if (found) {
          const cellId     = +(found as HTMLElement).dataset.cellid!
          const targetCell = boardRef.current.find(c => c.id === cellId)
          if (targetCell && !targetCell.filled) {
            try {
              const result = await movePiece({
                puzzle_id: puzzleId!,
                piece_id:  cur.id,
                new_x:     targetCell.posicao_x_certa,
                new_y:     targetCell.posicao_y_certa,
              })
              if (result.puzzle_completo) {
                await handleVictory()
                return
              }
            } catch { /* silencioso */ }
            setBoard(prev => prev.map(c =>
              c.id === cellId
                ? { ...c, filled: true, pieceId: cur.id, placedPieceX: cur.posicao_x_certa, placedPieceY: cur.posicao_y_certa }
                : c
            ))
            setPlacedCount(prev => prev + 1)
            return
          }
        }

        try {
          await movePiece({ puzzle_id: puzzleId!, piece_id: cur.id, new_x: -1, new_y: -1 })
        } catch { /* silencioso */ }
        returnPieceToTray(cur)
      }

      const onCancel = () => {
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup',   onUp)
        document.removeEventListener('pointercancel', onCancel)
        ghostRef.current?.remove(); ghostRef.current = null
        dragPiece.current = null; isDraggingFromBoard.current = false; draggedFromCellId.current = null
        setOverCell(null); setRemovingCellId(null)
        if (dragStarted) {
          returnPieceToTray(cur)
        }
      }

    } else {
      const piece = pieceOrCell as TrayPiece
      dragPiece.current = piece

      const ghost = document.createElement('div')
      ghost.className = 'jogo-drag-ghost'
      ghost.style.setProperty('--grid-n', String(N))
      if (imageBase64 && N > 1) {
        const pieceSize = 1 / N
        const c = Math.round(piece.posicao_x_certa / pieceSize)
        const r = Math.round(piece.posicao_y_certa / pieceSize)
        const s = pieceImageStyle(imageBase64, c, r, N)
        ghost.style.backgroundImage    = s.backgroundImage as string
        ghost.style.backgroundSize     = s.backgroundSize as string
        ghost.style.backgroundPosition = s.backgroundPosition as string
        ghost.style.backgroundRepeat   = 'no-repeat'
      } else {
        ghost.style.background = 'var(--accent)'
      }
      ghost.style.left = (e.clientX - 18) + 'px'
      ghost.style.top  = (e.clientY - 18) + 'px'
      document.body.appendChild(ghost)
      ghostRef.current = ghost

      const onMove = (ev: PointerEvent) => {
        placeGhost(ev.clientX, ev.clientY)
        const els = document.elementsFromPoint(ev.clientX, ev.clientY)
        let found: Element | null = null
        for (const el of els) { const c = el.closest?.('[data-cellid]'); if (c) { found = c; break } }
        if (found) {
          const id   = +(found as HTMLElement).dataset.cellid!
          const cell = boardRef.current.find(c => c.id === id)
          if (cell && !cell.filled) { setOverCell(id); return }
        }
        setOverCell(null)
      }

      const onUp = async (ev: PointerEvent) => {
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onUp)
        document.removeEventListener('pointercancel', onCancel)
        ghostRef.current?.remove(); ghostRef.current = null
        setOverCell(null)
        const cur = dragPiece.current; dragPiece.current = null
        if (!cur) return

        const els = document.elementsFromPoint(ev.clientX, ev.clientY)
        let found: Element | null = null
        for (const el of els) { const c = el.closest?.('[data-cellid]'); if (c) { found = c; break } }
        if (!found) return

        const cellId = +(found as HTMLElement).dataset.cellid!
        const cell   = boardRef.current.find(c => c.id === cellId)

        if (cell && !cell.filled) {
          try {
            const result = await movePiece({
              puzzle_id: puzzleId!,
              piece_id:  cur.id,
              new_x:     cell.posicao_x_certa,
              new_y:     cell.posicao_y_certa,
            })
            if (result.puzzle_completo) {
              await handleVictory()
              return
            }
          } catch { /* silencioso */ }

          setBoard(prev => prev.map(c =>
            c.id === cellId
              ? { ...c, filled: true, pieceId: cur.id, placedPieceX: cur.posicao_x_certa, placedPieceY: cur.posicao_y_certa }
              : c
          ))
          setTray(prev => prev.filter(p => p.id !== cur.id))
          setPlaceCell(cellId)
          setTimeout(() => setPlaceCell(null), 400)
          setPlacedCount(placedCountRef.current + 1)
        }
      }

      const onCancel = () => {
        document.removeEventListener('pointermove', onMove)
        document.removeEventListener('pointerup', onUp)
        document.removeEventListener('pointercancel', onCancel)
        ghostRef.current?.remove(); ghostRef.current = null
        dragPiece.current = null; setOverCell(null)
      }

      document.addEventListener('pointermove', onMove, { passive: false })
      document.addEventListener('pointerup', onUp)
      document.addEventListener('pointercancel', onCancel)
    }
  }

  // ── Verificação de vitória (fallback local) ───
  useEffect(() => {
    if (placedCount === totalPieces && totalPieces > 0 && !gameOver && !scoreSubmitted) {
      const allCorrect = board.every(c => {
        if (!c.filled || c.pieceId === null) return false
        const px = c.placedPieceX; const py = c.placedPieceY
        if (px === null || py === null) return false
        return Math.abs(c.posicao_x_certa - px) < 0.001 && Math.abs(c.posicao_y_certa - py) < 0.001
      })
      if (allCorrect) {
        handleVictory()
      }
    }
  }, [placedCount, totalPieces, board, gameOver, scoreSubmitted, handleVictory])

  // ── Tela de game over ─────────────────────────
  if (gameOver) {
    return (
      <div className="jogo-page">
        <div className="jogo-modal-overlay">
          <div className="jogo-modal" style={{ maxWidth: 400 }}>
            <div style={{ fontSize: 48, textAlign: 'center' }}>⏰</div>
            <p className="jogo-modal-text" style={{ textAlign: 'center' }}>
              Tempo esgotado!<br />
              <span>Você colocou {placedCount} de {totalPieces} peças.</span>
            </p>
            <div className="jogo-modal-actions" style={{ justifyContent: 'center' }}>
              <button className="jogo-modal-btn confirm" onClick={doReset}>🔄 Tentar Novamente</button>
              <button className="jogo-modal-btn cancel" onClick={() => { clearSession(); navigate('/menu') }}>🏠 Menu</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="jogo-page">
        <div className="jogo-loading">
          <div style={{ fontSize: 48 }}>🧩</div>
          <div>Carregando o quebra-cabeça...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="jogo-page">

      {/* ── HUD ── */}
      <div className="jogo-hud">
        <div className="jogo-hud-item">
          <div className={`jogo-hud-val ${timeWarning ? 'time-warning' : ''}`}>
            {timeLimitOn ? fmt(timeRemaining) : '∞'}
          </div>
          <div className="jogo-hud-label">{timeLimitOn ? '⏱ Restante' : '⏱ Ilimitado'}</div>
        </div>
        <img src="/assets/icone.png" alt="ícone" width={32} height={32} style={{ objectFit: 'contain' }} />
        <div className="jogo-hud-item">
          <div className="jogo-hud-val">{placedCount}/{totalPieces}</div>
          <div className="jogo-hud-label">Peças</div>
        </div>
        <div className="jogo-hud-item">
          <div className="jogo-hud-val" style={{ color: 'var(--accent2)' }}>💡 {hintsLeft}</div>
          <div className="jogo-hud-label">Dicas</div>
        </div>
        <div className="jogo-hud-item">
          <div className="jogo-hud-val jogo-pause-btn" style={{ color: 'var(--accent2)' }} onClick={handlePause}>⏸</div>
          <div className="jogo-hud-label">Pause</div>
        </div>
      </div>

      {/* ── GAME LAYOUT ── */}
      <div className="jogo-layout">
        <div className="jogo-canvas-area">
          <div className="jogo-board" style={{ gridTemplateColumns: `repeat(${N}, 1fr)` }}>
            {board.map(cell => {
              const pieceSize = 1 / N
              const renderX = cell.filled ? (cell.placedPieceX ?? cell.posicao_x_certa) : null
              const renderY = cell.filled ? (cell.placedPieceY ?? cell.posicao_y_certa) : null
              const col = renderX !== null ? Math.round(renderX / pieceSize) : 0
              const row = renderY !== null ? Math.round(renderY / pieceSize) : 0

              let cls = 'jogo-cell'
              if (cell.filled)                cls += ' placed'
              else                            cls += ' target'
              if (overCell === cell.id)       cls += ' over-cell'
              if (placeCell === cell.id)      cls += ' place-anim'
              if (hintCellId === cell.id)     cls += ' hint'
              if (removingCellId === cell.id) cls += ' remove-anim'

              const style: React.CSSProperties = cell.filled && renderX !== null && imageBase64 && N > 1
                ? { ...pieceImageStyle(imageBase64, col, row, N), borderColor: 'transparent' }
                : {}

              return (
                <div
                  key={cell.id}
                  className={cls}
                  style={style}
                  data-cellid={cell.id}
                  onPointerDown={e => {
                    if (!cell.filled || cell.pieceId === null) return
                    onPointerDown(e, { cellId: cell.id, pieceId: cell.pieceId }, true)
                  }}
                  title={cell.filled ? 'Arraste para mover' : undefined}
                />
              )
            })}
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="jogo-sidebar">
          <div className={`jogo-btn warn${hintsLeft <= 0 ? ' off' : ''}`} onClick={useHint}>💡<br />Dica</div>
          <div className="jogo-btn warn" onClick={() => setConfirmReset(true)}>🔄<br />Reiniciar</div>
          <div
            className={`jogo-btn warn${placedCount === 0 ? ' off' : ''}`}
            onClick={() => placedCount > 0 && setConfirmReturnAll(true)}
          >↩️<br />Devolver</div>
          <div className="jogo-progress-section">
            <div className="jogo-progress-bar">
              <div className="jogo-progress-fill" style={{ width: pct + '%' }} />
            </div>
            <div className="jogo-progress-label">{pct}%</div>
          </div>
        </div>
      </div>

      {/* ── TRAY ── */}
      <div className="jogo-tray">
        <div className="jogo-tray-label">Peças:</div>
        <div className="jogo-tray-scroll">
          {tray.map(piece => {
            const pieceSize = 1 / N
            const col = Math.round(piece.posicao_x_certa / pieceSize)
            const row = Math.round(piece.posicao_y_certa / pieceSize)
            const imgStyle = imageBase64 && N > 1
              ? pieceImageStyle(imageBase64, col, row, N)
              : { background: 'var(--accent)' }
            return (
              <div
                key={piece.id}
                className={`jogo-tray-piece${hintPieceId === piece.id ? ' hint-piece' : ''}${returningPieceId === piece.id ? ' returning' : ''}`}
                style={imgStyle}
                data-pid={piece.id}
                onPointerDown={e => onPointerDown(e, piece, false)}
              />
            )
          })}
        </div>
      </div>

      {isPaused && (
        <Pause
          elapsedSeconds={elapsed}
          piecesPlaced={placedCount}
          totalPieces={totalPieces}
          onContinue={handleResume}
          onRestart={handleRestartFromPause}
          onExitToMenu={handleExitToMenu}
        />
      )}

      {confirmReset && (
        <div className="jogo-modal-overlay">
          <div className="jogo-modal">
            <p className="jogo-modal-text">
              Reiniciar o jogo?<br />
              <span>Um novo quebra-cabeça será criado e o atual será descartado.</span>
            </p>
            <div className="jogo-modal-actions">
              <button className="jogo-modal-btn cancel" onClick={() => setConfirmReset(false)}>Cancelar</button>
              <button className="jogo-modal-btn confirm" onClick={doReset}>Reiniciar</button>
            </div>
          </div>
        </div>
      )}

      {confirmReturnAll && (
        <div className="jogo-modal-overlay">
          <div className="jogo-modal">
            <p className="jogo-modal-text">
              Devolver todas as peças?<br />
              <span>As {placedCount} peça{placedCount !== 1 ? 's' : ''} no tabuleiro voltarão ao tray.</span>
            </p>
            <div className="jogo-modal-actions">
              <button className="jogo-modal-btn cancel" onClick={() => setConfirmReturnAll(false)}>Cancelar</button>
              <button className="jogo-modal-btn confirm" onClick={doReturnAll}>Devolver</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}