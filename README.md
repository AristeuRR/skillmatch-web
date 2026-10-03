# SkillMatch Web

Aplicação web acadêmica para análise de compatibilidade entre o perfil profissional de uma pessoa candidata e vagas de desenvolvimento Front-End.

## Objetivo

O SkillMatch transforma o motor de compatibilidade desenvolvido no projeto anterior em uma Single Page Application feita com HTML, CSS e JavaScript puro.

A aplicação permite:

- preencher um perfil profissional;
- informar habilidades e tempo de experiência;
- carregar vagas a partir de um arquivo JSON usando `fetch`;
- calcular a compatibilidade com cada vaga;
- separar habilidades encontradas e faltantes;
- classificar a compatibilidade em Alta, Média ou Baixa;
- identificar a vaga de maior compatibilidade;
- gerar uma recomendação de estudo;
- salvar o perfil no `localStorage`;
- recuperar o perfil em uma nova visita;
- apresentar uma interface responsiva, semântica e acessível.

## Tecnologias

- HTML5 semântico
- CSS3
- JavaScript
- DOM e eventos
- Flexbox
- ES Modules (`import` / `export`)
- Fetch API
- Promise / async / await
- LocalStorage
- Git e GitHub

Não foram utilizados React, TypeScript, Vite, Webpack, Bootstrap, jQuery, Axios, CSS Grid ou back-end.

## Estrutura

```text
skillmatch-web/
├── index.html
├── README.md
└── assets/
    ├── data/
    │   └── vagas.json
    ├── img/
    │   └── logo.svg
    ├── scripts/
    │   ├── dados.js
    │   ├── main.js
    │   ├── motor.js
    │   └── ui.js
    └── styles/
        └── index.style.css
```

## Como executar

1. Baixe ou clone o repositório.
2. Abra a pasta no VS Code.
3. Instale/ative a extensão Live Server.
4. Abra o `index.html` usando o Live Server.
5. Preencha o formulário e clique em **Analisar vagas**.

O projeto não deve ser aberto diretamente como `file://`, porque usa módulos ES e `fetch`.

## Regra de compatibilidade

Para cada vaga:

```text
compatibilidade =
(habilidades encontradas / quantidade de requisitos) × 100
```

Exemplo:

```text
4 habilidades encontradas
5 requisitos

4 / 5 × 100 = 80%
```

As classificações seguem as faixas solicitadas:

- 80% a 100% — Alta compatibilidade
- 50% a 79% — Média compatibilidade
- 0% a 49% — Baixa compatibilidade

## Recomendação de estudo

A aplicação identifica as habilidades faltantes e conta em quantas vagas cada habilidade aparece como requisito.

As habilidades faltantes que aparecem com maior frequência recebem prioridade na recomendação.

## POO

O motor possui:

- `Vaga`, com construtor, atributos e métodos;
- `VagaFrontEnd`, que herda de `Vaga`;
- `this` para acessar atributos da própria instância;
- sobrescrita do método `obterRotulo()` na subclasse.

A herança representa uma especialização do modelo geral de vaga para o domínio Front-End.

## Métodos de array

O projeto utiliza vários métodos:

- `map()` para transformar dados do JSON em instâncias e gerar resultados;
- `filter()` para separar habilidades encontradas e faltantes;
- `reduce()` para encontrar a melhor vaga e contabilizar habilidades;
- `flatMap()` e `sort()` na recomendação de estudo.

## Callback e closure

A função `executarComCallback()` recebe outra função como argumento e executa essa função para cada resultado.

A função `criarContadorAnalises()` utiliza closure para preservar internamente a quantidade de análises realizadas durante a sessão.

## Fetch e estados

O catálogo é carregado de `assets/data/vagas.json` por `fetch`.

São tratados:

- carregando;
- sucesso;
- catálogo vazio;
- erro de carregamento.

## LocalStorage

O perfil é salvo usando:

```javascript
JSON.stringify()
```

e recuperado usando:

```javascript
JSON.parse()
```

A primeira visita é tratada quando `localStorage.getItem()` retorna `null`.

Nenhum dado sensível é armazenado.

## HTML, acessibilidade e SEO

A página utiliza:

- `header`, `nav`, `main`, `section`, `article` e `footer`;
- um único `h1`;
- hierarquia de títulos;
- `label` associado aos campos;
- `lang="pt-BR"`;
- imagem com `alt`;
- mensagens de erro acessíveis;
- `role="status"` e `aria-live`;
- foco visível;
- `title`;
- `meta description`.

## Responsividade

O layout utiliza Flexbox, unidades relativas, `clamp()`, `max-width`, `flex-wrap` e media queries.

A abordagem é mobile-first e deve ser testada no modo responsivo do DevTools.

## Arquitetura cliente-servidor

Mesmo sendo uma aplicação estática, o projeto simula a comunicação cliente-servidor por meio do `fetch`.

O navegador atua como cliente e solicita o arquivo `vagas.json`. O `fetch` retorna uma Promise, e o `async/await` permite aguardar a resposta antes de transformar os dados e executar a análise.

Em uma aplicação real, o arquivo JSON poderia ser substituído por uma API.

## Módulos

O JavaScript foi separado em:

- `motor.js`: regras de negócio, classes e cálculo;
- `dados.js`: `fetch` e persistência;
- `ui.js`: DOM, formulário e renderização;
- `main.js`: ponto de entrada e orquestração.

## Git e GitHub

Estratégia prevista:

```text
main
└── develop
    ├── feature/estrutura-inicial
    ├── feature/motor-skillmatch
    ├── feature/formulario
    ├── feature/renderizacao
    ├── feature/fetch-localstorage
    ├── feature/responsividade
    └── feature/documentacao
```

As feature branches são criadas a partir de `develop`, integradas em `develop` e, ao final, `develop` é integrado em `main`.

## Kanban

O quadro deve conter as colunas:

- Backlog
- A Fazer
- Em Andamento
- Concluído

Cada funcionalidade importante do projeto deve possuir um cartão correspondente.

## Vídeo

O vídeo de apresentação deve demonstrar:

1. objetivo do sistema;
2. execução da aplicação;
3. como executar o projeto;
4. organização das tarefas;
5. branches utilizadas;
6. pontos que ainda poderiam ser melhorados;
7. uso de IA e validações realizadas.

**Link do vídeo:** inserir após a publicação.

## Melhorias futuras

Possíveis evoluções:

- filtro e ordenação das vagas;
- tema claro/escuro persistido;
- deploy no GitHub Pages;
- integração com uma API real de vagas;
- testes automatizados.

## Uso de IA

A IA foi utilizada como apoio ao desenvolvimento e revisão da solução. Cada trecho gerado deve ser executado, revisado e compreendido antes de ser incorporado ao projeto, conforme orientação do enunciado.
