<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --ink: #1a1a1a;
  --ink-muted: #4a4a4a;
  --ink-faint: #888;
  --accent: #1a3a6e;
  --accent-light: #2d5aa0;
  --gold: #b8860b;
  --gold-light: #d4a017;
  --rule: #c8c0b0;
  --bg: #ffffff;
  --bg-warm: #fafaf8;
  --bg-card: #f7f5f0;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'Libre Baskerville', Georgia, serif;
  line-height: 1.75;
}

/* ── HERO ─────────────────────────────────────────── */
.hero {
  position: relative;
  text-align: center;
  padding: 5rem 2rem 4rem;
  border-bottom: 2px solid var(--ink);
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 39px, var(--rule) 39px, var(--rule) 40px),
    repeating-linear-gradient(90deg, transparent, transparent 39px, var(--rule) 39px, var(--rule) 40px);
  opacity: 0.18;
  pointer-events: none;
}

.hero-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1.5rem;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  line-height: 1.05;
  color: var(--ink);
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.hero-title em {
  font-style: italic;
  color: var(--accent);
}

.hero-rule {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem auto;
  max-width: 320px;
}

.hero-rule::before,
.hero-rule::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--gold);
}

.hero-rule-diamond {
  width: 8px;
  height: 8px;
  background: var(--gold);
  transform: rotate(45deg);
  flex-shrink: 0;
}

.hero-subtitle {
  font-size: 1rem;
  color: var(--ink-muted);
  font-style: italic;
  max-width: 560px;
  margin: 0 auto 2rem;
}

.hero-meta {
  display: inline-flex;
  gap: 2.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
  border-top: 1px solid var(--rule);
  padding-top: 1.5rem;
}

.hero-meta strong {
  color: var(--accent);
  font-weight: 500;
}

/* ── WRAPPER ──────────────────────────────────────── */
.page-wrapper {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ── SECTION HEADER ───────────────────────────────── */
.section {
  padding: 4rem 0;
  border-bottom: 1px solid var(--rule);
}

.section:last-of-type { border-bottom: none; }

.section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 0.6rem;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.9rem;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.2;
  margin-bottom: 2rem;
}

/* ── ABOUT ────────────────────────────────────────── */
.about-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

@media (max-width: 680px) { .about-body { grid-template-columns: 1fr; } }

.about-text {
  font-size: 1.05rem;
  color: var(--ink-muted);
  line-height: 1.85;
}

.about-text p + p { margin-top: 1rem; }

.about-text strong { color: var(--ink); font-weight: 700; }

.about-card {
  background: var(--bg-card);
  border: 1px solid var(--rule);
  border-left: 3px solid var(--accent);
  padding: 1.5rem 1.75rem;
}

.about-card-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.75rem;
}

.about-card-item {
  font-size: 0.88rem;
  color: var(--ink-muted);
  padding: 0.35rem 0;
  border-bottom: 1px solid var(--rule);
}

.about-card-item:last-child { border-bottom: none; }

.about-card-item strong { color: var(--ink); }

/* ── TEAM TABLE ───────────────────────────────────── */
.team-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.team-table thead tr {
  background: var(--ink);
  color: white;
}

.team-table thead th {
  padding: 0.75rem 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  font-weight: 500;
  text-align: left;
}

.team-table tbody tr {
  border-bottom: 1px solid var(--rule);
  transition: background 0.15s;
}

.team-table tbody tr:hover { background: var(--bg-warm); }

.team-table tbody td {
  padding: 0.75rem 1rem;
  color: var(--ink-muted);
}

.team-table tbody td:first-child {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  color: var(--ink-faint);
}

.team-table tbody td:nth-child(2) {
  font-weight: 700;
  color: var(--ink);
  font-family: 'Libre Baskerville', serif;
}

.team-table a {
  color: var(--accent-light);
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  border-bottom: 1px dashed var(--accent-light);
  transition: color 0.15s, border-color 0.15s;
}

.team-table a:hover {
  color: var(--gold);
  border-color: var(--gold);
}

/* ── SCREENSHOTS ──────────────────────────────────── */
.screenshots-placeholder {
  background: var(--bg-card);
  border: 2px dashed var(--rule);
  text-align: center;
  padding: 4rem 2rem;
  color: var(--ink-faint);
  font-style: italic;
  font-size: 0.9rem;
}

/* ── TECH STACK ───────────────────────────────────── */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

@media (max-width: 680px) { .tech-grid { grid-template-columns: 1fr; } }

