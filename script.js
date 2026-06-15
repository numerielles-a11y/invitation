const stage = document.querySelector(".phone-stage");
const seal = document.querySelector(".seal");
const intro = document.querySelector(".intro");
const soundButton = document.querySelector(".sound-button");
const sourateAudio = document.querySelector("#sourate-audio");
const form = document.querySelector("form");
const animatedItems = document.querySelectorAll(".family-panel, .family-monogram, .program-card, .schedule-row, .map-card, form label, fieldset, .submit");
const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".family-panel, .program-card").forEach((item, index) => {
  item.style.setProperty("--reveal-index", index % 5);
});

async function startAudio() {
  if (!sourateAudio) {
    return;
  }

  try {
    sourateAudio.volume = 0.62;
    await sourateAudio.play();
    soundButton.classList.remove("is-muted", "needs-interaction");
    soundButton.setAttribute("aria-pressed", "true");
  } catch {
    soundButton.classList.add("needs-interaction");
    soundButton.setAttribute("aria-pressed", "false");
  }
}

function stopAudio() {
  if (!sourateAudio) {
    return;
  }

  sourateAudio.pause();
  soundButton.classList.add("is-muted");
  soundButton.classList.remove("needs-interaction");
  soundButton.setAttribute("aria-pressed", "false");
}

function openInvitation() {
  if (stage.classList.contains("is-opening") || stage.classList.contains("is-open")) {
    return;
  }

  stage.classList.add("is-opening");
  window.setTimeout(() => {
    stage.classList.add("is-open");
    intro.setAttribute("aria-hidden", "true");
  }, 2400);
}

seal.addEventListener("click", openInvitation);

soundButton.addEventListener("click", () => {
  if (!sourateAudio) {
    return;
  }

  if (sourateAudio.paused || soundButton.classList.contains("needs-interaction")) {
    startAudio();
    return;
  }

  sourateAudio.pause();
  soundButton.classList.add("is-muted");
  soundButton.classList.remove("needs-interaction");
  soundButton.setAttribute("aria-pressed", "false");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const button = form.querySelector(".submit");
  const thankYou = form.querySelector(".thank-you");

  button.disabled = true;
  form.classList.add("is-sent");

  thankYou.classList.add("is-visible");
  thankYou.setAttribute("aria-hidden", "false");
});

animatedItems.forEach((item) => item.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -6% 0px" },
);

animatedItems.forEach((item) => revealObserver.observe(item));

seal.addEventListener("click", () => {
  openInvitation();
  startAudio();
});

if (!motionReduced) {
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(() => {
      const shift = Math.min(90, window.scrollY * 0.08);
      stage.style.setProperty("--scroll-shift", `${shift}px`);
      ticking = false;
    });
  }, { passive: true });

  window.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 860) {
      return;
    }

    const x = ((event.clientX / window.innerWidth) - 0.5) * 18;
    const y = ((event.clientY / window.innerHeight) - 0.5) * 14;
    stage.style.setProperty("--pointer-x", `${x}px`);
    stage.style.setProperty("--pointer-y", `${y}px`);
  }, { passive: true });
}

window.addEventListener("pagehide", stopAudio);
window.addEventListener("beforeunload", stopAudio);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    stopAudio();
  }
});
