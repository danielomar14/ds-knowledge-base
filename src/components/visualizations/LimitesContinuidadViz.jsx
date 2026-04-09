import React, { useRef, useState, useEffect } from "react";

export default function LimitesContinuidadViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]     = useState(0); // 0=ε-δ, 1=discontinuidades, 2=Lipschitz
  const [fnIdx, setFnIdx]   = useState(0);
  const [epsilon, setEpsilon] = useState(0.4);
  const [x0, setX0]           = useState(0.0);

  const W = 680, H = 370;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const MODES = ["Definición ε-δ", "Tipos de Discontinuidad", "Lipschitz & Gradiente"];

  // ── Funciones para cada modo ──────────────────────────────────────────────
  const FNS_ED = [
    { name: "3x−1", f: x=>3*x-1, L: x=>3*x-1, x0def:2.0, Ldef:5.0, cont:true, color:BLUE,
      lipK: 3 },
    { name: "sin(x)/x", f: x=>x!==0?Math.sin(x)/x:1, L: _=>1, x0def:0.0, Ldef:1.0, cont:true,
      color:GREEN, lipK:1 },
    { name: "(x²−1)/(x−1)", f: x=>Math.abs(x-1)>1e-10?(x*x-1)/(x-1):2, L: _=>2,
      x0def:1.0, Ldef:2.0, cont:true, color:YELLOW, lipK:4 },
    { name: "sign(x)", f: x=>x>0?1:x<0?-1:0, L: _=>0, x0def:0.0, Ldef:0.0, cont:false,
      color:ORANGE, lipK:Infinity },
    { name: "floor(x)", f: x=>Math.floor(x), L: _=>0, x0def:1.0, Ldef:1.0, cont:false,
      color:RED, lipK:Infinity },
  ];

  const DISC_FNS = [
    { name: "Continua: x²", f: x=>x*x, disc:false, tipo:"continua", color:GREEN },
    { name: "Evitable: sin(x)/x", f: x=>x!==0?Math.sin(x)/x:0.5, disc:true,
      tipo:"evitable", x0:0, color:YELLOW },
    { name: "Salto: ReLU'(x)", f: x=>x>0?1:0, disc:true, tipo:"salto", x0:0, color:ORANGE },
    { name: "Infinita: 1/x", f: x=>Math.abs(x)>0.05?1/x:NaN, disc:true,
      tipo:"infinita", x0:0, color:RED },
    { name: "Esencial: sin(1/x)", f: x=>Math.abs(x)>0.01?Math.sin(1/x):NaN,
      disc:true, tipo:"esencial", x0:0, color:PURPLE },
  ];

  const LIPS_FNS = [
    { name: "sigmoid", f: x=>1/(1+Math.exp(-x)), df: x=>{const s=1/(1+Math.exp(-x));return s*(1-s);},
      color:BLUE, L_teo:0.25 },
    { name: "tanh", f: x=>Math.tanh(x), df: x=>1-Math.tanh(x)**2,
      color:GREEN, L_teo:1.0 },
    { name: "ReLU", f: x=>Math.max(0,x), df: x=>x>0?1:0,
      color:ORANGE, L_teo:1.0 },
    { name: "GELU", f: x=>x*0.5*(1+Math.tanh(0.7978*(x+0.044715*x**3))),
      df: x=>{const t=Math.tanh(0.7978*(x+0.044715*x**3));
              return 0.5*(1+t)+0.5*x*(1-t*t)*0.7978*(1+3*0.044715*x**2);},
      color:PURPLE, L_teo:1.1 },
    { name: "SiLU", f: x=>x/(1+Math.exp(-x)),
      df: x=>{const s=1/(1+Math.exp(-x));return s+x*s*(1-s);},
      color:YELLOW, L_teo:1.1 },
  ];

  // ── Canvas helpers ────────────────────────────────────────────────────────
  const drawGrid = (ctx,cx,cy,sc) => {
    ctx.strokeStyle="#0f1f35"; ctx.lineWidth=1;
    for(let x=cx%sc;x<W;x+=sc){ctx.beginPath();ctx.moveTo(x,14);ctx.lineTo(x,H-14);ctx.stroke();}
    for(let y=cy%sc;y<H;y+=sc){ctx.beginPath();ctx.moveTo(28,y);ctx.lineTo(W-14,y);ctx.stroke();}
  };

  const drawAxes = (ctx,cx,cy,sc,xMin,xMax) => {
    ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(28,cy);ctx.lineTo(W-14,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,14);ctx.lineTo(cx,H-14);ctx.stroke();
    ctx.fillStyle=SLATE; ctx.font="10px monospace";
    for(let v=Math.ceil(xMin);v<=Math.floor(xMax);v++){
      if(!v) continue;
      const px=cx+v*sc, py=cy-v*sc;
      ctx.textAlign="center"; if(px>32&&px<W-10) ctx.fillText(v,px,cy+13);
      ctx.textAlign="right";  if(py>18&&py<H-14) ctx.fillText(v,cx-4,py+4);
    }
  };

  const plotCurve = (ctx,f,xMin,xMax,cx,cy,sc,color,lw=2.5,dash=[]) => {
    const N=700;
    ctx.strokeStyle=color; ctx.lineWidth=lw; ctx.setLineDash(dash);
    ctx.beginPath(); let first=true, prevY=null;
    for(let i=0;i<=N;i++){
      const x=xMin+(xMax-xMin)*i/N;
      let y; try{ y=f(x); }catch(e){ first=true; prevY=null; continue; }
      if(!isFinite(y)||isNaN(y)){first=true;prevY=null;continue;}
      if(prevY!==null&&Math.abs(y-prevY)*sc>H*0.8){first=true;}
      const px=cx+x*sc, py=cy-y*sc;
      if(py<10||py>H-10||px<26||px>W-12){first=true;prevY=null;continue;}
      first?ctx.moveTo(px,py):ctx.lineTo(px,py);
      first=false; prevY=y;
    }
    ctx.stroke(); ctx.setLineDash([]);
  };

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);

    // ══════════════════════════════════════════════════════════════════════
    // MODO 0 — Definición ε-δ interactiva
    // ══════════════════════════════════════════════════════════════════════
    if(mode===0){
      const fn=FNS_ED[fnIdx];
      const cx=W/2, cy=H/2+10, sc=50;
      const xMin=-(W/2-32)/sc, xMax=(W/2-16)/sc;
      drawGrid(ctx,cx,cy,sc);
      drawAxes(ctx,cx,cy,sc,xMin,xMax);

      const x0v=fn.x0def, Lv=fn.Ldef;
      const eps=epsilon;

      // Calcular δ: mayor δ tal que |f(x)-L|<ε para 0<|x-x0|<δ
      // Aproximación: si Lipschitz con K, δ=ε/K
      let delta;
      if(fn.cont){
        if(fn.lipK===Infinity) delta=eps/10;
        else delta=eps/fn.lipK;
        delta=Math.min(delta,1.5);
      } else {
        delta=0.2; // salto: no existe
      }

      // Banda ε alrededor de L (horizontal)
      const pyL=cy-Lv*sc;
      ctx.fillStyle=GREEN+"20";
      ctx.fillRect(28, pyL-eps*sc, W-42, 2*eps*sc);
      ctx.strokeStyle=GREEN+"66"; ctx.lineWidth=1; ctx.setLineDash([4,4]);
      [pyL-eps*sc, pyL+eps*sc].forEach(py=>{
        ctx.beginPath();ctx.moveTo(28,py);ctx.lineTo(W-14,py);ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.fillStyle=GREEN; ctx.font="bold 9px monospace"; ctx.textAlign="right";
      ctx.fillText(`L+ε=${(Lv+eps).toFixed(3)}`, W-16, pyL-eps*sc-4);
      ctx.fillText(`L-ε=${(Lv-eps).toFixed(3)}`, W-16, pyL+eps*sc+12);
      ctx.fillStyle=GREEN+"cc"; ctx.font="bold 10px monospace";
      ctx.fillText(`L=${Lv}`, W-16, pyL+4);

      // Banda δ alrededor de x0 (vertical)
      const pxX0=cx+x0v*sc;
      if(fn.cont){
        ctx.fillStyle=BLUE+"18";
        ctx.fillRect(pxX0-delta*sc, 14, 2*delta*sc, H-28);
        ctx.strokeStyle=BLUE+"66"; ctx.lineWidth=1; ctx.setLineDash([4,4]);
        [pxX0-delta*sc, pxX0+delta*sc].forEach(px=>{
          ctx.beginPath();ctx.moveTo(px,14);ctx.lineTo(px,H-14);ctx.stroke();
        });
        ctx.setLineDash([]);
        ctx.fillStyle=BLUE; ctx.font="bold 9px monospace"; ctx.textAlign="center";
        ctx.fillText(`x₀-δ`, pxX0-delta*sc, H-16);
        ctx.fillText(`x₀+δ`, pxX0+delta*sc, H-16);
        ctx.fillText(`δ≈${delta.toFixed(4)}`, pxX0, 22);
      }

      // Curva
      plotCurve(ctx,fn.f,xMin,xMax,cx,cy,sc,fn.color,2.5);

      // Punto (x0, L) — el límite
      ctx.strokeStyle=SLATE+"44"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
      ctx.beginPath();ctx.moveTo(pxX0,cy);ctx.lineTo(pxX0,pyL);ctx.stroke();
      ctx.beginPath();ctx.moveTo(28,pyL);ctx.lineTo(pxX0,pyL);ctx.stroke();
      ctx.setLineDash([]);

      // Círculo hueco en x0 (límite puede no coincidir con f(x0))
      ctx.strokeStyle=fn.color; ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(pxX0,pyL,6,0,Math.PI*2);ctx.stroke();
      ctx.fillStyle=BG; ctx.beginPath();ctx.arc(pxX0,pyL,5,0,Math.PI*2);ctx.fill();

      // Etiquetar x0
      ctx.fillStyle=fn.color; ctx.font="bold 10px monospace"; ctx.textAlign="center";
      ctx.fillText(`x₀=${x0v}`, pxX0, cy+13);

      // Panel info
      ctx.fillStyle="#0f172a"; ctx.fillRect(16,16,220,78);
      ctx.strokeStyle=fn.color+"55"; ctx.lineWidth=1; ctx.strokeRect(16,16,220,78);
      ctx.fillStyle=fn.color; ctx.font="bold 12px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`f(x) = ${fn.name}`, 26, 34);
      ctx.fillStyle="#94a3b8"; ctx.font="10px monospace";
      ctx.fillText(`lim_{x→${x0v}} f(x) = ${Lv}`, 26, 50);
      ctx.fillStyle=fn.cont?GREEN:RED; ctx.font="bold 10px sans-serif";
      ctx.fillText(fn.cont?`✓ Límite existe  |  ε=${eps.toFixed(3)} → δ≈${delta.toFixed(4)}`
                         :`✗ Límite no existe (discontinuidad de salto)`, 26, 66);
      ctx.fillStyle=SLATE; ctx.font="9px sans-serif";
      ctx.fillText(fn.cont?`Lipschitz K≈${fn.lipK} → δ=ε/K`:"Límites laterales distintos", 26, 80);

      // Leyenda bandas
      ctx.fillStyle=GREEN+"88"; ctx.font="10px sans-serif"; ctx.textAlign="center";
      ctx.fillText("■ banda ε (salida)", W/2+60, H-12);
      ctx.fillStyle=BLUE+"88";
      ctx.fillText("■ banda δ (entrada)", W/2-60, H-12);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 1 — Tipos de discontinuidad
    // ══════════════════════════════════════════════════════════════════════
    if(mode===1){
      const cols=DISC_FNS.length;
      const panW=(W-30)/cols, panH=H-20;

      DISC_FNS.forEach(({name,f,disc,tipo,x0:x0d,color},i)=>{
        const ox=15+i*panW, oy=10;
        const cx=ox+panW/2, cy=oy+panH/2+10;
        const sc=panW*0.38;
        const xMin=-2.5, xMax=2.5;

        // Separador
        if(i>0){
          ctx.strokeStyle=SLATE+"22"; ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox,oy+panH);ctx.stroke();
        }

        // Mini-grid
        ctx.strokeStyle="#0f1f35"; ctx.lineWidth=0.5;
        for(let v=-2;v<=2;v++){
          const px=cx+v*sc, py=cy-v*sc;
          if(px>ox+2&&px<ox+panW-2){ctx.beginPath();ctx.moveTo(px,oy);ctx.lineTo(px,oy+panH);ctx.stroke();}
          if(py>oy+2&&py<oy+panH-2){ctx.beginPath();ctx.moveTo(ox,py);ctx.lineTo(ox+panW,py);ctx.stroke();}
        }

        // Ejes mini
        ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(ox+2,cy);ctx.lineTo(ox+panW-2,cy);ctx.stroke();
        ctx.beginPath();ctx.moveTo(cx,oy+2);ctx.lineTo(cx,oy+panH-2);ctx.stroke();

        // Curva
        plotCurve(ctx,f,xMin,xMax,cx,cy,sc,color,2);

        // Punto de discontinuidad
        if(disc&&x0d!==undefined){
          const px=cx+x0d*sc;
          let yL,yR;
          try{ yL=f(x0d-1e-6); }catch(e){ yL=NaN; }
          try{ yR=f(x0d+1e-6); }catch(e){ yR=NaN; }

          if(isFinite(yL)){
            const py=cy-yL*sc;
            if(py>oy+2&&py<oy+panH-2){
              ctx.strokeStyle=color; ctx.lineWidth=1.5;
              ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.stroke();
              ctx.fillStyle=BG;ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill();
            }
          }
          if(isFinite(yR)&&Math.abs(yR-yL)>0.05){
            const py=cy-yR*sc;
            if(py>oy+2&&py<oy+panH-2){
              ctx.strokeStyle=color; ctx.lineWidth=1.5;
              ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.stroke();
              ctx.fillStyle=BG;ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill();
            }
          }
        }

        // Etiqueta tipo
        const tipoColor={continua:GREEN,evitable:YELLOW,salto:ORANGE,infinita:RED,esencial:PURPLE}[tipo]||SLATE;
        ctx.fillStyle="#0f172a";
        ctx.fillRect(ox+2,oy+panH-44,panW-4,40);
        ctx.fillStyle=tipoColor; ctx.font="bold 9px sans-serif"; ctx.textAlign="center";
        ctx.fillText(tipo.toUpperCase(), cx, oy+panH-28);
        ctx.fillStyle="#64748b"; ctx.font="8px sans-serif";
        // Nombre corto
        const shortName=name.split(":")[1]?.trim()||name;
        ctx.fillText(shortName, cx, oy+panH-14);
      });

      // Título
      ctx.fillStyle="#e2e8f0"; ctx.font="bold 12px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Clasificación de discontinuidades", W/2, H-4);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 2 — Lipschitz & derivada acotada
    // ══════════════════════════════════════════════════════════════════════
    if(mode===2){
      // Izquierda: función y su derivada
      // Derecha: constante Lipschitz y lr_max
      const cx=220, cy=H/2+15, sc=38;
      const xMin=-5, xMax=5;

      drawGrid(ctx,cx,cy,sc);
      ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(28,cy);ctx.lineTo(cx*2-20,cy);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx,14);ctx.lineTo(cx,H-14);ctx.stroke();

      const lfn=LIPS_FNS[fnIdx<LIPS_FNS.length?fnIdx:0];

      // Función
      plotCurve(ctx,lfn.f,xMin,xMax,cx,cy,sc,lfn.color,2.5);

      // Derivada (escalada para visualización)
      plotCurve(ctx,lfn.df,xMin,xMax,cx,cy,sc,lfn.color+"66",1.5,[5,4]);

      // Línea de la constante Lipschitz (|f'| ≤ L)
      const L_val=lfn.L_teo;
      [L_val,-L_val].forEach(v=>{
        const py=cy-v*sc;
        if(py<14||py>H-14) return;
        ctx.strokeStyle=RED+"55"; ctx.lineWidth=1.5; ctx.setLineDash([6,4]);
        ctx.beginPath();ctx.moveTo(28,py);ctx.lineTo(cx*2-20,py);ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle=RED+"99"; ctx.font="9px monospace"; ctx.textAlign="left";
        ctx.fillText(`${v>0?"+":"-"}L=${Math.abs(v)}`, 32, py+(v>0?-4:12));
      });

      // Leyenda izquierda
      ctx.fillStyle=lfn.color; ctx.font="bold 11px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`f(x) = ${lfn.name}`, 32, 28);
      ctx.fillStyle=lfn.color+"88"; ctx.font="10px sans-serif";
      ctx.fillText(`— — f'(x)`, 32, 42);
      ctx.fillStyle=RED+"88";
      ctx.fillText(`- - ±L = ±${L_val}  (cota Lipschitz)`, 32, 56);

      // Panel derecho: barras de L por función
      const ox2=cx*2-10, pw2=W-ox2-20;
      ctx.fillStyle="#0f172a"; ctx.fillRect(ox2,14,pw2,H-28);
      ctx.strokeStyle=SLATE+"33"; ctx.lineWidth=1; ctx.strokeRect(ox2,14,pw2,H-28);

      ctx.fillStyle="#e2e8f0"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
      ctx.fillText("Constante Lipschitz L", ox2+pw2/2, 30);
      ctx.fillStyle=SLATE; ctx.font="9px sans-serif";
      ctx.fillText("= sup|f'(x)|  →  lr_max = 1/L", ox2+pw2/2, 44);

      const barH_max=H-100;
      const Ls=[0.25,1.0,1.0,1.1,1.1];
      const maxL=1.5;

      LIPS_FNS.forEach(({name:nm,color:col,L_teo:lt},i)=>{
        const bw=(pw2-20)/LIPS_FNS.length;
        const bx=ox2+10+i*bw;
        const bh=(lt/maxL)*barH_max*0.7;
        const by=14+barH_max*0.8-bh;

        ctx.fillStyle=col+(i===fnIdx?"ee":"55");
        ctx.strokeStyle=col+(i===fnIdx?"":"44");
        ctx.lineWidth=i===fnIdx?2:1;
        ctx.beginPath();
        ctx.roundRect(bx+2,by,bw-4,bh,[3,3,0,0]);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle=col; ctx.font=`${i===fnIdx?"bold ":""}9px monospace`;
        ctx.textAlign="center";
        ctx.fillText(`L=${lt}`, bx+bw/2, by-6);
        ctx.fillText(nm, bx+bw/2, 14+barH_max*0.8+14);
        ctx.fillStyle="#64748b"; ctx.font="8px monospace";
        ctx.fillText(`lr≤${(1/lt).toFixed(2)}`, bx+bw/2, 14+barH_max*0.8+26);
      });

      // Eje base barra
      ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(ox2+10, 14+barH_max*0.8);
      ctx.lineTo(ox2+pw2-10, 14+barH_max*0.8);
      ctx.stroke();
    }

  },[mode,fnIdx,epsilon,x0]);

  const btnStyle=(active)=>({
    flex:1, padding:"5px 0", borderRadius:6, fontSize:11, cursor:"pointer",
    border:active?"1.5px solid #60a5fa":"1.5px solid #1e293b",
    background:active?"#1e3a5f":"#0f172a",
    color:active?"#60a5fa":"#475569",
    transition:"all .2s",
  });

  const fnBtnStyle=(active,color)=>({
    flex:1, padding:"4px 0", borderRadius:5, fontSize:10, cursor:"pointer",
    border:active?`1.5px solid ${color}`:"1.5px solid #1e293b",
    background:active?color+"22":"#0f172a",
    color:active?color:"#475569",
  });

  const activeFns = mode===2 ? LIPS_FNS : FNS_ED;

  return(
    <div className="viz-box">
      <canvas ref={canvasRef} width={W} height={H}
        style={{display:"block",width:"100%",borderRadius:8,background:BG}}/>

      <div className="viz-ctrl" style={{marginTop:8,gap:5}}>
        {MODES.map((m,i)=>(
          <button key={i} onClick={()=>{setMode(i);setFnIdx(0);}} style={btnStyle(mode===i)}>{m}</button>
        ))}
      </div>

      {mode!==1&&(
        <div className="viz-ctrl" style={{marginTop:6,gap:4}}>
          {activeFns.map((fn,i)=>(
            <button key={i} onClick={()=>setFnIdx(i)}
              style={fnBtnStyle(fnIdx===i,fn.color)}>
              {fn.name}
            </button>
          ))}
        </div>
      )}

      {mode===0&&(
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569",fontSize:11,minWidth:90}}>ε = {epsilon.toFixed(3)}</span>
          <input type="range" min={0.05} max={1.2} step={0.01} value={epsilon}
            onChange={e=>setEpsilon(Number(e.target.value))}
            style={{flex:1,accentColor:"#60a5fa"}}/>
          <span style={{color:"#64748b",fontSize:10,minWidth:100,textAlign:"right"}}>
            δ ≈ {FNS_ED[fnIdx].cont
              ? Math.min(epsilon/FNS_ED[fnIdx].lipK,1.5).toFixed(4)
              : "no existe"}
          </span>
        </div>
      )}
    </div>
  );
}