.tech-card {
  background: var(--bg-card);
  border: 1px solid var(--rule);
  border-top: 3px solid var(--gold);
  padding: 1.25rem 1.5rem;
}

.tech-card-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 0.6rem;
}

.tech-card-body {
  font-size: 0.88rem;
  color: var(--ink-muted);
  line-height: 1.6;
}

.tech-card-body a {
  color: var(--accent-light);
  text-decoration: none;
  border-bottom: 1px dashed var(--accent-light);
}

.tech-card-body a:hover { color: var(--gold); border-color: var(--gold); }

/* ── EXECUTION ────────────────────────────────────── */
.exec-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--bg-card);
  border: 1px solid var(--rule);
  padding: 0.6rem 1.25rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  color: var(--ink);
}

.exec-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ccc;
  border: 1.5px solid #aaa;
}

.exec-dot.active { background: var(--accent); border-color: var(--accent); }

.exec-method-tag {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: white;
  background: var(--accent);
  padding: 0.25rem 0.65rem;
  margin-left: 0.6rem;
  vertical-align: middle;
}

.exec-method-tag.alt { background: var(--gold); }

.exec-steps {
  font-size: 0.92rem;
  color: var(--ink-muted);
  margin: 0.75rem 0 1rem 1.25rem;
}

.exec-steps li { margin-bottom: 0.4rem; }

.exec-steps code {
  background: var(--bg-card);
  border: 1px solid var(--rule);
  padding: 0.1rem 0.4rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
}

/* ── CHANGELOG ────────────────────────────────────── */
.changelog-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.changelog-table thead tr { background: var(--bg-card); }

.changelog-table thead th {
  padding: 0.6rem 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--ink-faint);
  text-align: left;
  border-bottom: 2px solid var(--rule);
}

.changelog-table tbody td {
  padding: 0.65rem 1rem;
  border-bottom: 1px solid var(--rule);
  color: var(--ink-muted);
}

.changelog-table tbody td:first-child {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  color: var(--gold);
  white-space: nowrap;
}

/* ── FOOTER ───────────────────────────────────────── */
.footer {
  text-align: center;
  padding: 3rem 2rem;
  border-top: 2px solid var(--ink);
  background: var(--bg);
}

.footer-logo {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-style: italic;
  color: var(--ink);
  margin-bottom: 0.4rem;
}

