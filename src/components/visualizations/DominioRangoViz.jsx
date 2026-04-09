import React, { useRef, useState, useEffect } from "react";

export default function DominioRangoViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]   = useState(0);  // 0=dominio/imagen, 1=restricción, 2=OOD
  const [fnIdx, setFnIdx] = useState(0);
  const [aVal, setAVal]   = useState(-2); // límite inferior del dominio restringido
  const [bVal, setBVal]   = useState(2);  // límite superior

  const W = 680, H = 370;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const MODES = ["Dominio & Imagen", "Restricción", "OOD (softmax)"];

  const FNS = [
    {
      name: "sin(x)",
      f:    x => Math.sin(x),
      dom:  [-Math.PI, Math.PI],
      nat:  null,
      color: BLUE,
      imLo: -1, imHi: 1,
    },
    {
      name: "√x",
      f:    x => x >= 0 ? Math.sqrt(x) : null,
      dom:  [-3, 4],
      nat:  [0, 4],
      color: GREEN,
      imLo: 0, imHi: 2,
    },
    {
      name: "log(x)",
      f:    x => x > 0 ? Math.log(x) : null,
      dom:  [-1, 4],
      nat:  [0.001, 4],
      color: YELLOW,
      imLo: null, imHi: Math.log(4),
    },
    {
      name: "1/x",
      f:    x => Math.abs(x) > 0.05 ? 1/x : null,
      dom:  [-3, 3],
      nat:  null,
      color: ORANGE,
      imLo: null, imHi: null,
    },
    {
      name: "sigmoid",
      f:    x => 1 / (1 + Math.exp(-x)),
      dom:  [-6, 6],
      nat:  null,
      color: PURPLE,
      imLo: 0, imHi: 1,
    },
  ];

  // Softmax 3 clases (para modo OOD)
  const softmax3 = (z1, z2, z3) => {
    const m = Math.max(z1, z2, z3);
    const e = [Math.exp(z1-m), Math.exp(z2-m), Math.exp(z3-m)];
    const s = e[0]+e[1]+e[2];
    return e.map(v => v/s);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

    const fn = FNS[fnIdx];

    // ── Helpers ───────────────────────────────────────────────────────────
    const drawGrid = (cx, cy, sc) => {
      ctx.strokeStyle = "#0f1f35"; ctx.lineWidth = 1;
      for (let x = cx%sc; x<W; x+=sc) { ctx.beginPath(); ctx.moveTo(x,20); ctx.lineTo(x,H-20); ctx.stroke(); }
      for (let y = cy%sc; y<H; y+=sc) { ctx.beginPath(); ctx.moveTo(30,y); ctx.lineTo(W-20,y); ctx.stroke(); }
    };

    const drawAxes = (cx, cy, sc, xMin, xMax, yMin=null, yMax=null) => {
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(30,cy); ctx.lineTo(W-20,cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,20); ctx.lineTo(cx,H-20); ctx.stroke();
      ctx.fillStyle = SLATE; ctx.font = "10px monospace"; ctx.textAlign = "center";
      for (let v=Math.ceil(xMin); v<=Math.floor(xMax); v++) {
        if (v===0) continue;
        const px = cx+v*sc;
        if (px<35||px>W-15) continue;
        ctx.fillText(v, px, cy+14);
      }
      for (let v=-4; v<=4; v++) {
        if (v===0) continue;
        const py = cy-v*sc;
        if (py<25||py>H-25) continue;
        ctx.textAlign="right"; ctx.fillText(v, cx-5, py+4);
      }
      ctx.textAlign="center";
    };

    const plotCurve = (f, xMin, xMax, cx, cy, sc, color, lw=2.5, dash=[]) => {
      const steps = 600;
      ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash);
      ctx.beginPath(); let first=true;
      for (let i=0; i<=steps; i++) {
        const x = xMin + (xMax-xMin)*i/steps;
        const y = f(x);
        if (y===null||!isFinite(y)) { first=true; continue; }
        const px=cx+x*sc, py=cy-y*sc;
        if (py<14||py>H-14) { first=true; continue; }
        first ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
        first=false;
      }
      ctx.stroke(); ctx.setLineDash([]);
    };

    // ════════════════════════════════════════════════════════════════════════
    // MODO 0 — Dominio & Imagen
    // ════════════════════════════════════════════════════════════════════════
    if (mode === 0) {
      const cx = W/2, cy = H/2+10, sc = 55;
      const xMin = -(W/2-35)/sc, xMax = (W/2-20)/sc;
      drawGrid(cx, cy, sc);
      drawAxes(cx, cy, sc, xMin, xMax);

      const [dLo, dHi] = fn.dom;

      // Sombreado del dominio (sobre eje x)
      const pxLo = cx + Math.max(dLo, xMin)*sc;
      const pxHi = cx + Math.min(dHi, xMax)*sc;
      ctx.fillStyle = fn.color+"22";
      ctx.fillRect(pxLo, cy-3, pxHi-pxLo, 6);

      // Región fuera del dominio natural (gris)
      if (fn.nat) {
        const [nLo, nHi] = fn.nat;
        const pnLo = cx + Math.max(dLo, xMin)*sc;
        const pnHi = cx + Math.min(nLo, xMax)*sc;
        ctx.fillStyle = RED+"18";
        ctx.fillRect(pnLo, 20, pnHi-pnLo, H-40);
        ctx.fillStyle = RED+"44"; ctx.font="10px sans-serif"; ctx.textAlign="center";
        ctx.fillText("fuera del", (pnLo+pnHi)/2, 38);
        ctx.fillText("dom. nat.", (pnLo+pnHi)/2, 50);
      }

      // Curva (con dominio natural)
      plotCurve(fn.f, xMin, xMax, cx, cy, sc, fn.color, 2.5);

      // Banda horizontal = imagen (sobre eje y)
      if (fn.imLo !== null && fn.imHi !== null) {
        const pyLo = cy - fn.imHi*sc;
        const pyHi = cy - fn.imLo*sc;
        ctx.fillStyle = GREEN+"18";
        ctx.fillRect(30, pyLo, 6, pyHi-pyLo);
        ctx.strokeStyle = GREEN+"55"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
        ctx.beginPath(); ctx.moveTo(30,pyLo); ctx.lineTo(W-20,pyLo); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(30,pyHi); ctx.lineTo(W-20,pyHi); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = GREEN; ctx.font="bold 10px sans-serif"; ctx.textAlign="left";
        ctx.fillText(`Im(f) = [${fn.imLo}, ${fn.imHi.toFixed(2)}]`, 36, pyLo-4);
      }

      // Panel info
      ctx.fillStyle="#0f172a"; ctx.fillRect(W-210,16,194,66);
      ctx.strokeStyle=fn.color+"44"; ctx.lineWidth=1; ctx.strokeRect(W-210,16,194,66);
      ctx.fillStyle=fn.color; ctx.font="bold 12px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`f(x) = ${fn.name}`, W-202, 34);
      ctx.fillStyle="#94a3b8"; ctx.font="10px monospace";
      ctx.fillText(`Dom = [${dLo.toFixed(2)}, ${dHi.toFixed(2)}]`, W-202, 50);
      ctx.fillText(`Cod = ℝ  (declarado)`, W-202, 64);
      ctx.fillText(`Im  ⊆ Cod  (puede ser propio)`, W-202, 78);

      ctx.fillStyle=fn.color+"88"; ctx.font="10px sans-serif";
      ctx.fillText("▬ dominio (eje x)", W-202, 96);
      ctx.fillStyle=GREEN+"aa";
      ctx.fillText("▬ imagen (eje y)", W-202, 110);
    }

    // ════════════════════════════════════════════════════════════════════════
    // MODO 1 — Restricción de dominio
    // ════════════════════════════════════════════════════════════════════════
    if (mode === 1) {
      const cx = W/2, cy = H/2+10, sc = 55;
      const xMin = -(W/2-35)/sc, xMax = (W/2-20)/sc;
      drawGrid(cx, cy, sc);
      drawAxes(cx, cy, sc, xMin, xMax);

      const a = Math.min(aVal, bVal), b = Math.max(aVal, bVal);

      // Curva completa (atenuada)
      plotCurve(fn.f, xMin, xMax, cx, cy, sc, fn.color+"33", 1.5, [4,4]);

      // Sombreado restricción
      const pxa = cx + a*sc, pxb = cx + b*sc;
      ctx.fillStyle = fn.color+"18";
      ctx.fillRect(pxa, 20, pxb-pxa, H-40);
      ctx.strokeStyle = fn.color+"55"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
      ctx.beginPath(); ctx.moveTo(pxa,20); ctx.lineTo(pxa,H-20); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(pxb,20); ctx.lineTo(pxb,H-20); ctx.stroke();
      ctx.setLineDash([]);

      // Curva restringida (destacada)
      plotCurve(fn.f, a, b, cx, cy, sc, fn.color, 3);

      // Endpoints cerrados
      [a,b].forEach(x => {
        const y = fn.f(x);
        if (y===null||!isFinite(y)) return;
        ctx.shadowColor=fn.color; ctx.shadowBlur=8;
        ctx.fillStyle=fn.color;
        ctx.beginPath(); ctx.arc(cx+x*sc, cy-y*sc, 5, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
      });

      // Calcular imagen restringida
      const steps = 500;
      let imLo=Infinity, imHi=-Infinity;
      for (let i=0; i<=steps; i++) {
        const x = a+(b-a)*i/steps;
        const y = fn.f(x);
        if (y!==null&&isFinite(y)) { imLo=Math.min(imLo,y); imHi=Math.max(imHi,y); }
      }

      // Banda imagen restringida
      if (isFinite(imLo)&&isFinite(imHi)) {
        const pyLo=cy-imHi*sc, pyHi=cy-imLo*sc;
        ctx.fillStyle=GREEN+"22";
        ctx.fillRect(30, pyLo, 7, pyHi-pyLo);
        ctx.strokeStyle=GREEN+"66"; ctx.lineWidth=1;
        [pyLo,pyHi].forEach(py => {
          ctx.beginPath(); ctx.moveTo(30,py); ctx.lineTo(35,py); ctx.stroke();
        });
        ctx.fillStyle=GREEN; ctx.font="10px monospace"; ctx.textAlign="left";
        ctx.fillText(`Im(f|_[${a},${b}]) ≈ [${imLo.toFixed(3)}, ${imHi.toFixed(3)}]`, 38, pyLo-4);
      }

      // Panel info
      ctx.fillStyle="#0f172a"; ctx.fillRect(16,16,230,58);
      ctx.strokeStyle=fn.color+"44"; ctx.lineWidth=1; ctx.strokeRect(16,16,230,58);
      ctx.fillStyle=fn.color; ctx.font="bold 12px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`f|_[${a.toFixed(1)},${b.toFixed(1)}] donde f(x)=${fn.name}`, 26, 34);
      ctx.fillStyle="#94a3b8"; ctx.font="10px sans-serif";
      ctx.fillText("Dom restringido (sombreado)  →  Im reducida", 26, 50);
      ctx.fillText("Útil para recuperar inyectividad → inversa local", 26, 65);
    }

    // ════════════════════════════════════════════════════════════════════════
    // MODO 2 — OOD con softmax: rango real vs codominio declarado
    // ════════════════════════════════════════════════════════════════════════
    if (mode === 2) {
      // Simplex 2D: representamos Δ² proyectado en triángulo equilátero
      const tcx=W/2, tcy=H/2+20, side=200;
      const h = side*Math.sqrt(3)/2;

      // Vértices del triángulo (simplex Δ²)
      const vA = [tcx,       tcy-h*2/3];  // clase 0
      const vB = [tcx-side/2,tcy+h/3];    // clase 1
      const vC = [tcx+side/2,tcy+h/3];    // clase 2

      // Baricéntrico → cartesiano
      const bary2cart = (p0,p1,p2) => [
        p0*vA[0]+p1*vB[0]+p2*vC[0],
        p0*vA[1]+p1*vB[1]+p2*vC[1],
      ];

      // Relleno del símplex (imagen real de softmax: interior abierto)
      ctx.fillStyle = BLUE+"18";
      ctx.beginPath();
      ctx.moveTo(vA[0],vA[1]);
      ctx.lineTo(vB[0],vB[1]);
      ctx.lineTo(vC[0],vC[1]);
      ctx.closePath(); ctx.fill();

      // Borde símplex
      ctx.strokeStyle = BLUE+"66"; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(vA[0],vA[1]);
      ctx.lineTo(vB[0],vB[1]);
      ctx.lineTo(vC[0],vC[1]);
      ctx.closePath(); ctx.stroke();

      // Etiquetas vértices = probabilidad 1 (nunca alcanzados)
      ctx.fillStyle = RED+"aa"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
      ctx.fillText("p₀=1 ✗", vA[0], vA[1]-10);
      ctx.fillText("p₁=1 ✗", vB[0], vB[1]+18);
      ctx.fillText("p₂=1 ✗", vC[0], vC[1]+18);

      // Título y explicación
      ctx.fillStyle = "#e2e8f0"; ctx.font="bold 13px sans-serif";
      ctx.fillText("Imagen de softmax ⊂ Δ²", W/2, 28);
      ctx.fillStyle = SLATE; ctx.font="11px sans-serif";
      ctx.fillText("Im(softmax) = interior abierto del símplex", W/2, 46);
      ctx.fillText("Las esquinas (prob. 0 ó 1 exactas) son inalcanzables con entradas finitas", W/2, 60);

      // Centro del símplex (uniforme)
      const centroP = [1/3,1/3,1/3];
      const [cX,cY] = bary2cart(...centroP);
      ctx.fillStyle=GREEN; ctx.font="10px sans-serif";
      ctx.fillText("uniforme (1/3,1/3,1/3)", cX, cY+14);
      ctx.fillStyle=GREEN+"cc"; ctx.beginPath(); ctx.arc(cX,cY,4,0,Math.PI*2); ctx.fill();

      // Puntos de ejemplo: in-dist y OOD (logits)
      const ejemplos = [
        { label:"z=(1,2,0)",      z:[1,2,0],    color:BLUE,   ood:false },
        { label:"z=(0,0,0)",      z:[0,0,0],    color:GREEN,  ood:false },
        { label:"z=(10,0,0)",     z:[10,0,0],   color:YELLOW, ood:true  },
        { label:"z=(-5,-5,10)",   z:[-5,-5,10], color:ORANGE, ood:true  },
        { label:"z=(50,-50,-50)", z:[50,-50,-50],color:RED,   ood:true  },
      ];

      ejemplos.forEach(({ label, z, color, ood }) => {
        const [p0,p1,p2] = softmax3(...z);
        const [px,py] = bary2cart(p0,p1,p2);
        ctx.shadowColor=color; ctx.shadowBlur=ood?12:6;
        ctx.fillStyle=color;
        ctx.beginPath(); ctx.arc(px,py,ood?6:5,0,Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;
        ctx.fillStyle=color; ctx.font=`${ood?"bold ":""}10px monospace`;
        ctx.textAlign="center";
        ctx.fillText(`${label}`, px, py-(ood?12:10));
        ctx.fillStyle="#64748b"; ctx.font="9px monospace";
        ctx.fillText(`p=(${p0.toFixed(2)},${p1.toFixed(2)},${p2.toFixed(2)})`, px, py+(ood?18:16));
      });

      // Leyenda
      ctx.fillStyle=BLUE; ctx.font="11px sans-serif"; ctx.textAlign="left";
      ctx.fillText("● In-distribution", 20, H-32);
      ctx.fillStyle=RED;
      ctx.fillText("● OOD (logits extremos → bordes del símplex)", 20, H-16);
    }

  }, [mode, fnIdx, aVal, bVal]);

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

      <div className="viz-ctrl" style={{marginTop:8, gap:5}}>
        {MODES.map((m,i)=>(
          <button key={i} onClick={()=>setMode(i)} style={btnStyle(mode===i)}>{m}</button>
        ))}
      </div>

      {mode!==2 && (
        <div className="viz-ctrl" style={{marginTop:6, gap:4}}>
          {FNS.map((f,i)=>(
            <button key={i} onClick={()=>setFnIdx(i)} style={btnStyle(fnIdx===i)}>{f.name}</button>
          ))}
        </div>
      )}

      {mode===1 && (
        <>
          <div className="viz-ctrl" style={{marginTop:6}}>
            <span style={{color:"#475569", fontSize:11, minWidth:110}}>a = {aVal.toFixed(1)}</span>
            <input type="range" min={-3} max={3} step={0.1} value={aVal}
              onChange={e=>setAVal(Number(e.target.value))}
              style={{flex:1, accentColor:"#60a5fa"}}/>
          </div>
          <div className="viz-ctrl" style={{marginTop:4}}>
            <span style={{color:"#475569", fontSize:11, minWidth:110}}>b = {bVal.toFixed(1)}</span>
            <input type="range" min={-3} max={3} step={0.1} value={bVal}
              onChange={e=>setBVal(Number(e.target.value))}
              style={{flex:1, accentColor:"#60a5fa"}}/>
          </div>
        </>
      )}
    </div>
  );
}
