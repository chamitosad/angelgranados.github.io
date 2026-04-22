// Technical Logic Flow — Make-style canvas mock showing a lead-to-cash pipeline.
const { useEffect: useEffectF, useState: useStateF } = React;

function FlowNode({ x, y, kind, label, sub, pulse }) {
  const colors = {
    trigger:     { ring: 'rgba(0,255,136,0.55)', fill: 'rgba(0,255,136,0.12)', text: '#00FF88' },
    logic:       { ring: 'rgba(255,255,255,0.25)', fill: 'rgba(255,255,255,0.04)', text: '#E5E7EB' },
    integration: { ring: 'rgba(34,211,238,0.5)', fill: 'rgba(34,211,238,0.1)', text: '#7DD3FC' },
    ai:          { ring: 'rgba(217,70,239,0.5)', fill: 'rgba(217,70,239,0.1)', text: '#E879F9' },
    output:      { ring: 'rgba(0,255,136,0.55)', fill: 'rgba(0,255,136,0.12)', text: '#00FF88' },
  }[kind] || { ring: 'rgba(255,255,255,0.2)', fill: 'rgba(255,255,255,0.04)', text: '#fff' };
  const NI = NodeIcon[kind] || NodeIcon.logic;
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      <div className="relative rounded-xl border backdrop-blur-sm px-3 py-2 min-w-[148px] shadow-lg"
           style={{ borderColor: colors.ring, background: colors.fill, boxShadow: `0 0 24px -8px ${colors.ring}` }}>
        {pulse && <span className="absolute -inset-1 rounded-xl pulse-ring" style={{ background: colors.ring }} aria-hidden="true"/>}
        <div className="flex items-center gap-2" style={{ color: colors.text }}>
          <NI />
          <div className="leading-tight">
            <div className="text-[11px] font-semibold font-mono tracking-wide">{label}</div>
            {sub && <div className="text-[10px] text-ink-400 font-mono">{sub}</div>}
          </div>
        </div>
        {/* connection dots */}
        <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: colors.ring }} />
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ background: colors.ring }} />
      </div>
    </div>
  );
}

