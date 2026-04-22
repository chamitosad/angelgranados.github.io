// Hero section — big headline, live status pill, CTAs, logo marquee, status widget.
const { useEffect: useEffectHero, useState: useStateHero } = React;

function LiveStatusChip({ label }) {
  return (
    <div className="relative inline-flex items-center gap-2 h-8 pl-2 pr-3 rounded-full border border-white/10 bg-white/[0.03] font-mono text-[11px] text-ink-200">
      <span className="relative inline-flex">
        <span className="w-2 h-2 rounded-full bg-neon"></span>
        <span className="absolute inset-0 w-2 h-2 rounded-full bg-neon pulse-ring"></span>
      </span>
      <span>{label}</span>
    </div>
  );
}

function HeroTerminal({ lang }) {
  // Mini terminal running a fake deploy.
  const lines = lang === 'es' ? [
    { p: '~/ops', c: 'make scenarios:deploy --env=prod', tone: 'user' },
    { c: '→ compilando 18 escenarios...', tone: 'muted' },
    { c: '→ webhooks: 24 rutas registradas', tone: 'muted' },
    { c: '→ CRM sub-accounts: 3 sincronizadas', tone: 'muted' },
    { c: '✓ deploy exitoso · 218ms', tone: 'ok' },
    { c: '  ops.granados watching events...', tone: 'muted blink' },
  ] : [
    { p: '~/ops', c: 'make scenarios:deploy --env=prod', tone: 'user' },
    { c: '→ compiling 18 scenarios...', tone: 'muted' },
    { c: '→ webhooks: 24 routes registered', tone: 'muted' },
    { c: '→ CRM sub-accounts: 3 synced', tone: 'muted' },
    { c: '✓ deploy successful · 218ms', tone: 'ok' },
    { c: '  ops.granados watching events...', tone: 'muted blink' },
  ];
  const [n, setN] = useStateHero(0);
  useEffectHero(() => {
    let i = 0;
    const iv = setInterval(() => {
      i = Math.min(i + 1, lines.length);
      setN(i);
      if (i >= lines.length) clearInterval(iv);
    }, 380);
    return () => clearInterval(iv);
  }, [lang]);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-ink-900/80 overflow-hidden surface-card">
      <span className="halo rounded-2xl" aria-hidden="true"></span>
      <div className="flex items-center justify-between px-4 h-10 border-b border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]/80"></span>
        </div>
        <div className="font-mono text-[11px] text-ink-400">ops.granados — zsh</div>
        <div className="font-mono text-[11px] text-ink-500">ssh</div>
      </div>
      <div className="p-4 font-mono text-[12.5px] leading-[1.7] min-h-[180px]">
        {lines.slice(0, n).map((l, i) => (
          <div key={i} className={cx(
            l.tone.includes('user') && 'text-ink-100',
            l.tone.includes('muted') && 'text-ink-400',
            l.tone.includes('ok') && 'text-neon',
            l.tone.includes('blink') && 'blink',
          )}>
            {l.p && <span className="text-ink-500">{l.p} </span>}
            {l.tone.includes('user') && <span className="text-neon">$ </span>}
            {l.c}
          </div>
        ))}
        {n >= lines.length && (
          <div className="text-ink-400">
            <span className="text-neon">$ </span><span className="inline-block w-1.5 h-4 align-middle bg-neon blink ml-1"></span>
          </div>
        )}
      </div>
    </div>
  );
}

function LogoMarquee({ items }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="marquee-track flex gap-10 whitespace-nowrap">
        {doubled.map((n, i) => (
          <div key={i} className="flex items-center gap-2 text-ink-400 text-[13px] font-mono">
            <Icon.Dot className="text-neon/60" />
            <span>{n}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hero({ lang, calendarUrl }) {
  const t = useI18n(lang);

  return (
    <Section id="top" className="pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* bg effects */}
      <div aria-hidden="true" className="absolute inset-0 bg-grid pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,255,136,0.12), transparent 60%)',
      }} />
      <div className="orb bg-neon/25 w-[480px] h-[480px] -top-40 -right-32" />
      <div className="orb bg-cyan-400/10 w-[320px] h-[320px] top-40 -left-20" />

      <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="fade-up flex flex-wrap items-center gap-2">
            <LiveStatusChip label={t.hero.status} />
            <Chip><Icon.Globe className="text-neon" /> {t.hero.bilingual}</Chip>
          </div>
          <h1 className="fade-up fade-up-delay-1 text-[clamp(36px,6vw,72px)] leading-[1.02] tracking-[-0.02em] font-semibold">
            <span className="text-gradient block">{t.hero.headline[0]}</span>
            <span className="block text-neon" style={{ textShadow: '0 0 50px rgba(0,255,136,0.35)' }}>{t.hero.headline[1]}</span>
          </h1>
          <p className="fade-up fade-up-delay-2 text-[17px] md:text-[18px] text-ink-300 max-w-[640px] leading-relaxed">
            {t.hero.sub}
          </p>
          <div className="fade-up fade-up-delay-3 flex flex-wrap items-center gap-3 pt-1">
            <Button as="a" href={calendarUrl} target="_blank" rel="noreferrer">
              <Icon.Cal /> <span>{t.hero.cta}</span> <Icon.Arrow />
            </Button>
            <Button as="a" href="#services" variant="ghost">
              <Icon.Stack /> {t.hero.ghost}
            </Button>
          </div>
          <div className="fade-up fade-up-delay-4 pt-2">
            <div className="text-[11px] uppercase tracking-[0.18em] font-mono text-ink-500 mb-3">{t.stack.label}</div>
            <LogoMarquee items={t.stack.items} />
          </div>
        </div>

        <div className="lg:col-span-5 fade-up fade-up-delay-2">
          <HeroTerminal lang={lang} />
          {/* small status row below terminal */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <MiniStat label={lang === 'es' ? 'Uptime' : 'Uptime'} value="99.98%" />
            <MiniStat label={lang === 'es' ? 'Escenarios' : 'Scenarios'} value="120+" />
            <MiniStat label={lang === 'es' ? 'Clientes' : 'Clients'} value="6 active" />
          </div>
        </div>
      </div>
    </Section>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-[0.14em] font-mono text-ink-500">{label}</div>
      <div className="text-[15px] font-semibold mt-0.5">{value}</div>
    </div>
  );
}

Object.assign(window, { Hero });
