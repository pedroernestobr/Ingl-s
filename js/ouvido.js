/*
 * Treino de ouvido: o inglês do jeito que o americano fala de verdade.
 *
 * Cada etapa treina um fenômeno da fala (o you que vira "iâ", o T que vira R, gonna, "what does it"…).
 * Cada frase: [inglês escrito, o que significa, como se fala (forma reduzida), como soa para o brasileiro
 * escrever, por que soa assim].
 * Pronúncia escrita: â = "a" fraco · h = sopro, como o r de "rato" · r entre vogais = r de "caro" ·
 * d em dâ, dét, dis = TH com a língua entre os dentes · o acento marca a sílaba forte.
 *
 * Os blocos prontos (js/blocos.js) também viram etapas de escuta.
 */
window.ETAPA_PARTS.unshift({ key: "ouvido", name: "Treino de ouvido", desc: "Cada etapa treina um jeito de o americano juntar e engolir os sons. Ouça, escreva como ouviu e descubra o que é." });

window.ETAPAS = window.ETAPAS || [];
window.ETAPAS.forEach((e) => { if (e.part === "blocos" && e.kind === "phrases") e.kind = "listen"; });

window.ETAPAS.push(
  {
    id: "ou-you", part: "ouvido", kind: "listen", name: "O you que vira “iâ”", icon: "headphones",
    desc: "You quase nunca soa “iú”. Na fala rápida ele vira iâ, e o are some.",
    phrases: [
      ["How are you doing?", "Como você está?", "How ya doin'?", "háu iâ dúin?", "O are quase some, o you vira iâ e o -ing vira -in."],
      ["See you tomorrow.", "Até amanhã.", "See ya tomorrow.", "sí iâ tâmárôu", "You vira iâ e o to de tomorrow fica fraco: tâ."],
      ["Thank you so much.", "Muito obrigado.", "Thank ya so much.", "thénkiâ sôu mâtch", "Thank e you colam numa palavra só: thénkiâ."],
      ["Where are you going?", "Aonde você vai?", "Where ya goin'?", "uér iâ gôuin?", "O are some entre where e you."],
      ["Are you ready?", "Você está pronto?", "You ready?", "iú rédi?", "Na pergunta rápida, o are do começo cai."],
      ["Do you want some?", "Você quer um pouco?", "D'ya want some?", "djâ uânt sâm?", "Do you vira djâ: o D cola no you."],
      ["I'll call you later.", "Te ligo mais tarde.", "I'll call ya later.", "áil kól iâ lêirâr", "You vira iâ e o T de later vira R: lêirâr."],
      ["Is that your car?", "Esse carro é seu?", "Is that yer car?", "iz dét iâr kár?", "Your vira iâr, bem curto."]
    ]
  },
  {
    id: "ou-t", part: "ouvido", kind: "listen", name: "O T que vira R", icon: "headphones",
    desc: "T entre vogais vira um R rápido, igual ao R de “caro”: water soa uórâr.",
    phrases: [
      ["What is it?", "O que é?", "Whadizit?", "uárizit?", "O T de what encosta na vogal e vira R: uár-iz-it."],
      ["Get out!", "Sai! / Não acredito!", "Gedout!", "guéráut!", "Get + out: o T vira R e as duas palavras colam."],
      ["A lot of people.", "Muita gente.", "A lotta people.", "âlárâ pípâl", "Lot of vira lárâ: o T vira R e o of vira â."],
      ["Water, please.", "Água, por favor.", "Wader, please.", "uórâr, plíz", "Water: o T entre vogais vira R."],
      ["It's better than nothing.", "É melhor que nada.", "It's bedder than nothin'.", "its bérâr dén nâthin", "Better soa bérâr; nothing perde o g."],
      ["Let it go.", "Deixa pra lá.", "Leddit go.", "lérit gôu", "Let + it: o T vira R e cola: lérit."],
      ["Put it on the table.", "Coloca na mesa.", "Puddit on the table.", "púrit ón dâ têibâl", "Put + it vira púrit."],
      ["What about you?", "E você?", "Whadabout you?", "uárâbáut iú?", "What + about: o T vira R e cola: uárâbáut."]
    ]
  },
  {
    id: "ou-gonna", part: "ouvido", kind: "listen", name: "Gonna, wanna, gotta, hafta", icon: "headphones",
    desc: "As quatro formas que aparecem a toda hora numa conversa: going to, want to, got to e have to.",
    phrases: [
      ["I'm going to eat.", "Vou comer.", "I'm gonna eat.", "áim gânâ ít", "Going to (futuro) vira gonna: gânâ."],
      ["Are you going to come?", "Você vai vir?", "Ya gonna come?", "iâ gânâ kâm?", "O are some e o you vira iâ."],
      ["I want to sleep.", "Quero dormir.", "I wanna sleep.", "ái uânâ slíp", "Want to vira wanna: uânâ."],
      ["Do you want to go?", "Quer ir?", "Ya wanna go?", "iâ uânâ gôu?", "Do you some quase todo: sobra iâ."],
      ["I've got to go.", "Tenho que ir.", "I gotta go.", "ái gárâ gôu", "Got to vira gotta, e o T vira R: gárâ."],
      ["I have to work.", "Tenho que trabalhar.", "I hafta work.", "ái héftâ uârk", "Have to vira hafta: o V vira F."],
      ["You have to see this!", "Você tem que ver isso!", "Ya hafta see this!", "iâ héftâ sí dis!", "You vira iâ e have to vira héftâ."],
      ["I'm not going to lie.", "Não vou mentir.", "I'm not gonna lie.", "áim nát gânâ lái", "Frase comum para começar uma opinião sincera."]
    ]
  },
  {
    id: "ou-what", part: "ouvido", kind: "listen", name: "What do you, what does it", icon: "headphones",
    desc: "As perguntas com what viram um som só: uárâiâ, uárâzit, uátchâ.",
    phrases: [
      ["What do you mean?", "Como assim?", "Whaddaya mean?", "uárâiâ mín?", "What do you vira uárâiâ: três palavras, um som só."],
      ["What does it mean?", "O que significa?", "Whaddazit mean?", "uárâzit mín?", "What does it vira uárâzit: o T e o D viram R."],
      ["What does he mean?", "O que ele quer dizer?", "Whaddazee mean?", "uárâzi mín?", "O H de he some: does he vira dâzi."],
      ["What does that have to do with me?", "O que isso tem a ver comigo?", "Whaddaz that hafta do with me?", "uárâz dét héftâ dú uí mi?", "Have to vira héftâ e o TH de with quase some."],
      ["What does that have to do with it?", "O que isso tem a ver?", "Whaddaz that hafta do with it?", "uárâz dét héftâ dú uíthit?", "With it cola: uíthit."],
      ["What do you want?", "O que você quer?", "Whaddaya want?", "uárâiâ uânt?", "De novo: what do you vira uárâiâ."],
      ["What are you doing?", "O que você tá fazendo?", "Whatcha doin'?", "uátchâ dúin?", "What are you vira uátchâ."],
      ["What did you say?", "O que você disse?", "Whadja say?", "uádjâ sêi?", "What did you vira uádjâ."]
    ]
  },
  {
    id: "ou-djtch", part: "ouvido", kind: "listen", name: "Didja, wouldja, gotcha", icon: "headphones",
    desc: "D + you vira DJ e T + you vira TCH. É o som de didja, wouldja e gotcha.",
    phrases: [
      ["Did you see that?", "Você viu isso?", "Didja see that?", "dídjâ sí dét?", "Did you vira dídjâ."],
      ["Did you eat?", "Você comeu?", "Didja eat?", "dídjâ ít?", "Did you vira dídjâ."],
      ["Would you like some?", "Você quer um pouco?", "Wouldja like some?", "údjâ láik sâm?", "Would you vira údjâ: o W quase some."],
      ["Could you help me?", "Pode me ajudar?", "Couldja help me?", "kúdjâ hélp mi?", "Could you vira kúdjâ."],
      ["Nice to meet you.", "Prazer.", "Nice ta meetcha.", "náis tâ mítchâ", "Meet you vira mítchâ e o to fica tâ."],
      ["Got you!", "Entendi! / Te peguei!", "Gotcha!", "gátchâ!", "Got you vira gátchâ."],
      ["I'll let you know.", "Te aviso.", "I'll letcha know.", "áil létchâ nôu", "Let you vira létchâ."],
      ["Don't you think?", "Você não acha?", "Doncha think?", "dôuntchâ think?", "Don't you vira dôuntchâ."]
    ]
  },
  {
    id: "ou-junta", part: "ouvido", kind: "listen", name: "Palavras que se juntam", icon: "headphones",
    desc: "A consoante do fim cola na vogal da palavra seguinte. Parece uma palavra só.",
    phrases: [
      ["Check it out.", "Dá uma olhada.", "Checkidout.", "tchékiráut", "Check + it + out: tudo junto, e o T vira R."],
      ["Come on in.", "Pode entrar.", "C'monin.", "kâmónin", "Come on in vira uma palavra: kâmónin."],
      ["Pick it up.", "Pega isso.", "Pickidup.", "píkirâp", "Pick + it + up colam: píkirâp."],
      ["Turn it off.", "Desliga isso.", "Turnidoff.", "târnirôf", "Turn + it + off: târnirôf."],
      ["Hold on a second.", "Espera um segundo.", "Holdonna sec.", "hôuldónâ sék", "Second vira sec na fala rápida."],
      ["Give it to me.", "Me dá isso.", "Givit ta me.", "gívit tâ mi", "Give + it colam e o to vira tâ."],
      ["Not at all.", "De jeito nenhum. / Imagina.", "Nodadall.", "nárâról", "Not at all: os dois T viram R."],
      ["Get out of here!", "Sai daqui! / Não acredito!", "Gedoudda here!", "guérâurâ hír!", "Get out of: T vira R e o of vira â."]
    ]
  },
  {
    id: "ou-h", part: "ouvido", kind: "listen", name: "O H que some", icon: "headphones",
    desc: "Him, her, he e have perdem o H no meio da frase.",
    phrases: [
      ["Tell him I said hi.", "Diz pra ele que eu mandei um oi.", "Tell'im I said hi.", "télim ái séd hái", "Him perde o H e cola em tell: télim."],
      ["Ask her.", "Pergunta pra ela.", "Ask'er.", "éskâr", "Her perde o H: éskâr."],
      ["Give him a call.", "Liga pra ele.", "Give'im a call.", "gívimâ kól", "Give him a vira gívimâ."],
      ["What did he say?", "O que ele disse?", "Whaddidee say?", "uárídi sêi?", "Did he vira dídi: o H some."],
      ["Where's he going?", "Aonde ele vai?", "Where'zee goin'?", "uérzi gôuin?", "Where's he vira uérzi."],
      ["I told her already.", "Eu já falei pra ela.", "I told'er already.", "ái tôuldâr ólrédi", "Told her vira tôuldâr."],
      ["Is he okay?", "Ele tá bem?", "Izee okay?", "ízi ôukêi?", "Is he vira ízi."],
      ["Let him go.", "Deixa ele ir.", "Let'im go.", "létim gôu", "Let him vira létim."]
    ]
  },
  {
    id: "ou-can", part: "ouvido", kind: "listen", name: "Can ou can't?", icon: "headphones",
    desc: "O som que mais confunde: can é fraco (kân) e can't é forte (kén), com o T quase mudo.",
    phrases: [
      ["I can do it.", "Eu consigo.", "I c'n do it.", "ái kân dúit", "Can positivo é fraco e rápido: kân."],
      ["I can't do it.", "Não consigo.", "I can't do it.", "ái kén dúit", "Can't é forte e aberto: kén. O T quase não aparece."],
      ["Can you hear me?", "Você me ouve?", "C'n ya hear me?", "kâniâ hír mi?", "Can you vira kâniâ."],
      ["I can't hear you.", "Não te ouço.", "I can't hear ya.", "ái kén hír iâ", "Repare no kén forte: é negativo."],
      ["We can talk later.", "A gente conversa depois.", "We c'n talk later.", "uí kân tók lêirâr", "Kân fraco: positivo."],
      ["You can't park here.", "Você não pode estacionar aqui.", "Ya can't park here.", "iâ kén párk hír", "Kén forte: negativo."],
      ["Can I come in?", "Posso entrar?", "C'n I come in?", "kânái kâmín?", "Can I vira kânái, e come in cola: kâmín."],
      ["I can't believe it!", "Não acredito!", "I can't believe it!", "ái kén bilívit!", "Believe it cola: bilívit."]
    ]
  },
  {
    id: "ou-rapidas", part: "ouvido", kind: "listen", name: "Perguntas rápidas do dia a dia", icon: "headphones",
    desc: "As perguntas que você vai ouvir logo no primeiro minuto de conversa.",
    phrases: [
      ["What's up?", "E aí? Beleza?", "Wassup?", "uâssáp?", "What's up vira uma palavra: uâssáp."],
      ["How's it going?", "Como vão as coisas?", "Howzit goin'?", "háuzit gôuin?", "How's it cola: háuzit."],
      ["What are you up to?", "O que você anda fazendo?", "Whatcha up to?", "uátchâ áp tâ?", "What are you vira uátchâ."],
      ["Where are you from?", "De onde você é?", "Where ya from?", "uér iâ frâm?", "O are some e o from fica fraco: frâm."],
      ["How long have you been here?", "Há quanto tempo você está aqui?", "How long ya been here?", "háu lóng iâ bin hír?", "Have you vira só iâ."],
      ["Are you kidding me?", "Tá de brincadeira?", "You kiddin' me?", "iú kírin mi?", "O D de kidding vira R: kírin."],
      ["What's going on?", "O que está acontecendo?", "What's goin' on?", "uáts gôuin ón?", "Going perde o g: gôuin."],
      ["Is everything okay?", "Tá tudo bem?", "Is ev'rything okay?", "iz évrithin ôukêi?", "Everything perde uma sílaba: évrithin."]
    ]
  },
  {
    id: "ou-enrola", part: "ouvido", kind: "listen", name: "Enrolação natural", icon: "headphones",
    desc: "I mean, you know, kinda, like: as palavras que o americano usa enquanto pensa.",
    phrases: [
      ["I mean, it's fine.", "Quer dizer, tudo bem.", "I mean, it's fine.", "ái mín, its fáin", "I mean serve para corrigir ou explicar o que acabou de dizer."],
      ["You know what I mean?", "Sabe o que eu quero dizer?", "Ya know whaddI mean?", "iâ nôu uárái mín?", "What I cola e o T vira R: uárái."],
      ["It's kind of weird.", "É meio estranho.", "It's kinda weird.", "its káindâ uírd", "Kind of vira kinda: káindâ."],
      ["I don't know.", "Não sei.", "I dunno.", "ái dânôu", "Don't know vira dunno: dânôu."],
      ["Sort of.", "Mais ou menos.", "Sorta.", "sórâ", "Sort of vira sorta, e o T vira R."],
      ["I was like, no way!", "Eu fiquei tipo: não acredito!", "I was like, no way!", "ái uâz láik, nôu uêi!", "Like aqui não é gostar: é “tipo”, para contar uma reação."],
      ["Let me think.", "Deixa eu pensar.", "Lemme think.", "lémi think", "Let me vira lemme: lémi."],
      ["Give me a second.", "Me dá um segundo.", "Gimme a sec.", "gími â sék", "Give me vira gimme: gími."]
    ]
  },
  {
    id: "ou-numeros", part: "ouvido", kind: "listen", name: "Números e horas na fala", icon: "headphones",
    desc: "Twenty soa tuéni, thirty soa thârri, e fifteen e fifty mudam pela sílaba forte.",
    phrases: [
      ["Twenty dollars.", "Vinte dólares.", "Twenny dollars.", "tuéni dálârz", "O T depois do N some: twenty vira tuéni."],
      ["Thirty minutes.", "Trinta minutos.", "Thirdy minutes.", "thârri mínits", "O T de thirty vira R: thârri."],
      ["Fifteen or fifty?", "Quinze ou cinquenta?", "Fifteen or fifty?", "fiftín ór fífti?", "No -teen a força vai no fim (fif-TÍN); no -ty, no começo (FÍF-ti)."],
      ["It's a quarter to nine.", "São quinze para as nove.", "It's a quarder ta nine.", "its â kuórâr tâ náin", "Quarter: o T vira R. To vira tâ."],
      ["See you at eight.", "Te vejo às oito.", "See ya at eight.", "sí iâ ârêit", "At eight cola e o T vira R: ârêit."],
      ["Twenty-one.", "Vinte e um.", "Twenny-one.", "tuéni uân", "Twenty vira tuéni."],
      ["What time is it?", "Que horas são?", "Whad time izit?", "uát táim ízit?", "Is it cola: ízit."],
      ["In a minute.", "Num minuto. / Já vou.", "In a minnit.", "inâ mínit", "In a cola: inâ."]
    ]
  }
);
