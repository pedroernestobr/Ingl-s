# Intensivo 1000

Um app web para aprender **1000 palavras do inglês**:

- **As 500 mais usadas e o verbo to be completo, em 8 horas.** É o intensivo de um dia. O app guia cada passo: quais palavras estudar, quando revisar, quando fazer uma lição de gramática, quando falar e quando fazer pausa.
- **Mais 500 palavras por área, em etapas.** Cada etapa é um card, com frases prontas do dia a dia, o método do, does e did e conversas para ensaiar.

Não precisa de cadastro nem instalação. Funciona no celular, pode ser instalado na tela inicial e continua funcionando offline depois da primeira visita.

## Progresso sempre registrado

- **A cada passo:** se você fechar uma rodada ou lição no meio, o app guarda o passo exato. No próximo acesso aparece "Continuar a rodada 2 · passo 49". Cada etapa em andamento tem a sua própria posição.
- **Na nuvem:**
  - No site, o progresso vai para o **Supabase** alguns segundos depois de cada mudança. Para continuar em outro aparelho, use o **código de sincronização** de Ajustes.
  - No link do Claude, o progresso fica salvo na **conta do Claude** de quem estuda.
- **Progresso anterior:** em Ajustes, "Já estudei até a palavra nº" registra como estudadas as palavras até o número informado. Elas vão para revisão.
- **Backup:** em Ajustes também dá para copiar e restaurar o progresso como texto.

## Como funciona o dia

- **20 rodadas de 25 palavras**, de cerca de 20 minutos cada, em ordem de frequência.
- **Trilha completa do verbo to be**: 11 lições curtas. O app sugere uma lição a cada 2 rodadas de palavras.
- **4 blocos de 2 horas.** Cada bloco tem 5 rodadas, uma prova e duas pausas:
  - Bloco 1, de 0h a 2h: O núcleo (palavras 1 a 125).
  - Bloco 2, de 2h a 4h: Ação e vida diária (126 a 250).
  - Bloco 3, de 4h a 6h: Descrever e conectar (251 a 375).
  - Bloco 4, de 6h a 8h: O mundo ao redor (376 a 500).
- **Maratona final** até as 500 palavras ficarem fixadas.
- **Amanhã:** 20 minutos de revisão das palavras da caixa 5.

O cronômetro de 8 horas começa quando você toca em **Começar o intensivo**. O painel mostra as palavras **estudadas** (vistas numa rodada), as **fixadas** (lembradas duas vezes, com 10 minutos de intervalo), o tempo e o ritmo. A cada 50 minutos de estudo o app sugere uma pausa de 10 minutos.

### Uma rodada (cerca de 20 minutos)

1. **Aquecimento:** as revisões que venceram.
2. **5 grupos de 5 palavras.** Para cada palavra: tradução, frase de exemplo, áudio, versão lenta, teste de pronúncia e um campo de anotação. Ao fim de cada grupo, um teste rápido (significado, tradução para o inglês e escuta). As erradas voltam no fim do grupo.
3. **Shadowing:** 3 frases da rodada para ouvir e repetir junto.
4. **Fale em inglês:** 3 frases em português para você dizer em inglês (tradução reversa).
5. **Conversa com IA:** quando o app roda como página do Claude, um parceiro de conversa usa as palavras da rodada e corrige suas respostas com uma dica em português.

### A trilha do verbo to be (cerca de 6 minutos por lição)

| Parte | Lições |
|---|---|
| Presente | 1. Am, is, are · 2. Formas curtas (I'm, you're) · 3. Negativa (isn't, aren't) · 4. Perguntas e respostas curtas · 5. What, where, how + to be · 6. Onde o português usa "ter" (idade, fome, frio, razão) · 7. There is, there are |
| Passado e futuro | 8. Was, were · 9. There was, how was…?, I was born · 10. Will be, be + -ing, imperativo · 11. Revisão final com 15 questões |

