/**
 * Central content model for the portfolio.
 * All personal data lives here — components stay presentational.
 */

export type TechState = 'used' | 'learning'

export interface StageProject {
  id: string
  index: string // "01"
  title: string
  tagline: string
  image: string
  accent: string // hex, drives glow / edge lighting
  description: string
  features: string[]
  tech: { name: string; state: TechState }[]
}

export const IMG_BASE = `${import.meta.env.BASE_URL}images/`

export const profile = {
  name: 'Muhammad Abubakkar',
  firstName: 'Abubakkar',
  headline: 'Breaking systems safely. Building intelligent solutions.',
  roles: ['Cybersecurity Student', 'Ethical Hacker', 'AI Application Developer', 'Vibe Coder', 'Web Application Developer'],
  intro:
    "I'm a BS Computer Science student with over three years of self-directed, hands-on cybersecurity practice. Alongside security research, I build practical AI-powered applications and web platforms using modern development tools and AI-assisted coding workflows.",
  intro2:
    'I enjoy understanding how systems work, identifying vulnerabilities, and transforming ideas into useful digital products.',
  status: 'OPEN TO WORK',
  location: 'Swabi, Pakistan',
  email: 'abubakkar.cyber@gmail.com',
  phone: '+92 344 946 7911',
  phoneHref: 'tel:+923449467911',
  whatsapp: 'https://wa.me/923449467911',
  linkedin: 'https://www.linkedin.com/in/muhammad-abubakkar-3a825a389',
  github: 'https://github.com/abubakkarcyber-a11y',
  tryhackme: 'https://tryhackme.com/p/haqgroup',
  cv: `${import.meta.env.BASE_URL}Muhammad-Abubakkar-CV.pdf`,
}

/* ------------------------------------------------------------------ */
/* 3D stage projects — the three uploaded images                       */
/* ------------------------------------------------------------------ */

