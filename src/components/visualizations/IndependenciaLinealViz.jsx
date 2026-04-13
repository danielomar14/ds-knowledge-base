import React, { useRef, useState, useEffect } from 'react';

export default function IndependenciaLinealViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]   = useState(0); // 0=geometría LI/LD, 1=gram-schmidt, 2=espectro singular
  const [v1x, setV1x]     = useState(2);
  const [v1y, setV1y]     = useState(0.5);
  const [v2x, setV2x]     = useState(0.5);
  const [v2y, setV2y]     = useState(2);
  const [v3x, setV3x]     = useState(1.5);
  const [v3y, setV3y]     = useState(1.0);
  const [show3rd, setShow3rd] = useState(false);
  const [corrVal, setCorrVal] = useState(0.0); // correlación para modo 2

  const W = 680, H = 370;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const MODES = ["Geometría LI / LD", "Gram-Schmidt", "Espectro & Condición"];

  const drawGrid = (ctx,cx,cy,sc) => {
    ctx.strokeStyle="#0f1f35"; ctx.lineWidth=1;
    for(let x=cx%sc;x<W;x+=sc){ctx.beginPath();ctx.moveTo(x,14);ctx.lineTo(x,H-14);ctx.stroke();}
    for(let y=cy%sc;y<H;y+=sc){ctx.beginPath();ctx.moveTo(28,y);ctx.lineTo(W-14,y);ctx.stroke();}
  };

  const drawAxes = (ctx,cx,cy,sc) => {
    ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(28,cy);ctx.lineTo(W-14,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,14);ctx.lineTo(cx,H-14);ctx.stroke();
    ctx.fillStyle=SLATE; ctx.font="10px monospace";
    for(let v=-5;v<=5;v++){
      if(!v) continue;
      const px=cx+v*sc, py=cy-v*sc;
      ctx.textAlign="center"; if(px>32&&px<W-10) ctx.fillText(v,px,cy+13);
      ctx.textAlign="right"; if(py>18&&py<H-14) ctx.fillText(v,cx-4,py+4);
    }
  };

  const arrow = (ctx,ox,oy,dx,dy,color,lw=2.5,label="",loff=[8,-10]) => {
    if(Math.hypot(dx,dy)<2) return;
    const ang=Math.atan2(dy,dx);
    ctx.strokeStyle=color; ctx.lineWidth=lw;
    ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox+dx,oy+dy);ctx.stroke();
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(ox+dx,oy+dy);
    ctx.lineTo(ox+dx-10*Math.cos(ang-0.4),oy+dy-10*Math.sin(ang-0.4));
    ctx.lineTo(ox+dx-10*Math.cos(ang+0.4),oy+dy-10*Math.sin(ang+0.4));
    ctx.closePath();ctx.fill();
    if(label){
      ctx.fillStyle=color; ctx.font="bold 12px monospace"; ctx.textAlign="left";
      ctx.fillText(label,ox+dx+loff[0],oy+dy+loff[1]);
    }
  };

  // ── Gram-Schmidt en 2D ───────────────────────────────────────────────────
  const gramSchmidt2D = (vecs) => {
    const qs=[], idxs=[];
    for(let j=0;j<vecs.length;j++){
      let u=[...vecs[j]];
      for(const q of qs){
        const d=u[0]*q[0]+u[1]*q[1];
        u=[u[0]-d*q[0], u[1]-d*q[1]];
      }
      const n=Math.hypot(...u);
      if(n>0.05){
        qs.push([u[0]/n,u[1]/n]);
        idxs.push(j);
      }
    }
    return {qs,idxs};
  };

  // ── Valores singulares con correlación ───────────────────────────────────
  const singularValsCorr = (corr, n=200, d=2) => {
    const c=Math.max(-0.999,Math.min(0.999,corr));
    // X = [x1, c*x1 + sqrt(1-c²)*x2]
    const x1=Array.from({length:n},(_,i)=>Math.sin(i*0.13));
    const x2=Array.from({length:n},(_,i)=>Math.cos(i*0.17));
    const col1=x1;
    const col2=x1.map((v,i)=>c*v+Math.sqrt(1-c*c)*x2[i]);
    // Matriz 2×2: X^T X / n
    const a=col1.reduce((s,v)=>s+v*v,0)/n;
    const b=col1.reduce((s,v,i)=>s+v*col2[i],0)/n;
    const cc2=col2.reduce((s,v)=>s+v*v,0)/n;
    // Eigenvalues de [[a,b],[b,cc2]]
    const tr=a+cc2, de=a*cc2-b*b;
    const disc=Math.sqrt(Math.max(0,(tr/2)**2-de));
    return [tr/2+disc, tr/2-disc].map(v=>Math.sqrt(Math.max(0,v)));
  };

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);

    // ══════════════════════════════════════════════════════════════════════
    // MODO 0 — Geometría LI/LD con 2 o 3 vectores
    // ══════════════════════════════════════════════════════════════════════
    if(mode===0){
      // Split: izquierda muestra v1,v2; derecha (si show3rd) v1,v2,v3
      const panels=show3rd?2:1;
      const panW=panels>1?W/2-10:W;

      const drawPanel=(ox,vecs,title)=>{
        const cx=ox+panW/2, cy=H/2+10, sc=52;

        // Grid y ejes dentro del panel
        ctx.save();
        ctx.beginPath();ctx.rect(ox,0,panW,H);ctx.clip();
        drawGrid(ctx,cx,cy,sc);
        drawAxes(ctx,cx,cy,sc);

        // Detectar LI
        const A=vecs.map(v=>v).reduce((acc,v,i)=>{
          acc.forEach((row,r)=>{ row[i]=v[r]; });
          return acc;
        }, Array.from({length:2},()=>new Array(vecs.length).fill(0)));
        // SVD manual 2xk
        const mat=vecs.length===2?
          [[vecs[0][0],vecs[1][0]],[vecs[0][1],vecs[1][1]]]:
          [[vecs[0][0],vecs[1][0],vecs[2][0]],[vecs[0][1],vecs[1][1],vecs[2][1]]];
        const det2=vecs.length>=2?vecs[0][0]*vecs[1][1]-vecs[0][1]*vecs[1][0]:1;
        const isLI=Math.abs(det2)>0.08&&vecs.length<=2;
        const isLD=!isLI||vecs.length>2;

        // Para 3 vectores: verificar si v3 ∈ span(v1,v2)
        let v3InSpan=false;
        if(vecs.length===3&&Math.abs(det2)>0.08){
          // Resolver v3 = a*v1 + b*v2
          const denom=det2;
          const a=(vecs[2][0]*vecs[1][1]-vecs[2][1]*vecs[1][0])/denom;
          const b=(vecs[0][0]*vecs[2][1]-vecs[0][1]*vecs[2][0])/denom;
          const resid=[vecs[2][0]-a*vecs[0][0]-b*vecs[1][0], vecs[2][1]-a*vecs[0][1]-b*vecs[1][1]];
          v3InSpan=Math.hypot(...resid)<0.1;
        }

        // Span sombreado
        const spanColor=isLI&&vecs.length<=2?BLUE:isLD?RED:GREEN;
        if(isLI&&vecs.length<=2){
          const g=ctx.createRadialGradient(cx,cy,0,cx,cy,350);
          g.addColorStop(0,BLUE+"1a");g.addColorStop(1,BLUE+"05");
          ctx.fillStyle=g;ctx.fillRect(ox,0,panW,H);
        } else {
          // Span = recta(s)
          const n1=Math.hypot(...vecs[0])+1e-9;
          const d1=[vecs[0][0]/n1,vecs[0][1]/n1];
          ctx.strokeStyle=RED+"44"; ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(cx-d1[0]*8*sc,cy+d1[1]*8*sc);
          ctx.lineTo(cx+d1[0]*8*sc,cy-d1[1]*8*sc);ctx.stroke();
        }

        // Vectores
        const colors=[BLUE,GREEN,show3rd?(v3InSpan?RED:ORANGE):ORANGE];
        vecs.forEach((v,i)=>{
          const col=colors[i%colors.length];
          const lbl=`v${i+1}`;
          ctx.shadowColor=col; ctx.shadowBlur=6;
          arrow(ctx,cx,cy,v[0]*sc,-v[1]*sc,col,2.5,lbl,[6,-10]);
          ctx.shadowBlur=0;
        });

        // Si v3 en span(v1,v2): mostrar la combinación
        if(vecs.length===3&&v3InSpan&&Math.abs(det2)>0.08){
          const denom=det2;
          const a=(vecs[2][0]*vecs[1][1]-vecs[2][1]*vecs[1][0])/denom;
          const b=(vecs[0][0]*vecs[2][1]-vecs[0][1]*vecs[2][0])/denom;
          ctx.strokeStyle=RED+"66"; ctx.lineWidth=1; ctx.setLineDash([4,4]);
          ctx.beginPath();ctx.moveTo(cx,cy);
          ctx.lineTo(cx+a*vecs[0][0]*sc,cy-a*vecs[0][1]*sc);
          ctx.lineTo(cx+(a*vecs[0][0]+b*vecs[1][0])*sc,cy-(a*vecs[0][1]+b*vecs[1][1])*sc);
          ctx.stroke();ctx.setLineDash([]);
          ctx.fillStyle=RED; ctx.font="9px monospace"; ctx.textAlign="center";
          ctx.fillText(`v₃=${a.toFixed(2)}v₁+${b.toFixed(2)}v₂ → LD`,cx,H-26);
        }

        // Texto det y estado
        const liState=vecs.length<=2?(Math.abs(det2)>0.08?"✓ LI":"✗ LD (paralelos)"):
          (v3InSpan?"✗ LD (v₃ en span)":"✗ LD (k>dim)");
        ctx.fillStyle="#0f172a"; ctx.fillRect(ox+8,16,panW-16,58);
        ctx.strokeStyle=spanColor+"55"; ctx.lineWidth=1; ctx.strokeRect(ox+8,16,panW-16,58);
        ctx.fillStyle=spanColor; ctx.font="bold 11px sans-serif"; ctx.textAlign="left";
        ctx.fillText(title,ox+16,32);
        ctx.fillStyle="#94a3b8"; ctx.font="10px monospace";
        if(vecs.length<=2) ctx.fillText(`det=[v₁|v₂]=${det2.toFixed(3)}`,ox+16,48);
        ctx.fillStyle=Math.abs(det2)>0.08&&vecs.length<=2?GREEN:RED;
        ctx.font="bold 10px sans-serif";
        ctx.fillText(liState,ox+16,64);

        ctx.restore();
      };

      const v1=[v1x,v1y], v2=[v2x,v2y], v3=[v3x,v3y];

      if(show3rd){
        ctx.strokeStyle=SLATE+"22"; ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.stroke();
        drawPanel(0,[v1,v2],"v₁, v₂");
        drawPanel(W/2+4,[v1,v2,v3],"v₁, v₂, v₃ (¿redundante?)");
      } else {
        drawPanel(0,[v1,v2],"Independencia lineal de v₁, v₂");
      }
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 1 — Gram-Schmidt paso a paso en 2D
    // ══════════════════════════════════════════════════════════════════════
    if(mode===1){
      const cx=W/2, cy=H/2+10, sc=60;
      drawGrid(ctx,cx,cy,sc);
      drawAxes(ctx,cx,cy,sc);

      const v1=[v1x,v1y], v2=[v2x,v2y];
      const {qs,idxs}=gramSchmidt2D([v1,v2]);

      // Vectores originales (atenuados)
      arrow(ctx,cx,cy,v1[0]*sc,-v1[1]*sc,BLUE+"66",1.5,"v₁",[5,-8]);
      arrow(ctx,cx,cy,v2[0]*sc,-v2[1]*sc,GREEN+"66",1.5,"v₂",[5,-8]);

      if(qs.length>0){
        // q1 = v1 normalizado
        const q1=qs[0];
        arrow(ctx,cx,cy,q1[0]*sc,-q1[1]*sc,BLUE,2.5,"q₁ = v₁/‖v₁‖",[6,-10]);

        if(qs.length>1){
          // Proyección de v2 sobre q1
          const proj=q1[0]*v2[0]+q1[1]*v2[1];
          const proj_v=[proj*q1[0],proj*q1[1]];
          const u2=[v2[0]-proj_v[0],v2[1]-proj_v[1]];

          // Línea de proyección
          ctx.strokeStyle=YELLOW+"66"; ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
          ctx.beginPath();
          ctx.moveTo(cx+v2[0]*sc,cy-v2[1]*sc);
          ctx.lineTo(cx+proj_v[0]*sc,cy-proj_v[1]*sc);
          ctx.stroke(); ctx.setLineDash([]);

          // Vector proyectado sobre q1 (sombra a eliminar)
          ctx.strokeStyle=YELLOW+"66"; ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(cx,cy);
          ctx.lineTo(cx+proj_v[0]*sc,cy-proj_v[1]*sc);ctx.stroke();
          ctx.fillStyle=YELLOW+"88";
          ctx.beginPath();ctx.arc(cx+proj_v[0]*sc,cy-proj_v[1]*sc,4,0,Math.PI*2);ctx.fill();
          ctx.fillStyle=YELLOW; ctx.font="9px monospace"; ctx.textAlign="center";
          ctx.fillText(`⟨v₂,q₁⟩q₁`,cx+proj_v[0]*sc+5,cy-proj_v[1]*sc-10);

          // u2 = v2 - proj
          arrow(ctx,cx,cy,u2[0]*sc,-u2[1]*sc,ORANGE,2,"u₂ = v₂ - proj",[6,-10]);

          // q2 = u2 normalizado
          const q2=qs[1];
          arrow(ctx,cx,cy,q2[0]*sc,-q2[1]*sc,GREEN,2.5,"q₂ = u₂/‖u₂‖",[6,-10]);

          // Ángulo recto entre q1 y q2
          const dot=q1[0]*q2[0]+q1[1]*q2[1];
          ctx.fillStyle=GREEN+"aa"; ctx.font="10px monospace"; ctx.textAlign="center";
          ctx.fillText(`⟨q₁,q₂⟩ = ${dot.toFixed(4)} ≈ 0 ✓`,cx,H-26);
        } else {
          ctx.fillStyle=RED; ctx.font="bold 10px sans-serif"; ctx.textAlign="center";
          ctx.fillText("v₂ es paralelo a v₁ → REDUNDANTE (LD)",cx,H-26);
        }
      }

      // Panel info
      ctx.fillStyle="#0f172a"; ctx.fillRect(16,16,220,70);
      ctx.strokeStyle=BLUE+"44"; ctx.lineWidth=1; ctx.strokeRect(16,16,220,70);
      ctx.fillStyle="#e2e8f0"; ctx.font="bold 11px sans-serif"; ctx.textAlign="left";
      ctx.fillText("Proceso Gram-Schmidt",26,32);
      ctx.fillStyle="#94a3b8"; ctx.font="10px monospace";
      ctx.fillText(`v₁ = (${v1x.toFixed(1)},${v1y.toFixed(1)})`,26,48);
      ctx.fillText(`v₂ = (${v2x.toFixed(1)},${v2y.toFixed(1)})`,26,62);
      ctx.fillStyle=qs.length>=2?GREEN:RED; ctx.font="bold 10px sans-serif";
      ctx.fillText(qs.length>=2?`→ base ortonormal: {q₁,q₂}`:`→ v₂ redundante: base = {q₁}`,26,76);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 2 — Espectro singular y número de condición
    // ══════════════════════════════════════════════════════════════════════
    if(mode===2){
      const corr=corrVal;
      const [s1,s2]=singularValsCorr(corr);
      const kappa=s2>1e-6?s1/s2:Infinity;

      // Izquierda: elipse del span (visualiza el condicionamiento)
      const cx1=200, cy1=H/2+10, scB=50;
      drawGrid(ctx,cx1,cy1,scB);
      ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(28,cy1);ctx.lineTo(cx1*2-20,cy1);ctx.stroke();
      ctx.beginPath();ctx.moveTo(cx1,14);ctx.lineTo(cx1,H-30);ctx.stroke();

      // Las columnas de X son v1=(1,c) y v2=(1,sqrt(1-c²)) — simular con elipse de sigma
      const ellA=Math.min(s1*scB*0.8, cx1-40);
      const ellB=Math.min(s2*scB*0.8+1, cy1-40);
      ctx.fillStyle=BLUE+"18"; ctx.strokeStyle=BLUE; ctx.lineWidth=2;
      ctx.beginPath();ctx.ellipse(cx1,cy1,ellA,Math.max(ellB,4),0,0,Math.PI*2);
      ctx.fill();ctx.stroke();

      // Ejes de la elipse (valores singulares)
      ctx.strokeStyle=GREEN; ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(cx1,cy1);ctx.lineTo(cx1+ellA,cy1);ctx.stroke();
      ctx.fillStyle=GREEN; ctx.font="bold 10px monospace"; ctx.textAlign="left";
      ctx.fillText(`σ₁=${s1.toFixed(3)}`,cx1+ellA+6,cy1+4);

      if(ellB>4){
        ctx.strokeStyle=RED; ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(cx1,cy1);ctx.lineTo(cx1,cy1-ellB);ctx.stroke();
        ctx.fillStyle=RED; ctx.font="bold 10px monospace"; ctx.textAlign="left";
        ctx.fillText(`σ₂=${s2.toFixed(4)}`,cx1+6,cy1-ellB-4);
      }
      ctx.fillStyle=YELLOW; ctx.font="bold 11px monospace"; ctx.textAlign="center";
      ctx.fillText(`κ = σ₁/σ₂ = ${isFinite(kappa)?kappa.toFixed(2):"∞"}`,cx1,H-20);
      ctx.fillStyle=SLATE; ctx.font="10px sans-serif";
      ctx.fillText(`correlación ρ = ${corr.toFixed(3)}`, cx1, 26);

      // Derecha: curva κ vs correlación
      const ox2=cx1*2+10, pw2=W-ox2-20, oh2=30, ph2=H-70;

      ctx.strokeStyle="#1e3a5f"; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(ox2,oh2);ctx.lineTo(ox2,oh2+ph2);ctx.lineTo(ox2+pw2,oh2+ph2);ctx.stroke();

      // Curva κ(ρ)
      const N=200;
      const logKappaMax=4;
      ctx.strokeStyle=YELLOW; ctx.lineWidth=2;
      ctx.beginPath(); let first=true;
      for(let i=0;i<=N;i++){
        const rho=-0.999+i*1.998/N;
        const [s1r,s2r]=singularValsCorr(rho);
        const k=s2r>1e-6?s1r/s2r:1e5;
        const logK=Math.log10(Math.max(1,k));
        const px=ox2+i/N*pw2;
        const py=oh2+ph2-Math.min(logK/logKappaMax,1)*ph2*0.9;
        first?ctx.moveTo(px,py):ctx.lineTo(px,py);
        first=false;
      }
      ctx.stroke();

      // Punto actual
      const corrPx=ox2+(corr+0.999)/1.998*pw2;
      const [s1c,s2c]=singularValsCorr(corr);
      const kappaC=s2c>1e-6?s1c/s2c:1e5;
      const logKC=Math.log10(Math.max(1,kappaC));
      const corrPy=oh2+ph2-Math.min(logKC/logKappaMax,1)*ph2*0.9;
      ctx.shadowColor=RED; ctx.shadowBlur=10;
      ctx.fillStyle=RED; ctx.beginPath();ctx.arc(corrPx,corrPy,6,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;

      // Etiquetas eje x
      ctx.fillStyle=SLATE; ctx.font="9px monospace"; ctx.textAlign="center";
      [-0.9,-0.5,0,0.5,0.9].forEach(r=>{
        const px=ox2+(r+0.999)/1.998*pw2;
        ctx.fillText(r,px,oh2+ph2+14);
        ctx.strokeStyle="#1e293b"; ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(px,oh2+ph2);ctx.lineTo(px,oh2+ph2+4);ctx.stroke();
      });
      ctx.fillText("correlación ρ",ox2+pw2/2,oh2+ph2+28);

      // Etiquetas eje y (log κ)
      ctx.textAlign="right";
      [1,10,100,1000].forEach(k=>{
        const logK=Math.log10(k);
        const py=oh2+ph2-Math.min(logK/logKappaMax,1)*ph2*0.9;
        if(py>oh2&&py<oh2+ph2){
          ctx.fillText(`κ=${k}`,ox2-4,py+4);
          ctx.strokeStyle="#1e293b"; ctx.lineWidth=1;
          ctx.beginPath();ctx.moveTo(ox2-3,py);ctx.lineTo(ox2,py);ctx.stroke();
        }
      });

      ctx.fillStyle="#e2e8f0"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
      ctx.fillText("κ(X) vs. correlación entre features",ox2+pw2/2,oh2-10);
      ctx.fillStyle=SLATE; ctx.font="9px sans-serif";
      ctx.fillText("κ grande → features casi LD → regresión inestable",ox2+pw2/2,H-20);
    }

  },[mode,v1x,v1y,v2x,v2y,v3x,v3y,show3rd,corrVal]);

  const btnStyle=(active)=>({
    flex:1,padding:"5px 0",borderRadius:6,fontSize:11,cursor:"pointer",
    border:active?"1.5px solid #60a5fa":"1.5px solid #1e293b",
    background:active?"#1e3a5f":"#0f172a",
    color:active?"#60a5fa":"#475569",transition:"all .2s",
  });

  const sl=(label,val,setter,min,max,step,color=BLUE)=>(
    <div className="viz-ctrl" style={{marginTop:4}}>
      <span style={{color:"#475569",fontSize:11,minWidth:90}}>{label}={val.toFixed(2)}</span>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e=>setter(Number(e.target.value))} style={{flex:1,accentColor:color}}/>
    </div>
  );

  return(
    <div className="viz-box">
      <canvas ref={canvasRef} width={W} height={H}
        style={{display:"block",width:"100%",borderRadius:8,background:BG}}/>

      <div className="viz-ctrl" style={{marginTop:8,gap:5}}>
        {MODES.map((m,i)=>(
          <button key={i} onClick={()=>setMode(i)} style={btnStyle(mode===i)}>{m}</button>
        ))}
      </div>

      {(mode===0||mode===1)&&<>
        {sl("v₁x",v1x,setV1x,-3,3,0.1,BLUE)}
        {sl("v₁y",v1y,setV1y,-3,3,0.1,BLUE)}
        {sl("v₂x",v2x,setV2x,-3,3,0.1,GREEN)}
        {sl("v₂y",v2y,setV2y,-3,3,0.1,GREEN)}
        {mode===0&&<>
          <div className="viz-ctrl" style={{marginTop:6}}>
            <button onClick={()=>setShow3rd(s=>!s)} style={{...btnStyle(show3rd),flex:"none",padding:"4px 14px"}}>
              {show3rd?"Ocultar v₃":"+ Añadir v₃"}
            </button>
          </div>
          {show3rd&&<>
            {sl("v₃x",v3x,setV3x,-3,3,0.1,ORANGE)}
            {sl("v₃y",v3y,setV3y,-3,3,0.1,ORANGE)}
          </>}
        </>}
      </>}

      {mode===2&&(
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569",fontSize:11,minWidth:100}}>ρ = {corrVal.toFixed(3)}</span>
          <input type="range" min={-0.999} max={0.999} step={0.001} value={corrVal}
            onChange={e=>setCorrVal(Number(e.target.value))} style={{flex:1,accentColor:YELLOW}}/>
          <span style={{color:Math.abs(corrVal)>0.9?RED:GREEN,fontSize:10,minWidth:120,textAlign:"right"}}>
            {Math.abs(corrVal)>0.95?"⚠ casi LD":Math.abs(corrVal)>0.8?"mal cond.":"bien cond."}
          </span>
        </div>
      )}
    </div>
  );
}
