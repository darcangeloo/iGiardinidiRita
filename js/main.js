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

  /* -- hero video scroll-scrubbing: solo su mobile, niente video su desktop -- */
  var heroSection = document.getElementById("hero");
  // Pre-decoded WebP frames drawn on a canvas: video seeking on iOS Safari
  // decodes from the previous keyframe and stutters, drawImage does not.
  var canvas = heroSection.querySelector(".hero-fg");
  var ctx = canvas.getContext("2d");
  var FRAME_COUNT = 100;
  var imgs = new Array(FRAME_COUNT);
  var target = 0;
  var pos = 0;
  var drawn = -1;
  var rafId = 0;
  var scrubStarted = false;

  function frameSrc(i) {
    return "assets/video/frames/f" + ("00" + (i + 1)).slice(-3) + ".webp";
  }

  // closest frame already decoded, so scrolling works before everything loads
  function nearest(i) {
    for (var d = 0; d < FRAME_COUNT; d++) {
      if (imgs[i - d]) return i - d;
      if (imgs[i + d]) return i + d;
    }
    return -1;
  }

  function draw() {
    var i = nearest(Math.round(pos));
    if (i < 0 || i === drawn) return;
    ctx.drawImage(imgs[i], 0, 0, canvas.width, canvas.height);
    drawn = i;
  }

  // ease the shown frame toward the scroll position instead of jumping
  function tick() {
    rafId = 0;
    pos += (target - pos) * 0.25;
    if (Math.abs(target - pos) < 0.1) pos = target;
    draw();
    if (pos !== target) rafId = requestAnimationFrame(tick);
  }

  function onScroll() {
    var rect = heroSection.getBoundingClientRect();
    var scrollable = heroSection.offsetHeight - window.innerHeight;
    var progress = scrollable > 0 ? -rect.top / scrollable : 0;
    target = Math.min(1, Math.max(0, progress)) * (FRAME_COUNT - 1);
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  // coarse-to-fine: every 32nd frame first, then 16th, ... then all,
  // so the first seconds of scrolling already have frames to show
  function loadFrames(count) {
    var seen = {};
    for (var step = 32; step >= 1; step /= 2) {
      for (var i = 0; i < count; i += step) {
        if (seen[i]) continue;
        seen[i] = true;
        (function (i) {
          var img = new Image();
          img.src = frameSrc(i);
          img.decode().then(function () {
            imgs[i] = img;
            drawn = -1;
            draw();
          }).catch(function () {});
        })(i);
      }
    }
  }

  function startScrub() {
    if (scrubStarted) return;
    scrubStarted = true;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    loadFrames(reduceMotion ? 1 : FRAME_COUNT);
    if (reduceMotion) return;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  var mobileQuery = window.matchMedia("(max-width: 767px)");
  if (mobileQuery.matches) startScrub();
  mobileQuery.addEventListener("change", function (e) {
    if (e.matches) startScrub();
  });
})();
