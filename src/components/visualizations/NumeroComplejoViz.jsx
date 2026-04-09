import React, { useRef, useState, useEffect } from "react";

export default function NumeroComplejoViz() {
  const canvasRef = useRef(null);
  const [re, setRe]     = useState(2);
  const [im, setIm]     = useState(2);
  const [mode, setMode] = useState(0); // 0=plano, 1=raíces, 2=rope

  const W = 680, H = 360;
  const BG    = "#0b1220";
  const BLUE  = "#60a5fa";
  const GREEN = "#34d399";
  const YELLOW= "#fbbf24";
  const RED   = "#f87171";
  const PURPLE= "#a78bfa";
  const SLATE = "#475569";

  const MODES = ["Plano de Argand", "Raíces de la Unidad", "RoPE (rotación)"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2, cy = H / 2;
    const SC = 60; // píxeles por unidad

    // ── Cuadrícula ────────────────────────────────────────────────────────
    ctx.strokeStyle = "#0f1f35";
    ctx.lineWidth = 1;
    for (let x = cx % SC; x < W; x += SC) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = cy % SC; y < H; y += SC) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // ── Ejes ──────────────────────────────────────────────────────────────
    const axis = (x1,y1,x2,y2) => {
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    };
    axis(20, cy, W-20, cy);
    axis(cx, 20, cx, H-20);

    // Etiquetas de eje
    ctx.fillStyle = SLATE; ctx.font = "11px monospace"; ctx.textAlign="center";
    for (let k = -4; k <= 4; k++) {
      if (k === 0) continue;
      const px = cx + k*SC, py = cy + k*SC;
      if (px>25 && px<W-10) ctx.fillText(k, px, cy+14);
      if (py>10 && py<H-10) { ctx.textAlign="right"; ctx.fillText(k+"i", cx-5, py+4); ctx.textAlign="center"; }
    }
    ctx.fillStyle="#64748b"; ctx.font="12px sans-serif";
    ctx.fillText("Re", W-18, cy-6);
    ctx.textAlign="left"; ctx.fillText("Im", cx+6, 18); ctx.textAlign="center";

    // ── MODO 0: Plano de Argand ───────────────────────────────────────────
    if (mode === 0) {
      const zx = cx + re*SC, zy = cy - im*SC;
      const r = Math.hypot(re, im);
      const theta = Math.atan2(im, re);

      // Arco de ángulo
      ctx.strokeStyle = YELLOW+"99"; ctx.lineWidth = 1.5; ctx.setLineDash([4,4]);
      ctx.beginPath(); ctx.arc(cx, cy, SC*0.75, -theta, 0, theta<0);
      ctx.stroke(); ctx.setLineDash([]);

      // Radio al conjugado
      ctx.strokeStyle = GREEN+"44"; ctx.lineWidth = 1; ctx.setLineDash([3,5]);
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(zx, cy+im*SC); ctx.stroke();
      ctx.setLineDash([]);

      // Líneas punteadas de Re e Im
      ctx.strokeStyle = BLUE+"55"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
      ctx.beginPath(); ctx.moveTo(zx,cy); ctx.lineTo(zx,zy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,zy); ctx.lineTo(zx,zy); ctx.stroke();
      ctx.setLineDash([]);

      // Vector z
      ctx.strokeStyle = BLUE; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(zx,zy); ctx.stroke();

      // Punta de flecha
      const angle = Math.atan2(zy-cy, zx-cx);
      ctx.fillStyle = BLUE;
      ctx.beginPath();
      ctx.moveTo(zx, zy);
      ctx.lineTo(zx - 10*Math.cos(angle-0.4), zy - 10*Math.sin(angle-0.4));
      ctx.lineTo(zx - 10*Math.cos(angle+0.4), zy - 10*Math.sin(angle+0.4));
      ctx.closePath(); ctx.fill();

      // Conjugado
      ctx.strokeStyle = GREEN+"88"; ctx.lineWidth=1.5; ctx.setLineDash([5,4]);
      ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(zx,cy+im*SC); ctx.stroke();
      ctx.setLineDash([]);

      // Punto z
      ctx.shadowColor=BLUE; ctx.shadowBlur=12;
      ctx.fillStyle=BLUE; ctx.beginPath(); ctx.arc(zx,zy,6,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur=0;

      // Punto conjugado
      ctx.fillStyle=GREEN+"cc"; ctx.beginPath(); ctx.arc(zx,cy+im*SC,4,0,Math.PI*2); ctx.fill();

      // Etiquetas
      ctx.font="bold 13px sans-serif";
      ctx.fillStyle=BLUE; ctx.textAlign="left";
      const lx = zx+8, ly = zy-8;
      ctx.fillText(`z = ${re}+${im}i`, lx>W-110?zx-100:lx, ly<16?zy+20:ly);

      ctx.fillStyle=GREEN+"cc"; ctx.font="11px sans-serif";
      ctx.fillText(`z̄ = ${re}−${im}i`, zx+8, cy+im*SC+14);

      // Info panel
      ctx.fillStyle="#0f172a"; ctx.fillRect(12,12,190,80);
      ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1; ctx.strokeRect(12,12,190,80);
      ctx.fillStyle="#94a3b8"; ctx.font="12px monospace"; ctx.textAlign="left";
      ctx.fillText(`|z|  = ${r.toFixed(4)}`, 20, 32);
      ctx.fillText(`arg  = ${(theta*180/Math.PI).toFixed(2)}°`, 20, 50);
      ctx.fillText(`|z|² = ${(re*re+im*im).toFixed(3)}`, 20, 68);
      ctx.fillText(`z·z̄ = ${re*re+im*im} ∈ ℝ`, 20, 86);
    }

    // ── MODO 1: Raíces de la unidad ───────────────────────────────────────
    if (mode === 1) {
      const n = Math.max(2, Math.round(Math.hypot(re, im) * 1.5 + 1));
      const nRoots = Math.min(Math.max(2, Math.round(re + im + 2)), 16);

      // Círculo unitario
      ctx.strokeStyle = PURPLE+"66"; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.arc(cx, cy, SC, 0, Math.PI*2); ctx.stroke();

      const colors = [BLUE, GREEN, YELLOW, RED, PURPLE, "#fb923c", "#f472b6", "#38bdf8"];
      const roots = Array.from({length: nRoots}, (_,k) => {
        const angle = 2*Math.PI*k/nRoots;
        return { x: cx + SC*Math.cos(-angle+Math.PI/2), y: cy - SC*Math.sin(Math.PI/2-angle), angle, k };
      });

      // Polígono
      ctx.strokeStyle = PURPLE+"44"; ctx.lineWidth=1; ctx.beginPath();
      roots.forEach((p,i) => i===0 ? ctx.moveTo(p.x,p.y) : ctx.lineTo(p.x,p.y));
      ctx.closePath(); ctx.stroke();

      // Radios y puntos
      roots.forEach(({x,y,k}) => {
        const col = colors[k % colors.length];
        ctx.strokeStyle=col+"55"; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(x,y); ctx.stroke();
        ctx.shadowColor=col; ctx.shadowBlur=8;
        ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
        ctx.fillStyle=col; ctx.font="bold 11px monospace"; ctx.textAlign="center";
        const lx2=cx+(SC+16)*Math.cos(-2*Math.PI*k/nRoots+Math.PI/2);
        const ly2=cy-(SC+16)*Math.sin(Math.PI/2-2*Math.PI*k/nRoots);
        ctx.fillText(`ω${k}`, lx2, ly2);
      });

      ctx.fillStyle="#94a3b8"; ctx.font="12px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`n = ${nRoots} raíces de la unidad`, 16, H-16);
      ctx.fillText(`ωₖ = e^(2πik/${nRoots}), k=0..${nRoots-1}`, 16, H-32);
    }

    // ── MODO 2: RoPE ─────────────────────────────────────────────────────
    if (mode === 2) {
      const theta = Math.atan2(im, re) * 0.5; // ángulo de rotación RoPE
      const len = SC * 1.5;

      // Círculo de radio = len/SC
      ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.arc(cx,cy,len,0,Math.PI*2); ctx.stroke();

      const drawVec = (angle, color, label, dashed=false) => {
        const vx=cx+len*Math.cos(angle), vy=cy-len*Math.sin(angle);
        ctx.strokeStyle=color; ctx.lineWidth=2.5;
        if(dashed){ctx.setLineDash([5,4]);}
        ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(vx,vy); ctx.stroke();
        ctx.setLineDash([]);
        const ar=Math.atan2(vy-cy,vx-cx);
        ctx.fillStyle=color;
        ctx.beginPath();
        ctx.moveTo(vx,vy);
        ctx.lineTo(vx-10*Math.cos(ar-0.4),vy-10*Math.sin(ar-0.4));
        ctx.lineTo(vx-10*Math.cos(ar+0.4),vy-10*Math.sin(ar+0.4));
        ctx.closePath(); ctx.fill();
        ctx.shadowColor=color; ctx.shadowBlur=10;
        ctx.fillStyle=color; ctx.beginPath(); ctx.arc(vx,vy,5,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
        ctx.font="bold 12px sans-serif"; ctx.textAlign="center";
        const d=len+18;
        ctx.fillText(label, cx+d*Math.cos(angle), cy-d*Math.sin(angle));
      };

      const baseAngle = 0.3; // ángulo base del embedding
      drawVec(baseAngle, BLUE, "q (pos=0)", true);
      drawVec(baseAngle + theta, GREEN, `q·e^(iθ)`, false);

      // Arco de rotación
      ctx.strokeStyle=YELLOW+"88"; ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
      ctx.beginPath();
      ctx.arc(cx,cy,len*0.55, -baseAngle-theta, -baseAngle, theta<0);
      ctx.stroke(); ctx.setLineDash([]);

      ctx.fillStyle=YELLOW; ctx.font="11px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`θ = ${(theta).toFixed(3)} rad`, cx+10, cy-len*0.55-6);

      ctx.fillStyle="#94a3b8"; ctx.font="12px sans-serif"; ctx.textAlign="left";
      ctx.fillText("RoPE: multiplicar q por e^(iθ·pos)", 16, H-32);
      ctx.fillText("Preserva ‖q‖, rota según posición del token", 16, H-16);
    }

    // ── Título ─────────────────────────────────────────────────────────────
    ctx.fillStyle="#e2e8f0"; ctx.font="bold 14px sans-serif"; ctx.textAlign="right";
    ctx.fillText("ℂ — Plano Complejo", W-16, 24);

  }, [re, im, mode]);

  const sliderStyle = { flex:1, accentColor: BLUE };
  const btnStyle = (active) => ({
    flex:1, padding:"5px 0", borderRadius:6, fontSize:11, cursor:"pointer",
    border: active ? "1.5px solid #60a5fa" : "1.5px solid #1e293b",
    background: active ? "#1e3a5f" : "#0f172a",
    color: active ? "#60a5fa" : "#475569",
    transition:"all .2s"
  });

  return (
    <div className="viz-box">
      <canvas ref={canvasRef} width={W} height={H}
        style={{display:"block", width:"100%", borderRadius:8, background:BG}} />

      <div className="viz-ctrl" style={{marginTop:8, gap:5}}>
        {MODES.map((m,i) => (
          <button key={i} onClick={()=>setMode(i)} style={btnStyle(mode===i)}>{m}</button>
        ))}
      </div>

      <div className="viz-ctrl" style={{marginTop:6}}>
        <span style={{color:"#475569", fontSize:11, minWidth:70}}>Re = {re}</span>
        <input type="range" min={-4} max={4} step={0.25} value={re}
          onChange={e=>setRe(Number(e.target.value))} style={sliderStyle}/>
      </div>
      <div className="viz-ctrl" style={{marginTop:4}}>
        <span style={{color:"#475569", fontSize:11, minWidth:70}}>Im = {im}</span>
        <input type="range" min={-4} max={4} step={0.25} value={im}
          onChange={e=>setIm(Number(e.target.value))} style={sliderStyle}/>
      </div>
    </div>
  );
}
