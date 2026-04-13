import { useRef, useState, useEffect } from "react";

function NormBallsViz() {
  const canvasRef = useRef(null);
  const [pVal, setPVal] = useState(20); // slider 0–60 → p continuo
  const [showVector, setShowVector] = useState(true);
  const [vx, setVx] = useState(0.6);
  const [vy, setVy] = useState(0.8);

  // Mapear slider (0–60) a p real con densidad extra en [1,4]
  const sliderToP = (s) => {
    if (s <= 40) return 1 + (s / 40) * 3;   // 1 → 4
    if (s <= 55) return 4 + ((s - 40) / 15) * 16; // 4 → 20
    return 20 + ((s - 55) / 5) * 80;         // 20 → 100 (≈ inf)
  };

  const p = sliderToP(pVal);
  const pLabel = p >= 95 ? "∞" : p.toFixed(p < 4 ? 2 : 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const S = 110; // px per unit

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(71,85,105,0.18)";
    ctx.lineWidth = 1;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(cx + i*S, 0); ctx.lineTo(cx + i*S, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy + i*S); ctx.lineTo(W, cy + i*S); ctx.stroke();
    }

    // Ejes
    ctx.strokeStyle = "rgba(100,116,139,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // Tick labels
    ctx.fillStyle = "rgba(100,116,139,0.55)";
    ctx.font = "10px monospace";
    [-2,-1,1,2].forEach(i => {
      ctx.fillText(i, cx + i*S - 5, cy + 14);
      ctx.fillText(-i, cx + 5, cy + i*S + 4);
    });

    // ── Bola unitaria Lp ────────────────────────────────────────────────
    const pEff = Math.min(p, 100);
    const N = 800;

    const ballColor = (() => {
      if (p < 1.3) return { fill: "rgba(248,113,113,0.12)", stroke: "#f87171" };
      if (p < 2.2) return { fill: "rgba(96,165,250,0.12)",  stroke: "#60a5fa" };
      if (p < 4)   return { fill: "rgba(52,211,153,0.10)",  stroke: "#34d399" };
      return             { fill: "rgba(251,191,36,0.10)",   stroke: "#fbbf24" };
    })();

    // Parametrize: x = sign(cos t)|cos t|^(2/p), y = sign(sin t)|sin t|^(2/p)
    ctx.beginPath();
    for (let k = 0; k <= N; k++) {
      const t = (k / N) * 2 * Math.PI;
      const ct = Math.cos(t), st = Math.sin(t);
      const xb = Math.sign(ct) * Math.pow(Math.abs(ct), 2 / pEff);
      const yb = Math.sign(st) * Math.pow(Math.abs(st), 2 / pEff);
      const px_ = cx + xb * S;
      const py_ = cy - yb * S;
      k === 0 ? ctx.moveTo(px_, py_) : ctx.lineTo(px_, py_);
    }
    ctx.closePath();
    ctx.fillStyle = ballColor.fill;
    ctx.fill();
    ctx.strokeStyle = ballColor.stroke;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // ── Referencia: bolas canónicas con trazos finos ────────────────────
    const drawRefBall = (pRef, color, dashArr) => {
      const pR = Math.min(pRef, 100);
      ctx.beginPath();
      for (let k = 0; k <= N; k++) {
        const t = (k/N) * 2 * Math.PI;
        const ct = Math.cos(t), st = Math.sin(t);
        const xb = Math.sign(ct) * Math.pow(Math.abs(ct), 2/pR);
        const yb = Math.sign(st) * Math.pow(Math.abs(st), 2/pR);
        const px_ = cx + xb * S;
        const py_ = cy - yb * S;
        k === 0 ? ctx.moveTo(px_, py_) : ctx.lineTo(px_, py_);
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash(dashArr);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    if (p > 1.15) drawRefBall(1,   "rgba(248,113,113,0.4)", [4,3]);
    if (Math.abs(p-2) > 0.15) drawRefBall(2, "rgba(96,165,250,0.4)",  [4,3]);
    if (p < 90)   drawRefBall(100, "rgba(251,191,36,0.3)",  [3,4]);

    // ── Vector y su norma ───────────────────────────────────────────────
    if (showVector) {
      const pVecEff = Math.min(p, 100);
      const normLp = Math.pow(Math.pow(Math.abs(vx), pVecEff) + Math.pow(Math.abs(vy), pVecEff), 1/pVecEff);

      const ex = cx + vx * S;
      const ey = cy - vy * S;

      // Proyección sobre bola
      const vxN = vx / normLp;
      const vyN = vy / normLp;
      const ex_ = cx + vxN * S;
      const ey_ = cy - vyN * S;

      // Línea punteada al borde
      ctx.strokeStyle = "rgba(167,139,250,0.35)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4,3]);
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex_, ey_); ctx.stroke();
      ctx.setLineDash([]);

      // Flecha vector
      const dx = ex - cx, dy = ey - cy;
      const len = Math.hypot(dx, dy);
      const ux_ = dx/len, uy_ = dy/len;
      const hl = 11;
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - hl*ux_ + hl*0.38*(-uy_), ey - hl*uy_ + hl*0.38*ux_);
      ctx.lineTo(ex - hl*ux_ - hl*0.38*(-uy_), ey - hl*uy_ - hl*0.38*ux_);
      ctx.closePath(); ctx.fill();

      // Punto en el borde de la bola
      ctx.fillStyle = ballColor.stroke;
      ctx.beginPath(); ctx.arc(ex_, ey_, 4.5, 0, Math.PI*2); ctx.fill();

      // Etiqueta norma
      ctx.fillStyle = "#a78bfa";
      ctx.font = "bold 12px 'JetBrains Mono', monospace";
      ctx.fillText(`‖v‖_${pLabel} = ${normLp.toFixed(3)}`, ex + 10, ey - 8);
    }

    // Origen
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, Math.PI*2); ctx.fill();

    // ── Badge p actual ──────────────────────────────────────────────────
    const bw = 170, bh = 56;
    const bx = W - bw - 10, by = 10;
    ctx.fillStyle = "rgba(11,18,32,0.9)";
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 8); ctx.fill();
    ctx.strokeStyle = ballColor.stroke;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 8); ctx.stroke();

    ctx.fillStyle = ballColor.stroke;
    ctx.font = "bold 22px 'JetBrains Mono', monospace";
    ctx.fillText(`L${pLabel}`, bx + 14, by + 34);

    const nameMap = p < 1.15 ? "" : p < 1.3 ? "Manhattan" : Math.abs(p-2)<0.15 ? "Euclidiana" : p >= 90 ? "Chebyshev" : "";
    if (nameMap) {
      ctx.fillStyle = "rgba(148,163,184,0.8)";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText(nameMap, bx + 14, by + 50);
    }

    // ── Leyenda referencias ──────────────────────────────────────────────
    const legend = [
      { color: "rgba(248,113,113,0.7)", label: "L¹ (p=1)" },
      { color: "rgba(96,165,250,0.7)",  label: "L² (p=2)" },
      { color: "rgba(251,191,36,0.6)",  label: "L∞" },
    ];
    legend.forEach(({ color, label }, i) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4,3]);
      ctx.beginPath(); ctx.moveTo(12, 20 + i*18); ctx.lineTo(32, 20 + i*18); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(148,163,184,0.75)";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText(label, 38, 24 + i*18);
    });

  }, [pVal, p, showVector, vx, vy]);

  const sliderRow = (label, val, setter, min, max, step, color, fmt = v => v.toFixed(2)) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#64748b", fontSize: 11, width: 130, flexShrink: 0 }}>
        {label}: <span style={{ color }}>{fmt(val)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e => setter(Number(e.target.value))}
        style={{ flex: 1, accentColor: color }} />
    </div>
  );

  return (
    <div className="viz-box" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <canvas ref={canvasRef} width={520} height={420}
        style={{ width: "100%", borderRadius: 10, display: "block" }} />

      <div style={{ marginTop: 8, fontSize: 11, color: "#475569", lineHeight: 1.5 }}>
        La bola unitaria {"$B_p = \\{x : \\|x\\|_p \\leq 1\\}$"} cambia de forma con $p$.
        Las líneas punteadas muestran L¹, L² y L∞ como referencia.
      </div>

      <div className="viz-ctrl" style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 10 }}>
        {sliderRow(`p  (norma Lp)`, pVal, setPVal, 0, 60, 0.5, "#fbbf24", () => pLabel)}
        {showVector && (<>
          {sliderRow("v · x", vx, setVx, -1.5, 1.5, 0.05, "#a78bfa")}
          {sliderRow("v · y", vy, setVy, -1.5, 1.5, 0.05, "#a78bfa")}
        </>)}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="checkbox" id="vecCheck" checked={showVector}
            onChange={e => setShowVector(e.target.checked)}
            style={{ accentColor: "#a78bfa" }} />
          <label htmlFor="vecCheck" style={{ color: "#94a3b8", fontSize: 11, cursor: "pointer" }}>
            Mostrar vector v y su norma Lp
          </label>
        </div>
      </div>
    </div>
  );
}

export default NormBallsViz;
