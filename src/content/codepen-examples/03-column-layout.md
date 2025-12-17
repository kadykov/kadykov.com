# Column Layout Gallery

## Description

A CSS multi-column photo gallery that preserves original aspect ratios without cropping. Creates strong vertical leading lines with minimal wasted space. Taller portrait photos naturally occupy more visual weight than landscapes, making this layout particularly suitable for portrait-focused collections. The default top-to-bottom fill order may require JavaScript adjustment for chronological browsing.

**From the blog post:** [Designing a Photo Gallery that Respects Photographs](https://www.kadykov.com/blog/designing-a-photo-gallery-layout/)

## Keywords

photo-gallery, css-columns, masonry, vertical-rhythm, portrait-bias

## HTML

```html
<div class="gallery">
  <img src="https://picsum.photos/id/947/500/333" alt="Landscape photo 1" />
  <img src="https://picsum.photos/id/613/334/502" alt="Portrait photo 1" />
  <img src="https://picsum.photos/id/882/489/326" alt="Landscape photo 2" />
  <img src="https://picsum.photos/id/263/342/500" alt="Portrait photo 2" />
  <img src="https://picsum.photos/id/685/300/200" alt="Landscape photo 3" />
  <img src="https://picsum.photos/id/234/408/408" alt="Square photo 1" />
  <img src="https://picsum.photos/id/424/408/306" alt="Landscape photo 4" />
  <img src="https://picsum.photos/id/67/284/428" alt="Portrait photo 3" />
  <img src="https://picsum.photos/id/230/300/300" alt="Square photo 2" />
  <img src="https://picsum.photos/id/591/354/472" alt="Portrait photo 4" />
  <img src="https://picsum.photos/id/79/400/602" alt="Portrait photo 5" />
  <img src="https://picsum.photos/id/256/500/174" alt="Panorama photo 1" />
  <img src="https://picsum.photos/id/349/326/217" alt="Landscape photo 5" />
  <img src="https://picsum.photos/id/35/275/362" alt="Portrait photo 6" />
  <img src="https://picsum.photos/id/27/326/183" alt="Landscape photo 6" />
  <img src="https://picsum.photos/id/605/502/334" alt="Landscape photo 7" />
  <img src="https://picsum.photos/id/31/326/491" alt="Portrait photo 7" />
  <img src="https://picsum.photos/id/874/300/300" alt="Square photo 3" />
  <img src="https://picsum.photos/id/24/485/180" alt="Panorama photo 2" />
  <img src="https://picsum.photos/id/859/382/382" alt="Square photo 4" />
  <img src="https://picsum.photos/id/855/500/333" alt="Landscape photo 8" />
  <img src="https://picsum.photos/id/244/428/284" alt="Landscape photo 9" />
  <img src="https://picsum.photos/id/156/217/326" alt="Portrait photo 8" />
  <img src="https://picsum.photos/id/273/420/306" alt="Landscape photo 10" />
  <img src="https://picsum.photos/id/23/388/489" alt="Portrait photo 9" />
</div>
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

/* CSS columns layout */
.gallery {
  column-width: 250px;
  column-gap: 1rem;
}

.gallery img {
  width: 100%;
  height: auto;
  margin-bottom: 1rem;
  display: block;
  border: 1px solid #ddd;
  /* Prevent images from breaking across columns */
  break-inside: avoid;
}
```
