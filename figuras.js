/* CROSS-COM — pranchas de reconhecimento.

   ——— por que o desenho mudou ———

   As figuras anteriores eram ícones: um traço de espessura única, sem
   preenchimento, sem sombra e sem oclusão. Um boneco de palito com um
   capacete lê como desenho animado por três motivos concretos, e os três
   estão corrigidos aqui.

   · PESO DE LINHA. Ilustração técnica de verdade usa pelo menos quatro
     espessuras: silhueta externa grossa, estrutura média, ferragem fina
     e hachura fininha. Espessura única achata tudo no mesmo plano e é o
     que faz parecer pictograma.

   · OCLUSÃO. Um braço na frente do tronco precisa TAPAR o tronco. Aqui
     as massas são preenchidas com a cor do fundo da prancha antes de
     receberem o contorno, então o que está na frente esconde o que está
     atrás. Sem isso o desenho vira arame e o olho não monta o volume.

   · SOMBRA POR HACHURA. Os planos que fogem da luz levam hachura
     diagonal, que é como manual de campo resolve valor sem meio-tom.

   A moldura é a mesma para todos: graticulado fraco, linha de solo,
   escala vertical em metros e marcas de canto. Uma prancha de
   reconhecimento, não um adesivo. */

(function (D) {
  "use strict";

  var seq = 0;

  /* ═══════════════════════════════════════════
     A PRANCHA
     ═══════════════════════════════════════════ */

  /* opts: { alturaM, rotulo, escala (mostra régua), vb } */
  function placa(inner, o) {
    o = o || {};
    var id = "f" + (++seq);
    var W = 220, H = 250, SOLO = 228;

    var g = "";

    /* graticulado: referência métrica de fundo, bem apagada */
    g += '<g opacity=".16" stroke="currentColor" stroke-width=".4">';
    for (var x = 20; x < W; x += 20) g += '<path d="M' + x + " 14V" + SOLO + '"/>';
    for (var y = 28; y < SOLO; y += 20) g += '<path d="M14 ' + y + "H" + (W - 14) + '"/>';
    g += "</g>";

    /* marcas de canto */
    g += '<g stroke="currentColor" stroke-width="1" opacity=".55" fill="none">' +
      '<path d="M10 22V10h12M198 10h12v12M210 236v12h-12M22 248H10v-12"/></g>';

    /* Régua de altura. A escala sai do desenho, não do quadro: `topo` é
       a coordenada do ponto mais alto da figura, então a marca da altura
       declarada cai exatamente onde a figura termina. Derivar do quadro
       fazia a régua afirmar uma coisa e o desenho mostrar outra. */
    if (o.alturaM) {
      var porM = (SOLO - (o.topo == null ? 30 : o.topo)) / Math.max(o.alturaM, 0.05);
      var passo = o.alturaM > 3 ? 1 : (o.alturaM < 0.8 ? 0.1 : 0.5);
      g += '<g stroke="currentColor" stroke-width=".7" opacity=".5">';
      g += '<path d="M24 ' + SOLO + "V" + (SOLO - porM * o.alturaM).toFixed(1) + '"/>';
      for (var m = 0; m <= o.alturaM + 0.001; m += passo) {
        var yy = (SOLO - porM * m).toFixed(1);
        g += '<path d="M21 ' + yy + "h6" + '"/>';
      }
      g += "</g>";
      g += '<g fill="currentColor" opacity=".55" font-family="JetBrains Mono, monospace" font-size="6.5">';
      for (var m2 = 0; m2 <= o.alturaM + 0.001; m2 += passo) {
        if (m2 < passo * 0.5) continue;
        /* em figura pequena, número a cada 10 cm empilha: marca só as de 20 */
        if (passo < 0.2 && Math.round(m2 * 10) % 2 !== 0) continue;
        g += '<text x="10" y="' + ((SOLO - porM * m2) + 2.4).toFixed(1) + '">' +
          (passo < 1 ? m2.toFixed(1) : m2.toFixed(0)) + "</text>";
      }
      g += "</g>";
    }

    /* linha de solo */
    g += '<path d="M14 ' + SOLO + "H" + (W - 14) + '" stroke="currentColor" stroke-width="1.2" opacity=".75"/>';
    g += '<g stroke="currentColor" stroke-width=".55" opacity=".35">';
    for (var s = 18; s < W - 16; s += 7) {
      g += '<path d="M' + s + " " + (SOLO + 2) + "l-4 6" + '"/>';
    }
    g += "</g>";

    g += inner;

    /* a legenda fica embaixo da linha de solo: no topo ela colidia com
       o equipamento de cabeça das figuras mais altas */
    if (o.rotulo) {
      g += '<text x="' + (W - 14) + '" y="243" text-anchor="end" fill="currentColor" opacity=".55" ' +
        'font-family="JetBrains Mono, monospace" font-size="6.5" letter-spacing="1.6">' + o.rotulo + "</text>";
    }

    return '<svg viewBox="0 0 ' + W + " " + H + '" xmlns="http://www.w3.org/2000/svg" ' +
      (o.aria ? 'role="img" aria-label="' + o.aria + '"' : 'aria-hidden="true"') + ">" +
      "<defs>" +
      '<pattern id="hx' + id + '" width="4.2" height="4.2" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">' +
      '<path d="M0 0v4.2" stroke="currentColor" stroke-width=".62" opacity=".55"/></pattern>' +
      '<pattern id="hd' + id + '" width="2.3" height="2.3" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">' +
      '<path d="M0 0v2.3" stroke="currentColor" stroke-width=".55" opacity=".7"/></pattern>' +
      "</defs>" +
      '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
      g.replace(/%HX%/g, "url(#hx" + id + ")").replace(/%HD%/g, "url(#hd" + id + ")") +
      "</g></svg>";
  }

  /* massa preenchida com o fundo da prancha: é o que dá oclusão */
  var MASSA = 'fill="var(--surface2, #131c1f)"';
  var VAZIO = 'fill="currentColor"';

  function sombra(d, densa) {
    return '<path d="' + d + '" fill="' + (densa ? "%HD%" : "%HX%") + '" stroke="none"/>';
  }
  function corpo(d, sw) {
    return '<path d="' + d + '" ' + MASSA + ' stroke="currentColor" stroke-width="' + (sw || 1.5) + '"/>';
  }
  function linha(d, sw, op) {
    return '<path d="' + d + '" stroke-width="' + (sw || 0.8) + '"' +
      (op ? ' opacity="' + op + '"' : "") + "/>";
  }
  function solido(d) { return '<path d="' + d + '" ' + VAZIO + ' stroke="none"/>'; }

  /* Contorno de membro por deslocamento de normal.

     Contorno de braço desenhado à mão sai como placa: os dois lados não
     ficam paralelos ao osso e a espessura não acompanha a anatomia.
     Aqui entra a linha média — ombro, cotovelo, punho — com um raio por
     articulação, e o contorno é calculado: em cada nó a normal é
     perpendicular à direção média dos segmentos vizinhos, o lado de fora
     vai por um lado, uma tampa arredondada fecha a ponta e o lado de
     dentro volta. É o mesmo princípio de um traçado de espessura
     variável, e resolve cotovelo e punho de uma vez. */
  function membro(pts, ws) {
    var n = pts.length, A = [], B = [], i;
    for (i = 0; i < n; i++) {
      var dx, dy;
      if (i === 0) { dx = pts[1][0] - pts[0][0]; dy = pts[1][1] - pts[0][1]; }
      else if (i === n - 1) { dx = pts[i][0] - pts[i - 1][0]; dy = pts[i][1] - pts[i - 1][1]; }
      else { dx = pts[i + 1][0] - pts[i - 1][0]; dy = pts[i + 1][1] - pts[i - 1][1]; }
      var L = Math.hypot(dx, dy) || 1;
      var nx = -dy / L, ny = dx / L;
      A.push([pts[i][0] + nx * ws[i], pts[i][1] + ny * ws[i]]);
      B.push([pts[i][0] - nx * ws[i], pts[i][1] - ny * ws[i]]);
    }
    function p(q) { return q[0].toFixed(1) + " " + q[1].toFixed(1); }
    var d = "M" + p(A[0]);
    for (i = 1; i < n; i++) d += "L" + p(A[i]);
    var r = ws[n - 1];
    d += "A" + r.toFixed(1) + " " + r.toFixed(1) + " 0 0 1 " + p(B[n - 1]);
    for (i = n - 2; i >= 0; i--) d += "L" + p(B[i]);
    return d + "Z";
  }

  /* parafuso / rebite */
  function parafuso(x, y, r) {
    r = r || 1.6;
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" stroke-width=".6" opacity=".8"/>' +
      '<path d="M' + (x - r * 0.6) + " " + y + "h" + (r * 1.2) + '" stroke-width=".5" opacity=".8"/>';
  }

  /* ═══════════════════════════════════════════
     ARMAS — desenhadas em eixo próprio e depois giradas
     ═══════════════════════════════════════════ */

  /* carabina de assalto, origem no meio do receptor, cano para +x */
  function carabina() {
    var g = "";
    /* coronha retrátil */
    g += corpo("M-46 -7h9v-5h7v25h-7v-5h-9z", 1.2);
    g += linha("M-37 -3h7M-37 4h7", 0.6, ".7");
    /* tubo de recuo */
    g += corpo("M-37 -5h14v11h-14z", 1);
    g += linha("M-34 -5v11M-30 -5v11M-26 -5v11", 0.55, ".6");
    /* receptor */
    g += corpo("M-23 -9h28v18h-28z", 1.5);
    /* janela de ejeção */
    g += corpo("M-7 -6h11v7h-11z", 0.9);
    /* alavanca de armar */
    g += linha("M-23 -9h-7v3.5h7", 0.9);
    /* seletor e pino */
    g += parafuso(-16, 4, 1.5) + parafuso(-3, 5, 1.3);
    /* punho */
    g += corpo("M-16 9l-4 17h9l5-17z", 1.2);
    g += linha("M-17 13l7-1M-17.6 17l7-1M-18.2 21l7-1", 0.55, ".75");
    /* guarda-mato */
    g += linha("M-11 9q7 8 13 1", 1);
    /* carregador curvo */
    g += corpo("M-5 9q3 15 -1 22l-11-2q4-8 2-20z", 1.3);
    g += linha("M-6.5 16.5l-10-1.6M-7.4 21l-10-1.6", 0.55, ".7");
    /* guarda-mão com trilho */
    g += corpo("M5 -8h32v16H5z", 1.4);
    for (var i = 0; i < 8; i++) {
      g += linha("M" + (8 + i * 3.6) + " -8v4", 0.55, ".65");
      g += linha("M" + (8 + i * 3.6) + " 4v4", 0.55, ".5");
    }
    /* bloco de gás */
    g += corpo("M29 -8v-6h5v6", 1);
    /* cano e freio de boca */
    g += corpo("M37 -2.5h13v5H37z", 1.1);
    g += corpo("M50 -4.5h8v9h-8z", 1.2);
    g += linha("M52 -4.5v9M55 -4.5v9", 0.55, ".8");
    /* luneta */
    g += corpo("M-14 -9v-6h17v6", 1);
    g += corpo("M-16 -22h22v7h-22z", 1.3);
    g += linha("M-11 -22v7M-4 -22v7", 0.55, ".6");
    g += solido("M-16 -19.5h3v3h-3z");
    return g;
  }

  /* fuzil de precisão: mesma família, mais comprido e mais pesado */
  function dmr() {
    var g = "";
    g += corpo("M-52 -9h11v-4h8v27h-8v-5h-11z", 1.2);
    g += linha("M-44 -4h8M-44 5h8", 0.6, ".7");
    g += corpo("M-41 -6h16v13h-16z", 1);
    g += corpo("M-25 -10h30v20h-30z", 1.5);
    g += corpo("M-8 -7h12v8H-8z", 0.9);
    g += linha("M-25 -10h-8v4h8", 0.9);
    g += parafuso(-18, 5, 1.5);
    g += corpo("M-18 10l-4 18h9l5-18z", 1.2);
    g += linha("M-19 14l7-1M-19.6 18.5l7-1M-20.2 23l7-1", 0.55, ".75");
    g += linha("M-13 10q7 8 13 1", 1);
    g += corpo("M-6 10q3 16 -1 23l-11-2q4-8 2-21z", 1.3);
    g += corpo("M5 -9h40v17H5z", 1.4);
    for (var i = 0; i < 10; i++) g += linha("M" + (8 + i * 3.8) + " -9v4", 0.55, ".65");
    /* bipé recolhido sob o guarda-mão */
    g += linha("M22 8l14 11M26 8l14 11", 0.9, ".85");
    g += corpo("M45 -3h22v6H45z", 1.1);
    g += corpo("M67 -5h9v10h-9z", 1.2);
    g += linha("M69 -5v10M72 -5v10", 0.55, ".8");
    /* luneta longa com torres */
    g += corpo("M-16 -10v-7h20v7", 1);
    g += corpo("M-20 -27h30v9h-30z", 1.3);
    g += corpo("M-8 -31h7v4h-7z", 0.9);
    g += linha("M-13 -27v9M-2 -27v9", 0.55, ".6");
    g += solido("M-20 -24.5h4v4h-4z");
    return g;
  }

  /* ═══════════════════════════════════════════
     SOLDADO — um corpo, duas configurações
     ═══════════════════════════════════════════ */

  /* Proporção. Um homem de pé tem cerca de 7,5 cabeças; com capacete a
     cabeça engorda e fica perto de 7,2. A figura anterior tinha 4,6 —
     e cabeça grande demais sobre corpo curto demais é literalmente a
     receita de boneco de brinquedo, por mais ferragem que se desenhe
     em cima. Aqui a grade é explícita:

       topo do capacete  y=34      ombro      y=72
       queixo            y=61      cotovelo   y=108
       altura de cabeça  27        cintura    y=130
       total             194 (7,2) joelho     y=178
                                   solo       y=228

     A postura também mudou: perna de apoio reta, perna de trás fletida
     e afastada, quadril deslocado. Simetria perfeita lê como estátua. */

  /* o: { nvg, pesado, arma } */
  function soldado(o) {
    o = o || {};
    var g = "";

    g += sombra("M84 228q28 -6 56 0q-28 5 -56 0z");

    /* ——— perna de trás, fletida e afastada ——— */
    g += corpo(membro([[122, 126], [127, 152], [129, 176], [130, 210]], [11, 9.5, 8.5, 6.5]), 1.3);
    g += sombra(membro([[127, 128], [131, 152], [133, 176], [133, 208]], [5, 4.5, 4, 3]));
    g += corpo("M121 170h17l1 14h-19z", 0.9);                  /* joelheira */
    g += linha("M122 174h15M122.5 179h15", 0.5, ".6");
    g += corpo("M122 208h15l1 8 8 5 1 4h-26l1-9z", 1.3);       /* bota */
    g += linha("M123 221h21", 0.55, ".7");
    g += linha("M124 211l10 2M124 214l10 2", 0.45, ".55");

    /* ——— perna de apoio, reta ——— */
    g += corpo(membro([[98, 126], [96, 152], [94, 176], [93, 212]], [12, 10, 9, 7]), 1.5);
    g += corpo("M85 168h18l1 16H84z", 1);                      /* joelheira */
    g += linha("M85 174h17M85.5 180h17", 0.5, ".65");
    g += corpo("M87 134h15v20H87z", 0.8);                      /* bolso de carga */
    g += linha("M87 139h15M94.5 139v15", 0.5, ".55");
    g += parafuso(90, 137, 1) + parafuso(99, 137, 1);
    g += corpo("M86 210h16l-1 8-9 5-1 5H74l1-10z", 1.5);       /* bota */
    g += linha("M74 223h23", 0.6, ".75");
    g += linha("M88 212l11 2M88 215l11 2", 0.45, ".6");

    /* coldre de coxa, lado forte */
    g += corpo("M77 134h13v20H77z", 1);
    g += linha("M78 140h11", 0.5, ".7");
    g += linha("M80 154v10M87 154v10", 0.55, ".6");
    g += parafuso(83, 137, 1.2);

    /* ——— quadril e cinto ——— */
    g += corpo("M86 118h48l3 14q-27 7 -54 0z", 1.4);
    g += linha("M85 125h50", 1, ".9");
    for (var b = 0; b < 5; b++) g += parafuso(93 + b * 8.5, 125, 1.1);
    g += corpo("M104 121h12v9h-12z", 0.9);                     /* fivela */

    /* ——— tronco: peito largo, cintura estreita ——— */
    g += corpo("M88 76q22 -7 44 0l2 22q1 14 -1 32q-22 6 -46 0q-2 -18 -1 -32z", 1.6);
    g += sombra("M121 73q7 1 11 3l2 22q1 14 -1 32q-6 2 -12 3z");
    g += linha("M85 120h50", 1, ".85");                        /* cummerbund */
    g += linha("M89 100q21 5 42 0", 0.55, ".4");               /* borda da placa */

    /* porta-carregadores */
    var px = [93, 104, 115];
    for (var i = 0; i < 3; i++) {
      g += corpo("M" + px[i] + " 94h10v22h-10z", 1);
      g += linha("M" + px[i] + " 101h10", 0.6, ".8");
      g += linha("M" + (px[i] + 4.5) + " 101v5", 0.55, ".7");
      g += linha("M" + (px[i] + 1.5) + " 112h7", 0.45, ".5");
    }
    /* bolso administrativo e fita de identificação */
    g += corpo("M89 84h13v8H89z", 0.8);
    g += linha("M90 88h11", 0.45, ".6");
    g += corpo("M89 96h2v18h-2z", 0.7);
    /* rádio e antena */
    g += corpo("M120 82h13v16h-13z", 1);
    g += linha("M121 87h11M121 91h11", 0.5, ".65");
    g += linha("M126 82v-18q1 -5 5 -6", 0.9, ".9");
    g += parafuso(131, 95, 1.1);

    /* ombreiras */
    g += corpo("M81 78q3 -10 14 -8l1 10q-8 0 -11 5z", 1.2);
    g += corpo("M139 78q-3 -10 -14 -8l-1 10q8 0 11 5z", 1.2);
    g += linha("M84 76l10 -3M136 76l-10 -3", 0.5, ".55");

    if (o.pesado) {
      g += corpo("M133 76h10l3 34h-12z", 1.1);                 /* mochila */
      g += linha("M134 86h10M134 96h10", 0.5, ".6");
      g += corpo("M143 84h5v10h-5z", 0.7);
    }

    /* ——— pescoço e cabeça ———
       Descida de quatro unidades e gola alta: um homem de capacete e
       colete praticamente não mostra pescoço, e o vão que sobrava fazia
       a cabeça parecer pousada em cima do corpo. */
    g += '<g transform="translate(0,4)">';
    g += corpo("M103 56h14v16h-14z", 1.2);
    g += sombra("M112 56h5v16h-5z");
    g += corpo("M99 62h22v12q-11 4 -22 0z", 1.2);              /* gola alta */
    g += linha("M100 67q10 3 20 0", 0.5, ".55");
    /* crânio e mandíbula */
    g += corpo("M99 46q0 -12 11 -12t11 12v8q0 8 -11 11q-11 -3 -11 -11z", 1.4);
    /* meia face na sombra e gola de proteção */
    g += sombra("M113 46h8v8q0 7 -8 10z", true);
    g += corpo("M101 58h18v7h-18z", 0.9);
    g += linha("M102 61h16", 0.45, ".5");
    /* óculos balísticos */
    g += corpo("M97 48h26v7H97z", 1.1);
    g += solido("M99 49.4h22v4.2H99z");
    g += linha("M123 50l4 1.5", 0.7, ".75");

    /* capacete */
    g += corpo("M96 47a14 15 0 0 1 28 0l-1 4q-13 4 -26 0z", 1.6);
    g += sombra("M116 34q8 4 8 13l-1 4q-4 1 -7 2z");
    g += linha("M98 43q12 -4 24 0", 0.6, ".5");
    g += corpo("M96 42h9v5h-9z", 0.8);                         /* trilho */
    g += linha("M99 42v5M102 42v5", 0.45, ".7");
    g += corpo("M123 47h5v9h-5z", 0.9);                        /* proteção de nuca */
    g += linha("M99 52l3 9M121 52l-3 9", 0.7, ".75");          /* jugular */
    g += linha("M102 61h6", 0.6, ".75");

    if (o.nvg) {
      /* suporte e visão noturna de quatro tubos, levantada sobre o casco */
      g += corpo("M105 33h11v5h-11z", 0.9);
      g += corpo("M100 21h21v8h-21z", 1.2);
      var tx = [101, 106, 111, 116];
      for (var t = 0; t < 4; t++) {
        g += corpo("M" + tx[t] + " 14h4.2v8h-4.2z", 0.9);
        g += solido("M" + (tx[t] + 0.7) + " 14.7h2.8v2.2h-2.8z");
      }
      g += linha("M110.5 29v4", 0.9, ".9");
      g += linha("M99 24l-4 2M122 24l4 2", 0.55, ".7");
    } else {
      g += corpo("M105 34h10v5h-10z", 0.9);                    /* suporte vazio */
      g += corpo("M122 39h7v5h-7z", 0.9);                      /* lanterna */
      g += linha("M129 41h4", 0.55, ".7");
    }

    /* fone e microfone haste */
    g += corpo("M97 47a5 5.5 0 0 0 0 11 5 5.5 0 0 0 0-11z", 1.1);
    g += linha("M97 52h2.5", 0.5, ".7");
    g += linha("M98 56q4 7 10 8", 0.85, ".9");
    g += solido("M107 62h4.5v3.5H107z");
    g += "</g>";

    /* ——— arma: coronha no ombro forte, cano baixo à frente ——— */
    var arma = o.arma === "dmr" ? dmr() : carabina();
    g += '<g transform="translate(112,116) rotate(34) scale(' + (o.arma === "dmr" ? 0.78 : 0.86) + ')">' +
      arma + "</g>";
    g += linha("M96 80q12 14 20 26", 0.9, ".7");               /* bandoleira */

    /* ——— braços, por cima da arma ———
       As mãos caem exatamente onde a arma foi parar depois da rotação:
       punho em (91,123) e guarda-mão em (127,126). */

    /* braço de apoio, cruzando o corpo */
    g += corpo(membro([[128, 80], [136, 96], [135, 112], [128, 124]], [9, 7.5, 6.5, 5.5]), 1.4);
    g += corpo("M130 96h10v13h-10z", 0.8);                     /* cotoveleira */
    g += linha("M131 100h8M131 104h8", 0.45, ".55");
    g += corpo("M121 120q11 -3 14 4l-5 8q-10 2 -14 -4z", 1.2); /* mão enluvada */
    g += linha("M123 123l9 3M122 127l9 3", 0.45, ".6");
    g += linha("M124 121l-1 8", 0.45, ".5");

    /* braço de tiro */
    g += corpo(membro([[93, 80], [84, 96], [85, 112], [92, 123]], [9.5, 8, 6.5, 5.5]), 1.5);
    g += corpo("M79 96h11v14H79z", 0.9);                       /* cotoveleira */
    g += linha("M80 100h9M80 105h9", 0.45, ".55");
    g += corpo("M86 118q11 -2 13 5l-6 7q-10 1 -13 -5z", 1.3);  /* mão enluvada */
    g += linha("M88 121l9 3M87 125l9 3", 0.45, ".6");
    g += linha("M90 119l-1 8", 0.45, ".5");
    g += corpo("M82 110h7v5h-7z", 0.7);                        /* relógio de pulso */

    return g;
  }

  /* ═══════════════════════════════════════════
     DRONES E VEÍCULOS
     ═══════════════════════════════════════════ */

  /* Assenta o desenho na linha de solo com a escala pedida e devolve o
     topo resultante, que é o que a régua usa. `topo` e `base` são as
     coordenadas extremas do desenho no seu sistema original. */
  function assentar(inner, topo, base, escala) {
    var SOLO = 226, s = escala || 1;
    return {
      d: '<g transform="translate(110,' + SOLO + ') scale(' + s + ') translate(-110,' + (-base) + ')">' +
        inner + "</g>",
      topo: +(SOLO - (base - topo) * s).toFixed(1)
    };
  }

  function sombraSolo(meia) {
    return sombra("M" + (110 - meia) + " 228q" + meia + " -6 " + (meia * 2) + " 0q" +
      (-meia) + " 5 " + (-meia * 2) + " 0z");
  }

  /* rotor visto em perspectiva rasa: disco, cubo, duas pás e o rastro */
  function rotorReal(x, y, r, ry) {
    ry = ry || r * 0.3;
    var g = "";
    g += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + ry +
      '" stroke-width=".7" opacity=".38" stroke-dasharray="3 3"/>';
    g += '<path d="M' + (x - r) + " " + y + "q" + r + " " + (-ry * 1.7) + " " + (r * 2) + " 0" +
      '" stroke-width=".9" opacity=".6"/>';
    g += '<path d="M' + (x - r) + " " + y + "q" + r + " " + (ry * 1.7) + " " + (r * 2) + " 0" +
      '" stroke-width=".9" opacity=".35"/>';
    g += corpo("M" + (x - 3) + " " + (y - 2.6) + "h6v5.2h-6z", 1);
    return g;
  }

  function murmur() {
    var g = "";
    /* braços */
    g += corpo("M96 104l-38-18 3-6 39 15z", 1.1);
    g += corpo("M124 104l38-18-3-6-39 15z", 1.1);
    g += corpo("M96 118l-34 22 3 6 35-20z", 1.1);
    g += corpo("M124 118l34 22-3 6-35-20z", 1.1);
    /* motores */
    g += corpo("M52 80h14v10H52z", 1.2);
    g += corpo("M154 80h14v10h-14z", 1.2);
    g += corpo("M56 136h14v10H56z", 1.2);
    g += corpo("M150 136h14v10h-14z", 1.2);
    /* rotores */
    g += rotorReal(59, 78, 26, 7);
    g += rotorReal(161, 78, 26, 7);
    g += rotorReal(63, 134, 26, 7);
    g += rotorReal(157, 134, 26, 7);
    /* fuselagem */
    g += corpo("M92 96h36q7 0 7 7v22q0 7-7 7H92q-7 0-7-7v-22q0-7 7-7z", 1.6);
    g += sombra("M120 96h8q7 0 7 7v22q0 7-7 7h-8z");
    g += linha("M85 110h50", 0.7, ".55");
    g += parafuso(92, 102) + parafuso(128, 102) + parafuso(92, 126) + parafuso(128, 126);
    /* grade de ventilação */
    g += linha("M98 118h24M98 122h24M98 126h24", 0.5, ".6");
    /* torre de sensor com lente */
    g += corpo("M100 132h20v12h-20z", 1.2);
    g += corpo("M104 144a6 6 0 0 0 12 0z", 1.1);
    g += '<circle cx="110" cy="141" r="6" stroke-width="1.2"/>';
    g += '<circle cx="110" cy="141" r="2.6" ' + VAZIO + ' stroke="none"/>';
    g += '<circle cx="108" cy="139" r="1" fill="var(--surface2,#131c1f)" stroke="none"/>';
    /* antenas */
    g += linha("M96 96v-14M124 96v-14", 0.9, ".85");
    g += solido("M94.6 80h3v3h-3zM122.6 80h3v3h-3z");
    /* trem de pouso */
    g += linha("M96 138l-8 22M124 138l8 22", 1.1, ".9");
    g += linha("M80 160h18M122 160h18", 1.3, ".9");
    return g;
  }

  function malphas() {
    var g = "";
    /* rotores em duto */
    g += corpo("M40 70h34v13H40z", 1.2);
    g += corpo("M146 70h34v13h-34z", 1.2);
    g += corpo("M44 146h34v13H44z", 1.2);
    g += corpo("M142 146h34v13h-34z", 1.2);
    g += rotorReal(57, 68, 21, 6);
    g += rotorReal(163, 68, 21, 6);
    g += rotorReal(61, 144, 21, 6);
    g += rotorReal(159, 144, 21, 6);
    /* braços blindados */
    g += corpo("M84 96l-18-14 6-8 20 14z", 1.2);
    g += corpo("M136 96l18-14-6-8-20 14z", 1.2);
    g += corpo("M84 130l-16 16 6 8 18-16z", 1.2);
    g += corpo("M136 130l16 16-6 8-18-16z", 1.2);
    /* casco facetado */
    g += corpo("M110 78l30 16v42l-30 16-30-16V94z", 1.7);
    g += sombra("M110 78l30 16v42l-30 16z");
    g += linha("M80 94l30 16 30-16M110 110v42", 0.85, ".7");
    g += linha("M88 99l22 12 22-12", 0.6, ".45");
    g += parafuso(110, 84) + parafuso(86, 98) + parafuso(134, 98) +
         parafuso(86, 132) + parafuso(134, 132) + parafuso(110, 146);
    /* sensor central */
    g += '<circle cx="110" cy="117" r="10" stroke-width="1.4"/>';
    g += '<circle cx="110" cy="117" r="5" stroke-width=".8" opacity=".7"/>';
    g += '<circle cx="110" cy="117" r="2.6" ' + VAZIO + ' stroke="none"/>';
    /* casulos de arma */
    g += corpo("M58 108h22v16H58z", 1.3);
    g += corpo("M140 108h22v16h-22z", 1.3);
    g += corpo("M50 112h8v8h-8z", 1);
    g += corpo("M162 112h8v8h-8z", 1);
    g += linha("M62 112h14M62 120h14M144 112h14M144 120h14", 0.55, ".6");
    /* placa de blindagem ventral */
    g += corpo("M92 152h36l-6 12H98z", 1.1);
    g += linha("M96 158h28", 0.55, ".6");
    return g;
  }

  function incubus() {
    var g = "";
    /* chassi */
    g += corpo("M38 158h144l-10 34H48z", 1.7);
    g += sombra("M140 158h42l-10 34h-36z");
    /* glacis blindado */
    g += corpo("M52 158l14-26h88l14 26z", 1.5);
    g += linha("M66 140h88", 0.7, ".6");
    g += linha("M74 132v26M104 132v26M134 132v26", 0.5, ".4");
    /* costelas de reforço */
    g += linha("M60 164h100M60 172h100", 0.55, ".45");
    for (var p = 0; p < 7; p++) g += parafuso(56 + p * 18, 166, 1.4);
    /* mastro de sensor */
    g += corpo("M96 104h30v24H96z", 1.4);
    g += sombra("M116 104h10v24h-10z");
    g += corpo("M108 128h8v6h-8z", 1);
    g += '<circle cx="106" cy="116" r="7" stroke-width="1.3"/>';
    g += '<circle cx="106" cy="116" r="2.8" ' + VAZIO + ' stroke="none"/>';
    g += linha("M126 112h6v9h-6z", 0.8, ".8");
    /* radar rotativo */
    g += corpo("M126 108h22v4h-22z", 1);
    g += linha("M148 100v20", 0.9, ".7");
    /* antena */
    g += linha("M100 104V84q0 -5 5 -6", 0.9, ".85");
    /* grelha de arrefecimento */
    g += corpo("M150 164h24v20h-24z", 1);
    g += linha("M150 169h24M150 174h24M150 179h24", 0.5, ".6");
    /* rodas */
    var rx = [66, 110, 154];
    for (var i = 0; i < 3; i++) {
      g += '<circle cx="' + rx[i] + '" cy="198" r="21" ' + MASSA + ' stroke="currentColor" stroke-width="1.6"/>';
      g += '<circle cx="' + rx[i] + '" cy="198" r="10" stroke-width="1.1"/>';
      g += '<circle cx="' + rx[i] + '" cy="198" r="4" stroke-width=".8" opacity=".8"/>';
      /* garras do pneu */
      for (var a = 0; a < 12; a++) {
        var ang = a * Math.PI / 6;
        var x1 = rx[i] + Math.cos(ang) * 12, y1 = 198 + Math.sin(ang) * 12;
        var x2 = rx[i] + Math.cos(ang) * 20.5, y2 = 198 + Math.sin(ang) * 20.5;
        g += linha("M" + x1.toFixed(1) + " " + y1.toFixed(1) + "L" + x2.toFixed(1) + " " + y2.toFixed(1), 0.75, ".6");
      }
      g += linha("M" + (rx[i] - 7) + " 191l14 14M" + (rx[i] - 7) + " 205l14 -14", 0.5, ".4");
    }
    /* suspensão */
    g += linha("M66 178v6M110 178v6M154 178v6", 1.1, ".7");
    return g;
  }

  function azrael() {
    var g = "";
    /* está alto: não toca o solo, e a sombra fica lá embaixo */
    g += sombra("M86 228q24 -4 48 0q-24 4 -48 0z");
    g += linha("M110 150v70", 0.6, ".28");
    /* asa voadora vista por baixo, em leve perspectiva */
    g += corpo("M110 46l72 46-18 12-54-10-54 10-18-12z", 1.7);
    g += sombra("M110 46l72 46-18 12-54-10z");
    /* nervuras */
    g += linha("M110 46v52M78 70l32 18 32-18M62 84l48 14 48-14", 0.7, ".5");
    /* leme duplo */
    g += corpo("M76 98l-10 22h9l9-20z", 1.1);
    g += corpo("M144 98l10 22h-9l-9-20z", 1.1);
    /* bolha de sensor */
    g += '<circle cx="110" cy="92" r="12" ' + MASSA + ' stroke="currentColor" stroke-width="1.5"/>';
    g += '<circle cx="110" cy="92" r="6.5" stroke-width="1"/>';
    g += '<circle cx="110" cy="92" r="2.8" ' + VAZIO + ' stroke="none"/>';
    g += '<circle cx="107" cy="89" r="1.2" fill="var(--surface2,#131c1f)" stroke="none"/>';
    /* antenas e tomadas */
    g += corpo("M94 100h9v5h-9zM117 100h9v5h-9z", 0.8);
    g += parafuso(88, 88, 1.4) + parafuso(132, 88, 1.4) + parafuso(110, 62, 1.4);
    /* entrada de ar dorsal */
    g += corpo("M100 56h20v8h-20z", 1);
    g += linha("M100 60h20", 0.5, ".6");
    /* cone de varredura */
    g += '<path d="M110 104L44 210h132z" stroke-width=".8" opacity=".3" stroke-dasharray="5 6"/>';
    g += '<path d="M110 104L72 210M110 104L148 210M110 104v106" stroke-width=".6" opacity=".18"/>';
    /* frente de varredura */
    g += '<path d="M68 190q42 -12 84 0" stroke-width=".9" opacity=".4" stroke-dasharray="3 4"/>';
    g += '<path d="M84 160q26 -8 52 0" stroke-width=".9" opacity=".3" stroke-dasharray="3 4"/>';
    return g;
  }

  function behemoth() {
    var g = "";
    g += sombra("M34 228q76 -7 152 0q-76 6 -152 0z");
    /* pernas traseiras */
    g += corpo("M138 140l16 4 10 34-4 46h-11l-2-44-12-30z", 1.2);
    g += corpo("M62 140l-14 4-10 34 4 46h11l2-44 11-30z", 1.2);
    g += linha("M150 178q8 2 12 0M46 178q-6 2 -10 0", 0.7, ".6");
    g += corpo("M147 218h16v8h-16zM37 218h16v8H37z", 1.1);
    /* pernas dianteiras com pistões */
    g += corpo("M128 142l14 6 6 32-2 44h-12l1-42-10-28z", 1.4);
    g += corpo("M72 142l-12 6-6 32 2 44h12l-1-42 9-28z", 1.4);
    /* atuadores */
    g += corpo("M132 150h7v24h-7zM63 150h7v24h-7z", 0.9);
    g += linha("M133 156h5M133 162h5M64 156h5M64 162h5", 0.5, ".6");
    g += corpo("M132 216h18v9h-18zM52 216h18v9H52z", 1.3);
    g += linha("M134 225h14M54 225h14", 0.6, ".7");
    /* corpo blindado */
    g += corpo("M50 104h120l14 22-14 22H50L36 126z", 1.7);
    g += sombra("M120 104h50l14 22-14 22h-50z");
    g += linha("M50 126h120", 0.8, ".55");
    g += linha("M64 104v44M92 104v44M128 104v44M156 104v44", 0.5, ".4");
    for (var i = 0; i < 6; i++) g += parafuso(56 + i * 22, 112, 1.4);
    /* quadris */
    g += '<circle cx="66" cy="140" r="10" ' + MASSA + ' stroke="currentColor" stroke-width="1.3"/>';
    g += '<circle cx="154" cy="140" r="10" ' + MASSA + ' stroke="currentColor" stroke-width="1.3"/>';
    g += parafuso(66, 140, 2.4) + parafuso(154, 140, 2.4);
    /* torre e canhão */
    g += corpo("M88 76h44v28H88z", 1.5);
    g += sombra("M116 76h16v28h-16z");
    g += corpo("M132 84h38v10h-38z", 1.3);
    g += corpo("M170 82h10v14h-10z", 1.2);
    g += linha("M173 82v14M176 82v14", 0.55, ".8");
    g += linha("M136 88h30", 0.5, ".5");
    /* cabeça de sensor */
    g += corpo("M96 60h28v16H96z", 1.3);
    g += solido("M100 64h20v8h-20z");
    g += '<circle cx="106" cy="68" r="2.4" fill="var(--surface2,#131c1f)" stroke="none"/>';
    g += linha("M110 60v-8M104 52h12", 0.8, ".8");
    /* lançador de área */
    g += corpo("M58 82h26v14H58z", 1.2);
    g += linha("M62 82v14M68 82v14M74 82v14M80 82v14", 0.55, ".7");
    return g;
  }

  function sensor() {
    var g = "";
    g += sombra("M46 228q30 -5 60 0q-30 4 -60 0z");
    /* poste da câmera */
    g += corpo("M70 118h10v106h-10z", 1.4);
    g += sombra("M76 118h4v106h-4z");
    g += linha("M70 140h10M70 170h10M70 200h10", 0.55, ".5");
    g += corpo("M60 224h30v6H60z", 1.3);
    g += parafuso(66, 227, 1.2) + parafuso(84, 227, 1.2);
    /* braço e caixa da câmera */
    g += corpo("M75 116h26v8H75z", 1.1);
    g += corpo("M96 96h44v26H96z", 1.6);
    g += sombra("M124 96h16v26h-16z");
    g += corpo("M140 102h14l8-6v26l-8-6h-14z", 1.2);   /* capô */
    g += '<circle cx="112" cy="109" r="9" ' + MASSA + ' stroke="currentColor" stroke-width="1.4"/>';
    g += '<circle cx="112" cy="109" r="4.5" stroke-width=".9"/>';
    g += '<circle cx="112" cy="109" r="2" ' + VAZIO + ' stroke="none"/>';
    g += '<circle cx="109.5" cy="106.5" r="1" fill="var(--surface2,#131c1f)" stroke="none"/>';
    /* anel de infravermelho */
    for (var a = 0; a < 8; a++) {
      var ang = a * Math.PI / 4;
      g += '<circle cx="' + (112 + Math.cos(ang) * 12.5).toFixed(1) + '" cy="' +
        (109 + Math.sin(ang) * 12.5).toFixed(1) + '" r="1.5" stroke-width=".6" opacity=".7"/>';
    }
    g += linha("M100 100h6M100 118h6", 0.5, ".6");
    /* torre de comunicação ao fundo */
    g += '<g opacity=".5">';
    g += linha("M168 224L178 90L188 224", 1.2);
    g += linha("M172 200h12M174 170h8M175.5 140h5", 0.8);
    g += linha("M170 212l16-10M170 190l14-10M172 160l10-8", 0.5);
    g += corpo("M172 100h12v8h-12z", 0.9);
    g += linha("M178 90v-10", 0.9);
    g += '<path d="M186 104q14 6 14 22" stroke-width=".7" stroke-dasharray="3 4"/>';
    g += '<path d="M186 96q22 8 22 30" stroke-width=".7" stroke-dasharray="3 4" opacity=".6"/>';
    g += "</g>";
    /* cone de visão da câmera */
    g += '<path d="M112 118L64 206h96z" stroke-width=".8" opacity=".3" stroke-dasharray="5 6"/>';
    return g;
  }

  /* ═══════════════════════════════════════════
     ESTADO DO CORPO — v04
     ═══════════════════════════════════════════ */

  /* figura anatômica simples mas com volume, para marcar ferimento */
  function anatomia(marcas) {
    var g = "";
    g += corpo("M32 6a8 9 0 0 1 0 18a8 9 0 0 1 0-18z", 1.3);
    g += sombra("M32 6a8 9 0 0 1 0 18z");
    g += corpo("M28 24h8v5h-8z", 1);
    g += corpo("M20 29h24l4 24-5 16H21l-5-16z", 1.4);
    g += sombra("M34 29h10l4 24-5 16h-9z");
    g += linha("M22 46h20", 0.6, ".5");
    g += corpo("M20 30l-7 5-3 22 4 12 5-2-2-11 5-16z", 1.2);
    g += corpo("M44 30l7 5 3 22-4 12-5-2 2-11-5-16z", 1.2);
    g += corpo("M21 69h9l2 22-2 17h-9l1-18z", 1.3);
    g += corpo("M43 69h-9l-2 22 2 17h9l-1-18z", 1.3);
    g += corpo("M21 106h10v6H19z", 1.1);
    g += corpo("M43 106h-10v6h12z", 1.1);
    /* aqui a figura é pequena (64 px de largura): hachura nesse tamanho
       vira sujeira, então a sombra sai como preenchimento chapado fraco */
    return '<svg viewBox="0 0 64 118" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
      g.replace(/fill="%HX%"/g, 'fill="currentColor" opacity=".16"')
       .replace(/fill="%HD%"/g, 'fill="currentColor" opacity=".24"') +
      (marcas || "") + "</g></svg>";
  }

  /* ═══════════════════════════════════════════
     SILHUETAS — para a escala comparativa
     ═══════════════════════════════════════════ */

  var SILHUETAS = {
    humano:
      '<path d="M0 -74a7 8 0 0 1 0 16a7 8 0 0 1 0-16z"/>' +
      '<path d="M-3 -58h6v4h-6z"/>' +
      '<path d="M-11 -54h22l3 22-3 16h-22l-3-16z"/>' +
      '<path d="M-11 -53l-7 5-2 22 4 10 5-2-2-10 4-14z"/>' +
      '<path d="M11 -53l7 5 2 22-4 10-5-2 2-10-4-14z"/>' +
      '<path d="M-10 -16h8l2 20-1 16h-9l1-17z"/>' +
      '<path d="M10 -16h-8l-2 20 1 16h9l-1-17z"/>' +
      '<path d="M-10 20h9v4h-12z"/><path d="M10 20h-9v4h12z"/>',
    quad:
      '<path d="M-7 -6h14v12h-14z"/><path d="M-4 6h8v5h-8z"/>' +
      '<ellipse cx="-16" cy="-9" rx="9" ry="2.6" opacity=".5"/>' +
      '<ellipse cx="16" cy="-9" rx="9" ry="2.6" opacity=".5"/>' +
      '<path d="M-7 -4l-9-4M7 -4l9-4"/>' +
      '<path d="M-3 11a3 3 0 0 0 6 0z"/>',
    veiculo:
      '<path d="M-26 -4h52l-4 12h-44z"/><path d="M-18 -4l5-9h26l5 9z"/>' +
      '<circle cx="-15" cy="11" r="7"/><circle cx="0" cy="11" r="7"/><circle cx="15" cy="11" r="7"/>' +
      '<path d="M-3 -13h8v7h-8z"/>',
    asa:
      '<path d="M0 -8l26 8-7 5-19-3-19 3-7-5z"/><circle cx="0" cy="0" r="4"/>',
    anda:
      '<path d="M-24 -12h48l6 9-6 9h-48l-6-9z"/>' +
      '<path d="M-10 -20h18v8h-18z"/><path d="M8 -17h14v4H8z"/>' +
      '<path d="M-16 6l-7 14 2 16h5l-1-15 5-11zM16 6l7 14-2 16h-5l1-15-5-11z"/>' +
      '<path d="M-10 6l-4 14 1 16h5l-1-15 4-11zM10 6l4 14-1 16h-5l1-15-4-11z"/>',
    poste:
      '<path d="M-2 -30h4v52h-4z"/><path d="M-1 -30h12v9H-1z"/><circle cx="4" cy="-26" r="3"/>' +
      '<path d="M-7 22h14v4h-14z"/>'
  };

  /* ═══════════════════════════════════════════
     BRASÕES

     Ficam na mesma página das pranchas e estavam no traço antigo de
     espessura única — a comparação lado a lado denunciava os dois.
     Aqui eles ganham o mesmo vocabulário: campo com hachura, peso de
     linha variado e ferragem, mas em 64 px e sem a moldura, porque
     brasão é marca e não prancha técnica.
     ═══════════════════════════════════════════ */

  function brasao(inner, o) {
    o = o || {};
    var id = "b" + (++seq);
    var campo = o.escudo === false ? "" :
      '<path d="M32 4l25 10v20c0 15-11 24-25 28C18 58 7 49 7 34V14z" ' +
      MASSA + ' stroke="currentColor" stroke-width="1.6"/>' +
      '<path d="M32 4l25 10v20c0 15-11 24-25 28z" fill="%HX%" stroke="none"/>' +
      '<path d="M32 8l21 8.5v17.5c0 12.5-9 20-21 23.5" stroke-width=".6" opacity=".45"/>';
    return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      "<defs>" +
      '<pattern id="hx' + id + '" width="3.6" height="3.6" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">' +
      '<path d="M0 0v3.6" stroke="currentColor" stroke-width=".5" opacity=".38"/></pattern>' +
      "</defs>" +
      '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
      (campo + inner).replace(/%HX%/g, "url(#hx" + id + ")") +
      "</g></svg>";
  }

  var BRASOES = {
    /* Sentinel: escudo dentro do escudo, com rebites — segurança privada */
    sentinel: brasao(
      corpo("M32 15l15 6v13c0 9-7 14-15 17-8-3-15-8-15-17V21z", 1.3) +
      linha("M24 33l6 6 11-13", 1.6) +
      parafuso(32, 12, 1.4) + parafuso(18, 45, 1.2) + parafuso(46, 45, 1.2) +
      linha("M17 28h30", 0.5, ".4")),

    /* Lobos: capacete com visão noturna de quatro tubos, a silhueta deles */
    lobos: brasao(
      corpo("M21 31a11 11 0 0 1 22 0l-1 4q-10 3 -20 0z", 1.4) +
      corpo("M24 20h16v5H24z", 1) +
      '<g stroke-width="1">' +
      corpo("M24.5 13h3.6v7h-3.6z", 1) + corpo("M28.8 13h3.6v7h-3.6z", 1) +
      corpo("M33.1 13h3.6v7h-3.6z", 1) + corpo("M37.4 13h3.6v7h-3.6z", 1) +
      "</g>" +
      solido("M25.2 14h2.2v2h-2.2zM29.5 14h2.2v2h-2.2zM33.8 14h2.2v2h-2.2zM38.1 14h2.2v2h-2.2z") +
      corpo("M25 35h14v6q0 7 -7 9q-7 -2 -7 -9z", 1.2) +
      linha("M26 40h12", 0.5, ".5") +
      linha("M32 25v6", 0.9, ".8")),

    /* Homesteaders: telhado de fazenda sobre o vale, e a cerca */
    homesteaders: brasao(
      linha("M13 30L32 14l19 16", 1.6) +
      corpo("M18 30h28v18H18z", 1.3) +
      corpo("M27 38h10v10H27z", 1) +
      linha("M32 38v10", 0.6, ".7") +
      linha("M21 34h5v4h-5zM38 34h5v4h-5z", 0.7, ".8") +
      linha("M14 48h36", 1, ".8") +
      linha("M20 48v5M32 48v5M44 48v5", 0.6, ".5")),

    /* Outcasts: engrenagem partida — engenheiros que romperam */
    outcasts: brasao(
      '<circle cx="32" cy="32" r="13" ' + MASSA + ' stroke="currentColor" stroke-width="1.4"/>' +
      '<circle cx="32" cy="32" r="6" stroke-width="1.1"/>' +
      (function () {
        var g = "";
        for (var i = 0; i < 8; i++) {
          if (i === 2 || i === 3) continue;          /* o dente que falta */
          var a = i * Math.PI / 4;
          var x1 = 32 + Math.cos(a) * 13, y1 = 32 + Math.sin(a) * 13;
          var x2 = 32 + Math.cos(a) * 18, y2 = 32 + Math.sin(a) * 18;
          g += linha("M" + x1.toFixed(1) + " " + y1.toFixed(1) + "L" + x2.toFixed(1) + " " + y2.toFixed(1), 2.2);
        }
        return g;
      })() +
      linha("M40 22l-16 20", 1.6, ".9") +
      parafuso(32, 32, 2)),

    /* Skell: o olho de sensor que a empresa espalhou pela ilha */
    skell: brasao(
      '<circle cx="32" cy="32" r="14" stroke-width="1.4"/>' +
      '<circle cx="32" cy="32" r="8" ' + MASSA + ' stroke="currentColor" stroke-width="1.2"/>' +
      '<circle cx="32" cy="32" r="3.4" ' + VAZIO + ' stroke="none"/>' +
      '<circle cx="29.6" cy="29.6" r="1.2" fill="var(--surface2,#131c1f)" stroke="none"/>' +
      (function () {
        var g = "";
        for (var i = 0; i < 12; i++) {
          var a = i * Math.PI / 6;
          g += '<circle cx="' + (32 + Math.cos(a) * 18.5).toFixed(1) + '" cy="' +
            (32 + Math.sin(a) * 18.5).toFixed(1) + '" r="1.3" stroke-width=".6" opacity=".65"/>';
        }
        return g;
      })() +
      linha("M32 14v-5M32 55v-5M14 32h-5M55 32h-5", 0.8, ".7")),

    /* Erewhon: a boca da caverna sob a montanha, com a fogueira */
    erewhon: brasao(
      linha("M8 46L24 20l8 11 7-9 17 24", 1.6) +
      corpo("M22 46q0 -13 10 -13t10 13z", 1.3) +
      solido("M26 46q0 -9 6 -9t6 9z") +
      linha("M32 43v-4M30 41l4 -2", 0.7, ".9") +
      linha("M10 50h44", 1, ".8") +
      linha("M18 24l4 -3M44 30l3 4", 0.5, ".5"),
      { escudo: false })
  };

  /* ═══════════════════════════════════════════
     PUBLICAÇÃO
     ═══════════════════════════════════════════ */

  D.placa = placa;
  D.silhueta = function (nome) { return SILHUETAS[nome] || SILHUETAS.humano; };
  D.anatomia = anatomia;
  D.brasao = function (nome) { return BRASOES[nome] || ""; };

  D.figuras = {
    sentinel: function () {
      return placa(soldado({ nvg: false, arma: "carbina" }),
        { alturaM: 1.8, topo: 36, rotulo: "FIG. 01 · INFANTARIA", aria: "Operador de infantaria regular em posição baixa de prontidão, com capacete balístico, óculos, colete de placas com três porta-carregadores, rádio e carabina." });
    },
    lobo: function () {
      return placa(soldado({ nvg: true, pesado: true, arma: "dmr" }),
        { alturaM: 1.8, topo: 36, rotulo: "FIG. 02 · ELITE", aria: "Operador de elite com visão noturna de quatro tubos levantada sobre o capacete, colete pesado, mochila de assalto e fuzil de precisão." });
    },
    murmur: function () {
      var a = assentar(murmur(), 66, 160, 1.35);
      return placa(sombraSolo(52) + a.d,
        { alturaM: 0.4, topo: a.topo, rotulo: "FIG. 03 · AÉREO LEVE", aria: "Quadricóptero leve com quatro rotores, fuselagem compacta, torre de sensor com lente e trem de pouso." });
    },
    malphas: function () {
      var a = assentar(malphas(), 62, 164, 1.25);
      return placa(sombraSolo(48) + a.d,
        { alturaM: 1.2, topo: a.topo, rotulo: "FIG. 04 · AÉREO PESADO", aria: "Drone aéreo blindado com casco facetado, quatro rotores em duto, sensor central e dois casulos de arma." });
    },
    incubus: function () {
      var a = assentar(incubus(), 84, 219, 1.02);
      return placa(sombraSolo(72) + a.d,
        { alturaM: 2.4, topo: a.topo, rotulo: "FIG. 05 · TERRESTRE", aria: "Veículo terrestre não tripulado de seis rodas com glacis blindado, mastro de sensor e radar rotativo." });
    },
    azrael: function () {
      return placa(azrael(),
        { rotulo: "FIG. 06 · VIGILÂNCIA", aria: "Plataforma de vigilância em asa voadora vista por baixo, com bolha de sensor central e cone de varredura projetado ao solo." });
    },
    behemoth: function () {
      return placa(behemoth(),
        { alturaM: 6, topo: 52, rotulo: "FIG. 07 · PLATAFORMA", aria: "Plataforma blindada quadrúpede com pernas articuladas com pistões, corpo blindado, torre com canhão e cabeça de sensor." });
    },
    sensor: function () {
      return placa(sensor(),
        { alturaM: 6, topo: 80, rotulo: "FIG. 08 · SENSOR FIXO", aria: "Câmera de perímetro em poste com capô, anel de infravermelho e cone de visão, e uma torre de comunicação ao fundo." });
    }
  };

})(window.DOSSIE);
