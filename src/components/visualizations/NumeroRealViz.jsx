import React, { useState, useEffect, useRef } from "react";

export default function NumeroRealViz() {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(3);
  const [highlight, setHighlight] = useState(1); // 0=Q, 1=irracionales, 2=todos

  const LABELS = ["Solo ℚ (racionales)", "Irracionales destacados", "Recta real completa"];
  const W = 700, H = 340;
  const BG = "#0b1220";
  const BLUE = "#60a5fa";
  const GREEN = "#34d399";
  const YELLOW = "#fbbf24";
  const RED = "#f87171";
  const PURPLE = "#a78bfa";
  const SLATE = "#475569";

  const irrationals = [
    { val: Math.sqrt(2), label: "√2", color: GREEN },
    { val: Math.PI,      label: "π",  color: YELLOW },
    { val: Math.E,       label: "e",  color: PURPLE },
    { val: Math.sqrt(3), label: "√3", color: RED },
    { val: Math.LOG2E,   label: "log₂e", color: "#fb923c" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    // Fondo
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2 + 30;
    const scale = (W * 0.38) / zoom;

    // Función de coordenada
    const px = (v) => cx + v * scale;

    // ─── Recta numérica ────────────────────────────────────────────────────
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, cy);
    ctx.lineTo(W - 40, cy);
    ctx.stroke();

    // Flecha derecha
    ctx.fillStyle = SLATE;
    ctx.beginPath();
    ctx.moveTo(W - 38, cy);
    ctx.lineTo(W - 50, cy - 5);
    ctx.lineTo(W - 50, cy + 5);
    ctx.closePath();
    ctx.fill();

    // Flecha izquierda
    ctx.beginPath();
    ctx.moveTo(42, cy);
    ctx.lineTo(54, cy - 5);
    ctx.lineTo(54, cy + 5);
    ctx.closePath();
    ctx.fill();

    // ─── Ticks enteros ────────────────────────────────────────────────────
    const nTicks = Math.floor(zoom) + 1;
    for (let i = -nTicks; i <= nTicks; i++) {
      const x = px(i);
      if (x < 48 || x > W - 48) continue;
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = i === 0 ? 2 : 1;
      ctx.beginPath();
      ctx.moveTo(x, cy - 10);
      ctx.lineTo(x, cy + 10);
      ctx.stroke();
      ctx.fillStyle = "#94a3b8";
      ctx.font = `${i === 0 ? "bold " : ""}12px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(i, x, cy + 24);
    }

    // ─── Racionales (puntos azules densos) ───────────────────────────────
    if (highlight === 0 || highlight === 2) {
      ctx.fillStyle = BLUE + "cc";
      const dens = highlight === 2 ? 6 : 8;
      for (let num = -nTicks * dens; num <= nTicks * dens; num++) {
        for (let den = 1; den <= dens; den++) {
          const v = num / den;
          const x = px(v);
          if (x < 48 || x > W - 48) continue;
          ctx.beginPath();
          ctx.arc(x, cy, highlight === 2 ? 2 : 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // ─── Irracionales destacados ──────────────────────────────────────────
    if (highlight === 1 || highlight === 2) {
      irrationals.forEach(({ val, label, color }) => {
        const x = px(val);
        if (x < 48 || x > W - 48) return;

        // Línea vertical punteada
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = color + "88";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, cy + 12);
        ctx.lineTo(x, cy - 55);
        ctx.stroke();
        ctx.setLineDash([]);

        // Punto
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, cy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Etiqueta
        ctx.fillStyle = color;
        ctx.font = "bold 13px serif";
        ctx.textAlign = "center";
        ctx.fillText(label, x, cy - 60);

        // Valor numérico
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px monospace";
        ctx.fillText(val.toFixed(4), x, cy - 45);
      });
    }

    // ─── Título y leyenda ─────────────────────────────────────────────────
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 15px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Recta Real  ℝ", 20, 28);

    ctx.fillStyle = SLATE;
    ctx.font = "12px sans-serif";
    ctx.fillText(`Zoom: ±${zoom}`, W - 80, 28);

    // Leyenda modo
    const legendY = H - 30;
    ctx.fillStyle = BLUE;
    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("● racionales  ℚ", cx - 110, legendY);
    ctx.fillStyle = GREEN;
    ctx.fillText("● irracionales  ℝ\\ℚ", cx + 80, legendY);

    // Subtítulo del modo actual
    ctx.fillStyle = "#64748b";
    ctx.font = "italic 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      highlight === 0
        ? "Los racionales son densos en ℝ pero dejan infinitos huecos"
        : highlight === 1
        ? "Los irracionales son no numerables: |ℝ\\ℚ| = 2^ℵ₀"
        : "ℝ = ℚ ∪ (ℝ\\ℚ) — completitud: ningún hueco en la recta",
      cx, H - 12
    );

  }, [zoom, highlight]);

  return (
    <div className="viz-box" style={{ fontFamily: "sans-serif" }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: "block", width: "100%", borderRadius: 8, background: BG }}
      />

      <div className="viz-ctrl" style={{ marginTop: 10 }}>
        <span style={{ color: "#475569", fontSize: 11, minWidth: 90 }}>
          Zoom ±{zoom}
        </span>
        <input
          type="range" min={1} max={10} step={0.5} value={zoom}
          onChange={e => setZoom(Number(e.target.value))}
          style={{ flex: 1, accentColor: "#60a5fa" }}
        />
      </div>

      <div className="viz-ctrl" style={{ marginTop: 6, gap: 6 }}>
        {["ℚ Racionales", "Irracionales", "ℝ Completo"].map((lbl, i) => (
          <button
            key={i}
            onClick={() => setHighlight(i)}
            style={{
              flex: 1,
              padding: "5px 0",
              borderRadius: 6,
              border: highlight === i ? "1.5px solid #60a5fa" : "1.5px solid #1e293b",
              background: highlight === i ? "#1e3a5f" : "#0f172a",
              color: highlight === i ? "#60a5fa" : "#475569",
              fontSize: 12,
              cursor: "pointer",
              transition: "all .2s",
            }}
          >
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}
