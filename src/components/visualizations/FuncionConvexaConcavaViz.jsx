import React, { useRef, useState, useEffect } from "react";

export default function FuncionConvexaConcavaViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]     = useState(0); // 0=curda, 1=epígrafo/Jensen, 2=paisaje
  const [fnIdx, setFnIdx]   = useState(0);
  const [lambda, setLambda] = useState(0.35);
  const [kappa, setKappa]   = useState(10);  // número de condición (modo 2)

  const W = 680, H = 370;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const MODES = ["Definición & Cuerda", "Jensen & Epígrafo", "Convergencia GD"];

  const FNS = [
    { name: "x²",       f: x=>x*x,            df: x=>2*x,        d2f: _=>2,         type:"convexa",  color:BLUE   },
    { name: "eˣ",       f: x=>Math.exp(x),    df: x=>Math.exp(x), d2f: x=>Math.exp(x), type:"convexa",color:GREEN  },
    { name: "-x²",      f: x=>-x*x,           df: x=>-2*x,       d2f: _=>-2,         type:"cóncava", color:ORANGE },
    { name: "x³",       f: x=>x*x*x,          df: x=>3*x*x,      d2f: x=>6*x,        type:"ni",      color:PURPLE },
    { name: "|x|",      f: x=>Math.abs(x),    df: x=>x>=0?1:-1,  d2f: _=>0,          type:"convexa", color:YELLOW },
    { name: "sin(x)",   f: x=>Math.sin(x),    df: x=>Math.cos(x),d2f: x=>-Math.sin(x),type:"ni",     color:RED    },
  ];

  const drawGrid = (ctx, cx, cy, sc) => {
    ctx.strokeStyle="#0f1f35"; ctx.lineWidth=1;
    for(let x=cx%sc;x<W;x+=sc){ctx.beginPath();ctx.moveTo(x,16);ctx.lineTo(x,H-16);ctx.stroke();}
    for(let y=cy%sc;y<H;y+=sc){ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(W-16,y);ctx.stroke();}
  };

  const drawAxes = (ctx, cx, cy, sc, xMin, xMax) => {
    ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(30,cy);ctx.lineTo(W-16,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,16);ctx.lineTo(cx,H-16);ctx.stroke();
    ctx.fillStyle=SLATE; ctx.font="10px monospace";
    for(let v=Math.ceil(xMin);v<=Math.floor(xMax);v++){
      if(!v) continue;
      const px=cx+v*sc, py=cy-v*sc;
      ctx.textAlign="center"; if(px>35&&px<W-10) ctx.fillText(v,px,cy+13);
      ctx.textAlign="right";  if(py>20&&py<H-14) ctx.fillText(v,cx-4,py+4);
    }
  };

  const plotCurve = (ctx, f, xMin, xMax, cx, cy, sc, color, lw=2.5, dash=[]) => {
    const N=600;
    ctx.strokeStyle=color; ctx.lineWidth=lw; ctx.setLineDash(dash);
    ctx.beginPath(); let first=true;
    for(let i=0;i<=N;i++){
      const x=xMin+(xMax-xMin)*i/N, y=f(x);
      if(!isFinite(y)){first=true;continue;}
      const px=cx+x*sc, py=cy-y*sc;
      if(py<12||py>H-12||px<30||px>W-12){first=true;continue;}
      first?ctx.moveTo(px,py):ctx.lineTo(px,py); first=false;
    }
    ctx.stroke(); ctx.setLineDash([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);

    const fn = FNS[fnIdx];

    // ══════════════════════════════════════════════════════════════════════
    // MODO 0 — Definición: cuerda y desigualdad
    // ══════════════════════════════════════════════════════════════════════
    if(mode===0){
      const cx=W/2, cy=H/2+20, sc=48;
      const xMin=-(W/2-35)/sc, xMax=(W/2-20)/sc;
      drawGrid(ctx,cx,cy,sc);
      drawAxes(ctx,cx,cy,sc,xMin,xMax);

      const x1=-1.8, x2=1.6;
      const lam=lambda, lam1=1-lambda;
      const xMid=lam*x1+lam1*x2;
      const y1=fn.f(x1), y2=fn.f(x2);
      const yMid_curva=fn.f(xMid);
      const yMid_cuerda=lam*y1+lam1*y2;

      // Epígrafo sombreado (región encima de la curva)
      const isConvexa=fn.type==="convexa";
      ctx.fillStyle=(isConvexa?BLUE:ORANGE)+"12";
      ctx.beginPath();
      const N=200;
      ctx.moveTo(30,16);
      for(let i=0;i<=N;i++){
        const x=xMin+(xMax-xMin)*i/N, y=fn.f(x);
        if(!isFinite(y)) continue;
        const px=cx+x*sc, py=cy-y*sc;
        ctx.lineTo(Math.max(30,Math.min(W-16,px)), Math.max(16,Math.min(H-16,py)));
      }
      ctx.lineTo(W-16,16); ctx.closePath(); ctx.fill();

      // Curva
      plotCurve(ctx,fn.f,xMin,xMax,cx,cy,sc,fn.color,2.5);

      // Cuerda (segmento entre (x1,y1) y (x2,y2))
      const px1=cx+x1*sc, py1=cy-y1*sc;
      const px2=cx+x2*sc, py2=cy-y2*sc;
      ctx.strokeStyle=YELLOW; ctx.lineWidth=2; ctx.setLineDash([]);
      ctx.beginPath();ctx.moveTo(px1,py1);ctx.lineTo(px2,py2);ctx.stroke();

      // Puntos x1, x2
      [px1,px2].forEach((px,i) => {
        const py=i===0?py1:py2;
        ctx.shadowColor=YELLOW; ctx.shadowBlur=8;
        ctx.fillStyle=YELLOW;
        ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;
        ctx.fillStyle=YELLOW; ctx.font="bold 10px monospace"; ctx.textAlign="center";
        ctx.fillText(i===0?`x₁=${x1}`:`x₂=${x2}`,px,py-(i===0?10:10));
      });

      // Punto λx₁+(1-λ)x₂ en el eje x
      const pxMid=cx+xMid*sc;
      ctx.strokeStyle=SLATE+"55"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
      ctx.beginPath();ctx.moveTo(pxMid,cy);ctx.lineTo(pxMid,cy-Math.max(yMid_curva,yMid_cuerda)*sc-10);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle=SLATE; ctx.font="9px monospace"; ctx.textAlign="center";
      ctx.fillText(`λx₁+(1-λ)x₂`, pxMid, cy+13);

      // Punto sobre la CURVA: f(λx₁+(1-λ)x₂)
      const pyC=cy-yMid_curva*sc;
      ctx.shadowColor=fn.color; ctx.shadowBlur=10;
      ctx.fillStyle=fn.color;
      ctx.beginPath();ctx.arc(pxMid,pyC,7,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
      ctx.fillStyle=fn.color; ctx.font="bold 10px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`f(λx₁+(1-λ)x₂)=${yMid_curva.toFixed(3)}`, pxMid+9, pyC+(isConvexa?-6:14));

      // Punto sobre la CUERDA: λf(x₁)+(1-λ)f(x₂)
      const pyL=cy-yMid_cuerda*sc;
      ctx.shadowColor=YELLOW; ctx.shadowBlur=8;
      ctx.fillStyle=YELLOW;
      ctx.beginPath();ctx.arc(pxMid,pyL,6,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
      ctx.fillStyle=YELLOW; ctx.font="bold 10px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`λf(x₁)+(1-λ)f(x₂)=${yMid_cuerda.toFixed(3)}`, pxMid+9, pyL+(isConvexa?14:-6));

      // Flecha de desigualdad
      const gap=Math.abs(yMid_cuerda-yMid_curva)*sc;
      if(gap>4){
        ctx.strokeStyle=RED+"88"; ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(pxMid-12,pyC);ctx.lineTo(pxMid-12,pyL);ctx.stroke();
        ctx.fillStyle=RED; ctx.font="9px sans-serif"; ctx.textAlign="right";
        ctx.fillText(isConvexa?"≤":"≥", pxMid-14, (pyC+pyL)/2+4);
      }

      // Panel
      const panelColor = fn.type==="convexa"?GREEN:fn.type==="cóncava"?ORANGE:SLATE;
      ctx.fillStyle="#0f172a"; ctx.fillRect(16,16,210,60);
      ctx.strokeStyle=panelColor+"55"; ctx.lineWidth=1; ctx.strokeRect(16,16,210,60);
      ctx.fillStyle=fn.color; ctx.font="bold 12px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`f(x) = ${fn.name}`, 26, 34);
      ctx.fillStyle=panelColor; ctx.font="bold 10px sans-serif";
      ctx.fillText(`Tipo: ${fn.type.toUpperCase()}`, 26, 50);
      ctx.fillStyle="#94a3b8"; ctx.font="9px monospace";
      ctx.fillText(`f''(x) ${fn.type==="convexa"?"≥ 0":fn.type==="cóncava"?"≤ 0":"cambia signo"}`, 26, 66);

      ctx.fillStyle=YELLOW+"cc"; ctx.font="10px sans-serif"; ctx.textAlign="center";
      ctx.fillText("— cuerda entre (x₁,f(x₁)) y (x₂,f(x₂))", W/2, H-12);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 1 — Jensen con distribución y epígrafo
    // ══════════════════════════════════════════════════════════════════════
    if(mode===1){
      // Izquierda: curva + Jensen visual
      // Derecha: distribución de X y flecha Jensen
      const cx=230, cy=H/2+20, sc=44;
      const xMin=-(cx-35)/sc, xMax=(W/2-25-cx+cx)/sc;
      const xMinP=-3.5, xMaxP=3.5;

      drawGrid(ctx,cx,cy,sc);
      ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(30,cy);ctx.lineTo(cx*2-20,cy);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx,20);ctx.lineTo(cx,H-20);ctx.stroke();

      const fn2 = FNS[fnIdx];
      plotCurve(ctx,fn2.f,xMinP,xMaxP,cx,cy,sc,fn2.color,2.5);

      // Distribución: mezcla de 3 masas (discretas)
      const pts=[{x:-2,w:0.3},{x:0.5,w:0.4},{x:2.2,w:0.3}];
      const Ex=pts.reduce((s,p)=>s+p.w*p.x,0);
      const EfX=pts.reduce((s,p)=>s+p.w*fn2.f(p.x),0);
      const fEx=fn2.f(Ex);

      // Puntos de la distribución sobre la curva
      pts.forEach(({x,w}) => {
        const px=cx+x*sc, py=cy-fn2.f(x)*sc;
        ctx.strokeStyle=PURPLE+"66"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
        ctx.beginPath();ctx.moveTo(px,cy);ctx.lineTo(px,py);ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle=PURPLE;
        ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=PURPLE; ctx.font="9px monospace"; ctx.textAlign="center";
        ctx.fillText(`w=${w}`,px,py-10);
      });

      // Cuerda ponderada (E[f(X)])
      const pyEfX=cy-EfX*sc;
      ctx.strokeStyle=YELLOW; ctx.lineWidth=2;
      pts.forEach(({x}) => {
        const px=cx+x*sc, py=cy-fn2.f(x)*sc;
        ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(cx+Ex*sc,pyEfX);ctx.stroke();
      });

      // E[X] sobre eje x y f(E[X]) sobre curva
      const pxEx=cx+Ex*sc;
      const pyfEx=cy-fEx*sc;
      ctx.shadowColor=GREEN; ctx.shadowBlur=10;
      ctx.fillStyle=GREEN;
      ctx.beginPath();ctx.arc(pxEx,pyfEx,7,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
      ctx.fillStyle=GREEN; ctx.font="bold 9px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`f(E[X])=${fEx.toFixed(3)}`,pxEx+8,pyfEx-4);

      // E[f(X)] punto en el eje y
      ctx.shadowColor=YELLOW; ctx.shadowBlur=8;
      ctx.fillStyle=YELLOW;
      ctx.beginPath();ctx.arc(pxEx,pyEfX,6,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
      ctx.fillStyle=YELLOW; ctx.font="bold 9px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`E[f(X)]=${EfX.toFixed(3)}`,pxEx+8,pyEfX+14);

      // Flecha Jensen
      if(Math.abs(EfX-fEx)*sc>6){
        ctx.strokeStyle=RED+"88"; ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(pxEx-14,pyfEx);ctx.lineTo(pxEx-14,pyEfX);ctx.stroke();
        ctx.fillStyle=RED; ctx.font="bold 9px sans-serif"; ctx.textAlign="right";
        ctx.fillText(fn2.type==="convexa"?"f(E[X])≤E[f(X)]":"f(E[X])≥E[f(X)]",pxEx-16,(pyfEx+pyEfX)/2+4);
      }

      // Panel derecho: explicación Jensen
      const ox2=W/2+10;
      ctx.fillStyle="#0f172a"; ctx.fillRect(ox2,16,W-ox2-16,H-32);
      ctx.strokeStyle=fn2.color+"44"; ctx.lineWidth=1; ctx.strokeRect(ox2,16,W-ox2-16,H-32);
      ctx.fillStyle=fn2.color; ctx.font="bold 12px sans-serif"; ctx.textAlign="left";
      ctx.fillText("Desigualdad de Jensen", ox2+12, 38);
      ctx.fillStyle="#94a3b8"; ctx.font="10px monospace";
      ctx.fillText(`f(x) = ${fn2.name}   [${fn2.type}]`, ox2+12, 56);
      ctx.fillStyle="#64748b"; ctx.font="10px sans-serif";
      [
        `Masas: x₁=-2 (w=0.3), x₂=0.5 (w=0.4),`,
        `       x₃=2.2 (w=0.3)`,
        `E[X]  = ${Ex.toFixed(4)}`,
        `f(E[X])= ${fEx.toFixed(4)}   ← punto verde`,
        `E[f(X)]= ${EfX.toFixed(4)}   ← punto amarillo`,
        ``,
        fn2.type==="convexa"
          ? `f convexa → f(E[X]) ≤ E[f(X)] ✓`
          : fn2.type==="cóncava"
          ? `f cóncava → f(E[X]) ≥ E[f(X)] ✓`
          : `Ni convexa ni cóncava → sin garantía`,
        ``,
        `Aplicaciones:`,
        `  KL ≥ 0  (f=-log, convexa)`,
        `  ELBO ≤ log p(x)`,
        `  Media geom ≤ Media arit`,
      ].forEach((line,i)=>{
        ctx.fillStyle=line.includes("✓")?GREEN:line.includes("Aplic")?YELLOW:"#64748b";
        ctx.fillText(line, ox2+12, 74+i*17);
      });
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 2 — Convergencia GD según convexidad y κ
    // ══════════════════════════════════════════════════════════════════════
    if(mode===2){
      const mu=1, L=kappa;
      const lr=1/L;
      const rate=1-mu/L;

      // Simula trayectoria GD sobre f(x) = L/2·x² (fuertemente convexa, κ=L/μ)
      const fVal = x=>L/2*x*x;
      const grad  = x=>L*x;
      const x0=4.0;
      const nIter=80;

      let x=x0, traj=[{t:0,x,f:fVal(x)}];
      for(let t=1;t<=nIter;t++){
        x=x-lr*grad(x);
        traj.push({t,x,f:fVal(x)});
      }

      // Plot en escala log
      const ox=60, oy=20, pw=W-ox-30, ph=H-oy-70;

      // Eje
      ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox,oy+ph);ctx.lineTo(ox+pw,oy+ph);ctx.stroke();

      // Etiquetas eje X
      ctx.fillStyle=SLATE; ctx.font="10px monospace"; ctx.textAlign="center";
      [0,20,40,60,80].forEach(t=>{
        const px=ox+t/nIter*pw;
        ctx.fillText(t,px,oy+ph+14);
        ctx.strokeStyle="#1e293b"; ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(px,oy+ph);ctx.lineTo(px,oy+ph+4);ctx.stroke();
      });
      ctx.fillText("Iteraciones", ox+pw/2, oy+ph+30);

      // Eje Y (log scale)
      const fMax=fVal(x0), fMin=1e-8;
      const logMax=Math.log10(fMax), logMin=Math.log10(fMin);
      const toY=v=>{
        const lv=Math.log10(Math.max(v,fMin));
        return oy+ph-(lv-logMin)/(logMax-logMin)*ph;
      };

      ctx.fillStyle=SLATE; ctx.font="10px monospace"; ctx.textAlign="right";
      for(let p=Math.floor(logMin);p<=Math.ceil(logMax);p++){
        const py=toY(Math.pow(10,p));
        if(py<oy||py>oy+ph) continue;
        ctx.fillText(`10^${p}`,ox-4,py+4);
        ctx.strokeStyle="#1e293b"; ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(ox-3,py);ctx.lineTo(ox,py);ctx.stroke();
        ctx.strokeStyle="#0f1f35"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
        ctx.beginPath();ctx.moveTo(ox,py);ctx.lineTo(ox+pw,py);ctx.stroke();
        ctx.setLineDash([]);
      }

      // Curva de convergencia
      ctx.strokeStyle=BLUE; ctx.lineWidth=2.5;
      ctx.beginPath(); let first=true;
      traj.forEach(({t,f})=>{
        if(f<fMin){first=true;return;}
        const px=ox+t/nIter*pw, py=toY(f);
        if(py<oy||py>oy+ph){first=true;return;}
        first?ctx.moveTo(px,py):ctx.lineTo(px,py); first=false;
      });
      ctx.stroke();

      // Curva teórica: f(t) = f0·(1-μ/L)^t
      ctx.strokeStyle=GREEN+"88"; ctx.lineWidth=1.5; ctx.setLineDash([5,4]);
      ctx.beginPath(); first=true;
      for(let t=0;t<=nIter;t++){
        const fTh=fVal(x0)*Math.pow(Math.max(0,rate),t);
        if(fTh<fMin){first=true;continue;}
        const px=ox+t/nIter*pw, py=toY(fTh);
        if(py<oy||py>oy+ph){first=true;continue;}
        first?ctx.moveTo(px,py):ctx.lineTo(px,py); first=false;
      }
      ctx.stroke(); ctx.setLineDash([]);

      // Panel info
      ctx.fillStyle="#0f172a"; ctx.fillRect(ox+pw-230,oy+4,225,100);
      ctx.strokeStyle=BLUE+"44"; ctx.lineWidth=1; ctx.strokeRect(ox+pw-230,oy+4,225,100);
      ctx.fillStyle="#e2e8f0"; ctx.font="bold 11px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`f(x) = L/2·x²   (fuertemente convexa)`, ox+pw-222, oy+22);
      ctx.fillStyle="#94a3b8"; ctx.font="10px monospace";
      ctx.fillText(`μ = ${mu},   L = ${L},   κ = L/μ = ${kappa}`, ox+pw-222, oy+38);
      ctx.fillText(`lr = 1/L = ${lr.toFixed(4)}`, ox+pw-222, oy+54);
      ctx.fillStyle=GREEN;
      ctx.fillText(`tasa = (1-μ/L) = ${rate.toFixed(4)}`, ox+pw-222, oy+70);
      const iter01=Math.ceil(Math.log(0.01)/Math.log(Math.max(rate,1e-12)));
      ctx.fillStyle=YELLOW;
      ctx.fillText(`iters hasta f<1% f₀: ~${iter01}`, ox+pw-222, oy+86);
      ctx.fillStyle=BLUE; ctx.font="10px sans-serif";
      ctx.fillText("— empírico", ox+pw-222, oy+102);
      ctx.fillStyle=GREEN+"88";
      ctx.fillText("- - teórico f₀·(1-μ/L)ᵗ", ox+pw-110, oy+102);

      ctx.fillStyle=SLATE; ctx.font="10px sans-serif"; ctx.textAlign="center";
      ctx.fillText("κ grande → convergencia lenta  |  κ=1 (óptimo) → convergencia en 1 paso", W/2, H-14);
    }

  }, [mode, fnIdx, lambda, kappa]);

  const btnStyle = (active) => ({
    flex:1, padding:"5px 0", borderRadius:6, fontSize:11, cursor:"pointer",
    border: active?"1.5px solid #60a5fa":"1.5px solid #1e293b",
    background: active?"#1e3a5f":"#0f172a",
    color: active?"#60a5fa":"#475569",
    transition:"all .2s",
  });

  const fnBtnStyle = (active, color) => ({
    flex:1, padding:"4px 0", borderRadius:5, fontSize:10, cursor:"pointer",
    border: active?`1.5px solid ${color}`:"1.5px solid #1e293b",
    background: active?color+"22":"#0f172a",
    color: active?color:"#475569",
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
          {FNS.map((fn,i)=>(
            <button key={i} onClick={()=>setFnIdx(i)} style={fnBtnStyle(fnIdx===i,fn.color)}>
              {fn.name}
            </button>
          ))}
        </div>
      )}

      {mode===0 && (
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569",fontSize:11,minWidth:90}}>λ = {lambda.toFixed(2)}</span>
          <input type="range" min={0.05} max={0.95} step={0.01} value={lambda}
            onChange={e=>setLambda(Number(e.target.value))}
            style={{flex:1, accentColor:"#60a5fa"}}/>
          <span style={{color:"#475569",fontSize:10,minWidth:70,textAlign:"right"}}>
            1-λ={( 1-lambda).toFixed(2)}
          </span>
        </div>
      )}

      {mode===2 && (
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569",fontSize:11,minWidth:110}}>κ = L/μ = {kappa}</span>
          <input type="range" min={1} max={100} step={1} value={kappa}
            onChange={e=>setKappa(Number(e.target.value))}
            style={{flex:1, accentColor:"#60a5fa"}}/>
          <span style={{color:"#64748b",fontSize:10,minWidth:80,textAlign:"right"}}>
            tasa={(1-1/kappa).toFixed(3)}
          </span>
        </div>
      )}
    </div>
  );
}
