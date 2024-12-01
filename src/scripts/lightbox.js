import Glightbox from "glightbox"
import "glightbox/dist/css/glightbox.min.css"

document.addEventListener("DOMContentLoaded", () => {
  const lightbox = Glightbox({
    touchNavigation: true,
    loop: true,
    closeButton: true,
    width: "100vw",
    height: "100vh",
    preload: true,
    openEffect: "fade",
    closeEffect: "fade",
    slideEffect: "fade",
    dragAutoSnap: true,
    dragToleranceY: 0,
    cssEfects: {
      fade: { in: "fadeIn", out: "fadeOut" },
    },
  })
})
