// Sticky header + EN/ES toggle + theme toggle.
const { useState: useStateH, useEffect: useEffectH } = React;

function LangToggle({ lang, setLang }) {
  return (
    <div className="inline-flex items-center h-9 rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-[12px] font-mono">
      {['EN', 'ES'].map((L) => {
        const v = L.toLowerCase();
        const active = lang === v;
        return (
          <button key={v} onClick={() => setLang(v)} className={cx(
            'h-8 px-3 rounded-full transition-colors',
            active ? 'bg-neon text-ink-950' : 'text-ink-200 hover:text-white',
          )}>{L}</button>
        );
      })}
    </div>
  );
}

function ThemeToggle({ theme, setTheme }) {
  const isLight = theme === 'light';
  return (
    <button
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      className="relative inline-flex items-center h-9 w-[62px] rounded-full border border-white/10 bg-white/[0.03] p-0.5 transition-colors group"
    >
      <span
        className={cx(
          'absolute top-0.5 w-8 h-8 rounded-full bg-neon/15 border border-neon/40 transition-all duration-300 ease-out flex items-center justify-center',
          isLight ? 'left-[26px]' : 'left-0.5'
        )}
      >
        {isLight ? (
          <svg width="14" height="14" viewBox="0 0 16 16" className="text-neon"><circle cx="8" cy="8" r="3" fill="currentColor"/><g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.3 3.3l1.4 1.4M11.3 11.3l1.4 1.4M12.7 3.3l-1.4 1.4M4.7 11.3l-1.4 1.4"/></g></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 16 16" className="text-neon"><path d="M13.5 9.5A5.5 5.5 0 1 1 6.5 2.5a4.5 4.5 0 0 0 7 7Z" fill="currentColor"/></svg>
        )}
      </span>
      <span className={cx('w-8 h-8 inline-flex items-center justify-center text-ink-400 transition-opacity', isLight ? 'opacity-100' : 'opacity-30')}>
        <svg width="13" height="13" viewBox="0 0 16 16"><path d="M13.5 9.5A5.5 5.5 0 1 1 6.5 2.5a4.5 4.5 0 0 0 7 7Z" fill="currentColor"/></svg>
      </span>
      <span className={cx('w-8 h-8 inline-flex items-center justify-center text-ink-400 transition-opacity', isLight ? 'opacity-30' : 'opacity-100')}>
        <svg width="13" height="13" viewBox="0 0 16 16"><circle cx="8" cy="8" r="3" fill="currentColor"/><g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.3 3.3l1.4 1.4M11.3 11.3l1.4 1.4M12.7 3.3l-1.4 1.4M4.7 11.3l-1.4 1.4"/></g></svg>
      </span>
    </button>
  );
}

function Header({ lang, setLang, theme, setTheme, calendarUrl }) {
  const t = useI18n(lang);
  const [scrolled, setScrolled] = useStateH(false);
  const [open, setOpen] = useStateH(false);
  useEffectH(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const navItems = [
    { href: '#services', label: t.nav.services },
    { href: '#dashboard', label: t.nav.dashboard },
    { href: '#flow', label: t.nav.flow },
    { href: '#about', label: t.nav.about },
    { href: '#work', label: t.nav.work },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header className={cx(
      'fixed top-0 left-0 right-0 z-40 transition-all',
      scrolled ? 'backdrop-blur-xl bg-ink-950/70 border-b border-white/[0.06]' : 'bg-transparent',
    )}>
      <div className="mx-auto max-w-[1240px] px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Brand */}
        <a href="#top" className="group flex items-center gap-2.5">
          <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-ink-900 border border-white/10 overflow-hidden">
            <img src="assets/angel.png" alt="Ángel Granados" className="absolute inset-0 w-full h-full object-cover" />
            <span className="absolute -inset-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ boxShadow: '0 0 20px rgba(0,255,136,0.5)' }}></span>
          </span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-tight">Ángel Granados Verde</div>
            <div className="text-[11px] text-ink-400 font-mono">automation.engineer</div>
          </div>
        </a>

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navItems.map((n) => (
            <a key={n.href} href={n.href} className="px-3 h-9 inline-flex items-center text-[13px] text-ink-200 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors">
              {n.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block"><ThemeToggle theme={theme} setTheme={setTheme} /></div>
          <div className="hidden md:block"><LangToggle lang={lang} setLang={setLang} /></div>
          <Button as="a" href={calendarUrl} target="_blank" rel="noreferrer" className="hidden sm:inline-flex">
            <Icon.Cal /> <span>{t.nav.cta}</span>
          </Button>
          <button className="lg:hidden w-9 h-9 inline-flex items-center justify-center rounded-lg border border-white/10" onClick={() => setOpen(o => !o)} aria-label="menu">
            <svg width="16" height="16" viewBox="0 0 16 16"><path d={open ? 'M3 3l10 10M13 3 3 13' : 'M2 5h12M2 11h12'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="lg:hidden border-t border-white/10 bg-ink-900/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-1">
            {navItems.map(n => (
              <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2.5 text-[14px] text-ink-100 border-b border-white/5">
                {n.label}
              </a>
            ))}
            <div className="pt-4 flex items-center gap-2 flex-wrap">
              <ThemeToggle theme={theme} setTheme={setTheme} />
              <LangToggle lang={lang} setLang={setLang} />
              <Button as="a" href={calendarUrl} target="_blank" rel="noreferrer"><Icon.Cal /> {t.nav.cta}</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

Object.assign(window, { Header });
