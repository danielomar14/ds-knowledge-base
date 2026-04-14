import React, { useRef, useState, useEffect } from 'react';

export default function DiagonalizacionViz() {
  const canvasRef = useRef(null);
  const [step, setStep] = useState(0);        // 0=original, 1=P⁻¹, 2=Λ, 3=P
  const [lam1, setLam1] = useState(2.5);
  const [lam2, setLam2] = useState(0.5);

  // Matriz: A = P Λ P⁻¹ con P = rotación 45°
  const getMatrices = () => {
    const theta = Math.PI / 4;
    const c = Math.cos(theta), s = Math.sin(theta);
    const P    = [[c, -s], [s, c]];
    const Pinv = [[c, s], [-s, c]];  // P ortogonal → P⁻¹ = Pᵀ
    const Lam  = [[lam1, 0], [0, lam2]];
    // A = P Λ Pᵀ
    const mul = (M1, M2) => [
      [M1[0][0]*M2[0][0]+M1[0][1]*M2[1][0], M1[0][0]*M2[0][1]+M1[0][1]*M2[1][1]],
      [M1[1][0]*M2[0][0]+M1[1][1]*M2[1][0], M1[1][0]*M2[0][1]+M1[1][1]*M2[1][1]],
    ];
    const A = mul(mul(P, Lam), Pinv);
    return { A, P, Pinv, Lam };
  };

  const applyMat = (M, [x, y]) => [M[0][0]*x + M[0][1]*y, M[1][0]*x + M[1][1]*y];

  const identity = [[1,0],[0,1]];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const scale = 72;

    const { A, P, Pinv, Lam } = getMatrices();

    // Matriz activa según el paso
    const matrices = [identity, Pinv, Lam, P];
    const labels   = ["Original (base estándar)", "P⁻¹: cambio a base propia", "Λ: escalar por λᵢ", "P: volver a base estándar"];
    const colors   = ["#60a5fa", "#fbbf24", "#34d399", "#f87171"];

    // Matriz acumulada hasta el paso actual
    const mul = (M1, M2) => [
      [M1[0][0]*M2[0][0]+M1[0][1]*M2[1][0], M1[0][0]*M2[0][1]+M1[0][1]*M2[1][1]],
      [M1[1][0]*M2[0][0]+M1[1][1]*M2[1][0], M1[1][0]*M2[0][1]+M1[1][1]*M2[1][1]],
    ];

    let cumMat = identity;
    for (let i = 1; i <= step; i++) cumMat = mul(matrices[i], cumMat);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#0b1220";
    ctx.fillRect(0, 0, W, H);

    const toCanvas = ([x, y]) => [cx + x * scale, cy - y * scale];

    // ── Grid transformado ──────────────────────────────────────────────────
    ctx.strokeStyle = "rgba(96,165,250,0.10)";
    ctx.lineWidth = 1;
    for (let g = -5; g <= 5; g++) {
      ctx.beginPath();
      for (let t2 = -5; t2 <= 5; t2 += 0.2) {
        const [px, py] = toCanvas(applyMat(cumMat, [g, t2]));
        t2 === -5 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.beginPath();
      for (let t2 = -5; t2 <= 5; t2 += 0.2) {
        const [px, py] = toCanvas(applyMat(cumMat, [t2, g]));
        t2 === -5 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // ── Ejes coordenados ──────────────────────────────────────────────────
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // ── Elipse imagen del círculo unitario ────────────────────────────────
    ctx.strokeStyle = "rgba(167,139,250,0.55)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    for (let t2 = 0; t2 <= 2*Math.PI+0.01; t2 += 0.03) {
      const [px, py] = toCanvas(applyMat(cumMat, [Math.cos(t2), Math.sin(t2)]));
      t2 === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // ── Vectores base transformados ───────────────────────────────────────
    const drawArrow = (from, to, color, width = 2.5) => {
      const [x1, y1] = from, [x2, y2] = to;
      const dx = x2-x1, dy = y2-y1;
      const len = Math.sqrt(dx*dx+dy*dy)||1;
      const ux = dx/len, uy = dy/len;
      const hw = 7, hl = 13;
      ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = width;
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x2,y2);
      ctx.lineTo(x2-hl*ux+hw*uy, y2-hl*uy-hw*ux);
      ctx.lineTo(x2-hl*ux-hw*uy, y2-hl*uy+hw*ux);
      ctx.closePath(); ctx.fill();
    };

    const e1t = applyMat(cumMat, [1, 0]);
    const e2t = applyMat(cumMat, [0, 1]);
    const o   = toCanvas([0, 0]);
    drawArrow(o, toCanvas(e1t), "#60a5fa", 3);
    drawArrow(o, toCanvas(e2t), "#34d399", 3);

    // Etiquetas de vectores base
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "#60a5fa";
    ctx.fillText("e₁'", toCanvas([e1t[0]*1.15, e1t[1]*1.15])[0], toCanvas([e1t[0]*1.15, e1t[1]*1.15])[1]);
    ctx.fillStyle = "#34d399";
    ctx.fillText("e₂'", toCanvas([e2t[0]*1.15, e2t[1]*1.15])[0], toCanvas([e2t[0]*1.15, e2t[1]*1.15])[1]);

    // ── Paso pipeline ─────────────────────────────────────────────────────
    const stepColors = ["#475569","#fbbf24","#34d399","#f87171","#60a5fa"];
    const stepNames  = ["A","P⁻¹","Λ","P"];
    const pipeY = H - 28;

    // Dibujar pipeline
    for (let i = 0; i < 4; i++) {
      const x = 20 + i * 110;
      const active = i < step;
      ctx.fillStyle = active ? stepColors[i+1] : "#1e293b";
      ctx.strokeStyle = i+1 === step ? stepColors[i+1] : "#334155";
      ctx.lineWidth = i+1 === step ? 2 : 1;
      ctx.beginPath();
      ctx.roundRect(x, pipeY - 14, 95, 22, 4);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = active ? "#0b1220" : (i+1===step ? stepColors[i+1] : "#64748b");
      ctx.font = `${i+1===step?"bold ":""}11px monospace`;
      ctx.textAlign = "center";
      ctx.fillText(stepNames[i], x + 47, pipeY + 3);
      if (i < 3) {
        ctx.fillStyle = "#334155";
        ctx.font = "14px monospace";
        ctx.fillText("→", x + 100, pipeY + 4);
      }
    }
    ctx.textAlign = "left";

    // ── Panel info ────────────────────────────────────────────────────────
    const info = labels[step];
    ctx.fillStyle = "rgba(15,23,42,0.85)";
    ctx.beginPath(); ctx.roundRect(10, 10, W-20, 36, 6); ctx.fill();
    ctx.fillStyle = colors[step];
    ctx.font = "bold 12px monospace";
    ctx.fillText(`Paso ${step}: ${info}`, 18, 33);

    // Mostrar λ₁, λ₂ actuales
    ctx.fillStyle = "#475569";
    ctx.font = "11px monospace";
    ctx.fillText(`λ₁ = ${lam1.toFixed(2)}   λ₂ = ${lam2.toFixed(2)}`, W - 150, 33);

  }, [step, lam1, lam2]);

  const stepDescriptions = [
    { title: "Estado inicial", desc: "Base estándar {e₁, e₂}. La matriz A = PΛP⁻¹ actúa sobre el espacio original.", color: "#60a5fa" },
    { title: "Aplicar P⁻¹", desc: "Cambio de base: traducimos las coordenadas al sistema de eigenvectores (base propia).", color: "#fbbf24" },
    { title: "Aplicar Λ", desc: "En la base propia, la transformación es trivial: escalar cada eje por su λᵢ independientemente.", color: "#34d399" },
    { title: "Aplicar P", desc: "Cambio de base inverso: regresamos a la base estándar. Resultado idéntico a aplicar A directamente.", color: "#f87171" },
  ];

  return (
    <div className="viz-box" style={{ background: "#0b1220", borderRadius: 10, padding: 12 }}>
      <canvas
        ref={canvasRef}
        width={460}
        height={380}
        style={{ borderRadius: 8, display: "block", margin: "0 auto" }}
      />

      {/* Descripción del paso */}
      <div style={{
        background: "#0f172a", borderRadius: 6, padding: "8px 12px",
        marginTop: 10, borderLeft: `3px solid ${stepDescriptions[step].color}`
      }}>
        <div style={{ color: stepDescriptions[step].color, fontSize: 11, fontWeight: "bold", fontFamily: "monospace" }}>
          {stepDescriptions[step].title}
        </div>
        <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>
          {stepDescriptions[step].desc}
        </div>
      </div>

      {/* Botones de navegación */}
      <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center" }}>
        {["A", "P⁻¹", "Λ", "P"].map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            style={{
              padding: "5px 14px", borderRadius: 5, border: "none", cursor: "pointer",
              fontFamily: "monospace", fontSize: 12, fontWeight: step === i ? "bold" : "normal",
              background: step === i ? ["#60a5fa","#fbbf24","#34d399","#f87171"][i] : "#1e293b",
              color: step === i ? "#0b1220" : "#64748b",
              transition: "all 0.15s",
            }}
          >{label}</button>
        ))}
      </div>

      <div className="viz-ctrl" style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 11, minWidth: 160 }}>
            λ₁ (escala eje 1): {lam1.toFixed(2)}
          </span>
          <input type="range" min={0.2} max={4} step={0.05} value={lam1}
            onChange={e => setLam1(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#34d399" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 11, minWidth: 160 }}>
            λ₂ (escala eje 2): {lam2.toFixed(2)}
          </span>
          <input type="range" min={0.1} max={2} step={0.05} value={lam2}
            onChange={e => setLam2(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#fbbf24" }} />
        </div>
        <p style={{ color: "#334155", fontSize: 10, margin: 0, lineHeight: 1.5 }}>
          Azul = e₁ transformado · Verde = e₂ transformado · Morado = imagen del círculo unitario.
          La matriz P es rotación 45° (ortogonal → P⁻¹ = Pᵀ).
        </p>
      </div>
    </div>
  );
}
