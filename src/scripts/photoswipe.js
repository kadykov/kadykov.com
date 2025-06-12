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
      parsedDataSource = jsonData; // This will be our lookup table for slugs and other metadata
    }
  } catch (e) {
    console.error("Error parsing PhotoSwipe data source:", e);
    parsedDataSource = null;
  }
}

const lightbox = new PhotoSwipeLightbox({
  gallery: "#gallery", // PhotoSwipe will build its slides from <a> tags within #gallery
  children: "a",      // These <a> tags should have data-pswp-src, data-pswp-width, data-pswp-height, data-pswp-srcset
                       // And also data-title, data-description, data-date, data-tags, data-slug for our use
  bgOpacity: 1, // Keep background fully opaque as caption will have its own transparency
  pswpModule: () => import("photoswipe"),
})

lightbox.on("uiRegister", function () {
  // Download button registration
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
      pswp.on("change", () => {
        el.href = pswp.currSlide.data.src
      })
    },
  });

  // Bind pswp events once pswp instance is available (uiRegister is a good place)
  if (lightbox.pswp) {
    console.log('[PhotoSwipe Debug] uiRegister: pswp instance found. Binding "change" event.');
    lightbox.pswp.on('change', () => { // Changed from 'afterChange' to 'change'
      console.log('[PhotoSwipe Debug] pswp:change event triggered.');
      if (lightbox.pswp) {
        console.log('[PhotoSwipe Debug] lightbox.pswp.currIndex:', lightbox.pswp.currIndex);
      }
      console.log('[PhotoSwipe Debug] parsedDataSource:', parsedDataSource ? `Array with ${parsedDataSource.length} items` : parsedDataSource);

      if (typeof lightbox.pswp.currIndex !== 'undefined') {
        const currentIndex = lightbox.pswp.currIndex;
        console.log(`[PhotoSwipe Debug] Current index: ${currentIndex}`);
        if (parsedDataSource && parsedDataSource[currentIndex]) {
          const currentPhotoData = parsedDataSource[currentIndex];
          console.log('[PhotoSwipe Debug] currentPhotoData:', currentPhotoData);

          if (currentPhotoData && currentPhotoData.slug) {
            const newHash = '#' + currentPhotoData.slug;
            console.log(`[PhotoSwipe Debug] New hash to set: ${newHash}`);
            console.log(`[PhotoSwipe Debug] Current window.location.hash: ${window.location.hash}`);
            if (window.location.hash !== newHash) {
              history.replaceState(null, '', newHash);
              console.log(`[PhotoSwipe Debug] Hash updated to: ${newHash}`);
            } else {
              console.log('[PhotoSwipe Debug] Hash already matches, no update needed.');
            }
          } else {
            console.warn('[PhotoSwipe Debug] currentPhotoData.slug is missing or empty.', currentPhotoData);
          }
        } else {
          console.warn(`[PhotoSwipe Debug] parsedDataSource is null, empty, or index ${currentIndex} is out of bounds.`);
        }
      } else {
        console.warn('[PhotoSwipe Debug] lightbox.pswp.currIndex is not available in pswp:change.');
      }
    }); // End of pswp.on('change')

    // Listen for the close event to clear the hash
    lightbox.pswp.on('close', () => {
      console.log('[PhotoSwipe Debug] pswp:close event triggered.');
      // Clear the hash by replacing the state with the current path and search params only
      const newUrl = window.location.pathname + window.location.search;
      if (window.location.hash) { // Only update if there's a hash
        history.replaceState(null, '', newUrl);
        console.log(`[PhotoSwipe Debug] Hash cleared. URL set to: ${newUrl}`);
      } else {
        console.log('[PhotoSwipe Debug] No hash to clear.');
      }
    }); // End of pswp.on('close')

  } else {
    console.error('[PhotoSwipe Debug] uiRegister: pswp instance NOT found. Cannot bind "change" or "close" events.');
  }
}); // End of lightbox.on('uiRegister')

new PhotoSwipeDynamicCaption(lightbox, {
  type: 'auto', // Or 'below', 'aside'
  captionContent: (slide) => {
    const el = slide.data.element;
    if (!el) {
      return '';
    }
    const title = el.dataset.title;
    const description = el.dataset.description;
    const date = el.dataset.date;
    const tagsString = el.dataset.tags;
    const tags = tagsString ? tagsString.split(',') : [];
    let captionHTML = '<div class="text-gray-300 pswp-caption-content-wrapper">';
    if (title) {
      captionHTML += `<div class="text-heading-4 mb-1">${title}</div>`;
    }
    if (description) {
      captionHTML += `<div class="text-body-standard-serif mt-1 mb-2">${description}</div>`;
    }
    let metaHTML = '';
    if (date) {
      const datePart = date.substring(0, 10);
      metaHTML += `<a href="/photos/dates/${datePart}/1" class="btn btn-xs btn-outline text-gray-300 border-gray-500 hover:bg-gray-700 hover:border-gray-400 hover:text-gray-100 text-meta">${datePart}</a>`;
    }
    if (tags.length > 0) {
      metaHTML += tags.map(tag => {
        const trimmedTag = tag.trim();
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

lightbox.init();

// --- Hash Handling ---
if (parsedDataSource) {
  const openPhotoBySlug = (slugToOpen, pswpInstance) => {
    if (!slugToOpen || !pswpInstance) return;
    const photoIndex = parsedDataSource.findIndex(p => p.slug === slugToOpen);
    if (photoIndex !== -1) {
      pswpInstance.goTo(photoIndex);
    } else {
      console.warn(`PhotoSwipe: Slug "${slugToOpen}" from hash not found in dataSource.`);
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

  // The 'afterChange' listener is now inside lightbox.on('uiRegister', ...)

  window.addEventListener('hashchange', () => {
    console.log('[PhotoSwipe Debug] hashchange event triggered. New hash:', window.location.hash);
    const newSlug = window.location.hash.substring(1);
    if (lightbox.pswp && lightbox.pswp.isOpen) {
      const currentPswpSlug = (parsedDataSource[lightbox.pswp.currIndex]) ? parsedDataSource[lightbox.pswp.currIndex].slug : null;
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
