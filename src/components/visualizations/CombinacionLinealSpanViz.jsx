import React, { useRef, useState, useEffect } from "react";

export default function CombinacionLinealSpanViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]   = useState(0); // 0=span 2D, 1=consistencia Ax=b, 2=atención convexa
  const [a1x, setA1x]     = useState(2);
  const [a1y, setA1y]     = useState(0.5);
  const [a2x, setA2x]     = useState(0.5);
  const [a2y, setA2y]     = useState(2);
  const [c1, setC1]       = useState(0.8);
  const [c2, setC2]       = useState(0.6);
  const [nTokens, setNTokens] = useState(5);
  const [focusToken, setFocusToken] = useState(0);

  const W = 680, H = 370;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const MODES = ["Span en ℝ²", "Consistencia Ax=b", "Atención: comb. convexa"];

  // ── Helpers canvas ────────────────────────────────────────────────────────
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

  const drawArrow = (ctx,ox,oy,dx,dy,color,lw=2.5,label="",loff=[8,-10]) => {
    const angle=Math.atan2(dy,dx);
    ctx.strokeStyle=color; ctx.lineWidth=lw;
    ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox+dx,oy+dy);ctx.stroke();
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(ox+dx,oy+dy);
    ctx.lineTo(ox+dx-10*Math.cos(angle-0.4),oy+dy-10*Math.sin(angle-0.4));
    ctx.lineTo(ox+dx-10*Math.cos(angle+0.4),oy+dy-10*Math.sin(angle+0.4));
    ctx.closePath();ctx.fill();
    if(label){
      ctx.fillStyle=color; ctx.font="bold 12px monospace"; ctx.textAlign="left";
      ctx.fillText(label,ox+dx+loff[0],oy+dy+loff[1]);
    }
  };

  // ── Softmax ───────────────────────────────────────────────────────────────
  const softmax = (arr) => {
    const m=Math.max(...arr);
    const e=arr.map(x=>Math.exp(x-m));
    const s=e.reduce((a,b)=>a+b,0);
    return e.map(x=>x/s);
  };

  // ── RNG ───────────────────────────────────────────────────────────────────
  const lcg = (seed) => {
    let s=seed|0;
    return ()=>{ s=(s*1664525+1013904223)|0; return ((s>>>0)/0xffffffff)*2-1; };
  };

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);

    // ══════════════════════════════════════════════════════════════════════
    // MODO 0 — Span en ℝ²: barrido visual del span
    // ══════════════════════════════════════════════════════════════════════
    if(mode===0){
      const cx=W/2, cy=H/2+10, sc=50;
      drawGrid(ctx,cx,cy,sc);
      drawAxes(ctx,cx,cy,sc);

      const v1=[a1x,a1y], v2=[a2x,a2y];

      // Detectar si son paralelos (determinante ≈ 0)
      const det=v1[0]*v2[1]-v1[1]*v2[0];
      const paralelos=Math.abs(det)<0.05;

      // SPAN como región sombreada
      if(!paralelos){
        // Span = ℝ² → sombrear todo con gradiente radial
        const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)/2);
        grad.addColorStop(0,BLUE+"22");
        grad.addColorStop(1,BLUE+"05");
        ctx.fillStyle=grad;
        ctx.fillRect(28,14,W-42,H-28);
        ctx.fillStyle=BLUE+"55"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
        ctx.fillText("span(v₁,v₂) = ℝ²  (todo el plano)", cx, 30);
      } else {
        // Span = recta (dirección de v1)
        const norm=Math.hypot(...v1)+1e-9;
        const dir=[v1[0]/norm, v1[1]/norm];
        const T=10;
        // Traza la recta
        ctx.strokeStyle=BLUE+"66"; ctx.lineWidth=3;
        ctx.beginPath();
        ctx.moveTo(cx-dir[0]*T*sc, cy+dir[1]*T*sc);
        ctx.lineTo(cx+dir[0]*T*sc, cy-dir[1]*T*sc);
        ctx.stroke();
        ctx.fillStyle=BLUE+"aa"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
        ctx.fillText("span(v₁,v₂) = recta  (vectores paralelos)", cx, 30);
      }

      // Combinación lineal: w = c1·v1 + c2·v2
      const wx=c1*v1[0]+c2*v2[0], wy=c1*v1[1]+c2*v2[1];

      // Líneas punteadas desde origen hasta c1·v1 y luego hasta w
      const m1x=c1*v1[0], m1y=c1*v1[1];
      ctx.strokeStyle=BLUE+"55"; ctx.lineWidth=1; ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(cx+m1x*sc,cy-m1y*sc);ctx.lineTo(cx+wx*sc,cy-wy*sc);ctx.stroke();
      ctx.strokeStyle=GREEN+"55";
      ctx.beginPath();ctx.moveTo(cx+c2*v2[0]*sc,cy-c2*v2[1]*sc);ctx.lineTo(cx+wx*sc,cy-wy*sc);ctx.stroke();
      ctx.setLineDash([]);

      // Escalados c1·v1 y c2·v2
      if(Math.abs(c1)>0.05) drawArrow(ctx,cx,cy,m1x*sc,-m1y*sc,BLUE+"88",1.5,`${c1.toFixed(1)}v₁`);
      if(Math.abs(c2)>0.05) drawArrow(ctx,cx,cy,c2*v2[0]*sc,-c2*v2[1]*sc,GREEN+"88",1.5,`${c2.toFixed(1)}v₂`);

      // Vectores base v1, v2
      drawArrow(ctx,cx,cy,v1[0]*sc,-v1[1]*sc,BLUE,2.5,"v₁",[6,-10]);
      drawArrow(ctx,cx,cy,v2[0]*sc,-v2[1]*sc,GREEN,2.5,"v₂",[6,-10]);

      // Vector combinación w
      if(Math.hypot(wx,wy)>0.05){
        ctx.shadowColor=YELLOW; ctx.shadowBlur=10;
        drawArrow(ctx,cx,cy,wx*sc,-wy*sc,YELLOW,3,"w=c₁v₁+c₂v₂",[6,-10]);
        ctx.shadowBlur=0;
      }

      // Panel info
      ctx.fillStyle="#0f172a"; ctx.fillRect(16,16,220,66);
      ctx.strokeStyle=YELLOW+"44"; ctx.lineWidth=1; ctx.strokeRect(16,16,220,66);
      ctx.fillStyle="#94a3b8"; ctx.font="10px monospace"; ctx.textAlign="left";
      ctx.fillText(`v₁=(${v1[0].toFixed(1)},${v1[1].toFixed(1)})`, 26, 34);
      ctx.fillText(`v₂=(${v2[0].toFixed(1)},${v2[1].toFixed(1)})`, 26, 48);
      ctx.fillStyle=YELLOW; ctx.font="bold 10px monospace";
      ctx.fillText(`w = ${c1.toFixed(2)}v₁ + ${c2.toFixed(2)}v₂ = (${wx.toFixed(3)},${wy.toFixed(3)})`, 26, 64);
      ctx.fillStyle=paralelos?RED:GREEN; ctx.font="bold 10px sans-serif";
      ctx.fillText(paralelos?"det=0 → span=recta":
        `det=${det.toFixed(2)} ≠ 0 → span=ℝ²`, 26, 78);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 1 — Consistencia Ax=b
    // ══════════════════════════════════════════════════════════════════════
    if(mode===1){
      const cx=W/2, cy=H/2+10, sc=50;
      drawGrid(ctx,cx,cy,sc);
      drawAxes(ctx,cx,cy,sc);

      const v1=[a1x,a1y], v2=[a2x,a2y];

      // Target b = punto de destino (combinación c1·v1+c2·v2 con algunos c)
      // Dejamos que el usuario controle b indirectamente via c1, c2
      // b "objetivo" es el vector (c1+0.5)*v1 + (c2-0.3)*v2 (ligeramente fuera del span a veces)
      const bx=(c1+0.5)*v1[0]+(c2-0.3)*v2[0];
      const by=(c1+0.5)*v1[1]+(c2-0.3)*v2[1];

      // Calcular si b ∈ span(v1,v2)
      const A=[[v1[0],v2[0]],[v1[1],v2[1]]];
      const det=A[0][0]*A[1][1]-A[0][1]*A[1][0];
      const enSpan=Math.abs(det)>0.05; // span = ℝ² si det≠0, todo está en él

      // Si span≠ℝ², proyectamos b sobre el span de v1
      let bProyX=bx, bProyY=by;
      if(!enSpan){
        const norm2=v1[0]**2+v1[1]**2;
        const coef=(bx*v1[0]+by*v1[1])/(norm2+1e-12);
        bProyX=coef*v1[0]; bProyY=coef*v1[1];
      }
      const residuo=Math.hypot(bx-bProyX, by-bProyY);

      // Span sombreado
      if(Math.abs(det)>0.05){
        const g=ctx.createRadialGradient(cx,cy,0,cx,cy,300);
        g.addColorStop(0,BLUE+"20");g.addColorStop(1,BLUE+"05");
        ctx.fillStyle=g;ctx.fillRect(28,14,W-42,H-28);
      } else {
        const n=Math.hypot(...v1)+1e-9;
        const d=[v1[0]/n,v1[1]/n];
        ctx.strokeStyle=BLUE+"55"; ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(cx-d[0]*10*sc,cy+d[1]*10*sc);ctx.lineTo(cx+d[0]*10*sc,cy-d[1]*10*sc);ctx.stroke();
      }

      // Vectores base
      drawArrow(ctx,cx,cy,v1[0]*sc,-v1[1]*sc,BLUE,2,"v₁",[5,-8]);
      drawArrow(ctx,cx,cy,v2[0]*sc,-v2[1]*sc,GREEN,2,"v₂",[5,-8]);

      // b objetivo
      ctx.shadowColor=YELLOW; ctx.shadowBlur=10;
      drawArrow(ctx,cx,cy,bx*sc,-by*sc,YELLOW,2.5,"b",[6,-10]);
      ctx.shadowBlur=0;

      if(!enSpan && residuo>0.1){
        // Proyección de b sobre el span
        ctx.strokeStyle=RED+"88"; ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
        ctx.beginPath();ctx.moveTo(cx+bx*sc,cy-by*sc);ctx.lineTo(cx+bProyX*sc,cy-bProyY*sc);ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle=RED+"cc";
        ctx.beginPath();ctx.arc(cx+bProyX*sc,cy-bProyY*sc,5,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=RED; ctx.font="bold 10px sans-serif"; ctx.textAlign="center";
        ctx.fillText(`proj(b)`,cx+bProyX*sc,cy-bProyY*sc-10);
      }

      // Panel
      const inSpan=enSpan||(residuo<0.05);
      ctx.fillStyle="#0f172a"; ctx.fillRect(16,16,240,80);
      ctx.strokeStyle=(inSpan?GREEN:RED)+"55"; ctx.lineWidth=1; ctx.strokeRect(16,16,240,80);
      ctx.fillStyle="#94a3b8"; ctx.font="10px monospace"; ctx.textAlign="left";
      ctx.fillText(`b = (${bx.toFixed(2)}, ${by.toFixed(2)})`, 26, 34);
      ctx.fillText(`span(v₁,v₂) = ${Math.abs(det)>0.05?"ℝ² (rango 2)":"recta (rango 1)"}`, 26, 48);
      ctx.fillStyle=inSpan?GREEN:RED; ctx.font="bold 11px sans-serif";
      ctx.fillText(inSpan?"✓ b ∈ span → Ax=b consistente":"✗ b ∉ span → sin solución exacta", 26, 64);
      ctx.fillStyle=SLATE; ctx.font="9px sans-serif";
      ctx.fillText(inSpan?"La solución x da los coeficientes de la comb. lineal"
        :`Mínimos cuadrados: proj b sobre C(A)  (residuo=${residuo.toFixed(3)})`, 26, 78);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 2 — Atención: combinación lineal convexa de valores
    // ══════════════════════════════════════════════════════════════════════
    if(mode===2){
      const n=nTokens;
      const rng=lcg(n*17+focusToken*31+7);

      // Posiciones de tokens en el 'espacio de valores' (2D para visualizar)
      const tokenPos=Array.from({length:n},()=>({
        x:(rng()*3), y:(rng()*3),
      }));

      // Scores de atención (simulados: token focusToken atiende a todos)
      const rawScores=tokenPos.map((_,j)=>{
        const dx=tokenPos[focusToken].x-tokenPos[j].x;
        const dy=tokenPos[focusToken].y-tokenPos[j].y;
        return -(dx*dx+dy*dy)*0.5 + rng()*0.5;
      });
      rawScores[focusToken]+=1.5; // auto-atención alta
      const alphas=softmax(rawScores);

      // Output: combinación convexa de posiciones
      const outX=alphas.reduce((s,a,j)=>s+a*tokenPos[j].x,0);
      const outY=alphas.reduce((s,a,j)=>s+a*tokenPos[j].y,0);

      // Layout en canvas
      const cx=W/2, cy=H/2+10, sc=70;
      drawGrid(ctx,cx,cy,sc);
      drawAxes(ctx,cx,cy,sc);

      // Envolvente convexa aproximada de los tokens (para mostrar que output está dentro)
      // Simplificado: dibuja el polígono convexo
      const pts=tokenPos.map(p=>[cx+p.x*sc,cy-p.y*sc]);
      const hull=pts.slice().sort(([ax],[bx])=>ax-bx);
      ctx.fillStyle=BLUE+"0a"; ctx.strokeStyle=BLUE+"33"; ctx.lineWidth=1;
      if(hull.length>2){
        ctx.beginPath();ctx.moveTo(hull[0][0],hull[0][1]);
        hull.forEach(([x,y])=>ctx.lineTo(x,y));
        ctx.closePath();ctx.fill();ctx.stroke();
      }

      const tokenColors=[BLUE,GREEN,YELLOW,ORANGE,PURPLE,RED,`#38bdf8`];

      // Flechas ponderadas desde cada token al output
      alphas.forEach((a,j)=>{
        if(a<0.02) return;
        const tx=cx+tokenPos[j].x*sc, ty=cy-tokenPos[j].y*sc;
        const ox2=cx+outX*sc, oy2=cy-outY*sc;
        const col=tokenColors[j%tokenColors.length];
        ctx.strokeStyle=col+Math.round(a*255).toString(16).padStart(2,"0");
        ctx.lineWidth=a*5;
        ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(ox2,oy2);ctx.stroke();
      });

      // Tokens
      alphas.forEach((a,j)=>{
        const tx=cx+tokenPos[j].x*sc, ty=cy-tokenPos[j].y*sc;
        const col=tokenColors[j%tokenColors.length];
        const r=6+a*14;
        ctx.shadowColor=col; ctx.shadowBlur=j===focusToken?12:4;
        ctx.fillStyle=col+(j===focusToken?"":"88");
        ctx.beginPath();ctx.arc(tx,ty,r,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;
        ctx.fillStyle=j===focusToken?"#e2e8f0":"#64748b";
        ctx.font=`${j===focusToken?"bold ":""}10px monospace`;
        ctx.textAlign="center";
        ctx.fillText(`t${j}`,tx,ty+4);
        // Peso alpha
        ctx.fillStyle=col; ctx.font="9px monospace";
        ctx.fillText(`α=${a.toFixed(3)}`,tx,ty-r-4);
      });

      // Punto output (combinación convexa)
      const ox2=cx+outX*sc, oy2=cy-outY*sc;
      ctx.shadowColor=YELLOW; ctx.shadowBlur=16;
      ctx.fillStyle=YELLOW;
      ctx.beginPath();ctx.arc(ox2,oy2,9,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
      ctx.fillStyle=YELLOW; ctx.font="bold 11px monospace"; ctx.textAlign="left";
      ctx.fillText(`o = Σαⱼvⱼ`,ox2+12,oy2-4);
      ctx.fillStyle="#94a3b8"; ctx.font="9px monospace";
      ctx.fillText(`(${outX.toFixed(3)}, ${outY.toFixed(3)})`,ox2+12,oy2+10);

      // Panel
      ctx.fillStyle="#0f172a"; ctx.fillRect(16,16,240,76);
      ctx.strokeStyle=YELLOW+"44"; ctx.lineWidth=1; ctx.strokeRect(16,16,240,76);
      ctx.fillStyle="#e2e8f0"; ctx.font="bold 11px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`Query: token t${focusToken}`, 26, 34);
      ctx.fillStyle="#94a3b8"; ctx.font="10px monospace";
      ctx.fillText(`Pesos α: [${alphas.map(a=>a.toFixed(2)).join(", ")}]`, 26, 50);
      ctx.fillText(`Σαⱼ = ${alphas.reduce((a,b)=>a+b).toFixed(5)}`, 26, 64);
      ctx.fillStyle=GREEN; ctx.font="9px sans-serif";
      ctx.fillText("o ∈ envolvente convexa de {vⱼ} ⊂ span({vⱼ})", 26, 78);
    }

  },[mode,a1x,a1y,a2x,a2y,c1,c2,nTokens,focusToken]);

  const btnStyle=(active)=>({
    flex:1,padding:"5px 0",borderRadius:6,fontSize:11,cursor:"pointer",
    border:active?"1.5px solid #60a5fa":"1.5px solid #1e293b",
    background:active?"#1e3a5f":"#0f172a",
    color:active?"#60a5fa":"#475569",transition:"all .2s",
  });

  const sl=(label,val,setter,min,max,step,color=BLUE)=>(
    <div className="viz-ctrl" style={{marginTop:4}}>
      <span style={{color:"#475569",fontSize:11,minWidth:90}}>{label} = {val.toFixed(2)}</span>
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
        {sl("v₁x",a1x,setA1x,-3,3,0.1,BLUE)}
        {sl("v₁y",a1y,setA1y,-3,3,0.1,BLUE)}
        {sl("v₂x",a2x,setA2x,-3,3,0.1,GREEN)}
        {sl("v₂y",a2y,setA2y,-3,3,0.1,GREEN)}
        {sl("c₁",c1,setC1,-2,2,0.05,YELLOW)}
        {sl("c₂",c2,setC2,-2,2,0.05,YELLOW)}
      </>}

      {mode===2&&<>
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569",fontSize:11,minWidth:100}}>Tokens n = {nTokens}</span>
          <input type="range" min={2} max={7} step={1} value={nTokens}
            onChange={e=>{ setNTokens(Number(e.target.value)); setFocusToken(0); }}
            style={{flex:1,accentColor:BLUE}}/>
        </div>
        <div className="viz-ctrl" style={{marginTop:4}}>
          <span style={{color:"#475569",fontSize:11,minWidth:100}}>Query = t{focusToken}</span>
          <input type="range" min={0} max={nTokens-1} step={1} value={focusToken}
            onChange={e=>setFocusToken(Number(e.target.value))}
            style={{flex:1,accentColor:YELLOW}}/>
        </div>
      </>}
    </div>
  );
}
