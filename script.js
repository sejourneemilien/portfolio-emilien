// --- TOUJOURS REVENIR EN HAUT AU RECHARGEMENT ---
// 1) Désactive la restauration auto du scroll par le navigateur
try { window.history.scrollRestoration = "manual"; } catch {}

// 2) Fonction qui supprime le hash et remonte en haut
function resetToTop() {
  if (location.hash) {
    // enlève #section dans l’URL
    history.replaceState(null, document.title, location.pathname + location.search);
  }
  // remonte en haut (compat multi-navigateurs)
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

// 3) Applique-la dans tous les cas utiles
window.addEventListener("load", resetToTop);                // chargement normal
window.addEventListener("pageshow", (e) => {                // retour depuis le cache (back/forward)
  if (e.persisted) resetToTop();
});
window.addEventListener("beforeunload", () => {             // juste avant de quitter/recharger
  window.scrollTo(0, 0);
});

// --- NAVIGATION DOUCE SANS HASH DANS L’URL ---
document.querySelectorAll('header nav a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const id = a.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    // nettoie l'URL (enlève le hash)
    history.replaceState(null, document.title, location.pathname + location.search);
  });
});


// GSAP + ScrollTrigger
gsap.registerPlugin(ScrollTrigger);



/* ------------------ INTRO CINÉMATIQUE ------------------ */
window.addEventListener('load', () => {
  const intro = document.getElementById('intro');

gsap.timeline()
  // Signature + texte apparaissent ensemble
  .fromTo(["#intro img", ".sig-caption"],
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.1 }
  )
  .to("#intro", { scaleX: 0.02, duration: 0.8, delay: 0.5, ease: "power4.inOut" })
  .to("#intro", { opacity: 0, duration: 0.35, onComplete: () => intro.remove() });

// Navigation interne : on va à la section n°index * hauteur de l'écran
const navLinksData = Array.from(document.querySelectorAll('header nav a[data-target]'));

navLinksData.forEach((a, index) => {
  a.addEventListener('click', (e) => {
    e.preventDefault();

    // chaque section est “pinnée” pleine hauteur : 0, 1×vh, 2×vh, 3×vh...
    const targetScroll = window.innerHeight * index;

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth'
    });

    // on nettoie l'URL (au cas où il y aurait un hash)
    history.replaceState(null, document.title, location.pathname + location.search);
  });
});


  /* ------------------ PANELS EN MODE "COUCHES" ------------------ */
  const panels = gsap.utils.toArray('.panel');

  // on donne un z-index croissant pour que chaque panel suivant recouvre le précédent
  panels.forEach((p, i) => p.style.zIndex = 10 + i);

  panels.forEach((panel) => {
    ScrollTrigger.create({
      trigger: panel,
      start: "top top",   // quand le haut de la section touche le haut de l'écran
      pin: true,          // la section devient fixe
      pinSpacing: false   // pas d'espace ajouté -> la suivante passe par-dessus
    });
  });

  // Fondu du texte de la première section quand la présentation arrive
  gsap.to(".panel-1 .hero-text", {
    opacity: 0, y: -40,
    scrollTrigger: {
      trigger: ".panel-2",
      start: "top 85%",
      end: "top 40%",
      scrub: true
    }
  });

  // Met à jour l’état "active" du menu selon la section visible
  const links = document.querySelectorAll("nav a");
  const ids   = ["#accueil", "#presentation", "#activites", "#contact"];

  ids.forEach((id, idx) => {
    ScrollTrigger.create({
      trigger: id,
      start: "top center",
      end: "bottom center",
      onEnter:  () => setActive(idx),
      onEnterBack: () => setActive(idx),
    });
  });

  function setActive(index){
    links.forEach(l => l.classList.remove("active"));
    links[index]?.classList.add("active");
  }
});

