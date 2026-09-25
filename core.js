/* CROSS-COM — núcleo.
   Registro de volumes e as funções de desenho compartilhadas.
   Carregado antes dos arquivos de conteúdo. */

(function (w) {
  "use strict";

  var D = w.DOSSIE = { volumes: [] };

  D.reg = function (v) { D.volumes.push(v); };

  D.el = function (id) { return document.getElementById(id); };

  /* Desenho de linha, mesma linguagem em todo o dossiê. */
  D.svg = function (inner, vb, extra) {
    return '<svg viewBox="' + (vb || "0 0 200 130") + '" xmlns="http://www.w3.org/2000/svg" ' +
      (extra || 'aria-hidden="true"') + ">" +
      '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      inner + "</g></svg>";
  };

  /* Ícone pequeno de interface. */
  D.ico = function (inner, vb) {
    return '<svg viewBox="' + (vb || "0 0 32 32") + '" xmlns="http://www.w3.org/2000/svg" fill="none" ' +
      'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true">' + inner + "</svg>";
  };

  /* Emblema em escudo — classes e facções.

     O campo agora é uma massa preenchida com hachura na metade que foge
     da luz, com contorno de peso próprio e um filete interno. O miolo
     que cada chamador passa continua igual: a melhoria vale para todos
     os emblemas de uma vez, sem mexer em nenhum deles. */
  var embSeq = 0;
  D.emb = function (inner) {
    var id = "e" + (++embSeq);
    var escudo = "M32 3l25 12v20c0 14-11 23-25 26C18 58 7 49 7 35V15z";
    return '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><pattern id="' + id + '" width="3.6" height="3.6" patternUnits="userSpaceOnUse" ' +
      'patternTransform="rotate(38)"><path d="M0 0v3.6" stroke="currentColor" stroke-width=".5" ' +
      'opacity=".34"/></pattern></defs>' +
      '<path d="' + escudo + '" fill="var(--surface2, #131c1f)" stroke="currentColor" stroke-width="1.6"/>' +
      '<path d="M32 3l25 12v20c0 14-11 23-25 26z" fill="url(#' + id + ')" stroke="none"/>' +
      '<path d="M32 7.5l21 10v17.5c0 11.8-9 19.4-21 22.2" fill="none" stroke="currentColor" ' +
      'stroke-width=".6" opacity=".45"/>' +
      '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      inner + "</g></svg>";
  };

  /* Rotor de drone: disco, cubo e o arco que sugere rotação. */
  D.rotor = function (x, y, r) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" opacity=".35"/>' +
      '<circle cx="' + x + '" cy="' + y + '" r="' + (r * 0.22).toFixed(1) + '" fill="currentColor" stroke="none"/>' +
      '<path d="M' + (x - r) + " " + y + "A" + r + " " + r + " 0 0 1 " +
      (x + r * 0.3).toFixed(1) + " " + (y - r * 0.95).toFixed(1) + '" opacity=".8"/>';
  };

  /* Gerador determinístico — as ilustrações precisam sair iguais sempre. */
  D.prng = function (s) {
    return function () {
      s |= 0; s = s + 0x6D2B79F5 | 0;
      var t = Math.imul(s ^ s >>> 15, 1 | s);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };

  /* Setor circular — campo de visão de guarda e de câmera. */
  D.cone = function (x, y, ang, raio, abertura) {
    var a1 = (ang - abertura) * Math.PI / 180, a2 = (ang + abertura) * Math.PI / 180;
    return "M" + x + " " + y +
      "L" + (x + Math.cos(a1) * raio).toFixed(1) + " " + (y + Math.sin(a1) * raio).toFixed(1) +
      "A" + raio + " " + raio + " 0 0 1 " +
      (x + Math.cos(a2) * raio).toFixed(1) + " " + (y + Math.sin(a2) * raio).toFixed(1) + "Z";
  };

  /* Lê um token do tema já resolvido, para pintar em canvas. */
  D.token = function (nome, padrao) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
    return v || padrao;
  };

  /* Converte uma cor qualquer em [r,g,b] usando o próprio canvas. */
  D.rgb = (function () {
    var ctx = null;
    return function (cor) {
      if (!ctx) ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = "#000";
      ctx.fillStyle = cor;
      ctx.fillRect(0, 0, 1, 1);
      var d = ctx.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2]];
    };
  })();

  /* Blocos de texto recorrentes, para não repetir marcação nos volumes. */
  D.transmissao = function (titulo, corpo) {
    return '<p class="transmissao">' + titulo + "<small>" + corpo + "</small></p>";
  };
  D.nota = function (texto) {
    return '<p class="item-desc">' + texto + "</p>";
  };
  D.alerta = function (titulo, corpo) {
    return '<p class="contato">' + titulo + "<small>" + corpo + "</small></p>";
  };
  D.sinal = function () { return '<div class="sinal"><i></i></div>'; };
  D.cabSecao = function (num, titulo, texto) {
    return '<div class="sec-head narrow"><p class="num">' + num + "</p><h2>" + titulo + "</h2>" +
      (texto ? "<p>" + texto + "</p>" : "") + "</div>";
  };
})(window);
