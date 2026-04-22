// About section.
function About({ lang }) {
  const t = useI18n(lang);
  return (
    <Section id="about" className="py-20 md:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[4/5] rounded-2xl border border-white/10 bg-ink-900/80 overflow-hidden">
            <img src="assets/angel.png" alt="Ángel Granados" className="absolute inset-0 w-full h-full object-cover" />
            {/* Subtle scrim for legibility of overlays */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.55))' }} />
            {/* Corner tag */}
            <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 rounded-md border border-white/10 bg-black/50 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-neon blink" />
              <span className="text-[10px] font-mono text-ink-200">on record · live</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div>
                <div className="text-[13px] font-semibold tracking-tight text-white">Ángel Granados Verde</div>
                <div className="text-[11px] font-mono text-ink-300">automation.engineer</div>
              </div>
              <div className="text-[10px] font-mono text-ink-300">Cohen & Aguirre · 2024–</div>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Eyebrow>{t.about.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.01em] text-gradient">{t.about.title}</h2>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-200 max-w-[60ch]">{t.about.body}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {t.about.chips.map((c, i) => <Chip key={i}>{c}</Chip>)}
          </div>
          {/* Bilingual highlight */}
          <Reveal delay={0.1} className="mt-8">
            <div className="relative rounded-2xl border border-neon/20 bg-gradient-to-br from-neon/[0.06] to-transparent p-5">
              <div className="flex items-start gap-4">
                <div className="shrink-0 mt-1 w-10 h-10 rounded-lg border border-neon/30 bg-neon/10 flex items-center justify-center text-neon">
                  <Icon.Globe />
                </div>
                <div>
                  <div className="text-[13px] font-mono uppercase tracking-[0.14em] text-neon">{lang === 'es' ? 'Bilingual operator' : 'Bilingual operator'}</div>
                  <div className="mt-1 text-[15.5px] leading-relaxed text-ink-100 max-w-[52ch]">
                    {lang === 'es'
                      ? 'Opero en español e inglés nivel nativo. Reuniones, copy, flujos y documentación en cualquiera de los dos — sin fricción para mercados internacionales.'
                      : 'I operate in native-level English and Spanish. Meetings, copy, flows and docs in either — no friction for international markets.'}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

Object.assign(window, { About });
