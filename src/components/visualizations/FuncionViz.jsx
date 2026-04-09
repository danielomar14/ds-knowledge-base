import React, { useRef, useState, useEffect } from "react";

export default function FuncionViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]     = useState(0);  // 0=tipos, 1=composición, 2=approx
  const [fnIdx, setFnIdx]   = useState(0);  // función base (modo 0 y 1)
  const [layers, setLayers] = useState(1);  // capas de composición (modo 1)
  const [width, setWidth]   = useState(8);  // neuronas por capa (modo 2)

  const W = 680, H = 370;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const MODES = ["Tipos de función", "Composición", "Aprox. Universal"];

  // ── Funciones base disponibles ─────────────────────────────────────────────
  const FNS = [
    { name: "x²",       f: x => x*x,                color: BLUE,   lip: "∞ (no Lipschitz global)" },
    { name: "sin(x)",   f: x => Math.sin(x),         color: GREEN,  lip: "L = 1" },
    { name: "tanh(x)",  f: x => Math.tanh(x),        color: YELLOW, lip: "L = 1" },
    { name: "ReLU(x)",  f: x => Math.max(0, x),      color: ORANGE, lip: "L = 1" },
    { name: "e^x",      f: x => Math.exp(Math.min(x,3)), color: PURPLE, lip: "L = e³ ≈ 20.1 en [-∞,3]" },
  ];

  // ── Red neuronal en JS (aproximación universal, modo 2) ───────────────────
  const relu = x => Math.max(0, x);
  const sigmoid = x => 1 / (1 + Math.exp(-x));

  // Genera pesos pseudo-aleatorios reproducibles
  const pseudoRnd = (seed) => {
    let s = seed;
    return () => { s = (s * 16807 + 0) % 2147483647; return (s / 2147483647) * 2 - 1; };
  };

  const targetFn = x => Math.sin(2 * x) * Math.exp(-0.3 * Math.abs(x));

  // Red de 1 capa oculta con 'n' neuronas, entrenada "a mano" para aproximar targetFn
  // Usamos una proyección analítica simple: suma de n ReLUs desplazadas y escaladas
  const buildApprox = (n) => {
    const rng = pseudoRnd(42);
    // Puntos de soporte uniformes
    const centers = Array.from({length: n}, (_, i) => -3 + 6 * i / (n - 1 + 1e-9));
    const scale   = 6 / (n + 1);
    return (x) => {
      // f_n(x) = Σ wᵢ · ReLU(x - cᵢ) + Σ vᵢ · ReLU(cᵢ - x)   (aprox lineal por tramos)
      let acc = 0;
      centers.forEach(c => {
        const target_c = targetFn(c);
        acc += target_c * relu(1 - Math.abs(x - c) / scale);
      });
      // Normalizar
      const denom = centers.reduce((s, c) => s + relu(1 - Math.abs(x - c) / scale), 0);
      return denom > 1e-9 ? acc / denom : 0;
    };
  };

  // ── Utilidades de dibujo ───────────────────────────────────────────────────
  const plotFn = (ctx, fn, xMin, xMax, cx, cy, sc, color, lw=2, dash=[]) => {
    const steps = 400;
    ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash);
    ctx.beginPath();
    let first = true;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + (xMax - xMin) * i / steps;
      const y = fn(x);
      if (!isFinite(y)) { first = true; continue; }
      const px = cx + x * sc, py = cy - y * sc;
      if (py < 10 || py > H - 10) { first = true; continue; }
      first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      first = false;
    }
    ctx.stroke(); ctx.setLineDash([]);
  };

  const drawAxes = (ctx, cx, cy, sc, xMin, xMax) => {
    ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(30, cy); ctx.lineTo(W-20, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 20); ctx.lineTo(cx, H-30); ctx.stroke();
    ctx.fillStyle = SLATE; ctx.font = "10px monospace"; ctx.textAlign = "center";
    for (let v = Math.ceil(xMin); v <= Math.floor(xMax); v++) {
      if (v === 0) continue;
      const px = cx + v * sc;
      ctx.fillText(v, px, cy + 14);
    }
    for (let v = -3; v <= 3; v++) {
      if (v === 0) continue;
      const py = cy - v * sc;
      if (py < 25 || py > H-25) continue;
      ctx.textAlign = "right"; ctx.fillText(v, cx - 5, py + 4);
    }
    ctx.textAlign = "center";
  };

  const drawGrid = (ctx, cx, cy, sc) => {
    ctx.strokeStyle = "#0f1f35"; ctx.lineWidth = 1;
    for (let x = cx % sc; x < W; x += sc) { ctx.beginPath(); ctx.moveTo(x,20); ctx.lineTo(x,H-20); ctx.stroke(); }
    for (let y = cy % sc; y < H; y += sc) { ctx.beginPath(); ctx.moveTo(30,y); ctx.lineTo(W-20,y); ctx.stroke(); }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

    const cx = W/2, cy = H/2 + 10;
    const sc = 52;
    const xMin = -(W/2 - 30) / sc, xMax = (W/2 - 20) / sc;

    drawGrid(ctx, cx, cy, sc);
    drawAxes(ctx, cx, cy, sc, xMin, xMax);

    // ══════════════════════════════════════════════════════════════════════
    // MODO 0 — Tipos de función y propiedades
    // ══════════════════════════════════════════════════════════════════════
    if (mode === 0) {
      const { f, color, name, lip } = FNS[fnIdx];

      // Función principal
      plotFn(ctx, f, xMin, xMax, cx, cy, sc, color, 2.5);

      // Identidad (referencia)
      plotFn(ctx, x => x, xMin, xMax, cx, cy, sc, SLATE+"55", 1, [4,4]);

      // Marcar inyectividad: dos puntos con mismo valor?
      const testInj = () => {
        for (let x1 = -3; x1 <= 3; x1 += 0.1) {
          for (let x2 = x1 + 0.2; x2 <= 3; x2 += 0.1) {
            if (Math.abs(f(x1) - f(x2)) < 0.05 && Math.abs(x1-x2) > 0.15) return false;
          }
        }
        return true;
      };
      const inyectiva = testInj();

      // Panel de info
      ctx.fillStyle = "#0f172a"; ctx.fillRect(16, 16, 210, 82);
      ctx.strokeStyle = color + "66"; ctx.lineWidth=1; ctx.strokeRect(16,16,210,82);
      ctx.fillStyle = color; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "left";
      ctx.fillText(`f(x) = ${name}`, 26, 36);
      ctx.fillStyle = "#94a3b8"; ctx.font = "11px monospace";
      ctx.fillText(`Inyectiva : ${inyectiva ? "✓ Sí" : "✗ No (∃ x₁≠x₂, f=f)"}`, 26, 54);
      ctx.fillText(`Lipschitz : ${lip}`, 26, 70);
      ctx.fillStyle = SLATE; ctx.font = "10px sans-serif";
      ctx.fillText("— — id(x)=x  (referencia)", 26, 90);

      // Etiqueta eje
      ctx.fillStyle = "#64748b"; ctx.font = "11px sans-serif"; ctx.textAlign = "right";
      ctx.fillText("f(x)", cx - 6, 28);
      ctx.fillText("x", W - 22, cy - 6);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 1 — Composición de funciones
    // ══════════════════════════════════════════════════════════════════════
    if (mode === 1) {
      const baseColor = [BLUE, GREEN, YELLOW, ORANGE, PURPLE];
      const compColors = [BLUE, GREEN, YELLOW, RED, PURPLE];
      const sigma = FNS[fnIdx].f;

      // Construye f^{(k)} = σ ∘ σ ∘ ... (k veces)
      const composed = (k) => {
        let fn = x => x;
        for (let i = 0; i < k; i++) fn = (x => (old => sigma(old))(fn(x)));
        return fn;
      };

      // Dibuja de más externo a más interno para que la capa 1 quede encima
      for (let k = layers; k >= 1; k--) {
        const fn = composed(k);
        const col = compColors[(k-1) % compColors.length];
        const lw = k === 1 ? 2.5 : 1.5;
        plotFn(ctx, fn, xMin, xMax, cx, cy, sc, col + (k===layers?"":"88"), lw);
      }

      // Leyenda
      ctx.fillStyle = "#0f172a"; ctx.fillRect(16, 16, 220, 28 + layers * 18);
      ctx.strokeStyle = SLATE+"44"; ctx.lineWidth=1; ctx.strokeRect(16,16,220,28+layers*18);
      ctx.fillStyle = "#94a3b8"; ctx.font = "11px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`σ(x) = ${FNS[fnIdx].name}`, 26, 32);
      for (let k = 1; k <= layers; k++) {
        const col = compColors[(k-1) % compColors.length];
        ctx.fillStyle = col;
        ctx.fillText(`σ^${k}(x) = σ${"∘σ".repeat(k-1)}(x)`, 26, 32 + k * 18);
      }

      ctx.fillStyle = "#64748b"; ctx.font="10px sans-serif"; ctx.textAlign="center";
      ctx.fillText(`Composición de ${layers} nivel(es) de σ`, W/2, H-12);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 2 — Aproximación Universal
    // ══════════════════════════════════════════════════════════════════════
    if (mode === 2) {
      const approx = buildApprox(width);

      // Función objetivo
      plotFn(ctx, targetFn, xMin, xMax, cx, cy, sc, YELLOW, 2, [6,4]);
      // Aproximación
      plotFn(ctx, approx, xMin, xMax, cx, cy, sc, BLUE, 2.5);

      // Error MSE visual
      let mse = 0, n = 0;
      for (let x = -3; x <= 3; x += 0.05) {
        const err = approx(x) - targetFn(x);
        mse += err * err; n++;
      }
      mse = (mse / n);

      // Panel de info
      ctx.fillStyle = "#0f172a"; ctx.fillRect(16, 16, 240, 75);
      ctx.strokeStyle = BLUE+"44"; ctx.lineWidth=1; ctx.strokeRect(16,16,240,75);
      ctx.fillStyle = "#e2e8f0"; ctx.font="bold 12px sans-serif"; ctx.textAlign="left";
      ctx.fillText("Teorema de Aprox. Universal", 26, 34);
      ctx.fillStyle = "#94a3b8"; ctx.font="11px monospace";
      ctx.fillText(`Neuronas n = ${width}`, 26, 52);
      ctx.fillText(`MSE = ${mse.toFixed(5)}`, 26, 68);
      ctx.fillText(`Error → 0 cuando n → ∞`, 26, 84);

      // Leyenda
      ctx.fillStyle = YELLOW; ctx.font="11px sans-serif";
      ctx.fillText("— — f*(x) = sin(2x)·e^{-0.3|x|}  (objetivo)", 16, H-28);
      ctx.fillStyle = BLUE;
      ctx.fillText(`———  f_θ(x)  (red con ${width} neuronas)`, 16, H-12);
    }

    // Título modo
    ctx.fillStyle = "#e2e8f0"; ctx.font="bold 13px sans-serif"; ctx.textAlign="right";
    ctx.fillText(MODES[mode], W-16, 22);

  }, [mode, fnIdx, layers, width]);

  const btnStyle = (active) => ({
    flex:1, padding:"5px 0", borderRadius:6, fontSize:11, cursor:"pointer",
    border: active ? "1.5px solid #60a5fa" : "1.5px solid #1e293b",
    background: active ? "#1e3a5f" : "#0f172a",
    color: active ? "#60a5fa" : "#475569",
    transition:"all .2s",
  });

  return (
    <div className="viz-box">
      <canvas ref={canvasRef} width={W} height={H}
        style={{display:"block", width:"100%", borderRadius:8, background:BG}}/>

      {/* Selector de modo */}
      <div className="viz-ctrl" style={{marginTop:8, gap:5}}>
        {MODES.map((m,i) => (
          <button key={i} onClick={()=>setMode(i)} style={btnStyle(mode===i)}>{m}</button>
        ))}
      </div>

      {/* Selector de función (modos 0 y 1) */}
      {mode !== 2 && (
        <div className="viz-ctrl" style={{marginTop:6, gap:4}}>
          {FNS.map((fn,i) => (
            <button key={i} onClick={()=>setFnIdx(i)} style={btnStyle(fnIdx===i)}>
              {fn.name}
            </button>
          ))}
        </div>
      )}

      {/* Slider de capas (modo 1) */}
      {mode === 1 && (
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569", fontSize:11, minWidth:110}}>
            Composiciones: {layers}
          </span>
          <input type="range" min={1} max={5} step={1} value={layers}
            onChange={e => setLayers(Number(e.target.value))}
            style={{flex:1, accentColor:"#60a5fa"}}/>
        </div>
      )}

      {/* Slider de neuronas (modo 2) */}
      {mode === 2 && (
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569", fontSize:11, minWidth:130}}>
            Neuronas: {width}
          </span>
          <input type="range" min={2} max={40} step={1} value={width}
            onChange={e => setWidth(Number(e.target.value))}
            style={{flex:1, accentColor:"#60a5fa"}}/>
        </div>
      )}
    </div>
  );
}
