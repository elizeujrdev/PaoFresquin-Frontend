// Desktop screens: Funcionário, PDV, Relatórios, Câmeras

const FuncionarioScreen = () => (
  <BrowserFrame url="sistema.paofresquim.com.br/funcionarios/carlos-aragao">
    <div className="pf" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar active="funcionarios" />
      <div style={{ padding: '28px 40px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <button className="pf-btn pf-btn-ghost" style={{ padding: '6px 10px' }}><IconArrowLeft size={16} /> Voltar</button>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>Funcionários · Carlos Aragão</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22, marginTop: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent-soft)',
                          color: 'var(--accent-ink)', fontWeight: 500, fontSize: 22,
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>CA</div>
            <div>
              <h1 className="pf-h1">Carlos Aragão</h1>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <span className="pf-pill accent">Padeiro</span>
                <span className="pf-pill muted">Em férias até 19/05</span>
                <span className="pf-pill"><IconClock size={12} /> 7 anos na casa</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="pf-btn pf-btn-danger"><IconTrash size={16} /> Desligar</button>
            <button className="pf-btn pf-btn-ghost"><IconX size={16} /> Cancelar</button>
            <button className="pf-btn pf-btn-accent"><IconCheck size={16} /> Salvar alterações</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 20 }}>
          <div className="pf-card" style={{ padding: 26 }}>
            <h2 className="pf-h2" style={{ marginBottom: 16 }}>Dados cadastrais</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="pf-field"><label className="pf-label">Nome completo</label><input className="pf-input" defaultValue="Carlos Eduardo Aragão" /></div>
              <div className="pf-field"><label className="pf-label">Cargo</label>
                <select className="pf-select"><option>Padeiro</option><option>Atendente</option></select></div>
              <div className="pf-field"><label className="pf-label">Telefone</label><input className="pf-input mono" defaultValue="(11) 97462-1108" /></div>
              <div className="pf-field"><label className="pf-label">Data de admissão</label><input className="pf-input mono" defaultValue="04/03/2019" /></div>
              <div className="pf-field" style={{ gridColumn: '1 / -1' }}>
                <label className="pf-label">Endereço</label>
                <input className="pf-input" defaultValue="Rua Padre Marchetti, 84 — Mooca, São Paulo / SP" /></div>
              <div className="pf-field" style={{ gridColumn: '1 / -1' }}>
                <label className="pf-label">Contato de emergência</label>
                <input className="pf-input" defaultValue="Helena Aragão (esposa) · (11) 99812-4471" /></div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="pf-card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <h3 className="pf-h2">Registros de ponto</h3>
                <span style={{ fontSize: 13, color: 'var(--muted)' }}>esta semana</span>
              </div>
              {[
                ['Seg 12/05', '04:58', '12:02', '7h04'],
                ['Ter 13/05', '05:02', '12:15', '7h13'],
                ['Qua 14/05', '04:55', '12:00', '7h05'],
                ['Qui 15/05', '—', '—', 'férias'],
              ].map(([d, e, s, t], i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr 70px',
                                       padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                                       fontSize: 14, alignItems: 'center' }}>
                  <span style={{ color: 'var(--muted)' }}>{d}</span>
                  <span className="mono">{e}</span>
                  <span className="mono">{s}</span>
                  <span className="mono" style={{ textAlign: 'right', color: t === 'férias' ? 'var(--accent-ink)' : 'var(--ink)' }}>{t}</span>
                </div>
              ))}
            </div>

            <div className="pf-card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <h3 className="pf-h2">Atestados & ausências</h3>
                <button className="pf-btn pf-btn-ghost" style={{ padding: '6px 10px', fontSize: 13 }}>
                  <IconPaperclip size={14} /> Anexar
                </button>
              </div>
              {[
                ['Atestado médico', '12 a 13/04', 'atestado-clinica.pdf'],
                ['Licença paternidade', '08 a 12/02', 'certidao-nasc.pdf'],
                ['Férias', '01 a 19/05', 'férias programadas'],
              ].map(([t, p, f], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0',
                                       borderBottom: i < 2 ? '1px solid var(--border)' : 'none', fontSize: 14 }}>
                  <div>
                    <div>{t}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 2 }} className="mono">{p}</div>
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconPaperclip size={14} /> {f}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </BrowserFrame>
);

