import { useRef, useState, useEffect } from "react";

function EuclideanDistanceViz() {
  const canvasRef = useRef(null);
  const [px_, setPx] = useState(-2.0);
  const [py_, setPy] = useState(-1.5);
  const [qx_, setQx] = useState(2.0);
  const [qy_, setQy] = useState(1.5);
  const [mode, setMode] = useState("euclid"); // "euclid" | "manhattan" | "mahal"
  const [showTriangle, setShowTriangle] = useState(true);
  const [showCircles, setShowCircles] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const S = 72;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(71,85,105,0.18)";
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath(); ctx.moveTo(cx + i*S, 0); ctx.lineTo(cx + i*S, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy + i*S); ctx.lineTo(W, cy + i*S); ctx.stroke();
    }

    // Ejes
    ctx.strokeStyle = "rgba(100,116,139,0.45)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // Ticks
    ctx.fillStyle = "rgba(100,116,139,0.5)";
    ctx.font = "10px monospace";
    [-4,-3,-2,-1,1,2,3,4].forEach(i => {
      ctx.fillText(i, cx + i*S - 4, cy + 13);
      ctx.fillText(-i, cx + 4, cy + i*S + 4);
    });

    const scx = (x) => cx + x * S;
    const scy = (y) => cy - y * S;

    const dx = qx_ - px_;
    const dy = qy_ - py_;

    // ── Distancias ────────────────────────────────────────────────────────
    const d_euclid    = Math.sqrt(dx*dx + dy*dy);
    const d_manhattan = Math.abs(dx) + Math.abs(dy);

    // Mahalanobis: Σ = [[2,1],[1,1.5]] (fija, ilustrativa)
    const SigmaInv = (() => {
      const a=2, b=1, c=1.5;
      const det = a*c - b*b;
      return [[c/det, -b/det],[-b/det, a/det]];
    })();
    const d_mahal = Math.sqrt(
      dx*(SigmaInv[0][0]*dx + SigmaInv[0][1]*dy) +
      dy*(SigmaInv[1][0]*dx + SigmaInv[1][1]*dy)
    );

    // ── Círculos de nivel (isocontornos) ──────────────────────────────────
    if (showCircles) {
      const r = mode === "euclid"    ? d_euclid
              : mode === "manhattan" ? d_manhattan
              : d_mahal;

      const steps = 300;
      if (mode === "euclid") {
        ctx.strokeStyle = "rgba(96,165,250,0.25)";
        ctx.lineWidth = 1.2;
        [0.5, 1.0, 1.5].forEach(frac => {
          ctx.beginPath();
          ctx.arc(scx(px_), scy(py_), r * frac * S, 0, Math.PI*2);
          ctx.stroke();
        });
      } else if (mode === "manhattan") {
        const drawL1Circle = (rx, rMath, alpha) => {
          ctx.strokeStyle = `rgba(248,113,113,${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          const pts = [
            [px_,       py_+rMath],
            [px_+rMath, py_      ],
            [px_,       py_-rMath],
            [px_-rMath, py_      ],
          ];
          ctx.moveTo(scx(pts[0][0]), scy(pts[0][1]));
          pts.slice(1).forEach(p => ctx.lineTo(scx(p[0]), scy(p[1])));
          ctx.closePath();
          ctx.stroke();
        };
        [0.5, 1.0, 1.5].forEach(f => drawL1Circle(r*f*S, r*f, 0.28));
      } else {
        // Mahalanobis: elipses. Dibujamos via parametrización
        // Σ = L·Lᵀ donde L = cholesky; elipse = L·[cos,sin]
        // Para Σ=[[2,1],[1,1.5]]: eigenvalores aprox
        const drawMahalCircle = (rMath, alpha) => {
          ctx.strokeStyle = `rgba(52,211,153,${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let k=0; k<=steps; k++) {
            const t = (k/steps)*2*Math.PI;
            const ex = rMath*(Math.sqrt(2)*Math.cos(t));
            const ey = rMath*(Math.cos(t)*0.707 + Math.sqrt(1.5-0.5)*Math.sin(t));
            const wx = scx(px_ + ex);
            const wy = scy(py_ + ey);
            k===0 ? ctx.moveTo(wx,wy) : ctx.lineTo(wx,wy);
          }
          ctx.closePath(); ctx.stroke();
        };
        [0.5,1.0,1.5].forEach(f => drawMahalCircle(f, 0.28));
      }
    }

    // ── Triángulo de Pitágoras ─────────────────────────────────────────────
    if (showTriangle && mode === "euclid") {
      ctx.fillStyle = "rgba(251,191,36,0.06)";
      ctx.strokeStyle = "rgba(251,191,36,0.35)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4,3]);
      ctx.beginPath();
      ctx.moveTo(scx(px_), scy(py_));
      ctx.lineTo(scx(qx_), scy(py_));
      ctx.lineTo(scx(qx_), scy(qy_));
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.setLineDash([]);

      // Labels Δx, Δy
      ctx.fillStyle = "rgba(251,191,36,0.8)";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText(`Δx=${dx.toFixed(2)}`, scx((px_+qx_)/2)-18, scy(py_)+16);
      ctx.fillText(`Δy=${dy.toFixed(2)}`, scx(qx_)+ 6, scy((py_+qy_)/2)+4);
    }

    // ── Segmento de distancia ─────────────────────────────────────────────
    const lineColor = mode === "euclid"    ? "#60a5fa"
                    : mode === "manhattan" ? "#f87171"
                    : "#34d399";

    if (mode === "manhattan") {
      // Ruta en L (horizontal luego vertical)
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5,4]);
      ctx.beginPath();
      ctx.moveTo(scx(px_), scy(py_));
      ctx.lineTo(scx(qx_), scy(py_));
      ctx.lineTo(scx(qx_), scy(qy_));
      ctx.stroke();
      ctx.setLineDash([]);
    } else {
      // Línea recta (Euclidiana o Mahalanobis visual)
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(scx(px_), scy(py_));
      ctx.lineTo(scx(qx_), scy(qy_));
      ctx.stroke();
    }

    // Etiqueta de distancia sobre el segmento
    const midX = scx((px_+qx_)/2);
    const midY = scy((py_+qy_)/2);
    const distVal = mode === "euclid"    ? d_euclid
                  : mode === "manhattan" ? d_manhattan
                  : d_mahal;
    const distLabel = mode === "euclid"    ? `d₂ = ${d_euclid.toFixed(3)}`
                    : mode === "manhattan" ? `d₁ = ${d_manhattan.toFixed(3)}`
                    : `d_M = ${d_mahal.toFixed(3)}`;

    const perpX = -(qy_-py_) / d_euclid * 22;
    const perpY = -(qx_-px_) / d_euclid * 22;

    ctx.fillStyle = "rgba(11,18,32,0.85)";
    const tw = ctx.measureText(distLabel).width + 16;
    ctx.beginPath();
    ctx.roundRect(midX + perpX - tw/2, midY + perpY - 12, tw, 22, 5);
    ctx.fill();
    ctx.fillStyle = lineColor;
    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(distLabel, midX + perpX, midY + perpY + 4);
    ctx.textAlign = "left";

    // ── Puntos P y Q ──────────────────────────────────────────────────────
    const drawPoint = (x, y, color, label) => {
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(scx(x), scy(y), 7, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "rgba(11,18,32,0.9)";
      ctx.beginPath(); ctx.arc(scx(x), scy(y), 3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = color;
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.fillText(label, scx(x)+10, scy(y)-8);
      ctx.fillStyle = "rgba(148,163,184,0.7)";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText(`(${x.toFixed(1)}, ${y.toFixed(1)})`, scx(x)+10, scy(y)+6);
    };

    drawPoint(px_, py_, "#a78bfa", "P");
    drawPoint(qx_, qy_, "#fbbf24", "Q");

    // ── Panel de comparación ──────────────────────────────────────────────
    const pw = 200, ph = 78;
    const panX = W - pw - 10, panY = 10;
    ctx.fillStyle = "rgba(11,18,32,0.92)";
    ctx.beginPath(); ctx.roundRect(panX, panY, pw, ph, 8); ctx.fill();
    ctx.strokeStyle = "rgba(100,116,139,0.3)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(panX, panY, pw, ph, 8); ctx.stroke();

    const rows = [
      { label: "d₂ (Euclid)", val: d_euclid.toFixed(4),    color: mode==="euclid"    ? "#60a5fa" : "#475569" },
      { label: "d₁ (Manhat)", val: d_manhattan.toFixed(4),  color: mode==="manhattan" ? "#f87171" : "#475569" },
      { label: "d_M (Mahal)", val: d_mahal.toFixed(4),      color: mode==="mahal"     ? "#34d399" : "#475569" },
    ];
    ctx.font = "11px 'JetBrains Mono', monospace";
    rows.forEach(({ label, val, color }, i) => {
      ctx.fillStyle = color;
      ctx.fillText(`${label}: ${val}`, panX + 12, panY + 22 + i*20);
    });

  }, [px_, py_, qx_, qy_, mode, showTriangle, showCircles]);

  const btnStyle = (active, color="#3b82f6") => ({
    padding: "5px 13px", borderRadius: 6, border: "none", cursor: "pointer",
    fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
    background: active ? color : "rgba(51,65,85,0.6)",
    color: active ? "#fff" : "#94a3b8", transition: "all 0.15s",
  });

  const sliderRow = (label, val, setter, color) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#64748b", fontSize: 11, width: 80, flexShrink: 0 }}>
        {label}: <span style={{ color }}>{val.toFixed(1)}</span>
      </span>
      <input type="range" min={-3.5} max={3.5} step={0.1} value={val}
        onChange={e => setter(Number(e.target.value))}
        style={{ flex: 1, accentColor: color }} />
    </div>
  );

  return (
    <div className="viz-box" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        <button style={btnStyle(mode==="euclid",    "#3b82f6")} onClick={() => setMode("euclid")}>L² Euclidiana</button>
        <button style={btnStyle(mode==="manhattan", "#ef4444")} onClick={() => setMode("manhattan")}>L¹ Manhattan</button>
        <button style={btnStyle(mode==="mahal",     "#10b981")} onClick={() => setMode("mahal")}>Mahalanobis</button>
      </div>

      <canvas ref={canvasRef} width={520} height={400}
        style={{ width: "100%", borderRadius: 10, display: "block" }} />

      <div className="viz-ctrl" style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
          <div style={{display:"flex", flexDirection:"column", gap:6, flex:1}}>
            <span style={{color:"#a78bfa", fontSize:11, fontWeight:"bold"}}>Punto P</span>
            {sliderRow("P · x", px_, setPx, "#a78bfa")}
            {sliderRow("P · y", py_, setPy, "#a78bfa")}
          </div>
          <div style={{display:"flex", flexDirection:"column", gap:6, flex:1}}>
            <span style={{color:"#fbbf24", fontSize:11, fontWeight:"bold"}}>Punto Q</span>
            {sliderRow("Q · x", qx_, setQx, "#fbbf24")}
            {sliderRow("Q · y", qy_, setQy, "#fbbf24")}
          </div>
        </div>
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:4 }}>
          <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
            <input type="checkbox" checked={showTriangle}
              onChange={e => setShowTriangle(e.target.checked)}
              style={{ accentColor:"#fbbf24" }} />
            <span style={{ color:"#94a3b8", fontSize:11 }}>Triángulo de Pitágoras</span>
          </label>
          <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
            <input type="checkbox" checked={showCircles}
              onChange={e => setShowCircles(e.target.checked)}
              style={{ accentColor:"#60a5fa" }} />
            <span style={{ color:"#94a3b8", fontSize:11 }}>Isocontornos desde P</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default EuclideanDistanceViz;
