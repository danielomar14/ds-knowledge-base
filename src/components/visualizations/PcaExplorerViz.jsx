import React, { useState, useEffect, useRef } from 'react';

export default function PcaExplorerViz() {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(35);   // rotación de la nube de datos
  const [noiseZ, setNoiseZ] = useState(0.3);  // varianza en dirección PC3 (ruido)
  const [showPC, setShowPC] = useState(true);
  const [kComp, setKComp] = useState(1);    // cuántos PCs retener

  const N = 120;

  // Genera datos en 2D proyectados desde una nube 3D controlada
  const generateData = (angleDeg, nz) => {
    const rad = angleDeg * Math.PI / 180;
    const rng = (s) => {
      // LCG determinista seeded por s para reproducibilidad visual
      let x = Math.sin(s * 9301 + 49297) * 233280;
      return x - Math.floor(x);
    };
    const pts = [];
    for (let i = 0; i < N; i++) {
      const r1 = (rng(i * 3) - 0.5) * 2;
      const r2 = (rng(i * 3 + 1) - 0.5) * 2;
      const r3 = (rng(i * 3 + 2) - 0.5) * 2;
      // Datos en sistema PC: PC1 alta var, PC2 media, PC3 = ruido
      const pc1 = r1 * 3.0;
      const pc2 = r2 * 1.2;
      const pc3 = r3 * nz;
      // Rotar PC1/PC2 por 'angle' para mostrar que PCA lo encuentra
      const x = pc1 * Math.cos(rad) - pc2 * Math.sin(rad);
      const y = pc1 * Math.sin(rad) + pc2 * Math.cos(rad);
      pts.push({ x, y, pc1, pc2, pc3 });
    }
    return pts;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const sc = 38;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, W, H);

    const tc = ([x, y]) => [cx + x * sc, cy - y * sc];
    const pts = generateData(angle, noiseZ);

    // ── Ejes tenues ───────────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    ctx.setLineDash([]);

    // ── Puntos originales ─────────────────────────────────────────────────
    pts.forEach(({ x, y }) => {
      const [px, py] = tc([x, y]);
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(96,165,250,0.55)';
      ctx.fill();
    });

    // ── Calcular PCA analítico de los puntos generados ────────────────────
    const meanX = pts.reduce((a, p) => a + p.x, 0) / N;
    const meanY = pts.reduce((a, p) => a + p.y, 0) / N;
    const cXX = pts.reduce((a, p) => a + (p.x - meanX) ** 2, 0) / (N - 1);
    const cXY = pts.reduce((a, p) => a + (p.x - meanX) * (p.y - meanY), 0) / (N - 1);
    const cYY = pts.reduce((a, p) => a + (p.y - meanY) ** 2, 0) / (N - 1);

    // Eigenvalores de la matriz 2×2 de covarianza
    const trace = cXX + cYY;
    const det = cXX * cYY - cXY * cXY;
    const disc = Math.sqrt(Math.max(0, (trace / 2) ** 2 - det));
    const lam1 = trace / 2 + disc;
    const lam2 = trace / 2 - disc;

    // Eigenvectores
    const v1 = cXY !== 0
      ? normalize([lam1 - cYY, cXY])
      : [1, 0];
    const v2 = [-v1[1], v1[0]];

    function normalize([a, b]) {
      const n = Math.sqrt(a * a + b * b);
      return n > 0 ? [a / n, b / n] : [a, b];
    }

    const totalVar = lam1 + lam2;
    const pve1 = lam1 / totalVar;
    const pve2 = lam2 / totalVar;

    // ── Proyección sobre PC1 (línea de reconstrucción) ────────────────────
    if (kComp >= 1) {
      pts.forEach(({ x, y }) => {
        const xc = x - meanX, yc = y - meanY;
        const proj = xc * v1[0] + yc * v1[1];
        const rx = meanX + proj * v1[0];
        const ry = meanY + proj * v1[1];
        const [px, py] = tc([x, y]);
        const [prx, pry] = tc([rx, ry]);
        ctx.strokeStyle = 'rgba(248,113,113,0.25)';
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(prx, pry); ctx.stroke();
        ctx.beginPath();
        ctx.arc(prx, pry, 2.5, 0, 2 * Math.PI);
        ctx.fillStyle = '#f87171';
        ctx.fill();
      });
    }

    // ── Componentes principales ───────────────────────────────────────────
    if (showPC) {
      const drawPC = (vec, lam, color, label) => {
        const mag = Math.sqrt(lam) * 1.6;
        const start = [meanX, meanY];
        const end = [meanX + vec[0] * mag, meanY + vec[1] * mag];
        const [x1, y1] = tc(start);
        const [x2, y2] = tc(end);
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len, uy = dy / len;
        ctx.strokeStyle = color; ctx.fillStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        const hw = 7, hl = 12;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - hl * ux + hw * uy, y2 - hl * uy - hw * ux);
        ctx.lineTo(x2 - hl * ux - hw * uy, y2 - hl * uy + hw * ux);
        ctx.closePath(); ctx.fill();
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = color;
        ctx.fillText(label, x2 + 6, y2 - 4);
      };

      drawPC(v1, lam1, '#34d399', `PC1 (${(pve1 * 100).toFixed(1)}%)`);
      drawPC(v2, lam2, '#fbbf24', `PC2 (${(pve2 * 100).toFixed(1)}%)`);
    }

    // ── Elipse de confianza (1σ) ──────────────────────────────────────────
    ctx.strokeStyle = 'rgba(167,139,250,0.5)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let t = 0; t <= 2 * Math.PI + 0.02; t += 0.03) {
      const a = Math.sqrt(lam1) * Math.cos(t);
      const b = Math.sqrt(lam2) * Math.sin(t);
      const ex = meanX + a * v1[0] + b * v2[0];
      const ey = meanY + a * v1[1] + b * v2[1];
      const [px, py] = tc([ex, ey]);
      t < 0.01 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // ── Leyenda y stats ───────────────────────────────────────────────────
    const items = [
      { color: '#60a5fa', label: 'Datos originales' },
      { color: '#34d399', label: `PC1 — λ₁=${lam1.toFixed(2)}` },
      { color: '#fbbf24', label: `PC2 — λ₂=${lam2.toFixed(2)}` },
      { color: '#f87171', label: 'Proyección sobre PC1' },
      { color: 'rgba(167,139,250,0.7)', label: 'Elipse 1σ' },
    ];
    items.forEach(({ color, label }, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(10, 10 + i * 19, 12, 3);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(label, 28, 15 + i * 19);
    });

    // PVE acumulada
    const pveK = kComp === 1 ? pve1 : 1.0;
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(
      `PVE acumulada k=${kComp}: ${(pveK * 100).toFixed(1)}%`,
      10, H - 12
    );

  }, [angle, noiseZ, showPC, kComp]);

  return (
    <div className="viz-box" style={{ background: '#0b1220', borderRadius: 10, padding: 12 }}>
      <canvas
        ref={canvasRef}
        width={480}
        height={370}
        style={{ borderRadius: 8, display: 'block', margin: '0 auto' }}
      />
      <div className="viz-ctrl" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#94a3b8', fontSize: 11, minWidth: 190 }}>
            Ángulo de la nube: {angle}°
          </span>
          <input type="range" min={0} max={89} step={1} value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#34d399' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#94a3b8', fontSize: 11, minWidth: 190 }}>
            Ruido ortogonal (σ_noise): {noiseZ.toFixed(2)}
          </span>
          <input type="range" min={0.05} max={2.5} step={0.05} value={noiseZ}
            onChange={e => setNoiseZ(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#fbbf24' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#94a3b8', fontSize: 11, minWidth: 190 }}>
            Componentes a retener (k): {kComp}
          </span>
          <input type="range" min={1} max={2} step={1} value={kComp}
            onChange={e => setKComp(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#f87171' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" id="showpc" checked={showPC}
            onChange={e => setShowPC(e.target.checked)}
            style={{ accentColor: '#60a5fa' }} />
          <label htmlFor="showpc" style={{ color: '#94a3b8', fontSize: 11, cursor: 'pointer' }}>
            Mostrar componentes principales
          </label>
        </div>

        <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
          Rota la nube para ver cómo PCA siempre encuentra la dirección de máxima varianza.
          Aumenta el ruido para reducir la varianza explicada por PC1.
          Las líneas rojas son los errores de reconstrucción con k componentes.
        </p>
      </div>
    </div>
  );
}