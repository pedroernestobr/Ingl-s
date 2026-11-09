# Inglês em 12 Semanas

Um app web para aprender inglês em 84 dias, do nível A1 ao B1, com lições curtas todos os dias.

O visual segue o padrão da Apple (Human Interface Guidelines): fonte do sistema (SF Pro no iPhone, iPad e Mac), cores do iOS, título grande que encolhe ao rolar, listas agrupadas, tab bar translúcida no iPhone, barra lateral no iPad e no Mac, anéis de atividade e alertas no estilo iOS. Os temas claro e escuro seguem o aparelho.

Não precisa de cadastro, servidor ou instalação: o progresso fica salvo no próprio navegador. Funciona no celular, pode ser instalado na tela inicial e continua funcionando offline depois da primeira visita.

## Como usar

1. Abra o `index.html` no navegador. Para instalar no celular e usar offline, publique no GitHub Pages (veja abaixo).
2. Informe seu nome, quanto tempo quer estudar por dia e a data de início.
3. Todo dia, abra a **Trilha** e toque no círculo marcado com **Começar**. O app sempre leva você à próxima atividade.

## O método

| Pilar | Como aparece no app |
|---|---|
| Input compreensível | Frases reais com tradução e áudio em cada lição |
| Repetição espaçada | Sistema de Leitner com 5 caixas: os cartões voltam em 1, 2, 4, 8 e 16 dias |
| Shadowing | Ouvir, repetir 3 vezes em voz alta e testar a pronúncia pelo microfone |
| Recordação ativa | Exercícios de múltipla escolha, escuta e montagem de frases |
| Produção diária | Um texto curto por dia, salvo no Diário de escrita |
| Execução em 12 semanas | Meta semanal, placar de execução (meta: 85%) e reflexão no Dia 7 |

**Ritmo da semana**

- **Dias 1 a 5, lição (15 a 20 min):** aquecimento com os cartões vencidos, gramática, 4 palavras novas, 4 exercícios, 2 frases de shadowing e 1 texto.
- **Dia 6, imersão (20 a 30 min):** maratona de shadowing com as 10 frases da semana, 3 missões no mundo real e a missão da semana.
- **Dia 7, revisão semanal (10 a 15 min):** checkpoint de 10 questões, autoavaliação da meta, placar de execução e reflexão.

**Fases**

- **Semanas 1 a 4, Fundação (A1):** apresentações, rotina, família e casa, comida e restaurante.
- **Semanas 5 a 8, Construção (A2):** cidade e direções, passado, futuro, compras e comparações.
- **Semanas 9 a 12, Fluência (B1):** trabalho e present perfect, viagens e modais, opiniões e condicionais, conversação real.

Ao todo são 240 palavras e expressões, 120 frases de shadowing, 120 exercícios de gramática e 60 temas de escrita.

## Telas

- **Trilha:** um caminho vertical com os 84 dias. Cada dia é um círculo: os concluídos ficam coloridos com um visto, o próximo tem o botão "Começar" e os seguintes ficam bloqueados (dá para abrir mesmo assim). O cabeçalho da semana fica fixo no topo, e a barra superior mostra a sequência de dias, os pontos (XP) e os cartões para revisar.
- **Plano:** as 3 fases e as 12 semanas. Cada semana abre uma página própria com os 7 dias, a gramática e as missões de imersão.
- **Revisar:** revisão espaçada, distribuição dos cartões nas 5 caixas, vocabulário com busca e treino livre.
- **Progresso:** anéis de atividade do dia (minutos, lição e revisão), estatísticas, execução por semana, calendário de 84 dias, checkpoints e diário de escrita.
- **Método:** explicação do método dentro do app.
- **Ajustes:** nome, meta diária, data de início, voz e velocidade do áudio, tema claro ou escuro, backup e reinício.

Atalhos de teclado nas lições: `1` a `3` escolhem uma opção, `Enter` continua e `Esc` sai.

## Publicar no GitHub Pages

1. No GitHub, abra **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**, depois a branch e a pasta `/ (root)`.
3. Abra o endereço gerado no celular e use **Adicionar à tela inicial**.

Ao publicar uma versão nova, aumente o número de `VERSION` em `sw.js` para os aparelhos baixarem a atualização.

## Adaptar o conteúdo

Todo o conteúdo está em `js/curriculum.js`, e o formato está explicado no início do arquivo. Para usar outro método ou outro tema, edite só esse arquivo: as telas, os exercícios e a revisão se ajustam sozinhos.

## Estrutura

```
index.html            entrada do app
css/styles.css        visual no padrão Apple: cores do sistema (claro e escuro), tipografia e componentes
js/curriculum.js      conteúdo das 12 semanas
js/store.js           progresso, repetição espaçada (Leitner) e estatísticas
js/speech.js          áudio (voz do aparelho) e reconhecimento de fala
js/app.js             telas, navegação e o player das lições
sw.js                 cache para uso offline
manifest.webmanifest  instalação na tela inicial
```

O áudio usa as vozes do próprio aparelho (Web Speech API). O teste de pronúncia funciona no Chrome, no Edge e no Safari recente. Quando o navegador não oferece reconhecimento de fala, o app usa a autoavaliação.
