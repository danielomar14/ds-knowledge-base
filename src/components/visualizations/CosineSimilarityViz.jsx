import { useRef, useState, useEffect } from "react";

function CosineSimilarityViz() {
  const canvasRef = useRef(null);
  const [angleA, setAngleA] = useState(30);
  const [angleB, setAngleB] = useState(110);
  const [magA,   setMagA]   = useState(1.6);
  const [magB,   setMagB]   = useState(2.4);
  const [showUnit, setShowUnit] = useState(true);
  const [showProj, setShowProj] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const S = 90;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(71,85,105,0.15)";
    ctx.lineWidth = 1;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(cx + i*S, 0); ctx.lineTo(cx + i*S, H); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, cy + i*S); ctx.lineTo(W, cy + i*S); ctx.stroke();
    }

    // Ejes
    ctx.strokeStyle = "rgba(100,116,139,0.45)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    const rad = d => d * Math.PI / 180;
    const aRad = rad(angleA);
    const bRad = rad(angleB);

    // Vectores (en coords matemáticas)
    const ax = magA * Math.cos(aRad), ay = magA * Math.sin(aRad);
    const bx = magB * Math.cos(bRad), by = magB * Math.sin(bRad);

    // Versores
    const axh = Math.cos(aRad), ayh = Math.sin(aRad);
    const bxh = Math.cos(bRad), byh = Math.sin(bRad);

    // Similitud coseno
    const cosTheta = axh*bxh + ayh*byh;
    const theta    = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
    const thetaDeg = (theta * 180 / Math.PI).toFixed(1);

    // Conversión a canvas
    const scx = x => cx + x * S;
    const scy = y => cy - y * S;

    // ── Esfera unitaria ───────────────────────────────────────────────────
    if (showUnit) {
      ctx.strokeStyle = "rgba(100,116,139,0.2)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3,4]);
      ctx.beginPath();
      ctx.arc(cx, cy, S, 0, Math.PI*2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // ── Arco del ángulo ───────────────────────────────────────────────────
    const arcR = S * 0.38;
    const startAng = -aRad;
    const endAng   = -bRad;

    // Color del arco según similitud
    const arcColor = cosTheta > 0.5  ? "#34d399"
                   : cosTheta > -0.1 ? "#fbbf24"
                   :                   "#f87171";

    ctx.strokeStyle = arcColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Dibujar arco en sentido correcto
    const aCorrected = -aRad;
    const bCorrected = -bRad;
    let diff = bCorrected - aCorrected;
    while (diff >  Math.PI) diff -= 2*Math.PI;
    while (diff < -Math.PI) diff += 2*Math.PI;
    ctx.arc(cx, cy, arcR, aCorrected, aCorrected + diff, diff < 0);
    ctx.stroke();

    // Etiqueta θ en el arco
    const midArcAng = -(aRad + (diff/2));
    ctx.fillStyle = arcColor;
    ctx.font = "bold 12px 'JetBrains Mono', monospace";
    ctx.fillText(`θ=${thetaDeg}°`, cx + (arcR+10)*Math.cos(midArcAng) - 14,
                                   cy + (arcR+10)*Math.sin(midArcAng) + 5);

    // ── Proyección ortogonal ──────────────────────────────────────────────
    if (showProj) {
      // Proyección de b sobre â
      const proj = cosTheta; // porque â es versor
      const projX = proj * axh;
      const projY = proj * ayh;

      // Línea punteada perpendicular
      ctx.strokeStyle = "rgba(167,139,250,0.5)";
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4,3]);
      ctx.beginPath();
      ctx.moveTo(scx(bxh), scy(byh));
      ctx.lineTo(scx(projX), scy(projY));
      ctx.stroke();
      ctx.setLineDash([]);

      // Punto de proyección sobre versor a
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath();
      ctx.arc(scx(projX), scy(projY), 4, 0, Math.PI*2);
      ctx.fill();

      // Etiqueta cosθ en el eje de a
      const labelX = scx(projX) + 6;
      const labelY = scy(projY) - 10;
      ctx.fillStyle = "#a78bfa";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText(`cos θ=${cosTheta.toFixed(3)}`, labelX, labelY);
    }

    // ── Versores sobre esfera ─────────────────────────────────────────────
    if (showUnit) {
      // Versor A
      ctx.strokeStyle = "rgba(96,165,250,0.45)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3,3]);
      ctx.beginPath();
      ctx.moveTo(cx, cy); ctx.lineTo(scx(axh), scy(ayh));
      ctx.stroke();
      ctx.setLineDash([]);

      // Versor B
      ctx.strokeStyle = "rgba(52,211,153,0.45)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3,3]);
      ctx.beginPath();
      ctx.moveTo(cx, cy); ctx.lineTo(scx(bxh), scy(byh));
      ctx.stroke();
      ctx.setLineDash([]);

      // Puntos versores
      ctx.fillStyle = "#60a5fa";
      ctx.beginPath(); ctx.arc(scx(axh), scy(ayh), 4, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "#34d399";
      ctx.beginPath(); ctx.arc(scx(bxh), scy(byh), 4, 0, Math.PI*2); ctx.fill();
    }

    // ── Función flecha ────────────────────────────────────────────────────
    const arrow = (x1,y1,x2,y2,color,lw=2.5) => {
      const dx=x2-x1, dy=y2-y1, len=Math.hypot(dx,dy);
      if (len<2) return;
      const ux=dx/len, uy=dy/len, hl=12;
      ctx.strokeStyle=color; ctx.lineWidth=lw;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      ctx.fillStyle=color;
      ctx.beginPath();
      ctx.moveTo(x2,y2);
      ctx.lineTo(x2-hl*ux+hl*.38*(-uy), y2-hl*uy+hl*.38*ux);
      ctx.lineTo(x2-hl*ux-hl*.38*(-uy), y2-hl*uy-hl*.38*ux);
      ctx.closePath(); ctx.fill();
    };

    // Vectores principales
    arrow(cx, cy, scx(ax), scy(ay), "#60a5fa");
    arrow(cx, cy, scx(bx), scy(by), "#34d399");

    // Etiquetas
    ctx.fillStyle = "#60a5fa";
    ctx.font = "bold 13px 'JetBrains Mono', monospace";
    ctx.fillText(`a  ‖a‖=${magA.toFixed(1)}`, scx(ax)+10, scy(ay)-6);
    ctx.fillStyle = "#34d399";
    ctx.fillText(`b  ‖b‖=${magB.toFixed(1)}`, scx(bx)+10, scy(by)-6);

    // Origen
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath(); ctx.arc(cx, cy, 3.5, 0, Math.PI*2); ctx.fill();

    // ── Panel de métricas ─────────────────────────────────────────────────
    const simColor = cosTheta > 0.5 ? "#34d399" : cosTheta > -0.1 ? "#fbbf24" : "#f87171";
    const simLabel = cosTheta > 0.7 ? "muy similar" : cosTheta > 0.3 ? "similar"
                   : cosTheta > -0.1 ? "ortogonal"  : "disímil";

    const pw=210, ph=100, px=10, py=10;
    ctx.fillStyle = "rgba(11,18,32,0.92)";
    ctx.beginPath(); ctx.roundRect(px,py,pw,ph,8); ctx.fill();
    ctx.strokeStyle = simColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(px,py,pw,ph,8); ctx.stroke();

    const metrics = [
      { label: "sim_cos(a,b)", val: cosTheta.toFixed(5), color: simColor },
      { label: "d_cos = 1−cos", val: (1-cosTheta).toFixed(5), color: "#94a3b8" },
      { label: "d_ang / π", val: (theta/Math.PI).toFixed(5), color: "#94a3b8" },
      { label: "interpretación", val: simLabel, color: simColor },
    ];
    ctx.font = "11px 'JetBrains Mono', monospace";
    metrics.forEach(({ label, val, color }, i) => {
      ctx.fillStyle = "#475569";
      ctx.fillText(label, px+12, py+22+i*19);
      ctx.fillStyle = color;
      ctx.fillText(val, px+128, py+22+i*19);
    });

  }, [angleA, angleB, magA, magB, showUnit, showProj]);

  const sliderRow = (label, val, setter, min, max, step, color, fmt=v=>v.toFixed(1)) => (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ color:"#64748b", fontSize:11, width:130, flexShrink:0 }}>
        {label}: <span style={{ color }}>{fmt(val)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e => setter(Number(e.target.value))}
        style={{ flex:1, accentColor:color }} />
    </div>
  );

  return (
    <div className="viz-box" style={{ fontFamily:"'JetBrains Mono', monospace" }}>
      <canvas ref={canvasRef} width={520} height={400}
        style={{ width:"100%", borderRadius:10, display:"block" }} />

      <div style={{ marginTop:8, fontSize:11, color:"#475569", lineHeight:1.5 }}>
        La similitud coseno mide el ángulo θ entre vectores, ignorando su magnitud.
        Varía la dirección y la escala — observa que sim_cos no cambia con ‖a‖ y ‖b‖.
      </div>

      <div className="viz-ctrl" style={{ display:"flex", flexDirection:"column", gap:8, marginTop:10 }}>
        {sliderRow("a  ángulo θ_a", angleA, setAngleA, 0, 360, 2, "#60a5fa", v=>`${v}°`)}
        {sliderRow("a  magnitud",   magA,   setMagA,   0.5, 3.0, 0.1, "#60a5fa")}
        {sliderRow("b  ángulo θ_b", angleB, setAngleB, 0, 360, 2, "#34d399", v=>`${v}°`)}
        {sliderRow("b  magnitud",   magB,   setMagB,   0.5, 3.0, 0.1, "#34d399")}
        <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginTop:2 }}>
          <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
            <input type="checkbox" checked={showUnit}
              onChange={e => setShowUnit(e.target.checked)}
              style={{ accentColor:"#94a3b8" }} />
            <span style={{ color:"#94a3b8", fontSize:11 }}>Esfera unitaria S¹</span>
          </label>
          <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
            <input type="checkbox" checked={showProj}
              onChange={e => setShowProj(e.target.checked)}
              style={{ accentColor:"#a78bfa" }} />
            <span style={{ color:"#94a3b8", fontSize:11 }}>Proyección ortogonal (cos θ)</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export default CosineSimilarityViz;
