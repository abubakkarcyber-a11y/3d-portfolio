import { CircleCheck, ExternalLink, FlaskConical, LoaderCircle, Shield } from 'lucide-react'
import { portswigger, tryhackme } from '../../data/content'
import { Reveal, Section } from './Section'

export function Labs() {
  return (
    <Section
      id="labs"
      index="05"
      eyebrow="LABS & PLATFORMS"
      title={
        <>
          Where the practice happens — <span className="text-gradient">live training grounds.</span>
        </>
      }
      lead="Structured, hands-on learning on industry-recognized platforms. Rooms and tracks below are real, verifiable progress."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        {/* TryHackMe */}
        <Reveal delay={0.05}>
          <article className="glass-strong card-hover flex h-full flex-col rounded-3xl p-6 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-cyanx/25 bg-gradient-to-br from-cyanx/12 to-bluex/12 text-cyanx">
                  <Shield size={22} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-frost">TryHackMe</h3>
                  <p className="mt-0.5 text-[12px] text-slate-500">Offensive security &amp; foundational labs</p>
                </div>
              </div>
              <a
                href={tryhackme.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost !rounded-lg !px-3.5 !py-2 text-[12.5px]"
              >
                Profile <ExternalLink size={13} />
              </a>
            </div>

            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-mint">13 rooms completed</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {tryhackme.completed.map((room) => (
                <li key={room} className="chip !text-[12px]">
                  <CircleCheck size={12.5} className="text-mint" />
                  {room}
                </li>
              ))}
            </ul>

            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">ongoing</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tryhackme.ongoing.map((room) => (
                <span key={room} className="chip chip-learning !text-[12px]">
                  <LoaderCircle size={12.5} className="animate-spin-slow text-violetx" />
                  {room}
                </span>
              ))}
            </div>
          </article>
        </Reveal>

        {/* PortSwigger */}
        <Reveal delay={0.12}>
          <article className="glass-strong card-hover flex h-full flex-col rounded-3xl p-6 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl border border-bluex/25 bg-gradient-to-br from-bluex/12 to-cyanx/12 text-bluex">
                  <FlaskConical size={22} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-frost">PortSwigger Web Security Academy</h3>
                  <p className="mt-0.5 text-[12px] text-slate-500">Structured web exploitation practice</p>
                </div>
              </div>
              <a
                href={portswigger.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost !rounded-lg !px-3.5 !py-2 text-[12.5px]"
              >
                Academy <ExternalLink size={13} />
              </a>
            </div>

            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">ongoing tracks</p>
            <ul className="mt-3 space-y-2.5">
              {portswigger.tracks.map((track) => (
                <li
                  key={track}
                  className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <span className="text-[13.5px] font-medium text-slate-200">{track}</span>
                  <span className="rounded-full border border-dashed border-violetx/40 bg-violetx/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-violetx">
                    in progress
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-[12.5px] leading-relaxed text-slate-500">
              Daily lab work on SQL injection, authentication flaws, access control and XSS — the same vulnerability
              classes tested across the portfolio's featured work.
            </p>
          </article>
        </Reveal>
      </div>
    </Section>
  )
}
