# Memória do projeto: Intensivo 1000

Notas para retomar o trabalho em outra sessão. Atualizado em 17/11/2026.

## O que é
App web estático (HTML, CSS e JavaScript, sem build) para aprender inglês. Idioma do app e das conversas: português do Brasil.

- **Intensivo de 8 horas:** as 500 palavras mais usadas e o verbo to be.
- **Aba Etapas:** mais 500 palavras por área (total de 1000), frases prontas, o método do/does/did e 15 situações em diálogo.
- **Formato:** 55 etapas em cards, divididas em 8 partes.

Pedidos do aluno que guiaram as etapas:
- números, cores e frutas;
- estruturas básicas ("método DID DO");
- tudo em etapas, em cards;
- frases da rotina;
- conversas simuladas, como balada, academia e restaurante;
- áreas: negócios, startups, relacionamentos, aeroporto e comida;
- formato que dê para anotar.

- Link do Claude (onde o aluno estuda hoje): https://claude.ai/artifact/TuMyBkwUWUGs8rdgHFmwtF (versão 7)
- Repositório: https://github.com/pedroernestobr/Ingl-s, branch `claude/trusting-allen-3uylp6`
- Site na Vercel: ainda não publicado (ver "Bloqueios")

## Onde o progresso fica salvo
- **Link do Claude:** grava na conta do Claude de quem estuda, em `data/users/<id>/progress`, no banco da própria página. O `js/sync.js` detecta esse caso sozinho.
- **Site (Vercel ou GitHub Pages):** grava no Supabase, projeto `intensivo-500` (ref `zjjcnwudhihvvijijrrm`, região sa-east-1), pelas funções `save_progress` e `load_progress`, com uma chave secreta por aparelho ("código de sincronização").
- O Supabase não recebe nada do link do Claude, porque o Claude bloqueia conexões externas dentro dele.
- O progresso chega à nuvem alguns segundos depois de cada mudança. Ao abrir o app, ele também sobe (corrigido no commit `7d761f1`).

## Estado em 17/11/2026
- **Etapas:**
  - O estado novo fica em `etapas` (sessões concluídas: `w:`, `f:`, `s:`, `g:`, `k:` + id), `pcards` (frases, chave `etapa.n`) e `pnotes`.
  - As palavras novas ficam nas posições 500 a 999 de `window.WORDS`, acrescentadas por `js/areas.js`. Só acrescente no fim.
- **Intensivo:** continua contando só as 500 essenciais (`S.CORE`). O total geral é `S.N` = 1000.
- **Botão Voltar:** aparece em todas as telas. A pausa tem um X.
- **Nuvem:** o envio espera 2,5 s sem mudanças, mas nunca adia mais de 10 s.
- **Cache offline (`sw.js`):** versão `intensivo500-v6`.
- **Semana (tela inicial):**
  - Plano de 7 dias (`WEEK` em `js/app.js`), feito com as tarefas que já existem: `r1`–`r20`, `c1`–`c4`, `t1`–`t11` e sessões de etapa.
  - O gráfico de cobertura usa a Lei de Zipf (1/posição), calibrado para 100 palavras ≈ 50%.
  - O To be saiu da barra de abas. Fica no card das Etapas e no menu lateral.
- **Blocos e som real (`js/blocos.js`):**
  - Parte "Blocos prontos e som real" com a lição `p1` (sessão `g:som`) e 10 etapas `bl-*` (118 blocos).
  - Cada frase pode ter: `[inglês, português, forma falada, pronúncia para brasileiro, trocas]`.
- **Pedidos do aluno (17/11):**
  - aprender as palavras na semana, a partir do gráfico de Zipf que ele mandou;
  - o "som verdadeiro" das frases ("How ya doin'?");
  - blocos prontos de filmes e séries, com pesquisa sobre o método dos poliglotas.
- Verificado na conta do Claude às 21h17 (horário de Brasília): 25 palavras estudadas, 1 fixada, perfil "Pedro".
- O aluno disse estar no bloco 49. O contador mostra 25. Não ficou claro se é diferença real ou falta de registro. A solução é o campo "Já estudei até a palavra nº" em Ajustes.
- Supabase: 0 registros na checagem do dia 16/11. Isso é esperado, porque o aluno estudou pelo link do Claude.

## Bloqueios
- **Vercel:** toda tentativa de criar projeto ou deployment pelo conector recebe 403, "sem permissão para criar projeto". O usuário é Owner do time "COMERCIAL CLOSER" (`team_oaGR3P2NVlR7M8iRNs7RKNzn`), então o bloqueio está nas permissões do conector, não na conta.
- Caminho manual: vercel.com/new, importar `pedroernestobr/Ingl-s`, Framework "Other", sem comando de build e sem pasta de saída.
- Caminho com o conector: reconectar a Vercel em claude.ai (Settings → Connectors → Vercel) e pedir o deploy de novo.

## Estrutura do código
- `index.html`: entrada. Carrega `css/styles.css` e os scripts em ordem: config, words, tobe, store, sync, speech, app.
- `js/words.js`: as 500 palavras em blocos e rodadas.
- `js/areas.js`, `js/dodid.js`, `js/situacoes.js`: as etapas por área, o método do/does/did e os diálogos.
- `js/tobe.js`: a trilha de 11 lições do verbo to be.
- `js/store.js`: progresso, revisão espaçada (caixas de Leitner em minutos), cronômetro e posição de cada etapa.
- `js/sync.js`: sincronização com Supabase ou com o banco do Claude.
- `js/speech.js`: voz e reconhecimento de fala (ou ditado do Claude).
- `js/app.js`: telas e o player das rodadas e lições.
- `sw.js`: cache offline. Mudar `VERSION` a cada publicação nova.
- `supabase/migrations/`: tabela `progress`, RLS e funções.
- Artefato de publicação: gerado por `build_artifact.py` no diretório de scratchpad da sessão anterior. Esse arquivo pode não existir mais; basta recriar a partir de `index.html`, `css/` e `js/`.

## Regras de trabalho combinadas
- Idioma: português do Brasil.
- Design: Apple Premium (tema claro, SF Pro via pilha de fontes do sistema, cores #F5F5F7, #1D1D1F, #86868B e #0071E3).
- Não abrir pull request sem pedido explícito.
- Não fazer commit ou push sem pedido. Exceção: quando o usuário pede para salvar, como nesta nota.
- Testes: Playwright contra `python3 -m http.server 8765` na raiz do repositório.

## Próximos passos
1. Confirmar com o aluno se o progresso mostra o número certo (25 ou 49).
2. Publicar no site quando a Vercel liberar, ou usar o link do Claude.
3. Se o aluno trocar de aparelho, conferir a sincronização nos dois.
