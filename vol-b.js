/* CROSS-COM — volumes 04 a 06. */

(function (D) {
  "use strict";

  /* ═══════════════════════════════════════════════════════════
     VOLUME 04 · A MOCHILA
     ═══════════════════════════════════════════════════════════ */

  var HORAS = [
    { id: "madrugada", nome: "Madrugada", luz: 8, det: 18,
      ico: D.ico('<path d="M20 5a11 11 0 1 0 7 20A12 12 0 0 1 20 5z"/>'),
      txt: "Escuridão quase total. Os inimigos enxergam pouquíssimo — e você também, sem visão noturna." },
    { id: "amanhecer", nome: "Amanhecer", luz: 40, det: 42,
      ico: D.ico('<path d="M16 12a7 7 0 0 1 7 7H9a7 7 0 0 1 7-7z"/><path d="M4 24h24M16 5v3M6 9l2 2M26 9l-2 2"/>'),
      txt: "Luz baixa e rasante, sombra longa. O melhor equilíbrio entre enxergar e não ser visto." },
    { id: "dia", nome: "Dia", luz: 100, det: 100,
      ico: D.ico('<circle cx="16" cy="16" r="6"/><path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2 2M22.5 22.5l2 2M24.5 7.5l-2 2M9.5 22.5l-2 2"/>'),
      txt: "Visibilidade total para os dois lados. Pior momento possível para infiltrar uma base." },
    { id: "entardecer", nome: "Entardecer", luz: 46, det: 40,
      ico: D.ico('<path d="M16 20a7 7 0 0 1 7-7H9a7 7 0 0 1 7 7z"/><path d="M4 24h24M16 5v3"/>'),
      txt: "Igual ao amanhecer em vantagem, com o bônus de escurecer durante a operação em vez de clarear." },
    { id: "noite", nome: "Noite", luz: 16, det: 24,
      ico: D.ico('<path d="M22 6a10 10 0 1 0 4 16A11 11 0 0 1 22 6z"/><circle cx="9" cy="9" r="1"/><circle cx="26" cy="12" r="1"/>'),
      txt: "Escuro com pontos de luz artificial nas bases. A condição padrão de qualquer infiltração planejada." }
  ];

  var CLIMAS = [
    { id: "limpo", nome: "Limpo", vis: 100, som: 100,
      ico: D.ico('<circle cx="16" cy="16" r="7"/><path d="M16 4v3M16 25v3M4 16h3M25 16h3"/>'),
      txt: "Nada atrapalha e nada ajuda." },
    { id: "nublado", nome: "Nublado", vis: 82, som: 96,
      ico: D.ico('<path d="M9 22h14a5 5 0 0 0 0-10 7 7 0 0 0-13.3 2A4.5 4.5 0 0 0 9 22z"/>'),
      txt: "Luz difusa, sombras fracas. Vantagem pequena e gratuita." },
    { id: "chuva", nome: "Chuva", vis: 58, som: 62,
      ico: D.ico('<path d="M9 18h14a5 5 0 0 0 0-10 7 7 0 0 0-13.3 2A4.5 4.5 0 0 0 9 18z"/><path d="M11 23l-2 5M17 23l-2 5M23 23l-2 5"/>'),
      txt: "Reduz o alcance visual do inimigo e mascara o som dos seus passos. Também molha a sua luneta." },
    { id: "tempestade", nome: "Tempestade", vis: 34, som: 38,
      ico: D.ico('<path d="M9 16h14a5 5 0 0 0 0-10 7 7 0 0 0-13.3 2A4.5 4.5 0 0 0 9 16z"/><path d="M17 19l-4 6h5l-3 5"/>'),
      txt: "A melhor cobertura natural do jogo. Você fica quase invisível e quase surdo — vale para os dois lados." }
  ];

  /* marca de ferimento: círculo de chamada com linha de extensão, como
     num diagrama de triagem — não um traço mais grosso no boneco */
  function marcaFerida(x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" stroke="currentColor" ' +
      'stroke-width="1.4"/>' +
      '<path d="M' + (x - r - 4) + " " + y + "h" + (r * 2 + 8) + '" stroke="currentColor" ' +
      'stroke-width=".6" opacity=".45" fill="none"/>' +
      '<path d="M' + x + " " + (y - r - 4) + "v" + (r * 2 + 8) + '" stroke="currentColor" ' +
      'stroke-width=".6" opacity=".45" fill="none"/>';
  }
  function sangue(x, y) {
    return '<path d="M' + x + " " + y + "q2 4 0 6q-2 -2 0 -6z" + '" fill="currentColor" opacity=".75" stroke="none"/>';
  }

  var ESTADOS = [
    { c: "var(--bom)", n: "Ileso",
      fig: D.anatomia(""),
      d: "Vida cheia ou em regeneração. Nenhuma penalidade.",
      itens: ["Mira estável", "Fôlego integral", "Velocidade normal"],
      cura: "Nada a fazer. A vida sobe sozinha, mesmo no imersivo — só mais devagar." },
    { c: "var(--medio)", n: "Ferimento leve",
      fig: D.anatomia(marcaFerida(26, 88, 7)),
      d: "Você mancou. O corpo ainda responde, mas nada sai perfeito.",
      itens: ["Mira trêmula", "Fôlego reduzido", "Passo mais lento ao correr"],
      cura: "Seringa, se você tiver: é instantânea e dá para aplicar correndo. Cura só uma parte, mas resolve o suficiente para continuar." },
    { c: "var(--ruim)", n: "Ferimento grave",
      fig: D.anatomia(marcaFerida(26, 88, 7) + marcaFerida(17, 44, 6) +
        sangue(24, 98) + sangue(28, 104) + sangue(14, 54)),
      d: "Sangramento ativo e perda de capacidade real. Não é um aviso: é uma mudança de estado.",
      itens: ["Sangramento contínuo", "Mancar severo, velocidade muito baixa", "Só tiro de quadril, com uma mão", "Fôlego quase nulo"],
      cura: "<b>Bandagem</b> — e só ela. Seringa não fecha ferida profunda. A bandagem você tem em quantidade ilimitada, mas ela leva de vários a dezenas de segundos e exige que você chegue a um lugar seguro antes de começar. Kit médico do Socorrista e descanso no bivaque também resolvem." }
  ];

  D.reg({
    id: "v04", cod: "04", nome: "A mochila", arquivo: "sobrevivencia.dat",
    titulo: "A mochila", subtitulo: "o jogo entre as bases", cor: "#7aa7e8",
    desc: "Bivaque, rações, ferimentos e camuflagem — com um seletor de hora e clima que mostra o efeito tático de cada combinação.",
    lede: [
      "Metade de Breakpoint acontece em lugar nenhum: subindo encosta, atravessando rio, esperando a chuva chegar.",
      "O sistema de sobrevivência é o que transforma esse tempo morto em decisão — e o bivaque é o único lugar da ilha onde você escolhe a que horas o próximo tiroteio vai acontecer."
    ],
    saltos: [["bivaque", "Bivaque"], ["partida", "Hora e clima"], ["ferimentos", "Ferimentos"], ["lama", "Fôlego e lama"]],
    render: function () {
      var h = "";

      h += D.transmissao("Nenhum operador competente entra numa base ao meio-dia de céu limpo.",
        "Se o bivaque deixa você escolher a hora de sair, sair ao meio-dia é uma escolha — e uma escolha ruim. A hora do dia é a alavanca tática mais poderosa que está inteiramente na sua mão, e a que quase ninguém usa de propósito. O clima você não define: ele aparece como previsão no acampamento, e o que você faz é <b>casar a hora certa com o tempo que já vem vindo</b>.");

      h += '<section id="bivaque">' +
        D.cabSecao("01 · O BIVAQUE", "A sua base móvel",
          "Acampamentos espalhados pela ilha, identificáveis à distância pela fumaça. Uma vez encontrado, o bivaque fica no mapa para sempre e vira ponto de viagem rápida. É o único lugar fora de Erewhon onde você tem acesso ao seu equipamento de verdade.") +
        '<div class="acampamento" id="acampamento"></div>' +
        '<ul class="tenets" style="margin-top:14px">' +
        "<li><b>Trocar de classe</b><span>Sem custo e sem perda de progresso. Cada classe mantém o próprio nível.</span></li>" +
        "<li><b>Trocar o conjunto</b><span>É a zona de equipamento: fora dela, você não muda projeto de arma.</span></li>" +
        "<li><b>Curar ferimento</b><span>Descanso restaura o estado completo, inclusive ferimento grave.</span></li>" +
        "<li><b>Fabricar</b><span>Seringas, granadas, minas, C4 e rações, a partir do que você catou pelo caminho. Bandagem não entra na lista — dela você tem quantidade ilimitada.</span></li>" +
        "<li><b>Bônus de partida</b><span>Seis preparações com efeito temporário: <b>hidratar</b> (+80% resistência a fadiga), <b>comer</b> (+40% resistência a ferimento), <b>revisão técnica</b> (+40% velocidade do drone), <b>alongamento</b> (+20% fôlego), <b>revisão da arma</b> (+20% precisão) e <b>conferência de recursos</b> (+20% de experiência).</span></li>" +
        "<li><b>Hora de sair</b><span>Você escolhe o momento do dia em que levanta acampamento. O clima aparece na mesma tela como <b>previsão</b> — você lê e decide a hora em função dele, não o contrário.</span></li>" +
        "<li><b>Veículo</b><span>Faz nascer transporte terrestre ou aéreo, conforme o bivaque e as suas restrições.</span></li>" +
        "<li><b>Viagem rápida</b><span>Entre bivaques já descobertos — a menos que você tenha restringido isso na configuração.</span></li>" +
        "</ul>" +
        D.nota("O hábito que separa quem sofre de quem opera: <b>tratar o bivaque como preparação, não como botão de cura.</b> Chegar, curar e sair correndo desperdiça as outras seis coisas da lista — que são justamente as que decidem a próxima meia hora.") +
        "</section>";

      h += D.sinal();

      h += '<section id="partida">' +
        D.cabSecao("02 · HORA E CLIMA", "Escolha a hora em função do tempo que vem",
          "Combine um momento do dia com uma condição de tempo e veja o efeito tático do par. <b>A hora você define no bivaque; o clima você lê na previsão.</b> Os medidores são comparativos entre as combinações, não números do jogo — servem para decidir, não para calcular.") +
        '<div class="partida"><div class="seletores">' +
        '<div class="bloco"><div class="cab">Momento do dia</div><div class="opcoes" id="horas"></div></div>' +
        '<div class="bloco"><div class="cab">Condição do tempo <b>(previsão)</b></div><div class="opcoes" id="climas"></div></div>' +
        '<p class="small">A visão noturna resolve metade da desvantagem da madrugada — e é justamente por isso que ela está tão no alto da ordem de compra de perícias do <a href="#" data-ir="v02">volume 02</a>.</p>' +
        "</div>" +
        '<div class="leitura"><div class="topo"><div class="cond" id="cond"></div><p id="resumo"></p></div>' +
        '<div class="efeitos" id="efeitos"></div></div></div></section>';

      h += D.sinal();

      h += '<section id="ferimentos">' +
        D.cabSecao("03 · FERIMENTOS", "O dano que não volta sozinho",
          "Breakpoint separa duas coisas que a maioria dos jogos de tiro junta. <b>Vida</b> regenera. <b>Ferimento</b> não — ele fica no seu corpo até ser tratado, e cada grau tira uma capacidade específica.") +
        '<div class="corpo-estado">' +
        ESTADOS.map(function (e) {
          return '<article class="estado" style="--e:' + e.c + '"><div class="fig">' + e.fig + "</div>" +
            "<h3>" + e.n + "</h3><p>" + e.d + "</p><ul>" +
            e.itens.map(function (i) { return "<li>" + i + "</li>"; }).join("") + "</ul>" +
            '<p class="cura"><b>Tratamento</b>' + e.cura + "</p></article>";
        }).join("") +
        "</div>" +
        D.nota("A consequência prática para quem joga sozinho: <b>ferimento grave transforma qualquer plano em fuga.</b> Sem esquadra para cobrir enquanto você se trata, tomar um ferimento grave dentro de uma base costuma significar abortar. E a economia dos dois itens é o oposto da intuição: <b>bandagem é ilimitada e lenta, seringa é escassa e instantânea.</b> Você nunca fica sem o que trata o ferimento grave — você fica sem o que te tira de uma situação ruim andando.") +
        "</section>";

      h += D.sinal();

      h += '<section id="lama">' +
        D.cabSecao("04 · FÔLEGO E LAMA", "As duas mecânicas de corpo") +
        '<div class="sub-body"><div>' +
        '<p class="creed">Deitar na lama é a coisa mais poderosa que você pode fazer de graça<cite>e a última que a maioria pensa em fazer</cite></p>' +
        '<p style="margin-top:1.2rem">Deitado em vegetação densa, mato alto, lama ou neve, você aplica camuflagem natural — cobre o corpo com barro ou folhagem e passa a ser quase invisível para inimigo e para drone. É a contramedida padrão ao <b>Azraël</b>, o drone de varredura de alta altitude: ele passa, e você simplesmente não está lá.</p>' +
        "<p><b>Você é avisado duas vezes.</b> O Azraël aparece no minimapa como um ícone vermelho em forma de avião enquanto ainda se aproxima, e ele é <b>muito audível</b> — o som é quase de avião. Não é um evento surpresa: é um evento que você deixou de olhar e de ouvir.</p>" +
        "<p>O que ele carrega explica por que deitar funciona: <b>câmera de alta resolução, sensor de calor e reconhecimento de padrão</b>. A lama quebra os três de uma vez — apaga a silhueta, cobre o calor e desfaz o padrão que o algoritmo procura. E se você jogar de <b>Pantera</b>, o spray antidrone da classe faz a mesma coisa em pé.</p>" +
        "<p>Duas limitações que importam na hora: <b>não dá para aplicar a camuflagem em qualquer lugar.</b> Água na altura do joelho não serve, e em cima de asfalto não existe barro para passar. Escolha o chão antes de precisar dele.</p>" +
        "<p>A outra limitação é óbvia e igualmente séria: <b>deitado você não se move rápido</b>. Camuflagem natural é ferramenta de espera e de aproximação, não de fuga.</p>" +
        "<p>O teto também conta. O drone de varredura não enxerga através de telhado — entrar num galpão resolve o mesmo problema sem custar mobilidade. E ficar colado numa cobertura, girando em volta dela conforme ele passa, funciona quando não há nem mato nem teto.</p>" +
        '</div><div class="kit">' +
        '<div class="card"><h4>Fôlego</h4>' +
        '<div class="ability"><b>O que gasta</b><span>Correr, escalar, nadar e principalmente subir ladeira. Terreno inclinado é o maior consumidor do jogo.</span></div>' +
        '<div class="ability"><b>O que repõe</b><span>Parar, beber água do cantil, descansar no bivaque e rações com efeito de resistência.</span></div>' +
        '<div class="ability"><b>Quando dói</b><span>Fôlego zerado reduz velocidade e desestabiliza a mira. Com dificuldade tática em Elite, a recuperação é lenta o bastante para mudar a rota que você escolhe.</span></div>' +
        '<div class="ability"><b>Uso tático</b><span>Planeje a aproximação por curva de nível, não em linha reta. Contornar um morro custa tempo; subir custa a sua mira nos dois minutos seguintes.</span></div></div>' +
        '<div class="card"><h4>Recursos do mato</h4>' +
        '<div class="ability"><b>Onde estão</b><span>Plantas, frutos e caça espalhados pelo terreno. Perícias do ramo de reconhecimento facilitam localizar.</span></div>' +
        '<div class="ability"><b>Para que servem</b><span>Fabricar rações no bivaque: bônus de fôlego, de estabilidade de mira, de manuseio de arma e de resistência a ferimento.</span></div>' +
        '<div class="ability"><b>Vale o desvio?</b><span>Catar no caminho, sim. Fazer expedição de coleta, não. O estoque cresce sozinho se você não andar sempre de veículo.</span></div></div>' +
        '<p class="warn"><b>Erro comum.</b> Guardar ração para a hora certa. Elas têm duração longa e o bivaque repõe — usar antes de cada saída é o uso pretendido, não desperdício.</p>' +
        "</div></div></section>";

      return h;
    },
    depois: function () { acampamento(); seletorPartida(); }
  });

  function acampamento() {
    var alvo = D.el("acampamento");
    if (!alvo) return;
    var g = "", r = D.prng(1337);

    g += '<defs>' +
      '<linearGradient id="noite" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0a161b"/><stop offset="100%" stop-color="#060d0f"/></linearGradient>' +
      '<radialGradient id="fogo" cx="50%" cy="50%"><stop offset="0%" stop-color="#e0a83a" stop-opacity=".55"/>' +
      '<stop offset="60%" stop-color="#c9702a" stop-opacity=".16"/><stop offset="100%" stop-color="#c9702a" stop-opacity="0"/></radialGradient></defs>';
    g += '<rect width="900" height="330" fill="url(#noite)"/>';

    for (var i = 0; i < 46; i++) {
      g += '<circle cx="' + (r() * 900).toFixed(0) + '" cy="' + (r() * 140).toFixed(0) + '" r="' +
        (0.6 + r() * 1).toFixed(1) + '" fill="#4ec8bb" opacity="' + (0.15 + r() * 0.35).toFixed(2) + '"/>';
    }

    g += '<path d="M0 150 L120 96 L190 132 L286 74 L372 128 L470 88 L560 134 L660 100 L760 140 L860 104 L900 128 V330 H0Z" fill="#0a171a"/>';
    g += '<path d="M0 186 L96 158 L188 184 L290 152 L396 182 L500 156 L610 188 L724 160 L830 190 L900 172 V330 H0Z" fill="#0c1d1f"/>';
    g += '<path d="M0 226 L140 206 L268 228 L410 202 L548 230 L690 206 L820 232 L900 216 V330 H0Z" fill="#0e2325"/>';

    function arvore(x, y, h, cor, op) {
      var w = h * 0.42;
      return '<path d="M' + x + " " + (y - h) + "L" + (x + w) + " " + y + "H" + (x - w) + 'Z" fill="' + cor + '" opacity="' + op + '"/>' +
        '<rect x="' + (x - 1.4) + '" y="' + y + '" width="2.8" height="' + (h * .16).toFixed(1) + '" fill="' + cor + '" opacity="' + op + '"/>';
    }
    for (var j = 0; j < 26; j++) g += arvore(12 + j * 35 + (r() - .5) * 16, 236 + r() * 8, 26 + r() * 20, "#0f2628", .85);
    for (var k = 0; k < 16; k++) g += arvore(20 + k * 58 + (r() - .5) * 24, 292 + r() * 10, 38 + r() * 26, "#122e30", .95);

    g += '<ellipse cx="452" cy="292" rx="150" ry="34" fill="#132b2c" opacity=".7"/>';
    g += '<circle cx="452" cy="286" r="86" fill="url(#fogo)"/>';
    g += '<g stroke="#e0a83a" stroke-width="2" fill="none" stroke-linecap="round">' +
      '<path d="M440 292l24-14M440 278l24 14"/>' +
      '<path d="M452 276c5 5 5 11 0 15-5-4-5-10 0-15z" fill="#e0a83a" opacity=".85" stroke="none"/></g>';
    g += '<g stroke="#2c4a4c" stroke-width="1.8" fill="#0d2224" stroke-linejoin="round">' +
      '<path d="M336 296l34-44 34 44z"/><path d="M370 252v44" opacity=".6"/><path d="M356 296l14-20 14 20" fill="#081416"/></g>';
    g += '<g stroke="#2c4a4c" stroke-width="1.5" fill="#0d2224">' +
      '<rect x="516" y="276" width="30" height="20"/><path d="M516 284h30" opacity=".6"/><rect x="550" y="284" width="22" height="12"/></g>';
    g += '<g stroke="#4ec8bb" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".9">' +
      '<circle cx="492" cy="272" r="5"/><path d="M492 277v13M492 282l-9 6M492 282l9 4M488 290l-6 8M496 290l4 8"/>' +
      '<path d="M478 268l6-4" opacity=".7"/></g>';
    g += '<g stroke="#4ec8bb" stroke-width="1.5" fill="none" opacity=".75">' +
      '<rect x="596" y="284" width="16" height="9" rx="2"/><circle cx="590" cy="280" r="6" opacity=".5"/>' +
      '<circle cx="618" cy="280" r="6" opacity=".5"/><path d="M596 286l-5-4M612 286l5-4M600 293v4M608 293v4"/></g>';
    g += '<path d="M452 268c-8-16 8-24 0-40s10-26 2-42" fill="none" stroke="#4ec8bb" stroke-width="1.6" opacity=".3" stroke-linecap="round"/>';
    g += '<path d="M458 262c-6-14 6-20 0-34" fill="none" stroke="#4ec8bb" stroke-width="1.2" opacity=".18" stroke-linecap="round"/>';

    g += '<g stroke="#2a4448" stroke-width="1" opacity=".38">';
    for (var m = 0; m < 34; m++) g += '<path d="M' + (r() * 900).toFixed(0) + " " + (r() * 300).toFixed(0) + 'l-6 20"/>';
    g += "</g>";

    g += '<text x="24" y="34" fill="#4ec8bb" font-family="JetBrains Mono, monospace" font-size="10" letter-spacing="3" opacity=".65">BIVAQUE · 03H14 · CHUVA FRACA</text>';
    g += '<text x="876" y="316" text-anchor="end" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="8.5" letter-spacing="2">A FUMAÇA TAMBÉM TE ENTREGA</text>';

    alvo.innerHTML = '<svg viewBox="0 0 900 330" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="Ilustração de um acampamento noturno sob chuva: barraca, fogueira, operador sentado, drone pousado e floresta de coníferas ao fundo">' + g + "</svg>";
  }

  function seletorPartida() {
    if (!D.el("horas")) return;
    var escolha = { hora: "noite", clima: "chuva" };

    function pintarOpcoes(alvo, lista, chave) {
      D.el(alvo).innerHTML = lista.map(function (o) {
        return '<button type="button" data-v="' + o.id + '" aria-pressed="' + (escolha[chave] === o.id) + '">' +
          o.ico + "<span>" + o.nome + "</span></button>";
      }).join("");
    }
    function medidor(q, valor, cor, texto) {
      return '<div class="ef" style="--cor:' + cor + '"><span class="q">' + q + "</span>" +
        '<span class="barra"><i style="width:' + valor + '%"></i></span><span class="v">' + texto + "</span></div>";
    }
    function atualizar() {
      var hh = HORAS.filter(function (x) { return x.id === escolha.hora; })[0];
      var cc = CLIMAS.filter(function (x) { return x.id === escolha.clima; })[0];
      var deteccao = Math.round(hh.det * cc.vis / 100);
      var suaVisao = Math.round(hh.luz * cc.vis / 100);
      var cobertura = 100 - deteccao;
      var corCob = cobertura > 66 ? "var(--bom)" : (cobertura > 38 ? "var(--medio)" : "var(--ruim)");
      var corVis = suaVisao > 60 ? "var(--bom)" : (suaVisao > 28 ? "var(--medio)" : "var(--ruim)");

      D.el("cond").textContent = hh.nome + " · " + cc.nome;
      D.el("resumo").textContent = hh.txt + " " + cc.txt;
      D.el("efeitos").innerHTML =
        medidor("Cobertura sua", cobertura, corCob, cobertura > 66 ? "Excelente" : (cobertura > 38 ? "Razoável" : "Ruim")) +
        medidor("Alcance visual deles", deteccao, "var(--ruim)", deteccao > 66 ? "Longo" : (deteccao > 34 ? "Médio" : "Curto")) +
        medidor("Sua visão a olho nu", suaVisao, corVis, suaVisao > 60 ? "Clara" : (suaVisao > 28 ? "Limitada" : "Precisa de visão noturna")) +
        medidor("Som que você faz", cc.som, cc.som > 80 ? "var(--ruim)" : "var(--bom)", cc.som > 80 ? "Audível" : (cc.som > 50 ? "Abafado" : "Coberto pelo tempo")) +
        medidor("Veredito", cobertura, corCob, cobertura > 72 ? "Saia agora" : (cobertura > 45 ? "Aceitável" : "Espere"));
    }
    function ligar(alvo, lista, chave) {
      D.el(alvo).addEventListener("click", function (e) {
        var b = e.target.closest("button[data-v]");
        if (!b) return;
        escolha[chave] = b.getAttribute("data-v");
        pintarOpcoes(alvo, lista, chave);
        atualizar();
      });
    }
    pintarOpcoes("horas", HORAS, "hora");
    pintarOpcoes("climas", CLIMAS, "clima");
    ligar("horas", HORAS, "hora");
    ligar("climas", CLIMAS, "clima");
    atualizar();
  }

  /* ═══════════════════════════════════════════════════════════
     VOLUME 05 · O SILÊNCIO
     ═══════════════════════════════════════════════════════════ */

  var PW = 900, PH = 520;
  var GUARDAS = [
    { id: "A", x: 186, y: 398, a: 300, ordem: 1 }, { id: "B", x: 268, y: 286, a: 10, ordem: 2 },
    { id: "C", x: 402, y: 168, a: 100, ordem: 3 }, { id: "D", x: 556, y: 196, a: 186, ordem: 4 },
    { id: "E", x: 700, y: 372, a: 226, ordem: 5 }, { id: "F", x: 614, y: 430, a: 84, ordem: 6 },
    { id: "G", x: 486, y: 124, a: 94, ordem: 7 }, { id: "H", x: 770, y: 254, a: 178, ordem: 8 }
  ];
  var CAMERA = { x: 612, y: 236, a: 210 }, VOCE = { x: 74, y: 462 }, OBJETIVO = { x: 788, y: 172 };

  D.reg({
    id: "v05", cod: "05", nome: "O silêncio", arquivo: "furtividade.dat",
    titulo: "O silêncio", subtitulo: "quem vê primeiro, ganha", cor: "var(--bom)",
    desc: "Uma base desenhada de cima, com cones de visão, e as cinco fases da invasão passo a passo. O volume mais prático do dossiê.",
    lede: [
      "Com o nível de equipamento desligado, não existe mais inimigo forte — existe inimigo que te viu.",
      "Este volume é sobre a única vantagem que sobra: chegar sabendo onde todos estão, sem que nenhum deles saiba que você chegou."
    ],
    saltos: [["planta", "A base"], ["sentidos", "Como te acham"], ["postura", "Postura"], ["alerta", "Escala de alerta"], ["ciclo", "O ciclo"]],
    render: function () {
      var h = "";

      h += D.transmissao("Uma base marcada é uma base resolvida.",
        "O tempo que você gasta com o drone no ar antes do primeiro passo é o investimento com maior retorno do jogo inteiro. Quinze segundos de varredura evitam trinta minutos de perseguição — e, sem esquadra, uma perseguição é quase sempre uma morte adiada.");

      h += '<section id="planta">' +
        D.cabSecao("01 · A BASE, DE CIMA", "As cinco fases, numa planta só",
          "Um posto de Sentinel qualquer: oito guardas, uma câmera, uma torre e uma cerca. Percorra as fases e veja o que muda de uma para a outra. Os cones são o campo de visão de cada guarda — a informação que decide tudo.") +
        /* a seção já se chama "planta" por causa da âncora do menu: a tela
           precisa de outro id, senão D.el("planta") devolve a seção e o
           desenho apaga os botões de fase e o painel de explicação */
        '<div class="planta" id="planta-tela"></div><div class="fases" id="fases"></div><div class="explica" id="explica"></div>' +
        '<div class="planta-legenda">' +
        '<span style="color:var(--ruim)"><i></i> Guarda e campo de visão</span>' +
        '<span style="color:var(--medio)"><i></i> Câmera</span>' +
        '<span style="color:var(--sub)"><i></i> Você</span>' +
        '<span style="color:var(--bom)"><i></i> Rota</span>' +
        '<span style="margin-left:auto">Planta esquemática · não reproduz uma base específica</span>' +
        "</div></section>";

      h += D.sinal();

      h += '<section id="sentidos">' +
        D.cabSecao("02 · COMO TE ACHAM", "Quatro canais de detecção",
          "Você não é descoberto por um medidor. É descoberto por um destes quatro caminhos, e cada um tem uma contramedida diferente.") +
        '<div class="sentidos">' + SENTIDOS.map(function (s) {
          return '<article class="sentido" style="--s:' + s.c + '"><span class="ic">' + s.ic + "</span>" +
            "<h3>" + s.n + "</h3><p>" + s.d + '</p><p class="resp">' + s.r + "</p></article>";
        }).join("") + "</div>" +
        D.nota("O quarto canal é o que mais pega gente desprevenida. <b>Um corpo no chão vale um alarme</b> — e ao contrário dos outros três, ele não tem pressa: o guarda encontra o corpo dez minutos depois, quando você já está do outro lado da base achando que deu tudo certo.") +
        "</section>";

      h += D.sinal();

      h += '<section id="postura">' +
        D.cabSecao("03 · POSTURA E SOM", "O corpo é metade do problema") +
        '<div class="scroller"><table><thead><tr><th>Postura</th><th>Ruído</th><th>Silhueta</th><th>Quando usar</th></tr></thead><tbody>' +
        "<tr><td><b>Em pé</b></td><td>Alto ao correr</td><td>Máxima</td><td>Deslocamento fora do alcance visual. Dentro do perímetro, quase nunca.</td></tr>" +
        "<tr><td><b>Agachado</b></td><td>Baixo</td><td>Média</td><td>Padrão dentro da cerca. Permite mover-se com velocidade aceitável sem entregar som.</td></tr>" +
        "<tr><td><b>Deitado</b></td><td>Mínimo</td><td>Mínima, e nula com camuflagem natural</td><td>Aproximação final, espera por patrulha, e toda vez que um drone de varredura passa.</td></tr>" +
        "</tbody></table></div>" +
        '<div class="sub-body" style="margin-top:1.4rem"><div>' +
        '<p class="creed">O supressor não te deixa invisível. Ele compra tempo.<cite>use esse tempo para sair de onde você atirou</cite></p>' +
        '<p style="margin-top:1.2rem">Arma suprimida não impede que os inimigos localizem a origem do disparo — ela atrasa. Depois de dois ou três tiros do mesmo ponto, eles convergem. E mesmo suprimido, <b>disparar muito perto de outro guarda alerta esse guarda</b>: o som existe, ele só é mais curto.</p>' +
        "<p>A consequência prática é uma regra simples: <b>atire, mova-se, atire de outro lugar</b>. Em Breakpoint isso é mais importante do que em quase qualquer outro jogo de tiro tático, porque as bases são grandes e a reação é por convergência, não por corrida cega.</p>" +
        '</div><div class="kit">' +
        '<div class="card"><h4>O drone de tiro sincronizado</h4>' +
        '<div class="ability"><b>O que é</b><span>Pequenos drones lançáveis que marcam alvos e disparam simultaneamente com você.</span></div>' +
        '<div class="ability"><b>Por que importa tanto sozinho</b><span>É o substituto mecânico da esquadra de IA. Dois ou três abates no mesmo instante resolvem o problema que mais mata quem joga só: dois guardas que se enxergam.</span></div>' +
        '<div class="ability"><b>Onde conseguir</b><span>Ramo de furtividade da árvore de perícias, segundo nível, por um ponto.</span></div>' +
        '<div class="ability"><b>Como usar bem</b><span>Reserve os drones para o par que você não consegue separar. Guardas isolados não precisam deles.</span></div></div>' +
        '<p class="warn"><b>Regra de ouro do abate.</b> A ordem não é por proximidade nem por perigo — é por linha de visão. O primeiro a cair é sempre aquele que enxergaria o próximo a cair.</p>' +
        "</div></div></section>";

      h += D.sinal();

      h += '<section id="alerta">' +
        D.cabSecao("04 · ESCALA DE ALERTA", "Como uma base acorda",
          "O alerta não é binário. Ele sobe em degraus, e cada degrau tem uma saída diferente — inclusive os altos. Saber em que degrau você está é o que evita transformar um susto em meia hora de perseguição.") +
        '<div class="escala-alerta">' + NIVEIS.map(function (n) {
          return '<div class="nivel" style="--a:' + n.a + '"><span class="t">' + n.t + "</span><h4>" + n.n + "</h4>" +
            "<p>" + n.d + '</p><p class="saida-n"><b>Resposta</b>' + n.s + "</p></div>";
        }).join("") + "</div>" +
        D.alerta("O erro que custa a partida",
          "Continuar a missão depois que a base subiu dois degraus. Sem esquadra, a resposta certa quase sempre é sair do perímetro, deitar no mato, deixar o alerta baixar e recomeçar — Breakpoint permite isso, e é a ferramenta mais subutilizada do jogo.") +
        "</section>";

      h += D.sinal();

      h += '<section id="ciclo">' +
        D.cabSecao("05 · DOUTRINA", "O ciclo de uma base",
          "Toda invasão bem resolvida tem a mesma forma. Sem esquadra, o passo que as pessoas pulam — o último — é justamente o que separa uma infiltração limpa de trinta minutos de perseguição.") +
        '<div class="ciclo" id="ciclo"></div>' +
        '<div class="rp" style="margin-top:12px">' +
        '<div class="rp-card"><span class="k">Erro comum 01</span><h4>Atirar do lugar de onde se observou</h4><p>O ponto de observação é conhecido no instante do primeiro disparo. Marque dali, atire de outro lugar.</p></div>' +
        '<div class="rp-card"><span class="k">Erro comum 02</span><h4>Matar por ordem de proximidade</h4><p>A ordem certa é por ordem de quem vê quem. O primeiro a cair é sempre o que olharia para o próximo.</p></div>' +
        '<div class="rp-card"><span class="k">Erro comum 03</span><h4>Deixar corpo em pátio aberto</h4><p>Corpo encontrado levanta a base inteira. Arrastar leva três segundos e economiza um recomeço.</p></div>' +
        "</div></section>";

      return h;
    },
    depois: function () { plantaBase(); cicloBase(); }
  });

  var SENTIDOS = [
    { c: "var(--ruim)", n: "Visão",
      ic: D.ico('<path d="M4 20s6-10 16-10 16 10 16 10-6 10-16 10S4 20 4 20z"/><circle cx="20" cy="20" r="5"/>', "0 0 40 40"),
      d: "Cone frontal, com alcance que varia com luz, clima e sua postura. É o canal mais previsível — e o único que você pode ler de antemão com o drone.",
      r: "Contramedida: cone mapeado, aproximação agachado, e camuflagem natural deitado quando o cone cruzar você." },
    { c: "var(--medio)", n: "Som",
      ic: D.ico('<path d="M14 15h-6v10h6l9 7V8z"/><path d="M28 14a8 8 0 0 1 0 12M32 10a13 13 0 0 1 0 20" opacity=".8"/>', "0 0 40 40"),
      d: "Corrida, queda, veículo, vidro. Também o seu tiro — suprimido ou não. Chuva e tempestade abafam de verdade.",
      r: "Contramedida: agachado como padrão dentro da cerca, e operar sob chuva sempre que o bivaque permitir escolher." },
    { c: "#cf9a34", n: "Disparo",
      ic: D.ico('<path d="M6 24h16l6-6 6 2-4 8H10z"/><path d="M8 18l-3-6M14 16l-2-8" opacity=".8"/>', "0 0 40 40"),
      d: "Depois de dois ou três tiros da mesma posição, eles convergem para ela — suprimido só atrasa isso. Disparo perto de outro guarda alerta esse guarda mesmo com supressor.",
      r: "Contramedida: reposicionar entre disparos, e nunca eliminar dois alvos seguidos do mesmo ponto." },
    { c: "#7aa7e8", n: "Evidência",
      ic: D.ico('<path d="M10 30h20l-4-12H14z"/><circle cx="20" cy="12" r="4"/><path d="M6 34h28" opacity=".6"/>', "0 0 40 40"),
      d: "Corpo caído, veículo destruído, drone abatido, porta aberta. Este canal não tem pressa — ele te denuncia minutos depois, quando você já se acha seguro.",
      r: "Contramedida: arrastar todo corpo para fora de linha de visão, sempre. É o hábito mais barato e o mais esquecido." }
  ];

  var NIVEIS = [
    { a: "var(--bom)", t: "Nível 0", n: "Tranquilo", d: "Rondas normais, ninguém desconfia de nada. O estado em que a base inteira deve cair.", s: "Nada a fazer. Continue." },
    { a: "var(--bom)", t: "Nível 1", n: "Desconfiança", d: "Um guarda ouviu ou entreviu alguma coisa. Ele para, vira, caminha até o ponto. Ainda não chamou ninguém.", s: "Fique parado e deitado. A desconfiança expira sozinha se você não se mexer." },
    { a: "var(--medio)", t: "Nível 2", n: "Investigação", d: "Um ou dois guardas se deslocam para verificar, e a rotina da base muda. Corpo encontrado normalmente entra aqui.", s: "Recue para fora do perímetro pela rota de saída. Reentre por outro lado depois que baixar." },
    { a: "var(--medio)", t: "Nível 3", n: "Alerta", d: "A base sabe que existe alguém. Guardas em posição de combate, drones de busca no ar, reforço a caminho.", s: "Furtividade acabou. Escolha: sair de vez, ou assumir o conjunto quebrador e resolver com barulho." },
    { a: "var(--ruim)", t: "Nível 4", n: "Caçada", d: "Reforço chegando por veículo e ar, drones de busca varrendo a área ao redor, e a perseguição continua fora da base.", s: "Distância e camuflagem. Deitar na lama longe da base funciona melhor que correr — a busca é por posição conhecida." }
  ];

  function cenarioBase() {
    var g = "", r = D.prng(4711);
    g += '<rect width="' + PW + '" height="' + PH + '" fill="#060c0d"/>';
    g += '<g fill="#0c1a1a">';
    for (var i = 0; i < 90; i++) {
      var vx = r() * PW, vy = r() * PH;
      if (vx > 140 && vx < 820 && vy > 80 && vy < 460) continue;
      g += '<circle cx="' + vx.toFixed(0) + '" cy="' + vy.toFixed(0) + '" r="' + (6 + r() * 14).toFixed(0) + '"/>';
    }
    g += "</g>";
    g += '<rect x="140" y="80" width="680" height="380" fill="#0a1416"/>';
    g += '<rect x="140" y="80" width="680" height="380" fill="none" stroke="#2a4448" stroke-width="2"/>';
    g += '<g stroke="#1d3437" stroke-width="1">';
    for (var f = 140; f <= 820; f += 28) g += '<path d="M' + f + ' 80v8M' + f + ' 460v-8"/>';
    for (var f2 = 80; f2 <= 460; f2 += 28) g += '<path d="M140 ' + f2 + 'h8M820 ' + f2 + 'h-8"/>';
    g += "</g>";
    g += '<path d="M556 460h72" stroke="#060c0d" stroke-width="5"/>';
    g += '<text x="592" y="478" text-anchor="middle" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.6">PORTÃO</text>';

    function predio(x, y, w, hh, rot) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + hh + '" fill="#10201f" stroke="#2a4448" stroke-width="1.6"/>' +
        '<path d="M' + x + " " + (y + hh * .3) + "h" + w + '" stroke="#1d3437" stroke-width="1"/>' +
        '<text x="' + (x + w / 2) + '" y="' + (y + hh / 2 + 4) + '" text-anchor="middle" fill="#3d5f5f" ' +
        'font-family="JetBrains Mono, monospace" font-size="10" letter-spacing="2">' + rot + "</text>";
    }
    g += predio(214, 126, 146, 92, "ALOJ");
    g += predio(440, 282, 176, 112, "DEPÓSITO");
    g += predio(660, 118, 124, 118, "COMANDO");

    g += '<circle cx="700" cy="372" r="26" fill="#10201f" stroke="#2a4448" stroke-width="1.6"/>';
    g += '<circle cx="700" cy="372" r="15" fill="none" stroke="#1d3437" stroke-width="1"/>';
    g += '<text x="700" y="414" text-anchor="middle" fill="#3d5f5f" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.6">TORRE</text>';

    g += '<rect x="' + (OBJETIVO.x - 13) + '" y="' + (OBJETIVO.y - 13) + '" width="26" height="26" fill="none" stroke="#4ec8bb" stroke-width="1.8"/>';
    g += '<path d="M' + (OBJETIVO.x - 5) + " " + OBJETIVO.y + 'l4 5 8 -10" fill="none" stroke="#4ec8bb" stroke-width="2"/>';
    g += '<text x="' + OBJETIVO.x + '" y="' + (OBJETIVO.y - 22) + '" text-anchor="middle" fill="#4ec8bb" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.6">OBJETIVO</text>';

    g += '<g transform="translate(846,462)" stroke="#3d5f5f" stroke-width="1.2" fill="none">' +
      '<circle r="17"/><path d="M0 -17v34M-17 0h34" opacity=".5"/><path d="M0 -17l4 8h-8z" fill="#4ec8bb" stroke="none"/></g>' +
      '<text x="846" y="436" text-anchor="middle" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.4">N</text>';
    return g;
  }

  function camadaCones(comMarca) {
    var g = "<g>";
    GUARDAS.forEach(function (gu) {
      g += '<path d="' + D.cone(gu.x, gu.y, gu.a, 124, 30) + '" fill="#c8483d" fill-opacity=".13" stroke="#c8483d" stroke-opacity=".35" stroke-width="1"/>';
    });
    g += "</g><g>";
    GUARDAS.forEach(function (gu) {
      g += '<circle cx="' + gu.x + '" cy="' + gu.y + '" r="6.5" fill="#1a2c2e" stroke="#c8483d" stroke-width="2"/>';
      if (comMarca) {
        g += '<path d="M' + gu.x + " " + (gu.y - 20) + 'l5 6-5 6-5-6z" fill="#c8483d"/>';
        g += '<text x="' + (gu.x + 11) + '" y="' + (gu.y - 16) + '" fill="#c8483d" font-family="JetBrains Mono, monospace" font-size="9">' + gu.id + "</text>";
      }
    });
    g += "</g>";
    g += '<path d="' + D.cone(CAMERA.x, CAMERA.y, CAMERA.a, 104, 24) + '" fill="#cf9a34" fill-opacity=".12" stroke="#cf9a34" stroke-opacity=".4" stroke-width="1"/>';
    g += '<rect x="' + (CAMERA.x - 6) + '" y="' + (CAMERA.y - 5) + '" width="12" height="10" fill="#1a2c2e" stroke="#cf9a34" stroke-width="1.8"/>';
    return g;
  }

  function marcaVoce(rotulo) {
    return '<circle cx="' + VOCE.x + '" cy="' + VOCE.y + '" r="8" fill="#4ec8bb" fill-opacity=".2" stroke="#4ec8bb" stroke-width="2"/>' +
      '<circle cx="' + VOCE.x + '" cy="' + VOCE.y + '" r="2.6" fill="#4ec8bb"/>' +
      '<text x="' + (VOCE.x + 2) + '" y="' + (VOCE.y + 26) + '" text-anchor="middle" fill="#4ec8bb" ' +
      'font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.4">' + rotulo + "</text>";
  }

  var FASES = [
    { n: "Observar", cod: "FASE 01", titulo: "O drone sobe antes do seu pé",
      texto: "<p>Você está deitado no mato, a uns cento e cinquenta metros da cerca, fora de qualquer cone. <b>O drone sobe daqui</b> — de um ponto que não é o ponto de onde você vai entrar, e muito menos o de onde vai atirar.</p>" +
        "<p>O raio de varredura mostra o alcance útil do drone. É a primeira perícia que vale melhorar: mais alcance significa mapear a base inteira sem sair deste lugar seguro.</p>",
      desenho: function () {
        var g = '<circle cx="' + VOCE.x + '" cy="' + VOCE.y + '" r="290" fill="none" stroke="#4ec8bb" stroke-width="1.2" stroke-opacity=".28" stroke-dasharray="6 8"/>';
        g += '<text x="' + (VOCE.x + 196) + '" y="' + (VOCE.y - 210) + '" fill="#4ec8bb" fill-opacity=".6" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.6">ALCANCE DO DRONE</text>';
        g += '<g transform="translate(340,300)" stroke="#4ec8bb" stroke-width="1.6" fill="none">' +
          '<circle cx="-11" cy="-8" r="6" opacity=".55"/><circle cx="11" cy="-8" r="6" opacity=".55"/>' +
          '<circle cx="-11" cy="8" r="6" opacity=".55"/><circle cx="11" cy="8" r="6" opacity=".55"/>' +
          '<rect x="-7" y="-5" width="14" height="10" rx="2"/></g>';
        return g + camadaCones(false) + marcaVoce("PONTO DE OBSERVAÇÃO");
      } },
    { n: "Marcar", cod: "FASE 02", titulo: "Tudo que respira e tudo que gira",
      texto: "<p>Oito guardas e uma câmera. <b>O que não foi marcado é exatamente o que vai te matar</b> — então a varredura só acaba quando o drone deu a volta inteira, inclusive atrás dos prédios e dentro da torre.</p>" +
        "<p>Com o marcador de inimigo desligado no HUD, esta fase muda de natureza: a marca não fica na tela para sempre. Você está memorizando uma planta, não ligando um radar. Vale abrir o mapa e olhar de novo antes de entrar.</p>",
      desenho: function () { return camadaCones(true) + marcaVoce("VOCÊ"); } },
    { n: "Escolher", cod: "FASE 03", titulo: "A ordem é por quem enxerga quem",
      texto: "<p>Aqui está o passo que separa quem limpa uma base de quem apanha nela. A numeração <b>não é por distância nem por perigo</b>: é pela cadeia de testemunhas.</p>" +
        "<p>Começa em <b>A</b>, isolado no canto. Depois <b>B</b>, de costas. <b>C</b> e <b>D</b> se enxergam — esse é o par que exige drone de tiro sincronizado, ou uma espera até a ronda separá-los. A torre <b>E</b> vem quando o pátio já está vazio, porque de lá se vê quase tudo. <b>H</b> é o último por estar mais fundo, perto do objetivo.</p>",
      desenho: function () {
        var g = camadaCones(false);
        g += '<g stroke="#cf9a34" stroke-width="1.2" stroke-dasharray="4 5" opacity=".65">' +
          '<path d="M402 168L556 196"/><path d="M486 124L402 168"/><path d="M700 372L614 430"/></g>';
        g += '<text x="470" y="152" fill="#cf9a34" font-family="JetBrains Mono, monospace" font-size="8.5" letter-spacing="1.2" opacity=".85">SE ENXERGAM</text>';
        GUARDAS.forEach(function (gu) {
          g += '<circle cx="' + gu.x + '" cy="' + (gu.y - 22) + '" r="11" fill="#0a1416" stroke="#4ec8bb" stroke-width="1.6"/>';
          g += '<text x="' + gu.x + '" y="' + (gu.y - 18) + '" text-anchor="middle" fill="#4ec8bb" font-family="JetBrains Mono, monospace" font-size="10">' + gu.ordem + "</text>";
        });
        return g + marcaVoce("VOCÊ");
      } },
    { n: "Executar", cod: "FASE 04", titulo: "Entrar pela borda, nunca pelo meio",
      texto: "<p>A rota acompanha a cerca oeste, por fora dos cones, e só cruza para dentro depois que A e B caíram. <b>Cada corpo é arrastado para fora da linha de visão antes do próximo alvo</b> — três segundos que evitam que a base inteira acorde dez minutos depois.</p>" +
        "<p>Repare que a rota nunca atravessa o pátio aberto. O pátio é o lugar onde a torre te vê, e a torre é o número cinco.</p>",
      desenho: function () {
        var g = camadaCones(false);
        g += '<path d="M74 462 L150 430 L178 402 L226 330 L268 292 L330 226 L402 172 L470 150 L556 196 L620 300 L660 372 L700 372" ' +
          'fill="none" stroke="#6ea45c" stroke-width="2.4" stroke-dasharray="8 6" stroke-linecap="round"/>';
        GUARDAS.forEach(function (gu) {
          g += '<g opacity=".55"><path d="M' + (gu.x - 7) + " " + (gu.y - 7) + "l14 14M" + (gu.x + 7) + " " + (gu.y - 7) +
            'l-14 14" stroke="#6ea45c" stroke-width="2" stroke-linecap="round"/></g>';
          g += '<text x="' + (gu.x + 12) + '" y="' + (gu.y - 10) + '" fill="#6ea45c" font-family="JetBrains Mono, monospace" font-size="9">' + gu.ordem + "</text>";
        });
        return g + marcaVoce("ENTRADA");
      } },
    { n: "Sumir", cod: "FASE 05", titulo: "A saída foi escolhida antes do primeiro tiro",
      texto: "<p>A fase que quase todo mundo pula. <b>Sem esquadra, a rota de saída é o plano inteiro</b> — porque se algo der errado em qualquer uma das quatro fases anteriores, é para cá que você corre, e não dá tempo de inventar caminho.</p>" +
        "<p>Duas saídas marcadas: a leste, pela vegetação densa atrás do prédio de comando, e a sul, pelo portão, se um veículo estiver esperando ali. <b>Escolha uma antes de entrar</b> e saiba dizer, a qualquer momento da operação, para que lado você corre.</p>",
      desenho: function () {
        var g = camadaCones(false);
        g += '<path d="M788 172 L830 210 L862 280" fill="none" stroke="#6ea45c" stroke-width="2.4" stroke-dasharray="8 6" stroke-linecap="round"/>';
        g += '<path d="M788 172 L740 300 L640 420 L592 470" fill="none" stroke="#6ea45c" stroke-width="2" stroke-dasharray="6 6" stroke-linecap="round" opacity=".7"/>';
        g += '<text x="856" y="308" text-anchor="end" fill="#6ea45c" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.4">SAÍDA A · MATA</text>';
        g += '<text x="592" y="496" text-anchor="middle" fill="#6ea45c" font-family="JetBrains Mono, monospace" font-size="9" letter-spacing="1.4" opacity=".8">SAÍDA B · VEÍCULO</text>';
        g += '<circle cx="862" cy="280" r="13" fill="none" stroke="#6ea45c" stroke-width="1.8"/>';
        g += '<circle cx="592" cy="470" r="11" fill="none" stroke="#6ea45c" stroke-width="1.6" opacity=".8"/>';
        return g;
      } }
  ];

  function plantaBase() {
    if (!D.el("fases") || !D.el("planta-tela") || !D.el("explica")) return;
    D.el("fases").innerHTML = FASES.map(function (f, i) {
      return '<button type="button" data-f="' + i + '" aria-pressed="' + (i === 0) + '">' +
        "<span>" + f.n + "</span><small>" + f.cod + "</small></button>";
    }).join("");

    function pintar(i) {
      D.el("planta-tela").innerHTML = '<svg viewBox="0 0 ' + PW + " " + PH + '" xmlns="http://www.w3.org/2000/svg" role="img" ' +
        'aria-label="Planta esquemática de uma base vista de cima, com oito guardas, seus campos de visão, uma câmera, uma torre e a fase ' +
        (i + 1) + ' da invasão destacada">' + cenarioBase() + FASES[i].desenho() + "</svg>";
      D.el("explica").innerHTML = "<h3>" + FASES[i].cod + " · " + FASES[i].titulo + "</h3>" + FASES[i].texto;
      Array.prototype.forEach.call(document.querySelectorAll("#fases button"), function (b, j) {
        b.setAttribute("aria-pressed", String(j === i));
      });
    }
    D.el("fases").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-f]");
      if (b) pintar(parseInt(b.getAttribute("data-f"), 10));
    });
    pintar(0);
  }

  function cicloBase() {
    var alvo = D.el("ciclo");
    if (!alvo) return;
    var PASSOS = [
      ["Observar", "Deitado, fora do alcance. Drone no ar antes de qualquer passo."],
      ["Marcar", "Todos os inimigos, câmeras e drones. O que não foi marcado é o que te mata."],
      ["Escolher", "A ordem de abate é por quem enxerga quem, nunca por quem está mais perto."],
      ["Executar", "Em silêncio, do mais isolado para o mais acompanhado. Corpo sempre escondido."],
      ["Sumir", "A rota de saída foi decidida antes do primeiro tiro. Sem esquadra, ela é o plano inteiro."]
    ];
    var w = 980, hh = 215, pad = 40, passo = (w - pad * 2) / (PASSOS.length - 1), g = "";
    g += '<line x1="' + pad + '" y1="72" x2="' + (w - pad) + '" y2="72" stroke="currentColor" stroke-width="1.5" opacity=".3" stroke-dasharray="6 7"/>';
    PASSOS.forEach(function (p, i) {
      var x = pad + passo * i;
      g += '<circle cx="' + x + '" cy="72" r="19" fill="var(--surface2)" stroke="currentColor" stroke-width="1.6"/>';
      g += '<text x="' + x + '" y="78" text-anchor="middle" fill="currentColor" font-family="JetBrains Mono, monospace" font-size="15">' + (i + 1) + "</text>";
      g += '<text x="' + x + '" y="28" text-anchor="middle" fill="currentColor" font-family="Saira Condensed, sans-serif" font-size="21" letter-spacing="1.4">' + p[0].toUpperCase() + "</text>";
      var palavras = p[1].split(" "), l1 = "", l2 = "";
      palavras.forEach(function (pal) {
        if ((l1 + " " + pal).trim().length <= 26) l1 = (l1 + " " + pal).trim(); else l2 = (l2 + " " + pal).trim();
      });
      g += '<text x="' + x + '" y="114" text-anchor="middle" fill="var(--muted)" font-family="Barlow, sans-serif" font-size="13">' + l1 + "</text>";
      g += '<text x="' + x + '" y="132" text-anchor="middle" fill="var(--muted)" font-family="Barlow, sans-serif" font-size="13">' + l2 + "</text>";
      if (i < PASSOS.length - 1) {
        var xm = x + passo / 2;
        g += '<path d="M' + (xm - 6) + ' 67l7 5-7 5" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".8"/>';
      }
    });
    g += '<path d="M' + (w - pad) + " 91 C" + (w - pad) + " 190, " + pad + " 190, " + pad + ' 91" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".32" stroke-dasharray="5 6"/>';
    g += '<path d="M' + (pad - 5) + ' 99l5 -8 5 8" fill="none" stroke="currentColor" stroke-width="1.6" opacity=".7"/>';
    g += '<text x="' + (w / 2) + '" y="192" text-anchor="middle" fill="var(--muted)" font-family="JetBrains Mono, monospace" font-size="11" letter-spacing="2.4">A PRÓXIMA BASE COMEÇA AQUI</text>';

    alvo.innerHTML = '<svg viewBox="0 0 ' + w + " " + hh + '" xmlns="http://www.w3.org/2000/svg" ' +
      'style="color:color-mix(in srgb, var(--sub) 80%, var(--text))" role="img" ' +
      'aria-label="Ciclo de cinco passos para invadir uma base, com um laço que retorna ao início">' + g + "</svg>";
  }

  /* ═══════════════════════════════════════════════════════════
     VOLUME 06 · OS LOBOS
     ═══════════════════════════════════════════════════════════ */

  var AMEACAS = [
    { c: "var(--muted)", cl: "Humano · Infantaria regular", n: "Sentinel", med: "1,8 m",
      d: "A empresa de segurança privada contratada para guardar Auroa. Ocupa a maior parte dos postos da ilha: competente, previsível e sempre trabalhando em par.",
      comp: "Rondas fixas com pontos de parada. Um anda, o outro cobre. Reagem a som, a corpo encontrado e a disparo, nessa ordem de sensibilidade.",
      perigo: "Volume. Individualmente frágeis, mas um alarme converte oito guardas isolados num grupo organizado com cobertura mútua.",
      resp: "Abate silencioso na ordem de linha de visão, corpo arrastado sempre. O par é o problema — separe pela ronda ou resolva com drone de tiro sincronizado.",
      art: D.figuras.sentinel() },
    { c: "var(--ruim)", cl: "Humano · Elite", n: "Lobos", med: "1,8 m",
      d: "Ex-Ghosts e ex-forças especiais que romperam com o próprio país, formados em 2023 e comandados pelo Tenente-Coronel <b>Cole D. Walker</b> — um ex-companheiro de esquadra do Nomad. Treinados no mesmo manual que você, por alguém que conhece esse manual de cor. São a razão de o jogo se chamar Breakpoint.",
      comp: "Flanqueiam, suprimem, jogam granada em quem se entrincheira e chamam apoio mecanizado. Não correm em linha reta para a sua posição. <b>Vêm em quatro arquétipos, e dá para identificar cada um pela arma:</b> o <b>fuzileiro</b> carrega TAR-21 com granada de fragmentação e de luz; o <b>arrombador</b>, escopeta KSG e granada de luz; o <b>atirador</b>, fuzil L115A3 e pistola P320; e o <b>foguete</b>, um RAT-4 sem recuo. Acima deles há tenentes de elite com especialidades próprias — atirador, especialista em drone, contra-insurgência, assassinato.",
      perigo: "São o único inimigo humano que pune de verdade um tiroteio simétrico. Trocar tiro de frente com Lobo é como você perde no imersivo.",
      resp: "Evitar o combate justo. Se o contato abriu, reposicione em vez de revidar — e considere sair do perímetro e recomeçar depois que o alerta baixar. Conhecendo os arquétipos, a ordem de prioridade se resolve sozinha: <b>o atirador primeiro</b>, porque é ele que te prende atrás da pedra, e o foguete logo em seguida se você estiver de veículo.",
      art: D.figuras.lobo() },
    { c: "var(--medio)", cl: "Drone · Aéreo leve", n: "Murmur", med: "0,4 m",
      d: "Quadricóptero ágil derivado do arquétipo <b>Succubus</b>, armado com submetralhadora. <b>Voa em bando</b> para defender uma área determinada e ataca qualquer pessoa não reconhecida assim que a vê. Opera em <b>terreno aberto</b> — vale, planície, encosta —, que é justamente onde você tem menos para onde correr.",
      comp: "Voa direto até o contato e mantém pressão. Não usa cobertura, não recua, não desiste enquanto tiver energia. Como defende uma área e não persegue pela ilha inteira, sair do setor costuma resolver.",
      perigo: "Sozinho, quase nenhum. Em grupo, te prende na defensiva pelo tempo exato que a infantaria precisa para chegar.",
      resp: "Escopeta à queima-roupa, ou rajada curta. Em silêncio: spray de camuflagem da Pantera, que simplesmente o desliga como sensor — <b>desde que ele ainda não tenha te visto</b>. Depois de detectado, o spray não faz mais nada, e essa regra vale para todo drone.",
      art: D.figuras.murmur() },
    { c: "var(--medio)", cl: "Drone · Aéreo pesado", n: "Malphas", med: "1,2 m",
      d: "Drone de combate aéreo superior, armado com submetralhadora e projetado para <b>patrulhar e guardar acampamentos dos Lobos</b>. Isso o torna um indicador: onde há Malphas voando, há Lobo no chão — e não apenas Sentinel.",
      comp: "Mantém distância média, dispara em rajadas e acompanha deslocamento. Chamado por alarme e por torres de comunicação.",
      perigo: "Fuzil resolve devagar demais. Enquanto você esvazia um pente, ele fecha distância e a base inteira converge para o barulho.",
      resp: "Pulso eletromagnético para travar, explosivo para terminar. O lança-granadas acoplado ao fuzil é a ferramenta mais eficiente do jogo contra ele.",
      art: D.figuras.malphas() },
    { c: "var(--ruim)", cl: "Drone · Terrestre", n: "Incubus", med: "2,4 m",
      d: "O <b>arquétipo</b> dos drones de solo — modelo de treinamento usado nas áreas de teste da Skell e pelos Lobos para aprenderem a combater ao lado de máquina. Armado com <b>metralhadora pesada à direita e lança-granadas à esquerda</b>. Dele derivam o Aamon, o Andras e o Aym.",
      comp: "Persegue você quando detecta, e ofusca para desorientar. Roda sobre rodas omnidirecionais, o que permite deslocamento lateral.",
      perigo: "Encarar de frente é perder o carregador sem resultado. A combinação de metralhadora pesada e lança-granadas não deixa você parado em cobertura por muito tempo.",
      resp: "<b>Suba.</b> Esse é o ponto fraco real: ele é péssimo em ladeira. Depois de cinco tentativas frustradas de subir, desiste e passa a atirar de onde está — o que troca um perseguidor por um atirador distante, e isso você resolve saindo da linha de visão. Se for para matar, vale para <b>toda a linhagem terrestre</b>: as placas de blindadura do chassi cobrem <b>pontos fracos alaranjados</b>, e derrubar a placa com dano concentrado é o que expõe o ponto. Pulso eletromagnético atordoa qualquer drone de solo. Ainda assim, deitar na vegetação e deixar passar continua sendo o mais barato.",
      art: D.figuras.incubus() },
    { c: "var(--sub)", cl: "Drone · Vigilância", n: "Azraël", med: "Alta altitude",
      d: "Plataforma de vigilância que varre grandes áreas do alto, com <b>câmeras de alta resolução, sensores de calor e algoritmos de reconhecimento de padrão</b>. Desarmado, e ainda assim a ameaça mais consequente da ilha — porque ele não atira, ele <b>conta para os outros</b>.",
      comp: "Ao detectar, solta um <b>sinalizador</b> na sua posição e repassa as coordenadas aos drones Andras e Stolas por perto, que são redirecionados para interceptar. Os Lobos monitoram essa comunicação e chegam junto — ou, se o terreno não permite patrulha a pé, vem helicóptero. E o seu minimapa cai.",
      perigo: "É a origem da maior parte das perseguições que parecem começar do nada. Você não foi visto por um guarda — foi visto pelo céu, e o céu avisou todo mundo. <b>A rede que ele usa depende de relés em terra</b>, e é justamente isso que os Behemoth estão guardando por aí.",
      resp: "<b>Você é avisado duas vezes:</b> ele aparece no minimapa como ícone vermelho de avião antes de chegar, e é muito audível — parece um avião mesmo. Deitar com camuflagem natural e entrar sob teto resolvem sempre. E há um ponto cego estrutural: <b>a inteligência dele se atrapalha com a topografia dos fiordes</b> — quando bate numa encosta alta, ele só sobe alguns metros e segue reto, em vez de contornar. As linhas de suprimento dos Homesteaders exploram exatamente isso, e você pode fazer o mesmo: vale fundo e parede de rocha valem mais que mato ralo. Abater é possível — <b>um tiro bem colocado de fuzil de alto calibre basta</b> —, mas ele é rápido e alto, e errar é pior do que não tentar.",
      art: D.figuras.azrael() },
    { c: "var(--ruim)", cl: "Drone · Plataforma blindada", n: "Behemoth", med: "≈ 6 m",
      d: "Quadrúpede blindado que vagueia por áreas selvagens isoladas com autonomia quase infinita, encarregado de <b>proteger os relés de drone</b> espalhados pela ilha. Armado com duas gatling grandes, um morteiro de tiro múltiplo e um <b>lançador de mísseis antiaéreos</b>. Existe uma variante que dispersa gás tóxico pelo morteiro.",
      comp: "Ronda um setor definido e anuncia a presença de longe. Dispara em área e obriga movimento constante — o círculo vermelho no chão é o aviso de onde o morteiro vai cair.",
      perigo: "Sem preparo, ele simplesmente não morre. E <b>o pulso eletromagnético resolve muito menos do que parece</b>: ele tem dispositivo anti-pulso e <b>reinicia sozinho</b> depois da falha de sistema.",
      resp: "<b>Calibre .50 de longa distância</b> — HTI, TAC-50 ou M82 — manobrando para escapar dos morteiros. Melhor ainda para quem joga sozinho: o <b>IC-8 Incursion</b>, blindado o bastante para trocar tiro com as gatling dele e com um canhão que dispara a cada segundo e meio. A variante Berserker custa <b>12 mil créditos contra 75 mil da padrão</b> — é a compra mais subestimada do jogo. <b>Não tente de helicóptero:</b> os mísseis quase não arranham, e o antiaéreo dele derruba a aeronave. Ou, com total legitimidade num jogo solo: contornar.",
      art: D.figuras.behemoth() },
    { c: "#cf9a34", cl: "Estático · Sensor", n: "Câmeras e torres", med: "fixo",
      d: "Câmeras de perímetro e torres de comunicação. Não matam ninguém e decidem muita coisa.",
      comp: "Cone fixo ou oscilante. A torre de comunicação é o que convoca reforço aéreo quando o alerta sobe.",
      perigo: "Uma câmera não vista transforma uma infiltração perfeita em alerta nível três sem que você entenda por quê.",
      resp: "Marcar com o drone junto com os guardas — elas contam como alvo. Destruir em silêncio, ou passar por fora do cone.",
      art: D.figuras.sensor() }
  ];

  var MATRIZ = [
    ["Sentinel", 2, 0, 1, 1, 1], ["Lobos", 2, 0, 1, 1, 2], ["Murmur", 1, 2, 1, 2, 2],
    ["Malphas", 0, 2, 2, 1, 1], ["Incubus", 0, 2, 2, 0, 2], ["Azraël", 1, 0, 0, 0, 2],
    ["Behemoth", 0, 1, 2, 0, 2], ["Câmeras", 2, 1, 1, 0, 2]
  ];

  var FACCOES = [
    { f: "var(--ruim)", n: "Sentinel", rel: "Hostil",
      d: "Empresa militar privada chefiada por <b>Trey Stone</b>, com Leon Fairrow acima dele. Foi <b>contratada pela própria Skell</b> para reforçar uma segurança interna limitada, em resposta aos ataques dos Outcasts — e depois tomou a ilha, com ajuda do ex-assessor militar da Skell, e impôs lei marcial. É quem você encontra na maior parte dos postos.",
      b: D.brasao("sentinel") },
    { f: "var(--ruim)", n: "Lobos", rel: "Hostil · Elite",
      d: "Grupo de ex-Ghosts e ex-forças especiais que tomou as instalações da Skell Technology. São os antagonistas diretos da operação e a única infantaria que joga no mesmo nível técnico que você.",
      b: D.brasao("lobos") },
    { f: "var(--sub)", n: "Homesteaders", rel: "Aliado",
      d: "Colonos de Auroa que abandonaram suas terras e se refugiaram em Erewhon, um sistema de cavernas. Armados com o que sobrou de rifles de caça e equipamento antigo. É a sua base de operações e a sua loja.",
      b: D.brasao("homesteaders") },
    { f: "#7bd36a", n: "Outcasts", rel: "Aliado",
      d: "Ex-funcionários da Skell Technology que pediram demissão e formaram uma resistência contra o rumo transumanista da empresa. Liderados por <b>Haruhi Ito</b>, engenheira civil que trabalhou para Jace Skell. Fonte de missões e de contexto técnico. <b>A história não é limpa:</b> foram ataques dos Outcasts — um deles matou trinta funcionários e destruiu um prédio — que deram à Skell o motivo para contratar a Sentinel, e à Sentinel o pretexto para a lei marcial.",
      b: D.brasao("outcasts") },
    { f: "var(--muted)", n: "Skell Technology", rel: "Contexto",
      d: "A empresa de tecnologia que construiu Auroa como ilha-laboratório e encheu o arquipélago de drones autônomos, fundada por Jace Skell. Tudo que voa e atira na ilha saiu de alguma instalação dela.",
      b: D.brasao("skell") },
    { f: "var(--medio)", n: "Erewhon", rel: "Base",
      d: "O sistema de cavernas escondido sob a província do Monte Hodgson, tocado por <b>Mads Schulz</b> — fuzileiro reformado que ficou em Auroa como fazendeiro depois que as bases americanas foram desativadas. Loja com <b>Maria Schulz</b>, mulher dele e contramestre do lugar; missões iniciais com o Sargento-Mor <b>Josiah Hill</b>. O único ponto realmente seguro do arquipélago.",
      b: D.brasao("erewhon") }
  ];

  D.reg({
    id: "v06", cod: "06", nome: "Os lobos", arquivo: "bestiario.dat",
    titulo: "Os lobos", subtitulo: "gente, máquina e a diferença entre elas", cor: "var(--ruim)",
    desc: "Bestiário completo com comparação de escala desenhada, a linhagem dos oito drones de combate, matriz de contramedidas e as facções do arquipélago.",
    lede: [
      "Auroa tem dois tipos de inimigo, e confundi-los é o erro mais caro que existe aqui.",
      "Gente pensa: desconfia, investiga, encontra corpo, chama reforço. Máquina não pensa — ela vê melhor, reage mais rápido e ignora tudo que não esteja no sensor. As duas categorias pedem ferramentas opostas."
    ],
    saltos: [["escala", "Escala"], ["fichas", "Fichas"], ["linhagem", "Linhagem"], ["matriz", "Matriz"], ["azrael", "O Azraël"], ["faccoes", "Facções"]],
    render: function () {
      var h = "";

      h += D.transmissao("Máquina vê melhor que gente. Gente pensa melhor que máquina.",
        "Um drone passa ao lado de um corpo no chão e não registra nada. Uma sentinela passa, vê o corpo, e a base inteira acorda. É por isso que esconder corpo importa contra humanos e é irrelevante contra drones — e por que pulso eletromagnético importa contra drones e é inútil contra humanos.");

      h += '<section id="escala">' +
        D.cabSecao("01 · ESCALA", "Tudo que anda em Auroa, lado a lado",
          "Desenhado em escala comparativa a partir das alturas aproximadas. Serve para entender o que você está olhando quando avista uma silhueta a duzentos metros, antes de decidir se avança ou se deita. <b>Os dois drones menores estão ampliados para continuarem legíveis</b> — a altura escrita embaixo de cada um é a de referência.") +
        '<div class="escala-fig" id="escala-fig"></div></section>';

      h += D.sinal();

      h += '<section id="fichas">' +
        D.cabSecao("02 · FICHAS", "Ameaça por ameaça",
          "Cada ficha traz o comportamento, o que a torna perigosa e — o campo que realmente importa — a resposta correta no perfil imersivo solo, onde não há ninguém para dividir a atenção do inimigo com você.") +
        '<div class="ameacas">' + AMEACAS.map(function (a) {
          return '<article class="ameaca" style="--c:' + a.c + '">' +
            '<div class="fig">' + a.art + '<span class="med">' + a.med + "</span></div>" +
            '<div class="txt"><span class="cl">' + a.cl + "</span><h3>" + a.n + "</h3><p>" + a.d + "</p>" +
            '<div class="linhas-a">' +
            "<div><b>Comportamento</b><span>" + a.comp + "</span></div>" +
            "<div><b>Por que dói</b><span>" + a.perigo + "</span></div>" +
            "<div><b>Resposta</b><span>" + a.resp + "</span></div>" +
            "</div></div></article>";
        }).join("") + "</div>" +
        D.nota("<b>As fichas acima não são o catálogo inteiro.</b> O arsenal mecânico da ilha passa de quinze drones militares; os que faltam estão na linhagem da seção seguinte, e ainda sobram <b>City Cherubim, Sky Cherubim, Legion, Wasp</b> e uma variante <b>Rogue</b> do Azraël. Estão aqui os que você encontra com mais frequência e os que exigem resposta diferente.") +
        D.nota("Fora da escala de tudo isso existem os <b>Titãs</b> — <b>Baal, Gargoyle, Cerberus</b> e o computador quântico da Skell —, que pertencem à incursão Project Titan em Golem Island e não aparecem na ilha comum. Se você jogar sozinho, é conteúdo que provavelmente não vai ver: incursão é feito para grupo.") +
        D.nota("Fora os drones, a ilha tem <b>três tipos de torre automática</b> — lançador antiaéreo, canhão rotativo e morteiro — e uma frota de <b>drones civis da Skell</b> que não atiram em ninguém: cortador de árvore, escavadeira, agricultor, transportador, carregador e até um médico. Eles não são ameaça, e é justamente por isso que servem: um drone civil trabalhando sozinho num pátio significa que aquele pátio não foi esvaziado às pressas.") +
        "</section>";

      h += D.sinal();

      h += '<section id="linhagem">' +
        D.cabSecao("03 · LINHAGEM", "Duas famílias, oito máquinas",
          "Todo drone de combate de Auroa desce de um de dois protótipos de treinamento: o <b>Incubus</b>, no chão, e o <b>Succubus</b>, no ar. Reconhecer a linhagem vale mais que decorar nome — o chassi carrega a fraqueza junto. E o modelo que você avista diz onde você está: uns patrulham mato, outros escoltam Lobo, outros guardam acampamento.") +
        '<div class="scroller"><table><thead><tr>' +
        "<th>Modelo</th><th>Armamento</th><th>Onde aparece</th><th>O que muda para você</th>" +
        "</tr></thead><tbody>" +
        '<tr><td colspan="4" style="background:color-mix(in srgb, var(--ruim) 12%, transparent);font-weight:600;letter-spacing:.08em">CHÃO · linhagem Incubus</td></tr>' +
        "<tr><td><b>Incubus</b><small style='display:block;opacity:.6;font-weight:400;letter-spacing:.06em'>Mk I</small></td><td>Metralhadora pesada à direita, lança-granadas à esquerda</td><td>Áreas de teste da Skell e treino dos Lobos</td><td>É o molde. Todo o resto herda o chassi, as rodas omnidirecionais e a fraqueza em ladeira.</td></tr>" +
        "<tr><td><b>Aamon</b><small style='display:block;opacity:.6;font-weight:400;letter-spacing:.06em'>Mk II</small></td><td>Duas metralhadoras pesadas</td><td>Patrulha autônoma em <b>vegetação</b> — floresta, selva, pântano</td><td><b>Vem em par.</b> Se você avistou um, o segundo existe e você ainda não o viu. Rodas mecanum: anda de lado sem girar, então flanquear funciona menos do que deveria.</td></tr>" +
        "<tr><td><b>Andras</b><small style='display:block;opacity:.6;font-weight:400;letter-spacing:.06em'>Mk IV</small></td><td>Metralhadora pesada e lança-granadas</td><td>Apoio principal das <b>patrulhas dos Lobos</b>; é um dos dois que o Azraël convoca</td><td>Andras andando no chão significa uma de duas coisas: há Lobo por perto, ou o céu já te viu. Nenhuma das duas pede que você continue parado.</td></tr>" +
        "<tr><td><b>Aym</b><small style='display:block;opacity:.6;font-weight:400;letter-spacing:.06em'>Mk V</small></td><td>Metralhadora pesada e lança-granadas</td><td>Guarda <b>acampamento dos Lobos</b>, em dupla com o Malphas. Ainda em beta, produção baixa — é o mais raro</td><td>Tem uma <b>esfera vermelha no topo do chassi</b>: dano suficiente ali o atordoa e recolhe o olho. É a sua janela para reposicionar ou concentrar fogo, e o olho volta depois, então dá para repetir.</td></tr>" +
        '<tr><td colspan="4" style="background:color-mix(in srgb, var(--medio) 12%, transparent);font-weight:600;letter-spacing:.08em">AR · linhagem Succubus</td></tr>' +
        "<tr><td><b>Succubus</b><small style='display:block;opacity:.6;font-weight:400;letter-spacing:.06em'>Mk I</small></td><td>Submetralhadora comum</td><td>Áreas de teste da Skell — montanha, selva, cidade falsa — e treino dos Lobos</td><td>O mais inofensivo do céu. Balança de lado, fica quase parado atirando por uns quatro segundos, faz dano baixo e gradual. Vem em pares ou mais.</td></tr>" +
        "<tr><td><b>Murmur</b></td><td>Submetralhadora</td><td><b>Terreno aberto</b>, em bando, defendendo área</td><td>Não persegue pela ilha: sair do setor resolve. O perigo é o tempo que ele te prende parado.</td></tr>" +
        "<tr><td><b>Stolas</b><small style='display:block;opacity:.6;font-weight:400;letter-spacing:.06em'>Mk II</small></td><td>Submetralhadora comum</td><td>Apoio aéreo principal das <b>patrulhas dos Lobos</b>; o outro que o Azraël convoca</td><td><b>O único inimigo do jogo que te estuda.</b> Cada Stolas repassa os dados do combate aos outros, e o enxame aprende dos engajamentos anteriores: achada uma falha na sua tática, todos passam a explorá-la. Quem repete a mesma abertura perde na terceira vez.</td></tr>" +
        "<tr><td><b>Malphas</b><small style='display:block;opacity:.6;font-weight:400;letter-spacing:.06em'>Mk III</small></td><td>Submetralhadora</td><td>Patrulha e guarda <b>acampamento dos Lobos</b></td><td>Indicador de que aquele acampamento não é da Sentinel. Pulso para travar, explosivo para terminar.</td></tr>" +
        "</tbody></table></div>" +
        D.nota("<b>A lição prática está na linha do Stolas.</b> Contra gente e contra as outras máquinas, repetir o que funcionou é boa disciplina. Contra enxame de Stolas, é o começo da sua derrota — eles guardam o que deu certo contra você. Varie o lado da aproximação, a altura e a arma entre um engajamento e o seguinte.") +
        D.nota("Duas notas de estrutura: <b>Andras e Stolas são a dupla</b> que o Azraël convoca quando solta o sinalizador, e trabalham sempre em conjunto — um no chão, um no ar. E na <b>Operação Motherland</b> quem opera o Azraël passa a ser o Bodark em vez dos Lobos, com o mesmo procedimento: patrulha terrestre, ou helicóptero onde o chão não dá passagem.") +
        "</section>";

      h += D.sinal();

      var SIMBOLO = ["○", "◐", "●"], CLASSE = ["nao", "meio", "sim"];
      h += '<section id="matriz">' +
        D.cabSecao("04 · MATRIZ", "O que funciona contra o quê",
          "A tabela que resolve a maioria das dúvidas de campo. Cheio significa resposta correta, meio significa que funciona mas custa caro, vazio significa que você está desperdiçando recurso.") +
        '<div class="scroller"><table class="matriz"><thead><tr>' +
        "<th>Ameaça</th><th>Tiro suprimido</th><th>Pulso eletro&shy;magnético</th><th>Explosivo</th><th>Escopeta</th><th>Evitar</th>" +
        "</tr></thead><tbody>" +
        MATRIZ.map(function (l) {
          return "<tr><td><b>" + l[0] + "</b></td>" + l.slice(1).map(function (v) {
            return '<td class="s ' + CLASSE[v] + '">' + SIMBOLO[v] + "</td>";
          }).join("") + "</tr>";
        }).join("") +
        "</tbody></table></div>" +
        D.nota("A coluna que mais gente ignora é a última. <b>Evitar é uma resposta legítima e frequentemente a melhor</b> — Behemoth, Incubus em patrulha e Azraël raramente precisam morrer. Eles precisam não te encontrar, o que é outra coisa e custa muito menos munição.") +
        "</section>";

      h += D.sinal();

      h += '<section id="azrael">' +
        D.cabSecao("05 · CASO ESPECIAL", "O Azraël, e por que a perseguição começa do nada") +
        '<div class="sub-body"><div>' +
        '<p class="creed">Ele não atira. Ele conta para os outros.<cite>e é por isso que é o mais perigoso da lista</cite></p>' +
        '<p style="margin-top:1.2rem">O Azraël é um drone de vigilância de alta altitude que sobrevoa grandes áreas de tempos em tempos. Ele não tem armamento. Quando localiza você, duas coisas acontecem: <b>o seu minimapa é desativado</b> e forças são despachadas para a sua posição.</p>' +
        "<p>Isso explica a experiência mais confusa de quem começa o jogo: estar atravessando o mato, sem ter atirado em ninguém, e de repente ter companhia. Não foi um guarda que te viu. Foi o céu.</p>" +
        "<p>Há dois avisos, e vale aprender os dois: um alerta de interface, se você não o tiver desligado, e o som — um zumbido grave que cresce. <b>No perfil imersivo, com avisos desligados, o som é tudo que você tem.</b></p>" +
        '</div><div class="kit">' +
        '<div class="card"><h4>As contramedidas</h4>' +
        '<div class="ability"><b>Deitar e camuflar</b><span>Barriga no chão em vegetação, mato alto, lama ou neve, e aplicar camuflagem natural. Ele passa e não registra nada. Gratuito e sempre disponível.</span></div>' +
        '<div class="ability"><b>Entrar sob um teto</b><span>Qualquer construção resolve — ele não enxerga através de telhado. Mais rápido que deitar, quando há teto por perto.</span></div>' +
        '<div class="ability"><b>Usar o fiorde</b><span>A inteligência dele lida mal com a topografia recortada de Auroa: ao encontrar uma encosta alta, sobe alguns metros e segue em linha reta em vez de contornar. Vale fundo e parede de rocha são cobertura melhor que mato ralo — é assim que as linhas de suprimento dos Homesteaders sobrevivem.</span></div>' +
        '<div class="ability"><b>Spray de camuflagem</b><span>O item exclusivo da Pantera apaga você para drones em movimento, sem precisar parar. <b>Contra o Azraël, porém, conte com sorte:</b> a ficha do drone diz que funciona, a ficha da classe diz explicitamente que não. Use como bônus, nunca como plano.</span></div>' +
        '<div class="ability"><b>Abatê-lo</b><span>Possível, e quase sempre um erro: o disparo denuncia a sua posição para tudo num raio grande. Se for fazer, faça longe de base.</span></div></div>' +
        '<p class="warn"><b>Regra de campo.</b> Ao ouvir o zumbido: pare de correr, deite no lugar mais fechado que estiver ao alcance de dois segundos e espere. Correr para uma cobertura distante é o que faz ele te achar.</p>' +
        "</div></div></section>";

      h += D.sinal();

      h += '<section id="faccoes">' +
        D.cabSecao("06 · QUEM É QUEM", "As facções de Auroa",
          "Contexto sem trama: quem ocupa a ilha, quem resiste e quem só quer ser deixado em paz. Nomes e posições, nada além disso.") +
        '<div class="faccoes">' + FACCOES.map(function (f) {
          return '<article class="faccao" style="--f:' + f.f + '"><span class="brasao">' + f.b + "</span>" +
            "<h3>" + f.n + '</h3><span class="rel">' + f.rel + "</span><p>" + f.d + "</p></article>";
        }).join("") + "</div>" +
        D.alerta("Nenhum ponto de virada aqui",
          "Este volume nomeia facções e personagens de apoio porque você vai esbarrar em todos eles nas primeiras horas. O que eles querem, o que descobrem e como a história termina continuam fora do dossiê.") +
        "</section>";

      return h;
    },
    depois: function () { escalaComparativa(); }
  });

  function escalaComparativa() {
    var alvo = D.el("escala-fig");
    if (!alvo) return;
    var W = 980, H = 380, solo = 300, PPM = 30, g = "";

    g += '<rect width="' + W + '" height="' + H + '" fill="#060c0d"/>';
    g += '<g stroke="#1d3437" stroke-width="1">';
    for (var m = 1; m <= 7; m++) {
      var y = solo - m * PPM;
      g += '<path d="M40 ' + y + "H" + (W - 20) + '" opacity="' + (m % 2 ? ".5" : ".28") + '" stroke-dasharray="2 6"/>';
      g += '<text x="30" y="' + (y + 4) + '" text-anchor="end" fill="#3d5f5f" font-family="JetBrains Mono, monospace" font-size="10" stroke="none">' + m + "m</text>";
    }
    g += "</g><path d='M40 " + solo + "H" + (W - 20) + "' stroke='#2a4448' stroke-width='2'/>";

    function figura(x, corpo, nome, alturaM, cor) {
      return '<g transform="translate(' + x + "," + solo + ')" fill="' + cor + '" stroke="' + cor +
        '" stroke-width="1.4" stroke-linejoin="round">' + corpo + "</g>" +
        '<text x="' + x + '" y="' + (solo + 24) + '" text-anchor="middle" fill="' + cor +
        '" font-family="Saira Condensed, sans-serif" font-size="15" letter-spacing="1">' + nome.toUpperCase() + "</text>" +
        '<text x="' + x + '" y="' + (solo + 40) + '" text-anchor="middle" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="9.5">' + alturaM + "</text>";
    }

    /* A 30 pixels por metro um humano tem 54 px: detalhe é desperdício
       nesse tamanho, e boneco de palito é o pior resultado possível.
       Silhueta cheia é o que lê melhor numa comparação de escala. */
    var ESC = (1.8 * PPM / 98).toFixed(3);   /* a silhueta mede 98 unidades */
    function humano(extra) {
      return '<g transform="scale(' + ESC + ') translate(0,-24)">' +
        D.silhueta("humano") + (extra || "") + "</g>";
    }

    g += figura(110, humano(), "Sentinel", "1,8 m", "#8b9a97");
    g += figura(215, humano(
      /* visão noturna levantada e mochila: a silhueta do Lobo precisa
         ser reconhecível sem legenda */
      '<path d="M-8 -84h16v6h-16z"/><path d="M-6 -90h4v6h-4zM2 -90h4v6h-4z"/>' +
      '<path d="M11 -54h6l2 26h-8z"/>'
    ), "Lobo", "1,8 m", "#c8483d");

    var mu = 0.4 * PPM;
    g += figura(318,
      '<g transform="translate(0,' + (-mu - 26) + ')" fill="none" stroke-width="1.7">' +
      '<circle cx="-13" cy="-4" r="6.5" opacity=".6"/><circle cx="13" cy="-4" r="6.5" opacity=".6"/>' +
      '<circle cx="-13" cy="6" r="6.5" opacity=".6"/><circle cx="13" cy="6" r="6.5" opacity=".6"/>' +
      '<rect x="-7" y="-4" width="14" height="9" rx="2"/><circle cx="0" cy="1" r="2.4"/></g>' +
      '<path d="M0 ' + (-mu - 16) + 'V0" fill="none" stroke-width="1" opacity=".3" stroke-dasharray="3 4"/>',
      "Murmur", "0,4 m · voa", "#cf9a34");

    var ma = 1.2 * PPM;
    g += figura(430,
      '<g transform="translate(0,' + (-ma - 44) + ')" fill="none" stroke-width="1.8">' +
      '<path d="M0 -16l20 12v16L0 24l-20-12V-4z"/><circle cx="0" cy="4" r="5"/>' +
      '<circle cx="-26" cy="-14" r="7" opacity=".55"/><circle cx="26" cy="-14" r="7" opacity=".55"/>' +
      '<circle cx="-26" cy="20" r="7" opacity=".55"/><circle cx="26" cy="20" r="7" opacity=".55"/></g>' +
      '<path d="M0 ' + (-ma - 20) + 'V0" fill="none" stroke-width="1" opacity=".3" stroke-dasharray="3 4"/>',
      "Malphas", "1,2 m · voa", "#cf9a34");

    var inc = 2.4 * PPM;
    g += figura(560,
      '<path d="M-40 0h80l-8-' + (inc * .42).toFixed(0) + 'H-32Z" fill="none" stroke-width="2.2"/>' +
      '<path d="M-24 -' + (inc * .42).toFixed(0) + "l6-" + (inc * .26).toFixed(0) + "h36l6 " + (inc * .26).toFixed(0) + '" fill="none" stroke-width="2"/>' +
      '<rect x="-15" y="-' + inc.toFixed(0) + '" width="30" height="' + (inc * .32).toFixed(0) + '" fill="none" stroke-width="2"/>' +
      '<path d="M15 -' + (inc * .84).toFixed(0) + 'h24" fill="none" stroke-width="2.2"/>' +
      '<circle cx="-24" cy="-6" r="7" fill="none" stroke-width="2"/><circle cx="0" cy="-6" r="7" fill="none" stroke-width="2"/>' +
      '<circle cx="24" cy="-6" r="7" fill="none" stroke-width="2"/>',
      "Incubus", "2,4 m", "#c8483d");

    var be = 6 * PPM;
    g += figura(760,
      '<path d="M-64 -' + (be * .52).toFixed(0) + "h128l16 " + (be * .17).toFixed(0) + "-16 " + (be * .16).toFixed(0) +
      "H-64l-16-" + (be * .16).toFixed(0) + 'Z" fill="none" stroke-width="2.6"/>' +
      '<path d="M-34 -' + (be * .52).toFixed(0) + "v-" + (be * .14).toFixed(0) + "h68v" + (be * .14).toFixed(0) + '" fill="none" stroke-width="2.2" opacity=".85"/>' +
      '<rect x="-22" y="-' + be.toFixed(0) + '" width="44" height="' + (be * .2).toFixed(0) + '" fill="none" stroke-width="2.4"/>' +
      '<path d="M22 -' + (be * .9).toFixed(0) + 'h54" fill="none" stroke-width="3"/>' +
      '<circle cx="0" cy="-' + (be * .36).toFixed(0) + '" r="11" fill="none" stroke-width="2.2" opacity=".8"/>' +
      '<path d="M-48 -' + (be * .19).toFixed(0) + "L-64 0M-20 -" + (be * .19).toFixed(0) + "L-28 0M20 -" +
      (be * .19).toFixed(0) + "L28 0M48 -" + (be * .19).toFixed(0) + 'L64 0" fill="none" stroke-width="3" stroke-linecap="round"/>',
      "Behemoth", "≈ 6 m", "#c8483d");

    g += '<g transform="translate(880,66)" fill="none" stroke="#4ec8bb" stroke-width="1.8" stroke-linejoin="round">' +
      '<path d="M0 -14l34 18-34 10-34-10z"/><path d="M0 -14v24M-34 4L0 14l34-10"/><circle cx="0" cy="2" r="2.6" fill="#4ec8bb"/></g>';
    g += '<path d="M880 84v96" stroke="#4ec8bb" stroke-width="1" opacity=".3" stroke-dasharray="4 6"/>';
    g += '<text x="880" y="196" text-anchor="middle" fill="#4ec8bb" font-family="Saira Condensed, sans-serif" font-size="15" letter-spacing="1">AZRAËL</text>';
    g += '<text x="880" y="212" text-anchor="middle" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="9.5">alta altitude</text>';
    g += '<text x="40" y="30" fill="#4ec8bb" font-family="JetBrains Mono, monospace" font-size="10" letter-spacing="3" opacity=".7">COMPARAÇÃO DE ESCALA · ALTURAS APROXIMADAS</text>';

    alvo.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="Comparação de escala entre as ameaças de Auroa, de um drone Murmur de 0,4 metro até o Behemoth de cerca de 6 metros">' + g + "</svg>";
  }
})(window.DOSSIE);
