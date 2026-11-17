/*
 * Situações do cotidiano: conversas completas para ouvir e ensaiar.
 * Falas: ["v", inglês, português] é você; ["o", inglês, português] é a outra pessoa.
 * "extra": outras frases úteis na mesma situação.
 */
window.ETAPAS = window.ETAPAS || [];
window.ETAPAS.push(
  {
    id: "balada", part: "situacoes", kind: "dialog", name: "Na balada", icon: "music", who: "A pessoa",
    desc: "Você vê alguém interessante perto do bar e puxa conversa.",
    lines: [
      ["v", "Hi! Is anyone sitting here?", "Oi! Tem alguém sentado aqui?"],
      ["o", "No, go ahead.", "Não, pode sentar."],
      ["v", "Thanks. I'm Lucas, by the way.", "Valeu. Aliás, eu sou o Lucas."],
      ["o", "Nice to meet you, Lucas. I'm Emma.", "Prazer, Lucas. Eu sou a Emma."],
      ["v", "Nice to meet you too. Are you here with friends?", "O prazer é meu. Você está aqui com amigos?"],
      ["o", "Yes, they're dancing over there. What about you?", "Sim, eles estão dançando ali. E você?"],
      ["v", "I came with my cousin. I love this song!", "Vim com o meu primo. Amo essa música!"],
      ["o", "Me too! The DJ is really good tonight.", "Eu também! O DJ está muito bom hoje."],
      ["v", "Can I buy you a drink?", "Posso te pagar uma bebida?"],
      ["o", "Sure, a gin and tonic, please.", "Claro, um gim-tônica, por favor."],
      ["v", "Do you want to dance later?", "Quer dançar depois?"],
      ["o", "Maybe! Let's see.", "Talvez! Vamos ver."],
      ["v", "Cool. Can I have your Instagram?", "Legal. Me passa o seu Instagram?"],
      ["o", "Sure, here it is.", "Claro, aqui está."]
    ],
    extra: [
      ["Do you come here often?", "Você vem sempre aqui?"],
      ["You have a great smile.", "Você tem um sorriso lindo."],
      ["Do you want to get some air?", "Quer tomar um ar?"],
      ["It was really nice talking to you.", "Foi muito bom conversar com você."],
      ["No worries. Have a good night!", "Tranquilo. Boa noite para você!"]
    ]
  },
  {
    id: "academia", part: "situacoes", kind: "dialog", name: "Na academia", icon: "dumbbell", who: "Outro aluno",
    desc: "Você quer usar um aparelho que outra pessoa está usando.",
    lines: [
      ["v", "Excuse me, are you using this machine?", "Com licença, você está usando este aparelho?"],
      ["o", "Yes, I have two more sets.", "Sim, tenho mais duas séries."],
      ["v", "No problem. Can I work in with you?", "Sem problema. Posso revezar com você?"],
      ["o", "Sure, go ahead.", "Claro, pode ir."],
      ["v", "Thanks. How much weight are you lifting?", "Valeu. Quanto peso você está levantando?"],
      ["o", "Sixty kilos. Do you want me to change it?", "Sessenta quilos. Quer que eu mude?"],
      ["v", "Yes, please. I'll do forty.", "Sim, por favor. Vou fazer quarenta."],
      ["o", "Do you come here every day?", "Você vem aqui todo dia?"],
      ["v", "Almost. I usually train after work.", "Quase. Eu geralmente treino depois do trabalho."],
      ["o", "Nice. Do you need a spot?", "Legal. Quer que eu te ajude na série?"],
      ["v", "Yes, thanks! Just in case.", "Quero, valeu! Só por garantia."],
      ["o", "You got this!", "Você consegue!"]
    ],
    extra: [
      ["Is this bench free?", "Este banco está livre?"],
      ["Where are the dumbbells?", "Onde ficam os halteres?"],
      ["How many reps do you do?", "Quantas repetições você faz?"],
      ["I'm sore from yesterday.", "Estou dolorido de ontem."],
      ["Do you mind if I use this?", "Você se importa se eu usar isto?"]
    ]
  },
  {
    id: "restaurante", part: "situacoes", kind: "dialog", name: "No restaurante", icon: "fork", who: "Garçom",
    desc: "Você chega para jantar, pede e paga a conta.",
    lines: [
      ["o", "Good evening! How many people?", "Boa noite! Quantas pessoas?"],
      ["v", "A table for two, please.", "Uma mesa para dois, por favor."],
      ["o", "Right this way. Here's the menu.", "Por aqui. Aqui está o cardápio."],
      ["v", "Thank you. Can we have some water first?", "Obrigado. Pode trazer uma água primeiro?"],
      ["o", "Sure. Sparkling or still?", "Claro. Com gás ou sem gás?"],
      ["v", "Still, please.", "Sem gás, por favor."],
      ["o", "Are you ready to order?", "Vocês estão prontos para pedir?"],
      ["v", "What do you recommend?", "O que você recomenda?"],
      ["o", "The grilled salmon is very popular.", "O salmão grelhado é muito pedido."],
      ["v", "I'll have the salmon with salad.", "Vou querer o salmão com salada."],
      ["o", "Anything to drink?", "Algo para beber?"],
      ["v", "A glass of white wine, please.", "Uma taça de vinho branco, por favor."],
      ["o", "How was everything?", "Estava tudo bem?"],
      ["v", "It was delicious. Can we have the check, please?", "Estava delicioso. Pode trazer a conta, por favor?"]
    ],
    extra: [
      ["Can I see the dessert menu?", "Posso ver o cardápio de sobremesas?"],
      ["Could we get some more bread?", "Pode trazer mais pão?"],
      ["This isn't what I ordered.", "Isto não é o que eu pedi."],
      ["Can I get this to go?", "Pode embalar para viagem?"],
      ["Is service included?", "O serviço está incluído?"]
    ]
  },
  {
    id: "cafeteria", part: "situacoes", kind: "dialog", name: "Na cafeteria", icon: "coffee", who: "Atendente",
    desc: "Você pede um café e um lanche para viagem.",
    lines: [
      ["o", "Hi! What can I get for you?", "Oi! O que vai ser?"],
      ["v", "Can I get a large latte, please?", "Pode me ver um latte grande, por favor?"],
      ["o", "Sure. Hot or iced?", "Claro. Quente ou gelado?"],
      ["v", "Iced, please. With oat milk.", "Gelado, por favor. Com leite de aveia."],
      ["o", "Anything else?", "Mais alguma coisa?"],
      ["v", "Yes, a cheese croissant.", "Sim, um croissant de queijo."],
      ["o", "For here or to go?", "Para comer aqui ou para viagem?"],
      ["v", "To go, please.", "Para viagem, por favor."],
      ["o", "Can I have your name?", "Qual é o seu nome?"],
      ["v", "It's Ana. A, N, A.", "É Ana. A, N, A."],
      ["o", "That's twelve fifty.", "Dá doze e cinquenta."],
      ["v", "Here you go. Keep the change.", "Aqui está. Pode ficar com o troco."]
    ],
    extra: [
      ["Do you have decaf?", "Vocês têm descafeinado?"],
      ["Less sugar, please.", "Menos açúcar, por favor."],
      ["What's the Wi-Fi password?", "Qual é a senha do Wi-Fi?"],
      ["Can I have a receipt?", "Pode me dar o recibo?"]
    ]
  },
  {
    id: "checkin", part: "situacoes", kind: "dialog", name: "No check-in do aeroporto", icon: "plane", who: "Atendente da companhia aérea",
    desc: "Você despacha a mala e pega o cartão de embarque.",
    lines: [
      ["o", "Good morning. Where are you flying to today?", "Bom dia. Para onde você vai hoje?"],
      ["v", "To New York.", "Para Nova York."],
      ["o", "Can I see your passport, please?", "Posso ver seu passaporte, por favor?"],
      ["v", "Here it is.", "Aqui está."],
      ["o", "Are you checking any bags?", "Vai despachar alguma mala?"],
      ["v", "Yes, one suitcase.", "Sim, uma mala."],
      ["o", "Please put it on the scale.", "Por favor, coloque na balança."],
      ["v", "Can I have a window seat?", "Pode me dar um assento na janela?"],
      ["o", "Sure. Here's your boarding pass. Gate fourteen, boarding at nine forty.", "Claro. Aqui está seu cartão de embarque. Portão catorze, embarque às nove e quarenta."],
      ["v", "Is the flight on time?", "O voo está no horário?"],
      ["o", "Yes, it's on time. Have a nice flight!", "Sim, está no horário. Boa viagem!"],
      ["v", "Thank you!", "Obrigado!"]
    ],
    extra: [
      ["Is this the line for check-in?", "Esta é a fila do check-in?"],
      ["My bag is overweight. How much is the fee?", "Minha mala está acima do peso. Quanto é a taxa?"],
      ["Can I take this as a carry-on?", "Posso levar isto como bagagem de mão?"],
      ["Where is security?", "Onde fica o raio-x?"]
    ]
  },
  {
    id: "imigracao", part: "situacoes", kind: "dialog", name: "Na imigração", icon: "passport", who: "Agente de imigração",
    desc: "As perguntas que o agente faz quando você chega a outro país.",
    lines: [
      ["o", "Good afternoon. Passport, please.", "Boa tarde. Passaporte, por favor."],
      ["v", "Here you are.", "Aqui está."],
      ["o", "What's the purpose of your visit?", "Qual é o motivo da sua visita?"],
      ["v", "I'm here on vacation.", "Estou aqui de férias."],
      ["o", "How long are you staying?", "Quanto tempo você vai ficar?"],
      ["v", "Ten days.", "Dez dias."],
      ["o", "Where are you staying?", "Onde você vai ficar hospedado?"],
      ["v", "At a hotel in Manhattan.", "Num hotel em Manhattan."],
      ["o", "Do you have a return ticket?", "Você tem passagem de volta?"],
      ["v", "Yes, I'm going back on the twentieth.", "Sim, eu volto no dia vinte."],
      ["o", "What do you do in Brazil?", "O que você faz no Brasil?"],
      ["v", "I work in marketing.", "Eu trabalho com marketing."],
      ["o", "Okay. Enjoy your stay.", "Certo. Aproveite a estadia."]
    ],
    extra: [
      ["I'm here for a conference.", "Estou aqui para uma conferência."],
      ["I'm visiting a friend.", "Estou visitando um amigo."],
      ["This is my first time here.", "É a minha primeira vez aqui."]
    ]
  },
  {
    id: "hospedagem", part: "situacoes", kind: "dialog", name: "Chegando no hotel", icon: "bed", who: "Recepcionista",
    desc: "Você faz o check-in e tira as dúvidas na recepção.",
    lines: [
      ["v", "Hi, I have a reservation under the name Costa.", "Oi, tenho uma reserva no nome de Costa."],
      ["o", "Welcome! Can I see your ID, please?", "Bem-vindo! Posso ver seu documento, por favor?"],
      ["v", "Sure, here's my passport.", "Claro, aqui está o meu passaporte."],
      ["o", "You're staying three nights, right?", "Você vai ficar três noites, certo?"],
      ["v", "That's right.", "Isso mesmo."],
      ["o", "Your room is five twelve, on the fifth floor.", "Seu quarto é o 512, no quinto andar."],
      ["v", "Is breakfast included?", "O café da manhã está incluído?"],
      ["o", "Yes, from seven to ten, in the restaurant.", "Sim, das sete às dez, no restaurante."],
      ["v", "What's the Wi-Fi password?", "Qual é a senha do Wi-Fi?"],
      ["o", "It's on the card with your key.", "Está no cartão junto com a sua chave."],
      ["v", "Great. What time is check-out?", "Ótimo. Que horas é o check-out?"],
      ["o", "At noon. Enjoy your stay!", "Ao meio-dia. Aproveite a estadia!"]
    ],
    extra: [
      ["Could I get a room with a view?", "Posso ficar num quarto com vista?"],
      ["Can you keep my luggage after check-out?", "Vocês podem guardar a minha bagagem depois do check-out?"],
      ["The room is too noisy. Can I change?", "O quarto está barulhento demais. Posso trocar?"]
    ]
  },
  {
    id: "uber", part: "situacoes", kind: "dialog", name: "No Uber", icon: "car", who: "Motorista",
    desc: "Do embarque no carro até descer no destino.",
    lines: [
      ["o", "Hi, are you Daniel?", "Oi, você é o Daniel?"],
      ["v", "Yes, that's me. Hi!", "Sim, sou eu. Oi!"],
      ["o", "Going to the airport, right?", "Indo para o aeroporto, certo?"],
      ["v", "Yes. Terminal two, please.", "Isso. Terminal dois, por favor."],
      ["o", "Do you want me to put your bag in the trunk?", "Quer que eu coloque sua mala no porta-malas?"],
      ["v", "Yes, please. Thank you.", "Sim, por favor. Obrigado."],
      ["o", "Is the temperature okay?", "A temperatura está boa?"],
      ["v", "Could you turn the AC down a little?", "Você pode diminuir um pouco o ar?"],
      ["o", "Sure. Traffic is heavy today.", "Claro. O trânsito está pesado hoje."],
      ["v", "How long will it take?", "Quanto tempo vai levar?"],
      ["o", "About thirty minutes.", "Uns trinta minutos."],
      ["v", "Okay. You can drop me off here. Thanks!", "Certo. Pode me deixar aqui. Obrigado!"]
    ],
    extra: [
      ["Can you wait for me for five minutes?", "Você pode me esperar cinco minutos?"],
      ["I think we're going the wrong way.", "Acho que estamos indo pelo caminho errado."],
      ["Can I charge my phone?", "Posso carregar o meu celular?"]
    ]
  },
  {
    id: "loja", part: "situacoes", kind: "dialog", name: "Na loja de roupas", icon: "shirt", who: "Vendedora",
    desc: "Você pede um tamanho, experimenta e paga.",
    lines: [
      ["o", "Hi! Can I help you?", "Oi! Posso ajudar?"],
      ["v", "I'm just looking, thanks.", "Só estou olhando, obrigado."],
      ["o", "Let me know if you need anything.", "Me avise se precisar de algo."],
      ["v", "Actually, do you have this shirt in medium?", "Na verdade, vocês têm esta camisa no M?"],
      ["o", "Let me check. Yes, here it is.", "Deixa eu ver. Sim, aqui está."],
      ["v", "Can I try it on?", "Posso experimentar?"],
      ["o", "Sure, the fitting rooms are over there.", "Claro, os provadores ficam ali."],
      ["v", "It fits well. How much is it?", "Serviu bem. Quanto custa?"],
      ["o", "It's forty dollars, but it's twenty percent off today.", "Custa quarenta dólares, mas hoje está com vinte por cento de desconto."],
      ["v", "Great, I'll take it.", "Ótimo, vou levar."],
      ["o", "Cash or card?", "Dinheiro ou cartão?"],
      ["v", "Card, please.", "Cartão, por favor."]
    ],
    extra: [
      ["Do you have it in another color?", "Vocês têm em outra cor?"],
      ["Can I exchange it if it doesn't fit?", "Posso trocar se não servir?"],
      ["Is this on sale?", "Isto está em promoção?"]
    ]
  },
  {
    id: "farmacia", part: "situacoes", kind: "dialog", name: "Na farmácia", icon: "pill", who: "Farmacêutico",
    desc: "Você explica o que sente e pede um remédio.",
    lines: [
      ["v", "Hi, I need something for a headache.", "Oi, preciso de algo para dor de cabeça."],
      ["o", "Sure. Do you have any allergies?", "Claro. Você tem alguma alergia?"],
      ["v", "No, I don't.", "Não, não tenho."],
      ["o", "You can take this. One pill every eight hours.", "Você pode tomar este. Um comprimido a cada oito horas."],
      ["v", "Can I take it on an empty stomach?", "Posso tomar em jejum?"],
      ["o", "It's better to take it after a meal.", "É melhor tomar depois de uma refeição."],
      ["v", "Okay. I also have a sore throat.", "Certo. Também estou com dor de garganta."],
      ["o", "These lozenges will help.", "Estas pastilhas vão ajudar."],
      ["v", "Do I need a prescription?", "Preciso de receita?"],
      ["o", "No, you don't. Anything else?", "Não precisa. Mais alguma coisa?"],
      ["v", "No, that's all. Thanks.", "Não, é só isso. Obrigado."]
    ],
    extra: [
      ["I feel dizzy.", "Estou tonto."],
      ["I have a stomachache.", "Estou com dor de estômago."],
      ["Is there a doctor nearby?", "Tem um médico aqui perto?"]
    ]
  },
  {
    id: "encontro", part: "situacoes", kind: "dialog", name: "Primeiro encontro", icon: "heart", who: "Seu date",
    desc: "A conversa do primeiro encontro, do oi até combinar o próximo.",
    lines: [
      ["v", "Hey! You look great.", "Oi! Você está ótima."],
      ["o", "Thanks! You too. Have you been here before?", "Obrigada! Você também. Você já veio aqui antes?"],
      ["v", "No, it's my first time. A friend recommended it.", "Não, é a primeira vez. Um amigo recomendou."],
      ["o", "So, tell me about yourself.", "Então, me fala de você."],
      ["v", "Well, I'm from Brazil and I work in sales.", "Bom, eu sou do Brasil e trabalho com vendas."],
      ["o", "Cool! What do you like to do for fun?", "Legal! O que você gosta de fazer para se divertir?"],
      ["v", "I love traveling and trying new food. What about you?", "Eu amo viajar e experimentar comidas novas. E você?"],
      ["o", "I'm into music. I play the guitar.", "Eu curto música. Toco violão."],
      ["v", "No way! I'd love to hear you play sometime.", "Sério? Adoraria te ouvir tocar qualquer dia."],
      ["o", "Maybe on our second date.", "Quem sabe no nosso segundo encontro."],
      ["v", "So there will be a second date?", "Então vai ter um segundo encontro?"],
      ["o", "We'll see!", "Vamos ver!"]
    ],
    extra: [
      ["I had a really good time tonight.", "Eu me diverti muito hoje."],
      ["Can I walk you home?", "Posso te acompanhar até em casa?"],
      ["Let's do this again soon.", "Vamos repetir logo."]
    ]
  },
  {
    id: "direcoes", part: "situacoes", kind: "dialog", name: "Pedindo direções", icon: "map", who: "Pessoa na rua",
    desc: "Você está perdido e pede ajuda para chegar a um lugar.",
    lines: [
      ["v", "Excuse me, could you help me?", "Com licença, você pode me ajudar?"],
      ["o", "Sure. What do you need?", "Claro. Do que você precisa?"],
      ["v", "How do I get to Central Park?", "Como eu chego ao Central Park?"],
      ["o", "Go straight ahead for three blocks. Then turn left at the traffic light.", "Siga reto por três quadras. Depois vire à esquerda no semáforo."],
      ["v", "Is it far from here?", "É longe daqui?"],
      ["o", "Not really. About ten minutes on foot.", "Não muito. Uns dez minutos a pé."],
      ["v", "Can I take the subway?", "Dá para pegar o metrô?"],
      ["o", "You can, but walking is faster.", "Dá, mas a pé é mais rápido."],
      ["v", "Great. Thank you so much!", "Ótimo. Muito obrigado!"],
      ["o", "You're welcome. Enjoy!", "De nada. Aproveite!"]
    ],
    extra: [
      ["Could you show me on the map?", "Você pode me mostrar no mapa?"],
      ["Is there a bus stop near here?", "Tem um ponto de ônibus aqui perto?"],
      ["Sorry, could you say that again?", "Desculpa, pode repetir?"]
    ]
  },
  {
    id: "reuniao", part: "situacoes", kind: "dialog", name: "Reunião de trabalho", icon: "briefcase", who: "Colega",
    desc: "Você dá a atualização do projeto numa reunião on-line.",
    lines: [
      ["o", "Good morning, everyone. Can you all hear me?", "Bom dia a todos. Todo mundo me ouve?"],
      ["v", "Yes, loud and clear.", "Sim, alto e claro."],
      ["o", "Great. Let's start. What's the update on the project?", "Ótimo. Vamos começar. Qual é a novidade do projeto?"],
      ["v", "We finished the first phase last week.", "Terminamos a primeira fase na semana passada."],
      ["o", "That's good news. Any problems?", "Boa notícia. Algum problema?"],
      ["v", "We need more time for testing.", "Precisamos de mais tempo para os testes."],
      ["o", "How much more time?", "Quanto tempo a mais?"],
      ["v", "About two weeks. Is that okay?", "Umas duas semanas. Tudo bem?"],
      ["o", "I think so. Can you send me a new timeline?", "Acho que sim. Pode me mandar um novo cronograma?"],
      ["v", "Sure, I'll send it by the end of the day.", "Claro, mando até o fim do dia."],
      ["o", "Perfect. Anything else?", "Perfeito. Mais alguma coisa?"],
      ["v", "No, that's all from me. Thanks!", "Não, da minha parte é só. Obrigado!"]
    ],
    extra: [
      ["Sorry, I was on mute.", "Desculpa, eu estava no mudo."],
      ["Can you share your screen?", "Você pode compartilhar a tela?"],
      ["Let's follow up by email.", "Vamos seguir por e-mail."]
    ]
  },
  {
    id: "pitch", part: "situacoes", kind: "dialog", name: "Pitch para um investidor", icon: "rocket", who: "Investidora",
    desc: "Você apresenta a sua startup em poucos minutos.",
    lines: [
      ["o", "So, tell me about your company.", "Então, me fale da sua empresa."],
      ["v", "We help small restaurants sell more online.", "Nós ajudamos pequenos restaurantes a vender mais pela internet."],
      ["o", "Interesting. What problem are you solving?", "Interessante. Que problema vocês resolvem?"],
      ["v", "Delivery apps charge high fees. We charge a flat monthly price.", "Os apps de entrega cobram taxas altas. Nós cobramos um preço fixo por mês."],
      ["o", "How many customers do you have?", "Quantos clientes vocês têm?"],
      ["v", "Three hundred restaurants, and we're growing fifteen percent a month.", "Trezentos restaurantes, e estamos crescendo quinze por cento ao mês."],
      ["o", "What's your revenue?", "Qual é o faturamento?"],
      ["v", "Forty thousand dollars a month.", "Quarenta mil dólares por mês."],
      ["o", "And how much are you raising?", "E quanto vocês estão captando?"],
      ["v", "One million dollars, to expand to three new cities.", "Um milhão de dólares, para expandir para três novas cidades."],
      ["o", "Can you send me your deck?", "Pode me mandar a sua apresentação?"],
      ["v", "Of course. I'll send it today.", "Claro. Mando hoje."]
    ],
    extra: [
      ["Our main competitor is ten times more expensive.", "Nosso principal concorrente é dez vezes mais caro."],
      ["We're profitable in two cities.", "Já damos lucro em duas cidades."],
      ["What do you look for in a startup?", "O que você procura numa startup?"]
    ]
  },
  {
    id: "entrevista", part: "situacoes", kind: "dialog", name: "Entrevista de emprego", icon: "person", who: "Recrutadora",
    desc: "As perguntas mais comuns de uma entrevista e boas respostas.",
    lines: [
      ["o", "Thanks for coming. Can you tell me a little about yourself?", "Obrigada por vir. Pode me contar um pouco sobre você?"],
      ["v", "Sure. I have five years of experience in sales.", "Claro. Tenho cinco anos de experiência em vendas."],
      ["o", "Why do you want to work here?", "Por que você quer trabalhar aqui?"],
      ["v", "I like your products and I want to grow with the company.", "Gosto dos seus produtos e quero crescer com a empresa."],
      ["o", "What are your strengths?", "Quais são os seus pontos fortes?"],
      ["v", "I'm organized and I work well in a team.", "Sou organizado e trabalho bem em equipe."],
      ["o", "And a weakness?", "E um ponto fraco?"],
      ["v", "Sometimes I take on too many tasks.", "Às vezes eu pego tarefas demais."],
      ["o", "Do you have any questions for us?", "Você tem alguma pergunta para nós?"],
      ["v", "Yes. What does a typical day look like?", "Sim. Como é um dia normal de trabalho?"],
      ["o", "Great question. We'll get back to you next week.", "Ótima pergunta. Daremos um retorno na semana que vem."],
      ["v", "Thank you for your time.", "Obrigado pelo seu tempo."]
    ],
    extra: [
      ["I'm a fast learner.", "Eu aprendo rápido."],
      ["I'm looking for new challenges.", "Estou buscando novos desafios."],
      ["When can I expect an answer?", "Quando posso esperar uma resposta?"]
    ]
  }
);
