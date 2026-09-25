/* CROSS-COM — som.

   Tudo sintetizado na hora; nenhum arquivo de áudio.

   ——— por que a técnica mudou ———

   A versão anterior ainda era um oscilador tocando notas, só que notas
   graves. Continuava soando a instrumento porque a FÍSICA estava errada,
   não a afinação. Equipamento militar não tem altura definida: ele
   estala, chia, zumbe e cospe voz ininteligível.

   Três técnicas substituem os bipes:

   · SÍNTESE MODAL para todo impacto. Um estalo de relé não é um tom com
     envelope — é um impulso excitando os modos de ressonância de uma
     peça de metal. Aqui isso é literal: um estouro de 4 ms de ruído
     entra num banco de passa-faixa de Q alto, e cada filtro toca o seu
     modo e morre no seu próprio tempo. Q ≈ π·f·T é o que converte
     "quero 60 ms de cauda" em Q de filtro.

   · ESTÁTICA COM FORMA para a chegada de mensagem. Houve aqui uma
     tentativa de síntese de voz por formantes, e ela foi retirada:
     formante acerta a estrutura da fala e erra tudo que o ouvido usa
     para reconhecer uma pessoa, então o resultado cai no vale onde soa
     a máquina imitando gente — pior do que não tentar. O que ficou é o
     que um rádio realmente faz quando o canal abre: squelch, sopro de
     banda que passeia, crepitação e cauda.

   · RUÍDO QUANTIZADO para transmissão de dados. Ruído amostrado e
     segurado a 1,8 kHz e reduzido a três bits.

   Em cima de tudo isso vem a conexão ruim, que aqui é um efeito de
   primeira classe: o nível flutua dentro de cada rajada, o leito desaba
   sozinho de tempos em tempos e volta com squelch, e um convolutor de
   cauda curta coloca tudo dentro de uma caixa de metal. */

