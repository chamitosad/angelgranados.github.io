// Portfolio — placeholder stylized mocks of Make-style diagrams.
function MiniDiagram({ variant = 0 }) {
  // A few distinct stylized mock canvases.
  const V = variant % 4;
  if (V === 0) {
    return (
      <svg viewBox="0 0 320 180" className="w-full h-full">
        <defs>
          <linearGradient id={`p0-g${variant}`} x1="0" x2="1"><stop offset="0" stopColor="#00FF88" stopOpacity=".1"/><stop offset=".5" stopColor="#00FF88" stopOpacity=".7"/><stop offset="1" stopColor="#00FF88" stopOpacity=".1"/></linearGradient>
        </defs>
        <rect width="320" height="180" fill="transparent"/>
        {/* connections */}
        {[[50,90,120,60],[50,90,120,120],[120,60,200,60],[120,120,200,120],[200,60,270,90],[200,120,270,90]].map(([x1,y1,x2,y2],i)=>(
          <path key={i} d={`M${x1},${y1} C${(x1+x2)/2},${y1} ${(x1+x2)/2},${y2} ${x2},${y2}`} fill="none" stroke={`url(#p0-g${variant})`} strokeWidth="1.2"/>
        ))}
        {[[50,90],[120,60],[120,120],[200,60],[200,120],[270,90]].map(([x,y],i)=>(
          <g key={i}>
            <rect x={x-18} y={y-12} width="36" height="24" rx="6" fill="#0A0C0F" stroke="rgba(0,255,136,0.35)"/>
            <circle cx={x} cy={y} r="2.5" fill="#00FF88"/>
          </g>
        ))}
      </svg>
    );
  }
  if (V === 1) {
    const pts = [12,14,18,22,20,28,34,30,42,48,55,62,70,78];
    const w=320,h=180,pad=16;
    const max=Math.max(...pts),min=Math.min(...pts);
    const step=(w-pad*2)/(pts.length-1);
    const path=pts.map((v,i)=>{const x=pad+i*step;const y=h-pad-((v-min)/(max-min))*(h-pad*2-20)-10;return `${i===0?'M':'L'}${x},${y}`;}).join(' ');
    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full">
        <defs><linearGradient id={`p1-g${variant}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#00FF88" stopOpacity=".35"/><stop offset="1" stopColor="#00FF88" stopOpacity="0"/></linearGradient></defs>
        {[40,70,100,130].map((y,i)=>(<line key={i} x1="10" x2="310" y1={y} y2={y} stroke="rgba(255,255,255,0.05)"/>))}
        <path d={`${path} L${w-pad},${h-pad} L${pad},${h-pad} Z`} fill={`url(#p1-g${variant})`}/>
        <path d={path} fill="none" stroke="#00FF88" strokeWidth="1.5" className="chart-line"/>
      </svg>
    );
  }
  if (V === 2) {
    return (
      <div className="p-4 flex flex-col gap-1.5 w-full h-full">
        {['+1 (555) 013-4092 → qualified','Juan Pérez · listing $380k','AI voice → booked 3:40pm','Twilio dispatch · v3','Shopify order #A-3102'].map((r,i)=>(
          <div key={i} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-white/8 bg-black/30 text-[11px] font-mono text-ink-200">
            <span className="w-1 h-1 rounded-full bg-neon"/>
            <span className="truncate">{r}</span>
          </div>
        ))}
      </div>
    );
  }
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full">
      {/* orbital cluster */}
      <circle cx="160" cy="90" r="68" fill="none" stroke="rgba(255,255,255,0.08)"/>
      <circle cx="160" cy="90" r="42" fill="none" stroke="rgba(0,255,136,0.18)"/>
      <circle cx="160" cy="90" r="18" fill="rgba(0,255,136,0.1)" stroke="rgba(0,255,136,0.5)"/>
      <text x="160" y="94" textAnchor="middle" fill="#00FF88" fontSize="10" fontFamily="JetBrains Mono">CORE</text>
      {[[160,22],[228,62],[228,118],[160,158],[92,118],[92,62]].map(([x,y],i)=>(
        <g key={i}>
          <line x1="160" y1="90" x2={x} y2={y} stroke="rgba(255,255,255,0.1)"/>
          <circle cx={x} cy={y} r="8" fill="#0A0C0F" stroke="rgba(255,255,255,0.2)"/>
          <circle cx={x} cy={y} r="2" fill="#00FF88"/>
        </g>
      ))}
    </svg>
  );
}

function Portfolio({ lang }) {
  const t = useI18n(lang);
  return (
    <Section id="work" className="py-20 md:py-28">
      <div className="max-w-[820px]">
        <Eyebrow>{t.portfolio.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.01em] text-gradient">{t.portfolio.title}</h2>
        <p className="mt-4 text-[16px] text-ink-300 max-w-[60ch]">{t.portfolio.sub}</p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {t.portfolio.items.map((it, i) => (
          <Reveal key={i} delay={0.05 * i}>
            <div className="group relative rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-colors hover:border-neon/30">
              <div className="relative h-[220px] border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden">
                <div className="absolute inset-0 bg-grid-sm opacity-50"/>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MiniDiagram variant={i} />
                </div>
                <div className="absolute top-3 left-3 text-[10px] font-mono text-ink-400 px-2 py-0.5 rounded border border-white/10 bg-black/40">{it.tag}</div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-[17px] font-semibold tracking-tight">{it.title}</h3>
                  <Icon.Arrow className="opacity-0 group-hover:opacity-100 translate-x-[-4px] group-hover:translate-x-0 transition-all text-neon mt-1" />
                </div>
                <div className="mt-1.5 text-[12px] font-mono text-ink-400">{it.meta}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

Object.assign(window, { Portfolio });
