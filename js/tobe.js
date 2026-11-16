/*
 * Trilha completa do verbo to be: 10 lições e uma revisão final.
 * Cada lição: explicação (points), tabela (opcional), exemplos com áudio e 8 exercícios.
 * Exercícios: { q, o: [opções], a: índice certo, e: explicação } ou { order: "frase", pt: "tradução" }.
 */
window.TOBE_PARTS = [
  { name: "Presente", desc: "am, is, are: afirmar, negar, perguntar e os usos que pegam o brasileiro.", lessons: ["t1", "t2", "t3", "t4", "t5", "t6", "t7"] },
  { name: "Passado e futuro", desc: "was, were, will be, be + -ing e a revisão final.", lessons: ["t8", "t9", "t10", "t11"] }
];

window.TOBE = [
  {
    id: "t1", title: "Am, is, are", sub: "Ser e estar no presente",
    points: [
      "“To be” é ao mesmo tempo SER e ESTAR. O contexto mostra qual: “I am a teacher” (sou professor), “I am tired” (estou cansado).",
      "I usa am. He, she e it usam is. You, we e they usam are.",
      "Em inglês o sujeito nunca some: “It is hot” (Está quente), nunca só “Is hot”.",
      "It é para coisas e animais, e também para falar do tempo e da hora."
    ],
    table: [["I", "am", "eu sou, eu estou"], ["you", "are", "você é, você está"], ["he", "is", "ele é, ele está"], ["she", "is", "ela é, ela está"], ["it", "is", "é, está (coisa, animal, tempo)"], ["we", "are", "nós somos, nós estamos"], ["they", "are", "eles são, eles estão"]],
    examples: [["I am Pedro.", "Eu sou o Pedro."], ["You are my friend.", "Você é meu amigo."], ["He is at work.", "Ele está no trabalho."], ["She is a doctor.", "Ela é médica."], ["It is cold today.", "Está frio hoje."], ["We are ready.", "Nós estamos prontos."], ["They are from Brazil.", "Eles são do Brasil."]],
    ex: [
      { q: "I ___ happy.", o: ["am", "is", "are"], a: 0, e: "Com I, sempre am." },
      { q: "She ___ my sister.", o: ["am", "is", "are"], a: 1, e: "She usa is." },
      { q: "They ___ at home.", o: ["am", "is", "are"], a: 2, e: "They usa are." },
      { q: "It ___ very hot today.", o: ["am", "is", "are"], a: 1, e: "It usa is." },
      { q: "You ___ late.", o: ["am", "is", "are"], a: 2, e: "You usa are, no singular e no plural." },
      { q: "We ___ friends.", o: ["am", "is", "are"], a: 2, e: "We usa are." },
      { q: "“Está frio.” em inglês:", o: ["Is cold.", "It is cold.", "It cold."], a: 1, e: "O sujeito “it” é obrigatório." },
      { order: "He is my brother", pt: "Ele é meu irmão" }
    ]
  },
  {
    id: "t2", title: "I'm, you're, he's", sub: "As formas curtas",
    points: [
      "Na fala quase sempre se usa a forma curta: I'm, you're, he's, she's, it's, we're, they're.",
      "O apóstrofo (') ocupa o lugar da letra que caiu: I am vira I'm.",
      "Cuidado: it's (it is) é diferente de its (dele, dela, de coisa). You're (you are) é diferente de your (seu).",
      "They're (they are), their (deles) e there (lá) têm o mesmo som. Só o contexto diferencia."
    ],
    table: [["I am", "I'm", "eu sou, estou"], ["you are", "you're", "você é, está"], ["he is", "he's", "ele é, está"], ["she is", "she's", "ela é, está"], ["it is", "it's", "é, está"], ["we are", "we're", "nós somos, estamos"], ["they are", "they're", "eles são, estão"]],
    examples: [["I'm tired.", "Estou cansado."], ["You're right.", "Você tem razão."], ["He's my boss.", "Ele é o meu chefe."], ["She's at school.", "Ela está na escola."], ["It's late.", "Está tarde."], ["We're here.", "Estamos aqui."], ["They're very nice.", "Eles são muito legais."]],
    ex: [
      { q: "I am hungry = ___ hungry.", o: ["I'm", "Im", "I's"], a: 0, e: "I am vira I'm." },
      { q: "They are busy = ___ busy.", o: ["Their", "They're", "There"], a: 1, e: "They're = they are. Their = deles. There = lá." },
      { q: "___ a beautiful day!", o: ["Its", "It's", "It"], a: 1, e: "It's = it is. Its = dele, dela (de coisa)." },
      { q: "We are late = ___ late.", o: ["We're", "Were", "We's"], a: 0, e: "We're = we are. Were é o passado." },
      { q: "She is my friend = ___ my friend.", o: ["She's", "Shes", "She're"], a: 0, e: "She is vira she's." },
      { q: "You are welcome = ___ welcome.", o: ["Your", "You're", "Youre"], a: 1, e: "You're = you are. Your = seu, sua." },
      { order: "I'm from São Paulo", pt: "Eu sou de São Paulo" },
      { order: "It's very cold today", pt: "Está muito frio hoje" }
    ]
  },
  {
    id: "t3", title: "Não: am not, isn't, aren't", sub: "A forma negativa",
    points: [
      "Para negar, coloque “not” depois de am, is ou are: I am not, she is not, they are not.",
      "Formas curtas: I'm not, isn't (is not), aren't (are not).",
      "“I amn't” não existe. Use sempre “I'm not”.",
      "Também vale he's not e they're not. Significam o mesmo que he isn't e they aren't.",
      "Não use don't nem doesn't com o verbo to be: “She isn't busy”, nunca “She doesn't busy”."
    ],
    table: [["I am not", "I'm not", "eu não sou, não estou"], ["he / she / it is not", "isn't", "não é, não está"], ["you / we / they are not", "aren't", "não são, não estão"]],
    examples: [["I'm not tired.", "Eu não estou cansado."], ["He isn't at home.", "Ele não está em casa."], ["She isn't a teacher.", "Ela não é professora."], ["It isn't expensive.", "Não é caro."], ["We aren't ready.", "Nós não estamos prontos."], ["They aren't here.", "Eles não estão aqui."]],
    ex: [
      { q: "I ___ hungry.", o: ["am not", "isn't", "aren't"], a: 0, e: "Com I: I'm not." },
      { q: "He ___ my brother.", o: ["aren't", "isn't", "not is"], a: 1, e: "He usa isn't." },
      { q: "They ___ at school today.", o: ["isn't", "aren't", "am not"], a: 1, e: "They usa aren't." },
      { q: "It ___ cold. It's hot!", o: ["isn't", "aren't", "not"], a: 0, e: "It usa isn't." },
      { q: "Forma correta:", o: ["She not is busy.", "She isn't busy.", "She don't busy."], a: 1, e: "Negativa do to be: is + not. Não use don't com to be." },
      { q: "We ___ late. We're early!", o: ["aren't", "isn't", "don't"], a: 0, e: "We usa aren't." },
      { order: "I am not from here", pt: "Eu não sou daqui" },
      { order: "The store isn't open", pt: "A loja não está aberta" }
    ]
  },
  {
    id: "t4", title: "Are you…? Yes, I am.", sub: "Perguntas e respostas curtas",
    points: [
      "Para perguntar, troque a ordem: o verbo vem antes do sujeito. You are vira Are you…?",
      "Is she ready? Are they at home? Am I late?",
      "Respostas curtas: Yes, I am. / No, I'm not. Yes, she is. / No, she isn't.",
      "Na resposta curta afirmativa não se usa a forma curta: “Yes, I am”, nunca “Yes, I'm”.",
      "Não use do nem does em perguntas com to be: “Are you tired?”, nunca “Do you are tired?”."
    ],
    table: [["You are tired.", "Are you tired?", "Yes, I am. / No, I'm not."], ["She is ready.", "Is she ready?", "Yes, she is. / No, she isn't."], ["They are here.", "Are they here?", "Yes, they are. / No, they aren't."]],
    examples: [["Are you tired?", "Você está cansado?"], ["Yes, I am.", "Sim, estou."], ["Is he your brother?", "Ele é seu irmão?"], ["No, he isn't.", "Não, não é."], ["Is it far?", "É longe?"], ["Are they ready?", "Eles estão prontos?"]],
    ex: [
      { q: "___ you from Brazil?", o: ["Is", "Are", "Am"], a: 1, e: "You usa are: Are you…?" },
      { q: "___ she your sister?", o: ["Is", "Are", "Do"], a: 0, e: "Pergunta com to be não usa do nem does." },
      { q: "Are you busy? — Yes, I ___.", o: ["am", "'m", "is"], a: 0, e: "Resposta curta afirmativa fica sem contração: Yes, I am." },
      { q: "Is it expensive? — No, it ___.", o: ["isn't", "aren't", "not"], a: 0, e: "No, it isn't." },
      { q: "Are they at home? — Yes, they ___.", o: ["is", "are", "do"], a: 1, e: "Yes, they are." },
      { q: "___ I late?", o: ["Am", "Is", "Are"], a: 0, e: "I usa am: Am I…?" },
      { order: "Is this your phone?", pt: "Este é o seu celular?" },
      { order: "Are you ready?", pt: "Você está pronto?" }
    ]
  },
  {
    id: "t5", title: "What, where, how + to be", sub: "Perguntas abertas",
    points: [
      "Palavra de pergunta + am, is ou are + sujeito: Where are you? What is this?",
      "As mais usadas: What's your name? Where are you from? How are you? How old are you?",
      "Também: Who is she? When is your birthday? Why are you sad? How much is it?",
      "Com is, a forma curta é comum: what's, where's, who's, how's."
    ],
    table: [["What", "o que, qual", "What's your name?"], ["Where", "onde", "Where are you from?"], ["Who", "quem", "Who is that?"], ["When", "quando", "When is the party?"], ["Why", "por que", "Why are you sad?"], ["How", "como", "How are you?"], ["How old", "quantos anos", "How old are you?"], ["How much", "quanto custa", "How much is it?"]],
    examples: [["What's your name?", "Qual é o seu nome?"], ["Where are you from?", "De onde você é?"], ["How are you?", "Como vai você?"], ["How old are you?", "Quantos anos você tem?"], ["Who is that woman?", "Quem é aquela mulher?"], ["Where is the bathroom?", "Onde fica o banheiro?"]],
    ex: [
      { q: "Where ___ you from?", o: ["is", "are", "am"], a: 1, e: "You usa are." },
      { q: "What ___ your phone number?", o: ["is", "are", "am"], a: 0, e: "Your phone number = it → is." },
      { q: "How old ___ your kids?", o: ["is", "are", "has"], a: 1, e: "Your kids = they → are." },
      { q: "Who ___ that man?", o: ["is", "are", "am"], a: 0, e: "That man = he → is." },
      { q: "___ is the station? — It's near the park.", o: ["What", "Where", "Who"], a: 1, e: "Onde → where." },
      { q: "___ are you? — I'm fine, thanks.", o: ["How", "What", "Who"], a: 0, e: "How are you? = Como vai você?" },
      { order: "When is your birthday?", pt: "Quando é o seu aniversário?" },
      { order: "Why are you sad?", pt: "Por que você está triste?" }
    ]
  },
  {
    id: "t6", title: "Tenho 30 anos = I am 30", sub: "Onde o português usa “ter”",
    points: [
      "Idade usa to be: I am 30 (years old). Nunca “I have 30 years”.",
      "Fome, sede, frio, calor, medo e sono usam to be: I'm hungry, I'm thirsty, I'm cold, I'm hot, I'm afraid, I'm sleepy.",
      "“Ter razão” é to be right: You are right. “Estar errado” é to be wrong.",
      "Profissão leva a ou an: She is a nurse. He is an engineer.",
      "Tempo e hora usam it: It's sunny. It's three o'clock."
    ],
    table: [["Tenho 30 anos.", "I'm 30.", ""], ["Estou com fome.", "I'm hungry.", ""], ["Estou com sede.", "I'm thirsty.", ""], ["Estou com frio.", "I'm cold.", ""], ["Estou com medo.", "I'm afraid.", ""], ["Você tem razão.", "You're right.", ""], ["São três horas.", "It's three o'clock.", ""]],
    examples: [["I'm 25 years old.", "Eu tenho 25 anos."], ["Are you hungry?", "Você está com fome?"], ["I'm cold.", "Estou com frio."], ["You're right.", "Você tem razão."], ["He's an engineer.", "Ele é engenheiro."], ["It's three o'clock.", "São três horas."]],
    ex: [
      { q: "“Eu tenho 20 anos”:", o: ["I have 20 years.", "I am 20 years old.", "I have 20 years old."], a: 1, e: "Idade usa to be." },
      { q: "“Estou com sede”:", o: ["I have thirsty.", "I am thirsty.", "I thirsty."], a: 1, e: "Sede usa to be: I'm thirsty." },
      { q: "“Você tem razão”:", o: ["You have reason.", "You are right.", "You is right."], a: 1, e: "Ter razão = to be right." },
      { q: "She is ___ doctor.", o: ["a", "an", "—"], a: 0, e: "Profissão no singular leva a ou an." },
      { q: "He is ___ engineer.", o: ["a", "an", "—"], a: 1, e: "Antes de som de vogal, an." },
      { q: "“Está ensolarado”:", o: ["Is sunny.", "It's sunny.", "It sunny."], a: 1, e: "Tempo usa it is." },
      { q: "“Estou com medo”:", o: ["I have fear.", "I'm afraid.", "I afraid."], a: 1, e: "Medo usa to be: I'm afraid." },
      { order: "How old is your mother?", pt: "Quantos anos tem a sua mãe?" }
    ]
  },
  {
    id: "t7", title: "There is, there are", sub: "Há, tem",
    points: [
      "There is (there's) = há, tem, no singular: There is a bank near here.",
      "There are = há, tem, no plural: There are two bedrooms.",
      "Negativa: there isn't, there aren't. Pergunta: Is there…? Are there…?",
      "Não traduza esse “tem” por have: “Tem um problema” é There is a problem."
    ],
    table: [["There is a…", "Há um…", "singular"], ["There are two…", "Há dois…", "plural"], ["There isn't / aren't…", "Não há…", "negativa"], ["Is there / Are there…?", "Tem…?", "pergunta"]],
    examples: [["There is a park near my house.", "Tem um parque perto da minha casa."], ["There are three people here.", "Há três pessoas aqui."], ["There's no problem.", "Não tem problema."], ["Is there a pharmacy near here?", "Tem uma farmácia aqui perto?"], ["Are there any questions?", "Tem alguma pergunta?"], ["There aren't any chairs.", "Não tem cadeiras."]],
    ex: [
      { q: "There ___ a cat in the kitchen.", o: ["is", "are", "have"], a: 0, e: "Um gato (singular): there is." },
      { q: "There ___ many people at the party.", o: ["is", "are", "has"], a: 1, e: "Plural: there are." },
      { q: "“Tem um problema”:", o: ["Have a problem.", "There is a problem.", "It has a problem."], a: 1, e: "“Tem” no sentido de “há” = there is." },
      { q: "___ there a bank near here?", o: ["Is", "Are", "Have"], a: 0, e: "Singular: Is there…?" },
      { q: "___ there any questions?", o: ["Is", "Are", "Do"], a: 1, e: "Plural: Are there…?" },
      { q: "There ___ any milk in the fridge.", o: ["isn't", "aren't", "don't"], a: 0, e: "Milk é incontável, fica no singular: there isn't." },
      { order: "There are two bedrooms", pt: "Há dois quartos" },
      { order: "Is there a bathroom here?", pt: "Tem banheiro aqui?" }
    ]
  },
  {
    id: "t8", title: "Was, were", sub: "O passado do to be",
    points: [
      "No passado, to be tem só duas formas: was (I, he, she, it) e were (you, we, they).",
      "Was e were significam “era, estava, foi, esteve”.",
      "Negativa: wasn't (was not), weren't (were not).",
      "Pergunta: troque a ordem. Were you at home? Was it good? Respostas: Yes, I was. / No, it wasn't."
    ],
    table: [["I", "was", "eu era, estava"], ["you", "were", "você era, estava"], ["he / she / it", "was", "era, estava, foi"], ["we", "were", "nós éramos, estávamos"], ["they", "were", "eles eram, estavam"]],
    examples: [["I was tired yesterday.", "Eu estava cansado ontem."], ["She was at home.", "Ela estava em casa."], ["It was a great day.", "Foi um ótimo dia."], ["We were friends at school.", "Nós éramos amigos na escola."], ["They weren't ready.", "Eles não estavam prontos."], ["Were you at work?", "Você estava no trabalho?"]],
    ex: [
      { q: "I ___ at the beach yesterday.", o: ["was", "were", "am"], a: 0, e: "I no passado: was." },
      { q: "They ___ very happy.", o: ["was", "were", "is"], a: 1, e: "They no passado: were." },
      { q: "It ___ cold last night.", o: ["was", "were", "is"], a: 0, e: "It no passado: was." },
      { q: "___ you at home last night?", o: ["Was", "Were", "Did"], a: 1, e: "Pergunta com to be no passado: Were you…? Sem did." },
      { q: "The movie ___ good. It was boring.", o: ["wasn't", "weren't", "didn't"], a: 0, e: "The movie = it → wasn't." },
      { q: "Were they late? — No, they ___.", o: ["wasn't", "weren't", "didn't"], a: 1, e: "They → weren't." },
      { order: "I was very tired", pt: "Eu estava muito cansado" },
      { order: "Where were you yesterday?", pt: "Onde você estava ontem?" }
    ]
  },
  {
    id: "t9", title: "There was, how was…?", sub: "Contar o que aconteceu",
    points: [
      "There was (havia, tinha, no singular) e there were (no plural).",
      "How was…? pergunta como foi: How was your day? How was the trip?",
      "Where were you? Who was that? What was the problem?",
      "“Nascer” em inglês usa was: I was born in 1995 (Eu nasci em 1995)."
    ],
    table: [["There was a…", "Tinha um…", "singular"], ["There were many…", "Tinha muitos…", "plural"], ["How was…?", "Como foi…?", "pergunta"], ["I was born in…", "Eu nasci em…", "nascimento"]],
    examples: [["There was a problem with the car.", "Teve um problema com o carro."], ["There were many people at the party.", "Tinha muita gente na festa."], ["How was your day?", "Como foi o seu dia?"], ["It was great, thanks.", "Foi ótimo, obrigado."], ["I was born in Brazil.", "Eu nasci no Brasil."], ["Who was that man?", "Quem era aquele homem?"]],
    ex: [
      { q: "There ___ a lot of rain yesterday.", o: ["was", "were", "is"], a: 0, e: "Rain é incontável: there was." },
      { q: "There ___ five people in the car.", o: ["was", "were", "are"], a: 1, e: "Plural no passado: there were." },
      { q: "How ___ your trip?", o: ["was", "were", "did"], a: 0, e: "Your trip = it → was." },
      { q: "“Eu nasci em 1990”:", o: ["I born in 1990.", "I was born in 1990.", "I am born in 1990."], a: 1, e: "Nascer = to be born, no passado: I was born." },
      { q: "Where ___ your parents last week?", o: ["was", "were", "are"], a: 1, e: "Your parents = they → were." },
      { q: "___ there any problems?", o: ["Was", "Were", "Did"], a: 1, e: "Problems (plural): Were there…?" },
      { order: "How was your weekend?", pt: "Como foi o seu fim de semana?" },
      { order: "There was a party last night", pt: "Teve uma festa ontem à noite" }
    ]
  },
  {
    id: "t10", title: "Will be, be + -ing, be careful", sub: "Futuro e outros usos",
    points: [
      "Futuro: will be (I'll be there at 8) e going to be (It's going to be hot).",
      "Am, is, are + verbo com -ing = ação acontecendo agora: I'm working. She's sleeping.",
      "Imperativo usa be: Be careful! Be quiet! Don't be late! Don't be afraid!",
      "Infinitivo: to be (I want to be a doctor). Particípio: been (I have been to Rio)."
    ],
    table: [["will be", "vai ser, vai estar", "I'll be there."], ["going to be", "vai ser (previsão)", "It's going to be hot."], ["am / is / are + -ing", "está fazendo agora", "I'm studying."], ["Be…! / Don't be…!", "Seja…! Não seja…!", "Be careful!"]],
    examples: [["I'll be there at eight.", "Vou estar lá às oito."], ["Tomorrow will be a good day.", "Amanhã vai ser um bom dia."], ["It's going to be hot.", "Vai fazer calor."], ["I'm studying English now.", "Estou estudando inglês agora."], ["Be careful!", "Tenha cuidado!"], ["Don't be late.", "Não se atrase."]],
    ex: [
      { q: "I ___ at home tonight.", o: ["will be", "will", "am be"], a: 0, e: "Futuro do to be: will be." },
      { q: "She ___ working now.", o: ["is", "are", "be"], a: 0, e: "Ação acontecendo agora: is + -ing." },
      { q: "They ___ watching TV.", o: ["is", "are", "am"], a: 1, e: "They are + -ing." },
      { q: "___ careful! The floor is wet.", o: ["Be", "Is", "Are"], a: 0, e: "Imperativo usa a forma base: Be." },
      { q: "Don't ___ afraid.", o: ["be", "is", "are"], a: 0, e: "Don't be…" },
      { q: "I want ___ a teacher.", o: ["be", "to be", "being"], a: 1, e: "Want + to + verbo: to be." },
      { order: "I will be there tomorrow", pt: "Eu vou estar lá amanhã" },
      { order: "I'm learning English today", pt: "Estou aprendendo inglês hoje" }
    ]
  },
  {
    id: "t11", title: "Revisão final do to be", sub: "15 questões de todas as lições", review: true,
    points: [
      "Presente: am, is, are. Passado: was, were. Futuro: will be.",
      "Negativa com not depois do verbo; pergunta trocando a ordem; nunca do, does ou did com to be.",
      "Idade, fome, frio, medo e razão usam to be. Há e tem usam there is e there are."
    ],
    examples: [["I'm 30 and I'm from Brazil.", "Tenho 30 anos e sou do Brasil."], ["Are you ready? Yes, I am.", "Você está pronto? Sim, estou."], ["There are two people here.", "Há duas pessoas aqui."], ["How was your day?", "Como foi o seu dia?"], ["I'll be there at eight.", "Vou estar lá às oito."], ["Don't be late!", "Não se atrase!"]],
    ex: []
  }
];
