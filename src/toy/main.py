if __name__ == "__main__":
    import sys

    from builder.construtor_dificil import ConstrutorDificil
    from builder.construtor_facil import ConstrutorFacil
    from builder.construtor_medio import ConstrutorMedio
    from builder.director import Director
    from composite.composite import Composite
    from difficulty.factory import get_difficulty
    from dtos import GetToyDifficultyPayload
    from strategy.efeito_grade_quadricular import EfeitoGradeQuadricular
    from strategy.efeito_jigsaw import EfeitoJigsaw
    from strategy.efeito_qb import EfeitoQB
    from strategy.grade_quadricular import GradeQuadricular

    BUILDERS = {
        "easy": ConstrutorFacil,
        "medium": ConstrutorMedio,
        "hard": ConstrutorDificil,
    }

    GRADES = {
        "easy": 5,
        "medium": 6,
        "hard": 8,
    }

    selected_difficulty = sys.argv[1] if len(sys.argv) > 1 else "easy"

    # Difficulty
    dto = GetToyDifficultyPayload(difficulty=selected_difficulty)
    result_difficulty = get_difficulty(dto)
    if not result_difficulty.success:
        for error in result_difficulty.error:
            print(f"Error: {error}")
        sys.exit(1)

    if not result_difficulty.data:
        print("Error: Difficulty data is missing.")
        sys.exit(1)

    difficulty = result_difficulty.data
    print(f"Dificuldade Selecionada: {difficulty.get_difficulty_level()}")
    print(f"Número de Peças: {difficulty.get_num_pieces()}")

    # Builder
    builder_class = BUILDERS.get(selected_difficulty, ConstrutorFacil)
    result_builder = Director().criar_quebra_cabeca(builder_class())
    if not result_builder.success:
        for error in result_builder.error:
            print(f"Error: {error}")
        sys.exit(1)

    if not result_builder.data:
        print("Error: Builder data is missing.")
        sys.exit(1)

    qc = result_builder.data
    print(f"Quebra-cabeça: {qc}")

    # Composite — encaixa as duas primeiras peças num grupo
    peca_1, peca_2 = qc.pecas[0], qc.pecas[1]
    peca_1.posicao_x, peca_1.posicao_y = peca_1.posicao_x_certa, peca_1.posicao_y_certa
    peca_2.posicao_x, peca_2.posicao_y = peca_2.posicao_x_certa, peca_2.posicao_y_certa

    grupo = Composite()
    grupo.adicionar(peca_1)
    grupo.adicionar(peca_2)
    print(f"Grupo encaixado: {grupo.verificar_colisao()}")

    # Strategy — imagem simulada com tamanho da grade da dificuldade
    tamanho = GRADES.get(selected_difficulty, 5)
    imagem_simulada = [
        [i * tamanho + j for j in range(tamanho)] for i in range(tamanho)
    ]

    efeito_qb = EfeitoQB()
    for estrategia in [EfeitoGradeQuadricular(), EfeitoJigsaw(), GradeQuadricular()]:
        efeito_qb.set_efeito(estrategia)
        resultado = efeito_qb.aplicar_efeito(imagem_simulada)
        print(
            f"Efeito aplicado: {efeito_qb.escolher_efeito()} → {len(resultado)}x{len(resultado[0])} pixels"
        )
