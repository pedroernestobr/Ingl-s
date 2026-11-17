/*
 * Estruturas básicas com do, does e did: afirmar, negar e perguntar no presente e no passado.
 * Lições no mesmo formato do verbo to be (explicação, tabela, exemplos e exercícios) e
 * treinos de verbos: cada verbo passa pelas 9 formas (eu, você, ela · presente e passado).
 */
window.DODID = [
  {
    id: "d1", title: "Do: negar e perguntar", sub: "I, you, we, they no presente",
    points: [
      "Com os verbos de ação (trabalhar, gostar, morar), o inglês usa um ajudante para negar e perguntar: do.",
      "Afirmar: I work. Negar: I don't work (do + not). Perguntar: Do you work?",
      "O do não tem tradução: é só a marca da pergunta ou da negação.",
      "Depois de do e don't, o verbo fica na forma básica: Do you like? Nunca Do you likes?",
      "Resposta curta repete o ajudante: Yes, I do. No, I don't."
    ],
    table: [["Afirmar", "I work.", "Eu trabalho."], ["Negar", "I don't work.", "Eu não trabalho."], ["Perguntar", "Do you work?", "Você trabalha?"], ["Sim", "Yes, I do.", "Sim."], ["Não", "No, I don't.", "Não."]],
    examples: [["I live in São Paulo.", "Eu moro em São Paulo."], ["I don't speak Spanish.", "Eu não falo espanhol."], ["Do you like coffee?", "Você gosta de café?"], ["Yes, I do.", "Sim, gosto."], ["We don't have a car.", "Nós não temos carro."], ["Do they work here?", "Eles trabalham aqui?"], ["No, they don't.", "Não, não trabalham."]],
    ex: [
      { q: "___ you speak English?", o: ["Do", "Does", "Are"], a: 0, e: "Pergunta no presente com you: Do." },
      { q: "I ___ like fish.", o: ["don't", "doesn't", "not"], a: 0, e: "Negativa com I: don't." },
      { q: "Do you ___ in Rio?", o: ["live", "lives", "living"], a: 0, e: "Depois de do, o verbo fica na forma básica." },
      { q: "We ___ work on Sundays.", o: ["don't", "doesn't", "aren't"], a: 0, e: "We + don't + verbo." },
      { q: "“Você gosta de música?” em inglês:", o: ["You like music?", "Do you like music?", "Are you like music?"], a: 1, e: "Pergunta com verbo de ação usa do, não are." },
      { q: "Do you have kids? — Yes, I ___.", o: ["do", "am", "have"], a: 0, e: "Resposta curta repete o ajudante: Yes, I do." },
      { order: "I don't have time", pt: "Eu não tenho tempo" },
      { order: "Do you work here", pt: "Você trabalha aqui?" }
    ]
  },
  {
    id: "d2", title: "Does: he, she, it", sub: "O -s da terceira pessoa",
    points: [
      "Com he, she e it, o ajudante é does: Does she work? She doesn't work.",
      "Na afirmativa, o -s vai para o verbo: she works, he lives, it costs.",
      "Na pergunta e na negativa, o -s fica no does e o verbo volta ao básico: Does she work? Nunca Does she works?",
      "Verbos que mudam: have → has, go → goes, do → does, study → studies, watch → watches."
    ],
    table: [["Afirmar", "She works.", "Ela trabalha."], ["Negar", "She doesn't work.", "Ela não trabalha."], ["Perguntar", "Does she work?", "Ela trabalha?"], ["Sim", "Yes, she does.", "Sim."], ["Não", "No, she doesn't.", "Não."]],
    examples: [["He works in a bank.", "Ele trabalha num banco."], ["She doesn't eat meat.", "Ela não come carne."], ["Does it rain a lot here?", "Chove muito aqui?"], ["My brother has two kids.", "Meu irmão tem dois filhos."], ["Does your mom live with you?", "Sua mãe mora com você?"], ["No, she doesn't.", "Não, não mora."], ["The store opens at nine.", "A loja abre às nove."]],
    ex: [
      { q: "She ___ in London.", o: ["live", "lives", "living"], a: 1, e: "Afirmativa com she: verbo + s." },
      { q: "___ he speak English?", o: ["Do", "Does", "Is"], a: 1, e: "Pergunta com he: Does." },
      { q: "Does she ___ coffee?", o: ["like", "likes", "liking"], a: 0, e: "Depois de does, o verbo fica sem -s." },
      { q: "He ___ have a car.", o: ["don't", "doesn't", "isn't"], a: 1, e: "Negativa com he: doesn't." },
      { q: "My father ___ two jobs.", o: ["have", "has", "haves"], a: 1, e: "Have vira has com he, she e it." },
      { q: "Does it work? — No, it ___.", o: ["don't", "doesn't", "isn't"], a: 1, e: "Resposta curta com it: No, it doesn't." },
      { order: "She doesn't like the cold", pt: "Ela não gosta do frio" },
      { order: "Does he work on Saturdays", pt: "Ele trabalha aos sábados?" }
    ]
  },
  {
    id: "d3", title: "What, where, when + do", sub: "Perguntas de informação no presente",
    points: [
      "Primeiro a palavra de pergunta, depois do ou does: What do you do?",
      "Ordem: palavra de pergunta + do/does + pessoa + verbo + resto.",
      "What do you do? = O que você faz (de trabalho)? O segundo do é o verbo fazer.",
      "Com he, she e it: Where does she work? What time does it start?"
    ],
    table: [["What", "What do you do?", "O que você faz?"], ["Where", "Where do you live?", "Onde você mora?"], ["When", "When does it start?", "Quando começa?"], ["What time", "What time do you wake up?", "Que horas você acorda?"], ["Why", "Why do you study English?", "Por que você estuda inglês?"], ["How often", "How often do you train?", "Com que frequência você treina?"]],
    examples: [["What do you do?", "O que você faz?"], ["I'm a designer.", "Eu sou designer."], ["Where do you live?", "Onde você mora?"], ["What time do you start work?", "Que horas você começa a trabalhar?"], ["Where does your sister work?", "Onde a sua irmã trabalha?"], ["Why do you want to learn English?", "Por que você quer aprender inglês?"], ["How often do you go to the gym?", "Com que frequência você vai à academia?"]],
    ex: [
      { q: "Where ___ you live?", o: ["do", "does", "are"], a: 0, e: "Where + do + you." },
      { q: "What time ___ the movie start?", o: ["do", "does", "is"], a: 1, e: "The movie = it, então does." },
      { q: "What do you ___ on weekends?", o: ["do", "does", "doing"], a: 0, e: "O segundo do é o verbo fazer." },
      { q: "Where ___ she work?", o: ["do", "does", "is"], a: 1, e: "She usa does." },
      { q: "“O que você quer?” em inglês:", o: ["What you want?", "What do you want?", "What are you want?"], a: 1, e: "Pergunta de informação também precisa do do." },
      { q: "Why ___ they live here?", o: ["do", "does", "are"], a: 0, e: "They usa do." },
      { order: "What do you do", pt: "O que você faz?" },
      { order: "Where does he live", pt: "Onde ele mora?" }
    ]
  },
  {
    id: "d4", title: "Did: o passado", sub: "Afirmar, negar e perguntar no passado",
    points: [
      "No passado, o ajudante é did para todas as pessoas: I, you, he, she, we, they.",
      "Afirmar: o verbo vai para o passado. I worked. She went.",
      "Negar: didn't + verbo básico. I didn't work. She didn't go.",
      "Perguntar: Did + pessoa + verbo básico. Did you work? Did she go?",
      "O did já carrega o passado, por isso o verbo volta ao básico: Did you went? está errado."
    ],
    table: [["Afirmar", "I worked. She went.", "Eu trabalhei. Ela foi."], ["Negar", "I didn't work.", "Eu não trabalhei."], ["Perguntar", "Did you work?", "Você trabalhou?"], ["Sim", "Yes, I did.", "Sim."], ["Não", "No, I didn't.", "Não."]],
    examples: [["I watched a movie yesterday.", "Eu assisti a um filme ontem."], ["She went to the beach.", "Ela foi à praia."], ["I didn't sleep well.", "Eu não dormi bem."], ["Did you call him?", "Você ligou para ele?"], ["Yes, I did.", "Sim, liguei."], ["We didn't see the game.", "Nós não vimos o jogo."], ["Did they like the food?", "Eles gostaram da comida?"]],
    ex: [
      { q: "___ you see the news?", o: ["Do", "Did", "Was"], a: 1, e: "Pergunta no passado: Did." },
      { q: "I didn't ___ the email.", o: ["send", "sent", "sending"], a: 0, e: "Depois de didn't, verbo básico." },
      { q: "She ___ to Paris last year.", o: ["go", "went", "goes"], a: 1, e: "Afirmativa no passado: went, o passado de go." },
      { q: "Did he ___ the job?", o: ["get", "got", "gets"], a: 0, e: "Depois de did, verbo básico." },
      { q: "Did you like it? — Yes, I ___.", o: ["do", "did", "liked"], a: 1, e: "Resposta curta no passado: Yes, I did." },
      { q: "“Eu não comi.” em inglês:", o: ["I didn't ate.", "I didn't eat.", "I not ate."], a: 1, e: "didn't + eat, na forma básica." },
      { order: "I didn't understand", pt: "Eu não entendi" },
      { order: "Did you sleep well", pt: "Você dormiu bem?" }
    ]
  },
  {
    id: "d5", title: "What did you do?", sub: "Perguntas no passado e verbos irregulares",
    points: [
      "Mesma ordem do presente, trocando do por did: What did you do? Where did you go?",
      "Ótimo para puxar conversa: What did you do yesterday? How was it?",
      "Os irregulares mais usados: go → went, have → had, do → did, see → saw, eat → ate, get → got, buy → bought, take → took, come → came, make → made."
    ],
    table: [["go", "went", "ir → foi, fui"], ["have", "had", "ter → teve, tive"], ["do", "did", "fazer → fez, fiz"], ["see", "saw", "ver → viu, vi"], ["eat", "ate", "comer → comeu, comi"], ["get", "got", "conseguir → conseguiu"], ["buy", "bought", "comprar → comprou"], ["take", "took", "pegar → pegou"]],
    examples: [["What did you do yesterday?", "O que você fez ontem?"], ["I stayed home and watched TV.", "Fiquei em casa e vi TV."], ["Where did you go on vacation?", "Onde você foi nas férias?"], ["We went to Bahia.", "Nós fomos para a Bahia."], ["What did you have for lunch?", "O que você almoçou?"], ["When did you arrive?", "Quando você chegou?"], ["Why did you leave?", "Por que você foi embora?"]],
    ex: [
      { q: "What ___ you do last night?", o: ["do", "did", "does"], a: 1, e: "Last night = passado: did." },
      { q: "Where did you ___?", o: ["go", "went", "goes"], a: 0, e: "Depois de did, básico: go." },
      { q: "I ___ pizza for dinner.", o: ["eat", "ate", "eaten"], a: 1, e: "Afirmativa no passado: ate." },
      { q: "When ___ she arrive?", o: ["did", "does", "was"], a: 0, e: "Passado: did." },
      { q: "“O que você comprou?” em inglês:", o: ["What you bought?", "What did you buy?", "What did you bought?"], a: 1, e: "What + did + you + buy." },
      { q: "We ___ a great time.", o: ["have", "had", "did have"], a: 1, e: "Afirmativa no passado: had." },
      { order: "What did you do yesterday", pt: "O que você fez ontem?" },
      { order: "Where did you go", pt: "Onde você foi?" }
    ]
  },
  { id: "d6", title: "Revisão do do, does e did", sub: "15 questões das cinco lições", review: true, points: [], examples: [["Do you work here?", "Você trabalha aqui?"], ["She doesn't like coffee.", "Ela não gosta de café."], ["Did you sleep well?", "Você dormiu bem?"], ["What did you do yesterday?", "O que você fez ontem?"], ["Where does he live?", "Onde ele mora?"]], ex: [] }
];

