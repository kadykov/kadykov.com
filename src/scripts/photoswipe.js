import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"
import PhotoSwipeDynamicCaption from "photoswipe-dynamic-caption-plugin"
import "photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css"

// Fullscreen API helper
// Supports unprefixed and webkit-prefixed versions
function getFullscreenAPI() {
  let api
  let enterFS
  let exitFS
  let elementFS
  let changeEvent
  let errorEvent

  if (document.documentElement.requestFullscreen) {
    enterFS = "requestFullscreen"
    exitFS = "exitFullscreen"
    elementFS = "fullscreenElement"
    changeEvent = "fullscreenchange"
    errorEvent = "fullscreenerror"
  } else if (document.documentElement.webkitRequestFullscreen) {
    enterFS = "webkitRequestFullscreen"
    exitFS = "webkitExitFullscreen"
    elementFS = "webkitFullscreenElement"
    changeEvent = "webkitfullscreenchange"
    errorEvent = "webkitfullscreenerror"
  }

  if (enterFS) {
    api = {
      request: function (el) {
        if (enterFS === "webkitRequestFullscreen") {
          el[enterFS](Element.ALLOW_KEYBOARD_INPUT)
        } else {
          el[enterFS]()
        }
      },

      exit: function () {
        return document[exitFS]()
      },

      isFullscreen: function () {
        return document[elementFS]
      },

      change: changeEvent,
      error: errorEvent,
    }
  }

  return api
}

const fullscreenAPI = getFullscreenAPI()

let parsedDataSource = null
const dataSourceElement = document.getElementById("photoswipe-data")

if (dataSourceElement) {
  try {
    const jsonData = JSON.parse(dataSourceElement.textContent)
    if (Array.isArray(jsonData) && jsonData.length > 0) {
      parsedDataSource = jsonData
    }
  } catch (e) {
    console.error("Error parsing PhotoSwipe data source:", e)
    parsedDataSource = null
  }
}

let lightbox = null
let isClosingViaPopstate = false // Flag to prevent history.back() loop