function FlowCanvas({ lang }) {
  const t = useI18n(lang);
  const L = lang === 'es';

  // Node positions on a 1100x520 canvas
  const nodes = [
    { id: 'trg', x: 80, y: 80,  kind: 'trigger',     label: L ? 'Webhook · Form' : 'Webhook · Form', sub: 'FB Lead Ad' },
    { id: 'nrm', x: 260, y: 80, kind: 'logic',       label: L ? 'Normalizar' : 'Normalize', sub: 'schema v2' },
    { id: 'ai',  x: 440, y: 80, kind: 'ai',          label: L ? 'Calificador IA' : 'AI Qualifier', sub: 'gpt-4o · 92%', pulse: true },
    { id: 'rt',  x: 620, y: 80, kind: 'logic',       label: L ? 'Ruteo' : 'Route', sub: 'score ≥ 80' },
    { id: 'ghl', x: 820, y: 40, kind: 'integration', label: 'GoHighLevel', sub: 'pipeline Q2' },
    { id: 'sh',  x: 820, y: 120,kind: 'integration', label: 'HubSpot', sub: 'B2B · ent' },
    { id: 'tw',  x: 260, y: 220,kind: 'integration', label: 'Twilio', sub: 'SMS v3' },
    { id: 'kl',  x: 440, y: 220,kind: 'integration', label: 'Klaviyo', sub: '14d · nurture' },
    { id: 'cal', x: 620, y: 220,kind: 'logic',       label: L ? 'Calendario' : 'Calendar', sub: 'auto-book' },
    { id: 'out', x: 820, y: 220,kind: 'output',      label: L ? 'Reunión' : 'Meeting', sub: L ? 'agendada' : 'booked' },
    { id: 'log', x: 260, y: 360,kind: 'logic',       label: L ? 'Log · Airtable' : 'Log · Airtable', sub: 'append' },
    { id: 'slk', x: 440, y: 360,kind: 'integration', label: 'Slack', sub: '#ops-alerts' },
    { id: 'rev', m: true, x: 620, y: 360, kind: 'ai', label: L ? 'Revisión' : 'Review', sub: 'retry · 3x' },
    { id: 'stp', x: 820, y: 360,kind: 'output',      label: 'Stripe', sub: L ? 'cobro' : 'charge' },
  ];
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));

  const edges = [
    ['trg','nrm'], ['nrm','ai'], ['ai','rt'],
    ['rt','ghl'], ['rt','sh'],
    ['nrm','tw'], ['tw','kl'], ['kl','cal'], ['cal','out'],
    ['ai','log'], ['log','slk'], ['slk','rev'], ['rev','stp'],
    ['rt','cal'],
  ];

  // Animated packet
  const [tick, setTick] = useStateF(0);
  useEffectF(() => {
    const iv = setInterval(() => setTick(x => x + 1), 40);
    return () => clearInterval(iv);
  }, []);

  function edgePath(a, b) {
    const ax = a.x + 74, ay = a.y; // right side
    const bx = b.x - 74, by = b.y; // left side
    const dx = Math.abs(bx - ax);
    const c1x = ax + dx * 0.5, c1y = ay;
    const c2x = bx - dx * 0.5, c2y = by;
    return `M${ax},${ay} C${c1x},${c1y} ${c2x},${c2y} ${bx},${by}`;
  }

  const legendColors = ['#00FF88', 'rgba(255,255,255,0.9)', '#7DD3FC', '#E879F9', '#00FF88'];

  return (
    <Section id="flow" className="py-20 md:py-28">
      <div className="max-w-[820px]">
        <Eyebrow>{t.flow.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.01em] text-gradient">{t.flow.title}</h2>
        <p className="mt-4 text-[16px] text-ink-300 max-w-[60ch]">{t.flow.sub}</p>
      </div>

      <Reveal delay={0.1} className="mt-10">
        <div className="relative rounded-2xl border border-white/10 bg-ink-900/60 overflow-hidden">
          {/* window chrome */}
          <div className="flex items-center justify-between h-10 px-4 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2 font-mono text-[11px] text-ink-400">
              <span className="w-2 h-2 rounded-full bg-neon blink"/>
              lead-to-cash · scenario.json
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-ink-500">
              <span>14 modules</span><span>·</span><span>0 errors</span><span>·</span><span className="text-neon">healthy</span>
            </div>
          </div>
          <div className="relative overflow-x-auto no-scrollbar">
            <div className="relative" style={{ width: 1100, height: 460 }}>
              {/* canvas grid */}
              <div className="absolute inset-0 bg-grid-sm opacity-50" />
              <div className="absolute inset-0" style={{ background: 'radial-gradient(50% 60% at 50% 40%, rgba(0,255,136,0.06), transparent 60%)' }} />

              {/* edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1100 460">
                {edges.map(([a,b], i) => {
                  const p = edgePath(byId[a], byId[b]);
                  return (
                    <g key={i}>
                      <path d={p} stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" fill="none"/>
                      <path d={p} stroke="rgba(0,255,136,0.55)" strokeWidth="1.2" fill="none" className="flow-dash" style={{ strokeDashoffset: -(tick * 0.8 + i * 6) }} />
                    </g>
                  );
                })}
                {/* moving packets */}
                {edges.slice(0, 6).map(([a,b], i) => {
                  const offset = ((tick + i * 40) % 160) / 160;
                  const A = byId[a], B = byId[b];
                  const ax = A.x + 74, ay = A.y, bx = B.x - 74, by = B.y;
                  const x = ax + (bx - ax) * offset;
                  const y = ay + (by - ay) * offset;
                  return <circle key={i} cx={x} cy={y} r="2.6" fill="#00FF88" style={{ filter: 'drop-shadow(0 0 6px #00FF88)' }}/>;
                })}
              </svg>

              {/* nodes */}
              {nodes.map(n => <FlowNode key={n.id} {...n} />)}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 px-5 h-12 border-t border-white/10 bg-white/[0.02]">
            {t.flow.legend.map((l, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] font-mono text-ink-300">
                <span className="w-2 h-2 rounded-full" style={{ background: legendColors[i] }}/>
                {l}
              </div>
            ))}
            <div className="ml-auto hidden md:flex items-center gap-3 text-[11px] font-mono text-ink-500">
              <span>last run 218ms</span><span>·</span><span>retries 0</span>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

Object.assign(window, { FlowCanvas });
