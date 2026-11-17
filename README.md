# Intensivo 1000

Um app web para aprender **1000 palavras do inglês**:

- **As 500 mais usadas e o verbo to be completo, em 8 horas.** É o intensivo de um dia. O app guia cada passo: quais palavras estudar, quando revisar, quando fazer uma lição de gramática, quando falar e quando fazer pausa.
- **Mais 500 palavras por área, em etapas.** Cada etapa é um card, com frases prontas do dia a dia, o método do, does e did e conversas para ensaiar.
- **Plano de 7 dias (aba Semana, a tela inicial).** As palavras vêm das mais usadas para as menos usadas, seguindo a Lei de Zipf. Cada dia mistura palavras, blocos prontos com o som real da fala americana, gramática e uma situação.

## A semana e a Lei de Zipf

Poucas palavras fazem quase tudo: as 100 mais usadas formam cerca de 50% de um texto, e as 10 primeiras, cerca de 25%. A aba **Semana** mostra essa curva com a sua posição ("Você: 49") e divide o estudo em 7 dias:

| Dia | Foco |
|---|---|
| 1 | Palavras 1 a 100, a lição do som real, cumprimentos, números e cores |
| 2 | Palavras 101 a 200, gonna e wanna, do e don't, frutas e calendário |
| 3 | Palavras 201 a 300, perguntas, reações das séries, comida e compras |
| 4 | Palavras 301 a 400, pedidos, roupas, aeroporto e hotel |
| 5 | Palavras 401 a 500, verbos frasais, o passado com did e transporte |
| 6 | Relacionamentos, família, sentimentos, saúde, casa e a rotina |
| 7 | Negócios, startups, escritório, dinheiro e as falas das séries |

Cada dia tem de 10 a 15 tarefas: rodadas, provas, lições de to be e de do/does/did, etapas por área e situações. São cerca de 2 a 3 horas por dia. O intensivo de 8 horas continua disponível na aba **Intensivo**.

## Blocos prontos e o som real

Mais da metade do que um nativo fala é feita de combinações prontas. Por isso, a parte **Blocos prontos e som real** tem 118 blocos em 10 etapas: cumprimentos, gonna/wanna/gotta, perguntas, reações, pedidos, verbos frasais, opinião, trabalho, rotina e falas de filmes e séries.

Cada bloco mostra:
- a frase completa e a tradução;
- **como soa de verdade:** a forma falada ("How ya doin'?") e a pronúncia escrita para brasileiro ("háu iá dúin?"), com áudio natural e devagar;
- em alguns blocos, frases para **trocar o final** e criar a sua ("I'm gonna grab a coffee", "I'm gonna head out").

A lição **Como o americano fala de verdade** explica gonna e wanna, o T que vira R (water, later), you que vira ya, did you que vira didja e as palavras que se juntam.

Como ler a pronúncia escrita:
- **â** é um "a" fraco;
- **h** é um sopro, como o "r" de "rato";
- o **r** entre vogais é o "r" de "caro";
- **d** em "dâ" e "dét" é o TH, com a língua entre os dentes;
- o **acento** marca a sílaba forte.

### A pesquisa por trás

| Fonte | O que mostra |
|---|---|
| Lei de Zipf e Oxford English Corpus | As 100 palavras mais usadas formam cerca de 50% do texto |
| Erman e Warren (2000) | Cerca de 58% da fala e 52% da escrita são combinações prontas |
| SUBTLEX-US (Brysbaert e New, 2009) | Frequências de legendas de filmes e séries refletem melhor as palavras que as pessoas conhecem |
| Abordagem lexical (Michael Lewis, 1993) | A língua é feita de blocos de vocabulário, organizados por função |
| PHRASE List (Martinez e Schmitt, 2012) | As 505 expressões de várias palavras mais frequentes do inglês |
| Adolphs e Schmitt (2003); Nation (2006) | De 2.000 a 3.000 famílias de palavras cobrem cerca de 95% da fala do dia a dia |

Os números de cobertura são estimativas. Eles variam com o tipo de texto e com a forma de contar as palavras.

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

- **Semana (tela inicial):** o dia de hoje com as tarefas, o gráfico da Lei de Zipf com a sua posição e os 7 dias em cards. Cada dia abre uma página com as suas tarefas.
- **Intensivo:** painel do dia com as 500 essenciais (estudadas, fixadas, tempo, ritmo e próxima ação), aviso de pausa e trilha com as 20 rodadas e as 4 provas. Na barra de cima, a nuvem mostra se o progresso está salvo.
- **Etapas:** os 55 cards por parte, com o progresso de palavras, frases e etapas. Cada etapa abre uma página com os botões de estudo, as palavras, as frases ou a conversa, e a lista para copiar.
- **To be:** a trilha de 11 lições e a cola do verbo to be. Fica no card "Verbo to be" da aba Etapas e no menu lateral.
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
js/blocos.js          os blocos prontos com o som real e a lição de fala encadeada
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
