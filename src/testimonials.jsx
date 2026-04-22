// Testimonials section with placeholder quotes.
function Testimonials({ lang }) {
  const t = useI18n(lang);
  return (
    <Section id="signal" className="py-20 md:py-28">
      <div className="max-w-[820px]">
        <Eyebrow>{t.testimonials.eyebrow}</Eyebrow>
        <h2 className="mt-4 text-[clamp(26px,3.4vw,38px)] font-semibold tracking-[-0.01em] text-gradient">{t.testimonials.title}</h2>
      </div>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {t.testimonials.items.map((q, i) => (
          <Reveal key={i} delay={0.05 * i}>
            <div className="relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <svg width="26" height="20" viewBox="0 0 26 20" className="text-neon mb-4"><path d="M0 20V12C0 5.4 4.4 1 11 0V4C7.4 4.8 5 7.2 5 11H11V20H0ZM15 20V12C15 5.4 19.4 1 26 0V4C22.4 4.8 20 7.2 20 11H26V20H15Z" fill="currentColor" fillOpacity="0.6"/></svg>
              <p className="text-[15px] leading-relaxed text-ink-100">{q.quote}</p>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon/30 to-neon/5 border border-white/10 flex items-center justify-center text-[11px] font-mono text-neon">{q.name.split(' ').map(s=>s[0]).join('')}</div>
                <div>
                  <div className="text-[13px] font-semibold">{q.name}</div>
                  <div className="text-[11px] font-mono text-ink-400">{q.role}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

Object.assign(window, { Testimonials });
