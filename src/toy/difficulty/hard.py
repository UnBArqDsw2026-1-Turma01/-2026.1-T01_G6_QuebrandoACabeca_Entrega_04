from .base import Difficulty


class HardDifficulty(Difficulty):
    def get_num_pieces(self) -> int:
        return 64
