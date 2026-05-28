// Mobile screens: Login, Dashboard, PDV, Câmeras

const MobileNav = ({ active }) => (
  <div className="pf-mobile-nav">
    {[
      ['inicio', 'Início', IconHome],
      ['pdv', 'Venda', IconCart],
      ['clientes', 'Clientes', IconUsers],
      ['cameras', 'Câmeras', IconCamera],
    ].map(([id, l, I]) => (
      <button key={id} className={`pf-mobile-nav-item ${active === id ? 'active' : ''}`}>
        <I size={22} stroke={1.6} />
        <span>{l}</span>
        <span className="pf-mn-dot"></span>
      </button>
    ))}
  </div>
);

const MobileLogin = () => (
  <PhoneFrame>
    <div className="pf" style={{ width: '100%', height: '100%', background: 'var(--bg)',
                                   display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ flex: 1, padding: '28px 24px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Wordmark size="lg" />
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 13 }}>Loja Centro</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
          <div className="pf-field">
            <label className="pf-label">Usuário</label>
            <input className="pf-input pf-input-lg" defaultValue="ana.martins" />
          </div>
          <div className="pf-field">
            <label className="pf-label">Senha</label>
            <input className="pf-input pf-input-lg" type="password" defaultValue="••••••••" />
          </div>
        </div>

        <button className="pf-btn pf-btn-primary pf-btn-lg" style={{ justifyContent: 'center', width: '100%', padding: '16px' }}>
          Entrar
        </button>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', margin: 'auto 0 0' }}>
          Acesso controlado pelo administrador.
        </p>
      </div>
    </div>
  </PhoneFrame>
);

const MobileDash = () => {
  const tiles = [
    ['Registrar Venda', IconCart, true],
    ['Clientes', IconUsers, false],
    ['Produtos', IconBox, false],
    ['Funcionários', IconBriefcase, false],
    ['Relatórios', IconChart, false],
    ['Câmeras', IconCamera, false],
  ];
  return (
    <PhoneFrame>
      <div className="pf" style={{ width: '100%', height: '100%', background: 'var(--bg)',
                                     display: 'flex', flexDirection: 'column' }}>
        <StatusBar />
        <div style={{ padding: '12px 20px 16px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Wordmark />
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'var(--muted)' }}>
              <IconBell size={20} stroke={1.6} />
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-soft)',
                            color: 'var(--accent-ink)', fontSize: 12, fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>AM</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 20px 100px', flex: 1, overflow: 'hidden' }}>
          <h1 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Bom dia, Ana.</h1>
          <p style={{ margin: '0 0 18px', color: 'var(--muted)', fontSize: 13 }}>
            38 vendas hoje · <span className="mono">R$ 1.842,30</span>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {tiles.map(([l, I, accent], i) => (
              <button key={i} className="pf-card" style={{
                padding: 16, display: 'flex', flexDirection: 'column', gap: 12,
                alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'inherit', background: 'var(--surface)',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 8,
                              background: accent ? 'var(--accent-soft)' : 'var(--bg-soft)',
                              color: accent ? 'var(--accent-ink)' : 'var(--ink)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <I size={22} />
                </div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>{l}</div>
              </button>
            ))}
          </div>

          <div className="pf-card" style={{ padding: 16, marginTop: 14,
                                              borderLeft: '3px solid var(--danger)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <IconAlert size={16} style={{ color: 'var(--danger)' }} />
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--danger)' }}>3 fiados vencidos</span>
            </div>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>R$ 612,40 em aberto · ver detalhes</p>
          </div>
        </div>

        <MobileNav active="inicio" />
      </div>
    </PhoneFrame>
  );
};

const MobilePdv = () => (
  <PhoneFrame>
    <div className="pf" style={{ width: '100%', height: '100%', background: 'var(--bg)',
                                   display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ padding: '8px 16px 12px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button style={{ background: 'none', border: 'none', padding: 4 }}><IconArrowLeft size={22} /></button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Venda #1843</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>5 itens · Ana Martins</div>
          </div>
        </div>
      </div>

      {/* Scanner */}
      <div style={{ padding: '12px 16px', background: 'var(--bg)' }}>
        <div style={{ position: 'relative' }}>
          <IconBarcode size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-ink)' }} />
          <input className="pf-input mono" style={{ paddingLeft: 42, paddingRight: 44, fontSize: 14, borderColor: 'var(--accent)' }}
                 placeholder="Bipar produto…" />
          <button style={{ position: 'absolute', right: 6, top: 6, bottom: 6,
                           background: 'var(--ink)', color: '#fff', border: 'none',
                           borderRadius: 4, width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <IconBarcode size={16} />
          </button>
        </div>
      </div>

      {/* Items list */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '0 16px' }}>
        {[
          ['Pão Francês', '0,420 kg × R$ 0,75', '0,32'],
          ['Sonho Doce de Leite', '3 un × R$ 6,50', '19,50'],
          ['Leite Integral 1L', '2 un × R$ 5,90', '11,80'],
          ['Café Pilão 250g', '1 un × R$ 14,80', '14,80'],
          ['Queijo Minas', '0,310 kg × R$ 49,90', '15,47'],
        ].map(([p, m, v], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '12px 0',
                                 borderBottom: '1px solid var(--border)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{p}</div>
              <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{m}</div>
            </div>
            <div className="mono" style={{ fontSize: 14, fontWeight: 500 }}>R$ {v}</div>
          </div>
        ))}
      </div>

      {/* Total + actions */}
      <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)',
                    padding: '14px 16px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>Total · 5 itens</span>
          <span className="mono" style={{ fontSize: 26, fontWeight: 500, letterSpacing: '-0.02em' }}>R$ 61,89</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginBottom: 10 }}>
          {[['Dim', IconMoney], ['Pix', IconPix, true], ['Déb', IconCard], ['Créd', IconCard], ['Fiad', IconNotebook]].map(([l, I, a], i) => (
            <button key={i} style={{
              padding: '10px 4px', borderRadius: 6,
              border: '1px solid ' + (a ? 'var(--ink)' : 'var(--border)'),
              background: a ? 'var(--ink)' : 'var(--surface)',
              color: a ? '#fff' : 'var(--ink)',
              fontFamily: 'inherit', fontSize: 11, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <I size={16} /> {l}
            </button>
          ))}
        </div>

        <button className="pf-btn pf-btn-accent" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
          Finalizar venda <IconArrowRight size={18} />
        </button>
      </div>
    </div>
  </PhoneFrame>
);

const MobileCameras = () => (
  <PhoneFrame>
    <div className="pf" style={{ width: '100%', height: '100%', background: 'var(--bg)',
                                   display: 'flex', flexDirection: 'column' }}>
      <StatusBar />
      <div style={{ padding: '10px 16px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>Câmeras</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>2 ativas · HD 1080p</div>
          </div>
          <span className="pf-pill success" style={{ fontSize: 11 }}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'currentColor'}}></span> Online
          </span>
        </div>
      </div>

      <div style={{ flex: 1, padding: '14px 16px 100px', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', height: '46%' }}>
          <FeedPlaceholder label="CAM 01 · LOJA" time="09:42:18" />
        </div>
        <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', height: '46%' }}>
          <FeedPlaceholder label="CAM 02 · COZINHA" time="09:42:18" />
        </div>
      </div>

      <MobileNav active="cameras" />
    </div>
  </PhoneFrame>
);

Object.assign(window, { MobileLogin, MobileDash, MobilePdv, MobileCameras });