const PdvScreen = () => (
  <BrowserFrame url="sistema.paofresquim.com.br/pdv">
    <div className="pf" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar active="pdv" />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 440px', overflow: 'hidden' }}>
        {/* Left — itens */}
        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 18, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h1 className="pf-h1">Venda #1843</h1>
              <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 14 }}>iniciada às 09:42 · funcionário: Ana Martins</p>
            </div>
            <button className="pf-btn pf-btn-ghost"><IconX size={16} /> Cancelar venda</button>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <IconBarcode size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-ink)' }} />
              <input className="pf-input pf-input-lg mono" style={{ paddingLeft: 44, fontSize: 16, borderColor: 'var(--accent)' }}
                     defaultValue="Aguardando leitura do código de barras…" />
            </div>
            <button className="pf-btn pf-btn-ghost pf-btn-lg"><IconSearch size={18} /> Buscar</button>
          </div>

          <div className="pf-card" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 90px 110px 110px 40px',
                          padding: '12px 16px', borderBottom: '1px solid var(--border)',
                          fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>
              <span>#</span><span>Produto</span><span style={{ textAlign: 'center' }}>Qtd</span>
              <span style={{ textAlign: 'right' }}>Unitário</span>
              <span style={{ textAlign: 'right' }}>Subtotal</span><span></span>
            </div>
            {[
              ['1', 'Pão Francês', '0,420 kg', '0,75 / kg', '0,32'],
              ['2', 'Sonho de Doce de Leite', '3 un', '6,50', '19,50'],
              ['3', 'Leite Integral 1L', '2 un', '5,90', '11,80'],
              ['4', 'Café Pilão 250g', '1 un', '14,80', '14,80'],
              ['5', 'Queijo Minas (peça)', '0,310 kg', '49,90 / kg', '15,47'],
            ].map(([n, p, q, u, s], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 90px 110px 110px 40px',
                                     padding: '14px 16px', borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                                     fontSize: 15, alignItems: 'center',
                                     background: i === 4 ? 'var(--accent-soft)' : 'transparent' }}>
                <span className="mono" style={{ color: 'var(--muted)' }}>{n}</span>
                <span style={{ fontWeight: i === 4 ? 500 : 400 }}>{p}</span>
                <span className="mono" style={{ textAlign: 'center' }}>{q}</span>
                <span className="mono" style={{ textAlign: 'right', color: 'var(--muted)' }}>R$ {u}</span>
                <span className="mono" style={{ textAlign: 'right', fontWeight: 500 }}>R$ {s}</span>
                <button style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer' }}>
                  <IconTrash size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right — total + pagamento */}
        <div style={{ borderLeft: '1px solid var(--border)', background: 'var(--surface)',
                      padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h2 className="pf-h2">Total da venda</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)' }}>
              <span>Itens (5)</span><span className="mono">R$ 61,89</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--muted)' }}>
              <span>Desconto</span><span className="mono">— 0,00</span>
            </div>
            <div className="pf-divider" style={{ margin: '8px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 16, fontWeight: 500 }}>Total</span>
              <span className="mono" style={{ fontSize: 36, fontWeight: 500, letterSpacing: '-0.03em' }}>R$ 61,89</span>
            </div>
          </div>

          <div>
            <div className="pf-eyebrow" style={{ marginBottom: 10 }}>Forma de pagamento</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                ['Dinheiro', IconMoney, false],
                ['Pix', IconPix, true],
                ['Débito', IconCard, false],
                ['Crédito', IconCard, false],
                ['Fiado', IconNotebook, false],
              ].map(([l, I, active]) => (
                <button key={l} className="pf-btn" style={{
                  justifyContent: 'flex-start', padding: '14px 14px',
                  border: '1px solid ' + (active ? 'var(--ink)' : 'var(--border)'),
                  background: active ? 'var(--ink)' : 'var(--surface)',
                  color: active ? '#fff' : 'var(--ink)',
                  gridColumn: l === 'Fiado' ? '1 / -1' : 'auto',
                }}>
                  <I size={18} /> {l}
                </button>
              ))}
            </div>
          </div>

          <div className="pf-field">
            <label className="pf-label">Funcionário responsável</label>
            <select className="pf-select"><option>Ana Martins · atendente</option><option>Beatriz Rocha · atendente</option></select>
          </div>

          <div style={{ background: 'var(--bg)', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: 'var(--muted)',
                        display: 'flex', gap: 8, alignItems: 'center' }}>
            <IconShield size={14} /> Pagamento integral obrigatório — sem parcelamento.
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <button className="pf-btn pf-btn-ghost pf-btn-lg" style={{ flex: 1 }}>
              <IconReceipt size={18} /> Emitir nota
            </button>
            <button className="pf-btn pf-btn-accent pf-btn-lg" style={{ flex: 1.4, justifyContent: 'center' }}>
              Finalizar venda <IconArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  </BrowserFrame>
);

