// Pão FresQUIM — Main canvas assembly
const { useState } = React;

const DESKTOP_W = 1440;
const DESKTOP_H = 900;
const MOBILE_W = 390;
const MOBILE_H = 844;

function App() {
  return (
    <DesignCanvas>
      <DCSection id="intro" title="Pão FresQUIM · Protótipos de tela" subtitle="Sistema de gestão de padaria · v1 · todas as telas para documentação">
        <DCArtboard id="brand" label="Identidade & sistema" width={1100} height={620}>
          <div className="pf" style={{ width: '100%', height: '100%', padding: 56, background: 'var(--bg)',
                                         display: 'flex', flexDirection: 'column', gap: 40, overflow: 'hidden' }}>
            <div>
              <Wordmark size="xl" />
              <p style={{ margin: '14px 0 0', color: 'var(--muted)', fontSize: 16, maxWidth: 620, lineHeight: 1.5 }}>
                Sistema de gestão para padarias de bairro. Visual sóbrio, sem decoração desnecessária —
                fonte grande, navegação sempre exposta, paleta neutra com um único acento âmbar.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
              <div>
                <div className="pf-eyebrow" style={{ marginBottom: 14 }}>Paleta</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    ['#faf8f4', 'fundo'],
                    ['#ffffff', 'superfície'],
                    ['#e8e2d6', 'borda'],
                    ['#1a1614', 'tinta'],
                    ['#c8821f', 'acento'],
                    ['#a83e2c', 'alerta'],
                  ].map(([c, l]) => (
                    <div key={c} style={{ flex: 1 }}>
                      <div style={{ height: 56, borderRadius: 6, background: c, border: '1px solid var(--border)' }}></div>
                      <div style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)' }} className="mono">{c}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink)' }}>{l}</div>
                    </div>
                  ))}
                </div>

                <div className="pf-eyebrow" style={{ marginTop: 28, marginBottom: 12 }}>Tipografia</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 32, letterSpacing: '-0.025em', fontWeight: 500 }}>Geist Sans · 500</div>
                  <div style={{ fontSize: 18, color: 'var(--muted)' }}>Corpo regular · mínimo 16px</div>
                  <div className="mono" style={{ fontSize: 15, color: 'var(--accent-ink)' }}>R$ 1.842,30 · Geist Mono</div>
                </div>
              </div>

              <div>
                <div className="pf-eyebrow" style={{ marginBottom: 14 }}>Componentes</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  <button className="pf-btn pf-btn-primary">Ação primária</button>
                  <button className="pf-btn pf-btn-accent">Ação principal</button>
                  <button className="pf-btn pf-btn-ghost">Ação secundária</button>
                  <button className="pf-btn pf-btn-danger"><IconTrash size={14}/> Excluir</button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                  <span className="pf-pill">neutro</span>
                  <span className="pf-pill accent">destaque</span>
                  <span className="pf-pill success">ok</span>
                  <span className="pf-pill danger">alerta</span>
                  <span className="pf-pill muted">silencioso</span>
                </div>
                <input className="pf-input" placeholder="Campo de entrada" style={{ marginBottom: 10 }} />

                <div className="pf-eyebrow" style={{ marginTop: 22, marginBottom: 10 }}>Restrições atendidas</div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 14, color: 'var(--ink-2)',
                             display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <li style={{ display: 'flex', gap: 8 }}><IconCheck size={16} style={{ color: 'var(--success)' }}/> Corpo ≥ 16px, hit-targets ≥ 44px</li>
                  <li style={{ display: 'flex', gap: 8 }}><IconCheck size={16} style={{ color: 'var(--success)' }}/> Sem menus hambúrguer ou dropdowns escondidos</li>
                  <li style={{ display: 'flex', gap: 8 }}><IconCheck size={16} style={{ color: 'var(--success)' }}/> Paleta de 3 cores + neutros</li>
                  <li style={{ display: 'flex', gap: 8 }}><IconCheck size={16} style={{ color: 'var(--success)' }}/> Sem emojis, ilustrações cartoon ou gradientes</li>
                  <li style={{ display: 'flex', gap: 8 }}><IconCheck size={16} style={{ color: 'var(--success)' }}/> Versões desktop e mobile</li>
                </ul>
              </div>
            </div>
          </div>
        </DCArtboard>
      </DCSection>

      <DCSection id="desktop" title="Desktop (1440 × 900)" subtitle="Telas principais do sistema · acessadas via navegador no caixa e na gestão">
        <DCArtboard id="login-d" label="01 · Login" width={DESKTOP_W} height={DESKTOP_H}>
          <LoginScreen />
        </DCArtboard>
        <DCArtboard id="dash-d" label="02 · Dashboard / Início" width={DESKTOP_W} height={DESKTOP_H}>
          <DashboardScreen />
        </DCArtboard>
        <DCArtboard id="pdv-d" label="03 · PDV — Registro de Venda" width={DESKTOP_W} height={DESKTOP_H}>
          <PdvScreen />
        </DCArtboard>
        <DCArtboard id="prod-d" label="04 · Cadastro de Produto" width={DESKTOP_W} height={DESKTOP_H}>
          <ProdutoScreen />
        </DCArtboard>
        <DCArtboard id="cli-d" label="05 · Cadastro de Cliente (fiado · alerta Serasa)" width={DESKTOP_W} height={DESKTOP_H}>
          <ClienteScreen />
        </DCArtboard>
        <DCArtboard id="func-d" label="06 · Cadastro de Funcionário" width={DESKTOP_W} height={DESKTOP_H}>
          <FuncionarioScreen />
        </DCArtboard>
        <DCArtboard id="rel-d" label="07 · Relatórios" width={DESKTOP_W} height={DESKTOP_H}>
          <RelatoriosScreen />
        </DCArtboard>
        <DCArtboard id="cam-d" label="08 · Monitoramento de Câmeras" width={DESKTOP_W} height={DESKTOP_H}>
          <CamerasScreen />
        </DCArtboard>
      </DCSection>

      <DCSection id="mobile" title="Mobile (390 × 844)" subtitle="Operação no balcão e acesso remoto às câmeras">
        <DCArtboard id="login-m" label="01 · Login" width={MOBILE_W} height={MOBILE_H}>
          <MobileLogin />
        </DCArtboard>
        <DCArtboard id="dash-m" label="02 · Início" width={MOBILE_W} height={MOBILE_H}>
          <MobileDash />
        </DCArtboard>
        <DCArtboard id="pdv-m" label="03 · Registrar Venda" width={MOBILE_W} height={MOBILE_H}>
          <MobilePdv />
        </DCArtboard>
        <DCArtboard id="cam-m" label="04 · Câmeras" width={MOBILE_W} height={MOBILE_H}>
          <MobileCameras />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
