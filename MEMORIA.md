# Memória do projeto: Intensivo 500

Notas para retomar o trabalho em outra sessão. Atualizado em 17/11/2026.

## O que é
App web estático (HTML, CSS e JavaScript, sem build) para aprender as 500 palavras mais usadas do inglês e o verbo to be completo em um dia de 8 horas. Idioma do app e das conversas: português do Brasil.

- Link do Claude (onde o aluno estuda hoje): https://claude.ai/artifact/TuMyBkwUWUGs8rdgHFmwtF (versão 7)
- Repositório: https://github.com/pedroernestobr/Ingl-s, branch `claude/trusting-allen-3uylp6`
- Site na Vercel: ainda não publicado (ver "Bloqueios")

## Onde o progresso fica salvo
- **Link do Claude:** grava na conta do Claude de quem estuda, em `data/users/<id>/progress`, no banco da própria página. O `js/sync.js` detecta esse caso sozinho.
- **Site (Vercel ou GitHub Pages):** grava no Supabase, projeto `intensivo-500` (ref `zjjcnwudhihvvijijrrm`, região sa-east-1), pelas funções `save_progress` e `load_progress`, com uma chave secreta por aparelho ("código de sincronização").
- O Supabase não recebe nada do link do Claude, porque o Claude bloqueia conexões externas dentro dele.
- O progresso chega à nuvem alguns segundos depois de cada mudança. Ao abrir o app, ele também sobe (corrigido no commit `7d761f1`).

## Estado em 17/11/2026
- Último commit no branch: `7d761f1`, que envia ao abrir o app o progresso de versões antigas.
- Versão do cache offline (`sw.js`): `intensivo500-v3`.
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
