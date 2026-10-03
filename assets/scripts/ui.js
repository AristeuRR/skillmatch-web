const form = document.querySelector("#perfil-form");
const resultsStatus = document.querySelector("#estado-vagas");
const jobsList = document.querySelector("#vagas-lista");
const summary = document.querySelector("#resultado-resumo");
const recommendation = document.querySelector("#melhor-vaga");
const formStatus = document.querySelector("#form-status");

export function coletarPerfil() {
  const habilidades = [...document.querySelectorAll('input[name="habilidade"]:checked')]
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
    document.querySelector("#habilidades-erro").textContent =
      "Selecione pelo menos uma habilidade.";
    valido = false;
  }

  return valido;
}

function mostrarErro(campo, mensagem) {
  const input = document.querySelector(`#${campo}`);
  input.setAttribute("aria-invalid", "true");
  document.querySelector(`#${campo}-erro`).textContent = mensagem;
}

function limparErros() {
  ["nome", "area", "experiencia"].forEach((id) => {
    document.querySelector(`#${id}`).removeAttribute("aria-invalid");
    document.querySelector(`#${id}-erro`).textContent = "";
  });
  document.querySelector("#habilidades-erro").textContent = "";
}

export function preencherFormulario(perfil) {
  if (!perfil) return;

  document.querySelector("#nome").value = perfil.nome ?? "";
  document.querySelector("#area").value = perfil.areaInteresse ?? "";
  document.querySelector("#experiencia").value = perfil.tempoExperiencia ?? 0;

  document.querySelectorAll('input[name="habilidade"]').forEach((input) => {
    input.checked = perfil.habilidades?.includes(input.value) ?? false;
  });
}

export function renderEstado(mensagem, tipo = "info") {
  resultsStatus.classList.remove("loading", "empty", "error", "success");
  if (["loading", "empty", "error", "success"].includes(tipo)) {
    resultsStatus.classList.add(tipo);
  }
  resultsStatus.textContent = mensagem;
}

export function renderFormularioStatus(mensagem, tipo = "info") {
  formStatus.classList.remove("status-error", "status-success");
  if (tipo === "error") formStatus.classList.add("status-error");
  if (tipo === "success") formStatus.classList.add("status-success");
  formStatus.textContent = mensagem;
}

function formatarPercentual(valor) {
  return `${valor.toFixed(1)}%`;
}

export function renderResumo(perfil, resultados, possuiVagaComTodosOsRequisitos = false) {
  summary.innerHTML = `Perfil: ${perfil.nome} · ${perfil.areaInteresse} · ${perfil.tempoExperiencia} ano(s) de experiência · ${perfil.habilidades.length} habilidade(s) selecionada(s) · ${resultados.length} vaga(s) analisada(s). ${possuiVagaComTodosOsRequisitos ? "Há uma vaga em que todos os requisitos foram atendidos." : "Ainda não há uma vaga com todos os requisitos atendidos."}`;
}

export function renderVagas(resultados) {
  jobsList.innerHTML = "";

  for (let indice = 0; indice < resultados.length; indice += 1) {
    const resultado = resultados[indice];
    const card = document.createElement("article");
    card.classList.add("job-card");

    const requisitosEncontrados = resultado.encontrados.length
      ? resultado.encontrados.map((requisito) => `<li><span>${requisito.nome}</span> <strong>Peso ${requisito.peso}</strong></li>`).join("")
      : "<li>Nenhuma habilidade encontrada.</li>";

    const requisitosFaltantes = resultado.faltantes.length
      ? resultado.faltantes.map((requisito) => `<li><span>${requisito.nome}</span> <strong>Peso ${requisito.peso}</strong></li>`).join("")
      : "<li>Nenhuma habilidade faltante.</li>";

    const classificacaoClasse = resultado.classificacao.split(" ")[0].toLowerCase();

    card.innerHTML = `
      <p class="job-company">${resultado.vaga.empresa}</p>
      <h3>${resultado.vaga.cargo}</h3>
      <div class="compatibility">
        <div>
          <span>Compatibilidade</span>
          <strong>${formatarPercentual(resultado.percentual)}</strong>
        </div>
        <span class="badge badge-${classificacaoClasse}">${resultado.classificacao}</span>
      </div>
      <p class="job-meta">${resultado.vaga.nivel} · ${resultado.vaga.modalidade} · ${resultado.vaga.salario}</p>
      <p class="job-meta">Experiência mínima: ${resultado.vaga.minExperience} ano(s) · ${resultado.atendeExperienciaMinima ? "Experiência compatível" : "Experiência abaixo do mínimo"}</p>
      <div class="score-detail">
        <span>Pontos obtidos: <strong>${resultado.pontosObtidos}</strong></span>
        <span>Pontos máximos: <strong>${resultado.pontosMaximos}</strong></span>
      </div>
      <div class="skills-result">
        <h4>Habilidades encontradas</h4>
        <ul>${requisitosEncontrados}</ul>
      </div>
      <div class="skills-result">
        <h4>Habilidades faltantes</h4>
        <ul>${requisitosFaltantes}</ul>
      </div>
    `;

    jobsList.appendChild(card);
  }
}

export function renderMelhorVaga(melhor) {
  if (!melhor) return;

  recommendation.innerHTML = `
    <p class="eyebrow">MAIOR COMPATIBILIDADE</p>
    <h3>${melhor.vaga.empresa} · ${melhor.vaga.cargo}</h3>
    <p>Compatibilidade ponderada: <strong>${formatarPercentual(melhor.percentual)}</strong>.</p>
    <p>${melhor.pontosObtidos} pontos de ${melhor.pontosMaximos}. A experiência mínima da vaga é de ${melhor.vaga.minExperience} ano(s).</p>
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
      <p>A recomendação combina o peso dos requisitos faltantes com a frequência em que aparecem nas vagas.</p>
      <ol>
        ${estudos.map((item) => `
          <li>${item.nome} — ${item.ocorrencias} ocorrência(s), prioridade ponderada ${item.prioridade}</li>
        `).join("")}
      </ol>
    </div>
  `;
}

export function limparResultados() {
  summary.textContent = "Preencha seu perfil para iniciar uma análise.";
  jobsList.innerHTML = "";
  recommendation.innerHTML = "<p>Faça uma análise para receber sua recomendação.</p>";
}

export { form };