// Mini SVG bar chart
const BarChart = () => {
  const data = [
    ['seg', 1240], ['ter', 1480], ['qua', 1620], ['qui', 1380],
    ['sex', 2140], ['sáb', 2840], ['dom', 1980], ['seg', 1310],
    ['ter', 1520], ['qua', 1842],
  ];
  const max = 3000;
  const W = 720, H = 180, pad = 30, barW = (W - pad * 2) / data.length - 8;
  return (
    <svg viewBox={`0 0 ${W} ${H + 30}`} style={{ width: '100%', height: 200 }}>
      {[0, 1, 2, 3].map(i => (
        <line key={i} x1={pad} x2={W - pad} y1={H - (i * H / 3)} y2={H - (i * H / 3)}
              stroke="var(--border)" strokeWidth="1" strokeDasharray={i === 0 ? '0' : '2,3'} />
      ))}
      {data.map(([d, v], i) => {
        const h = (v / max) * H;
        const x = pad + i * ((W - pad * 2) / data.length);
        const last = i === data.length - 1;
        return (
          <g key={i}>
            <rect x={x} y={H - h} width={barW} height={h}
                  fill={last ? 'var(--accent)' : 'var(--ink)'} rx="2" />
            <text x={x + barW / 2} y={H + 18} textAnchor="middle"
                  fontSize="11" fill="var(--muted)" fontFamily="Geist Mono, monospace">{d}</text>
          </g>
        );
      })}
      {[0, 1, 2, 3].map(i => (
        <text key={i} x={pad - 8} y={H - (i * H / 3) + 4} textAnchor="end"
              fontSize="10" fill="var(--muted)" fontFamily="Geist Mono, monospace">
          {(i * 1000).toLocaleString('pt-BR')}
        </text>
      ))}
    </svg>
  );
};

