const CHAVE_PERFIL = "skillmatch:perfil";

async function carregarVagas() {
    const response = await fetch("./assets/data/vagas.json");

    if (!response.ok) {
        throw new Error(`Não foi possível carregar as vagas (${response.status}).`);
    }

    const dados = await response.json();

    if (!Array.isArray(dados) || dados.length === 0) {
        return [];
    }

    return dados;
}

function salvarPerfil(perfil) {
    localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
}

function carregarPerfil() {
    const perfilSalvo = localStorage.getItem(CHAVE_PERFIL);

    if (!perfilSalvo) {
        return null;
    }

    try {
        return JSON.parse(perfilSalvo);
    } catch {
        localStorage.removeItem(CHAVE_PERFIL);
        return null;
    }
}

function removerPerfil() {
    localStorage.removeItem(CHAVE_PERFIL);
}

export {
    carregarVagas,
    salvarPerfil,
    carregarPerfil,
    removerPerfil
};
