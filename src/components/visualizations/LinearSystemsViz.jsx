import { useRef, useState, useEffect } from "react";

function LinearSystemsViz() {
  const canvasRef = useRef(null);

  // Sistema 2x2: a1x + b1y = c1 / a2x + b2y = c2
  const [a1, setA1] = useState(1.0);
  const [b1, setB1] = useState(2.0);
  const [c1, setC1] = useState(3.0);
  const [a2, setA2] = useState(2.0);
  const [b2, setB2] = useState(1.0);
  const [c2, setC2] = useState(3.0);
  const [mode, setMode] = useState("geo"); // "geo" | "gauss"
  const [step, setStep] = useState(0);    // paso de eliminación gaussiana

  // Clasificación del sistema
  const A  = [[a1, b1], [a2, b2]];
  const b  = [c1, c2];
  const detA = a1*b2 - b1*a2;
  const Ab = [[a1, b1, c1], [a2, b2, c2]];

  const rankA  = Math.abs(detA) > 1e-9 ? 2
               : (Math.abs(a1)>1e-9||Math.abs(b1)>1e-9||
                  Math.abs(a2)>1e-9||Math.abs(b2)>1e-9) ? 1 : 0;

  // rank([A|b])
  const detAb1 = a1*c2 - c1*a2;
  const detAb2 = b1*c2 - c1*b2;
  const rankAb = rankA === 2 ? 2
               : (Math.abs(detAb1) > 1e-9 || Math.abs(detAb2) > 1e-9) ? 2 : 1;

  const tipo = rankA < rankAb  ? "incompatible"
             : rankA === 2     ? "unica"
             :                   "infinitas";

  // Solución única
  const sol = tipo === "unica" ? [
    (c1*b2 - b1*c2) / detA,
    (a1*c2 - c1*a2) / detA
  ] : null;

  // Pasos de eliminación gaussiana (modo educativo)
  const gaussSteps = (() => {
    const M = [[a1, b1, c1], [a2, b2, c2]].map(r=>[...r]);
    const steps = [{ label:"Sistema inicial", M: M.map(r=>[...r]), pivot:-1 }];

    // Pivoteo
    if (Math.abs(M[1][0]) > Math.abs(M[0][0])) {
      [M[0], M[1]] = [M[1], M[0]];
      steps.push({ label:"Pivoteo (intercambiar filas)", M: M.map(r=>[...r]), pivot:0 });
    }
    if (Math.abs(M[0][0]) > 1e-9) {
      const f = M[1][0]/M[0][0];
      M[1] = M[1].map((v,i) => v - f*M[0][i]);
      steps.push({ label:`F₂ ← F₂ − (${f.toFixed(2)})·F₁`, M: M.map(r=>[...r]), pivot:1 });
    }
    if (Math.abs(M[1][1]) > 1e-9) {
      const x2 = M[1][2]/M[1][1];
      const x1 = (M[0][2]-M[0][1]*x2)/M[0][0];
      steps.push({ label:`Sustitución hacia atrás`, M: M.map(r=>[...r]), sol:[x1,x2], pivot:-1 });
    } else {
      steps.push({ label: M[1][2] > 1e-9 ? "Sin solución (fila 0=c≠0)" : "∞ soluciones (fila 0=0)", M: M.map(r=>[...r]), pivot:-1 });
    }
    return steps;
  })();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0,0,W,H);
    ctx.fillStyle="#0b1220";
    ctx.fillRect(0,0,W,H);

    if (mode === "geo") drawGeo(ctx, W, H);
    else                drawGauss(ctx, W, H);
  }, [a1,b1,c1,a2,b2,c2, mode, step, tipo, sol, detA]);

  function drawGeo(ctx, W, H) {
    const cx=W/2, cy=H/2, S=58;
    const scx=x=>cx+x*S, scy=y=>cy-y*S;

    // Grid
    ctx.strokeStyle="rgba(71,85,105,0.15)"; ctx.lineWidth=1;
    for(let i=-5;i<=5;i++){
      ctx.beginPath(); ctx.moveTo(scx(-5),scy(i)); ctx.lineTo(scx(5),scy(i)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(scx(i),scy(-5)); ctx.lineTo(scx(i),scy(5)); ctx.stroke();
    }
    ctx.strokeStyle="rgba(100,116,139,0.45)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,H); ctx.stroke();

    // Tick labels
    ctx.fillStyle="rgba(100,116,139,0.5)"; ctx.font="10px monospace";
    [-4,-3,-2,-1,1,2,3,4].forEach(i=>{
      ctx.fillText(i, scx(i)-4, cy+14);
      ctx.fillText(-i, cx+4, scy(i)+4);
    });

    // Dibujar recta ax+by=c en rango [-5,5]
    const drawLine = (a, b_, c_, color, label) => {
      let pts = [];
      if (Math.abs(b_) > 1e-9) {
        pts = [[-5,(c_-a*-5)/b_],[5,(c_-a*5)/b_]];
      } else if (Math.abs(a) > 1e-9) {
        const xc = c_/a;
        pts = [[xc,-5],[xc,5]];
      } else return;

      // Clip a viewport
      const clip = pts.filter(([x,y])=>x>=-5.5&&x<=5.5&&y>=-5.5&&y<=5.5);
      if (clip.length < 2) return;

      ctx.strokeStyle=color; ctx.lineWidth=2.5;
      ctx.beginPath(); ctx.moveTo(scx(pts[0][0]),scy(pts[0][1]));
      ctx.lineTo(scx(pts[1][0]),scy(pts[1][1])); ctx.stroke();

      // Label en borde
      const lx = Math.min(Math.max(pts[0][0],-4.5),4.5);
      const ly = b_ !== 0 ? (c_-a*lx)/b_ : 0;
      ctx.fillStyle=color; ctx.font="bold 11px 'JetBrains Mono', monospace";
      ctx.fillText(label, scx(lx)+6, scy(ly)-6);
    };

    drawLine(a1,b1,c1,"#60a5fa",`${a1.toFixed(1)}x+${b1.toFixed(1)}y=${c1.toFixed(1)}`);
    drawLine(a2,b2,c2,"#34d399",`${a2.toFixed(1)}x+${b2.toFixed(1)}y=${c2.toFixed(1)}`);

    // Solución
    if (sol) {
      const [sx,sy] = sol;
      if (Math.abs(sx)<=5 && Math.abs(sy)<=5) {
        ctx.fillStyle="#fbbf24";
        ctx.beginPath(); ctx.arc(scx(sx),scy(sy),7,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#0b1220";
        ctx.beginPath(); ctx.arc(scx(sx),scy(sy),3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#fbbf24"; ctx.font="bold 12px 'JetBrains Mono', monospace";
        ctx.fillText(`(${sx.toFixed(2)}, ${sy.toFixed(2)})`, scx(sx)+10, scy(sy)-8);
      }
    }

    // Badge
    const tipoColor = tipo==="unica" ? "#34d399" : tipo==="incompatible" ? "#f87171" : "#fbbf24";
    const tipoLabel = tipo==="unica" ? "Solución única" : tipo==="incompatible" ? "Sin solución" : "∞ soluciones";
    const bw=230, bh=90, bx=10, by=10;
    ctx.fillStyle="rgba(11,18,32,0.92)";
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,8); ctx.fill();
    ctx.strokeStyle=tipoColor; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,8); ctx.stroke();

    const info=[
      {t:tipoLabel,                              c:tipoColor},
      {t:`rank(A) = ${rankA}`,                   c:"#94a3b8"},
      {t:`rank([A|b]) = ${rankAb}`,              c:"#94a3b8"},
      {t:`det(A) = ${detA.toFixed(4)}`,           c:"#94a3b8"},
      {t:sol?`x=(${sol[0].toFixed(3)}, ${sol[1].toFixed(3)})`:"-", c:tipoColor},
    ];
    ctx.font="11px 'JetBrains Mono', monospace";
    info.forEach(({t,c},i)=>{ ctx.fillStyle=c; ctx.fillText(t,bx+12,by+20+i*16); });
  }

  function drawGauss(ctx, W, H) {
    const curStep = Math.min(step, gaussSteps.length-1);
    const gs = gaussSteps[curStep];
    const M  = gs.M;

    const padX=40, padY=50;
    const cellW=(W-2*padX)/3, cellH=52;
    const cols=["x","y","b"];
    const colColors=["#60a5fa","#34d399","#fbbf24"];

    // Título paso
    ctx.fillStyle="#94a3b8"; ctx.font="bold 13px 'JetBrains Mono', monospace";
    ctx.textAlign="center";
    ctx.fillText(`Paso ${curStep+1}/${gaussSteps.length}: ${gs.label}`,W/2,28);
    ctx.textAlign="left";

    // Encabezados columnas
    cols.forEach((col,j)=>{
      ctx.fillStyle=colColors[j]; ctx.font="bold 12px 'JetBrains Mono', monospace";
      ctx.textAlign="center";
      ctx.fillText(col, padX+j*cellW+cellW/2, padY+18);
      ctx.textAlign="left";
    });

    // Línea separadora encabezado
    ctx.strokeStyle="rgba(100,116,139,0.3)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(padX,padY+26); ctx.lineTo(W-padX,padY+26); ctx.stroke();
    // Línea divisora b
    ctx.beginPath(); ctx.moveTo(padX+2*cellW,padY+26); ctx.lineTo(padX+2*cellW,padY+26+2*cellH+20); ctx.stroke();

    // Filas
    M.forEach((row, i)=>{
      const rowY = padY+36+i*cellH;
      const isActive = gs.pivot === i;

      // Fondo fila activa
      if (isActive) {
        ctx.fillStyle="rgba(96,165,250,0.08)";
        ctx.fillRect(padX-4, rowY-4, W-2*padX+8, cellH-4);
        ctx.strokeStyle="rgba(96,165,250,0.3)"; ctx.lineWidth=1;
        ctx.beginPath(); ctx.roundRect(padX-4,rowY-4,W-2*padX+8,cellH-4,4); ctx.stroke();
      }

      row.forEach((val, j)=>{
        const cellX = padX+j*cellW+cellW/2;
        const color = j===2 ? "#fbbf24" : isActive ? "#60a5fa" : "#94a3b8";
        ctx.fillStyle=color;
        ctx.font=`${isActive?"bold ":""}14px 'JetBrains Mono', monospace`;
        ctx.textAlign="center";
        ctx.fillText(val.toFixed(4), cellX, rowY+28);
      });
      ctx.textAlign="left";

      // Label fila
      ctx.fillStyle="rgba(100,116,139,0.5)"; ctx.font="10px monospace";
      ctx.fillText(`F${i+1}`, padX-28, rowY+28);
    });

    // Flecha de operación
    if (gs.pivot >= 0) {
      const arrowY = padY+36+gs.pivot*cellH+cellH/2;
      ctx.strokeStyle="#60a5fa"; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(padX-18,arrowY-cellH/2); ctx.lineTo(padX-18,arrowY+cellH/2); ctx.stroke();
      ctx.fillStyle="#60a5fa";
      ctx.beginPath();
      ctx.moveTo(padX-18,arrowY+cellH/2);
      ctx.lineTo(padX-24,arrowY+cellH/2-8);
      ctx.lineTo(padX-12,arrowY+cellH/2-8);
      ctx.closePath(); ctx.fill();
    }

    // Resultado final
    if (gs.sol) {
      const resY = padY+36+2*cellH+30;
      ctx.fillStyle="rgba(11,18,32,0.9)";
      ctx.beginPath(); ctx.roundRect(padX,resY,W-2*padX,44,8); ctx.fill();
      ctx.strokeStyle="#34d399"; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.roundRect(padX,resY,W-2*padX,44,8); ctx.stroke();
      ctx.fillStyle="#34d399"; ctx.font="bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign="center";
      ctx.fillText(`x = ${gs.sol[0].toFixed(4)}     y = ${gs.sol[1].toFixed(4)}`, W/2, resY+18);
      ctx.fillStyle="#94a3b8"; ctx.font="11px 'JetBrains Mono', monospace";
      ctx.fillText("Solución verificada ✓", W/2, resY+34);
      ctx.textAlign="left";
    } else if (curStep===gaussSteps.length-1 && tipo!=="unica") {
      const resY = padY+36+2*cellH+30;
      const col = tipo==="incompatible"?"#f87171":"#fbbf24";
      ctx.fillStyle="rgba(11,18,32,0.9)";
      ctx.beginPath(); ctx.roundRect(padX,resY,W-2*padX,40,8); ctx.fill();
      ctx.strokeStyle=col; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.roundRect(padX,resY,W-2*padX,40,8); ctx.stroke();
      ctx.fillStyle=col; ctx.font="bold 13px 'JetBrains Mono', monospace";
      ctx.textAlign="center";
      ctx.fillText(tipo==="incompatible"?"Sistema incompatible":"Infinitas soluciones", W/2, resY+24);
      ctx.textAlign="left";
    }

    // Progreso
    const dotY = H-20;
    gaussSteps.forEach((_,i)=>{
      const active = i===curStep;
      ctx.fillStyle = active ? "#60a5fa" : "rgba(100,116,139,0.4)";
      ctx.beginPath();
      ctx.arc(W/2+(i-(gaussSteps.length-1)/2)*22, dotY, active?5:3.5, 0, Math.PI*2);
      ctx.fill();
    });
  }

  const btnStyle=(active,col="#3b82f6")=>({
    padding:"5px 14px",borderRadius:6,border:"none",cursor:"pointer",
    fontSize:11,fontFamily:"'JetBrains Mono', monospace",
    background:active?col:"rgba(51,65,85,0.6)",
    color:active?"#fff":"#94a3b8",transition:"all 0.15s",
  });

  const slRow=(label,val,setter,color)=>(
    <div style={{display:"flex",alignItems:"center",gap:6}}>
      <span style={{color:"#64748b",fontSize:10,width:65,flexShrink:0}}>
        {label}: <span style={{color}}>{val.toFixed(1)}</span>
      </span>
      <input type="range" min={-4} max={4} step={0.5} value={val}
        onChange={e=>setter(Number(e.target.value))}
        style={{flex:1,accentColor:color}}/>
    </div>
  );

  const tipoColor = tipo==="unica"?"#34d399":tipo==="incompatible"?"#f87171":"#fbbf24";

  return (
    <div className="viz-box" style={{fontFamily:"'JetBrains Mono', monospace"}}>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        <button style={btnStyle(mode==="geo",  "#3b82f6")} onClick={()=>setMode("geo")}>Geometría (R²)</button>
        <button style={btnStyle(mode==="gauss","#8b5cf6")} onClick={()=>setMode("gauss")}>Eliminación Gaussiana</button>
      </div>

      <canvas ref={canvasRef} width={520} height={420}
        style={{width:"100%",borderRadius:10,display:"block"}}/>

      <div style={{marginTop:8,padding:"6px 10px",background:"rgba(11,18,32,0.6)",borderRadius:6,
                   borderLeft:`3px solid ${tipoColor}`,fontSize:11,color:tipoColor}}>
        {tipo==="unica"       && `Sistema compatible determinado — solución única en (${sol[0].toFixed(3)}, ${sol[1].toFixed(3)})`}
        {tipo==="incompatible"&& "Sistema incompatible — rectas paralelas, sin punto de intersección"}
        {tipo==="infinitas"   && "Sistema compatible indeterminado — rectas coincidentes, ∞ soluciones"}
      </div>

      <div className="viz-ctrl" style={{marginTop:10,display:"flex",gap:12,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:180,display:"flex",flexDirection:"column",gap:6}}>
          <span style={{color:"#60a5fa",fontSize:11,fontWeight:"bold"}}>Ecuación 1: a₁x + b₁y = c₁</span>
          {slRow("a₁",a1,setA1,"#60a5fa")}
          {slRow("b₁",b1,setB1,"#60a5fa")}
          {slRow("c₁",c1,setC1,"#60a5fa")}
        </div>
        <div style={{flex:1,minWidth:180,display:"flex",flexDirection:"column",gap:6}}>
          <span style={{color:"#34d399",fontSize:11,fontWeight:"bold"}}>Ecuación 2: a₂x + b₂y = c₂</span>
          {slRow("a₂",a2,setA2,"#34d399")}
          {slRow("b₂",b2,setB2,"#34d399")}
          {slRow("c₂",c2,setC2,"#34d399")}
        </div>
      </div>

      {mode==="gauss" && (
        <div style={{marginTop:10,display:"flex",alignItems:"center",gap:10}}>
          <button onClick={()=>setStep(s=>Math.max(0,s-1))}
            style={{...btnStyle(false),padding:"4px 12px"}}>← Anterior</button>
          <span style={{color:"#64748b",fontSize:11,flex:1,textAlign:"center"}}>
            Paso {Math.min(step,gaussSteps.length-1)+1} / {gaussSteps.length}
          </span>
          <button onClick={()=>setStep(s=>Math.min(gaussSteps.length-1,s+1))}
            style={{...btnStyle(true,"#8b5cf6"),padding:"4px 12px"}}>Siguiente →</button>
        </div>
      )}
    </div>
  );
}

export default LinearSystemsViz;
