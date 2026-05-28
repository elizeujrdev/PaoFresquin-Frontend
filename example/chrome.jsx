// Shared chrome — wordmark, topbar, frames
const Wordmark = ({ size = 'md' }) => (
  <span className={`pf-wordmark ${size === 'lg' ? 'lg' : size === 'xl' ? 'xl' : ''}`}>
    <span>pão</span><span className="light">fresquim</span><span className="dot"></span>
  </span>
);

const NavItem = ({ icon: I, label, active, onClick }) => (
  <button className={`pf-nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <I size={17} />
    <span>{label}</span>
  </button>
);

const TopBar = ({ active = 'dashboard', user = 'Ana Martins', onNav }) => {
  const items = [
    { id: 'dashboard', label: 'Início', icon: IconHome },
    { id: 'pdv', label: 'Registrar Venda', icon: IconCart },
    { id: 'clientes', label: 'Clientes', icon: IconUsers },
    { id: 'funcionarios', label: 'Funcionários', icon: IconBriefcase },
    { id: 'produtos', label: 'Produtos', icon: IconBox },
    { id: 'relatorios', label: 'Relatórios', icon: IconChart },
    { id: 'cameras', label: 'Câmeras', icon: IconCamera },
  ];
  return (
    <div className="pf-topbar">
      <Wordmark />
      <div style={{ width: 1, height: 28, background: 'var(--border)', marginLeft: 8 }}></div>
      <div className="pf-nav">
        {items.map(it => (
          <NavItem key={it.id} icon={it.icon} label={it.label} active={active === it.id} onClick={() => onNav && onNav(it.id)} />
        ))}
      </div>
      <div className="pf-spacer"></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: 'var(--muted)' }}>
        <span style={{ fontSize: 14 }}>Loja Centro · <span className="mono">qua 16/05</span></span>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-soft)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent-ink)', fontSize: 13, fontWeight: 600 }}>
          {user.split(' ').map(p => p[0]).slice(0, 2).join('')}
        </div>
      </div>
    </div>
  );
};

const BrowserFrame = ({ children, url = 'sistema.paofresquim.com.br' }) => (
  <div className="pf-browser" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
    <div className="pf-browser-bar">
      <div style={{ display: 'flex', gap: 6 }}>
        <div className="pf-browser-dot"></div>
        <div className="pf-browser-dot"></div>
        <div className="pf-browser-dot"></div>
      </div>
      <div className="pf-browser-url">🔒 {url}</div>
      <div style={{ width: 33 }}></div>
    </div>
    <div style={{ flex: 1, overflow: 'hidden', background: 'var(--bg)' }}>
      {children}
    </div>
  </div>
);

const PhoneFrame = ({ children }) => (
  <div className="pf-phone">
    <div className="pf-phone-notch"></div>
    <div className="pf-phone-screen">
      {children}
    </div>
  </div>
);

const StatusBar = ({ dark }) => (
  <div className="pf-status-bar" style={{ color: dark ? '#fff' : 'var(--ink)' }}>
    <span className="mono">9:41</span>
    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><rect x="0" y="6" width="3" height="5" rx="0.5"/><rect x="4" y="4" width="3" height="7" rx="0.5"/><rect x="8" y="2" width="3" height="9" rx="0.5"/><rect x="12" y="0" width="3" height="11" rx="0.5"/></svg>
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M1 4 a 6 6 0 0 1 12 0"/><path d="M3 6 a 4 4 0 0 1 8 0"/><path d="M5 8 a 2 2 0 0 1 4 0"/></svg>
      <svg width="22" height="10" viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1"><rect x="0.5" y="0.5" width="18" height="9" rx="2"/><rect x="2" y="2" width="13" height="6" rx="1" fill="currentColor"/><rect x="19.5" y="3.5" width="1.5" height="3" rx="0.5" fill="currentColor"/></svg>
    </div>
  </div>
);

Object.assign(window, { Wordmark, TopBar, NavItem, BrowserFrame, PhoneFrame, StatusBar });
