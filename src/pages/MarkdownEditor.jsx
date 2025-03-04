// MarkdownEditor.jsx
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GFM tables
import remarkMath from "remark-math"; // For math parsing
import rehypeKatex from "rehype-katex"; // For rendering math
import "katex/dist/katex.min.css"; // KaTeX styles

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`
# Simple Markdown Editor

## Features
- **Text formatting**: bold, italic, etc.
- Tables (GFM style with borders)
- Equations
- Images

## Example Table
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
| Cell 3   | Cell 4   |

## Equation Example
Inline: $$E = mc^2$$
Block:
$$\\int_{0}^{\\infty} e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

## Image Example
![Sample Image](https://static.vecteezy.com/system/resources/thumbnails/008/695/917/small_2x/no-image-available-icon-simple-two-colors-template-for-no-image-or-picture-coming-soon-and-placeholder-illustration-isolated-on-white-background-vector.jpg)
  `);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        gap: "20px",
      }}
    >
      <div style={{ flex: 1 }}>
        <h2>Editor</h2>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          style={{
            width: "100%",
            height: "400px",
            padding: "10px",
            fontFamily: "monospace",
            border: "1px solid #ddd",
            borderRadius: "4px",
            resize: "vertical",
          }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <h2>Preview</h2>
        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "4px",
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              img: ({ node, ...props }) => (
                <img {...props} style={{ maxWidth: "100%" }} />
              ),
              table: ({ node, ...props }) => (
                <table
                  style={{
                    borderCollapse: "collapse",
                    width: "100%",
                    border: "1px solid #ccc",
                  }}
                  {...props}
                />
              ),
              th: ({ node, ...props }) => (
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    backgroundColor: "#f5f5f5",
                  }}
                  {...props}
                />
              ),
              td: ({ node, ...props }) => (
                <td
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                  }}
                  {...props}
                />
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
