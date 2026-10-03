/**
 * MOTOR DO SKILLMATCH
 * A regra ponderada reaproveita a ideia do Mini-Projeto:
 * requisitos estratégicos recebem peso 3 e requisitos de apoio recebem peso 1.
 */

export class Pessoa {
  constructor(nome) {
    this.nome = nome;
  }

  apresentar() {
    return `Candidato: ${this.nome}`;
  }
}

export class Candidato extends Pessoa {
  constructor(nome, areaInteresse, tempoExperiencia, habilidades) {
    super(nome);
    this.areaInteresse = areaInteresse;
    this.tempoExperiencia = Number(tempoExperiencia);
    this.habilidades = habilidades;
  }

  possuiHabilidade(habilidade) {
    return this.habilidades.includes(habilidade);
  }

  apresentar() {
    return `${this.nome} · ${this.areaInteresse}`;
  }
}

export class Vaga {
  constructor(dados) {
    this.id = dados.id;
    this.empresa = dados.empresa;
    this.cargo = dados.cargo;
    this.nivel = dados.nivel;
    this.modalidade = dados.modalidade;
    this.salario = dados.salario;
    this.minExperience = Number(dados.minExperience ?? 0);
    this.requisitos = dados.requisitos;
  }

  getPeso(requisito) {
    return Number(requisito.peso) || 1;
  }

  pesoTotal() {
    return this.requisitos.reduce(
      (total, requisito) => total + this.getPeso(requisito),
      0
    );
  }

  calcularCompatibilidade(candidato) {
    const encontrados = this.requisitos.filter((requisito) =>
      candidato.possuiHabilidade(requisito.nome)
    );

    const faltantes = this.requisitos.filter((requisito) =>
      !candidato.possuiHabilidade(requisito.nome)
    );

    const pontosObtidos = encontrados.reduce(
      (total, requisito) => total + this.getPeso(requisito),
      0
    );

    const pontosMaximos = this.pesoTotal();

    const percentual = pontosMaximos === 0
      ? 0
      : (pontosObtidos / pontosMaximos) * 100;

    return {
      vaga: this,
      encontrados,
      faltantes,
      pontosObtidos,
      pontosMaximos,
      percentual,
      classificacao: classificarCompatibilidade(percentual),
      atendeExperienciaMinima: candidato.tempoExperiencia >= this.minExperience
    };
  }

  obterRotulo() {
    return `${this.empresa} · ${this.cargo}`;
  }
}

export class VagaFrontEnd extends Vaga {
  constructor(dados) {
    super(dados);
    this.stack = "Front-End";
  }

  obterRotulo() {
    return `${super.obterRotulo()} · ${this.stack}`;
  }
}

export function criarCalculadoraPeso(vaga) {
  // Closure: a quantidade fica protegida dentro da função.
  let quantidadeCalculos = 0;

  return function calcularPeso(requisito) {
    quantidadeCalculos += 1;
    return vaga.getPeso(requisito);
  };
}

export function classificarCompatibilidade(percentual) {
  if (percentual >= 80) {
    return "Alta compatibilidade";
  }

  if (percentual >= 50) {
    return "Média compatibilidade";
  }

  return "Baixa compatibilidade";
}

export function executarComCallback(resultados, callback) {
  return resultados.map((resultado) => callback(resultado));
}

export function encontrarMelhorVaga(resultados) {
  if (!resultados.length) {
    return null;
  }

  return resultados.reduce((melhor, atual) => {
    if (atual.percentual > melhor.percentual) {
      return atual;
    }

    if (
      atual.percentual === melhor.percentual &&
      atual.vaga.minExperience <= melhor.vaga.minExperience
    ) {
      return atual;
    }

    return melhor;
  });
}

export function gerarRecomendacao(resultados) {
  const faltantes = resultados.flatMap((resultado) =>
    resultado.faltantes.map((requisito) => ({
      nome: requisito.nome,
      peso: resultado.vaga.getPeso(requisito)
    }))
  );

  const frequencia = faltantes.reduce((acumulador, item) => {
    if (!acumulador[item.nome]) {
      acumulador[item.nome] = {
        nome: item.nome,
        ocorrencias: 0,
        pesoTotal: 0,
        prioridade: 0
      };
    }

    acumulador[item.nome].ocorrencias += 1;
    acumulador[item.nome].pesoTotal += item.peso;
    acumulador[item.nome].prioridade += item.peso;
    return acumulador;
  }, {});

  return Object.values(frequencia)
    .sort((a, b) => {
      if (b.prioridade !== a.prioridade) {
        return b.prioridade - a.prioridade;
      }

      return b.ocorrencias - a.ocorrencias;
    })
    .slice(0, 3);
}

export function explicarPesos(vaga) {
  const calcularPeso = criarCalculadoraPeso(vaga);

  return vaga.requisitos.map((requisito) => ({
    nome: requisito.nome,
    peso: calcularPeso(requisito)
  }));
}
