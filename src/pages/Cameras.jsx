import { useEffect, useState } from 'react'
import { Lock, Maximize2 } from 'lucide-react'
import api from '../api/client'

export default function Cameras() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api.get('/cameras/').then((r) => setData(r.data))
  }, [])

  return (
    <>
      <div className="page-header">
        <span>
          <h1 className="pf-h1">Câmeras</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 14 }}>
            {data?.total ?? 2} câmeras conectadas · qualidade HD 1080p
          </p>
        </span>
        <div className="page-header-actions">
          <span className="pf-pill success"><span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)' }} /> Sistema ativo</span>
          <button type="button" className="pf-btn pf-btn-ghost"><Maximize2 size={16} /> Tela cheia</button>
        </div>
      </div>

      <div className="cameras-grid">
        {data?.cameras?.map((cam) => (
          <span key={cam.id} className="pf-card" style={{ overflow: 'hidden' }}>
            <span className="camera-feed">
              <span style={{ position: 'absolute', top: 12, left: 12, background: '#000', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>
                ● AO VIVO
              </span>
              <span style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,.7)', color: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: 12 }}>
                {cam.codigo} · {cam.local}
              </span>
              <span className="camera-feed-placeholder">{cam.placeholder}</span>
              <span style={{ position: 'absolute', bottom: 12, right: 12, color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                {cam.timestamp}
              </span>
            </span>
            <span style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 14 }}>{cam.titulo}</span>
              <span className="pf-pill success">{cam.qualidade}</span>
            </span>
          </span>
        ))}
      </div>

      <p style={{ marginTop: 24, fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Lock size={14} />
        Acesso restrito. Acessível pelo aplicativo mobile com a mesma credencial.
      </p>
    </>
  )
}
