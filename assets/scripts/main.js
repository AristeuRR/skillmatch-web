import {
    VagaFrontEnd,
    criarContadorAnalises,
    executarComCallback,
    encontrarMelhorVaga,
    gerarRecomendacao
} from "./motor.js";

import {
    carregarVagas,
    salvarPerfil,
    carregarPerfil,
    removerPerfil
} from "./dados.js";

import {
    obterElementos,
    renderEstado,
    coletarPerfil,
    validarPerfil,
    preencherFormulario,
    renderVagas,
    renderMelhorVaga,
    renderResumo
} from "./ui.js";

const elementos = obterElementos();
const registrarAnalise = criarContadorAnalises();

async function analisarPerfil(perfil) {
    renderEstado(
        elementos.estadoVagas,
        "Carregando vagas…",
        "loading"
    );

    elementos.vagasLista.innerHTML = "";
    elementos.formStatus.textContent = "Buscando vagas para comparar seu perfil…";

    try {
        const dadosVagas = await carregarVagas();

        if (dadosVagas.length === 0) {
            renderEstado(
                elementos.estadoVagas,
                "Nada encontrado: o catálogo de vagas está vazio.",
                "empty"
            );
            elementos.formStatus.textContent = "";
            return;
        }

        // O JSON é transformado em instâncias da classe antes da análise.
        const vagas = dadosVagas.map(
            (dados) => new VagaFrontEnd(dados)
        );

        const resultados = vagas.map(
            (vaga) => vaga.calcularCompatibilidade(perfil)
        );

        renderVagas(resultados, elementos);

        // Callback: a função passada ao executarComCallback
        // controla uma ação para cada resultado.
        executarComCallback(resultados, (resultado) => {
            resultado.vaga.analisada = true;
        });

        const melhor = encontrarMelhorVaga(resultados, perfil);
        const recomendacoes = gerarRecomendacao(resultados);
        const contador = registrarAnalise();

        renderMelhorVaga(
            melhor,
            recomendacoes,
            elementos
        );

        renderResumo(
            perfil,
            resultados,
            contador,
            elementos
        );

        elementos.formStatus.textContent =
            "Análise concluída. Seu perfil foi salvo neste navegador.";
    } catch (erro) {
        renderEstado(
            elementos.estadoVagas,
            "Não foi possível carregar as vagas. Verifique o servidor local e tente novamente.",
            "error"
        );

        elementos.formStatus.textContent =
            `Erro: ${erro.message}`;
    }
}

elementos.form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const perfil = coletarPerfil(elementos);

    if (!validarPerfil(perfil)) {
        elementos.formStatus.textContent =
            "Corrija os campos indicados antes de continuar.";
        return;
    }

    salvarPerfil(perfil);
    await analisarPerfil(perfil);
});

elementos.limparPerfil.addEventListener("click", () => {
    removerPerfil();
    elementos.form.reset();

    elementos.vagasLista.innerHTML = "";
    elementos.resultadoResumo.textContent =
        "Preencha seu perfil para iniciar uma análise.";

    elementos.melhorVaga.innerHTML =
        "<p>Faça uma análise para receber sua recomendação.</p>";

    renderEstado(
        elementos.estadoVagas,
        "Perfil removido. Aguardando nova análise."
    );

    elementos.formStatus.textContent =
        "Perfil salvo removido deste navegador.";
});

const perfilSalvo = carregarPerfil();

if (perfilSalvo) {
    preencherFormulario(perfilSalvo, elementos);
    elementos.formStatus.textContent =
        "Perfil recuperado do armazenamento local. Clique em “Analisar vagas” para atualizar os resultados.";
}
