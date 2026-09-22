/* EMBER & SALT — vanilla JS runtime (ported from Next.js/Framer Motion).
   Motion math preserved: springs, lerps, velocity turbulence, eased mappings. */
(function () {
  "use strict";
  var isTinaEdit = false;
  try { isTinaEdit = window.self !== window.top; } catch (e) { isTinaEdit = true; }
  if (!isTinaEdit && document.querySelector('[data-tina-form]')) isTinaEdit = true;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || isTinaEdit;
  var fine = window.matchMedia("(pointer: fine)").matches && !isTinaEdit;

  /* ---------- spring helper: semi-implicit Euler, ζ = c/(2√(km)) ---------- */
  function springTo(obj, key, target, k, c, m, onU) {
    var v = obj[key + "__v"] || 0;
    var last = null;
    function frame(t) {
      if (last === null) last = t;
      var dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      var x = obj[key];
      var F = -k * (x - target) - c * v;
      v += (F / m) * dt;
      x += v * dt;
      obj[key] = x;
      obj[key + "__v"] = v;
      if (onU) onU(x);
      if (Math.abs(x - target) > 0.001 || Math.abs(v) > 0.001) requestAnimationFrame(frame);
      else { obj[key] = target; if (onU) onU(target); }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  try {
    if (!isTinaEdit && !reduce && typeof Lenis !== "undefined") {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      window.__lenis = lenis;
      var rafL = function (t) { lenis.raf(t); requestAnimationFrame(rafL); };
      requestAnimationFrame(rafL);
    }
  } catch (e) { lenis = null; }

  /* ---------- inert images: no ghost-drag anywhere ---------- */
  (function () {
    document.querySelectorAll("img").forEach(function (im) { im.draggable = false; });
  })();

  /* ---------- header ---------- */
  var header = document.getElementById("siteHeader");
  var prog = document.getElementById("progressLine");
  var lastY = 0;
  function onScrollHead() {
    var y = window.scrollY;
    if (header) {
      header.classList.toggle("solid", y > 60);
      header.classList.toggle("clear", y <= 60);
    }
    if (prog) {
      var max = document.body.scrollHeight - window.innerHeight;
      prog.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
    lastY = y;
  }
  window.addEventListener("scroll", onScrollHead, { passive: true });
  onScrollHead();

  var menuBtn = document.getElementById("menuBtn");
  var mobileNav = document.getElementById("mobileNav");
  if (menuBtn && mobileNav) {
    var open = false;
    var icoO = document.getElementById("menuIcoOpen");
    var icoC = document.getElementById("menuIcoClose");
    menuBtn.addEventListener("click", function () {
      open = !open;
      mobileNav.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", String(open));
      if (icoO) icoO.style.display = open ? "none" : "";
      if (icoC) icoC.style.display = open ? "" : "none";
      if (lenis) { open ? lenis.stop() : lenis.start(); }
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        open = false;
        mobileNav.classList.remove("open");
        if (icoO) icoO.style.display = "";
        if (icoC) icoC.style.display = "none";
        if (lenis) lenis.start();
      });
    });
  }

  /* ---------- reveal on scroll ---------- */
  function revealAll() { document.querySelectorAll(".rv:not(.in)").forEach(function (el) { el.classList.add("in"); }); }
  if (isTinaEdit) {
    revealAll();
    // Re-reveal swapped islands from Tina
    new MutationObserver(function (muts) {
      var needs = false;
      muts.forEach(function (m) {
        if (m.addedNodes && m.addedNodes.length) needs = true;
        m.addedNodes.forEach(function (n) {
          if (n.nodeType === 1 && (n.matches && n.matches('.rv') || n.querySelector && n.querySelector('.rv'))) needs = true;
        });
      });
      if (needs) revealAll();
    }).observe(document.body, { childList: true, subtree: true });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".rv").forEach(function (el, i) {
      if (reduce) { el.classList.add("in"); return; }
      el.style.transitionDelay = Math.min(i % 6 * 0.05, 0.25) + "s";
      io.observe(el);
    });
  }

  /* ---------- live seats ---------- */
  var SEATINGS = ["thu-sat-17", "thu-sat-20", "sun"];
  function seedFor(id) {
    var day = Math.floor(Date.now() / 86400000);
    var h = (day * 31 + id.length * 17 + id.charCodeAt(0)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return 2 + (Math.abs(h) % 7);
  }
  var store = {};
  SEATINGS.forEach(function (id) { store[id] = seedFor(id); });
  function renderSeats() {
    document.querySelectorAll("[data-seats],[data-seats-next]").forEach(function (el) {
      var n = store[el.getAttribute("data-seats")] ?? 4;
      el.classList.toggle("urgent", n <= 3);
      el.innerHTML = '<span class="dot"></span><span class="n">' + n + " seats left</span>";
    });
  }
  renderSeats();
  (function loop() {
    setTimeout(function () {
      var id = SEATINGS[Math.floor(Math.random() * SEATINGS.length)];
      if (store[id] > 2) { store[id] -= 1; renderSeats(); }
      loop();
    }, 45000 + Math.random() * 30000);
  })();
  function nextService() {
    var d = new Date().getDay();
    if (d === 0) return { id: "sun", label: "today, long service" };
    if (d === 4 || d === 5 || d === 6) return { id: "thu-sat-20", label: "tonight, 20:00" };
    return { id: "thu-sat-17", label: "Thursday, 17:00" };
  }
  document.querySelectorAll("[data-seats-next]").forEach(function (el) {
    var s = nextService();
    el.setAttribute("data-seats", s.id);
  });
  renderSeats();
  var svcLabel = document.getElementById("menuSvcLabel") || document.getElementById("recapSvc");
  if (svcLabel) {
    var s2 = nextService();
    svcLabel.textContent = "Next service " + s2.label + " —";
    var sib = svcLabel.parentElement && svcLabel.parentElement.querySelector("[data-seats-next]");
    if (sib) { sib.setAttribute("data-seats", s2.id); renderSeats(); }
  }
  // a confirmed request takes a seat off the board, everywhere at once
  window.addEventListener("seatstaken", function (e) {
    var id = e && e.detail;
    if (store[id] > 0) { store[id] -= 1; renderSeats(); }
  });

  /* ---------- magnetic ---------- */
  if (fine && !reduce) {
    document.querySelectorAll("[data-magnetic]").forEach(function (wrap) {
      var st = { x: 0, y: 0 };
      var el = wrap;
      el.style.display = "inline-block";
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        var tx = Math.max(-10, Math.min(10, dx * 0.25));
        var ty = Math.max(-10, Math.min(10, dy * 0.25));
        // critically-damped-ish approach
        st.x += (tx - st.x) * 0.2; st.y += (ty - st.y) * 0.2;
        el.style.transform = "translate(" + st.x + "px," + st.y + "px)";
      });
      el.addEventListener("mouseleave", function () {
        springTo(st, "x", 0, 120, 16, 0.8, function (v) { el.style.transform = "translate(" + v + "px," + st.y + "px)"; });
        springTo(st, "y", 0, 120, 16, 0.8, function (v) { el.style.transform = "translate(" + st.x + "px," + v + "px)"; });
      });
    });
  }

  /* ---------- HERO WebGL steam + ignite + cinematic exit ---------- */
  (function hero() {
    if (isTinaEdit) {
      var c0 = document.getElementById("gl");
      if (c0) { var fb0 = document.createElement("img"); fb0.src = c0.nextElementSibling && c0.nextElementSibling.tagName === 'IMG' ? c0.nextElementSibling.src : "/images/hero.jpg"; fb0.alt = "Fire dish"; fb0.style.cssText = "position:absolute;inset:0;width:100%;height:100%;object-fit:cover"; c0.replaceWith(fb0); }
      var ig0 = document.getElementById("ignite");
      if (ig0) ig0.remove();
      var hc0 = document.getElementById("heroContent");
      if (hc0) { hc0.style.opacity = "1"; hc0.style.transform = "none"; }
      return;
    }
    var canvas = document.getElementById("gl");
    if (!canvas) return;
    var heroContent = document.getElementById("heroContent");
    var heroBg = document.getElementById("heroBg");
    var igniteEl = document.getElementById("ignite");
    if (reduce) {
      var img = document.createElement("img");
      img.src = "/images/hero.jpg"; img.alt = "Fire dish";
      canvas.replaceWith(img);
      if (igniteEl) igniteEl.remove();
      return;
    }
    var gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) {
      var img2 = document.createElement("img");
      img2.src = "/images/hero.jpg"; img2.alt = "Fire dish";
      canvas.replaceWith(img2);
      if (igniteEl) igniteEl.remove();
      return;
    }
    var VERT = "attribute vec2 a_pos;varying vec2 v_uv;void main(){v_uv=a_pos*0.5+0.5;gl_Position=vec4(a_pos,0.0,1.0);}";
    var FRAG = [
      "precision highp float;varying vec2 v_uv;",
      "uniform sampler2D u_tex;uniform vec2 u_res;uniform vec2 u_img;",
      "uniform float u_time;uniform float u_turb;uniform float u_mouse;uniform float u_ignite;",
      "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
      "float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);",
      "return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}",
      "float fbm(vec2 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.03;a*=0.5;}return v;}",
      "vec2 coverUv(vec2 uv,vec2 res,vec2 img){float ra=res.x/res.y,ri=img.x/img.y;",
      "vec2 s=ra>ri?vec2(1.0,ri/ra):vec2(ra/ri,1.0);return (uv-0.5)*s+0.5;}",
      "void main(){vec2 res=u_res;vec2 cuv=coverUv(v_uv,res,u_img);float t=u_time;",
      "float column=smoothstep(0.55,0.05,abs(v_uv.x-(0.5+(u_mouse-0.5)*0.12)));",
      "float rise=fbm(vec2(v_uv.x*5.0+u_mouse*2.0,v_uv.y*3.0-t*0.55));",
      "float detail=fbm(vec2(v_uv.x*11.0-t*0.2,v_uv.y*7.0-t*0.9));",
      "float steam=column*smoothstep(0.35,0.85,rise*0.7+detail*0.45);",
      "float amp=(0.012+u_turb*0.055)*steam+u_turb*0.008*detail;",
      "vec2 duv=cuv+vec2((rise-0.5)*amp*2.0,(detail-0.5)*amp*1.2-steam*0.012);",
      "vec3 photo=texture2D(u_tex,clamp(duv,0.001,0.999)).rgb;",
      "photo=pow(photo,vec3(0.92))*vec3(1.06,0.98,0.90);",
      "float ember=smoothstep(0.55,1.0,v_uv.y)*(0.35+0.3*fbm(vec2(v_uv.x*4.0,t*0.4)));",
      "photo+=vec3(0.90,0.22,0.08)*ember*0.35*(1.0+u_ignite*1.6);",
      "photo+=vec3(1.0,0.93,0.82)*steam*(0.07+u_turb*0.16)*(1.0+u_ignite*0.8);",
      "photo+=vec3(1.0,0.7,0.4)*abs(rise-0.5)*steam*u_turb*0.12;",
      "{vec2 g=vec2(v_uv.x*26.0,v_uv.y*12.0-t*(0.30+u_turb*0.45));vec2 id=floor(g);vec2 f=fract(g);",
      "float h=hash(id);if(h>0.93){vec2 c=vec2(0.5+(hash(id+7.0)-0.5)*0.7,0.45);",
      "float d=length((f-c)*vec2(1.0,2.4));float tw=0.55+0.45*sin(t*6.0+h*40.0);",
      "float band=smoothstep(0.02,0.30,v_uv.y)*smoothstep(1.0,0.55,v_uv.y);",
      "photo+=vec3(1.0,0.52,0.18)*smoothstep(0.14,0.0,d)*tw*band*(0.35+u_turb*0.65)*(1.0+u_ignite);}}",
      "float vig=smoothstep(1.05,0.35,distance(v_uv,vec2(0.5,0.55)));photo*=mix(0.72,1.0,vig);",
      "photo+=(hash(v_uv*(res*0.5)+fract(t)*7.0)-0.5)*0.045;",
      "photo*=mix(0.82,1.0,smoothstep(0.0,0.35,v_uv.y));",
      "gl_FragColor=vec4(photo,1.0);}"
    ].join("\n");

    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    var prog, uLoc = {};
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link");
      gl.useProgram(prog);
    } catch (e) {
      var fb = document.createElement("img");
      fb.src = "/images/hero.jpg"; fb.alt = "Fire dish";
      canvas.replaceWith(fb);
      if (igniteEl) igniteEl.remove();
      return;
    }
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    ["u_tex", "u_res", "u_img", "u_time", "u_turb", "u_mouse", "u_ignite"].forEach(function (n) {
      uLoc[n] = gl.getUniformLocation(prog, n);
    });

    var turb = 0.15, target = 1.0, mouse = 0.5, ignite = 1.0;
    var lastY = window.scrollY, lastT = performance.now();
    var visible = true, dead = false;

    var pic = new Image();
    pic.onload = function () {
      if (dead) return;
      var tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, pic);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.uniform2f(uLoc.u_img, pic.naturalWidth, pic.naturalHeight);
      gl.uniform1i(uLoc.u_tex, 0);
      requestAnimationFrame(frame);
    };
    pic.src = "/images/hero.jpg";

    var dpr = Math.min(1.5, window.devicePixelRatio || 1);
    function resize() {
      var r = canvas.parentElement.getBoundingClientRect();
      canvas.width = Math.max(2, Math.floor(r.width * dpr));
      canvas.height = Math.max(2, Math.floor(r.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uLoc.u_res, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", function () {
      var now = performance.now();
      var v = Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT);
      lastY = window.scrollY; lastT = now;
      target = Math.min(0.15 + v * 1.6, 1);
      // cinematic exit
      var p = Math.min(1, window.scrollY / 700);
      if (heroContent) {
        heroContent.style.transform = "translateY(" + p * 130 + "px)";
        heroContent.style.opacity = String(1 - Math.min(1, window.scrollY / 550));
      }
      if (heroBg) {
        var s = 1 + Math.min(1, window.scrollY / 900) * 0.07;
        heroBg.style.transform = "scale(" + s + ")";
      }
    }, { passive: true });
    window.addEventListener("mousemove", function (e) {
      mouse = e.clientX / window.innerWidth;
      target = Math.min(target + 0.1, 1);
    }, { passive: true });
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(canvas);

    setTimeout(function () { if (igniteEl) igniteEl.classList.add("lifted"); }, 150);

    var slowFrames = 0, degraded = false, lastF = performance.now();
    function frame(t) {
      requestAnimationFrame(frame);
      var dt = t - lastF; lastF = t;
      if (!visible || dead) return;
      if (dt > 34 && ++slowFrames > 40 && !degraded) {
        degraded = true;
        canvas.width = Math.floor(canvas.width / 2);
        canvas.height = Math.floor(canvas.height / 2);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uLoc.u_res, canvas.width, canvas.height);
      }
      turb += (target - turb) * 0.08;
      target += (0.15 - target) * 0.02;
      ignite *= 0.965;
      gl.uniform1f(uLoc.u_time, t / 1000);
      gl.uniform1f(uLoc.u_turb, turb);
      gl.uniform1f(uLoc.u_mouse, mouse);
      gl.uniform1f(uLoc.u_ignite, ignite);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
  })();

  /* ---------- home flight: sticky cards scale down + choices ---------- */
  (function flight() {
    var flight = document.getElementById("flight");
    if (!flight) return;
    var reduceF = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cards = Array.prototype.slice.call(flight.querySelectorAll(".flight-card"));
    var picks = {};
    var recap = document.getElementById("recapLine");
    function updateRecap() {
      var keys = Object.keys(picks);
      if (recap) recap.textContent = keys.length === 2
        ? "Course III \u2014 " + picks["III"] + ". Course IV \u2014 " + picks["IV"] + ". Twelve courses, \u00A3185."
        : "Two choices outstanding (" + keys.length + "/2). The kiln waits.";
    }
    flight.querySelectorAll("[data-choice]").forEach(function (group) {
      var n = group.getAttribute("data-choice");
      var card = group.closest(".flight-card");
      var img = card ? card.querySelector("[data-photo-a]") : null;
      var label = card ? card.querySelector("[data-pick-label]") : null;
      var opts = Array.prototype.map.call(group.querySelectorAll("[data-opt]"), function (x) { return x.getAttribute("data-opt"); });
      group.querySelectorAll("[data-opt]").forEach(function (b) {
        b.addEventListener("click", function () {
          var opt = b.getAttribute("data-opt");
          picks[n] = opt;
          group.querySelectorAll("[data-opt]").forEach(function (x) {
            var on = x === b;
            x.classList.toggle("on", on);
            x.setAttribute("aria-pressed", String(on));
            var st = x.querySelector(".stamp");
            if (st && on) { st.classList.remove("play"); void st.offsetWidth; st.classList.add("play"); }
          });
          if (label) label.textContent = "You chose \u2014 " + opt;
          if (img && img.getAttribute("data-photo-b")) {
            img.style.opacity = "0";
            setTimeout(function () {
              img.src = opts[1] === opt ? img.getAttribute("data-photo-b") : img.getAttribute("data-photo-a");
              img.style.opacity = "1";
            }, 180);
          }
          updateRecap();
        });
      });
    });
    function onScrollF() {
      if (reduceF) return;
      cards.forEach(function (card, i) {
        var r = card.getBoundingClientRect();
        var stuck = Math.max(0, (88 + i * 22) - r.top);
        card.style.transform = "scale(" + (1 - Math.min(0.06, stuck / 4000)) + ")";
        card.style.filter = "brightness(" + (1 - Math.min(0.12, stuck / 6000)) + ")";
      });
    }
    window.addEventListener("scroll", onScrollF, { passive: true });
    onScrollF();
  })();

  /* ---------- story suppliers: sideways strip arrows ---------- */
  (function sup() {
    var strip = document.getElementById("supStrip");
    if (!strip) return;
    var prev = document.getElementById("supPrev");
    var next = document.getElementById("supNext");
    function step(dir) {
      var card = strip.querySelector("figure");
      var w = card ? card.getBoundingClientRect().width + 24 : 320;
      strip.scrollBy({ left: dir * w, behavior: "smooth" });
    }
    if (prev) prev.addEventListener("click", function () { step(-1); });
    if (next) next.addEventListener("click", function () { step(1); });
    // click-drag to scroll (mouse + touch fallback)
    var down = false, sx = 0, sl = 0, moved = false;
    strip.addEventListener("pointerdown", function (e) {
      down = true; moved = false; sx = e.clientX; sl = strip.scrollLeft;
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 6) moved = true;
      strip.scrollLeft = sl - dx;
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
      window.addEventListener(ev, function () { down = false; });
    });
    strip.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
    // vertical wheel over the strip scrolls the page; horizontal wheel drives the strip
    strip.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        window.scrollBy({ top: e.deltaY, behavior: "auto" });
      }
    }, { passive: false });
  })();

  /* ---------- dusk menu: daylight-to-night scroll + clock + choices ---------- */
  (function dusk() {
    var sec = document.getElementById("dusk");
    var wrap = document.getElementById("courses");
    if (!sec || !wrap) return;
    var reduceD = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var clock = document.getElementById("duskClock");
    var recap = document.getElementById("menuRecap");
    var rows = Array.prototype.slice.call(wrap.querySelectorAll(".course"));
    // daylight -> golden -> ember -> burnt -> night
    var STOPS = [
      [0.00, 255, 255, 255],
      [0.30, 246, 230, 200],
      [0.55, 200, 120, 70],
      [0.80, 90, 45, 28],
      [1.00, 28, 20, 16]
    ];
    function lerp(a, b, t) { return a + (b - a) * t; }
    function bgAt(p) {
      for (var s = 0; s < STOPS.length - 1; s++) {
        var a = STOPS[s], b = STOPS[s + 1];
        if (p <= b[0] || s === STOPS.length - 2) {
          var t = Math.max(0, Math.min(1, (p - a[0]) / (b[0] - a[0])));
          t = t * t * (3 - 2 * t); // smoothstep between stops
          return [lerp(a[1], b[1], t), lerp(a[2], b[2], t), lerp(a[3], b[3], t)];
        }
      }
      return [28, 20, 16];
    }
    function lum(rgb) { return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255; }
    function paint() {
      var r = wrap.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = Math.max(1, r.height - vh);
      var p = Math.max(0, Math.min(1, (vh * 0.5 - r.top) / total));
      var c = bgAt(p).map(Math.round);
      sec.style.backgroundColor = "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";
      sec.classList.toggle("night", lum(c) < 0.5);
      if (!reduceD) requestAnimationFrame(paint);
    }
    if (reduceD) {
      sec.style.backgroundColor = "#FFFFFF";
    } else {
      requestAnimationFrame(paint);
    }
    // clock follows the courses
    if (clock) {
      var cio = new IntersectionObserver(function (ens) {
        ens.forEach(function (en) {
          if (en.isIntersecting) {
            var t = en.target.getAttribute("data-time");
            if (t && clock.textContent !== t) {
              clock.style.opacity = "0";
              setTimeout(function () { clock.textContent = t; clock.style.opacity = "1"; }, 140);
            }
          }
        });
      }, { rootMargin: "-42% 0px -42% 0px" });
      rows.forEach(function (x) { cio.observe(x); });
    // fixed clock: visible only while the courses are on screen
    var cw = document.getElementById("duskClockWrap");
    if (cw && "IntersectionObserver" in window) {
      new IntersectionObserver(function (ens) {
        cw.style.opacity = ens[0].isIntersecting ? "1" : "0";
      }, { threshold: 0 }).observe(wrap);
    }
    }
    // choices + recap
    var picks = {};
    function updateRecap() {
      var keys = Object.keys(picks);
      if (recap) recap.textContent = keys.length === 2
        ? "Course III \u2014 " + picks["III"] + ". Course IV \u2014 " + picks["IV"] + ". Twelve courses, \u00A3185."
        : "Two choices outstanding (" + keys.length + "/2). The kiln waits.";
    }
    wrap.querySelectorAll("[data-mchoice]").forEach(function (group) {
      var n = group.getAttribute("data-mchoice");
      var btns = Array.prototype.slice.call(group.querySelectorAll("[data-mopt]"));
      var art = group.closest(".course");
      var im = art ? art.querySelector("[data-imga]") : null;
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          var opt = b.getAttribute("data-mopt");
          picks[n] = opt;
          btns.forEach(function (x) {
            var on = x === b;
            x.classList.toggle("win", on);
            x.classList.toggle("lose", !on);
            x.setAttribute("aria-pressed", String(on));
          });
          if (im) {
            var useB = btns[1] === b && im.getAttribute("data-imgb");
            var next = useB ? im.getAttribute("data-imgb") : im.getAttribute("data-imga");
            if (next && im.getAttribute("src") !== next) {
              im.style.opacity = "0";
              setTimeout(function () { im.setAttribute("src", next); im.style.opacity = "1"; }, 200);
            }
          }
          updateRecap();
        });
      });
    });
  })();

  /* ---------- assembly parallax ---------- */
  (function assembly() {
    var sec = document.getElementById("assembly");
    if (!sec) return;
    var glow = document.getElementById("asmGlow");
    var plate = document.getElementById("asmPlate");
    var cap = document.getElementById("asmCap");
    function map() {
      var r = sec.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = Math.max(0, Math.min(1, (vh - r.top) / (vh + r.height)));
      if (reduce) return;
      if (glow) glow.style.transform = "translateY(" + (80 - p * 160) + "px)";
      if (plate) plate.style.transform = "translate(-50%, calc(-50% + " + (140 - p * 280) + "px))";
      if (cap) cap.style.transform = "translateY(" + (60 - p * 120) + "px)";
      requestAnimationFrame(map);
    }
    if (!reduce) requestAnimationFrame(map);
  })();

  /* ---------- booking form ---------- */
  (function booking() {
    var form = document.getElementById("bookForm");
    if (!form) return;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var party = document.getElementById("fParty");
    var day = document.getElementById("fDay");
    var seat = document.getElementById("fSeat");
    var mood = document.getElementById("fMood");
    var name = document.getElementById("fName");
    var phone = document.getElementById("fPhone");
    var err = document.getElementById("bookErr");
    function seatKey() {
      if (day.value === "Sunday") return "sun";
      return seat.value === "17:00" ? "thu-sat-17" : "thu-sat-20";
    }
    function refreshSeats() {
      document.querySelectorAll("#bookSeats .seats").forEach(function (s) {
        s.hidden = s.getAttribute("data-seats") !== seatKey();
      });
    }
    [day, seat].forEach(function (el) { el.addEventListener("change", refreshSeats); });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = name.value.trim() !== "" && phone.value.trim() !== "";
      err.hidden = ok;
      if (!ok) { if (!reduce) name.focus(); return; }
      var serial = document.getElementById("bookSerial");
      serial.textContent =
        "No. " + String(40 + party.value.length * 7 + name.value.trim().length * 3 + day.value.length).padStart(3, "0");
      document.getElementById("bookLine").textContent =
        name.value.trim() + ", table for " + party.value + " \u2014 " + day.value + ", " + seat.value + ".";
      document.getElementById("bookMood").textContent =
        "Mood noted: " + mood.value + ". We telephone within a day to confirm.";
      var done = document.getElementById("bookDone");
      done.hidden = false;
      window.dispatchEvent(new CustomEvent("seatstaken", { detail: seatKey() }));
      serial.classList.remove("stamp-in"); void serial.offsetWidth; serial.classList.add("stamp-in");
      done.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      document.getElementById("bookSend").style.display = "none";
    });
    refreshSeats();
  })();
})();
