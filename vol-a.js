/* CROSS-COM — volumes 01 a 03. */

(function (D) {
  "use strict";

  /* ═══════════════════════════════════════════════════════════
     VOLUME 01 · ANTES DE PISAR NA ILHA
     ═══════════════════════════════════════════════════════════ */

  var CHAVES = [
    ["el-inimigos", "Marcadores de inimigo", "Losangos vermelhos sobre inimigos marcados, visíveis através de parede.", 0],
    ["el-detec", "Medidor de detecção", "O arco que enche quando alguém começa a desconfiar de você.", 0],
    ["el-minimapa", "Minimapa", "O radar do canto inferior esquerdo, com contatos próximos.", 0],
    ["el-mira", "Mira fixa na tela", "Retículo permanente no centro, mesmo sem estar mirando.", 0],
    ["el-objetivo", "Marcador de objetivo", "Losango e distância do objetivo atual da missão.", 1],
    ["el-alertas", "Avisos e alertas", "Mensagens de sistema, incluindo aviso de drone de varredura.", 1],
    ["el-espolio", "Ícones de espólio", "Marcadores amarelos sobre caixas e itens no chão.", 0],
    ["el-municao", "Contador de munição", "Pente atual, reserva e estado da arma.", 1],
    ["el-folego", "Barra de fôlego", "Resistência restante ao correr, nadar e escalar.", 1],
    ["el-tecnica", "Técnica de classe", "Ícone e recarga da técnica da sua classe.", 1]
  ];

  var PERFIS = [
    {
      nome: "Pé no chão",
      nota: "Para quem quer o modo imersivo sem se punir. Tira a corrida por equipamento e a poluição de HUD, mas mantém as ajudas que evitam frustração boba. <b>Boa escolha se esta é sua primeira vez em Breakpoint.</b>",
      linhas: [
        ["Nível de equipamento", "Desligado", 1, "A mudança central. Arma passa a valer pelo que ela é, não por um número acima da cabeça do inimigo."],
        ["Dificuldade dos inimigos", "Avançado", 1, "Inimigo morre em poucos tiros e você também. Extremo vem depois, quando a leitura de terreno estiver madura."],
        ["Dificuldade tática", "Veterano", 1, "Fôlego, regeneração e quantidade de bandagem em nível exigente sem virar contabilidade."],
        ["Marcadores de inimigo", "Ligados", 0, "Mantidos por enquanto. É a muleta que você vai tirar por último, quando o drone já for reflexo."],
        ["Minimapa", "Desligado", 1, "O primeiro item a cair. Obriga a olhar o terreno em vez do canto da tela."],
        ["Mira fixa na tela", "Desligada", 1, "Sem retículo permanente. Tiro de quadril deixa de ser opção gratuita."],
        ["Exploração", "Guiada", 0, "Marcador de objetivo no mapa. Sem ele, a ilha fica grande demais logo de cara."],
        ["Munição perdida ao recarregar", "Desligada", 0, "Recarregar com pente pela metade não descarta o resto. Desligue esta punição enquanto aprende a economizar."],
        ["Bivaques e garagem", "Livres", 0, "Viagem rápida e veículo sem restrição, para não transformar deslocamento em imposto de tempo."]
      ]
    },
    {
      nome: "O que você pediu",
      nota: "Imersivo de verdade, jogando sozinho: o HUD some quase inteiro e o drone passa a ser o único jeito honesto de saber onde estão os inimigos. <b>É o perfil que corresponde ao seu pedido — imersivo, solo, sem esquadra.</b>",
      linhas: [
        ["Nível de equipamento", "Desligado", 1, "Sem gear score, sem raridade, sem inimigo esponja. Só balística e posição."],
        ["Dificuldade dos inimigos", "Extremo", 1, "Dois ou três tiros matam, dos dois lados. É o ajuste que faz cobertura importar."],
        ["Dificuldade tática", "Elite", 1, "Fôlego curto, regeneração mínima, poucas bandagens. Bivaque vira base de operação, não botão de viagem."],
        ["Marcadores de inimigo", "Desligados", 1, "A configuração mais importante da lista. Sem losango vermelho, marcar com drone deixa de ser opcional."],
        ["Minimapa", "Desligado", 1, "Mapa é uma tela que você abre, não um canto que você espia."],
        ["Medidor de detecção", "Desligado", 1, "Você descobre que foi visto pelo som e pela reação, como eles descobrem você."],
        ["Mira fixa na tela", "Desligada", 1, "Só mira pelo ferro ou pela luneta. Muda a distância de engajamento inteira."],
        ["Exploração", "Não guiada", 1, "Objetivo descrito em texto e coordenada, não apontado com seta. É onde a ilha vira lugar em vez de mapa de ícones."],
        ["Munição perdida ao recarregar", "Ligada", 0, "Opinião: mantenha ligada só se gostar de contar pente. É a regra mais realista e a mais chata da lista."]
      ]
    },
    {
      nome: "Sem rede",
      nota: "O teto da punição. Tudo desligado, inimigo no máximo e recursos no mínimo. <b>Não recomendo para a primeira partida</b> — não por ser difícil, mas porque esconde sistemas que você ainda não viu funcionando.",
      linhas: [
        ["Nível de equipamento", "Desligado", 1, "Idem."],
        ["Dificuldade dos inimigos", "Extremo", 1, "Margem de erro praticamente zero em espaço aberto."],
        ["Dificuldade tática", "Elite personalizado", 1, "Regeneração desligada, bandagem no mínimo, fôlego curto."],
        ["Marcadores de inimigo", "Desligados", 1, "Nada de losango, nem depois de marcar com o drone em alguns ajustes."],
        ["Alertas e avisos de HUD", "Desligados", 1, "Nenhuma mensagem de aviso. Você lê a situação ou morre nela."],
        ["Ícones de espólio", "Desligados", 1, "Nada brilha no chão. Caixa é coisa que se procura, não que se vê de longe."],
        ["Exploração", "Não guiada", 1, "Coordenada e bússola. Nada além disso."],
        ["Munição perdida ao recarregar", "Ligada", 1, "Cada recarga fora de hora custa munição de verdade."],
        ["Bivaques e garagem", "Restritos", 1, "Sem viagem rápida livre e sem veículo surgindo do nada. Deslocamento vira parte da missão."]
      ]
    }
  ];

  function telaHUD() {
    return '<svg id="hud" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" role="img" ' +
      'aria-label="Simulação da tela de jogo em primeira pessoa mostrando os elementos de interface que podem ser ligados e desligados">' +
      '<defs>' +
      '<linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#14242a"/><stop offset="100%" stop-color="#0a1416"/></linearGradient>' +
      '<linearGradient id="chao" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#101c1c"/><stop offset="100%" stop-color="#070d0e"/></linearGradient>' +
      "</defs>" +
      '<rect width="640" height="360" fill="url(#ceu)"/>' +
      '<path d="M0 178 L72 128 L126 160 L198 106 L268 156 L330 120 L404 166 L470 132 L536 170 L604 142 L640 164 V360 H0Z" fill="#0c191b"/>' +
      '<path d="M0 210 L88 186 L164 208 L246 180 L332 206 L418 184 L512 212 L604 190 L640 204 V360 H0Z" fill="url(#chao)"/>' +
      '<g stroke="#16282a" stroke-width="1.4" fill="none" opacity=".9">' +
      '<path d="M40 238l6-18 6 18M100 232l7-20 7 20M186 244l6-17 6 17M300 236l7-19 7 19M392 248l6-18 6 18M498 240l7-20 7 20M576 250l6-18 6 18"/></g>' +
      '<g fill="#0f1d1f" stroke="#1b3033" stroke-width="1">' +
      '<rect x="236" y="186" width="58" height="24"/><rect x="300" y="192" width="40" height="18"/><path d="M236 186l29-11 29 11"/></g>' +
      '<g stroke="#1b3033" stroke-width="1.2" fill="none" opacity=".8"><path d="M224 210v-34M352 210v-30M224 182h128"/></g>' +
      '<g stroke="#2a4448" stroke-width="1" opacity=".5">' +
      '<path d="M60 40l-8 26M140 12l-8 26M210 56l-8 26M290 22l-8 26M360 62l-8 26M430 30l-8 26M500 52l-8 26M570 18l-8 26M96 92l-8 26M330 96l-8 26M602 88l-8 26"/></g>' +
      '<g fill="#1a2c2e" stroke="#2c4a4c" stroke-width="1">' +
      '<circle cx="262" cy="196" r="3.4"/><path d="M262 200v9M258 203l-4 5M266 203l4 5M259 209l-2 8M265 209l2 8"/></g>' +
      '<g fill="#1a2c2e" stroke="#2c4a4c" stroke-width="1">' +
      '<circle cx="388" cy="202" r="3.4"/><path d="M388 206v9M384 209l-4 5M392 209l4 5M385 215l-2 8M391 215l2 8"/></g>' +

      '<g id="el-inimigos" fill="none" stroke="#e0554a" stroke-width="1.6">' +
      '<path d="M262 180l5 6-5 6-5-6z" fill="#e0554a"/><path d="M388 186l5 6-5 6-5-6z" fill="#e0554a"/>' +
      '<text x="272" y="186" fill="#e0554a" font-family="JetBrains Mono, monospace" font-size="8" stroke="none">62 m</text>' +
      '<text x="398" y="192" fill="#e0554a" font-family="JetBrains Mono, monospace" font-size="8" stroke="none">94 m</text></g>' +

      '<g id="el-mira" stroke="#dbe6e3" stroke-width="1.4" fill="none">' +
      '<path d="M320 172v-10M320 188v10M304 180h-10M336 180h10"/><circle cx="320" cy="180" r="1.6" fill="#dbe6e3"/></g>' +

      '<g id="el-detec">' +
      '<path d="M296 150a30 30 0 0 1 48 0" fill="none" stroke="#4ec8bb" stroke-width="3" opacity=".35"/>' +
      '<path d="M296 150a30 30 0 0 1 22 -13" fill="none" stroke="#e0a83a" stroke-width="3"/>' +
      '<text x="308" y="134" fill="#e0a83a" font-family="JetBrains Mono, monospace" font-size="7.5" letter-spacing="1.2">SUSPEITA</text></g>' +

      '<g id="el-objetivo">' +
      '<path d="M540 60l7 9-7 9-7-9z" fill="none" stroke="#4ec8bb" stroke-width="1.6"/><circle cx="540" cy="69" r="2" fill="#4ec8bb"/>' +
      '<text x="554" y="66" fill="#4ec8bb" font-family="JetBrains Mono, monospace" font-size="8.5">OBJETIVO</text>' +
      '<text x="554" y="78" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="8">1,4 KM</text></g>' +

      '<g id="el-alertas">' +
      '<rect x="248" y="26" width="144" height="19" fill="none" stroke="#e0a83a" stroke-width="1" opacity=".8"/>' +
      '<text x="320" y="39" text-anchor="middle" fill="#e0a83a" font-family="JetBrains Mono, monospace" font-size="8.5" letter-spacing="1.4">DRONE DE VARREDURA</text></g>' +

      '<g id="el-minimapa">' +
      '<circle cx="66" cy="292" r="42" fill="#07100f" stroke="#2a4448" stroke-width="1.2"/>' +
      '<circle cx="66" cy="292" r="28" fill="none" stroke="#1d3437" stroke-width="1"/>' +
      '<path d="M66 250v84M24 292h84" stroke="#1d3437" stroke-width="1"/>' +
      '<path d="M66 286l5 9h-10z" fill="#4ec8bb"/>' +
      '<circle cx="82" cy="276" r="2.4" fill="#e0554a"/><circle cx="52" cy="304" r="2.4" fill="#e0554a"/><circle cx="90" cy="302" r="2.4" fill="#e0554a"/>' +
      '<text x="66" y="244" text-anchor="middle" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="7.5" letter-spacing="1.4">N</text></g>' +

      '<g id="el-municao">' +
      '<text x="612" y="306" text-anchor="end" fill="#dbe6e3" font-family="JetBrains Mono, monospace" font-size="22">24</text>' +
      '<text x="612" y="322" text-anchor="end" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="9">/ 186</text>' +
      '<rect x="522" y="288" width="52" height="8" fill="none" stroke="#2a4448" stroke-width="1"/>' +
      '<rect x="522" y="288" width="34" height="8" fill="#2a4448"/></g>' +

      '<g id="el-folego">' +
      '<rect x="268" y="330" width="104" height="5" fill="#132325"/><rect x="268" y="330" width="68" height="5" fill="#4ec8bb" opacity=".8"/>' +
      '<text x="268" y="325" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="7.5" letter-spacing="1.2">FÔLEGO</text></g>' +

      '<g id="el-tecnica">' +
      '<rect x="140" y="304" width="30" height="30" fill="none" stroke="#2a4448" stroke-width="1.2"/>' +
      '<path d="M148 326c4-6 14-6 18 0M155 314a5 5 0 1 1 .1 0" fill="none" stroke="#4ec8bb" stroke-width="1.4"/>' +
      '<text x="155" y="346" text-anchor="middle" fill="#7b8e8b" font-family="JetBrains Mono, monospace" font-size="7">TÉCNICA</text></g>' +

      '<g id="el-espolio">' +
      '<path d="M452 236l4 5-4 5-4-5z" fill="#c9a227"/><path d="M168 258l4 5-4 5-4-5z" fill="#c9a227"/>' +
      '<text x="460" y="244" fill="#c9a227" font-family="JetBrains Mono, monospace" font-size="7.5">CAIXA</text></g>' +
      "</svg>";
  }

  D.reg({
    id: "v01", cod: "01", nome: "Antes de pisar na ilha", arquivo: "ghost_experience.dat",
    titulo: "Antes de pisar", subtitulo: "na ilha", cor: "var(--sub)",
    desc: "O Ghost Experience parâmetro por parâmetro, com um simulador ao vivo da sua tela e a ordem certa de tirar cada muleta.",
    lede: [
      "A decisão mais pesada de Breakpoint acontece antes da primeira missão, numa tela de menu que a maioria das pessoas atravessa em quinze segundos.",
      "Aqui ela está aberta inteira: o que cada parâmetro faz de verdade, o que muda de imediato, o que só aparece quarenta horas depois — e a ordem em que vale a pena tirar cada muleta."
    ],
    saltos: [["dois", "As duas economias"], ["simulador", "Simulador"], ["perfis", "Perfis"], ["parametros", "Parâmetros"], ["desmame", "Desmame"]],
    render: function () {
      var h = "";

      h += D.transmissao("Regular é um jogo. Imersivo é outro.",
        "Não é uma escala de dificuldade: são duas economias diferentes. Em Regular, o que te separa do inimigo é um número, e progresso significa achar um número maior. Em Imersivo esse número não existe — o inimigo morre com dois tiros no dia um e com dois tiros no dia quarenta, e o que evolui é você.");

      h += '<section id="dois">' +
        D.cabSecao("01 · O GARFO NA ESTRADA", "As duas economias",
          'O jogo oferece <span class="mono">Regular</span>, <span class="mono">Imersivo</span> e <span class="mono">Personalizado</span>. Os dois primeiros são só atalhos para um conjunto de chaves — tudo é personalizável, e quase tudo pode ser revisto depois em <span class="mono">Configurações › Parâmetros do Ghost Experience</span>.') +
        '<div class="scroller"><table><thead><tr><th>O que muda</th><th>Regular</th><th>Imersivo</th></tr></thead><tbody>' +
        "<tr><td><b>Nível de equipamento</b></td><td>Existe. Cada peça tem um número, o inimigo também, e a diferença entre eles vira dano.</td><td>Não existe. Nenhuma peça tem número; a arma vale pelo que ela é.</td></tr>" +
        "<tr><td><b>Raridade de espólio</b></td><td>Comum, raro, épico. Caçar caixa é parte do laço de jogo.</td><td>Sem raridade. O espólio vira projeto de arma, acessório e aparência.</td></tr>" +
        "<tr><td><b>Arma encontrada no chão</b></td><td>Pode ser um salto de poder imediato.</td><td>É <b>temporária</b> e não aceita acessório — normalmente pior que a sua.</td></tr>" +
        "<tr><td><b>Inimigo acima do seu nível</b></td><td>Absorve muito mais tiro. Áreas ficam travadas na prática.</td><td>Não existe. Qualquer inimigo morre de um tiro bem colocado.</td></tr>" +
        "<tr><td><b>Cura</b></td><td>Regeneração generosa.</td><td>Regeneração limitada; seringa e bandagem viram consumo diário.</td></tr>" +
        "<tr><td><b>Recarga</b></td><td>Munição do pente volta para a mochila.</td><td>Opção de <b>descartar o pente pela metade</b>, como na vida.</td></tr>" +
        "<tr><td><b>Interface</b></td><td>Completa.</td><td>Reduzida por padrão, e desmontável peça por peça.</td></tr>" +
        "</tbody></table></div>" +
        D.nota("O detalhe que engana muita gente: <b>o imersivo não é mais difícil por causa do dano.</b> Dois tiros matam dos dois lados — o que significa que uma base inteira morre rápido se você for competente. A dificuldade real vem da informação que some da tela, e essa é uma escolha separada, no bloco de interface.") +
        "</section>";

      h += D.sinal();

      h += '<section id="simulador">' +
        D.cabSecao("02 · SIMULADOR", "A sua tela, antes de entrar",
          "Cada chave do bloco de interface remove um pedaço da tela. Descrever isso em texto não funciona — então aqui está a tela. Desligue as caixas e veja o que sobra. Três predefinições abaixo dos interruptores; a segunda é a que corresponde ao seu perfil.") +
        '<div class="tela-grid">' +
        '<div><div class="tela">' + telaHUD() +
        '<div class="rotulo">Simulação esquemática do quadro de jogo · os elementos refletem as chaves ao lado</div></div></div>' +
        "<div>" +
        '<div class="interruptores">' +
        '<div class="cab"><span>Elementos de interface</span><b id="contagem"></b></div>' +
        '<div id="chaves"></div>' +
        '<div class="presets">' +
        '<button type="button" data-set="cheio">Tudo ligado</button>' +
        '<button type="button" data-set="perfil">Perfil imersivo solo</button>' +
        '<button type="button" data-set="nu">Sem rede</button>' +
        "</div></div>" +
        '<p class="small" style="margin-top:.9rem">Os nomes acima correspondem aos blocos do menu de interface do jogo. O que o simulador não consegue mostrar é a consequência: com <b style="color:var(--text)">marcadores de inimigo</b> desligados, aqueles dois losangos vermelhos somem — e com eles a única informação que dizia onde estavam as duas pessoas que estão, sim, ali na tela.</p>' +
        "</div></div></section>";

      h += D.sinal();

      h += '<section id="perfis">' +
        D.cabSecao("03 · PERFIS", "Três configurações completas",
          "O do meio é o que corresponde ao que você pediu. Cada linha traz o valor e o porquê dele.") +
        '<div class="console"><div class="abas" id="abas"></div>' +
        '<div class="nota" id="nota-perfil"></div><div class="linhas" id="linhas-perfil"></div></div>' +
        D.nota('Uma advertência honesta sobre o marcador de inimigos: desligá-lo é a mudança mais radical da lista. O jogo inteiro foi desenhado supondo que você enxerga losangos vermelhos através das paredes. <b>Sem eles, a marcação por drone deixa de ser conveniência e vira o único olho que você tem</b> — e é exatamente por isso que vale.') +
        "</section>";

      h += D.sinal();

      h += '<section id="parametros">' +
        D.cabSecao("04 · PARÂMETRO POR PARÂMETRO", "Tudo que o menu pergunta",
          "O selo destacado marca a escolha recomendada para o seu perfil. Onde não há selo, é porque a escolha é legitimamente de gosto — e eu digo qual é o lado de cada uma.") +
        '<h3 style="font-size:1.1rem;margin:0 0 .8rem;color:color-mix(in srgb, var(--sub) 78%, var(--text))">Bloco 1 · Regras do mundo</h3>' +
        '<div class="param" style="margin-bottom:1.6rem">' +
        linhaParam("Nível de equipamento", "Desligado", 1, "A chave mestra. Ligada, cada arma e peça carrega um número e o jogo vira caça a números maiores. Desligada, some a raridade, some o inimigo-esponja e some a pressão de trocar de arma. <b>É a diferença entre um looter-shooter e um jogo tático.</b>") +
        linhaParam("Dificuldade dos inimigos", "Extremo", 1, "Controla dano recebido, precisão e velocidade de detecção. Em <b>Extremo</b>, dois ou três tiros matam dos dois lados — o que soa brutal e na prática é o contrário: uma base inteira cai rápido se você for competente, e trocar tiro em campo aberto deixa de ser opção. <b>Avançado</b> é o degrau honesto se você quiser margem enquanto aprende.") +
        linhaParam("Dificuldade tática", "Elite", 1, "Um grupo de sub-chaves: velocidade de regeneração, fôlego, quantidade de bandagem, frequência de ferimento, número de armas principais e perda de munição ao recarregar. <b>Elite</b> aperta tudo. Personalizado é onde a maioria acaba, porque duas dessas sub-chaves merecem atenção separada — abaixo.") +
        linhaParam("Armas principais", "Duas", 0, "Elite reduz para uma arma principal. Opinião: <b>mantenha duas.</b> Jogando sozinho, uma arma só significa que a distância errada te deixa sem resposta — e sem esquadra não há quem cubra a lacuna. Realismo que custa opções não vale o preço.") +
        linhaParam("Munição perdida ao recarregar", "Sua escolha", 0, "Recarregar com pente pela metade descarta o resto. É a regra mais realista da lista e a que mais gera aborrecimento pequeno. <b>Ligue se você gosta de contar pente; desligue se prefere que a tensão venha do combate, não da contabilidade.</b>") +
        linhaParam("Exploração", "Não guiada", 1, "Guiada põe a seta no mapa. Não guiada entrega descrição, coordenada e pistas — e você encontra. É a chave que mais transforma Auroa de mapa de ícones em lugar. <b>Também é a que mais alonga o jogo</b>, e isso é bom ou ruim conforme o seu tempo livre.") +
        linhaParam("Bivaques e garagem", "Livres", 0, "Restringir viagem rápida e nascimento de veículo torna deslocamento parte da missão. Puro, e caro em tempo real. <b>Opinião: comece livre.</b> Se em vinte horas a viagem rápida estiver estragando a sensação de ilha, restrinja aí.") +
        "</div>" +
        '<h3 style="font-size:1.1rem;margin:0 0 .8rem;color:color-mix(in srgb, var(--sub) 78%, var(--text))">Bloco 2 · Interface</h3>' +
        '<div class="param">' +
        linhaParam("Marcadores de inimigo", "Desligados", 1, "A chave mais importante do jogo inteiro, e a mais radical. Com ela ligada, inimigos marcados aparecem como losangos vermelhos através de qualquer parede, para sempre. Desligada, <b>a marcação por drone deixa de ser conveniência e passa a ser o seu único olho</b> — você olha o mundo, não a interface.") +
        linhaParam("Minimapa", "Desligado", 1, "A muleta mais fácil de largar e a que mais muda postura: sem ele, você para de jogar olhando o canto inferior esquerdo. O mapa completo continua a um botão de distância.") +
        linhaParam("Medidor de detecção", "Desligado", 1, "Aquele arco que enche enquanto alguém desconfia de você. Desligado, o aviso passa a ser sonoro e comportamental: o inimigo para, vira, chama o colega. <b>É o ajuste que mais aproxima Breakpoint de um jogo de furtividade de verdade.</b>") +
        linhaParam("Mira fixa na tela", "Desligada", 1, "Sem retículo permanente, tiro de quadril vira aposta e mirar pelo ferro vira padrão. Muda a distância de todos os engajamentos.") +
        linhaParam("Marcadores de objetivo", "Dinâmicos", 0, "Opinião: mantenha em dinâmico, aparecendo só quando relevante. Desligar tudo aqui combina com exploração não guiada, mas a soma das duas coisas é bastante rigorosa para uma primeira partida.") +
        linhaParam("Ícones de espólio", "Desligados", 1, "Sem gear score, caixa não é recompensa urgente — é projeto de arma e acessório. Desligar os ícones tira a compulsão de varrer o chão e não custa quase nada.") +
        linhaParam("Avisos e mensagens", "Dinâmicos", 0, "Alguns avisos são ruído; o de drone de varredura se aproximando, não. Opinião: mantenha os de alerta, desligue os de sistema e experiência.") +
        linhaParam("Dicas, legendas e módulo de XP", "Desligados", 1, "Legendas são preferência pessoal. Dicas de tutorial e números de experiência subindo na tela não pertencem a esta versão do jogo.") +
        "</div>" +
        D.nota("Uma nota sobre reversibilidade: <b>quase tudo aqui pode ser mudado a qualquer momento</b>, inclusive no meio de uma missão. A única coisa que não volta é a primeira impressão — descobrir Auroa com o mapa apagado acontece uma vez só, e não tem botão que desfaça.") +
        "</section>";

      h += D.sinal();

      h += '<section id="desmame">' +
        D.cabSecao("05 · A ORDEM DO DESMAME", "Se você não quiser tirar tudo de uma vez",
          "Desligar as dez chaves no primeiro minuto é legítimo e funciona. Mas se você preferir uma entrada mais gentil, esta é a ordem que preserva o aprendizado: cada degrau só tira uma muleta depois que o hábito que a substitui já existe.") +
        '<div class="escada">' +
        degrau("Nível de equipamento, já", "Não é degrau, é fundação. Se você jogar cinco horas com gear score e desligar depois, terá aprendido hábitos que o modo imersivo pune.") +
        degrau("Minimapa e ícones de espólio", "Os dois mais fáceis. Você passa a olhar a tela inteira e para de desviar rota por causa de brilho no chão.") +
        degrau("Mira fixa na tela", "Obriga a mirar de verdade. Aqui você descobre qual é a distância real de tiro confiável com a sua arma.") +
        degrau("Medidor de detecção", "O primeiro degrau que dá medo. Você passa a ler a linguagem corporal do inimigo — a cabeça que vira, o passo que para — em vez de um arco na tela.") +
        degrau("Marcadores de inimigo", "O salto. Só faça quando subir o drone antes de cada base já for reflexo, porque a partir daqui esquecer o drone significa entrar cego numa base que você não mapeou.") +
        degrau("Exploração não guiada", "Por último, porque é o que mais muda a duração do jogo. Deixe para quando a ilha já for familiar o suficiente para você reconhecer uma região pelo relevo.") +
        "</div>" +
        D.alerta("Nenhum degrau é obrigatório",
          "Se um deles estragar o seu prazer em vez de aprofundar, volte. O objetivo é um jogo melhor, não um troféu de austeridade — e o menu está sempre a dois cliques.") +
        "</section>";

      return h;
    },
    depois: function () {
      /* — simulador de HUD — */
      var caixa = D.el("chaves"), contagem = D.el("contagem");
      var PRESETS = {
        cheio: CHAVES.map(function () { return 1; }),
        perfil: CHAVES.map(function (c) { return c[3]; }),
        nu: CHAVES.map(function (c) { return c[0] === "el-municao" ? 1 : 0; })
      };

      caixa.innerHTML = CHAVES.map(function (c, i) {
        return '<label class="sw"><input type="checkbox" id="sw-' + i + '" data-i="' + i + '">' +
          "<span>" + c[1] + "<small>" + c[2] + "</small></span></label>";
      }).join("");

      function aplicar(estado) {
        CHAVES.forEach(function (c, i) {
          var el = D.el(c[0]);
          if (el) el.style.display = estado[i] ? "" : "none";
          var cx = D.el("sw-" + i);
          if (cx) cx.checked = !!estado[i];
        });
        var n = estado.reduce(function (s, v) { return s + (v ? 1 : 0); }, 0);
        contagem.textContent = n + " de " + CHAVES.length + " na tela";
      }
      function lerEstado() {
        return CHAVES.map(function (c, i) {
          var cx = D.el("sw-" + i);
          return cx && cx.checked ? 1 : 0;
        });
      }
      caixa.addEventListener("change", function () { aplicar(lerEstado()); });
      document.querySelector(".presets").addEventListener("click", function (e) {
        var b = e.target.closest("button[data-set]");
        if (b) aplicar(PRESETS[b.getAttribute("data-set")].slice());
      });
      aplicar(PRESETS.perfil.slice());

      /* — console de perfis — */
      var abas = D.el("abas"), nota = D.el("nota-perfil"), linhas = D.el("linhas-perfil");
      abas.innerHTML = PERFIS.map(function (p, i) {
        return '<button type="button" data-p="' + i + '" aria-pressed="' + (i === 1) + '">' + p.nome + "</button>";
      }).join("");
      function pintarPerfil(i) {
        var p = PERFIS[i];
        nota.innerHTML = p.nota;
        linhas.innerHTML = p.linhas.map(function (l) {
          return '<div class="linha"><span class="par">' + l[0] + "</span>" +
            '<span class="val' + (l[2] ? "" : " off") + '">' + l[1] + "</span>" +
            '<span class="porque">' + l[3] + "</span></div>";
        }).join("");
        Array.prototype.forEach.call(abas.querySelectorAll("button"), function (b, j) {
          b.setAttribute("aria-pressed", String(j === i));
        });
      }
      abas.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-p]");
        if (b) pintarPerfil(parseInt(b.getAttribute("data-p"), 10));
      });
      pintarPerfil(1);
    }
  });

  function linhaParam(nome, valor, rec, texto) {
    return '<div class="p-linha"><h4>' + nome + '</h4><span class="op' + (rec ? " rec" : "") + '">' +
      valor + "</span><p>" + texto + "</p></div>";
  }
  function degrau(titulo, texto) {
    return '<div class="degrau"><h4>' + titulo + "</h4><p>" + texto + "</p></div>";
  }

  /* ═══════════════════════════════════════════════════════════
     VOLUME 02 · O OPERADOR
     ═══════════════════════════════════════════════════════════ */

  var CLASSES = [
    {
      n: "Assault", pt: "Assalto", c: "var(--ruim)", lema: "A porta também é uma entrada",
      d: "A classe da persistência. Resistência a dano acima da média, desempenho superior com fuzis de assalto e escopetas, e uma técnica desenhada para o momento em que o plano já era.",
      tec: "True Grit — reduz o recuo, dá resistência a dano alta e <b>cura você a cada abate</b> enquanto dura",
      item: "Granada de gás — dano em área ao longo do tempo, boa para desalojar quem se entrincheirou",
      passivo: "<b>+50 de vida</b> sobre qualquer outra classe, e melhor controle em armas automáticas",
      quando: "Quando a missão exige entrar, não contornar: resgates, extrações sob fogo, qualquer objetivo com cronômetro.",
      bom: "Sobrevive ao erro. Sozinho, isso vale mais do que parece no papel.",
      ruim: "Não ajuda a evitar o erro. Nenhum bônus de furtividade, nenhuma informação nova.",
      solo: "Rede de segurança, e melhor do que parece à primeira vista: sem ninguém para te levantar, uma técnica que <b>devolve vida a cada abate</b> é a coisa mais próxima de um companheiro que você vai ter. A ressalva continua de pé — ela só entra em jogo depois que algo já deu errado.",
      mark: D.emb('<path d="M20 34l12 12 12-12M32 46V16"/><path d="M14 22h36" opacity=".6"/>')
    },
    {
      n: "Panther", pt: "Pantera", c: "var(--sub)", lema: "Ninguém viu, ninguém ouviu",
      d: "Furtividade pura: movimento mais rápido, assinatura menor e — o detalhe técnico que mais importa — supressor sem perda de dano em pistolas e submetralhadoras.",
      tec: "Cloak & Run — bomba de fumaça: dentro dela você fica <b>invisível para todos os inimigos</b>, e continua invisível por 5 s depois de sair. Quem estiver perto do ponto de ativação fica atordoado por 10 s, e nos 10 s seguintes você ganha <b>+15% de deslocamento</b> e detecção drasticamente mais lenta. Carrega com abate de perto e abate em furtividade",
      item: "Spray de camuflagem — apaga você para a maioria dos drones. <b>Só funciona enquanto você ainda não foi detectado</b>: drone que já te viu ignora o spray",
      passivo: "<b>Morte silenciosa</b> — supressor não reduz dano de submetralhadora nem de pistola; <b>Nas sombras</b> — +10 de furtividade, +20 no nível 2; <b>Passos rápidos</b> — +5% de deslocamento, +10% no nível 6",
      quando: "Infiltração em base grande, qualquer coisa perto de drones, e toda vez que o objetivo permite sair sem ninguém saber que você entrou.",
      bom: "Elimina a categoria inteira de problema em vez de resolvê-lo. Drone que não te vê não precisa ser abatido.",
      ruim: "Se o tiroteio começa, você é o mais frágil da lista.",
      solo: "A classe mais forte no seu perfil, com folga. Sem ninguém para te cobrir, não ser visto vale mais que qualquer bônus de dano — e o supressor sem penalidade resolve a única desvantagem real do tiro silencioso.",
      mark: D.emb('<path d="M18 30c6-6 22-6 28 0M22 30c0 6 4 10 10 10s10-4 10-10" opacity=".85"/><circle cx="32" cy="30" r="3.5" fill="currentColor" stroke="none"/><path d="M14 44c8 4 28 4 36 0" opacity=".5" stroke-dasharray="3 4"/>')
    },
    {
      n: "Sharpshooter", pt: "Atirador de elite", c: "var(--medio)", lema: "Mil metros de vantagem",
      d: "Controle de respiração prolongado e desempenho superior com fuzis de precisão e DMRs. Resolve a base de um lugar onde a base não alcança.",
      tec: "Armor Buster — carrega <b>3 balas especiais</b> no fuzil de precisão ou DMR: <b>+200 de dano, +100 de alcance e penetração máxima</b>. É a resposta desenhada para Behemoth, variantes do Incubus e veículo blindado. Leva alguns segundos para carregar, e a barra enche com tiro na cabeça e abate a mais de 150 m",
      item: "Lançador de sensores — na prática uma granada de reconhecimento de raio muito maior: marca e contorna de vermelho todo inimigo da área por um tempo, <b>sem você sair da posição nem revelar onde está</b>",
      passivo: "<b>Proficiência de longo alcance</b> — +5% de recarga e +20 de manuseio em precisão e DMR, subindo para +10% e +30 no nível 6; <b>Pulmão fundo</b> — +50% de controle de respiração (+100% no nível 2), e isso vale também <b>debaixo d'água</b>",
      quando: "Alvo único em posição conhecida, cobertura de um companheiro que você não tem, base num vale com colina do lado — e qualquer coisa blindada.",
      bom: "O lançador de sensores é informação sem exposição — exatamente o recurso escasso quando o marcador de inimigo está desligado.",
      ruim: "O tiro denuncia a posição. Sem esquadra, a base inteira vem para um lugar que você ainda está ocupando.",
      solo: "Excelente com uma ressalva séria: escolha o segundo ponto de tiro antes de disparar o primeiro. Atirar duas vezes do mesmo lugar é como quase toda perseguição começa. E guarde o Armor Buster no bolso de trás: <b>é a forma mais limpa de resolver um Behemoth sozinho</b>, sem depender de EMP — que nele não funciona.",
      mark: D.emb('<circle cx="32" cy="32" r="13"/><path d="M32 13v8M32 43v8M13 32h8M43 32h8"/><circle cx="32" cy="32" r="2.5" fill="currentColor" stroke="none"/>')
    },
    {
      n: "Field Medic", pt: "Socorrista", c: "var(--bom)", lema: "Você vai errar",
      d: "A classe de recuperação: kit médico que <b>aumenta a vida máxima</b>, reanimação acelerada, um drone que levanta companheiros a distância — e a única passiva do jogo que deixa você se levantar sozinho.",
      tec: "Healing Drone — drone pilotado à mão, com alcance e bateria iguais ao drone comum, carregando <b>3 dardos</b> que reanimam aliados caídos. É <b>barulhento</b>, e atrai inimigo para quem você acabou de levantar",
      item: "Kit médico — trata ferimento em campo e <b>aumenta a vida máxima em 50 por um minuto</b>; com ele, qualquer classe fica tão resistente quanto um Assalto",
      passivo: "<b>Fênix</b> — com a barra de técnica cheia, ao cair você <b>se reergue sozinho</b> (não vale em incursão nem em PvP); <b>Primeiros socorros</b> — +10% de velocidade de reanimação, +15% no nível 2; <b>Carregador</b> — +10% de deslocamento e +20% de resistência carregando um corpo, subindo para +15% e +40% no nível 6",
      quando: "Em grupo, sempre que alguém insiste em morrer. Sozinho, nas fases em que você está morrendo demais e quer uma segunda chance por engajamento.",
      bom: "O tratamento de ferimento em campo é real e útil — ferimento grave sem kit custa uma viagem até o bivaque. E o kit não só cura: ele estica a barra de vida enquanto dura.",
      ruim: "Drone de cura, reanimação e transporte de corpo pressupõem companheiros. Três quartos da ficha é cooperativa.",
      solo: "<b>Eu subestimei essa classe.</b> O drone e a reanimação realmente não servem para nada sozinho, mas <b>Fênix serve para tudo</b>: é literalmente a única coisa no jogo que faz o papel do companheiro que te levanta. Não é a classe padrão do seu perfil — mas é a rede de segurança certa para um trecho difícil, e o kit médico que estica a vida máxima já justifica carregá-la num assalto planejado.",
      mark: D.emb('<path d="M32 20v24M20 32h24" stroke-width="3"/><circle cx="32" cy="32" r="15" opacity=".45"/>')
    },
    {
      n: "Echelon", pt: "Echelon", c: "#7bd36a", lema: "Parede não é obstáculo",
      d: "A divisão de Sam Fisher vira classe: furtividade reforçada, desempenho superior com pistolas e a capacidade de enxergar o que está do outro lado.",
      tec: "Sonar Vision — pulsos que revelam a silhueta dos inimigos <b>através de parede</b> e os marcam; também perturba drones",
      item: "Pistola de choque — mata humano desprevenido em silêncio e <b>desliga drone desprevenido sem destruí-lo</b>; contra alvo já alertado, o drone só apaga por um instante",
      passivo: "<b>Mestre das sombras</b> (+10% de furtividade na sombra, +20% no nível 2), <b>proficiência em pistola</b> (+10% de dano, +20% no nível 6, e <b>supressor não reduz dano de pistola</b>) e <b>tiro reflexo</b> (mira automática na cabeça de quem está te detectando, se você estiver furtivo)",
      quando: "Interiores. Bunker, laboratório, prédio de dois andares, qualquer lugar onde a parede esconde a informação que decide o plano.",
      bom: "Transforma o problema mais perigoso do jogo solo — não saber o que tem atrás da porta — num problema resolvido.",
      ruim: "Fora de ambiente fechado, a técnica perde muito da graça.",
      solo: "A dupla natural da Pantera, e a melhor classe do jogo para invadir interiores sozinho. Ver através de parede substitui exatamente o companheiro que diria o que tem do outro lado. E há um detalhe que muda o cálculo de silêncio: <b>com supressor, a pistola não perde dano nenhum aqui</b> — a arma mais silenciosa do jogo deixa de ter a desvantagem que normalmente a acompanha.",
      mark: D.emb('<circle cx="22" cy="30" r="5.5"/><circle cx="32" cy="26" r="5.5"/><circle cx="42" cy="30" r="5.5"/><path d="M16 42c8 6 24 6 32 0" opacity=".55"/>')
    },
    {
      n: "Engineer", pt: "Engenheiro", c: "#c9a227", lema: "Máquina contra máquina",
      d: "Especialista em drone e explosivo, com um drone armado próprio e reabastecimento em campo. A ficha oficial o descreve talhado para <b>fuzil de defesa pessoal e escopeta</b>, ou seja, alvos de curta a média distância.",
      tec: "Defense Drone — drone armado que cobre a sua posição",
      item: "Supply Drone — repõe munição onde você estiver",
      passivo: "Dano aumentado contra drones e mais resistência a explosão",
      quando: "Regiões com produção de drones, cercos com veículo mecanizado, e qualquer operação longe demais do bivaque para voltar por munição.",
      bom: "Resolve a única escassez real do modo imersivo. Munição.",
      ruim: "O drone armado faz barulho e atira — ele encerra a furtividade por você.",
      solo: "Muito mais útil do que a reputação sugere. Com munição finita e sem ninguém para dividir carga, um drone que repõe munição em campo é o que permite operar longe da base por horas.",
      mark: D.emb('<circle cx="32" cy="32" r="8"/><path d="M32 18v-6M32 52v-6M18 32h-6M52 32h-6M22 22l-4-4M46 46l4 4M46 22l4-4M22 46l-4 4"/>')
    },
    {
      n: "Pathfinder", pt: "Batedor", c: "#7aa7e8", lema: "O céu resolve primeiro",
      d: "Reconhecimento levado ao extremo: visão térmica, drone próprio melhorado e interface com uma plataforma de alta altitude.",
      tec: "Interface Armaros — drone de alta altitude para varredura ampla",
      item: "Drone de reconhecimento aprimorado",
      passivo: "Melhor aproveitamento de recurso e bônus de reconhecimento",
      quando: "Território desconhecido, base grande, e toda vez que a pergunta for <em class='plain'>onde eles estão</em> em vez de <em class='plain'>como eu mato</em>.",
      bom: "Produz o recurso mais escasso do perfil imersivo: informação.",
      ruim: "Não melhora nada depois que o tiro começa.",
      solo: "A classe mais subestimada para quem desligou o marcador de inimigo. Quando a interface para de dizer onde eles estão, quem produz essa resposta passa a valer mais que quem atira melhor.",
      mark: D.emb('<path d="M32 14l6 12h-12z" fill="currentColor" stroke="none"/><circle cx="32" cy="34" r="12" opacity=".7"/><path d="M32 22v24M20 34h24" opacity=".5"/><path d="M14 50c10 6 26 6 36 0" opacity=".4" stroke-dasharray="3 4"/>')
    }
  ];

  D.reg({
    id: "v02", cod: "02", nome: "O operador", arquivo: "classes.dat",
    titulo: "O operador", subtitulo: "sete ferramentas, um Ghost", cor: "#7bd36a",
    desc: "As sete classes em profundidade com veredito para jogo solo, a árvore de perícias em diagrama e a ordem de compra dos pontos.",
    lede: [
      "Classe em Breakpoint não é a sua identidade. É a chave de fenda que você pegou hoje de manhã — e você pode trocar em qualquer bivaque, de graça, sem perder nada.",
      "O que muda de verdade: uma técnica com recarga, um item exclusivo e alguns bônus passivos. Nenhuma classe limita qual arma você pode carregar."
    ],
    saltos: [["como", "Como funciona"], ["classes", "As sete"], ["arvore", "Árvore"], ["ordem", "Ordem de compra"]],
    render: function () {
      var h = "";

      h += D.transmissao("A pergunta certa não é qual classe é a melhor.",
        "É qual resolve o problema da base que está na sua frente. Uma cerca de drones pede Engenheiro. Um prédio cheio de gente pede Echelon. Uma colina com vista pede Atirador. Trocar de classe entre uma missão e outra é jogar bem, não indecisão.");

      h += '<section id="como">' +
        D.cabSecao("01 · COMO FUNCIONA", "Cinco regras antes das fichas") +
        '<div class="pillars">' +
        '<div class="pillar"><h3>A troca é livre</h3><p>Em qualquer bivaque você troca de classe sem custo e sem perder progresso. <b>Cada classe guarda o próprio nível e os próprios desafios</b> — o que você subiu numa continua lá quando voltar.</p></div>' +
        '<div class="pillar"><h3>Arma não é restrita</h3><p>Nenhuma classe proíbe nenhuma arma. Os bônus favorecem certas categorias, mas <b>um Socorrista pode carregar fuzil de precisão</b> sem penalidade nenhuma.</p></div>' +
        '<div class="pillar"><h3>Técnica tem recarga</h3><p>A técnica é a habilidade grande, com tempo de espera. O item exclusivo é consumível e se repõe no bivaque. <b>Os passivos são o que você mais sente no dia a dia</b>, justamente por serem constantes.</p></div>' +
        '<div class="pillar"><h3>Perícias são de todos</h3><p>A árvore de perícias é comum a todas as classes. <b>O que você desbloqueia lá continua valendo independente da classe equipada</b> — então investir na árvore nunca é desperdício.</p></div>' +
        '<div class="pillar"><h3>Subir de classe dá ponto de perícia</h3><p>Cada nível de classe, <b>até o décimo, entrega um ponto de perícia</b> — e esses pontos valem em qualquer classe. Do 11 ao 20 vêm crédito, peças e roupa, com dois projetos de arma no caminho: um no nível 10 e outro no 20. Ou seja: <b>jogar com uma classe financia a árvore inteira</b>, e vale subir a que você mais usa até dez antes de flertar com as outras.</p></div>' +
        "</div></section>";

      h += D.sinal();

      h += '<section id="classes">' +
        D.cabSecao("02 · AS SETE FICHAS", "Cada uma, com o veredito para quem joga só",
          "As fichas trazem o que a classe faz e, separado, o que ela vale no seu perfil: imersivo, sozinho, sem esquadra de IA para curar, distrair ou levantar você do chão. Algumas mudam muito de valor quando ninguém está com você.") +
        '<div class="dossies">' +
        CLASSES.map(function (c, i) {
          return '<article class="dossie" style="--c:' + c.c + '">' +
            '<div class="selo">' + c.mark +
            '<span class="nome">' + c.n + '</span><span class="pt">' + c.pt + " · " + String(i + 1).padStart(2, "0") + "/07</span></div>" +
            '<div class="corpo"><p class="lema">' + c.lema + "</p><p>" + c.d + "</p>" +
            '<dl class="grade">' +
            "<div><dt>Técnica</dt><dd>" + c.tec + "</dd></div>" +
            "<div><dt>Item exclusivo</dt><dd>" + c.item + "</dd></div>" +
            "<div><dt>Passivos</dt><dd>" + c.passivo + "</dd></div>" +
            "<div><dt>Equipar quando</dt><dd>" + c.quando + "</dd></div></dl>" +
            '<div class="vereditos">' +
            '<div><b>Ponto forte</b><span class="bom">' + c.bom + "</span></div>" +
            '<div><b>Ponto fraco</b><span class="ruim">' + c.ruim + "</span></div>" +
            "<div><b>Solo, imersivo</b><span>" + c.solo + "</span></div>" +
            "</div></div></article>";
        }).join("") +
        "</div></section>";

      h += D.sinal();

      h += '<section id="arvore">' +
        D.cabSecao("03 · A ÁRVORE", "Mais de sessenta perícias, dez ramos",
          "O menu reúne mais de sessenta entradas divididas em cinco tipos — habilidade, vantagem, passiva, consumível e melhoria de drone — distribuídas por dez ramos: <b>básico, armas, engenhocas, furtividade, sobrevivência, reconhecimento, assalto, táticas, economia e atirador</b>, organizados em quatro fileiras de profundidade. O diagrama mostra a forma da coisa e marca o que vale comprar primeiro no seu perfil.") +
        '<div class="arvore" id="arvore"></div>' +
        '<div class="arvore-legenda">' +
        '<span><i class="pri"></i> Prioridade alta no perfil imersivo solo</span>' +
        '<span><i></i> Vale a pena, sem pressa</span>' +
        '<span><i class="dep"></i> Depende do seu estilo</span>' +
        "</div>" +
        '<div class="rp" style="margin-top:14px">' +
        '<div class="rp-card"><span class="k">Tipo · Habilidade</span><h4>Dez entradas</h4><p>Capacidades novas: paraquedas, visão noturna, visão térmica, drone de tiro sincronizado. São as que mudam o que você <em class="plain">consegue fazer</em>, não o quanto você faz.</p></div>' +
        '<div class="rp-card"><span class="k">Tipo · Vantagem</span><h4>Dezenove entradas</h4><p>Equipadas em encaixes limitados, com efeito percentual. Os encaixes extras saem do ramo Básico — sem eles, comprar vantagem demais não adianta.</p></div>' +
        '<div class="rp-card"><span class="k">Tipo · Passiva</span><h4>Dezoito entradas</h4><p>Sempre ativas, sem ocupar encaixe. Recarga, mobilidade, capacidade de munição, desmontagem de arma.</p></div>' +
        '<div class="rp-card"><span class="k">Tipo · Consumível</span><h4>Nove entradas</h4><p>Melhoram o que você fabrica: seringa e explosivo em versão aprimorada, rações avançadas com efeito maior e duração mais longa.</p></div>' +
        '<div class="rp-card"><span class="k">Tipo · Drone</span><h4>Quatro entradas</h4><p>Alcance, altitude e resistência do seu drone. No perfil imersivo, é onde está o melhor retorno por ponto gasto do jogo inteiro.</p></div>' +
        "</div></section>";

      h += D.sinal();

      h += '<section id="ordem">' +
        D.cabSecao("04 · ORDEM DE COMPRA", "No que gastar os primeiros pontos",
          "Com o nível de equipamento desligado, quase toda vantagem percentual perde importância — mais dez por cento de dano não muda quantos tiros matam. O que continua valendo são <b>capacidades novas</b> e <b>alcance de informação</b>. Esta é a ordem que reflete isso.") +
        '<div class="track">' +
        passo("01", "Drone de tiro sincronizado <i>(Syncshot Drone)</i>", "Furtividade · 1 ponto", "A perícia mais importante do jogo para quem joga sozinho. Você aponta o alvo e manda o drone atirar junto com você, o que significa <b>dois ou três abates simultâneos sem esquadra</b>. É literalmente o substituto mecânico dos companheiros que você não tem — e custa um único ponto, na segunda fileira.", true) +
        passo("02", "Melhorias de drone", "Reconhecimento · 1 ponto cada", "Com marcador de inimigo desligado, o drone é o seu único olho. São quatro compras separadas: <b>alcance +20%</b>, <b>área de marcação +75%</b>, <b>velocidade +20%</b> e <b>recarga −50%</b>. A área de marcação é a que mais muda o seu jogo: marcar meia base numa passagem só.", true) +
        passo("03", "Visão do drone <i>(Drone Visions)</i>", "Reconhecimento · 1 ponto", "Dá visão noturna e térmica <b>ao drone</b>. Operando de madrugada — que é o que você vai fazer — sem isso o reconhecimento aéreo simplesmente não enxerga.", true) +
        passo("04", "Encaixes de vantagem <i>(Perk Slot)</i>", "Básico · 2 e depois 4 pontos", "Sem encaixe, as vantagens que você comprar ficam paradas no menu. São dois encaixes, e eles custam <b>2 e 4 pontos</b> — caros, e ainda assim valem mais cedo do que qualquer vantagem específica.", true) +
        passo("05", "Burro de carga <i>(Pack Mule)</i>", "Básico · 1 ponto", "<b>+40% de munição máxima</b> e +10% no que você cata. No imersivo a munição é finita de verdade — carregar mais é o que permite operar longe do bivaque sem abortar por falta de pente.", false) +
        passo("06", "Visão noturna e térmica", "Básico e Reconhecimento · 1 ponto cada", "A noturna está no ramo básico; a térmica, no de reconhecimento. Como você escolhe a hora de sair, operar de madrugada vira estratégia — e sem elas a madrugada atrapalha você tanto quanto eles.", false) +
        passo("07", "Sombra fina e Burla de sensor", "Furtividade · 1 ponto cada", "<b>Slim Shadow</b> dá +80% de furtividade e +10% de agilidade. <b>Sensor Hack</b> dá <b>+30% de evasão a drone</b> e +10% de dano contra drone — é a resposta comprável ao Azraël, complementar a deitar na lama.", false) +
        passo("08", "Paraquedas", "Básico · 1 ponto", "Muda deslocamento e fuga. Sem esquadra, saltar de um penhasco é uma rota de saída legítima — e sem paraquedas é uma morte.", false) +
        passo("09", "Seringa MK.2", "Assalto · 1 ponto", "Cura mais rápido e <b>remove alguns ferimentos</b> — é a única coisa no jogo que faz a seringa encostar no território da bandagem. Note que ela está no ramo <b>Assalto</b>, não no de sobrevivência.", false) +
        passo("10", "Rações LV2 e LV3", "Sobrevivência · 1 ponto cada", "Efeito maior e duração mais longa nos bônus de bivaque. Com dificuldade tática em Elite, esse bônus deixa de ser luxo e passa a ser parte do planejamento da saída.", false) +
        passo("11", "Desmontagem melhor <i>(Better Dismantle)</i>", "Armas · 1 ponto", "Converte espólio que você não vai usar em peça que você vai. Sem nível de equipamento, é o que mantém a oficina abastecida.", false) +
        "</div>" +
        D.nota("O que <b>não</b> comprar cedo: bônus percentual de dano, bônus de experiência e qualquer coisa que prometa melhorar espólio. Os dois primeiros não mudam quantos tiros matam num jogo onde dois tiros já matam; o terceiro não tem função quando raridade não existe.") +
        D.alerta("Ponto sem retorno: nenhum",
          "Perícia comprada não se perde ao trocar de classe, e nada aqui fecha outra porta. A única coisa escassa é o ponto em si — e ele volta a aparecer a cada nível.") +
        "</section>";

      return h;
    },
    depois: function () { arvorePericias(); }
  });

  function passo(n, titulo, tag, texto, chave) {
    return '<div class="lv' + (chave ? " key" : "") + '"><span class="n">' + n + "</span>" +
      '<div><h4>' + titulo + ' <span class="tag">' + tag + "</span></h4><p>" + texto + "</p></div></div>";
  }

  function arvorePericias() {
    var alvo = D.el("arvore");
    if (!alvo) return;
    var W = 900, H = 500, cx = W / 2, cy = H / 2 + 14;
    /* Dez ramos, não oito. Faltavam Economia e Atirador, e o que eu
       chamava de "Combate" é o ramo Assalto. */
    var RAMOS = [
      { nome: "Básico", pri: [1, 0, 1] }, { nome: "Armas", pri: [0, 0, 0] },
      { nome: "Reconhecimento", pri: [1, 1, 1] }, { nome: "Sobrevivência", pri: [0, 1, 0] },
      { nome: "Táticas", pri: [0, 0, 0] }, { nome: "Furtividade", pri: [1, 1, 0] },
      { nome: "Engenhocas", pri: [0, 1, 0] }, { nome: "Assalto", pri: [0, 0, 1] },
      { nome: "Economia", pri: [0, 0, 0] }, { nome: "Atirador", pri: [0, 0, 0] }
    ];
    var raios = [86, 146, 206], g = "";

    raios.forEach(function (r) {
      g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="currentColor" ' +
        'stroke-width="1" opacity=".12" stroke-dasharray="3 6"/>';
    });

    RAMOS.forEach(function (ramo, i) {
      var ang = (i / RAMOS.length) * Math.PI * 2 - Math.PI / 2;
      var ex = cx + Math.cos(ang) * (raios[2] + 44), ey = cy + Math.sin(ang) * (raios[2] + 44);
      g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + ex.toFixed(1) + '" y2="' + ey.toFixed(1) +
        '" stroke="currentColor" stroke-width="1.2" opacity=".28"/>';
      raios.forEach(function (r, j) {
        var nx = cx + Math.cos(ang) * r, ny = cy + Math.sin(ang) * r, pri = ramo.pri[j];
        g += '<circle cx="' + nx.toFixed(1) + '" cy="' + ny.toFixed(1) + '" r="' + (pri ? 9 : 6.5) + '" ' +
          'fill="' + (pri ? "currentColor" : "var(--surface)") + '" stroke="currentColor" stroke-width="1.6" ' +
          'opacity="' + (pri ? 1 : .55) + '"/>';
        if (pri) {
          g += '<circle cx="' + nx.toFixed(1) + '" cy="' + ny.toFixed(1) + '" r="15" fill="none" ' +
            'stroke="currentColor" stroke-width="1" opacity=".3"/>';
        }
      });
      var fim = Math.cos(ang) < -0.25 ? "end" : (Math.cos(ang) > 0.25 ? "start" : "middle");
      var dy = Math.sin(ang) > .7 ? 16 : (Math.sin(ang) < -.7 ? -10 : 4);
      g += '<text x="' + ex.toFixed(1) + '" y="' + (ey + dy).toFixed(1) + '" text-anchor="' + fim + '" ' +
        'fill="currentColor" font-family="Saira Condensed, sans-serif" font-size="17" letter-spacing="1.2">' +
        ramo.nome.toUpperCase() + "</text>";
    });

    g += '<circle cx="' + cx + '" cy="' + cy + '" r="34" fill="var(--surface2)" stroke="currentColor" stroke-width="1.8"/>';
    g += '<text x="' + cx + '" y="' + (cy - 2) + '" text-anchor="middle" fill="currentColor" ' +
      'font-family="Saira Condensed, sans-serif" font-size="19" letter-spacing="1">60</text>';
    g += '<text x="' + cx + '" y="' + (cy + 13) + '" text-anchor="middle" fill="var(--muted)" ' +
      'font-family="JetBrains Mono, monospace" font-size="8" letter-spacing="1.6">PERÍCIAS</text>';

    alvo.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      'style="color:color-mix(in srgb, var(--sub) 80%, var(--text))" role="img" ' +
      'aria-label="Diagrama em leque dos dez ramos da árvore de perícias, com os nós prioritários destacados">' + g + "</svg>";
  }

  /* ═══════════════════════════════════════════════════════════
     VOLUME 03 · O ARSENAL
     ═══════════════════════════════════════════════════════════ */

  /* O roster completo veio da lista de armas do Ghost Recon Wiki. As notas
     de cada arma descrevem o QUE ELA É — calibre, ação, tamanho, se nasce
     suprimida —, porque é isso que não muda. Os números da ficha mudam com
     o nível do achado e com os acessórios, então decorar dano de uma peça
     específica não ajuda; saber que a arma é 7,62 de ferrolho, sim. */
  var ARMAS = [
    { sig: "Fuzil de assalto", nome: "Assault Rifle", cor: "var(--sub)", faixa: "50–250 m",
      d: "O canivete: preciso o bastante a duzentos metros, rápido o bastante num corredor. Aceita quase todo acessório e tem munição farta na ilha.",
      uso: "A arma padrão do conjunto silencioso. Se você só puder levar uma, é esta.",
      lista: [
        ["416", "equilíbrio de recuo e cadência, aceita toda classe de acessório", "não se destaca em nada"],
        ["M4A1", "manuseio leve e recuo baixo", "dano por tiro modesto"],
        ["MK17", "7,62: troca cadência por dano por tiro", "pente menor e recuo maior"],
        ["AK-47", "7,62×39, dano por tiro alto", "recuo forte e lento de recuperar"],
        ["AK-12", "cadência alta com recuo previsível", "consome munição rápido"],
        ["AK-74", "o meio-termo controlável da família", "nada excepcional em nenhum eixo"],
        ["G36C", "curta, excelente dentro de prédio", "perde precisão além de 150 m"],
        ["MK18", "a mais manuseável da família 5,56", "alcance efetivo baixo"],
        ["516", "manuseio rápido de carabina curta", "alcance reduzido"],
        ["553", "precisa para o tamanho", "pente pequeno"],
        ["805 BREN", "estável em rajada média", "pesada para a classe"],
        ["AUG", "bullpup: cano longo em arma curta", "recarga mais lenta"],
        ["TAVOR", "compacta com alcance de fuzil inteiro", "mira baixa, ruim sem óptica"],
        ["ARX200", "7,62 que se dá bem com supressor", "recuo vertical"],
        ["ACR", "das mais precisas da categoria", "dano mediano"],
        ["FAL", "7,62 clássico, dano alto", "recuo pesado no automático"],
        ["G2", "versátil, aceita quase tudo", "meio-termo em tudo"],
        ["SR-3M", "9×39 subsônico, nasce ótima suprimida", "alcance curto para um fuzil"],
        ["AR-18", "recuo suave", "cadência baixa"],
        ["AC-AR", "estável em tiro contínuo", "sem característica marcante"],
        ["VHSD2", "bullpup compacto", "pouco comum na ilha"],
        ["A2", "confiável e simples", "antiquada ao lado das outras"],
        ["SC-20K · SC-40K", "cruzamento com Splinter Cell, perfil furtivo", "obtenção por evento"],
        ["Silver Stake Tactical · Resistance ASR", "variantes com ficha própria", "obtenção limitada a evento"]
      ] },

    { sig: "Submetralhadora", nome: "SMG", cor: "#7bd36a", faixa: "0–60 m",
      d: "Curta, leve e ruidosa de propósito. Perde tudo acima de sessenta metros e ganha tudo dentro de um prédio.",
      uso: "Segunda arma do conjunto observador — a resposta para quem conseguiu chegar perto.",
      lista: [
        ["Honey Badger", ".300 subsônico, nasce integralmente suprimida e rivaliza com fuzil a média distância", "munição específica"],
        ["MP5", "recuo quase nulo, supressor muito eficiente", "dano baixo contra blindado"],
        ["MP7", "cadência alta e perfuração melhor que 9 mm", "pente pequeno"],
        ["P90", "cinquenta tiros no pente — a melhor contra enxame de drone", "recarga lenta"],
        ["Vector", "a maior cadência da categoria", "esvazia o pente num sopro"],
        ["UMP45", ".45: dano por tiro alto para a classe", "cadência baixa"],
        ["Scorpion EVO 3", "manuseio muito rápido", "dispersa em rajada longa"],
        ["MPX", "das mais precisas da classe", "alcance ainda curto"],
        ["Uzi 9mm", "compacta e clássica", "imprecisa além de trinta metros"],
        ["Bullpup PDR", "silhueta curta com cano decente", "recarga desajeitada"],
        ["SN-9mm", "recuo baixo e previsível", "dano fraco"],
        ["Echelon SMG", "variante furtiva do cruzamento", "obtenção por evento"]
      ] },

    { sig: "Metralhadora leve", nome: "LMG", cor: "#c9a227", faixa: "50–200 m, em área",
      d: "Volume de fogo e capacidade grande, em troca de mobilidade e tempo de recarga. Boa contra grupo e contra drone leve.",
      uso: "Conjunto quebrador. Fora dele, o peso não compensa jogando sozinho.",
      lista: [
        ["Stoner", "a mais manuseável da categoria", "dano por tiro modesto"],
        ["MK48", "7,62 com alcance real", "pesada e lenta de girar"],
        ["6P41", "dano alto e pente grande", "recarga longuíssima"],
        ["MG121", "volume de fogo altíssimo", "mobilidade péssima"],
        ["L86A1", "precisa para a classe", "pente de trinta, pouco para um LMG"],
        ["T95", "bullpup, mais curta que as outras", "recuo acumula rápido"],
        ["CTMMG", "cadência muito alta", "dispersa quando você segura o gatilho"]
      ] },

    { sig: "Escopeta", nome: "Shotgun", cor: "var(--ruim)", faixa: "0–15 m",
      d: "Resolve um problema por vez, a três metros, sem discussão. Também é a resposta mais barata a drone voador pequeno.",
      uso: "Porta, túnel, laboratório. E enxame de Murmur.",
      lista: [
        ["SASG-12", "alimentada por pente: a recarga mais rápida da classe", "recuo forte"],
        ["M4", "semiautomática, segundo tiro imediato", "espalhamento largo"],
        ["SPAS-12", "dano por tiro alto", "ação de bomba, lenta entre tiros"],
        ["ACS-12", "automática, resolve grupo em corredor", "munição some num instante"],
        ["KSG12", "capacidade grande em arma curta", "ação de bomba"],
        ["M590A1", "confiável e simples", "capacidade pequena"],
        ["RU12SG", "boa de manejar em espaço fechado", "alcance útil quase nulo"],
        ["BOSG12", "dois canos, dano concentrado", "dois tiros e recarga"]
      ] },

    { sig: "Fuzil de precisão", nome: "Sniper Rifle", cor: "var(--medio)", faixa: "250–600 m e além",
      d: "Um alvo, um tiro, muito longe. Lento entre disparos e implacável se você souber onde vai estar depois do primeiro.",
      uso: "Conjunto observador. Sozinho, a arma que mais exige plano de saída.",
      lista: [
        ["HTI", "calibre .50 — derruba veículo e drone pesado", "lentíssima e pesada"],
        ["TAC-50", ".50 com manuseio melhor que a HTI", "ainda muito lenta"],
        ["M82", ".50 semiautomática", "recuo e ruído enormes"],
        ["L115A3", ".338, precisão excelente", "ferrolho, um tiro por vez"],
        ["MSR", "ferrolho moderno e preciso", "cadência baixíssima"],
        ["Recon-A1", "o melhor manuseio da categoria", "dano menor que as .50"],
        ["SR-1", "equilíbrio entre peso e alcance", "sem destaque"],
        ["M93", "semiautomática de calibre grande", "recuo alto"],
        ["VSK-50", "subsônica, feita para trabalhar suprimida", "alcance menor que o resto da classe"],
        ["Scorpio", "boa companheira de supressor", "dano moderado"],
        ["Paladin 9 SNR", "variante de evento", "obtenção limitada"]
      ] },

    { sig: "Fuzil de precisão tático", nome: "DMR", cor: "#7aa7e8", faixa: "150–400 m",
      d: "O meio-termo honesto: semiautomático, preciso até bem longe e rápido o suficiente para um segundo alvo. Aceita supressor com boa eficiência.",
      uso: "A segunda arma do conjunto silencioso, e provavelmente a arma mais útil do jogo no perfil imersivo.",
      lista: [
        ["G28", "boa em tudo, com a melhor cadência da classe", "recuo sobe se você atirar rápido demais"],
        ["MK14", "tem modo automático", "recuo pesado quando você usa isso"],
        ["FRF-2", "o maior alcance e a maior precisão da classe", "ferrolho: um alvo por vez"],
        ["Dragunov (SVD)", "o maior poder de fogo da classe", "cadência baixa"],
        ["M110", "7,62 semiautomático equilibrado", "pesado para carregar o dia todo"],
        ["OTS-03", "compacto para um DMR", "alcance menor que os outros"]
      ] },

    { sig: "Pistola", nome: "Handgun", cor: "var(--bom)", faixa: "0–25 m",
      d: "Sempre no cinto, nunca ocupa espaço de arma principal. Suprimida, é a ferramenta de abate silencioso mais confiável do jogo.",
      uso: "Todos os conjuntos. Com Echelon ou Pantera, deixa de ser reserva e vira ferramenta principal de infiltração.",
      lista: [
        ["Maxim 9", "nasce integralmente suprimida — a pistola furtiva por excelência", "dano de 9 mm"],
        ["5.7 USG", "calibre alto com ótima capacidade", "recuo difícil de segurar"],
        ["Desert Eagle", "o maior dano da categoria", "recuo enorme e pente de sete"],
        ["MK23", "feita para supressor desde o projeto", "grande e lenta de sacar"],
        ["USP Tactical", "já vem preparada para supressor", "nada excepcional além disso"],
        ["M1911", ".45, dano por tiro bom", "pente de sete"],
        ["Stainless Extended .45", ".45 com pente estendido", "recuo alto"],
        ["P227", ".45 confiável", "capacidade média"],
        ["M9 · P320 · PX4 · P45T", "confiáveis, baratas de suprimir", "dano baixo"],
        ["F40 · C-SFP · Sharp Thunder", "variantes com ficha própria", "sem vantagem clara sobre as acima"],
        ["SC IS HDG", "pistola furtiva do cruzamento", "obtenção por evento"]
      ] }
  ];

  /* Cinco encaixes, não oito. A lista anterior inventava "gatilho e
     munição" e "pintura" como pontos de modificação — pintura é cosmético
     e o modo de disparo é da arma, não um acessório. Os cinco abaixo são
     as categorias reais, com os nomes que aparecem na oficina. */
  var PECAS = [
    ["Boca do cano",
     "Supressor, compensador, freio de boca ou quebra-chamas, cada um na versão da sua categoria de arma. <b>O supressor é praticamente obrigatório no perfil imersivo</b>: não é sobre dano, é sobre quanto tempo demora até alguém descobrir de onde veio o tiro. Compensador e freio trocam esse silêncio por controle de recuo — trocar vale em arma de suporte, não na sua arma de entrada.",
     "Supressor · Compensador · Freio de boca · Quebra-chamas"],
    ["Óptica",
     "Define a distância em que você consegue trabalhar. Com a mira fixa da tela desligada, uma mira de leitura rápida vale mais que ampliação alta em quase toda situação de base — você quase nunca tem tempo de alinhar uma luneta dentro de um perímetro. Guarde a ampliação para a arma de longa distância.",
     "Colimador RU · COMPM4 · EXPS3 · Mira de longo alcance · Alcance duplo · Panorâmica · Ferro dobrável"],
    ["Carregador",
     "Capacidade contra velocidade de recarga. Existem três tamanhos: pequeno, padrão e estendido. Com a opção de descartar pente pela metade ligada, <b>pente grande passa a ser desperdício</b> — você joga fora mais munição a cada recarga que interrompe.",
     "Pequeno · Padrão · Estendido"],
    ["Trilho inferior",
     "Punho vertical, bipé ou uma escopeta acoplada. O punho troca recuo por mobilidade; o bipé só existe deitado ou apoiado, e nesse caso transforma a arma. A escopeta acoplada é a resposta de um tiro para quem apareceu na porta enquanto você mirava longe.",
     "Punho RU · Punho RVG · Punho SHIFT · Bipé com punho · Trilho · Escopeta acoplada"],
    ["Trilho lateral",
     "Designador a laser e capa de trilho. O designador ajuda no tiro de quadril e na marcação; a capa não faz nada mecânico. É o encaixe menos decisivo dos cinco, e o primeiro a abrir mão se você estiver escolhendo.",
     "ATPIALx3 · MAWL-DA · Capa de trilho"]
  ];

  /* Não é encaixe, mas é o que a maioria confunde com um */
  var NAO_ENCAIXE = [
    ["Pintura e aparência", "Cosmético puro, sem efeito mecânico nenhum. Dito isso: camuflagem que combine com o bioma em que você opera é imersão barata e honesta."],
    ["Modo de disparo", "É característica da arma, não peça que se compra. Se ela não tem automático, nenhum acessório vai dar."],
    ["Nível do achado", "Fora do seu perfil. As cores do espólio — cinza, verde, azul, roxo e dourado — organizam poder de arma num jogo <b>com</b> nível de equipamento. Com ele desligado, essa camada inteira deixa de existir: o que sobra é o projeto que você montou."]
  ];

  D.reg({
    id: "v03", cod: "03", nome: "O arsenal", arquivo: "armamento.dat",
    titulo: "O arsenal", subtitulo: "sem número acima da arma", cor: "#c9a227",
    desc: "As sete categorias de arma desenhadas, a anatomia da oficina de modificação e três conjuntos de equipamento que resolvem a ilha.",
    lede: [
      "Com o nível de equipamento desligado, some a pergunta que organiza a maioria dos jogos de tiro moderno: qual é a arma mais forte.",
      "No lugar dela entra outra, bem mais interessante: qual é a arma certa para a distância em que eu pretendo resolver isto — e ela vai ficar com você até o fim."
    ],
    saltos: [["regras", "As regras novas"], ["categorias", "Categorias"], ["oficina", "Oficina"], ["kits", "Conjuntos"]],
    render: function () {
      var h = "";

      h += D.transmissao("A arma que você achar no chão é pior que a sua.",
        "No modo imersivo, arma apanhada em campo é temporária e não aceita acessório nenhum. Ela serve para atravessar um aperto e ser descartada. O seu equipamento de verdade é o projeto que você montou na oficina — e é só nele que o supressor, a luneta e o punho existem.");

      h += '<section id="regras">' +
        D.cabSecao("01 · AS REGRAS NOVAS", "O que muda quando o número some") +
        '<div class="pillars">' +
        '<div class="pillar"><h3>Projeto é permanente, achado é temporário</h3><p>As armas que valem são as do seu conjunto, montadas a partir de projetos. <b>A troca de projeto só acontece na zona de equipamento</b> — bivaque ou base amiga. Fora dali, o que você pegar é empréstimo.</p></div>' +
        '<div class="pillar"><h3>Acessório é por categoria</h3><p>Um acessório desbloqueado serve para toda a categoria, não só para aquela arma. <b>Encontrar um supressor de fuzil de assalto equipa todos os seus fuzis de assalto</b> — o progresso é da categoria, não da peça.</p></div>' +
        '<div class="pillar"><h3>Projeto se troca por arma</h3><p>Projetos aparecem em caixas espalhadas pela ilha. Levados à loja de Erewhon, com Maria Schulz, eles <b>viram armas compráveis</b>. É o laço de progressão que substitui a caça a raridade.</p></div>' +
        '<div class="pillar"><h3>Supressor custa dano</h3><p>Silenciar reduz o dano de saída — irrelevante se você acerta a cabeça, decisivo se não acerta. <b>A Pantera anula essa perda em pistolas e submetralhadoras</b>, e esse detalhe sozinho justifica a classe.</p></div>' +
        "</div></section>";

      h += D.sinal();

      h += '<section id="categorias">' +
        D.cabSecao("02 · CATEGORIAS", "Sete famílias, sete propósitos",
          "Sem gear score, a escolha vira geométrica: a que distância você pretende resolver a base, e o que acontece se ela vier até você. Cada ficha traz a função real da categoria no perfil imersivo solo — não a reputação dela.") +
        '<div class="armas">' +
        /* Sem desenho: silhueta de arma em traço não acrescenta nada que o
           texto não diga melhor, e uma ilustração que sai errada custa mais
           credibilidade do que a ausência dela. A ficha carrega a faixa de
           alcance, que é a informação que de fato separa uma família da outra. */
        ARMAS.map(function (a) {
          return '<article class="arma sem-fig" style="--c:' + a.cor + '">' +
            '<div class="txt"><span class="sig">' + a.sig + " &nbsp;·&nbsp; " + a.faixa +
            " &nbsp;·&nbsp; " + a.lista.length + " no jogo</span>" +
            "<h3>" + a.nome + "</h3><p>" + a.d + "</p>" +
            '<p class="uso"><b>No seu perfil</b>' + a.uso + "</p>" +
            '<ul class="roster">' +
            a.lista.map(function (w) {
              return "<li><b>" + w[0] + "</b>" +
                '<span class="mais">' + w[1] + "</span>" +
                '<span class="menos">' + w[2] + "</span></li>";
            }).join("") +
            "</ul></div></article>";
        }).join("") +
        "</div>" +
        D.nota("O erro de equipamento mais comum de quem vem de outros jogos de tiro: montar duas armas para a mesma distância. <b>Fuzil de assalto e submetralhadora resolvem o mesmo problema</b> — carregar os dois significa não ter resposta para nada além de sessenta metros.") +
        D.nota("Falta uma categoria nessa conta, porque ela não é arma de mão: o <b>lança-granadas MGL</b>, que existe sozinho na sua própria família. Junto com o lança-foguetes do equipamento, é a resposta para blindado quando contornar não é opção.") +
        "</section>";

      h += D.sinal();

      h += '<section id="oficina">' +
        D.cabSecao("03 · A OFICINA", "Cinco encaixes, e o que cabe em cada um",
          "A oficina divide a arma em <b>cinco</b> pontos de modificação — não mais que isso. Cada um mexe em atributos diferentes e quase todos têm contrapartida: melhorar precisão quase sempre custa mobilidade. Abaixo, o que cada encaixe faz, o que existe para colocar nele e onde está a armadilha.") +
        '<div class="pecas">' +
        PECAS.map(function (p, i) {
          return '<div class="peca"><span class="n">' + String(i + 1).padStart(2, "0") + "</span>" +
            "<h4>" + p[0] + "</h4><p>" + p[1] + "</p>" +
            '<p class="opcoes-enc"><b>Existe para encaixar</b>' + p[2] + "</p></div>";
        }).join("") +
        "</div>" +
        D.nota("Regra de decisão para qualquer encaixe: <b>o acessório deve resolver um problema que você observou</b>, não seguir uma reputação. Se você não está errando tiro por recuo, punho de controle não te dá nada — e custa mobilidade que você vai sentir na fuga.") +
        '<ul class="tenets" style="margin-top:14px">' +
        NAO_ENCAIXE.map(function (x) {
          return "<li><b>" + x[0] + "</b><span>" + x[1] + "</span></li>";
        }).join("") +
        "</ul>" +
        "</section>";

      h += D.sinal();

      h += '<section id="kits">' +
        D.cabSecao("04 · CONJUNTOS", "Três equipamentos que resolvem a ilha",
          "Todos assumem duas armas principais e uma secundária, com nível de equipamento desligado. Não são listas de armas específicas — são funções. Qualquer arma da categoria indicada serve, e a que você gostar de usar é sempre a melhor escolha.") +
        '<div class="kits">' +
        kit("var(--sub)", "O silencioso", "Padrão · use este 80% do tempo", [
          ["Principal", "Fuzil de assalto suprimido, mira de leitura rápida, punho de controle"],
          ["Segunda", "DMR suprimido, ampliação média — o alcance que o fuzil não tem"],
          ["Secundária", "Pistola suprimida, para o abate que não pode fazer barulho nenhum"],
          ["Classe", "Pantera ou Echelon"]
        ], "Cobre da porta até trezentos metros sem trocar de conjunto. É o equipamento que faz uma base inteira cair sem um alarme.") +
        kit("var(--medio)", "O observador", "Base grande, terreno aberto, alvo único", [
          ["Principal", "Fuzil de precisão, ampliação alta, supressor se disponível"],
          ["Segunda", "Submetralhadora suprimida, curta e leve, para quando fecharem distância"],
          ["Secundária", "Pistola suprimida"],
          ["Classe", "Atirador de elite ou Batedor"]
        ], "Resolve de fora. Exige disciplina de reposicionamento: o segundo ponto de tiro precisa estar escolhido antes do primeiro disparo.") +
        kit("var(--ruim)", "O quebrador", "Drone, blindagem e objetivo com cronômetro", [
          ["Principal", "Fuzil de assalto com lança-granadas acoplado"],
          ["Segunda", "Metralhadora leve ou escopeta, conforme a distância do problema"],
          ["Secundária", "Pistola, e pulso eletromagnético no cinto"],
          ["Classe", "Engenheiro ou Assalto"]
        ], "O conjunto para quando furtividade não é opção: região de produção de drones, cerco mecanizado, extração sob fogo. Barulhento por projeto.") +
        "</div>" +
        D.alerta("Uma arma que você gosta vence uma arma ótima",
          "Sem nível de equipamento, a diferença mecânica entre duas armas da mesma categoria é pequena o bastante para que familiaridade valha mais que ficha técnica. A arma que você já sabe onde acerta a trezentos metros é a melhor arma do seu inventário.") +
        "</section>";

      return h;
    },
    depois: null
  });

  function kit(cor, titulo, sub, itens, texto) {
    return '<div class="kit-c" style="--k:' + cor + '"><h3>' + titulo + '</h3><span class="sub">' + sub + "</span><ul>" +
      itens.map(function (i) { return "<li><b>" + i[0] + "</b><span>" + i[1] + "</span></li>"; }).join("") +
      "</ul><p>" + texto + "</p></div>";
  }

})(window.DOSSIE);