(function (w) {
  "use strict";

  var D = w.DOSSIE;
  var VOL = 0.6;

  var ctx = null, mestre = null, radio = null, seco = null;
  var branco = null, digital = null, impulso = null;
  var amb = null, tiqueTimer = null, quedaTimer = null;

  var ligado = false, ambLigado = true;

  try {
    ligado = localStorage.getItem("crosscom.som") === "on";
    ambLigado = localStorage.getItem("crosscom.ambiente") !== "off";
  } catch (e) { /* sem armazenamento: valores de fábrica */ }

  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ═══════════════════════════════════════════
     BUFFERS
     ═══════════════════════════════════════════ */

  function bufBranco(seg) {
    var n = Math.floor(ctx.sampleRate * seg);
    var b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  /* ruído amostrado-e-segurado e reduzido a poucos níveis: é assim que
     soa dado bruto passando por um enlace que não deveria carregá-lo */
  function bufDigital(seg) {
    var n = Math.floor(ctx.sampleRate * seg);
    var b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    var passo = Math.max(1, Math.floor(ctx.sampleRate / 1800));
    var segura = 0, conta = 0;
    for (var i = 0; i < n; i++) {
      if (conta-- <= 0) { segura = Math.round((Math.random() * 2 - 1) * 3) / 3; conta = passo; }
      d[i] = segura;
    }
    return b;
  }

  /* o excitador dos modos: estouro curtíssimo com ataque instantâneo */
  function bufImpulso() {
    var n = Math.floor(ctx.sampleRate * 0.004);
    var b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    return b;
  }

  /* resposta ao impulso de uma caixa pequena de metal: reflexões
     precoces densas e cauda de 260 ms */
  function bufSala() {
    var n = Math.floor(ctx.sampleRate * 0.26);
    var b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (var c = 0; c < 2; c++) {
      var d = b.getChannelData(c);
      for (var i = 0; i < n; i++) {
        var t = i / n;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 3.4) * 0.7;
      }
      var refl = [0.007, 0.013, 0.021, 0.034, 0.052];
      for (var r = 0; r < refl.length; r++) {
        var k = Math.floor(refl[r] * ctx.sampleRate) + (c ? 37 : 0);
        if (k < n) d[k] += (r % 2 ? -1 : 1) * (0.5 - r * 0.08);
      }
    }
    return b;
  }

  /* ═══════════════════════════════════════════
     CADEIA
     ═══════════════════════════════════════════ */

  function curvaDrive(k) {
    var n = 1024, c = new Float32Array(n);
    for (var i = 0; i < n; i++) {
      var x = i * 2 / n - 1;
      c[i] = (1 + k) * x / (1 + k * Math.abs(x));
    }
    return c;
  }

  function criar() {
    if (ctx) return ctx;
    var AC = w.AudioContext || w.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }

    branco = bufBranco(3);
    digital = bufDigital(1.5);
    impulso = bufImpulso();

    /* mestre → compressor → saída. O compressor é o que dá o aperto de
       transmissão comprimida, e de quebra impede estouro. */
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -21;
    comp.knee.value = 10;
    comp.ratio.value = 8;
    comp.attack.value = 0.003;
    comp.release.value = 0.16;
    comp.connect(ctx.destination);

    mestre = ctx.createGain();
    mestre.gain.value = 0.0001;
    mestre.connect(comp);

    /* barramento seco: o que é o chassi do aparelho, não sinal recebido */
    seco = ctx.createGain();
    seco.gain.value = 1;
    seco.connect(mestre);

    /* barramento de rádio: saturação, corte de retumbo, corte de brilho
       em dois estágios, e uma cauda curta de caixa metálica por cima */
    var ws = ctx.createWaveShaper();
    ws.curve = curvaDrive(2.4); ws.oversample = "2x";
    var hp = ctx.createBiquadFilter();
    hp.type = "highpass"; hp.frequency.value = 60;
    var lp1 = ctx.createBiquadFilter();
    lp1.type = "lowpass"; lp1.frequency.value = 2300; lp1.Q.value = 0.5;
    var lp2 = ctx.createBiquadFilter();
    lp2.type = "lowpass"; lp2.frequency.value = 2300; lp2.Q.value = 0.5;

    radio = ctx.createGain();
    radio.gain.value = 1;
    radio.connect(ws); ws.connect(hp); hp.connect(lp1); lp1.connect(lp2);

    var conv = ctx.createConvolver();
    conv.buffer = bufSala();
    var molhado = ctx.createGain(); molhado.gain.value = 0.22;
    lp2.connect(mestre);
    lp2.connect(conv); conv.connect(molhado); molhado.connect(mestre);

    return ctx;
  }

  function ok() { return ligado && ctx && ctx.state === "running"; }
  function destino(o) { return o && o.seco ? seco : radio; }

  /* ═══════════════════════════════════════════
     TIJOLOS
     ═══════════════════════════════════════════ */

  /* Síntese modal. lista = [[freq, cauda em segundos, peso], …]
     Um impulso excita todos os modos ao mesmo tempo e cada um decai no
     seu tempo — que é exatamente o que um pedaço de metal faz. */
  function modal(lista, o) {
    o = o || {};
    var t = ctx.currentTime + (o.atraso || 0);
    var burst = ctx.createBufferSource();
    burst.buffer = impulso;

    var soma = ctx.createGain();
    soma.gain.value = o.vol == null ? 0.5 : o.vol;

    for (var i = 0; i < lista.length; i++) {
      var f = lista[i][0], cauda = lista[i][1], peso = lista[i][2];
      var bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = f;
      /* Q que produz a cauda pedida */
      bp.Q.value = Math.max(1.5, Math.min(600, Math.PI * f * cauda));
      var g = ctx.createGain();
      g.gain.value = peso;
      burst.connect(bp); bp.connect(g); g.connect(soma);
    }
    soma.connect(destino(o));
    burst.start(t); burst.stop(t + 0.02);
  }

  function ruido(dur, o) {
    o = o || {};
    var t = ctx.currentTime + (o.atraso || 0);
    var s = ctx.createBufferSource();
    s.buffer = o.fonte === "digital" ? digital : branco;
    s.loop = true;
    if (o.fonte !== "digital") s.playbackRate.value = rnd(0.9, 1.1);

    var tipo = o.tipo || "lowpass";
    var f = ctx.createBiquadFilter();
    f.type = tipo;
    f.frequency.setValueAtTime(o.f0 || 900, t);
    if (o.f1) f.frequency.exponentialRampToValueAtTime(Math.max(30, o.f1), t + dur);
    f.Q.value = o.q || 0.8;
    var ultimo = f;

    if (tipo === "lowpass") {
      var f2 = ctx.createBiquadFilter();
      f2.type = "lowpass";
      f2.frequency.setValueAtTime(o.f0 || 900, t);
      if (o.f1) f2.frequency.exponentialRampToValueAtTime(Math.max(30, o.f1), t + dur);
      f2.Q.value = 0.5;
      f.connect(f2); ultimo = f2;
    }

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.1, t + (o.ataque || 0.004));
    if (o.sustenta) g.gain.setValueAtTime(o.vol || 0.1, t + o.sustenta);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    s.connect(f); ultimo.connect(g); g.connect(destino(o));
    s.start(t); s.stop(t + dur + 0.04);
  }

  /* subgrave puro, para peso — o único lugar onde ainda cabe oscilador */
  function sub(f, dur, o) {
    o = o || {};
    var t = ctx.currentTime + (o.atraso || 0);
    var osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, t);
    if (o.para) osc.frequency.exponentialRampToValueAtTime(Math.max(16, o.para), t + dur);
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t + (o.ataque || 0.006));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(destino(o));
    osc.start(t); osc.stop(t + dur + 0.04);
  }

  /* zumbidor mecânico: onda dura modulada em amplitude a poucas dezenas
     de hertz, dentro de uma ressonância estreita. Não é uma nota — é uma
     lâmina batendo contra um contato. */
  function zumbidor(f, dur, o) {
    o = o || {};
    var t = ctx.currentTime + (o.atraso || 0);
    var osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(f, t);

    var res = ctx.createBiquadFilter();
    res.type = "bandpass"; res.frequency.value = f * 2.6; res.Q.value = 3.2;

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.14, t + 0.008);
    g.gain.setValueAtTime(o.vol || 0.14, t + dur - 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    /* a trepidação */
    var am = ctx.createOscillator();
    am.type = "square"; am.frequency.value = o.trem || 34;
    var amG = ctx.createGain(); amG.gain.value = (o.vol || 0.14) * 0.55;
    am.connect(amG); amG.connect(g.gain);

    var lp = ctx.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = 1500;

    osc.connect(res); res.connect(lp); lp.connect(g); g.connect(destino(o));
    osc.start(t); osc.stop(t + dur + 0.03);
    am.start(t); am.stop(t + dur + 0.03);
  }

  /* ═══════════════════════════════════════════
     ESTÁTICA DE RÁDIO

     A síntese de voz saiu. Formante é uma aproximação: acerta a
     estrutura da fala e erra tudo que o ouvido usa para reconhecer uma
     pessoa, e o resultado cai no vale onde soa a máquina imitando gente
     — pior do que não tentar. Aqui a chegada de mensagem virou o que um
     rádio realmente faz quando o canal abre: squelch, sopro e cauda.

     Os cinco tipos continuam distinguíveis de ouvido, só que por
     textura em vez de voz — brilho da banda, duração, número de
     rajadas e presença de crepitação.
     ═══════════════════════════════════════════ */

  /* Sopro de canal aberto. O filtro passeia e o nível flutua: estática
     de nível constante soa a arquivo em repetição, não a enlace. */
  function sopro(o) {
    o = o || {};
    var t = ctx.currentTime + (o.atraso || 0);
    var dur = o.dur || 0.5;

    var s = ctx.createBufferSource();
    s.buffer = branco; s.loop = true;
    s.playbackRate.value = rnd(0.9, 1.1);

    var bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(o.f0 || 1100, t);
    bp.Q.value = o.q || 0.8;
    for (var tt = 0.055; tt < dur; tt += 0.055) {
      bp.frequency.linearRampToValueAtTime((o.f0 || 1100) * rnd(0.62, 1.5), t + tt);
    }

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.08, t + (o.ataque || 0.018));
    for (var ft = 0.05; ft < dur - 0.09; ft += 0.05) {
      g.gain.linearRampToValueAtTime((o.vol || 0.08) * rnd(0.4, 1), t + ft);
    }
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    s.connect(bp); bp.connect(g); g.connect(destino(o));
    s.start(t); s.stop(t + dur + 0.04);
  }

  /* crepitação: estalos curtíssimos espalhados pela duração */
  function crepita(n, dur, atraso, forca) {
    for (var i = 0; i < n; i++) {
      modal([[rnd(650, 2300), 0.007, 1]],
        { vol: rnd(0.04, 0.13) * (forca || 1), atraso: (atraso || 0) + Math.random() * dur });
    }
  }

  /* ═══════════════════════════════════════════
     A PALETA
     ═══════════════════════════════════════════ */

  /* portal de squelch: o clique de abertura, o sopro e a cauda que
     fecha — a assinatura de um rádio analógico destravando */
  function squelchAbre(o) {
    o = o || {};
    modal([[820, 0.012, 1], [1900, 0.008, 0.5]], { vol: 0.28, atraso: o.atraso || 0 });
    ruido(0.09, { f0: 400, f1: 2000, q: 0.9, vol: 0.075, atraso: o.atraso || 0 });
  }
  function squelchFecha(atraso) {
    ruido(0.16, { f0: 2100, f1: 320, q: 0.85, vol: 0.085, atraso: atraso });
    modal([[640, 0.02, 1]], { vol: 0.16, atraso: atraso + 0.01 });
  }

  var SONS = {

    /* — mecânica: tudo modal — */
    tecla: function () {
      modal([[188, 0.045, 1], [536, 0.03, 0.5], [1180, 0.016, 0.22]], { vol: 0.42 });
      ruido(0.02, { f0: 1500, f1: 500, q: 1.4, vol: 0.035 });
    },
    clique: function () {
      modal([[240, 0.05, 1], [690, 0.03, 0.45], [1510, 0.014, 0.2]], { vol: 0.5 });
    },
    trava: function () {
      modal([[1420, 0.018, 1], [2360, 0.011, 0.4]], { vol: 0.22 });
    },
    rele: function () {
      /* dois estalos: a lâmina fecha e depois se acomoda */
      modal([[310, 0.085, 1], [735, 0.055, 0.6], [1460, 0.03, 0.3], [2620, 0.016, 0.14]], { vol: 0.62 });
      modal([[295, 0.05, 1], [700, 0.03, 0.4]], { vol: 0.24, atraso: 0.042 });
      sub(78, 0.07, { vol: 0.1 });
    },
    enter: function () {
      modal([[168, 0.11, 1], [402, 0.07, 0.55], [880, 0.035, 0.25]], { vol: 0.66 });
      sub(62, 0.11, { para: 44, vol: 0.14 });
      ruido(0.03, { f0: 1100, f1: 380, q: 1.2, vol: 0.04, atraso: 0.008 });
    },
    tique: function () {
      ruido(0.014, { fonte: "digital", tipo: "bandpass", f0: 1300, q: 2.2, vol: 0.05 });
    },
    dados: function () {
      /* rajada de dados: ruído quantizado, curto e sujo */
      ruido(0.085, { fonte: "digital", tipo: "bandpass", f0: 1050, q: 1.3, vol: 0.11 });
      modal([[430, 0.02, 1]], { vol: 0.16 });
    },
    certo: function () {
      /* confirmação por textura, não por altura: dado curto e um baque */
      ruido(0.055, { fonte: "digital", tipo: "bandpass", f0: 900, q: 1.5, vol: 0.09 });
      modal([[212, 0.07, 1], [498, 0.04, 0.4]], { vol: 0.4, atraso: 0.05 });
    },
    erro: function () {
      zumbidor(96, 0.26, { vol: 0.15, trem: 27 });
      ruido(0.22, { f0: 620, f1: 180, q: 0.8, vol: 0.075 });
      sub(54, 0.3, { para: 38, vol: 0.12 });
    },
    falha: function () {
      zumbidor(84, 0.42, { vol: 0.17, trem: 22 });
      ruido(0.4, { f0: 900, f1: 130, q: 0.7, vol: 0.1 });
      sub(58, 0.45, { para: 30, vol: 0.2 });
    },
    alarme: function () {
      /* dois estados duros alternando devagar, com trepidação diferente
         em cada um. Sem intervalo musical entre eles. */
      for (var i = 0; i < 4; i++) {
        zumbidor(i % 2 ? 92 : 118, 0.2, { atraso: i * 0.27, vol: 0.16, trem: i % 2 ? 24 : 31 });
        sub(i % 2 ? 46 : 59, 0.2, { atraso: i * 0.27, vol: 0.1 });
      }
      ruido(1.15, { f0: 700, q: 0.7, vol: 0.05 });
    },
    tranco: function () {
      sub(48, 0.55, { para: 24, vol: 0.34, ataque: 0.002 });
      ruido(0.4, { f0: 1600, f1: 90, q: 0.6, vol: 0.2 });
      modal([[126, 0.3, 1], [318, 0.18, 0.5], [640, 0.1, 0.25]], { vol: 0.6 });
    },
    varrendo: function () {
      ruido(0.9, { tipo: "bandpass", f0: 280, f1: 1400, q: 3.4, vol: 0.075 });
      ruido(0.9, { f0: 500, q: 0.9, vol: 0.03 });
    },
    estatica: function () {
      ruido(0.5, { tipo: "bandpass", f0: 1100, q: 0.5, vol: 0.09, sustenta: 0.2 });
    },
    squelch: function () {
      squelchAbre();
      squelchFecha(0.1);
    },
    varredura: function () {
      /* o Azraël passando: descida longa, subgrave e a pá do rotor */
      ruido(2.6, { f0: 1700, f1: 85, q: 0.8, vol: 0.11 });
      sub(50, 2.6, { vol: 0.13 });
      rotor(2.6);
      ruido(0.5, { tipo: "bandpass", f0: 1400, q: 0.6, vol: 0.06, atraso: 2.3 });
    }
  };

  /* modulação de amplitude sobre banda grave: a pá batendo o ar */
  function rotor(dur) {
    var t = ctx.currentTime;
    var s = ctx.createBufferSource(); s.buffer = branco; s.loop = true;
    var f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 320; f.Q.value = 0.8;

    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    var lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.setValueAtTime(6.8, t);
    lfo.frequency.linearRampToValueAtTime(9.2, t + dur);
    var lfoG = ctx.createGain(); lfoG.gain.value = 0.05;
    lfo.connect(lfoG); lfoG.connect(g.gain);

    s.connect(f); f.connect(g); g.connect(radio);
    s.start(t); s.stop(t + dur + 0.05);
    lfo.start(t); lfo.stop(t + dur + 0.05);
  }

  /* Um som por tipo de mensagem, todos feitos de estática. O que muda
     entre eles é textura, não conteúdo: quanto brilho tem a banda,
     quanto tempo o canal fica aberto, quantas rajadas e quanto estala. */
  var POR_TIPO = {

    /* conversa de fundo: canal abre, sopra curto, fecha */
    rede: function () {
      squelchAbre();
      sopro({ atraso: 0.055, dur: 0.42, f0: 1000, q: 0.85, vol: 0.07 });
      crepita(2, 0.35, 0.07, 0.7);
      squelchFecha(0.5);
    },

    /* endereçada a você: dois cliques de transmissão na abertura — a
       chamada de quem quer atenção — e canal aberto mais tempo */
    direta: function () {
      squelchAbre();
      squelchAbre({ atraso: 0.14 });
      sopro({ atraso: 0.2, dur: 0.66, f0: 1400, q: 0.6, vol: 0.095 });
      crepita(3, 0.6, 0.22, 0.8);
      squelchFecha(0.88);
    },

    /* agitado: três rajadas emendadas, brilhante e cheio de estalo */
    socorro: function () {
      squelchAbre();
      for (var i = 0; i < 3; i++) {
        sopro({ atraso: 0.05 + i * 0.21, dur: 0.19, f0: 1750, q: 0.5,
                vol: 0.115, ataque: 0.008 });
      }
      crepita(9, 0.62, 0.05, 1.25);
      squelchFecha(0.7);
    },

    /* interceptado: fora de frequência. Banda estreita e grave, abertura
       suja sem squelch limpo, e dois subgraves batendo por baixo. */
    hostil: function () {
      ruido(0.16, { f0: 800, f1: 260, q: 0.8, vol: 0.06 });
      sopro({ atraso: 0.05, dur: 0.6, f0: 520, q: 2.4, vol: 0.085 });
      sub(58, 0.5, { vol: 0.06, atraso: 0.05 });
      sub(61.5, 0.5, { vol: 0.06, atraso: 0.05 });
      crepita(5, 0.55, 0.06, 0.9);
      ruido(0.2, { f0: 900, f1: 300, q: 0.7, vol: 0.05, atraso: 0.6 });
    },

    /* o próprio aparelho: sopro curto e o relé do chassi */
    sistema: function () {
      sopro({ atraso: 0, dur: 0.26, f0: 760, q: 1.1, vol: 0.075 });
      modal([[240, 0.08, 1], [560, 0.04, 0.4]], { vol: 0.4, atraso: 0.1 });
      crepita(2, 0.2, 0.02, 0.6);
    }
  };

  /* ═══════════════════════════════════════════
     LEITO AMBIENTE — o terminal ligado
     ═══════════════════════════════════════════ */

  function abrirAmbiente() {
    if (amb || !ctx || !ambLigado) return;

    var g = ctx.createGain();
    g.gain.value = 0.0001;
    g.connect(mestre);

    /* porta por onde a conexão cai */
    var porta = ctx.createGain();
    porta.gain.value = 1;
    porta.connect(g);

    var nos = [];

    /* zumbido de rede: fundamental e harmônico alguns décimos fora, para
       os dois baterem devagar um contra o outro */
    var h1 = ctx.createOscillator(); h1.type = "sine"; h1.frequency.value = 50;
    var h1g = ctx.createGain(); h1g.gain.value = 0.03;
    h1.connect(h1g); h1g.connect(g); h1.start(); nos.push(h1);

    var h2 = ctx.createOscillator(); h2.type = "sine"; h2.frequency.value = 100.4;
    var h2g = ctx.createGain(); h2g.gain.value = 0.014;
    h2.connect(h2g); h2g.connect(g); h2.start(); nos.push(h2);

    /* ronco de transformador */
    var tr = ctx.createOscillator(); tr.type = "sawtooth"; tr.frequency.value = 150;
    var trf = ctx.createBiquadFilter(); trf.type = "lowpass"; trf.frequency.value = 280; trf.Q.value = 0.7;
    var trg = ctx.createGain(); trg.gain.value = 0.009;
    tr.connect(trf); trf.connect(trg); trg.connect(g); tr.start(); nos.push(tr);

    /* ventilação: banda estreita e grave, com uma batida lenta */
    var vt = ctx.createBufferSource(); vt.buffer = branco; vt.loop = true;
    var vtf = ctx.createBiquadFilter(); vtf.type = "bandpass"; vtf.frequency.value = 210; vtf.Q.value = 2.4;
    var vtg = ctx.createGain(); vtg.gain.value = 0.05;
    vt.connect(vtf); vtf.connect(vtg); vtg.connect(g); vt.start(); nos.push(vt);

    /* ——— TELA LIGADA ———

       A tentativa anterior era um receptor quase sintonizado: portadora
       em 2,2 kHz, heteródino e apito de fonte chaveada em 9,3 kHz. Isso
       é agudo por construção e cansa em minutos.

       Som de tela ligada mora em outro lugar. A frequência de deflexão
       real de um tubo está em 15,6 kHz — acima do que a maioria escuta e
       insuportável para quem escuta. O que de fato se ouve numa sala com
       um monitor aceso é grave: o zumbido da rede, o ronco do
       transformador, a aspereza elétrica da deflexão com os harmônicos
       cortados cedo, e uma camada surda de estática de vidro.

       Então aqui NADA passa de 600 Hz. É uma escolha, não um descuido:
       a presença do aparelho vem do grave, e agudo nenhum é necessário
       para o ouvido saber que tem coisa ligada na frente dele. */

    /* deflexão: dente-de-serra grave com os harmônicos cortados em dois
       estágios. A dente-de-serra dá a aspereza elétrica; o corte duplo
       tira todo o brilho e deixa só o zumbido. */
    function deflexao(freq, vol) {
      var o1 = ctx.createOscillator(); o1.type = "sawtooth"; o1.frequency.value = freq;
      var f1 = ctx.createBiquadFilter(); f1.type = "lowpass"; f1.frequency.value = 430; f1.Q.value = 0.8;
      var f2 = ctx.createBiquadFilter(); f2.type = "lowpass"; f2.frequency.value = 430; f2.Q.value = 0.5;
      var gg = ctx.createGain(); gg.gain.value = vol;
      o1.connect(f1); f1.connect(f2); f2.connect(gg); gg.connect(porta);
      o1.start(); nos.push(o1);
      return o1;
    }
    /* duas meio hertz fora uma da outra: o zumbido vibra em vez de parar */
    deflexao(99.3, 0.021);
    deflexao(99.85, 0.013);

    /* estática de vidro: ruído surdo, sem nenhum agudo. É o que dá a
       sensação de superfície acesa em vez de silêncio digital. */
    var st = ctx.createBufferSource(); st.buffer = branco; st.loop = true;
    var st1 = ctx.createBiquadFilter(); st1.type = "lowpass"; st1.frequency.value = 540; st1.Q.value = 0.7;
    var st2 = ctx.createBiquadFilter(); st2.type = "lowpass"; st2.frequency.value = 540; st2.Q.value = 0.5;
    var sthp = ctx.createBiquadFilter(); sthp.type = "highpass"; sthp.frequency.value = 120;
    var stg = ctx.createGain(); stg.gain.value = 0.034;
    st.connect(sthp); sthp.connect(st1); st1.connect(st2); st2.connect(stg); stg.connect(porta);
    st.start(); nos.push(st);

    /* respiração lenta do corte — sem isso vira um zumbido parado */
    var lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.042;
    var lfoG = ctx.createGain(); lfoG.gain.value = 130;
    lfo.connect(lfoG); lfoG.connect(st1.frequency); lfo.start(); nos.push(lfo);

    g.gain.setTargetAtTime(1, ctx.currentTime, 1.4);

    amb = { g: g, porta: porta, nos: nos };
    agendaTique();
    agendaQueda();
  }

  function fecharAmbiente() {
    if (!amb) return;
    clearTimeout(tiqueTimer);
    clearTimeout(quedaTimer);
    var morto = amb; amb = null;
    try { morto.g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4); } catch (e) { /* segue */ }
    setTimeout(function () {
      for (var i = 0; i < morto.nos.length; i++) {
        try { morto.nos[i].stop(); } catch (e) { /* já parado */ }
      }
    }, 1600);
  }

  /* de tempos em tempos o aparelho se acomoda */
  function agendaTique() {
    clearTimeout(tiqueTimer);
    tiqueTimer = setTimeout(function () {
      if (amb && ok() && !document.hidden) {
        /* no leito os estalos também ficam graves: o que acomoda aqui é
           chassi de metal, não um bipe */
        if (Math.random() < 0.4) ruido(0.016, { f0: 620, f1: 280, q: 1.2, vol: 0.035 });
        else modal([[240, 0.07, 1], [560, 0.03, 0.35]], { vol: 0.08 });
      }
      if (amb) agendaTique();
    }, 5000 + Math.random() * 13000);
  }

  /* a conexão ruim, materializada: o canal desaba por um instante e
     volta com squelch. É o detalhe que faz a sala parecer um enlace. */
  function agendaQueda() {
    clearTimeout(quedaTimer);
    quedaTimer = setTimeout(function () {
      if (amb && ok() && !document.hidden) {
        var t = ctx.currentTime, dur = rnd(0.12, 0.42);
        try {
          amb.porta.gain.setValueAtTime(1, t);
          amb.porta.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
          amb.porta.gain.setValueAtTime(0.0001, t + dur);
          amb.porta.gain.exponentialRampToValueAtTime(1, t + dur + 0.07);
        } catch (e) { /* segue */ }
        squelchFecha(0.005);
        squelchAbre({ atraso: dur });
      }
      if (amb) agendaQueda();
    }, 22000 + Math.random() * 40000);
  }

  /* ═══════════════════════════════════════════
     INTERFACE PÚBLICA
     ═══════════════════════════════════════════ */

  var ouvintes = [];
  function avisar() {
    for (var i = 0; i < ouvintes.length; i++) {
      try { ouvintes[i](); } catch (e) { /* ouvinte ruim não derruba o resto */ }
    }
  }

  D.som = {

    ligado: function () { return ligado; },
    ambiente: function () { return ambLigado; },
    liberado: function () { return !!(ctx && ctx.state === "running"); },
    aoMudar: function (fn) { ouvintes.push(fn); },

    alterna: function (forcar) {
      ligado = typeof forcar === "boolean" ? forcar : !ligado;
      try { localStorage.setItem("crosscom.som", ligado ? "on" : "off"); } catch (e) { /* segue */ }

      if (ligado) {
        if (!criar()) { ligado = false; avisar(); return false; }
        var p = ctx.resume ? ctx.resume() : null;
        var acender = function () {
          mestre.gain.setTargetAtTime(VOL, ctx.currentTime, 0.06);
          abrirAmbiente();
          avisar();
        };
        if (p && p.then) p.then(acender, acender); else acender();
      } else {
        fecharAmbiente();
        if (mestre) mestre.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
      }
      avisar();
      return ligado;
    },

    alternaAmbiente: function (forcar) {
      ambLigado = typeof forcar === "boolean" ? forcar : !ambLigado;
      try { localStorage.setItem("crosscom.ambiente", ambLigado ? "on" : "off"); } catch (e) { /* segue */ }
      if (ambLigado) { if (ok()) abrirAmbiente(); } else fecharAmbiente();
      avisar();
      return ambLigado;
    },

    tocar: function (nome) {
      if (!ok() || !SONS[nome]) return;
      try { SONS[nome](); } catch (e) { /* um som a menos não derruba nada */ }
    },

    msg: function (tipo) {
      if (!ok()) return;
      var f = POR_TIPO[tipo] || POR_TIPO.rede;
      try { f(); } catch (e) { /* idem */ }
    }
  };

  if (ligado) {
    /* O gesto que libera o áudio não pode ser o próprio botão de som:
       senão o clique liberava e o manipulador do botão logo em seguida
       desligava, e quem chegava com o som já ligado da visita anterior
       via o botão fazer o contrário do que o rótulo prometia. */
    var soltar = function (e) {
      if (e && e.target && e.target.closest && e.target.closest("#som-btn, #bt-som")) return;
      document.removeEventListener("pointerdown", soltar);
      document.removeEventListener("keydown", soltar);
      D.som.alterna(true);
    };
    document.addEventListener("pointerdown", soltar);
    document.addEventListener("keydown", soltar);
  }

  document.addEventListener("visibilitychange", function () {
    if (!amb || !ctx) return;
    try {
      amb.g.gain.setTargetAtTime(document.hidden ? 0.0001 : 1, ctx.currentTime, 0.5);
    } catch (e) { /* segue */ }
  });

})(window);
