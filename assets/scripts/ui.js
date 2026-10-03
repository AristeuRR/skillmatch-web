function obterElementos() {
    return {
        form: document.querySelector("#perfil-form"),
        nome: document.querySelector("#nome"),
        area: document.querySelector("#area"),
        experiencia: document.querySelector("#experiencia"),
        habilidades: document.querySelectorAll('input[name="habilidade"]'),
        vagasLista: document.querySelector("#vagas-lista"),
        estadoVagas: document.querySelector("#estado-vagas"),
        resultadoResumo: document.querySelector("#resultado-resumo"),
        melhorVaga: document.querySelector("#melhor-vaga"),
        formStatus: document.querySelector("#form-status"),
        limparPerfil: document.querySelector("#limpar-perfil")
    };
}

function renderEstado(elemento, mensagem, tipo = "") {
    elemento.className = `status-box ${tipo}`.trim();
    elemento.textContent = mensagem;
}

function limparErros() {
    document.querySelectorAll(".field-error").forEach((elemento) => {
        elemento.textContent = "";
    });
}

function mostrarErro(id, mensagem) {
    const elemento = document.querySelector(`#${id}`);
    if (elemento) {
        elemento.textContent = mensagem;
    }
}

function coletarPerfil(elementos) {
    return {
        nome: elementos.nome.value.trim(),
        area: elementos.area.value.trim(),
        tempoExperiencia: Number(elementos.experiencia.value),
        habilidades: Array.from(elementos.habilidades)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value)
    };
}

function validarPerfil(perfil) {
    limparErros();

    let valido = true;

    if (!perfil.nome) {
        mostrarErro("nome-erro", "Informe seu nome.");
        valido = false;
    }

    if (!perfil.area) {
        mostrarErro("area-erro", "Informe sua área de interesse.");
        valido = false;
    }

    if (
        Number.isNaN(perfil.tempoExperiencia) ||
        perfil.tempoExperiencia < 0
    ) {
        mostrarErro(
            "experiencia-erro",
            "Informe um tempo de experiência válido."
        );
        valido = false;
    }

    if (perfil.habilidades.length === 0) {
        mostrarErro(
            "habilidades-erro",
            "Selecione pelo menos uma habilidade."
        );
        valido = false;
    }

    return valido;
}

function preencherFormulario(perfil, elementos) {
    elementos.nome.value = perfil.nome || "";
    elementos.area.value = perfil.area || "";
    elementos.experiencia.value =
        perfil.tempoExperiencia ?? "";

    elementos.habilidades.forEach((checkbox) => {
        checkbox.checked = perfil.habilidades?.includes(checkbox.value) ?? false;
    });
}

function classeCompatibilidade(classificacao) {
    if (classificacao === "Alta compatibilidade") {
        return "badge-high";
    }

    if (classificacao === "Média compatibilidade") {
        return "badge-medium";
    }

    return "badge-low";
}

function criarLista(itens, vazio) {
    if (itens.length === 0) {
        return `<li>${vazio}</li>`;
    }

    return itens.map((item) => `<li>${item}</li>`).join("");
}

function renderVagas(resultados, elementos) {
    if (resultados.length === 0) {
        elementos.vagasLista.innerHTML = "";
        renderEstado(
            elementos.estadoVagas,
            "Nada encontrado para exibir.",
            "empty"
        );
        return;
    }

    renderEstado(
        elementos.estadoVagas,
        `${resultados.length} vagas analisadas.`
    );

    elementos.vagasLista.innerHTML = resultados.map((resultado) => `
        <article class="job-card">
            <p class="job-company">${resultado.vaga.empresa}</p>
            <h3>${resultado.vaga.cargo}</h3>
            <p class="job-meta">
                ${resultado.vaga.nivel} · ${resultado.vaga.modalidade} ·
                ${resultado.vaga.salario}
            </p>

            <div class="compatibility">
                <strong>${resultado.percentual.toFixed(0)}%</strong>
                <span class="badge ${classeCompatibilidade(resultado.classificacao)}">
                    ${resultado.classificacao}
                </span>
            </div>

            <p><strong>Experiência mínima:</strong>
                ${resultado.vaga.minExperiencia} ano(s)
            </p>

            <div class="skills-result">
                <h4>Habilidades encontradas</h4>
                <ul>
                    ${criarLista(resultado.encontradas, "Nenhuma habilidade encontrada.")}
                </ul>
            </div>

            <div class="skills-result">
                <h4>Habilidades faltantes</h4>
                <ul>
                    ${criarLista(resultado.faltantes, "Nenhuma habilidade faltante.")}
                </ul>
            </div>
        </article>
    `).join("");
}

function renderMelhorVaga(melhor, recomendacoes, elementos) {
    if (!melhor) {
        elementos.melhorVaga.innerHTML =
            "<p>Faça uma análise para receber sua recomendação.</p>";
        return;
    }

    const listaRecomendacoes = recomendacoes.length > 0
        ? recomendacoes.map((item) =>
            `<li><strong>${item.habilidade}</strong> — aparece como necessidade em ${item.quantidade} vaga(s).</li>`
        ).join("")
        : "<li>Seu perfil atende aos requisitos analisados. Continue praticando e aprofundando suas habilidades.</li>";

    elementos.melhorVaga.innerHTML = `
        <h3>${melhor.vaga.empresa} — ${melhor.vaga.cargo}</h3>
        <p>
            Sua maior compatibilidade foi de
            <strong>${melhor.percentual.toFixed(0)}%</strong>.
        </p>
        <p>
            A recomendação considera as habilidades que mais se repetem
            entre os requisitos ainda não dominados.
        </p>
        <ul>${listaRecomendacoes}</ul>
    `;
}

function renderResumo(perfil, resultados, contador, elementos) {
    const melhor = resultados.reduce(
        (atual, resultado) =>
            !atual || resultado.percentual > atual.percentual
                ? resultado
                : atual,
        null
    );

    elementos.resultadoResumo.textContent =
        `${perfil.nome}, foram analisadas ${resultados.length} vagas. ` +
        `Análise nº ${contador}. ` +
        (melhor
            ? `Maior compatibilidade: ${melhor.vaga.empresa}.`
            : "");
}

export {
    obterElementos,
    renderEstado,
    limparErros,
    coletarPerfil,
    validarPerfil,
    preencherFormulario,
    renderVagas,
    renderMelhorVaga,
    renderResumo
};
