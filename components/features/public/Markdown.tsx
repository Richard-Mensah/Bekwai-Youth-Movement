import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

/** Renders Markdown content with the site's article styling (GFM enabled). */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="article-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  )
}