/* Treino de verbos: [verbo, ele/ela, passado, eu (presente), você/ela (presente), eu (passado), você/ela (passado), complemento, complemento em português] */
window.DRILLS = [
  {
    id: "treino1", name: "Treino 1: trabalhar, morar, gostar", verbs: [
      ["work", "works", "worked", "trabalho", "trabalha", "trabalhei", "trabalhou", "here", "aqui"],
      ["live", "lives", "lived", "moro", "mora", "morei", "morou", "in Brazil", "no Brasil"],
      ["like", "likes", "liked", "gosto", "gosta", "gostei", "gostou", "the food", "da comida"],
      ["speak", "speaks", "spoke", "falo", "fala", "falei", "falou", "English", "inglês"],
      ["have", "has", "had", "tenho", "tem", "tive", "teve", "a car", "carro"],
      ["want", "wants", "wanted", "quero", "quer", "queria", "queria", "coffee", "café"]
    ]
  },
  {
    id: "treino2", name: "Treino 2: precisar, ir, comer", verbs: [
      ["need", "needs", "needed", "preciso", "precisa", "precisei", "precisou", "help", "de ajuda"],
      ["go", "goes", "went", "vou", "vai", "fui", "foi", "to the gym", "à academia"],
      ["eat", "eats", "ate", "como", "come", "comi", "comeu", "meat", "carne"],
      ["drink", "drinks", "drank", "bebo", "bebe", "bebi", "bebeu", "beer", "cerveja"],
      ["watch", "watches", "watched", "assisto", "assiste", "assisti", "assistiu", "TV", "TV"],
      ["study", "studies", "studied", "estudo", "estuda", "estudei", "estudou", "at night", "à noite"]
    ]
  },
  {
    id: "treino3", name: "Treino 3: jogar, comprar, entender", verbs: [
      ["play", "plays", "played", "jogo", "joga", "joguei", "jogou", "soccer", "futebol"],
      ["buy", "buys", "bought", "compro", "compra", "comprei", "comprou", "clothes online", "roupas pela internet"],
      ["know", "knows", "knew", "conheço", "conhece", "conhecia", "conhecia", "him", "ele"],
      ["understand", "understands", "understood", "entendo", "entende", "entendi", "entendeu", "the question", "a pergunta"],
      ["cook", "cooks", "cooked", "cozinho", "cozinha", "cozinhei", "cozinhou", "at home", "em casa"]
    ]
  },
  {
    id: "treino4", name: "Treino 4: ligar, ler, dormir", verbs: [
      ["call", "calls", "called", "ligo", "liga", "liguei", "ligou", "the doctor", "para o médico"],
      ["read", "reads", "read", "leio", "lê", "li", "leu", "the news", "as notícias"],
      ["sleep", "sleeps", "slept", "durmo", "dorme", "dormi", "dormiu", "well", "bem"],
      ["travel", "travels", "traveled", "viajo", "viaja", "viajei", "viajou", "a lot", "muito"],
      ["see", "sees", "saw", "vejo", "vê", "vi", "viu", "the problem", "o problema"]
    ]
  }
];

