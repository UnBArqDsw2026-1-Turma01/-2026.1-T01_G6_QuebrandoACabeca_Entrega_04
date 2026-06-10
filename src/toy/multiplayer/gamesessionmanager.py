from toy.game.move import Move
from toy.game.puzzleboard import PuzzleBoard
from toy.multiplayer.gamesession import GameSession


# singleton via módulo, ou seja, basta importar o módulo para ter acesso à instância global do GameSessionManager
class GameSessionManager:
    def __init__(self):
        self.sessions: dict[str, GameSession] = {}

    def create_session(self, session_id: str, players: list, board) -> GameSession:
        if session_id in self.sessions:
            raise ValueError(f"Session with id {session_id} already exists.")
        session = GameSession(session_id, players, board)
        self.sessions[session_id] = session
        return session

    def get_session(self, session_id: str) -> GameSession:
        if session_id not in self.sessions:
            raise ValueError(f"Session with id {session_id} does not exist.")
        return self.sessions[session_id]

    def delete_session(self, session_id: str):
        if session_id not in self.sessions:
            raise ValueError(f"Session with id {session_id} does not exist.")
        del self.sessions[session_id]

    def send_move(self, session_id: str, move: Move):
        session = self.get_session(session_id)
        could_move = session.board.try_move_piece(move)
        if not could_move:
            # Notificar o jogador de que o movimento é inválido
            # TODO: Implementar notificação de movimento inválido para o jogador
            pass
        else:
            # Notificar os outros jogadores do movimento realizado
            # TODO: Implementar notificação de movimento válido para os outros jogadores
            pass
