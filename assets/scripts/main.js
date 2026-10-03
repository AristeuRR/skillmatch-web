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
  limparResultados
} from "./ui.js";

const contadorAnalises = criarContadorAnalises();

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
    const possuiVagaComTodosOsRequisitos = resultados.some((resultado) =>
      perfilAtendeAlgumRequisito(candidato, resultado.vaga.requisitos)
    );

    // Callback: recebe uma função para marcar cada resultado.
    const resultadosComCallback = executarComCallback(resultados, (resultado) => ({
      ...resultado,
      analisado: true
    }));

    const melhor = encontrarMelhorVaga(resultadosComCallback);
    const estudos = gerarRecomendacao(resultadosComCallback);
    const numeroAnalise = contadorAnalises();

    renderResumo(perfil, resultadosComCallback, possuiVagaComTodosOsRequisitos);
    renderVagas(resultadosComCallback);
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
  form.reset();
  document.querySelector("#area").value = "Desenvolvimento Web Front-End";
  document.querySelector("#experiencia").value = "1";
  limparResultados();
  renderEstado("Perfil removido. Preencha o formulário para uma nova análise.", "info");
  renderFormularioStatus("Dados salvos removidos.");
});

const perfilSalvo = carregarPerfil();

if (perfilSalvo) {
  preencherFormulario(perfilSalvo);
  analisarPerfil(perfilSalvo);
}
