import React, { useRef, useState, useEffect } from "react";

export default function CampoAlgebraViz() {
  const canvasRef = useRef(null);
  const [mode, setMode]   = useState(0); // 0=jerarquía, 1=tabla F_p, 2=GF256
  const [primeIdx, setPrimeIdx] = useState(1); // índice en lista de primos

  const W = 680, H = 380;
  const BG     = "#0b1220";
  const BLUE   = "#60a5fa";
  const GREEN  = "#34d399";
  const YELLOW = "#fbbf24";
  const RED    = "#f87171";
  const PURPLE = "#a78bfa";
  const ORANGE = "#fb923c";
  const SLATE  = "#475569";

  const PRIMES = [2, 3, 5, 7, 11, 13];
  const MODES  = ["Jerarquía algebraica", "Tabla Fp", "GF(2⁸) bytes"];

  // ── GF(2^8) multiplicación ────────────────────────────────────────────────
  const AES_POLY = 0x11B;
  const gf256mul = (a, b) => {
    let r = 0, aa = a;
    for (let i = 0; i < 8; i++) {
      if (b & 1) r ^= aa;
      aa <<= 1;
      if (aa & 0x100) aa ^= AES_POLY;
      b >>= 1;
    }
    return r & 0xFF;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, W, H);

    // ── MODO 0: Jerarquía de estructuras algebraicas ─────────────────────
    if (mode === 0) {
      const structs = [
        { name: "Campo (Field)", sub: "F, Q, R, C, F_p", color: BLUE,   y: 50,  r: 48 },
        { name: "Dominio íntegro", sub: "Z, Z[x]",        color: GREEN,  y: 135, r: 52 },
        { name: "Anillo conmutativo", sub: "Z/nZ, R[x]",  color: YELLOW, y: 225, r: 60 },
        { name: "Anillo",           sub: "M_n(R)",         color: ORANGE, y: 310, r: 44 },
      ];
      const cx = W / 2;

      // Líneas de inclusión
      for (let i = 0; i < structs.length - 1; i++) {
        const s = structs[i], t = structs[i+1];
        ctx.strokeStyle = s.color + "44";
        ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(cx - s.r + 6, s.y + 18);
        ctx.lineTo(cx - t.r + 6, t.y - 10);
        ctx.stroke();
        ctx.moveTo(cx + s.r - 6, s.y + 18);
        ctx.lineTo(cx + t.r - 6, t.y - 10);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      structs.forEach(({ name, sub, color, y, r }) => {
        // Caja
        const bx = cx - r - 60, bw = (r + 60) * 2, bh = 40;
        const by = y - 10;
        ctx.fillStyle = color + "18";
        ctx.strokeStyle = color + "88";
        ctx.lineWidth = 1.5;
        roundRect(ctx, bx, by, bw, bh, 8);
        ctx.fill(); ctx.stroke();

        // Nombre
        ctx.fillStyle = color;
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(name, cx, y + 8);

        // Ejemplos
        ctx.fillStyle = "#94a3b8";
        ctx.font = "11px monospace";
        ctx.fillText(sub, cx, y + 23);
      });

      // Axioma diferenciador
      const diffs = [
        { y: 93,  text: "+ inverso multiplicativo ∀a≠0", color: BLUE },
        { y: 180, text: "+ sin divisores de cero", color: GREEN },
        { y: 270, text: "+ conmutatividad ·, identidad 1", color: YELLOW },
      ];
      diffs.forEach(({ y, text, color }) => {
        ctx.fillStyle = color + "cc";
        ctx.font = "italic 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`↑ ${text}`, cx, y);
      });

      // Título
      ctx.fillStyle = "#e2e8f0"; ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("Jerarquía algebraica", W - 16, 24);
    }

    // ── MODO 1: Tabla multiplicativa de F_p ─────────────────────────────
    if (mode === 1) {
      const p = PRIMES[primeIdx];
      const elems = Array.from({ length: p - 1 }, (_, i) => i + 1);
      const n = elems.length;
      const cellSize = Math.min(44, Math.floor((Math.min(W, H) - 100) / (n + 1)));
      const ox = (W - cellSize * (n + 1)) / 2;
      const oy = 55;

      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Tabla multiplicativa de  𝔽${p}  (× mod ${p})`, W / 2, 30);
      ctx.fillStyle = SLATE; ctx.font = "11px sans-serif";
      ctx.fillText("Cada fila y columna contiene todos los elementos → grupo abeliano", W/2, 48);

      // Encabezados
      elems.forEach((e, j) => {
        ctx.fillStyle = YELLOW;
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.fillText(e, ox + (j + 1.5) * cellSize, oy + cellSize * 0.65);
        ctx.fillText(e, ox + cellSize * 0.5, oy + (j + 1.5) * cellSize);
      });

      // Celdas
      elems.forEach((a, i) => {
        elems.forEach((b, j) => {
          const val = (a * b) % p;
          const isOne = val === 1;
          const isDiag = i === j;
          const cellX = ox + (j + 1) * cellSize;
          const cellY = oy + (i + 1) * cellSize;

          // Color de fondo
          const t = val / (p - 1);
          const r = Math.round(14 + t * (96 - 14));
          const g = Math.round(22 + t * (165 - 22));
          const bl = Math.round(42 + t * (250 - 42));
          ctx.fillStyle = `rgb(${r},${g},${bl})`;
          ctx.fillRect(cellX, cellY, cellSize - 1, cellSize - 1);

          if (isOne) {
            ctx.strokeStyle = GREEN;
            ctx.lineWidth = 1.5;
            ctx.strokeRect(cellX + 0.5, cellY + 0.5, cellSize - 2, cellSize - 2);
          }

          ctx.fillStyle = isOne ? GREEN : "#e2e8f0";
          ctx.font = `${isOne ? "bold " : ""}${cellSize > 36 ? 13 : 10}px monospace`;
          ctx.textAlign = "center";
          ctx.fillText(val, cellX + cellSize / 2, cellY + cellSize / 2 + 4);
        });
      });

      // Leyenda
      ctx.fillStyle = GREEN; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("■ = 1  (par inverso)", ox, oy + (n + 1) * cellSize + 20);
      ctx.fillStyle = SLATE;
      ctx.fillText(`char(𝔽${p}) = ${p}  →  ${p}·1 = 0 en 𝔽${p}`, ox, oy + (n + 1) * cellSize + 36);
    }

    // ── MODO 2: GF(2^8) mapa de multiplicación ───────────────────────────
    if (mode === 2) {
      const SIZE = 16;
      const cellW = Math.floor((W - 80) / SIZE);
      const cellH = Math.floor((H - 80) / SIZE);
      const ox = 50, oy = 50;

      ctx.fillStyle = "#e2e8f0"; ctx.font = "bold 13px sans-serif"; ctx.textAlign = "center";
      ctx.fillText("GF(2⁸)  —  tabla de multiplicación (bytes 0x00–0xFF, 16×16 muestra)", W/2, 28);
      ctx.fillStyle = SLATE; ctx.font = "10px sans-serif";
      ctx.fillText("Intensidad = valor del producto · usado en AES y Reed-Solomon", W/2, 44);

      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          const a = i * 16 + 8;   // representante de la fila (byte ≠ 0)
          const b = j * 16 + 8;
          const val = gf256mul(a, b);
          const brightness = val / 255;
          const r = Math.round(brightness * 96);
          const g = Math.round(brightness * 165);
          const bl = Math.round(50 + brightness * 200);
          ctx.fillStyle = `rgb(${r},${g},${bl})`;
          ctx.fillRect(ox + j * cellW, oy + i * cellH, cellW - 1, cellH - 1);

          if (val === 1) {
            ctx.strokeStyle = GREEN; ctx.lineWidth = 1.5;
            ctx.strokeRect(ox + j * cellW + 0.5, oy + i * cellH + 0.5, cellW - 2, cellH - 2);
          }
        }
      }

      // Ejes
      ctx.fillStyle = YELLOW; ctx.font = "10px monospace"; ctx.textAlign = "center";
      for (let k = 0; k < SIZE; k += 4) {
        ctx.fillText(`${(k*16).toString(16).toUpperCase()}`, ox + k * cellW + cellW / 2, oy - 6);
        ctx.textAlign = "right";
        ctx.fillText(`${(k*16).toString(16).toUpperCase()}`, ox - 4, oy + k * cellH + cellH / 2 + 4);
        ctx.textAlign = "center";
      }

      // Leyenda
      ctx.fillStyle = GREEN; ctx.font = "11px sans-serif"; ctx.textAlign = "left";
      ctx.fillText("■ = 0x01  (par inverso multiplicativo)", ox, oy + SIZE * cellH + 18);
      ctx.fillStyle = SLATE;
      ctx.fillText("Poly irreducible AES: x⁸+x⁴+x³+x+1  (0x11B)", ox, oy + SIZE * cellH + 34);
    }

  }, [mode, primeIdx]);

  // Util: roundRect polyfill
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
  }

  const btnStyle = (active) => ({
    flex: 1, padding: "5px 0", borderRadius: 6, fontSize: 11, cursor: "pointer",
    border: active ? "1.5px solid #60a5fa" : "1.5px solid #1e293b",
    background: active ? "#1e3a5f" : "#0f172a",
    color: active ? "#60a5fa" : "#475569",
    transition: "all .2s",
  });

  return (
    <div className="viz-box">
      <canvas ref={canvasRef} width={W} height={H}
        style={{ display: "block", width: "100%", borderRadius: 8, background: BG }} />

      <div className="viz-ctrl" style={{ marginTop: 8, gap: 5 }}>
        {MODES.map((m, i) => (
          <button key={i} onClick={() => setMode(i)} style={btnStyle(mode === i)}>{m}</button>
        ))}
      </div>

      {mode === 1 && (
        <div className="viz-ctrl" style={{ marginTop: 6 }}>
          <span style={{ color: "#475569", fontSize: 11, minWidth: 60 }}>
            p = {PRIMES[primeIdx]}
          </span>
          <input type="range" min={0} max={PRIMES.length - 1} step={1} value={primeIdx}
            onChange={e => setPrimeIdx(Number(e.target.value))}
            style={{ flex: 1, accentColor: "#60a5fa" }} />
          <span style={{ color: "#64748b", fontSize: 10 }}>
            {PRIMES.map((p, i) => (
              <span key={p} style={{ color: i === primeIdx ? "#60a5fa" : "#334155", marginLeft: 4 }}>{p}</span>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}
