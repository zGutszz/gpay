const socialLinks = [
  {
    name: 'WhatsApp',
    href: 'https://wa.me/5561993972886',
    icon: WhatsAppIcon,
  },
  {
    name: 'Discord',
    href: 'https://discord.com/users/619533459379191839',
    icon: DiscordIcon,
  },
  {
    name: 'GitHub',
    href: 'https://github.com/zGutszz',
    icon: GitHubIcon,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/_andregustav0/',
    icon: InstagramIcon,
  },
]

function SocialFooter() {
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-10 px-4 py-4">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-xs text-violet-100/70 backdrop-blur-md sm:flex-row">
        <p>Made by Andre Gustavo</p>
        <div className="pointer-events-auto flex items-center gap-2">
          {socialLinks.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-300/20 bg-white/5 text-violet-100 transition hover:border-violet-300/60 hover:bg-violet-600/30"
                aria-label={link.name}
                title={link.name}
              >
                <Icon />
              </a>
            )
          })}
        </div>
      </div>
    </footer>
  )
}

function IconShell({ children }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      {children}
    </svg>
  )
}

function WhatsAppIcon() {
  return (
    <IconShell>
      <path d="M5.4 18.7 6.2 15A7.4 7.4 0 1 1 9 17.6l-3.6 1.1Z" />
      <path d="M9.2 8.8c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.6 1.4c.1.2 0 .4-.1.5l-.5.6c.6 1.1 1.5 2 2.7 2.6l.7-.6c.2-.1.4-.2.6-.1l1.4.7c.3.1.4.3.4.6v.4c0 .3-.1.6-.5.8-.8.4-2.4.2-4.4-1.1-1.9-1.2-3.7-3.5-3.7-4.7 0-.5.3-.8.5-1Z" />
    </IconShell>
  )
}

function DiscordIcon() {
  return (
    <IconShell>
      <path d="M8 8.2c2.6-.8 5.4-.8 8 0l1.2 6.5c-1.5 1.1-3 1.7-4.5 1.9l-.6-1.1c-.4 0-.8 0-1.2 0l-.6 1.1c-1.5-.2-3-.8-4.5-1.9L7 8.2Z" />
      <path d="M9.6 12.4h.1M14.3 12.4h.1" strokeLinecap="round" />
    </IconShell>
  )
}

function GitHubIcon() {
  return (
    <IconShell>
      <path d="M9 19c-4 1.2-4-2-5.5-2.5" />
      <path d="M15 22v-3.5c0-1 .1-1.4-.5-2 2-.2 4.1-1 4.1-4.6a3.6 3.6 0 0 0-1-2.5 3.3 3.3 0 0 0-.1-2.5s-.8-.2-2.6 1a8.8 8.8 0 0 0-4.8 0c-1.8-1.2-2.6-1-2.6-1a3.3 3.3 0 0 0-.1 2.5 3.6 3.6 0 0 0-1 2.5c0 3.6 2.1 4.4 4.1 4.6-.4.4-.6.9-.6 1.8V22" />
    </IconShell>
  )
}

function InstagramIcon() {
  return (
    <IconShell>
      <rect x="5" y="5" width="14" height="14" rx="4" />
      <circle cx="12" cy="12" r="3" />
      <path d="M16.5 7.5h.1" strokeLinecap="round" />
    </IconShell>
  )
}

export default SocialFooter
