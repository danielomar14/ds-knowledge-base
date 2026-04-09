import React, { useRef, useState, useEffect } from "react";

export default function VectorViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]   = useState(0); // 0=geometría 2D, 1=normas/bolas, 2=coseno/concentración
  const [ux, setUx]       = useState(2);
  const [uy, setUy]       = useState(1);
  const [vx, setVx]       = useState(1);
  const [vy, setVy]       = useState(2.5);
  const [pVal, setPVal]   = useState(2);   // exponente norma Lp
  const [dim, setDim]     = useState(50);  // dimensión para concentración

  const W = 680, H = 370;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const MODES = ["Geometría 2D", "Normas Lp & Bolas", "Coseno & Alta Dimensión"];

  // ── RNG ligera reproducible ──────────────────────────────────────────────
  const lcg = (seed) => {
    let s = (seed * 1664525 + 1013904223) & 0xffffffff;
    return () => { s=(s*1664525+1013904223)|0; return ((s>>>0)/0xffffffff)*2-1; };
  };

  const drawGrid = (ctx, cx, cy, sc) => {
    ctx.strokeStyle="#0f1f35"; ctx.lineWidth=1;
    for(let x=cx%sc;x<W;x+=sc){ctx.beginPath();ctx.moveTo(x,14);ctx.lineTo(x,H-14);ctx.stroke();}
    for(let y=cy%sc;y<H;y+=sc){ctx.beginPath();ctx.moveTo(28,y);ctx.lineTo(W-14,y);ctx.stroke();}
  };

  const drawAxes = (ctx, cx, cy, sc) => {
    ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(28,cy);ctx.lineTo(W-14,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,14);ctx.lineTo(cx,H-14);ctx.stroke();
    ctx.fillStyle=SLATE; ctx.font="10px monospace"; ctx.textAlign="center";
    for(let v=-6;v<=6;v++){
      if(!v) continue;
      const px=cx+v*sc, py=cy-v*sc;
      if(px>32&&px<W-10){ctx.fillText(v,px,cy+13);}
      if(py>18&&py<H-14){ctx.textAlign="right";ctx.fillText(v,cx-4,py+4);ctx.textAlign="center";}
    }
  };

  const drawArrow = (ctx, ox, oy, dx, dy, color, lw=2.5, label="", labelOff=[8,-10]) => {
    const len = Math.hypot(dx, dy);
    if(len<2) return;
    const angle = Math.atan2(dy, dx);
    ctx.strokeStyle=color; ctx.lineWidth=lw;
    ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox+dx,oy+dy);ctx.stroke();
    // Punta
    const aLen=10, aAngle=0.4;
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(ox+dx,oy+dy);
    ctx.lineTo(ox+dx-aLen*Math.cos(angle-aAngle),oy+dy-aLen*Math.sin(angle-aAngle));
    ctx.lineTo(ox+dx-aLen*Math.cos(angle+aAngle),oy+dy-aLen*Math.sin(angle+aAngle));
    ctx.closePath();ctx.fill();
    if(label){
      ctx.fillStyle=color; ctx.font="bold 12px monospace"; ctx.textAlign="left";
      ctx.fillText(label, ox+dx+labelOff[0], oy+dy+labelOff[1]);
    }
  };

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);

    // ══════════════════════════════════════════════════════════════════════
    // MODO 0 — Geometría 2D: vectores, suma, proyección, ángulo
    // ══════════════════════════════════════════════════════════════════════
    if(mode===0){
      const cx=W/2, cy=H/2+10, sc=55;
      drawGrid(ctx,cx,cy,sc);
      drawAxes(ctx,cx,cy,sc);

      const u=[ux,uy], v=[vx,vy];
      const dot=u[0]*v[0]+u[1]*v[1];
      const nu=Math.hypot(...u), nv=Math.hypot(...v);
      const cosT=nu>1e-9&&nv>1e-9?dot/(nu*nv):0;
      const theta=Math.acos(Math.max(-1,Math.min(1,cosT)));

      // Suma u+v (regla del paralelogramo)
      const sum=[u[0]+v[0],u[1]+v[1]];
      // Proyección de v sobre u
      const proj_coeff=nu>1e-9?dot/(nu*nu):0;
      const proj=[proj_coeff*u[0], proj_coeff*u[1]];

      // Arco del ángulo entre u y v
      const angleU=Math.atan2(-u[1],u[0]);
      const angleV=Math.atan2(-v[1],v[0]);
      const arcR=sc*0.55;
      ctx.strokeStyle=YELLOW+"88"; ctx.lineWidth=1.5; ctx.setLineDash([3,4]);
      ctx.beginPath();
      ctx.arc(cx,cy,arcR,Math.min(angleU,angleV),Math.max(angleU,angleV));
      ctx.stroke(); ctx.setLineDash([]);

      // Etiqueta del ángulo
      const midAngle=(angleU+angleV)/2;
      ctx.fillStyle=YELLOW; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
      ctx.fillText(`θ=${(theta*180/Math.PI).toFixed(1)}°`,
        cx+(arcR+16)*Math.cos(midAngle), cy+(arcR+16)*Math.sin(midAngle));

      // Proyección (línea punteada desde punta de v al pie)
      const projPx=cx+proj[0]*sc, projPy=cy-proj[1]*sc;
      const vPx=cx+v[0]*sc, vPy=cy-v[1]*sc;
      ctx.strokeStyle=GREEN+"55"; ctx.lineWidth=1; ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(vPx,vPy);ctx.lineTo(projPx,projPy);ctx.stroke();
      ctx.setLineDash([]);
      // Marca ángulo recto
      const perpLen=8;
      const uNorm=[u[0]/nu,u[1]/nu];
      const uPerp=[-uNorm[1],uNorm[0]];
      ctx.strokeStyle=GREEN+"66"; ctx.lineWidth=1;
      const sqPts=[
        [projPx,projPy],
        [projPx+perpLen*uPerp[0],projPy-perpLen*uPerp[1]],
        [projPx+perpLen*(uPerp[0]+uNorm[0]),projPy-perpLen*(uPerp[1]+uNorm[1])],
        [projPx+perpLen*uNorm[0],projPy-perpLen*uNorm[1]],
      ];
      ctx.beginPath();
      sqPts.forEach(([x,y],i)=>i===0?ctx.moveTo(x,y):ctx.lineTo(x,y));
      ctx.closePath(); ctx.stroke();

      // Vector proyección
      if(Math.hypot(...proj)>0.05){
        drawArrow(ctx,cx,cy,proj[0]*sc,-proj[1]*sc,GREEN+"aa",1.5,"proj",[4,-12]);
      }

      // u+v punteado
      ctx.strokeStyle=PURPLE+"55"; ctx.lineWidth=1; ctx.setLineDash([3,4]);
      ctx.beginPath();ctx.moveTo(cx+u[0]*sc,cy-u[1]*sc);
      ctx.lineTo(cx+sum[0]*sc,cy-sum[1]*sc);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx+v[0]*sc,cy-v[1]*sc);
      ctx.lineTo(cx+sum[0]*sc,cy-sum[1]*sc);ctx.stroke();
      ctx.setLineDash([]);

      // Vectores principales
      drawArrow(ctx,cx,cy,u[0]*sc,-u[1]*sc,BLUE,2.5,"u",[6,-8]);
      drawArrow(ctx,cx,cy,v[0]*sc,-v[1]*sc,ORANGE,2.5,"v",[6,-8]);
      drawArrow(ctx,cx,cy,sum[0]*sc,-sum[1]*sc,PURPLE,2,"u+v",[6,-8]);

      // Panel info
      ctx.fillStyle="#0f172a"; ctx.fillRect(16,16,200,88);
      ctx.strokeStyle=BLUE+"44"; ctx.lineWidth=1; ctx.strokeRect(16,16,200,88);
      ctx.fillStyle="#94a3b8"; ctx.font="10px monospace"; ctx.textAlign="left";
      [
        `u = (${ux.toFixed(1)}, ${uy.toFixed(1)})   ‖u‖=${nu.toFixed(3)}`,
        `v = (${vx.toFixed(1)}, ${vy.toFixed(1)})   ‖v‖=${nv.toFixed(3)}`,
        `u·v = ${dot.toFixed(3)}`,
        `cos θ = ${cosT.toFixed(4)}`,
        `θ = ${(theta*180/Math.PI).toFixed(2)}°`,
        `proj_u(v) = (${proj[0].toFixed(3)}, ${proj[1].toFixed(3)})`,
      ].forEach((line,i)=>{ ctx.fillText(line,26,34+i*14); });

      // Leyenda
      const leg=[[BLUE,"u"],[ORANGE,"v"],[PURPLE,"u+v"],[GREEN,"proj_u(v)"]];
      leg.forEach(([c,l],i)=>{
        ctx.fillStyle=c; ctx.font="10px sans-serif"; ctx.textAlign="left";
        ctx.fillText(`▶ ${l}`, 16+i*90, H-12);
      });
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 1 — Bolas unitarias Lp
    // ══════════════════════════════════════════════════════════════════════
    if(mode===1){
      // 3 paneles: L1, Lp (variable), L∞
      const panels=[
        {p:1,    color:GREEN,  label:"L¹ (Lasso, Sparsity)"},
        {p:pVal, color:BLUE,   label:`L^${pVal.toFixed(1)} (seleccionado)`},
        {p:999,  color:YELLOW, label:"L∞ (Chebyshev)"},
      ];

      const panW=W/3-4, sc=70;

      panels.forEach(({p,color,label},idx)=>{
        const ox=idx*(panW+4)+2;
        const cx=ox+panW/2, cy=H/2+10;

        // Mini-grid
        ctx.strokeStyle="#0f1f35"; ctx.lineWidth=0.8;
        for(let v=-1;v<=1;v++){
          const px=cx+v*sc, py=cy-v*sc;
          ctx.beginPath();ctx.moveTo(px,cy-sc-10);ctx.lineTo(px,cy+sc+10);ctx.stroke();
          ctx.beginPath();ctx.moveTo(cx-sc-10,py);ctx.lineTo(cx+sc+10,py);ctx.stroke();
        }
        ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(ox+4,cy);ctx.lineTo(ox+panW-4,cy);ctx.stroke();
        ctx.beginPath();ctx.moveTo(cx,16);ctx.lineTo(cx,H-40);ctx.stroke();

        // Bola unitaria Lp: ‖x‖_p = 1
        const N=500;
        ctx.strokeStyle=color; ctx.lineWidth=2.5;
        ctx.beginPath(); let first=true;

        if(p===999){
          // L∞: cuadrado unitario
          const corners=[[1,1],[1,-1],[-1,-1],[-1,1],[1,1]];
          corners.forEach(([x,y],i)=>{
            const px=cx+x*sc, py=cy-y*sc;
            i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
          });
        } else if(p===1){
          // L1: diamante
          [[1,0],[0,1],[-1,0],[0,-1],[1,0]].forEach(([x,y],i)=>{
            const px=cx+x*sc, py=cy-y*sc;
            i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
          });
        } else {
          // Lp general: parametrize by angle, |cos|^(2/p) * sign
          for(let i=0;i<=N;i++){
            const t=2*Math.PI*i/N;
            const c=Math.cos(t), s=Math.sin(t);
            const x=Math.sign(c)*Math.pow(Math.abs(c),2/p);
            const y=Math.sign(s)*Math.pow(Math.abs(s),2/p);
            const px=cx+x*sc, py=cy-y*sc;
            first?ctx.moveTo(px,py):ctx.lineTo(px,py);
            first=false;
          }
          ctx.closePath();
        }
        ctx.stroke();

        // Relleno semitransparente
        ctx.fillStyle=color+"18";
        ctx.fill();

        // Ejes label
        ctx.fillStyle=SLATE; ctx.font="9px monospace"; ctx.textAlign="center";
        ctx.fillText("1",cx+sc,cy+12); ctx.fillText("-1",cx-sc,cy+12);
        ctx.fillText("1",cx+6,cy-sc+4); ctx.fillText("-1",cx+6,cy+sc+4);

        // Título del panel
        ctx.fillStyle=color; ctx.font="bold 10px sans-serif"; ctx.textAlign="center";
        ctx.fillText(label, cx, H-26);
        ctx.fillStyle="#64748b"; ctx.font="9px sans-serif";
        ctx.fillText(p===999?"máx|xᵢ|≤1":p===1?"Σ|xᵢ|≤1":`(Σ|xᵢ|^${p.toFixed(1)})^(1/${p.toFixed(1)})≤1`, cx, H-14);
      });

      // Separadores
      [1,2].forEach(i=>{
        const sx=i*(W/3);
        ctx.strokeStyle=SLATE+"22"; ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(sx,14);ctx.lineTo(sx,H-6);ctx.stroke();
      });
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 2 — Similitud coseno y concentración de medida
    // ══════════════════════════════════════════════════════════════════════
    if(mode===2){
      const d=dim;
      const rng=lcg(d*17+3);
      const N_SAMP=300;

      // Genera N vectores aleatorios en d dimensiones
      const vecs=Array.from({length:N_SAMP},()=>{
        const v=Array.from({length:d},()=>rng());
        const n=Math.sqrt(v.reduce((s,x)=>s+x*x,0));
        return v.map(x=>x/n); // normalizado
      });

      // Cosenos entre pares consecutivos
      const cosines=[];
      for(let i=0;i<N_SAMP-1;i++){
        let dot=0;
        for(let j=0;j<d;j++) dot+=vecs[i][j]*vecs[i+1][j];
        cosines.push(dot);
      }

      // Normas de vectores NO normalizados (para mostrar concentración)
      const rng2=lcg(d*31+7);
      const normas=Array.from({length:N_SAMP},()=>{
        const v=Array.from({length:d},()=>rng2());
        return Math.sqrt(v.reduce((s,x)=>s+x*x,0));
      });
      const meanNorm=normas.reduce((a,b)=>a+b)/N_SAMP;
      const stdNorm=Math.sqrt(normas.reduce((s,x)=>s+(x-meanNorm)**2,0)/N_SAMP);
      const sqrtD=Math.sqrt(d);

      // Layout: izquierda histograma cosenos, derecha histograma normas
      const W2=(W-50)/2, ox1=10, ox2=W/2+10, oy=40, pH=H-90;

      const drawHist=(data,ox,label,color,expectedMean,xLabel)=>{
        const mn=Math.min(...data), mx=Math.max(...data);
        const bins=30;
        const counts=new Array(bins).fill(0);
        data.forEach(v=>{
          const bi=Math.min(bins-1,Math.floor((v-mn)/(mx-mn+1e-12)*bins));
          counts[bi]++;
        });
        const maxC=Math.max(...counts);

        // Eje
        ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(ox,oy+pH);ctx.lineTo(ox+W2,oy+pH);ctx.stroke();
        ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox,oy+pH);ctx.stroke();

        // Barras
        const bw=W2/bins;
        counts.forEach((c,i)=>{
          const bh=(c/maxC)*pH*0.9;
          ctx.fillStyle=color+"88";
          ctx.fillRect(ox+i*bw,oy+pH-bh,bw-1,bh);
        });

        // Línea de media esperada
        const meanPx=ox+(expectedMean-mn)/(mx-mn+1e-12)*W2;
        ctx.strokeStyle=YELLOW; ctx.lineWidth=2; ctx.setLineDash([5,4]);
        ctx.beginPath();ctx.moveTo(meanPx,oy);ctx.lineTo(meanPx,oy+pH);ctx.stroke();
        ctx.setLineDash([]);

        // Etiquetas
        ctx.fillStyle=color; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
        ctx.fillText(label, ox+W2/2, oy-20);
        ctx.fillStyle="#94a3b8"; ctx.font="9px monospace";
        const meanData=data.reduce((a,b)=>a+b)/data.length;
        const stdData=Math.sqrt(data.reduce((s,x)=>s+(x-meanData)**2,0)/data.length);
        ctx.fillText(`μ=${meanData.toFixed(4)}  σ=${stdData.toFixed(4)}`, ox+W2/2, oy-8);
        ctx.fillStyle=YELLOW; ctx.font="9px sans-serif";
        ctx.fillText(`esperado: ${expectedMean.toFixed(4)}`,ox+W2/2, oy+pH+28);

        // Ticks eje x
        ctx.fillStyle=SLATE; ctx.font="9px monospace";
        [mn,(mn+mx)/2,mx].forEach(v=>{
          const px=ox+(v-mn)/(mx-mn+1e-12)*W2;
          ctx.textAlign="center"; ctx.fillText(v.toFixed(2),px,oy+pH+14);
        });
        ctx.fillText(xLabel,ox+W2/2,oy+pH+40);
      };

      drawHist(cosines,ox1,`Similitudes coseno  (d=${d})`,BLUE,0,"cos θ entre pares aleatorios");
      drawHist(normas,ox2,`Normas  ‖v‖₂  (d=${d})`,GREEN,sqrtD,"‖v‖₂ de v~N(0,I)");

      // Separador
      ctx.strokeStyle=SLATE+"33"; ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(W/2,14);ctx.lineTo(W/2,H-6);ctx.stroke();

      // Fórmulas
      ctx.fillStyle=SLATE; ctx.font="9px monospace"; ctx.textAlign="center";
      ctx.fillText(`E[cos θ] → 0  con std → 1/√d = ${(1/sqrtD).toFixed(4)}`, ox1+W2/2, H-12);
      ctx.fillText(`E[‖v‖] → √d = ${sqrtD.toFixed(2)}   std[‖v‖] → O(1)`, ox2+W2/2, H-12);
    }

  },[mode,ux,uy,vx,vy,pVal,dim]);

  const btnStyle=(active)=>({
    flex:1, padding:"5px 0", borderRadius:6, fontSize:11, cursor:"pointer",
    border:active?"1.5px solid #60a5fa":"1.5px solid #1e293b",
    background:active?"#1e3a5f":"#0f172a",
    color:active?"#60a5fa":"#475569",
    transition:"all .2s",
  });

  return(
    <div className="viz-box">
      <canvas ref={canvasRef} width={W} height={H}
        style={{display:"block",width:"100%",borderRadius:8,background:BG}}/>

      <div className="viz-ctrl" style={{marginTop:8,gap:5}}>
        {MODES.map((m,i)=>(
          <button key={i} onClick={()=>setMode(i)} style={btnStyle(mode===i)}>{m}</button>
        ))}
      </div>

      {mode===0&&(<>
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#60a5fa",fontSize:11,minWidth:110}}>u=({ux.toFixed(1)},{uy.toFixed(1)})</span>
          <input type="range" min={-3} max={3} step={0.1} value={ux}
            onChange={e=>setUx(Number(e.target.value))} style={{flex:1,accentColor:BLUE}}/>
          <input type="range" min={-3} max={3} step={0.1} value={uy}
            onChange={e=>setUy(Number(e.target.value))} style={{flex:1,accentColor:BLUE}}/>
        </div>
        <div className="viz-ctrl" style={{marginTop:4}}>
          <span style={{color:"#fb923c",fontSize:11,minWidth:110}}>v=({vx.toFixed(1)},{vy.toFixed(1)})</span>
          <input type="range" min={-3} max={3} step={0.1} value={vx}
            onChange={e=>setVx(Number(e.target.value))} style={{flex:1,accentColor:ORANGE}}/>
          <input type="range" min={-3} max={3} step={0.1} value={vy}
            onChange={e=>setVy(Number(e.target.value))} style={{flex:1,accentColor:ORANGE}}/>
        </div>
      </>)}

      {mode===1&&(
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569",fontSize:11,minWidth:90}}>p = {pVal.toFixed(1)}</span>
          <input type="range" min={0.5} max={8} step={0.1} value={pVal}
            onChange={e=>setPVal(Number(e.target.value))} style={{flex:1,accentColor:BLUE}}/>
          <span style={{color:"#64748b",fontSize:10,minWidth:130,textAlign:"right"}}>
            {pVal<1?"(no es norma)":pVal===1?"Lasso / sparse":pVal===2?"Euclídea":pVal>6?"→ L∞":"intermedia"}
          </span>
        </div>
      )}

      {mode===2&&(
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569",fontSize:11,minWidth:90}}>d = {dim}</span>
          <input type="range" min={2} max={500} step={1} value={dim}
            onChange={e=>setDim(Number(e.target.value))} style={{flex:1,accentColor:BLUE}}/>
          <span style={{color:"#64748b",fontSize:10,minWidth:140,textAlign:"right"}}>
            √d={Math.sqrt(dim).toFixed(2)}  1/√d={( 1/Math.sqrt(dim)).toFixed(4)}
          </span>
        </div>
      )}
    </div>
  );
}
