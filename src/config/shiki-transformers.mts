import type { ShikiTransformer } from "shiki"
import type { Element } from "hast"

/**
 * Custom Shiki transformer that adds a copy button to code blocks.
 *
 * Features:
 * - Adds a minimal button element to each code block
 * - Button is styled and positioned via CSS (pre button selector)
 * - Copy functionality is handled by a shared script (copyCode.ts)
 * - Works seamlessly with dual light/dark themes
 */
export function addCopyButton(): ShikiTransformer {
  return {
    name: "add-copy-button",
    pre(node: Element) {
      // Create a minimal button - styling and behavior handled externally
      const copyButton: Element = {
        type: "element",
        tagName: "button",
        properties: {
          "aria-label": "Copy code to clipboard",
        },
        children: [],
      }

      // Add the copy button as the first child of the pre element
      node.children.unshift(copyButton)
    },
  }
}
