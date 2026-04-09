import React, { useRef, useState, useEffect } from "react";

export default function VariableViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]       = useState(0);   // 0=taxonomía, 1=dist, 2=latente
  const [distIdx, setDistIdx] = useState(0);   // 0=binomial,1=normal,2=uniforme
  const [param, setParam]     = useState(0.5); // parámetro de la distribución
  const [seed, setSeed]       = useState(0);   // para redibujar muestras

  const W = 680, H = 370;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const MODES = ["Taxonomía", "Variable aleatoria", "Variable latente (VAE)"];
  const DISTS = ["Binomial(20, p)", "Normal(μ, 1)", "Uniforme(0, b)"];

  // ── RNG simple y reproducible ─────────────────────────────────────────────
  const lcg = (s) => { let state = s + 1; return () => { state = (state * 1664525 + 1013904223) & 0xffffffff; return (state >>> 0) / 0xffffffff; }; };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    // ═══════════════════════════════════════════════════════════════════════
    // MODO 0 — Taxonomía de variables
    // ═══════════════════════════════════════════════════════════════════════
    if (mode === 0) {
      const cols = [
        { title: "Escalar",   sub: "x ∈ ℝ",         color: BLUE,   ex: ["learning rate η", "pérdida ℒ", "temperatura T"], icon: "①" },
        { title: "Vector",    sub: "x ∈ ℝ^d",        color: GREEN,  ex: ["embedding token", "gradiente ∇θ", "query q"], icon: "▦" },
        { title: "Aleatoria", sub: "X: Ω → ℝ",       color: YELLOW, ex: ["ruido ε~N(0,I)", "dropout mask", "dato x~P"], icon: "⚂" },
        { title: "Latente",   sub: "z ∈ ℝ^k (oculta)",color: PURPLE, ex: ["código VAE z", "estado RNN h", "topic LDA"], icon: "?" },
      ];
      const cw = (W - 40) / 4, ch = H - 80;
      const oy = 55;

      ctx.fillStyle = "#e2e8f0"; ctx.font = "bold 14px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("Taxonomía de variables en ML", W / 2, 28);

      cols.forEach(({ title, sub, color, ex, icon }, i) => {
        const x = 20 + i * cw;

        // Caja principal
        ctx.fillStyle = color + "14";
        ctx.strokeStyle = color + "88";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x + 4, oy, cw - 8, ch, 8);
        ctx.fill(); ctx.stroke();

        // Icono
        ctx.fillStyle = color;
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(icon, x + cw / 2, oy + 32);

        // Título
        ctx.font = "bold 12px sans-serif";
        ctx.fillText(title, x + cw / 2, oy + 54);

        // Subdominio
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10px monospace";
        ctx.fillText(sub, x + cw / 2, oy + 70);

        // Separador
        ctx.strokeStyle = color + "44"; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 14, oy + 80);
        ctx.lineTo(x + cw - 14, oy + 80);
        ctx.stroke();

        // Ejemplos
        ex.forEach((e, j) => {
          ctx.fillStyle = "#64748b";
          ctx.font = "10px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("· " + e, x + cw / 2, oy + 100 + j * 22);
        });
      });

      // Eje de libre/ligada
      const ly = oy + ch + 18;
      ctx.fillStyle = SLATE; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("Variable libre: f(x) = x²  →  x recorre el dominio", 20, ly);
      ctx.fillStyle = ORANGE;
      ctx.fillText("Variable ligada: Σᵢ xᵢ  →  i cuantificada, no accesible fuera", 20, ly + 18);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MODO 1 — Distribución de probabilidad interactiva
    // ═══════════════════════════════════════════════════════════════════════
    if (mode === 1) {
      const rng = lcg(seed * 997 + distIdx * 31 + Math.round(param * 100));
      const N = 1500;
      const ox = 55, oy = 45, pw = W - ox - 30, ph = H - oy - 80;

      // Generar muestras
      let samples = [];
      if (distIdx === 0) {
        // Binomial(20, p)
        const n = 20;
        for (let i = 0; i < N; i++) {
          let s = 0; for (let j = 0; j < n; j++) if (rng() < param) s++;
          samples.push(s);
        }
      } else if (distIdx === 1) {
        // Normal(mu, 1) — Box-Muller
        for (let i = 0; i < N; i++) {
          const u1 = rng(), u2 = rng();
          samples.push(param + Math.sqrt(-2 * Math.log(u1 + 1e-12)) * Math.cos(2 * Math.PI * u2));
        }
      } else {
        // Uniforme(0, b)
        const b = param * 8 + 0.5;
        for (let i = 0; i < N; i++) samples.push(rng() * b);
      }

      // Histograma
      const minS = Math.min(...samples), maxS = Math.max(...samples);
      const bins = distIdx === 0 ? 21 : 35;
      const counts = new Array(bins).fill(0);
      samples.forEach(s => {
        const bi = Math.min(bins - 1, Math.floor((s - minS) / (maxS - minS + 1e-9) * bins));
        counts[bi]++;
      });
      const maxCount = Math.max(...counts);

      // Ejes
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy + ph); ctx.lineTo(ox + pw, oy + ph); ctx.stroke();

      // Barras
      const bw = pw / bins - 1;
      counts.forEach((c, i) => {
        const bh = (c / maxCount) * ph;
        const bx = ox + i * (pw / bins);
        const by = oy + ph - bh;
        const t = i / bins;
        const r = Math.round(96 * (1 - t) + 167 * t);
        const g = Math.round(165 * (1 - t) + 139 * t);
        const bl = Math.round(250 * (1 - t) + 250 * t);
        ctx.fillStyle = `rgba(${r},${g},${bl},0.75)`;
        ctx.fillRect(bx, by, bw, bh);
      });

      // Línea de media
      const mean = samples.reduce((a, b) => a + b, 0) / N;
      const std  = Math.sqrt(samples.reduce((a, b) => a + (b - mean) ** 2, 0) / N);
      const meanX = ox + ((mean - minS) / (maxS - minS + 1e-9)) * pw;
      ctx.strokeStyle = RED; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(meanX, oy); ctx.lineTo(meanX, oy + ph); ctx.stroke();
      ctx.setLineDash([]);

      // Etiquetas eje X
      ctx.fillStyle = "#64748b"; ctx.font = "10px monospace"; ctx.textAlign = "center";
      for (let i = 0; i <= 5; i++) {
        const v = minS + (maxS - minS) * i / 5;
        const px = ox + (pw * i / 5);
        ctx.fillText(v.toFixed(1), px, oy + ph + 14);
      }

      // Info
      ctx.fillStyle = "#e2e8f0"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "left";
      const distLabel = distIdx === 0
        ? `X ~ Binomial(20, p=${param.toFixed(2)})`
        : distIdx === 1
        ? `X ~ Normal(μ=${param.toFixed(2)}, σ=1)`
        : `X ~ Uniforme(0, ${(param * 8 + 0.5).toFixed(2)})`;
      ctx.fillText(distLabel, ox, oy - 16);

      ctx.fillStyle = RED;   ctx.fillText(`E[X] = ${mean.toFixed(3)}`, ox + 280, oy - 16);
      ctx.fillStyle = YELLOW; ctx.fillText(`Std = ${std.toFixed(3)}`, ox + 400, oy - 16);

      ctx.fillStyle = SLATE; ctx.font = "10px sans-serif";
      ctx.fillText(`n = ${N} realizaciones de la variable aleatoria X`, ox, oy + ph + 32);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MODO 2 — Variable latente en VAE (reparametrización)
    // ═══════════════════════════════════════════════════════════════════════
    if (mode === 2) {
      const rng = lcg(seed * 113 + 7);
      const cx = W / 2, cy = H / 2;

      // Parámetros del encoder (μ, σ controlados por slider)
      const mu1 = (param - 0.5) * 6;        // μ₁ ∈ [-3, 3]
      const mu2 = (param - 0.5) * 4;        // μ₂ ∈ [-2, 2]
      const sig  = 0.4 + param * 1.2;       // σ ∈ [0.4, 1.6]
      const SC = 38;

      // Cuadrícula de fondo
      ctx.strokeStyle = "#0f1f35"; ctx.lineWidth = 1;
      for (let x = cx % SC; x < W; x += SC) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = cy % SC; y < H; y += SC) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // Ejes
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(20,cy); ctx.lineTo(W-20,cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,20); ctx.lineTo(cx,H-20); ctx.stroke();
      ctx.fillStyle = SLATE; ctx.font = "11px monospace";
      ctx.textAlign="center"; ctx.fillText("z₁", W-18, cy-6);
      ctx.textAlign="left";   ctx.fillText("z₂", cx+5, 18);

      // Prior N(0,I) — contorno
      const drawEllipse = (mx, my, sx, sy, color, lw=1.5, dash=[]) => {
        ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash);
        ctx.beginPath();
        ctx.ellipse(cx + mx*SC, cy - my*SC, sx*SC, sy*SC, 0, 0, Math.PI*2);
        ctx.stroke(); ctx.setLineDash([]);
      };
      drawEllipse(0, 0, 1, 1, SLATE+"55", 1, [4,4]);
      drawEllipse(0, 0, 2, 2, SLATE+"33", 1, [4,4]);
      ctx.fillStyle = SLATE+"88"; ctx.font = "10px sans-serif"; ctx.textAlign="center";
      ctx.fillText("prior  N(0,I)", cx, cy - 2.15*SC);

      // Muestras del prior ε ~ N(0,I)
      const Npts = 120;
      for (let i = 0; i < Npts; i++) {
        const u1 = rng()+1e-9, u2 = rng();
        const e1 = Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
        const e2 = Math.sqrt(-2*Math.log(u1))*Math.sin(2*Math.PI*u2);
        ctx.fillStyle = SLATE+"44";
        ctx.beginPath(); ctx.arc(cx+e1*SC, cy-e2*SC, 2, 0, Math.PI*2); ctx.fill();
      }

      // Muestras del posterior q(z|x) = N(μ, σ²I)
      const rng2 = lcg(seed * 113 + 7); // misma semilla para ε
      for (let i = 0; i < Npts; i++) {
        const u1 = rng2()+1e-9, u2 = rng2();
        const e1 = Math.sqrt(-2*Math.log(u1))*Math.cos(2*Math.PI*u2);
        const e2 = Math.sqrt(-2*Math.log(u1))*Math.sin(2*Math.PI*u2);
        const z1 = mu1 + sig * e1;   // reparametrización
        const z2 = mu2 + sig * e2;
        ctx.fillStyle = BLUE+"99";
        ctx.beginPath(); ctx.arc(cx+z1*SC, cy-z2*SC, 2.5, 0, Math.PI*2); ctx.fill();
      }

      // Elipse del posterior
      drawEllipse(mu1, mu2, sig, sig, BLUE, 2);
      drawEllipse(mu1, mu2, 2*sig, 2*sig, BLUE+"55", 1, [4,4]);

      // Punto μ
      ctx.shadowColor=BLUE; ctx.shadowBlur=10;
      ctx.fillStyle=BLUE;
      ctx.beginPath(); ctx.arc(cx+mu1*SC, cy-mu2*SC, 5, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;
      ctx.fillStyle=BLUE; ctx.font="bold 12px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`μ=(${mu1.toFixed(1)},${mu2.toFixed(1)})`, cx+mu1*SC+8, cy-mu2*SC-6);

      // Flecha de reparametrización ε → z
      const arrowX = W - 160, arrowY = 35;
      ctx.fillStyle = "#0f172a"; ctx.fillRect(arrowX-8, arrowY-16, 165, 58);
      ctx.strokeStyle = PURPLE+"66"; ctx.lineWidth=1; ctx.strokeRect(arrowX-8, arrowY-16, 165, 58);
      ctx.fillStyle = "#94a3b8"; ctx.font = "11px monospace"; ctx.textAlign="left";
      ctx.fillText("z = μ + σ · ε", arrowX, arrowY);
      ctx.fillStyle = SLATE; ctx.font = "10px sans-serif";
      ctx.fillText(`ε ~ N(0,I)  (variable libre)`, arrowX, arrowY+16);
      ctx.fillText(`σ = ${sig.toFixed(2)}`, arrowX, arrowY+30);

      // Leyenda
      ctx.fillStyle = SLATE+"cc"; ctx.beginPath(); ctx.arc(20+7, H-22, 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = SLATE; ctx.font="11px sans-serif"; ctx.textAlign="left";
      ctx.fillText("prior N(0,I)", 34, H-18);
      ctx.fillStyle = BLUE+"cc"; ctx.beginPath(); ctx.arc(130+7, H-22, 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#94a3b8"; ctx.fillText("posterior q(z|x)", 144, H-18);
    }

  }, [mode, distIdx, param, seed]);

  const btnStyle = (active) => ({
    flex:1, padding:"5px 0", borderRadius:6, fontSize:11, cursor:"pointer",
    border: active ? "1.5px solid #60a5fa" : "1.5px solid #1e293b",
    background: active ? "#1e3a5f" : "#0f172a",
    color: active ? "#60a5fa" : "#475569",
    transition:"all .2s",
  });

  const distLabels = ["Binomial p", "Normal μ", "Uniforme b"];
  const paramLabel = mode===1
    ? `${distLabels[distIdx]} = ${distIdx===2 ? (param*8+0.5).toFixed(2) : param.toFixed(2)}`
    : `param = ${param.toFixed(2)}`;

  return (
    <div className="viz-box">
      <canvas ref={canvasRef} width={W} height={H}
        style={{display:"block", width:"100%", borderRadius:8, background:BG}} />

      <div className="viz-ctrl" style={{marginTop:8, gap:5}}>
        {MODES.map((m,i)=>(
          <button key={i} onClick={()=>setMode(i)} style={btnStyle(mode===i)}>{m}</button>
        ))}
      </div>

      {mode===1 && (
        <div className="viz-ctrl" style={{marginTop:6, gap:5}}>
          {DISTS.map((d,i)=>(
            <button key={i} onClick={()=>setDistIdx(i)} style={btnStyle(distIdx===i)}>{d.split("(")[0]}</button>
          ))}
        </div>
      )}

      {mode!==0 && (
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569", fontSize:11, minWidth:130}}>{paramLabel}</span>
          <input type="range" min={0} max={1} step={0.01} value={param}
            onChange={e=>setParam(Number(e.target.value))}
            style={{flex:1, accentColor:"#60a5fa"}}/>
          <button onClick={()=>setSeed(s=>s+1)}
            style={{...btnStyle(false), flex:"none", padding:"4px 10px", fontSize:10}}>
            ↺ nueva muestra
          </button>
        </div>
      )}
    </div>
  );
}
