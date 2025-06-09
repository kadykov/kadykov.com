import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin';
import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css';

const lightbox = new PhotoSwipeLightbox({
  gallery: "#gallery",
  children: "a",
  bgOpacity: 1, // Keep background fully opaque as caption will have its own transparency
  pswpModule: () => import("photoswipe"),
})

lightbox.on("uiRegister", function () {
  lightbox.pswp.ui.registerElement({
    name: "download-button",
    order: 8,
    isButton: true,
    tagName: "a",

    // SVG with outline
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
        // console.log("change") // Keep console.log for debugging if needed
        el.href = pswp.currSlide.data.src
      })
    },
  })
})

const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
  type: 'auto', // Or 'below', 'aside'
  captionContent: (slide) => {
    const el = slide.data.element; // This is the <a> tag
    if (!el) {
      return '';
    }
    const title = el.dataset.title;
    const description = el.dataset.description;
    const date = el.dataset.date;
    const tagsString = el.dataset.tags;
    const tags = tagsString ? tagsString.split(',') : [];

    // Main wrapper for all caption content, applying base text color
    // The plugin itself adds a .pswp__dynamic-caption class with its own background.
    // We apply text-gray-300 for overall text color.
    let captionHTML = '<div class="text-gray-300 pswp-caption-content-wrapper">';

    if (title) {
      // text-heading-4 already defines font, size, weight.
      // The parent's text-gray-300 should apply unless text-heading-4 has its own color.
      captionHTML += `<div class="text-heading-4 mb-1">${title}</div>`;
    }
    if (description) {
      // text-body-standard-serif also defines its characteristics.
      captionHTML += `<div class="text-body-standard-serif mt-1 mb-2">${description}</div>`;
    }

    let metaHTML = '';
    if (date) {
      const datePart = date.substring(0, 10); // Extract YYYY-MM-DD
      // Adjusted button classes for better appearance on dark caption background
      // text-meta is for font style, explicit color classes for this context.
      metaHTML += `<a href="/photos/dates/${datePart}/1" class="btn btn-xs btn-outline text-gray-300 border-gray-500 hover:bg-gray-700 hover:border-gray-400 hover:text-gray-100 text-meta">${datePart}</a>`;
    }
    if (tags.length > 0) {
      metaHTML += tags.map(tag => {
        const trimmedTag = tag.trim();
        if (!trimmedTag) return ''; // Avoid creating empty buttons if there's an empty string after split
        return `<a href="/photos/tags/${trimmedTag}/1" class="btn btn-xs btn-outline text-gray-300 border-gray-500 hover:bg-gray-700 hover:border-gray-400 hover:text-gray-100 text-meta">${trimmedTag}</a>`;
      }).join('');
    }

    if (metaHTML) {
      // Added flex-wrap and gap for better layout of multiple buttons
      captionHTML += `<div class="mt-2 flex flex-wrap gap-2 items-center">${metaHTML}</div>`;
    }

    captionHTML += '</div>'; // Close the main wrapper div

    // Only return if there's actual content to avoid empty caption box
    if (!title && !description && !date && tags.length === 0) {
      return '';
    }

    return captionHTML;
  }
});

lightbox.init();
