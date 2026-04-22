// Animated fake KPI dashboard.
const { useEffect: useEffectD, useState: useStateD, useRef: useRefD } = React;

function Counter({ target, prefix = '', suffix = '', decimals = 0 }) {
  const v = useAnimatedNumber(target, 1600);
  const formatted = v.toFixed(decimals);
  return <span className="tabular-nums">{prefix}{formatted}{suffix}</span>;
}

// Parse a value like "8%+", "30+", "0ms", "17" into number + pre/suffix
function parseValue(s) {
  const m = String(s).match(/^(\+?)(\d+(?:\.\d+)?)(.*)$/);
  if (!m) return { n: 0, pre: '', suf: s };
  return { n: parseFloat(m[2]), pre: m[1], suf: m[3] };
}

function KpiCard({ card, delay }) {
  const { n, pre, suf } = parseValue(card.value);
  return (
    <Reveal delay={delay}>
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-5 overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-400">{card.label}</div>
          <span className="text-[10px] font-mono text-neon px-1.5 py-0.5 rounded bg-neon/10 border border-neon/20">LIVE</span>
        </div>
        <div className="mt-3 text-[44px] md:text-[48px] font-semibold tracking-[-0.02em] leading-none">
          <span className="text-gradient">
            <Counter target={n} prefix={pre} suffix={suf} decimals={0} />
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[12px] font-mono">
          <span className="text-neon">↑</span>
          <span className="text-ink-300">{card.delta}</span>
        </div>
        <div className="mt-4 h-10 -mx-1">
          <Sparkline data={card.spark} />
        </div>
      </div>
    </Reveal>
  );
}

function EventStream({ events, streamLabel }) {
  const [now, setNow] = useStateD(0);
  useEffectD(() => {
    const iv = setInterval(() => setNow(n => (n + 1) % 9999), 2200);
    return () => clearInterval(iv);
  }, []);
  const offset = now % events.length;
  const ordered = [...events.slice(offset), ...events.slice(0, offset)];
  const typeColor = { lead: 'text-neon', ai: 'text-cyan-300', sms: 'text-amber-300', mail: 'text-violet-300', ok: 'text-neon', hook: 'text-pink-300' };
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 overflow-hidden">
      <div className="flex items-center justify-between px-4 h-9 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2 text-[11px] font-mono text-ink-300">
          <span className="inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-neon blink" /> {streamLabel}</span>
        </div>
        <div className="text-[10px] font-mono text-ink-500">hook.ops.granados/events</div>
      </div>
      <div className="p-3 flex flex-col gap-1 font-mono text-[12px] min-h-[220px]">
        {ordered.map((e, i) => (
          <div key={i} className={cx('flex items-start gap-3 px-2 py-1.5 rounded-md transition-all', i === 0 ? 'bg-neon/5 border border-neon/20' : 'border border-transparent', 'animate-[fadeUp_.5s_ease-out_both]')}>
            <span className="text-ink-500 w-8 shrink-0">{e.t}</span>
            <span className={cx('uppercase text-[10px] tracking-wider w-14 shrink-0', typeColor[e.type] || 'text-ink-300')}>{e.type}</span>
            <span className="text-ink-200 truncate">{e.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Live throughput bars that tick
function ThroughputBars({ metricsLabel }) {
  const [bars, setBars] = useStateD(() => Array.from({ length: 24 }, (_, i) => 20 + Math.sin(i * 0.6) * 14 + Math.random() * 20));
  useEffectD(() => {
    const iv = setInterval(() => {
      setBars(b => [...b.slice(1), Math.max(8, Math.min(80, b[b.length - 1] + (Math.random() * 22 - 11)))]);
    }, 700);
    return () => clearInterval(iv);
  }, []);
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-400">{metricsLabel}</div>
        <div className="text-[11px] font-mono text-neon">+12.4%</div>
      </div>
      <div className="flex items-end gap-1 h-[88px]">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-neon/10 via-neon/50 to-neon" style={{ height: `${b}%`, transition: 'height 600ms cubic-bezier(.3,.7,.2,1)' }} />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-mono text-ink-500">
        <span>-24h</span><span>-12h</span><span>now</span>
      </div>
    </div>
  );
}

function Dashboard({ lang }) {
  const t = useI18n(lang);
  return (
    <Section id="dashboard" className="py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 max-w-[880px]">
        <div>
          <Eyebrow>{t.kpi.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.01em] text-gradient">{t.kpi.title}</h2>
          <p className="mt-4 text-[16px] text-ink-300 max-w-[58ch]">{t.kpi.sub}</p>
        </div>
      </div>

      {/* KPI cards row */}
      <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {t.kpi.cards.map((c, i) => <KpiCard key={i} card={c} delay={i * 0.06} />)}
      </div>

      {/* Fake dashboard frame */}
      <Reveal delay={0.1} className="mt-8">
        <div className="relative rounded-2xl border border-white/10 bg-ink-900/70 overflow-hidden">
          <div className="flex items-center justify-between h-11 px-5 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-neon blink" />
              <div className="leading-tight">
                <div className="text-[13px] font-semibold">{t.kpi.panel.title}</div>
                <div className="text-[10px] font-mono text-ink-500">{t.kpi.panel.subtitle}</div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              {['1h','24h','7d','30d'].map((r,i)=>(
                <span key={r} className={cx('px-2 h-6 inline-flex items-center rounded text-[11px] font-mono', i===1?'bg-neon/10 text-neon border border-neon/20':'text-ink-400 border border-white/10')}>{r}</span>
              ))}
            </div>
          </div>
          <div className="p-5 grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 flex flex-col gap-4">
              <ThroughputBars metricsLabel={t.kpi.panel.metricsLabel} />
              <div className="grid grid-cols-3 gap-3">
                <MiniKPI label={lang==='es'?'Tasa conv.':'Conv. rate'} v="4.2%" trend="up" />
                <MiniKPI label={lang==='es'?'Tiempo ciclo':'Cycle time'} v="2.1d" trend="down" />
                <MiniKPI label={lang==='es'?'Cola eventos':'Event queue'} v="0" trend="ok" />
              </div>
            </div>
            <div className="lg:col-span-2">
              <EventStream events={t.kpi.events} streamLabel={t.kpi.panel.streamLabel} />
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function MiniKPI({ label, v, trend }) {
  const color = trend === 'up' ? 'text-neon' : trend === 'down' ? 'text-cyan-300' : 'text-ink-200';
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—';
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3">
      <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-500">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-[22px] font-semibold tabular-nums">{v}</span>
        <span className={cx('text-[12px] font-mono', color)}>{arrow}</span>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
