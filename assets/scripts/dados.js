const CHAVE_PERFIL = "skillmatch:perfil";

export async function carregarVagas() {
  // fetch retorna uma Promise: a aplicação aguarda essa operação assíncrona.
  const requisicao = new Promise((resolve, reject) => {
    fetch("./assets/data/vagas.json")
      .then(resolve)
      .catch(reject);
  });

  const response = await requisicao;

  if (!response.ok) {
    throw new Error("Não foi possível carregar o catálogo de vagas.");
  }

  const vagas = await response.json();

  if (!Array.isArray(vagas) || vagas.length === 0) {
    return [];
  }

  return vagas;
}

export function salvarPerfil(perfil) {
  localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
}

export function carregarPerfil() {
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

export function removerPerfil() {
  localStorage.removeItem(CHAVE_PERFIL);
}
