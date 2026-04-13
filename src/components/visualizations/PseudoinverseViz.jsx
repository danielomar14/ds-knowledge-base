import { useRef, useState, useEffect } from "react";

function PseudoinverseViz() {
  const canvasRef = useRef(null);
  const [mode,   setMode]   = useState("cases");  // "cases" | "ridge"
  const [bAngle, setBAngle] = useState(40);        // dirección de b
  const [bMag,   setBMag]   = useState(2.2);
  const [lambda, setLambda] = useState(0);         // slider 0-50 → λ real
  const [svCase, setSvCase] = useState("over");    // "over"|"under"|"full"

  // Singular values para modo ridge
  const sigmas = [3.0, 0.8, 0.05];

  const sliderToLam = s => s === 0 ? 0 : Math.exp((s / 50) * Math.log(20)) - 1 + 1e-4;
  const lam = sliderToLam(lambda);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    if (mode === "ridge") {
      drawRidgePanel(ctx, W, H, sigmas, lam);
    } else {
      drawCasesPanel(ctx, W, H, svCase, bAngle, bMag);
    }
  }, [mode, bAngle, bMag, lambda, svCase, lam]);

  // ── Panel RIDGE: filtro de Tikhonov por valor singular ──────────────────
  function drawRidgePanel(ctx, W, H, sigmas, lam) {
    const padL=55, padR=20, padT=50, padB=50;
    const pw = W-padL-padR, ph = H-padT-padB;
    const sigMax = 4.0;

    // Ejes
    ctx.strokeStyle="rgba(100,116,139,0.4)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(padL,padT); ctx.lineTo(padL,padT+ph); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padL,padT+ph); ctx.lineTo(padL+pw,padT+ph); ctx.stroke();

    // Etiquetas ejes
    ctx.fillStyle="#64748b"; ctx.font="11px 'JetBrains Mono', monospace";
    ctx.fillText("σᵢ", padL+pw/2, padT+ph+30);
    ctx.save(); ctx.translate(14, padT+ph/2);
    ctx.rotate(-Math.PI/2); ctx.textAlign="center";
    ctx.fillText("σᵢ/(σᵢ²+λ)  vs  1/σᵢ", 0, 0);
    ctx.restore(); ctx.textAlign="left";

    // Ticks eje x (σ)
    [0,1,2,3,4].forEach(v=>{
      const xp = padL + (v/sigMax)*pw;
      ctx.strokeStyle="rgba(100,116,139,0.2)"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(xp,padT); ctx.lineTo(xp,padT+ph); ctx.stroke();
      ctx.fillStyle="#64748b"; ctx.font="10px monospace";
      ctx.fillText(v, xp-4, padT+ph+16);
    });

    // Curva 1/σ (sin regularización)
    ctx.strokeStyle="rgba(248,113,113,0.5)"; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
    ctx.beginPath();
    let first=true;
    for (let s=0.08; s<=sigMax; s+=0.02) {
      const xp = padL + (s/sigMax)*pw;
      const yval = Math.min(1/s, 3.5);
      const yp = padT + ph - (yval/3.5)*ph;
      first ? ctx.moveTo(xp,yp) : ctx.lineTo(xp,yp);
      first=false;
    }
    ctx.stroke(); ctx.setLineDash([]);

    // Curva σ/(σ²+λ)
    ctx.strokeStyle="#34d399"; ctx.lineWidth=2.5;
    ctx.beginPath(); first=true;
    for (let s=0.01; s<=sigMax; s+=0.01) {
      const xp = padL + (s/sigMax)*pw;
      const fval = Math.min(s/(s*s+lam), 3.5);
      const yp = padT + ph - (fval/3.5)*ph;
      first ? ctx.moveTo(xp,yp) : ctx.lineTo(xp,yp);
      first=false;
    }
    ctx.stroke();

    // Punto de corte λ: σ = √λ
    if (lam > 1e-6) {
      const sqrtLam = Math.sqrt(lam);
      if (sqrtLam <= sigMax) {
        const xp = padL + (sqrtLam/sigMax)*pw;
        const yval = Math.min(sqrtLam/(sqrtLam*sqrtLam+lam), 3.5);
        const yp = padT + ph - (yval/3.5)*ph;
        ctx.strokeStyle="rgba(167,139,250,0.5)"; ctx.lineWidth=1; ctx.setLineDash([3,3]);
        ctx.beginPath(); ctx.moveTo(xp,padT); ctx.lineTo(xp,padT+ph); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle="#a78bfa";
        ctx.font="10px 'JetBrains Mono', monospace";
        ctx.fillText(`√λ=${sqrtLam.toFixed(2)}`, xp+4, padT+14);
      }
    }

    // Puntos: valores singulares con su factor de filtro
    sigmas.forEach((s,i)=>{
      const filt  = lam < 1e-8 ? 1/s : s/(s*s+lam);
      const uninv = Math.min(1/s, 3.5);
      const color = ["#60a5fa","#fbbf24","#f87171"][i];
      const xp = padL + (s/sigMax)*pw;
      const yp_filt  = padT + ph - (Math.min(filt,3.5)/3.5)*ph;
      const yp_uninv = padT + ph - (uninv/3.5)*ph;

      // Punto 1/σ (sin reg)
      ctx.strokeStyle=color; ctx.lineWidth=1;
      ctx.setLineDash([2,2]);
      ctx.beginPath(); ctx.moveTo(xp,yp_uninv); ctx.lineTo(xp,yp_filt); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle="rgba(11,18,32,0.9)"; ctx.beginPath(); ctx.arc(xp,yp_uninv,5,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle=color; ctx.lineWidth=1.5; ctx.beginPath(); ctx.arc(xp,yp_uninv,5,0,Math.PI*2); ctx.stroke();

      ctx.fillStyle=color; ctx.beginPath(); ctx.arc(xp,yp_filt,6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle="#0b1220"; ctx.font="bold 9px monospace"; ctx.textAlign="center";
      ctx.fillText(i+1, xp, yp_filt+3); ctx.textAlign="left";

      // Etiqueta
      ctx.fillStyle=color; ctx.font="10px 'JetBrains Mono', monospace";
      ctx.fillText(`σ${i+1}=${s} → f=${filt.toFixed(3)}`, padL+pw*0.52, padT+22+i*18);
    });

    // Leyenda
    const leg=[
      {c:"rgba(248,113,113,0.7)", t:"1/σ (sin regularización)", dash:true},
      {c:"#34d399",               t:"σ/(σ²+λ) (Tikhonov)",      dash:false},
    ];
    leg.forEach(({c,t,dash},i)=>{
      ctx.strokeStyle=c; ctx.lineWidth=2;
      if(dash) ctx.setLineDash([4,3]);
      ctx.beginPath(); ctx.moveTo(padL+8,padT+ph-16-i*18); ctx.lineTo(padL+28,padT+ph-16-i*18); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle="#94a3b8"; ctx.font="10px 'JetBrains Mono', monospace";
      ctx.fillText(t, padL+32, padT+ph-12-i*18);
    });

    // Título λ
    ctx.fillStyle="#fbbf24"; ctx.font="bold 12px 'JetBrains Mono', monospace";
    ctx.textAlign="center";
    ctx.fillText(`λ = ${lam < 1e-5 ? "0 (pseudoinversa exacta)" : lam.toFixed(4)}`, W/2, padT-16);
    ctx.textAlign="left";
  }

  // ── Panel CASES: los cuatro casos de Ax=b ────────────────────────────────
  function drawCasesPanel(ctx, W, H, svCase, bAngle, bMag) {
    const cx = W/2, cy = H/2;
    const S = 68;
    const scx = x => cx+x*S, scy = y => cy-y*S;

    // Grid
    ctx.strokeStyle="rgba(71,85,105,0.15)"; ctx.lineWidth=1;
    for(let i=-4;i<=4;i++){
      ctx.beginPath(); ctx.moveTo(scx(-4),scy(i)); ctx.lineTo(scx(4),scy(i)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(scx(i),scy(-4)); ctx.lineTo(scx(i),scy(4)); ctx.stroke();
    }
    ctx.strokeStyle="rgba(100,116,139,0.4)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,H); ctx.stroke();

    const rad = bAngle*Math.PI/180;
    const bx = bMag*Math.cos(rad), by = bMag*Math.sin(rad);

    const arrow=(x1,y1,x2,y2,color,lw=2.5,label="",lo=[10,-8])=>{
      const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);
      if(len<2) return;
      const ux=dx/len,uy=dy/len,hl=11;
      ctx.strokeStyle=color; ctx.lineWidth=lw;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      ctx.fillStyle=color;
      ctx.beginPath(); ctx.moveTo(x2,y2);
      ctx.lineTo(x2-hl*ux+hl*.38*(-uy),y2-hl*uy+hl*.38*ux);
      ctx.lineTo(x2-hl*ux-hl*.38*(-uy),y2-hl*uy-hl*.38*ux);
      ctx.closePath(); ctx.fill();
      if(label){ ctx.fillStyle=color; ctx.font="bold 12px 'JetBrains Mono', monospace"; ctx.fillText(label,x2+lo[0],y2+lo[1]); }
    };

    if (svCase === "full") {
      // A cuadrada invertible: A⁻¹b = x exacto
      const A = [[2,0.5],[0.3,1.5]];
      const detA = A[0][0]*A[1][1]-A[0][1]*A[1][0];
      const Ainv = [[A[1][1]/detA,-A[0][1]/detA],[-A[1][0]/detA,A[0][0]/detA]];
      const xhat = [Ainv[0][0]*bx+Ainv[0][1]*by, Ainv[1][0]*bx+Ainv[1][1]*by];
      const Axhat = [A[0][0]*xhat[0]+A[0][1]*xhat[1], A[1][0]*xhat[0]+A[1][1]*xhat[1]];

      arrow(cx,cy, scx(bx),scy(by), "#fbbf24",2.5,"b");
      arrow(cx,cy, scx(xhat[0]),scy(xhat[1]), "#34d399",2.5,"x=A⁻¹b");
      arrow(cx,cy, scx(Axhat[0]),scy(Axhat[1]),"rgba(52,211,153,0.4)",1.5,"Ax");

      ctx.fillStyle="#94a3b8"; ctx.font="11px 'JetBrains Mono', monospace";
      ctx.fillText("Ax = b exacto (solución única)", scx(-3.8), scy(3.5));
      ctx.fillStyle="#34d399";
      ctx.fillText(`x = (${xhat[0].toFixed(2)}, ${xhat[1].toFixed(2)})`, scx(-3.8), scy(3.0));

    } else if (svCase === "over") {
      // Sobredeterminado: A∈R^{3×2}, b∈R^3
      // Proyectar b sobre Col(A) — mostrar en 2D como proyección sobre línea
      const dir = [Math.cos(0.8), Math.sin(0.8)]; // dirección de Col(A) en R^2
      const proj_scalar = bx*dir[0]+by*dir[1];
      const proj = [proj_scalar*dir[0], proj_scalar*dir[1]];
      const resid = [bx-proj[0], by-proj[1]];

      // Subespacio imagen
      ctx.strokeStyle="rgba(96,165,250,0.25)"; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
      ctx.beginPath(); ctx.moveTo(scx(-3.5*dir[0]),scy(-3.5*dir[1])); ctx.lineTo(scx(3.5*dir[0]),scy(3.5*dir[1])); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle="rgba(96,165,250,0.5)"; ctx.font="11px 'JetBrains Mono', monospace";
      ctx.fillText("Col(A)", scx(3.5*dir[0])+6, scy(3.5*dir[1]));

      // Residuo (línea punteada)
      ctx.strokeStyle="rgba(248,113,113,0.6)"; ctx.lineWidth=1.5; ctx.setLineDash([3,3]);
      ctx.beginPath(); ctx.moveTo(scx(proj[0]),scy(proj[1])); ctx.lineTo(scx(bx),scy(by)); ctx.stroke();
      ctx.setLineDash([]);

      // Caja 90°
      const sqS=0.18;
      ctx.strokeStyle="rgba(248,113,113,0.5)"; ctx.lineWidth=1;
      const perp=[-dir[1],dir[0]];
      const sqA=[proj[0]+sqS*dir[0],proj[1]+sqS*dir[1]];
      const sqB=[proj[0]+sqS*dir[0]+sqS*perp[0],proj[1]+sqS*dir[1]+sqS*perp[1]];
      const sqC=[proj[0]+sqS*perp[0],proj[1]+sqS*perp[1]];
      ctx.beginPath();
      ctx.moveTo(scx(sqA[0]),scy(sqA[1])); ctx.lineTo(scx(sqB[0]),scy(sqB[1])); ctx.lineTo(scx(sqC[0]),scy(sqC[1]));
      ctx.stroke();

      arrow(cx,cy, scx(bx),scy(by), "#fbbf24",2.5,"b");
      arrow(cx,cy, scx(proj[0]),scy(proj[1]), "#60a5fa",2.8,"x̂ = A⁺b",[8,-10]);

      const residNorm = Math.sqrt(resid[0]**2+resid[1]**2);
      ctx.fillStyle="#94a3b8"; ctx.font="11px 'JetBrains Mono', monospace";
      ctx.fillText("Sobredeterminado: min ‖Ax−b‖₂", scx(-3.8),scy(3.5));
      ctx.fillStyle="#f87171";
      ctx.fillText(`‖residuo‖ = ${residNorm.toFixed(3)}`, scx(-3.8),scy(3.0));

    } else {
      // Subdeterminado: infinitas soluciones → mínima norma
      // Mostrar la familia de soluciones (línea affine) y la de mínima norma
      const dir = [Math.cos(1.1), Math.sin(1.1)]; // dirección del kernel
      const proj_scalar = bx*dir[0]+by*dir[1];
      const perp = [-dir[1], dir[0]];
      const perp_scalar = bx*perp[0]+by*perp[1];
      const x_mn = [perp_scalar*perp[0], perp_scalar*perp[1]]; // mínima norma

      // Línea de soluciones x_mn + t*dir
      ctx.strokeStyle="rgba(52,211,153,0.3)"; ctx.lineWidth=2; ctx.setLineDash([4,3]);
      ctx.beginPath();
      ctx.moveTo(scx(x_mn[0]-3*dir[0]),scy(x_mn[1]-3*dir[1]));
      ctx.lineTo(scx(x_mn[0]+3*dir[0]),scy(x_mn[1]+3*dir[1]));
      ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle="rgba(52,211,153,0.5)"; ctx.font="11px 'JetBrains Mono', monospace";
      ctx.fillText("soluciones exactas", scx(x_mn[0]+3*dir[0])-80, scy(x_mn[1]+3*dir[1])-8);

      // Perpendicular desde origen a la línea (= x de mínima norma)
      ctx.strokeStyle="rgba(167,139,250,0.4)"; ctx.lineWidth=1.2; ctx.setLineDash([3,3]);
      ctx.beginPath(); ctx.moveTo(scx(0),scy(0)); ctx.lineTo(scx(x_mn[0]),scy(x_mn[1])); ctx.stroke();
      ctx.setLineDash([]);

      arrow(cx,cy, scx(bx),scy(by), "#fbbf24",2.5,"b");
      arrow(cx,cy, scx(x_mn[0]),scy(x_mn[1]), "#a78bfa",2.8,"x̂=A⁺b (‖·‖ min)",[6,-8]);

      const mnNorm = Math.sqrt(x_mn[0]**2+x_mn[1]**2);
      ctx.fillStyle="#94a3b8"; ctx.font="11px 'JetBrains Mono', monospace";
      ctx.fillText("Subdeterminado: min ‖x‖₂ s.t. Ax=b", scx(-3.8),scy(3.5));
      ctx.fillStyle="#a78bfa";
      ctx.fillText(`‖x̂‖ mínima = ${mnNorm.toFixed(3)}`, scx(-3.8),scy(3.0));
    }

    // Origen
    ctx.fillStyle="#94a3b8"; ctx.beginPath(); ctx.arc(scx(0),scy(0),3.5,0,Math.PI*2); ctx.fill();
  }

  const btnStyle=(active,col="#3b82f6")=>({
    padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",
    fontSize:11,fontFamily:"'JetBrains Mono', monospace",
    background:active?col:"rgba(51,65,85,0.6)",
    color:active?"#fff":"#94a3b8",transition:"all 0.15s",
  });

  const sliderRow=(label,val,setter,min,max,step,color,fmt=v=>v.toFixed(1))=>(
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <span style={{color:"#64748b",fontSize:11,width:150,flexShrink:0}}>
        {label}: <span style={{color}}>{fmt(val)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e=>setter(Number(e.target.value))}
        style={{flex:1,accentColor:color}}/>
    </div>
  );

  return (
    <div className="viz-box" style={{fontFamily:"'JetBrains Mono', monospace"}}>
      <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        <button style={btnStyle(mode==="cases","#3b82f6")} onClick={()=>setMode("cases")}>Casos de Ax=b</button>
        <button style={btnStyle(mode==="ridge","#10b981")} onClick={()=>setMode("ridge")}>Filtro de Tikhonov</button>
      </div>

      {mode==="cases" && (
        <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
          <button style={btnStyle(svCase==="full", "#60a5fa")} onClick={()=>setSvCase("full")}>Cuadrada (A⁻¹)</button>
          <button style={btnStyle(svCase==="over", "#fbbf24")} onClick={()=>setSvCase("over")}>Sobredeterminado</button>
          <button style={btnStyle(svCase==="under","#a78bfa")} onClick={()=>setSvCase("under")}>Subdeterminado</button>
        </div>
      )}

      <canvas ref={canvasRef} width={520} height={400}
        style={{width:"100%",borderRadius:10,display:"block"}}/>

      <div style={{marginTop:8,fontSize:11,color:"#475569",lineHeight:1.5}}>
        {mode==="cases"
          ? "La pseudoinversa A⁺b da la solución óptima en cada caso: exacta, mínimo residuo, o mínima norma."
          : "El filtro σ/(σ²+λ) atenúa singulares pequeños (ruido) y preserva grandes (señal). λ→0 recupera la pseudoinversa exacta."}
      </div>

      <div className="viz-ctrl" style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>
        {mode==="cases" && <>
          {sliderRow("b  ángulo", bAngle, setBAngle, 0,360,3,"#fbbf24",v=>`${v}°`)}
          {sliderRow("b  magnitud", bMag, setBMag, 0.5,3.5,0.1,"#fbbf24")}
        </>}
        {mode==="ridge" &&
          sliderRow("λ (regularización)", lambda, setLambda, 0,50,0.5,"#34d399",
            ()=>lam<1e-5?"0 (A⁺)":lam.toFixed(4))
        }
      </div>
    </div>
  );
}

export default PseudoinverseViz;