/* As 9 formas de um verbo, com tradução e duas versões erradas comuns (para os exercícios de escolha). */
window.drillForms = function (v) {
  const [base, third, past, eu, voce, euP, voceP, c, cPt] = v;
  const regular = past === base + "ed" || past === base + "d" || /ied$/.test(past);
  const madePast = base.endsWith("e") ? base + "d" : base + "ed"; // o erro clássico: goed, eated, haved
  const s = (subj, verb, end) => subj + " " + verb + " " + c + end;
  const forms = [
    { en: s("I", base, "."), pt: "Eu " + eu + " " + cPt + ".", tag: "Presente · afirmar", wrong: [s("I", third, "."), s("I am", base, ".")] },
    { en: s("I don't", base, "."), pt: "Eu não " + eu + " " + cPt + ".", tag: "Presente · negar", wrong: [s("I no", base, "."), s("I doesn't", base, "."), s("I don't", third, ".")] },
    { en: s("Do you", base, "?"), pt: "Você " + voce + " " + cPt + "?", tag: "Presente · perguntar", wrong: [s("Does you", base, "?"), s("Are you", base, "?"), s("Do you", third, "?")] },
    { en: s("She", third, "."), pt: "Ela " + voce + " " + cPt + ".", tag: "Ela · afirmar", wrong: [s("She", base, "."), s("She is", base, ".")] },
    { en: s("She doesn't", base, "."), pt: "Ela não " + voce + " " + cPt + ".", tag: "Ela · negar", wrong: [s("She don't", base, "."), s("She doesn't", third, ".")] },
    { en: s("Does she", base, "?"), pt: "Ela " + voce + " " + cPt + "?", tag: "Ela · perguntar", wrong: [s("Do she", base, "?"), s("Does she", third, "?")] },
    { en: s("I", past, "."), pt: "Eu " + euP + " " + cPt + ".", tag: "Passado · afirmar", wrong: [s("I", third, "."), regular ? s("I did", past, ".") : s("I", madePast, ".")] },
    { en: s("I didn't", base, "."), pt: "Eu não " + euP + " " + cPt + ".", tag: "Passado · negar", wrong: [s("I didn't", past, "."), s("I don't", past, "."), s("I didn't", third, ".")] },
    { en: s("Did you", base, "?"), pt: "Você " + voceP + " " + cPt + "?", tag: "Passado · perguntar", wrong: [s("Did you", past, "?"), s("Do you", past, "?"), s("Did you", third, "?")] }
  ];
  // Duas opções erradas, diferentes entre si e da certa (no "read", passado e presente se escrevem igual).
  forms.forEach((f) => { f.wrong = f.wrong.filter((w, k, a) => w !== f.en && a.indexOf(w) === k).slice(0, 2); });
  return forms;
};

window.ETAPAS = window.ETAPAS || [];
window.DODID.forEach((l) => window.ETAPAS.push({ id: l.id, part: "estruturas", kind: "grammar", name: l.title, icon: "book", desc: l.sub, lesson: l.id }));
window.DRILLS.forEach((d) => window.ETAPAS.push({ id: d.id, part: "estruturas", kind: "drill", name: d.name, icon: "repeat", desc: d.verbs.length + " verbos, 9 frases cada: eu, você e ela, no presente e no passado.", verbs: d.verbs }));
