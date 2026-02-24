import Editor from "react-simple-code-editor"
import prism from "prismjs"

export function CodeEditor({
  code,
  setCode,
  language,
  setLanguage,
  isLoading,
  reviewCode,
  leftWidthPct,
  handleKeyDown,
  handlePaste,
}) {
  return (
    <div className="left" style={{ flexBasis: `${leftWidthPct}%` }}>
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <label className="select">
            <span>Language</span>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="jsx">JSX</option>
              <option value="tsx">TSX</option>
              <option value="json">JSON</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
          </label>
        </div>
        <div className="toolbar-right">
          <button className="btn subtle" type="button" onClick={() => navigator.clipboard.writeText(code)} disabled={isLoading}>Copy</button>
          <button className="btn subtle" type="button" onClick={() => setCode('')} disabled={isLoading}>Clear</button>
          <button className="btn subtle" type="button" onClick={() => {
            const encoded = window.btoa(unescape(encodeURIComponent(code)))
            const url = new URL(window.location.href)
            url.searchParams.set('c', encoded)
            navigator.clipboard.writeText(url.toString())
          }} disabled={isLoading}>Share</button>
          <button className="btn primary" type="button" onClick={reviewCode} disabled={isLoading || !code.trim()}>
            {isLoading ? 'Reviewing…' : 'Review'}
          </button>
        </div>
      </div>
      <div className="code editor-with-gutter">
        <div className="gutter" aria-hidden>
          {Array.from({ length: code.split('\n').length }).map((_, i) => (
            <div key={i} className="gutter-line">{i + 1}</div>
          ))}
        </div>
        <Editor
          value={code}
          onValueChange={code => setCode(code)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          highlight={code => {
            const map = {
              javascript: prism.languages.javascript,
              typescript: prism.languages.typescript,
              jsx: prism.languages.jsx,
              tsx: prism.languages.tsx,
              json: prism.languages.json,
              html: prism.languages.markup,
              css: prism.languages.css,
              python: prism.languages.python,
              java: prism.languages.java,
              c: prism.languages.c,
              cpp: prism.languages.cpp,
            }
            const lang = map[language] || prism.languages.javascript
            return prism.highlight(code, lang, language)
          }}
          padding={12}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 16,
            border: "1px solid transparent",
            borderRadius: "8px",
            height: "100%",
            width: "100%",
            paddingLeft: 52
          }}
        />
      </div>
    </div>
  )
}