Cada lição tem explicação em português com tabela, exemplos com áudio, 8 exercícios (completar, escolher e montar a frase), shadowing, frases para falar em inglês e, quando disponível, conversa com IA focada no to be. A aba **To be** também tem uma "cola" com todas as formas.

## As etapas: mais 500 palavras, frases e situações

A aba **Etapas** mostra 55 cards em 8 partes. Dá para fazer em qualquer ordem.

| Parte | Etapas |
|---|---|
| O básico | Números · Cores · Frutas · Dias, meses e horas |
| Estruturas básicas · Do, does e did | Frases-modelo · Palavras de ligação · 6 lições (do, does, perguntas com do, did, perguntas no passado e revisão) · 4 treinos de verbos |
| Frases do dia a dia | Cumprimentos · Conversa rápida · Pedir, agradecer e se desculpar · Quando você não entende · Opinião · Planos e convites · Reações · Frases da rotina |
| Situações do cotidiano | Balada · Academia · Restaurante · Cafeteria · Check-in no aeroporto · Imigração · Hotel · Uber · Loja de roupas · Farmácia · Primeiro encontro · Pedindo direções · Reunião de trabalho · Pitch para investidor · Entrevista de emprego |
| Comida e compras | Comida e restaurante · Compras · Roupas |
| Viagem | Aeroporto · Hotel · Transporte e direções · Emergências |
| Pessoas e casa | Relacionamentos · Família · Sentimentos · Corpo e saúde · Casa e rotina |
| Trabalho e negócios | Negócios · Startups · Escritório e e-mails · Dinheiro e banco |

O que cada tipo de etapa tem:

- **Palavras de uma área:** 25 palavras com exemplo e 10 a 12 frases prontas. Palavras que já estão nas 500 essenciais (one, red, fruit) usam o mesmo progresso.
- **Frases:** cada frase tem áudio, versão lenta, teste de pronúncia e anotação. Depois vêm exercícios (escolher e montar a frase) e frases para falar em inglês.
- **Situação:** a conversa completa com tradução e o botão "Ouvir a conversa inteira". No ensaio, você diz as suas falas em inglês depois de ouvir a outra pessoa. Com a IA disponível, ela faz o outro papel.
- **Do, does e did:** lições no formato do to be. Nos treinos, cada verbo passa por 9 frases: eu, você e ela, afirmando, negando e perguntando, no presente e no passado.

Toda etapa tem **cards para memorizar** (repetição espaçada para palavras e frases) e uma **lista para anotar no caderno**, pronta para copiar. As frases vencidas também aparecem em **Revisar**, e as notas de frases aparecem no **Caderno**.

## As 13 técnicas

| Técnica | Como aparece no app |
|---|---|
| Frequência primeiro | As 500 palavras em ordem de uso. As 100 primeiras já formam cerca de metade de qualquer texto. |
| Pedaços pequenos | 5 palavras por vez |
| Recordação ativa | Teste logo depois de aprender e revisões sem ver a resposta |
| Repetição espaçada | Caixas de Leitner em minutos: 1 min, 10 min, 30 min, 2 h e amanhã |
| Contexto | Cada palavra numa frase real, com tradução |
| Pronúncia em voz alta | Áudio, versão lenta e teste com o microfone |
| Shadowing | Repetir junto com o áudio |
| Tradução reversa e conversa | Dizer frases em inglês e conversar com a IA |
| Associação e anotação | Campo de anotação em cada palavra e um Caderno |
| Pausas e sono | Pausa de 10 min a cada 50 e revisão no dia seguinte |
| Frases prontas | Blocos inteiros para decorar, por área e do dia a dia |
| Do, does e did | Um verbo, nove frases: afirmar, negar e perguntar no presente e no passado |
| Ensaio de situações | Conversas da balada, do restaurante, da reunião e outras para ensaiar |

## Telas

Em todas as telas, o botão **Voltar** no topo leva à tela anterior.

