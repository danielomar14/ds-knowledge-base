import React, { useRef, useState, useEffect } from "react";

export default function EspacioSubespacioViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]     = useState(0); // 0=subespacios 2D/3D, 1=cuatro subespacios, 2=LoRA
  const [subIdx, setSubIdx] = useState(0); // tipo de subespacio (modo 0)
  const [angle1, setAngle1] = useState(30);
  const [angle2, setAngle2] = useState(120);
  const [rankVal, setRankVal] = useState(2); // rango para modo 1
  const [rLora, setRLora]     = useState(4); // rango LoRA (modo 2)

  const W = 680, H = 370;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const MODES  = ["Subespacios de ℝ³", "Cuatro Subespacios", "LoRA: bajo rango"];
  const SUBS   = ["{0}: origen", "Recta (dim=1)", "Plano (dim=2)", "ℝ³ (dim=3)"];

  const drawGrid = (ctx,cx,cy,sc) => {
    ctx.strokeStyle="#0f1f35"; ctx.lineWidth=1;
    for(let x=cx%sc;x<W;x+=sc){ctx.beginPath();ctx.moveTo(x,14);ctx.lineTo(x,H-14);ctx.stroke();}
    for(let y=cy%sc;y<H;y+=sc){ctx.beginPath();ctx.moveTo(28,y);ctx.lineTo(W-14,y);ctx.stroke();}
  };

  const drawAxes2D = (ctx,cx,cy,sc) => {
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

  const arrow = (ctx,ox,oy,dx,dy,color,lw=2,label="") => {
    const angle=Math.atan2(dy,dx), len=10;
    ctx.strokeStyle=color; ctx.lineWidth=lw;
    ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(ox+dx,oy+dy);ctx.stroke();
    ctx.fillStyle=color;
    ctx.beginPath();
    ctx.moveTo(ox+dx,oy+dy);
    ctx.lineTo(ox+dx-len*Math.cos(angle-0.4),oy+dy-len*Math.sin(angle-0.4));
    ctx.lineTo(ox+dx-len*Math.cos(angle+0.4),oy+dy-len*Math.sin(angle+0.4));
    ctx.closePath();ctx.fill();
    if(label){
      ctx.fillStyle=color; ctx.font="bold 11px monospace"; ctx.textAlign="left";
      ctx.fillText(label,ox+dx+6,oy+dy-6);
    }
  };

  // ── Proyección isométrica 3D → 2D ────────────────────────────────────────
  const proj3d = (x,y,z,cx,cy,sc) => {
    const px = cx + (x-z)*sc*Math.cos(Math.PI/6)*0.9;
    const py = cy - y*sc*0.9 + (x+z)*sc*Math.sin(Math.PI/6)*0.45;
    return [px,py];
  };

  const line3d = (ctx,x1,y1,z1,x2,y2,z2,cx,cy,sc,color,lw=1.5,dash=[]) => {
    const [px1,py1]=proj3d(x1,y1,z1,cx,cy,sc);
    const [px2,py2]=proj3d(x2,y2,z2,cx,cy,sc);
    ctx.strokeStyle=color; ctx.lineWidth=lw; ctx.setLineDash(dash);
    ctx.beginPath();ctx.moveTo(px1,py1);ctx.lineTo(px2,py2);ctx.stroke();
    ctx.setLineDash([]);
  };

  const arrow3d = (ctx,x1,y1,z1,x2,y2,z2,cx,cy,sc,color,lw=2.5,label="") => {
    const [px1,py1]=proj3d(x1,y1,z1,cx,cy,sc);
    const [px2,py2]=proj3d(x2,y2,z2,cx,cy,sc);
    arrow(ctx,px1,py1,px2-px1,py2-py1,color,lw,label);
  };

  useEffect(()=>{
    const canvas=canvasRef.current;
    if(!canvas) return;
    const ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle=BG; ctx.fillRect(0,0,W,H);

    // ══════════════════════════════════════════════════════════════════════
    // MODO 0 — Subespacios de ℝ³ en vista isométrica
    // ══════════════════════════════════════════════════════════════════════
    if(mode===0){
      const cx=W/2, cy=H/2+20, sc=60;

      // Ejes 3D
      [[[0,0,0],[3,0,0],SLATE+"66","x"],
       [[0,0,0],[0,3,0],SLATE+"66","y"],
       [[0,0,0],[0,0,3],SLATE+"66","z"]].forEach(([a,b,c,l])=>{
        arrow3d(ctx,...a,...b,cx,cy,sc,c,1.2,l);
      });
      // Cuadrícula plano xz (y=0)
      for(let i=-3;i<=3;i++){
        line3d(ctx,i,0,-3,i,0,3,cx,cy,sc,SLATE+"22",1);
        line3d(ctx,-3,0,i,3,0,i,cx,cy,sc,SLATE+"22",1);
      }

      // SUBESPACIO 0: solo origen
      if(subIdx===0){
        const [ox,oy]=proj3d(0,0,0,cx,cy,sc);
        ctx.shadowColor=YELLOW; ctx.shadowBlur=16;
        ctx.fillStyle=YELLOW;
        ctx.beginPath();ctx.arc(ox,oy,8,0,Math.PI*2);ctx.fill();
        ctx.shadowBlur=0;
        ctx.fillStyle=YELLOW; ctx.font="bold 12px sans-serif"; ctx.textAlign="center";
        ctx.fillText("{0} — dim=0",ox,oy-18);
        ctx.fillStyle=SLATE; ctx.font="10px sans-serif";
        ctx.fillText("Solo el vector cero satisface los 3 axiomas trivialmente",cx,H-20);
      }

      // SUBESPACIO 1: recta por el origen
      if(subIdx===1){
        const a1=angle1*Math.PI/180, a2=angle2*Math.PI/180;
        const d=[Math.cos(a1)*Math.cos(a2), Math.sin(a1), Math.cos(a1)*Math.sin(a2)];
        const norm=Math.hypot(...d);
        const dn=d.map(x=>x/norm);
        const T=3;
        // Línea extendida
        line3d(ctx,-T*dn[0],-T*dn[1],-T*dn[2],T*dn[0],T*dn[1],T*dn[2],cx,cy,sc,BLUE,2.5);
        // Algunos vectores de la recta
        [0.5,1,1.5,2,-1,-1.8].forEach(t=>{
          const [px,py]=proj3d(t*dn[0],t*dn[1],t*dn[2],cx,cy,sc);
          ctx.fillStyle=BLUE+(t>0?"cc":"66");
          ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fill();
        });
        arrow3d(ctx,0,0,0,dn[0]*2,dn[1]*2,dn[2]*2,cx,cy,sc,BLUE,2.5,"d");
        ctx.fillStyle=BLUE; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
        ctx.fillText(`Recta: span({d}) — dim=1`, cx, 28);
        ctx.fillStyle=SLATE; ctx.font="10px sans-serif";
        ctx.fillText("Cerrada bajo + y ·  |  pasa por el origen  |  αd ∈ S ∀α",cx,H-20);
      }

      // SUBESPACIO 2: plano por el origen
      if(subIdx===2){
        // Normal al plano
        const a1=angle1*Math.PI/180;
        const n=[Math.sin(a1),Math.cos(a1),0.3];
        const nn=Math.hypot(...n); const nhat=n.map(x=>x/nn);
        // Dos vectores en el plano (ortogonales a nhat)
        const v1=[-nhat[1],nhat[0],0]; const nv1=Math.hypot(...v1);
        const u1=v1.map(x=>x/(nv1+1e-9));
        const u2=[nhat[1]*u1[2]-nhat[2]*u1[1], nhat[2]*u1[0]-nhat[0]*u1[2], nhat[0]*u1[1]-nhat[1]*u1[0]];

        // Cuadrícula del plano
        const G=2.5;
        for(let i=-3;i<=3;i++){
          const t=i*G/3;
          line3d(ctx,t*u1[0]-G*u2[0],t*u1[1]-G*u2[1],t*u1[2]-G*u2[2],
                     t*u1[0]+G*u2[0],t*u1[1]+G*u2[1],t*u1[2]+G*u2[2],cx,cy,sc,PURPLE+"44",1);
          line3d(ctx,-G*u1[0]+t*u2[0],-G*u1[1]+t*u2[1],-G*u1[2]+t*u2[2],
                      G*u1[0]+t*u2[0], G*u1[1]+t*u2[1], G*u1[2]+t*u2[2],cx,cy,sc,PURPLE+"44",1);
        }
        // Borde del plano
        const corners=[[G,G],[G,-G],[-G,-G],[-G,G],[G,G]];
        ctx.strokeStyle=PURPLE; ctx.lineWidth=1.5;
        let first=true;
        corners.forEach(([s,t])=>{
          const [px,py]=proj3d(s*u1[0]+t*u2[0],s*u1[1]+t*u2[1],s*u1[2]+t*u2[2],cx,cy,sc);
          first?ctx.beginPath():null;
          first?ctx.moveTo(px,py):ctx.lineTo(px,py);
          first=false;
        });
        ctx.stroke();
        ctx.fillStyle=PURPLE+"22";
        const cornerPts=corners.map(([s,t])=>proj3d(s*u1[0]+t*u2[0],s*u1[1]+t*u2[1],s*u1[2]+t*u2[2],cx,cy,sc));
        ctx.beginPath();cornerPts.forEach(([px,py],i)=>i===0?ctx.moveTo(px,py):ctx.lineTo(px,py));
        ctx.closePath();ctx.fill();

        // Generadores
        arrow3d(ctx,0,0,0,u1[0]*2,u1[1]*2,u1[2]*2,cx,cy,sc,BLUE,2.5,"b₁");
        arrow3d(ctx,0,0,0,u2[0]*2,u2[1]*2,u2[2]*2,cx,cy,sc,GREEN,2.5,"b₂");
        // Normal
        arrow3d(ctx,0,0,0,nhat[0]*1.5,nhat[1]*1.5,nhat[2]*1.5,cx,cy,sc,YELLOW+"88",1.5,"n");

        ctx.fillStyle=PURPLE; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
        ctx.fillText("Plano: span({b₁,b₂}) — dim=2", cx, 28);
        ctx.fillStyle=SLATE; ctx.font="10px sans-serif";
        ctx.fillText("Plano pasa por el origen  |  ℝ³ = Plano ⊕ Plano⊥  (recta de la normal)",cx,H-20);
      }

      // SUBESPACIO 3: ℝ³ entero
      if(subIdx===3){
        // Relleno del cubo completo
        ctx.fillStyle=BLUE+"0a";
        const corners3=[
          [proj3d(-3,-3,-3,cx,cy,sc)],[proj3d(3,-3,-3,cx,cy,sc)],
          [proj3d(3,3,-3,cx,cy,sc)],[proj3d(-3,3,-3,cx,cy,sc)],
        ];
        ctx.beginPath();corners3.forEach(([p],i)=>i===0?ctx.moveTo(p[0],p[1]):ctx.lineTo(p[0],p[1]));
        ctx.closePath();ctx.fill();
        // Ejes prominentes
        [[[0,0,0],[2.5,0,0],BLUE,"x"],[[0,0,0],[0,2.5,0],GREEN,"y"],[[0,0,0],[0,0,2.5],ORANGE,"z"]].forEach(([a,b,c,l])=>{
          arrow3d(ctx,...a,...b,cx,cy,sc,c,2.5,l);
        });
        ctx.fillStyle=BLUE; ctx.font="bold 12px sans-serif"; ctx.textAlign="center";
        ctx.fillText("ℝ³ — dim=3 (el espacio completo es subespacio de sí mismo)",cx,28);
        ctx.fillStyle=SLATE; ctx.font="10px sans-serif";
        ctx.fillText("Subespacios de ℝ³: {0}, rectas, planos (todos por el origen), ℝ³",cx,H-20);
      }

      // Selector de subespacios (botones visuales en canvas)
      ctx.fillStyle="#e2e8f0"; ctx.font="bold 13px sans-serif"; ctx.textAlign="center";
      ctx.fillText(`Subespacio: ${SUBS[subIdx]}`, cx, 16);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 1 — Cuatro subespacios de Strang (diagrama)
    // ══════════════════════════════════════════════════════════════════════
    if(mode===1){
      const m=5, n=6, r=Math.min(rankVal, Math.min(m,n));

      // Dos óvalos: ℝ^n (izquierda), ℝ^m (derecha)
      const ovalW=220, ovalH=H-60, ox1=50, ox2=W-50-ovalW, oy=30;
      const cx1=ox1+ovalW/2, cx2=ox2+ovalW/2, cyO=oy+ovalH/2;

      // Óvalos de fondo
      [[cx1,BLUE],[cx2,GREEN]].forEach(([cx,c],i)=>{
        ctx.fillStyle=c+"0e"; ctx.strokeStyle=c+"55"; ctx.lineWidth=2;
        ctx.beginPath();ctx.ellipse(cx,cyO,ovalW/2,ovalH/2,0,0,Math.PI*2);
        ctx.fill();ctx.stroke();
      });

      // Etiquetas de espacio
      ctx.fillStyle=BLUE+"cc"; ctx.font="bold 13px sans-serif"; ctx.textAlign="center";
      ctx.fillText(`ℝⁿ  (n=${n})`, cx1, oy+16);
      ctx.fillStyle=GREEN+"cc";
      ctx.fillText(`ℝᵐ  (m=${m})`, cx2, oy+16);

      // Subespacio fila C(Aᵀ) — dim r — en ℝⁿ (arriba)
      const frac_r = r/n;
      const frac_nr= (n-r)/n;
      const row_h = ovalH*frac_r*0.85;
      const null_h= ovalH*frac_nr*0.85;
      const row_y = cyO - row_h - null_h*0.5 + 10;
      const null_y= row_y + row_h + 4;

      // C(Aᵀ) — espacio fila
      ctx.fillStyle=BLUE+"33"; ctx.strokeStyle=BLUE+"88"; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.ellipse(cx1, row_y+row_h/2, ovalW*0.38, row_h/2+4, 0, 0, Math.PI*2);
      ctx.fill();ctx.stroke();
      ctx.fillStyle=BLUE; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
      ctx.fillText(`C(Aᵀ)`, cx1, row_y+row_h/2-6);
      ctx.fillStyle="#94a3b8"; ctx.font="9px monospace";
      ctx.fillText(`dim = r = ${r}`, cx1, row_y+row_h/2+10);

      // N(A) — espacio nulo
      ctx.fillStyle=PURPLE+"22"; ctx.strokeStyle=PURPLE+"77"; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.ellipse(cx1, null_y+null_h/2+8, ovalW*0.38, Math.max(null_h/2,8), 0, 0, Math.PI*2);
      ctx.fill();ctx.stroke();
      ctx.fillStyle=PURPLE; ctx.font="bold 11px sans-serif";
      ctx.fillText(`N(A)`, cx1, null_y+null_h/2+4);
      ctx.fillStyle="#94a3b8"; ctx.font="9px monospace";
      ctx.fillText(`dim = n−r = ${n-r}`, cx1, null_y+null_h/2+18);

      // C(A) — espacio columna
      const col_h = ovalH*r/m*0.85;
      const nul_h2= ovalH*(m-r)/m*0.85;
      const col_y = cyO - col_h - nul_h2*0.5 + 10;
      const nul_y2= col_y + col_h + 4;

      ctx.fillStyle=GREEN+"33"; ctx.strokeStyle=GREEN+"88"; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.ellipse(cx2, col_y+col_h/2, ovalW*0.38, col_h/2+4, 0, 0, Math.PI*2);
      ctx.fill();ctx.stroke();
      ctx.fillStyle=GREEN; ctx.font="bold 11px sans-serif";
      ctx.fillText(`C(A)`, cx2, col_y+col_h/2-6);
      ctx.fillStyle="#94a3b8"; ctx.font="9px monospace";
      ctx.fillText(`dim = r = ${r}`, cx2, col_y+col_h/2+10);

      // N(Aᵀ) — espacio nulo izquierdo
      ctx.fillStyle=ORANGE+"22"; ctx.strokeStyle=ORANGE+"77"; ctx.lineWidth=1.5;
      ctx.beginPath();ctx.ellipse(cx2, nul_y2+nul_h2/2+8, ovalW*0.38, Math.max(nul_h2/2,8), 0, 0, Math.PI*2);
      ctx.fill();ctx.stroke();
      ctx.fillStyle=ORANGE; ctx.font="bold 11px sans-serif";
      ctx.fillText(`N(Aᵀ)`, cx2, nul_y2+nul_h2/2+4);
      ctx.fillStyle="#94a3b8"; ctx.font="9px monospace";
      ctx.fillText(`dim = m−r = ${m-r}`, cx2, nul_y2+nul_h2/2+18);

      // Flechas A: C(Aᵀ) → C(A)  y  N(A) → {0}
      const arrowMid=(x1,y1,x2,y2,color,label)=>{
        ctx.strokeStyle=color; ctx.lineWidth=2; ctx.setLineDash([]);
        ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
        const angle=Math.atan2(y2-y1,x2-x1);
        ctx.fillStyle=color;
        ctx.beginPath();ctx.moveTo(x2,y2);
        ctx.lineTo(x2-10*Math.cos(angle-0.4),y2-10*Math.sin(angle-0.4));
        ctx.lineTo(x2-10*Math.cos(angle+0.4),y2-10*Math.sin(angle+0.4));
        ctx.closePath();ctx.fill();
        ctx.fillStyle=color; ctx.font="bold 10px sans-serif"; ctx.textAlign="center";
        ctx.fillText(label,(x1+x2)/2,(y1+y2)/2-8);
      };

      arrowMid(cx1+ovalW*0.38, row_y+row_h/2, cx2-ovalW*0.38, col_y+col_h/2, YELLOW, "A  (biyección)");
      ctx.strokeStyle=PURPLE+"66"; ctx.lineWidth=1.5; ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(cx1+ovalW*0.38, null_y+null_h/2+8);
      ctx.lineTo(cx2-ovalW*0.38, cyO+ovalH*0.3); ctx.stroke();ctx.setLineDash([]);
      const [ox0,oy0]=[(cx2-ovalW*0.38+cx1+ovalW*0.38)/2, (null_y+null_h/2+8+cyO+ovalH*0.3)/2];
      ctx.fillStyle=PURPLE; ctx.font="10px sans-serif"; ctx.textAlign="center";
      ctx.fillText("A  →  0", ox0, oy0-6);

      // Anotación ortogonalidad
      ctx.fillStyle=SLATE; ctx.font="9px monospace"; ctx.textAlign="center";
      ctx.fillText("C(Aᵀ) ⊥ N(A)", cx1, oy+ovalH-8);
      ctx.fillText("C(A) ⊥ N(Aᵀ)", cx2, oy+ovalH-8);

      // Info rango
      ctx.fillStyle="#e2e8f0"; ctx.font="bold 12px sans-serif"; ctx.textAlign="center";
      ctx.fillText(`A ∈ ℝ^{${m}×${n}},  rango r=${r}`, W/2, 22);
    }

    // ══════════════════════════════════════════════════════════════════════
    // MODO 2 — LoRA: subespacio de bajo rango
    // ══════════════════════════════════════════════════════════════════════
    if(mode===2){
      const d_in=8, d_out=8, r=Math.min(rLora, Math.min(d_in,d_out));

      // Layout: matriz W completa | ΔW = BA (bajo rango) | espectro singular
      const blockSz=Math.min(28, Math.floor((W*0.55)/d_out));
      const ox1=20, ox2=ox1+d_out*blockSz+50, oy=30;

      const drawMatrix=(ox,oy,label,vals,d_r,d_c,getColor)=>{
        ctx.fillStyle="#e2e8f0"; ctx.font="bold 11px sans-serif"; ctx.textAlign="center";
        ctx.fillText(label, ox+d_c*blockSz/2, oy-8);
        for(let i=0;i<d_r;i++) for(let j=0;j<d_c;j++){
          const v=vals[i][j];
          const [r,g,b]=getColor(v);
          ctx.fillStyle=`rgb(${r},${g},${b})`;
          ctx.fillRect(ox+j*blockSz+1,oy+i*blockSz+1,blockSz-2,blockSz-2);
        }
        ctx.strokeStyle=SLATE+"44"; ctx.lineWidth=1;
        ctx.strokeRect(ox,oy,d_c*blockSz,d_r*blockSz);
      };

      // Genera matrices reproducibles
      const seed=r*13+7;
      const lcg2=(s)=>{ let st=s; return ()=>{ st=(st*1664525+1013904223)|0; return ((st>>>0)/0xffffffff)*2-1; }; };
      const rng=lcg2(seed);
      const Amat=Array.from({length:r},()=>Array.from({length:d_in},()=>rng()*0.5));
      const Bmat=Array.from({length:d_out},()=>Array.from({length:r},()=>rng()*0.5));

      // ΔW = B @ A
      const DW=Array.from({length:d_out},(_,i)=>
        Array.from({length:d_in},(_,j)=>
          Bmat[i].reduce((s,bv,k)=>s+bv*Amat[k][j],0)
        )
      );

      // W_full (random, full rank)
      const rng2=lcg2(42);
      const Wfull=Array.from({length:d_out},()=>Array.from({length:d_in},()=>rng2()*0.3));

      const heatColor=(v,maxV=0.5)=>{
        const t=Math.max(-1,Math.min(1,v/maxV));
        if(t>0) return [Math.round(14+t*96), Math.round(22+t*165), Math.round(42+t*250)];
        else return [Math.round(14+(-t)*241), Math.round(22+(-t)*50), Math.round(42+(-t)*50)];
      };

      drawMatrix(ox1,oy,`W_full  ∈ ℝ^{${d_out}×${d_in}}  (rango=${d_out})`,
        Wfull,d_out,d_in,(v)=>heatColor(v,0.35));
      drawMatrix(ox2,oy,`ΔW = BA  ∈ ℝ^{${d_out}×${d_in}}  (rango≤${r})`,
        DW,d_out,d_in,(v)=>heatColor(v,0.35));

      // Descomposición B @ A
      const ox3=ox2+d_in*blockSz+30;
      const bSz=Math.min(22,Math.floor((W-ox3-20)/(d_in+r+2)));
      const bSzR=bSz;

      if(bSz>8){
        drawMatrix(ox3,oy,`B ∈ ℝ^{${d_out}×${r}}`,Bmat,d_out,r,(v)=>heatColor(v,0.55));
        drawMatrix(ox3+r*bSzR+20,oy,`A ∈ ℝ^{${r}×${d_in}}`,Amat,r,d_in,(v)=>heatColor(v,0.55));
        ctx.fillStyle=YELLOW; ctx.font="bold 14px sans-serif"; ctx.textAlign="center";
        ctx.fillText("×", ox3+r*bSzR+10, oy+d_out*bSz/2);
        ctx.fillStyle=SLATE; ctx.font="10px sans-serif"; ctx.textAlign="center";
        ctx.fillText("=  ΔW", ox3+r*bSzR+20+d_in*bSz/2, oy-20);
      }

      // Curva de parámetros
      const infoY=oy+d_out*blockSz+16;
      const paramsFull=d_out*d_in;
      const paramsLora=r*(d_out+d_in);
      const pct=100*paramsLora/paramsFull;

      ctx.fillStyle="#0f172a"; ctx.fillRect(ox1,infoY,ox2+d_in*blockSz-ox1,H-infoY-10);
      ctx.strokeStyle=SLATE+"33"; ctx.lineWidth=1; ctx.strokeRect(ox1,infoY,ox2+d_in*blockSz-ox1,H-infoY-10);

      ctx.fillStyle="#94a3b8"; ctx.font="10px monospace"; ctx.textAlign="left";
      ctx.fillText(`W_full:  ${paramsFull} parámetros  (${d_out}×${d_in})`, ox1+8, infoY+16);
      ctx.fillStyle=GREEN;
      ctx.fillText(`LoRA r=${r}: ${paramsLora} parámetros  (${d_out}+${d_in})×r  →  ${pct.toFixed(1)}% del total`, ox1+8, infoY+30);

      // Barra de comparación
      const barW_=(ox2+d_in*blockSz-ox1-16);
      ctx.fillStyle=BLUE+"33"; ctx.fillRect(ox1+8,infoY+38,barW_,12);
      ctx.fillStyle=GREEN+"cc"; ctx.fillRect(ox1+8,infoY+38,barW_*pct/100,12);
      ctx.fillStyle="#e2e8f0"; ctx.font="bold 10px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`${pct.toFixed(1)}% parámetros entrenables`, ox1+10, infoY+48);

      ctx.fillStyle=YELLOW; ctx.font="9px sans-serif"; ctx.textAlign="left";
      ctx.fillText(`ΔW vive en un subespacio de dim ≤ r=${r} del espacio de matrices ℝ^{${d_out}×${d_in}}`, ox1+8, infoY+62);
    }

  },[mode,subIdx,angle1,angle2,rankVal,rLora]);

  const btnStyle=(active)=>({
    flex:1, padding:"5px 0", borderRadius:6, fontSize:11, cursor:"pointer",
    border:active?"1.5px solid #60a5fa":"1.5px solid #1e293b",
    background:active?"#1e3a5f":"#0f172a",
    color:active?"#60a5fa":"#475569", transition:"all .2s",
  });

  const subBtnStyle=(active,color)=>({
    flex:1, padding:"4px 0", borderRadius:5, fontSize:10, cursor:"pointer",
    border:active?`1.5px solid ${color}`:"1.5px solid #1e293b",
    background:active?color+"22":"#0f172a",
    color:active?color:"#475569",
  });

  const subColors=[YELLOW,BLUE,PURPLE,ORANGE];

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
        <div className="viz-ctrl" style={{marginTop:6,gap:4}}>
          {SUBS.map((s,i)=>(
            <button key={i} onClick={()=>setSubIdx(i)} style={subBtnStyle(subIdx===i,subColors[i])}>
              {s}
            </button>
          ))}
        </div>
        {(subIdx===1||subIdx===2)&&(
          <div className="viz-ctrl" style={{marginTop:6}}>
            <span style={{color:"#475569",fontSize:11,minWidth:110}}>Ángulo₁ = {angle1}°</span>
            <input type="range" min={0} max={180} step={3} value={angle1}
              onChange={e=>setAngle1(Number(e.target.value))} style={{flex:1,accentColor:BLUE}}/>
            {subIdx===2&&<>
              <span style={{color:"#475569",fontSize:11,minWidth:110,marginLeft:8}}>Ángulo₂ = {angle2}°</span>
              <input type="range" min={0} max={360} step={5} value={angle2}
                onChange={e=>setAngle2(Number(e.target.value))} style={{flex:1,accentColor:PURPLE}}/>
            </>}
          </div>
        )}
      </>)}

      {mode===1&&(
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569",fontSize:11,minWidth:80}}>rango r = {rankVal}</span>
          <input type="range" min={0} max={5} step={1} value={rankVal}
            onChange={e=>setRankVal(Number(e.target.value))} style={{flex:1,accentColor:YELLOW}}/>
          <span style={{color:"#64748b",fontSize:10,minWidth:160,textAlign:"right"}}>
            C(Aᵀ)={rankVal}, N(A)={6-rankVal}, C(A)={rankVal}, N(Aᵀ)={5-rankVal}
          </span>
        </div>
      )}

      {mode===2&&(
        <div className="viz-ctrl" style={{marginTop:6}}>
          <span style={{color:"#475569",fontSize:11,minWidth:90}}>rango r = {rLora}</span>
          <input type="range" min={1} max={8} step={1} value={rLora}
            onChange={e=>setRLora(Number(e.target.value))} style={{flex:1,accentColor:GREEN}}/>
          <span style={{color:"#64748b",fontSize:10,minWidth:120,textAlign:"right"}}>
            {rLora*(8+8)} / {8*8} = {(100*rLora*(8+8)/(8*8)).toFixed(0)}% params
          </span>
        </div>
      )}
    </div>
  );
}
