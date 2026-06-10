from PIL import Image


class Piece:
    def __init__(
        self,
        image: Image.Image,
        cropRect: tuple[int, int, int, int],
        boardPos: tuple[int, int],
    ):
        """
        Initializes a Piece with the given image, crop rectangle, and board position (in piece coordinates).
        """
        self.image = image
        self.cropRect = cropRect
        self.boardPos = boardPos
