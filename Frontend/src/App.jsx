 import { useRef, useState, useEffect, useMemo } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import prism from "prismjs"
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "highlight.js/styles/github-dark.css";
import axios from 'axios'
import './App.css'
import { Header } from './components/Header'
import { CodeEditor } from './components/CodeEditor'
import { ReviewPanel } from './components/ReviewPanel'


function App() {
  const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const [ code, setCode ] = useState(() => {
    const fromUrl = (() => {
      try {
        const params = new URLSearchParams(window.location.search)
        const s = params.get('c')
        if (!s) return null
        return decodeURIComponent(escape(window.atob(s)))
      } catch {
        return null
      }
    })()
    if (fromUrl != null) return fromUrl
    const saved = localStorage.getItem('code')
    return saved != null ? saved : ` function sum(a, b) {\n  return a + b\n}`
  })
  const [ review, setReview ] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)
  const [ error, setError ] = useState('')
  const [ language, setLanguage ] = useState(() => localStorage.getItem('language') || 'javascript')
  const [ theme, setTheme ] = useState(() => localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light'))
  const [ leftWidthPct, setLeftWidthPct ] = useState(() => {
    const saved = Number(localStorage.getItem('leftWidthPct'))
    return Number.isFinite(saved) && saved >= 20 && saved <= 80 ? saved : 50
  })

  const containerRef = useRef(null)
  const isDraggingRef = useRef(false)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [ theme ])

  useEffect(() => {
    localStorage.setItem('code', code)
  }, [ code ])

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [ language ])

  useEffect(() => {
    localStorage.setItem('leftWidthPct', String(leftWidthPct))
  }, [ leftWidthPct ])

  // Auto-review disabled to conserve API quota
  // Users must manually trigger review with button or Ctrl+Enter
  // useEffect(() => {
  //   if (!code.trim()) return
  //   const handle = setTimeout(() => {
  //     if (!isLoading) {
  //       reviewCode()
  //     }
  //   }, 800)
  //   return () => clearTimeout(handle)
  // }, [ code ])

  useEffect(() => {
    const onKey = (e) => {
      const isCmd = e.metaKey || e.ctrlKey
      if (isCmd && e.key.toLowerCase() === 'enter') {
        e.preventDefault()
        reviewCode()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ code ])

  async function reviewCode() {
    const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:3000'
    try {
      setIsLoading(true)
      setError('')
      setReview('')
      const response = await axios.post(`${API_BASE}/ai/get-review`, { code })
      const data = response?.data
      const text = typeof data === 'string' ? data : (data?.review || data?.message || JSON.stringify(data))
      setReview(text || '')
    } catch (e) {
      // Handle quota/rate limit errors
      if (e?.response?.status === 429) {
        const errorData = e.response.data
        const retryAfter = errorData?.retryAfter || 60
        const minutes = Math.ceil(retryAfter / 60)
        setError(`⚠️ Rate Limit Exceeded: ${errorData?.message || 'API quota exhausted'}. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`)
      } else {
        const msg = e?.response?.data?.message || e?.message || 'Unknown error'
        setError(`Request failed: ${msg}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      if (e.target && typeof e.target.selectionStart === 'number') {
        e.preventDefault()
        const textarea = e.target
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const insertion = '  '
        const updated = code.slice(0, start) + insertion + code.slice(end)
        setCode(updated)
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + insertion.length
        })
      }
    } else if (e.key === 'Enter') {
      if (e.target && typeof e.target.selectionStart === 'number') {
        e.preventDefault()
        const textarea = e.target
        const start = textarea.selectionStart
        const before = code.slice(0, start)
        const lineStart = before.lastIndexOf('\n') + 1
        const currentLine = before.slice(lineStart)
        const currentIndent = currentLine.match(/^\s*/)[0]
        const extra = /\{$/.test(currentLine.trim()) ? '  ' : ''
        const insertion = `\n${currentIndent}${extra}`
        const updated = code.slice(0, start) + insertion + code.slice(start)
        setCode(updated)
        requestAnimationFrame(() => {
          const pos = start + insertion.length
          textarea.selectionStart = textarea.selectionEnd = pos
        })
      }
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const text = (e.clipboardData || window.clipboardData).getData('text')
    const normalized = text
      .replace(/\t/g, '  ')
      .split('\n')
      .map(line => line.replace(/\s+$/g, ''))
      .join('\n')
    const textarea = e.target
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const updated = code.slice(0, start) + normalized + code.slice(end)
    setCode(updated)
    requestAnimationFrame(() => {
      const pos = start + normalized.length
      textarea.selectionStart = textarea.selectionEnd = pos
    })
  }

  function copyToClipboard() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(review || '').catch(() => setError('Clipboard copy failed'))
    }
  }

  function downloadMarkdown() {
    try {
      const blob = new Blob([review || ''], { type: 'text/markdown;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'review.md'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      setError('Download failed')
    }
  }

  function shareLink() {
    try {
      const encoded = window.btoa(unescape(encodeURIComponent(code)))
      const url = new URL(window.location.href)
      url.searchParams.set('c', encoded)
      navigator.clipboard.writeText(url.toString())
    } catch {
      setError('Share link failed')
    }
  }

  function onMouseDownDivider() {
    isDraggingRef.current = true
    document.body.style.cursor = 'col-resize'
  }

  useEffect(() => {
    function handleUp() {
      if (isDraggingRef.current) {
        isDraggingRef.current = false
        document.body.style.cursor = ''
      }
    }
    function handleMove(e) {
      if (!isDraggingRef.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const pct = Math.min(80, Math.max(20, (x / rect.width) * 100))
      setLeftWidthPct(pct)
    }
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('mousemove', handleMove)
    }
  }, [])

  // Build a simple table of contents from markdown headings
  const toc = useMemo(() => {
    if (!review) return []
    const lines = review.split('\n')
    const items = []
    for (const line of lines) {
      const m = /^(#{1,6})\s+(.+)$/.exec(line)
      if (m) {
        const level = m[1].length
        let text = m[2].trim()
        let sev = null
        const sevMatch = /\[(High|Medium|Low)\]/i.exec(text)
        if (sevMatch) {
          sev = sevMatch[1].toLowerCase()
          text = text.replace(sevMatch[0], '').trim()
        }
        items.push({ level, text, sev })
      }
    }
    return items
  }, [ review ])

  return (
    <>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main ref={containerRef}>
        <CodeEditor
          code={code}
          setCode={setCode}
          language={language}
          setLanguage={setLanguage}
          isLoading={isLoading}
          reviewCode={reviewCode}
          leftWidthPct={leftWidthPct}
          handleKeyDown={handleKeyDown}
          handlePaste={handlePaste}
        />
        <div className="divider" onMouseDown={onMouseDownDivider} />
        <ReviewPanel
          review={review}
          error={error}
          isLoading={isLoading}
          toc={toc}
          leftWidthPct={leftWidthPct}
          copyToClipboard={copyToClipboard}
          downloadMarkdown={downloadMarkdown}
        />
      </main>
    </>
  )
}

export default App