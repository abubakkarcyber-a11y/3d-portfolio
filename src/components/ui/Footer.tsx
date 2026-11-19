import { ArrowUp, Github, Linkedin, Shield } from 'lucide-react'
import { profile } from '../../data/content'

const FOOT_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'labs', label: 'Labs' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="relative border-t border-white/5 bg-ink/60 py-12">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <a href="#home" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-cyanx/30 bg-gradient-to-br from-cyanx/15 to-violetx/15 font-display text-[13px] font-bold text-cyanx">
                MA
              </span>
              <span className="font-display text-[15px] font-semibold tracking-tight text-frost">
                Muhammad Abubakkar<span className="text-cyanx">.</span>
              </span>
            </a>
            <p className="mt-3 max-w-sm text-[12.5px] leading-relaxed text-slate-500">
              Breaking systems safely. Building intelligent solutions.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Footer">
            {FOOT_LINKS.map((l) => (
              <a key={l.id} href={`#${l.id}`} className="text-[13px] text-mist transition-colors hover:text-cyanx">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {[
              { icon: Github, href: profile.github, label: 'GitHub' },
              { icon: Linkedin, href: profile.linkedin, label: 'LinkedIn' },
              { icon: Shield, href: profile.tryhackme, label: 'TryHackMe' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="glass rounded-xl p-2.5 text-mist transition-colors hover:text-cyanx"
              >
                <s.icon size={16} />
              </a>
            ))}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              className="glass rounded-xl p-2.5 text-mist transition-colors hover:text-cyanx"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/5 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11.5px] text-slate-600">
            © {year} Muhammad Abubakkar — built with React, Three.js &amp; Kali Linux.
          </p>
          <p className="font-mono text-[11.5px] text-slate-600">
            <span className="text-cyanx/70">analyst@abubakkar</span>:~$ <span className="text-slate-400">status</span> → open to work
          </p>
        </div>
      </div>
    </footer>
  )
}
