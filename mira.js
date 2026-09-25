/* CROSS-COM — a mira.

   Troca o ponteiro do sistema por um retículo tático: cruz fina no ponto
   exato, quatro cantos que fecham sobre o que dá para abrir, um anel que
   segue com um quadro de atraso e a referência de grade do arquipélago
   embaixo do cursor.

   A cruz fica na posição exata do ponteiro, sem suavização — atraso em
   cursor é irritante. Só o anel externo, que é decorativo, é que segue
   amortecido: é ele que dá peso ao movimento sem atrapalhar a pontaria.

   Não existe em toque: sem mouse não há o que substituir. */

(function (w) {
  "use strict";

  var D = w.DOSSIE;
  var FINO = matchMedia("(hover: hover) and (pointer: fine)");
  var reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var mira = null, anel = null, ref = null;
  var mx = -200, my = -200, ax = -200, ay = -200;
  var quadro = null, ativo = false, dentro = false;
  var alvoAtual = null;

  var ligado = true;
  try { ligado = localStorage.getItem("crosscom.mira") !== "off"; } catch (e) { /* segue ligado */ }

  var COLUNAS = "ABCDEFGHIJKLMNOP";

  function gradeDe(x, y) {
    var c = Math.min(15, Math.max(0, Math.floor(x / w.innerWidth * 16)));
    var l = Math.min(7, Math.max(1, Math.ceil(y / w.innerHeight * 7)));
    return COLUNAS[c] + (l < 10 ? "0" : "") + l;
  }

  /* o que conta como alvo: tudo que abre, navega ou alterna */
  function alvoDe(el) {
    if (!el || !el.closest) return null;
    return el.closest("[data-ir], [data-salto], button, a, summary, label, input[type='checkbox']");
  }

  function monta() {
    if (mira) return;

    anel = document.createElement("div");
    anel.className = "mira-anel";
    anel.setAttribute("aria-hidden", "true");

    mira = document.createElement("div");
    mira.className = "mira";
    mira.setAttribute("aria-hidden", "true");
    mira.innerHTML =
      '<i class="cr e"></i><i class="cr d"></i><i class="cr c"></i><i class="cr b"></i>' +
      '<i class="pt"></i>' +
      '<i class="q tl"></i><i class="q tr"></i><i class="q bl"></i><i class="q br"></i>' +
      '<span class="ref"></span>';
    ref = mira.querySelector(".ref");

    document.body.appendChild(anel);
    document.body.appendChild(mira);
    document.documentElement.classList.add("com-mira");

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", desce, { passive: true });
    document.addEventListener("pointerup", sobe, { passive: true });
    document.addEventListener("pointerleave", sai, { passive: true });
    w.addEventListener("blur", sai);

    ativo = true;
    quadro = requestAnimationFrame(pinta);
  }

  function desmonta() {
    if (!mira) return;
    ativo = false;
    if (quadro) cancelAnimationFrame(quadro);
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerdown", desce);
    document.removeEventListener("pointerup", sobe);
    document.removeEventListener("pointerleave", sai);
    w.removeEventListener("blur", sai);
    document.documentElement.classList.remove("com-mira");
    if (anel.parentNode) anel.parentNode.removeChild(anel);
    if (mira.parentNode) mira.parentNode.removeChild(mira);
    mira = anel = ref = null;
    alvoAtual = null;
  }

  function move(e) {
    mx = e.clientX; my = e.clientY;
    if (!dentro) { dentro = true; mira.classList.remove("fora"); anel.classList.remove("fora"); }

    /* sobre campo de texto a mira sai de cena e o cursor nativo volta:
       ninguém quer mirar para digitar */
    var campo = e.target && e.target.closest && e.target.closest("input, textarea, select");
    mira.classList.toggle("oculta", !!campo);
    anel.classList.toggle("oculta", !!campo);
    if (campo) { alvoAtual = null; mira.classList.remove("alvo"); return; }

    var a = alvoDe(e.target);
    if (a !== alvoAtual) {
      alvoAtual = a;
      mira.classList.toggle("alvo", !!a);
      anel.classList.toggle("alvo", !!a);
      if (a && D.som) D.som.tocar("trava");
    }
  }

  function desce() {
    if (!mira) return;
    mira.classList.add("apertado");
    if (D.som) D.som.tocar("clique");
  }
  function sobe() { if (mira) mira.classList.remove("apertado"); }
  function sai() {
    dentro = false;
    if (mira) { mira.classList.add("fora"); anel.classList.add("fora"); }
  }

  function pinta() {
    if (!ativo) return;
    /* anel amortecido, cruz exata */
    ax += (mx - ax) * (reduz ? 1 : 0.28);
    ay += (my - ay) * (reduz ? 1 : 0.28);
    mira.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
    anel.style.transform = "translate3d(" + ax + "px," + ay + "px,0)";
    if (ref) ref.textContent = gradeDe(mx, my);
    quadro = requestAnimationFrame(pinta);
  }

  /* ═══════════════════════════════════════════
     INTERFACE PÚBLICA
     ═══════════════════════════════════════════ */

  D.mira = {
    ligado: function () { return ligado && FINO.matches; },
    disponivel: function () { return FINO.matches; },

    alterna: function (forcar) {
      ligado = typeof forcar === "boolean" ? forcar : !ligado;
      try { localStorage.setItem("crosscom.mira", ligado ? "on" : "off"); } catch (e) { /* segue */ }
      if (ligado && FINO.matches) monta(); else desmonta();
      return ligado;
    },

    /* a mira acompanha o estado do enlace: durante a varredura fica âmbar */
    degradar: function (sim) {
      if (mira) mira.classList.toggle("ruim", !!sim);
      if (anel) anel.classList.toggle("ruim", !!sim);
    }
  };

  if (ligado && FINO.matches) monta();

  /* mouse plugado depois, ou saiu: acompanha */
  if (FINO.addEventListener) {
    FINO.addEventListener("change", function () {
      if (ligado && FINO.matches) monta(); else desmonta();
      /* a chave do rodapé some junto: sem ponteiro fino não há o que alternar */
      var b = document.getElementById("bt-mira");
      if (b) b.hidden = !FINO.matches;
    });
  }

})(window);
