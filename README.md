# SkillMatch Web

Aplicação Single Page em **HTML5 + CSS3 + JavaScript puro** que compara um perfil profissional com vagas fictícias de Front-End. O projeto reaproveita o motor do Mini-Projeto SkillMatch JS e o transforma em uma aplicação web com formulário, DOM, `fetch`, `localStorage`, módulos ES, POO, callback, closure e cálculo de compatibilidade ponderado.

> **Escopo:** sem React, Vue, Angular, TypeScript, Vite, Webpack, Babel, Axios, jQuery, back-end, banco de dados ou CSS Grid. O layout usa Flexbox.

## 1. Objetivo

O usuário informa nome, área, experiência e habilidades. O sistema carrega um catálogo de vagas por `fetch`, transforma os objetos JSON em instâncias das classes do motor, calcula a compatibilidade, classifica cada vaga, mostra habilidades encontradas e faltantes, destaca a maior compatibilidade e recomenda estudos.

## 2. Compatibilidade ponderada

Cada requisito do JSON possui um peso. Requisitos estratégicos recebem **3** e requisitos de apoio recebem **1**.

`Compatibilidade = (pontos obtidos / pontos máximos) × 100`

Classificação exigida pelo projeto:
- **80–100%:** Alta
- **50–79%:** Média
- **0–49%:** Baixa

A experiência mínima da vaga também é exibida e participa do critério de desempate da melhor vaga quando os percentuais são iguais.

## 3. Recomendação de estudo

As habilidades faltantes são agrupadas. A prioridade considera o peso acumulado da habilidade nas vagas e, em caso de empate, a frequência de ocorrência. Assim o critério fica explícito e reproduzível.

## 4. POO

- `Pessoa`: classe base com `constructor` e método `apresentar()`.
- `Candidato extends Pessoa`: acrescenta área, experiência e habilidades.
- `Vaga`: contém empresa, cargo, requisitos, salário, modalidade, experiência mínima e o método `calcularCompatibilidade()`.
- `VagaFrontEnd extends Vaga`: especializa a vaga com `stack` e sobrescreve `obterRotulo()`. A herança representa uma especialização real do domínio.

## 5. Métodos e conceitos de JavaScript

O projeto demonstra: `const`, `let`, `var` explicado no README, strings, números, booleanos, arrays, objetos, `if/else`, operadores lógicos/matemáticos, `for`, `map`, `filter`, `every`, `reduce`, `flatMap`, arrow functions, funções, classes, construtores, `this`, herança, callback, closure, Promise, `async/await`, DOM, eventos, `classList`, `createElement`, `innerHTML`, `preventDefault`, `localStorage` e módulos ES.

### Onde aparecem

- `motor.js`: regras, classes, cálculo ponderado, classificação, callback, closure e métodos de array.
- `ui.js`: coleta/validação do formulário, `classList`, `createElement` e renderização dinâmica.
- `dados.js`: `fetch`, Promise, `async/await`, `response.ok` e `localStorage`.
- `main.js`: orquestração, eventos e integração entre módulos.

## 6. Fetch e os três estados

`assets/data/vagas.json` é o catálogo local. O navegador atua como cliente e solicita o recurso com `fetch`. A aplicação trata explicitamente:

1. **Carregando:** mensagem de carregamento.
2. **Vazio:** catálogo sem vagas.
3. **Erro:** falha de rede ou resposta não OK, tratada com `try/catch`.
4. **Sucesso:** transformação do JSON em instâncias de `VagaFrontEnd` e renderização dos cards.

Isso demonstra a ideia de arquitetura cliente-servidor sem criar back-end, conforme o escopo do projeto.

## 7. Persistência

O perfil é salvo com `localStorage.setItem()` e `JSON.stringify()`. Na abertura, `getItem()` e `JSON.parse()` recuperam o perfil. A primeira visita é tratada quando o retorno é `null`. Nenhum dado sensível é armazenado.

## 8. HTML, acessibilidade e SEO

A página possui `lang="pt-BR"`, `header`, `nav`, `main`, `section`, `footer`, um único `h1`, `label/for`, `alt` no logo, `title`, `meta description`, mensagens `aria-live`, `aria-invalid` nos erros e foco visível para teclado.

## 9. Responsividade

O CSS foi estruturado **mobile-first**: a regra base atende telas pequenas e `@media (min-width: 700px)` amplia o layout. O projeto usa Flexbox, `clamp()`, porcentagens, `max-width`, `max-width: 100%` e `object-fit` para imagens e media query. Não usa CSS Grid.

## 10. Estrutura

```text
skillmatch-web/
├── index.html
├── README.md
├── planejamento/
│   └── tarefas-kanban.md
└── assets/
    ├── data/
    │   └── vagas.json
    ├── img/
    │   └── logo.svg
    ├── scripts/
    │   ├── main.js
    │   ├── motor.js
    │   ├── ui.js
    │   └── dados.js
    └── styles/
        └── index.style.css
```

