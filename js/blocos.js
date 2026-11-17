/*
 * Blocos prontos (chunks) e o som real do inglês americano.
 *
 * A pesquisa mostra que mais da metade do que um nativo fala é feita de combinações prontas
 * (Erman e Warren, 2000), e as frequências de filmes e séries refletem o inglês que as pessoas
 * realmente ouvem (SUBTLEX-US, Brysbaert e New, 2009). Por isso, aqui você aprende o bloco inteiro,
 * do jeito que ele soa.
 *
 * Cada bloco: [inglês completo, português, como se fala (forma reduzida), pronúncia escrita para
 * brasileiro, (opcional) outras frases com o mesmo molde para trocar o final].
 * Pronúncia escrita: â = "a" fraco · h = sopro, como o r de "rato" · r entre vogais = r de "caro"
 * (é o T e o D americanos em water, later, doing) · d em dâ, dét, dis = TH com a língua entre os dentes ·
 * o acento marca a sílaba forte.
 */
window.SOM = [
  {
    id: "p1", title: "Como o americano fala de verdade", sub: "Gonna, wanna, o T que vira R e as palavras que se juntam",
    points: [
      "Na conversa, as palavras se juntam e os sons fracos encolhem. Por isso “How are you doing?” soa “háu iá dúin?”.",
      "Going to vira gonna, want to vira wanna, have to vira hafta e got to vira gotta. Numa conversa espontânea, uma dessas formas aparece mais ou menos a cada dois minutos.",
      "Gonna só vale para o futuro: I'm gonna call you. Para ir a um lugar, fica going to: I'm going to the gym.",
      "O T entre vogais vira um R rápido, igual ao R de “caro”: water soa “uórâr”, later soa “lêirâr” e get a soa “guérâ”.",
      "You vira ya (iâ), e o -ing perde o g: doing vira “dúin”, going vira “gôuin”.",
      "D + you vira DJ e T + you vira TCH: did you soa “dídjâ”, meet you soa “mítchâ”, what are you soa “uátchâ”.",
      "As palavras pequenas encolhem: to vira “tâ”, for vira “fâr”, and vira “ân” e of vira “âv”.",
      "A consoante do fim se liga à vogal da palavra seguinte: check it out soa “tchékiráut”, get out of here soa “guérâurâ hír”.",
      "Na escrita formal (e-mail de trabalho, prova), use a forma completa: going to, want to."
    ],
    table: [["going to", "gonna", "gânâ"], ["want to", "wanna", "uânâ"], ["have to", "hafta", "háftâ"], ["got to", "gotta", "gárâ"], ["let me", "lemme", "lémi"], ["give me", "gimme", "gími"], ["don't know", "dunno", "dânôu"], ["kind of", "kinda", "káindâ"], ["did you", "didja", "dídjâ"], ["what are you", "whatcha", "uátchâ"], ["what do you", "whaddaya", "uárâiâ"], ["out of", "outta", "áurâ"]],
    examples: [
      ["How ya doin'?", "Como você está? · soa: háu iá dúin?"],
      ["I'm gonna call ya later.", "Vou te ligar mais tarde. · soa: áim gânâ kól iá lêirâr"],
      ["I gotta go.", "Tenho que ir. · soa: ái gárâ gôu"],
      ["Whatcha doin'?", "O que você está fazendo? · soa: uátchâ dúin?"],
      ["Nice ta meetcha.", "Prazer. · soa: náis tâ mítchâ"],
      ["Can I get a glass of water?", "Pode me ver um copo de água? · soa: kânái guérâ gléss âv uórâr?"],
      ["Get outta here!", "Não acredito! · soa: guérâurâ hír!"]
    ],
    ex: [
      { q: "“I'm going to call you” na fala rápida soa:", o: ["I'm gonna call ya", "I'm goin' call you", "I gonna call ya"], a: 0, e: "going to vira gonna, e you vira ya." },
      { q: "O T de “water” no inglês americano soa como:", o: ["o R de “caro”", "o T de “tatu”", "o TCH de “tchau”"], a: 0, e: "T entre vogais vira um R rápido: uórâr." },
      { q: "“Did you eat?” falado rápido:", o: ["Didja eat?", "Dide you eat?", "Did ya ate?"], a: 0, e: "D + you vira DJ: didja." },
      { q: "“I want to sleep” na fala:", o: ["I wanna sleep", "I wanta sleep", "I wan sleep"], a: 0, e: "want to vira wanna." },
      { q: "Qual frase NÃO pode usar gonna?", o: ["I'm going to the gym.", "I'm going to call you.", "It's going to rain."], a: 0, e: "Gonna é só para o futuro. Indo a um lugar, fica going to." },
      { q: "Num e-mail de trabalho, escreva:", o: ["I'm going to send it today.", "I'm gonna send it today.", "I'm gonna sendit today."], a: 0, e: "Gonna e wanna são da fala. No texto formal, use a forma completa." },
      { order: "I'm gonna call you later", pt: "Vou te ligar mais tarde" },
      { order: "What do you want to do", pt: "O que você quer fazer?" }
    ]
  }
];

