class Vaga {
    constructor(dados) {
        this.id = dados.id;
        this.empresa = dados.empresa;
        this.cargo = dados.cargo;
        this.nivel = dados.nivel;
        this.salario = dados.salario;
        this.modalidade = dados.modalidade;
        this.requisitos = dados.requisitos;
        this.minExperiencia = dados.minExperiencia;
    }

    calcularCompatibilidade(candidato) {
        const encontradas = this.requisitos.filter(
            (requisito) => candidato.habilidades.includes(requisito)
        );

        const faltantes = this.requisitos.filter(
            (requisito) => !candidato.habilidades.includes(requisito)
        );

        const percentual = this.requisitos.length === 0
            ? 0
            : (encontradas.length / this.requisitos.length) * 100;

        return {
            vaga: this,
            encontradas,
            faltantes,
            percentual,
            classificacao: classificarCompatibilidade(percentual)
        };
    }

    obterRotulo() {
        return `${this.cargo} - ${this.nivel}`;
    }
}

class VagaFrontEnd extends Vaga {
    constructor(dados) {
        super(dados);
        this.stack = "Front-End";
    }

    obterRotulo() {
        return `${super.obterRotulo()} | Stack: ${this.stack}`;
    }
}

function classificarCompatibilidade(percentual) {
    if (percentual >= 80) {
        return "Alta compatibilidade";
    }

    if (percentual >= 50) {
        return "Média compatibilidade";
    }

    return "Baixa compatibilidade";
}

function criarContadorAnalises() {
    let total = 0;

    return function registrarAnalise() {
        total += 1;
        return total;
    };
}

function executarComCallback(resultados, callback) {
    resultados.forEach(callback);
}

function encontrarMelhorVaga(resultados, candidato) {
    return resultados.reduce((melhor, atual) => {
        if (!melhor) {
            return atual;
        }

        if (atual.percentual > melhor.percentual) {
            return atual;
        }

        if (
            atual.percentual === melhor.percentual &&
            candidato.tempoExperiencia >= atual.vaga.minExperiencia &&
            candidato.tempoExperiencia > melhor.vaga.minExperiencia
        ) {
            return atual;
        }

        return melhor;
    }, null);
}

function gerarRecomendacao(resultados) {
    const faltantes = resultados
        .flatMap((resultado) => resultado.faltantes);

    const frequencia = faltantes.reduce((acumulador, habilidade) => {
        acumulador[habilidade] = (acumulador[habilidade] || 0) + 1;
        return acumulador;
    }, {});

    return Object.entries(frequencia)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([habilidade, quantidade]) => ({
            habilidade,
            quantidade
        }));
}

export {
    Vaga,
    VagaFrontEnd,
    classificarCompatibilidade,
    criarContadorAnalises,
    executarComCallback,
    encontrarMelhorVaga,
    gerarRecomendacao
};
