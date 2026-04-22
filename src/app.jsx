// Root app: wires everything, handles lang + theme + density.
const { useState: useStateA, useEffect: useEffectA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "density": "cozy"
}/*EDITMODE-END*/;

const CAL_URL = 'https://calendar.app.google/HUtKtFYCUQ51s7Kp9';
const EMAIL = 'granadoangelv@gmail.com';

function App() {
  const [lang, setLang] = useStateA(() => {
    try { return localStorage.getItem('ag_lang') || 'en'; } catch { return 'en'; }
  });
  const [tw, setTw] = useStateA(TWEAK_DEFAULTS);

  useEffectA(() => { try { localStorage.setItem('ag_lang', lang); } catch {} document.documentElement.lang = lang; }, [lang]);

  // Apply theme
  useEffectA(() => {
    const root = document.documentElement;
    if (tw.theme === 'light') root.classList.add('light'); else root.classList.remove('light');
    // Inject light-theme overrides dynamically
    let s = document.getElementById('theme-vars');
    if (!s) { s = document.createElement('style'); s.id = 'theme-vars'; document.head.appendChild(s); }
    if (tw.theme === 'light') {
      s.textContent = `
        html.light body { background: #F7F7F5; color: #0A0C0F; }
        html.light .text-ink-100 { color: #0A0C0F; }
        html.light .text-ink-200 { color: #2A2F36; }
        html.light .text-ink-300 { color: #4A5058; }
        html.light .text-ink-400 { color: #6B7280; }
        html.light .text-ink-500 { color: #8B92A0; }
        html.light .bg-ink-900\\/60, html.light .bg-ink-900\\/70, html.light .bg-ink-900\\/80, html.light .bg-ink-900\\/95 { background-color: rgba(255,255,255,0.7) !important; }
        html.light .bg-white\\/\\[0\\.02\\] { background-color: rgba(10,12,15,0.02); }
        html.light .bg-white\\/\\[0\\.03\\] { background-color: rgba(10,12,15,0.03); }
        html.light .bg-white\\/\\[0\\.04\\] { background-color: rgba(10,12,15,0.04); }
        html.light .bg-white\\/5 { background-color: rgba(10,12,15,0.04); }
        html.light .bg-black\\/20, html.light .bg-black\\/30, html.light .bg-black\\/40, html.light .bg-black\\/50 { background-color: rgba(10,12,15,0.04) !important; }
        html.light .border-white\\/5 { border-color: rgba(10,12,15,0.06); }
        html.light .border-white\\/8 { border-color: rgba(10,12,15,0.08); }
        html.light .border-white\\/10 { border-color: rgba(10,12,15,0.09); }
        html.light .border-white\\/15, html.light .border-white\\/20 { border-color: rgba(10,12,15,0.15); }
        html.light header.backdrop-blur-xl { background-color: rgba(247,247,245,0.8) !important; }
        html.light .text-neon { color: #00A35B; }
        html.light .bg-neon { background-color: #00A35B; color: #fff; }
        html.light .bg-neon\\/10 { background-color: rgba(0,163,91,0.1); }
        html.light .bg-neon\\/15 { background-color: rgba(0,163,91,0.15); }
        html.light .bg-neon\\/5 { background-color: rgba(0,163,91,0.06); }
        html.light .border-neon\\/20, html.light .border-neon\\/30, html.light .border-neon\\/40, html.light .border-neon\\/50 { border-color: rgba(0,163,91,0.35); }
        html.light .text-gradient { background: linear-gradient(180deg, #0A0C0F 0%, rgba(10,12,15,0.6) 100%); -webkit-background-clip: text; background-clip: text; color: transparent; }
        html.light .chart-line { filter: drop-shadow(0 0 4px rgba(0,163,91,0.35)); }
        html.light input, html.light select, html.light textarea { background-color: rgba(10,12,15,0.03) !important; color: #0A0C0F !important; }
      `;
    } else {
      s.textContent = '';
    }
  }, [tw.theme]);

  // Density scales: affect section padding via a CSS var
  useEffectA(() => {
    const d = { compact: 0.72, cozy: 1, roomy: 1.25 }[tw.density] || 1;
    document.documentElement.style.setProperty('--density', d);
    let s = document.getElementById('density-vars');
    if (!s) { s = document.createElement('style'); s.id = 'density-vars'; document.head.appendChild(s); }
    s.textContent = `
      section.relative > .mx-auto { --d: ${d}; }
      @media (min-width: 768px) {
        section.py-20, section.py-24, section.py-28 {
          padding-top: calc(6rem * ${d}) !important;
          padding-bottom: calc(6rem * ${d}) !important;
        }
      }
      section.py-20 { padding-top: calc(3.75rem * ${d}); padding-bottom: calc(3.75rem * ${d}); }
      section.pt-28.pb-20, section.md\\:pt-36.md\\:pb-28 { padding-top: calc(5rem * ${d}); padding-bottom: calc(4rem * ${d}); }
    `;
  }, [tw.density]);

  return (
    <div className="relative min-h-screen">
      <Header lang={lang} setLang={setLang} theme={tw.theme} setTheme={(v) => setTw(prev => ({ ...prev, theme: v }))} calendarUrl={CAL_URL} />
      <main>
        <Hero lang={lang} calendarUrl={CAL_URL} />
        <Services lang={lang} />
        <Dashboard lang={lang} />
        <FlowCanvas lang={lang} />
        <About lang={lang} />
        <Portfolio lang={lang} />
        <Testimonials lang={lang} />
        <Contact lang={lang} calendarUrl={CAL_URL} emailAddr={EMAIL} />
      </main>
      <Footer lang={lang} calendarUrl={CAL_URL} emailAddr={EMAIL} />
      <Tweaks value={tw} onChange={setTw} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
