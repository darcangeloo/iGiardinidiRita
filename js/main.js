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
  var video = heroSection.querySelector(".hero-fg");
  var ready = false;
  var target = 0;
  var rafId = 0;
  var scrubStarted = false;

  function tick() {
    rafId = 0;
    // one seek at a time: seeking again before the last frame is decoded
    // only piles up decoder work, which is what shows up as stutter
    if (video.seeking) {
      rafId = requestAnimationFrame(tick);
      return;
    }
    if (Math.abs(video.currentTime - target) > 0.01) video.currentTime = target;
  }

  function onScroll() {
    if (!ready) return;
    var rect = heroSection.getBoundingClientRect();
    var scrollable = heroSection.offsetHeight - window.innerHeight;
    var progress = scrollable > 0 ? -rect.top / scrollable : 0;
    progress = Math.min(1, Math.max(0, progress));
    target = progress * Math.max(0, video.duration - 0.2);
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function startScrub() {
    if (scrubStarted) return;
    scrubStarted = true;
    video.addEventListener("loadedmetadata", function () {
      ready = true;
      video.pause();
      onScroll();
    });
    // whole file in memory: seeks never wait on a network range request
    fetch("assets/video/hero.mp4")
      .then(function (r) { return r.blob(); })
      .then(function (b) { video.src = URL.createObjectURL(b); })
      .catch(function () { video.src = "assets/video/hero.mp4"; });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  var mobileQuery = window.matchMedia("(max-width: 767px)");
  if (mobileQuery.matches) startScrub();
  mobileQuery.addEventListener("change", function (e) {
    if (e.matches) startScrub();
  });
})();
