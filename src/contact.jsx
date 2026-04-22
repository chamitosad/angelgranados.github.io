// Contact form + Calendly embed section.
const { useState: useStateC } = React;

function Field({ label, children, error, id }) {
  return (
    <label htmlFor={id} className="block">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-400">{label}</span>
        {error && <span className="text-[11px] font-mono text-rose-400">{error}</span>}
      </div>
      {children}
    </label>
  );
}

const inputCx = "w-full h-11 px-3.5 rounded-lg bg-black/30 border border-white/10 text-[14px] text-ink-100 placeholder-ink-500 focus:outline-none focus:border-neon/50 focus:ring-2 focus:ring-neon/10 transition-colors";

function Contact({ lang, calendarUrl, emailAddr }) {
  const t = useI18n(lang);
  const [form, setForm] = useStateC({ name: '', email: '', company: '', type: '', budget: '', message: '', consent: false });
  const [errors, setErrors] = useStateC({});
  const [status, setStatus] = useStateC('idle'); // idle | sending | sent

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = t.contact.errors.name;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = t.contact.errors.email;
    if (form.message.trim().length < 10) e.message = t.contact.errors.message;
    if (!form.consent) e.consent = t.contact.errors.consent;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    // Simulated webhook POST
    try {
      await new Promise(r => setTimeout(r, 900));
      // Real endpoints can be wired here:
      // await fetch('https://hook.your.domain/leads', { method: 'POST', body: JSON.stringify(form) });
      setStatus('sent');
    } catch {
      setStatus('idle');
    }
  }

  return (
    <Section id="contact" className="py-20 md:py-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <Eyebrow>{t.contact.eyebrow}</Eyebrow>
          <h2 className="mt-4 text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.01em] text-gradient">{t.contact.title}</h2>
          <p className="mt-4 text-[16px] text-ink-300 max-w-[46ch]">{t.contact.sub}</p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-400 mb-3">{lang === 'es' ? 'Canales directos' : 'Direct channels'}</div>
            <div className="flex flex-col gap-2">
              <a href={`mailto:${emailAddr}`} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-neon/30 hover:bg-neon/[0.03] transition-colors group">
                <Icon.Mail className="text-neon"/>
                <div className="flex-1">
                  <div className="text-[11px] font-mono text-ink-500">email</div>
                  <div className="text-[13.5px] font-mono">{emailAddr}</div>
                </div>
                <Icon.Arrow className="text-ink-400 group-hover:text-neon transition-colors"/>
              </a>
              <a href={calendarUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-neon/30 hover:bg-neon/[0.03] transition-colors group">
                <Icon.Cal className="text-neon"/>
                <div className="flex-1">
                  <div className="text-[11px] font-mono text-ink-500">calendar</div>
                  <div className="text-[13.5px] font-mono">{lang === 'es' ? 'Reservar slot (30 min)' : 'Book a slot (30 min)'}</div>
                </div>
                <Icon.Arrow className="text-ink-400 group-hover:text-neon transition-colors"/>
              </a>
              <a href="https://www.linkedin.com/in/angel-granados-verde" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:border-neon/30 hover:bg-neon/[0.03] transition-colors group">
                <Icon.Linkedin className="text-neon"/>
                <div className="flex-1">
                  <div className="text-[11px] font-mono text-ink-500">linkedin</div>
                  <div className="text-[13.5px] font-mono">/in/angel-granados-verde</div>
                </div>
                <Icon.Arrow className="text-ink-400 group-hover:text-neon transition-colors"/>
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={onSubmit} className="relative rounded-2xl border border-white/10 bg-ink-900/60 p-6 md:p-7">
            <div className="absolute top-5 right-6 flex items-center gap-2 text-[11px] font-mono text-ink-400">
              <span className="w-1.5 h-1.5 rounded-full bg-neon blink" />
              webhook · encrypted
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field id="f-name" label={t.contact.name} error={errors.name}>
                <input id="f-name" className={inputCx} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Jane Cooper"/>
              </Field>
              <Field id="f-email" label={t.contact.email} error={errors.email}>
                <input id="f-email" type="email" className={inputCx} value={form.email} onChange={e => update('email', e.target.value)} placeholder="jane@acme.com"/>
              </Field>
              <Field id="f-company" label={t.contact.company}>
                <input id="f-company" className={inputCx} value={form.company} onChange={e => update('company', e.target.value)} placeholder="Acme Realty"/>
              </Field>
              <Field id="f-type" label={t.contact.type}>
                <select id="f-type" className={inputCx} value={form.type} onChange={e => update('type', e.target.value)}>
                  <option value="">—</option>
                  {t.contact.typeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </Field>
              <Field id="f-budget" label={t.contact.budget}>
                <div className="grid grid-cols-4 gap-1.5">
                  {t.contact.budgetOptions.map(b => (
                    <button type="button" key={b} onClick={() => update('budget', b)} className={cx(
                      'h-11 rounded-lg text-[12px] font-mono border transition-colors',
                      form.budget === b ? 'bg-neon/10 text-neon border-neon/40' : 'border-white/10 text-ink-300 hover:text-white hover:border-white/20',
                    )}>{b}</button>
                  ))}
                </div>
              </Field>
              <Field id="f-msg" label={t.contact.message} error={errors.message}>
                <textarea id="f-msg" rows={4} className={cx(inputCx, 'h-auto py-3 resize-none')} value={form.message} onChange={e => update('message', e.target.value)} placeholder={lang === 'es' ? 'Stack actual, cuellos de botella, objetivo de 90 días…' : 'Current stack, bottlenecks, 90-day goal…'} />
              </Field>
            </div>

            <label className="mt-4 flex items-start gap-2.5 select-none cursor-pointer">
              <span className={cx('mt-0.5 w-4 h-4 rounded border inline-flex items-center justify-center transition-colors', form.consent ? 'bg-neon border-neon' : 'border-white/20')}>
                {form.consent && <Icon.Check className="text-ink-950" />}
              </span>
              <input type="checkbox" className="sr-only" checked={form.consent} onChange={e => update('consent', e.target.checked)} />
              <span className={cx('text-[13px]', errors.consent ? 'text-rose-400' : 'text-ink-300')}>{t.contact.consent}</span>
            </label>

            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-[12px] font-mono text-ink-400">
                {t.contact.or} <a href={calendarUrl} target="_blank" rel="noreferrer" className="text-neon hover:underline">{t.contact.book}</a>
              </div>
              <Button as="button" type="submit" disabled={status !== 'idle'}>
                {status === 'idle' && (<><Icon.Bolt /> {t.contact.submit} <Icon.Arrow /></>)}
                {status === 'sending' && (<><span className="w-3 h-3 rounded-full border-2 border-ink-950 border-t-transparent animate-spin"/> {t.contact.sending}</>)}
                {status === 'sent' && (<><Icon.Check /> {t.contact.sent}</>)}
              </Button>
            </div>
          </form>

          {/* Calendly-style embed placeholder */}
          <Reveal delay={0.05} className="mt-6">
            <div className="relative rounded-2xl border border-white/10 bg-ink-900/60 overflow-hidden">
              <div className="flex items-center justify-between h-11 px-5 border-b border-white/10 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <Icon.Cal className="text-neon"/>
                  <div className="text-[13px] font-semibold">{lang === 'es' ? 'Agenda una llamada de 30 min' : 'Book a 30-min strategy call'}</div>
                </div>
                <a href={calendarUrl} target="_blank" rel="noreferrer" className="text-[12px] font-mono text-neon hover:underline">{lang === 'es' ? 'abrir en Google Calendar' : 'open in Google Calendar'} →</a>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-white/10 p-4">
                  <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-400">{lang === 'es' ? 'Próximos slots' : 'Next available'}</div>
                  <div className="mt-3 flex flex-col gap-2">
                    {['Tue 10:00','Tue 14:30','Wed 09:00','Thu 16:00','Fri 11:30'].map((s,i)=>(
                      <a key={i} href={calendarUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/10 hover:border-neon/40 hover:bg-neon/[0.04] transition-colors text-[13px] font-mono group">
                        <span>{s} <span className="text-ink-500">· CT</span></span>
                        <span className="text-ink-400 group-hover:text-neon">→</span>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 p-4">
                  <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-400">{lang === 'es' ? 'Qué cubrimos' : 'What we cover'}</div>
                  <ul className="mt-3 flex flex-col gap-2 text-[13.5px] text-ink-200">
                    {(lang === 'es' ? [
                      'Diagnóstico del stack actual',
                      'Flujos críticos a automatizar',
                      'Priorización por ROI · 90 días',
                      'Siguiente paso (plan o no-go)'
                    ] : [
                      'Current stack diagnosis',
                      'Critical flows to automate',
                      'ROI-driven 90-day roadmap',
                      'Next step (plan or honest no-go)'
                    ]).map((l,i)=>(
                      <li key={i} className="flex items-start gap-2"><span className="text-neon mt-1"><Icon.Check/></span><span>{l}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

Object.assign(window, { Contact });
