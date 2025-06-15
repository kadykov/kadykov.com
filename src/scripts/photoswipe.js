import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"
import PhotoSwipeDynamicCaption from 'photoswipe-dynamic-caption-plugin';
import 'photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css';

// SVG Icons for Share Feature
// Share Icon (generic) - Placeholder, replace with a proper one if available
const svgIconShare = '<svg class="pswp__icn" viewBox="0 0 32 32" fill="currentColor"><g transform="translate(4,4)"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></g></svg>';
// Email, Facebook, LinkedIn, Twitter/X, WhatsApp SVGs adapted from astro-social-share by Adam McKerlie (MIT License)
const svgIconEmail = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20"><title>Email</title><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>';
const svgIconFacebook = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20"><title>Facebook</title><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
const svgIconLinkedIn = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
const svgIconTwitter = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20"><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>';
const svgIconWhatsApp = '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="20" height="20"><title>WhatsApp</title><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
// Telegram SVG from Chikin Variety Glyph Icons (CC-BY)
const svgIconTelegram = '<svg viewBox="18.5 58.5 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill-rule="evenodd" clip-rule="evenodd" d="M76.33 132.14L62.5 143.73L58.59 144.26L49.84 114.11L19.06 104L113.82 67.8799L118.29 67.9799L103.36 149.19L76.33 132.14ZM100.03 83.1399L56.61 109.17L61.61 130.5L62.98 130.19L68.2 113.73L102.9 83.4799L100.03 83.1399Z"/></svg>';
// Copy Icon (generic link icon) - Placeholder, replace with a proper one if available
const svgIconCopy = '<svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';


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
        order: 9, // Changed from 8 to 9
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
          el.setAttribute("title", "Download image");

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

      // Share Button and Dropdown
      lightbox.pswp.ui.registerElement({
        name: 'pswp-share-container', // Changed name to reflect it's a container
        order: 8, // Changed from 9 to 8, to appear before download
        isButton: false, // It's a container, not a button itself
        tagName: 'div',  // 'el' will be a div
        // html: svgIconShare, // Removed initial HTML, will be built in onInit
        onInit: (el, pswp) => {
          // 'el' is now a div container. We will build the <details> dropdown inside it.
          // Clear any default content PhotoSwipe might have put in 'el' (though unlikely for a div with no html)
          el.innerHTML = '';
          el.style.position = 'relative'; // For dropdown positioning within the toolbar flow

          const detailsElement = document.createElement('details');
          detailsElement.className = 'dropdown dropdown-center';

          const summaryElement = document.createElement('summary');
          summaryElement.className = 'pswp__button text-white list-none'; // Added list-none
          summaryElement.innerHTML = svgIconShare;
          summaryElement.setAttribute('title', 'Share');
          summaryElement.setAttribute('aria-label', 'Share');

          summaryElement.addEventListener('click', function(event) {
            event.stopPropagation();
          });

          detailsElement.appendChild(summaryElement);

          const menuUl = document.createElement('ul');
          // Reverted to theme-aware background and ensured text visibility
          menuUl.className = 'dropdown-content menu p-2 shadow bg-base-200 text-base-content rounded-box w-60 z-[10000]';

          detailsElement.appendChild(menuUl);
          el.appendChild(detailsElement); // This is the correct single append

          detailsElement.addEventListener('toggle', function() {
            const currentUlElement = detailsElement.querySelector('ul.dropdown-content.menu');

            if (!currentUlElement) {
              console.error('PhotoSwipe Share: CRITICAL - Could not find ul.dropdown-content.menu inside detailsElement on toggle.');
              // console.log('PhotoSwipe Share: detailsElement innerHTML:', detailsElement.innerHTML); // Retain for critical debug if needed
              return;
            }

            // This event fires after the 'open' attribute has changed
            if (detailsElement.open) {
              updateShareLinks();
            }
          });

          // Append the whole details structure to the container
          el.appendChild(detailsElement);

          const shareOptions = [
            { name: 'Copy Link', icon: svgIconCopy, action: 'copy' },
            { name: 'Email', icon: svgIconEmail, service: 'email' },
            { name: 'Facebook', icon: svgIconFacebook, service: 'facebook' },
            { name: 'Twitter/X', icon: svgIconTwitter, service: 'twitter' },
            { name: 'LinkedIn', icon: svgIconLinkedIn, service: 'linkedin' },
            { name: 'Telegram', icon: svgIconTelegram, service: 'telegram' },
            { name: 'WhatsApp', icon: svgIconWhatsApp, service: 'whatsapp' },
          ];

          const activeShareLinks = []; // To store elements for updating hrefs

          shareOptions.forEach(opt => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.innerHTML = `${opt.icon} <span class="ml-2">${opt.name}</span>`;
            link.classList.add('flex', 'items-center');

            if (opt.action === 'copy') {
              link.href = '#';
              link.addEventListener('click', (e) => {
                e.preventDefault();
                const urlToCopy = pswp.currSlide && pswp.currSlide.data && pswp.currSlide.data.shareUrl
                                  ? pswp.currSlide.data.shareUrl
                                  : window.location.href;
                navigator.clipboard.writeText(urlToCopy).then(() => {
                  // Optional: Show a temporary "Copied!" message
                  const originalText = link.querySelector('span').textContent;
                  link.querySelector('span').textContent = 'Copied!';
                  setTimeout(() => {
                    link.querySelector('span').textContent = originalText;
                    if (detailsElement.open) { // Close dropdown after copy
                      detailsElement.open = false;
                    }
                  }, 1500);
                }).catch(err => console.error('PhotoSwipe Share: Failed to copy URL: ', err));
              });
            } else {
              link.setAttribute('target', '_blank');
              link.setAttribute('rel', 'noopener noreferrer');
              activeShareLinks.push({ service: opt.service, element: link });
              // Close dropdown when an external share link is clicked
              link.addEventListener('click', () => {
                if (detailsElement.open) {
                  detailsElement.open = false;
                }
              });
            }
            listItem.appendChild(link);
            menuUl.appendChild(listItem);
          });

          const updateShareLinks = () => {
            if (!pswp.currSlide || !pswp.currSlide.data) {
              console.warn('PhotoSwipe Share: No current slide data to update share links.');
              activeShareLinks.forEach(item => {
                item.element.href = '#';
              });
              // For the copy button, ensure it still tries to copy current window.location.href if slide data is missing
              return;
            }

            const currentPhotoData = pswp.currSlide.data;
            const shareUrl = currentPhotoData.shareUrl || window.location.href;
            const title = currentPhotoData.title || document.title;

            activeShareLinks.forEach(item => {
              let url;
              switch (item.service) {
                case 'email':
                  url = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`;
                  break;
                case 'facebook':
                  url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
                  break;
                case 'twitter':
                  url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
                  break;
                case 'linkedin':
                  url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`;
                  break;
                case 'telegram':
                  url = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`;
                  break;
                case 'whatsapp':
                  url = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + shareUrl)}`;
                  break;
              }
              if (url) {
                item.element.href = url;
              }
            });
          };

          // Update links when the slide changes and initially
          pswp.on('change', updateShareLinks);
          updateShareLinks(); // Initial call
        }
      });

    } else if (!lightbox.pswp) {
      // UI might not be ready if pswp just got initialized.
    }

    if (lightbox.pswp) {
      lightbox.pswp.on('change', () => {
        if (typeof lightbox.pswp.currIndex !== 'undefined' && lightbox.pswp.currSlide) {
          const currentPhotoData = lightbox.pswp.currSlide.data;
          // Corrected if condition below
          if (currentPhotoData && typeof currentPhotoData.slug === 'string' && currentPhotoData.slug.length > 0) {
            const newHash = '#' + currentPhotoData.slug;
            if (window.location.hash !== newHash) {
              // Update hash only if it's different, to avoid redundant history entries
              history.replaceState(null, '', newHash);
            }
          } else {
            // If slug is missing or empty, clear the hash
            // This prevents '#undefined' or '#' in the URL if a slug is bad
            // and handles the case where a photo legitimately has no slug.
            const newUrl = window.location.pathname + window.location.search;
            if (window.location.hash) { // Only clear if there's a hash
              history.replaceState(null, '', newUrl);
            }
            if (currentPhotoData && (!currentPhotoData.slug || currentPhotoData.slug.length === 0)) {
              // Keep the warning if slug is explicitly empty, but not if data itself is missing
              console.warn('PhotoSwipe: currentPhotoData.slug is empty, clearing hash.', currentPhotoData);
            }
          }
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