const RelatoriosScreen = () => (
  <BrowserFrame url="sistema.paofresquim.com.br/relatorios">
    <div className="pf" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar active="relatorios" />
      <div style={{ padding: '28px 40px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h1 className="pf-h1">Relatórios</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 14 }}>
              Carregado em <span className="mono">0,84s</span> · meta &lt; 2s ✓
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="pf-btn pf-btn-ghost"><IconDownload size={16} /> Exportar CSV</button>
            <button className="pf-btn pf-btn-ghost"><IconPrint size={16} /> Imprimir</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
          {[
            ['Vendas', true],
            ['Inadimplência', false],
            ['Estoque', false],
            ['Funcionários', false],
          ].map(([t, a], i) => (
            <button key={i} style={{
              background: 'transparent', border: 'none', fontFamily: 'inherit',
              padding: '10px 18px', fontSize: 15, color: a ? 'var(--ink)' : 'var(--muted)',
              fontWeight: a ? 500 : 400, cursor: 'pointer',
              borderBottom: a ? '2px solid var(--accent)' : '2px solid transparent', marginBottom: -1,
            }}>{t}</button>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, alignItems: 'center' }}>
          <div className="pf-pill"><IconCalendar size={14} /> 07/05 – 16/05/2026</div>
          <div className="pf-pill"><IconFilter size={14} /> Todos os produtos</div>
          <div className="pf-pill"><IconUser size={14} /> Todos os funcionários</div>
          <div className="pf-spacer"></div>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>208 vendas no período</span>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
          {[
            ['Total vendido', 'R$ 17.342,80', '+12,4% vs. anterior', 'success'],
            ['Ticket médio', 'R$ 83,38', '+R$ 4,10', 'success'],
            ['Vendas fiado', 'R$ 1.488,20', '8,6% do total', 'muted'],
            ['Em aberto', 'R$ 612,40', '7 clientes', 'danger'],
          ].map(([l, v, s, c], i) => (
            <div key={i} className="pf-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{l}</div>
              <div className="mono" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>{v}</div>
              <div style={{ marginTop: 10 }}><span className={`pf-pill ${c}`} style={{ fontSize: 12 }}>{s}</span></div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
          <div className="pf-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <h2 className="pf-h2">Vendas por dia</h2>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>R$ · últimos 10 dias</span>
            </div>
            <BarChart />
          </div>
          <div className="pf-card" style={{ padding: 24 }}>
            <h2 className="pf-h2" style={{ marginBottom: 14 }}>Mais vendidos</h2>
            {[
              ['Pão Francês', '342 kg', 78],
              ['Sonho doce de leite', '218 un', 60],
              ['Leite Integral 1L', '184 un', 51],
              ['Café Pilão 250g', '96 un', 32],
              ['Queijo Minas', '38 kg', 22],
            ].map(([p, q, w], i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 6 }}>
                  <span>{p}</span><span className="mono" style={{ color: 'var(--muted)' }}>{q}</span>
                </div>
                <div style={{ height: 4, background: 'var(--bg-soft)', borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${w}%`, background: 'var(--accent)', borderRadius: 2 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </BrowserFrame>
);

// Placeholder feed (não desenhar SVG complexo — usar listras + label mono)
const FeedPlaceholder = ({ label, time, online = true }) => (
  <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
                background: 'repeating-linear-gradient(135deg, #1f1c1a 0, #1f1c1a 14px, #252220 14px, #252220 28px)' }}>
    {/* Live badge */}
    <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: online ? '#e34c3a' : '#888' }}></span>
      <span className="mono" style={{ fontWeight: 500 }}>{online ? 'AO VIVO' : 'OFFLINE'}</span>
    </div>
    {/* Label */}
    <div style={{ position: 'absolute', top: 14, right: 14,
                  background: 'rgba(0,0,0,0.55)', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}
         className="mono">{label}</div>
    {/* Time */}
    <div style={{ position: 'absolute', bottom: 14, right: 14, color: '#fff', fontSize: 12, opacity: 0.9 }} className="mono">{time}</div>
    {/* Placeholder note centred */}
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.55)', fontSize: 13, fontFamily: 'Geist Mono, monospace' }}>
      {online ? '[ feed da câmera ]' : '[ sem sinal ]'}
    </div>
  </div>
);

const CamerasScreen = () => (
  <BrowserFrame url="sistema.paofresquim.com.br/cameras">
    <div className="pf" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar active="cameras" />
      <div style={{ padding: '28px 40px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <h1 className="pf-h1">Câmeras</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 14 }}>
              2 câmeras conectadas · qualidade HD 1080p
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="pf-pill success"><span style={{width:6,height:6,borderRadius:'50%',background:'currentColor'}}></span> Sistema ativo</span>
            <button className="pf-btn pf-btn-ghost"><IconMaximize size={16} /> Tela cheia</button>
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: '#1f1c1a' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <FeedPlaceholder label="CAM 01 · LOJA" time="16/05/2026 09:42:18" />
            </div>
            <div style={{ background: 'var(--surface)', padding: '12px 16px', display: 'flex',
                          justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Loja — balcão e caixa</div>
              <span className="pf-pill success" style={{ fontSize: 12 }}>1080p · 30fps</span>
            </div>
          </div>
          <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: '#1f1c1a' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <FeedPlaceholder label="CAM 02 · COZINHA" time="16/05/2026 09:42:18" />
            </div>
            <div style={{ background: 'var(--surface)', padding: '12px 16px', display: 'flex',
                          justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Cozinha — forno e bancada</div>
              <span className="pf-pill success" style={{ fontSize: 12 }}>1080p · 30fps</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <IconShield size={14} /> Acesso restrito. Acessível pelo aplicativo mobile com a mesma credencial.
        </div>
      </div>
    </div>
  </BrowserFrame>
);

Object.assign(window, { FuncionarioScreen, PdvScreen, RelatoriosScreen, CamerasScreen });
