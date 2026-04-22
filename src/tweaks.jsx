// Tweaks panel — dark/light + density (per the user's selection).
const { useState: useStateT, useEffect: useEffectT } = React;

function Tweaks({ value, onChange }) {
  const [available, setAvailable] = useStateT(false);
  const [active, setActive] = useStateT(false);

  useEffectT(() => {
    function onMsg(ev) {
      const d = ev.data || {};
      if (d.type === '__activate_edit_mode') setActive(true);
      if (d.type === '__deactivate_edit_mode') setActive(false);
    }
    window.addEventListener('message', onMsg);
    // announce availability AFTER listener is registered
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}
    setAvailable(true);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  function set(patch) {
    const next = { ...value, ...patch };
    onChange(next);
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*'); } catch {}
  }

  if (!active) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 w-[280px] rounded-2xl border border-white/15 bg-ink-900/85 tweaks-pop shadow-2xl">
      <div className="flex items-center justify-between px-4 h-11 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neon blink"/>
          <span className="text-[12px] font-mono uppercase tracking-[0.14em] text-ink-200">Tweaks</span>
        </div>
        <span className="text-[10px] font-mono text-ink-500">live</span>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-400 mb-2">Theme</div>
          <div className="grid grid-cols-2 gap-1.5">
            {[['dark','Dark'],['light','Light']].map(([k,l]) => (
              <button key={k} onClick={() => set({ theme: k })} className={cx(
                'h-9 rounded-lg text-[12px] font-mono border transition-colors',
                value.theme === k ? 'bg-neon/15 text-neon border-neon/40' : 'border-white/10 text-ink-300 hover:border-white/20'
              )}>{l}</button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-ink-400 mb-2">Density</div>
          <div className="grid grid-cols-3 gap-1.5">
            {[['compact','Compact'],['cozy','Cozy'],['roomy','Roomy']].map(([k,l]) => (
              <button key={k} onClick={() => set({ density: k })} className={cx(
                'h-9 rounded-lg text-[12px] font-mono border transition-colors',
                value.density === k ? 'bg-neon/15 text-neon border-neon/40' : 'border-white/10 text-ink-300 hover:border-white/20'
              )}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Tweaks });
