import { useRef, useState, useEffect } from "react";

function OrthogonalProjectionViz() {
  const canvasRef = useRef(null);
  const [vAngle,  setVAngle]  = useState(55);
  const [vMag,    setVMag]    = useState(2.6);
  const [uAngle,  setUAngle]  = useState(15);
  const [mode,    setMode]    = useState("vector"); // "vector" | "plane"
  const [showDec, setShowDec] = useState(true);
  const [showP,   setShowP]   = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const S = 82;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(71,85,105,0.16)";
    ctx.lineWidth = 1;
    for (let i = -5; i <= 5; i++) {
      ctx.beginPath(); ctx.moveTo(cx+i*S,0); ctx.lineTo(cx+i*S,H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,cy+i*S); ctx.lineTo(W,cy+i*S); ctx.stroke();
    }
    // Ejes
    ctx.strokeStyle = "rgba(100,116,139,0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,H); ctx.stroke();

    const r2d = d => d * Math.PI / 180;
    const scx = x => cx + x * S;
    const scy = y => cy - y * S;

    // Vectores en coords matemáticas
    const vRad = r2d(vAngle);
    const uRad = r2d(uAngle);
    const vx = vMag * Math.cos(vRad), vy = vMag * Math.sin(vRad);
    const uMag = 2.2;
    const ux = uMag * Math.cos(uRad), uy = uMag * Math.sin(uRad);

    // Proyección de v sobre span{u}
    const uNorm2 = ux*ux + uy*uy;
    const scalarProj = (vx*ux + vy*uy) / uNorm2;
    const px = scalarProj * ux, py = scalarProj * uy;   // proj_u(v)
    const rx = vx - px,         ry = vy - py;            // residuo

    const cosTheta = (vx*ux + vy*uy) / (Math.sqrt(vx*vx+vy*vy) * Math.sqrt(uNorm2));
    const theta    = Math.acos(Math.max(-1, Math.min(1, cosTheta)));

    // ── Subespacio u (línea) ───────────────────────────────────────────────
    const uLen = 4.5;
    const uDirX = ux/Math.sqrt(uNorm2), uDirY = uy/Math.sqrt(uNorm2);
    ctx.strokeStyle = "rgba(96,165,250,0.22)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5,4]);
    ctx.beginPath();
    ctx.moveTo(scx(-uLen*uDirX), scy(-uLen*uDirY));
    ctx.lineTo(scx( uLen*uDirX), scy( uLen*uDirY));
    ctx.stroke();
    ctx.setLineDash([]);

    // Etiqueta subespacio
    ctx.fillStyle = "rgba(96,165,250,0.45)";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText("span{u}", scx(uLen*uDirX*0.85)+6, scy(uLen*uDirY*0.85)-4);

    // ── Descomposición v = proj + residuo ─────────────────────────────────
    if (showDec) {
      // Residuo (v_perp): línea punteada vertical al subespacio
      ctx.strokeStyle = "rgba(251,191,36,0.55)";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4,3]);
      ctx.beginPath();
      ctx.moveTo(scx(px), scy(py));
      ctx.lineTo(scx(vx), scy(vy));
      ctx.stroke();
      ctx.setLineDash([]);

      // Caja de ángulo recto en el pie de la proyección
      const sqS = 0.18;
      const perpX = -uDirY, perpY = uDirX; // perpendicular a u
      const sqA = [px + sqS*uDirX,       py + sqS*uDirY      ];
      const sqB = [px + sqS*uDirX + sqS*perpX, py + sqS*uDirY + sqS*perpY];
      const sqC = [px + sqS*perpX,        py + sqS*perpY      ];
      ctx.strokeStyle = "rgba(251,191,36,0.7)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(scx(sqA[0]), scy(sqA[1]));
      ctx.lineTo(scx(sqB[0]), scy(sqB[1]));
      ctx.lineTo(scx(sqC[0]), scy(sqC[1]));
      ctx.stroke();

      // Flecha residuo
      const rLen = Math.sqrt(rx*rx+ry*ry);
      if (rLen > 0.05) {
        const arrow = (x1,y1,x2,y2,color,lw=2,dash=[]) => {
          const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);
          if(len<2) return;
          const ux_=dx/len,uy_=dy/len,hl=10;
          ctx.save();
          ctx.strokeStyle=color; ctx.lineWidth=lw;
          ctx.setLineDash(dash);
          ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle=color;
          ctx.beginPath();
          ctx.moveTo(x2,y2);
          ctx.lineTo(x2-hl*ux_+hl*.38*(-uy_),y2-hl*uy_+hl*.38*ux_);
          ctx.lineTo(x2-hl*ux_-hl*.38*(-uy_),y2-hl*uy_-hl*.38*ux_);
          ctx.closePath(); ctx.fill();
          ctx.restore();
        };
        // Residuo desde proyección hasta v
        arrow(scx(px),scy(py),scx(vx),scy(vy),"#fbbf24",2);
        // Etiqueta v_perp
        ctx.fillStyle="#fbbf24";
        ctx.font="11px 'JetBrains Mono', monospace";
        ctx.fillText("v⊥", scx(px+rx*0.55)+8, scy(py+ry*0.55)-6);
      }
    }

    // ── Función flecha ─────────────────────────────────────────────────────
    const arrow = (x1,y1,x2,y2,color,lw=2.8,label="",lo=[12,-8]) => {
      const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);
      if(len<2) return;
      const ux_=dx/len,uy_=dy/len,hl=13;
      ctx.strokeStyle=color; ctx.lineWidth=lw;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      ctx.fillStyle=color;
      ctx.beginPath();
      ctx.moveTo(x2,y2);
      ctx.lineTo(x2-hl*ux_+hl*.38*(-uy_),y2-hl*uy_+hl*.38*ux_);
      ctx.lineTo(x2-hl*ux_-hl*.38*(-uy_),y2-hl*uy_-hl*.38*ux_);
      ctx.closePath(); ctx.fill();
      if(label){
        ctx.fillStyle=color;
        ctx.font="bold 13px 'JetBrains Mono', monospace";
        ctx.fillText(label, x2+lo[0], y2+lo[1]);
      }
    };

    // u, v, proyección
    arrow(cx,cy, scx(ux),scy(uy), "#60a5fa", 2.8, "u");
    arrow(cx,cy, scx(vx),scy(vy), "#34d399", 2.8, "v");
    arrow(cx,cy, scx(px),scy(py), "#f87171", 2.8, "proj_u(v)", [10,-10]);

    // Punto de proyección
    ctx.fillStyle = "#f87171";
    ctx.beginPath(); ctx.arc(scx(px), scy(py), 5, 0, Math.PI*2); ctx.fill();

    // Arco del ángulo θ
    const arcR = S*0.35;
    const aStart = -r2d(uAngle);
    const aEnd   = -r2d(vAngle);
    let diff = aEnd - aStart;
    while (diff >  Math.PI) diff -= 2*Math.PI;
    while (diff < -Math.PI) diff += 2*Math.PI;
    ctx.strokeStyle = "rgba(167,139,250,0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx,cy, arcR, aStart, aStart+diff, diff<0);
    ctx.stroke();
    const midAng = aStart + diff/2;
    ctx.fillStyle = "#a78bfa";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText(`θ=${(theta*180/Math.PI).toFixed(1)}°`,
      cx+(arcR+14)*Math.cos(midAng)-12, cy+(arcR+14)*Math.sin(midAng)+4);

    // Matriz de proyección (si showP)
    if (showP) {
      const p11 = (ux*ux/uNorm2).toFixed(3);
      const p12 = (ux*uy/uNorm2).toFixed(3);
      const p22 = (uy*uy/uNorm2).toFixed(3);

      const bw=218, bh=92, bx=W-bw-10, by=10;
      ctx.fillStyle="rgba(11,18,32,0.92)";
      ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,8); ctx.fill();
      ctx.strokeStyle="rgba(248,113,113,0.45)";
      ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,8); ctx.stroke();

      ctx.font="11px 'JetBrains Mono', monospace";
      const lines=[
        { t:"P = uuᵀ/(uᵀu)",               c:"#f87171" },
        { t:`  [${p11}  ${p12}]`,            c:"#94a3b8" },
        { t:`  [${p12}  ${p22}]`,            c:"#94a3b8" },
        { t:`scalar proj = ${scalarProj.toFixed(3)}`, c:"#fbbf24" },
        { t:`‖v⊥‖ = ${Math.sqrt(rx*rx+ry*ry).toFixed(3)}`, c:"#fbbf24" },
      ];
      lines.forEach(({t,c},i)=>{ ctx.fillStyle=c; ctx.fillText(t,bx+12,by+20+i*16); });
    }

    // Origen
    ctx.fillStyle="#94a3b8";
    ctx.beginPath(); ctx.arc(cx,cy,3.5,0,Math.PI*2); ctx.fill();

    // Leyenda de descomposición
    const lx=12, ly=H-70;
    ctx.fillStyle="rgba(11,18,32,0.85)";
    ctx.beginPath(); ctx.roundRect(lx,ly,200,60,7); ctx.fill();
    ctx.font="11px 'JetBrains Mono', monospace";
    const leg=[
      {c:"#34d399", t:"v  = vector a proyectar"},
      {c:"#f87171", t:"proj_u(v) = componente ∥"},
      {c:"#fbbf24", t:"v⊥ = residuo (⊥ al subespacio)"},
    ];
    leg.forEach(({c,t},i)=>{
      ctx.fillStyle=c;
      ctx.fillRect(lx+10, ly+12+i*16, 8, 8);
      ctx.fillStyle="#94a3b8";
      ctx.fillText(t, lx+24, ly+20+i*16);
    });

  }, [vAngle, vMag, uAngle, mode, showDec, showP]);

  const btnStyle = (active, col="#3b82f6") => ({
    padding:"5px 14px", borderRadius:6, border:"none", cursor:"pointer",
    fontSize:11, fontFamily:"'JetBrains Mono', monospace",
    background: active ? col : "rgba(51,65,85,0.6)",
    color: active ? "#fff" : "#94a3b8", transition:"all 0.15s",
  });

  const sliderRow = (label, val, setter, min, max, step, color, fmt=v=>`${v}`) => (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ color:"#64748b", fontSize:11, width:150, flexShrink:0 }}>
        {label}: <span style={{color}}>{fmt(val)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e=>setter(Number(e.target.value))}
        style={{ flex:1, accentColor:color }} />
    </div>
  );

  return (
    <div className="viz-box" style={{ fontFamily:"'JetBrains Mono', monospace" }}>
      <canvas ref={canvasRef} width={520} height={420}
        style={{ width:"100%", borderRadius:10, display:"block" }} />

      <div style={{ marginTop:8, fontSize:11, color:"#475569", lineHeight:1.5 }}>
        La proyección ortogonal (rojo) es el punto de span{'{u}'} más cercano a v.
        El residuo v⊥ (amarillo) es perpendicular al subespacio — nota la caja de 90°.
      </div>

      <div className="viz-ctrl" style={{ display:"flex", flexDirection:"column", gap:8, marginTop:10 }}>
        {sliderRow("v  ángulo", vAngle, setVAngle, 0, 360, 2, "#34d399", v=>`${v}°`)}
        {sliderRow("v  magnitud", vMag,  setVMag,  0.5, 3.5, 0.1, "#34d399", v=>v.toFixed(1))}
        {sliderRow("u  ángulo (subespacio)", uAngle, setUAngle, 0, 180, 2, "#60a5fa", v=>`${v}°`)}
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:2 }}>
          <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
            <input type="checkbox" checked={showDec}
              onChange={e=>setShowDec(e.target.checked)}
              style={{ accentColor:"#fbbf24" }}/>
            <span style={{ color:"#94a3b8", fontSize:11 }}>Mostrar descomposición v = v∥ + v⊥</span>
          </label>
          <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
            <input type="checkbox" checked={showP}
              onChange={e=>setShowP(e.target.checked)}
              style={{ accentColor:"#f87171" }}/>
            <span style={{ color:"#94a3b8", fontSize:11 }}>Mostrar matriz P</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default OrthogonalProjectionViz;
