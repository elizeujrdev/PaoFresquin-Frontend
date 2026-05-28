// Desktop screens: Login, Dashboard, Cadastro Produto, Cadastro Cliente

const LoginScreen = () => (
  <BrowserFrame url="sistema.paofresquim.com.br/login">
    <div className="pf" style={{ width: '100%', height: '100%', display: 'flex',
                                   alignItems: 'center', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 420, display: 'flex', flexDirection: 'column', gap: 36 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <Wordmark size="xl" />
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14, letterSpacing: '0.01em' }}>
            Sistema de gestão · Loja Centro
          </p>
        </div>

        <div className="pf-card" style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="pf-field">
            <label className="pf-label">Usuário</label>
            <input className="pf-input pf-input-lg" defaultValue="ana.martins" />
          </div>
          <div className="pf-field">
            <label className="pf-label">Senha</label>
            <div style={{ position: 'relative' }}>
              <input className="pf-input pf-input-lg" type="password" defaultValue="••••••••••" style={{ paddingRight: 44 }} />
              <button style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                               background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 4 }}>
                <IconEye size={18} />
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--danger-soft)', color: 'var(--danger)', padding: '12px 14px',
                        borderRadius: 6, fontSize: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <IconAlert size={18} />
            <div>Credenciais inválidas. Verifique usuário e senha ou contate o administrador.</div>
          </div>

          <button className="pf-btn pf-btn-primary pf-btn-lg" style={{ justifyContent: 'center', width: '100%', marginTop: 4 }}>
            Entrar
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', margin: 0 }}>
          Acesso controlado pelo administrador. <br/>
          Esqueceu a senha? Procure o gerente.
        </p>
      </div>
    </div>
  </BrowserFrame>
);

