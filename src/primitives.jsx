// Small reusable UI bits.
const { useState, useEffect, useRef, useMemo } = React;

function cx(...a) { return a.filter(Boolean).join(' '); }

// Subtle vertical reveal on scroll using IntersectionObserver
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setOn(true); io.disconnect(); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className} style={{
      opacity: on ? 1 : 0,
      transform: on ? 'translateY(0)' : 'translateY(14px)',
      transition: `opacity 0.7s cubic-bezier(.2,.7,.2,1) ${delay}s, transform 0.7s cubic-bezier(.2,.7,.2,1) ${delay}s`,
    }}>{children}</div>
  );
}

// Eyebrow row: dot + label
function Eyebrow({ children, className = '' }) {
  return (
    <div className={cx('flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-mono text-ink-300 dark:text-ink-300', className)}>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-neon shadow-glow-sm"></span>
      <span>{children}</span>
    </div>
  );
}

// Section wrapper
function Section({ id, children, className = '', inner = '' }) {
  return (
    <section id={id} className={cx('relative', className)}>
      <div className={cx('mx-auto w-full max-w-[1240px] px-6 md:px-10', inner)}>
        {children}
      </div>
    </section>
  );
}

// Glossy button
function Button({ children, as: As = 'button', variant = 'primary', className = '', ...rest }) {
  if (variant === 'primary') {
    return (
      <As {...rest} className={cx(
        'relative inline-flex items-center gap-2 px-5 h-11 rounded-xl font-medium text-[14px] overflow-hidden btn-shine',
        'bg-neon text-ink-950 hover:bg-neon-400 transition-colors shadow-glow-sm hover:shadow-glow',
        className,
      )}>
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </As>
    );
  }
  if (variant === 'ghost') {
    return (
      <As {...rest} className={cx(
        'inline-flex items-center gap-2 px-5 h-11 rounded-xl font-medium text-[14px]',
        'border border-white/10 dark:border-white/10 light:border-black/10 text-ink-100 hover:bg-white/5 transition-colors',
        className,
      )}>{children}</As>
    );
  }
  return null;
}

// Card surface (dark first, light fallback via CSS var overrides below)
function Card({ children, className = '', pad = 'p-6', halo = false }) {
  return (
    <div className={cx(
      'relative rounded-2xl surface-card',
      pad,
      className,
    )}>
      {halo && <span className="halo rounded-2xl" aria-hidden="true"></span>}
      {children}
    </div>
  );
}

// Chip
function Chip({ children, className = '' }) {
  return (
    <span className={cx(
      'inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full text-[11px] font-mono',
      'border border-white/10 bg-white/[0.03] text-ink-200',
      className,
    )}>{children}</span>
  );
}

// Sparkline (takes array of numbers)
function Sparkline({ data, className = '', color = '#00FF88', fill = true }) {
  const w = 120, h = 36, pad = 2;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const step = (w - pad * 2) / (data.length - 1);
  const points = data.map((v, i) => {
    const x = pad + i * step;
    const y = h - pad - ((v - min) / Math.max(max - min, 1)) * (h - pad * 2);
    return [x, y];
  });
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${path} L${w - pad},${h - pad} L${pad},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cx('w-full', className)} preserveAspectRatio="none">
      {fill && (
        <defs>
          <linearGradient id="spark-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {fill && <path d={area} fill="url(#spark-grad)" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" className="chart-line" strokeLinecap="round" strokeLinejoin="round" />
      {points.slice(-1).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.2" fill={color} />
      ))}
    </svg>
  );
}

// Animated number
function useAnimatedNumber(target, durMs = 1400) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf; const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / durMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durMs]);
  return v;
}

