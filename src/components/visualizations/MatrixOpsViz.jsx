import { useRef, useState, useEffect } from "react";

function MatrixOpsViz() {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState("product"); // "product" | "transpose" | "outer"

  // Matriz A (2×2) editable via sliders
  const [a11, setA11] = useState(2.0);
  const [a12, setA12] = useState(0.5);
  const [a21, setA21] = useState(-0.5);
  const [a22, setA22] = useState(1.5);

  // Matriz B (2×2) editable
  const [b11, setB11] = useState(1.0);
  const [b12, setB12] = useState(-1.0);
  const [b21, setBb21] = useState(0.5);
  const [b22, setB22] = useState(2.0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const S = 68;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    const A = [[a11, a12], [a21, a22]];
    const B = [[b11, b12], [b21, b22]];

    // AB, BA, Aᵀ, producto externo col1(A) × fila1(B)
    const matMul = (M, N) => [
      [M[0][0]*N[0][0]+M[0][1]*N[1][0], M[0][0]*N[0][1]+M[0][1]*N[1][1]],
      [M[1][0]*N[0][0]+M[1][1]*N[1][0], M[1][0]*N[0][1]+M[1][1]*N[1][1]],
    ];
    const AB = matMul(A, B);
    const BA = matMul(B, A);
    const AT = [[A[0][0],A[1][0]],[A[0][1],A[1][1]]];
    const BT = [[B[0][0],B[1][0]],[B[0][1],B[1][1]]];
    const ABTBTAT = matMul(BT, AT);  // (AB)ᵀ = BᵀAᵀ

    // Outer: col0(A) ⊗ row0(B)
    const u = [A[0][0], A[1][0]];
    const v = [B[0][0], B[0][1]];
    const outer = [[u[0]*v[0], u[0]*v[1]], [u[1]*v[0], u[1]*v[1]]];

    // ── Dibujar círculo unitario transformado ─────────────────────────────
    const panels = mode === "product"
      ? [
          { M: A,  label: "A",       cx: W*0.18, cy: H*0.38, color:"#60a5fa" },
          { M: B,  label: "B",       cx: W*0.5,  cy: H*0.38, color:"#34d399" },
          { M: AB, label: "AB",      cx: W*0.82, cy: H*0.38, color:"#f87171" },
          { M: BA, label: "BA",      cx: W*0.5,  cy: H*0.78, color:"#fbbf24",
            note: AB[0][0]===BA[0][0]&&AB[0][1]===BA[0][1] ? "AB=BA" : "AB≠BA" },
        ]
      : mode === "transpose"
      ? [
          { M: A,       label: "A",         cx: W*0.22, cy: H*0.4,  color:"#60a5fa" },
          { M: AT,      label: "Aᵀ",        cx: W*0.6,  cy: H*0.4,  color:"#a78bfa" },
          { M: AB,      label: "AB",         cx: W*0.22, cy: H*0.78, color:"#34d399" },
          { M: ABTBTAT, label: "(AB)ᵀ=BᵀAᵀ",cx: W*0.68, cy: H*0.78, color:"#fbbf24" },
        ]
      : [
          { M: A,     label: "A",            cx: W*0.18, cy: H*0.38, color:"#60a5fa" },
          { M: outer, label: "a₁⊗bᵀ₁ (r1)", cx: W*0.5,  cy: H*0.38, color:"#f87171" },
          { M: matMul([[A[0][1],0],[A[1][1],0]], [[0,0],[B[1][0],B[1][1]]]) ,
            label: "a₂⊗bᵀ₂ (r2)",            cx: W*0.82, cy: H*0.38, color:"#fbbf24" },
          { M: AB, label: "AB = Σaₗbᵀₗ",     cx: W*0.5,  cy: H*0.78, color:"#34d399" },
        ];

    const N_circ = 80;
    const circle = Array.from({length:N_circ+1}, (_,k)=>{
      const t=(k/N_circ)*2*Math.PI;
      return [Math.cos(t), Math.sin(t)];
    });

    const drawPanel = ({ M, label, cx, cy, color, note }) => {
      const sc = 52; // local scale
      // Transformed circle
      const tpts = circle.map(([x,y])=>[
        M[0][0]*x+M[0][1]*y,
        M[1][0]*x+M[1][1]*y
      ]);
      // Grid lines
      [-2,-1,0,1,2].forEach(i=>{
        [[[-3,i],[3,i]],[[ i,-3],[i,3]]].forEach(([[x1,y1],[x2,y2]])=>{
          const tx1=M[0][0]*x1+M[0][1]*y1, ty1=M[1][0]*x1+M[1][1]*y1;
          const tx2=M[0][0]*x2+M[0][1]*y2, ty2=M[1][0]*x2+M[1][1]*y2;
          ctx.strokeStyle="rgba(71,85,105,0.18)"; ctx.lineWidth=0.8;
          ctx.beginPath();
          ctx.moveTo(cx+tx1*sc, cy-ty1*sc);
          ctx.lineTo(cx+tx2*sc, cy-ty2*sc);
          ctx.stroke();
        });
      });
      // Ejes
      ctx.strokeStyle="rgba(100,116,139,0.3)"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(cx-sc*3,cy); ctx.lineTo(cx+sc*3,cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx,cy-sc*3); ctx.lineTo(cx,cy+sc*3); ctx.stroke();

      // Original circle
      ctx.strokeStyle="rgba(100,116,139,0.2)"; ctx.lineWidth=1;
      ctx.setLineDash([2,3]);
      ctx.beginPath();
      circle.forEach(([x,y],k)=>k===0?ctx.moveTo(cx+x*sc,cy-y*sc):ctx.lineTo(cx+x*sc,cy-y*sc));
      ctx.closePath(); ctx.stroke();
      ctx.setLineDash([]);

      // Transformed ellipse
      ctx.beginPath();
      tpts.forEach(([x,y],k)=>k===0?ctx.moveTo(cx+x*sc,cy-y*sc):ctx.lineTo(cx+x*sc,cy-y*sc));
      ctx.closePath();
      ctx.fillStyle = color.replace(")", ",0.1)").replace("rgb","rgba");
      // For hex colors, use a simpler approach:
      ctx.fillStyle = "rgba(96,165,250,0.08)";
      if (color==="#34d399") ctx.fillStyle="rgba(52,211,153,0.08)";
      if (color==="#f87171") ctx.fillStyle="rgba(248,113,113,0.08)";
      if (color==="#fbbf24") ctx.fillStyle="rgba(251,191,36,0.08)";
      if (color==="#a78bfa") ctx.fillStyle="rgba(167,139,250,0.08)";
      ctx.fill();
      ctx.strokeStyle=color; ctx.lineWidth=2;
      ctx.stroke();

      // Columnas (Ae1, Ae2)
      const arrowSm = (x1,y1,x2,y2,col,lw=1.8) => {
        const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);
        if(len<1) return;
        const ux=dx/len,uy=dy/len,hl=8;
        ctx.strokeStyle=col; ctx.lineWidth=lw;
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        ctx.fillStyle=col;
        ctx.beginPath();
        ctx.moveTo(x2,y2);
        ctx.lineTo(x2-hl*ux+hl*.38*(-uy),y2-hl*uy+hl*.38*ux);
        ctx.lineTo(x2-hl*ux-hl*.38*(-uy),y2-hl*uy-hl*.38*ux);
        ctx.closePath(); ctx.fill();
      };
      arrowSm(cx,cy, cx+M[0][0]*sc,cy-M[1][0]*sc, "#f87171");
      arrowSm(cx,cy, cx+M[0][1]*sc,cy-M[1][1]*sc, "#fbbf24");

      // Etiqueta
      ctx.fillStyle=color;
      ctx.font="bold 12px 'JetBrains Mono', monospace";
      ctx.textAlign="center";
      ctx.fillText(label, cx, cy-sc*2.0-8);

      // Matriz 2×2 numérica
      ctx.font="10px 'JetBrains Mono', monospace";
      ctx.fillStyle="rgba(148,163,184,0.85)";
      const rows = [
        `[${M[0][0].toFixed(1)}, ${M[0][1].toFixed(1)}]`,
        `[${M[1][0].toFixed(1)}, ${M[1][1].toFixed(1)}]`,
      ];
      rows.forEach((r,i)=>ctx.fillText(r, cx, cy+sc*2.0+14+i*14));

      // det
      const d = M[0][0]*M[1][1]-M[0][1]*M[1][0];
      ctx.fillStyle="rgba(100,116,139,0.7)";
      ctx.fillText(`det=${d.toFixed(2)}`, cx, cy+sc*2.0+44);

      // Nota AB≠BA
      if(note){
        ctx.fillStyle= note.includes("≠") ? "#f87171" : "#34d399";
        ctx.font="bold 11px 'JetBrains Mono', monospace";
        ctx.fillText(note, cx, cy+sc*2.0+60);
      }
      ctx.textAlign="left";
    };

    panels.forEach(drawPanel);

    // ── Flechas entre paneles (modo product) ─────────────────────────────
    if (mode === "product") {
      const arrowH = (x1,y1,x2,y2,label) => {
        ctx.strokeStyle="rgba(100,116,139,0.4)"; ctx.lineWidth=1.5;
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
        ctx.fillStyle="rgba(100,116,139,0.4)";
        const hl=8,dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);
        const ux=dx/len,uy=dy/len;
        ctx.beginPath();
        ctx.moveTo(x2,y2);
        ctx.lineTo(x2-hl*ux+hl*.38*(-uy),y2-hl*uy+hl*.38*ux);
        ctx.lineTo(x2-hl*ux-hl*.38*(-uy),y2-hl*uy-hl*.38*ux);
        ctx.closePath(); ctx.fill();
        if(label){
          ctx.fillStyle="rgba(100,116,139,0.6)";
          ctx.font="10px 'JetBrains Mono', monospace";
          ctx.fillText(label,(x1+x2)/2-10,(y1+y2)/2-6);
        }
      };
      arrowH(W*0.30, H*0.38, W*0.38, H*0.38, "×");
      arrowH(W*0.62, H*0.38, W*0.70, H*0.38, "=");
    }

    // Título del modo
    ctx.fillStyle="rgba(100,116,139,0.6)";
    ctx.font="11px 'JetBrains Mono', monospace";
    ctx.textAlign="center";
    const modeLabel = mode==="product" ? "AB vs BA (no conmutativo)"
                    : mode==="transpose" ? "Transposición: (AB)ᵀ = BᵀAᵀ"
                    : "AB como suma de productos externos (rango 1)";
    ctx.fillText(modeLabel, W/2, H-10);
    ctx.textAlign="left";

  }, [mode, a11,a12,a21,a22, b11,b12,b21,b22]);

  const btnStyle = (active, col="#3b82f6") => ({
    padding:"5px 10px", borderRadius:6, border:"none", cursor:"pointer",
    fontSize:10, fontFamily:"'JetBrains Mono', monospace",
    background: active ? col : "rgba(51,65,85,0.6)",
    color: active ? "#fff" : "#94a3b8", transition:"all 0.15s",
  });

  const sliderRow = (label, val, setter, color) => (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <span style={{ color:"#64748b", fontSize:10, width:100, flexShrink:0 }}>
        {label}: <span style={{color}}>{val.toFixed(1)}</span>
      </span>
      <input type="range" min={-3} max={3} step={0.1} value={val}
        onChange={e=>setter(Number(e.target.value))}
        style={{ flex:1, accentColor:color }} />
    </div>
  );

  return (
    <div className="viz-box" style={{ fontFamily:"'JetBrains Mono', monospace" }}>
      <div style={{ display:"flex", gap:6, marginBottom:10, flexWrap:"wrap" }}>
        <button style={btnStyle(mode==="product",   "#3b82f6")} onClick={()=>setMode("product")}>AB vs BA</button>
        <button style={btnStyle(mode==="transpose", "#8b5cf6")} onClick={()=>setMode("transpose")}>(AB)ᵀ = BᵀAᵀ</button>
        <button style={btnStyle(mode==="outer",     "#10b981")} onClick={()=>setMode("outer")}>Suma de rangos 1</button>
      </div>

      <canvas ref={canvasRef} width={520} height={460}
        style={{ width:"100%", borderRadius:10, display:"block" }} />

      <div style={{ marginTop:8, fontSize:11, color:"#475569", lineHeight:1.5 }}>
        Cada panel muestra cómo la matriz transforma el círculo unitario (línea punteada → elipse sólida).
        Las flechas roja/amarilla son las columnas de cada matriz (imágenes de e₁ y e₂).
      </div>

      <div className="viz-ctrl" style={{ display:"flex", gap:14, marginTop:10, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ color:"#60a5fa", fontSize:11, fontWeight:"bold", marginBottom:5 }}>Matriz A</div>
          {sliderRow("a₁₁", a11, setA11, "#60a5fa")}
          {sliderRow("a₁₂", a12, setA12, "#60a5fa")}
          {sliderRow("a₂₁", a21, setA21, "#60a5fa")}
          {sliderRow("a₂₂", a22, setA22, "#60a5fa")}
        </div>
        <div style={{ flex:1, minWidth:200 }}>
          <div style={{ color:"#34d399", fontSize:11, fontWeight:"bold", marginBottom:5 }}>Matriz B</div>
          {sliderRow("b₁₁", b11, setB11, "#34d399")}
          {sliderRow("b₁₂", b12, setB12, "#34d399")}
          {sliderRow("b₂₁", b21, setBb21, "#34d399")}
          {sliderRow("b₂₂", b22, setB22, "#34d399")}
        </div>
      </div>
    </div>
  );
}

export default MatrixOpsViz;
