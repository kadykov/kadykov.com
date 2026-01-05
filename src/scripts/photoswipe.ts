import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"
// @ts-ignore - photoswipe-dynamic-caption-plugin doesn't provide types
import PhotoSwipeDynamicCaption from "photoswipe-dynamic-caption-plugin"
import "photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css"

// Photo data structure matching what's passed from Astro
interface PhotoData {
  src: string
  width: number
  height: number
  alt?: string
  title?: string
  dateTaken?: string
  tags?: string[]
  slug?: string
}

// Fullscreen API helper
// Supports unprefixed and webkit-prefixed versions
interface FullscreenAPI {
  request: (el: HTMLElement) => void
  exit: () => Promise<void>
  isFullscreen: () => Element | null
  change: string
  error: string
}

function getFullscreenAPI(): FullscreenAPI | undefined {
  let api: FullscreenAPI | undefined
  let enterFS: string | undefined
  let exitFS: string | undefined
  let elementFS: string | undefined
  let changeEvent: string | undefined
  let errorEvent: string | undefined

  if ("requestFullscreen" in document.documentElement) {
    enterFS = "requestFullscreen"
    exitFS = "exitFullscreen"
    elementFS = "fullscreenElement"
    changeEvent = "fullscreenchange"
    errorEvent = "fullscreenerror"
  } else if ("webkitRequestFullscreen" in document.documentElement) {
    enterFS = "webkitRequestFullscreen"
    exitFS = "webkitExitFullscreen"
    elementFS = "webkitFullscreenElement"
    changeEvent = "webkitfullscreenchange"
    errorEvent = "webkitfullscreenerror"
  }

  if (enterFS && exitFS && elementFS && changeEvent && errorEvent) {
    api = {
      request: function (el: HTMLElement) {
        if (enterFS === "webkitRequestFullscreen") {
          ;(el as any)[enterFS]((Element as any).ALLOW_KEYBOARD_INPUT)
        } else {
          ;(el as any)[enterFS]()
        }
      },

      exit: function () {
        return (document as any)[exitFS!]()
      },

      isFullscreen: function () {
        return (document as any)[elementFS!]
      },

      change: changeEvent,
      error: errorEvent,
    }
  }

  return api
}

const fullscreenAPI = getFullscreenAPI()

let parsedDataSource: PhotoData[] | null = null
const dataSourceElement = document.getElementById("photoswipe-data")

if (dataSourceElement) {
  try {
    const jsonData = JSON.parse(dataSourceElement.textContent || "")
    if (Array.isArray(jsonData) && jsonData.length > 0) {
      parsedDataSource = jsonData
    }
  } catch (e) {
    console.error("Error parsing PhotoSwipe data source:", e)
    parsedDataSource = null
  }
}

let lightbox: PhotoSwipeLightbox | null = null
let isClosingViaPopstate = false // Flag to prevent history.back() loop

