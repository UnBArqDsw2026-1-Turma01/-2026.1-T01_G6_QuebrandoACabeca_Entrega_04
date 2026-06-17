from .base import Difficulty


class EasyDifficulty(Difficulty):
    def get_num_pieces(self) -> int:
        return 25

    def get_grid_size(self) -> int:
        return 5