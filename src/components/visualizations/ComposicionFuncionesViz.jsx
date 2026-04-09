import React, { useRef, useState, useEffect } from "react";

export default function ComposicionFuncionesViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]     = useState(0); // 0=cadena, 1=jacobiana, 2=backprop
  const [nCapas, setNCapas] = useState(3); // número de capas
  const [fnSel, setFnSel]   = useState([0, 1, 2]); // índice de función por capa
  const [xIn, setXIn]       = useState(1.5); // valor de entrada

  const W = 680, H = 370;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const MODES = ["Cadena de funciones", "Jacobiana por capa", "Backprop (gradientes)"];

  const FNS_DEFS = [
    { name: "sin",    f: x => Math.sin(x),              df: x => Math.cos(x),              color: BLUE   },
    { name: "x²",     f: x => x*x,                      df: x => 2*x,                      color: GREEN  },
    { name: "tanh",   f: x => Math.tanh(x),             df: x => 1-Math.tanh(x)**2,        color: YELLOW },
    { name: "ReLU",   f: x => Math.max(0,x),            df: x => x>0?1:0,                  color: ORANGE },
    { name: "e^x",    f: x => Math.exp(Math.min(x,3)),  df: x => Math.exp(Math.min(x,3)),  color: PURPLE },
    { name: "√|x|",   f: x => Math.sqrt(Math.abs(x)),   df: x => x===0?0:x/(2*Math.abs(x)*Math.sqrt(Math.abs(x))), color: RED },
  ];

  // Composición hacia adelante: devuelve [a0, a1, ..., aL]
  const forward = (x0, indices) =>
    indices.reduce((acc, idx) => {
      const last = acc[acc.length-1];
      return [...acc, FNS_DEFS[idx].f(last)];
    }, [x0]);

  // Derivadas locales en cada capa: f'_k(a_{k-1})
  const localDerivs = (acts, indices) =>
    indices.map((idx, k) => FNS_DEFS[idx].df(acts[k]));

  // Gradiente hacia atrás: producto acumulado de derecha a izquierda
  const backward = (localDs) => {
    const grads = [1]; // ∂L/∂aL = 1 (sin pérdida, gradiente de identidad)
    for (let k = localDs.length-1; k >= 0; k--) {
      grads.unshift(grads[0] * localDs[k]);
    }
    return grads;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

    const n    = nCapas;
    const idxs = fnSel.slice(0, n);
    const acts = forward(xIn, idxs);           // [a0, a1, ..., an]
    const lDs  = localDerivs(acts, idxs);      // f'_k(a_{k-1})
    const grads= backward(lDs);                // ∂L/∂a_k para k=0..n

    // ═══════════════════════════════════════════════════════════════════════
    // MODO 0 — Cadena de funciones: nodos y flechas
    // ═══════════════════════════════════════════════════════════════════════
    if (mode === 0) {
      const nodeW = 88, nodeH = 54, gap = (W - 40 - (n+1)*nodeW) / n;
      const nodeY = H/2 - nodeH/2;
      const nodeX = (k) => 20 + k*(nodeW+gap);
      const nodeCX = (k) => nodeX(k) + nodeW/2;
      const nodeCY = nodeY + nodeH/2;

      // Título
      ctx.fillStyle="#e2e8f0"; ctx.font="bold 13px sans-serif"; ctx.textAlign="center";
      ctx.fillText(`Composición: f_${n} ∘ ⋯ ∘ f_1`, W/2, 24);

      // Flechas entre nodos
      for (let k=0; k<n; k++) {
        const x1 = nodeX(k)+nodeW, x2 = nodeX(k+1);
        const cy2 = nodeCY;
        const fnDef = FNS_DEFS[idxs[k]];
        // Flecha
        ctx.strokeStyle=fnDef.color+"aa"; ctx.lineWidth=2; ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(x1+2,cy2); ctx.lineTo(x2-2,cy2); ctx.stroke();
        // Punta
        ctx.fillStyle=fnDef.color+"aa";
        ctx.beginPath();
        ctx.moveTo(x2-2,cy2); ctx.lineTo(x2-10,cy2-5); ctx.lineTo(x2-10,cy2+5);
        ctx.closePath(); ctx.fill();
        // Etiqueta función
        ctx.fillStyle=fnDef.color; ctx.font="bold 11px monospace"; ctx.textAlign="center";
        ctx.fillText(`f${k+1}=${fnDef.name}`, (x1+x2)/2, cy2-14);
        // Valor activación en la flecha
        const val = acts[k+1];
        ctx.fillStyle="#94a3b8"; ctx.font="10px monospace";
        ctx.fillText(isFinite(val)?val.toFixed(3):"±∞", (x1+x2)/2, cy2+20);
      }

      // Nodos (activaciones)
      for (let k=0; k<=n; k++) {
        const nx=nodeX(k), val=acts[k];
        const isFirst=k===0, isLast=k===n;
        const col = isFirst?SLATE : isLast?GREEN : FNS_DEFS[idxs[k-1]].color;

        ctx.fillStyle=col+"22"; ctx.strokeStyle=col+"88"; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.roundRect(nx,nodeY,nodeW,nodeH,8); ctx.fill(); ctx.stroke();

        ctx.fillStyle=col; ctx.font="bold 12px sans-serif"; ctx.textAlign="center";
        ctx.fillText(isFirst?"x₀" : isLast?`a_${n}` : `a_${k}`, nx+nodeW/2, nodeY+18);
        ctx.fillStyle="#e2e8f0"; ctx.font="11px monospace";
        ctx.fillText(isFinite(val)?val.toFixed(4):"±∞", nx+nodeW/2, nodeY+36);
      }

      // Fórmula de composición completa
      ctx.fillStyle=SLATE; ctx.font="11px monospace"; ctx.textAlign="center";
      const fStr = idxs.map((i,k)=>`f${k+1}(${FNS_DEFS[i].name})`).join(" ∘ ");
      ctx.fillText(`(${fStr})(${xIn.toFixed(1)}) = ${acts[n].toFixed(4)}`, W/2, H-16);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MODO 1 — Jacobiana local por capa
    // ═══════════════════════════════════════════════════════════════════════
    if (mode === 1) {
      const barW = (W - 100) / n - 12;
      const barMaxH = H - 140;
      const baseY = H - 70;
      const ox = 50;

      ctx.fillStyle="#e2e8f0"; ctx.font="bold 13px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Derivada local f′ₖ(aₖ₋₁) por capa  (regla de la cadena)", W/2, 24);
      ctx.fillStyle=SLATE; ctx.font="10px sans-serif";
      ctx.fillText("D(fₙ∘⋯∘f₁)(x) = f′ₙ(aₙ₋₁)·⋯·f′₁(x)  — producto de derivadas locales", W/2, 42);

      // Línea base
      ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(40,baseY); ctx.lineTo(W-20,baseY); ctx.stroke();

      // Barras por capa
      const maxAbs = Math.max(...lDs.map(Math.abs), 0.01);
      lDs.forEach((d, k) => {
        const fnDef = FNS_DEFS[idxs[k]];
        const bx = ox + k*(barW+12);
        const bh = Math.min(Math.abs(d)/maxAbs * barMaxH, barMaxH);
        const by = baseY - bh;

        // Barra
        ctx.fillStyle = fnDef.color+"88";
        ctx.strokeStyle = fnDef.color;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(bx, by, barW, bh, [4,4,0,0]); ctx.fill(); ctx.stroke();

        // Etiqueta valor
        ctx.fillStyle=fnDef.color; ctx.font="bold 11px monospace"; ctx.textAlign="center";
        ctx.fillText(d.toFixed(3), bx+barW/2, by-8);

        // Etiqueta capa
        ctx.fillStyle="#94a3b8"; ctx.font="10px sans-serif";
        ctx.fillText(`f′${k+1}`, bx+barW/2, baseY+14);
        ctx.fillStyle=fnDef.color+"cc";
        ctx.fillText(`${fnDef.name}`, bx+barW/2, baseY+28);
        ctx.fillStyle=SLATE; ctx.font="9px monospace";
        ctx.fillText(`a=${acts[k].toFixed(2)}`, bx+barW/2, baseY+42);
      });

      // Producto total = gradiente total ∂output/∂input
      const prodTotal = lDs.reduce((p,d)=>p*d, 1);
      ctx.fillStyle="#0f172a"; ctx.fillRect(16, H-56, W-32, 38);
      ctx.strokeStyle=GREEN+"55"; ctx.lineWidth=1; ctx.strokeRect(16,H-56,W-32,38);
      ctx.fillStyle="#94a3b8"; ctx.font="11px monospace"; ctx.textAlign="left";
      ctx.fillText(`Producto total (regla de la cadena): `, 26, H-38);
      ctx.fillStyle=GREEN; ctx.font="bold 12px monospace";
      const dStr = lDs.map(d=>d.toFixed(3)).join(" × ");
      ctx.fillText(`${dStr} = ${prodTotal.toFixed(5)}`, 26, H-20);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // MODO 2 — Backprop: flujo de gradientes
    // ═══════════════════════════════════════════════════════════════════════
    if (mode === 2) {
      const nodeW=78, nodeH=48, gap=(W-40-(n+1)*nodeW)/n;
      const nodeY=H/2-nodeH/2-20;
      const nodeX=(k)=>20+k*(nodeW+gap);
      const nodeCX=(k)=>nodeX(k)+nodeW/2;
      const nodeCY=nodeY+nodeH/2;

      ctx.fillStyle="#e2e8f0"; ctx.font="bold 13px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Retropropagación: gradientes ∂L/∂aₖ (modo reverso)", W/2, 24);

      // Forward arrows (top, atenuado)
      for (let k=0; k<n; k++) {
        const x1=nodeX(k)+nodeW, x2=nodeX(k+1);
        ctx.strokeStyle=FNS_DEFS[idxs[k]].color+"44"; ctx.lineWidth=1.5; ctx.setLineDash([3,4]);
        ctx.beginPath(); ctx.moveTo(x1,nodeCY-10); ctx.lineTo(x2,nodeCY-10); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle=FNS_DEFS[idxs[k]].color+"55"; ctx.font="9px monospace"; ctx.textAlign="center";
        ctx.fillText(`f${k+1}`, (x1+x2)/2, nodeCY-16);
      }

      // Backward arrows (bottom, en rojo/naranja)
      for (let k=n-1; k>=0; k--) {
        const x1=nodeX(k+1), x2=nodeX(k)+nodeW;
        const gradMag = Math.min(Math.abs(grads[k]), 5);
        const alpha = Math.round(80+gradMag/5*170).toString(16).padStart(2,"0");
        ctx.strokeStyle=RED+alpha; ctx.lineWidth=2.5;
        ctx.beginPath(); ctx.moveTo(x1,nodeCY+14); ctx.lineTo(x2+2,nodeCY+14); ctx.stroke();
        ctx.fillStyle=RED+alpha;
        ctx.beginPath();
        ctx.moveTo(x2+2,nodeCY+14); ctx.lineTo(x2+10,nodeCY+9); ctx.lineTo(x2+10,nodeCY+19);
        ctx.closePath(); ctx.fill();
        // Etiqueta f'_k
        ctx.fillStyle=FNS_DEFS[idxs[k]].color+"cc"; ctx.font="9px monospace"; ctx.textAlign="center";
        ctx.fillText(`×f′${k+1}=${lDs[k].toFixed(2)}`, (x1+x2)/2+2, nodeCY+28);
      }

      // Nodos
      for (let k=0; k<=n; k++) {
        const nx=nodeX(k);
        const isLast=k===n;
        const gradHere=grads[k];
        const gradAbs=Math.abs(gradHere);
        const col=isLast?GREEN:(gradAbs>2?RED:gradAbs>0.5?ORANGE:BLUE);

        ctx.fillStyle=col+"22"; ctx.strokeStyle=col+"88"; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.roundRect(nx,nodeY,nodeW,nodeH,8); ctx.fill(); ctx.stroke();

        ctx.fillStyle=col; ctx.font="bold 10px sans-serif"; ctx.textAlign="center";
        ctx.fillText(isLast?"∂L/∂aₙ=1":`∂L/∂a${k}`, nx+nodeW/2, nodeY+16);
        ctx.fillStyle="#e2e8f0"; ctx.font="bold 11px monospace";
        ctx.fillText(gradHere.toFixed(4), nx+nodeW/2, nodeY+34);
      }

      // Tabla resumen
      const ty=H-76;
      ctx.fillStyle="#0f172a"; ctx.fillRect(16,ty,W-32,62);
      ctx.strokeStyle=SLATE+"44"; ctx.lineWidth=1; ctx.strokeRect(16,ty,W-32,62);
      ctx.fillStyle="#94a3b8"; ctx.font="11px monospace"; ctx.textAlign="left";
      ctx.fillText("Capa   función   a_k-1     f′(a)     ∂L/∂a_k → ∂L/∂a_{k-1}", 26, ty+16);
      ctx.strokeStyle=SLATE+"33"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(16,ty+22); ctx.lineTo(W-16,ty+22); ctx.stroke();

      let rowY=ty+35;
      idxs.forEach((idx,k)=>{
        const fnD=FNS_DEFS[idx];
        ctx.fillStyle=fnD.color; ctx.font="10px monospace";
        const row=`  ${k+1}      ${fnD.name.padEnd(6)}   ${acts[k].toFixed(3).padStart(7)}   ${lDs[k].toFixed(3).padStart(7)}   ${grads[k+1].toFixed(4).padStart(9)} → ${grads[k].toFixed(4)}`;
        ctx.fillText(row, 22, rowY);
        rowY+=18;
        if (rowY>ty+62) return;
      });
    }

  }, [mode, nCapas, fnSel, xIn]);

  const btnStyle = (active) => ({
    flex:1, padding:"5px 0", borderRadius:6, fontSize:11, cursor:"pointer",
    border: active ? "1.5px solid #60a5fa" : "1.5px solid #1e293b",
    background: active ? "#1e3a5f" : "#0f172a",
    color: active ? "#60a5fa" : "#475569",
    transition:"all .2s",
  });

  const fnBtnStyle = (active, color) => ({
    padding:"3px 7px", borderRadius:5, fontSize:10, cursor:"pointer",
    border: active ? `1.5px solid ${color}` : "1.5px solid #1e293b",
    background: active ? color+"22" : "#0f172a",
    color: active ? color : "#475569",
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

      {/* Número de capas */}
      <div className="viz-ctrl" style={{marginTop:6}}>
        <span style={{color:"#475569", fontSize:11, minWidth:100}}>Capas: {nCapas}</span>
        <input type="range" min={1} max={5} step={1} value={nCapas}
          onChange={e=>setNCapas(Number(e.target.value))}
          style={{flex:1, accentColor:"#60a5fa"}}/>
      </div>

      {/* Selección de función por capa */}
      <div style={{display:"flex", flexDirection:"column", gap:4, marginTop:4}}>
        {Array.from({length:nCapas}, (_,k)=>(
          <div key={k} className="viz-ctrl" style={{gap:4}}>
            <span style={{color:"#475569", fontSize:10, minWidth:52}}>f{k+1}:</span>
            {FNS_DEFS.map((fn,i)=>(
              <button key={i}
                onClick={()=>setFnSel(s=>{const ns=[...s]; ns[k]=i; return ns;})}
                style={fnBtnStyle(fnSel[k]===i, fn.color)}>
                {fn.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Valor de entrada */}
      <div className="viz-ctrl" style={{marginTop:6}}>
        <span style={{color:"#475569", fontSize:11, minWidth:100}}>x₀ = {xIn.toFixed(2)}</span>
        <input type="range" min={-3} max={3} step={0.05} value={xIn}
          onChange={e=>setXIn(Number(e.target.value))}
          style={{flex:1, accentColor:"#60a5fa"}}/>
      </div>
    </div>
  );
}
