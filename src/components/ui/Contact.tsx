import { useState } from 'react'
import { Check, Copy, Github, Linkedin, Mail, MapPin, MessageCircle, Phone, Send, Shield } from 'lucide-react'
import { profile } from '../../data/content'
import { Reveal, Section } from './Section'

interface FormState {
  name: string
  email: string
  message: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: FormState): Partial<FormState> {
  const errors: Partial<FormState> = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your name (at least 2 characters).'
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (values.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.'
  return errors
}

const fieldCls =
  'w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[14px] text-frost placeholder:text-slate-600 transition-colors focus:border-cyanx/50 focus:outline-none'

export function Contact() {
  const [values, setValues] = useState<FormState>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof FormState, boolean>>>({})
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)

  const set = (key: keyof FormState, v: string) => {
    const next = { ...values, [key]: v }
    setValues(next)
    if (touched[key]) setErrors(validate(next))
  }

  const blur = (key: keyof FormState) => {
    setTouched((t) => ({ ...t, [key]: true }))
    setErrors(validate(values))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate(values)
    setErrors(errs)
    setTouched({ name: true, email: true, message: true })
    if (Object.keys(errs).length > 0) return
    const subject = encodeURIComponent(`Portfolio contact — ${values.name.trim()}`)
    const body = encodeURIComponent(
      `Hi Abubakkar,\n\n${values.message.trim()}\n\n— ${values.name.trim()}\nReply to: ${values.email.trim()}`
    )
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = profile.email
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const channels = [
    { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: MessageCircle, label: 'WhatsApp', value: profile.phone, href: profile.whatsapp },
    { icon: Linkedin, label: 'LinkedIn', value: 'muhammad-abubakkar', href: profile.linkedin },
    { icon: Github, label: 'GitHub', value: 'abubakkarcyber-a11y', href: profile.github },
    { icon: Shield, label: 'TryHackMe', value: 'p/haqgroup', href: profile.tryhackme },
  ]

  return (
    <Section
      id="contact"
      index="08"
      eyebrow="CONTACT"
      title={
        <>
          Let's build something <span className="text-gradient">meaningful together.</span>
        </>
      }
      lead="Open to cybersecurity internships, entry-level opportunities, freelance engagements, AI application development, and software development collaborations."
    >
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        {/* channels */}
        <Reveal delay={0.05}>
          <div className="space-y-3">
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="glass card-hover group flex items-center gap-4 rounded-2xl p-4"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyanx/25 bg-gradient-to-br from-cyanx/12 to-violetx/12 text-cyanx transition-shadow group-hover:shadow-glow">
                  <c.icon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-slate-500">{c.label}</span>
                  <span className="block truncate text-[14px] font-medium text-frost">{c.value}</span>
                </span>
              </a>
            ))}

            <div className="flex gap-3 pt-1">
              <button onClick={copyEmail} className="btn-ghost flex-1 !px-4 !py-3 text-[13.5px]">
                {copied ? <Check size={15} className="text-mint" /> : <Copy size={15} />}
                {copied ? 'Copied!' : 'Copy email'}
              </button>
              <a href={profile.phoneHref} className="btn-ghost flex-1 !px-4 !py-3 text-[13.5px]">
                <Phone size={15} /> Call
              </a>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[13px] text-slate-500">
              <MapPin size={14} className="text-cyanx" />
              Swabi, Pakistan · available remotely &amp; on-site
            </div>
          </div>
        </Reveal>

        {/* form */}
        <Reveal delay={0.12}>
          <form onSubmit={submit} noValidate className="glass-strong rounded-3xl p-6 shadow-panel md:p-7">
            <h3 className="font-display text-lg font-bold tracking-tight text-frost">Send a message</h3>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="c-name" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Name
                </label>
                <input
                  id="c-name"
                  className={fieldCls}
                  value={values.name}
                  onChange={(e) => set('name', e.target.value)}
                  onBlur={() => blur('name')}
                  placeholder="Your name"
                  autoComplete="name"
                />
                {touched.name && errors.name && <p className="mt-1.5 text-[12px] text-rose-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="c-email" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Email
                </label>
                <input
                  id="c-email"
                  type="email"
                  className={fieldCls}
                  value={values.email}
                  onChange={(e) => set('email', e.target.value)}
                  onBlur={() => blur('email')}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {touched.email && errors.email && <p className="mt-1.5 text-[12px] text-rose-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="c-msg" className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  Message
                </label>
                <textarea
                  id="c-msg"
                  rows={5}
                  className={`${fieldCls} resize-none`}
                  value={values.message}
                  onChange={(e) => set('message', e.target.value)}
                  onBlur={() => blur('message')}
                  placeholder="Tell me about the role, project or idea…"
                />
                {touched.message && errors.message && <p className="mt-1.5 text-[12px] text-rose-400">{errors.message}</p>}
              </div>

              <button type="submit" className="btn-primary w-full text-[14.5px]">
                <Send size={16} /> Send message
              </button>

              {sent && (
                <p className="rounded-xl border border-mint/25 bg-mint/[0.07] px-4 py-3 text-[12.5px] leading-relaxed text-mint">
                  Your email app should be opening with the message pre-filled. If it didn't, write directly to{' '}
                  <a className="underline" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                </p>
              )}
              <p className="text-[11.5px] leading-relaxed text-slate-600">
                This form opens your own email client — nothing is stored or sent anywhere else.
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  )
}