// Icons (hand-rolled, minimal)
const Icon = {
  Arrow: (p) => <svg viewBox="0 0 16 16" width="14" height="14" {...p}><path d="M3.5 8h9m-4-4 4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Sparkle: (p) => <svg viewBox="0 0 16 16" width="14" height="14" {...p}><path d="M8 1.5v4M8 10.5v4M1.5 8h4M10.5 8h4M3.5 3.5l2.8 2.8M9.7 9.7l2.8 2.8M12.5 3.5 9.7 6.3M6.3 9.7l-2.8 2.8" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>,
  Bolt: (p) => <svg viewBox="0 0 16 16" width="14" height="14" {...p}><path d="M9 1 3 9h4l-1 6 6-8H8l1-6Z" fill="currentColor"/></svg>,
  Check: (p) => <svg viewBox="0 0 16 16" width="14" height="14" {...p}><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Globe: (p) => <svg viewBox="0 0 16 16" width="14" height="14" {...p}><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M1.8 8h12.4M8 1.8c2 2 3 4 3 6.2s-1 4.2-3 6.2c-2-2-3-4-3-6.2s1-4.2 3-6.2Z" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>,
  Stack: (p) => <svg viewBox="0 0 16 16" width="14" height="14" {...p}><path d="M8 2 2 5l6 3 6-3-6-3Z M2 8l6 3 6-3 M2 11l6 3 6-3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
  Dot: (p) => <svg viewBox="0 0 16 16" width="10" height="10" {...p}><circle cx="8" cy="8" r="3" fill="currentColor"/></svg>,
  Linkedin: (p) => <svg viewBox="0 0 16 16" width="14" height="14" {...p}><path d="M3 5.5V13H5.2V5.5H3Zm1.1-3A1.1 1.1 0 1 0 4.1 4.7a1.1 1.1 0 0 0 0-2.2ZM6.7 5.5V13H8.9V9.1c0-1 .3-2 1.5-2s1.3 1.1 1.3 2V13H13.9V8.6c0-2.1-1.1-3.2-2.6-3.2-1.2 0-1.8.7-2 1.2h-.1v-1H6.7Z" fill="currentColor"/></svg>,
  Mail: (p) => <svg viewBox="0 0 16 16" width="14" height="14" {...p}><rect x="2" y="3.5" width="12" height="9" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="m2.5 4.5 5.5 4 5.5-4" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>,
  Cal: (p) => <svg viewBox="0 0 16 16" width="14" height="14" {...p}><rect x="2" y="3" width="12" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M2 6h12M5.5 2v3M10.5 2v3" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>,
  Copy: (p) => <svg viewBox="0 0 16 16" width="14" height="14" {...p}><rect x="4" y="4" width="9" height="9" rx="1.3" fill="none" stroke="currentColor" strokeWidth="1.2"/><path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11" fill="none" stroke="currentColor" strokeWidth="1.2"/></svg>,
  Code: (p) => <svg viewBox="0 0 16 16" width="14" height="14" {...p}><path d="m5 4-3 4 3 4M11 4l3 4-3 4M9.5 3l-3 10" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>,
};

// Stacked node icons for the flow canvas
const NodeIcon = {
  trigger: (p) => <svg viewBox="0 0 24 24" width="18" height="18" {...p}><path d="M10 3 4 14h6l-2 7 10-13h-6l2-5H10z" fill="currentColor"/></svg>,
  logic: (p) => <svg viewBox="0 0 24 24" width="18" height="18" {...p}><path d="M4 12h6m4 0h6M10 6l4 6-4 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  integration: (p) => <svg viewBox="0 0 24 24" width="18" height="18" {...p}><path d="M7 12a3 3 0 0 1 3-3h1v6h-1a3 3 0 0 1-3-3Zm10 0a3 3 0 0 1-3 3h-1V9h1a3 3 0 0 1 3 3Zm-6 0h2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>,
  ai: (p) => <svg viewBox="0 0 24 24" width="18" height="18" {...p}><circle cx="12" cy="12" r="3" fill="currentColor"/><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 3"/></svg>,
  output: (p) => <svg viewBox="0 0 24 24" width="18" height="18" {...p}><path d="M4 12h10m-3-4 4 4-4 4M16 4h4v16h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
};

Object.assign(window, { cx, Reveal, Eyebrow, Section, Button, Card, Chip, Sparkline, useAnimatedNumber, Icon, NodeIcon });
