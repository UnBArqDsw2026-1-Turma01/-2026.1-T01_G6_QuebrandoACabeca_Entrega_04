import { Button } from '../../../components/common/Button'
import { formatTime } from '../../../utils/formaters'
import './Pause.css'

interface PauseProps {
  elapsedSeconds: number
  piecesPlaced: number
  totalPieces: number
  onContinue: () => void
  onRestart: () => void
  onExitToMenu: () => void
}

export default function Pause({
  elapsedSeconds,
  piecesPlaced,
  totalPieces,
  onContinue,
  onRestart,
  onExitToMenu,
}: PauseProps) {
  const progressPercent = totalPieces > 0 ? Math.round((piecesPlaced / totalPieces) * 100) : 0

  return (
    <div className="jogo-modal-overlay">
      <div className="jogo-modal pause-modal">
        <div className="pause-icon">⏸</div>

        <p className="jogo-modal-text">
          Pausado
          <br />
          <span>
            {formatTime(elapsedSeconds)} decorridos · {piecesPlaced}/{totalPieces} peças colocadas
          </span>
        </p>

        <div className="jogo-progress-bar">
          <div className="jogo-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="pause-actions">
          <Button variant="primary" onClick={onContinue}>
            ▶ Continuar
          </Button>
          <Button variant="secondary" onClick={onRestart}>
            🔄 Reiniciar
          </Button>
          <Button variant="danger" onClick={onExitToMenu}>
            🚪 Sair para o Menu
          </Button>
        </div>
      </div>
    </div>
  )
}