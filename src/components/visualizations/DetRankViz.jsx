import { useRef, useState, useEffect } from "react";

function DetRankViz() {
  const canvasRef = useRef(null);
  const [a11, setA11] = useState(2.0);
  const [a12, setA12] = useState(0.5);
  const [a21, setA21] = useState(0.5);
  const [a22, setA22] = useState(1.5);
  const [mode, setMode] = useState("det");   // "det" | "rank"
  const [showOrig, setShowOrig] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const S = 76;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    const A = [[a11, a12], [a21, a22]];
    const detA = a11*a22 - a12*a21;
    const rankA = (Math.abs(detA) > 1e-9) ? 2
                : (Math.abs(a11)>1e-9||Math.abs(a12)>1e-9||
                   Math.abs(a21)>1e-9||Math.abs(a22)>1e-9) ? 1 : 0;

    const scx = x => cx + x * S;
    const scy = y => cy - y * S;

    // Grid original
    if (showOrig) {
      ctx.strokeStyle = "rgba(71,85,105,0.18)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2,3]);
      for (let i=-4; i<=4; i++) {
        ctx.beginPath(); ctx.moveTo(scx(-4),scy(i)); ctx.lineTo(scx(4),scy(i)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(scx(i),scy(-4)); ctx.lineTo(scx(i),scy(4)); ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    // Grid transformado
    const tpt = ([x,y]) => [A[0][0]*x+A[0][1]*y, A[1][0]*x+A[1][1]*y];
    for (let i=-4; i<=4; i++) {
      const [tx0,ty0]=tpt([-4,i]), [tx1,ty1]=tpt([4,i]);
      const [tx2,ty2]=tpt([i,-4]), [tx3,ty3]=tpt([i,4]);
      ctx.strokeStyle="rgba(96,165,250,0.13)"; ctx.lineWidth=0.9;
      ctx.beginPath(); ctx.moveTo(scx(tx0),scy(ty0)); ctx.lineTo(scx(tx1),scy(ty1)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(scx(tx2),scy(ty2)); ctx.lineTo(scx(tx3),scy(ty3)); ctx.stroke();
    }

    // Ejes
    ctx.strokeStyle="rgba(100,116,139,0.4)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,H); ctx.stroke();

    // ── Paralelogramo (columnas de A) ─────────────────────────────────────
    const c1 = [A[0][0], A[1][0]];  // primera columna
    const c2 = [A[0][1], A[1][1]];  // segunda columna
    const tip = [c1[0]+c2[0], c1[1]+c2[1]];

    // Color del relleno según det
    const absD = Math.abs(detA);
    const fillAlpha = Math.min(0.25, absD * 0.04 + 0.04);
    const fillColor = detA > 0 ? `rgba(52,211,153,${fillAlpha})`
                    : detA < 0 ? `rgba(248,113,113,${fillAlpha})`
                    :             "rgba(100,116,139,0.05)";
    const strokeColor = detA > 0 ? "#34d399"
                      : detA < 0 ? "#f87171"
                      :             "#64748b";

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(scx(0),   scy(0));
    ctx.lineTo(scx(c1[0]),scy(c1[1]));
    ctx.lineTo(scx(tip[0]),scy(tip[1]));
    ctx.lineTo(scx(c2[0]),scy(c2[1]));
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // ── Cuadrado unitario original ─────────────────────────────────────────
    if (showOrig) {
      ctx.strokeStyle="rgba(100,116,139,0.35)"; ctx.lineWidth=1.2; ctx.setLineDash([3,3]);
      ctx.strokeRect(scx(0),scy(1),S,S);
      ctx.setLineDash([]);
      ctx.fillStyle="rgba(100,116,139,0.06)";
      ctx.fillRect(scx(0),scy(1),S,S);
    }

    // ── Flechas columnas ───────────────────────────────────────────────────
    const arrow = (x1,y1,x2,y2,color,label,lw=2.6,lo=[10,-8]) => {
      const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);
      if(len<2) return;
      const ux=dx/len,uy=dy/len,hl=12;
      ctx.strokeStyle=color; ctx.lineWidth=lw;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      ctx.fillStyle=color;
      ctx.beginPath();
      ctx.moveTo(x2,y2);
      ctx.lineTo(x2-hl*ux+hl*.38*(-uy),y2-hl*uy+hl*.38*ux);
      ctx.lineTo(x2-hl*ux-hl*.38*(-uy),y2-hl*uy-hl*.38*ux);
      ctx.closePath(); ctx.fill();
      if(label){
        ctx.fillStyle=color;
        ctx.font="bold 12px 'JetBrains Mono', monospace";
        ctx.fillText(label,x2+lo[0],y2+lo[1]);
      }
    };

    arrow(scx(0),scy(0), scx(c1[0]),scy(c1[1]), "#60a5fa","a₁");
    arrow(scx(0),scy(0), scx(c2[0]),scy(c2[1]), "#fbbf24","a₂",2.6,[-30,-8]);

    // Completar paralelogramo con líneas punteadas
    ctx.strokeStyle="rgba(148,163,184,0.3)"; ctx.lineWidth=1; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(scx(c1[0]),scy(c1[1])); ctx.lineTo(scx(tip[0]),scy(tip[1])); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(scx(c2[0]),scy(c2[1])); ctx.lineTo(scx(tip[0]),scy(tip[1])); ctx.stroke();
    ctx.setLineDash([]);

    // ── Área label en centro del paralelogramo ────────────────────────────
    const midX = scx((c1[0]+c2[0])/2);
    const midY = scy((c1[1]+c2[1])/2);
    if (absD > 0.1) {
      ctx.fillStyle = strokeColor;
      ctx.font = "bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(`|det|=${absD.toFixed(2)}`, midX, midY+5);
      ctx.textAlign = "left";
    }

    // ── Modo RANK: mostrar imagen de A (espacio columna) ──────────────────
    if (mode === "rank") {
      const N = 200;
      // Imagen: todos los A·x para x en una malla → muestra Col(A)
      if (rankA === 2) {
        // Imagen llena el plano → mostrar algunos vectores imagen
        for (let i=0; i<12; i++) {
          const th = (i/12)*2*Math.PI;
          const [ix,iy] = tpt([2*Math.cos(th), 2*Math.sin(th)]);
          arrow(scx(0),scy(0),scx(ix),scy(iy),"rgba(167,139,250,0.3)","",1.2);
        }
      } else if (rankA === 1) {
        // Imagen es una línea: dirección de la columna no nula
        const dir = Math.abs(c1[0])+Math.abs(c1[1]) > 1e-9 ? c1 : c2;
        const norm = Math.hypot(dir[0],dir[1]);
        if (norm > 1e-9) {
          const dn = [dir[0]/norm*4, dir[1]/norm*4];
          ctx.strokeStyle="#a78bfa"; ctx.lineWidth=2.5;
          ctx.beginPath();
          ctx.moveTo(scx(-dn[0]),scy(-dn[1]));
          ctx.lineTo(scx( dn[0]),scy( dn[1]));
          ctx.stroke();
          ctx.fillStyle="#a78bfa";
          ctx.font="bold 11px 'JetBrains Mono', monospace";
          ctx.fillText("Col(A): rango 1", scx(dn[0])+6, scy(dn[1])-6);
        }
      }
    }

    // ── Panel de métricas ─────────────────────────────────────────────────
    const rankColor = rankA===2 ? "#34d399" : rankA===1 ? "#fbbf24" : "#f87171";
    const detColor  = Math.abs(detA)>1e-9 ? (detA>0?"#34d399":"#f87171") : "#64748b";

    const pw=230, ph=130, px=W-pw-10, py=10;
    ctx.fillStyle="rgba(11,18,32,0.93)";
    ctx.beginPath(); ctx.roundRect(px,py,pw,ph,8); ctx.fill();
    ctx.strokeStyle="rgba(100,116,139,0.3)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.roundRect(px,py,pw,ph,8); ctx.stroke();

    const trA = a11+a22;
    const info = [
      { label:"det(A)",        val: detA.toFixed(5),          color: detColor  },
      { label:"|det| = área",  val: absD.toFixed(5),           color:"#94a3b8"  },
      { label:"tr(A) = Σλᵢ",  val: trA.toFixed(4),            color:"#94a3b8"  },
      { label:"rank(A)",       val: `${rankA}`,                color: rankColor },
      { label:"nullity(A)",    val: `${2-rankA}`,              color:"#94a3b8"  },
      { label:"invertible",    val: Math.abs(detA)>1e-9?"sí":"no", color: detColor },
      { label:"orientación",   val: detA>1e-9?"+1 (preserva)":detA<-1e-9?"-1 (invierte)":"colapso", color:detColor },
    ];
    ctx.font="11px 'JetBrains Mono', monospace";
    info.forEach(({label,val,color},i)=>{
      ctx.fillStyle="#475569"; ctx.fillText(label+":", px+12, py+20+i*16);
      ctx.fillStyle=color;     ctx.fillText(val, px+130, py+20+i*16);
    });

    // ── Leyenda ───────────────────────────────────────────────────────────
    const ley=[
      {c:"rgba(100,116,139,0.4)", t:"cuadrado unitario (orig.)", dash:true},
      {c:strokeColor,             t:`paralelogramo (área=${absD.toFixed(2)})`, dash:false},
      {c:"#60a5fa",               t:"a₁ = col 1 de A", dash:false},
      {c:"#fbbf24",               t:"a₂ = col 2 de A", dash:false},
    ];
    const lx=10, ly=H-80;
    ctx.fillStyle="rgba(11,18,32,0.82)";
    ctx.beginPath(); ctx.roundRect(lx,ly,220,72,7); ctx.fill();
    ctx.font="10px 'JetBrains Mono', monospace";
    ley.forEach(({c,t,dash},i)=>{
      ctx.strokeStyle=c; ctx.lineWidth=1.5;
      if(dash) ctx.setLineDash([4,3]);
      ctx.beginPath(); ctx.moveTo(lx+10,ly+13+i*16); ctx.lineTo(lx+30,ly+13+i*16); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle="#94a3b8"; ctx.fillText(t,lx+36,ly+17+i*16);
    });

    // Origen
    ctx.fillStyle="#94a3b8";
    ctx.beginPath(); ctx.arc(scx(0),scy(0),3.5,0,Math.PI*2); ctx.fill();

  }, [a11,a12,a21,a22,mode,showOrig]);

  const btnStyle = (active, col="#3b82f6") => ({
    padding:"5px 14px", borderRadius:6, border:"none", cursor:"pointer",
    fontSize:11, fontFamily:"'JetBrains Mono', monospace",
    background: active ? col : "rgba(51,65,85,0.6)",
    color: active ? "#fff" : "#94a3b8", transition:"all 0.15s",
  });

  const sliderRow = (label, val, setter, color) => (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ color:"#64748b", fontSize:11, width:60, flexShrink:0 }}>
        {label}: <span style={{color}}>{val.toFixed(1)}</span>
      </span>
      <input type="range" min={-3} max={3} step={0.1} value={val}
        onChange={e=>setter(Number(e.target.value))}
        style={{ flex:1, accentColor:color }} />
    </div>
  );

  return (
    <div className="viz-box" style={{ fontFamily:"'JetBrains Mono', monospace" }}>
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <button style={btnStyle(mode==="det",  "#10b981")} onClick={()=>setMode("det")}>Determinante / Área</button>
        <button style={btnStyle(mode==="rank", "#8b5cf6")} onClick={()=>setMode("rank")}>Rango / Espacio Col.</button>
      </div>

      <canvas ref={canvasRef} width={520} height={430}
        style={{ width:"100%", borderRadius:10, display:"block" }} />

      <div style={{ marginTop:8, fontSize:11, color:"#475569", lineHeight:1.5 }}>
        El paralelogramo (verde/rojo) muestra el área = |det(A)|. Verde = orientación preservada,
        rojo = invertida. Arrastra las entradas hacia valores dependientes para ver det→0 y rank→1.
      </div>

      <div className="viz-ctrl" style={{ display:"flex", gap:12, marginTop:10, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:200, display:"flex", flexDirection:"column", gap:7 }}>
          <span style={{ color:"#60a5fa", fontSize:11, fontWeight:"bold" }}>Columna a₁</span>
          {sliderRow("a₁₁", a11, setA11, "#60a5fa")}
          {sliderRow("a₂₁", a21, setA21, "#60a5fa")}
        </div>
        <div style={{ flex:1, minWidth:200, display:"flex", flexDirection:"column", gap:7 }}>
          <span style={{ color:"#fbbf24", fontSize:11, fontWeight:"bold" }}>Columna a₂</span>
          {sliderRow("a₁₂", a12, setA12, "#fbbf24")}
          {sliderRow("a₂₂", a22, setA22, "#fbbf24")}
        </div>
      </div>

      <div style={{ marginTop:10 }}>
        <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
          <input type="checkbox" checked={showOrig}
            onChange={e=>setShowOrig(e.target.checked)}
            style={{ accentColor:"#64748b" }}/>
          <span style={{ color:"#94a3b8", fontSize:11 }}>Mostrar cuadrado unitario original</span>
        </label>
      </div>
    </div>
  );
}

export default DetRankViz;
