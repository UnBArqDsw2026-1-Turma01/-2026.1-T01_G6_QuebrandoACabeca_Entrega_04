from .base import Difficulty


class HardDifficulty(Difficulty):
    def get_num_pieces(self) -> int:
        return 64

    def get_grid_size(self) -> int:
        return 8