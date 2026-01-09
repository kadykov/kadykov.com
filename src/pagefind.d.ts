declare module "@pagefind/default-ui" {
  export class PagefindUI {
    constructor(options: {
      element: string
      showSubResults?: boolean
      showImages?: boolean
      excerptLength?: number
      resetStyles?: boolean
    })
    triggerSearch(
      term: string,
      options?: { filters?: Record<string, string> }
    ): void
    _searchTerm?: string
  }
}

/**
 * Pagefind raw JavaScript API types.
 * The pagefind.js file is generated at build time by the pagefind CLI.
 *
 * Note: The pagefind module is imported dynamically at runtime using a
 * computed path to prevent Vite from trying to resolve it at build time.
 * See SearchDialog.astro for usage.
 */
interface PagefindSubResult {
  title: string
  url: string
  excerpt: string
  anchor?: { id: string; text: string }
}

interface PagefindResult {
  url: string
  excerpt: string
  meta: {
    title: string
    image?: string
  }
  sub_results: PagefindSubResult[]
}

interface PagefindSearchResult {
  id: string
  data: () => Promise<PagefindResult>
}

interface PagefindSearchResponse {
  results: PagefindSearchResult[]
}

interface PagefindInstance {
  init: () => Promise<void>
  search: (
    query: string,
    options?: { filters?: Record<string, string[]> }
  ) => Promise<PagefindSearchResponse>
  debouncedSearch: (
    query: string,
    options?: { filters?: Record<string, string[]> },
    debounceMs?: number
  ) => Promise<PagefindSearchResponse | null>
  options: (options: { bundlePath?: string }) => Promise<void>
}