.footer-sub {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.footer-link {
  color: var(--accent-light);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s;
}

.footer-link:hover { border-color: var(--accent-light); }
</style>
<div class="hero">
  <div class="hero-eyebrow">Universidade de Brasília · FCTE · FGA0208 · Grupo 06 · Entrega 04</div>
  <h1 class="hero-title"><em>Quebrando</em><br>A Cabeça</h1>
  <div class="hero-rule"><span class="hero-rule-diamond"></span></div>
  <p class="hero-subtitle">Transformando fotografias em experiências interativas de quebra-cabeça — geração, visualização e montagem virtual.</p>
  <div class="hero-meta">
    <span><strong>Disciplina</strong> · FGA0208</span>
    <span><strong>Semestre</strong> · 2026.1</span>
    <span><strong>Grupo</strong> · G6</span>
    <span><strong>Entrega</strong> · 04</span>
  </div>
</div>
<div class="page-wrapper">
  <!-- SOBRE -->
  <div class="section">
    <div class="section-label">§ 01</div>
    <h2 class="section-title">Sobre o Projeto</h2>
    <div class="about-body">
      <div class="about-text">
        <p>
          O <strong>Grupo G6</strong> visa desenvolver o software <strong>Quebrando A Cabeça</strong>, cuja finalidade principal é gerar imagens com aspecto visual de quebra-cabeça a partir de fotos fornecidas pelo usuário.
        </p>
        <p>
          Como escopo estendido, o sistema preverá um ambiente interativo para a <strong>montagem virtual</strong> dos quebra-cabeças gerados, proporcionando uma experiência completa ao usuário.
        </p>
        <p>
          O sistema é construído como requisito de avaliação da disciplina <strong>Arquitetura &amp; Desenho de Software (FGA0208)</strong>, ofertada no semestre <strong>2026.1</strong> pela Faculdade de Ciências e Tecnologias (FCTE) da Universidade de Brasília (UnB), sob supervisão da Prof.ª Milene Serrano.
        </p>
        <p>
          Repositório oficial disponível na organização UnB-ArqDsw-2026-1-T01 no <a href="https://github.com/UnBArqDsw2026-1-Turma01/2026.1-T01_G6_QuebrandoACabeca_Entrega_04" class="footer-link">GitHub ↗</a>.
        </p>
      </div>
      <div>
        <div class="about-card">
          <div class="about-card-title">Informações Institucionais</div>
          <div class="about-card-item"><strong>Instituição</strong> · Universidade de Brasília</div>
          <div class="about-card-item"><strong>Unidade</strong> · FCTE — Gama</div>
          <div class="about-card-item"><strong>Disciplina</strong> · Arq. &amp; Desenho de Software</div>
          <div class="about-card-item"><strong>Código</strong> · FGA0208</div>
          <div class="about-card-item"><strong>Semestre</strong> · 2026.1</div>
          <div class="about-card-item"><strong>Docente</strong> · Prof.ª Milene Serrano</div>
          <div class="about-card-item"><strong>Grupo</strong> · G6 · Entrega 04</div>
        </div>
      </div>
    </div>
  </div>
  <!-- EQUIPE -->
  <div class="section">
    <div class="section-label">§ 02</div>
    <h2 class="section-title">Equipe</h2>
    <table class="team-table">
      <thead>
        <tr>
          <th>Matrícula</th>
          <th>Discente</th>
          <th>GitHub</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>23/2001371</td>
          <td>Caio Rocha de Oliveira</td>
          <td><a href="https://github.com/Dexmachi">@Dexmachi</a></td>
        </tr>
        <tr>
          <td>23/1011275</td>
          <td>Eduardo de Almeida Morais</td>
          <td><a href="https://github.com/Edumorais08">@Edumorais08</a></td>
        </tr>
        <tr>
          <td>20/0037170</td>
          <td>Fábio Alessandro Torres Santos</td>
          <td><a href="https://github.com/fabioaletorres">@fabioaletorres</a></td>
        </tr>
        <tr>
          <td>18/0053299</td>
          <td>João Eduardo Pereira Rabelo</td>
          <td><a href="https://github.com/JoaoEduardoP">@JoaoEduardoP</a></td>
        </tr>
        <tr>
          <td>23/1011927</td>
          <td>João Felipe Oliveira Alves e Silva</td>
          <td><a href="https://github.com/MrBolt2005">@MrBolt2005</a></td>
        </tr>
        <tr>
          <td>23/2014093</td>
          <td>Lucas Machado Peres Ricarte</td>
          <td><a href="https://github.com/Lucas-Ricarte">@Lucas-Ricarte</a></td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- SCREENSHOTS -->
  <div class="section">
    <div class="section-label">§ 03</div>
    <h2 class="section-title">Screenshots da Quarta Entrega</h2>
    <div class="screenshots-placeholder">
        [[slider]](assets/Fluxo1.jpg|assets/Modelo1.jpg|assets/Modelo2.jpg|assets/Modelo3.jpg|assets/Modelo4.jpg|assets/Modelo5.jpg)
    </div>
  </div>

  <!-- TECNOLOGIAS -->
  <div class="section">
    <div class="section-label">§ 04</div>
    <h2 class="section-title">Tecnologias</h2>
    <p style="color:var(--ink-muted);font-size:0.95rem;margin-bottom:1.5rem;">
      O projeto é composto por dois núcleos principais, orquestrados em conjunto por meio de containers:
    </p>
    <div class="tech-grid">
      <div class="tech-card">
        <div class="tech-card-title">Backend</div>
        <div class="tech-card-body">
          <a href="https://fastapi.tiangolo.com/" target="_blank">FastAPI</a> +
          <a href="https://www.sqlalchemy.org/" target="_blank">SQLAlchemy</a> + SQLite,
          escrito em <strong style="color:var(--ink);">Python 3.12</strong>
        </div>
      </div>
      <div class="tech-card">
        <div class="tech-card-title">Frontend</div>
        <div class="tech-card-body">
          <a href="https://reactjs.org/" target="_blank">React</a> + TypeScript, com
          <a href="https://reactrouter.com/" target="_blank">React Router</a> e CSS puro
        </div>
      </div>
      <div class="tech-card">
        <div class="tech-card-title">Infraestrutura</div>
        <div class="tech-card-body">
          <a href="https://www.docker.com/" target="_blank">Docker</a> e
          <a href="https://docs.docker.com/compose/" target="_blank">Docker Compose</a>
          para orquestração e execução simplificada
        </div>
      </div>
      <div class="tech-card">
        <div class="tech-card-title">Documentação</div>
        <div class="tech-card-body">
          <a href="https://docsify.js.org/" target="_blank">Docsify</a>
        </div>
      </div>
    </div>
  </div>

  <!-- EXECUÇÃO -->
  <div class="section">
    <div class="section-label">§ 05</div>
    <h2 class="section-title">Há Algo a Ser Executado?</h2>
    <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:2rem;">
      <div class="exec-badge"><span class="exec-dot active"></span> SIM</div>
      <div class="exec-badge"><span class="exec-dot"></span> NÃO</div>
    </div>
    <h3 style="font-family:'Playfair Display',serif;font-size:1.1rem;color:var(--ink);margin-bottom:0.75rem;">
      🐳 Com Docker <span class="exec-method-tag">recomendado</span>
    </h3>
    <ol class="exec-steps">
      <li>Certifique-se de ter o <strong>Docker</strong> e o <strong>Docker Compose</strong> instalados.</li>
      <li>Clone o repositório e acesse a pasta raiz:</li>
    </ol>
    <pre style="background:var(--bg-card);border:1px solid var(--rule);padding:1.25rem 1.5rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--ink);line-height:1.8;overflow-x:auto;margin-bottom:1.25rem;">
git clone &lt;url-do-repositorio&gt;
cd QuebraCabeca/-2026.1-T01_G6_QuebrandoACabeca_Entrega_04</pre>
    <ol class="exec-steps" start="3">
      <li>Crie o diretório de dados <em>(opcional, para persistência do banco)</em>:</li>
    </ol>
    <pre style="background:var(--bg-card);border:1px solid var(--rule);padding:1.25rem 1.5rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--ink);line-height:1.8;overflow-x:auto;margin-bottom:1.25rem;">
mkdir -p backend/data</pre>
    <ol class="exec-steps" start="4">
      <li>Construa e inicie os containers:</li>
    </ol>
    <pre style="background:var(--bg-card);border:1px solid var(--rule);padding:1.25rem 1.5rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--ink);line-height:1.8;overflow-x:auto;margin-bottom:1.25rem;">
docker-compose up --build</pre>
    <p style="color:var(--ink-muted);font-size:0.92rem;margin-bottom:1.25rem;">
      Backend disponível em <a href="http://localhost:8000" class="footer-link" style="font-family:'JetBrains Mono',monospace;font-size:0.85rem;">http://localhost:8000 ↗</a>
      (documentação interativa em <code style="background:var(--bg-card);border:1px solid var(--rule);padding:0.1rem 0.4rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;">/docs</code>)
      &nbsp;·&nbsp;
      Frontend disponível em <a href="http://localhost:3000" class="footer-link" style="font-family:'JetBrains Mono',monospace;font-size:0.85rem;">http://localhost:3000 ↗</a>
    </p>
    <ol class="exec-steps" start="5">
      <li>Para parar os containers:</li>
    </ol>
    <pre style="background:var(--bg-card);border:1px solid var(--rule);padding:1.25rem 1.5rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--ink);line-height:1.8;overflow-x:auto;margin-bottom:1.25rem;">
docker-compose down</pre>
    <ol class="exec-steps" start="6">
      <li>Para remover também os volumes (banco de dados):</li>
    </ol>
    <pre style="background:var(--bg-card);border:1px solid var(--rule);padding:1.25rem 1.5rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--ink);line-height:1.8;overflow-x:auto;">
docker-compose down -v</pre>
    <!-- DIVIDER -->
    <hr style="border:none;border-top:1px solid var(--rule);margin:2.5rem 0;" />
    <h3 style="font-family:'Playfair Display',serif;font-size:1.1rem;color:var(--ink);margin-bottom:1.25rem;">
      💻 Sem Docker <span class="exec-method-tag alt">desenvolvimento local</span>
    </h3>
    <!-- FRONTEND -->
    <h4 style="font-family:'Playfair Display',serif;font-size:1rem;color:var(--ink);margin-bottom:0.75rem;">🎨 Frontend</h4>
    <p style="color:var(--ink-muted);font-size:0.92rem;margin-bottom:1rem;">
      Pré-requisito: <strong>Node.js 18+</strong> instalado. Navegue até a pasta
      <code style="background:var(--bg-card);border:1px solid var(--rule);padding:0.1rem 0.4rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;">frontend</code> do repositório e execute:
    </p>
    <pre style="background:var(--bg-card);border:1px solid var(--rule);padding:1.25rem 1.5rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--ink);line-height:1.8;overflow-x:auto;">
<span style="color:var(--ink-faint)"># 1. Instalar as dependências</span>
cd frontend
npm install

<span style="color:var(--ink-faint)"># 2. Iniciar a aplicação</span>
npm start</pre>
    <p style="color:var(--ink-muted);font-size:0.92rem;margin-top:1rem;margin-bottom:2rem;">
      Acesse em <a href="http://localhost:3000" class="footer-link" style="font-family:'JetBrains Mono',monospace;font-size:0.85rem;">http://localhost:3000 ↗</a>.
      O frontend espera o backend em <code style="background:var(--bg-card);border:1px solid var(--rule);padding:0.1rem 0.4rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;">http://localhost:8000</code> por padrão —
      para alterar, defina a variável <code style="background:var(--bg-card);border:1px solid var(--rule);padding:0.1rem 0.4rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;">REACT_APP_API_URL</code>.
    </p>
    <!-- DIVIDER -->
    <hr style="border:none;border-top:1px solid var(--rule);margin:1.5rem 0;" />
    <!-- BACKEND -->
    <h4 style="font-family:'Playfair Display',serif;font-size:1rem;color:var(--ink);margin-bottom:0.75rem;">⚙️ Backend</h4>
    <p style="color:var(--ink-muted);font-size:0.92rem;margin-bottom:1rem;">
      Pré-requisito: <strong>Python 3.12+</strong> e <strong>pip</strong> instalados. Navegue até a pasta do backend:
    </p>
    <pre style="background:var(--bg-card);border:1px solid var(--rule);padding:1.25rem 1.5rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--ink);line-height:1.8;overflow-x:auto;">
cd backend/app</pre>
    <p style="color:var(--ink-muted);font-size:0.92rem;margin-top:1.25rem;margin-bottom:0.5rem;">
      <strong>Ambiente virtual</strong> <em>(opcional, mas recomendado)</em>
    </p>
    <pre style="background:var(--bg-card);border:1px solid var(--rule);padding:1.25rem 1.5rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--ink);line-height:1.8;overflow-x:auto;">
python -m venv venv
source venv/bin/activate   <span style="color:var(--ink-faint)"># Linux/Mac</span>
venv\Scripts\activate      <span style="color:var(--ink-faint)"># Windows</span></pre>
    <p style="color:var(--ink-muted);font-size:0.92rem;margin-top:1.25rem;margin-bottom:0.5rem;">
      <strong>Instalação das dependências</strong>
    </p>
    <pre style="background:var(--bg-card);border:1px solid var(--rule);padding:1.25rem 1.5rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--ink);line-height:1.8;overflow-x:auto;">
pip install -r ../requirements.txt</pre>
    <p style="color:var(--ink-muted);font-size:0.92rem;margin-top:1.25rem;margin-bottom:0.5rem;">
      <strong>Diretório de dados e execução</strong>
    </p>
    <pre style="background:var(--bg-card);border:1px solid var(--rule);padding:1.25rem 1.5rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--ink);line-height:1.8;overflow-x:auto;">
<span style="color:var(--ink-faint)"># Criar o diretório de dados para o banco SQLite</span>
mkdir -p data

<span style="color:var(--ink-faint)"># Iniciar o servidor</span>
uvicorn main:app --reload --host 0.0.0.0 --port 8000</pre>
    <p style="color:var(--ink-muted);font-size:0.92rem;margin-top:1rem;">
      Backend disponível em <a href="http://localhost:8000" class="footer-link" style="font-family:'JetBrains Mono',monospace;font-size:0.85rem;">http://localhost:8000 ↗</a>
      (documentação interativa em <code style="background:var(--bg-card);border:1px solid var(--rule);padding:0.1rem 0.4rem;font-family:'JetBrains Mono',monospace;font-size:0.82rem;">/docs</code>).
    </p>
  </div>

  <!-- HISTÓRICO -->
  <div class="section">
    <div class="section-label">§ 06</div>
    <h2 class="section-title">Histórico de Versões</h2>
    <table class="changelog-table">
      <thead>
        <tr>
          <th>Data</th>
          <th>Alterações</th>
          <th>Autores</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>08/06/2026</td>
          <td>Inserir o template inicial da página.</td>
          <td>Lucas Ricarte</td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td>10/06/2026</td>
          <td>Editar o template da página.</td>
          <td>João Eduardo</td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td>15/06/2026</td>
          <td>Adição das imagens do DAS.</td>
          <td>João Eduardo</td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td>18/06/2026</td>
          <td>Inclusão da seção de Tecnologias e atualização das instruções de execução (Docker e desenvolvimento local).</td>
          <td>João Eduardo</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
<div class="footer">
  <div class="footer-logo">Quebrando A Cabeça</div>
  <div class="footer-sub">FGA0208 · Grupo G6 · UnB · FCTE · 2026.1</div>
</div>