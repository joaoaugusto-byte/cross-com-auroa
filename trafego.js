/* CROSS-COM — tráfego de rádio.

   O terminal não fica quieto. Enquanto o dossiê está aberto chega conversa
   de outras equipes, aviso de drone sondando o enlace, tráfego hostil
   interceptado, pedido de socorro e recado direto para o Nomad.

   Nada disso é interativo: a pilha inteira é pointer-events:none, não
   rouba foco e não bloqueia nada embaixo. É só o rádio aberto.

   O que chega depende do volume que está na tela — lendo o bestiário, o
   canal enche de avistamento de Lobo; lendo o volume de furtividade, de
   drone. O rádio acompanha o que você está estudando. */

(function (w) {
  "use strict";

  var D = w.DOSSIE;
  var reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ═══════════════════════════════════════════
     O BANCO DE CONVERSAS

     Cada entrada é uma conversa curta: uma a três falas, encadeadas com
     alguns segundos entre elas. Chamada e resposta soam muito mais vivas
     do que falas soltas.

     tipo:  rede     conversa de outras equipes Ghost
            direta   recado endereçado ao Nomad
            socorro  pedido de ajuda, canal aberto
            hostil   tráfego da Sentinel/Lobos, interceptado
            sistema  o próprio Cross-Com avisando de alguma coisa
     ═══════════════════════════════════════════ */

  var CONVERSAS = [

    /* ——— drone, varredura e guerra eletrônica ——— */

    { tag: "drone", fala: [
      { de: "CROSS-COM", tipo: "sistema", efeito: "varredura",
        txt: "<b>AZRAËL</b> em varredura larga sobre o seu quadrante. assinatura de rádio exposta." },
      { de: "CROSS-COM", tipo: "sistema",
        txt: "reduzindo potência de saída · ocultando portadora … <b class='v'>ok</b>" }
    ]},

    { tag: "drone", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "drone sondando o enlace — três tentativas de <i>handshake</i> negadas. ele sabe que tem rádio aqui, não sabe onde." }
    ]},

    { tag: "drone", fala: [
      { de: "CROSS-COM", tipo: "sistema", efeito: "varredura",
        txt: "<b>AZRAËL</b> em reconhecimento a 400 m. deite na vegetação ou entre na lama até ele passar." },
      { de: "EREWHON", tipo: "direta",
        txt: "nomad, ele enxerga movimento, não paciência. fica parado." }
    ]},

    { tag: "drone", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "<b>MURMUR</b> ativo nas proximidades — bloqueio de curto alcance. perda de pacotes subindo: 12% → 31%." }
    ]},

    { tag: "drone", fala: [
      { de: "VÉU-3", tipo: "rede",
        txt: "<b>BEHEMOTH</b> cruzando a estrada costeira. isso não é patrulha, é escolta. alguém tá movendo carga." },
      { de: "EREWHON", tipo: "rede",
        txt: "véu-3, não engaja. esse aí você contorna." }
    ]},

    { tag: "drone", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "torre de vigilância 4B girou para o seu quadrante. cobertura dura 40 s por varredura." }
    ]},

    { tag: "drone", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "sua assinatura térmica ficou registrada por 6 s antes do enlace cair. se tiver telhado por perto, use." }
    ]},

    { tag: "drone", fala: [
      { de: "FERROLHO", tipo: "rede",
        txt: "alguém já viu drone deles perder a linha em chuva forte? porque o nosso aqui perdeu." },
      { de: "HOLT", tipo: "rede",
        txt: "não é a chuva, ferrolho. é o ruído térmico. tempestade cega os dois lados." }
    ]},

    /* ——— tráfego hostil interceptado ——— */

    { tag: "lobos", fala: [
      { de: "SENTINEL 2-7", tipo: "hostil",
        txt: "rastro fresco na trilha norte. não é de colono. mandem uma caçadora." },
      { de: "SENTINEL · COMANDO", tipo: "hostil",
        txt: "negativo. mantenham a patrulha na rota. o setor já tem cobertura aérea." }
    ]},

    { tag: "lobos", fala: [
      { de: "CANAL 3 · LOBOS", tipo: "hostil",
        txt: "alguém apagou a câmera do portão leste e não tocou em mais nada. confiram o perímetro inteiro." }
    ]},

    { tag: "lobos", fala: [
      { de: "SENTINEL · LOG", tipo: "hostil",
        txt: "drone 118 fora de rede. última posição conhecida: Fen Bog, margem sul. sem sinal de queda." }
    ]},

    { tag: "lobos", fala: [
      { de: "CANAL 3 · LOBOS", tipo: "hostil",
        txt: "temos uma baixa e nenhum corpo do outro lado. isso não é rebelde." },
      { de: "SENTINEL · COMANDO", tipo: "hostil",
        txt: "silêncio no canal. relatório por escrito." }
    ]},

    { tag: "ilha", fala: [
      { de: "SENTINEL 4-1", tipo: "hostil",
        txt: "reforço a caminho de Infinity. dois veículos, oito a bordo. chegada em doze minutos." }
    ]},

    { tag: "equipamento", fala: [
      { de: "SKELL·NET", tipo: "hostil",
        txt: "…fragmento… produção da linha 3 redirecionada para chassis militar. autorização em nome de… …fim do fragmento" }
    ]},

    /* ——— outras equipes pedindo status de área ——— */

    { tag: "ilha", fala: [
      { de: "CINZA-4", tipo: "rede",
        txt: "alguém tem visual em Infinity? perdi dois sinais no cume e não tenho drone." },
      { de: "EREWHON", tipo: "rede",
        txt: "negativo, cinza-4. última marcação da região é de quarenta minutos. trata como hostil." }
    ]},

    { tag: "rota", fala: [
      { de: "FERROLHO", tipo: "rede",
        txt: "status de Windy Islands? vamos cruzar de barco ao amanhecer e não quero surpresa na praia." }
    ]},

    { tag: "rota", fala: [
      { de: "MARÉ-6", tipo: "rede",
        txt: "alguém confirma se a ponte de Sinking Country ainda está de pé? o mapa diz que sim, meus olhos dizem que não." },
      { de: "PONTE-9", tipo: "rede",
        txt: "está de pé. com um posto de checagem no meio. escolhe seu problema." }
    ]},

    { tag: "rota", fala: [
      { de: "ALVORADA-2", tipo: "rede",
        txt: "campo de pouso em New Argyll limpo? preciso de janela de exfiltração nas próximas duas horas." },
      { de: "EREWHON", tipo: "rede",
        txt: "alvorada-2, aguarde. nenhuma aeronave sobe enquanto a rede antiaérea estiver de pé." }
    ]},

    { tag: "drone", fala: [
      { de: "VÉU-3", tipo: "rede",
        txt: "quem marcou os drones de Fen Bog? a marcação está velha e eu contei dois a mais." }
    ]},

    { tag: "ilha", fala: [
      { de: "ESTILHAÇO-1", tipo: "rede",
        txt: "New Argyll está estranhamente calmo. calmo demais pro meu gosto." }
    ]},

    { tag: "geral", fala: [
      { de: "PONTE-9", tipo: "rede",
        txt: "confirmação de presença no canal. quem ainda está de pé, responde." },
      { de: "CINZA-4", tipo: "rede", txt: "cinza-4, de pé." },
      { de: "MARÉ-6", tipo: "rede", txt: "maré-6, de pé. dois feridos, mas de pé." }
    ]},

    /* ——— localização de unidades Lobo ——— */

    { tag: "lobos", fala: [
      { de: "PONTE-9", tipo: "rede",
        txt: "dois Lobos com visão noturna descendo pela crista do Monte Hodgson. quatro no total, talvez cinco." },
      { de: "EREWHON", tipo: "rede",
        txt: "confirmado por escuta. patrulha de Lobos rumo sudoeste. isso não é rotina de turno." }
    ]},

    { tag: "lobos", fala: [
      { de: "ESTILHAÇO-1", tipo: "rede",
        txt: "posto avançado na Zona Restrita 01 reforçado desde ontem: atirador em torre, dois drones de solo e um Lobo que não desgruda do painel." }
    ]},

    { tag: "lobos", fala: [
      { de: "CINZA-4", tipo: "rede",
        txt: "eles caçam em quatro e nunca na mesma direção. se você viu dois, tem dois te contornando." }
    ]},

    { tag: "lobos", fala: [
      { de: "EREWHON", tipo: "direta",
        txt: "nomad, marcação de Lobos a noroeste da sua última posição. eles usam o mesmo manual que você — conta com isso." }
    ]},

    { tag: "lobos", fala: [
      { de: "VÉU-3", tipo: "rede",
        txt: "unidade Lobo entrou no vale e não saiu. ou montaram acampamento, ou estão esperando alguém." }
    ]},

    /* ——— socorro ——— */

    { tag: "socorro", fala: [
      { de: "MARÉ-6", tipo: "socorro",
        txt: "contato! contato! presos na encosta, dois feridos, sem cobertura aérea —" },
      { de: "MARÉ-6", tipo: "socorro",
        txt: "…<i>transmissão cortada</i>" },
      { de: "EREWHON", tipo: "rede",
        txt: "maré-6, responde. maré-6." }
    ]},

    { tag: "socorro", fala: [
      { de: "ALVORADA-2", tipo: "socorro",
        txt: "homem ferido em Driftwood, ferimento grave, sangrando. alguém na área com seringa sobrando?" },
      { de: "MARIA SCHULZ", tipo: "rede",
        txt: "bandagem ele tem, é ilimitada. o que falta é ele parar quieto o tempo de aplicar." }
    ]},

    { tag: "socorro", fala: [
      { de: "CANAL ABERTO", tipo: "socorro",
        txt: "aqui é um colono de New Argyll. levaram nosso gerador e três pessoas. se tem alguém ouvindo, pelo amor de deus." },
      { de: "EREWHON", tipo: "rede",
        txt: "sem cifra, sem autenticação, sem repetição de senha. pode ser verdade. pode ser isca. tratem como isca." }
    ]},

    { tag: "socorro", fala: [
      { de: "FERROLHO", tipo: "socorro",
        txt: "perdi o esquadrão inteiro numa base de duas torres. duas. não subestimem nada aqui." }
    ]},

    { tag: "socorro", fala: [
      { de: "SEM IDENTIFICAÇÃO", tipo: "socorro",
        txt: "…se alguém estiver ouvindo neste canal, a frequência dos Ghosts foi comprometida. não confiem em—" },
      { de: "CROSS-COM", tipo: "sistema", efeito: "varredura",
        txt: "origem não autenticada. transmissão descartada. <b class='r'>não responda a este canal.</b>" }
    ]},

    /* ——— recados diretos para o Nomad ——— */

    { tag: "geral", fala: [
      { de: "EREWHON", tipo: "direta",
        txt: "nomad, seu último ponto de bivaque continua frio. se precisar trocar de classe ou tratar ferimento, pode voltar." }
    ]},

    { tag: "drone", fala: [
      { de: "HOLT", tipo: "direta",
        txt: "nomad, achei um jeito de cegar a torre de Infinity por uns noventa segundos. te aviso quando você estiver perto o bastante pra valer a pena." }
    ]},

    { tag: "equipamento", fala: [
      { de: "MARIA SCHULZ", tipo: "direta",
        txt: "nomad, seringa eu reponho aqui no balcão. bandagem você já tem de sobra — o que acaba é sempre a seringa." }
    ]},

    { tag: "geral", fala: [
      { de: "EREWHON", tipo: "direta",
        txt: "lembrete, nomad: sem esquadra você não tem quem te levante. escolhe a rota de saída antes do primeiro tiro, não depois." }
    ]},

    { tag: "geral", fala: [
      { de: "EREWHON", tipo: "direta",
        txt: "o helicóptero não vem. ainda." }
    ]},

    { tag: "equipamento", fala: [
      { de: "HOLT", tipo: "direta",
        txt: "nomad, sem nível de equipamento aquela pistola do primeiro minuto mata igualzinho. o que muda é quem enxerga quem primeiro." }
    ]},

    { tag: "rota", fala: [
      { de: "EREWHON", tipo: "direta",
        txt: "nomad, vento de nordeste e chuva chegando pelo mar. se você for esperar para se mover, é essa a hora." }
    ]},

    { tag: "ilha", fala: [
      { de: "HOLT", tipo: "direta",
        txt: "nomad, cuidado com a descida da encosta leste. o jogo não te mata; a queda mata. desce pelo caminho longo." }
    ]},

    /* ——— expansões ——— */

    { tag: "episodios", fala: [
      { de: "EREWHON", tipo: "rede",
        txt: "tráfego novo vindo da direção da ilha menor a sudeste. volume alto, cifra diferente da Sentinel." }
    ]},

    { tag: "episodios", fala: [
      { de: "VÉU-3", tipo: "rede",
        txt: "quem está operando na ilha rochosa? aquilo não é instalação da Skell, a arquitetura é outra." },
      { de: "EREWHON", tipo: "rede",
        txt: "véu-3, fica longe disso até segunda ordem." }
    ]},

    { tag: "episodios", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "canal secundário detectado · cifra militar não-Sentinel · origem fora do arquipélago" }
    ]},

    /* ——— ambiente ——— */

    { tag: "geral", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "enlace por satélite perdido. reencaminhando por relé civil <b>auroa-met-07</b> … <b class='v'>ok</b>" }
    ]},

    { tag: "geral", fala: [
      { de: "COLONO", tipo: "rede",
        txt: "eles levaram o gerador da vila. de novo. terceira vez este mês." }
    ]},

    { tag: "ilha", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "previsão para as próximas 6 h: chuva forte, visibilidade abaixo de 200 m. drones perdem alcance. você também." }
    ]},

    { tag: "geral", fala: [
      { de: "PONTE-9", tipo: "rede",
        txt: "boa caçada a quem estiver de pé. rádio curto, gente. rádio curto." }
    ]},

    /* ——— segunda leva de tráfego ——— */

    /* drone e guerra eletrônica */

    { tag: "drone", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "campos de detecção sobrepostos neste setor: dois aparelhos cobrindo o mesmo vão. não existe caminho limpo — existe o caminho com menos tempo exposto." }
    ]},

    { tag: "drone", fala: [
      { de: "PONTE-9", tipo: "rede",
        txt: "o drone de solo tem ponto cego atrás. tem sim. tem uns dois metros, e dura o tempo de ele não virar." },
      { de: "CINZA-4", tipo: "rede",
        txt: "dois metros. vou lembrar disso no velório." }
    ]},

    { tag: "drone", fala: [
      { de: "HOLT", tipo: "direta",
        txt: "nomad, pulso eletromagnético não destrói, desliga. o que você faz nos dez segundos seguintes é que resolve alguma coisa." }
    ]},

    { tag: "drone", fala: [
      { de: "CROSS-COM", tipo: "sistema", efeito: "varredura",
        txt: "varredura térmica cruzando o setor. se você estiver correndo, pare. calor de corpo em movimento é o que ele procura primeiro." }
    ]},

    { tag: "drone", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "interferência de curto alcance na área. seu drone vai perder alcance nos próximos minutos — suba antes, não depois." }
    ]},

    { tag: "drone", fala: [
      { de: "CINZA-4", tipo: "rede",
        txt: "perdi meu drone numa árvore. de novo." },
      { de: "HOLT", tipo: "rede",
        txt: "cinza-4, a altitude existe por um motivo." }
    ]},

    { tag: "drone", fala: [
      { de: "EREWHON", tipo: "direta",
        txt: "nomad, marcação de drone dura menos do que você acha. remarque antes de entrar, não na véspera." }
    ]},

    { tag: "drone", fala: [
      { de: "ESTILHAÇO-1", tipo: "rede",
        txt: "matem a torre de comunicação primeiro. sempre. é a diferença entre invadir uma base e invadir uma base com helicóptero chegando." },
      { de: "EREWHON", tipo: "rede",
        txt: "confirmado por experiência própria. torre primeiro." }
    ]},

    { tag: "drone", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "torre de comunicação ativa neste quadrante. enquanto ela estiver de pé, qualquer alerta convoca apoio aéreo." }
    ]},

    { tag: "drone", fala: [
      { de: "VÉU-3", tipo: "rede",
        txt: "alguém já derrubou um Azraël? queria saber se valeu a pena." },
      { de: "EREWHON", tipo: "rede",
        txt: "já. não valeu. o que vem atrás é pior do que ele." }
    ]},

    /* lobos */

    { tag: "lobos", fala: [
      { de: "FERROLHO", tipo: "rede",
        txt: "eles deixam um atirador cobrindo a retirada. sempre. procurem o telhado antes de sair, não depois de levar tiro." }
    ]},

    { tag: "lobos", fala: [
      { de: "EREWHON", tipo: "direta",
        txt: "nomad, Lobo não persegue em linha reta. se ele sumiu de vista, ele está te contornando." }
    ]},

    { tag: "lobos", fala: [
      { de: "CANAL 3 · LOBOS", tipo: "hostil",
        txt: "o alvo usa o nosso manual. fechem o cerco pelo lado do vento." }
    ]},

    { tag: "lobos", fala: [
      { de: "SENTINEL 3-4", tipo: "hostil",
        txt: "quem autorizou os Lobos a operar neste setor? não temos coordenação com eles." },
      { de: "SENTINEL · COMANDO", tipo: "hostil",
        txt: "não é da sua conta. saia da frequência." }
    ]},

    { tag: "lobos", fala: [
      { de: "VÉU-3", tipo: "rede",
        txt: "contei quatro. depois contei seis. eu estava errado nas duas vezes." }
    ]},

    { tag: "lobos", fala: [
      { de: "ALVORADA-2", tipo: "rede",
        txt: "eles jogam granada em quem se entrincheira. não fiquem parados atrás da mesma pedra duas vezes." }
    ]},

    { tag: "lobos", fala: [
      { de: "EREWHON", tipo: "rede",
        txt: "patrulha de elite descendo pelo leito do rio. eles usam o barulho da água do mesmo jeito que a gente usaria." }
    ]},

    { tag: "lobos", fala: [
      { de: "PONTE-9", tipo: "rede",
        txt: "vi um Lobo esperar vinte minutos sem mexer um músculo. vinte minutos. eu desisti antes dele." }
    ]},

    { tag: "lobos", fala: [
      { de: "CANAL 3 · LOBOS", tipo: "hostil",
        txt: "encontramos o corpo. arrastado uns quarenta metros. não foi bicho." },
      { de: "SENTINEL · COMANDO", tipo: "hostil",
        txt: "dobrem a ronda noturna. relatório por escrito, nada por rádio." }
    ]},

    { tag: "lobos", fala: [
      { de: "HOLT", tipo: "direta",
        txt: "nomad, eles não são melhores que você. são iguais a você. é exatamente esse o problema." }
    ]},

    /* rota e navegação */

    { tag: "rota", fala: [
      { de: "MARÉ-6", tipo: "rede",
        txt: "quem for de helicóptero, lembra que a rede antiaérea não dorme. ela não precisa dormir." }
    ]},

    { tag: "rota", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "vento de través na travessia norte. quem for de barco chega molhado e barulhento." }
    ]},

    { tag: "rota", fala: [
      { de: "FERROLHO", tipo: "rede",
        txt: "atalho pela encosta custa fôlego. fôlego custa mira. escolham com calma." }
    ]},

    { tag: "rota", fala: [
      { de: "EREWHON", tipo: "rede",
        txt: "estrada costeira com patrulha motorizada a cada quarenta minutos. dá para cronometrar, e vale cronometrar." }
    ]},

    { tag: "rota", fala: [
      { de: "PONTE-9", tipo: "rede",
        txt: "caminho longo pela curva de nível. chegar cansado é pior que chegar tarde." }
    ]},

    { tag: "rota", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "bivaque conhecido a dois quilômetros a sudoeste. frio, sem sinal de visita recente." }
    ]},

    { tag: "rota", fala: [
      { de: "CINZA-4", tipo: "rede",
        txt: "se for dirigir, dirija devagar. carro que aparece rápido some rápido também." }
    ]},

    { tag: "rota", fala: [
      { de: "ALVORADA-2", tipo: "rede",
        txt: "alguém sabe se a rampa de Windy Islands ainda dá para descer? a minha memória diz que não." }
    ]},

    /* a ilha */

    { tag: "ilha", fala: [
      { de: "COLONO", tipo: "rede",
        txt: "a fábrica não para. nem de noite. nunca parou desde que eles chegaram." }
    ]},

    { tag: "ilha", fala: [
      { de: "ESTILHAÇO-1", tipo: "rede",
        txt: "tem estrutura nova na Zona Restrita 01 que não estava na carta da semana passada." },
      { de: "EREWHON", tipo: "rede",
        txt: "marque e não se aproxime. vamos olhar isso com calma." }
    ]},

    { tag: "ilha", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "temperatura caindo nas terras altas. visibilidade excelente — inclusive a sua silhueta contra o céu." }
    ]},

    { tag: "ilha", fala: [
      { de: "VÉU-3", tipo: "rede",
        txt: "o pantanal engole som. engole gente também. andem em dupla lá dentro." }
    ]},

    { tag: "ilha", fala: [
      { de: "EREWHON", tipo: "rede",
        txt: "Smuggler Coves com movimento de barco fora de hora. alguém está descarregando o que não devia." }
    ]},

    { tag: "ilha", fala: [
      { de: "COLONO", tipo: "rede",
        txt: "aqui era plantação. agora é depósito deles. eles nem desmontaram a cerca — só trocaram o que fica dentro." }
    ]},

    { tag: "ilha", fala: [
      { de: "MARÉ-6", tipo: "rede",
        txt: "quem já subiu o Monte Hodgson pelo lado leste? me digam que existe um jeito melhor." },
      { de: "PONTE-9", tipo: "rede",
        txt: "existe. chama-se lado oeste." }
    ]},

    /* socorro */

    { tag: "socorro", fala: [
      { de: "VÉU-3", tipo: "socorro",
        txt: "sem munição, dois deles na porta e nenhuma saída pelos fundos. se alguém estiver a menos de dez minutos—" }
    ]},

    { tag: "socorro", fala: [
      { de: "CANAL ABERTO", tipo: "socorro",
        txt: "meu marido não voltou do turno na fábrica. faz três dias. alguém que passe por lá, por favor, só olha." }
    ]},

    { tag: "socorro", fala: [
      { de: "ESTILHAÇO-1", tipo: "socorro",
        txt: "perdi visual do meu parceiro. última posição na encosta sul, faz quarenta minutos." },
      { de: "EREWHON", tipo: "rede",
        txt: "estilhaço-1, mantenha posição e não acenda nada. estamos ouvindo." }
    ]},

    { tag: "socorro", fala: [
      { de: "FERROLHO", tipo: "socorro",
        txt: "ferimento grave, sem seringa, bivaque a uma hora daqui. me digam que tem alguém mais perto." }
    ]},

    { tag: "socorro", fala: [
      { de: "CANAL ABERTO", tipo: "socorro",
        txt: "estão revistando casa por casa na vila. se tem alguém ouvindo, não venham pela estrada." }
    ]},

    { tag: "socorro", fala: [
      { de: "MARÉ-6", tipo: "rede",
        txt: "conseguimos sair. dois feridos, mas saímos. obrigado a quem respondeu." },
      { de: "EREWHON", tipo: "rede",
        txt: "bom te ouvir, maré-6. estávamos contando você como perdido." }
    ]},

    /* equipamento */

    { tag: "equipamento", fala: [
      { de: "HOLT", tipo: "direta",
        txt: "nomad, supressor não é invisibilidade. ele encurta a distância que o tiro viaja, não zera. quem estiver a vinte metros ouve igual." }
    ]},

    { tag: "equipamento", fala: [
      { de: "MARIA SCHULZ", tipo: "direta",
        txt: "nomad, prepare o acampamento antes de sair, não no meio do tiroteio. o bônus dura mais do que a sua paciência." }
    ]},

    { tag: "equipamento", fala: [
      { de: "CINZA-4", tipo: "rede",
        txt: "alguém tem lança-granadas sobrando? o meu acabou no primeiro drone pesado e o segundo ainda está voando." }
    ]},

    { tag: "equipamento", fala: [
      { de: "HOLT", tipo: "rede",
        txt: "sem nível de equipamento, o projeto da arma importa mais que a arma. o cano e a mira mudam mais que o nome no cabo." }
    ]},

    { tag: "equipamento", fala: [
      { de: "EREWHON", tipo: "rede",
        txt: "estoque de seringa reposto na loja da Maria. quem estiver a caminho de Erewhon, reabasteça." }
    ]},

    { tag: "equipamento", fala: [
      { de: "FERROLHO", tipo: "rede",
        txt: "escopeta resolve drone leve num tiro. num. tentem antes de esvaziar um pente de fuzil." }
    ]},

    /* ambiente e conversa geral */

    { tag: "geral", fala: [
      { de: "PONTE-9", tipo: "rede",
        txt: "alguém aí dormiu nas últimas quarenta e oito horas?" },
      { de: "CINZA-4", tipo: "rede", txt: "defina dormir." },
      { de: "VÉU-3", tipo: "rede", txt: "defina horas." }
    ]},

    { tag: "geral", fala: [
      { de: "EREWHON", tipo: "direta",
        txt: "nomad, silêncio no canal não quer dizer que está calmo. quer dizer que ninguém está transmitindo." }
    ]},

    { tag: "geral", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "manutenção no relé civil auroa-met-07. latência pode dobrar sem aviso nas próximas horas." }
    ]},

    { tag: "geral", fala: [
      { de: "CINZA-4", tipo: "rede",
        txt: "boa noite a quem estiver deitado na lama agora. somos mais do que parece." }
    ]},

    { tag: "geral", fala: [
      { de: "EREWHON", tipo: "direta",
        txt: "nomad, você não precisa limpar a base inteira. precisa sair de lá com o que foi buscar." }
    ]},

    { tag: "geral", fala: [
      { de: "MADS SCHULZ", tipo: "rede",
        txt: "quem voltar hoje, passa aqui. tenho café. café de verdade, não aquela coisa da ração." }
    ]},

    /* expansões */

    { tag: "episodios", fala: [
      { de: "EREWHON", tipo: "rede",
        txt: "atividade na ilha rochosa subiu de novo. e não é a Sentinel — o padrão de patrulha é outro." }
    ]},

    { tag: "episodios", fala: [
      { de: "VÉU-3", tipo: "rede",
        txt: "quem está usando aquela frequência militar antiga? não é nada do arquipélago." },
      { de: "EREWHON", tipo: "rede",
        txt: "véu-3, não responda nela. só escute." }
    ]},

    { tag: "episodios", fala: [
      { de: "CROSS-COM", tipo: "sistema",
        txt: "segundo canal cifrado estabilizou. origem fora de Auroa, cifra de padrão militar." }
    ]},

    { tag: "episodios", fala: [
      { de: "EREWHON", tipo: "direta",
        txt: "nomad, se você for até lá, vá preparado. o que opera naquela ilha não joga pelas regras daqui." }
    ]}
  ];

  /* A primeira transmissão depois do enlace nunca é sorteada: Erewhon
     confirma que ouviu você. O rádio se apresenta antes de virar ruído. */
  var ABERTURA = { tag: "geral", fala: [
    { de: "EREWHON", tipo: "direta",
      txt: "cross-com de volta ao ar. bom te ouvir, nomad. o canal está sujo mas está aberto." },
    { de: "EREWHON", tipo: "rede",
      txt: "aviso geral a quem estiver na escuta: a Sentinel varre o espectro em ciclo. transmitam curto." }
  ]};

  /* que canal cada volume sintoniza */
  var CANAL_DO_VOLUME = {
    v00: "geral", v01: "geral", v02: "geral",
    v03: "equipamento", v04: "equipamento",
    v05: "drone", v06: "lobos", v07: "ilha",
    v08: "rota", v09: "socorro", v10: "episodios"
  };

  var ROTULO = {
    rede: "", direta: "para você", socorro: "socorro",
    hostil: "interceptado", sistema: "cross-com"
  };

  /* ═══════════════════════════════════════════
     RELÓGIO LOCAL DE AUROA
     Começa às 03:12 e corre em tempo real. Um relógio parado no cabeçalho
     denuncia na hora que a tela é só uma figura.
     ═══════════════════════════════════════════ */

  var T0 = Date.now(), BASE = 3 * 3600 + 12 * 60;

  function agora() {
    return (BASE + Math.floor((Date.now() - T0) / 1000)) % 86400;
  }
  function dois(n) { return (n < 10 ? "0" : "") + n; }
  function hhmmss() {
    var s = agora();
    return dois(Math.floor(s / 3600)) + ":" + dois(Math.floor(s / 60) % 60) + ":" + dois(s % 60);
  }
  function hhmm() {
    var s = agora();
    return dois(Math.floor(s / 3600)) + ":" + dois(Math.floor(s / 60) % 60);
  }

  var COLUNAS = "ABCDEFGHIJKLMNOP";
  function grade() {
    return COLUNAS[Math.floor(Math.random() * 16)] + dois(1 + Math.floor(Math.random() * 7));
  }

  /* ═══════════════════════════════════════════
     ESTADO
     ═══════════════════════════════════════════ */

  var ligado = true;
  try {
    if (localStorage.getItem("crosscom.radio") === "off") ligado = false;
  } catch (e) { /* janela anônima, armazenamento bloqueado: segue ligado */ }

  var relogioTimer = null, proximaTimer = null, falaTimer = null, varrTimer = null;
  var canal = "geral", recentes = [], rodando = false, recebidas = 0, primeira = true;
  var forcadoAte = 0;

  function cx() { return D.el("trafego"); }

  /* ═══════════════════════════════════════════
     A PILHA DE MENSAGENS
     ═══════════════════════════════════════════ */

  /* numa tela de telefone duas mensagens já cobrem metade da leitura */
  function teto() { return w.innerWidth < 560 ? 1 : (w.innerWidth < 900 ? 2 : 3); }

  function retira(no) {
    if (!no || no.dataset.saindo) return;
    no.dataset.saindo = "1";
    no.classList.add("saindo");
    setTimeout(function () { if (no.parentNode) no.parentNode.removeChild(no); }, 460);
  }

  function mostra(f) {
    var alvo = cx();
    if (!alvo) return;

    var vivas = [].filter.call(alvo.children, function (n) { return !n.dataset.saindo; });
    while (vivas.length >= teto()) retira(vivas.shift());

    var no = document.createElement("div");
    no.className = "msg";
    no.setAttribute("data-t", f.tipo);

    var marca = ROTULO[f.tipo];
    var via = f.tipo === "sistema" ? "enlace local"
            : f.tipo === "hostil" ? "escuta · " + grade()
            : "rádio · " + grade();

    no.innerHTML =
      '<div class="cab">' +
        "<b>" + f.de + "</b>" +
        (marca ? '<span class="marca">' + marca + "</span>" : "") +
        '<span class="via">' + via + "</span>" +
        '<span class="hora">' + hhmm() + "</span>" +
      "</div>" +
      "<p>" + f.txt + "</p>";

    alvo.appendChild(no);
    recebidas++;
    if (D.som) D.som.msg(f.tipo);

    /* deixa a mensagem o tempo de ser lida, e um pouco mais nas longas */
    var vida = Math.min(17000, Math.max(9000, 6400 + f.txt.length * 58));
    setTimeout(function () { retira(no); }, vida);

    if (f.efeito === "varredura") varrer();
  }

  /* ═══════════════════════════════════════════
     VARREDURA DE ESPECTRO
     Quando um Azraël passa, a tela inteira reage: uma banda desce pelo
     terminal, o indicador de enlace cai para "degradado" e o cabeçalho
     acende o aviso. Puramente visual — nada trava, nada é desabilitado.
     ═══════════════════════════════════════════ */

  function varrer() {
    var v = D.el("varredura"), chip = D.el("chip-varredura"), p = D.el("pulso");
    if (!v) return;
    clearTimeout(varrTimer);

    if (chip) chip.hidden = false;
    if (p) { p.textContent = "● Degradado"; p.classList.add("degradado"); }
    if (D.mira) D.mira.degradar(true);
    if (D.som) D.som.tocar("varredura");

    if (!reduz) {
      v.classList.remove("on");
      void v.offsetWidth;          /* reinicia a animação se outra já estava rodando */
      v.classList.add("on");
    }

    varrTimer = setTimeout(function () {
      v.classList.remove("on");
      if (chip) chip.hidden = true;
      if (p) { p.textContent = "● Enlace"; p.classList.remove("degradado"); }
      if (D.mira) D.mira.degradar(false);
    }, reduz ? 2600 : 3400);
  }

  /* ═══════════════════════════════════════════
     SORTEIO E CADÊNCIA
     ═══════════════════════════════════════════ */

  function sorteia() {
    /* peso 5 para o canal do volume aberto, 1 para o resto — o rádio
       conversa sobre o que você está lendo sem virar repetição */
    var pool = [], i, k;
    for (i = 0; i < CONVERSAS.length; i++) {
      if (recentes.indexOf(i) >= 0) continue;
      var peso = CONVERSAS[i].tag === canal ? 5 : 1;
      for (k = 0; k < peso; k++) pool.push(i);
    }
    if (!pool.length) { recentes = []; return sorteia(); }

    var esc = pool[Math.floor(Math.random() * pool.length)];
    recentes.push(esc);
    while (recentes.length > 12) recentes.shift();
    return CONVERSAS[esc];
  }

  function conversa(c, n) {
    n = n || 0;
    if (!rodando || !ligado) return;
    mostra(c.fala[n]);
    if (n + 1 < c.fala.length) {
      falaTimer = setTimeout(function () { conversa(c, n + 1); }, 2700 + Math.random() * 1900);
    }
  }

  function agenda(min, max) {
    clearTimeout(proximaTimer);
    proximaTimer = setTimeout(function () {
      if (!rodando || !ligado) return;
      /* aba em segundo plano não acumula fila: espera voltar */
      if (document.hidden) { agenda(8000, 12000); return; }
      if (primeira) { primeira = false; conversa(ABERTURA); }
      else conversa(sorteia());
      agenda(reduz ? 40000 : 24000, reduz ? 70000 : 48000);
    }, min + Math.random() * (max - min));
  }

  /* ═══════════════════════════════════════════
     INTERFACE PÚBLICA
     ═══════════════════════════════════════════ */

  D.trafego = {

    iniciar: function () {
      if (rodando) return;
      rodando = true;
      if (!relogioTimer) {
        var r = D.el("relogio");
        if (r) {
          r.textContent = hhmmss();
          relogioTimer = setInterval(function () { r.textContent = hhmmss(); }, 1000);
        }
      }
      if (ligado) agenda(11000, 16000);
    },

    parar: function () {
      rodando = false;
      primeira = true;
      clearTimeout(proximaTimer);
      clearTimeout(falaTimer);
      clearTimeout(varrTimer);
      var alvo = cx();
      if (alvo) alvo.innerHTML = "";
      var v = D.el("varredura"), chip = D.el("chip-varredura"), p = D.el("pulso");
      if (v) v.classList.remove("on");
      if (chip) chip.hidden = true;
      if (p) { p.textContent = "● Enlace"; p.classList.remove("degradado"); }
      if (D.mira) D.mira.degradar(false);
    },

    /* o volume aberto define o assunto do canal */
    canal: function (id) {
      if (forcadoAte > Date.now()) return;     /* canal preso por evento */
      canal = CANAL_DO_VOLUME[id] || "geral";
    },

    /* prende a escuta num assunto por um tempo, independente do volume.
       Usado por quem entra na rede dos Lobos: o que chega passa a ser o
       tráfego deles. */
    forcarCanal: function (tag, ms) {
      canal = tag;
      forcadoAte = Date.now() + (ms || 180000);
    },

    /* injeta uma mensagem de sistema fora da cadência — para eventos */
    avisar: function (txt, comVarredura) {
      if (!rodando) return;
      mostra({ de: "CROSS-COM", tipo: "sistema", txt: txt,
               efeito: comVarredura ? "varredura" : null });
    },

    ligado: function () { return ligado; },

    alterna: function (forcar) {
      ligado = typeof forcar === "boolean" ? forcar : !ligado;
      try {
        localStorage.setItem("crosscom.radio", ligado ? "on" : "off");
      } catch (e) { /* sem armazenamento: vale só nesta sessão */ }

      if (!ligado) {
        clearTimeout(proximaTimer);
        clearTimeout(falaTimer);
        var alvo = cx();
        if (alvo) [].slice.call(alvo.children).forEach(retira);
      } else if (rodando) {
        agenda(2500, 5000);
      }
      return ligado;
    },

    /* força uma conversa agora, sem esperar a cadência */
    disparar: function (t) {
      if (!ligado) return false;
      if (t) {
        var c = CONVERSAS.filter(function (x) { return x.tag === t; });
        if (c.length) { conversa(c[Math.floor(Math.random() * c.length)]); return true; }
      }
      conversa(sorteia());
      return true;
    },

    recebidas: function () { return recebidas; },
    canalAtual: function () { return canal; }
  };

})(window);
