import { useRef, useState, useEffect } from "react";

function GaussianEliminationViz() {
  const canvasRef = useRef(null);

  // Sistema 3×3 inicial (editable indirectamente vía presets)
  const presets = {
    "Bien condicionado": {
      A: [[2,1,-1],[-3,-1,2],[-2,1,2]],
      b: [8,-11,-3],
    },
    "Requiere pivoteo": {
      A: [[0,2,1],[1,1,1],[3,1,2]],
      b: [4,3,7],
    },
    "Singular": {
      A: [[1,2,3],[2,4,6],[1,1,2]],
      b: [6,12,4],
    },
  };

  const [preset, setPreset] = useState("Bien condicionado");
  const [step,   setStep]   = useState(0);
  const [mode,   setMode]   = useState("matrix"); // "matrix" | "cost"

  const { A: A0, b: b0 } = presets[preset];

  // Generar todos los pasos de eliminación gaussiana con pivoteo
  const allSteps = (() => {
    const n = 3;
    let M = A0.map((row, i) => [...row, b0[i]]);   // aumentada (3×4)
    const steps = [];
    let nSwaps = 0;
    let pivotRows = [];

    steps.push({
      label: "Matriz aumentada [A | b]",
      M: M.map(r => [...r]),
      highlight: [],
      pivotCol: -1,
      elimRow: -1,
      type: "init",
    });

    for (let k = 0; k < n - 1; k++) {
      // Pivoteo parcial
      let maxIdx = k;
      for (let i = k + 1; i < n; i++) {
        if (Math.abs(M[i][k]) > Math.abs(M[maxIdx][k])) maxIdx = i;
      }
      if (maxIdx !== k) {
        [M[k], M[maxIdx]] = [M[maxIdx], M[k]];
        nSwaps++;
        steps.push({
          label: `Pivoteo: intercambiar F${k+1} ↔ F${maxIdx+1}`,
          M: M.map(r => [...r]),
          highlight: [k, maxIdx],
          pivotCol: k,
          elimRow: -1,
          type: "swap",
        });
      }

      if (Math.abs(M[k][k]) < 1e-12) {
        steps.push({
          label: `⚠ Pivote nulo en columna ${k+1} — sistema singular`,
          M: M.map(r => [...r]),
          highlight: [k],
          pivotCol: k,
          elimRow: -1,
          type: "singular",
        });
        break;
      }

      // Eliminación de cada fila debajo del pivote
      for (let i = k + 1; i < n; i++) {
        const mik = M[i][k] / M[k][k];
        const M_prev = M.map(r => [...r]);
        for (let j = k; j <= n; j++) {
          M[i][j] -= mik * M[k][j];
        }
        steps.push({
          label: `F${i+1} ← F${i+1} − (${mik.toFixed(3)})·F${k+1}`,
          M: M.map(r => [...r]),
          M_prev: M_prev,
          highlight: [i],
          pivotCol: k,
          pivotRow: k,
          elimRow: i,
          mult: mik,
          type: "elim",
        });
      }
    }

    // Sustitución hacia atrás
    const isSingular = Math.abs(M[n-1][n-1]) < 1e-12;
    if (!isSingular) {
      const x = new Array(n).fill(0);
      for (let i = n - 1; i >= 0; i--) {
        x[i] = M[i][n];
        for (let j = i + 1; j < n; j++) x[i] -= M[i][j] * x[j];
        x[i] /= M[i][i];
        steps.push({
          label: `Sustitución: x${i+1} = ${x[i].toFixed(4)}`,
          M: M.map(r => [...r]),
          highlight: [i],
          pivotCol: -1,
          elimRow: -1,
          type: "back",
          solvedIdx: i,
          partialSol: [...x],
        });
      }
      steps.push({
        label: `✓ Solución: x=(${x.map(v=>v.toFixed(3)).join(", ")})`,
        M: M.map(r => [...r]),
        highlight: [0,1,2],
        pivotCol: -1,
        elimRow: -1,
        type: "done",
        sol: [...x],
      });
    }
    return steps;
  })();

  const curStep = Math.min(step, allSteps.length - 1);
  const gs = allSteps[curStep];

  // Colores de los tipos de paso
  const stepColor = {
    init:     "#60a5fa",
    swap:     "#fbbf24",
    elim:     "#34d399",
    back:     "#a78bfa",
    done:     "#34d399",
    singular: "#f87171",
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    if (mode === "matrix") drawMatrix(ctx, W, H);
    else                   drawCost(ctx, W, H);
  }, [step, preset, mode, curStep, gs]);

  function drawMatrix(ctx, W, H) {
    const n = 3, cols = 4;
    const padX = 52, padY = 64;
    const cellW = (W - 2*padX - 20) / cols;
    const cellH = 68;
    const sepX = padX + 3 * cellW;  // separador | entre A y b

    const sColor = stepColor[gs.type] || "#60a5fa";

    // Título del paso
    ctx.fillStyle = sColor;
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`Paso ${curStep + 1}/${allSteps.length}`, W/2, 22);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText(gs.label, W/2, 40);
    ctx.textAlign = "left";

    // Encabezados de columna
    const colLabels = ["x₁", "x₂", "x₃", "b"];
    const colColors = ["#60a5fa","#60a5fa","#60a5fa","#fbbf24"];
    colLabels.forEach((lbl, j) => {
      ctx.fillStyle = colColors[j];
      ctx.font = "bold 12px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(lbl, padX + j*cellW + cellW/2 + (j===3?10:0), padY - 8);
    });
    ctx.textAlign = "left";

    // Línea separadora A|b
    ctx.strokeStyle = "rgba(251,191,36,0.3)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(sepX + 8, padY - 18);
    ctx.lineTo(sepX + 8, padY + n*cellH + 4);
    ctx.stroke();
    ctx.setLineDash([]);

    // Corchetes de la matriz
    const bracketColor = "rgba(100,116,139,0.5)";
    const bL = padX - 12, bR = W - padX + 4;
    const bTop = padY - 16, bBot = padY + n*cellH + 4;
    ctx.strokeStyle = bracketColor; ctx.lineWidth = 2;
    // [ izquierdo
    ctx.beginPath(); ctx.moveTo(bL+8,bTop); ctx.lineTo(bL,bTop); ctx.lineTo(bL,bBot); ctx.lineTo(bL+8,bBot); ctx.stroke();
    // ] derecho
    ctx.beginPath(); ctx.moveTo(bR-8,bTop); ctx.lineTo(bR,bTop); ctx.lineTo(bR,bBot); ctx.lineTo(bR-8,bBot); ctx.stroke();

    // Celdas
    gs.M.forEach((row, i) => {
      const rowY = padY + i * cellH;
      const isHighlight = gs.highlight?.includes(i);
      const isPivotRow  = gs.pivotRow === i;
      const isElimRow   = gs.elimRow  === i;

      // Fondo de fila
      if (isPivotRow && gs.type === "elim") {
        ctx.fillStyle = "rgba(96,165,250,0.07)";
        ctx.fillRect(padX - 8, rowY - 2, sepX - padX + 12, cellH - 2);
      }
      if (isElimRow) {
        ctx.fillStyle = "rgba(52,211,153,0.07)";
        ctx.fillRect(padX - 8, rowY - 2, W - padX*2 + 12, cellH - 2);
        ctx.strokeStyle = "rgba(52,211,153,0.3)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.roundRect(padX-8, rowY-2, W-padX*2+12, cellH-2, 4); ctx.stroke();
      }
      if (gs.type === "swap" && isHighlight) {
        ctx.fillStyle = "rgba(251,191,36,0.08)";
        ctx.fillRect(padX-8, rowY-2, W-padX*2+12, cellH-2);
      }

      row.forEach((val, j) => {
        const cellX = padX + j*cellW + cellW/2 + (j === 3 ? 10 : 0);
        const cellMid = rowY + cellH/2 + 5;

        let color = "#94a3b8";
        if (j === 3) color = "#fbbf24";
        if (isPivotRow && j === gs.pivotCol && gs.type === "elim") color = "#60a5fa";
        if (isElimRow)  color = "#34d399";
        if (gs.type === "swap" && isHighlight) color = "#fbbf24";
        if (gs.type === "back" && isHighlight) color = "#a78bfa";
        if (gs.type === "done") color = "#34d399";

        // Resaltar el pivote actual
        if (gs.type === "elim" && i === gs.pivotRow && j === gs.pivotCol) {
          ctx.fillStyle = "rgba(96,165,250,0.2)";
          ctx.beginPath(); ctx.roundRect(cellX-22, cellMid-18, 44, 26, 5); ctx.fill();
          ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.roundRect(cellX-22, cellMid-18, 44, 26, 5); ctx.stroke();
        }

        // Valor (cero en gris más tenue)
        const isZero = Math.abs(val) < 1e-9;
        ctx.fillStyle = isZero ? "rgba(100,116,139,0.35)" : color;
        ctx.font = `${isElimRow || isPivotRow ? "bold " : ""}14px 'JetBrains Mono', monospace`;
        ctx.textAlign = "center";
        ctx.fillText(isZero ? "0" : val.toFixed(3), cellX, cellMid);
      });
      ctx.textAlign = "left";

      // Label de fila
      ctx.fillStyle = "rgba(100,116,139,0.45)"; ctx.font="10px monospace";
      ctx.fillText(`F${i+1}`, padX - 30, rowY + cellH/2 + 5);
    });

    // Multiplicador badge (modo elim)
    if (gs.type === "elim" && gs.mult !== undefined) {
      const bY = padY + gs.elimRow * cellH - 4;
      ctx.fillStyle = "rgba(11,18,32,0.9)";
      ctx.beginPath(); ctx.roundRect(padX + gs.pivotCol*cellW + cellW + 2, bY, 120, 22, 5); ctx.fill();
      ctx.fillStyle = "#34d399"; ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText(`m = ${gs.mult.toFixed(4)}`, padX + gs.pivotCol*cellW + cellW + 8, bY + 15);
    }

    // Solución parcial / final
    if (gs.type === "back" || gs.type === "done") {
      const solY = padY + n*cellH + 24;
      const sol = gs.partialSol || gs.sol || [];
      ctx.fillStyle = "rgba(11,18,32,0.9)";
      ctx.beginPath(); ctx.roundRect(padX - 8, solY, W - padX*2 + 12, 36, 7); ctx.fill();
      ctx.strokeStyle = "#a78bfa"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(padX-8, solY, W-padX*2+12, 36, 7); ctx.stroke();
      ctx.textAlign = "center";
      sol.forEach((v, i) => {
        const isKnown = gs.type === "done" || (gs.type === "back" && i >= (gs.solvedIdx ?? n));
        ctx.fillStyle = isKnown ? "#a78bfa" : "rgba(100,116,139,0.3)";
        ctx.font = `${isKnown?"bold ":""}13px 'JetBrains Mono', monospace`;
        ctx.fillText(isKnown ? `x${i+1}=${v.toFixed(3)}` : `x${i+1}=?`,
          padX + i * (W - padX*2) / 3 + (W-padX*2)/6, solY + 23);
      });
      ctx.textAlign = "left";
    }

    // Progreso de pasos (dots)
    const totalSteps = allSteps.length;
    const dotSpacing = Math.min(16, (W - 40) / totalSteps);
    const dotStartX = W/2 - (totalSteps-1)*dotSpacing/2;
    allSteps.forEach((s, i) => {
      const active = i === curStep;
      const passed = i < curStep;
      const col = stepColor[s.type] || "#60a5fa";
      ctx.fillStyle = active ? col : passed ? col.replace(")", ",0.4)").replace("rgb","rgba") : "rgba(71,85,105,0.4)";
      ctx.beginPath();
      ctx.arc(dotStartX + i*dotSpacing, H - 12, active ? 5 : 3, 0, Math.PI*2);
      ctx.fill();
    });
  }

  function drawCost(ctx, W, H) {
    const padL=60, padR=20, padT=50, padB=50;
    const pw=W-padL-padR, ph=H-padT-padB;

    // Curvas de coste teórico
    const ns = Array.from({length:50},(_,i)=>Math.round(10 + i*19));
    const flopsLU   = n => (2/3)*n**3;
    const flopsSub  = n => 2*n**2;
    const flopsChol = n => (1/3)*n**3;
    const nMax = ns[ns.length-1];
    const fMax = flopsLU(nMax) * 1.1;

    // Ejes
    ctx.strokeStyle="rgba(100,116,139,0.4)"; ctx.lineWidth=1.5;
    ctx.beginPath(); ctx.moveTo(padL,padT); ctx.lineTo(padL,padT+ph); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(padL,padT+ph); ctx.lineTo(padL+pw,padT+ph); ctx.stroke();

    // Etiquetas ejes
    ctx.fillStyle="#64748b"; ctx.font="11px 'JetBrains Mono', monospace";
    ctx.textAlign="center";
    ctx.fillText("n (tamaño de la matriz)", padL+pw/2, padT+ph+36);
    ctx.save(); ctx.translate(16,padT+ph/2); ctx.rotate(-Math.PI/2);
    ctx.fillText("FLOPs (aprox.)", 0, 0); ctx.restore();
    ctx.textAlign="left";

    // Ticks eje x
    [50,100,200,500,800].filter(v=>v<=nMax+20).forEach(v=>{
      const xp = padL + (v/nMax)*pw;
      ctx.strokeStyle="rgba(100,116,139,0.18)"; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(xp,padT); ctx.lineTo(xp,padT+ph); ctx.stroke();
      ctx.fillStyle="#64748b"; ctx.font="10px monospace"; ctx.textAlign="center";
      ctx.fillText(v, xp, padT+ph+16);
    });

    const plotCurve = (fn, color, dash=[]) => {
      ctx.strokeStyle=color; ctx.lineWidth=2.2; ctx.setLineDash(dash);
      ctx.beginPath();
      ns.forEach((n,k) => {
        const xp = padL + (n/nMax)*pw;
        const yp = padT + ph - (Math.min(fn(n),fMax)/fMax)*ph;
        k===0 ? ctx.moveTo(xp,yp) : ctx.lineTo(xp,yp);
      });
      ctx.stroke(); ctx.setLineDash([]);
    };

    plotCurve(flopsLU,   "#60a5fa");
    plotCurve(flopsChol, "#34d399", [5,4]);
    plotCurve(flopsSub,  "#fbbf24", [3,3]);

    // Leyenda
    const ley=[
      {c:"#60a5fa",  t:"LU: ⅔n³ (factorización)",   dash:false},
      {c:"#34d399",  t:"Cholesky: ⅓n³ (SPD, mitad)", dash:true},
      {c:"#fbbf24",  t:"Sustitución: 2n²",            dash:true},
    ];
    ley.forEach(({c,t,dash},i)=>{
      ctx.strokeStyle=c; ctx.lineWidth=2;
      if(dash) ctx.setLineDash([4,3]);
      ctx.beginPath(); ctx.moveTo(padL+10,padT+18+i*20); ctx.lineTo(padL+34,padT+18+i*20); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle="#94a3b8"; ctx.font="11px 'JetBrains Mono', monospace";
      ctx.fillText(t, padL+40, padT+22+i*20);
    });

    // Anotación O(n³)
    ctx.fillStyle="rgba(96,165,250,0.6)"; ctx.font="bold 13px 'JetBrains Mono', monospace";
    ctx.fillText("O(n³)", padL+pw*0.85, padT+14);

    // Punto n=100: mostrar coste concreto
    const nRef=100;
    const xRef=padL+(nRef/nMax)*pw;
    ctx.strokeStyle="rgba(100,116,139,0.25)"; ctx.lineWidth=1; ctx.setLineDash([3,3]);
    ctx.beginPath(); ctx.moveTo(xRef,padT); ctx.lineTo(xRef,padT+ph); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle="rgba(11,18,32,0.9)";
    ctx.beginPath(); ctx.roundRect(xRef+6,padT+10,155,62,6); ctx.fill();
    ctx.strokeStyle="rgba(100,116,139,0.3)"; ctx.lineWidth=1;
    ctx.beginPath(); ctx.roundRect(xRef+6,padT+10,155,62,6); ctx.stroke();
    ctx.font="10px 'JetBrains Mono', monospace";
    [
      {c:"#60a5fa", t:`LU:   ${(flopsLU(nRef)/1e6).toFixed(2)}M flops`},
      {c:"#34d399", t:`Chol: ${(flopsChol(nRef)/1e6).toFixed(2)}M flops`},
      {c:"#fbbf24", t:`Sub:  ${flopsSub(nRef).toFixed(0)} flops`},
    ].forEach(({c,t},i)=>{ ctx.fillStyle=c; ctx.fillText(`n=100 → ${t}`,xRef+12,padT+26+i*17); });

    // Título
    ctx.fillStyle="#94a3b8"; ctx.font="12px 'JetBrains Mono', monospace";
    ctx.textAlign="center";
    ctx.fillText("Coste computacional — Eliminación Gaussiana", W/2, padT-16);
    ctx.textAlign="left";
  }

  const btnStyle=(active,col="#3b82f6")=>({
    padding:"5px 12px",borderRadius:6,border:"none",cursor:"pointer",
    fontSize:11,fontFamily:"'JetBrains Mono', monospace",
    background:active?col:"rgba(51,65,85,0.6)",
    color:active?"#fff":"#94a3b8",transition:"all 0.15s",
  });

  return (
    <div className="viz-box" style={{fontFamily:"'JetBrains Mono', monospace"}}>
      <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
        <button style={btnStyle(mode==="matrix","#3b82f6")} onClick={()=>setMode("matrix")}>Paso a paso</button>
        <button style={btnStyle(mode==="cost",  "#10b981")} onClick={()=>setMode("cost")}>Análisis de coste</button>
      </div>

      {mode==="matrix" && (
        <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
          {Object.keys(presets).map(k=>(
            <button key={k} style={btnStyle(preset===k,
              k==="Singular"?"#ef4444":k==="Requiere pivoteo"?"#f59e0b":"#8b5cf6")}
              onClick={()=>{ setPreset(k); setStep(0); }}>
              {k}
            </button>
          ))}
        </div>
      )}

      <canvas ref={canvasRef} width={520} height={430}
        style={{width:"100%",borderRadius:10,display:"block"}}/>

      <div style={{marginTop:8,fontSize:11,color:"#475569",lineHeight:1.5}}>
        {mode==="matrix"
          ? "Cada paso elimina una incógnita de las filas inferiores usando el pivote (azul). El multiplicador m se guarda para construir L."
          : "La factorización LU cuesta ⅔n³ flops. Cholesky para matrices SPD cuesta la mitad. La sustitución es O(n²) — negligible vs. factorización."}
      </div>

      {mode==="matrix" && (
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:10}}>
          <button onClick={()=>setStep(s=>Math.max(0,s-1))}
            style={{...btnStyle(false),padding:"5px 16px"}}>← Atrás</button>
          <div style={{flex:1,background:"rgba(30,41,59,0.5)",borderRadius:6,height:6,overflow:"hidden"}}>
            <div style={{
              height:"100%",borderRadius:6,background:"#3b82f6",
              width:`${((curStep)/(allSteps.length-1))*100}%`,
              transition:"width 0.2s"
            }}/>
          </div>
          <button onClick={()=>setStep(s=>Math.min(allSteps.length-1,s+1))}
            style={{...btnStyle(true,"#3b82f6"),padding:"5px 16px"}}>Siguiente →</button>
        </div>
      )}
    </div>
  );
}

export default GaussianEliminationViz;
