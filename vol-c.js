/* CROSS-COM — volumes 07 a 10. */

(function (D) {
  "use strict";

  /* ═══════════════════════════════════════════════════════════
     VOLUME 07 · A ILHA
     ═══════════════════════════════════════════════════════════ */

  function vinheta(inner) {
    return '<svg viewBox="0 0 300 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<rect width="300" height="130" fill="#060c0d"/>' + inner + "</svg>";
  }

  var BIOMAS = [
    { b: "#4f9155", n: "Floresta tropical", en: "Rainforest",
      d: "Dossel fechado, vegetação rasteira densa e umidade constante. O terreno mais generoso de Auroa para quem quer não ser visto.",
      cob: ["alta", "Alta"], folego: "Médio — raiz e desnível constantes", dist: "Curta. Trinta metros de visão em muitos pontos.",
      tat: "Ideal para aproximação. Péssimo para reconhecimento a olho nu — aqui o drone não é opcional.",
      art: vinheta('<path d="M0 92h300v38H0z" fill="#0d1e1c"/>' +
        '<g fill="#122d26"><ellipse cx="42" cy="54" rx="46" ry="30"/><ellipse cx="118" cy="40" rx="52" ry="32"/>' +
        '<ellipse cx="196" cy="50" rx="48" ry="30"/><ellipse cx="268" cy="38" rx="46" ry="30"/></g>' +
        '<g stroke="#1b4238" stroke-width="3" fill="none"><path d="M46 92V58M120 92V46M198 92V54M270 92V44"/></g>' +
        '<g stroke="#1b4238" stroke-width="1.6" fill="none" opacity=".9">' +
        '<path d="M14 92q4-14 0-22M30 92q-4-12 0-18M160 92q5-15 0-24M240 92q-5-13 0-20M92 92q4-11 0-17"/></g>' +
        '<g stroke="#2a5a4a" stroke-width="1" opacity=".5"><path d="M20 112h34M70 120h48M150 110h40M220 118h50"/></g>' +
        '<g stroke="#2a4448" stroke-width=".9" opacity=".35"><path d="M40 14l-5 18M120 8l-5 16M210 12l-5 18M280 6l-5 16"/></g>') },
    { b: "#5f8f5a", n: "Pântano salgado", en: "Salt marsh",
      d: "Planície alagada na transição entre mar e terra, com juncos altos e lama por toda parte. Movimento lento e ruidoso na água.",
      cob: ["alta", "Alta"], folego: "Alto — lama segura o passo", dist: "Média, com visão rasa acima dos juncos.",
      tat: "A lama permite camuflagem natural em qualquer ponto. Contra drone de varredura, é o melhor terreno da ilha.",
      art: vinheta('<path d="M0 76h300v54H0z" fill="#0a1d20"/>' +
        '<path d="M0 76q40-8 80 0t80 0t80 0t60 0v-8H0z" fill="#0d2224"/>' +
        '<g stroke="#2a5a4a" stroke-width="1.4" fill="none" opacity=".9">' +
        '<path d="M22 84q-2-18 2-28M28 84q2-16-1-24M34 84q-2-14 1-20"/>' +
        '<path d="M86 88q-3-22 2-34M92 88q3-19-1-28M98 88q-2-16 1-23"/>' +
        '<path d="M168 86q-2-20 2-30M174 86q3-17-1-25M180 86q-2-14 1-20"/>' +
        '<path d="M244 90q-3-24 2-36M250 90q3-20-1-30M256 90q-2-15 1-22"/></g>' +
        '<g stroke="#1d4a4c" stroke-width="1.2" opacity=".8" fill="none">' +
        '<path d="M10 100q16-5 32 0t32 0M120 110q16-5 32 0t32 0M210 98q16-5 32 0t32 0M60 120q16-5 32 0t32 0"/></g>') },
    { b: "#8a7a5a", n: "Falésias", en: "High cliffs",
      d: "Paredões de rocha caindo direto no mar. Poucos caminhos, grandes desníveis e visão longa para quem estiver no alto.",
      cob: ["baixa", "Baixa"], folego: "Alto — escalada e contorno", dist: "Longa, em ambos os sentidos.",
      tat: "Excelente ponto de observação e péssimo lugar para ser encontrado. Paraquedas transforma o penhasco em rota de fuga.",
      art: vinheta('<path d="M0 104h300v26H0z" fill="#0a1d20"/>' +
        '<path d="M0 30h96l14 26 10 48H0z" fill="#132522" stroke="#2a4448" stroke-width="1.6"/>' +
        '<path d="M176 46h124v58H190l-14-30z" fill="#11201e" stroke="#2a4448" stroke-width="1.6"/>' +
        '<g stroke="#213b38" stroke-width="1" opacity=".85" fill="none">' +
        '<path d="M22 34v68M48 32v72M74 36v66M206 50v54M238 48v56M270 50v54"/></g>' +
        '<g stroke="#1d4a4c" stroke-width="1.2" opacity=".7" fill="none">' +
        '<path d="M112 114q14-5 28 0t28 0M120 124q14-5 28 0t28 0"/></g>' +
        '<g fill="#2a5a4a" opacity=".75"><path d="M16 30l5-9 5 9ZM60 30l5-10 5 10ZM246 46l5-9 5 9ZM282 46l5-10 5 10Z"/></g>') },
    { b: "#a07a48", n: "Sombra de chuva", en: "Rain shadow",
      d: "O lado seco da montanha: solo árido, arbustos esparsos e rocha exposta. A chuva que rega o resto de Auroa não chega aqui.",
      cob: ["baixa", "Baixa"], folego: "Médio", dist: "Longa. Quase nada bloqueia linha de visão.",
      tat: "Terreno de atirador de elite e de ninguém mais. Sem cobertura vegetal, a única proteção é o relevo — use as depressões.",
      art: vinheta('<path d="M0 88h300v42H0z" fill="#141a12"/>' +
        '<path d="M0 88q60-22 120-14t100-20 80 8v-4H0z" fill="#181f14"/>' +
        '<g fill="#2b2a1a" opacity=".9"><path d="M40 88l10-16 10 16ZM150 84l14-20 14 20ZM248 88l9-14 9 14Z"/></g>' +
        '<g stroke="#3d3a22" stroke-width="1.4" fill="none" opacity=".85">' +
        '<path d="M86 88q-4-10 0-14M92 88q4-9 0-12M198 88q-4-11 0-15M204 88q4-9 0-12M22 96q-3-8 0-11"/></g>' +
        '<g stroke="#2b2a1a" stroke-width="1" opacity=".6"><path d="M14 108h40M84 116h52M170 106h44M232 118h46"/></g>' +
        '<circle cx="256" cy="30" r="14" fill="none" stroke="#6b5a2a" stroke-width="1.6" opacity=".7"/>' +
        '<g stroke="#6b5a2a" stroke-width="1.2" opacity=".5"><path d="M256 8v6M256 46v6M234 30h-6M284 30h-6"/></g>') },
    { b: "#3d7f86", n: "Fiordes", en: "Fjords",
      d: "Braços de mar entrando entre paredes altíssimas. Água fria, encostas verticais e uma acústica que carrega som muito longe.",
      cob: ["media", "Média"], folego: "Alto", dist: "Longa ao longo do canal, nula nas laterais.",
      tat: "A aproximação por água é quase sempre a menos vigiada. Em compensação, o som viaja — motor de barco aqui se ouve de longe.",
      art: vinheta('<path d="M0 0h110l18 86 8 44H0z" fill="#11221f" stroke="#2a4448" stroke-width="1.5"/>' +
        '<path d="M300 0H186l-16 86-6 44h136z" fill="#0f1f1c" stroke="#2a4448" stroke-width="1.5"/>' +
        '<path d="M128 86h44l-8 44h-28z" fill="#0a1d20"/>' +
        '<g stroke="#213b38" stroke-width="1" opacity=".8" fill="none">' +
        '<path d="M26 4v110M56 2v112M86 6v106M212 6v108M244 2v112M274 6v106"/></g>' +
        '<g stroke="#1d4a4c" stroke-width="1.1" opacity=".75" fill="none">' +
        '<path d="M134 100q8-4 16 0t16 0M132 112q8-4 16 0t16 0M136 122q8-4 16 0t16 0"/></g>' +
        '<g fill="#2a5a4a" opacity=".7"><path d="M18 0l5 8h-10zM70 2l5 9h-10zM230 0l5 8h-10zM280 2l5 9h-10z"/></g>') },
    { b: "#8fa8b0", n: "Tundra alta", en: "High tundra",
      d: "Acima da linha das árvores: neve, rocha nua e vento. Nenhuma vegetação para se esconder e visibilidade até onde a vista alcança.",
      cob: ["baixa", "Nenhuma"], folego: "Muito alto — altitude e inclinação", dist: "Máxima do jogo.",
      tat: "A neve permite camuflagem natural deitado, e essa é literalmente a única cobertura. Atravesse de noite ou não atravesse.",
      art: vinheta('<path d="M0 94h300v36H0z" fill="#16201f"/>' +
        '<path d="M0 94q50-12 98-6t104-18 98 10v-6H0z" fill="#1b2726"/>' +
        '<path d="M-10 58L58 18l40 30 52-38 62 46 54-26 44 32v22H-10z" fill="#101a1c" stroke="#2a4448" stroke-width="1.4"/>' +
        '<path d="M58 18l14 10-12 8-10-10zM150 10l16 12-14 9-12-12zM264 32l12 9-10 7-9-9z" fill="#8fa8b0" opacity=".3"/>' +
        '<g fill="#2a3a3c" opacity=".85"><path d="M30 94l8-11 8 11ZM196 92l7-10 7 10ZM252 96l6-9 6 9Z"/></g>' +
        '<g stroke="#2a4448" stroke-width="1" opacity=".5"><path d="M10 110h46M96 118h56M186 108h48M244 120h50"/></g>' +
        '<g stroke="#4a6a70" stroke-width=".9" opacity=".4"><path d="M20 34h36M40 46h40M210 24h38M236 40h44"/></g>') },
    { b: "#8f9a4a", n: "Campinas", en: "Meadowlands",
      d: "Colinas suaves cobertas de capim, com bosques isolados e muita linha de visão média. O terreno mais comum entre uma coisa e outra.",
      cob: ["media", "Média"], folego: "Baixo — o terreno mais fácil de atravessar", dist: "Média a longa.",
      tat: "Mato alto permite deitar e sumir, mas em pé você é silhueta contra o horizonte. Aqui a postura decide tudo.",
      art: vinheta('<path d="M0 82q60-24 122-10t90-22 88 14v66H0z" fill="#182014"/>' +
        '<path d="M0 100q70-18 140-4t160-8v42H0z" fill="#1d2718"/>' +
        '<g fill="#25301a"><ellipse cx="64" cy="62" rx="20" ry="13"/><ellipse cx="88" cy="66" rx="14" ry="9"/>' +
        '<ellipse cx="226" cy="54" rx="22" ry="14"/><ellipse cx="248" cy="60" rx="15" ry="10"/></g>' +
        '<g stroke="#2f3b1e" stroke-width="2.4" fill="none"><path d="M66 82V66M226 78V58"/></g>' +
        '<g stroke="#3a4a22" stroke-width="1.1" opacity=".8" fill="none">' +
        '<path d="M12 116q-2-12 1-18M18 118q2-11-1-16M124 122q-2-13 1-19M130 124q2-12-1-17M186 114q-2-11 1-17M282 120q-2-12 1-18"/></g>') },
    { b: "#c07a4a", n: "Vulcânico", en: "Extinct volcanoes",
      d: "Cones extintos, campos de rocha escura e encostas sem nada crescendo. Terreno acidentado, quebrado e de travessia lenta.",
      cob: ["media", "Média"], folego: "Alto — rocha solta e desnível", dist: "Irregular. Muito ponto cego atrás de formação.",
      tat: "A rocha quebrada gera cobertura dura de graça — a melhor coisa disponível quando o tiroteio já começou.",
      art: vinheta('<path d="M0 96h300v34H0z" fill="#150f0e"/>' +
        '<path d="M-10 96L86 26l34 24 28-18 62 44 56-28 44 48z" fill="#1a1412" stroke="#3a2a24" stroke-width="1.5"/>' +
        '<path d="M86 26l-16 14h32z" fill="#2a1a14" opacity=".9"/>' +
        '<g fill="#241a16"><path d="M24 96l12-16 12 16ZM128 96l10-14 10 14ZM204 96l14-18 14 18ZM262 96l9-12 9 12Z"/></g>' +
        '<g stroke="#3a2a24" stroke-width="1" opacity=".75"><path d="M14 108h38M74 118h48M160 106h44M226 120h52"/></g>' +
        '<g fill="#c07a4a" opacity=".22"><circle cx="86" cy="22" r="10"/></g>' +
        '<g stroke="#5a3a2a" stroke-width=".9" opacity=".45"><path d="M86 12v-8M76 14l-5-6M96 14l5-6"/></g>') }
  ];

  D.reg({
    id: "v07", cod: "07", nome: "A ilha", arquivo: "auroa.dat",
    titulo: "A ilha", subtitulo: "um arquipélago que era um laboratório", cor: "#4f9155",
    desc: "Os oito biomas ilustrados, o perfil de travessia da costa ao cume, Erewhon e a lógica das províncias.",
    lede: [
      "Auroa foi construída como ilha-laboratório pela Skell Technology: tecnologia limpa, autonomia total e drones para tudo.",
      "O que sobrou é um arquipélago do tamanho de uma província, com uma dúzia de biomas, uma infraestrutura futurista abandonada no meio do mato e uma empresa militar decidindo quem circula."
    ],
    saltos: [["perfil", "Travessia"], ["biomas", "Biomas"], ["erewhon", "Erewhon"], ["provincias", "Províncias"], ["deslocamento", "Deslocamento"]],
    render: function () {
      var h = "";

      h += D.transmissao("Com exploração não guiada, o relevo vira linguagem.",
        "Sem seta no mapa, você chega aos lugares reconhecendo o terreno: a crista que separa dois vales, o rio que desce para o fiorde, a linha onde a floresta vira tundra. Ler Auroa deixa de ser opcional e passa a ser navegação.");

      h += '<section id="perfil">' +
        D.cabSecao("01 · TRAVESSIA", "Da água ao cume, e o que cada faixa cobra",
          "Perfil esquemático de uma travessia típica numa ilha grande de Auroa. As faixas não seguem uma ordem rígida no mapa real — a sombra de chuva, por exemplo, depende do lado da montanha, não da altitude. O que o desenho mostra de verdade é o preço de cada terreno: cobertura, fôlego e visibilidade.") +
        '<div class="perfil-t" id="perfil-t"></div></section>';

      h += D.sinal();

      h += '<section id="biomas">' +
        D.cabSecao("02 · BIOMAS", "Oito terrenos, oito comportamentos",
          "Auroa reúne floresta tropical, pântano salgado, falésias, sombra de chuva árida, fiordes, tundra alta, campinas e vulcões extintos. Cada ficha traz o que aquele terreno faz com a sua furtividade, com o seu fôlego e com a distância em que você consegue trabalhar.") +
        '<div class="biomas">' + BIOMAS.map(function (b) {
          return '<article class="bioma" style="--b:' + b.b + '"><div class="vinheta">' + b.art + "</div>" +
            '<div class="txt"><h3>' + b.n + '</h3><span class="en">' + b.en + "</span><p>" + b.d + "</p>" +
            '<div class="notas">' +
            '<div><b>Cobertura</b><span class="cob ' + b.cob[0] + '">' + b.cob[1] + "</span></div>" +
            "<div><b>Fôlego</b><span>" + b.folego + "</span></div>" +
            "<div><b>Distância</b><span>" + b.dist + "</span></div>" +
            "<div><b>Tático</b><span>" + b.tat + "</span></div>" +
            "</div></div></article>";
        }).join("") + "</div>" +
        D.nota("A leitura que atravessa todas as fichas: <b>cobertura e visibilidade são a mesma moeda vista dos dois lados.</b> Onde você se esconde bem, você também enxerga mal — e o inimigo que você não marcou com o drone vai estar exatamente no ponto que a vegetação escondeu.") +
        "</section>";

      h += D.sinal();

      h += '<section id="erewhon">' +
        D.cabSecao("03 · EREWHON", "A caverna que virou cidade") +
        '<div class="sub-body"><div>' +
        '<p class="creed">O único lugar de Auroa onde ninguém está te procurando<cite>Monte Hodgson · sistema de cavernas</cite></p>' +
        '<p style="margin-top:1.2rem">Erewhon é um sistema de cavernas dentro do <b>Monte Hodgson</b>, protegido por uma subida íngreme o bastante para desencorajar visita. Ali se abrigaram os <b>Homesteaders</b> — colonos que abandonaram suas terras quando a segurança da ilha virou ocupação — junto com quem mais quis escapar.</p>' +
        "<p>Funciona como a sua base: loja, oficina, missões, personagens que dão contexto e o único ponto do mapa onde nada tenta te matar. É também onde os projetos de arma que você achou pela ilha viram equipamento de verdade.</p>" +
        "<p>Quem você encontra lá: <b>Maria Schulz</b> cuida da loja, <b>Mads Schulz</b> lidera os Homesteaders e o <b>Sargento-Mor Josiah Hill</b> distribui os primeiros objetivos. Também circulam por ali a engenheira Joanna Jericho, a sargento Rowan Brown e um advogado ex-Skell, Emmett Benton.</p>" +
        '</div><div class="kit">' +
        '<div class="card"><h4>O que fazer em toda visita</h4>' +
        '<div class="ability"><b>Entregar projetos</b><span>Todo projeto de arma encontrado vira item disponível na loja depois de passar pela Maria.</span></div>' +
        '<div class="ability"><b>Conversar com todo mundo</b><span>Os personagens abrem missões e atualizam a lista conforme você avança. Voltar periodicamente rende trabalho novo.</span></div>' +
        '<div class="ability"><b>Reabastecer</b><span>Munição, consumíveis e componentes. Sair de Erewhon com estoque cheio evita abortar operação no meio.</span></div>' +
        '<div class="ability"><b>Revisar o conjunto</b><span>É zona de equipamento: o lugar certo para montar a arma para o tipo de missão que você vai pegar.</span></div></div>' +
        '<p class="warn"><b>Nota de acesso.</b> Erewhon é ponto de viagem rápida. Se você restringiu bivaques e garagem na configuração, considere abrir uma exceção mental para ele — o trajeto até lá é longo e não acrescenta nada à experiência depois da terceira vez.</p>' +
        "</div></div></section>";

      h += D.sinal();

      h += '<section id="provincias">' +
        D.cabSecao("04 · PROVÍNCIAS", "Como a ilha é dividida",
          "A ilha principal chama-se <b>Maunga Nui</b> e está repartida em províncias nomeadas. Elas não seguem um critério só: algumas existem pelo bioma, outras pela função industrial, outras porque algo aconteceu ali. Com exploração não guiada, o nome da província costuma ser a única pista que a missão te dá — vale conhecer a lista.") +
        '<div class="provincias">' +
        prov("Montanha", "Mount Hodgson", "A província montanhosa do centro-norte, com o Twin Falls Mountain e, escondida embaixo dele, <b>Erewhon</b>. Subida íngreme: a mesma coisa que protege a base é o seu maior consumidor de fôlego. Também concentra mineração e um centro de controle.") +
        prov("Costa", "Smuggler Coves", "Enseadas, penínsulas e um forte espanhol. Porto de Maunga Nui e pátio de carga — movimento de barco constante, e bastante coisa velha e abandonada para usar como cobertura.") +
        prov("Pântano", "Sinking Country", "Canais, baías e mangue no sul. É onde está a <b>rede antiaérea</b>: três sítios de míssil, estação de radar e ruínas antiaéreas. Se você pretende voar em algum momento, este é o lugar a desmontar primeiro.") +
        prov("Pântano", "Fen Bog", "Brejo e fazendas a leste. Zona de testes, centro de reciclagem, parque fotovoltaico e várias estações de drone — densidade mecânica alta em terreno que engole som.") +
        prov("Vale", "New Argyll", "Terra de vinícola, cervejaria e processamento de alimento, com toponímia escocesa. Menos militarizada que o resto, e com a propriedade da família Skell.") +
        prov("Geleira", "Silent Mountain", "Picos, geleiras e minas. Aqui estão a <b>fazenda de dados de Auroa</b>, o controle da intranet e o controle do cabo submarino — a infraestrutura que mantém a ilha desconectada do mundo.") +
        prov("Litoral", "Wild Coast", "Colinas e enseadas a oeste, organizadas em torno de fábrica de motores e centro de pesquisa. Terreno aberto: boa visão para os dois lados.") +
        prov("Cidade", "Infinity", "A cidade da Skell — distritos residenciais com nome de estrela, sede da empresa, centro médico, museu e o <b>aeroporto de Auroa</b>. É o ambiente urbano do jogo, e o mais denso em câmera e ponto de checagem.") +
        prov("Costa", "Whalers Bay", "Antiga baía baleeira ao norte, com picos e rios. Menos construída, mais acidentada.") +
        prov("Ilhas", "Windy Islands · Darkwood · Golem · Egg · Moa", "Fora da ilha principal. <b>Windy Islands</b> são fiordes ao sul; <b>Darkwood</b> fica ao norte, junto a um vulcão colapsado; <b>Golem Island</b> é o vulcão ativo a nordeste e abriga um programa secreto de drones; <b>Egg</b> e <b>Moa</b> ficam a oeste, e Moa é quase do tamanho da ilha principal.") +
        "</div>" +
        D.nota("A escala: só a Maunga Nui reúne <b>cerca de onze biomas</b> — estuários e pântanos, floresta boreal, montanha nevada, fiorde e vulcão extinto — e cada província carrega dezenas de acidentes geográficos nomeados. Em 2024 o arquipélago abrigava mais de trinta mil pessoas.") +
        "</section>";

      h += D.sinal();

      h += '<section id="deslocamento">' +
        D.cabSecao("05 · DESLOCAMENTO", "Atravessar sem ser visto atravessando") +
        '<div class="rp">' +
        '<div class="rp-card"><span class="k">A pé</span><h4>Silencioso e caro</h4><p>O único jeito que não denuncia nada. Suba pela curva de nível em vez de encarar a ladeira: contornar custa tempo, subir custa a sua mira nos dois minutos seguintes.</p></div>' +
        '<div class="rp-card"><span class="k">Terrestre</span><h4>Rápido e barulhento</h4><p>Veículo cobre distância e desaparece com furtividade. Estacione longe do perímetro — motor parado perto de base é o mesmo que bandeira.</p></div>' +
        '<div class="rp-card"><span class="k">Blindado</span><h4>Quando contornar não serve</h4><p>O <b>IC-8 Incursion</b> é um transporte de oito rodas com canhão automático, blindado o bastante para trocar tiro com um Behemoth e capaz de destruir num tiro veículo comum, drone de solo, drone aéreo e gente a descoberto. O <b>LC-4 Coercion</b> cumpre papel parecido. Não são ferramentas de infiltração — são a resposta para o que a infiltração não resolve.</p></div>' +
        '<div class="rp-card"><span class="k">Aéreo</span><h4>Cômodo e exposto</h4><p>Helicóptero resolve travessia entre ilhas e chama atenção de tudo que voa. Aterrisse em vale fechado, nunca na aproximação direta do alvo.</p></div>' +
        '<div class="rp-card"><span class="k">Água</span><h4>A rota esquecida</h4><p>Nadar e barco são as aproximações menos vigiadas do jogo. Muita base costeira tem a guarda voltada para o interior — o mar é onde ninguém olha.</p></div>' +
        '<div class="rp-card"><span class="k">Paraquedas</span><h4>Descer, não subir</h4><p>Transforma penhasco em atalho e em rota de fuga. Sem ele, a mesma queda é morte — é por isso que está alto na ordem de perícias.</p></div>' +
        '<div class="rp-card"><span class="k">Viagem rápida</span><h4>Entre bivaques</h4><p>Todo bivaque descoberto vira ponto de viagem. Procurar a fumaça ao atravessar uma região nova é o investimento de trinta segundos que economiza horas depois.</p></div>' +
        "</div></section>";

      return h;
    },
    depois: function () { perfilTravessia(); }
  });

  function prov(tipo, titulo, texto) {
    return '<div class="prov"><span class="tipo">' + tipo + "</span><h4>" + titulo + "</h4><p>" + texto + "</p></div>";
  }

  function perfilTravessia() {
    var alvo = D.el("perfil-t");
    if (!alvo) return;
    var W = 980, H = 330, base = 268, g = "", r = D.prng(909);

    var pontos = [
      [0, base + 22], [70, base + 20], [120, base + 4], [190, base - 12], [268, base - 26],
      [340, base - 52], [420, base - 64], [500, base - 96], [580, base - 118],
      [660, base - 158], [740, base - 176], [820, base - 208], [900, base - 228], [980, base - 236]
    ];
    function alturaEm(x) {
      for (var i = 0; i < pontos.length - 1; i++) {
        if (x >= pontos[i][0] && x <= pontos[i + 1][0]) {
          var t = (x - pontos[i][0]) / (pontos[i + 1][0] - pontos[i][0]);
          return pontos[i][1] + (pontos[i + 1][1] - pontos[i][1]) * t;
        }
      }
      return base;
    }

    g += '<rect width="' + W + '" height="' + H + '" fill="#060c0d"/>';
    g += '<rect x="0" y="' + (base + 12) + '" width="120" height="' + (H - base - 12) + '" fill="#0a1d20"/>';
    g += '<g stroke="#1d3437" stroke-width="1" opacity=".7"><path d="M8 ' + (base + 30) + "q10 -4 20 0t20 0t20 0M8 " + (base + 42) + 'q10 -4 20 0t20 0t20 0"/></g>';
    g += '<path d="M' + pontos.map(function (p) { return p[0] + " " + p[1]; }).join("L") +
      "L980 " + H + "L0 " + H + 'Z" fill="#0d1e1f" stroke="#2a4448" stroke-width="2"/>';

    var FAIXAS = [
      { x0: 0, x1: 120, nome: "Mar", cob: "—", cor: "#3d7f86" },
      { x0: 120, x1: 268, nome: "Pântano salgado", cob: "Alta", cor: "#5f8f5a" },
      { x0: 268, x1: 460, nome: "Floresta tropical", cob: "Alta", cor: "#4f9155" },
      { x0: 460, x1: 620, nome: "Campinas", cob: "Média", cor: "#8f9a4a" },
      { x0: 620, x1: 760, nome: "Falésias e fiordes", cob: "Baixa", cor: "#8a7a5a" },
      { x0: 760, x1: 880, nome: "Sombra de chuva", cob: "Baixa", cor: "#a07a48" },
      { x0: 880, x1: 980, nome: "Tundra alta", cob: "Nenhuma", cor: "#8fa8b0" }
    ];
    FAIXAS.forEach(function (f, i) {
      if (i > 0) g += '<path d="M' + f.x0 + " 40V" + (H - 44) + '" stroke="#1d3437" stroke-width="1" stroke-dasharray="3 6" opacity=".7"/>';
      var cx = (f.x0 + f.x1) / 2;
      g += '<text x="' + cx + '" y="' + (H - 26) + '" text-anchor="middle" fill="' + f.cor +
        '" font-family="Saira Condensed, sans-serif" font-size="14" letter-spacing=".8">' + f.nome.toUpperCase() + "</text>";
      g += '<text x="' + cx + '" y="' + (H - 11) + '" text-anchor="middle" fill="#7b8e8b" ' +
        'font-family="JetBrains Mono, monospace" font-size="8.5" letter-spacing="1.2">COBERTURA ' + f.cob.toUpperCase() + "</text>";
    });

    function conifera(x, y, hh, cor, op) {
      var w = hh * .4;
      return '<path d="M' + x + " " + (y - hh) + "L" + (x + w) + " " + y + "H" + (x - w) + 'Z" fill="' + cor + '" opacity="' + op + '"/>';
    }
    function palmeira(x, y, hh, cor, op) {
      return '<g stroke="' + cor + '" stroke-width="1.6" fill="none" opacity="' + op + '">' +
        '<path d="M' + x + " " + y + "q2 -" + (hh / 2) + " 0 -" + hh + '"/>' +
        '<path d="M' + x + " " + (y - hh) + "q-11 -5 -16 2M" + x + " " + (y - hh) + "q11 -5 16 2M" +
        x + " " + (y - hh) + "q-8 -9 -3 -13M" + x + " " + (y - hh) + 'q8 -9 3 -13"/></g>';
    }
    function junco(x, y, cor) {
      return '<g stroke="' + cor + '" stroke-width="1.2" fill="none" opacity=".8">' +
        '<path d="M' + x + " " + y + "q-1 -9 1 -14M" + (x + 4) + " " + y + "q1 -8 -1 -12M" + (x - 4) + " " + y + 'q-1 -7 1 -11"/></g>';
    }

    for (var x = 128; x < 262; x += 15) g += junco(x, alturaEm(x), "#5f8f5a");
    for (var x2 = 274; x2 < 456; x2 += 19) g += palmeira(x2, alturaEm(x2), 22 + r() * 12, "#4f9155", .85);
    for (var x3 = 466; x3 < 616; x3 += 26) g += conifera(x3, alturaEm(x3), 12 + r() * 8, "#8f9a4a", .7);
    for (var x4 = 628; x4 < 752; x4 += 30) g += '<path d="M' + x4 + " " + alturaEm(x4) + 'l5 -9 6 9Z" fill="#8a7a5a" opacity=".7"/>';
    for (var x5 = 890; x5 < 976; x5 += 22) g += '<path d="M' + x5 + " " + alturaEm(x5) + 'l7 -6 7 6Z" fill="#8fa8b0" opacity=".55"/>';
    g += '<path d="M860 ' + alturaEm(860) + "L980 " + alturaEm(980) + "V" + (alturaEm(980) + 16) + "L860 " +
      (alturaEm(860) + 14) + 'Z" fill="#8fa8b0" opacity=".22"/>';

    g += '<g stroke="#1d3437" stroke-width="1" opacity=".5"><path d="M0 ' + (base - 60) + "H980M0 " + (base - 130) +
      "H980M0 " + (base - 200) + 'H980" stroke-dasharray="2 8"/></g>';
    g += '<g fill="#3d5f5f" font-family="JetBrains Mono, monospace" font-size="9">' +
      '<text x="8" y="' + (base - 64) + '">300 m</text><text x="8" y="' + (base - 134) + '">900 m</text>' +
      '<text x="8" y="' + (base - 204) + '">1.500 m</text></g>';
    g += '<text x="24" y="30" fill="#4ec8bb" font-family="JetBrains Mono, monospace" font-size="10" letter-spacing="3" opacity=".7">PERFIL DE TRAVESSIA · ESQUEMÁTICO</text>';
    g += '<text x="956" y="30" text-anchor="end" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.6">← ONDE VOCÊ SE ESCONDE · ONDE VOCÊ ENXERGA →</text>';

    alvo.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="Perfil esquemático de travessia de Auroa, do mar à tundra alta, mostrando a cobertura vegetal diminuindo conforme a altitude aumenta">' + g + "</svg>";
  }

  /* ═══════════════════════════════════════════════════════════
     VOLUME 08 · A ROTA
     ═══════════════════════════════════════════════════════════ */

  var MARCOS = [
    { t: "Queda", h: "0 – 0,5 h" }, { t: "Erewhon", h: "0,5 – 2 h" }, { t: "Ferramentas", h: "2 – 6 h" },
    { t: "Autonomia", h: "6 – 12 h" }, { t: "Operação", h: "12 – 25 h" }, { t: "Profundidade", h: "25 – 40 h" },
    { t: "Depois", h: "40 h +" }
  ];

  var ETAPAS = [
    { e: "var(--ruim)", h: "0 – 0,5 h", n: "A queda", obj: "Marco 01",
      d: "O jogo começa com você sem nada, sozinho e machucado. <b>É um tutorial disfarçado de desespero</b> e ele ensina exatamente as três coisas certas: que ferimento é diferente de vida, que deitar no mato funciona e que correr em campo aberto não.",
      faz: ["Use este trecho para conferir a configuração. Ainda dá tempo de ajustar tudo.",
        "Repare no som antes de olhar a tela. É o hábito que o resto da partida vai cobrar.",
        "Não tente lutar. Nesta parte, esconder-se é a mecânica sendo ensinada."] },
    { e: "var(--sub)", h: "0,5 – 2 h", n: "Erewhon", obj: "Marco 02",
      d: "Chegar à caverna dos Homesteaders abre a estrutura inteira do jogo: loja, missões, personagens e o primeiro conjunto de objetivos. <b>Converse com todo mundo antes de sair</b> — é assim que a lista de trabalho aparece.",
      faz: ["Fale com o Sargento-Mor Josiah Hill para os primeiros objetivos.",
        "Conheça a loja da Maria Schulz e entenda o laço de projetos.",
        "Monte o primeiro conjunto de armas com o que tiver. Não espere pela arma perfeita.",
        "Escolha uma classe para começar. A troca é livre depois, então não trave nisso."] },
    { e: "#7bd36a", h: "2 – 6 h", n: "As ferramentas", obj: "Marco 03",
      d: "A fase mais importante da partida e a que mais gente atravessa sem perceber. <b>Aqui você compra capacidades, não números</b> — e é o que decide se as próximas trinta horas vão ser boas.",
      faz: ["Drone de tiro sincronizado. Antes de qualquer outra coisa.",
        "Melhorias de alcance e altitude do drone de reconhecimento.",
        "Primeiros encaixes de vantagem, para as vantagens deixarem de ser enfeite.",
        "Encontre três ou quatro bivaques e aprenda a procurar a fumaça."] },
    { e: "var(--medio)", h: "6 – 12 h", n: "Autonomia", obj: "Marco 04",
      d: "O ponto em que você deixa de depender de Erewhon. Capacidade de munição, visão noturna, paraquedas e rações avançadas somados significam <b>operar por horas longe de qualquer base amiga</b>.",
      faz: ["Paraquedas e visão noturna, nessa ordem de prioridade.",
        "Capacidade de munição — a única escassez real do modo imersivo.",
        "Fabrique rações antes de cada saída, não quando acabar o estoque.",
        "Experimente Echelon e Engenheiro. São as duas classes que mais mudam o que é possível."] },
    { e: "#7aa7e8", h: "12 – 25 h", n: "Operação", obj: "Marco 05",
      d: "O corpo do jogo: as missões principais e as linhas de facção, região por região. <b>Deixe o mapa te levar</b> — com exploração não guiada, o caminho até o objetivo é onde a maior parte do jogo acontece.",
      faz: ["Siga uma linha de missão por vez até o fim, em vez de alternar entre três.",
        "Revisite Erewhon e os campos de facção a cada duas ou três missões: a lista atualiza.",
        "Entregue todo projeto de arma que encontrar. É o laço de progressão que substitui o espólio.",
        "Ajuste a configuração se alguma muleta ainda estiver ligada. Este é o momento do desmame."] },
    { e: "#c9a227", h: "25 – 40 h", n: "Profundidade", obj: "Marco 06",
      d: "Regiões mais duras, alvos de alto valor e as províncias de produção de drones. <b>É aqui que o conjunto quebrador começa a valer o espaço na mochila</b>, e onde Behemoth deixa de ser curiosidade.",
      faz: ["Monte um segundo conjunto dedicado a alvo mecânico, com pulso e explosivo.",
        "Trabalhe as províncias industriais com Engenheiro equipado.",
        "Suba a dificuldade dos inimigos se Extremo já estiver confortável.",
        "Considere restringir bivaques agora, se a viagem rápida estiver encurtando demais a ilha."] },
    { e: "var(--muted)", h: "40 h +", n: "Depois", obj: "Marco 07",
      d: "Conteúdo de fim de jogo, desafios de classe, caçadas e a ilha em modo de repetição. <b>Não há um fim de jogo obrigatório</b> — Breakpoint continua servindo bases para invadir indefinidamente.",
      faz: ["Desafios de classe, se quiser subir as sete a sério.",
        "Refaça regiões conhecidas com configuração mais dura, a título de comparação.",
        "Com a Operação Motherland instalada, é aqui que o modo de conquista entra."] }
  ];

  var ITENS = [
    ["Conferir o Ghost Experience antes de jogar", "Nível de equipamento desligado é a única escolha que realmente não dá para adiar."],
    ["Chegar a Erewhon e falar com todos", "É o que destrava a lista de missões inteira. Vale dez minutos de conversa."],
    ["Montar o primeiro conjunto de armas", "Fuzil suprimido, algo de longo alcance e pistola suprimida. Sem perfeccionismo."],
    ["Comprar o drone de tiro sincronizado", "A perícia mais importante do jogo para quem joga sozinho. Não adie."],
    ["Melhorar alcance e altitude do drone", "Com marcador de inimigo desligado, isto é literalmente a sua visão."],
    ["Encontrar três bivaques", "Procure a fumaça. Cada um vira ponto de viagem e base de preparação."],
    ["Fabricar rações pela primeira vez", "Cate recurso no caminho e cozinhe antes de sair. Use, não guarde."],
    ["Invadir uma base inteira em silêncio", "O exercício que ensina mais que qualquer missão. Drone, ordem, corpo escondido, saída."],
    ["Abrir os encaixes de vantagem", "Sem eles, as vantagens que você comprar ficam paradas no menu."],
    ["Entregar o primeiro projeto de arma", "Leve à loja da Maria Schulz e entenda como o laço funciona."],
    ["Sobreviver a um Azraël deitado na lama", "Ouça o zumbido, deite, camufle e espere. O reflexo que evita metade das perseguições."],
    ["Desligar mais uma muleta do HUD", "Quando o drone já for reflexo, desligue o marcador de inimigo. É aqui que o jogo muda."]
  ];

  var CHAVE_LISTA = "auroa-rota-v1";

  D.reg({
    id: "v08", cod: "08", nome: "A rota", arquivo: "progressao.dat",
    titulo: "A rota", subtitulo: "o que fazer, e em que ordem", cor: "var(--medio)",
    desc: "A ordem de progressão que funciona, das primeiras horas ao fim, com lista de conferência e as armadilhas que custam tempo.",
    lede: [
      "Breakpoint abre o mapa inteiro quase de imediato e não tranca quase nada por nível. Isso é liberdade e é armadilha.",
      "Sem gear score para dizer “você chegou cedo demais”, a única coisa que organiza a partida é uma decisão sua sobre a ordem. Esta é a ordem que funciona."
    ],
    saltos: [["tracado", "Traçado"], ["etapas", "Etapas"], ["lista", "Conferência"], ["armadilhas", "Armadilhas"]],
    render: function () {
      var h = "";

      h += D.transmissao("Capacidade antes de porcentagem. Sempre.",
        "Num jogo onde dois tiros matam, mais dez por cento de dano não muda nada. Mais alcance de drone, drone de tiro sincronizado, paraquedas e visão noturna mudam o que você consegue fazer. Toda a rota abaixo é uma consequência dessa única frase.");

      h += '<section id="tracado">' +
        D.cabSecao("01 · TRAÇADO", "Sete marcos, do naufrágio ao fim",
          "A linha não é uma trilha no mapa — é o percurso da partida. As horas são aproximadas e valem para um ritmo de exploração não guiada, que é consideravelmente mais lento que o guiado.") +
        '<div class="tracado" id="tracado"></div></section>';

      h += D.sinal();

      h += '<section id="etapas">' +
        D.cabSecao("02 · ETAPAS", "Cada marco, por dentro") +
        '<div class="etapas">' + ETAPAS.map(function (e) {
          return '<article class="etapa" style="--e:' + e.e + '">' +
            '<div class="cab"><span class="hora">' + e.h + "</span><h3>" + e.n + '</h3><span class="obj">' + e.obj + "</span></div>" +
            "<p>" + e.d + '</p><div class="faz">' +
            e.faz.map(function (f) { return "<div><i>›</i><span>" + f + "</span></div>"; }).join("") +
            "</div></article>";
        }).join("") + "</div></section>";

      h += D.sinal();

      h += '<section id="lista">' +
        D.cabSecao("03 · CONFERÊNCIA", "As doze primeiras coisas",
          "Lista de conferência das primeiras horas, na ordem em que vale fazer. Marque conforme for cumprindo — o navegador guarda o progresso só para você, neste aparelho.") +
        '<div class="lista"><div class="cab"><span>Progresso inicial</span><b id="contador"></b></div>' +
        '<div class="progresso"><i id="barra"></i></div><div id="itens"></div>' +
        '<div class="rodape-l"><button type="button" class="btn ghost" id="limpar">Limpar marcações</button></div></div></section>';

      h += D.sinal();

      h += '<section id="armadilhas">' +
        D.cabSecao("04 · ARMADILHAS", "Quatro jeitos de estragar a partida",
          "Nenhuma delas quebra o jogo. Todas custam horas e, o que é pior, custam a sensação que você estava procurando ao escolher o modo imersivo.") +
        '<div class="armadilhas">' +
        armadilha("Armadilha 01", "Limpar todos os ícones do mapa",
          "Auroa tem centenas de pontos de interesse. Varrer a região inteira antes de avançar na missão transforma um jogo tático numa lista de tarefas, e é a causa número um de abandono.",
          "Faça o que estiver no caminho do objetivo. O resto continua lá quando você voltar.") +
        armadilha("Armadilha 02", "Esperar a arma perfeita",
          "Sem nível de equipamento, a diferença entre duas armas da mesma categoria é pequena. Adiar o jogo à procura do projeto ideal é gastar horas por um ganho que não existe.",
          "Monte com o que tem, use por dez horas, troque se incomodar. Familiaridade vale mais que ficha técnica.") +
        armadilha("Armadilha 03", "Gastar perícia em porcentagem",
          "Mais dano, mais experiência, melhor espólio. Nenhum dos três muda nada num jogo onde dois tiros matam e raridade não existe.",
          "Capacidade antes de porcentagem. Drone, tiro sincronizado, paraquedas, visão noturna, munição.") +
        armadilha("Armadilha 04", "Insistir depois do alerta",
          "A base subiu dois degraus, você perdeu a furtividade e continua tentando terminar o objetivo. É assim que uma infiltração de dez minutos vira meia hora de perseguição e um recomeço.",
          "Saia do perímetro, deite no mato, espere o alerta baixar e reentre por outro lado. O jogo permite, e é a ferramenta mais subutilizada que existe.") +
        "</div>" +
        D.alerta("Não existe ordem errada, existe ordem cara",
          "Breakpoint não tranca conteúdo por nível e não pune quem vai para o lugar errado. O que este volume evita não é o fracasso — é passar trinta horas fazendo o que não era interessante e concluir que o jogo é que era chato.") +
        "</section>";

      return h;
    },
    depois: function () { tracadoRota(); listaConferencia(); }
  });

  function armadilha(k, titulo, texto, certo) {
    return '<article class="armadilha"><span class="k">' + k + "</span><h4>" + titulo + "</h4><p>" + texto + "</p>" +
      '<p class="certo"><b>Em vez disso</b>' + certo + "</p></article>";
  }

  function tracadoRota() {
    var alvo = D.el("tracado");
    if (!alvo) return;
    var W = 960, H = 300;
    var curva = "M50 232 C150 232 150 96 250 96 S350 232 450 220 S560 92 660 108 S790 216 880 176 L924 164";

    var abre = '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="Traçado sinuoso com sete marcos de progressão, da queda inicial até o conteúdo de fim de jogo">' +
      '<rect width="' + W + '" height="' + H + '" fill="#060c0d"/><g stroke="#12242a" stroke-width="1" opacity=".55">';
    for (var gx = 0; gx <= W; gx += 40) abre += '<path d="M' + gx + " 0V" + H + '"/>';
    for (var gy = 0; gy <= H; gy += 40) abre += '<path d="M0 ' + gy + "H" + W + '"/>';
    abre += "</g>";
    abre += '<path d="' + curva + '" fill="none" stroke="#1d3437" stroke-width="10" stroke-linecap="round"/>';
    abre += '<path id="rota" d="' + curva + '" fill="none" stroke="#4ec8bb" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="10 8" opacity=".85"/>';

    var fecha = '<text x="50" y="278" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2">INÍCIO</text>' +
      '<text x="924" y="278" text-anchor="end" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2">SEM FIM DEFINIDO</text></svg>';

    /* desenha só a curva para poder medi-la de verdade */
    alvo.innerHTML = abre + fecha;
    var caminho = D.el("rota"), total = caminho.getTotalLength(), frag = "";

    MARCOS.forEach(function (m, i) {
      var p = caminho.getPointAtLength(total * (i / (MARCOS.length - 1)));
      var acima = i % 2 === 0, ry = acima ? p.y - 44 : p.y + 44;
      frag += '<line x1="' + p.x.toFixed(1) + '" y1="' + p.y.toFixed(1) + '" x2="' + p.x.toFixed(1) +
        '" y2="' + (acima ? ry + 14 : ry - 22) + '" stroke="#4ec8bb" stroke-width="1" opacity=".35"/>';
      frag += '<circle cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="13" fill="#060c0d" stroke="#4ec8bb" stroke-width="2"/>';
      frag += '<text x="' + p.x.toFixed(1) + '" y="' + (p.y + 4).toFixed(1) + '" text-anchor="middle" fill="#4ec8bb" font-family="JetBrains Mono, monospace" font-size="11">' + (i + 1) + "</text>";
      frag += '<text x="' + p.x.toFixed(1) + '" y="' + ry + '" text-anchor="middle" fill="#dbe6e3" font-family="Saira Condensed, sans-serif" font-size="18" letter-spacing="1">' + m.t.toUpperCase() + "</text>";
      frag += '<text x="' + p.x.toFixed(1) + '" y="' + (ry + 15) + '" text-anchor="middle" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.2">' + m.h + "</text>";
    });

    alvo.innerHTML = abre + frag + fecha;
  }

  function listaConferencia() {
    if (!D.el("itens")) return;
    function ler() {
      try {
        var b = localStorage.getItem(CHAVE_LISTA);
        if (!b) return [];
        var v = JSON.parse(b);
        return Array.isArray(v) ? v : [];
      } catch (e) { return []; }
    }
    function gravar(v) {
      try { localStorage.setItem(CHAVE_LISTA, JSON.stringify(v)); } catch (e) { /* sem persistência */ }
    }
    var marcados = ler();

    D.el("itens").innerHTML = ITENS.map(function (it, i) {
      return '<label class="item"><input type="checkbox" data-i="' + i + '"' +
        (marcados.indexOf(i) >= 0 ? " checked" : "") + ">" +
        "<span><strong>" + it[0] + "</strong><small>" + it[1] + "</small></span></label>";
    }).join("");

    function atualizar() {
      D.el("contador").textContent = marcados.length + " de " + ITENS.length + " concluídos";
      D.el("barra").style.width = (marcados.length / ITENS.length * 100) + "%";
    }
    D.el("itens").addEventListener("change", function (e) {
      var cx = e.target.closest("input[data-i]");
      if (!cx) return;
      var i = parseInt(cx.getAttribute("data-i"), 10), pos = marcados.indexOf(i);
      if (cx.checked && pos < 0) marcados.push(i);
      if (!cx.checked && pos >= 0) marcados.splice(pos, 1);
      gravar(marcados); atualizar();
    });
    D.el("limpar").addEventListener("click", function () {
      marcados = []; gravar(marcados);
      Array.prototype.forEach.call(document.querySelectorAll("#itens input"), function (c) { c.checked = false; });
      atualizar();
    });
    atualizar();
  }

  /* ═══════════════════════════════════════════════════════════
     VOLUME 09 · OS FIOS PERDIDOS
     ═══════════════════════════════════════════════════════════ */

  var CAT = {
    biv: ["Bivaque", "var(--sub)"], furt: ["Furtividade", "#7bd36a"], equip: ["Equipamento", "#c9a227"],
    prog: ["Progressão", "#7aa7e8"], inim: ["Inimigos", "var(--ruim)"], mundo: ["Mundo", "var(--medio)"]
  };

  var SEGREDOS = [
    ["Você escolhe a hora do dia", "No bivaque, ao levantar acampamento. O clima aparece ali como previsão, não como escolha — então a jogada é casar a hora certa com o tempo que já vem vindo. É a alavanca tática mais forte que está inteiramente na sua mão.", "biv"],
    ["Deitar na lama te apaga", "Em vegetação, mato alto, lama ou neve, deitado, você aplica camuflagem natural e some para inimigo e drone. É de graça, está disponível desde o primeiro minuto e resolve o Azraël.", "furt"],
    ["A classe troca de graça, a qualquer hora", "Em qualquer bivaque, sem custo e sem perder progresso. Cada classe guarda o próprio nível. Escolher “errado” no começo não tem consequência nenhuma.", "prog"],
    ["Arma do chão é temporária e pior", "No modo imersivo, arma apanhada em campo não aceita acessório e você a perde ao trocar de conjunto. O seu equipamento de verdade é o projeto montado na oficina.", "equip"],
    ["Acessório vale para a categoria inteira", "Desbloquear um supressor de fuzil de assalto equipa todos os seus fuzis de assalto. O progresso é da família de armas, não da peça — o que muda completamente o que vale a pena procurar.", "equip"],
    ["O alerta baixa se você sair", "Base em alerta não fica em alerta para sempre. Sair do perímetro, deitar no mato e esperar faz o nível cair — e você reentra por outro lado. É a ferramenta mais subutilizada do jogo.", "furt"],
    ["O drone marca câmera também", "Câmeras e drones inimigos contam como alvo marcável. Mapear só as pessoas é como boa parte das infiltrações perfeitas termina em alerta sem explicação.", "furt"],
    ["Supressor não é invisibilidade", "Ele atrasa a localização, não impede. Depois de dois ou três tiros do mesmo ponto eles convergem — e disparar perto de outro guarda alerta esse guarda mesmo suprimido.", "furt"],
    ["Ferimento é diferente de vida", "Vida regenera; ferimento fica. Leve tira estabilidade e fôlego, grave faz sangrar, mancar e só atirar de quadril com uma mão. Bandagem é ilimitada e lenta; seringa é escassa, instantânea e não fecha ferida profunda.", "mundo"],
    ["O Azraël aparece no minimapa antes de chegar", "Ícone vermelho em forma de avião. Dá tempo de deitar. E quando ele te encontra, o minimapa cai e forças são despachadas — é a origem da maioria das perseguições que parecem começar do nada.", "inim"],
    ["Drone de tiro sincronizado existe", "Está no ramo de furtividade, no segundo nível, por um ponto. Marca alvos e dispara junto com você. Para quem joga sozinho, é a perícia mais importante do jogo inteiro.", "prog"],
    ["Corpo encontrado acorda a base", "E não tem pressa: o guarda acha o corpo dez minutos depois, quando você já se acha seguro. Arrastar leva três segundos.", "furt"],
    ["Projeto de arma vira item na loja", "Achou um projeto? Leve para a Maria Schulz em Erewhon. É o laço de progressão que substitui a caça a raridade quando o nível de equipamento está desligado.", "equip"],
    ["Rações são para usar, não guardar", "Efeito longo e reposição barata no bivaque. Fabricar e consumir antes de cada saída é o uso pretendido — guardar para a hora certa é desperdiçar o sistema.", "biv"],
    ["Paraquedas é perícia, não padrão", "Sem comprá-lo, penhasco é morte. Com ele, penhasco é atalho e rota de fuga. Para quem joga sozinho, isso muda o mapa.", "prog"],
    ["O mar é a rota menos vigiada", "Muita base costeira tem a guarda voltada para o interior. Nadar ou chegar de barco contorna o perímetro inteiro — e quase ninguém tenta.", "mundo"],
    ["Bivaque nasce veículo", "Além de curar e fabricar, ele faz surgir transporte terrestre ou aéreo. Deslocamento longo raramente precisa ser feito a pé.", "biv"],
    ["A configuração muda no meio do jogo", "Parâmetros do Ghost Experience, a qualquer momento, inclusive durante uma missão. Nada do que você escolher no começo é definitivo.", "prog"],
    ["Falar com todos em Erewhon atualiza a lista", "Os personagens da base e dos campos de facção liberam trabalho novo conforme você avança. Voltar periodicamente rende missões que não apareceriam sozinhas.", "prog"],
    ["A fumaça do bivaque é visível de longe", "É assim que você encontra acampamentos novos ao atravessar uma região. Procurar fumaça no horizonte é o hábito que povoa o seu mapa de pontos de viagem.", "mundo"]
  ];

  var CILADAS = [
    ["Tirar tudo do HUD no primeiro minuto",
      "Desligar marcador de inimigo antes de o drone virar reflexo produz o pior dos mundos: você entra cego numa base que não mapeou, morre sem entender e conclui que o modo imersivo é injusto.",
      "Desligue na ordem do desmame do volume 01. Marcador de inimigo é o penúltimo degrau, não o primeiro."],
    ["Pente grande com descarte ao recarregar",
      "As duas opções juntas se anulam: quanto maior o carregador, mais munição você joga fora a cada recarga antecipada. Você acaba com capacidade alta e reserva sempre vazia.",
      "Escolha uma. Ou pente grande sem descarte, ou pente padrão com descarte e disciplina de recarga."],
    ["Uma arma principal só, jogando sozinho",
      "A dificuldade tática em Elite reduz para um slot principal. Em grupo isso força especialização; sozinho, significa que a distância errada te deixa sem resposta e sem ninguém para cobrir.",
      "Mantenha duas armas principais. É a única sub-chave do Elite que eu recomendo desfazer."],
    ["Exploração não guiada mais zero marcador de objetivo",
      "Combinadas, as duas te deixam com coordenada e nada mais. É jogável e é ótimo — na segunda partida. Na primeira, some com o tempo que você tinha para aprender os sistemas.",
      "Exploração não guiada, sim. Marcador de objetivo em dinâmico. Você ainda procura, mas sabe para que lado."]
  ];

  var FAQ = [
    ["Dá para jogar tudo sozinho?",
      "<p>Dá, inclusive as missões principais e as linhas de facção. <b>O jogo não exige companheiros para nenhum conteúdo da campanha.</b></p>" +
      "<p>O que muda é o método: sem esquadra, você compensa com drone de reconhecimento, drone de tiro sincronizado e disciplina de rota de saída. Existe conteúdo de grupo pensado para equipe, mas ele fica fora do caminho principal.</p>"],
    ["Qual classe devo escolher para começar?",
      "<p><b>Pantera</b>, no seu perfil. Furtividade reforçada, movimento mais rápido e supressor sem perda de dano em pistola e submetralhadora — sozinho, não ser visto vale mais que qualquer bônus de dano.</p>" +
      "<p>Dito isso, a pergunta importa pouco: a troca é livre em qualquer bivaque e cada classe guarda o próprio progresso. Experimente Echelon e Engenheiro assim que puder.</p>"],
    ["Escolhi errado na configuração. Preciso recomeçar?",
      "<p>Não. <b>Praticamente tudo no Ghost Experience pode ser alterado a qualquer momento</b>, em Configurações, incluindo no meio de uma missão.</p>" +
      "<p>A única coisa que não volta é a primeira impressão — descobrir Auroa com o mapa apagado acontece uma vez só.</p>"],
    ["Como eu mato um Behemoth?",
      "<p>Com preparo: cobertura dura, pulso eletromagnético para travar, lança-foguetes ou explosivo nos pontos expostos, e movimento constante porque ele dispara em área.</p>" +
      "<p>Mas a resposta mais honesta é outra: <b>na maior parte das vezes, não mate.</b> Ele guarda pontos específicos e raramente é obrigatório. Contornar é uma decisão tática legítima, não covardia.</p>"],
    ["Fui detectado e não sei por quê. O que aconteceu?",
      "<p>Três suspeitos, nessa ordem de probabilidade. <b>Um Azraël</b> te varreu do alto — se o minimapa caiu junto, foi ele. <b>Uma câmera</b> que você não marcou com o drone. Ou <b>um corpo</b> que você deixou à vista minutos atrás.</p>" +
      "<p>Os três têm a mesma prevenção: drone no ar antes do primeiro passo, marcando tudo — inclusive equipamento, não só pessoas.</p>"],
    ["Perdi o drone. E agora?",
      "<p>Ele volta. O drone de reconhecimento é recarregável e reaparece depois de um tempo ou ao passar por um bivaque, então perdê-lo custa tempo, não o recurso.</p>" +
      "<p>O que importa é o hábito: <b>se o drone não está disponível, a base ainda não está pronta para ser invadida.</b> Espere.</p>"],
    ["O jogo tem fim?",
      "<p>A campanha principal tem conclusão, sim. Depois dela, o arquipélago continua disponível com desafios de classe, alvos de alto valor e bases para invadir indefinidamente.</p>" +
      "<p>Não há um ponto em que Auroa feche as portas — o que existe é o momento em que você decide que já viu o que queria ver.</p>"],
    ["Vale a pena subir para Extremo?",
      "<p>Vale, e mais cedo do que parece. Em Extremo, dois ou três tiros matam <b>dos dois lados</b> — o que significa que uma base inteira cai rápido quando você é competente, e que trocar tiro em campo aberto deixa de ser uma opção viável.</p>" +
      "<p>É a configuração que faz cobertura, posição e ordem de abate importarem. Sem ela, o modo imersivo fica pela metade.</p>"]
  ];

  D.reg({
    id: "v09", cod: "09", nome: "Os fios perdidos", arquivo: "miscelanea.dat",
    titulo: "Os fios", subtitulo: "perdidos", cor: "#cf9a34",
    desc: "Vinte coisas que o jogo nunca explica, quatro ciladas de configuração e as perguntas da primeira semana.",
    lede: [
      "Todo jogo grande tem um conjunto de coisas verdadeiras que ele nunca diz em voz alta. Breakpoint tem mais que a média.",
      "Este volume é o quadro onde essas pontas soltas ficam presas com alfinete — vinte fatos, quatro ciladas de configuração e as perguntas que todo mundo faz na primeira semana."
    ],
    saltos: [["segredos", "As vinte"], ["ciladas", "Ciladas"], ["perguntas", "Perguntas"], ["fim", "Última página"]],
    render: function () {
      var h = "";

      h += '<section style="padding-top:0"><div class="quadro" id="quadro"></div></section>';

      h += D.transmissao("O jogo não esconde nada. Ele só não avisa.",
        "Quase tudo nesta página está disponível desde a primeira hora, em algum submenu, atrás de algum botão que ninguém aperta. A diferença entre uma partida frustrante e uma boa costuma ser exatamente este punhado de informações.");

      h += '<section id="segredos">' +
        D.cabSecao("01 · AS VINTE", "Coisas verdadeiras que o jogo nunca diz",
          "Ordenadas pelo tamanho da diferença que fazem, não por assunto. As cinco primeiras mudam a partida inteira.") +
        '<div class="segredos">' + SEGREDOS.map(function (s, i) {
          var c = CAT[s[2]];
          return '<div class="segredo" style="--c:' + c[1] + '"><span class="n">' + String(i + 1).padStart(2, "0") + "</span>" +
            "<h4>" + s[0] + "</h4><p>" + s[1] + '</p><span class="cat">' + c[0] + "</span></div>";
        }).join("") + "</div></section>";

      h += D.sinal();

      h += '<section id="ciladas">' +
        D.cabSecao("02 · CILADAS DE CONFIGURAÇÃO", "Quatro jeitos de configurar contra si mesmo",
          "Nenhuma é errada em absoluto. Todas são combinações que se sabotam — o tipo de coisa que só aparece dez horas depois, quando já virou hábito.") +
        '<div class="ciladas">' + CILADAS.map(function (c) {
          return '<article class="cilada"><h4>' + c[0] + "</h4><p>" + c[1] + '</p><p class="fix">' + c[2] + "</p></article>";
        }).join("") + "</div></section>";

      h += D.sinal();

      h += '<section id="perguntas">' +
        D.cabSecao("03 · PERGUNTAS", "O que todo mundo pergunta na primeira semana") +
        FAQ.map(function (f, i) {
          return '<details class="q"' + (i === 0 ? " open" : "") + "><summary>" + f[0] + "</summary>" +
            '<div class="resp">' + f[1] + "</div></details>";
        }).join("") +
        "</section>";

      h += D.sinal();

      h += '<section id="fim">' +
        D.cabSecao("04 · ÚLTIMA PÁGINA", "Se for para levar uma coisa só") +
        '<p class="quote">Suba o drone antes de dar o primeiro passo, decida por onde vai sair antes de dar o primeiro tiro, e esconda todo corpo.</p>' +
        '<p style="color:var(--muted);max-width:66ch">Essas três frases resolvem mais partidas de Breakpoint do que qualquer escolha de classe, arma ou perícia. Tudo o mais neste dossiê são dez volumes explicando por quê.</p>' +
        '<p style="color:var(--muted);max-width:66ch">O resto da ilha é com você. Auroa não vai facilitar, mas também não está te perseguindo — ela simplesmente existe, grande e indiferente, e espera que você aprenda a se mover dentro dela.</p>' +
        "</section>";

      return h;
    },
    depois: function () { quadroInvestigacao(); }
  });

  function quadroInvestigacao() {
    var alvo = D.el("quadro");
    if (!alvo) return;
    var W = 960, H = 300, g = "", r = D.prng(8123);

    g += '<rect width="' + W + '" height="' + H + '" fill="#070b0b"/><g fill="#0d1414">';
    for (var i = 0; i < 120; i++) {
      g += '<circle cx="' + (r() * W).toFixed(0) + '" cy="' + (r() * H).toFixed(0) + '" r="' + (2 + r() * 7).toFixed(1) + '"/>';
    }
    g += '</g><rect x="10" y="10" width="' + (W - 20) + '" height="' + (H - 20) + '" fill="none" stroke="#1e2d31" stroke-width="2"/>';

    var CARTOES = [
      [78, 52, 132, 86, -3.5, "#c8483d", 4], [268, 34, 124, 78, 2.5, "#4ec8bb", 3],
      [452, 62, 140, 92, -1.8, "#cf9a34", 4], [656, 40, 118, 74, 3.2, "#4ec8bb", 3],
      [176, 176, 126, 80, 2.2, "#4ec8bb", 4], [396, 186, 132, 84, -2.6, "#c8483d", 3],
      [618, 168, 130, 88, 1.6, "#cf9a34", 4], [800, 132, 112, 96, -3.0, "#4ec8bb", 4]
    ];
    function pino(c) { return [c[0] + c[2] / 2, c[1] + 8]; }
    var LIGACOES = [[0, 4], [0, 1], [1, 2], [2, 5], [2, 3], [3, 7], [4, 5], [5, 6], [6, 7], [1, 6]];

    g += '<g stroke="#8a3a32" stroke-width="1.1" fill="none" opacity=".55">';
    LIGACOES.forEach(function (l) {
      var a = pino(CARTOES[l[0]]), b = pino(CARTOES[l[1]]);
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + 22;
      g += '<path d="M' + a[0] + " " + a[1] + "Q" + mx.toFixed(0) + " " + my.toFixed(0) + " " + b[0] + " " + b[1] + '"/>';
    });
    g += "</g>";

    CARTOES.forEach(function (c) {
      var cx = c[0] + c[2] / 2, cy = c[1] + c[3] / 2;
      g += '<g transform="rotate(' + c[4] + " " + cx + " " + cy + ')">';
      g += '<rect x="' + c[0] + '" y="' + c[1] + '" width="' + c[2] + '" height="' + c[3] + '" fill="#12201f" stroke="#2a4448" stroke-width="1.3"/>';
      for (var k = 0; k < c[6]; k++) {
        var lw = c[2] - 24 - r() * 34;
        g += '<path d="M' + (c[0] + 12) + " " + (c[1] + 26 + k * 13) + "h" + lw.toFixed(0) +
          '" stroke="#2f4f4c" stroke-width="2.6" opacity="' + (k === 0 ? ".95" : ".6") + '"/>';
      }
      g += "</g>";
      g += '<circle cx="' + cx + '" cy="' + (c[1] + 8) + '" r="4.6" fill="' + c[5] + '"/>';
      g += '<circle cx="' + cx + '" cy="' + (c[1] + 8) + '" r="7.5" fill="none" stroke="' + c[5] + '" stroke-width="1" opacity=".4"/>';
    });

    g += '<text x="30" y="' + (H - 24) + '" fill="#4ec8bb" font-family="JetBrains Mono, monospace" font-size="10" letter-spacing="3" opacity=".65">PONTAS SOLTAS · SALA DE OPERAÇÕES · EREWHON</text>';

    alvo.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="Ilustração de um quadro de investigação com oito fichas presas por alfinetes e ligadas entre si por fios vermelhos">' + g + "</svg>";
  }

  /* ═══════════════════════════════════════════════════════════
     VOLUME 10 · OS EPISÓDIOS
     ═══════════════════════════════════════════════════════════ */

  var BLOCOS = [
    { n: "Operação Greenstone", missoes: 100, cor: "#4ec8bb", tipo: "Jogo base" },
    { n: "Deep State", missoes: 8, cor: "#7bd36a", tipo: "Pago" },
    { n: "Red Patriot", missoes: 10, cor: "#c8483d", tipo: "Pago" },
    { n: "Amber Sky", missoes: 4, cor: "#cf9a34", tipo: "Evento" },
    { n: "Op. Motherland", missoes: 60, cor: "#7aa7e8", tipo: "Gratuito" }
  ];

  var EPISODIOS = [
    { e: "#7bd36a", rot: "Episódio 02", tipo: "Pago", n: "Deep State",
      premissa: "Continuação direta da Operação Greenstone. Coloca os Ghosts ao lado de <b>Sam Fisher</b>, da série Splinter Cell, que chegou a Auroa atrás de tecnologia de drone ilegal — e na caçada ao <b>Estrategista</b>, que sequestrou cientistas americanos de primeira linha para um projeto próprio.",
      dest: [["Missões", "<b>Oito</b>, e a de introdução é gratuita mesmo para quem não comprou a expansão"],
        ["Classes", "<b>Echelon</b> e <b>Engenheiro</b> — as duas chegam aqui, e a Echelon varre inimigos próximos e os destaca na tela por alguns segundos"],
        ["Armas", "Traz a <b>Maxim 9</b>, a <b>MK 23 Echelon</b>, a <b>SC-40K</b>, a <b>SC-IS HDG</b> e o lança-granadas <b>MGL</b> — quase toda a prateleira furtiva do volume 03 vem deste pacote"],
        ["Tom", "Furtividade pesada, interiores, e o único conteúdo do jogo com aula de infiltração dada por Sam Fisher"]],
      quando: "Aqui há um conflito real que vale declarar. As duas classes são tentadoras cedo, mas os episódios se integram à campanha base e <b>começar fora de ordem quebra a continuidade da história — o Episódio 2 é justamente o pior caso</b>. Se a narrativa importa para você, faça na ordem numérica. Se o que importa são as classes, saiba o preço.",
      marca: D.emb('<circle cx="22" cy="30" r="5.5"/><circle cx="32" cy="26" r="5.5"/><circle cx="42" cy="30" r="5.5"/><path d="M16 42c8 6 24 6 32 0" opacity=".55"/>') },
    { e: "var(--ruim)", rot: "Episódio 03", tipo: "Pago", n: "Red Patriot",
      premissa: "O <b>Coronel Scott Mitchell</b> — veterano da série — alerta você para uma conspiração de <b>Trey Stone</b>, o chefe da Sentinel, aliado à organização terrorista russa <b>Raven's Rock</b>. O plano é soltar um ataque neurotóxico em solo americano. A expansão se chamava <i>Transcendence</i> e teve o rumo da trama reescrito depois da reação dos jogadores ao jogo base.",
      dest: [["Missões", "Campanha construída em torno de alvos nomeados de alto escalão"],
        ["Classe", "<b>Batedor</b>, a classe de reconhecimento com drone de alta altitude"],
        ["Armas", "Traz a <b>Honey Badger</b>, a <b>FAL</b>, a <b>ACS12</b>, a <b>Paladin 9</b> e variantes de M4A1 e 416"],
        ["Tom", "Inimigo humano mais duro que o padrão da ilha. Pune improviso e recompensa marcação disciplinada"],
        ["Recompensas", "Cerca de vinte e seis itens de aventura"]],
      quando: "Depois que a sua furtividade estiver madura — marco 05 ou 06 do volume 08. É o conteúdo que mais cobra o que os volumes 05 e 06 ensinam.",
      marca: D.emb('<path d="M32 16l6 12-6 4-6-4z"/><path d="M18 34c4 10 8 14 14 16 6-2 10-6 14-16" opacity=".85"/><path d="M24 30h16" opacity=".6"/>') },
    { e: "#7aa7e8", rot: "Atualização gratuita", tipo: "Gratuito", n: "Operação Motherland",
      premissa: "Uma campanha alternativa inteira, de graça para quem tem o jogo. <b>Bowman chama Nomad de volta a Auroa: os Outcasts precisam de ajuda para manter a paz na ilha.</b> Você retoma o arquipélago região por região, no <b>modo de conquista</b>, em que as suas ações mudam o estado do território. Foi a última atualização grande antes do fim do desenvolvimento, em abril de 2022.",
      dest: [["Missões", "Cerca de sessenta, em onze regiões a serem retomadas"],
        ["Ferramenta", "<b>Camuflagem óptica</b> permanente na roda de itens: invisibilidade até certa distância, com medidor que esgota conforme você age"],
        ["Progressão", "Nível máximo elevado de 30 para 99"],
        ["Mundo", "Auroa reorganizada em cinco zonas, com atmosfera de outono e inverno"],
        ["Acesso", "Pelo quadro de objetivos ou pelo mapa tático, logo após a introdução da campanha"]],
      quando: "Por último, mas não por ser pior — por ser outra coisa. É um modo paralelo com lógica própria de território; jogá-lo cedo embaralha a experiência da campanha base.",
      marca: D.emb('<path d="M32 14v36" opacity=".8"/><path d="M20 22h24M17 32h30M20 42h24" opacity=".6"/><circle cx="32" cy="32" r="16" opacity=".5"/>') },
    { e: "#cf9a34", rot: "Eventos cruzados", tipo: "Tempo limitado", n: "Amber Sky e companhia",
      premissa: "Eventos temáticos que trouxeram personagens de outras séries para Auroa. Em <b>Operação Amber Sky</b>, operadores da equipe Rainbow — Ash, Finka e Thatcher, com Lesion como contato — chegam para impedir a Sentinel de fabricar e vender uma arma química. Houve também um evento cruzado com O Exterminador do Futuro.",
      dest: [["Missões", "Blocos curtos, de poucas missões cada"],
        ["Ferramentas", "Nenhuma classe nova. O ganho é cosmético e temático"],
        ["Tom", "Fan service bem produzido, com inimigos e cenários fora do padrão da ilha"],
        ["Disponibilidade", "Originalmente por tempo limitado — pode ou não estar acessível hoje, conforme a sua versão"]],
      quando: "Quando aparecerem no quadro de objetivos. Não organize a partida em torno deles, e não se frustre se não estiverem lá.",
      marca: D.emb('<path d="M14 36c6-10 30-10 36 0" opacity=".8"/><circle cx="32" cy="26" r="7"/><path d="M18 46h28" opacity=".6"/><path d="M32 12v-4M20 16l-3-3M44 16l3-3" opacity=".7"/>') }
  ];

  D.reg({
    id: "v10", cod: "10", nome: "Os episódios", arquivo: "expansoes.dat",
    titulo: "Os episódios", subtitulo: "a ilha depois da ilha", cor: "#7aa7e8",
    desc: "As expansões de história: Deep State, Red Patriot, Operação Motherland e os eventos cruzados. O que cada uma acrescenta e o que muda nos outros volumes.",
    lede: [
      "Breakpoint não terminou no lançamento. Ele recebeu duas aventuras pagas, uma campanha inteira de graça e dois eventos cruzados com outras séries.",
      "Como você tem as expansões de história, três das sete classes do dossiê vieram delas — e uma ferramenta introduzida depois muda a doutrina de furtividade do volume 05."
    ],
    saltos: [["linha", "Linha do tempo"], ["episodios", "Episódios"], ["ordem", "Ordem"], ["revisao", "O que muda"]],
    render: function () {
      var h = "";

      h += D.transmissao("As classes que você já tem não são todas do jogo base.",
        "Echelon e Engenheiro chegaram com Deep State. Batedor chegou com Red Patriot. Se você leu o volume 02 e estranhou que o jogo oferecesse sete classes, é por isso — a versão sem expansão começa com quatro.");

      h += '<section id="linha">' +
        D.cabSecao("01 · LINHA DO TEMPO", "O que veio depois, e em que tamanho",
          "A barra mede o número aproximado de missões de cada bloco de conteúdo. Serve para dimensionar: a campanha gratuita que chegou por último é maior que as duas aventuras pagas somadas.") +
        '<div class="linha-tempo" id="linha-tempo"></div></section>';

      h += D.sinal();

      h += '<section id="episodios">' +
        D.cabSecao("02 · OS BLOCOS", "Cada expansão, e o que ela te dá de ferramenta",
          "As premissas estão aqui sem nenhuma reviravolta: quem aparece, contra quem, e onde acontece. O campo que mais importa para você é o outro — <b>o que cada uma desbloqueia de mecânica</b>, porque isso vale para a partida inteira, não só para as missões dela.") +
        '<div class="eps">' + EPISODIOS.map(function (ep) {
          return '<article class="ep" style="--e:' + ep.e + '"><div class="lado">' + ep.marca +
            '<span class="rot">' + ep.rot + '</span><span class="tipo">' + ep.tipo + "</span></div>" +
            '<div class="corpo"><h3>' + ep.n + '</h3><p class="premissa">' + ep.premissa + "</p>" +
            '<div class="destaques">' + ep.dest.map(function (d) {
              return "<div><b>" + d[0] + "</b><span>" + d[1] + "</span></div>";
            }).join("") + "</div>" +
            '<p class="quando"><b>Quando jogar</b>' + ep.quando + "</p></div></article>";
        }).join("") + "</div></section>";

      h += D.sinal();

      h += '<section id="ordem">' +
        D.cabSecao("03 · ORDEM", "Em que momento encaixar cada uma",
          'Nada aqui é obrigatório nem trancado por nível, então a ordem é uma recomendação de ritmo — não uma regra do jogo. Ela segue os marcos do <a href="#" data-ir="v08">volume 08</a>.') +
        '<div class="track">' +
        ordemPasso("1º", "A campanha base, até se sentir autônomo", "Marcos 01 a 04", "Chegue ao ponto em que você opera longe do bivaque sem abortar por munição. <b>As expansões pressupõem um Ghost já equipado</b>, e enfrentá-las sem drone de tiro sincronizado é sofrimento sem aprendizado.", true) +
        ordemPasso("2º", "Deep State — e o dilema dele", "Marco 04 a 05", "As duas classes tentam você a entrar cedo. Mas os episódios se integram à campanha base e <b>começar fora da ordem numérica quebra a continuidade da história, sendo o Episódio 2 justamente o pior caso</b>. Recomendação honesta: espere a campanha base chegar num ponto de respiro. Se você entrar antes, entre sabendo o que está trocando.", true) +
        ordemPasso("3º", "O resto da campanha base", "Marco 05", "Volte para a linha principal com o kit ampliado. É o corpo do jogo e continua sendo a melhor versão de Auroa.", false) +
        ordemPasso("4º", "Red Patriot", "Marco 05 a 06", "Campanha contra um inimigo humano mais duro que o padrão da ilha. <b>Encaixa bem depois que a furtividade já está madura</b> — é conteúdo que pune improviso.", false) +
        ordemPasso("5º", "Operação Motherland", "Marco 06 em diante", "A campanha gratuita, e a maior de todas. É um modo alternativo com sua própria lógica de território — <b>deixe para quando a campanha base já tiver dado o que tinha</b>, porque ela reorganiza a ilha inteira.", false) +
        ordemPasso("6º", "Eventos cruzados, quando disponíveis", "Qualquer momento", "Conteúdo curto e temático. Historicamente foram eventos por tempo limitado, então a disponibilidade hoje depende da sua versão e do que a Ubisoft manteve ativo — confira no quadro de objetivos em Erewhon.", false) +
        "</div></section>";

      h += D.sinal();

      h += '<section id="revisao">' +
        D.cabSecao("04 · ERRATA", "O que muda nos outros volumes",
          "Ter as expansões altera três coisas que os volumes anteriores afirmam. Aqui estão as correções, com o volume a que cada uma pertence.") +
        '<div class="revisao">' +
        rev("Volume 02", "As sete classes já são suas", "O volume 02 apresenta as sete como se todas fossem do jogo base. <b>Com as expansões instaladas, isso é verdade na prática para você</b> — Echelon e Engenheiro vêm de Deep State, Batedor vem de Red Patriot, e as três ficam permanentemente disponíveis depois de desbloqueadas.") +
        rev("Volume 01", "O nível de equipamento desligado fecha uma porta pequena", "Uma consequência do seu perfil que quase ninguém menciona: <b>com o nível de equipamento desligado, o Holt não conversa com você sobre as recompensas do programa de Ghost Recon Wildlands</b>, e parte dessas recompensas só é resgatável com ele ligado. Se você trouxe progresso do Wildlands e faz questão dos brindes, é o único motivo real para ligar o nível de equipamento por uma sessão — e depois desligar de novo.") +
        rev("Volume 05", "Camuflagem óptica muda a doutrina de furtividade", "A Operação Motherland trouxe a camuflagem óptica como item permanente da roda: invisibilidade até certa distância, limitada por um medidor que se esgota conforme você age e se move. <b>É a primeira ferramenta do jogo que permite atravessar um cone de visão em movimento</b> — o que o volume 05 trata como impossível. Não substitui o planejamento; resolve o trecho de dois segundos que nenhum plano cobria.") +
        rev("Volume 08", "O teto de progressão é muito mais alto", "O volume 08 encerra a rota em “sem fim definido”. Com Motherland instalada, <b>o nível máximo subiu de 30 para 99</b> e há cerca de sessenta missões adicionais no modo de conquista. O “depois” do marco 07 é bem maior do que aquele volume sugere.") +
        rev("Volume 07", "Auroa tem uma segunda aparência", "No modo de conquista, o arquipélago é reorganizado em cinco zonas com atmosfera de outono e inverno. <b>Os biomas do volume 07 continuam válidos como leitura de terreno</b>, mas a paleta e a cobertura vegetal mudam — mato seco e neve cobrem menos que floresta úmida.") +
        "</div>" +
        D.nota("Uma nota de honestidade sobre nomes: os storefronts listam as aventuras pagas de formas diferentes, e o quarto episódio chegou a ser anunciado com outro título antes de mudar. <b>Se o nome na sua biblioteca não bater exatamente com o daqui, é provável que seja o mesmo conteúdo</b> — confira pela premissa e pela classe que ele desbloqueia.") +
        D.alerta("Nenhuma expansão é pré-requisito de outra",
          "Deep State, Red Patriot e Motherland são independentes entre si e independentes do fim da campanha base. Você pode intercalar à vontade — a ordem acima é sobre ritmo e ferramenta, não sobre travas.") +
        "</section>";

      return h;
    },
    depois: function () { linhaExpansoes(); }
  });

  function ordemPasso(n, titulo, tag, texto, chave) {
    return '<div class="lv' + (chave ? " key" : "") + '"><span class="n">' + n + "</span>" +
      "<div><h4>" + titulo + ' <span class="tag">' + tag + "</span></h4><p>" + texto + "</p></div></div>";
  }
  function rev(vol, titulo, texto) {
    return '<div class="rev"><span class="vol">' + vol + "</span><h4>" + titulo + "</h4><p>" + texto + "</p></div>";
  }

  function linhaExpansoes() {
    var alvo = D.el("linha-tempo");
    if (!alvo) return;
    var W = 980, H = 330, eixo = 122, baseBarra = 292, g = "";

    g += '<rect width="' + W + '" height="' + H + '" fill="#060c0d"/><g stroke="#12242a" stroke-width="1" opacity=".5">';
    for (var gy = 0; gy <= H; gy += 40) g += '<path d="M0 ' + gy + "H" + W + '"/>';
    g += "</g>";
    g += '<path d="M60 ' + eixo + "H" + (W - 60) + '" stroke="#2a4448" stroke-width="2"/>';
    g += '<path d="M' + (W - 60) + " " + eixo + 'l-10 -5v10z" fill="#2a4448"/>';
    g += '<text x="60" y="' + (eixo - 34) + '" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2.4">LANÇAMENTO</text>';
    g += '<text x="' + (W - 60) + '" y="' + (eixo - 34) + '" text-anchor="end" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="2.4">HOJE</text>';

    var passo = (W - 200) / (BLOCOS.length - 1);
    BLOCOS.forEach(function (b, i) {
      var x = 100 + passo * i, altura = (b.missoes / 100) * 132;
      g += '<circle cx="' + x.toFixed(0) + '" cy="' + eixo + '" r="9" fill="#060c0d" stroke="' + b.cor + '" stroke-width="2.4"/>';
      g += '<circle cx="' + x.toFixed(0) + '" cy="' + eixo + '" r="3" fill="' + b.cor + '"/>';
      g += '<text x="' + x.toFixed(0) + '" y="' + (eixo - 58) + '" text-anchor="middle" fill="' + b.cor +
        '" font-family="Saira Condensed, sans-serif" font-size="19" letter-spacing="1">' + b.n.toUpperCase() + "</text>";
      g += '<text x="' + x.toFixed(0) + '" y="' + (eixo - 44) + '" text-anchor="middle" fill="#7b8e8b" ' +
        'font-family="JetBrains Mono, monospace" font-size="8.5" letter-spacing="1.6">' + b.tipo.toUpperCase() + "</text>";
      g += '<path d="M' + x.toFixed(0) + " " + (eixo - 40) + "V" + (eixo - 12) + '" stroke="' + b.cor + '" stroke-width="1" opacity=".4"/>';
      g += '<rect x="' + (x - 34).toFixed(0) + '" y="' + (baseBarra - altura).toFixed(0) + '" width="68" height="' +
        altura.toFixed(0) + '" fill="' + b.cor + '" fill-opacity=".18" stroke="' + b.cor + '" stroke-width="1.6"/>';
      g += '<text x="' + x.toFixed(0) + '" y="' + (baseBarra - altura - 10).toFixed(0) + '" text-anchor="middle" fill="' + b.cor +
        '" font-family="JetBrains Mono, monospace" font-size="12">' + (b.missoes === 100 ? "~100" : b.missoes) + "</text>";
      g += '<path d="M' + x.toFixed(0) + " " + (eixo + 12) + "V" + (baseBarra - altura - 22).toFixed(0) +
        '" stroke="' + b.cor + '" stroke-width="1" opacity=".25" stroke-dasharray="3 5"/>';
    });

    g += '<path d="M60 ' + baseBarra + "H" + (W - 60) + '" stroke="#2a4448" stroke-width="1.6"/>';
    g += '<text x="60" y="' + (baseBarra + 22) + '" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.8">MISSÕES APROXIMADAS POR BLOCO DE CONTEÚDO</text>';

    alvo.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="Linha do tempo das expansões com barras comparando o número aproximado de missões: jogo base cerca de cem, Deep State dez, Red Patriot dez, Amber Sky quatro e Operação Motherland sessenta">' + g + "</svg>";
  }
})(window.DOSSIE);
