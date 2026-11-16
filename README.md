# Intensivo 500

Um app web para aprender **as 500 palavras mais usadas do inglês em 8 horas**, num único dia de estudo intensivo. Ele guia cada passo: quais palavras estudar, quando revisar, quando falar e quando fazer pausa.

Não precisa de cadastro, servidor nem instalação. O progresso fica salvo no próprio navegador. Funciona no celular, pode ser instalado na tela inicial e continua funcionando offline depois da primeira visita.

## Como funciona o dia

- **20 rodadas de 25 palavras**, de cerca de 20 minutos cada, em ordem de frequência.
- **4 blocos de 2 horas.** Cada bloco tem 5 rodadas, uma prova e duas pausas:
  - Bloco 1, de 0h a 2h: O núcleo (palavras 1 a 125).
  - Bloco 2, de 2h a 4h: Ação e vida diária (126 a 250).
  - Bloco 3, de 4h a 6h: Descrever e conectar (251 a 375).
  - Bloco 4, de 6h a 8h: O mundo ao redor (376 a 500).
- **Maratona final** até as 500 palavras ficarem aprendidas.
- **Amanhã:** 20 minutos de revisão das palavras da caixa 5.

O cronômetro de 8 horas começa quando você toca em **Começar o intensivo**. O painel mostra as palavras aprendidas, o tempo e se você está à frente ou atrás do ritmo. A cada 50 minutos de estudo o app sugere uma pausa de 10 minutos.

### Uma rodada (cerca de 20 minutos)

1. **Aquecimento:** as revisões que venceram.
2. **5 grupos de 5 palavras.** Para cada palavra: tradução, frase de exemplo, áudio, versão lenta, teste de pronúncia e um campo de anotação. Ao fim de cada grupo, um teste rápido (significado, tradução para o inglês e escuta). As erradas voltam no fim do grupo.
3. **Shadowing:** 3 frases da rodada para ouvir e repetir junto.
4. **Fale em inglês:** 3 frases em português para você dizer em inglês (tradução reversa).
5. **Conversa com IA:** quando o app roda como página do Claude, um parceiro de conversa usa as palavras da rodada e corrige suas respostas com uma dica em português.

## As 10 técnicas

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

**Quando uma palavra conta como aprendida:** depois que você lembra dela duas vezes, com pelo menos 10 minutos de intervalo (caixa 3 ou mais). Assim o número de "aprendidas" não é inflado.

## Telas

- **Intensivo:** painel do dia (aprendidas, tempo, ritmo, próxima ação), aviso de pausa e trilha com as 20 rodadas e as 4 provas.
- **Palavras:** as 500 palavras com filtro (novas, em treino, aprendidas) e busca. Tocar numa palavra abre áudio, exemplo, teste de pronúncia e anotação.
- **Revisar:** revisões vencidas, caixas de Leitner, "Treinar as que faltam" e "Revisão relâmpago".
- **Caderno:** anotações livres e as notas de cada palavra, com dicas de associação.
- **Método:** as técnicas, o plano das 8 horas e o que esperar de forma realista.
- **Ajustes:** nome, voz, velocidade, tema, backup, reiniciar o cronômetro e apagar tudo.

## Microfone e conversa

- **Áudio:** usa as vozes do próprio aparelho.
- **Teste de pronúncia:** funciona no Chrome, no Edge e no Safari recente. Na página publicada no Claude, usa o ditado do Claude, que está disponível no Chrome e no app de desktop.
- **Conversa com IA:** existe só na página publicada no Claude e usa a conta de quem estuda. Fora dela, a rodada segue com shadowing e tradução reversa.

## Publicar no GitHub Pages

1. No GitHub, abra **Settings → Pages**.
2. Em **Source**, escolha **Deploy from a branch**, depois a branch e a pasta `/ (root)`.
3. Abra o endereço gerado no celular e use **Adicionar à tela inicial**.

Ao publicar uma versão nova, mude o valor de `VERSION` em `sw.js` para os aparelhos baixarem a atualização.

## Estrutura

```
index.html            entrada do app
css/styles.css        design system: cores, tipografia e componentes
js/words.js           as 500 palavras (inglês, português, exemplo e tradução), blocos e rodadas
js/store.js           progresso, revisão espaçada em minutos e cronômetro de 8 horas
js/speech.js          voz do aparelho e reconhecimento de fala (ou ditado do Claude)
js/app.js             telas, trilha, pausa, conversa com IA e o player das rodadas
sw.js                 cache para uso offline
manifest.webmanifest  instalação na tela inicial
```

Para trocar ou corrigir palavras, edite `js/words.js`. Cada linha segue o formato `[inglês, português, exemplo, tradução do exemplo]`, e a lista precisa ter 500 itens.