window.ETAPA_PARTS.splice(1, 0, { key: "blocos", name: "Blocos prontos e som real", desc: "As frases inteiras que o americano usa todo dia, como elas soam de verdade e o que trocar para criar a sua." });

window.ETAPAS = window.ETAPAS || [];
window.ETAPAS.push(
  { id: "som", part: "blocos", kind: "grammar", name: "Como o americano fala de verdade", icon: "headphones", desc: "Gonna, wanna, o T que vira R e as palavras que se juntam", lesson: "p1" },
  {
    id: "bl-oi", part: "blocos", kind: "phrases", name: "Cumprimentos de verdade", icon: "hand",
    desc: "Oi, tudo bem e tchau do jeito que se fala na rua.",
    phrases: [
      ["How are you doing?", "Como você está?", "How ya doin'?", "háu iá dúin?"],
      ["What's up?", "E aí? Beleza?", "Wassup?", "uâssáp?"],
      ["How's it going?", "Como vão as coisas?", "How's it goin'?", "háuz it gôuin?"],
      ["Not much. You?", "Nada de mais. E você?", "Not much. You?", "nát mâtch. iú?"],
      ["Nice to meet you.", "Prazer em te conhecer.", "Nice ta meetcha.", "náis tâ mítchâ"],
      ["Good to see you!", "Que bom te ver!", "Good ta see ya!", "gúd tâ sí iá!"],
      ["What have you been up to?", "O que você tem feito?", "Whatcha been up to?", "uátchâ bin áp tâ?"],
      ["I'm good, thanks. And you?", "Tô bem, valeu. E você?", "I'm good, thanks. An' you?", "áim gúd, thénks. ân iú?"],
      ["Long time no see!", "Quanto tempo!", "Long time no see!", "lóng táim nôu sí!"],
      ["See you later!", "Até mais!", "See ya later!", "sí iá lêirâr!"],
      ["Take care!", "Se cuida!", "Take care!", "têik kér!"],
      ["Have a good one!", "Tenha um bom dia!", "Have a good one!", "hévâ gúd uân!"]
    ]
  },
  {
    id: "bl-gonna", part: "blocos", kind: "phrases", name: "Gonna, wanna, gotta", icon: "zap",
    desc: "Os moldes mais usados da fala. Troque o final e crie as suas frases.",
    phrases: [
      ["I'm going to call you later.", "Vou te ligar mais tarde.", "I'm gonna call ya later.", "áim gânâ kól iá lêirâr", ["I'm gonna grab a coffee.", "I'm gonna take a shower.", "I'm gonna head out."]],
      ["I want to go home.", "Quero ir pra casa.", "I wanna go home.", "ái uânâ gôu hôum", ["I wanna try this.", "I wanna see that movie.", "I wanna learn English."]],
      ["I've got to go.", "Tenho que ir.", "I gotta go.", "ái gárâ gôu", ["I gotta work tomorrow.", "I gotta call my mom.", "I gotta study."]],
      ["Do you want to grab a bite?", "Quer comer alguma coisa?", "Ya wanna grab a bite?", "iá uânâ gréb â báit?", ["Ya wanna watch a movie?", "Ya wanna come with me?"]],
      ["Let me see.", "Deixa eu ver.", "Lemme see.", "lémi sí", ["Lemme think.", "Lemme check.", "Lemme help you."]],
      ["Give me a second.", "Me dá um segundo.", "Gimme a sec.", "gími â sék", ["Gimme a break.", "Gimme a call."]],
      ["I don't know.", "Não sei.", "I dunno.", "ái dânôu"],
      ["It's kind of cold.", "Tá meio frio.", "It's kinda cold.", "its káindâ kôuld", ["It's kinda late.", "It's kinda weird."]],
      ["What are you doing?", "O que você tá fazendo?", "Whatcha doin'?", "uátchâ dúin?"],
      ["Did you eat?", "Você comeu?", "Didja eat?", "dídjâ ít?", ["Didja sleep well?", "Didja see that?"]],
      ["I have to work tomorrow.", "Tenho que trabalhar amanhã.", "I hafta work tomorrow.", "ái háftâ uârk tâmárôu"],
      ["What do you want to do?", "O que você quer fazer?", "Whaddaya wanna do?", "uárâiâ uânâ dú?"]
    ]
  },
  {
    id: "bl-perguntas", part: "blocos", kind: "phrases", name: "Perguntas que salvam a conversa", icon: "question",
    desc: "As perguntas curtas que mantêm o papo andando.",
    phrases: [
      ["What do you mean?", "Como assim?", "Whaddaya mean?", "uárâiâ mín?"],
      ["Where are you from?", "De onde você é?", "Where ya from?", "uér iá frâm?"],
      ["What do you do?", "O que você faz? (de trabalho)", "Whaddaya do?", "uárâiâ dú?"],
      ["How long have you been here?", "Há quanto tempo você está aqui?", "How long ya been here?", "háu lóng iá bin hír?"],
      ["Do you know what I mean?", "Sabe o que eu quero dizer?", "Ya know what I mean?", "iâ nôu uárái mín?"],
      ["What's going on?", "O que está acontecendo?", "What's goin' on?", "uáts gôuin ón?"],
      ["Can I ask you something?", "Posso te perguntar uma coisa?", "Can I ask ya somethin'?", "kânái ésk iá sâmthin?"],
      ["Are you serious?", "Sério mesmo?", "You serious?", "iú sírias?"],
      ["What happened?", "O que aconteceu?", "What happened?", "uát hépând?"],
      ["How was your day?", "Como foi o seu dia?", "How was yer day?", "háu uâz iâr dêi?"],
      ["Is that right?", "É mesmo?", "Is that right?", "iz dét ráit?"],
      ["Why not?", "Por que não?", "Why not?", "uái nát?"]
    ]
  },
  {
    id: "bl-reacoes", part: "blocos", kind: "phrases", name: "Reações das séries", icon: "spark",
    desc: "As reações rápidas que aparecem em todo episódio.",
    phrases: [
      ["No way!", "Não acredito!", "No way!", "nôu uêi!"],
      ["Tell me about it.", "Nem me fale.", "Tell me 'bout it.", "tél mi báurit"],
      ["I know, right?", "Pois é!", "I know, right?", "ái nôu, ráit?"],
      ["You got it.", "Pode deixar.", "You got it.", "iú gárit"],
      ["Are you kidding me?", "Tá de brincadeira?", "You kiddin' me?", "iú kírin mi?"],
      ["That makes sense.", "Faz sentido.", "That makes sense.", "dét mêiks séns"],
      ["Good for you!", "Que bom pra você!", "Good for ya!", "gúd fâr iá!"],
      ["That's crazy!", "Que loucura!", "That's crazy!", "déts krêizi!"],
      ["I'm just kidding.", "Tô só brincando.", "I'm just kiddin'.", "áim djâs kírin"],
      ["Fair enough.", "Justo. Faz sentido.", "Fair enough.", "fér inâf"],
      ["My bad.", "Foi mal.", "My bad.", "mái béd"],
      ["Oh my God!", "Meu Deus!", "Oh my God!", "ôu mái gád!"]
    ]
  },
  {
    id: "bl-pedir", part: "blocos", kind: "phrases", name: "Pedir do jeito natural", icon: "chat",
    desc: "Can I get, could you, do you mind: os moldes para pedir qualquer coisa.",
    phrases: [
      ["Can I get a coffee?", "Pode me ver um café?", "Can I get a coffee?", "kânái guérâ kófi?", ["Can I get the check?", "Can I get a glass of water?", "Can I get this to go?"]],
      ["Could you help me out?", "Pode me dar uma ajuda?", "Couldja help me out?", "kúdjâ hélp mi áut?"],
      ["Do you mind if I sit here?", "Se importa se eu sentar aqui?", "D'ya mind if I sit here?", "djâ máind ifái sit hír?", ["D'ya mind if I open the window?", "D'ya mind if I call you later?"]],
      ["Would you like some water?", "Você gostaria de uma água?", "Wouldja like some water?", "údjâ láik sâm uórâr?"],
      ["Can you say that again?", "Pode repetir?", "Can ya say that again?", "kâniâ sêi dérâguén?"],
      ["Can I have the check, please?", "A conta, por favor.", "Can I have the check, please?", "kânái hév dâ tchék, plíz?"],
      ["Can you give me a hand?", "Me dá uma mão?", "Can ya gimme a hand?", "kâniâ gími â hénd?"],
      ["Is it okay if I pay by card?", "Tudo bem se eu pagar com cartão?", "Is it okay if I pay by card?", "izit ôukêi ifái pêi bái kárd?"],
      ["I'd like to make a reservation.", "Eu queria fazer uma reserva.", "I'd like ta make a reservation.", "áid láik tâ mêikâ rézârvêichân"],
      ["Could I get the Wi-Fi password?", "Pode me passar a senha do Wi-Fi?", "Could I get the Wi-Fi password?", "kúdái guét dâ uáifái péssuârd?"]
    ]
  },
  {
    id: "bl-frasais", part: "blocos", kind: "phrases", name: "Verbos frasais do dia a dia", icon: "link",
    desc: "Hang out, figure out, run out of: verbos com partícula que o nativo usa o tempo todo.",
    phrases: [
      ["Do you want to hang out later?", "Quer sair mais tarde?", "Ya wanna hang out later?", "iá uânâ héng áut lêirâr?"],
      ["I'll figure it out.", "Eu dou um jeito.", "I'll figure it out.", "áil fíguiârit áut"],
      ["Come on!", "Vamos! Qual é!", "C'mon!", "kâmón!"],
      ["Hold on a second.", "Espera um segundo.", "Hold on a sec.", "hôuldón â sék"],
      ["I'm looking forward to it.", "Tô ansioso por isso.", "I'm lookin' forward to it.", "áim lúkin fóruârd tâ it"],
      ["Let me find out.", "Deixa eu descobrir.", "Lemme find out.", "lémi fáind áut"],
      ["We ran out of milk.", "Acabou o leite.", "We ran outta milk.", "uí rén áurâ mílk"],
      ["I'll pick you up at eight.", "Te pego às oito.", "I'll pick ya up at eight.", "áil píkiâ áp ât êit"],
      ["He didn't show up.", "Ele não apareceu.", "He didn't show up.", "hí dídnt chôu áp"],
      ["It worked out!", "Deu certo!", "It worked out!", "it uârkt áut!"],
      ["Let's catch up soon.", "Vamos botar o papo em dia logo.", "Let's catch up soon.", "léts kétch áp sún"],
      ["Don't give up!", "Não desista!", "Don't give up!", "dôun gív áp!"]
    ]
  },
  {
    id: "bl-opiniao", part: "blocos", kind: "phrases", name: "Opinião e palavras de apoio", icon: "thumb",
    desc: "I mean, you know, I guess: as palavras que o nativo usa para pensar enquanto fala.",
    phrases: [
      ["I mean, it's not bad.", "Quer dizer, não é ruim.", "I mean, it's not bad.", "ái mín, its nát béd"],
      ["It's hard, you know?", "É difícil, sabe?", "It's hard, ya know?", "its hárd, iâ nôu?"],
      ["I guess so.", "Acho que sim.", "I guess so.", "ái gués sôu"],
      ["I kind of like it.", "Eu meio que gosto.", "I kinda like it.", "ái káindâ láikit"],
      ["To be honest, I'm tired.", "Pra ser sincero, tô cansado.", "Ta be honest, I'm tired.", "tâ bi ónâst, áim táiârd"],
      ["Actually, I changed my mind.", "Na verdade, mudei de ideia.", "Actually, I changed my mind.", "éktchuâli, ái tchêindjd mái máind"],
      ["Well, it depends.", "Bom, depende.", "Well, it depends.", "uél, it dipéndz"],
      ["I'm not sure about that.", "Não tenho certeza disso.", "I'm not sure about that.", "áim nát chúr âbáut dét"],
      ["Sounds good to me.", "Por mim, tá ótimo.", "Sounds good ta me.", "sáundz gúd tâ mi"],
      ["Whatever you want.", "O que você quiser.", "Whatever ya want.", "uâtévâr iâ uânt"],
      ["Anyway, let's go.", "Enfim, vamos.", "Anyway, let's go.", "éniuêi, léts gôu"],
      ["Basically, it's free.", "Basicamente, é de graça.", "Basically, it's free.", "bêisikli, its frí"]
    ]
  },
  {
    id: "bl-trabalho", part: "blocos", kind: "phrases", name: "Blocos do trabalho", icon: "briefcase",
    desc: "As frases prontas das reuniões, ligações e e-mails.",
    phrases: [
      ["Let's touch base tomorrow.", "Vamos nos falar amanhã.", "Let's touch base tomorrow.", "léts tâtch bêis tâmárôu"],
      ["I'll get back to you.", "Te dou um retorno.", "I'll get back ta ya.", "áil guét bék tâ iá"],
      ["Can you walk me through it?", "Pode me explicar passo a passo?", "Can ya walk me through it?", "kâniâ uók mi thrú it?"],
      ["That works for me.", "Por mim, tudo certo.", "That works for me.", "dét uârks fâr mi"],
      ["I'm on it.", "Já estou cuidando disso.", "I'm on it.", "áim ónit"],
      ["Let's go over the numbers.", "Vamos revisar os números.", "Let's go over the numbers.", "léts gôu ôuvâr dâ nâmbârz"],
      ["Sorry, I was on mute.", "Desculpa, eu tava no mudo.", "Sorry, I was on mute.", "sári, ái uâz ón miút"],
      ["Can we push the meeting?", "Podemos adiar a reunião?", "Can we push the meetin'?", "kân uí púch dâ mírin?"],
      ["Let's keep it simple.", "Vamos manter simples.", "Let's keep it simple.", "léts kípit símpâl"],
      ["What's the next step?", "Qual é o próximo passo?", "What's the next step?", "uáts dâ nékst stép?"],
      ["I'll keep you posted.", "Te mantenho informado.", "I'll keep ya posted.", "áil kíp iâ pôustid"],
      ["Sounds like a plan.", "Fechado. Combinado.", "Sounds like a plan.", "sáundz láikâ plén"]
    ]
  },
  {
    id: "bl-rotina", part: "blocos", kind: "phrases", name: "Blocos da rotina", icon: "sun",
    desc: "Saindo, chegando, comendo e dormindo: o dia a dia em blocos.",
    phrases: [
      ["I'm heading out.", "Tô saindo.", "I'm headin' out.", "áim hérin áut"],
      ["I'm on my way.", "Tô a caminho.", "I'm on my way.", "áim ón mái uêi"],
      ["I'll be right back.", "Já volto.", "I'll be right back.", "áil bi ráit bék"],
      ["I'm running late.", "Tô atrasado.", "I'm runnin' late.", "áim rânin lêit"],
      ["Let's grab a bite.", "Vamos comer alguma coisa.", "Let's grab a bite.", "léts gréb â báit"],
      ["I'm starving!", "Tô morrendo de fome!", "I'm starvin'!", "áim stárvin!"],
      ["I'm exhausted.", "Tô exausto.", "I'm exhausted.", "áim iguzástid"],
      ["I need to get some sleep.", "Preciso dormir um pouco.", "I need ta get some sleep.", "ái níd tâ guét sâm slíp"],
      ["What's for dinner?", "O que tem pra jantar?", "What's fer dinner?", "uáts fâr dínâr?"],
      ["I'll text you.", "Te mando mensagem.", "I'll text ya.", "áil tékst iá"],
      ["Have fun!", "Divirta-se!", "Have fun!", "hév fân!"],
      ["I'm off today.", "Tô de folga hoje.", "I'm off today.", "áim óf tâdêi"]
    ]
  },
  {
    id: "bl-series", part: "blocos", kind: "phrases", name: "Falas de filmes e séries", icon: "star",
    desc: "As falas curtas que você vai reconhecer na próxima série que assistir.",
    phrases: [
      ["Are you okay?", "Você está bem?", "You okay?", "iú ôukêi?"],
      ["Let's go!", "Vamos!", "Let's go!", "léts gôu!"],
      ["What's wrong?", "O que houve?", "What's wrong?", "uáts róng?"],
      ["Get out of here!", "Sai daqui! Não acredito!", "Get outta here!", "guérâurâ hír!"],
      ["I got this.", "Eu dou conta.", "I got this.", "ái gát dis"],
      ["Trust me.", "Confia em mim.", "Trust me.", "trâst mi"],
      ["It's not what it looks like.", "Não é o que parece.", "It's not what it looks like.", "its nát uárit lúks láik"],
      ["We need to talk.", "Precisamos conversar.", "We need ta talk.", "uí níd tâ tók"],
      ["Calm down.", "Calma.", "Calm down.", "kám dáun"],
      ["Leave me alone.", "Me deixa em paz.", "Leave me alone.", "lív mi âlôun"],
      ["What are you talking about?", "Do que você tá falando?", "Whatcha talkin' about?", "uátchâ tókin âbáut?"],
      ["Thank you so much!", "Muito obrigado!", "Thank ya so much!", "thénk iâ sôu mâtch!"]
    ]
  }
);
