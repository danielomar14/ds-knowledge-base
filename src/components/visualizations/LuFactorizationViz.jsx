import { useRef, useState, useEffect } from "react";

function LuFactorizationViz() {
  const canvasRef = useRef(null);
  const [mode,   setMode]   = useState("decomp");  // "decomp" | "solve" | "cost"
  const [preset, setPreset] = useState(0);
  const [solStep,setSolStep] = useState(0);         // 0=Pb, 1=Ly=Pb, 2=Ux=y

  // Matrices 3×3 de ejemplo
  const presets = [
    {
      name: "General",
      A: [[4,3,2],[2,4,1],[1,2,3]],
      b: [10,9,8],
    },
    {
      name: "Requiere pivoteo",
      A: [[0,2,1],[4,1,3],[2,3,2]],
      b: [5,9,8],
    },
    {
      name: "SPD (Cholesky)",
      A: [[4,2,1],[2,5,2],[1,2,6]],
      b: [7,12,10],
    },
  ];

  const { A: A0, b: b0, name: pName } = presets[preset];

  // Factorización LU manual 3×3 con pivoteo parcial
  const computeLU = (A, b) => {
    const n = 3;
    let U = A.map(r=>[...r.map(Number)]);
    let L = [[1,0,0],[0,1,0],[0,0,1]];
    let P = [[1,0,0],[0,1,0],[0,0,1]];
    let perm = [0,1,2];
    let ns = 0;
    const steps = [];

    steps.push({ label:"A inicial", U:U.map(r=>[...r]), L:L.map(r=>[...r]), P:P.map(r=>[...r]), pivRow:-1, elimRow:-1, mult:null });

    for (let k=0; k<n-1; k++) {
      // Pivoteo
      let maxIdx=k;
      for(let i=k+1;i<n;i++) if(Math.abs(U[i][k])>Math.abs(U[maxIdx][k])) maxIdx=i;
      if(maxIdx!==k){
        [U[k],U[maxIdx]]=[U[maxIdx],[...U[k]]];
        [P[k],P[maxIdx]]=[P[maxIdx],[...P[k]]];
        if(k>0){[L[k],L[maxIdx]]=[L[maxIdx].map((v,j)=>j<k?v:0),[...L[k]].map((v,j)=>j<k?v:0)]; }
        ns++;
        steps.push({label:`Pivoteo: F${k+1}↔F${maxIdx+1}`,U:U.map(r=>[...r]),L:L.map(r=>[...r]),P:P.map(r=>[...r]),pivRow:k,elimRow:maxIdx,mult:null,swap:true});
      }
      // Eliminación
      for(let i=k+1;i<n;i++){
        const m=U[i][k]/U[k][k];
        L[i][k]=m;
        for(let j=k;j<n;j++) U[i][j]-=m*U[k][j];
        steps.push({label:`m${i+1}${k+1}=${m.toFixed(3)}: F${i+1}←F${i+1}−m·F${k+1}`,U:U.map(r=>[...r]),L:L.map(r=>[...r]),P:P.map(r=>[...r]),pivRow:k,elimRow:i,mult:m,swap:false});
      }
    }
    steps.push({label:"PA=LU completa ✓",U:U.map(r=>[...r]),L:L.map(r=>[...r]),P:P.map(r=>[...r]),pivRow:-1,elimRow:-1,mult:null,done:true});

    // Resolver Ax=b
    const Pb = [0,0,0];
    for(let i=0;i<n;i++) for(let j=0;j<n;j++) Pb[i]+=P[i][j]*b[j];
    const y=[0,0,0];
    for(let i=0;i<n;i++){ y[i]=Pb[i]; for(let j=0;j<i;j++) y[i]-=L[i][j]*y[j]; }
    const x=[0,0,0];
    for(let i=n-1;i>=0;i--){ x[i]=y[i]; for(let j=i+1;j<n;j++) x[i]-=U[i][j]*x[j]; x[i]/=U[i][i]; }

    return { steps, L, U, P, Pb, y, x, ns };
  };

  const lu = computeLU(A0, b0);
  const [luStep, setLuStep] = useState(0);
  const curLUStep = Math.min(luStep, lu.steps.length-1);
  const gs = lu.steps[curLUStep];

  useEffect(()=>{ setLuStep(0); setSolStep(0); }, [preset]);

  useEffect(()=>{
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d");
    const W=canvas.width, H=canvas.height;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#0b1220"; ctx.fillRect(0,0,W,H);
    if(mode==="decomp") drawDecomp(ctx,W,H);
    else if(mode==="solve") drawSolve(ctx,W,H);
    else drawCost(ctx,W,H);
  }, [mode, luStep, solStep, preset, curLUStep, gs]);

  // ── Helpers de dibujo ────────────────────────────────────────────────────
  const drawMatrix3x3 = (ctx, M, x0, y0, cw, ch, label, labelColor, hilightRow=-1, hilightCol=-1, hilightColor="#60a5fa", isL=false) => {
    // Corchetes
    ctx.strokeStyle="rgba(100,116,139,0.45)"; ctx.lineWidth=1.8;
    const bL=x0-10, bR=x0+3*cw+10, bT=y0-6, bB=y0+3*ch+6;
    ctx.beginPath(); ctx.moveTo(bL+7,bT); ctx.lineTo(bL,bT); ctx.lineTo(bL,bB); ctx.lineTo(bL+7,bB); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(bR-7,bT); ctx.lineTo(bR,bT); ctx.lineTo(bR,bB); ctx.lineTo(bR-7,bB); ctx.stroke();

    // Label de matriz
    if(label){
      ctx.fillStyle=labelColor||"#94a3b8"; ctx.font="bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign="center";
      ctx.fillText(label, x0+3*cw/2, y0-14);
      ctx.textAlign="left";
    }

    // Celdas
    M.forEach((row,i)=>{
      row.forEach((val,j)=>{
        const cx2=x0+j*cw+cw/2, cy2=y0+i*ch+ch/2;
        const isHR=i===hilightRow, isHC=j===hilightCol;
        const isZero=Math.abs(val)<1e-9;
        const isLower=isL&&j>i, isUpper=!isL&&j<i;

        // Fondo pivot/elim
        if(isHR&&isHC){
          ctx.fillStyle="rgba(96,165,250,0.2)";
          ctx.beginPath(); ctx.roundRect(cx2-cw/2+2,cy2-ch/2+2,cw-4,ch-4,4); ctx.fill();
        } else if(isHR){
          ctx.fillStyle="rgba(52,211,153,0.08)";
          ctx.fillRect(x0,cy2-ch/2,3*cw,ch);
        }

        // Triángulo L (parte "oculta")
        const color = isZero||isLower||isUpper ? "rgba(100,116,139,0.25)"
                    : isHR && isHC ? "#fbbf24"
                    : isHR        ? hilightColor
                    : "#94a3b8";

        ctx.fillStyle=color;
        ctx.font=`${(isHR&&isHC)?"bold ":""}12px 'JetBrains Mono', monospace`;
        ctx.textAlign="center";
        ctx.fillText(isZero?"0":Number(val).toFixed(2), cx2, cy2+4);
      });
    });
    ctx.textAlign="left";
  };

  function drawDecomp(ctx,W,H){
    const cw=54, ch=44;
    const yM=H/2-ch*1.5-8;

    // Título paso
    const sColor = gs.done?"#34d399":gs.swap?"#fbbf24":"#60a5fa";
    ctx.fillStyle=sColor; ctx.font="bold 12px 'JetBrains Mono', monospace"; ctx.textAlign="center";
    ctx.fillText(`Paso ${curLUStep+1}/${lu.steps.length}: ${gs.label}`, W/2, 24);
    ctx.textAlign="left";

    // Disposición: P | = | L | × | U
    const xP=16, xL=xP+3*cw+50, xU=xL+3*cw+50;
    const eqX1=xP+3*cw+18, eqX2=xL+3*cw+18;

    drawMatrix3x3(ctx, gs.P, xP, yM, cw, ch, "P", "#a78bfa");
    drawMatrix3x3(ctx, gs.L, xL, yM, cw, ch, "L", "#60a5fa", gs.elimRow, gs.pivRow, "#60a5fa", true);
    drawMatrix3x3(ctx, gs.U, xU, yM, cw, ch, "U", "#34d399", gs.pivRow, -1, "#34d399");

    ctx.fillStyle="rgba(100,116,139,0.6)"; ctx.font="bold 20px monospace"; ctx.textAlign="center";
    ctx.fillText("=", eqX1+8, yM+3*ch/2+4);
    ctx.fillText("×", eqX2+8, yM+3*ch/2+4);
    ctx.textAlign="left";

    // Multiplicador badge
    if(gs.mult!==null){
      const badgeX=xL+3*cw+8, badgeY=yM+3*ch+20;
      ctx.fillStyle="rgba(11,18,32,0.9)";
      ctx.beginPath(); ctx.roundRect(8,badgeY,W-16,26,6); ctx.fill();
      ctx.strokeStyle="rgba(96,165,250,0.3)"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.roundRect(8,badgeY,W-16,26,6); ctx.stroke();
      ctx.fillStyle="#60a5fa"; ctx.font="11px 'JetBrains Mono', monospace"; ctx.textAlign="center";
      ctx.fillText(`Multiplicador: m${gs.elimRow+1}${gs.pivRow+1} = ${gs.mult.toFixed(4)} → entra en L[${gs.elimRow+1}][${gs.pivRow+1}]`, W/2, badgeY+16);
      ctx.textAlign="left";
    }

    // Verificación PA=LU cuando done
    if(gs.done){
      const mat4 = (M,N) => M.map(r=>N[0].map((_,j)=>r.reduce((s,v,k)=>s+v*N[k][j],0)));
      const LU = mat4(gs.L,gs.U);
      const PA = mat4(gs.P,A0);
      const ok = LU.every((r,i)=>r.every((v,j)=>Math.abs(v-PA[i][j])<0.001));
      ctx.fillStyle= ok?"#34d399":"#f87171"; ctx.font="bold 12px 'JetBrains Mono', monospace"; ctx.textAlign="center";
      ctx.fillText(`PA = LU ${ok?"✓ verificado":"✗ error"}`, W/2, yM+3*ch+54);
      ctx.fillStyle="#94a3b8"; ctx.font="10px 'JetBrains Mono', monospace";
      ctx.fillText(`det(A) = ${lu.ns%2===0?"+":"-"}(${lu.U.map(r=>r[lu.U.indexOf(r)]).map((v,i)=>lu.U[i][i].toFixed(2)).join("×")}) = ${((-1)**lu.ns * lu.U.reduce((p,r,i)=>p*r[i],1)).toFixed(3)}`, W/2, yM+3*ch+72);
      ctx.textAlign="left";
    }

    // Progreso dots
    const dX=W/2-(lu.steps.length-1)*9, dY=H-14;
    lu.steps.forEach((_,i)=>{
      ctx.fillStyle=i===curLUStep?"#60a5fa":i<curLUStep?"rgba(96,165,250,0.4)":"rgba(71,85,105,0.4)";
      ctx.beginPath(); ctx.arc(dX+i*18,dY,i===curLUStep?5:3,0,Math.PI*2); ctx.fill();
    });
  }

  function drawSolve(ctx,W,H){
    const stages=[
      { label:"Ax=b  →  PA=LU  →  LUx=Pb", sub:"Reorganizar con P", color:"#a78bfa" },
      { label:"Ly = Pb  (sustitución hacia adelante)", sub:"Resolver sistema triangular inferior", color:"#60a5fa" },
      { label:"Ux = y  (sustitución hacia atrás)", sub:"Resolver sistema triangular superior", color:"#34d399" },
    ];
    const s=Math.min(solStep,2);
    const stage=stages[s];

    ctx.fillStyle=stage.color; ctx.font="bold 13px 'JetBrains Mono', monospace"; ctx.textAlign="center";
    ctx.fillText(stage.label, W/2, 26);
    ctx.fillStyle="#64748b"; ctx.font="11px 'JetBrains Mono', monospace";
    ctx.fillText(stage.sub, W/2, 44);
    ctx.textAlign="left";

    const cw=54, ch=44, yM=70;
    const fmtV=v=>Math.abs(v)<1e-9?"0.000":Number(v).toFixed(3);

    if(s===0){
      // Mostrar P, b → Pb
      drawMatrix3x3(ctx,lu.P, 12,yM,cw,ch,"P","#a78bfa");
      ctx.fillStyle="#94a3b8"; ctx.font="14px monospace"; ctx.textAlign="center"; ctx.fillText("×",12+3*cw+14,yM+ch*1.5+4);
      // b como columna
      ctx.fillStyle="#fbbf24"; ctx.font="bold 12px 'JetBrains Mono', monospace"; ctx.textAlign="center";
      ctx.fillText("b", 12+3*cw+60, yM-14);
      b0.forEach((v,i)=>{
        ctx.fillStyle="#fbbf24"; ctx.font="12px 'JetBrains Mono', monospace";
        ctx.fillText(fmtV(v), 12+3*cw+44, yM+i*ch+ch/2+4);
      });
      ctx.fillText("=",12+3*cw+96,yM+ch*1.5+4);
      ctx.fillStyle="#a78bfa"; ctx.font="bold 12px 'JetBrains Mono', monospace";
      ctx.fillText("Pb", 12+3*cw+130,yM-14);
      lu.Pb.forEach((v,i)=>{
        ctx.fillStyle="#a78bfa"; ctx.font="12px 'JetBrains Mono', monospace";
        ctx.fillText(fmtV(v), 12+3*cw+114, yM+i*ch+ch/2+4);
      });
      ctx.textAlign="left";
    } else if(s===1){
      // Ly=Pb
      drawMatrix3x3(ctx,lu.L,12,yM,cw,ch,"L","#60a5fa",undefined,undefined,undefined,true);
      ctx.fillStyle="#94a3b8"; ctx.font="14px monospace"; ctx.textAlign="center"; ctx.fillText("×",12+3*cw+12,yM+ch*1.5+4);
      const solX=12+3*cw+44;
      ctx.fillStyle="#60a5fa"; ctx.font="bold 12px 'JetBrains Mono', monospace"; ctx.textAlign="center";
      ctx.fillText("y",solX+14,yM-14);
      lu.y.forEach((v,i)=>{
        ctx.fillStyle="#60a5fa"; ctx.font="12px monospace";
        ctx.fillText(fmtV(v),solX,yM+i*ch+ch/2+4);
      });
      ctx.fillText("=",solX+44,yM+ch*1.5+4);
      ctx.fillStyle="#a78bfa"; ctx.font="bold 12px monospace"; ctx.textAlign="center";
      ctx.fillText("Pb",solX+78,yM-14);
      lu.Pb.forEach((v,i)=>{
        ctx.fillStyle="#a78bfa"; ctx.font="12px monospace";
        ctx.fillText(fmtV(v),solX+60,yM+i*ch+ch/2+4);
      });
      ctx.textAlign="left";
    } else {
      // Ux=y
      drawMatrix3x3(ctx,lu.U,12,yM,cw,ch,"U","#34d399");
      ctx.fillStyle="#94a3b8"; ctx.font="14px monospace"; ctx.textAlign="center"; ctx.fillText("×",12+3*cw+12,yM+ch*1.5+4);
      const solX=12+3*cw+44;
      ctx.fillStyle="#34d399"; ctx.font="bold 12px 'JetBrains Mono', monospace"; ctx.textAlign="center";
      ctx.fillText("x",solX+14,yM-14);
      lu.x.forEach((v,i)=>{
        ctx.fillStyle="#34d399"; ctx.font="bold 13px monospace";
        ctx.fillText(fmtV(v),solX,yM+i*ch+ch/2+4);
      });
      ctx.fillText("=",solX+44,yM+ch*1.5+4);
      ctx.fillStyle="#60a5fa"; ctx.font="bold 12px monospace"; ctx.textAlign="center";
      ctx.fillText("y",solX+78,yM-14);
      lu.y.forEach((v,i)=>{
        ctx.fillStyle="#60a5fa"; ctx.font="12px monospace";
        ctx.fillText(fmtV(v),solX+60,yM+i*ch+ch/2+4);
      });
      ctx.textAlign="left";

      // Verificación
      const resNorm=Math.sqrt(A0.reduce((s,row,i)=>{
        const ax=row.reduce((ss,v,j)=>ss+v*lu.x[j],0);
        return s+(ax-b0[i])**2;
      },0));
      ctx.fillStyle="#34d399"; ctx.font="bold 12px 'JetBrains Mono', monospace"; ctx.textAlign="center";
      ctx.fillText(`‖Ax−b‖ = ${resNorm.toExponential(2)}  ✓`, W/2, yM+3*ch+30);
      ctx.fillStyle="#94a3b8"; ctx.font="11px monospace";
      ctx.fillText(`x = (${lu.x.map(v=>v.toFixed(4)).join(",  ")})`, W/2, yM+3*ch+50);
      ctx.textAlign="left";
    }

    // Botones de etapa visual
    const stageY=H-52;
    stages.forEach((st,i)=>{
      const active=i===s;
      ctx.fillStyle=active?st.color:"rgba(51,65,85,0.7)";
      ctx.beginPath(); ctx.roundRect(12+i*(W-24)/3+4,stageY,(W-24)/3-8,32,6); ctx.fill();
      ctx.fillStyle=active?"#fff":"#64748b"; ctx.font="10px 'JetBrains Mono', monospace"; ctx.textAlign="center";
      ctx.fillText(["1. Pb","2. Ly=Pb","3. Ux=y"][i], 12+i*(W-24)/3+(W-24)/6, stageY+21);
    });
    ctx.textAlign="left";
  }

  function drawCost(ctx,W,H){
    const padL=58,padR=16,padT=52,padB=48;
    const pw=W-padL-padR, ph=H-padT-padB;
    const nMax=400;

    ctx.strokeStyle="rgba(100,116,139,0.4)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(padL,padT); ctx.lineTo(padL,padT+ph); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padL,padT+ph); ctx.lineTo(padL+pw,padT+ph); ctx.stroke();

    ctx.fillStyle="#64748b"; ctx.font="11px 'JetBrains Mono', monospace"; ctx.textAlign="center";
    ctx.fillText("n", padL+pw/2, padT+ph+34);
    ctx.save(); ctx.translate(16,padT+ph/2); ctx.rotate(-Math.PI/2);
    ctx.fillText("FLOPs", 0, 0); ctx.restore();

    const ns=Array.from({length:60},(_,i)=>Math.round(5+i*nMax/60));
    const fmax=(2/3)*nMax**3*1.05;
    const toXY=(n,f)=>[padL+(n/nMax)*pw, padT+ph-(Math.min(f,fmax)/fmax)*ph];

    const curves=[
      {fn:n=>(2/3)*n**3, c:"#60a5fa", lbl:"LU: ⅔n³", dash:[]},
      {fn:n=>(1/3)*n**3, c:"#34d399", lbl:"Cholesky: ⅓n³ (SPD)", dash:[5,4]},
      {fn:n=>2*n**2,     c:"#fbbf24", lbl:"Sustitución: 2n²", dash:[3,4]},
      {fn:n=>n**3,       c:"#f87171", lbl:"Inversión: n³", dash:[6,3]},
    ];
    curves.forEach(({fn,c,dash})=>{
      ctx.strokeStyle=c; ctx.lineWidth=2; ctx.setLineDash(dash);
      ctx.beginPath();
      ns.forEach((n,k)=>{ const [x,y]=toXY(n,fn(n)); k===0?ctx.moveTo(x,y):ctx.lineTo(x,y); });
      ctx.stroke(); ctx.setLineDash([]);
    });

    // Ticks
    [100,200,300,400].forEach(v=>{
      const [xp]=toXY(v,0);
      ctx.strokeStyle="rgba(100,116,139,0.15)"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(xp,padT); ctx.lineTo(xp,padT+ph); ctx.stroke();
      ctx.fillStyle="#64748b"; ctx.font="10px monospace"; ctx.textAlign="center";
      ctx.fillText(v,xp,padT+ph+16);
    });

    // Leyenda
    curves.forEach(({c,lbl,dash},i)=>{
      ctx.strokeStyle=c; ctx.lineWidth=2; ctx.setLineDash(dash);
      ctx.beginPath(); ctx.moveTo(padL+8,padT+18+i*18); ctx.lineTo(padL+30,padT+18+i*18); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle="#94a3b8"; ctx.font="10px 'JetBrains Mono', monospace"; ctx.textAlign="left";
      ctx.fillText(lbl, padL+36, padT+22+i*18);
    });

    // Badge n=100
    const nRef=100; const [xRef]=toXY(nRef,0);
    ctx.strokeStyle="rgba(100,116,139,0.3)"; ctx.lineWidth=1; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(xRef,padT); ctx.lineTo(xRef,padT+ph); ctx.stroke();
    ctx.setLineDash([]);
    const badge=[
      {c:"#60a5fa",t:`LU:   ${((2/3)*100**3/1e6).toFixed(2)}M`},
      {c:"#34d399",t:`Chol: ${((1/3)*100**3/1e6).toFixed(2)}M`},
      {c:"#fbbf24",t:`Sub:  ${(2*100**2/1e3).toFixed(1)}K`},
    ];
    ctx.fillStyle="rgba(11,18,32,0.92)";
    ctx.beginPath(); ctx.roundRect(xRef+5,padT+8,135,58,6); ctx.fill();
    badge.forEach(({c,t},i)=>{ ctx.fillStyle=c; ctx.font="10px monospace"; ctx.fillText(`n=100 → ${t}`,xRef+12,padT+24+i*17); });

    ctx.fillStyle="#94a3b8"; ctx.font="12px 'JetBrains Mono', monospace"; ctx.textAlign="center";
    ctx.fillText("Coste: Factorización LU y variantes", W/2, padT-18);
    ctx.textAlign="left";
  }

  const btnStyle=(active,col="#3b82f6")=>({
    padding:"5px 11px",borderRadius:6,border:"none",cursor:"pointer",
    fontSize:10,fontFamily:"'JetBrains Mono', monospace",
    background:active?col:"rgba(51,65,85,0.6)",
    color:active?"#fff":"#94a3b8",transition:"all 0.15s",
  });

  return (
    <div className="viz-box" style={{fontFamily:"'JetBrains Mono', monospace"}}>
      <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
        <button style={btnStyle(mode==="decomp","#3b82f6")} onClick={()=>setMode("decomp")}>PA = LU paso a paso</button>
        <button style={btnStyle(mode==="solve", "#8b5cf6")} onClick={()=>setMode("solve")}>Resolver Ax = b</button>
        <button style={btnStyle(mode==="cost",  "#10b981")} onClick={()=>setMode("cost")}>Análisis de coste</button>
      </div>

      {(mode==="decomp"||mode==="solve") && (
        <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
          {presets.map((p,i)=>(
            <button key={i} style={btnStyle(preset===i, i===2?"#10b981":i===1?"#f59e0b":"#6366f1")}
              onClick={()=>setPreset(i)}>
              {p.name}
            </button>
          ))}
        </div>
      )}

      <canvas ref={canvasRef} width={520} height={410}
        style={{width:"100%",borderRadius:10,display:"block"}}/>

      <div style={{marginTop:8,fontSize:11,color:"#475569",lineHeight:1.5}}>
        {mode==="decomp" && "L almacena los multiplicadores mᵢₖ de la eliminación. U es la forma escalonada. La factorización se reutiliza para múltiples b a coste O(n²) cada uno."}
        {mode==="solve" && "Tres etapas: (1) reordenar con P, (2) sustitución hacia adelante Ly=Pb, (3) sustitución hacia atrás Ux=y. El sistema original se resuelve sin invertir A."}
        {mode==="cost"  && "Cholesky cuesta la mitad de LU y es numéricamente superior para matrices SPD. La sustitución O(n²) es negligible frente a la factorización O(n³)."}
      </div>

      {mode==="decomp" && (
        <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10}}>
          <button onClick={()=>setLuStep(s=>Math.max(0,s-1))}
            style={{...btnStyle(false),padding:"4px 14px"}}>← Atrás</button>
          <div style={{flex:1,background:"rgba(30,41,59,0.5)",borderRadius:6,height:5,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:6,background:"#3b82f6",
              width:`${(curLUStep/(lu.steps.length-1))*100}%`,transition:"width 0.2s"}}/>
          </div>
          <button onClick={()=>setLuStep(s=>Math.min(lu.steps.length-1,s+1))}
            style={{...btnStyle(true,"#3b82f6"),padding:"4px 14px"}}>Siguiente →</button>
        </div>
      )}

      {mode==="solve" && (
        <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:10}}>
          <button onClick={()=>setSolStep(s=>Math.max(0,s-1))}
            style={{...btnStyle(false),padding:"4px 14px"}}>← Atrás</button>
          <span style={{color:"#64748b",fontSize:11,alignSelf:"center"}}>
            Etapa {solStep+1}/3
          </span>
          <button onClick={()=>setSolStep(s=>Math.min(2,s+1))}
            style={{...btnStyle(true,"#8b5cf6"),padding:"4px 14px"}}>Siguiente →</button>
        </div>
      )}
    </div>
  );
}

export default LuFactorizationViz;
