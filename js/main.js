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
  var videoFg = heroSection.querySelector(".hero-fg");
  var videoBg = heroSection.querySelector(".hero-bg");
  var ready = false;
  var ticking = false;
  var scrubStarted = false;
  var bgFrameSkip = 0;

  function setScrubTime(t) {
    if (Math.abs(videoFg.currentTime - t) > 0.05) videoFg.currentTime = t;
    // ponytail: blur() is expensive to recompute per frame, so the soft
    // background copy trails a bit and only reseeks every 3rd tick
    bgFrameSkip = (bgFrameSkip + 1) % 3;
    if (bgFrameSkip === 0 && Math.abs(videoBg.currentTime - t) > 0.05) {
      videoBg.currentTime = t;
    }
  }

  function onScroll() {
    if (!ready || ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var rect = heroSection.getBoundingClientRect();
      var scrollable = heroSection.offsetHeight - window.innerHeight;
      var progress = scrollable > 0 ? -rect.top / scrollable : 0;
      progress = Math.min(1, Math.max(0, progress));
      var maxTime = Math.max(0, videoFg.duration - 0.2);
      setScrubTime(progress * maxTime);
      ticking = false;
    });
  }

  function startScrub() {
    if (scrubStarted) return;
    scrubStarted = true;
    videoFg.src = "assets/video/hero.mp4";
    videoBg.src = "assets/video/hero.mp4";
    videoFg.addEventListener("loadedmetadata", function () {
      ready = true;
      videoFg.pause();
      videoBg.pause();
      onScroll();
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
  }

  var mobileQuery = window.matchMedia("(max-width: 767px)");
  if (mobileQuery.matches) startScrub();
  mobileQuery.addEventListener("change", function (e) {
    if (e.matches) startScrub();
  });
})();