export const stageProjects: StageProject[] = [
  {
    id: 'ai',
    index: '01',
    title: 'Artificial Intelligence & Agentic AI',
    tagline: 'Intelligent applications, built with AI in the loop',
    image: `${IMG_BASE}ai-expert.jpg`,
    accent: '#8b5cf6',
    description:
      'I explore AI application development, intelligent automation, AI-assisted development, and emerging agentic AI systems. I use modern AI tools and vibe-coding workflows to transform ideas into functional applications.',
    features: [
      'AI application development',
      'AI-assisted coding',
      'Vibe coding workflows',
      'Agentic AI systems — learning',
      'AI-powered automation',
      'Intelligent application workflows',
    ],
    tech: [
      { name: 'AI App Development', state: 'used' },
      { name: 'AI-Assisted Coding', state: 'used' },
      { name: 'Vibe Coding', state: 'used' },
      { name: 'Web App Development', state: 'used' },
      { name: 'Agentic AI', state: 'learning' },
      { name: 'Agent Workflows', state: 'learning' },
    ],
  },
  {
    id: 'cyber',
    index: '02',
    title: 'Cybersecurity & Ethical Hacking',
    tagline: 'Breaking systems safely — three years of hands-on practice',
    image: `${IMG_BASE}cyber-security.jpg`,
    accent: '#3b82f6',
    description:
      'Hands-on offensive security practice across authorized labs and platforms: penetration testing, web application security, OSINT-driven reconnaissance, vulnerability assessment and continuous security research on Kali Linux.',
    features: [
      'Penetration testing',
      'Web application security',
      'Vulnerability assessment',
      'OSINT & reconnaissance',
      'Linux security operations',
      'Security research & CVE tracking',
    ],
    tech: [
      { name: 'Kali Linux', state: 'used' },
      { name: 'Burp Suite', state: 'used' },
      { name: 'SQLi · XSS', state: 'used' },
      { name: 'IDOR & Access Control', state: 'used' },
      { name: 'OWASP Top 10', state: 'used' },
      { name: 'Malware Analysis', state: 'learning' },
    ],
  },
  {
    id: 'network',
    index: '03',
    title: 'Network Analysis & Infrastructure',
    tagline: 'Understanding traffic — from packets to protocols',
    image: `${IMG_BASE}networking.jpg`,
    accent: '#34d399',
    description:
      'Network analysis and infrastructure fundamentals: packet-level traffic inspection, reconnaissance, protocol analysis and network security labs using industry-standard tooling.',
    features: [
      'Traffic analysis with Wireshark & TShark',
      'Reconnaissance with Nmap / Zenmap',
      'TCP/IP protocol analysis',
      'DNS enumeration & analysis',
      'Network attack-surface mapping',
      'TryHackMe networking labs',
    ],
    tech: [
      { name: 'Wireshark', state: 'used' },
      { name: 'TShark', state: 'used' },
      { name: 'Nmap / Zenmap', state: 'used' },
      { name: 'TCP/IP', state: 'used' },
      { name: 'DNS', state: 'used' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Featured software builds                                            */
/* ------------------------------------------------------------------ */

export interface Build {
  id: string
  title: string
  badge: string
  icon: 'school' | 'cart'
  description: string
  features: string[]
  stack: string[]
}

export const builds: Build[] = [
  {
    id: 'school',
    title: 'Smart School Management System',
    badge: 'Desktop · Local Network',
    icon: 'school',
    description:
      'A comprehensive school management solution designed to simplify school operations, academic administration, student management, and financial workflows.',
    features: [
      'Student admission & management',
      'Teacher & staff management',
      'Attendance tracking',
      'Fee management',
      'Payroll & accounts',
      'Examinations & report cards',
      'Timetable management',
      'Parent communication',
      'Offline desktop application',
      'Local network accessibility',
    ],
    stack: ['Desktop App', 'Local Network', 'Academic Admin', 'Finance Workflows'],
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Platform Development',
    badge: 'Web · Modern Shopping',
    icon: 'cart',
    description:
      'An e-commerce platform concept focused on modern online shopping experiences, product management, business operations, and user-friendly interfaces.',
    features: [
      'Product management',
      'Shopping experience',
      'Customer management',
      'Order management',
      'Inventory workflows',
      'Admin dashboard',
      'Responsive design',
      'Modern web application development',
    ],
    stack: ['Web Platform', 'Admin Dashboard', 'Inventory', 'Responsive UI'],
  },
]

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export interface SkillCategory {
  id: string
  title: string
  icon: 'sword' | 'shield' | 'network' | 'radar' | 'code' | 'sprout'
  blurb: string
  skills: { name: string; learning?: boolean }[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'offensive',
    title: 'Offensive Security',
    icon: 'sword',
    blurb: 'Authorized offensive practice in lab environments',
    skills: [
      { name: 'Penetration Testing' },
      { name: 'Ethical Hacking' },
      { name: 'Vulnerability Assessment' },
      { name: 'OWASP Top 10' },
    ],
  },
  {
    id: 'websec',
    title: 'Web Application Security',
    icon: 'shield',
    blurb: 'Finding and understanding web vulnerabilities',
    skills: [
      { name: 'Burp Suite' },
      { name: 'SQL Injection' },
      { name: 'XSS' },
      { name: 'Access Control / IDOR' },
    ],
  },
  {
    id: 'network',
    title: 'Network Analysis',
    icon: 'network',
    blurb: 'Packet-level visibility and enumeration',
    skills: [
      { name: 'Wireshark / TShark' },
      { name: 'Nmap / Zenmap' },
      { name: 'TCP/IP' },
      { name: 'DNS' },
    ],
  },
  {
    id: 'osint',
    title: 'Reconnaissance & OSINT',
    icon: 'radar',
    blurb: 'Mapping attack surfaces from the outside in',
    skills: [
      { name: 'Shodan' },
      { name: 'Google Dorking' },
      { name: 'Enumeration' },
    ],
  },
  {
    id: 'programming',
    title: 'Programming & Systems',
    icon: 'code',
    blurb: 'Automation, scripting and administration',
    skills: [
      { name: 'Python' },
      { name: 'Bash' },
      { name: 'C / C++' },
      { name: 'Linux Administration' },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Application Development',
    icon: 'sprout',
    blurb: 'Turning ideas into working software, with AI in the loop',
    skills: [
      { name: 'AI Application Development' },
      { name: 'AI-Assisted Coding' },
      { name: 'Vibe Coding' },
      { name: 'Web Application Development' },
      { name: 'Agentic AI', learning: true },
    ],
  },
]

export const currentlyLearning = [
  'IoT Hacking',
  'Malware Analysis',
  'Android Security',
  'Network Attacks',
  'Web Exploitation',
  'Agentic AI Development',
]

/* ------------------------------------------------------------------ */
/* Hands-on experience                                                 */
/* ------------------------------------------------------------------ */

export const handsOn = [
  'Operating Kali Linux as a daily driver for security work',
  'Testing web applications in authorized lab environments',
  'Hands-on SQL injection and XSS testing practice',
  'Reconnaissance using Nmap and OSINT tooling',
  'Network traffic analysis with Wireshark',
  'Python and Bash scripting for security automation',
  'Studying reverse engineering & Linux privilege escalation',
  'Tracking CVEs and security advisories',
]

/* ------------------------------------------------------------------ */
/* Labs & platforms                                                    */
/* ------------------------------------------------------------------ */

export const tryhackme = {
  url: profile.tryhackme,
  completed: [
    'OWASP Juice Shop',
    'SQL Injection',
    'Vulnversity',
    'WebGOAT',
    'Shodan.io & Google Dorking',
    'Active & Passive Reconnaissance',
    'DNS in Detail',
    'Directory Busting with ffuf',
    'TShark Network Analysis',
    'Linux Fundamentals & Strength Training',
    'Sakura OSINT Investigation',
    'Printer Hacking 101',
    'Introductory Networking',
  ],
  ongoing: ['Offensive Security Intro'],
}

export const portswigger = {
  url: 'https://portswigger.net/web-security',
  tracks: [
    'SQL Injection',
    'Authentication Vulnerabilities',
    'Access Control & IDOR',
    'Cross-Site Scripting',
  ],
}

/* ------------------------------------------------------------------ */
/* Certifications                                                      */
/* ------------------------------------------------------------------ */

export interface Certification {
  title: string
  provider: string
  date: string
  verify?: string
  detail?: string
  badge?: string
  inProgress?: boolean
}

export const certifications: Certification[] = [
  {
    title: 'Certified Ethical Hacking (v12) — Specialization',
    provider: 'Coursera · LearnKartS',
    date: 'July 2025',
    verify: 'https://coursera.org/verify/specialization/XCW138M44H2R',
    badge: 'Specialization',
  },
  {
    title: 'Ethical Hacking Essentials (EHE)',
    provider: 'Coursera · EC-Council',
    date: 'July 2025',
    verify: 'https://coursera.org/verify/LOWSMXXOM2QK',
  },
  {
    title: 'The Complete Ethical Hacking Course',
    provider: 'Coursera · Packt',
    date: 'December 2025',
    verify: 'https://coursera.org/verify/specialization/31U4APNWZ4C0',
    badge: 'Specialization',
  },
  {
    title: 'Generative AI Application Developer',
    provider: 'UETIANS Lahore Endowment Foundation, USA',
    date: 'December 2025',
    detail: 'Credential ID: 3122d165a3dbc949',
    badge: 'Top Performer',
  },
  {
    title: 'Cybersecurity and Ethical Hacking in Hindi',
    provider: 'Udemy · Start-Tech Academy',
    date: 'July 2025',
    detail: '15.5 hours of coursework',
  },
  {
    title: 'Ethically Hack the Planet — Part 2',
    provider: 'Udemy · Cyber Twinkle',
    date: 'February 2025',
  },
  {
    title: 'Complete Ethical Hacking — Multi-Domain Track',
    provider: 'Multi-domain security track',
    date: 'Ongoing',
    detail: 'IoT · Web · Network · Malware · Android Security',
    inProgress: true,
  },
]

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

export interface Education {
  degree: string
  institution: string
  place: string
  period: string
  current?: boolean
}

export const education: Education[] = [
  {
    degree: 'BS Computer Science',
    institution: 'University of Swabi',
    place: 'Swabi, Pakistan',
    period: '2024 — Present',
    current: true,
  },
  {
    degree: 'ICS — Intermediate in Computer Science',
    institution: 'Government Degree College Chota Lahore',
    place: 'Swabi',
    period: '2024',
  },
  {
    degree: 'Matriculation',
    institution: 'Shahzad Children Academy',
    place: 'Lahore, Swabi',
    period: '2022',
  },
]

/* ------------------------------------------------------------------ */
/* Quick facts (About)                                                 */
/* ------------------------------------------------------------------ */

export const quickFacts = [
  { icon: 'pin', label: 'Location', value: 'Swabi, Pakistan' },
  { icon: 'terminal', label: 'Primary OS', value: 'Kali Linux' },
  { icon: 'grad', label: 'Education', value: 'BS Computer Science' },
  { icon: 'shield', label: 'Security Focus', value: 'Pentesting & Web AppSec' },
  {
    icon: 'brain',
    label: 'Currently Learning',
    value: 'IoT · Malware Analysis · Android Security · Agentic AI',
  },
  { icon: 'badge', label: 'Availability', value: 'Open to Work' },
] as const

/* ------------------------------------------------------------------ */
/* Terminal script                                                     */
/* ------------------------------------------------------------------ */

export interface TermLine {
  kind: 'cmd' | 'out' | 'dim' | 'ok' | 'accent'
  text: string
}

export const terminalBoot: TermLine[] = [
  { kind: 'cmd', text: 'whoami' },
  { kind: 'out', text: 'muhammad_abubakkar' },
  { kind: 'cmd', text: 'cat status.txt' },
  { kind: 'ok', text: 'ACTIVE — OPEN TO CYBERSECURITY OPPORTUNITIES' },
  { kind: 'cmd', text: 'ls focus/' },
  { kind: 'accent', text: 'pentesting  web-appsec  network-analysis  osint  ai-development' },
]

export const terminalHelp: TermLine[] = [
  { kind: 'dim', text: '# available commands' },
  { kind: 'out', text: 'help        show this list' },
  { kind: 'out', text: 'whoami      who is this analyst' },
  { kind: 'out', text: 'status      current availability' },
  { kind: 'out', text: 'ls focus/   current focus areas' },
  { kind: 'out', text: 'skills      tooling snapshot' },
  { kind: 'out', text: 'labs        training platforms' },
  { kind: 'out', text: 'certs       certifications' },
  { kind: 'out', text: 'contact     reach out' },
  { kind: 'out', text: 'clear       wipe the screen' },
]

export const terminalCommands: Record<string, TermLine[]> = {
  skills: [
    { kind: 'dim', text: '# a snapshot — not a complete inventory' },
    { kind: 'accent', text: 'kali-linux  burp-suite  wireshark  tshark  nmap  shodan' },
    { kind: 'accent', text: 'python      bash        sqlmap? no — manual sqli first.' },
    { kind: 'accent', text: 'learning →  iot · malware-analysis · android-security · agentic-ai' },
  ],
  labs: [
    { kind: 'out', text: 'tryhackme    → tryhackme.com/p/haqgroup   (13 rooms completed)' },
    { kind: 'out', text: 'portswigger  → web security academy       (4 tracks ongoing)' },
  ],
  certs: [
    { kind: 'out', text: 'certified ethical hacking v12 (specialization) — 2025' },
    { kind: 'out', text: 'ethical hacking essentials EHE (ec-council)   — 2025' },
    { kind: 'out', text: 'complete ethical hacking course (packt)       — 2025' },
    { kind: 'out', text: 'generative ai application developer (uetians) — top performer' },
  ],
  contact: [
    { kind: 'ok', text: 'email     abubakkar.cyber@gmail.com' },
    { kind: 'out', text: 'linkedin  /in/muhammad-abubakkar-3a825a389' },
    { kind: 'out', text: 'github    @abubakkarcyber-a11y' },
    { kind: 'out', text: 'location  swabi, pakistan' },
  ],
  nmap: [
    { kind: 'dim', text: '# real scans only against targets you are authorized to test.' },
    { kind: 'out', text: 'nmap -sV -sC --top-ports 1000 <authorized-target>' },
    { kind: 'dim', text: '# practice safely: tryhackme rooms, portswigger labs, home lab VMs.' },
  ],
  sudo: [
    { kind: 'accent', text: 'privilege escalation? nice try — only in authorized labs.' },
  ],
  banner: [
    { kind: 'accent', text: '  breaking systems safely. building intelligent solutions.' },
  ],
}
