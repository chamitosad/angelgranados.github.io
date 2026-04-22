// Bento grid of services.
function ServiceCard({ card, index }) {
  // Per-card visual accent
  const accents = [
    {
      // flow nodes
      bg: 'radial-gradient(120% 80% at 100% 0%, rgba(0,255,136,0.10), transparent 60%)',
      art: <FlowArt />,
    },
    {
      bg: 'radial-gradient(120% 80% at 0% 100%, rgba(0,255,136,0.08), transparent 60%)',
      art: <ChartArt />,
    },
    {
      bg: 'radial-gradient(120% 80% at 50% 0%, rgba(0,255,136,0.09), transparent 60%)',
      art: <CrmArt />,
    },
  ];
  const a = accents[index] || accents[0];
  return (
    <Reveal delay={0.05 * index} className="h-full">
      <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-7 h-full flex flex-col overflow-hidden transition-colors hover:border-neon/30">
        <div aria-hidden="true" className="absolute inset-0 opacity-80" style={{ background: a.bg }} />
        <div className="absolute inset-0 bg-grid-sm opacity-40" aria-hidden="true" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-neon/90">{card.tag}</span>
            <Icon.Arrow className="opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all text-neon" />
          </div>
          <h3 className="mt-4 text-[22px] md:text-[24px] font-semibold tracking-tight">{card.title}</h3>
          <p className="mt-3 text-[14.5px] leading-relaxed text-ink-300 max-w-[44ch]">{card.body}</p>
        </div>
        <div className="relative mt-6 flex-1 min-h-[140px]">{a.art}</div>
        <ul className="relative mt-5 grid grid-cols-1 gap-1.5 pt-4 border-t border-white/5">
          {card.bullets.map((b, i) => (
            <li key={i} className="flex items-center gap-2 text-[13px] text-ink-200 font-mono">
              <span className="text-neon"><Icon.Check /></span>{b}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function FlowArt() {
  return (
    <svg viewBox="0 0 320 140" className="w-full h-full">
      <defs>
        <linearGradient id="fa-line" x1="0" x2="1">
          <stop offset="0" stopColor="#00FF88" stopOpacity="0.1"/>
          <stop offset="0.5" stopColor="#00FF88" stopOpacity="0.6"/>
          <stop offset="1" stopColor="#00FF88" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      {[[40,30],[120,30],[200,30],[280,30],[80,80],[160,80],[240,80],[120,120],[200,120]].map(([x,y],i)=>(
        <g key={i}>
          <circle cx={x} cy={y} r="14" fill="#0A0C0F" stroke="rgba(0,255,136,0.35)"/>
          <circle cx={x} cy={y} r="3.5" fill="#00FF88"/>
        </g>
      ))}
      {[[40,30,120,30],[120,30,200,30],[200,30,280,30],[40,30,80,80],[120,30,80,80],[200,30,160,80],[280,30,240,80],[80,80,120,120],[160,80,120,120],[160,80,200,120],[240,80,200,120]].map(([x1,y1,x2,y2],i)=>(
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#fa-line)" strokeWidth="1.2"/>
      ))}
    </svg>
  );
}

function ChartArt() {
  const pts = [10,14,12,22,19,27,32,30,40,46,52,50,62,68];
  const w=320,h=140,pad=10;
  const max=Math.max(...pts), min=Math.min(...pts);
  const step=(w-pad*2)/(pts.length-1);
  const path=pts.map((v,i)=>{const x=pad+i*step;const y=h-pad-((v-min)/(max-min))*(h-pad*2-30)-15;return `${i===0?'M':'L'}${x},${y}`;}).join(' ');
  const area=`${path} L${w-pad},${h-pad} L${pad},${h-pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
      <defs><linearGradient id="ca-g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#00FF88" stopOpacity="0.35"/><stop offset="1" stopColor="#00FF88" stopOpacity="0"/></linearGradient></defs>
      {[30,55,80,105].map((y,i)=>(<line key={i} x1="10" x2="310" y1={y} y2={y} stroke="rgba(255,255,255,0.05)"/>))}
      <path d={area} fill="url(#ca-g)"/>
      <path d={path} fill="none" stroke="#00FF88" strokeWidth="1.5" className="chart-line"/>
      {[0,4,9,13].map(i=>{const x=pad+i*step;return <circle key={i} cx={x} cy={h-pad-((pts[i]-min)/(max-min))*(h-pad*2-30)-15} r="2.5" fill="#00FF88"/>;})}
    </svg>
  );
}

function CrmArt() {
  const rows = [
    { name: 'AI · parse inbound doc → extract entities', tag: 'ok', color: '#00FF88' },
    { name: 'OpenAI · classify intent → route pipeline', tag: '92', color: '#00FF88' },
    { name: 'Embed · similarity match to knowledge base', tag: '68', color: 'rgba(255,255,255,0.6)' },
    { name: 'AI · summarize → push to CRM contact', tag: 'ok', color: '#00FF88' },
  ];
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {rows.map((r,i)=>(
        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/8 bg-black/20 text-[12px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background:r.color }}/>
          <span className="flex-1 text-ink-200 truncate">{r.name}</span>
          <span className="text-[11px] tabular-nums" style={{ color: r.color }}>{r.tag}</span>
        </div>
      ))}
    </div>
  );
}

function Services({ lang }) {
  const t = useI18n(lang);
  return (
    <Section id="services" className="py-20 md:py-28">
      <div className="max-w-[780px]">
        <Eyebrow>{t.services.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.01em] text-gradient">{t.services.title}</h2>
        <p className="mt-4 text-[16px] text-ink-300 max-w-[60ch]">{t.services.sub}</p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {t.services.cards.map((c, i) => <ServiceCard key={i} card={c} index={i} />)}
      </div>
    </Section>
  );
}

Object.assign(window, { Services });
