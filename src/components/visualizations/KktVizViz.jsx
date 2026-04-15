import React, { useState, useEffect, useRef } from 'react';

export default function KktVizViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('lagrange');  // lagrange | kkt | svm
    const [cx, setCx] = useState(2.0);         // centro objetivo x
    const [cy, setCy] = useState(1.0);         // centro objetivo y
    const [radius, setRadius] = useState(1.0);         // radio restricción
    const [cVal, setCVal] = useState(1.5);         // umbral desigualdad
    const [showDual, setShowDual] = useState(true);

    const MODES = [
        { key: 'lagrange', label: 'Multiplicadores Lagrange' },
        { key: 'kkt', label: 'Holgura Complementaria' },
        { key: 'svm', label: 'SVM & Vectores Soporte' },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(0, 0, W, H);

        const txt = (t, x, y, color = '#94a3b8', size = 11, bold = false) => {
            ctx.fillStyle = color;
            ctx.font = `${bold ? 'bold ' : ''}${size}px monospace`;
            ctx.fillText(t, x, y);
        };

        const drawArrow = (x1, y1, x2, y2, color, lw = 2, dash = []) => {
            const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
            if (len < 2) return;
            const ux = dx / len, uy = dy / len, hw = 7, hl = 12;
            ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
            ctx.setLineDash(dash);
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
            ctx.setLineDash([]);
            ctx.beginPath();
            ctx.moveTo(x2, y2);
            ctx.lineTo(x2 - hl * ux + hw * uy, y2 - hl * uy - hw * ux);
            ctx.lineTo(x2 - hl * ux - hw * uy, y2 - hl * uy + hw * ux);
            ctx.closePath(); ctx.fill();
        };

        // ── MODO: Multiplicadores de Lagrange ───────────────────────────────
        if (mode === 'lagrange') {
            const xMin = -3.5, xMax = 3.5, yMin = -3, yMax = 3;
            const tw = x => 28 + (x - xMin) / (xMax - xMin) * (W - 44);
            const ty = y => H - 28 - (y - yMin) / (yMax - yMin) * (H - 52);
            const sc = 55; // pixels por unidad

            txt('min f(x,y)=(x−cx)²+(y−cy)²  s.t.  x²+y²=r²', 12, 18, '#60a5fa', 10, true);

            // Curvas de nivel de f
            const f = (x, y) => (x - cx) * (x - cx) + (y - cy) * (y - cy);
            const res = 80;
            let zMn = Infinity, zMx = -Infinity;
            const zG = [];
            for (let i = 0; i < res; i++) {
                zG[i] = [];
                for (let j = 0; j < res; j++) {
                    const x = xMin + i / (res - 1) * (xMax - xMin);
                    const y = yMin + j / (res - 1) * (yMax - yMin);
                    const z = f(x, y); zG[i][j] = z;
                    if (z < zMn) zMn = z; if (z > zMx) zMx = z;
                }
            }
            const nLv = 10;
            Array.from({ length: nLv }, (_, k) => zMn + (k + 0.5) * (zMx - zMn) / nLv).forEach((level, k) => {
                const t = k / nLv;
                ctx.strokeStyle = `rgba(96,165,250,${0.12 + t * 0.25})`; ctx.lineWidth = 1 + t;
                for (let i = 0; i < res - 1; i++) {
                    for (let j = 0; j < res - 1; j++) {
                        const x = xMin + i / (res - 1) * (xMax - xMin);
                        const y = yMin + j / (res - 1) * (yMax - yMin);
                        const ddx = (xMax - xMin) / (res - 1), ddy = (yMax - yMin) / (res - 1);
                        const z00 = zG[i][j], z10 = zG[i + 1][j], z01 = zG[i][j + 1], z11 = zG[i + 1][j + 1];
                        const cross = (za, zb) => (za < level) !== (zb < level) ? (level - za) / (zb - za) : null;
                        const pts = [];
                        const t01 = cross(z00, z10); if (t01 != null) pts.push([tw(x + t01 * ddx), ty(y)]);
                        const t12 = cross(z10, z11); if (t12 != null) pts.push([tw(x + ddx), ty(y + t12 * ddy)]);
                        const t23 = cross(z11, z01); if (t23 != null) pts.push([tw(x + (1 - t23) * ddx), ty(y + ddy)]);
                        const t30 = cross(z01, z00); if (t30 != null) pts.push([tw(x), ty(y + t30 * ddy)]);
                        if (pts.length === 2) {
                            ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
                            ctx.lineTo(pts[1][0], pts[1][1]); ctx.stroke();
                        }
                    }
                }
            });

            // Restricción: círculo x²+y²=r²
            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(tw(0), ty(0), radius * sc, 0, 2 * Math.PI); ctx.stroke();
            txt(`x²+y²=${radius.toFixed(1)}²`, tw(radius) + 4, ty(0) - 8, '#fbbf24', 10, true);

            // Punto óptimo x*=(r·cx/|c|, r·cy/|c|)
            const cNorm = Math.sqrt(cx * cx + cy * cy);
            const xOpt = cNorm > 1e-9 ? cx / cNorm * radius : radius;
            const yOpt = cNorm > 1e-9 ? cy / cNorm * radius : 0;
            const fOpt = f(xOpt, yOpt);
            const lamStar = cNorm > 1e-9 ? 1 - cNorm : 0;

            // Ejes
            ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
            ctx.beginPath(); ctx.moveTo(tw(0), 28); ctx.lineTo(tw(0), H - 28); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(28, ty(0)); ctx.lineTo(W - 16, ty(0)); ctx.stroke();
            ctx.setLineDash([]);

            // Centro del objetivo (sin restricción)
            ctx.beginPath(); ctx.arc(tw(cx), ty(cy), 5, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(96,165,250,0.6)'; ctx.fill();
            txt(`(${cx.toFixed(1)},${cy.toFixed(1)})`, tw(cx) + 7, ty(cy) - 6, '#60a5fa', 9);

            // Punto óptimo
            ctx.beginPath(); ctx.arc(tw(xOpt), ty(yOpt), 8, 0, 2 * Math.PI);
            ctx.fillStyle = '#34d399'; ctx.fill();
            txt(`x*=(${xOpt.toFixed(2)},${yOpt.toFixed(2)})`, tw(xOpt) + 10, ty(yOpt) - 6, '#34d399', 10, true);

            // Gradiente ∇f en x*
            const gfx = 2 * (xOpt - cx), gfy = 2 * (yOpt - cy);
            const gfNorm = Math.sqrt(gfx * gfx + gfy * gfy) + 1e-9;
            const sc2 = 50;
            drawArrow(tw(xOpt), ty(yOpt),
                tw(xOpt) + gfx / gfNorm * sc2, ty(yOpt) - gfy / gfNorm * sc2,
                '#60a5fa', 2.5);
            txt('∇f', tw(xOpt) + gfx / gfNorm * sc2 + 4, ty(yOpt) - gfy / gfNorm * sc2 - 4, '#60a5fa', 10, true);

            // Gradiente ∇h en x* (apunta hacia fuera del círculo)
            const ghx = 2 * xOpt, ghy = 2 * yOpt;
            const ghNorm = Math.sqrt(ghx * ghx + ghy * ghy) + 1e-9;
            drawArrow(tw(xOpt), ty(yOpt),
                tw(xOpt) + ghx / ghNorm * sc2, ty(yOpt) - ghy / ghNorm * sc2,
                '#fbbf24', 2.5, [5, 4]);
            txt('∇h', tw(xOpt) + ghx / ghNorm * sc2 + 4, ty(yOpt) - ghy / ghNorm * sc2 - 4, '#fbbf24', 10, true);

            // KKT: ∇f = −λ∇h → paralelos y opuestos si λ<0
            const parallel = Math.abs(gfx * ghx + gfy * ghy) / (gfNorm * ghNorm);
            txt(`KKT: ∇f + λ∇h = 0`, 12, H - 46, '#94a3b8', 10, true);
            txt(`λ* = ${lamStar.toFixed(4)}  (precio sombra)`, 12, H - 30, '#34d399', 10);
            txt(`f(x*) = ${fOpt.toFixed(4)}  |∇f ∥ ∇h|: ${(parallel * 100).toFixed(1)}%`,
                12, H - 14, '#475569', 10);
        }

        // ── MODO: Holgura complementaria ────────────────────────────────────
        if (mode === 'kkt') {
            txt('Holgura complementaria: μ·g(x*) = 0', W / 2 - 130, 18, '#60a5fa', 12, true);

            // f(x) = (x-2)² en 1D con restricción g(x) = x-c ≤ 0
            const xMin1D = -0.5, xMax1D = 4.5;
            const tw1 = x => 50 + (x - xMin1D) / (xMax1D - xMin1D) * (W - 70);
            const ty1 = y => H - 40 - (y) / (9) * (H - 80);

            const fObj = x => (x - 2) * (x - 2);
            const gIneq = x => x - cVal;        // g(x) = x−c ≤ 0  ↔  x ≤ c

            // Curva f
            ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2.5;
            ctx.beginPath(); let first = true;
            for (let px = 50; px <= W - 20; px++) {
                const x = xMin1D + (px - 50) / (W - 70) * (xMax1D - xMin1D);
                const y = fObj(x);
                if (y > 9) { first = true; continue; }
                first ? ctx.moveTo(px, ty1(y)) : ctx.lineTo(px, ty1(y));
                first = false;
            }
            ctx.stroke();

            // Eje x
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(50, ty1(0)); ctx.lineTo(W - 20, ty1(0)); ctx.stroke();
            [0, 1, 2, 3, 4].forEach(xi => {
                ctx.beginPath(); ctx.moveTo(tw1(xi), ty1(0) - 4); ctx.lineTo(tw1(xi), ty1(0) + 4); ctx.stroke();
                txt(`${xi}`, tw1(xi) - 4, ty1(0) + 16, '#475569', 9);
            });

            // Región factible: x ≤ c (sombreado)
            ctx.fillStyle = 'rgba(52,211,153,0.08)';
            ctx.fillRect(50, 28, tw1(cVal) - 50, H - 68);
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
            ctx.beginPath(); ctx.moveTo(tw1(cVal), 28); ctx.lineTo(tw1(cVal), H - 40); ctx.stroke();
            ctx.setLineDash([]);
            txt(`c=${cVal.toFixed(1)}`, tw1(cVal) + 4, 36, '#34d399', 10, true);
            txt('región factible x≤c', 54, 42, '#34d399', 9);

            // Óptimo sin restricción: x*=2
            const xUnconstr = 2.0;
            // Óptimo con restricción
            const xConstr = Math.min(xUnconstr, cVal);
            const fConstr = fObj(xConstr);
            const gConstr = gIneq(xConstr);

            // Determinar caso KKT
            const activa = Math.abs(gConstr) < 1e-4;
            const mu = activa ? 2 * (xConstr - 2) * (-1) : 0; // μ=−∇f/∇g cuando activa
            const muPos = activa && mu >= 0;

            // Punto óptimo
            ctx.beginPath(); ctx.arc(tw1(xConstr), ty1(fConstr), 8, 0, 2 * Math.PI);
            ctx.fillStyle = activa ? '#fbbf24' : '#34d399'; ctx.fill();
            txt(`x*=${xConstr.toFixed(2)}`, tw1(xConstr) + 10, ty1(fConstr) - 8,
                activa ? '#fbbf24' : '#34d399', 11, true);

            // Panel KKT
            const py = 100;
            txt('Condiciones KKT:', 16, py, '#94a3b8', 11, true);
            const checks = [
                {
                    cond: `∇f(x*) + μ·∇g(x*) = 0`,
                    ok: activa ? Math.abs(2 * (xConstr - 2) - mu) < 0.01 : Math.abs(2 * (xConstr - 2)) < 0.01,
                    val: activa ? `${(2 * (xConstr - 2)).toFixed(3)} + μ·1=0 → μ=${(-2 * (xConstr - 2)).toFixed(3)}`
                        : `${(2 * (xConstr - 2)).toFixed(3)} ≠ 0 (irrestricto)`
                },
                {
                    cond: `g(x*) ≤ 0`,
                    ok: gConstr <= 1e-4,
                    val: `x*−c = ${gConstr.toFixed(3)} ≤ 0`
                },
                {
                    cond: `μ ≥ 0`,
                    ok: !activa || muPos,
                    val: activa ? `μ = ${mu.toFixed(3)} ${muPos ? '≥ 0 ✓' : '< 0 ✗'}` : `μ = 0 (inactiva)`
                },
                {
                    cond: `μ·g(x*) = 0`,
                    ok: Math.abs(mu * gConstr) < 1e-6,
                    val: `${mu.toFixed(3)}·${gConstr.toFixed(3)} = ${(mu * gConstr).toFixed(6)}`
                },
            ];
            checks.forEach(({ cond, ok, val }, i) => {
                const color = ok ? '#34d399' : '#f87171';
                txt(`${ok ? '✓' : '✗'} ${cond}`, 16, py + 20 + i * 26, color, 10, true);
                txt(`   ${val}`, 16, py + 33 + i * 26, '#475569', 9);
            });

            // Clasificación
            const caso = activa ? 'Restricción ACTIVA: g=0, μ>0' : 'Restricción INACTIVA: g<0, μ=0';
            const casoColor = activa ? '#fbbf24' : '#34d399';
            txt(caso, 16, H - 28, casoColor, 11, true);
            txt('Holgura complementaria: μ·g = 0 siempre', 16, H - 12, '#475569', 10);
        }

        // ── MODO: SVM ────────────────────────────────────────────────────────
        if (mode === 'svm') {
            txt('SVM — KKT y vectores soporte (αᵢ > 0)', W / 2 - 140, 18, '#60a5fa', 12, true);

            const xMin = -3, xMax = 3, yMin = -3, yMax = 3;
            const tw = x => 24 + (x - xMin) / (xMax - xMin) * (W - 40);
            const ty = y => H - 24 - (y - yMin) / (yMax - yMin) * (H - 48);

            // Datos sintéticos fijos
            const pos = [
                { x: 1.2, y: 1.5 }, { x: 1.8, y: 0.8 }, { x: 0.8, y: 2.1 },
                { x: 2.2, y: 1.2 }, { x: 1.5, y: 0.3 }, { x: 0.5, y: 0.8 },
            ];
            const neg = [
                { x: -1.0, y: -1.2 }, { x: -1.8, y: -0.5 }, { x: -0.6, y: -1.8 },
                { x: -2.0, y: -1.0 }, { x: -1.3, y: 0.2 }, { x: -0.4, y: -0.6 },
            ];

            // Hiperplano separador: w=(0.7,0.7)/‖·‖, b≈0 (simétrico)
            const wNorm = Math.sqrt(0.98);
            const w1 = 0.7 / wNorm, w2 = 0.7 / wNorm, b = 0;
            const margin = 1 / wNorm;

            // Región de margen
            ctx.fillStyle = 'rgba(96,165,250,0.06)';
            // Banda entre las dos rectas de margen
            const xL = xMin, xR = xMax;
            const yHyp = (x, b2) => (-w1 * x - b2) / w2;
            ctx.beginPath();
            ctx.moveTo(tw(xL), ty(yHyp(xL, 1)));
            ctx.lineTo(tw(xR), ty(yHyp(xR, 1)));
            ctx.lineTo(tw(xR), ty(yHyp(xR, -1)));
            ctx.lineTo(tw(xL), ty(yHyp(xL, -1)));
            ctx.closePath(); ctx.fill();

            // Hiperplano separador
            ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(tw(xL), ty(yHyp(xL, 0)));
            ctx.lineTo(tw(xR), ty(yHyp(xR, 0)));
            ctx.stroke();
            txt('w·x+b=0', tw(2.2), ty(yHyp(2.2, 0)) - 10, '#60a5fa', 10, true);

            // Márgenes
            ctx.strokeStyle = 'rgba(96,165,250,0.4)'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(tw(xL), ty(yHyp(xL, 1)));
            ctx.lineTo(tw(xR), ty(yHyp(xR, 1)));
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(tw(xL), ty(yHyp(xL, -1)));
            ctx.lineTo(tw(xR), ty(yHyp(xR, -1)));
            ctx.stroke();
            ctx.setLineDash([]);

            // Flecha: vector w (normal al hiperplano)
            const wSc = 50;
            drawArrow(tw(0), ty(0), tw(0) + w1 * wSc, ty(0) - w2 * wSc, '#fbbf24', 2.5);
            txt('w', tw(0) + w1 * wSc + 4, ty(0) - w2 * wSc - 4, '#fbbf24', 11, true);

            // Flecha: margen = 2/‖w‖
            const mx = tw(-margin / w1 * w2), my = ty(margin);
            ctx.strokeStyle = 'rgba(251,191,36,0.4)'; ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(tw(0), ty(margin)); ctx.lineTo(tw(0), ty(-margin)); ctx.stroke();
            ctx.setLineDash([]);
            txt(`margen=2/‖w‖`, tw(0) + 6, ty(0), '#fbbf24', 9);

            // Puntos: positivos y negativos
            const isOnMargin = (pt, y_sign) => {
                const val = w1 * pt.x + w2 * pt.y + b;
                return Math.abs(val - y_sign) < 0.45;
            };

            pos.forEach(pt => {
                const sv = isOnMargin(pt, 1);
                ctx.beginPath(); ctx.arc(tw(pt.x), ty(pt.y), sv ? 9 : 5, 0, 2 * Math.PI);
                ctx.fillStyle = sv ? '#34d39966' : '#34d39933'; ctx.fill();
                ctx.strokeStyle = '#34d399'; ctx.lineWidth = sv ? 2.5 : 1.2; ctx.stroke();
                if (sv) {
                    // αᵢ label
                    txt(`α>0`, tw(pt.x) + 10, ty(pt.y) - 4, '#34d399', 9, true);
                    // Círculo exterior SV
                    ctx.beginPath(); ctx.arc(tw(pt.x), ty(pt.y), 13, 0, 2 * Math.PI);
                    ctx.strokeStyle = '#34d39966'; ctx.lineWidth = 1; ctx.stroke();
                }
            });

            neg.forEach(pt => {
                const sv = isOnMargin(pt, -1);
                ctx.beginPath(); ctx.arc(tw(pt.x), ty(pt.y), sv ? 9 : 5, 0, 2 * Math.PI);
                ctx.fillStyle = sv ? '#f8717166' : '#f8717133'; ctx.fill();
                ctx.strokeStyle = '#f87171'; ctx.lineWidth = sv ? 2.5 : 1.2; ctx.stroke();
                if (sv) {
                    txt(`α>0`, tw(pt.x) + 10, ty(pt.y) - 4, '#f87171', 9, true);
                    ctx.beginPath(); ctx.arc(tw(pt.x), ty(pt.y), 13, 0, 2 * Math.PI);
                    ctx.strokeStyle = '#f8717166'; ctx.lineWidth = 1; ctx.stroke();
                }
            });

            // Leyenda
            ctx.beginPath(); ctx.arc(W - 155, H - 50, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#34d39933'; ctx.fill();
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.2; ctx.stroke();
            txt('clase +1', W - 143, H - 46, '#34d399', 10);
            ctx.beginPath(); ctx.arc(W - 155, H - 33, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#f8717133'; ctx.fill();
            ctx.strokeStyle = '#f87171'; ctx.lineWidth = 1.2; ctx.stroke();
            txt('clase −1', W - 143, H - 29, '#f87171', 10);
            ctx.beginPath(); ctx.arc(W - 155, H - 16, 9, 0, 2 * Math.PI);
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2.5; ctx.stroke();
            txt('vector soporte (αᵢ>0)', W - 143, H - 12, '#94a3b8', 10);

            // KKT info
            txt('KKT → solo SVs definen w: w = Σ αᵢyᵢxᵢ', 16, H - 28, '#fbbf24', 10, true);
            txt(`Holgura compl: αᵢ(yᵢ(w·xᵢ+b)−1)=0  ∀i`, 16, H - 13, '#475569', 10);
        }

    }, [mode, cx, cy, radius, cVal, showDual]);

    return (
        <div className="viz-box" style={{ background: '#0b1220', borderRadius: 10, padding: 12 }}>
            <canvas
                ref={canvasRef}
                width={530}
                height={370}
                style={{ borderRadius: 8, display: 'block', margin: '0 auto' }}
            />
            <div className="viz-ctrl" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>

                {/* Selector modo */}
                <div style={{ display: 'flex', gap: 6 }}>
                    {MODES.map(({ key, label }) => (
                        <button key={key} onClick={() => setMode(key)} style={{
                            flex: 1, padding: '5px 4px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                            border: `1.5px solid ${mode === key ? '#60a5fa' : '#334155'}`,
                            background: mode === key ? '#60a5fa22' : 'transparent',
                            color: mode === key ? '#60a5fa' : '#64748b',
                            fontFamily: 'monospace', transition: 'all 0.15s',
                        }}>{label}</button>
                    ))}
                </div>

                {/* Sliders Lagrange */}
                {mode === 'lagrange' && (
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {[
                            { label: 'cx', val: cx, set: setCx, min: -2.5, max: 2.5, color: '#60a5fa' },
                            { label: 'cy', val: cy, set: setCy, min: -2.5, max: 2.5, color: '#34d399' },
                            { label: 'r', val: radius, set: setRadius, min: 0.3, max: 2.5, color: '#fbbf24' },
                        ].map(({ label, val, set, min, max, color }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 120 }}>
                                <span style={{ color, fontSize: 10, minWidth: 50, fontFamily: 'monospace', fontWeight: 'bold' }}>
                                    {label}={val.toFixed(2)}
                                </span>
                                <input type="range" min={min} max={max} step={0.05} value={val}
                                    onChange={e => set(Number(e.target.value))}
                                    style={{ flex: 1, accentColor: color }} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Slider KKT */}
                {mode === 'kkt' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#34d399', fontSize: 11, minWidth: 110, fontFamily: 'monospace' }}>
                            umbral c = {cVal.toFixed(2)}
                        </span>
                        <input type="range" min={0.5} max={3.5} step={0.05} value={cVal}
                            onChange={e => setCVal(Number(e.target.value))}
                            style={{ flex: 1, accentColor: '#34d399' }} />
                        <span style={{ color: '#475569', fontSize: 9, minWidth: 100 }}>
                            {cVal < 2 ? 'restricción activa' : 'irrestricto'}
                        </span>
                    </div>
                )}

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Lagrange</b>: en x* los gradientes ∇f y ∇h son paralelos — mueve el centro y el radio.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Holgura</b>: desliza c para ver cuándo la restricción es activa (μ>0) o inactiva (μ=0).&nbsp;
                    <b style={{ color: '#94a3b8' }}>SVM</b>: solo los vectores soporte (αᵢ>0, en el margen) determinan el hiperplano.
                </p>
            </div>
        </div>
    );
}