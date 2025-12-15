# Justified Layout Gallery (JavaScript)

## Description

A true justified row photo gallery using Flickr's justified-layout library. This JavaScript solution calculates precise scaling for each row so all edges align perfectly to the container width while maintaining consistent heights within rows. Unlike the Flexbox approximation, this produces crisp horizontal leading lines and maximum visual rhythm — the same approach used by professional photography sites like Flickr.

**From the blog post:** [Designing a Photo Gallery that Respects Photographs](https://www.kadykov.com/blog/designing-a-photo-gallery-layout/)

## Keywords

photo-gallery, justified-layout, flickr, javascript, perfect-alignment

## HTML

```html
<div class="gallery"></div>
```

## CSS

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #f5f5f5;
  padding: 2rem;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

.gallery {
  position: relative;
  margin: 0 auto;
}

.gallery img {
  position: absolute;
  border: 1px solid #ddd;
  display: block;
}
```

## JavaScript

**Note:** Add this external script in CodePen settings:
`https://unpkg.com/justified-layout@4.1.0/dist/justified-layout.min.js`

```javascript
// Photo collection with aspect ratios
const photos = [
  { src: "https://picsum.photos/id/947/500/333", width: 500, height: 333 },
  { src: "https://picsum.photos/id/613/334/502", width: 334, height: 502 },
  { src: "https://picsum.photos/id/882/489/326", width: 489, height: 326 },
  { src: "https://picsum.photos/id/263/342/500", width: 342, height: 500 },
  { src: "https://picsum.photos/id/685/300/200", width: 300, height: 200 },
  { src: "https://picsum.photos/id/234/408/408", width: 408, height: 408 },
  { src: "https://picsum.photos/id/424/408/306", width: 408, height: 306 },
  { src: "https://picsum.photos/id/67/284/428", width: 284, height: 428 },
  { src: "https://picsum.photos/id/230/300/300", width: 300, height: 300 },
  { src: "https://picsum.photos/id/591/354/472", width: 354, height: 472 },
  { src: "https://picsum.photos/id/79/400/602", width: 400, height: 602 },
  { src: "https://picsum.photos/id/256/500/174", width: 500, height: 174 },
  { src: "https://picsum.photos/id/349/326/217", width: 326, height: 217 },
  { src: "https://picsum.photos/id/35/275/362", width: 275, height: 362 },
  { src: "https://picsum.photos/id/27/326/183", width: 326, height: 183 },
  { src: "https://picsum.photos/id/605/502/334", width: 502, height: 334 },
  { src: "https://picsum.photos/id/31/326/491", width: 326, height: 491 },
  { src: "https://picsum.photos/id/874/300/300", width: 300, height: 300 },
  { src: "https://picsum.photos/id/24/485/180", width: 485, height: 180 },
  { src: "https://picsum.photos/id/859/382/382", width: 382, height: 382 },
  { src: "https://picsum.photos/id/855/500/333", width: 500, height: 333 },
  { src: "https://picsum.photos/id/244/428/284", width: 428, height: 284 },
  { src: "https://picsum.photos/id/156/217/326", width: 217, height: 326 },
  { src: "https://picsum.photos/id/273/420/306", width: 420, height: 306 },
  { src: "https://picsum.photos/id/23/388/489", width: 388, height: 489 },
]

// Calculate aspect ratios
const aspectRatios = photos.map((photo) => photo.width / photo.height)

// Get container width
const gallery = document.querySelector(".gallery")
const containerWidth = gallery.offsetWidth || 1060

// Calculate layout geometry
const geometry = justifiedLayout(aspectRatios, {
  containerWidth: containerWidth,
  containerPadding: 0,
  boxSpacing: 8,
  targetRowHeight: 200,
  targetRowHeightTolerance: 0.25,
})

// Set container height
gallery.style.height = geometry.containerHeight + "px"

// Position images
geometry.boxes.forEach((box, index) => {
  const img = document.createElement("img")
  img.src = photos[index].src
  img.alt = `Photo ${index + 1}`
  img.style.top = box.top + "px"
  img.style.left = box.left + "px"
  img.style.width = box.width + "px"
  img.style.height = box.height + "px"
  gallery.appendChild(img)
})

// Handle window resize
let resizeTimeout
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    location.reload()
  }, 250)
})
```
