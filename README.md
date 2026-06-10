<div align="center">
<br>
<img src="docs/assets/icone.png" alt="Logo Quebrando A Cabeça" width="96"/>
<br>
🧩 Quebrando A Cabeça

Transformando fotografias em experiências interativas de quebra-cabeça
</div>

## 📌 Sobre o Projeto
O Quebrando A Cabeça é um software desenvolvido pelo Grupo G6 com o objetivo de gerar imagens com aspecto visual de quebra-cabeça a partir de fotos fornecidas pelo usuário. Como escopo estendido, o sistema prevê um ambiente interativo para a montagem virtual dos quebra-cabeças gerados.
O projeto é requisito de avaliação da disciplina Arquitetura & Desenho de Software (FGA0208), ofertada no semestre 2026.1 pela Faculdade de Ciências e Tecnologias (FCTE) da Universidade de Brasília (UnB), sob supervisão da Prof.ª Milene Serrano.

## 👥 Equipe
<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/Dexmachi">
        <img src="https://avatars.githubusercontent.com/u/Dexmachi" width="100" height="100" style="border-radius:50%"/><br/>
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

## 🛠️ Tecnologia

A documentação é gerada com **[Docsify](https://docsify.js.org/)** — converte arquivos Markdown em site de documentação sem build, renderizando tudo diretamente no navegador.

### Pré-requisitos

> [Node.js](https://nodejs.org/) instalado na máquina.

### 1 · Instalar o Docsify CLI

```sh
npm i docsify-cli -g
```

### 2 · Executar localmente

```sh
docsify serve ./docs
```

Acesse em: **http://localhost:3000**

## 🧩 Executando o Frontend

O coração interativo do projeto — a interface onde os quebra-cabeças ganham vida.

### Pré-requisitos

> [Node.js](https://nodejs.org/) instalado na máquina.

### 1 · Entrar na pasta do frontend

```sh
cd frontend
```

### 2 · Instalar as dependências

```sh
npm install
```

### 3 · Iniciar o servidor de desenvolvimento

```sh
npm start
```

Acesse em: **http://localhost:3001**

> 💡 Caso a porta `3001` já esteja em uso, o React sugerirá automaticamente a próxima disponível.

## ⚙️ Executando o Backend

O núcleo de processamento do projeto — responsável pela geração dos quebra-cabeças.

### Pré-requisitos

> [Python 3](https://www.python.org/) instalado na máquina.

```sh
# Verifique a instalação
python3 --version
```

### 1 · Entrar na pasta do backend

```sh
cd src/toy/
```

### 2 · Executar o backend

```sh
python3 main.py
```

## 📜 Histórico de Versões

| Versão | Data | Alterações | Autor |
|:------:|:----:|------------|:-----:|
| `1.0` | 08/06/2026 | Inserir o template inicial da página.          | Lucas Ricarte |
| `1.1` | 10/06/2026 | Ajustar o template inicial da página.          | João Eduardo  |

<div align="center">
<br>
Arquitetura & Desenho de Software · FGA0208 · 2026.1
Universidade de Brasília — Faculdade de Ciências e Tecnologias
Prof.ª Milene Serrano
<br>
</div>