import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"
import PhotoSwipeDynamicCaption from "photoswipe-dynamic-caption-plugin"
import "photoswipe-dynamic-caption-plugin/photoswipe-dynamic-caption-plugin.css"

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

  // Custom URL history management using real photo page URLs
  let hasInitiallyOpened = false

  lightbox.on("uiRegister", function () {
    if (lightbox.pswp) {
      // When lightbox opens or changes slides, update the URL
      lightbox.pswp.on("change", () => {
        const currentPhotoData = lightbox.pswp.currSlide?.data
        if (currentPhotoData?.slug) {
          const photoPageUrl = `/photo/${currentPhotoData.slug}`

          if (!hasInitiallyOpened) {
            // First time opening lightbox - push new history entry
            history.pushState(null, "", photoPageUrl)
            hasInitiallyOpened = true
          } else {
            // Navigating between photos - replace current entry
            history.replaceState(null, "", photoPageUrl)
          }
        }
      })

      // Reset flag when lightbox closes
      lightbox.pswp.on("close", () => {
        hasInitiallyOpened = false

        if (!isClosingViaPopstate) {
          // User closed via X button, ESC, or click outside
          history.back()
        }
        // Reset the flag
        isClosingViaPopstate = false
      })
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
          el.setAttribute("title", "Download image")

          const updateDownloadLink = () => {
            if (pswp.currSlide && pswp.currSlide.data) {
              if (pswp.currSlide.data.downloadUrl) {
                el.href = pswp.currSlide.data.downloadUrl
              } else if (pswp.currSlide.data.src) {
                el.href = pswp.currSlide.data.src
              }
            }
          }
          pswp.on("change", updateDownloadLink)
          updateDownloadLink()
        },
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
