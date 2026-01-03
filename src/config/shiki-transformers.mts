import type { ShikiTransformer } from "shiki"
import type { Element } from "hast"

/**
 * Custom Shiki transformer that adds a copy button to code blocks.
 *
 * Features:
 * - Adds a copy button positioned in the top-right corner of each code block
 * - Uses the Clipboard API to copy code content
 * - Provides visual feedback ("Copied!") when clicked
 * - Works seamlessly with dual light/dark themes
 * - Preserves original code formatting (removes Shiki decorations)
 */
export function addCopyButton(): ShikiTransformer {
  return {
    name: "add-copy-button",
    pre(node: Element) {
      // Create a wrapper div to position the copy button relative to the code block
      const copyButton: Element = {
        type: "element",
        tagName: "button",
        properties: {
          class: "copy-code-button",
          "aria-label": "Copy code to clipboard",
          // Store the raw source code in a data attribute for copying
          "data-code": this.source,
          // Inline script to handle copy functionality
          // Note: Using inline onclick is simpler than setting up global event listeners
          onclick: `
            (async () => {
              try {
                await navigator.clipboard.writeText(this.dataset.code);
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.classList.add('copied');
                setTimeout(() => {
                  this.textContent = originalText;
                  this.classList.remove('copied');
                }, 2000);
              } catch (err) {
                console.error('Failed to copy code:', err);
                this.textContent = 'Failed';
                setTimeout(() => {
                  this.textContent = 'Copy';
                }, 2000);
              }
            })()
          `,
        },
        children: [
          {
            type: "text",
            value: "Copy",
          },
        ],
      }

      // Add the copy button as the first child of the pre element
      node.children.unshift(copyButton)
    },
  }
}
