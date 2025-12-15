# Flexbox Justified Gallery

## Description

A CSS-only photo gallery using Flexbox with wrapping to create justified-row-like behavior. All photos in a row share the same height while expanding to different widths based on their aspect ratios. This approach preserves compositions without JavaScript, though row edges won't align perfectly — some rows may not fill the full width, creating irregular gaps at the end of each line.

**From the blog post:** [Designing a Photo Gallery that Respects Photographs](https://www.kadykov.com/blog/designing-a-photo-gallery-layout/)

## Keywords

photo-gallery, flexbox, justified-rows, css-only, responsive-layout

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

The version with the flex-grow values calculated based on image aspect ratios:

```
<div class="gallery">
  <img style="flex-grow: 1.5;" src="https://picsum.photos/id/947/500/333" alt="Landscape photo 1" />
  <img style="flex-grow: 0.67;" src="https://picsum.photos/id/613/334/502" alt="Portrait photo 1" />
  <img style="flex-grow: 1.5;" src="https://picsum.photos/id/882/489/326" alt="Landscape photo 2" />
  <img style="flex-grow: 0.68;" src="https://picsum.photos/id/263/342/500" alt="Portrait photo 2" />
  <img style="flex-grow: 1.5;" src="https://picsum.photos/id/685/300/200" alt="Landscape photo 3" />
  <img style="flex-grow: 1;" src="https://picsum.photos/id/234/408/408" alt="Square photo 1" />
  <img style="flex-grow: 1.33;" src="https://picsum.photos/id/424/408/306" alt="Landscape photo 4" />
  <img style="flex-grow: 0.66;" src="https://picsum.photos/id/67/284/428" alt="Portrait photo 3" />
  <img style="flex-grow: 1;" src="https://picsum.photos/id/230/300/300" alt="Square photo 2" />
  <img style="flex-grow: 0.75;" src="https://picsum.photos/id/591/354/472" alt="Portrait photo 4" />
  <img style="flex-grow: 0.66;" src="https://picsum.photos/id/79/400/602" alt="Portrait photo 5" />
  <img style="flex-grow: 2.87;" src="https://picsum.photos/id/256/500/174" alt="Panorama photo 1" />
  <img style="flex-grow: 1.5;" src="https://picsum.photos/id/349/326/217" alt="Landscape photo 5" />
  <img style="flex-grow: 0.78;" src="https://picsum.photos/id/35/275/362" alt="Portrait photo 6" />
  <img style="flex-grow: 1.78;" src="https://picsum.photos/id/27/326/183" alt="Landscape photo 6" />
  <img style="flex-grow: 1.5;" src="https://picsum.photos/id/605/502/334" alt="Landscape photo 7" />
  <img style="flex-grow: 0.66;" src="https://picsum.photos/id/31/326/491" alt="Portrait photo 7" />
  <img style="flex-grow: 1;" src="https://picsum.photos/id/874/300/300" alt="Square photo 3" />
  <img style="flex-grow: 2.69;" src="https://picsum.photos/id/24/485/180" alt="Panorama photo 2" />
  <img style="flex-grow: 1;" src="https://picsum.photos/id/859/382/382" alt="Square photo 4" />
  <img style="flex-grow: 1.5;" src="https://picsum.photos/id/855/500/333" alt="Landscape photo 8" />
  <img style="flex-grow: 1.5;" src="https://picsum.photos/id/244/428/284" alt="Landscape photo 9" />
  <img style="flex-grow: 0.66;" src="https://picsum.photos/id/156/217/326" alt="Portrait photo 8" />
  <img style="flex-grow: 1.37;" src="https://picsum.photos/id/273/420/306" alt="Landscape photo 10" />
  <img style="flex-grow: 0.79;" src="https://picsum.photos/id/23/388/489" alt="Portrait photo 9" />
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
}

/* Flexbox wrap layout simulating justified rows */
.gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.gallery img {
  /* All images share the same height */
  height: 200px;
  /* Width expands based on aspect ratio */
  flex-grow: 1;
  /*   object-fit: contain; */
  object-fit: cover;
}

/* Adjust row height for smaller screens */
@media (max-width: 768px) {
  .gallery img {
    height: 150px;
  }
}

@media (max-width: 480px) {
  .gallery img {
    height: 120px;
  }
}
```
