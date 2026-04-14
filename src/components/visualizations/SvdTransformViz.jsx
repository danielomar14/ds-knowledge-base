import React, { useState, useEffect, useRef } from 'react';

export default function SvdTransformViz() {
  const canvasRef = useRef(null);
  const [k, setK] = useState(1);
  const [step, setStep] = useState(2); // 0=Vt, 1=Sigma, 2=U completo

  // Matriz A fija 3×2 con SVD conocida y visual clara
  // Construimos A = U S Vt con valores singulares [3.5, 1.2]
  const deg30 = 30 * Math.PI / 180;
  const deg55 = 55 * Math.PI / 180;
  const cosU = Math.cos(deg55), sinU = Math.sin(deg55);
  const cosV = Math.cos(deg30), sinV = Math.sin(deg30);
  const sigma1 = 3.5, sigma2 = 1.2;

  // U (2×2), Vt (2×2), S diagonal — operamos en R² para visualización
  const U  = [[cosU, -sinU], [sinU,  cosU]];
  const Vt = [[cosV,  sinV], [-sinV, cosV]];
  // A = U diag(s1,s2) Vt
  const A = [
    [cosU * sigma1 * cosV + (-sinU) * sigma2 * (-sinV),
     cosU * sigma1 * sinV + (-sinU) * sigma2 *  cosV],
    [sinU * sigma1 * cosV +   cosU  * sigma2 * (-sinV),
     sinU * sigma1 * sinV +   cosU  * sigma2 *  cosV],
  ];

  const STEPS = [
    { label: "① Vᵀ — Rotar entrada", color: "#fbbf24" },
    { label: "② Σ — Escalar ejes",   color: "#34d399" },
    { label: "③ U — Rotar salida (A completo)", color: "#60a5fa" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const sc = 55; // píxeles por unidad

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    // ── helpers ──────────────────────────────────────────────────────────
    const tc = ([x, y]) => [cx + x * sc, cy - y * sc];

    const mat2vec = (M, v) => [
      M[0][0] * v[0] + M[0][1] * v[1],
      M[1][0] * v[0] + M[1][1] * v[1],
    ];

    // Aplicar transformación según step
    // step 0 → solo Vt, step 1 → Sigma·Vt, step 2 → U·Sigma·Vt = A
    const applyStep = (v) => {
      let w = mat2vec(Vt, v);
      if (step >= 1) w = [w[0] * sigma1, w[1] * sigma2];
      if (step >= 2) w = mat2vec(U, w);
      return w;
    };

    // ── Grid transformado ─────────────────────────────────────────────────
    ctx.strokeStyle = "rgba(96,165,250,0.08)";
    ctx.lineWidth = 1;
    for (let g = -6; g <= 6; g++) {
      ctx.beginPath();
      const [x1, y1] = tc(applyStep([g, -6]));
      const [x2, y2] = tc(applyStep([g,  6]));
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

      ctx.beginPath();
      const [x3, y3] = tc(applyStep([-6, g]));
      const [x4, y4] = tc(applyStep([ 6, g]));
      ctx.moveTo(x3, y3); ctx.lineTo(x4, y4); ctx.stroke();
    }

    // ── Ejes coordenados ──────────────────────────────────────────────────
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
    ctx.setLineDash([]);

    // ── Elipse imagen del círculo unitario ────────────────────────────────
    ctx.strokeStyle = "rgba(167,139,250,0.7)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let t = 0; t <= 2 * Math.PI + 0.02; t += 0.03) {
      const pt = applyStep([Math.cos(t), Math.sin(t)]);
      const [px, py] = tc(pt);
      t < 0.01 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Círculo unitario original (punteado)
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.arc(cx, cy, sc, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── Vectores singulares y sus imágenes ────────────────────────────────
    const drawArrow = (from, to, color, width = 2, dash = []) => {
      const [x1, y1] = tc(from), [x2, y2] = tc(to);
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < 1) return;
      const ux = dx / len, uy = dy / len;
      ctx.strokeStyle = color; ctx.fillStyle = color;
      ctx.lineWidth = width;
      ctx.setLineDash(dash);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);
      const hw = 7, hl = 12;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - hl * ux + hw * uy, y2 - hl * uy - hw * ux);
      ctx.lineTo(x2 - hl * ux - hw * uy, y2 - hl * uy + hw * ux);
      ctx.closePath(); ctx.fill();
    };

    // v1, v2 originales (columnas de V = filas de Vt transpuestas)
    const v1 = [cosV, sinV];
    const v2 = [-sinV, cosV];
    // imágenes bajo la transformación actual
    const av1 = applyStep(v1);
    const av2 = applyStep(v2);

    drawArrow([0, 0], v1,  "#fbbf24" + "55", 1.5, [4, 3]);
    drawArrow([0, 0], v2,  "#34d399" + "55", 1.5, [4, 3]);
    drawArrow([0, 0], av1, "#fbbf24", 2.5);
    drawArrow([0, 0], av2, "#34d399", 2.5);

    // Etiquetas σ
    const label1 = tc([av1[0] * 1.18, av1[1] * 1.18]);
    const label2 = tc([av2[0] * 1.25, av2[1] * 1.25]);
    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#fbbf24";
    ctx.fillText(`σ₁=${sigma1}`, label1[0] + 4, label1[1] - 4);
    ctx.fillStyle = "#34d399";
    ctx.fillText(`σ₂=${sigma2}`, label2[0] + 4, label2[1] - 4);

    // ── Leyenda ───────────────────────────────────────────────────────────
    const items = [
      { color: "#fbbf24", label: "v₁ → σ₁u₁" },
      { color: "#34d399", label: "v₂ → σ₂u₂" },
      { color: "#a78bfa", label: "Imagen círculo unitario" },
      { color: "rgba(255,255,255,0.25)", label: "Vectores originales (punteado)" },
    ];
    items.forEach(({ color, label }, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(10, 10 + i * 20, 12, 3);
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px monospace";
      ctx.fillText(label, 28, 15 + i * 20);
    });

    // Step actual
    ctx.fillStyle = STEPS[step].color;
    ctx.font = "bold 11px monospace";
    ctx.fillText(STEPS[step].label, 10, H - 12);

  }, [step]);

  return (
    <div className="viz-box" style={{ background: "#0b1220", borderRadius: 10, padding: 12 }}>
      <canvas
        ref={canvasRef}
        width={480}
        height={370}
        style={{ borderRadius: 8, display: "block", margin: "0 auto" }}
      />
      <div className="viz-ctrl" style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Selector de paso SVD */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ color: "#94a3b8", fontSize: 11 }}>Paso de la descomposición A = U Σ Vᵀ:</span>
          <div style={{ display: "flex", gap: 6 }}>
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                style={{
                  flex: 1, padding: "5px 4px", fontSize: 10, cursor: "pointer",
                  borderRadius: 6, border: `1.5px solid ${step === i ? s.color : "#334155"}`,
                  background: step === i ? s.color + "22" : "transparent",
                  color: step === i ? s.color : "#64748b",
                  fontFamily: "monospace", transition: "all 0.15s",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ color: "#475569", fontSize: 10, margin: 0, lineHeight: 1.6 }}>
          Amarillo = dirección singular derecha v₁ (mayor varianza).
          Verde = v₂. La elipse morada muestra la imagen del círculo unitario bajo la transformación acumulada.
          σ₁={sigma1}, σ₂={sigma2} fijos para ilustración. Punteado = vectores antes de transformar.
        </p>
      </div>
    </div>
  );
}