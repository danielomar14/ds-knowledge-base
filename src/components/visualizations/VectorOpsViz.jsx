import { useRef, useState, useEffect } from "react";

function VectorOpsViz() {
  const canvasRef = useRef(null);
  const [ux, setUx] = useState(2);
  const [uy, setUy] = useState(1);
  const [vx, setVx] = useState(1);
  const [vy, setVy] = useState(2.5);
  const [alpha, setAlpha] = useState(1.0);
  const [mode, setMode] = useState("sum"); // "sum" | "scalar"

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const S = 52;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    // Grid sutil
    ctx.strokeStyle = "rgba(71,85,105,0.2)";
    ctx.lineWidth = 1;
    for (let x = -6; x <= 6; x++) {
      ctx.beginPath(); ctx.moveTo(cx + x * S, 0); ctx.lineTo(cx + x * S, H); ctx.stroke();
    }
    for (let y = -5; y <= 5; y++) {
      ctx.beginPath(); ctx.moveTo(0, cy + y * S); ctx.lineTo(W, cy + y * S); ctx.stroke();
    }

    // Ejes
    ctx.strokeStyle = "rgba(100,116,139,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // Tick labels
    ctx.fillStyle = "rgba(100,116,139,0.6)";
    ctx.font = "10px monospace";
    for (let i = -5; i <= 5; i++) {
      if (i === 0) continue;
      ctx.fillText(i, cx + i * S - 4, cy + 14);
      ctx.fillText(-i, cx + 4, cy + i * S + 4);
    }

    const arrow = (x1, y1, x2, y2, color, label, dash = false, labelOffset = [12, -8]) => {
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      if (len < 2) return;
      const ux_ = dx / len, uy_ = dy / len;
      const hl = 13;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.8;
      ctx.setLineDash(dash ? [5, 4] : []);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - hl * ux_ + hl * 0.38 * (-uy_), y2 - hl * uy_ + hl * 0.38 * ux_);
      ctx.lineTo(x2 - hl * ux_ - hl * 0.38 * (-uy_), y2 - hl * uy_ - hl * 0.38 * ux_);
      ctx.closePath(); ctx.fill();

      if (label) {
        ctx.font = "bold 13px 'JetBrains Mono', monospace";
        ctx.fillStyle = color;
        ctx.fillText(label, x2 + labelOffset[0], y2 + labelOffset[1]);
      }
      ctx.restore();
    };

    const px = (x) => cx + x * S;
    const py = (y) => cy - y * S;

    if (mode === "sum") {
      // Paralelogramo fantasma
      ctx.strokeStyle = "rgba(167,139,250,0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(px(ux), py(uy));
      ctx.lineTo(px(ux + vx), py(uy + vy));
      ctx.moveTo(px(vx), py(vy));
      ctx.lineTo(px(ux + vx), py(uy + vy));
      ctx.stroke();
      ctx.setLineDash([]);

      // v desplazado desde punta de u (método cabeza-cola)
      arrow(px(ux), py(uy), px(ux + vx), py(uy + vy), "rgba(52,211,153,0.55)", null, true);

      // u desplazado desde punta de v
      arrow(px(vx), py(vy), px(ux + vx), py(uy + vy), "rgba(96,165,250,0.45)", null, true);

      // Vectores originales
      arrow(px(0), py(0), px(ux), py(uy), "#60a5fa", "u");
      arrow(px(0), py(0), px(vx), py(vy), "#34d399", "v");

      // Suma
      arrow(px(0), py(0), px(ux + vx), py(uy + vy), "#f87171", "u+v", false, [10, -10]);

      // Punto resultado
      ctx.fillStyle = "#f87171";
      ctx.beginPath(); ctx.arc(px(ux + vx), py(uy + vy), 5, 0, Math.PI * 2); ctx.fill();

    } else {
      // Modo scalar
      const avx = alpha * vx, avy = alpha * vy;

      // Vector original
      arrow(px(0), py(0), px(vx), py(vy), "#34d399", "v");

      // Vector escalado
      const scaleColor = alpha >= 0 ? "#fbbf24" : "#f87171";
      arrow(px(0), py(0), px(avx), py(avy), scaleColor,
        `${alpha.toFixed(1)}·v`, false, [10, -10]);

      // Línea de dirección extendida
      const dirLen = 6;
      const norm = Math.hypot(vx, vy);
      if (norm > 0.01) {
        ctx.strokeStyle = "rgba(100,116,139,0.15)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(px(-dirLen * vx / norm), py(-dirLen * vy / norm));
        ctx.lineTo(px( dirLen * vx / norm), py( dirLen * vy / norm));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      ctx.fillStyle = scaleColor;
      ctx.beginPath(); ctx.arc(px(avx), py(avy), 5, 0, Math.PI * 2); ctx.fill();
    }

    // Origen
    ctx.fillStyle = "#a78bfa";
    ctx.beginPath(); ctx.arc(px(0), py(0), 4, 0, Math.PI * 2); ctx.fill();

    // Info badge
    const badgeLines = mode === "sum"
      ? [`u = (${ux}, ${uy})`, `v = (${vx}, ${vy})`, `u+v = (${ux+vx}, ${(uy+vy).toFixed(1)})`]
      : [`v = (${vx}, ${vy})`, `α = ${alpha.toFixed(1)}`, `αv = (${(alpha*vx).toFixed(1)}, ${(alpha*vy).toFixed(1)})`];

    ctx.fillStyle = "rgba(11,18,32,0.88)";
    ctx.beginPath(); ctx.roundRect(W - 155, 10, 142, 72, 8); ctx.fill();
    ctx.strokeStyle = "rgba(100,116,139,0.4)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(W - 155, 10, 142, 72, 8); ctx.stroke();
    ctx.font = "11px 'JetBrains Mono', monospace";
    badgeLines.forEach((line, i) => {
      ctx.fillStyle = i === 2 ? (mode === "sum" ? "#f87171" : "#fbbf24") : "#94a3b8";
      ctx.fillText(line, W - 146, 30 + i * 18);
    });

  }, [ux, uy, vx, vy, alpha, mode]);

  const btnStyle = (active) => ({
    padding: "5px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
    background: active ? "#3b82f6" : "rgba(51,65,85,0.6)",
    color: active ? "#fff" : "#94a3b8",
    transition: "all 0.15s",
  });

  const sliderRow = (label, val, setter, min, max, step, color) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#64748b", fontSize: 11, width: 110, flexShrink: 0 }}>
        {label}: <span style={{ color }}>{typeof val === "number" ? val.toFixed(1) : val}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e => setter(Number(e.target.value))}
        style={{ flex: 1, accentColor: color }} />
    </div>
  );

  return (
    <div className="viz-box" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <button style={btnStyle(mode === "sum")}    onClick={() => setMode("sum")}>Suma vectorial</button>
        <button style={btnStyle(mode === "scalar")} onClick={() => setMode("scalar")}>Producto escalar</button>
      </div>

      <canvas ref={canvasRef} width={520} height={380}
        style={{ width: "100%", borderRadius: 10, display: "block" }} />

      <div className="viz-ctrl" style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
        {mode === "sum" ? (<>
          {sliderRow("u · x", ux, setUx, -4, 4, 0.5, "#60a5fa")}
          {sliderRow("u · y", uy, setUy, -4, 4, 0.5, "#60a5fa")}
          {sliderRow("v · x", vx, setVx, -4, 4, 0.5, "#34d399")}
          {sliderRow("v · y", vy, setVy, -4, 4, 0.5, "#34d399")}
        </>) : (<>
          {sliderRow("v · x", vx, setVx, -4, 4, 0.5, "#34d399")}
          {sliderRow("v · y", vy, setVy, -4, 4, 0.5, "#34d399")}
          {sliderRow("α (escalar)", alpha, setAlpha, -3, 3, 0.1, "#fbbf24")}
        </>)}
      </div>
    </div>
  );
}

export default VectorOpsViz;
