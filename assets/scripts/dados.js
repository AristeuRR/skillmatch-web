const CHAVE_PERFIL = "skillmatch:perfil";

export async function carregarVagas() {
  const response = await fetch("./assets/data/vagas.json");

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
