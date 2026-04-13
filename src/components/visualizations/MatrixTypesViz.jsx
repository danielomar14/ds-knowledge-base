import { useRef, useState, useEffect } from "react";

function MatrixTypesViz() {
  const canvasRef = useRef(null);
  const [matType, setMatType] = useState("identity");
  const [d1, setD1] = useState(2.0);
  const [d2, setD2] = useState(0.5);
  const [angle, setAngle] = useState(30);
  const [showGrid, setShowGrid] = useState(true);
  const [showEigen, setShowEigen] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const S = 72;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    const scx = x => cx + x * S;
    const scy = y => cy - y * S;
    const r2d = d => d * Math.PI / 180;

    // ── Construir la matriz 2×2 según tipo ───────────────────────────────
    let A, label, eigenInfo;
    const rad = r2d(angle);
    const c = Math.cos(rad), s_a = Math.sin(rad);

    if (matType === "identity") {
      A = [[1,0],[0,1]];
      label = "I₂ = [[1,0],[0,1]]";
      eigenInfo = { vals:[1,1], vecs:[[1,0],[0,1]], color:["#60a5fa","#34d399"] };
    } else if (matType === "diagonal") {
      A = [[d1,0],[0,d2]];
      label = `D = diag(${d1.toFixed(1)}, ${d2.toFixed(1)})`;
      eigenInfo = { vals:[d1,d2], vecs:[[1,0],[0,1]], color:["#60a5fa","#34d399"] };
    } else if (matType === "symmetric") {
      // A = R(θ) D R(θ)ᵀ — simétrica con eigenvectores rotados
      // A = [[d1c²+d2s², (d1-d2)cs],[( d1-d2)cs, d1s²+d2c²]]
      const a11 = d1*c*c + d2*s_a*s_a;
      const a12 = (d1-d2)*c*s_a;
      const a22 = d1*s_a*s_a + d2*c*c;
      A = [[a11,a12],[a12,a22]];
      label = `S = [[${a11.toFixed(2)}, ${a12.toFixed(2)}],[${a12.toFixed(2)}, ${a22.toFixed(2)}]]`;
      eigenInfo = {
        vals: [d1, d2],
        vecs: [[c, s_a], [-s_a, c]],
        color: ["#a78bfa","#fbbf24"]
      };
    }

    // Aplicar transformación A a un conjunto de puntos del círculo unitario
    const N = 120;
    const circle = Array.from({length: N+1}, (_,k) => {
      const t = (k/N)*2*Math.PI;
      return [Math.cos(t), Math.sin(t)];
    });
    const transformed = circle.map(([x,y]) => [
      A[0][0]*x + A[0][1]*y,
      A[1][0]*x + A[1][1]*y
    ]);

    // ── Grid transformado ─────────────────────────────────────────────────
    if (showGrid) {
      const gridLines = [];
      for (let i=-3; i<=3; i++) {
        gridLines.push({ pts: [[-3,i],[3,i]], dir:"h" });
        gridLines.push({ pts: [[i,-3],[i,3]], dir:"v" });
      }
      gridLines.forEach(({ pts }) => {
        const tPts = pts.map(([x,y]) => [
          A[0][0]*x + A[0][1]*y,
          A[1][0]*x + A[1][1]*y
        ]);
        ctx.strokeStyle = "rgba(71,85,105,0.22)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(scx(tPts[0][0]), scy(tPts[0][1]));
        ctx.lineTo(scx(tPts[1][0]), scy(tPts[1][1]));
        ctx.stroke();
      });
    }

    // Grid original (referencia)
    ctx.strokeStyle = "rgba(71,85,105,0.1)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2,3]);
    for (let i=-3; i<=3; i++) {
      ctx.beginPath(); ctx.moveTo(scx(-3), scy(i)); ctx.lineTo(scx(3), scy(i)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(scx(i), scy(-3)); ctx.lineTo(scx(i), scy(3)); ctx.stroke();
    }
    ctx.setLineDash([]);

    // Ejes
    ctx.strokeStyle = "rgba(100,116,139,0.45)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,H); ctx.stroke();

    // ── Círculo original ──────────────────────────────────────────────────
    ctx.strokeStyle = "rgba(100,116,139,0.25)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3,4]);
    ctx.beginPath();
    circle.forEach(([x,y],k) => k===0 ? ctx.moveTo(scx(x),scy(y)) : ctx.lineTo(scx(x),scy(y)));
    ctx.closePath(); ctx.stroke();
    ctx.setLineDash([]);

    // ── Elipse transformada ───────────────────────────────────────────────
    const elipseColor = matType==="identity"  ? "#60a5fa"
                      : matType==="diagonal"  ? "#34d399"
                      :                         "#a78bfa";
    ctx.strokeStyle = elipseColor;
    ctx.lineWidth = 2.2;
    ctx.fillStyle = elipseColor.replace(")", ",0.07)").replace("rgb","rgba");
    ctx.beginPath();
    transformed.forEach(([x,y],k) => k===0 ? ctx.moveTo(scx(x),scy(y)) : ctx.lineTo(scx(x),scy(y)));
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // ── Vectores canónicos transformados ─────────────────────────────────
    const arrow = (x1,y1,x2,y2,color,lw=2.5,label="",lo=[10,-8]) => {
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

    // Ae₁, Ae₂ (columnas de A)
    arrow(cx,cy, scx(A[0][0]),scy(A[1][0]), "#f87171", 2.5, "Ae₁");
    arrow(cx,cy, scx(A[0][1]),scy(A[1][1]), "#fbbf24", 2.5, "Ae₂", [-38,-8]);

    // ── Eigenvectores (si aplica) ─────────────────────────────────────────
    if (showEigen && eigenInfo) {
      eigenInfo.vecs.forEach(([ex,ey], i) => {
        const lam = eigenInfo.vals[i];
        const col = eigenInfo.color[i];
        // Eigenvector (dirección)
        ctx.strokeStyle = col.replace(")", ",0.5)").replace("rgb","rgba");
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4,3]);
        const ext = 3.2;
        ctx.beginPath();
        ctx.moveTo(scx(-ext*ex), scy(-ext*ey));
        ctx.lineTo(scx( ext*ex), scy( ext*ey));
        ctx.stroke();
        ctx.setLineDash([]);

        // Vector escalado por eigenvalor
        arrow(cx,cy, scx(lam*ex),scy(lam*ey), col, 2.2,
          `λ${i+1}=${lam.toFixed(1)}`, [8,-6]);
      });
    }

    // Origen
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath(); ctx.arc(cx,cy,3.5,0,Math.PI*2); ctx.fill();

    // ── Panel de info ─────────────────────────────────────────────────────
    const pw=230, ph=matType==="symmetric"?100:84, px=10, py=10;
    ctx.fillStyle = "rgba(11,18,32,0.92)";
    ctx.beginPath(); ctx.roundRect(px,py,pw,ph,8); ctx.fill();
    ctx.strokeStyle = elipseColor;
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.roundRect(px,py,pw,ph,8); ctx.stroke();

    ctx.font = "11px 'JetBrains Mono', monospace";
    const detA = A[0][0]*A[1][1] - A[0][1]*A[1][0];
    const trA  = A[0][0] + A[1][1];
    const info = [
      { t: label,                            c: elipseColor },
      { t: `det(A) = ${detA.toFixed(4)}`,   c: "#94a3b8"   },
      { t: `tr(A)  = ${trA.toFixed(4)}`,    c: "#94a3b8"   },
      { t: `λ₁=${eigenInfo.vals[0].toFixed(2)}, λ₂=${eigenInfo.vals[1].toFixed(2)}`, c:"#a78bfa" },
    ];
    if (matType==="symmetric") {
      info.push({ t:`A = Aᵀ ✓`, c:"#34d399" });
    }
    info.forEach(({t,c},i) => {
      ctx.fillStyle = c;
      ctx.fillText(t, px+12, py+20+i*18);
    });

    // Leyenda
    const ley = [
      { c:"rgba(100,116,139,0.5)", t:"Círculo unitario (entrada)", dash:true },
      { c:elipseColor,             t:"Imagen A·S¹ (salida)",       dash:false },
      { c:"#f87171",               t:"Ae₁ (col. 1 de A)",          dash:false },
      { c:"#fbbf24",               t:"Ae₂ (col. 2 de A)",          dash:false },
    ];
    const lx=12, ly=H-90;
    ctx.fillStyle="rgba(11,18,32,0.82)";
    ctx.beginPath(); ctx.roundRect(lx,ly,215,80,7); ctx.fill();
    ctx.font="10px 'JetBrains Mono', monospace";
    ley.forEach(({c,t,dash},i)=>{
      ctx.strokeStyle=c; ctx.lineWidth=1.5;
      if(dash) ctx.setLineDash([4,3]);
      ctx.beginPath(); ctx.moveTo(lx+10,ly+14+i*17); ctx.lineTo(lx+30,ly+14+i*17); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle="#94a3b8"; ctx.fillText(t,lx+36,ly+18+i*17);
    });

  }, [matType, d1, d2, angle, showGrid, showEigen]);

  const btnStyle = (active, col="#3b82f6") => ({
    padding:"5px 12px", borderRadius:6, border:"none", cursor:"pointer",
    fontSize:11, fontFamily:"'JetBrains Mono', monospace",
    background: active ? col : "rgba(51,65,85,0.6)",
    color: active ? "#fff" : "#94a3b8", transition:"all 0.15s", flexShrink:0,
  });

  const sliderRow = (label, val, setter, min, max, step, color, fmt=v=>v.toFixed(1)) => (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ color:"#64748b", fontSize:11, width:160, flexShrink:0 }}>
        {label}: <span style={{color}}>{fmt(val)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e=>setter(Number(e.target.value))}
        style={{ flex:1, accentColor:color }} />
    </div>
  );

  return (
    <div className="viz-box" style={{ fontFamily:"'JetBrains Mono', monospace" }}>
      <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
        <button style={btnStyle(matType==="identity",  "#3b82f6")} onClick={()=>setMatType("identity")}>Identidad I</button>
        <button style={btnStyle(matType==="diagonal",  "#10b981")} onClick={()=>setMatType("diagonal")}>Diagonal D</button>
        <button style={btnStyle(matType==="symmetric", "#8b5cf6")} onClick={()=>setMatType("symmetric")}>Simétrica S</button>
      </div>

      <canvas ref={canvasRef} width={520} height={420}
        style={{ width:"100%", borderRadius:10, display:"block" }} />

      <div style={{ marginTop:8, fontSize:11, color:"#475569", lineHeight:1.5 }}>
        La elipse muestra cómo A transforma el círculo unitario. Las flechas rojas/amarillas
        son las columnas de A (imágenes de e₁, e₂). Las líneas de colores son los eigenvectores.
      </div>

      <div className="viz-ctrl" style={{ display:"flex", flexDirection:"column", gap:8, marginTop:10 }}>
        {matType !== "identity" && (<>
          {sliderRow("λ₁ / d₁", d1, setD1, -3, 3, 0.1, "#60a5fa")}
          {sliderRow("λ₂ / d₂", d2, setD2, -3, 3, 0.1, "#34d399")}
        </>)}
        {matType === "symmetric" &&
          sliderRow("ángulo eigenvectores", angle, setAngle, 0, 180, 2, "#a78bfa", v=>`${v}°`)
        }
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:2 }}>
          <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
            <input type="checkbox" checked={showGrid}
              onChange={e=>setShowGrid(e.target.checked)}
              style={{ accentColor:"#475569" }}/>
            <span style={{ color:"#94a3b8", fontSize:11 }}>Grid transformado</span>
          </label>
          <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
            <input type="checkbox" checked={showEigen}
              onChange={e=>setShowEigen(e.target.checked)}
              style={{ accentColor:"#a78bfa" }}/>
            <span style={{ color:"#94a3b8", fontSize:11 }}>Eigenvectores</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default MatrixTypesViz;