const DashTile = ({ icon: I, title, sub, accent }) => (
  <button className="pf-card" style={{
    padding: 28, display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left',
    cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--surface)',
    fontFamily: 'inherit', alignItems: 'flex-start',
  }}>
    <div style={{ width: 56, height: 56, borderRadius: 10,
                  background: accent ? 'var(--accent-soft)' : 'var(--bg-soft)',
                  color: accent ? 'var(--accent-ink)' : 'var(--ink)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <I size={28} stroke={1.5} />
    </div>
    <div>
      <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.015em', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.4 }}>{sub}</div>
    </div>
  </button>
);

const DashboardScreen = () => (
  <BrowserFrame url="sistema.paofresquim.com.br">
    <div className="pf" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar active="dashboard" />
      <div style={{ padding: '32px 40px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 className="pf-h1">Bom dia, Ana.</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 15 }}>
              Hoje, quarta-feira · 38 vendas registradas · <span className="mono">R$ 1.842,30</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="pf-pill"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--success)'}}></span> Câmeras online</span>
            <span className="pf-pill accent"><IconAlert size={13} /> 3 fiados vencidos</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <DashTile icon={IconCart} title="Registrar Venda" sub="Abrir o PDV e iniciar uma nova venda" accent />
          <DashTile icon={IconUsers} title="Clientes" sub="Cadastrar, consultar fiado e histórico" />
          <DashTile icon={IconBriefcase} title="Funcionários" sub="Ponto, atestados e licenças" />
          <DashTile icon={IconBox} title="Produtos" sub="Cadastro, preços e códigos de barras" />
          <DashTile icon={IconChart} title="Relatórios" sub="Vendas por período e inadimplência" />
          <DashTile icon={IconCamera} title="Câmeras" sub="Monitorar loja e cozinha em tempo real" />
        </div>

        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <div className="pf-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 className="pf-h2">Últimas vendas</h2>
              <button className="pf-btn pf-btn-ghost" style={{ padding: '6px 12px', fontSize: 13 }}>Ver todas</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                ['#1842', '09:34', 'Maria Silva', 'Dinheiro', '24,80'],
                ['#1841', '09:31', 'Consumidor', 'Pix', '12,50'],
                ['#1840', '09:28', 'João Pereira', 'Fiado', '47,20'],
                ['#1839', '09:22', 'Consumidor', 'Débito', '8,90'],
              ].map(([id, time, who, pay, val]) => (
                <div key={id} style={{ display: 'grid', gridTemplateColumns: '70px 60px 1fr 100px 100px',
                                       padding: '10px 0', borderBottom: '1px solid var(--border)',
                                       fontSize: 14, alignItems: 'center' }}>
                  <span className="mono" style={{ color: 'var(--muted)' }}>{id}</span>
                  <span className="mono" style={{ color: 'var(--muted)' }}>{time}</span>
                  <span>{who}</span>
                  <span style={{ color: 'var(--muted)', fontSize: 13 }}>{pay}</span>
                  <span className="mono" style={{ textAlign: 'right', fontWeight: 500 }}>R$ {val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pf-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h2 className="pf-h2">Avisos</h2>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)', marginTop: 7, flexShrink: 0 }}></div>
              <div style={{ fontSize: 14 }}>
                <div><strong>3 clientes</strong> com fiado vencido</div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>Última notificação: 12/05</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', marginTop: 7, flexShrink: 0 }}></div>
              <div style={{ fontSize: 14 }}>
                <div><strong>Pão francês</strong> próximo do mínimo</div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>3,2 kg restantes</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '12px 0' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted-2)', marginTop: 7, flexShrink: 0 }}></div>
              <div style={{ fontSize: 14 }}>
                <div>Carlos retorna de férias <strong>seg, 20/05</strong></div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>Padeiro · 15 dias</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BrowserFrame>
);

const ProdutoScreen = () => (
  <BrowserFrame url="sistema.paofresquim.com.br/produtos/novo">
    <div className="pf" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar active="produtos" />
      <div style={{ padding: '28px 40px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <button className="pf-btn pf-btn-ghost" style={{ padding: '6px 10px' }}>
            <IconArrowLeft size={16} /> Voltar
          </button>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>Produtos · Novo</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, marginTop: 8 }}>
          <h1 className="pf-h1">Cadastro de produto</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="pf-btn pf-btn-danger"><IconTrash size={16} /> Excluir</button>
            <button className="pf-btn pf-btn-ghost"><IconX size={16} /> Cancelar</button>
            <button className="pf-btn pf-btn-accent"><IconCheck size={16} /> Salvar produto</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          <div className="pf-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 className="pf-h2">Informações básicas</h2>
            <div className="pf-field">
              <label className="pf-label">Nome do produto</label>
              <input className="pf-input pf-input-lg" defaultValue="Pão Francês" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="pf-field">
                <label className="pf-label">Código de barras</label>
                <div style={{ position: 'relative' }}>
                  <input className="pf-input mono" defaultValue="7891000100103" style={{ paddingLeft: 38 }} />
                  <IconBarcode size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
                </div>
              </div>
              <div className="pf-field">
                <label className="pf-label">Categoria</label>
                <select className="pf-select">
                  <option>Pães</option>
                  <option>Doces & Confeitaria</option>
                  <option>Salgados</option>
                  <option>Bebidas</option>
                  <option>Mercearia</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="pf-field">
                <label className="pf-label">Preço unitário</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 14 }}>R$</span>
                  <input className="pf-input mono" defaultValue="0,75" style={{ paddingLeft: 36 }} />
                </div>
              </div>
              <div className="pf-field">
                <label className="pf-label">Unidade de medida</label>
                <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
                  <button style={{ flex: 1, padding: 12, border: 'none', background: 'var(--ink)', color: '#fff', fontFamily: 'inherit', fontSize: 15, cursor: 'pointer' }}>Peso (kg)</button>
                  <button style={{ flex: 1, padding: 12, border: 'none', background: 'var(--surface)', color: 'var(--ink)', fontFamily: 'inherit', fontSize: 15, cursor: 'pointer' }}>Unidade</button>
                </div>
              </div>
            </div>
            <div className="pf-field">
              <label className="pf-label">Descrição (opcional)</label>
              <textarea className="pf-input" rows="2" placeholder="Notas internas, ingredientes principais, etc."></textarea>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="pf-card" style={{ padding: 24 }}>
              <div className="pf-eyebrow" style={{ marginBottom: 12 }}>Pré-visualização</div>
              <div style={{ border: '1px dashed var(--border-2)', borderRadius: 8, padding: 20, textAlign: 'center', background: 'var(--bg)' }}>
                <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 4 }}>Pão Francês</div>
                <div className="mono" style={{ color: 'var(--muted)', fontSize: 13 }}>7891000100103</div>
                <div className="mono" style={{ fontSize: 24, fontWeight: 500, marginTop: 14, letterSpacing: '-0.02em' }}>R$ 0,75 <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 400 }}>/ kg</span></div>
              </div>
            </div>
            <div className="pf-card" style={{ padding: 24 }}>
              <h3 className="pf-h2" style={{ marginBottom: 14 }}>Estoque</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>Disponível hoje</span>
                <span className="mono">12,4 kg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--muted)' }}>Mínimo</span>
                <span className="mono">3,0 kg</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '8px 0' }}>
                <span style={{ color: 'var(--muted)' }}>Vendido (7d)</span>
                <span className="mono">87,2 kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BrowserFrame>
);

