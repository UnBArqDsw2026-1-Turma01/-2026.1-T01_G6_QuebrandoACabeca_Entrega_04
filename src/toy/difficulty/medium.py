from .base import Difficulty


class MediumDifficulty(Difficulty):
    def get_num_pieces(self) -> int:
        return 36