## 11. Como executar

Como há módulos ES e `fetch`, não abra o arquivo diretamente com `file://`.

1. Abra a pasta no VS Code.
2. Instale/ative a extensão **Live Server**.
3. Abra `index.html` com **Open with Live Server**.
4. Preencha o perfil e clique em **Analisar compatibilidade**.

Extensões recomendadas: **Live Server** e, opcionalmente, uma extensão de validação/formatador já utilizada no curso.

## 12. Checklist RF01–RF15

| Requisito | Implementação |
|---|---|
| RF01 Perfil | formulário + objeto + classe `Candidato` + experiência |
| RF02 Catálogo | 4 vagas em `vagas.json`, carregadas via `fetch` |
| RF03 Compatibilidade | `Vaga.calcularCompatibilidade()` com encontrados/faltantes |
| RF04 Classificação | `classificarCompatibilidade()` com 80/50/0 |
| RF05 Melhor + estudo | `encontrarMelhorVaga()` + `gerarRecomendacao()` |
| RF06 Arrays | `map`, `filter`, `every`, `reduce`, `flatMap` |
| RF07 POO | `Vaga` + `VagaFrontEnd extends Vaga` + `this` |
| RF08 Callback + closure | `executarComCallback()` + `criarCalculadoraPeso()`/contador |
| RF09 HTML/SEO | landmarks, um h1, labels, alt, lang, title, description |
| RF10 Formulário | `addEventListener`, `preventDefault`, validação e mensagens acessíveis |
| RF11 DOM | cards com `createElement` + `innerHTML` + `classList` |
| RF12 Responsivo | mobile-first + Flexbox + media query + unidades fluidas |
| RF13 Fetch | Promise + async/await + try/catch + response.ok + carregando/vazio/erro |
| RF14 LocalStorage | set/get + JSON.stringify/parse + tratamento de null |
| RF15 Módulos ES | `main.js`, `motor.js`, `ui.js`, `dados.js` com import/export |

## 13. Git e GitHub

O projeto foi organizado com `main`, `develop` e branches de funcionalidade. O histórico disponível neste repositório foi reconstruído em 03/10/2026 a partir das versões reais do projeto que foram desenvolvidas ao longo do trabalho. As datas dos commits representam essa organização do repositório e não devem ser interpretadas como datas originais de desenvolvimento.

Estrutura adotada:

```text
main
└── develop
    ├── feature/motor-compatibilidade
    ├── feature/dados-persistencia
    ├── feature/interface-formulario
    ├── feature/qualidade-final
    ├── feature/experiencia-desempate
    ├── feature/tema-filtros
    └── feature/documentacao-entrega
```

O resultado final foi integrado em `main`.

## 14. Kanban

O arquivo `planejamento/tarefas-kanban.md` registra o planejamento e o estado das tarefas. Para a entrega, publique esse quadro no Trello, GitHub Projects ou ferramenta equivalente e coloque o link real abaixo.

**Link do Kanban:** `COLE_AQUI_O_LINK_DO_TRELLO_OU_GITHUB_PROJECTS`

## 15. Vídeo

Prepare um vídeo de até 7 minutos apresentando o objetivo, a execução da aplicação, as principais funcionalidades, a organização das tarefas, o uso de branches e possíveis melhorias.

**Link do vídeo:** `COLE_AQUI_O_LINK_DO_VIDEO`

## 16. GitHub e AVA

**Repositório:** `COLE_AQUI_O_LINK_DO_GITHUB`

Após publicar o repositório e o vídeo, atualize os links acima e faça a submissão no AVA.

## 17. Uso de IA

A IA foi usada como apoio para revisar a estrutura, transportar a lógica do Mini-Projeto para a aplicação web e conferir a implementação. O estudante deve revisar, testar e conseguir explicar o código. No vídeo, descreva de forma transparente onde a IA foi utilizada e quais partes foram revisadas.

## 18. Melhorias futuras

- filtro/ordenação por modalidade, salário ou compatibilidade;
- tema claro/escuro persistido;
- deploy no GitHub Pages;
- testes automatizados quando compatíveis com as ferramentas estudadas.

## 19. Checklist antes de entregar

- [ ] Testei no Live Server.
- [ ] Testei o formulário e as mensagens de erro.
- [ ] Testei carregando, vazio e erro do catálogo.
- [ ] Testei o localStorage e a primeira visita.
- [ ] Testei no modo responsivo do DevTools.
- [ ] Rodei Lighthouse para acessibilidade/SEO.
- [ ] Criei `develop` e feature branches.
- [ ] Fiz commits descritivos e mergeei o resultado na `main`.
- [ ] Criei/publicei o Kanban e atualizei os cartões.
- [ ] Gravei o vídeo de até 7 minutos.
- [ ] Coloquei os três links no README e no AVA.
- [ ] Conferi que não há React, TypeScript, build, back-end ou CSS Grid.
