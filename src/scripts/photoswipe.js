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

let lightbox = null;

if (parsedDataSource && parsedDataSource.length > 0) {
  lightbox = new PhotoSwipeLightbox({
    dataSource: parsedDataSource, // Use the full dataset from JSON
    // gallery and children are not used when dataSource is provided
    bgOpacity: 1, // Keep background fully opaque as caption will have its own transparency
    pswpModule: () => import("photoswipe"),
  });

  // Initialize PhotoSwipeDynamicCaption plugin
  new PhotoSwipeDynamicCaption(lightbox, {
    type: 'auto',
    captionContent: (slide) => {
      // When using dataSource, slide.data is the item from our parsedDataSource
      const data = slide.data;
      if (!data) {
        return '';
      }
      // console.log('[PhotoSwipe Debug] Caption slide.data:', data); // For debugging caption data

      const title = data.title;
      const description = data.description;
      const date = data.dateTaken; // Assuming 'dateTaken' is the field in parsedDataSource
      const tags = data.tags || []; // Assuming 'tags' is an array in parsedDataSource

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
    if (!lightbox.pswp) { // pswp might not be immediately available if uiRegister fires early
      console.error('[PhotoSwipe Debug] uiRegister: pswp instance NOT available yet for button or event binding.');
      // Attempt to defer or re-check, though typically it should be there.
      // For now, we'll proceed assuming it becomes available.
      // A more robust way might be to use 'beforeOpen' or 'afterOpen' for some of these.
    }

    // Download button registration
    // Ensure pswp is available before trying to access its ui property
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
        onInit: (el, pswp) => { // pswp here is the core instance passed by onInit
          el.setAttribute("download", "")
          el.setAttribute("target", "_blank")
          el.setAttribute("rel", "noopener")
          // Ensure pswp.currSlide.data.src is correct with dataSource
          // slide.data.src should be the direct URL from our dataSource
          pswp.on("change", () => {
            if (pswp.currSlide && pswp.currSlide.data) {
              el.href = pswp.currSlide.data.src;
            }
          });
          // Set initial href
          if (pswp.currSlide && pswp.currSlide.data) {
             el.href = pswp.currSlide.data.src;
          }
        },
      });
    } else if (lightbox.pswp) {
        console.warn('[PhotoSwipe Debug] lightbox.pswp.ui not available for download button.');
    }


    // Bind pswp events once pswp instance is available
    // This check for lightbox.pswp is crucial.
    if (lightbox.pswp) {
      // console.log('[PhotoSwipe Debug] uiRegister: pswp instance found. Binding "change" event.');
      lightbox.pswp.on('change', () => {
        // console.log('[PhotoSwipe Debug] pswp:change event triggered.');
        if (lightbox.pswp) {
          // console.log('[PhotoSwipe Debug] lightbox.pswp.currIndex:', lightbox.pswp.currIndex);
        }
        // console.log('[PhotoSwipe Debug] parsedDataSource:', parsedDataSource ? `Array with ${parsedDataSource.length} items` : parsedDataSource);

        if (typeof lightbox.pswp.currIndex !== 'undefined') {
          const currentIndex = lightbox.pswp.currIndex;
          // console.log(`[PhotoSwipe Debug] Current index: ${currentIndex}`);
          // When using dataSource, slide.data is the direct object.
          // parsedDataSource[currentIndex] should be equivalent to lightbox.pswp.currSlide.data
          const currentPhotoData = lightbox.pswp.currSlide.data; // Use data from the current slide instance

          if (currentPhotoData && currentPhotoData.slug) {
            const newHash = '#' + currentPhotoData.slug;
            // console.log(`[PhotoSwipe Debug] New hash to set: ${newHash}`);
            // console.log(`[PhotoSwipe Debug] Current window.location.hash: ${window.location.hash}`);
            if (window.location.hash !== newHash) {
              history.replaceState(null, '', newHash);
              // console.log(`[PhotoSwipe Debug] Hash updated to: ${newHash}`);
            } else {
              // console.log('[PhotoSwipe Debug] Hash already matches, no update needed.');
            }
          } else {
            // console.warn('[PhotoSwipe Debug] currentPhotoData.slug is missing or empty.', currentPhotoData);
          }
        } else {
          // console.warn('[PhotoSwipe Debug] lightbox.pswp.currIndex is not available in pswp:change.');
        }
      });

      // Listen for the close event to clear the hash
      lightbox.pswp.on('close', () => {
        // console.log('[PhotoSwipe Debug] pswp:close event triggered.');
        const newUrl = window.location.pathname + window.location.search;
        if (window.location.hash) {
          history.replaceState(null, '', newUrl);
          // console.log(`[PhotoSwipe Debug] Hash cleared. URL set to: ${newUrl}`);
        } else {
          // console.log('[PhotoSwipe Debug] No hash to clear.');
        }
      });
    } else {
      // This console.error might fire if uiRegister is called before pswp is fully ready when opening.
      // The actual binding of 'change' and 'close' might need to be deferred to 'beforeOpen' or 'afterOpen'
      // if this proves to be an issue consistently.
      // console.error('[PhotoSwipe Debug] uiRegister: pswp instance NOT found. Cannot bind "change" or "close" events yet.');
    }
  }); // End of lightbox.on('uiRegister')

  // Manual click handling for gallery items
  const galleryElement = document.getElementById('gallery');
  if (galleryElement) {
    galleryElement.addEventListener('click', (e) => {
      const clickedLink = e.target.closest('a.gallery-item');
      if (!clickedLink) {
        return;
      }
      e.preventDefault(); // Prevent default link navigation

      const clickedIndex = parseInt(clickedLink.dataset.pswpIndex, 10);
      if (!isNaN(clickedIndex)) {
        // console.log(`[PhotoSwipe Debug] Gallery item clicked. Index: ${clickedIndex}`);
        lightbox.loadAndOpen(clickedIndex); // Open PhotoSwipe at the correct index using the JS dataSource
      } else {
        // console.warn('[PhotoSwipe Debug] Could not find pswpIndex on clicked gallery item.');
      }
    });
  }


  lightbox.init();

} else {
  console.warn("PhotoSwipe: No parsedDataSource available or it's empty. Lightbox not initialized.");
}


