import {
  Candidato,
  VagaFrontEnd,
  encontrarMelhorVaga,
  executarComCallback,
  gerarRecomendacao,
  perfilAtendeAlgumRequisito
} from "./motor.js";

import {
  carregarVagas,
  salvarPerfil,
  carregarPerfil,
  removerPerfil
} from "./dados.js";

import {
  form,
  coletarPerfil,
  validarPerfil,
  preencherFormulario,
  renderEstado,
  renderFormularioStatus,
  renderResumo,
  renderVagas,
  renderMelhorVaga,
  renderRecomendacao,
  limparResultados,
  limparFormularioVisual,
  configurarCamposDeTexto
} from "./ui.js";

const contadorAnalises = criarContadorAnalises();
const CHAVE_TEMA = "skillmatch:tema";
let resultadosAtuais = [];

function criarContadorAnalises() {
  let total = 0;

  return () => {
    total += 1;
    return total;
  };
}

async function analisarPerfil(perfil) {
  renderEstado("Carregando vagas...", "loading");
  renderFormularioStatus("Buscando o catálogo de vagas...");

  try {
    const dados = await carregarVagas();

    if (!dados.length) {
      renderEstado("Nenhuma vaga disponível no momento.", "empty");
      return;
    }

    const candidato = new Candidato(
      perfil.nome,
      perfil.areaInteresse,
      perfil.tempoExperiencia,
      perfil.habilidades
    );

    const vagas = dados.map((dadosVaga) => new VagaFrontEnd(dadosVaga));

    const resultados = vagas.map((vaga) => vaga.calcularCompatibilidade(candidato));
    resultadosAtuais = resultados;
    const possuiVagaComTodosOsRequisitos = resultados.some((resultado) =>
      perfilAtendeAlgumRequisito(candidato, resultado.vaga.requisitos)
    );

    // Callback: recebe uma função para marcar cada resultado.
    const resultadosComCallback = executarComCallback(resultados, (resultado) => ({
      ...resultado,
      analisado: true
    }));

    const melhor = encontrarMelhorVaga(resultadosComCallback, candidato.tempoExperiencia);
    const estudos = gerarRecomendacao(resultadosComCallback);
    const numeroAnalise = contadorAnalises();

    renderResumo(perfil, resultadosComCallback, possuiVagaComTodosOsRequisitos);
    renderVagas(aplicarFiltrosEOrdenacao(resultadosComCallback));
    renderMelhorVaga(melhor);
    renderRecomendacao(estudos);

    renderEstado(
      `Análise ${numeroAnalise} concluída: ${resultadosComCallback.length} vagas processadas.`,
      "success"
    );
    renderFormularioStatus("Perfil analisado e salvo com sucesso.", "success");
  } catch (erro) {
    limparResultados();
    renderEstado(
      `Não foi possível concluir a análise. ${erro.message}`,
      "error"
    );
    renderFormularioStatus("Ocorreu um erro ao carregar as vagas.", "error");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const perfil = coletarPerfil();

  if (!validarPerfil(perfil)) {
    renderFormularioStatus("Revise os campos destacados.", "error");
    return;
  }

  salvarPerfil(perfil);
  await analisarPerfil(perfil);
});

document.querySelector("#limpar-perfil").addEventListener("click", () => {
  removerPerfil();
  limparFormularioVisual();
  resultadosAtuais = [];
  document.querySelector("#filtro-modalidade").value = "todas";
  document.querySelector("#ordenar-vagas").value = "compatibilidade";
  limparResultados();
  renderEstado("Perfil removido. Todos os campos foram limpos.", "info");
  renderFormularioStatus("Dados salvos removidos e formulário limpo.");
});

const perfilSalvo = carregarPerfil();

if (perfilSalvo) {
  preencherFormulario(perfilSalvo);
  analisarPerfil(perfilSalvo);
}


function obterSalarioMinimo(salario) {
  const valores = String(salario).match(/[\d.]+(?:,\d+)?/g) ?? [];
  if (!valores.length) return 0;
  return Number(valores[0].replace(/\./g, "").replace(",", "."));
}

function aplicarFiltrosEOrdenacao(resultados) {
  const modalidade = document.querySelector("#filtro-modalidade").value;
  const ordenacao = document.querySelector("#ordenar-vagas").value;

  const filtrados = resultados.filter((resultado) =>
    modalidade === "todas" || resultado.vaga.modalidade === modalidade
  );

  return [...filtrados].sort((a, b) => {
    if (ordenacao === "salario") {
      return obterSalarioMinimo(b.vaga.salario) - obterSalarioMinimo(a.vaga.salario);
    }

    if (ordenacao === "modalidade") {
      return a.vaga.modalidade.localeCompare(b.vaga.modalidade, "pt-BR");
    }

    return b.percentual - a.percentual;
  });
}

function atualizarListaDeVagas() {
  if (!resultadosAtuais.length) return;
  renderVagas(aplicarFiltrosEOrdenacao(resultadosAtuais));
}

function configurarTema() {
  const botao = document.querySelector("#alternar-tema");
  const temaSalvo = localStorage.getItem(CHAVE_TEMA);
  const temaInicial = temaSalvo === "dark" ? "dark" : "light";

  document.documentElement.dataset.theme = temaInicial;
  atualizarTextoTema(temaInicial);

  botao.addEventListener("click", () => {
    const novoTema = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = novoTema;
    localStorage.setItem(CHAVE_TEMA, novoTema);
    atualizarTextoTema(novoTema);
  });
}

function atualizarTextoTema(tema) {
  const botao = document.querySelector("#alternar-tema");
  botao.textContent = tema === "dark" ? "☀️ Tema claro" : "🌙 Tema escuro";
  botao.setAttribute("aria-label", tema === "dark" ? "Ativar tema claro" : "Ativar tema escuro");
}

document.querySelector("#filtro-modalidade").addEventListener("change", atualizarListaDeVagas);
document.querySelector("#ordenar-vagas").addEventListener("change", atualizarListaDeVagas);
configurarCamposDeTexto();
configurarTema();