const ClienteScreen = () => (
  <BrowserFrame url="sistema.paofresquim.com.br/clientes/novo">
    <div className="pf" style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <TopBar active="clientes" />
      <div style={{ padding: '28px 40px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <button className="pf-btn pf-btn-ghost" style={{ padding: '6px 10px' }}><IconArrowLeft size={16} /> Voltar</button>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>Clientes · Novo</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18, marginTop: 8 }}>
          <div>
            <h1 className="pf-h1">João Pereira da Silva</h1>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 14 }}>CPF 472.103.882-90 · cliente desde 02/2024</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="pf-btn pf-btn-ghost"><IconX size={16} /> Cancelar</button>
            <button className="pf-btn" disabled style={{ background: 'var(--danger-soft)', color: 'var(--danger)', cursor: 'not-allowed' }}>
              <IconLock size={16} /> Salvamento bloqueado
            </button>
          </div>
        </div>

        {/* Serasa alert */}
        <div style={{ background: '#fff', border: '1px solid var(--danger)', borderLeft: '4px solid var(--danger)',
                      borderRadius: 8, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--danger-soft)',
                        color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IconAlert size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: 'var(--danger)', marginBottom: 2 }}>
              Nome negativado na consulta Serasa
            </div>
            <div style={{ fontSize: 14, color: 'var(--ink-2)' }}>
              Consultado em 16/05/2026 às 09:12 · 2 restrições ativas · score 312/1000.
              O cadastro de cliente fiado está <strong>bloqueado</strong> conforme política da padaria.
            </div>
          </div>
          <button className="pf-btn pf-btn-ghost" style={{ fontSize: 13, padding: '8px 12px' }}>Ver detalhes</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
          <div className="pf-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 className="pf-h2">Dados pessoais</h2>
            <div className="pf-field">
              <label className="pf-label">Nome completo</label>
              <input className="pf-input" defaultValue="João Pereira da Silva" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="pf-field">
                <label className="pf-label">CPF</label>
                <input className="pf-input mono" defaultValue="472.103.882-90" />
              </div>
              <div className="pf-field">
                <label className="pf-label">Telefone</label>
                <input className="pf-input mono" defaultValue="(11) 98421-7733" />
              </div>
            </div>
            <div className="pf-field">
              <label className="pf-label">E-mail</label>
              <input className="pf-input" defaultValue="joao.pereira@email.com" />
            </div>
            <div className="pf-field">
              <label className="pf-label">Endereço</label>
              <input className="pf-input" defaultValue="Rua das Acácias, 218 — Centro, São Paulo / SP" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="pf-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <h3 className="pf-h2">Crédito · Serasa</h3>
                <span className="pf-pill danger">Negativado</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0' }}>
                <span style={{ color: 'var(--muted)' }}>Score</span>
                <span className="mono">312 / 1000</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0' }}>
                <span style={{ color: 'var(--muted)' }}>Restrições</span>
                <span className="mono">2 ativas</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '6px 0' }}>
                <span style={{ color: 'var(--muted)' }}>Última consulta</span>
                <span className="mono">16/05 09:12</span>
              </div>
            </div>
            <div className="pf-card" style={{ padding: 24 }}>
              <h3 className="pf-h2" style={{ marginBottom: 12 }}>Histórico de fiado</h3>
              {[
                ['12/05', '3 itens', '28,40', 'aberto'],
                ['04/05', 'Pão + leite', '11,90', 'aberto'],
                ['28/04', 'Pão francês', '6,80', 'pago'],
              ].map(([d, w, v, st]) => (
                <div key={d} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 80px 70px',
                                       padding: '10px 0', borderBottom: '1px solid var(--border)',
                                       fontSize: 13, alignItems: 'center' }}>
                  <span className="mono" style={{ color: 'var(--muted)' }}>{d}</span>
                  <span>{w}</span>
                  <span className="mono" style={{ textAlign: 'right' }}>R$ {v}</span>
                  <span className={`pf-pill ${st === 'aberto' ? 'danger' : 'success'}`} style={{ fontSize: 11, padding: '2px 8px', justifyContent: 'center' }}>{st}</span>
                </div>
              ))}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>Total em aberto</span>
                <span className="mono" style={{ fontWeight: 600, color: 'var(--danger)' }}>R$ 40,30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </BrowserFrame>
);

Object.assign(window, { LoginScreen, DashboardScreen, ProdutoScreen, ClienteScreen });