if (parsedDataSource && parsedDataSource.length > 0) {
  lightbox = new PhotoSwipeLightbox({
    dataSource: parsedDataSource,
    bgOpacity: 1,
    pswpModule: () => import("photoswipe"),
  })

  // Set alt text on dynamically created images
  lightbox.on("contentLoad", (e) => {
    const { content } = e
    if (
      content.data &&
      content.data.alt &&
      content.element instanceof HTMLImageElement
    ) {
      content.element.alt = content.data.alt
    }
  })

  new PhotoSwipeDynamicCaption(lightbox, {
    type: "auto",
    captionContent: (slide: any) => {
      const data = slide.data as PhotoData | undefined
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
      let dateFormatted: string | null = null
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
          // Since we're already on the photo page when viewing the lightbox,
          // link opens in a new tab to avoid disrupting the current view
          captionHTML += `${separator}<a href="/photo/${slug}#photo" target="_blank" rel="noopener">View details</a>`
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
    if (!lightbox?.pswp?.ui) return

    lightbox.pswp.ui.registerElement({
      name: "share",
      order: 8,
      isButton: true,
      // Icons are based on Material Symbols, but heavily simplified/optimized
      html: `<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 32 32" width="32" height="32">
        <use class="pswp__icn-shadow" xlink:href="#pswp__icn-share"/>
        <use class="pswp__icn-shadow" xlink:href="#pswp__icn-share-check"/>
        <path id="pswp__icn-share" d="M22 26c-1 0-3.3-.7-2.9-3.7l-7-4.1C10.3 19.8 7 18.9 7 16a3 3 0 0 1 5.05-2.2l7-4.1C18.7 8.4 19.6 6 22 6c1.7 0 3 1.3 3 3 0 2.9-3.3 3.8-5.05 2.2l-7 4.1c.1.35.1 1 0 1.4l7 4.1A3 3 0 1 1 22 26"/>
        <path id="pswp__icn-share-check" style="display:none;" d="m14 24-7-8 2-2 5 6L25 8l2 2Z"/>
      </svg>`,
      title: "Share photo",
      onClick: async (_event, el, pswp) => {
        const currentPhotoData = pswp.currSlide?.data as PhotoData | undefined
        if (!currentPhotoData?.slug) {
          return
        }

        const photoUrl = `${window.location.origin}/photo/${currentPhotoData.slug}`
        const photoTitle = currentPhotoData.title || "Photo"

        const shareData: ShareData = {
          title: photoTitle,
          url: photoUrl,
        }

        const shareIcon = el.querySelector(
          "#pswp__icn-share"
        ) as HTMLElement | null
        const checkIcon = el.querySelector(
          "#pswp__icn-share-check"
        ) as HTMLElement | null

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
          "share" in navigator &&
          (!("canShare" in navigator) || navigator.canShare(shareData))

        if (canTryWebShare) {
          try {
            await navigator.share(shareData)
            // Successfully shared via native dialog
            // Don't show checkmark as the native UI provides its own feedback
            return
          } catch (err: any) {
            // Web Share failed (user cancelled, not supported, or error)
            // Fall through to clipboard fallback
            if (err.name === "AbortError") {
              // User cancelled - this is normal, don't do anything
              return
            }
          }
        }

        // Fallback: Copy to clipboard
        const copyToClipboard = async (text: string): Promise<boolean> => {
          // Try modern Clipboard API first
          if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
              await navigator.clipboard.writeText(text)
              return true
            } catch (err) {
              console.warn("Clipboard API failed, trying fallback:", err)
            }
          }

          // Fallback for mobile browsers: use execCommand with textarea
          try {
            const textarea = document.createElement("textarea")
            textarea.value = text
            textarea.style.position = "fixed"
            textarea.style.left = "-999999px"
            textarea.style.top = "-999999px"
            document.body.appendChild(textarea)
            textarea.focus()
            textarea.select()
            const success = document.execCommand("copy")
            document.body.removeChild(textarea)
            return success
          } catch (err) {
            console.error("Fallback copy also failed:", err)
            return false
          }
        }

        const success = await copyToClipboard(photoUrl)
        if (success) {
          showCheckmark()
        } else {
          // Both methods failed - show URL in alert dialog for manual copy
          alert(`Share this photo:\n\n${photoUrl}`)
        }
      },
    })
  })

  // Register fullscreen button
  if (fullscreenAPI) {
    lightbox.on("uiRegister", function () {
      if (!lightbox?.pswp?.ui) return

      lightbox.pswp.ui.registerElement({
        name: "fullscreen",
        order: 9,
        isButton: true,
        // Icons are based on Material Symbols, but heavily simplified/optimized
        html: `<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 32 32" width="32" height="32">
          <use class="pswp__icn-shadow" xlink:href="#pswp__icn-fullscreen-exit"/>
          <use class="pswp__icn-shadow" xlink:href="#pswp__icn-fullscreen-request"/>
          <path id="pswp__icn-fullscreen-request" d="M7 25v-5h2v3h3v2zm13 0v-2h3v-3h2v5zM7 12V7h5v2H9v3zm16 0V9h-3V7h5v5z"/>
          <path id="pswp__icn-fullscreen-exit" style="display:none" d="M10 25v-3H7v-2h5v5zm10 0v-5h5v2h-3v3zM7 12v-2h3V7h2v5Zm13 0V7h2v3h3v2Z"/>
        </svg>`,
        title: "Toggle fullscreen",
        onClick: (_event, _el, pswp) => {
          if (fullscreenAPI.isFullscreen()) {
            fullscreenAPI.exit()
          } else {
            fullscreenAPI.request(pswp.element as HTMLElement)
          }
        },
      })
    })

    // Handle fullscreen state changes
    lightbox.on("uiRegister", function () {
      if (!lightbox?.pswp) return
      const pswp = lightbox.pswp

      document.addEventListener(fullscreenAPI.change, () => {
        const isFullscreen = fullscreenAPI.isFullscreen()
        const fullscreenButton = pswp.element?.querySelector(
          ".pswp__button--fullscreen"
        )

        if (fullscreenButton) {
          // Toggle icon visibility
          const requestIcon = fullscreenButton.querySelector(
            "#pswp__icn-fullscreen-request"
          ) as HTMLElement | null
          const exitIcon = fullscreenButton.querySelector(
            "#pswp__icn-fullscreen-exit"
          ) as HTMLElement | null

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
            fullscreenAPI.request(pswp.element as HTMLElement)
          }
        }
      })
    })
  }

  // Custom URL history management using real photo page URLs
  let originUrl: string | null = null // Store the URL before opening lightbox

  lightbox.on("uiRegister", function () {
    if (lightbox?.pswp) {
      // When lightbox opens, save the current URL and update to photo URL
      lightbox.pswp.on("change", () => {
        if (!lightbox?.pswp) return
        const currentPhotoData = lightbox.pswp.currSlide?.data as
          | PhotoData
          | undefined
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
    galleryElement.addEventListener("click", (e: MouseEvent) => {
      const clickedLink = (e.target as HTMLElement).closest(
        "a.gallery-item"
      ) as HTMLAnchorElement | null
      if (!clickedLink) {
        return
      }
      e.preventDefault()

      const clickedIndex = parseInt(clickedLink.dataset.pswpIndex || "", 10)
      if (!isNaN(clickedIndex)) {
        // Reset flag before opening to ensure clean state
        isClosingViaPopstate = false
        lightbox?.loadAndOpen(clickedIndex)
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