if (parsedDataSource && parsedDataSource.length > 0) {
  lightbox = new PhotoSwipeLightbox({
    dataSource: parsedDataSource,
    bgOpacity: 1,
    pswpModule: () => import("photoswipe"),
    // Disable built-in history - we'll manage it manually with real URLs
    history: false,
  })

  // Set alt text on dynamically created images
  lightbox.on("contentLoad", (e) => {
    const { content } = e
    if (content.data && content.data.alt && content.element) {
      content.element.alt = content.data.alt
    }
  })

  new PhotoSwipeDynamicCaption(lightbox, {
    type: "auto",
    captionContent: (slide) => {
      const data = slide.data
      if (!data) {
        return ""
      }

      const title = data.title
      const dateISO = data.dateTaken
      const tags = data.tags || []
      const slug = data.slug

      // Return empty if no content to display
      if (!title && !dateISO && tags.length === 0) {
        return ""
      }

      // Format date to human-readable format (e.g., "January 15, 2024")
      let dateFormatted = null
      if (dateISO && typeof dateISO === "string") {
        const datePart = dateISO.substring(0, 10) // Extract YYYY-MM-DD
        const dateObj = new Date(datePart)
        dateFormatted = dateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      }

      // Build caption HTML using semantic elements
      let captionHTML = ""

      // Title as heading
      if (title) {
        captionHTML += `<h4>${title}</h4>`
      }

      // Metadata paragraph: Tags → Time → View details
      const hasMetadata = tags.length > 0 || dateFormatted || slug
      if (hasMetadata) {
        captionHTML += "<p>"

        // Tags with hash prefix, comma-separated
        if (tags.length > 0) {
          const tagLinks = tags
            .map((tag) => {
              const trimmedTag = typeof tag === "string" ? tag.trim() : ""
              if (!trimmedTag) return ""
              return `<a href="/photos/tags/${trimmedTag}/1">#${trimmedTag}</a>`
            })
            .filter((link) => link !== "")
            .join(", ")
          captionHTML += tagLinks
        }

        // Time (date) in the middle
        if (dateFormatted) {
          const dateURL = dateISO
            ? `/photos/dates/${dateISO.substring(0, 10)}/1`
            : ""
          const separator = tags.length > 0 ? " · " : ""
          captionHTML += `${separator}<time datetime="${dateISO}"><a href="${dateURL}">${dateFormatted}</a></time>`
        }

        // View details link at the end
        if (slug) {
          const separator = tags.length > 0 || dateFormatted ? " · " : ""
          captionHTML += `${separator}<a href="/photo/${slug}">View details</a>`
        }

        captionHTML += "</p>"
      }
      return captionHTML
    },
  })

  // Register share button
  // Note: Web Share API requires HTTPS (or localhost for development)
  // If testing on HTTP, the share button will fall back to clipboard copy
  lightbox.on("uiRegister", function () {
    lightbox.pswp.ui.registerElement({
      name: "share",
      order: 8,
      isButton: true,
      html: `<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 32 32" width="32" height="32">
        <use class="pswp__icn-shadow" xlink:href="#pswp__icn-share"/>
        <use class="pswp__icn-shadow" xlink:href="#pswp__icn-share-check"/>
        <path id="pswp__icn-share" d="M22 26c-1 0-3.3-.7-2.9-3.7l-7-4.1C10.3 19.8 7 18.9 7 16a3 3 0 0 1 5.05-2.2l7-4.1C18.7 8.4 19.6 6 22 6c1.7 0 3 1.3 3 3 0 2.9-3.3 3.8-5.05 2.2l-7 4.1c.1.35.1 1 0 1.4l7 4.1A3 3 0 1 1 22 26"/>
        <path id="pswp__icn-share-check" style="display:none;" d="m14 24-7-8 2-2 5 6L25 8l2 2Z"/>
      </svg>`,
      title: "Share photo",
      onClick: async (event, el, pswp) => {
        const currentPhotoData = pswp.currSlide?.data
        if (!currentPhotoData?.slug) {
          return
        }

        const photoUrl = `${window.location.origin}/photo/${currentPhotoData.slug}`
        const photoTitle = currentPhotoData.title || "Photo"

        const shareData = {
          title: photoTitle,
          url: photoUrl,
        }

        const shareIcon = el.querySelector("#pswp__icn-share")
        const checkIcon = el.querySelector("#pswp__icn-share-check")

        const showCheckmark = () => {
          if (shareIcon && checkIcon) {
            shareIcon.style.display = "none"
            checkIcon.style.display = "block"

            setTimeout(() => {
              shareIcon.style.display = "block"
              checkIcon.style.display = "none"
            }, 2000)
          }
        }

        // Try Web Share API first (requires HTTPS, works on mobile)
        // Use canShare() if available to check if sharing is actually possible
        const canTryWebShare =
          navigator.share &&
          (!navigator.canShare || navigator.canShare(shareData))

        if (canTryWebShare) {
          try {
            await navigator.share(shareData)
            // Successfully shared via native dialog
            // Don't show checkmark as the native UI provides its own feedback
            return
          } catch (err) {
            // Web Share failed (user cancelled, not supported, or error)
            // Fall through to clipboard fallback
            if (err.name === "AbortError") {
              // User cancelled - this is normal, don't do anything
              return
            }
          }
        }

        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(photoUrl)
          showCheckmark()
        } catch (err) {
          // Both methods failed - show URL in alert dialog for manual copy
          alert(`Share this photo:\n\n${photoUrl}`)
        }
      },
    })
  })

  // Register fullscreen button
  if (fullscreenAPI) {
    lightbox.on("uiRegister", function () {
      lightbox.pswp.ui.registerElement({
        name: "fullscreen",
        order: 9,
        isButton: true,
        // From https://github.com/dimsemenov/PhotoSwipe/issues/1759
        html: `<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 32 32" width="32" height="32">
          <use class="pswp__icn-shadow" xlink:href="#pswp__icn-fullscreen-exit"/>
          <use class="pswp__icn-shadow" xlink:href="#pswp__icn-fullscreen-request"/>
          <path d="M8 8v6.047h2.834v-3.213h3.213V8h-3.213zm9.953 0v2.834h3.213v3.213H24V8h-2.834zM8 17.953V24h6.047v-2.834h-3.213v-3.213zm13.166 0v3.213h-3.213V24H24v-6.047z" id="pswp__icn-fullscreen-request"/>
          <path d="M11.213 8v3.213H8v2.834h6.047V8zm6.74 0v6.047H24v-2.834h-3.213V8zM8 17.953v2.834h3.213V24h2.834v-6.047h-2.834zm9.953 0V24h2.834v-3.213H24v-2.834h-3.213z" id="pswp__icn-fullscreen-exit" style="display:none"/>
        </svg>`,
        title: "Toggle fullscreen",
        onClick: (event, el, pswp) => {
          if (fullscreenAPI.isFullscreen()) {
            fullscreenAPI.exit()
          } else {
            fullscreenAPI.request(pswp.element)
          }
        },
      })
    })

    // Handle fullscreen state changes
    lightbox.on("uiRegister", function () {
      const pswp = lightbox.pswp

      document.addEventListener(fullscreenAPI.change, () => {
        const isFullscreen = fullscreenAPI.isFullscreen()
        const fullscreenButton = pswp.element.querySelector(
          ".pswp__button--fullscreen"
        )

        if (fullscreenButton) {
          // Toggle icon visibility
          const requestIcon = fullscreenButton.querySelector(
            "#pswp__icn-fullscreen-request"
          )
          const exitIcon = fullscreenButton.querySelector(
            "#pswp__icn-fullscreen-exit"
          )

          if (isFullscreen) {
            if (requestIcon) requestIcon.style.display = "none"
            if (exitIcon) exitIcon.style.display = "block"
            fullscreenButton.classList.add("pswp__button--fs-active")
          } else {
            if (requestIcon) requestIcon.style.display = "block"
            if (exitIcon) exitIcon.style.display = "none"
            fullscreenButton.classList.remove("pswp__button--fs-active")
          }
        }
      })

      // Handle F key for fullscreen toggle
      pswp.on("keydown", (e) => {
        if (e.originalEvent.key === "f" || e.originalEvent.key === "F") {
          e.preventDefault()
          if (fullscreenAPI.isFullscreen()) {
            fullscreenAPI.exit()
          } else {
            fullscreenAPI.request(pswp.element)
          }
        }
      })
    })
  }

  // Custom URL history management using real photo page URLs
  let originUrl = null // Store the URL before opening lightbox

  lightbox.on("uiRegister", function () {
    if (lightbox.pswp) {
      // When lightbox opens, save the current URL and update to photo URL
      lightbox.pswp.on("change", () => {
        const currentPhotoData = lightbox.pswp.currSlide?.data
        if (currentPhotoData?.slug) {
          const photoPageUrl = `/photo/${currentPhotoData.slug}`

          // If opening for the first time, save origin and push new state
          if (originUrl === null) {
            originUrl = window.location.pathname + window.location.search
            history.pushState(null, "", photoPageUrl)
          } else {
            // Navigating between photos - replace current entry
            history.replaceState(null, "", photoPageUrl)
          }
        }
      })

      // Restore origin URL when lightbox closes
      lightbox.pswp.on("close", () => {
        if (!isClosingViaPopstate && originUrl !== null) {
          // User closed via X button, ESC, or click outside
          // Restore the original URL by going back
          history.back()
        }

        // Reset state
        originUrl = null
        isClosingViaPopstate = false
      })
    }
  })

  // Handle browser back button
  window.addEventListener("popstate", () => {
    if (lightbox && lightbox.pswp && lightbox.pswp.isOpen) {
      // User pressed back while lightbox is open
      // Set flag to prevent close() from calling history.back() again
      isClosingViaPopstate = true
      lightbox.pswp.close()
      // We're already at the gallery URL from the popstate
    }
  })

  const galleryElement = document.getElementById("gallery")
  if (galleryElement) {
    galleryElement.addEventListener("click", (e) => {
      const clickedLink = e.target.closest("a.gallery-item")
      if (!clickedLink) {
        return
      }
      e.preventDefault()

      const clickedIndex = parseInt(clickedLink.dataset.pswpIndex, 10)
      if (!isNaN(clickedIndex)) {
        // Reset flag before opening to ensure clean state
        isClosingViaPopstate = false
        lightbox.loadAndOpen(clickedIndex)
      } else {
        console.warn(
          "PhotoSwipe: Could not find pswpIndex on clicked gallery item."
        )
      }
    })
  }

  lightbox.init()
} else {
  console.warn(
    "PhotoSwipe: No parsedDataSource available or it's empty. Lightbox not initialized."
  )
}
