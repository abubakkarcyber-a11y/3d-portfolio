import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { terminalBoot, terminalCommands, terminalHelp, type TermLine } from '../../data/content'

const PROMPT = 'analyst@abubakkar:~$'

const QUICK = ['whoami', 'cat status.txt', 'ls focus/', 'skills', 'labs', 'certs', 'contact']

function Line({ line }: { line: TermLine }) {
  if (!line) return null // never crash on a malformed queue entry
  if (line.kind === 'cmd') {
    return (
      <div className="flex flex-wrap">
        <span className="mr-2 shrink-0 text-cyanx">{PROMPT}</span>
        <span className="text-frost">{line.text}</span>
      </div>
    )
  }
  const cls =
    line.kind === 'ok'
      ? 'text-mint font-semibold'
      : line.kind === 'accent'
        ? 'text-cyan-300'
        : line.kind === 'dim'
          ? 'text-slate-500 italic'
          : 'text-slate-300'
  return <div className={`whitespace-pre-wrap break-words pl-1 ${cls}`}>{line.text}</div>
}

export function Terminal() {
  const [lines, setLines] = useState<TermLine[]>([])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [booted, setBooted] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const bootStarted = useRef(false)
  const inView = useInView(scrollRef, { once: true, margin: '-60px' })

  const scrollDown = () => {
    requestAnimationFrame(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    })
  }

  // boot sequence — typed line-by-line when the terminal scrolls into view.
  // Runs exactly once (guarded by a ref, immune to effect re-runs), every push
  // is length-checked so the chain can never emit an undefined entry.
  useEffect(() => {
    if (!inView || bootStarted.current) return
    bootStarted.current = true
    const script = terminalBoot
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLines([...script])
      setBooted(true)
      return
    }
    let i = 0
    const push = () => {
      if (i >= script.length) {
        setBooted(true)
        return
      }
      const entry = script[i]
      i += 1
      if (entry) {
        setLines((prev) => [...prev, entry])
        scrollDown()
      }
      if (i < script.length) {
        setTimeout(push, entry?.kind === 'cmd' ? 260 : 340)
      } else {
        setBooted(true)
      }
    }
    setTimeout(push, 350)
    // chain self-terminates via the length guard; no dep re-runs needed
  }, [inView])

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase()
    if (!cmd) return
    const next: TermLine[] = [{ kind: 'cmd', text: cmd }]
    if (cmd === 'clear') {
      setLines([])
      setInput('')
      return
    }
    if (cmd === 'help') next.push(...terminalHelp)
    else if (cmd === 'whoami') next.push({ kind: 'out', text: 'muhammad_abubakkar' })
    else if (cmd === 'status' || cmd === 'cat status.txt')
      next.push({ kind: 'ok', text: 'ACTIVE — OPEN TO CYBERSECURITY OPPORTUNITIES' })
    else if (cmd === 'ls focus/' || cmd === 'ls')
      next.push({ kind: 'accent', text: 'pentesting  web-appsec  network-analysis  osint  ai-development' })
    else if (terminalCommands[cmd]) next.push(...terminalCommands[cmd])
    else
      next.push(
        { kind: 'dim', text: `command not found: ${cmd}` },
        { kind: 'out', text: "type 'help' to list available commands" }
      )
    setLines((prev) => [...prev, ...next])
    setHistory((prev) => [cmd, ...prev].slice(0, 40))
    setHistoryIdx(-1)
    setInput('')
    scrollDown()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      const idx = Math.min(historyIdx + 1, history.length - 1)
      setHistoryIdx(idx)
      setInput(history[idx])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const idx = Math.max(historyIdx - 1, -1)
      setHistoryIdx(idx)
      setInput(idx === -1 ? '' : history[idx])
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#050810]/90 shadow-panel">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-[11.5px] tracking-wide text-slate-500">analyst@abubakkar: ~ — kali linux</span>
      </div>

      {/* output */}
      <div
        ref={scrollRef}
        className="h-[340px] overflow-y-auto px-4 py-4 font-mono text-[12.5px] leading-[1.75] md:h-[400px] md:text-[13px]"
        onClick={() => booted && inputRef.current?.focus()}
        aria-label="Interactive terminal — type help for commands"
        role="log"
      >
        {lines.map((line, i) => (
          <Line key={i} line={line} />
        ))}
        {lines.length === 0 && <span className="text-slate-600">…</span>}

        {/* input line */}
        <form
          className="mt-1.5 flex"
          onSubmit={(e) => {
            e.preventDefault()
            run(input)
          }}
        >
          <span className="mr-2 shrink-0 text-cyanx">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="min-w-0 flex-1 bg-transparent font-mono text-[12.5px] text-frost caret-cyan-300 outline-none md:text-[13px]"
            placeholder={booted ? '' : 'booting…'}
            aria-label="Terminal command input"
            autoComplete="off"
            spellCheck={false}
            disabled={!booted}
          />
        </form>
      </div>

      {/* quick commands */}
      <div className="flex flex-wrap gap-1.5 border-t border-white/5 bg-white/[0.02] px-4 py-3">
        {QUICK.map((c) => (
          <button
            key={c}
            onClick={() => run(c)}
            className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-cyanx/40 hover:text-cyanx"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  )
}
