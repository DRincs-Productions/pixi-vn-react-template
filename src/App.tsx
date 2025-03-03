import { useRef } from "react";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import MarkdownTypewriter from "./components/Typewriter";

export default function MarkdownComponent() {
    const paragraphRef = useRef<HTMLDivElement>(null);
    return (
        <div
            ref={paragraphRef}
            style={{
                overflow: "auto",
                height: "300px",
            }}
        >
            <MarkdownTypewriter
                delay={30}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                scrollRef={paragraphRef}
            >
                {text}
            </MarkdownTypewriter>
        </div>
    );
}

const text = `
# Markdown Test

Hello, this is a test of the markdown parser. Pixi'VN does not manage markdown, but you can implement a markdown parser to display text with markdown syntax.

For example in React, you can use the library [react-markdown](https://www.npmjs.com/package/react-markdown).

## Colored Text

<span style="color:blue">some *blue* text</span>.

<span style="color:red">some *red* text</span>.

<span style="color:green">some *green* text</span>.

## Bold Text

**This is bold text.**

## Italic Text

*This is italic text.*

## Delete Text

~~This is deleted text.~~

## Link Test

[Link to Google](https://www.google.com)

## H2 Test

### H3 Test

#### H4 Test

## Code Test

\`Hello World\`

\`\`\`js
console.log("Hello World")
\`\`\`

## List Test

- Item 1

- Item 2

- [x] Item 3

## Table Test

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |

## Separator Test

***
Footer
`;
