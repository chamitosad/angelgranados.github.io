// Footer.
function Footer({ lang, calendarUrl, emailAddr }) {
  const t = useI18n(lang);
  return (
    <footer className="relative border-t border-white/[0.06] mt-10">
      <div className="absolute inset-0 bg-grid-sm opacity-30 pointer-events-none"/>
      <div className="relative mx-auto max-w-[1240px] px-6 md:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-ink-900 border border-white/10">
                <span className="font-mono text-[13px] font-semibold text-neon">AG</span>
              </span>
              <div className="leading-tight">
                <div className="text-[14px] font-semibold">Ángel Granados Verde</div>
                <div className="text-[11px] font-mono text-ink-400">{t.footer.tagline}</div>
              </div>
            </div>
            <div className="mt-5 text-[12.5px] font-mono text-ink-400 max-w-[42ch]">
              {lang === 'es'
                ? 'Operaciones técnicas, CRMs y flujos de IA para real estate y eCommerce. Construyo sistemas que sobreviven la primera auditoría.'
                : 'Technical operations, CRMs and AI flows for real estate and eCommerce. I build systems that survive the first audit.'}
            </div>
          </div>
          <div className="md:col-span-3">
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-500 mb-3">{lang === 'es' ? 'Navegar' : 'Navigate'}</div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5">
              {['services','dashboard','flow','about','work','contact'].map((k) => (
                <a key={k} href={`#${k}`} className="text-[13px] text-ink-300 hover:text-neon transition-colors capitalize">{t.nav[k]}</a>
              ))}
            </div>
          </div>
          <div className="md:col-span-4">
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-500 mb-3">{lang === 'es' ? 'Contacto' : 'Contact'}</div>
            <div className="flex flex-col gap-2">
              <a href={`mailto:${emailAddr}`} className="inline-flex items-center gap-2 text-[13px] font-mono text-ink-200 hover:text-neon"><Icon.Mail/> {emailAddr}</a>
              <a href={calendarUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[13px] font-mono text-ink-200 hover:text-neon"><Icon.Cal/> calendar.app.google</a>
              <a href="https://www.linkedin.com/in/angel-granados-verde" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[13px] font-mono text-ink-200 hover:text-neon"><Icon.Linkedin/> /in/angel-granados-verde</a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-ink-500">{t.footer.copy}</div>
          <div className="text-[11px] font-mono text-ink-500">SEO · Automation Engineer · Real Estate VA · GoHighLevel Expert</div>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { Footer });
