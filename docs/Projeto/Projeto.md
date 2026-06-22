# 🧩 Quebrando a Cabeça – Projeto Final

## 📌 Visão Geral

**Quebrando a Cabeça** é um jogo de quebra-cabeça digital desenvolvido como trabalho final da disciplina **Arquitetura & Desenho de Software** (FGA0208) – Universidade de Brasília (UnB), sob orientação da Prof.ª Milene Serrano.

O sistema permite que o usuário:

- Selecione entre 4 níveis com imagens temáticas.
- Escolha a dificuldade (Fácil, Médio, Difícil) com regras próprias de embaralhamento e temporizador.
- Monte o quebra-cabeça arrastando as peças do tray para o tabuleiro.
- Receba estrelas (1 a 3) com base no desempenho (dificuldade, dicas usadas, ativação do timer).
- Avance progressivamente pelos níveis, desbloqueando o próximo ao completar o anterior.
- Envie sua própria imagem para criar um quebra-cabeça personalizado (sem afetar a progressão).
- Consulte o ranking global (com soma de pontuações) e o histórico de partidas.
- Rejogue partidas anteriores (apenas níveis, não imagens próprias).

---

## 👥 Equipe

| Nome | GitHub |
|------|--------|
| Caio Rocha | [@Dexmachi](https://github.com/Dexmachi) |
| Eduardo Morais | [@Edumorais08](https://github.com/Edumorais08) |
| Fábio Torres | [@fabioaletorres](https://github.com/fabioaletorres) |
| João Eduardo | [@JoaoEduardoP](https://github.com/JoaoEduardoP) |
| João Felipe | [@MrBolt2005](https://github.com/MrBolt2005) |
| Lucas Ricarte | [@Lucas-Ricarte](https://github.com/Lucas-Ricarte) |

---

## 🎥 Vídeo de Demonstração

<p align="center">
  <video width="100%" controls>
    <source src="./assets/Projeto.mp4" type="video/mp4">
  </video>
</p>

---

## ⚙️ Como Executar

### Com Docker (recomendado)

1. Certifique-se de ter o [Docker](https://www.docker.com/) e o [Docker Compose](https://docs.docker.com/compose/) instalados.

2. Clone o repositório e acesse a pasta raiz:

   ```bash
   git clone <url-do-repositorio>
   cd QuebraCabeca/-2026.1-T01_G6_QuebrandoACabeca_Entrega_04
   ```

3. Execute:

   ```bash
   docker-compose up --build
   ```

4. Acesse:
   - **Frontend:** http://localhost:3000
   - **Backend (Swagger):** http://localhost:8000/docs

---

### Sem Docker (desenvolvimento local)

#### Backend (FastAPI)


> Pré-requisito: **Python 3.12+** e **pip** instalados.

```sh
cd backend/app
```

Instalar as dependências:

```sh
pip install -r ../requirements.txt
```

Iniciar o servidor:

```sh
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend disponível em **http://localhost:8000** (documentação interativa em `/docs`).

---

#### Frontend (React)

> Pré-requisito: **Node.js 18+** instalado.

```bash
cd frontend
npm install
npm start
```

Acesse em **http://localhost:3000**.

> 💡 O frontend espera o backend em `http://localhost:8000` por padrão. Para alterar, defina a variável `REACT_APP_API_URL`.

---

## ✨ Funcionalidades Principais

- 4 níveis com imagens exclusivas, desbloqueio progressivo.
- Dificuldades (Fácil, Médio, Difícil) com regras de shuffle e timer.
- Sistema de estrelas (1 a 3) baseado em:
  - Dificuldade (Fácil = 1, Médio = 2, Difícil = 3)
  - Dicas usadas (cada dica reduz 1 estrela)
  - Timer desativado no Médio (reduz 1 estrela)
- Upload de imagem própria (não afeta progressão).
- Ranking global com soma de todas as pontuações.
- Histórico de partidas com opção de rejogar níveis.
- Tutorial interativo explicando o sistema.
- Configurações *(em desenvolvimento)*.

---

## 🛠️ Tecnologias Utilizadas

| Subsistema | Tecnologias |
|------------|-------------|
| Backend | Python 3.12, FastAPI, SQLAlchemy, SQLite, Uvicorn, Pydantic |
| Frontend | React 18, TypeScript, React Router DOM, CSS Modules, Context API |
| Padrões GoF | Builder, Factory, Composite, Strategy |
| Infraestrutura | Docker, Docker Compose |

---

## 🚀 Evidência de Execução

Os logs abaixo foram capturados durante uma sessão real com `docker-compose up`, evidenciando a inicialização dos serviços e o fluxo completo de uma partida via API.

### Inicialização dos contêineres

```
2026-06-22 09:42:03 puzzle-backend   | INFO:     Will watch for changes in these directories: ['/app']
2026-06-22 09:42:04 puzzle-backend   | INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
2026-06-22 09:42:04 puzzle-backend   | INFO:     Started reloader process [1] using WatchFiles
2026-06-22 09:42:06 puzzle-backend   | INFO:     Started server process [8]
2026-06-22 09:42:06 puzzle-backend   | INFO:     Waiting for application startup.
2026-06-22 09:42:06 puzzle-backend   | INFO:     Application startup complete.
```

```
2026-06-22 09:42:16 puzzle-frontend  | > frontend@0.1.0 start
2026-06-22 09:42:16 puzzle-frontend  | > react-scripts start
2026-06-22 09:42:22 puzzle-frontend  | Compiled successfully!
2026-06-22 09:42:22 puzzle-frontend  |
2026-06-22 09:42:22 puzzle-frontend  |   Local:            http://localhost:3000
2026-06-22 09:42:22 puzzle-frontend  |   On Your Network:  http://172.19.0.3:3000
2026-06-22 09:42:22 puzzle-frontend  |
2026-06-22 09:42:22 puzzle-frontend  | webpack compiled successfully
2026-06-22 09:42:22 puzzle-frontend  | No issues found.
```

### Fluxo de autenticação e partida

```
# Registro (usuário já existia → 409 Conflict, comportamento esperado)
2026-06-22 09:43:07 puzzle-backend   | INFO:     172.19.0.1:59032 - "POST /auth/register HTTP/1.1" 409 Conflict

# Login bem-sucedido
2026-06-22 09:43:22 puzzle-backend   | INFO:     172.19.0.1:59038 - "POST /auth/login HTTP/1.1" 200 OK

# Consulta de progresso dos níveis
2026-06-22 09:43:24 puzzle-backend   | INFO:     172.19.0.1:33964 - "GET /score/levels/progress HTTP/1.1" 200 OK

# Criação do puzzle
2026-06-22 09:43:41 puzzle-backend   | INFO:     172.19.0.1:39252 - "POST /puzzle/create HTTP/1.1" 201 Created

# Movimentação das peças (27 movimentos registrados)
2026-06-22 09:43:43 puzzle-backend   | INFO:     172.19.0.1:39262 - "POST /puzzle/move HTTP/1.1" 200 OK
                   ...
2026-06-22 09:44:15 puzzle-backend   | INFO:     172.19.0.1:39262 - "POST /puzzle/move HTTP/1.1" 200 OK

# Submissão da pontuação
2026-06-22 09:44:15 puzzle-backend   | INFO:     172.19.0.1:52878 - "POST /score/submit HTTP/1.1" 201 Created

# Logout
2026-06-22 09:44:18 puzzle-backend   | INFO:     172.19.0.1:39262 - "POST /auth/logout HTTP/1.1" 200 OK
```

---

## 🔗 Links Úteis

- [Repositório no GitHub](https://github.com/UnBArqDsw2026-1-Turma01/-2026.1-T01_G6_QuebrandoACabeca_Entrega_04)
- [Documentação do DAS (Arquitetura)](../ArquiteturaReutilizacao/4.1.DAS.md)
- [Documento de Reutilização](../ArquiteturaReutilizacao/4.2.ReutilizacaoDeSoftware.md)

---

<p align="center">
  <strong>Arquitetura & Desenho de Software · FGA0208 · 2026.1</strong><br>
  Universidade de Brasília — Faculdade de Ciências e Tecnologias em Engenharia<br>
  Prof.ª Milene Serrano
</p>