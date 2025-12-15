# Cell-Span Grid Gallery

## Description

A cell-based CSS Grid layout that gives landscape and portrait photos equal visual weight without cropping. Photos span multiple grid cells based on orientation: landscapes 2×3, squares 2×2, portraits 3×2. This approach preserves full compositions and treats all orientations fairly, at the cost of some empty cells. The result feels organic, like photos pinned to a wall, rather than mechanically tiled.

**From the blog post:** [Designing a Photo Gallery that Respects Photographs](https://www.kadykov.com/blog/designing-a-photo-gallery-layout/)

## Keywords

photo-gallery, css-grid, cell-span, equal-weight, no-cropping

## HTML

```html
<div class="gallery">
  <img
    class="landscape"
    src="https://picsum.photos/id/947/500/333"
    alt="Landscape photo 1"
  />
  <img
    class="portrait"
    src="https://picsum.photos/id/613/334/502"
    alt="Portrait photo 1"
  />
  <img
    class="landscape"
    src="https://picsum.photos/id/882/489/326"
    alt="Landscape photo 2"
  />
  <img
    class="portrait"
    src="https://picsum.photos/id/263/342/500"
    alt="Portrait photo 2"
  />
  <img
    class="landscape"
    src="https://picsum.photos/id/685/300/200"
    alt="Landscape photo 3"
  />
  <img
    class="square"
    src="https://picsum.photos/id/234/408/408"
    alt="Square photo 1"
  />
  <img
    class="landscape"
    src="https://picsum.photos/id/424/408/306"
    alt="Landscape photo 4"
  />
  <img
    class="portrait"
    src="https://picsum.photos/id/67/284/428"
    alt="Portrait photo 3"
  />
  <img
    class="square"
    src="https://picsum.photos/id/230/300/300"
    alt="Square photo 2"
  />
  <img
    class="portrait"
    src="https://picsum.photos/id/591/354/472"
    alt="Portrait photo 4"
  />
  <img
    class="portrait"
    src="https://picsum.photos/id/79/400/602"
    alt="Portrait photo 5"
  />
  <img
    class="panorama"
    src="https://picsum.photos/id/256/500/174"
    alt="Panorama photo 1"
  />
  <img
    class="landscape"
    src="https://picsum.photos/id/349/326/217"
    alt="Landscape photo 5"
  />
  <img
    class="portrait"
    src="https://picsum.photos/id/35/275/362"
    alt="Portrait photo 6"
  />
  <img
    class="landscape"
    src="https://picsum.photos/id/27/326/183"
    alt="Landscape photo 6"
  />
  <img
    class="landscape"
    src="https://picsum.photos/id/605/502/334"
    alt="Landscape photo 7"
  />
  <img
    class="portrait"
    src="https://picsum.photos/id/31/326/491"
    alt="Portrait photo 7"
  />
  <img
    class="square"
    src="https://picsum.photos/id/874/300/300"
    alt="Square photo 3"
  />
  <img
    class="panorama"
    src="https://picsum.photos/id/24/485/180"
    alt="Panorama photo 2"
  />
  <img
    class="square"
    src="https://picsum.photos/id/859/382/382"
    alt="Square photo 4"
  />
  <img
    class="landscape"
    src="https://picsum.photos/id/855/500/333"
    alt="Landscape photo 8"
  />
  <img
    class="landscape"
    src="https://picsum.photos/id/244/428/284"
    alt="Landscape photo 9"
  />
  <img
    class="portrait"
    src="https://picsum.photos/id/156/217/326"
    alt="Portrait photo 8"
  />
  <img
    class="landscape"
    src="https://picsum.photos/id/273/420/306"
    alt="Landscape photo 10"
  />
  <img
    class="portrait"
    src="https://picsum.photos/id/23/388/489"
    alt="Portrait photo 9"
  />
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

/* Cell-span grid layout */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5rem, 1fr));
  gap: 1.5rem;
}

.gallery img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border: 1px solid #ddd;
  background: #fff;
}

/* Orientation-based cell spanning */
.landscape {
  grid-row: span 2;
  grid-column: span 3;
}

.square {
  grid-row: span 2;
  grid-column: span 2;
}

.portrait {
  grid-row: span 3;
  grid-column: span 2;
}

.panorama {
  grid-row: span 1;
  grid-column: span 4;
}

/* Adjust for smaller screens to ensure at least 3 columns fit */
@media (max-width: 768px) {
  .gallery {
    grid-template-columns: repeat(auto-fill, minmax(4rem, 1fr));
    gap: 1rem;
  }
}
```