- **Intensivo:** painel do dia com as 500 essenciais (estudadas, fixadas, tempo, ritmo e próxima ação), aviso de pausa e trilha com as 20 rodadas e as 4 provas. Na barra de cima, a nuvem mostra se o progresso está salvo.
- **Etapas:** os 55 cards por parte, com o progresso de palavras, frases e etapas. Cada etapa abre uma página com os botões de estudo, as palavras, as frases ou a conversa, e a lista para copiar.
- **To be:** a trilha de 11 lições e a cola do verbo to be.
- **Palavras:** as 1000 palavras com filtro (novas, em treino, fixadas) e busca. Tocar numa palavra abre áudio, exemplo, teste de pronúncia e anotação.
- **Revisar:** revisões vencidas, frases para revisar, caixas de Leitner, "Treinar as que faltam" e "Revisão relâmpago".
- **Caderno:** anotações livres e as notas de cada palavra e de cada frase, com dicas de associação.
- **Método:** as técnicas, o plano das 8 horas e o que esperar de forma realista.
- **Ajustes:** sincronização, "Já estudei até a palavra nº", nome, voz, tema, backup, reiniciar o cronômetro e apagar tudo.

## Banco de dados (Supabase)

- **Projeto:** `intensivo-500`, na região de São Paulo. As migrações estão em `supabase/migrations/`.
- **Tabela `progress`:** guarda um registro por chave de aluno. O RLS está ligado e não há acesso direto pela API.
- **Funções `save_progress` e `load_progress`:** o app só lê e grava por elas, sempre com a chave secreta do aluno. Um aparelho com progresso mais antigo não sobrescreve um mais novo.
- **Bucket público `app`:** guarda o CSS e o JavaScript usados pela versão publicada na Vercel, em pastas por versão.

`js/config.js` traz a URL do projeto e a chave publicável. Essa chave foi feita para ficar no navegador e só dá acesso às duas funções acima.

## Publicar

- **GitHub Pages:**
  1. No GitHub, abra **Settings → Pages**.
  2. Em **Source**, escolha **Deploy from a branch**, depois a branch e a pasta `/ (root)`.
- **Vercel:** importe o repositório como projeto estático, sem comando de build e com a pasta de saída na raiz.

Ao publicar uma versão nova, mude o valor de `VERSION` em `sw.js` para os aparelhos baixarem a atualização.

## Estrutura

```
index.html            entrada do app
css/styles.css        design system: cores, tipografia e componentes
js/config.js          endereço do Supabase e chave publicável
js/words.js           as 500 palavras essenciais (inglês, português, exemplo e tradução), blocos e rodadas
js/areas.js           as etapas por área: as outras 500 palavras e as frases prontas
js/dodid.js           lições e treinos de verbos com do, does e did
js/situacoes.js       as situações do cotidiano em diálogo
js/tobe.js            a trilha do verbo to be: explicações, tabelas, exemplos e exercícios
js/store.js           progresso, revisão espaçada em minutos, cronômetro e posição das etapas
js/sync.js            sincronização com o Supabase (site) ou com a conta do Claude (link do Claude)
js/speech.js          voz do aparelho e reconhecimento de fala (ou ditado do Claude)
js/app.js             telas, trilhas, pausa, conversa com IA e o player das rodadas e lições
sw.js                 cache para uso offline
manifest.webmanifest  instalação na tela inicial
supabase/migrations/  tabela, funções e bucket do Supabase
```

Para trocar ou corrigir as essenciais, edite `js/words.js`. Cada linha segue o formato `[inglês, português, exemplo, tradução do exemplo]`, e a lista precisa ter 500 itens. As lições de to be ficam em `js/tobe.js`.

Nas etapas (`js/areas.js`), o progresso de cada palavra nova fica guardado pela posição dela. Por isso, só acrescente etapas e palavras no fim do arquivo: não reordene nem apague.
