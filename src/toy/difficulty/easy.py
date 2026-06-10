from .base import Difficulty


class EasyDifficulty(Difficulty):
    def get_num_pieces(self) -> int:
        return 25
