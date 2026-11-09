/*
 * Conteúdo do programa: 12 semanas, 7 dias por semana.
 *
 *   Dias 1–5  lição      → 4 palavras, 2 frases de shadowing, 2 exercícios, 1 escrita
 *   Dia 6     imersão    → maratona de shadowing da semana + 3 missões + missão da semana
 *   Dia 7     revisão    → checkpoint de 10 questões + placar de execução + reflexão
 *
 * Para adaptar a outro método, edite apenas este arquivo. Formatos:
 *   vocab:  [inglês, português, exemplo em inglês, exemplo em português]
 *   say:    [frase em inglês, tradução]
 *   ex:     { q, o: [opções], a: índice correto, e: explicação }   → múltipla escolha
 *           { order: "frase em inglês", pt: "tradução" }           → montar a frase
 *   write:  { p: enunciado, s: [inícios de frase sugeridos] }
 */
window.CURRICULUM = {
  phases: [
    { n: 1, name: "Fundação", weeks: [1, 4], cefr: "A1", text: "Apresentar-se, rotina, família, casa e comida. Você sai falando frases completas sobre a sua vida." },
    { n: 2, name: "Construção", weeks: [5, 8], cefr: "A2", text: "Cidade, passado, futuro e compras. Você passa a contar histórias e fazer planos." },
    { n: 3, name: "Fluência", weeks: [9, 12], cefr: "B1", text: "Trabalho, viagens, opiniões e conversa real. Você sustenta uma conversa de 5 minutos." }
  ],

  weeks: [
    /* ───────────────────────── SEMANA 1 ───────────────────────── */
    {
      n: 1, phase: 1, cefr: "A1",
      title: "Apresentações", en: "Nice to meet you",
      goal: "Apresentar-se em 1 minuto: nome, de onde é, o que faz e do que gosta.",
      grammar: {
        title: "Verbo to be: am, is, are",
        body: [
          "“To be” significa ser ou estar. Em inglês o sujeito sempre aparece: “It is cold” (Está frio), nunca só “Is cold”.",
          "I am (I'm) · you are (you're) · he / she / it is (he's, she's, it's) · we / they are (we're, they're).",
          "Negativa: coloque “not” depois do verbo — I'm not tired. She isn't here. They aren't ready.",
          "Pergunta: inverta a ordem — Are you Brazilian? Is he your brother?"
        ],
        examples: [["I'm Pedro and I'm from Brazil.", "Eu sou o Pedro e sou do Brasil."], ["She isn't at home.", "Ela não está em casa."], ["Are you ready?", "Você está pronto?"]]
      },
      days: [
        {
          title: "Cumprimentos",
          vocab: [
            ["Hello", "Olá", "Hello! I'm Ana.", "Olá! Eu sou a Ana."],
            ["Good morning", "Bom dia", "Good morning, everyone.", "Bom dia, pessoal."],
            ["Nice to meet you", "Prazer em conhecer você", "Nice to meet you, John.", "Prazer em conhecer você, John."],
            ["How are you?", "Como vai você?", "Hi Mark, how are you?", "Oi Mark, como vai?"]
          ],
          say: [["Hi, I'm Pedro. Nice to meet you.", "Oi, eu sou o Pedro. Prazer."], ["I'm fine, thanks. And you?", "Estou bem, obrigado. E você?"]],
          ex: [
            { q: "I ___ fine, thanks.", o: ["am", "is", "are"], a: 0, e: "Com “I” usamos sempre “am”." },
            { order: "Nice to meet you", pt: "Prazer em conhecer você" }
          ],
          write: { p: "Escreva como você cumprimentaria alguém novo no trabalho.", s: ["Hi, I'm...", "Nice to meet you.", "How are you?"] }
        },
        {
          title: "Nome e origem",
          vocab: [
            ["name", "nome", "My name is Lucas.", "Meu nome é Lucas."],
            ["from", "de (origem)", "I'm from São Paulo.", "Eu sou de São Paulo."],
            ["country", "país", "Brazil is a big country.", "O Brasil é um país grande."],
            ["city", "cidade", "Rio is a beautiful city.", "O Rio é uma cidade bonita."]
          ],
          say: [["Where are you from?", "De onde você é?"], ["I'm from Brazil. I live in Recife.", "Eu sou do Brasil. Moro em Recife."]],
          ex: [
            { q: "Where ___ you from?", o: ["am", "is", "are"], a: 2, e: "“You” sempre usa “are”." },
            { order: "She is from Canada", pt: "Ela é do Canadá" }
          ],
          write: { p: "Diga seu nome, de onde você é e onde mora hoje.", s: ["My name is...", "I'm from...", "I live in..."] }
        },
        {
          title: "Profissões",
          vocab: [
            ["job", "emprego, trabalho", "What's your job?", "Qual é o seu trabalho?"],
            ["work", "trabalhar", "I work in a bank.", "Eu trabalho em um banco."],
            ["student", "estudante", "He is a university student.", "Ele é estudante universitário."],
            ["company", "empresa", "She works for a big company.", "Ela trabalha para uma grande empresa."]
          ],
          say: [["What do you do?", "O que você faz? (profissão)"], ["I'm a nurse. I work at a hospital.", "Sou enfermeiro. Trabalho em um hospital."]],
          ex: [
            { q: "He ___ an engineer.", o: ["am", "is", "are"], a: 1, e: "He, she e it usam “is”." },
            { q: "Escolha a frase correta:", o: ["I am teacher.", "I am a teacher.", "I teacher."], a: 1, e: "Antes de profissão no singular usamos “a” ou “an”: I am a teacher." }
          ],
          write: { p: "Conte o que você faz: trabalho ou estudo, e onde.", s: ["I'm a...", "I work at...", "I study..."] }
        },
        {
          title: "Idade e números",
          vocab: [
            ["number", "número", "What's your phone number?", "Qual é o seu número de telefone?"],
            ["How old are you?", "Quantos anos você tem?", "How old are you, Bia?", "Quantos anos você tem, Bia?"],
            ["years old", "anos de idade", "I'm thirty years old.", "Eu tenho trinta anos."],
            ["birthday", "aniversário", "My birthday is in May.", "Meu aniversário é em maio."]
          ],
          say: [["How old are you? I'm twenty-five.", "Quantos anos você tem? Tenho vinte e cinco."], ["When is your birthday?", "Quando é o seu aniversário?"]],
          ex: [
            { q: "Como dizer “Eu tenho 30 anos”?", o: ["I have 30 years.", "I am 30 years old.", "I have 30 years old."], a: 1, e: "Em inglês idade usa “to be”: I am 30 (years old)." },
            { order: "How old is your sister?", pt: "Quantos anos tem sua irmã?" }
          ],
          write: { p: "Escreva sua idade, quando é seu aniversário e seu número de telefone inventado.", s: ["I'm ... years old.", "My birthday is in...", "My number is..."] }
        },
        {
          title: "Gostos e hobbies",
          vocab: [
            ["like", "gostar", "I like coffee.", "Eu gosto de café."],
            ["love", "amar, adorar", "I love music.", "Eu amo música."],
            ["hobby", "passatempo", "My hobby is cooking.", "Meu hobby é cozinhar."],
            ["free time", "tempo livre", "In my free time, I read.", "No meu tempo livre, eu leio."]
          ],
          say: [["I like movies and I love football.", "Eu gosto de filmes e amo futebol."], ["What do you do in your free time?", "O que você faz no seu tempo livre?"]],
          ex: [
            { q: "They ___ my friends.", o: ["is", "am", "are"], a: 2, e: "“They” (eles, elas) usa “are”." },
            { q: "Forma negativa correta:", o: ["She isn't tired.", "She not is tired.", "She don't tired."], a: 0, e: "Negativa do to be: “not” depois do verbo — is not, isn't." }
          ],
          write: { p: "Monte sua apresentação completa: nome, origem, trabalho e um hobby (4 a 5 frases).", s: ["My name is...", "I'm from...", "I work...", "In my free time, I..."] }
        }
      ],
      immersion: [
        "Assista a um vídeo curto de alguém se apresentando em inglês (busque “introduce yourself in English”).",
        "Grave um áudio de 1 minuto se apresentando com as frases da semana. Guarde: você vai comparar na Semana 12.",
        "Mude o idioma do seu celular para inglês até o fim do programa."
      ]
    },

    /* ───────────────────────── SEMANA 2 ───────────────────────── */
    {
      n: 2, phase: 1, cefr: "A1",
      title: "Rotina diária", en: "My daily routine",
      goal: "Descrever um dia de semana seu, do momento em que acorda até a hora de dormir.",
      grammar: {
        title: "Present simple: hábitos e rotinas",
        body: [
          "Use para o que acontece sempre ou com frequência: I work every day.",
          "Com he, she e it, o verbo ganha -s: she works. Depois de ch, sh, s, x e o, ganha -es: he watches, she goes. Consoante + y vira -ies: she studies. Have vira has.",
          "Negativa: don't ou doesn't + verbo na forma base — I don't drink coffee. He doesn't work on Sundays.",
          "Pergunta: Do ou Does + sujeito + verbo base — Do you like tea? Does she live here?"
        ],
        examples: [["I wake up at seven.", "Eu acordo às sete."], ["She doesn't eat meat.", "Ela não come carne."], ["Does he work here?", "Ele trabalha aqui?"]]
      },
      days: [
        {
          title: "De manhã",
          vocab: [
            ["wake up", "acordar", "I wake up at 6 a.m.", "Eu acordo às 6 da manhã."],
            ["get up", "levantar-se", "She gets up early.", "Ela se levanta cedo."],
            ["take a shower", "tomar banho", "I take a shower every morning.", "Eu tomo banho toda manhã."],
            ["have breakfast", "tomar café da manhã", "We have breakfast at home.", "Nós tomamos café da manhã em casa."]
          ],
          say: [["I wake up at seven and take a shower.", "Acordo às sete e tomo banho."], ["What time do you get up?", "Que horas você se levanta?"]],
          ex: [
            { q: "She ___ up at 6.", o: ["wake", "wakes", "waking"], a: 1, e: "Com she, o verbo ganha -s: wakes." },
            { order: "I have breakfast at home", pt: "Eu tomo café da manhã em casa" }
          ],
          write: { p: "Descreva sua manhã: que horas acorda e o que faz antes de sair.", s: ["I wake up at...", "Then I...", "I have breakfast..."] }
        },
        {
          title: "Trabalho e estudo",
          vocab: [
            ["go to work", "ir ao trabalho", "I go to work by bus.", "Eu vou ao trabalho de ônibus."],
            ["start", "começar", "My class starts at 8.", "Minha aula começa às 8."],
            ["finish", "terminar", "He finishes work at 5.", "Ele termina o trabalho às 5."],
            ["lunch", "almoço", "We have lunch at noon.", "Nós almoçamos ao meio-dia."]
          ],
          say: [["I start work at nine and finish at six.", "Começo a trabalhar às nove e termino às seis."], ["Do you have lunch at work?", "Você almoça no trabalho?"]],
          ex: [
            { q: "He ___ work at 5 p.m.", o: ["finish", "finishs", "finishes"], a: 2, e: "Verbos terminados em -sh ganham -es: finishes." },
            { q: "___ you go to work by car?", o: ["Do", "Does", "Are"], a: 0, e: "Pergunta com you no present simple usa “Do”." }
          ],
          write: { p: "Conte como é seu horário de trabalho ou estudo.", s: ["I go to work by...", "I start at...", "I finish at..."] }
        },
        {
          title: "Frequência",
          vocab: [
            ["always", "sempre", "I always drink water in the morning.", "Eu sempre bebo água de manhã."],
            ["usually", "geralmente", "She usually walks to work.", "Ela geralmente vai a pé ao trabalho."],
            ["sometimes", "às vezes", "We sometimes eat out.", "Às vezes comemos fora."],
            ["never", "nunca", "He never watches TV.", "Ele nunca assiste TV."]
          ],
          say: [["I usually go to bed at eleven.", "Geralmente vou dormir às onze."], ["I never work on Sundays.", "Nunca trabalho aos domingos."]],
          ex: [
            { q: "Ordem correta:", o: ["I go always to the gym.", "I always go to the gym.", "Always I go to the gym."], a: 1, e: "Advérbios de frequência vêm antes do verbo principal." },
            { order: "She sometimes cooks dinner", pt: "Ela às vezes faz o jantar" }
          ],
          write: { p: "Escreva 4 frases sobre seus hábitos usando always, usually, sometimes e never.", s: ["I always...", "I usually...", "I sometimes...", "I never..."] }
        },
        {
          title: "À noite",
          vocab: [
            ["get home", "chegar em casa", "I get home at 7 p.m.", "Eu chego em casa às 7 da noite."],
            ["cook", "cozinhar", "My father cooks on weekends.", "Meu pai cozinha nos fins de semana."],
            ["watch TV", "assistir TV", "They watch TV after dinner.", "Eles assistem TV depois do jantar."],
            ["go to bed", "ir dormir", "I go to bed late.", "Eu vou dormir tarde."]
          ],
          say: [["After dinner, I watch a series.", "Depois do jantar, assisto a uma série."], ["What time do you go to bed?", "Que horas você vai dormir?"]],
          ex: [
            { q: "She ___ TV at night.", o: ["don't watch", "doesn't watch", "doesn't watches"], a: 1, e: "Negativa com she: doesn't + verbo sem -s." },
            { q: "He ___ two kids.", o: ["have", "has", "haves"], a: 1, e: "“Have” com he, she e it vira “has”." }
          ],
          write: { p: "Descreva sua noite: quando chega em casa e o que faz até dormir.", s: ["I get home at...", "After dinner, I...", "I go to bed at..."] }
        },
        {
          title: "Fim de semana",
          vocab: [
            ["weekend", "fim de semana", "The weekend is my favorite time.", "O fim de semana é meu momento favorito."],
            ["relax", "relaxar", "I relax on Sundays.", "Eu relaxo aos domingos."],
            ["visit", "visitar", "We visit my grandmother every month.", "Nós visitamos minha avó todo mês."],
            ["stay home", "ficar em casa", "Sometimes I stay home and read.", "Às vezes fico em casa e leio."]
          ],
          say: [["On Saturdays, I usually visit my parents.", "Aos sábados, geralmente visito meus pais."], ["Does your brother work on weekends?", "Seu irmão trabalha nos fins de semana?"]],
          ex: [
            { q: "___ she study English?", o: ["Do", "Does", "Is"], a: 1, e: "Pergunta com she usa “Does”." },
            { order: "We stay home on Sundays", pt: "Nós ficamos em casa aos domingos" }
          ],
          write: { p: "O que você normalmente faz no fim de semana?", s: ["On Saturdays, I...", "On Sundays, I usually...", "I never..."] }
        }
      ],
      immersion: [
        "Assista a um vídeo “my daily routine in English” e anote 5 verbos novos.",
        "Durante o dia, descreva mentalmente em inglês o que você faz: I wake up. I take a shower. I go to work.",
        "Escreva sua rotina completa (8 a 10 frases) e leia em voz alta duas vezes."
      ]
    },

    /* ───────────────────────── SEMANA 3 ───────────────────────── */
    {
      n: 3, phase: 1, cefr: "A1",
      title: "Família e casa", en: "Home sweet home",
      goal: "Descrever sua família e sua casa para alguém que não conhece.",
      grammar: {
        title: "Possessivos e there is / there are",
        body: [
          "Possessivos: my, your, his (dele), her (dela), its, our, their. O possessivo depende do dono, não da coisa: Ana's husband → her husband.",
          "Use 's para posse: Maria's car (o carro da Maria).",
          "There is (singular) e there are (plural) significam “há” ou “tem”: There is a sofa in the living room. There are two bedrooms.",
          "Perguntas e negativas: Is there a garden? Are there any chairs? There isn't a garage. There aren't any windows."
        ],
        examples: [["Their house is very big.", "A casa deles é muito grande."], ["There are three bedrooms.", "Há três quartos."], ["Is there a park near here?", "Tem um parque aqui perto?"]]
      },
      days: [
        {
          title: "Família",
          vocab: [
            ["mother", "mãe", "My mother is a doctor.", "Minha mãe é médica."],
            ["father", "pai", "My father works a lot.", "Meu pai trabalha muito."],
            ["brother", "irmão", "I have one brother.", "Eu tenho um irmão."],
            ["sister", "irmã", "Her sister lives in Lisbon.", "A irmã dela mora em Lisboa."]
          ],
          say: [["I have two brothers and one sister.", "Eu tenho dois irmãos e uma irmã."], ["My parents live in Salvador.", "Meus pais moram em Salvador."]],
          ex: [
            { q: "This is Ana. ___ husband is Carlos.", o: ["His", "Her", "Their"], a: 1, e: "A dona é a Ana (ela), então usamos “her”." },
            { order: "My sister is a teacher", pt: "Minha irmã é professora" }
          ],
          write: { p: "Apresente as pessoas da sua família mais próxima.", s: ["I have...", "My mother is...", "My father..."] }
        },
        {
          title: "Família 2",
          vocab: [
            ["parents", "pais", "My parents are retired.", "Meus pais são aposentados."],
            ["children", "filhos, crianças", "They have three children.", "Eles têm três filhos."],
            ["husband", "marido", "Her husband is from Chile.", "O marido dela é do Chile."],
            ["wife", "esposa", "His wife is very funny.", "A esposa dele é muito engraçada."]
          ],
          say: [["Are you married? Yes, I am.", "Você é casado? Sim, sou."], ["Do you have any children?", "Você tem filhos?"]],
          ex: [
            { q: "Tom and Lisa love ___ kids.", o: ["his", "her", "their"], a: 2, e: "Dois donos (eles) → their." },
            { q: "“O carro do Pedro” em inglês:", o: ["The car of Pedro", "Pedro's car", "Pedro car"], a: 1, e: "Usamos 's para posse: Pedro's car." }
          ],
          write: { p: "Fale sobre alguém da sua família: quem é, onde mora e o que faz.", s: ["My ... is...", "He / She lives in...", "His / Her job is..."] }
        },
        {
          title: "A casa",
          vocab: [
            ["house", "casa", "I live in a small house.", "Eu moro em uma casa pequena."],
            ["apartment", "apartamento", "Our apartment is on the fifth floor.", "Nosso apartamento fica no quinto andar."],
            ["bedroom", "quarto", "There are two bedrooms.", "Há dois quartos."],
            ["kitchen", "cozinha", "The kitchen is my favorite room.", "A cozinha é meu cômodo favorito."]
          ],
          say: [["There is a big kitchen in my apartment.", "Tem uma cozinha grande no meu apartamento."], ["How many bedrooms are there?", "Quantos quartos há?"]],
          ex: [
            { q: "There ___ three bedrooms in my house.", o: ["is", "are", "have"], a: 1, e: "Plural (three bedrooms) → there are." },
            { order: "There is a sofa in the living room", pt: "Há um sofá na sala" }
          ],
          write: { p: "Descreva onde você mora: casa ou apartamento, quantos quartos e seu cômodo favorito.", s: ["I live in...", "There is...", "There are..."] }
        },
        {
          title: "Cômodos e objetos",
          vocab: [
            ["living room", "sala de estar", "We watch TV in the living room.", "Nós assistimos TV na sala."],
            ["bathroom", "banheiro", "The bathroom is next to my bedroom.", "O banheiro fica ao lado do meu quarto."],
            ["table", "mesa", "There is a table near the window.", "Há uma mesa perto da janela."],
            ["window", "janela", "Please close the window.", "Por favor, feche a janela."]
          ],
          say: [["Is there a bathroom on this floor?", "Há um banheiro neste andar?"], ["There isn't a garage, but there is a garden.", "Não há garagem, mas há um jardim."]],
          ex: [
            { q: "___ there a park near your house?", o: ["Is", "Are", "Do"], a: 0, e: "Singular (a park) → Is there." },
            { q: "There ___ any chairs in the kitchen.", o: ["isn't", "aren't", "don't"], a: 1, e: "Plural negativo: there aren't." }
          ],
          write: { p: "Escreva o que há e o que não há na sua sala.", s: ["In my living room, there is...", "There are...", "There isn't..."] }
        },
        {
          title: "Descrevendo pessoas",
          vocab: [
            ["tall", "alto", "My brother is very tall.", "Meu irmão é muito alto."],
            ["short", "baixo, curto", "She is short and has curly hair.", "Ela é baixa e tem cabelo cacheado."],
            ["friendly", "simpático", "Our neighbors are friendly.", "Nossos vizinhos são simpáticos."],
            ["hair", "cabelo", "He has short black hair.", "Ele tem cabelo preto e curto."]
          ],
          say: [["My best friend is tall and very friendly.", "Meu melhor amigo é alto e muito simpático."], ["She has long brown hair.", "Ela tem cabelo castanho e comprido."]],
          ex: [
            { q: "Ordem correta:", o: ["She has hair long.", "She has long hair.", "She long hair has."], a: 1, e: "Em inglês o adjetivo vem antes do substantivo." },
            { order: "Their house is very big", pt: "A casa deles é muito grande" }
          ],
          write: { p: "Descreva seu melhor amigo ou alguém da família: aparência e personalidade.", s: ["My best friend is...", "He / She has...", "He / She is very..."] }
        }
      ],
      immersion: [
        "Desenhe a planta da sua casa e escreva o nome de cada cômodo em inglês.",
        "Escreva 5 frases sobre sua família usando my, his, her e their.",
        "Assista a uma cena de sitcom em família com legendas em inglês."
      ]
    },

    /* ───────────────────────── SEMANA 4 ───────────────────────── */
    {
      n: 4, phase: 1, cefr: "A1",
      title: "Comida e restaurante", en: "Can I have the menu?",
      goal: "Pedir uma refeição completa em um restaurante, do “table for two” até a conta.",
      grammar: {
        title: "Some, any e pedidos educados",
        body: [
          "Contáveis (apple, egg) têm plural. Incontáveis (water, rice, bread) não: some water, nunca “waters” no uso comum.",
          "Some aparece em frases afirmativas, ofertas e pedidos: I'd like some coffee. Any aparece em negativas e perguntas: We don't have any milk. Is there any sugar?",
          "How many para contáveis e how much para incontáveis: How many eggs? How much water?",
          "Para pedir, “I'd like...” (I would like) e “Can I have...?” soam muito mais naturais que “I want”."
        ],
        examples: [["I'd like some water, please.", "Eu gostaria de um pouco de água, por favor."], ["We don't have any bread.", "Não temos pão."], ["How much is it?", "Quanto custa?"]]
      },
      days: [
        {
          title: "Comidas do dia a dia",
          vocab: [
            ["rice", "arroz", "In Brazil, we eat rice every day.", "No Brasil, comemos arroz todo dia."],
            ["beans", "feijão", "Rice and beans is a classic dish.", "Arroz com feijão é um prato clássico."],
            ["chicken", "frango", "I'd like grilled chicken.", "Eu gostaria de frango grelhado."],
            ["vegetables", "legumes, verduras", "I eat vegetables at lunch.", "Eu como legumes no almoço."]
          ],
          say: [["I usually eat rice, beans and chicken for lunch.", "Geralmente como arroz, feijão e frango no almoço."], ["I don't eat meat, but I love vegetables.", "Não como carne, mas amo legumes."]],
          ex: [
            { q: "We need ___ rice.", o: ["a", "some", "many"], a: 1, e: "Rice é incontável → some rice." },
            { order: "I love rice and beans", pt: "Eu amo arroz e feijão" }
          ],
          write: { p: "O que você come em um almoço normal?", s: ["For lunch, I usually eat...", "I like...", "I don't eat..."] }
        },
        {
          title: "Café da manhã",
          vocab: [
            ["bread", "pão", "I eat bread and butter.", "Eu como pão com manteiga."],
            ["cheese", "queijo", "Brazilian cheese bread is delicious.", "Pão de queijo é delicioso."],
            ["juice", "suco", "I drink orange juice.", "Eu bebo suco de laranja."],
            ["milk", "leite", "Do you take milk in your coffee?", "Você coloca leite no café?"]
          ],
          say: [["Would you like some juice?", "Você gostaria de um pouco de suco?"], ["There isn't any milk in the fridge.", "Não tem leite na geladeira."]],
          ex: [
            { q: "Is there ___ cheese?", o: ["some", "any", "a"], a: 1, e: "Em perguntas usamos “any”." },
            { q: "How ___ water do you drink?", o: ["many", "much", "more"], a: 1, e: "Water é incontável → how much." }
          ],
          write: { p: "Descreva seu café da manhã ideal.", s: ["My perfect breakfast is...", "I'd like some...", "I don't need any..."] }
        },
        {
          title: "Chegando ao restaurante",
          vocab: [
            ["menu", "cardápio", "Can I see the menu, please?", "Posso ver o cardápio, por favor?"],
            ["order", "pedir, fazer o pedido", "Are you ready to order?", "Vocês estão prontos para pedir?"],
            ["waiter", "garçom", "The waiter is very nice.", "O garçom é muito gentil."],
            ["table for two", "mesa para dois", "A table for two, please.", "Uma mesa para dois, por favor."]
          ],
          say: [["Hi, a table for two, please.", "Oi, uma mesa para dois, por favor."], ["Can we see the menu, please?", "Podemos ver o cardápio, por favor?"]],
          ex: [
            { q: "Forma mais educada de pedir:", o: ["I want a salad.", "I'd like a salad, please.", "Give me salad."], a: 1, e: "“I'd like” é a forma educada padrão." },
            { order: "Are you ready to order?", pt: "Vocês estão prontos para pedir?" }
          ],
          write: { p: "Escreva o diálogo da chegada a um restaurante (você e o garçom).", s: ["Hi, a table for...", "Can we see...", "Thank you."] }
        },
        {
          title: "Fazendo o pedido",
          vocab: [
            ["I'd like", "eu gostaria", "I'd like the fish, please.", "Eu gostaria do peixe, por favor."],
            ["Can I have...?", "Pode me trazer...?", "Can I have a glass of water?", "Pode me trazer um copo de água?"],
            ["the check", "a conta", "Can we have the check, please?", "Pode trazer a conta, por favor?"],
            ["tip", "gorjeta", "The tip is not included.", "A gorjeta não está incluída."]
          ],
          say: [["I'd like a burger and a lemonade, please.", "Eu gostaria de um hambúrguer e uma limonada, por favor."], ["Excuse me, can I have some more bread?", "Com licença, pode me trazer mais pão?"]],
          ex: [
            { q: "“I'd like” significa:", o: ["Eu gosto", "Eu gostaria", "Eu gostei"], a: 1, e: "I'd like = I would like = eu gostaria." },
            { q: "Can I ___ the check, please?", o: ["have", "has", "having"], a: 0, e: "Depois de “can”, o verbo fica na forma base." }
          ],
          write: { p: "Faça o pedido completo: prato, bebida e sobremesa.", s: ["I'd like...", "Can I have...", "For dessert..."] }
        },
        {
          title: "Sabores",
          vocab: [
            ["delicious", "delicioso", "This cake is delicious!", "Este bolo está delicioso!"],
            ["spicy", "apimentado", "I don't like spicy food.", "Eu não gosto de comida apimentada."],
            ["sweet", "doce", "Brazilian desserts are very sweet.", "Sobremesas brasileiras são muito doces."],
            ["hungry", "com fome", "I'm hungry. Let's eat!", "Estou com fome. Vamos comer!"]
          ],
          say: [["I'm really hungry. Let's order a pizza.", "Estou com muita fome. Vamos pedir uma pizza."], ["Is this dish spicy?", "Este prato é apimentado?"]],
          ex: [
            { q: "“Estou com fome” em inglês:", o: ["I have hungry.", "I'm hungry.", "I am with hunger."], a: 1, e: "Fome, sede, frio e calor usam “to be”: I'm hungry, I'm cold." },
            { order: "This soup is delicious", pt: "Esta sopa está deliciosa" }
          ],
          write: { p: "Descreva sua comida favorita e por que gosta dela.", s: ["My favorite food is...", "It's very...", "I eat it when..."] }
        }
      ],
      immersion: [
        "Simule em voz alta um jantar inteiro: pedir mesa, prato, bebida e a conta.",
        "Leia um cardápio de restaurante em inglês na internet e anote 10 palavras.",
        "Cozinhe algo seguindo uma receita em inglês, em vídeo ou texto."
      ]
    },

    /* ───────────────────────── SEMANA 5 ───────────────────────── */
    {
      n: 5, phase: 2, cefr: "A2",
      title: "Cidade e direções", en: "How do I get there?",
      goal: "Pedir e dar direções para chegar a um lugar da sua cidade.",
      grammar: {
        title: "Preposições de lugar e imperativo",
        body: [
          "in: dentro de, cidades e bairros — in the park, in London. on: ruas e superfícies — on Main Street, on the table. at: ponto específico — at the bus stop, at home.",
          "Posição: next to (ao lado de), across from (em frente a), between (entre), near (perto de), behind (atrás de).",
          "Imperativo é o verbo na forma base, sem sujeito: Turn left. Go straight.",
          "Imperativo negativo: Don't + verbo — Don't cross here."
        ],
        examples: [["The bank is next to the pharmacy.", "O banco fica ao lado da farmácia."], ["Turn right at the corner.", "Vire à direita na esquina."], ["I'm at the bus stop.", "Estou no ponto de ônibus."]]
      },
      days: [
        {
          title: "Lugares da cidade",
          vocab: [
            ["bank", "banco", "The bank opens at 10.", "O banco abre às 10."],
            ["pharmacy", "farmácia", "Is there a pharmacy near here?", "Tem uma farmácia aqui perto?"],
            ["supermarket", "supermercado", "I go to the supermarket on Saturdays.", "Vou ao supermercado aos sábados."],
            ["bus stop", "ponto de ônibus", "The bus stop is on this street.", "O ponto de ônibus fica nesta rua."]
          ],
          say: [["Is there a pharmacy near here?", "Tem uma farmácia aqui perto?"], ["The bus stop is across from the bank.", "O ponto de ônibus fica em frente ao banco."]],
          ex: [
            { q: "I live ___ Curitiba.", o: ["in", "on", "at"], a: 0, e: "Cidades usam “in”." },
            { order: "The bank is next to the supermarket", pt: "O banco fica ao lado do supermercado" }
          ],
          write: { p: "Liste 4 lugares perto da sua casa e onde ficam.", s: ["Near my house, there is...", "The ... is on ... Street.", "There isn't..."] }
        },
        {
          title: "Posições",
          vocab: [
            ["next to", "ao lado de", "The café is next to the bookstore.", "O café fica ao lado da livraria."],
            ["across from", "em frente a", "My office is across from the park.", "Meu escritório fica em frente ao parque."],
            ["between", "entre", "The pharmacy is between the bank and the school.", "A farmácia fica entre o banco e a escola."],
            ["near", "perto de", "I live near the beach.", "Eu moro perto da praia."]
          ],
          say: [["The hotel is between the museum and the station.", "O hotel fica entre o museu e a estação."], ["Is it near here? Yes, it's very close.", "Fica perto daqui? Sim, bem perto."]],
          ex: [
            { q: "The station is ___ Oak Street.", o: ["in", "on", "at"], a: 1, e: "Ruas usam “on”." },
            { q: "Wait for me ___ the bus stop.", o: ["in", "on", "at"], a: 2, e: "Ponto específico → at." }
          ],
          write: { p: "Descreva onde fica o seu trabalho ou escola em relação a outros lugares.", s: ["My office is next to...", "It's across from...", "It's near..."] }
        },
        {
          title: "Dando direções",
          vocab: [
            ["turn left", "vire à esquerda", "Turn left at the light.", "Vire à esquerda no semáforo."],
            ["turn right", "vire à direita", "Turn right after the bank.", "Vire à direita depois do banco."],
            ["go straight", "siga em frente", "Go straight for two blocks.", "Siga em frente por duas quadras."],
            ["corner", "esquina", "The shop is on the corner.", "A loja fica na esquina."]
          ],
          say: [["Go straight and turn right at the corner.", "Siga em frente e vire à direita na esquina."], ["Excuse me, how do I get to the station?", "Com licença, como chego à estação?"]],
          ex: [
            { q: "Imperativo correto:", o: ["You turn left.", "Turn left.", "To turn left."], a: 1, e: "Imperativo: verbo na forma base, sem sujeito." },
            { order: "Turn left at the corner", pt: "Vire à esquerda na esquina" }
          ],
          write: { p: "Explique como chegar da sua casa até a padaria mais próxima.", s: ["Go straight...", "Turn left at...", "It's on the corner of..."] }
        },
        {
          title: "Transporte",
          vocab: [
            ["subway", "metrô", "The subway is fast and cheap.", "O metrô é rápido e barato."],
            ["ticket", "bilhete, passagem", "How much is a ticket?", "Quanto custa uma passagem?"],
            ["walk", "ir a pé, caminhar", "I walk to work every day.", "Eu vou a pé ao trabalho todo dia."],
            ["take the bus", "pegar o ônibus", "Take the bus number 10.", "Pegue o ônibus número 10."]
          ],
          say: [["You can take the subway or walk.", "Você pode pegar o metrô ou ir a pé."], ["Where can I buy a ticket?", "Onde posso comprar uma passagem?"]],
          ex: [
            { q: "___ cross the street here. It's dangerous.", o: ["Don't", "Not", "No"], a: 0, e: "Imperativo negativo: Don't + verbo." },
            { q: "I go to work ___ bus.", o: ["in", "by", "on"], a: 1, e: "Meio de transporte: by bus, by car, by subway. Exceção: on foot." }
          ],
          write: { p: "Como você se locomove pela cidade? Conte em 3 frases.", s: ["I usually go by...", "I take the...", "Sometimes I walk to..."] }
        },
        {
          title: "Pedindo ajuda",
          vocab: [
            ["excuse me", "com licença", "Excuse me, where is the museum?", "Com licença, onde fica o museu?"],
            ["lost", "perdido", "I think I'm lost.", "Acho que estou perdido."],
            ["far", "longe", "Is it far from here?", "É longe daqui?"],
            ["map", "mapa", "Can you show me on the map?", "Pode me mostrar no mapa?"]
          ],
          say: [["Excuse me, I'm lost. Can you help me?", "Com licença, estou perdido. Pode me ajudar?"], ["It's about ten minutes on foot.", "Fica a uns dez minutos a pé."]],
          ex: [
            { q: "“É longe daqui?”", o: ["Is it far from here?", "Is far from here?", "It is far of here?"], a: 0, e: "O sujeito “it” é obrigatório em inglês." },
            { order: "How do I get to the museum?", pt: "Como chego ao museu?" }
          ],
          write: { p: "Escreva um diálogo: um turista perdido pede ajuda e você explica o caminho.", s: ["Excuse me, I'm lost...", "Sure! Go straight...", "It's about ... minutes."] }
        }
      ],
      immersion: [
        "Abra um mapa no celular em inglês e descreva em voz alta o caminho da sua casa até o trabalho.",
        "Escreva instruções para um turista chegar a um lugar famoso da sua cidade.",
        "Assista a um vídeo de “asking for directions in English” e faça shadowing dos diálogos."
      ]
    },

    /* ───────────────────────── SEMANA 6 ───────────────────────── */
    {
      n: 6, phase: 2, cefr: "A2",
      title: "O fim de semana passado", en: "What did you do?",
      goal: "Contar em ordem o que você fez no último fim de semana.",
      grammar: {
        title: "Past simple: ações terminadas",
        body: [
          "Use para ações terminadas no passado: I watched a movie yesterday.",
          "Regulares ganham -ed: work → worked, study → studied, stop → stopped.",
          "Irregulares precisam ser memorizados: go → went, have → had, see → saw, eat → ate, buy → bought.",
          "Negativa e pergunta usam did + verbo base: I didn't go. Did you see it? Nunca “didn't went”.",
          "To be no passado: was (I, he, she, it) e were (you, we, they)."
        ],
        examples: [["We went to the beach.", "Nós fomos à praia."], ["I didn't go out.", "Eu não saí."], ["Where were you?", "Onde você estava?"]]
      },
      days: [
        {
          title: "Ontem",
          vocab: [
            ["yesterday", "ontem", "I called my mom yesterday.", "Liguei para minha mãe ontem."],
            ["last weekend", "no fim de semana passado", "What did you do last weekend?", "O que você fez no fim de semana passado?"],
            ["ago", "atrás (tempo)", "I moved here two years ago.", "Eu me mudei para cá há dois anos."],
            ["watched", "assisti (watch)", "We watched a great movie.", "Nós assistimos a um filme ótimo."]
          ],
          say: [["Last weekend, I watched two movies at home.", "No fim de semana passado, assisti a dois filmes em casa."], ["What did you do yesterday?", "O que você fez ontem?"]],
          ex: [
            { q: "I ___ a movie last night.", o: ["watch", "watched", "watching"], a: 1, e: "Ação terminada no passado → watched." },
            { order: "I stayed home yesterday", pt: "Eu fiquei em casa ontem" }
          ],
          write: { p: "Escreva 3 coisas que você fez ontem.", s: ["Yesterday, I...", "I also...", "In the evening, I..."] }
        },
        {
          title: "Irregulares 1",
          vocab: [
            ["went", "fui, foi (go)", "We went to the beach on Saturday.", "Nós fomos à praia no sábado."],
            ["had", "tive, comi (have)", "I had a great time.", "Eu me diverti muito."],
            ["saw", "vi (see)", "She saw her friends at the party.", "Ela viu os amigos na festa."],
            ["ate", "comi (eat)", "They ate pizza for dinner.", "Eles comeram pizza no jantar."]
          ],
          say: [["On Saturday, we went to the beach and had lunch there.", "No sábado, fomos à praia e almoçamos lá."], ["I saw a really good concert.", "Eu vi um show muito bom."]],
          ex: [
            { q: "We ___ to the mall on Sunday.", o: ["goed", "went", "gone"], a: 1, e: "Go é irregular: went." },
            { q: "Did you ___ the game?", o: ["saw", "see", "seen"], a: 1, e: "Depois de “did” o verbo volta à forma base." }
          ],
          write: { p: "Conte um passeio recente usando went, had, saw e ate.", s: ["Last ..., I went to...", "I had...", "I saw..."] }
        },
        {
          title: "Was e were",
          vocab: [
            ["was", "era, estava (I, he, she, it)", "I was at home all day.", "Eu estava em casa o dia todo."],
            ["were", "eram, estavam (you, we, they)", "The tickets were expensive.", "Os ingressos estavam caros."],
            ["tired", "cansado", "I was very tired after work.", "Eu estava muito cansado depois do trabalho."],
            ["fun", "divertido", "The party was really fun.", "A festa foi muito divertida."]
          ],
          say: [["The weather was beautiful and the beach was full.", "O tempo estava lindo e a praia estava cheia."], ["Where were you last night?", "Onde você estava ontem à noite?"]],
          ex: [
            { q: "They ___ at the party.", o: ["was", "were", "did"], a: 1, e: "They usa “were”." },
            { q: "It ___ very cold yesterday.", o: ["was", "were", "is"], a: 0, e: "It no passado → was." }
          ],
          write: { p: "Como foi seu último fim de semana? Use was e were.", s: ["My weekend was...", "The weather was...", "My friends were..."] }
        },
        {
          title: "Irregulares 2",
          vocab: [
            ["bought", "comprei (buy)", "I bought new shoes.", "Eu comprei sapatos novos."],
            ["made", "fiz (make)", "She made a chocolate cake.", "Ela fez um bolo de chocolate."],
            ["met", "conheci, encontrei (meet)", "I met my best friend at school.", "Conheci meu melhor amigo na escola."],
            ["took", "peguei, tirei (take)", "We took a lot of photos.", "Nós tiramos muitas fotos."]
          ],
          say: [["I met an old friend and we took a lot of photos.", "Encontrei um velho amigo e tiramos muitas fotos."], ["My dad made lunch for everyone.", "Meu pai fez o almoço para todo mundo."]],
          ex: [
            { q: "I didn't ___ anything at the store.", o: ["bought", "buy", "buyed"], a: 1, e: "Com didn't, verbo na forma base: buy." },
            { order: "She made a cake for my birthday", pt: "Ela fez um bolo para o meu aniversário" }
          ],
          write: { p: "Conte a última vez que você comprou algo especial ou conheceu alguém novo.", s: ["Last month, I bought...", "I met...", "We took..."] }
        },
        {
          title: "Contando uma história",
          vocab: [
            ["first", "primeiro", "First, I had breakfast.", "Primeiro, tomei café da manhã."],
            ["then", "depois, então", "Then I went to the gym.", "Depois fui à academia."],
            ["after that", "depois disso", "After that, I met my friends.", "Depois disso, encontrei meus amigos."],
            ["finally", "por fim", "Finally, I went to bed at midnight.", "Por fim, fui dormir à meia-noite."]
          ],
          say: [["First we went to the park, then we had ice cream.", "Primeiro fomos ao parque, depois tomamos sorvete."], ["Did you have a good weekend? Yes, it was great!", "Você teve um bom fim de semana? Sim, foi ótimo!"]],
          ex: [
            { q: "___ you go out on Friday?", o: ["Do", "Did", "Were"], a: 1, e: "Pergunta no passado com verbo principal → Did." },
            { q: "Negativa correta:", o: ["I didn't went.", "I didn't go.", "I no went."], a: 1, e: "didn't + verbo base." }
          ],
          write: { p: "Conte seu último sábado em ordem, usando first, then, after that e finally.", s: ["First, I...", "Then...", "After that...", "Finally..."] }
        }
      ],
      immersion: [
        "Escreva um diário do seu fim de semana usando first, then, after that e finally.",
        "Grave em áudio uma história engraçada que aconteceu com você.",
        "Faça uma lista de 15 verbos irregulares e revise com os flashcards."
      ]
    },

    /* ───────────────────────── SEMANA 7 ───────────────────────── */
    {
      n: 7, phase: 2, cefr: "A2",
      title: "Planos e futuro", en: "What are your plans?",
      goal: "Falar dos seus planos para o próximo mês e para o próximo ano.",
      grammar: {
        title: "Futuro: going to, will e present continuous",
        body: [
          "Going to: planos e intenções já decididos — I'm going to study English every day.",
          "Will: decisões na hora, promessas e previsões — I'll help you. It will rain tomorrow.",
          "Present continuous: compromissos marcados — I'm meeting my boss on Monday.",
          "Contrações: I will → I'll. Will not → won't."
        ],
        examples: [["I'm going to travel in July.", "Eu vou viajar em julho."], ["I'll call you later.", "Eu te ligo mais tarde."], ["We're having dinner with Ana tonight.", "Vamos jantar com a Ana hoje à noite."]]
      },
      days: [
        {
          title: "Planos",
          vocab: [
            ["plan", "plano, planejar", "What are your plans for the weekend?", "Quais são seus planos para o fim de semana?"],
            ["next week", "semana que vem", "I'm going to travel next week.", "Vou viajar semana que vem."],
            ["tomorrow", "amanhã", "See you tomorrow!", "Até amanhã!"],
            ["tonight", "hoje à noite", "Are you free tonight?", "Você está livre hoje à noite?"]
          ],
          say: [["Tonight I'm going to cook dinner for my family.", "Hoje à noite vou fazer o jantar para minha família."], ["What are you going to do tomorrow?", "O que você vai fazer amanhã?"]],
          ex: [
            { q: "I'm ___ to visit my aunt.", o: ["go", "going", "gone"], a: 1, e: "Estrutura: am / is / are + going to + verbo." },
            { order: "We are going to travel in July", pt: "Nós vamos viajar em julho" }
          ],
          write: { p: "Quais são seus planos para esta semana?", s: ["Tomorrow, I'm going to...", "Next week, I'm going to...", "Tonight..."] }
        },
        {
          title: "Metas",
          vocab: [
            ["goal", "meta, objetivo", "My goal is to speak English fluently.", "Minha meta é falar inglês fluentemente."],
            ["learn", "aprender", "I want to learn how to swim.", "Quero aprender a nadar."],
            ["save money", "economizar dinheiro", "I'm going to save money for a trip.", "Vou economizar dinheiro para uma viagem."],
            ["improve", "melhorar", "I need to improve my pronunciation.", "Preciso melhorar minha pronúncia."]
          ],
          say: [["This year I'm going to improve my English.", "Este ano vou melhorar meu inglês."], ["My goal is to save money and travel abroad.", "Minha meta é economizar e viajar para o exterior."]],
          ex: [
            { q: "She ___ going to change jobs.", o: ["is", "are", "will"], a: 0, e: "She + is + going to." },
            { q: "“Eu vou aprender a dirigir” (plano decidido):", o: ["I'm going to learn to drive.", "I learn to drive.", "I going to learn to drive."], a: 0, e: "Plano decidido → am going to. Não esqueça o “am”." }
          ],
          write: { p: "Escreva 3 metas para os próximos 12 meses.", s: ["My goal is to...", "I'm going to...", "I want to improve..."] }
        },
        {
          title: "Will",
          vocab: [
            ["I'll", "eu vou (decisão na hora)", "It's cold. I'll close the window.", "Está frio. Vou fechar a janela."],
            ["won't", "não vai, não vou", "Don't worry, I won't forget.", "Não se preocupe, não vou esquecer."],
            ["probably", "provavelmente", "It will probably rain later.", "Provavelmente vai chover mais tarde."],
            ["promise", "prometer", "I promise I'll call you.", "Prometo que vou te ligar."]
          ],
          say: [["The phone is ringing. I'll answer it!", "O telefone está tocando. Eu atendo!"], ["I think it will be a great year.", "Acho que vai ser um ótimo ano."]],
          ex: [
            { q: "“Está escuro.” — “___ turn on the light.”", o: ["I'm going to", "I'll", "I"], a: 1, e: "Decisão tomada na hora → will." },
            { q: "Don't worry. I ___ tell anyone.", o: ["won't", "don't", "not will"], a: 0, e: "Promessa negativa → won't." }
          ],
          write: { p: "Faça 3 previsões sobre o seu futuro e 1 promessa para você mesmo.", s: ["I think I'll...", "I probably won't...", "I promise I'll..."] }
        },
        {
          title: "Agenda",
          vocab: [
            ["appointment", "consulta, horário marcado", "I have a doctor's appointment on Friday.", "Tenho consulta médica na sexta."],
            ["meeting", "reunião", "I'm having a meeting with my team at 3.", "Vou ter uma reunião com minha equipe às 3."],
            ["schedule", "agenda, horário", "My schedule is full this week.", "Minha agenda está cheia esta semana."],
            ["busy", "ocupado", "Sorry, I'm busy tomorrow.", "Desculpe, estou ocupado amanhã."]
          ],
          say: [["I'm meeting my manager on Monday morning.", "Vou me reunir com meu gerente segunda de manhã."], ["Are you busy on Thursday? Let's have lunch.", "Você está ocupado na quinta? Vamos almoçar."]],
          ex: [
            { q: "I ___ my dentist tomorrow at 10. It's booked.", o: ["see", "am seeing", "saw"], a: 1, e: "Compromisso marcado → present continuous." },
            { order: "I have a meeting at nine", pt: "Eu tenho uma reunião às nove" }
          ],
          write: { p: "Descreva sua agenda dos próximos 3 dias.", s: ["On Monday, I'm...", "On Tuesday, I have...", "I'm busy on..."] }
        },
        {
          title: "Convites",
          vocab: [
            ["maybe", "talvez", "Maybe I'll go to the party.", "Talvez eu vá à festa."],
            ["Let's...", "Vamos...", "Let's go to the movies tonight.", "Vamos ao cinema hoje à noite."],
            ["Would you like to...?", "Você gostaria de...?", "Would you like to come to my house?", "Você gostaria de vir à minha casa?"],
            ["sure", "claro", "Sure, I'd love to!", "Claro, adoraria!"]
          ],
          say: [["Would you like to have dinner with us on Saturday?", "Você gostaria de jantar com a gente no sábado?"], ["Sure! What time?", "Claro! Que horas?"]],
          ex: [
            { q: "___ go to the beach on Sunday!", o: ["Let's", "Let", "We let"], a: 0, e: "Sugestão: Let's + verbo." },
            { q: "Resposta educada a um convite:", o: ["Yes, I like.", "Sure, I'd love to!", "Yes, I want."], a: 1, e: "“I'd love to” é a resposta natural." }
          ],
          write: { p: "Escreva uma mensagem convidando um amigo para algo no fim de semana.", s: ["Hi! Would you like to...", "Let's...", "Maybe we can..."] }
        }
      ],
      immersion: [
        "Escreva seus planos para os próximos 6 meses usando going to.",
        "Envie 3 convites em inglês por mensagem para amigos, mesmo de brincadeira.",
        "Assista à previsão do tempo em inglês e anote as expressões com will."
      ]
    },

    /* ───────────────────────── SEMANA 8 ───────────────────────── */
    {
      n: 8, phase: 2, cefr: "A2",
      title: "Compras e comparações", en: "Which one is better?",
      goal: "Comparar dois produtos e concluir uma compra em inglês.",
      grammar: {
        title: "Comparativos e superlativos",
        body: [
          "Adjetivos curtos ganham -er e the -est: cheap → cheaper → the cheapest. big → bigger → the biggest. easy → easier → the easiest.",
          "Adjetivos longos usam more e the most: expensive → more expensive → the most expensive.",
          "Irregulares: good → better → the best. bad → worse → the worst.",
          "Use “than” para comparar: This phone is cheaper than that one."
        ],
        examples: [["This one is cheaper than that one.", "Este é mais barato que aquele."], ["It's the best pizza in town.", "É a melhor pizza da cidade."], ["This bag is more expensive.", "Esta bolsa é mais cara."]]
      },
      days: [
        {
          title: "Preços",
          vocab: [
            ["price", "preço", "The price is too high.", "O preço está alto demais."],
            ["cheap", "barato", "This shirt is really cheap.", "Esta camisa é muito barata."],
            ["expensive", "caro", "Restaurants here are expensive.", "Os restaurantes aqui são caros."],
            ["How much is it?", "Quanto custa?", "How much is this bag?", "Quanto custa esta bolsa?"]
          ],
          say: [["Excuse me, how much is this jacket?", "Com licença, quanto custa esta jaqueta?"], ["It's fifty dollars. It's on sale.", "Custa cinquenta dólares. Está em promoção."]],
          ex: [
            { q: "This shop is ___ than the mall.", o: ["cheap", "cheaper", "cheapest"], a: 1, e: "Comparando duas coisas → cheaper than." },
            { order: "How much are these shoes?", pt: "Quanto custam estes sapatos?" }
          ],
          write: { p: "Fale de algo caro e algo barato que você comprou recentemente.", s: ["I bought...", "It was cheap / expensive.", "It cost..."] }
        },
        {
          title: "Roupas",
          vocab: [
            ["shirt", "camisa", "I need a white shirt for work.", "Preciso de uma camisa branca para o trabalho."],
            ["pants", "calça", "These pants are too long.", "Esta calça está comprida demais."],
            ["shoes", "sapatos", "I bought new running shoes.", "Comprei tênis de corrida novos."],
            ["size", "tamanho", "What size do you wear?", "Que tamanho você usa?"]
          ],
          say: [["Do you have this shirt in a medium?", "Vocês têm esta camisa em tamanho médio?"], ["Can I try it on?", "Posso provar?"]],
          ex: [
            { q: "These shoes are ___ than my old ones.", o: ["more comfortable", "comfortabler", "most comfortable"], a: 0, e: "Adjetivo longo → more + adjetivo." },
            { q: "Where is the fitting room? I want to ___ this on.", o: ["try", "test", "prove"], a: 0, e: "“Try on” é provar roupa." }
          ],
          write: { p: "Descreva a roupa que você está usando agora.", s: ["Today I'm wearing...", "My shirt is...", "My shoes are..."] }
        },
        {
          title: "Comparando",
          vocab: [
            ["bigger", "maior", "My new apartment is bigger than the old one.", "Meu apartamento novo é maior que o antigo."],
            ["better", "melhor", "This coffee is better than that one.", "Este café é melhor que aquele."],
            ["worse", "pior", "The traffic is worse today.", "O trânsito está pior hoje."],
            ["than", "do que", "She is taller than her brother.", "Ela é mais alta que o irmão."]
          ],
          say: [["This phone is better, but it's more expensive.", "Este celular é melhor, mas é mais caro."], ["Is the blue one cheaper than the black one?", "O azul é mais barato que o preto?"]],
          ex: [
            { q: "My English is ___ now than last year.", o: ["gooder", "better", "more good"], a: 1, e: "Good é irregular: better." },
            { q: "Today is ___ than yesterday.", o: ["hoter", "hotter", "more hot"], a: 1, e: "Consoante-vogal-consoante dobra a última letra: hot → hotter." }
          ],
          write: { p: "Compare duas cidades que você conhece.", s: ["... is bigger than...", "... is more ... than...", "I think ... is better because..."] }
        },
        {
          title: "Superlativos",
          vocab: [
            ["the best", "o melhor", "This is the best pizza in town.", "Esta é a melhor pizza da cidade."],
            ["the cheapest", "o mais barato", "Which is the cheapest option?", "Qual é a opção mais barata?"],
            ["the most popular", "o mais popular", "It's the most popular store in the city.", "É a loja mais popular da cidade."],
            ["ever", "de todos os tempos", "This is the best day ever!", "Este é o melhor dia de todos!"]
          ],
          say: [["What's the cheapest way to get there?", "Qual é o jeito mais barato de chegar lá?"], ["This is the most beautiful place in the city.", "Este é o lugar mais bonito da cidade."]],
          ex: [
            { q: "It is ___ restaurant in the city.", o: ["the better", "the best", "the most good"], a: 1, e: "Superlativo de good → the best." },
            { order: "This is the most expensive car", pt: "Este é o carro mais caro" }
          ],
          write: { p: "Qual é o melhor restaurante, o lugar mais bonito e a pior rua da sua cidade?", s: ["The best restaurant is...", "The most beautiful place is...", "The worst..."] }
        },
        {
          title: "Pagamento",
          vocab: [
            ["pay", "pagar", "Can I pay by card?", "Posso pagar no cartão?"],
            ["credit card", "cartão de crédito", "Do you take credit cards?", "Vocês aceitam cartão de crédito?"],
            ["cash", "dinheiro em espécie", "I only have cash.", "Só tenho dinheiro."],
            ["receipt", "recibo, nota", "Can I have the receipt, please?", "Pode me dar o recibo, por favor?"]
          ],
          say: [["I'd like to pay by credit card, please.", "Gostaria de pagar no cartão de crédito, por favor."], ["Do you need a bag? No, thanks.", "Precisa de sacola? Não, obrigado."]],
          ex: [
            { q: "Can I pay ___ card?", o: ["by", "in", "on"], a: 0, e: "Pagamento com cartão: by card. Em dinheiro: in cash." },
            { q: "Which is ___ expensive: the red bag or the blue bag?", o: ["more", "most", "the more"], a: 0, e: "Comparando duas coisas → comparativo: more." }
          ],
          write: { p: "Escreva o diálogo inteiro de uma compra numa loja de roupas.", s: ["Hi, how much is...", "Can I try it on?", "I'll take it. Can I pay by..."] }
        }
      ],
      immersion: [
        "Visite uma loja online em inglês e compare 3 produtos por escrito usando than.",
        "Simule em voz alta a compra de uma roupa: tamanho, provador, preço e pagamento.",
        "Escreva 5 frases sobre “the best” e “the worst” da sua cidade."
      ]
    },

    /* ───────────────────────── SEMANA 9 ───────────────────────── */
    {
      n: 9, phase: 3, cefr: "B1",
      title: "Trabalho e experiências", en: "Have you ever...?",
      goal: "Falar da sua experiência profissional e de coisas que você já fez na vida.",
      grammar: {
        title: "Present perfect: have / has + particípio",
        body: [
          "Experiências de vida, sem dizer quando: I have been to Chile. Have you ever tried sushi?",
          "Ações que começaram no passado e continuam: I have worked here for three years. She has lived here since 2021.",
          "Already (já), yet (ainda, em negativas; já, em perguntas) e just (acabou de): I've just finished. Have you finished yet?",
          "Se houver tempo definido (yesterday, in 2020), use o past simple: I went to Chile in 2020."
        ],
        examples: [["I've never seen snow.", "Eu nunca vi neve."], ["She has worked here since 2019.", "Ela trabalha aqui desde 2019."], ["Have you finished yet?", "Você já terminou?"]]
      },
      days: [
        {
          title: "Experiências",
          vocab: [
            ["ever", "alguma vez, já", "Have you ever been to the United States?", "Você já foi aos Estados Unidos?"],
            ["never", "nunca", "I have never seen snow.", "Eu nunca vi neve."],
            ["been to", "já foi a, esteve em", "She has been to Japan twice.", "Ela já foi ao Japão duas vezes."],
            ["tried", "experimentou (try)", "I've tried Indian food. It's great.", "Já experimentei comida indiana. É ótima."]
          ],
          say: [["Have you ever been abroad?", "Você já foi para o exterior?"], ["No, I've never left Brazil.", "Não, eu nunca saí do Brasil."]],
          ex: [
            { q: "Have you ever ___ to Argentina?", o: ["go", "went", "been"], a: 2, e: "Para viagens, usamos “been to”." },
            { order: "I have never eaten sushi", pt: "Eu nunca comi sushi" }
          ],
          write: { p: "Escreva 3 coisas que você já fez e 2 que nunca fez.", s: ["I've been to...", "I've tried...", "I've never..."] }
        },
        {
          title: "For e since",
          vocab: [
            ["for", "há, por (duração)", "I've lived here for five years.", "Eu moro aqui há cinco anos."],
            ["since", "desde", "She has worked here since 2019.", "Ela trabalha aqui desde 2019."],
            ["how long", "há quanto tempo", "How long have you studied English?", "Há quanto tempo você estuda inglês?"],
            ["experience", "experiência", "I have a lot of experience in sales.", "Tenho muita experiência em vendas."]
          ],
          say: [["I've worked in marketing for six years.", "Trabalho com marketing há seis anos."], ["How long have you known her?", "Há quanto tempo você a conhece?"]],
          ex: [
            { q: "I've lived in this city ___ 2015.", o: ["for", "since", "ago"], a: 1, e: "Ponto de início → since." },
            { q: "We've been friends ___ ten years.", o: ["for", "since", "during"], a: 0, e: "Duração → for." }
          ],
          write: { p: "Há quanto tempo você mora onde mora, trabalha onde trabalha e conhece seu melhor amigo?", s: ["I've lived in ... for...", "I've worked at ... since...", "I've known ... for..."] }
        },
        {
          title: "Already, yet e just",
          vocab: [
            ["already", "já", "I've already sent the email.", "Eu já enviei o e-mail."],
            ["yet", "ainda (negativa), já (pergunta)", "I haven't finished the report yet.", "Ainda não terminei o relatório."],
            ["just", "acabou de", "She has just arrived.", "Ela acabou de chegar."],
            ["finish", "terminar", "Have you finished yet?", "Você já terminou?"]
          ],
          say: [["Have you had lunch yet? Yes, I've just eaten.", "Você já almoçou? Sim, acabei de comer."], ["I haven't decided yet.", "Ainda não decidi."]],
          ex: [
            { q: "I ___ called the client. He knows.", o: ["have already", "already have not", "yet have"], a: 0, e: "Afirmativa com “já” → have already." },
            { q: "They haven't arrived ___.", o: ["already", "yet", "just"], a: 1, e: "Negativa com “ainda” → yet, no fim da frase." }
          ],
          write: { p: "O que você já fez hoje e o que ainda não fez?", s: ["Today I've already...", "I've just...", "I haven't ... yet."] }
        },
        {
          title: "No trabalho",
          vocab: [
            ["manager", "gerente", "My manager is very supportive.", "Minha gerente me apoia muito."],
            ["team", "equipe", "I work with a great team.", "Trabalho com uma ótima equipe."],
            ["skills", "habilidades", "Communication is one of my best skills.", "Comunicação é uma das minhas melhores habilidades."],
            ["responsible for", "responsável por", "I'm responsible for customer service.", "Sou responsável pelo atendimento ao cliente."]
          ],
          say: [["I'm responsible for a team of five people.", "Sou responsável por uma equipe de cinco pessoas."], ["I've developed strong leadership skills.", "Desenvolvi fortes habilidades de liderança."]],
          ex: [
            { q: "She ___ worked here since March.", o: ["have", "has", "is"], a: 1, e: "She + has + particípio." },
            { order: "I am responsible for sales", pt: "Eu sou responsável por vendas" }
          ],
          write: { p: "Descreva seu trabalho atual ou o trabalho que você quer ter.", s: ["I work as...", "I'm responsible for...", "My best skills are..."] }
        },
        {
          title: "Entrevista de emprego",
          vocab: [
            ["interview", "entrevista", "I have a job interview tomorrow.", "Tenho uma entrevista de emprego amanhã."],
            ["hire", "contratar", "The company hired ten new people.", "A empresa contratou dez pessoas novas."],
            ["strength", "ponto forte", "My main strength is that I learn quickly.", "Meu principal ponto forte é que aprendo rápido."],
            ["achievement", "conquista", "My biggest achievement was leading a big project.", "Minha maior conquista foi liderar um grande projeto."]
          ],
          say: [["Tell me about yourself.", "Fale sobre você."], ["I've worked in this area for four years and I love what I do.", "Trabalho nesta área há quatro anos e amo o que faço."]],
          ex: [
            { q: "Escolha o tempo correto: “I ___ to Paris in 2019.”", o: ["have been", "went", "have gone"], a: 1, e: "Tempo definido (in 2019) → past simple." },
            { q: "___ you ever worked abroad?", o: ["Did", "Have", "Has"], a: 1, e: "Experiência de vida com ever → Have you ever...?" }
          ],
          write: { p: "Responda: “Tell me about yourself” como se fosse uma entrevista.", s: ["I'm a ... with ... years of experience.", "I've worked at...", "My main strength is..."] }
        }
      ],
      immersion: [
        "Escreva um mini-currículo em inglês com Summary, Experience e Skills.",
        "Responda em voz alta “Tell me about yourself” em 1 minuto e grave.",
        "Assista a um vídeo de entrevista de emprego em inglês e anote 5 perguntas comuns."
      ]
    },

    /* ───────────────────────── SEMANA 10 ───────────────────────── */
    {
      n: 10, phase: 3, cefr: "B1",
      title: "Viagens", en: "Ready for take-off",
      goal: "Resolver sozinho situações de viagem: aeroporto, hotel e imprevistos.",
      grammar: {
        title: "Verbos modais: can, could, should, must, have to",
        body: [
          "Can: poder, conseguir. Could: poderia, mais educado. Should: deveria (conselho). Must: precisa (regra ou obrigação forte). Have to: tem que (obrigação externa).",
          "Depois de um modal o verbo vem na forma base, sem “to”: You should rest. A exceção é have to.",
          "Modais não ganham -s: She can swim, nunca “she cans”.",
          "Negativas: can't, shouldn't, mustn't (é proibido) e don't have to (não é necessário)."
        ],
        examples: [["You should visit the museum.", "Você deveria visitar o museu."], ["Could you help me?", "Você poderia me ajudar?"], ["You don't have to pay.", "Você não precisa pagar."]]
      },
      days: [
        {
          title: "No aeroporto",
          vocab: [
            ["flight", "voo", "My flight leaves at 10 p.m.", "Meu voo sai às 10 da noite."],
            ["passport", "passaporte", "Don't forget your passport!", "Não esqueça seu passaporte!"],
            ["boarding pass", "cartão de embarque", "Here is your boarding pass.", "Aqui está seu cartão de embarque."],
            ["gate", "portão", "The flight is boarding at gate 12.", "O voo está embarcando no portão 12."]
          ],
          say: [["Can I see your passport, please?", "Posso ver seu passaporte, por favor?"], ["Excuse me, where is gate fifteen?", "Com licença, onde fica o portão quinze?"]],
          ex: [
            { q: "You ___ show your passport at immigration.", o: ["must", "should", "can"], a: 0, e: "Regra obrigatória → must." },
            { order: "Where is my boarding pass?", pt: "Onde está meu cartão de embarque?" }
          ],
          write: { p: "Descreva o que você faz no aeroporto, do check-in ao embarque.", s: ["First, I check in...", "Then I go through security.", "I wait at the gate..."] }
        },
        {
          title: "Bagagem",
          vocab: [
            ["luggage", "bagagem", "How much luggage can I take?", "Quanta bagagem posso levar?"],
            ["suitcase", "mala", "My suitcase is very heavy.", "Minha mala está muito pesada."],
            ["carry-on", "bagagem de mão", "I only have a carry-on.", "Só tenho bagagem de mão."],
            ["delayed", "atrasado", "Our flight was delayed by two hours.", "Nosso voo atrasou duas horas."]
          ],
          say: [["My suitcase didn't arrive. What should I do?", "Minha mala não chegou. O que devo fazer?"], ["You have to fill out this form.", "Você tem que preencher este formulário."]],
          ex: [
            { q: "She ___ speak three languages.", o: ["can", "cans", "can to"], a: 0, e: "Modais não ganham -s e não usam “to” depois." },
            { q: "You ___ pay for a carry-on. It's free.", o: ["mustn't", "don't have to", "can't"], a: 1, e: "Não é necessário → don't have to." }
          ],
          write: { p: "Seu voo atrasou e sua mala sumiu. Escreva o que você diz no balcão da companhia.", s: ["Excuse me, my flight was...", "My suitcase didn't...", "What should I do?"] }
        },
        {
          title: "No hotel",
          vocab: [
            ["reservation", "reserva", "I have a reservation under the name Silva.", "Tenho uma reserva no nome Silva."],
            ["check in", "fazer check-in", "What time can I check in?", "A que horas posso fazer o check-in?"],
            ["room", "quarto", "The room has a great view.", "O quarto tem uma vista ótima."],
            ["available", "disponível", "Do you have any rooms available?", "Vocês têm quartos disponíveis?"]
          ],
          say: [["Hi, I have a reservation for three nights.", "Oi, tenho uma reserva para três noites."], ["Could I have a room with a view?", "Poderia me dar um quarto com vista?"]],
          ex: [
            { q: "Pedido mais educado:", o: ["Give me a towel.", "Could I have a towel, please?", "I want towel."], a: 1, e: "Could deixa o pedido mais educado." },
            { order: "Could you help me with my bags?", pt: "Você poderia me ajudar com minhas malas?" }
          ],
          write: { p: "Escreva o diálogo do seu check-in em um hotel.", s: ["Hi, I have a reservation...", "Could I have...", "What time is breakfast?"] }
        },
        {
          title: "Conselhos",
          vocab: [
            ["should", "deveria", "You should visit the old town.", "Você deveria visitar o centro histórico."],
            ["recommend", "recomendar", "What do you recommend?", "O que você recomenda?"],
            ["worth it", "vale a pena", "The tour is expensive, but it's worth it.", "O passeio é caro, mas vale a pena."],
            ["tourist", "turista", "This area is full of tourists.", "Esta área está cheia de turistas."]
          ],
          say: [["You should try the local food. It's amazing.", "Você deveria provar a comida local. É incrível."], ["Is it worth visiting the museum?", "Vale a pena visitar o museu?"]],
          ex: [
            { q: "You look tired. You ___ go to bed early.", o: ["should", "must", "have"], a: 0, e: "Conselho → should." },
            { q: "You ___ smoke here. It's forbidden.", o: ["don't have to", "mustn't", "shouldn't to"], a: 1, e: "Proibição → mustn't." }
          ],
          write: { p: "Dê 4 conselhos para um estrangeiro que vai visitar o Brasil.", s: ["You should...", "You must...", "You don't have to...", "It's worth..."] }
        },
        {
          title: "Imprevistos",
          vocab: [
            ["problem", "problema", "We have a problem with the room.", "Temos um problema com o quarto."],
            ["help", "ajuda, ajudar", "Could you help me, please?", "Você poderia me ajudar, por favor?"],
            ["lose", "perder", "I lost my wallet.", "Perdi minha carteira."],
            ["emergency", "emergência", "In an emergency, call this number.", "Em caso de emergência, ligue para este número."]
          ],
          say: [["Excuse me, the air conditioning doesn't work.", "Com licença, o ar-condicionado não funciona."], ["I've lost my phone. Can you help me?", "Perdi meu celular. Pode me ajudar?"]],
          ex: [
            { q: "I ___ find my keys. Can you help me?", o: ["can't", "mustn't", "shouldn't"], a: 0, e: "Não conseguir → can't." },
            { order: "Could you call a taxi for me?", pt: "Você poderia chamar um táxi para mim?" }
          ],
          write: { p: "Conte um problema que já aconteceu com você numa viagem e como resolveu.", s: ["Once, I lost...", "I asked for help...", "Finally..."] }
        }
      ],
      immersion: [
        "Planeje em inglês uma viagem dos sonhos: destino, voo, hotel e 3 passeios.",
        "Assista a um vlog de viagem em inglês e faça 2 minutos de shadowing.",
        "Escreva 5 conselhos para um estrangeiro que vai visitar sua cidade, usando should e must."
      ]
    },

    /* ───────────────────────── SEMANA 11 ───────────────────────── */
    {
      n: 11, phase: 3, cefr: "B1",
      title: "Saúde, sentimentos e opiniões", en: "In my opinion...",
      goal: "Dar sua opinião sobre um tema e explicar consequências usando “if”.",
      grammar: {
        title: "First conditional e opiniões",
        body: [
          "First conditional fala de situações reais ou prováveis no futuro: If + present simple, will + verbo. If it rains, I'll stay home.",
          "A ordem pode inverter, e aí não precisa de vírgula: I'll stay home if it rains.",
          "Nunca use will logo depois de “if”: If I have time, nunca “If I will have time”.",
          "Para opinar: I think..., In my opinion..., I agree, I disagree, I'm not sure."
        ],
        examples: [["If you study, you'll pass.", "Se você estudar, vai passar."], ["I'll call you if I finish early.", "Te ligo se terminar cedo."], ["In my opinion, it's a good idea.", "Na minha opinião, é uma boa ideia."]]
      },
      days: [
        {
          title: "Saúde",
          vocab: [
            ["headache", "dor de cabeça", "I have a terrible headache.", "Estou com uma dor de cabeça terrível."],
            ["feel", "sentir-se", "I don't feel well today.", "Não estou me sentindo bem hoje."],
            ["sick", "doente", "She is sick, so she stayed home.", "Ela está doente, então ficou em casa."],
            ["medicine", "remédio", "Take this medicine twice a day.", "Tome este remédio duas vezes ao dia."]
          ],
          say: [["I don't feel well. I think I have a fever.", "Não estou bem. Acho que estou com febre."], ["If you feel sick, you should see a doctor.", "Se você se sentir mal, deveria ir ao médico."]],
          ex: [
            { q: "If you ___ this medicine, you will feel better.", o: ["take", "will take", "took"], a: 0, e: "Depois de if → present simple." },
            { order: "I have a headache", pt: "Estou com dor de cabeça" }
          ],
          write: { p: "Descreva a última vez que ficou doente: o que sentiu e o que fez.", s: ["Last time I was sick, I...", "I had a...", "I took..."] }
        },
        {
          title: "Sentimentos",
          vocab: [
            ["happy", "feliz", "I'm happy with my progress.", "Estou feliz com meu progresso."],
            ["worried", "preocupado", "She's worried about the exam.", "Ela está preocupada com a prova."],
            ["excited", "animado, empolgado", "I'm so excited about the trip!", "Estou muito animado com a viagem!"],
            ["stressed", "estressado", "I feel stressed at work.", "Eu me sinto estressado no trabalho."]
          ],
          say: [["I'm really excited about my new job.", "Estou muito animado com meu novo emprego."], ["Don't worry. Everything will be fine.", "Não se preocupe. Vai dar tudo certo."]],
          ex: [
            { q: "I'm ___ about the test tomorrow.", o: ["worried", "worry", "worrying"], a: 0, e: "Sentimento → adjetivo terminado em -ed: worried." },
            { q: "If I ___ the job, I will be very happy.", o: ["get", "will get", "got"], a: 0, e: "Depois de if → present simple." }
          ],
          write: { p: "Como você está se sentindo com o seu inglês agora? Por quê?", s: ["I feel...", "I'm excited about...", "I'm worried about..."] }
        },
        {
          title: "Condições",
          vocab: [
            ["if", "se", "If it rains, we'll stay home.", "Se chover, vamos ficar em casa."],
            ["unless", "a menos que", "I won't go unless you come with me.", "Não vou a menos que você venha comigo."],
            ["in case", "caso, por precaução", "Take an umbrella in case it rains.", "Leve um guarda-chuva caso chova."],
            ["otherwise", "senão, caso contrário", "Hurry up, otherwise we'll be late.", "Anda logo, senão vamos nos atrasar."]
          ],
          say: [["If I finish early, I'll call you.", "Se eu terminar cedo, te ligo."], ["We'll miss the bus if we don't hurry.", "Vamos perder o ônibus se não nos apressarmos."]],
          ex: [
            { q: "If she studies, she ___ the test.", o: ["passes", "will pass", "passed"], a: 1, e: "Resultado no futuro → will + verbo." },
            { order: "If it rains, we will stay home", pt: "Se chover, vamos ficar em casa" }
          ],
          write: { p: "Complete 3 frases sobre o seu futuro com “If...”.", s: ["If I keep studying, I'll...", "If I have time this weekend...", "If I travel next year..."] }
        },
        {
          title: "Opiniões",
          vocab: [
            ["I think", "eu acho", "I think English is easier than people say.", "Acho que o inglês é mais fácil do que dizem."],
            ["in my opinion", "na minha opinião", "In my opinion, this is the best option.", "Na minha opinião, esta é a melhor opção."],
            ["agree", "concordar", "I agree with you.", "Concordo com você."],
            ["disagree", "discordar", "Sorry, but I disagree.", "Desculpe, mas discordo."]
          ],
          say: [["In my opinion, working from home is great.", "Na minha opinião, trabalhar de casa é ótimo."], ["I see your point, but I don't agree.", "Entendo seu ponto, mas não concordo."]],
          ex: [
            { q: "Forma correta:", o: ["I am agree.", "I agree.", "I agreed with you now."], a: 1, e: "“Agree” é verbo: I agree, nunca “I am agree”." },
            { q: "“Eu acho que sim” em inglês:", o: ["I think yes.", "I think so.", "I think that yes."], a: 1, e: "A forma natural é “I think so”." }
          ],
          write: { p: "Dê sua opinião: redes sociais fazem mais bem ou mais mal?", s: ["In my opinion...", "I think...", "However..."] }
        },
        {
          title: "Hábitos saudáveis",
          vocab: [
            ["exercise", "exercício, exercitar-se", "I exercise three times a week.", "Eu me exercito três vezes por semana."],
            ["healthy", "saudável", "I try to eat healthy food.", "Tento comer comida saudável."],
            ["sleep", "dormir, sono", "I need more sleep.", "Preciso de mais sono."],
            ["habit", "hábito", "Reading is a good habit.", "Ler é um bom hábito."]
          ],
          say: [["If you sleep well, you'll have more energy.", "Se você dormir bem, terá mais energia."], ["I think exercise is the best medicine.", "Acho que exercício é o melhor remédio."]],
          ex: [
            { q: "If I ___ more, I will feel better.", o: ["exercise", "will exercise", "exercised"], a: 0, e: "Depois de if → present simple." },
            { order: "Sleep is important for your health", pt: "O sono é importante para sua saúde" }
          ],
          write: { p: "Quais hábitos saudáveis você tem e qual quer começar?", s: ["I usually...", "I want to start...", "If I ..., I'll feel..."] }
        }
      ],
      immersion: [
        "Escreva um texto de opinião (6 a 8 frases) sobre trabalho remoto usando I think e In my opinion.",
        "Grave um áudio de 1 minuto contando como você se sentiu nestas 11 semanas.",
        "Assista a uma palestra curta em inglês com legendas em inglês."
      ]
    },

    /* ───────────────────────── SEMANA 12 ───────────────────────── */
    {
      n: 12, phase: 3, cefr: "B1",
      title: "Conversação real", en: "Let's talk",
      goal: "Manter uma conversa de 5 minutos sobre você, sua rotina, seu passado e seus planos.",
      grammar: {
        title: "Phrasal verbs e conectores",
        body: [
          "Phrasal verb é verbo + partícula com sentido novo: give up (desistir), find out (descobrir), look for (procurar).",
          "Eles são muito comuns na fala do dia a dia. Aprenda cada um como um bloco, sempre com um exemplo.",
          "Conectores deixam a fala fluida: and, but, so (então, por isso), because (porque), although (embora), however (porém).",
          "Para ganhar tempo sem travar: Well..., Let me think..., Actually..."
        ],
        examples: [["Don't give up!", "Não desista!"], ["I was tired, so I went home.", "Eu estava cansado, então fui para casa."], ["Although it was late, we kept talking.", "Embora fosse tarde, continuamos conversando."]]
      },
      days: [
        {
          title: "Phrasal verbs 1",
          vocab: [
            ["give up", "desistir", "Don't give up! You're almost there.", "Não desista! Você está quase lá."],
            ["find out", "descobrir", "I found out the truth.", "Eu descobri a verdade."],
            ["look for", "procurar", "I'm looking for my keys.", "Estou procurando minhas chaves."],
            ["turn on", "ligar (aparelho)", "Can you turn on the lights?", "Pode ligar as luzes?"]
          ],
          say: [["I'm looking for a new job, but I won't give up.", "Estou procurando um emprego novo, mas não vou desistir."], ["Did you find out what happened?", "Você descobriu o que aconteceu?"]],
          ex: [
            { q: "Never ___ up on your dreams.", o: ["give", "take", "look"], a: 0, e: "Give up = desistir." },
            { order: "I am looking for my phone", pt: "Estou procurando meu celular" }
          ],
          write: { p: "Conte algo que você quase desistiu de fazer, mas não desistiu.", s: ["I almost gave up...", "But I didn't give up because...", "I found out that..."] }
        },
        {
          title: "Phrasal verbs 2",
          vocab: [
            ["pick up", "buscar, pegar", "Can you pick me up at the airport?", "Você pode me buscar no aeroporto?"],
            ["call back", "retornar a ligação", "I'll call you back later.", "Te ligo de volta mais tarde."],
            ["figure out", "entender, resolver", "I can't figure out this problem.", "Não consigo resolver este problema."],
            ["hang out", "sair, passar tempo junto", "We hang out every Friday.", "A gente sai junto toda sexta."]
          ],
          say: [["Can I call you back in ten minutes?", "Posso te ligar de volta em dez minutos?"], ["Let's hang out this weekend!", "Vamos sair neste fim de semana!"]],
          ex: [
            { q: "I'm busy now. Can I call you ___ later?", o: ["back", "up", "out"], a: 0, e: "Call back = retornar a ligação." },
            { q: "“Sair com os amigos” (informal):", o: ["hang out with friends", "hang on with friends", "go off with friends"], a: 0, e: "Hang out = sair, passar tempo junto." }
          ],
          write: { p: "Escreva uma mensagem combinando de sair com um amigo e buscá-lo em casa.", s: ["Hey! Do you want to hang out...", "I can pick you up at...", "Call me back when..."] }
        },
        {
          title: "Conectores",
          vocab: [
            ["because", "porque", "I study English because I want a better job.", "Estudo inglês porque quero um emprego melhor."],
            ["so", "então, por isso", "It was late, so I took a taxi.", "Estava tarde, então peguei um táxi."],
            ["although", "embora", "Although it was raining, we went out.", "Embora estivesse chovendo, saímos."],
            ["however", "porém, no entanto", "The plan is good. However, it's expensive.", "O plano é bom. Porém, é caro."]
          ],
          say: [["I was tired, so I went to bed early.", "Eu estava cansado, então fui dormir cedo."], ["Although English is hard, I'm making progress.", "Embora o inglês seja difícil, estou progredindo."]],
          ex: [
            { q: "I didn't go out ___ I was sick.", o: ["so", "because", "although"], a: 1, e: "Motivo → because." },
            { q: "It was cold, ___ I wore a jacket.", o: ["so", "because", "however"], a: 0, e: "Consequência → so." }
          ],
          write: { p: "Por que você está aprendendo inglês? Use because, so e although.", s: ["I'm learning English because...", "Although it's...", "so..."] }
        },
        {
          title: "Fluência natural",
          vocab: [
            ["Well...", "Bem...", "Well, it depends.", "Bem, depende."],
            ["actually", "na verdade", "Actually, I'm from Minas, not São Paulo.", "Na verdade, sou de Minas, não de São Paulo."],
            ["by the way", "a propósito", "By the way, did you call John?", "A propósito, você ligou para o John?"],
            ["I mean", "quer dizer", "It was good... I mean, really good!", "Foi bom... quer dizer, muito bom!"]
          ],
          say: [["Well, let me think... Actually, I prefer tea.", "Bem, deixa eu pensar... Na verdade, prefiro chá."], ["By the way, how was your trip?", "A propósito, como foi sua viagem?"]],
          ex: [
            { q: "“Actually” significa:", o: ["Atualmente", "Na verdade", "Exatamente"], a: 1, e: "Falso cognato! “Atualmente” em inglês é “currently” ou “nowadays”." },
            { order: "By the way, how was your weekend?", pt: "A propósito, como foi seu fim de semana?" }
          ],
          write: { p: "Escreva uma resposta para “What do you think about learning languages?” usando well, actually e I mean.", s: ["Well...", "Actually, I think...", "I mean..."] }
        },
        {
          title: "Conversa de verdade",
          vocab: [
            ["conversation", "conversa", "It was a great conversation.", "Foi uma ótima conversa."],
            ["topic", "assunto", "Let's change the topic.", "Vamos mudar de assunto."],
            ["Could you repeat that?", "Poderia repetir?", "Sorry, could you repeat that, please?", "Desculpe, poderia repetir, por favor?"],
            ["What do you mean?", "O que você quer dizer?", "What do you mean by that?", "O que você quer dizer com isso?"]
          ],
          say: [["Sorry, could you speak more slowly, please?", "Desculpe, poderia falar mais devagar, por favor?"], ["It was really nice talking to you!", "Foi muito bom conversar com você!"]],
          ex: [
            { q: "Se você não entendeu, diga:", o: ["What?", "Could you repeat that, please?", "Repeat!"], a: 1, e: "É a forma educada de pedir repetição." },
            { q: "I like my job. ___, I want to change careers.", o: ["However", "Because", "So"], a: 0, e: "Ideia contrária → however." }
          ],
          write: { p: "Escreva 5 perguntas que você faria para conhecer alguém numa conversa.", s: ["Where are you from?", "What do you do?", "Have you ever...?"] }
        }
      ],
      immersion: [
        "Tenha uma conversa de 5 minutos em inglês (com um amigo, professor, app de conversa ou IA) usando o que aprendeu.",
        "Grave de novo o áudio de apresentação da Semana 1 e compare a evolução.",
        "Escreva uma carta para você mesmo: o que aprendeu e o que vai fazer nas próximas 12 semanas."
      ]
    }
  ]
};