// --- Hash Handling ---
// This section should only run if lightbox was initialized
if (lightbox && parsedDataSource && parsedDataSource.length > 0) {
  const openPhotoBySlug = (slugToOpen, pswpInstance) => {
    if (!slugToOpen || !pswpInstance) return;
    // Ensure pswpInstance is the core PhotoSwipe object, not the lightbox wrapper
    const corePswp = pswpInstance.pswp || pswpInstance;

    const photoIndex = parsedDataSource.findIndex(p => p.slug === slugToOpen);
    if (photoIndex !== -1) {
      if (corePswp.goTo) {
        corePswp.goTo(photoIndex);
      } else {
        // console.warn('[PhotoSwipe Debug] corePswp.goTo is not a function in openPhotoBySlug');
      }
    } else {
      // console.warn(`[PhotoSwipe Debug] Slug "${slugToOpen}" from hash not found in dataSource.`);
    }
  };
  const initialHash = window.location.hash.substring(1);
  if (initialHash) {
    const targetElementIndex = parsedDataSource.findIndex(p => p.slug === initialHash);
    if (targetElementIndex !== -1) {
      setTimeout(() => {
         // Check if lightbox is already open (e.g. by a click that happened almost simultaneously)
         if (lightbox && !lightbox.pswp) {
            // console.log(`[PhotoSwipe Debug] Opening lightbox to index ${targetElementIndex} from initial hash.`);
            lightbox.loadAndOpen(targetElementIndex);
         } else if (lightbox && lightbox.pswp && lightbox.pswp.currIndex !== targetElementIndex) {
            // console.log(`[PhotoSwipe Debug] Lightbox already open, navigating to index ${targetElementIndex} from initial hash.`);
            lightbox.pswp.goTo(targetElementIndex);
         }
      }, 150); // Delay to ensure DOM is ready and other scripts might have run
    }
  }
  window.addEventListener('hashchange', () => {
    // console.log('[PhotoSwipe Debug] hashchange event triggered. New hash:', window.location.hash);
    const newSlug = window.location.hash.substring(1);
    if (lightbox.pswp && lightbox.pswp.isOpen) {
      // Use currSlide.data.slug when dataSource is used
      const currentPswpSlug = lightbox.pswp.currSlide && lightbox.pswp.currSlide.data ? lightbox.pswp.currSlide.data.slug : null;
      if (newSlug && newSlug !== currentPswpSlug) {
        // console.log(`[PhotoSwipe Debug] Hash changed to ${newSlug}, lightbox open. Current slug: ${currentPswpSlug}. Opening by slug.`);
        openPhotoBySlug(newSlug, lightbox.pswp);
      }
    } else if (newSlug) {
      // If lightbox is not open but hash changes to a valid slug, open it.
      const targetElementIndex = parsedDataSource.findIndex(p => p.slug === newSlug);
      if (targetElementIndex !== -1) {
        // console.log(`[PhotoSwipe Debug] Hash changed to ${newSlug}, lightbox NOT open. Opening to index ${targetElementIndex}.`);
        lightbox.loadAndOpen(targetElementIndex);
      }
    }
  }, false);
}
// Clean up console logs (commented out for now, will remove in a final pass)
// The console logs related to errors or critical warnings can be kept.
// The verbose debugging logs should be removed.
// Example: [PhotoSwipe Debug] pswp:change event triggered. -> remove
// Example: Error parsing PhotoSwipe data source: -> keep
// Example: [PhotoSwipe Debug] uiRegister: pswp instance NOT found... -> keep if it indicates a real problem
// Example: PhotoSwipe: No parsedDataSource available... -> keep
// The lightbox.on("uiRegister", ...) and new PhotoSwipeDynamicCaption(...) are now inside the if (parsedDataSource) block.
// lightbox.init() is also moved inside that block.

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
