const form = document.querySelector("#profile-form");
const resultsStatus = document.querySelector("#results-status");
const jobsList = document.querySelector("#jobs-list");
const summary = document.querySelector("#summary");
const recommendation = document.querySelector("#recommendation");
const formStatus = document.querySelector("#form-status");

export function coletarPerfil() {
  const habilidades = [...document.querySelectorAll('input[name="skills"]:checked')]
    .map((input) => input.value);

  return {
    nome: document.querySelector("#nome").value.trim(),
    areaInteresse: document.querySelector("#area").value.trim(),
    tempoExperiencia: Number(document.querySelector("#experiencia").value),
    habilidades
  };
}

export function validarPerfil(perfil) {
  limparErros();

  let valido = true;

  if (!perfil.nome) {
    mostrarErro("nome", "Informe seu nome.");
    valido = false;
  }

  if (!perfil.areaInteresse) {
    mostrarErro("area", "Informe sua área de interesse.");
    valido = false;
  }

  if (Number.isNaN(perfil.tempoExperiencia) || perfil.tempoExperiencia < 0) {
    mostrarErro("experiencia", "Informe um tempo de experiência válido.");
    valido = false;
  }

  if (!perfil.habilidades.length) {
    document.querySelector("#skills-error").textContent =
      "Selecione pelo menos uma habilidade.";
    valido = false;
  }

  return valido;
}

function mostrarErro(campo, mensagem) {
  document.querySelector(`#${campo}`).setAttribute("aria-invalid", "true");
  document.querySelector(`#${campo}-error`).textContent = mensagem;
}

function limparErros() {
  ["nome", "area", "experiencia"].forEach((id) => {
    document.querySelector(`#${id}`).removeAttribute("aria-invalid");
    document.querySelector(`#${id}-error`).textContent = "";
  });

  document.querySelector("#skills-error").textContent = "";
}

export function preencherFormulario(perfil) {
  if (!perfil) return;

  document.querySelector("#nome").value = perfil.nome ?? "";
  document.querySelector("#area").value = perfil.areaInteresse ?? "";
  document.querySelector("#experiencia").value = perfil.tempoExperiencia ?? 0;

  document.querySelectorAll('input[name="skills"]').forEach((input) => {
    input.checked = perfil.habilidades?.includes(input.value) ?? false;
  });
}

export function renderEstado(mensagem, tipo = "info") {
  resultsStatus.className = `status-panel status-${tipo}`;
  resultsStatus.textContent = mensagem;
}

export function renderFormularioStatus(mensagem, tipo = "info") {
  formStatus.className = `status-message status-${tipo}`;
  formStatus.textContent = mensagem;
}

function formatarPercentual(valor) {
  return `${valor.toFixed(1)}%`;
}

function renderListaRequisitos(requisitos, classe) {
  if (!requisitos.length) {
    return `<p class="empty-list">Nenhum item nesta categoria.</p>`;
  }

  return `
    <ul class="requirement-list ${classe}">
      ${requisitos.map((requisito) => `
        <li>
          <span>${requisito.nome}</span>
          <strong>Peso ${requisito.peso}</strong>
        </li>
      `).join("")}
    </ul>
  `;
}

export function renderResumo(perfil, resultados) {
  summary.innerHTML = `
    <div class="profile-summary">
      <div>
        <span class="summary-label">Perfil analisado</span>
        <strong>${perfil.nome}</strong>
        <span>${perfil.areaInteresse} · ${perfil.tempoExperiencia} ano(s)</span>
      </div>
      <div>
        <span class="summary-label">Habilidades</span>
        <strong>${perfil.habilidades.length}</strong>
        <span>selecionadas</span>
      </div>
      <div>
        <span class="summary-label">Vagas analisadas</span>
        <strong>${resultados.length}</strong>
        <span>oportunidades</span>
      </div>
    </div>
  `;
}

export function renderVagas(resultados) {
  jobsList.innerHTML = resultados.map((resultado) => `
    <article class="job-card">
      <div class="job-top">
        <div>
          <p class="company">${resultado.vaga.empresa}</p>
          <h3>${resultado.vaga.cargo}</h3>
        </div>
        <div class="compatibility">
          <strong>${formatarPercentual(resultado.percentual)}</strong>
          <span class="badge badge-${resultado.classificacao.split(" ")[0].toLowerCase()}">
            ${resultado.classificacao}
          </span>
        </div>
      </div>

      <div class="job-meta">
        <span>${resultado.vaga.nivel}</span>
        <span>${resultado.vaga.modalidade}</span>
        <span>${resultado.vaga.salario}</span>
        <span>Experiência mínima: ${resultado.vaga.minExperience} ano(s)</span>
      </div>

      <div class="score-detail">
        <div>
          <span>Pontos obtidos</span>
          <strong>${resultado.pontosObtidos}</strong>
        </div>
        <div>
          <span>Pontos máximos</span>
          <strong>${resultado.pontosMaximos}</strong>
        </div>
        <div>
          <span>Experiência</span>
          <strong>${resultado.atendeExperienciaMinima ? "Atende" : "Abaixo"}</strong>
        </div>
      </div>

      <div class="requirements-columns">
        <section>
          <h4>Habilidades encontradas</h4>
          ${renderListaRequisitos(resultado.encontrados, "found")}
        </section>
        <section>
          <h4>Habilidades faltantes</h4>
          ${renderListaRequisitos(resultado.faltantes, "missing")}
        </section>
      </div>
    </article>
  `).join("");
}

export function renderMelhorVaga(melhor) {
  if (!melhor) {
    return;
  }

  recommendation.innerHTML = `
    <div class="recommendation-main">
      <p class="eyebrow">MAIOR COMPATIBILIDADE</p>
      <h3>${melhor.vaga.empresa} · ${melhor.vaga.cargo}</h3>
      <p>
        Esta vaga alcançou <strong>${formatarPercentual(melhor.percentual)}</strong>
        pelo cálculo ponderado.
      </p>
      <div class="recommendation-score">
        ${melhor.pontosObtidos} pontos de ${melhor.pontosMaximos}
      </div>
    </div>
  `;
}

export function renderRecomendacao(estudos) {
  if (!estudos.length) {
    recommendation.innerHTML += `
      <div class="study-list">
        <h3>Recomendação de estudo</h3>
        <p>Seu perfil atende aos requisitos das vagas analisadas.</p>
      </div>
    `;
    return;
  }

  recommendation.innerHTML += `
    <div class="study-list">
      <h3>Habilidades para priorizar</h3>
      <p>
        A prioridade combina o <strong>peso</strong> dos requisitos faltantes
        com a frequência em que eles aparecem nas vagas.
      </p>
      <ol>
        ${estudos.map((item) => `
          <li>
            <span>${item.nome}</span>
            <small>${item.ocorrencias} ocorrência(s) · prioridade ponderada ${item.prioridade}</small>
          </li>
        `).join("")}
      </ol>
    </div>
  `;
}

export function limparResultados() {
  summary.innerHTML = "";
  jobsList.innerHTML = "";
  recommendation.innerHTML = "<p>A recomendação aparecerá após a análise.</p>";
}

export { form };
