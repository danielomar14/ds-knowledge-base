import React, { useRef, useState, useEffect } from "react";

export default function FuncionLinealNoLinealViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]     = useState(0); // 0=superposición, 1=XOR, 2=regiones
  const [fnIdx, setFnIdx]   = useState(0); // función para modo 0
  const [alpha, setAlpha]   = useState(0.6);
  const [nHidden, setNHidden] = useState(4); // neuronas ocultas modo 2

  const W = 680, H = 370;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const MODES = ["Principio de Superposición", "XOR: lineal vs. ReLU", "Regiones Lineales"];

  const FNS = [
    { name: "f(x)=2x  (lineal)",    f: x=>2*x,          lineal:true,  color:BLUE   },
    { name: "g(x)=Ax+b (afín)",     f: x=>2*x+1.5,      lineal:false, color:GREEN  },
    { name: "h(x)=x²  (no lineal)", f: x=>x*x,          lineal:false, color:YELLOW },
    { name: "ReLU(x)  (no lineal)", f: x=>Math.max(0,x),lineal:false, color:ORANGE },
    { name: "tanh(x)  (no lineal)", f: x=>Math.tanh(x), lineal:false, color:PURPLE },
  ];

  // ── RNG ligera ───────────────────────────────────────────────────────────
  const lcg = (seed) => {
    let s = seed|0;
    return () => { s=(s*1664525+1013904223)|0; return ((s>>>0)/0xffffffff)*2-1; };
  };

  // ── Red ReLU 2→H→1 para XOR ─────────────────────────────────────────────
  const relu = x => Math.max(0, x);

  // Hard-coded para XOR (funciona perfectamente)
  const redRelu = (x1, x2) => {
    const h1 = relu( x1 + x2);
    const h2 = relu( x1 + x2 - 1);
    return h1 - 2*h2;
  };

  // Regresión lineal 2D → 1D para XOR
  const linPred = (x1, x2) => {
    // solución LS: w^T x + b con X=XOR data
    // w = [0,0], b = 0.5  (mejor que se puede hacer)
    return 0.5;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);

    // ── Helpers ─────────────────────────────────────────────────────────────
    const drawGrid = (cx,cy,sc) => {
      ctx.strokeStyle="#0f1f35"; ctx.lineWidth=1;
      for(let x=cx%sc;x<W;x+=sc){ctx.beginPath();ctx.moveTo(x,16);ctx.lineTo(x,H-16);ctx.stroke();}
      for(let y=cy%sc;y<H;y+=sc){ctx.beginPath();ctx.moveTo(30,y);ctx.lineTo(W-16,y);ctx.stroke();}
    };

    const drawAxes = (cx,cy,sc,xMin,xMax) => {
      ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(30,cy);ctx.lineTo(W-16,cy);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx,16);ctx.lineTo(cx,H-16);ctx.stroke();
      ctx.fillStyle=SLATE; ctx.font="10px monospace";
      for(let v=Math.ceil(xMin);v<=Math.floor(xMax);v++){
        if(!v) continue;
        const px=cx+v*sc, py=cy-v*sc;
        ctx.textAlign="center"; if(px>35&&px<W-10) ctx.fillText(v,px,cy+13);
        ctx.textAlign="right";  if(py>20&&py<H-16) ctx.fillText(v,cx-4,py+4);
      }
    };

    const plotCurve = (f,xMin,xMax,cx,cy,sc,color,lw=2,dash=[]) => {
      const N=500;
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

    // ════════════════════════════════════════════════════════════════════════
    // MODO 0 — Principio de Superposición
    // ════════════════════════════════════════════════════════════════════════
    if (mode === 0) {
      const cx=W/2, cy=H/2+10, sc=52;
      const xMin=-(W/2-35)/sc, xMax=(W/2-20)/sc;
      drawGrid(cx,cy,sc);
      drawAxes(cx,cy,sc,xMin,xMax);

      const fn = FNS[fnIdx];
      const beta = 1-alpha;

      // Dos puntos x1, x2
      const x1=-1.5, x2=1.0;
      const y1=fn.f(x1), y2=fn.f(x2);
      const xComb = alpha*x1 + beta*x2;

      // Curva
      plotCurve(fn.f, xMin, xMax, cx, cy, sc, fn.color, 2.5);

      // Identidad (referencia)
      plotCurve(x=>x, xMin, xMax, cx, cy, sc, SLATE+"33", 1, [4,5]);

      // f(αx₁ + βx₂) — punto real sobre la curva
      const yReal = fn.f(xComb);
      const yComb_lineal = alpha*y1 + beta*y2;

      // Dibujar x1, x2 sobre el eje
      [x1,x2].forEach((x,i) => {
        const px=cx+x*sc;
        ctx.strokeStyle=SLATE+"66"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
        ctx.beginPath();ctx.moveTo(px,cy);ctx.lineTo(px,cy-fn.f(x)*sc);ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle=SLATE; ctx.font="10px monospace"; ctx.textAlign="center";
        ctx.fillText(i===0?"x₁":"x₂", px, cy+13);
      });

      // αx₁+βx₂ sobre eje x
      const pxComb=cx+xComb*sc;
      ctx.strokeStyle=YELLOW+"88"; ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(pxComb,cy);ctx.lineTo(pxComb,cy-yReal*sc);ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle=YELLOW; ctx.font="10px monospace"; ctx.textAlign="center";
      ctx.fillText("αx₁+βx₂", pxComb, cy+13);

      // Punto f(αx₁+βx₂) — sobre la curva
      ctx.shadowColor=fn.color; ctx.shadowBlur=10;
      ctx.fillStyle=fn.color;
      ctx.beginPath();ctx.arc(pxComb, cy-yReal*sc, 6, 0, Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
      ctx.fillStyle=fn.color; ctx.font="bold 10px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`f(αx₁+βx₂)=${yReal.toFixed(3)}`, pxComb+8, cy-yReal*sc-4);

      // Punto αf(x₁)+βf(x₂) — combinación lineal de valores
      ctx.shadowColor=GREEN; ctx.shadowBlur=8;
      ctx.fillStyle=GREEN;
      ctx.beginPath();ctx.arc(pxComb, cy-yComb_lineal*sc, 5, 0, Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
      ctx.fillStyle=GREEN; ctx.font="bold 10px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`αf(x₁)+βf(x₂)=${yComb_lineal.toFixed(3)}`, pxComb+8, cy-yComb_lineal*sc+14);

      // Línea de error si no lineal
      if(!fn.lineal) {
        ctx.strokeStyle=RED+"88"; ctx.lineWidth=1.5;
        ctx.beginPath();
        ctx.moveTo(pxComb, cy-yReal*sc);
        ctx.lineTo(pxComb, cy-yComb_lineal*sc);
        ctx.stroke();
        ctx.fillStyle=RED; ctx.font="bold 10px sans-serif";ctx.textAlign="left";
        ctx.fillText(`⚠ error=${Math.abs(yReal-yComb_lineal).toFixed(3)}`, pxComb+8,
          cy-(yReal+yComb_lineal)/2*sc);
      }

      // Panel info
      ctx.fillStyle="#0f172a"; ctx.fillRect(16,16,220,58);
      ctx.strokeStyle=(fn.lineal?GREEN:RED)+"55"; ctx.lineWidth=1;
      ctx.strokeRect(16,16,220,58);
      ctx.fillStyle=fn.color; ctx.font="bold 11px sans-serif"; ctx.textAlign="left";
      ctx.fillText(fn.name, 26, 34);
      ctx.fillStyle=fn.lineal?GREEN:RED; ctx.font="bold 11px sans-serif";
      ctx.fillText(fn.lineal?"✓ LINEAL (superposición ✓)":"✗ NO LINEAL (superposición falla)", 26, 52);
      ctx.fillStyle=SLATE; ctx.font="10px sans-serif";
      ctx.fillText(`α=${alpha.toFixed(2)}, β=${beta.toFixed(2)}`, 26, 68);

      ctx.fillStyle=fn.color+"cc"; ctx.font="10px sans-serif"; ctx.textAlign="center";
      ctx.fillText("● f(αx₁+βx₂)", W/2-60, H-12);
      ctx.fillStyle=GREEN+"cc";
      ctx.fillText("● αf(x₁)+βf(x₂)", W/2+70, H-12);
    }

    // ════════════════════════════════════════════════════════════════════════
    // MODO 1 — XOR: lineal vs ReLU
    // ════════════════════════════════════════════════════════════════════════
    if (mode === 1) {
      // Split: izquierda=lineal, derecha=ReLU
      const SPLIT = W/2-5;
      const sc = 130, ox = SPLIT/2, oy = H/2;
      const sc2 = 130, ox2 = SPLIT+SPLIT/2, oy2 = H/2;

      const drawPanel = (cx, cy, title, predFn, isLineal) => {
        // Fondo región
        const res = 80;
        for(let i=0;i<res;i++) for(let j=0;j<res;j++) {
          const x1=(-0.5+i/res*2), x2=(-0.5+j/res*2);
          const p = predFn(x1,x2);
          const v = Math.max(0,Math.min(1,(p+0.2)/1.4));
          const r=Math.round(v*96+(1-v)*14);
          const g=Math.round(v*165+(1-v)*22);
          const bl=Math.round(v*250+(1-v)*42);
          ctx.fillStyle=`rgba(${r},${g},${bl},0.35)`;
          const px=cx+(x1-0)*sc, py=cy-(x2-0)*sc;
          ctx.fillRect(px, py, sc/res+1, sc/res+1);
        }

        // Divisor
        ctx.strokeStyle=SLATE+"33"; ctx.lineWidth=1;
        if(cx===ox) {
          ctx.beginPath();ctx.moveTo(SPLIT,16);ctx.lineTo(SPLIT,H-16);ctx.stroke();
        }

        // Puntos XOR
        const pts = [[0,0,0],[0,1,1],[1,0,1],[1,1,0]];
        pts.forEach(([x1p,x2p,label]) => {
          const px=cx+(x1p-0.5)*sc*1.8, py=cy-(x2p-0.5)*sc*1.8;
          ctx.shadowColor=label?GREEN:RED; ctx.shadowBlur=8;
          ctx.fillStyle=label?GREEN:RED;
          ctx.beginPath();ctx.arc(px,py,9,0,Math.PI*2);ctx.fill();
          ctx.shadowBlur=0;
          ctx.fillStyle="#0b1220"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
          ctx.fillText(label?"1":"0",px,py+4);
        });

        // Título
        ctx.fillStyle="#e2e8f0"; ctx.font="bold 12px sans-serif"; ctx.textAlign="center";
        ctx.fillText(title, cx, 26);
        ctx.fillStyle=isLineal?RED+"cc":GREEN+"cc"; ctx.font="11px sans-serif";
        ctx.fillText(isLineal?"✗ No separa XOR":"✓ Separa XOR correctamente", cx, 44);

        // Axes
        ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(cx-sc*1.1,cy);ctx.lineTo(cx+sc*1.1,cy);ctx.stroke();
        ctx.beginPath();ctx.moveTo(cx,cy-sc*1.1);ctx.lineTo(cx,cy+sc*1.1);ctx.stroke();
        ctx.fillStyle=SLATE; ctx.font="9px monospace";
        ctx.textAlign="center"; ctx.fillText("x₁",cx+sc*1.1+10,cy+4);
        ctx.textAlign="left";   ctx.fillText("x₂",cx+4,cy-sc*1.1-4);
      };

      drawPanel(ox, oy, "Clasificador LINEAL", linPred, true);
      drawPanel(ox2, oy2, "Red ReLU (2→2→1)", redRelu, false);

      // Leyenda global
      ctx.fillStyle=GREEN; ctx.font="11px sans-serif"; ctx.textAlign="left";
      ctx.fillText("● clase 1  (XOR=1)", 16, H-28);
      ctx.fillStyle=RED;
      ctx.fillText("● clase 0  (XOR=0)", 16, H-12);
      ctx.fillStyle=SLATE; ctx.textAlign="right";
      ctx.fillText("Fondo = predicción del modelo", W-16, H-12);
    }

    // ════════════════════════════════════════════════════════════════════════
    // MODO 2 — Regiones lineales de una red ReLU
    // ════════════════════════════════════════════════════════════════════════
    if (mode === 2) {
      const cx=W/2, cy=H/2+10, sc=50;
      const xMin=-(W/2-35)/sc, xMax=(W/2-20)/sc;
      drawGrid(cx,cy,sc);
      drawAxes(ctx,cx,cy,sc,xMin,xMax);

      // Genera red aleatoria reproducible
      const H_n = nHidden;
      const rng = lcg(H_n*17+3);
      const w1=Array.from({length:H_n},()=>rng()*3);
      const b1=Array.from({length:H_n},()=>rng()*2);
      const w2=Array.from({length:H_n},()=>rng()*2);
      const b2=rng();

      const red1d = x => {
        let acc=b2;
        for(let k=0;k<H_n;k++) acc+=w2[k]*Math.max(0,w1[k]*x+b1[k]);
        return acc;
      };

      // Puntos de quiebre (kinks) donde cambia la pendiente = -b1[k]/w1[k]
      const kinks = w1.map((w,k) => w!==0 ? -b1[k]/w : null)
        .filter(v=>v!==null&&isFinite(v)&&v>xMin&&v<xMax)
        .sort((a,b)=>a-b);

      // Rellena regiones con colores alternados
      const regBoundaries = [xMin, ...kinks, xMax];
      regBoundaries.forEach((_,i) => {
        if(i===regBoundaries.length-1) return;
        const lo=regBoundaries[i], hi=regBoundaries[i+1];
        const col=i%2===0?BLUE+"18":PURPLE+"18";
        const pxLo=cx+lo*sc, pxHi=cx+hi*sc;
        ctx.fillStyle=col;
        ctx.fillRect(pxLo,16,pxHi-pxLo,H-32);
      });

      // Puntos de quiebre
      kinks.forEach(k => {
        const px=cx+k*sc, py=cy-red1d(k)*sc;
        ctx.strokeStyle=YELLOW+"55"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
        ctx.beginPath();ctx.moveTo(px,16);ctx.lineTo(px,H-16);ctx.stroke();
        ctx.setLineDash([]);
        if(py>14&&py<H-14) {
          ctx.fillStyle=YELLOW+"aa";
          ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fill();
        }
      });

      // Curva de la red
      plotCurve(red1d, xMin, xMax, cx, cy, sc, ORANGE, 2.5);

      // Tangentes en cada región (muestra la linealidad local)
      kinks.forEach((k,i) => {
        if(i>=kinks.length-1) return;
        const xMid=(kinks[i]+kinks[i+1])/2;
        const eps=1e-4;
        const slope=(red1d(xMid+eps)-red1d(xMid-eps))/(2*eps);
        const yMid=red1d(xMid);
        const dx=Math.min((kinks[i+1]-kinks[i])*0.4, 0.6);
        ctx.strokeStyle=GREEN+"44"; ctx.lineWidth=1; ctx.setLineDash([2,3]);
        ctx.beginPath();
        ctx.moveTo(cx+(xMid-dx)*sc, cy-(yMid-slope*dx)*sc);
        ctx.lineTo(cx+(xMid+dx)*sc, cy-(yMid+slope*dx)*sc);
        ctx.stroke(); ctx.setLineDash([]);
      });

      // Panel info
      ctx.fillStyle="#0f172a"; ctx.fillRect(16,16,220,56);
      ctx.strokeStyle=ORANGE+"55"; ctx.lineWidth=1; ctx.strokeRect(16,16,220,56);
      ctx.fillStyle=ORANGE; ctx.font="bold 12px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`Red ReLU 1→${H_n}→1`, 26, 34);
      ctx.fillStyle="#94a3b8"; ctx.font="10px monospace";
      ctx.fillText(`Regiones lineales: ${kinks.length+1}`, 26, 50);
      ctx.fillText(`Puntos de quiebre: ${kinks.length}`, 26, 64);

      ctx.fillStyle=BLUE+"88"; ctx.font="10px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Cada región coloreada = zona donde f(x) es lineal", W/2, H-28);
      ctx.fillStyle=YELLOW+"88";
      ctx.fillText("● puntos de quiebre (kinks) donde cambia la pendiente", W/2, H-12);
    }

  }, [mode, fnIdx, alpha, nHidden]);

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

      {mode===0 && (
        <>
          <div className="viz-ctrl" style={{marginTop:6, gap:4}}>
            {FNS.map((fn,i)=>(
              <button key={i} onClick={()=>setFnIdx(i)}
                style={fnBtnStyle(fnIdx===i, fn.color)}>
                {fn.name.split(" ")[0]}
              </button>
            ))}
          </div>
          <div className="viz-ctrl" style={{marginTop:6}}>
            <span style={{color:"#475569", fontSize:11, minWidth:90}}>α = {alpha.toFixed(2)}</span>
            <input type="range" min={0} max={1} step={0.01} value={alpha}
              onChange={e=>setAlpha(Number(e.target.value))}
              style={{flex:1, accentColor:"#60a5fa"}}/>
            <span style={{color:"#475569", fontSize:10, minWidth:70, textAlign:"right"}}>
              β={( 1-alpha).toFixed(2)}
            </span>
          </div>
        </>
      )}

      {mode===2 && (
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569", fontSize:11, minWidth:110}}>
            Neuronas H = {nHidden}
          </span>
          <input type="range" min={1} max={20} step={1} value={nHidden}
            onChange={e=>setNHidden(Number(e.target.value))}
            style={{flex:1, accentColor:"#60a5fa"}}/>
        </div>
      )}
    </div>
  );
}
