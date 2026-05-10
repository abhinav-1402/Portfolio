  const mono = "'JetBrains Mono', monospace";
  const cond = "'Barlow Condensed', sans-serif";

  const dark = 'dark'
    const t = {
    accent:    dark ? '#08CB00' : '#253900',
    accentRgb: dark ? '8,203,0' : '37,57,0',
    text:      dark ? '#EEEEEE' : '#000000',

  };

export  const SectionHeader = ({ num, title }: { num: string; title: string }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 52 }}>
      <span style={{ fontFamily: mono, fontSize: 11, color: t.accent, letterSpacing: '0.1em' }}>{num}</span>
      <h2 style={{ fontFamily: cond, fontWeight: 800, fontSize: 50, textTransform: 'uppercase', letterSpacing: '-0.01em', color: t.text, lineHeight: 1, margin: 0 }}>
        {title}
      </h2>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg,rgba(${t.accentRgb},0.35),transparent)`, marginLeft: 14 }} />
    </div>
  );