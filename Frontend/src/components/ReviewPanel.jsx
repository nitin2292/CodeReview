import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"

export function ReviewPanel({
  review,
  error,
  isLoading,
  toc,
  leftWidthPct,
  copyToClipboard,
  downloadMarkdown,
}) {
  return (
    <div className="right" style={{ flexBasis: `${100 - leftWidthPct}%` }}>
      <div className="right-toolbar">
        <div className="toc">
          {toc.length > 0 && (
            <ul>
              {toc.map((item, idx) => (
                <li key={idx} style={{ marginLeft: (item.level - 1) * 12 }}>
                  {item.text}
                  {item.sev && <span className={`sev sev-${item.sev}`}>{item.sev}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="right-actions">
          <button className="btn subtle" type="button" onClick={copyToClipboard} disabled={!review}>Copy review</button>
          <button className="btn subtle" type="button" onClick={downloadMarkdown} disabled={!review}>Download .md</button>
        </div>
      </div>
      {error ? (
        <div className="error">{error}</div>
      ) : (
        <Markdown rehypePlugins={[ rehypeHighlight ]}>{review || (isLoading ? 'Analyzing your code…' : '')}</Markdown>
      )}
    </div>
  )
}
