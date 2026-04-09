import React, { useRef, useState, useEffect } from "react";

export default function FuncionInversaViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]   = useState(0);  // 0=reflexión, 1=derivada, 2=flujo
  const [fnIdx, setFnIdx] = useState(0);
  const [yProbe, setYProbe] = useState(0.5); // punto de evaluación en modo 1
  const [muVal, setMuVal]   = useState(0);   // parámetro flujo modo 2
  const [sigVal, setSigVal] = useState(1);   // parámetro flujo modo 2

  const W = 680, H = 370;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const MODES = ["Reflexión y = x", "Derivada inversa", "Flujo normalizante"];

  const FNS = [
    {
      name: "eˣ / ln",
      f:    x => Math.exp(x),
      finv: y => y > 0 ? Math.log(y) : null,
      df:   x => Math.exp(x),
      domF: [-2.5, 2.5], domFinv: [0.01, 12],
      color: BLUE,
    },
    {
      name: "x³ / ∛x",
      f:    x => x**3,
      finv: y => Math.cbrt(y),
      df:   x => 3*x*x,
      domF: [-2.2, 2.2], domFinv: [-12, 12],
      color: GREEN,
    },
    {
      name: "sin / arcsin",
      f:    x => Math.sin(x),
      finv: y => Math.abs(y)<=1 ? Math.asin(y) : null,
      df:   x => Math.cos(x),
      domF: [-Math.PI/2, Math.PI/2], domFinv: [-1, 1],
      color: YELLOW,
    },
    {
      name: "tanh / arctanh",
      f:    x => Math.tanh(x),
      finv: y => Math.abs(y)<1 ? 0.5*Math.log((1+y)/(1-y)) : null,
      df:   x => 1-Math.tanh(x)**2,
      domF: [-3, 3], domFinv: [-0.995, 0.995],
      color: PURPLE,
    },
  ];

  // Gaussian pdf
  const gaussPdf = (x, mu, sig) =>
    Math.exp(-0.5*((x-mu)/sig)**2) / (sig*Math.sqrt(2*Math.PI));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

    const fn = FNS[fnIdx];

    // ── Helpers ─────────────────────────────────────────────────────────────
    const drawGrid = (cx, cy, sc) => {
      ctx.strokeStyle = "#0f1f35"; ctx.lineWidth = 1;
      for (let x=cx%sc; x<W; x+=sc) { ctx.beginPath(); ctx.moveTo(x,16); ctx.lineTo(x,H-16); ctx.stroke(); }
      for (let y=cy%sc; y<H; y+=sc) { ctx.beginPath(); ctx.moveTo(30,y); ctx.lineTo(W-16,y); ctx.stroke(); }
    };

    const drawAxes = (cx, cy, sc) => {
      ctx.strokeStyle = "#1e3a5f"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(30,cy); ctx.lineTo(W-16,cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,16); ctx.lineTo(cx,H-16); ctx.stroke();
      ctx.fillStyle = SLATE; ctx.font = "10px monospace";
      for (let v=-5; v<=5; v++) {
        if (!v) continue;
        const px=cx+v*sc, py=cy-v*sc;
        ctx.textAlign="center"; if(px>35&&px<W-10) ctx.fillText(v,px,cy+13);
        ctx.textAlign="right";  if(py>20&&py<H-16) ctx.fillText(v,cx-4,py+4);
      }
    };

    const plotCurve = (f, xMin, xMax, cx, cy, sc, color, lw=2.5, dash=[]) => {
      const N=600;
      ctx.strokeStyle=color; ctx.lineWidth=lw; ctx.setLineDash(dash);
      ctx.beginPath(); let first=true;
      for (let i=0; i<=N; i++) {
        const x=xMin+(xMax-xMin)*i/N;
        const y=f(x);
        if (y===null||!isFinite(y)) { first=true; continue; }
        const px=cx+x*sc, py=cy-y*sc;
        if (py<12||py>H-12||px<30||px>W-12) { first=true; continue; }
        first ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
        first=false;
      }
      ctx.stroke(); ctx.setLineDash([]);
    };

    // ════════════════════════════════════════════════════════════════════════
    // MODO 0 — Reflexión respecto a y = x
    // ════════════════════════════════════════════════════════════════════════
    if (mode === 0) {
      const cx=W/2, cy=H/2, sc=52;
      drawGrid(cx, cy, sc);
      drawAxes(cx, cy, sc);

      // Diagonal y = x
      ctx.strokeStyle=SLATE+"44"; ctx.lineWidth=1; ctx.setLineDash([5,5]);
      ctx.beginPath(); ctx.moveTo(30,H-16); ctx.lineTo(W-16,16); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle=SLATE+"99"; ctx.font="10px monospace"; ctx.textAlign="left";
      ctx.fillText("y = x", cx+6, cy-6);

      // f y f⁻¹
      const [dLo, dHi] = fn.domF;
      const [iLo, iHi] = fn.domFinv;
      plotCurve(fn.f,    dLo, dHi, cx, cy, sc, fn.color,    2.5);
      plotCurve(fn.finv, iLo, iHi, cx, cy, sc, fn.color+"88", 2, [6,4]);

      // Reflexión visual: línea punteada entre puntos espejo
      const nPts = 6;
      for (let k=0; k<nPts; k++) {
        const t = k/(nPts-1);
        const x = dLo + (dHi-dLo)*t;
        const y = fn.f(x);
        if (!isFinite(y)||y===null) continue;
        const px=cx+x*sc, py=cy-y*sc;
        const qx=cx+y*sc, qy=cy-x*sc;
        if (px<30||qx<30||py<12||qy<12||px>W-12||qx>W-12||py>H-12||qy>H-12) continue;
        ctx.strokeStyle=fn.color+"33"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
        ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(qx,qy); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle=fn.color+"cc";
        ctx.beginPath(); ctx.arc(px,py,3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle=fn.color+"66";
        ctx.beginPath(); ctx.arc(qx,qy,3,0,Math.PI*2); ctx.fill();
      }

      // Leyenda
      ctx.fillStyle="#0f172a"; ctx.fillRect(16,16,200,52);
      ctx.strokeStyle=fn.color+"44"; ctx.lineWidth=1; ctx.strokeRect(16,16,200,52);
      ctx.fillStyle=fn.color;   ctx.font="bold 11px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`—  f(x) = ${fn.name.split("/")[0].trim()}`, 26, 34);
      ctx.fillStyle=fn.color+"99"; ctx.font="11px sans-serif";
      ctx.fillText(`- -  f⁻¹(y) = ${fn.name.split("/")[1].trim()}`, 26, 52);
      ctx.fillStyle=SLATE; ctx.font="10px sans-serif";
      ctx.fillText("Reflexión respecto a y = x", 26, 62);

      ctx.fillStyle="#64748b"; ctx.font="10px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Γ(f⁻¹) = {(y,x) : (x,y) ∈ Γ(f)}", W/2, H-12);
    }

    // ════════════════════════════════════════════════════════════════════════
    // MODO 1 — Derivada de la inversa
    // ════════════════════════════════════════════════════════════════════════
    if (mode === 1) {
      const cx=W/2, cy=H/2+10, sc=50;
      drawGrid(cx, cy, sc);
      drawAxes(cx, cy, sc);

      const [dLo, dHi] = fn.domF;
      const [iLo, iHi] = fn.domFinv;

      // Diagonal
      ctx.strokeStyle=SLATE+"33"; ctx.lineWidth=1; ctx.setLineDash([4,5]);
      ctx.beginPath(); ctx.moveTo(30,H-16); ctx.lineTo(W-16,16); ctx.stroke();
      ctx.setLineDash([]);

      plotCurve(fn.f,    dLo, dHi, cx, cy, sc, fn.color+"66", 1.5, [4,4]);
      plotCurve(fn.finv, iLo, iHi, cx, cy, sc, fn.color,      2.5);

      // Punto y₀ sobre f⁻¹
      const y0    = Math.max(iLo*0.9, Math.min(iHi*0.9, yProbe));
      const x0    = fn.finv(y0);
      if (x0 !== null && isFinite(x0)) {
        // Tangente a f⁻¹ en (y0, x0): pendiente = 1/f'(x0)
        const dfx0    = fn.df(x0);
        const slope_inv = Math.abs(dfx0) > 1e-9 ? 1/dfx0 : null;

        // Tangente a f en (x0, y0): pendiente = f'(x0)
        const tLen = 0.8;
        const drawTangent = (px, py, slope, color) => {
          if (slope===null||!isFinite(slope)) return;
          const dx=tLen, dy=slope*tLen;
          const x1=cx+(px-dx)*sc, y1=cy-(py-dy)*sc;
          const x2=cx+(px+dx)*sc, y2=cy-(py+dy)*sc;
          ctx.strokeStyle=color; ctx.lineWidth=2; ctx.setLineDash([]);
          ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        };

        // Tangente a f⁻¹ (en punto y0, x0 del espacio de la inversa)
        drawTangent(y0, x0, slope_inv, GREEN);
        // Tangente a f (en punto x0, y0)
        drawTangent(x0, y0, dfx0, fn.color);

        // Punto sobre f⁻¹
        ctx.shadowColor=GREEN; ctx.shadowBlur=10;
        ctx.fillStyle=GREEN;
        ctx.beginPath(); ctx.arc(cx+y0*sc, cy-x0*sc, 6, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur=0;

        // Punto espejo sobre f
        ctx.fillStyle=fn.color+"aa";
        ctx.beginPath(); ctx.arc(cx+x0*sc, cy-y0*sc, 5, 0, Math.PI*2); ctx.fill();

        // Línea de correspondencia
        ctx.strokeStyle=SLATE+"44"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
        ctx.beginPath(); ctx.moveTo(cx+y0*sc,cy-x0*sc); ctx.lineTo(cx+x0*sc,cy-y0*sc); ctx.stroke();
        ctx.setLineDash([]);

        // Panel info
        ctx.fillStyle="#0f172a"; ctx.fillRect(W-230,16,214,76);
        ctx.strokeStyle=GREEN+"44"; ctx.lineWidth=1; ctx.strokeRect(W-230,16,214,76);
        ctx.fillStyle="#e2e8f0"; ctx.font="bold 11px sans-serif"; ctx.textAlign="left";
        ctx.fillText(`y₀ = ${y0.toFixed(3)}`, W-222, 34);
        ctx.fillStyle="#94a3b8"; ctx.font="10px monospace";
        ctx.fillText(`x₀ = f⁻¹(y₀) = ${x0.toFixed(4)}`, W-222, 50);
        ctx.fillStyle=fn.color;
        ctx.fillText(`f′(x₀) = ${dfx0.toFixed(4)}`, W-222, 66);
        ctx.fillStyle=GREEN;
        ctx.fillText(`(f⁻¹)′(y₀) = 1/f′(x₀) = ${slope_inv!==null?slope_inv.toFixed(4):"∞"}`, W-222, 82);

        ctx.fillStyle=GREEN; ctx.font="10px sans-serif";
        ctx.fillText("— tangente a f⁻¹", W-222, 96);
        ctx.fillStyle=fn.color;
        ctx.fillText(`— tangente a f`, W-222, 110);
      }

      ctx.fillStyle="#64748b"; ctx.font="10px sans-serif"; ctx.textAlign="center";
      ctx.fillText("(f⁻¹)′(y) = 1 / f′(f⁻¹(y))  —  pendientes recíprocas respecto a y=x", W/2, H-10);
    }

    // ════════════════════════════════════════════════════════════════════════
    // MODO 2 — Flujo normalizante: cambio de variable en densidad
    // ════════════════════════════════════════════════════════════════════════
    if (mode === 2) {
      // Layout: dos subplots horizontales
      const W2=W/2-10, oxL=10, oxR=W/2+10;
      const plotH=H-100, oy=30;

      const drawHistPanel = (ox, title, xs, pdfFn, color, xMin, xMax) => {
        // Eje
        ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(ox,oy+plotH); ctx.lineTo(ox+W2,oy+plotH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(ox,oy); ctx.lineTo(ox,oy+plotH); ctx.stroke();

        // Curva de densidad
        const pVals=[], N=300;
        let pMax=0;
        for(let i=0;i<=N;i++){
          const x=xMin+(xMax-xMin)*i/N;
          const p=pdfFn(x);
          pVals.push({x,p});
          if(isFinite(p)) pMax=Math.max(pMax,p);
        }
        if(pMax<1e-9) return;

        ctx.fillStyle=color+"22";
        ctx.beginPath(); ctx.moveTo(ox,oy+plotH);
        pVals.forEach(({x,p})=>{
          const px=ox+(x-xMin)/(xMax-xMin)*W2;
          const py=oy+plotH-p/pMax*plotH*0.88;
          ctx.lineTo(px,py);
        });
        ctx.lineTo(ox+W2,oy+plotH); ctx.closePath(); ctx.fill();

        ctx.strokeStyle=color; ctx.lineWidth=2.5;
        ctx.beginPath(); let first=true;
        pVals.forEach(({x,p})=>{
          const px=ox+(x-xMin)/(xMax-xMin)*W2;
          const py=oy+plotH-p/pMax*plotH*0.88;
          if(!isFinite(py)) { first=true; return; }
          first ? ctx.moveTo(px,py) : ctx.lineTo(px,py);
          first=false;
        });
        ctx.stroke();

        // Título
        ctx.fillStyle=color; ctx.font="bold 12px sans-serif"; ctx.textAlign="center";
        ctx.fillText(title, ox+W2/2, oy-10);

        // Ticks eje x
        ctx.fillStyle=SLATE; ctx.font="10px monospace";
        for(let v=Math.ceil(xMin);v<=Math.floor(xMax);v++){
          const px=ox+(v-xMin)/(xMax-xMin)*W2;
          if(px<ox+5||px>ox+W2-5) continue;
          ctx.textAlign="center";
          ctx.fillText(v,px,oy+plotH+14);
          ctx.strokeStyle="#1e293b"; ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(px,oy+plotH); ctx.lineTo(px,oy+plotH+4); ctx.stroke();
        }
      };

      const mu=muVal, sig=Math.max(0.3, sigVal);
      // Prior: Z ~ N(0,1)
      const pZ = (z) => gaussPdf(z, 0, 1);
      // Transformed: X = μ + σZ  → p_X(x) = p_Z((x-μ)/σ) / σ
      const pX = (x) => gaussPdf(x, mu, sig);

      drawHistPanel(oxL, "Prior: Z ~ N(0,1)", [], pZ, BLUE, -4, 4);
      drawHistPanel(oxR, `Transformada: X ~ N(${mu.toFixed(1)},${sig.toFixed(1)}²)`, [], pX, GREEN, mu-4*sig, mu+4*sig);

      // Flecha central con fórmulas
      const arrowCX = W/2, arrowY1=oy+plotH*0.3, arrowY2=oy+plotH*0.7;
      ctx.fillStyle="#0f172a"; ctx.fillRect(arrowCX-85,arrowY1-4,170,arrowY2-arrowY1+8);
      ctx.strokeStyle=YELLOW+"44"; ctx.lineWidth=1; ctx.strokeRect(arrowCX-85,arrowY1-4,170,arrowY2-arrowY1+8);

      ctx.fillStyle=GREEN; ctx.font="bold 10px monospace"; ctx.textAlign="center";
      ctx.fillText("X = μ + σZ  →", arrowCX, arrowY1+12);
      ctx.fillStyle=YELLOW; ctx.font="10px monospace";
      ctx.fillText(`f(z) = ${mu.toFixed(1)}+${sig.toFixed(1)}z`, arrowCX, arrowY1+28);
      ctx.fillStyle=BLUE;
      ctx.fillText("Z = (X-μ)/σ  ←", arrowCX, arrowY2-16);
      ctx.fillStyle=ORANGE; ctx.font="10px monospace";
      ctx.fillText(`f⁻¹(x)=(x-${mu.toFixed(1)})/${sig.toFixed(1)}`, arrowCX, arrowY2);

      // Fórmula cambio de variable
      ctx.fillStyle="#94a3b8"; ctx.font="10px sans-serif"; ctx.textAlign="center";
      ctx.fillText("p_X(x) = p_Z(f⁻¹(x)) · |det J_{f⁻¹}|  =  p_Z((x-μ)/σ) / σ", W/2, H-28);
      ctx.fillStyle=SLATE; ctx.font="9px monospace";
      ctx.fillText(`log|det J| = log(σ) = ${Math.log(sig).toFixed(4)}`, W/2, H-12);
    }

  }, [mode, fnIdx, yProbe, muVal, sigVal]);

  const btnStyle = (active) => ({
    flex:1, padding:"5px 0", borderRadius:6, fontSize:11, cursor:"pointer",
    border: active ? "1.5px solid #60a5fa" : "1.5px solid #1e293b",
    background: active ? "#1e3a5f" : "#0f172a",
    color: active ? "#60a5fa" : "#475569",
    transition:"all .2s",
  });

  const fnBtnStyle = (active, color) => ({
    flex:1, padding:"4px 0", borderRadius:5, fontSize:10, cursor:"pointer",
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

      {mode !== 2 && (
        <div className="viz-ctrl" style={{marginTop:6, gap:4}}>
          {FNS.map((fn,i)=>(
            <button key={i} onClick={()=>setFnIdx(i)} style={fnBtnStyle(fnIdx===i, fn.color)}>
              {fn.name}
            </button>
          ))}
        </div>
      )}

      {mode === 1 && (
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569", fontSize:11, minWidth:90}}>y₀ = {yProbe.toFixed(2)}</span>
          <input type="range" min={FNS[fnIdx].domFinv[0]*0.9} max={FNS[fnIdx].domFinv[1]*0.9}
            step={0.02} value={yProbe}
            onChange={e=>setYProbe(Number(e.target.value))}
            style={{flex:1, accentColor:"#60a5fa"}}/>
        </div>
      )}

      {mode === 2 && (
        <>
          <div className="viz-ctrl" style={{marginTop:6}}>
            <span style={{color:"#475569", fontSize:11, minWidth:90}}>μ = {muVal.toFixed(1)}</span>
            <input type="range" min={-3} max={3} step={0.1} value={muVal}
              onChange={e=>setMuVal(Number(e.target.value))}
              style={{flex:1, accentColor:"#60a5fa"}}/>
          </div>
          <div className="viz-ctrl" style={{marginTop:4}}>
            <span style={{color:"#475569", fontSize:11, minWidth:90}}>σ = {sigVal.toFixed(2)}</span>
            <input type="range" min={0.3} max={2.5} step={0.05} value={sigVal}
              onChange={e=>setSigVal(Number(e.target.value))}
              style={{flex:1, accentColor:"#60a5fa"}}/>
          </div>
        </>
      )}
    </div>
  );
}
