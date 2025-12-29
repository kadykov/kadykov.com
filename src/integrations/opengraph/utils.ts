/**
 * Shared Utilities for OpenGraph Generation
 */

/**
 * Decode HTML entities in a string
 *
 * Handles common entities found in HTML meta content:
 * - Numeric entities: &#38; &#34; &#39; etc.
 * - Named entities: &amp; &quot; &apos; &lt; &gt; &nbsp;
 */
export function decodeHtmlEntities(text: string): string {
  return (
    text
      // Numeric entities (decimal)
      .replace(/&#(\d+);/g, (_, code) =>
        String.fromCharCode(parseInt(code, 10))
      )
      // Numeric entities (hex)
      .replace(/&#x([0-9a-fA-F]+);/g, (_, code) =>
        String.fromCharCode(parseInt(code, 16))
      )
      // Named entities
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
  )
}
