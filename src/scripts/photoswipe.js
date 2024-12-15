import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

const lightbox = new PhotoSwipeLightbox({
  gallery: "#gallery",
  children: "a",
  pswpModule: () => import("photoswipe"),
})

lightbox.init()
