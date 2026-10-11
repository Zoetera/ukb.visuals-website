// Project artwork and video IDs live here so media can be updated without changing layout.
const posters = [
  { image: "public/images/posters/poster-01.jpeg" },
  { image: "public/images/posters/poster-02.jpeg" },
  { image: "public/images/posters/poster-03.jpeg" },
  { image: "public/images/posters/poster-04.jpeg" },
  { image: "public/images/posters/poster-05.jpeg" },
  { image: "public/images/posters/poster-06.jpeg" },
  { image: "public/images/posters/IMG_1539.JPG.jpeg" },
  { image: "public/images/posters/IMG_1540.JPG.jpeg" },
  { image: "public/images/posters/IMG_1541.JPG.jpeg" },
];
const visuals = [
  { videoId: "Ls9Mn2ZnSKE" },
  { videoId: "m-Ta96qp9Sw" },
  { videoId: "gtWTV0WDGuE" },
  { videoId: "QtA-dj8poaE" },
];

const posterGrid = document.querySelector("#poster-grid");
const visualGrid = document.querySelector("#visual-grid");
const dialog = document.querySelector("#work-modal");
const modalMedia = document.querySelector("#modal-media");
const modalLink = document.querySelector("#modal-link");
const closeButton = dialog.querySelector(".modal-close");

const heroVideo = document.querySelector(".collage-video");
heroVideo.querySelector("img").addEventListener("error", () => {
  const fallback = document.createElement("span");
  fallback.className = "hero-thumbnail-fallback";
  fallback.textContent = "Thumbnail unavailable — open the featured video on YouTube ↗";
  heroVideo.replaceChildren(fallback);
}, { once: true });

function openModal({ kind, image, videoId }) {
  modalMedia.replaceChildren();
  dialog.setAttribute("aria-label", kind === "video" ? "YouTube video preview" : "Poster artwork by Upneet Kaur");
  if (kind === "poster") {
    const artwork = document.createElement("img");
    artwork.src = image;
    artwork.alt = "Poster artwork by Upneet Kaur";
    modalMedia.append(artwork);
    modalLink.href = "https://www.instagram.com/ukb.visuals/";
    modalLink.textContent = "View on Instagram ↗";
    modalLink.hidden = false;
  } else {
    if (typeof videoId !== "string" || !videoId.trim()) {
      const fallback = document.createElement("div");
      fallback.className = "modal-fallback";
      fallback.textContent = "This video is missing its YouTube ID, so a preview link is unavailable.";
      modalMedia.append(fallback);
      modalLink.hidden = true;
    } else {
      const frame = document.createElement("iframe");
      frame.title = "YouTube video preview";
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0`;
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allowFullscreen = true;
      frame.addEventListener("error", () => {
        const fallback = document.createElement("div");
        fallback.className = "modal-fallback";
        fallback.textContent = "The video preview could not load. Use the original YouTube link below.";
        modalMedia.replaceChildren(fallback);
      });
      modalMedia.append(frame);
      modalLink.href = `https://youtu.be/${encodeURIComponent(videoId)}`;
      modalLink.textContent = "Watch on YouTube ↗";
      modalLink.hidden = false;
    }
  }
  dialog.showModal();
  closeButton.focus();
}

function layoutPosterGrid() {
  const styles = getComputedStyle(posterGrid);
  const rowSize = parseFloat(styles.gridAutoRows);
  const rowGap = parseFloat(styles.rowGap);

  posterGrid.querySelectorAll(".poster-item").forEach((item) => {
    const image = item.querySelector("img");
    if (!image.naturalWidth || !image.naturalHeight || !item.clientWidth) return;

    const ratio = image.naturalWidth / image.naturalHeight;
    item.dataset.shape = ratio < 0.82 ? "portrait" : ratio > 1.2 ? "landscape" : "square";
    const imageHeight = item.clientWidth / ratio;
    const rowSpan = Math.ceil((imageHeight + rowGap) / (rowSize + rowGap));
    item.style.gridRowEnd = `span ${rowSpan}`;
  });
}
window.addEventListener("resize", () => requestAnimationFrame(layoutPosterGrid), { passive: true });

posters.forEach((poster) => {
  const button = document.createElement("button");
  button.className = "poster-item reveal";
  button.type = "button";
  button.setAttribute("aria-label", "Open poster artwork by Upneet Kaur");
  const thumb = document.createElement("span");
  thumb.className = "poster-thumb";
  const image = document.createElement("img");
  image.src = poster.image;
  image.alt = "Poster artwork by Upneet Kaur";
  image.loading = "lazy";
  image.addEventListener("load", layoutPosterGrid, { once: true });
  thumb.append(image);
  button.append(thumb);
  button.addEventListener("click", () => openModal({ ...poster, kind: "poster" }));
  posterGrid.append(button);
  if (image.complete) layoutPosterGrid();
});

visuals.forEach((visual) => {
  const button = document.createElement("button");
  button.className = "visual-item reveal";
  button.type = "button";
  button.setAttribute("aria-label", "Preview video on YouTube");
  const thumb = document.createElement("span");
  thumb.className = "visual-thumb";
  const image = document.createElement("img");
  image.src = `https://i.ytimg.com/vi/${encodeURIComponent(visual.videoId)}/hqdefault.jpg`;
  image.alt = "YouTube video thumbnail";
  image.loading = "lazy";
  image.addEventListener("error", () => {
    image.remove();
    const fallback = document.createElement("span");
    fallback.className = "modal-fallback";
    fallback.textContent = "Thumbnail unavailable — open preview for the original YouTube link ↗";
    thumb.append(fallback);
  }, { once: true });
  const play = document.createElement("span");
  play.className = "visual-play";
  play.setAttribute("aria-hidden", "true");
  play.textContent = "▶";
  thumb.append(image, play);
  button.append(thumb);
  button.addEventListener("click", () => openModal({ ...visual, kind: "video" }));
  visualGrid.append(button);
});

closeButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
dialog.addEventListener("close", () => modalMedia.replaceChildren());

document.querySelector("#year").textContent = String(new Date().getFullYear());
const revealTargets = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

