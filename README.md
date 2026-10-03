# SkillMatch Web

Aplicação web em **HTML5 + CSS3 + JavaScript puro** que compara um perfil profissional com vagas fictícias de Front-End.

O sistema permite informar dados do candidato, carregar vagas por `fetch`, calcular a compatibilidade, apresentar os resultados de forma dinâmica e indicar habilidades que podem ser desenvolvidas.

> **Escopo:** sem React, Vue, Angular, TypeScript, Vite, Webpack, Babel, Axios, jQuery, back-end, banco de dados ou CSS Grid. O layout utiliza Flexbox.

## 1. Objetivo

O usuário informa nome, área, experiência e habilidades. A aplicação carrega um catálogo de vagas, calcula a compatibilidade de cada uma, apresenta habilidades encontradas e faltantes, destaca a melhor correspondência e gera uma recomendação de estudo.

## 2. Compatibilidade ponderada

Cada requisito da vaga possui um peso. Requisitos estratégicos recebem **3** e requisitos de apoio recebem **1**.

`Compatibilidade = (pontos obtidos / pontos máximos) × 100`

A classificação utilizada na aplicação é:

- **80–100%:** Alta
- **50–79%:** Média
- **0–49%:** Baixa

A experiência mínima da vaga também é considerada no critério de desempate quando duas vagas apresentam o mesmo percentual de compatibilidade.

## 3. Recomendação de estudo

As habilidades faltantes são agrupadas para indicar quais conhecimentos podem ser priorizados. A prioridade considera o peso acumulado da habilidade nas vagas e, em caso de empate, a frequência de ocorrência.

## 4. Programação orientada a objetos

- `Pessoa`: classe base com `constructor` e método `apresentar()`.
- `Candidato extends Pessoa`: acrescenta área, experiência e habilidades.
- `Vaga`: contém empresa, cargo, requisitos, salário, modalidade, experiência mínima e o método `calcularCompatibilidade()`.
- `VagaFrontEnd extends Vaga`: especializa a vaga com `stack` e sobrescreve `obterRotulo()`.

A estrutura utiliza `constructor`, atributos, métodos, `this`, herança e sobrescrita de método.

## 5. JavaScript e organização do código

O projeto utiliza recursos fundamentais e intermediários de JavaScript, incluindo:

- variáveis, strings, números e booleanos;
- arrays e objetos;
- condicionais e operadores;
- estruturas de repetição;
- `map`, `filter`, `every`, `reduce` e `flatMap`;
- funções e arrow functions;
- classes, construtores, `this` e herança;
- callback e closure;
- Promise e `async/await`;
- manipulação do DOM e eventos;
- `preventDefault` e validação de formulário;
- `localStorage`;
- módulos ES com `import` e `export`.

### Organização dos módulos

- `motor.js`: regras, classes, cálculo de compatibilidade, classificação, callback, closure e métodos de array.
- `ui.js`: coleta e validação do formulário e renderização dinâmica.
- `dados.js`: carregamento das vagas, `fetch`, Promise, `async/await` e persistência.
- `main.js`: integração entre os módulos, eventos e fluxo principal da aplicação.

## 6. Carregamento das vagas

O catálogo está em `assets/data/vagas.json` e é carregado com `fetch`.

A aplicação trata os principais estados do carregamento:

1. **Carregando:** apresenta uma mensagem enquanto os dados são obtidos.
2. **Vazio:** informa quando não existem vagas disponíveis.
3. **Erro:** trata falhas de carregamento ou respostas não OK com `try/catch`.
4. **Sucesso:** transforma os dados recebidos em instâncias de `VagaFrontEnd` e renderiza os cards.

## 7. Persistência

O perfil do candidato é salvo com `localStorage.setItem()` e `JSON.stringify()`.

Na abertura da aplicação, `getItem()` e `JSON.parse()` recuperam os dados salvos. A primeira visita é tratada quando o retorno é `null`.

Nenhum dado sensível é armazenado.

## 8. HTML, acessibilidade e SEO

A página utiliza:

- `lang="pt-BR"`;
- estrutura semântica com `header`, `nav`, `main`, `section` e `footer`;
- um único `h1`;
- associação correta entre `label` e campos do formulário;
- `alt` no logo;
- `title` e `meta description`;
- mensagens com `aria-live`;
- `aria-invalid` para situações de erro;
- foco visível para navegação por teclado.

## 9. Responsividade

O CSS utiliza abordagem **mobile-first**. A regra base atende telas pequenas e uma media query amplia o layout para telas maiores.

São utilizados Flexbox, `flex-wrap`, `gap`, `clamp()`, porcentagens, `max-width`, unidades fluidas e `object-fit` para manter o conteúdo adaptável.

O projeto não utiliza CSS Grid.

## 10. Estrutura

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
    │   ├── main.js
    │   ├── motor.js
    │   ├── ui.js
    │   └── dados.js
    └── styles/
        └── index.style.css
```

## 11. Como executar

Como a aplicação utiliza módulos ES e `fetch`, não abra o arquivo diretamente com `file://`.

1. Abra a pasta no VS Code.
2. Instale ou ative a extensão **Live Server**.
3. Abra `index.html` com **Open with Live Server**.
4. Preencha o perfil e clique em **Analisar compatibilidade**.

## 12. Git e GitHub

O projeto foi organizado com `main`, `develop` e branches de funcionalidade. O histórico disponível neste repositório foi reconstruído em 03/10/2026 a partir das versões reais do projeto desenvolvidas ao longo do trabalho. As datas dos commits representam a organização deste repositório e não devem ser interpretadas como datas originais de desenvolvimento.

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

## 13. Vídeo

Prepare um vídeo de até 7 minutos apresentando o objetivo, a execução da aplicação, as principais funcionalidades, a organização das tarefas, a evolução por branches e possíveis melhorias.

**Link do vídeo:** `COLE_AQUI_O_LINK_DO_VIDEO`

## 14. GitHub e AVA

**Repositório:** `COLE_AQUI_O_LINK_DO_GITHUB`

Após publicar o repositório e o vídeo, atualize os links acima e faça a submissão no AVA.

## 15. Melhorias futuras

- filtros e ordenação por modalidade, salário ou compatibilidade;
- tema claro/escuro persistido;
- publicação no GitHub Pages;
- testes automatizados quando compatíveis com as ferramentas estudadas.
