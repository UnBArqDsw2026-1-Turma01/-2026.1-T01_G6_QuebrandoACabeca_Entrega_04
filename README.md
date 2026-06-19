<div align="center">
<br>
<img src="docs/assets/icone.png" alt="Logo Quebrando A Cabeça" width="96"/>
<br>

# 🧩 Quebrando A Cabeça

*Transformando fotografias em experiências interativas de quebra-cabeça*

</div>

---

## 📌 Sobre o Projeto

O **Quebrando A Cabeça** é um software desenvolvido pelo Grupo G6 com o objetivo de gerar imagens com aspecto visual de quebra-cabeça a partir de fotos fornecidas pelo usuário. Como escopo estendido, o sistema prevê um ambiente interativo para a montagem virtual dos quebra-cabeças gerados.

O projeto é requisito de avaliação da disciplina **Arquitetura & Desenho de Software (FGA0208)**, ofertada no semestre 2026.1 pela Faculdade de Ciências e Tecnologias (FCTE) da Universidade de Brasília (UnB), sob supervisão da **Prof.ª Milene Serrano**.

---

## 👥 Equipe

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/Dexmachi">
        <img src="https://avatars.githubusercontent.com/Dexmachi" width="100" height="100" style="border-radius:50%"/><br/>
        <sub><b>Caio Rocha</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Edumorais08">
        <img src="https://avatars.githubusercontent.com/Edumorais08" width="100" height="100" style="border-radius:50%"/><br/>
        <sub><b>Eduardo Morais</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/fabioaletorres">
        <img src="https://avatars.githubusercontent.com/fabioaletorres" width="100" height="100" style="border-radius:50%"/><br/>
        <sub><b>Fábio Torres</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/JoaoEduardoP">
        <img src="https://avatars.githubusercontent.com/JoaoEduardoP" width="100" height="100" style="border-radius:50%"/><br/>
        <sub><b>João Eduardo</b></sub>
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/MrBolt2005">
        <img src="https://avatars.githubusercontent.com/MrBolt2005" width="100" height="100" style="border-radius:50%"/><br/>
        <sub><b>João Felipe</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Lucas-Ricarte">
        <img src="https://avatars.githubusercontent.com/Lucas-Ricarte" width="100" height="100" style="border-radius:50%"/><br/>
        <sub><b>Lucas Ricarte</b></sub>
      </a>
    </td>
  </tr>
</table>

---

## 🛠️ Tecnologias

O projeto é composto por dois núcleos principais:

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/) + [SQLAlchemy](https://www.sqlalchemy.org/) + SQLite, escrito em Python 3.12
- **Frontend**: [React](https://reactjs.org/) + TypeScript, com [React Router](https://reactrouter.com/) e CSS puro
- **Infraestrutura**: [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) para orquestração e execução simplificada
- **Documentação**: [Docsify](https://docsify.js.org/)

---

## 🧩 Executando a Aplicação

### Com Docker (recomendado)

1. Certifique-se de ter o **Docker** e o **Docker Compose** instalados.

2. Clone o repositório e acesse a pasta raiz:
```sh
git clone <url-do-repositorio>
cd QuebraCabeca/-2026.1-T01_G6_QuebrandoACabeca_Entrega_04
```

3. Crie o diretório de dados (opcional, para persistência do banco):
```sh
mkdir -p backend/data
```

4. Construa e inicie os containers:
```sh
docker-compose up --build
```

- Backend disponível em **http://localhost:8000** (docs interativos em `/docs`)
- Frontend disponível em **http://localhost:3000**

5. Para parar os containers:
```sh
docker-compose down
```

6. Para remover também os volumes (banco de dados):
```sh
docker-compose down -v
```

---

### Sem Docker (desenvolvimento local)

#### Frontend

> Pré-requisito: **Node.js 18+** instalado.

```sh
cd frontend
npm install
npm start
```

Acesse em **http://localhost:3000**.

> 💡 O frontend espera o backend em `http://localhost:8000` por padrão. Para alterar, defina a variável `REACT_APP_API_URL`.

---

#### Backend

> Pré-requisito: **Python 3.12+** e **pip** instalados.

```sh
cd backend/app
```

Criar e ativar um ambiente virtual (opcional, mas recomendado):

```sh
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
```

Instalar as dependências:

```sh
pip install -r ../requirements.txt
```

Criar o diretório de dados para o banco SQLite:

```sh
mkdir -p data
```

Iniciar o servidor:

```sh
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend disponível em **http://localhost:8000** (documentação interativa em `/docs`).

---

## 📜 Histórico de Versões

| Versão | Data       | Alterações                              | Autor         |
|--------|------------|-----------------------------------------|---------------|
| 1.0    | 08/06/2026 | Inserir o template inicial da página    | Lucas Ricarte |
| 1.1    | 10/06/2026 | Ajustar o template inicial da página    | João Eduardo  |
| 1.2    | 18/06/2026 | Incluir tecnologias novas               | João Eduardo  |

---

<div align="center">
<br>

**Arquitetura & Desenho de Software · FGA0208 · 2026.1**

Universidade de Brasília — Faculdade de Ciências e Tecnologias

*Prof.ª Milene Serrano*

</div>