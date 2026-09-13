(function () {
  "use strict";

  /* -- riparti sempre dall'hero al reload -- */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);

  /* -- lingua IT/EN -- */
  var langToggle = document.getElementById("langToggle");
  langToggle.addEventListener("click", function () {
    var isEn = document.documentElement.getAttribute("data-lang") === "en";
    var next = isEn ? "it" : "en";
    document.documentElement.setAttribute("data-lang", next);
    document.documentElement.lang = next;
  });

  /* -- lightbox galleria -- */
  var lightbox = document.getElementById("lightbox");
  var lightboxContent = document.getElementById("lightboxContent");
  var lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".gallery-item").forEach(function (item) {
    item.addEventListener("click", function () {
      var isEn = document.documentElement.getAttribute("data-lang") === "en";
      var caption = isEn
        ? item.getAttribute("data-caption-en")
        : item.getAttribute("data-caption-it");
      var src = item.querySelector("img").src;
      lightboxContent.innerHTML = "";
      var img = document.createElement("img");
      img.src = src;
      img.alt = caption;
      var cap = document.createElement("p");
      cap.textContent = caption;
      lightboxContent.appendChild(img);
      lightboxContent.appendChild(cap);
      lightbox.hidden = false;
    });
  });

  lightboxClose.addEventListener("click", function () {
    lightbox.hidden = true;
  });

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) lightbox.hidden = true;
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") lightbox.hidden = true;
  });

  /* -- hero scroll-scrubbing: solo su mobile -- */
  // Frames are decoded once into ImageBitmaps and drawn on an opaque canvas.
  // Measured on an emulated phone (4x CPU): drawing <img> elements dropped
  // ~10% of animation frames even after loading; ImageBitmaps dropped ~0%.
  var heroSection = document.getElementById("hero");
  var canvas = heroSection.querySelector(".hero-fg");
  var ctx = canvas.getContext("2d", { alpha: false });
  var FRAME_COUNT = 100;
  var COARSE = 2;
  var frames = new Array(FRAME_COUNT);
  var requested = new Array(FRAME_COUNT);
  var target = 0;
  var heroTop = 0;
  var scrollable = 1;
  var lastKey = "";
  var rafId = 0;
  var scrubStarted = false;

  function frameSrc(i) {
    return "assets/video/frames/f" + ("00" + (i + 1)).slice(-3) + ".webp";
  }

  // createImageBitmap decodes off the main thread and keeps the pixels,
  // so drawImage never re-decodes mid-scroll
  function decodeFrame(i) {
    if (window.createImageBitmap) {
      return fetch(frameSrc(i))
        .then(function (r) { return r.blob(); })
        .then(function (b) { return createImageBitmap(b); });
    }
    var img = new Image();
    img.src = frameSrc(i);
    return img.decode().then(function () { return img; });
  }

  // closest frame already decoded, so scrolling works before everything loads
  function nearest(i) {
    for (var d = 0; d < FRAME_COUNT; d++) {
      if (frames[i - d]) return i - d;
      if (frames[i + d]) return i + d;
    }
    return -1;
  }

  // cross-dissolve the two frames around the exact position; redraw only
  // when the frame pair or the (quantized) blend actually changes
  function draw() {
    var lo = Math.floor(target);
    var a = nearest(lo);
    if (a < 0) return;
    var b = nearest(Math.min(lo + 1, FRAME_COUNT - 1));
    var alpha = b >= 0 && b !== a ? Math.round((target - lo) * 16) / 16 : 0;
    if (alpha >= 1) {
      a = b;
      alpha = 0;
    }
    var key = alpha > 0 ? a + "|" + b + "|" + alpha : String(a);
    if (key === lastKey) return;
    lastKey = key;
    ctx.globalAlpha = 1;
    ctx.drawImage(frames[a], 0, 0, canvas.width, canvas.height);
    if (alpha > 0) {
      ctx.globalAlpha = alpha;
      ctx.drawImage(frames[b], 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
  }

  function tick() {
    rafId = 0;
    draw();
  }

  function schedule() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  // layout is read only on start/resize; scroll events just read scrollY
  function measure() {
    heroTop = heroSection.getBoundingClientRect().top + window.scrollY;
    scrollable = Math.max(1, heroSection.offsetHeight - window.innerHeight);
  }

  function onScroll() {
    var progress = (window.scrollY - heroTop) / scrollable;
    target = Math.min(1, Math.max(0, progress)) * (FRAME_COUNT - 1);
    schedule();
  }

  // next frame to fetch: every COARSE-th frame first (a fast flick always has
  // something close), then whichever is nearest the current scroll position
  function pickNext(count) {
    var best = -1;
    var bestScore = Infinity;
    var t = Math.round(target);
    for (var i = 0; i < count; i++) {
      if (requested[i]) continue;
      var score = Math.abs(i - t) + (i % COARSE === 0 ? 0 : FRAME_COUNT);
      if (score < bestScore) {
        bestScore = score;
        best = i;
      }
    }
    return best;
  }

  function loadFrames(count, concurrency) {
    function pump() {
      var i = pickNext(count);
      if (i < 0) return;
      requested[i] = true;
      decodeFrame(i)
        .then(function (f) {
          frames[i] = f;
          schedule();
        })
        .catch(function () {})
        .then(pump);
    }
    for (var w = 0; w < concurrency; w++) pump();
  }

  function startScrub() {
    if (scrubStarted) return;
    scrubStarted = true;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    measure();
    loadFrames(reduceMotion ? 1 : FRAME_COUNT, reduceMotion ? 1 : 6);
    if (reduceMotion) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      measure();
      onScroll();
    });
    onScroll();
  }

  var mobileQuery = window.matchMedia("(max-width: 767px)");
  if (mobileQuery.matches) startScrub();
  mobileQuery.addEventListener("change", function (e) {
    if (e.matches) startScrub();
  });
})();
