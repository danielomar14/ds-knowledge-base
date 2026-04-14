import React, { useRef, useState, useEffect } from 'react';

export default function EigenTransformViz() {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(30);
  const [stretch, setStretch] = useState(2.2);
  const [showGrid, setShowGrid] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const scale = 70;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    // Build matrix from angle and stretch
    // A = R * diag(stretch, 1/stretch) * R^T  → simétrica, eigenvalores reales
    const rad = (angle * Math.PI) / 180;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    const lam1 = stretch;
    const lam2 = 1 / stretch;
    // A = Q Λ Q^T
    const a11 = c * c * lam1 + s * s * lam2;
    const a12 = c * s * (lam1 - lam2);
    const a22 = s * s * lam1 + c * c * lam2;
    const A = [[a11, a12], [a12, a22]];

    const transform = ([x, y]) => [
      A[0][0] * x + A[0][1] * y,
      A[1][0] * x + A[1][1] * y,
    ];

    const toCanvas = ([x, y]) => [cx + x * scale, cy - y * scale];

    // ── Grid original (tenues) ──────────────────────────────────────────────
    if (showGrid) {
      ctx.strokeStyle = "rgba(96,165,250,0.10)";
      ctx.lineWidth = 1;
      for (let g = -5; g <= 5; g++) {
        ctx.beginPath();
        const [x1, y1] = toCanvas(transform([g, -5]));
        const [x2, y2] = toCanvas(transform([g, 5]));
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.beginPath();
        const [x3, y3] = toCanvas(transform([-5, g]));
        const [x4, y4] = toCanvas(transform([5, g]));
        ctx.moveTo(x3, y3); ctx.lineTo(x4, y4); ctx.stroke();
      }
      // Grid original sin transformar
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      for (let g = -5; g <= 5; g++) {
        ctx.beginPath();
        ctx.moveTo(...toCanvas([g, -5])); ctx.lineTo(...toCanvas([g, 5])); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(...toCanvas([-5, g])); ctx.lineTo(...toCanvas([5, g])); ctx.stroke();
      }
    }

    // ── Ejes coordenados ───────────────────────────────────────────────────
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // ── Eigenvectores ──────────────────────────────────────────────────────
    const eigenvectors = [
      { vec: [c, s], lam: lam1, color: "#34d399" },
      { vec: [-s, c], lam: lam2, color: "#fbbf24" },
    ];

    const drawArrow = (ctx, from, to, color, width = 2) => {
      const [x1, y1] = from;
      const [x2, y2] = to;
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / len, uy = dy / len;
      const hw = 8, hlen = 14;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - hlen * ux + hw * uy, y2 - hlen * uy - hw * ux);
      ctx.lineTo(x2 - hlen * ux - hw * uy, y2 - hlen * uy + hw * ux);
      ctx.closePath(); ctx.fill();
    };

    eigenvectors.forEach(({ vec, lam, color }) => {
      const mag = 2.5;
      const [vx, vy] = [vec[0] * mag, vec[1] * mag];
      // Vector original
      ctx.setLineDash([4, 3]);
      drawArrow(ctx, toCanvas([0, 0]), toCanvas([vx, vy]), color + "66", 1.5);
      ctx.setLineDash([]);
      // Vector transformado (Av = λv)
      const [tvx, tvy] = [vx * lam, vy * lam];
      drawArrow(ctx, toCanvas([0, 0]), toCanvas([tvx, tvy]), color, 2.5);

      // Etiqueta λ
      const labelPos = toCanvas([tvx * 1.12, tvy * 1.12]);
      ctx.fillStyle = color;
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.fillText(`λ=${lam.toFixed(2)}`, labelPos[0] + 4, labelPos[1] - 4);
    });

    // ── Elipse unitaria transformada ──────────────────────────────────────
    ctx.strokeStyle = "rgba(167,139,250,0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let t = 0; t <= 2 * Math.PI + 0.01; t += 0.03) {
      const [px, py] = transform([Math.cos(t), Math.sin(t)]);
      const [cx2, cy2] = toCanvas([px, py]);
      t === 0 ? ctx.moveTo(cx2, cy2) : ctx.lineTo(cx2, cy2);
    }
    ctx.stroke();

    // Círculo unitario original
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, scale, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── Leyenda ────────────────────────────────────────────────────────────
    const legend = [
      { color: "#34d399", label: `v₁ · λ₁ = ${lam1.toFixed(2)}` },
      { color: "#fbbf24", label: `v₂ · λ₂ = ${lam2.toFixed(2)}` },
      { color: "#a78bfa", label: "Av, ‖v‖=1 (elipse imagen)" },
    ];
    legend.forEach(({ color, label }, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(12, 12 + i * 22, 14, 3);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px monospace";
      ctx.fillText(label, 32, 17 + i * 22);
    });

    // Matriz A display
    ctx.fillStyle = "#475569";
    ctx.font = "11px monospace";
    const matStr = `A = [[${a11.toFixed(2)}, ${a12.toFixed(2)}], [${a12.toFixed(2)}, ${a22.toFixed(2)}]]`;
    ctx.fillText(matStr, 12, H - 12);

  }, [angle, stretch, showGrid]);

  return (
    <div className="viz-box" style={{ background: "#0b1220", borderRadius: 10, padding: 12 }}>
      <canvas
        ref={canvasRef}
        width={480}
        height={380}
        style={{ borderRadius: 8, display: "block", margin: "0 auto" }}
      />
      <div className="viz-ctrl" style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 11, minWidth: 170 }}>
            Ángulo eigenvectores: {angle}°
          </span>
          <input
            type="range" min={0} max={89} step={1} value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#34d399" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 11, minWidth: 170 }}>
            λ₁ (estiramiento): {stretch.toFixed(2)}
          </span>
          <input
            type="range" min={1.05} max={4} step={0.05} value={stretch}
            onChange={e => setStretch(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#fbbf24" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox" id="grid" checked={showGrid}
            onChange={e => setShowGrid(e.target.checked)}
            style={{ accentColor: "#60a5fa" }}
          />
          <label htmlFor="grid" style={{ color: "#94a3b8", fontSize: 11, cursor: "pointer" }}>
            Mostrar grid transformado
          </label>
        </div>
        <p style={{ color: "#475569", fontSize: 10, margin: 0, lineHeight: 1.5 }}>
          Verde = eigenvector v₁ (λ₁). Amarillo = eigenvector v₂ (λ₂ = 1/λ₁). 
          Elipse morada = imagen del círculo unitario bajo A. Punteado = vectores originales.
        </p>
      </div>
    </div>
  );
}
