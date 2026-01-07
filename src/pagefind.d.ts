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
