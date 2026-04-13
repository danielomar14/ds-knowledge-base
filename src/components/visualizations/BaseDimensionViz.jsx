import { useRef, useState, useEffect } from 'react';

function BaseDimensionViz() {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(45);
  const [showSpan, setShowSpan] = useState(true);
  const [vecScale, setVecScale] = useState(1.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const SCALE = 80;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(71,85,105,0.25)";
    ctx.lineWidth = 1;
    for (let x = -4; x <= 4; x++) {
      ctx.beginPath();
      ctx.moveTo(cx + x * SCALE, 0);
      ctx.lineTo(cx + x * SCALE, H);
      ctx.stroke();
    }
    for (let y = -4; y <= 4; y++) {
      ctx.beginPath();
      ctx.moveTo(0, cy + y * SCALE);
      ctx.lineTo(W, cy + y * SCALE);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(100,116,139,0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    const rad = (angle * Math.PI) / 180;
    const v1 = [1 * vecScale, 0];
    const v2 = [Math.cos(rad) * vecScale, Math.sin(rad) * vecScale];

    const isLI = Math.abs(Math.sin(rad)) > 0.01;

    // Span region
    if (showSpan && isLI) {
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.7);
      gradient.addColorStop(0, "rgba(96,165,250,0.08)");
      gradient.addColorStop(1, "rgba(96,165,250,0.01)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "rgba(52,211,153,0.06)";
      ctx.fillRect(0, 0, W, H);
    } else if (showSpan && !isLI) {
      // Span is a line
      const dir = [v1[0], v1[1]];
      const len = Math.hypot(dir[0], dir[1]);
      const nx = (dir[0] / len) * W;
      const ny = (dir[1] / len) * H;
      ctx.strokeStyle = "rgba(251,191,36,0.35)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(cx - nx, cy + ny);
      ctx.lineTo(cx + nx, cy - ny);
      ctx.stroke();
    }

    // Draw arrow helper
    const drawArrow = (x1, y1, x2, y2, color, label, dashed = false) => {
      const dx = x2 - x1, dy = y2 - y1;
      const len = Math.hypot(dx, dy);
      const ux = dx / len, uy = dy / len;
      const headLen = 14;

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      if (dashed) {
        ctx.setLineDash([5, 4]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Arrowhead
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - headLen * ux + headLen * 0.4 * (-uy),
        y2 - headLen * uy + headLen * 0.4 * ux
      );
      ctx.lineTo(
        x2 - headLen * ux - headLen * 0.4 * (-uy),
        y2 - headLen * uy - headLen * 0.4 * ux
      );
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.fillStyle = color;
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.fillText(label, x2 + 10, y2 - 6);
    };

    // v1 - always horizontal
    drawArrow(cx, cy, cx + v1[0] * SCALE, cy, "#60a5fa", "v₁");

    // v2 - rotatable
    const v2color = isLI ? "#34d399" : "#fbbf24";
    drawArrow(cx, cy, cx + v2[0] * SCALE, cy - v2[1] * SCALE, v2color, "v₂");

    // Parallelogram if LI
    if (isLI) {
      const px = cx + v1[0] * SCALE;
      const py = cy;
      const qx = cx + v2[0] * SCALE;
      const qy = cy - v2[1] * SCALE;
      const rx = px + v2[0] * SCALE;
      const ry = py - v2[1] * SCALE;

      ctx.strokeStyle = "rgba(167,139,250,0.4)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(rx, ry);
      ctx.moveTo(qx, qy);
      ctx.lineTo(rx, ry);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Status badge
    const dim = isLI ? 2 : 1;
    const statusColor = isLI ? "#34d399" : "#fbbf24";
    const statusText = isLI ? "L.I. → dim = 2" : "L.D. → dim = 1";

    ctx.fillStyle = "rgba(11,18,32,0.85)";
    ctx.beginPath();
    ctx.roundRect(12, 12, 180, 38, 8);
    ctx.fill();
    ctx.strokeStyle = statusColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(12, 12, 180, 38, 8);
    ctx.stroke();

    ctx.fillStyle = statusColor;
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillText(statusText, 22, 36);

    // Angle label
    ctx.fillStyle = "rgba(148,163,184,0.9)";
    ctx.font = "12px 'JetBrains Mono', monospace";
    ctx.fillText(`θ = ${angle}°`, cx + 12, cy - 14);

    // Origin dot
    ctx.fillStyle = "#a78bfa";
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [angle, showSpan, vecScale]);

  return (
    <div className="viz-box" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <canvas
        ref={canvasRef}
        width={520}
        height={400}
        style={{ width: "100%", borderRadius: 10, display: "block" }}
      />

      <div style={{ marginTop: 10, padding: "8px 4px", fontSize: 11, color: "#64748b" }}>
        Arrastra v₂ para ver cuándo los vectores forman una base (L.I.) vs. son dependientes (L.D.)
      </div>

      <div className="viz-ctrl" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 11, width: 120 }}>Ángulo v₂: {angle}°</span>
          <input
            type="range" min={0} max={360} value={angle}
            onChange={e => setAngle(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#34d399" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 11, width: 120 }}>Escala: {vecScale.toFixed(1)}</span>
          <input
            type="range" min={0.4} max={1.8} step={0.1} value={vecScale}
            onChange={e => setVecScale(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#60a5fa" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox" id="spanToggle" checked={showSpan}
            onChange={e => setShowSpan(e.target.checked)}
            style={{ accentColor: "#a78bfa" }}
          />
          <label htmlFor="spanToggle" style={{ color: "#94a3b8", fontSize: 11, cursor: "pointer" }}>
            Mostrar span(v₁, v₂)
          </label>
        </div>
      </div>
    </div>
  );
}

export default BaseDimensionViz;
