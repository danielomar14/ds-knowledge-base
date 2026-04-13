import { useRef, useState, useEffect } from "react";

function CrossProductViz() {
  const canvasRef = useRef(null);
  const [uTheta, setUTheta] = useState(20);
  const [vTheta, setVTheta] = useState(80);
  const [uPhi,   setUPhi]   = useState(15);
  const [vPhi,   setVPhi]   = useState(25);
  const [showParallelogram, setShowParallelogram] = useState(true);

  // Spherical → Cartesian
  const sph = (thetaDeg, phiDeg, r = 1) => {
    const t = (thetaDeg * Math.PI) / 180;
    const p = (phiDeg   * Math.PI) / 180;
    return [
      r * Math.cos(p) * Math.cos(t),
      r * Math.cos(p) * Math.sin(t),
      r * Math.sin(p),
    ];
  };

  const cross3 = (a, b) => [
    a[1]*b[2] - a[2]*b[1],
    a[2]*b[0] - a[0]*b[2],
    a[0]*b[1] - a[1]*b[0],
  ];

  const dot3 = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
  const norm3 = (a) => Math.sqrt(dot3(a, a));
  const scale3 = (a, s) => [a[0]*s, a[1]*s, a[2]*s];
  const add3 = (a, b) => [a[0]+b[0], a[1]+b[1], a[2]+b[2]];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W * 0.48, cy = H * 0.52;
    const S = 90; // world scale

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    // Isometric-style projection (oblique)
    // x→right, y→screen-x rotated, z→up
    const project = ([x, y, z]) => {
      const iso_x = cx + (x - y * 0.55) * S;
      const iso_y = cy - (z + y * 0.38) * S;
      return [iso_x, iso_y];
    };

    // Draw axis guides
    const axes = [
      { dir: [1,0,0], label: "x", color: "rgba(248,113,113,0.35)" },
      { dir: [0,1,0], label: "y", color: "rgba(52,211,153,0.35)" },
      { dir: [0,0,1], label: "z", color: "rgba(96,165,250,0.35)" },
    ];
    axes.forEach(({ dir, label, color }) => {
      const [ox, oy] = project([0,0,0]);
      const [ex, ey] = project(scale3(dir, 1.6));
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.font = "11px monospace";
      ctx.fillText(label, ex + 5, ey - 4);
    });

    const u = sph(uTheta, uPhi, 1.4);
    const v = sph(vTheta, vPhi, 1.4);
    const c = cross3(u, v);
    const cNorm = norm3(c);
    const sinTheta = cNorm / (norm3(u) * norm3(v));
    const angleRad = Math.asin(Math.min(1, Math.max(-1, sinTheta)));

    // Normalize cross for display (cap length at ~1.6)
    const cDisplay = cNorm > 0.001
      ? scale3(c, Math.min(1.6, 1.3) / cNorm * cNorm)
      : [0, 0, 0];

    const drawArrow3D = (from, to, color, label, lw = 2.5) => {
      const [x1, y1] = project(from);
      const [x2, y2] = project(to);
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      if (len < 2) return;
      const ux_ = dx/len, uy_ = dy/len;
      const hl = 12;

      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - hl*ux_ + hl*0.38*(-uy_), y2 - hl*uy_ + hl*0.38*ux_);
      ctx.lineTo(x2 - hl*ux_ - hl*0.38*(-uy_), y2 - hl*uy_ - hl*0.38*ux_);
      ctx.closePath(); ctx.fill();

      if (label) {
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.fillStyle = color;
        ctx.fillText(label, x2 + 10, y2 - 8);
      }
    };

    const O = [0,0,0];

    // Paralelogram
    if (showParallelogram) {
      const corners3D = [O, u, add3(u, v), v];
      const corners2D = corners3D.map(project);
      ctx.fillStyle = "rgba(167,139,250,0.1)";
      ctx.strokeStyle = "rgba(167,139,250,0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(...corners2D[0]);
      corners2D.slice(1).forEach(p => ctx.lineTo(...p));
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.setLineDash([]);
    }

    // Vectors u, v
    drawArrow3D(O, u, "#60a5fa", "u");
    drawArrow3D(O, v, "#34d399", "v");

    // Cross product vector
    if (cNorm > 0.001) {
      drawArrow3D(O, cDisplay, "#fbbf24", "u×v", 3);
    }

    // Ortho tick marks from cross to u and v
    if (cNorm > 0.01) {
      const cHat = scale3(c, 1/cNorm);
      const tick = (vec) => {
        const vHat = scale3(vec, 1/norm3(vec));
        const perp = cross3(cHat, vHat);
        const pNorm = norm3(perp);
        if (pNorm < 0.01) return;
        const pH = scale3(perp, 0.08/pNorm);
        const A = add3(scale3(cHat, 0.2), pH);
        const B = add3(A, scale3(cHat, 0.08));
        const C = add3(scale3(cHat, 0.28), [0,0,0]);
        const pts = [A, B, C].map(project);
        ctx.strokeStyle = "rgba(251,191,36,0.5)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(...pts[0]);
        ctx.lineTo(...pts[1]);
        ctx.lineTo(...pts[2]);
        ctx.stroke();
      };
    }

    // Origin dot
    const [ox, oy] = project(O);
    ctx.fillStyle = "#a78bfa";
    ctx.beginPath(); ctx.arc(ox, oy, 4.5, 0, Math.PI*2); ctx.fill();

    // Info panel
    const area = cNorm.toFixed(4);
    const angleDeg = (angleRad * 180 / Math.PI).toFixed(1);
    const isParallel = parseFloat(area) < 0.01;

    const panelX = 10, panelY = 10;
    ctx.fillStyle = "rgba(11,18,32,0.9)";
    ctx.beginPath(); ctx.roundRect(panelX, panelY, 195, 88, 8); ctx.fill();
    ctx.strokeStyle = "rgba(100,116,139,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(panelX, panelY, 195, 88, 8); ctx.stroke();

    const lines = [
      { text: `‖u×v‖ = ${area}`, color: "#fbbf24" },
      { text: `Área paralelogramo`, color: "#94a3b8" },
      { text: `sin θ  = ${sinTheta.toFixed(4)}`, color: "#94a3b8" },
      { text: isParallel ? "⚠ vectores paralelos" : `θ ≈ ${angleDeg}°`, color: isParallel ? "#f87171" : "#a78bfa" },
    ];
    ctx.font = "11px 'JetBrains Mono', monospace";
    lines.forEach(({ text, color }, i) => {
      ctx.fillStyle = color;
      ctx.fillText(text, panelX + 12, panelY + 22 + i * 18);
    });

  }, [uTheta, vTheta, uPhi, vPhi, showParallelogram]);

  const sliderRow = (label, val, setter, min, max, step, color) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#64748b", fontSize: 11, width: 140, flexShrink: 0 }}>
        {label}: <span style={{ color }}>{val}°</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e => setter(Number(e.target.value))}
        style={{ flex: 1, accentColor: color }} />
    </div>
  );

  return (
    <div className="viz-box" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <canvas ref={canvasRef} width={520} height={400}
        style={{ width: "100%", borderRadius: 10, display: "block" }} />

      <div style={{ marginTop: 8, fontSize: 11, color: "#475569" }}>
        Ajusta ángulos azimutales (θ) y de elevación (φ) de cada vector en $\mathbb{R}^3$.
        Observa cómo u×v (amarillo) siempre es perpendicular al plano de u y v.
      </div>

      <div className="viz-ctrl" style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
        {sliderRow("u  azimutal θ", uTheta, setUTheta, 0, 360, 5, "#60a5fa")}
        {sliderRow("u  elevación φ", uPhi,   setUPhi,   -80, 80, 5, "#60a5fa")}
        {sliderRow("v  azimutal θ", vTheta, setVTheta, 0, 360, 5, "#34d399")}
        {sliderRow("v  elevación φ", vPhi,   setVPhi,   -80, 80, 5, "#34d399")}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
          <input type="checkbox" id="paraCheck" checked={showParallelogram}
            onChange={e => setShowParallelogram(e.target.checked)}
            style={{ accentColor: "#a78bfa" }} />
          <label htmlFor="paraCheck" style={{ color: "#94a3b8", fontSize: 11, cursor: "pointer" }}>
            Mostrar paralelogramo (área = ‖u×v‖)
          </label>
        </div>
      </div>
    </div>
  );
}

export default CrossProductViz;
