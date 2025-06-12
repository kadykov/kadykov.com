import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin';
import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css';

let parsedDataSource = null;
const dataSourceElement = document.getElementById('photoswipe-data');

if (dataSourceElement) {
  try {
    const jsonData = JSON.parse(dataSourceElement.textContent);
    if (Array.isArray(jsonData) && jsonData.length > 0) {
      parsedDataSource = jsonData;
    }
  } catch (e) {
    console.error("Error parsing PhotoSwipe data source:", e);
    parsedDataSource = null;
  }
}

let lightbox = null;

if (parsedDataSource && parsedDataSource.length > 0) {
  lightbox = new PhotoSwipeLightbox({
    dataSource: parsedDataSource,
    bgOpacity: 1,
    pswpModule: () => import("photoswipe"),
  });

  new PhotoSwipeDynamicCaption(lightbox, {
    type: 'auto',
    captionContent: (slide) => {
      const data = slide.data;
      if (!data) {
        return '';
      }

      const title = data.title;
      const description = data.description;
      const date = data.dateTaken;
      const tags = data.tags || [];

      let captionHTML = '<div class="text-gray-300 pswp-caption-content-wrapper">';
      if (title) {
        captionHTML += `<div class="text-heading-4 mb-1">${title}</div>`;
      }
      if (description) {
        captionHTML += `<div class="text-body-standard-serif mt-1 mb-2">${description}</div>`;
      }
      let metaHTML = '';
      if (date) {
        const datePart = typeof date === 'string' ? date.substring(0, 10) : '';
        if (datePart) {
          metaHTML += `<a href="/photos/dates/${datePart}/1" class="btn btn-xs btn-outline text-gray-300 border-gray-500 hover:bg-gray-700 hover:border-gray-400 hover:text-gray-100 text-meta">${datePart}</a>`;
        }
      }
      if (tags.length > 0) {
        metaHTML += tags.map(tag => {
          const trimmedTag = typeof tag === 'string' ? tag.trim() : '';
          if (!trimmedTag) return '';
          return `<a href="/photos/tags/${trimmedTag}/1" class="btn btn-xs btn-outline text-gray-300 border-gray-500 hover:bg-gray-700 hover:border-gray-400 hover:text-gray-100 text-meta">${trimmedTag}</a>`;
        }).join('');
      }
      if (metaHTML) {
        captionHTML += `<div class="mt-2 flex flex-wrap gap-2 items-center">${metaHTML}</div>`;
      }
      captionHTML += '</div>';
      if (!title && !description && !date && tags.length === 0) {
        return '';
      }
      return captionHTML;
    }
  });

  lightbox.on("uiRegister", function () {
    if (!lightbox.pswp) {
      // This can happen and usually resolves.
      // console.warn('PhotoSwipe: pswp instance not immediately available in uiRegister.');
    }

    if (lightbox.pswp && lightbox.pswp.ui) {
      lightbox.pswp.ui.registerElement({
        name: "download-button",
        order: 8,
        isButton: true,
        tagName: "a",
        html: {
          isCustomSVG: true,
          inner:
            '<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
          outlineID: "pswp__icn-download",
        },
        onInit: (el, pswp) => {
          el.setAttribute("download", "")
          el.setAttribute("target", "_blank")
          el.setAttribute("rel", "noopener")
          const updateDownloadLink = () => {
            if (pswp.currSlide && pswp.currSlide.data) {
              if (pswp.currSlide.data.downloadUrl) {
                el.href = pswp.currSlide.data.downloadUrl;
              } else if (pswp.currSlide.data.src) {
                el.href = pswp.currSlide.data.src;
              }
            }
          };
          pswp.on("change", updateDownloadLink);
          updateDownloadLink();
        },
      });
    } else if (lightbox.pswp) {
      // UI might not be ready if pswp just got initialized.
    }

    if (lightbox.pswp) {
      lightbox.pswp.on('change', () => {
        if (typeof lightbox.pswp.currIndex !== 'undefined') {
          const currentPhotoData = lightbox.pswp.currSlide.data;
          if (currentPhotoData && currentPhotoData.slug) {
            const newHash = '#' + currentPhotoData.slug;
            if (window.location.hash !== newHash) {
              history.replaceState(null, '', newHash);
            }
          } else {
            console.warn('PhotoSwipe: currentPhotoData.slug is missing for hash update.', currentPhotoData);
          }
        } else {
          // console.warn('PhotoSwipe: lightbox.pswp.currIndex not available in pswp:change for hash update.');
        }
      });

      lightbox.pswp.on('close', () => {
        const newUrl = window.location.pathname + window.location.search;
        if (window.location.hash) {
          history.replaceState(null, '', newUrl);
        }
      });
    } else {
      // console.warn('PhotoSwipe: pswp instance not available in uiRegister to bind change/close events.');
    }
  });

  const galleryElement = document.getElementById('gallery');
  if (galleryElement) {
    galleryElement.addEventListener('click', (e) => {
      const clickedLink = e.target.closest('a.gallery-item');
      if (!clickedLink) {
        return;
      }
      e.preventDefault();

      const clickedIndex = parseInt(clickedLink.dataset.pswpIndex, 10);
      if (!isNaN(clickedIndex)) {
        lightbox.loadAndOpen(clickedIndex);
      } else {
        console.warn('PhotoSwipe: Could not find pswpIndex on clicked gallery item.');
      }
    });
  }

  lightbox.init();

} else {
  console.warn("PhotoSwipe: No parsedDataSource available or it's empty. Lightbox not initialized.");
}

if (lightbox && parsedDataSource && parsedDataSource.length > 0) {
  const openPhotoBySlug = (slugToOpen, pswpInstance) => {
    if (!slugToOpen || !pswpInstance) return;
    const corePswp = pswpInstance.pswp || pswpInstance;
    const photoIndex = parsedDataSource.findIndex(p => p.slug === slugToOpen);
    if (photoIndex !== -1) {
      if (corePswp.goTo) {
        corePswp.goTo(photoIndex);
      } else {
        // console.warn('PhotoSwipe: corePswp.goTo is not a function in openPhotoBySlug');
      }
    } else {
      // console.warn(`PhotoSwipe: Slug "${slugToOpen}" from hash not found in dataSource (openPhotoBySlug).`);
    }
  };

  const initialHash = window.location.hash.substring(1);
  if (initialHash) {
    const targetElementIndex = parsedDataSource.findIndex(p => p.slug === initialHash);
    if (targetElementIndex !== -1) {
      setTimeout(() => {
         if (lightbox && !lightbox.pswp) {
            lightbox.loadAndOpen(targetElementIndex);
         } else if (lightbox && lightbox.pswp && lightbox.pswp.currIndex !== targetElementIndex) {
            lightbox.pswp.goTo(targetElementIndex);
         }
      }, 150);
    }
  }

  window.addEventListener('hashchange', () => {
    const newSlug = window.location.hash.substring(1);
    if (lightbox.pswp && lightbox.pswp.isOpen) {
      const currentPswpSlug = lightbox.pswp.currSlide && lightbox.pswp.currSlide.data ? lightbox.pswp.currSlide.data.slug : null;
      if (newSlug && newSlug !== currentPswpSlug) {
        openPhotoBySlug(newSlug, lightbox.pswp);
      }
    } else if (newSlug) {
      const targetElementIndex = parsedDataSource.findIndex(p => p.slug === newSlug);
      if (targetElementIndex !== -1) {
        lightbox.loadAndOpen(targetElementIndex);
      }
    }
  }, false);
}
