import React, { useState, useEffect, useRef } from 'react';

export default function JacobianVizViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('deform');   // deform | matrix | softmax
    const [a00, setA00] = useState(1.2);
    const [a01, setA01] = useState(0.5);
    const [a10, setA10] = useState(-0.4);
    const [a11, setA11] = useState(0.9);
    const [zIdx, setZIdx] = useState(0);           // componente softmax a examinar

    const MODES = [
        { key: 'deform', label: 'Deformación local' },
        { key: 'matrix', label: 'Estructura J (m×n)' },
        { key: 'softmax', label: 'Jacobiana Softmax' },
    ];

    // Softmax y su Jacobiana
    const softmax = (z) => {
        const mx = Math.max(...z);
        const e = z.map(v => Math.exp(v - mx));
        const s = e.reduce((a, b) => a + b, 0);
        return e.map(v => v / s);
    };
    const zVec = [2.0, 1.0, 0.5, -0.5];

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

        // ── MODO: Deformación local ──────────────────────────────────────────
        if (mode === 'deform') {
            txt('Jacobiana como mejor aproximación lineal local', 16, 20, '#60a5fa', 12, true);

            const J = [[a00, a01], [a10, a11]];
            const det = a00 * a11 - a01 * a10;

            // Dos paneles: espacio original (izq) y transformado (der)
            const Lcx = 140, Lcy = 210, sc = 40;
            const Rcx = 390, Rcy = 210;

            const applyJ = ([x, y]) => [J[0][0] * x + J[0][1] * y, J[1][0] * x + J[1][1] * y];
            const toLc = ([x, y]) => [Lcx + x * sc, Lcy - y * sc];
            const toRc = ([x, y]) => [Rcx + x * sc, Rcy - y * sc];

            // Títulos paneles
            txt('Espacio original', Lcx - 60, 38, '#475569', 10);
            txt('Imagen bajo J·h', Rcx - 55, 38, '#475569', 10);

            // Divisor
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(W / 2, 30); ctx.lineTo(W / 2, H - 30); ctx.stroke();
            ctx.setLineDash([]);

            // Grid original
            ctx.strokeStyle = 'rgba(96,165,250,0.18)'; ctx.lineWidth = 1;
            for (let g = -3; g <= 3; g++) {
                ctx.beginPath();
                const [x1, y1] = toLc([g, -3]), [x2, y2] = toLc([g, 3]);
                ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                const [x3, y3] = toLc([-3, g]), [x4, y4] = toLc([3, g]);
                ctx.moveTo(x3, y3); ctx.lineTo(x4, y4); ctx.stroke();
            }

            // Grid transformado
            ctx.strokeStyle = 'rgba(52,211,153,0.25)'; ctx.lineWidth = 1;
            for (let g = -3; g <= 3; g++) {
                ctx.beginPath();
                const [x1, y1] = toRc(applyJ([g, -3])), [x2, y2] = toRc(applyJ([g, 3]));
                ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.beginPath();
                const [x3, y3] = toRc(applyJ([-3, g])), [x4, y4] = toRc(applyJ([3, g]));
                ctx.moveTo(x3, y3); ctx.lineTo(x4, y4); ctx.stroke();
            }

            // Ejes
            [[Lcx, Lcy, toLc], [Rcx, Rcy, toRc]].forEach(([cx, cy, tc]) => {
                ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.moveTo(cx - 120, cy); ctx.lineTo(cx + 120, cy); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(cx, cy - 120); ctx.lineTo(cx, cy + 120); ctx.stroke();
            });

            // Vectores base originales e₁, e₂
            const drawArrow = (tc, from, to, color, lw = 2) => {
                const [x1, y1] = tc(from), [x2, y2] = tc(to);
                const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
                if (len < 1) return;
                const ux = dx / len, uy = dy / len;
                ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                const hw = 6, hl = 10;
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * ux + hw * uy, y2 - hl * uy - hw * ux);
                ctx.lineTo(x2 - hl * ux - hw * uy, y2 - hl * uy + hw * ux);
                ctx.closePath(); ctx.fill();
            };

            // e₁ y Je₁ (columna 0 de J)
            drawArrow(toLc, [0, 0], [1, 0], '#fbbf24', 2.5);
            drawArrow(toRc, [0, 0], applyJ([1, 0]), '#fbbf24', 2.5);
            txt('e₁', ...toLc([1.1, 0.15]), '#fbbf24', 10, true);
            txt(`Je₁=(${a00.toFixed(1)},${a10.toFixed(1)})`,
                toRc(applyJ([1, 0]))[0] + 4, toRc(applyJ([1, 0]))[1] - 6, '#fbbf24', 9);

            // e₂ y Je₂ (columna 1 de J)
            drawArrow(toLc, [0, 0], [0, 1], '#34d399', 2.5);
            drawArrow(toRc, [0, 0], applyJ([0, 1]), '#34d399', 2.5);
            txt('e₂', ...toLc([0.1, 1.15]), '#34d399', 10, true);
            txt(`Je₂=(${a01.toFixed(1)},${a11.toFixed(1)})`,
                toRc(applyJ([0, 1]))[0] + 4, toRc(applyJ([0, 1]))[1] - 6, '#34d399', 9);

            // Cuadrado unitario → paralelogramo
            const sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
            ctx.strokeStyle = 'rgba(167,139,250,0.7)'; ctx.lineWidth = 1.8;
            ctx.beginPath();
            sq.forEach(([x, y], i) => {
                const [px, py] = toLc([x, y]);
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.closePath(); ctx.stroke();

            ctx.strokeStyle = 'rgba(167,139,250,0.9)'; ctx.lineWidth = 1.8;
            ctx.beginPath();
            sq.map(v => applyJ(v)).forEach(([x, y], i) => {
                const [px, py] = toRc([x, y]);
                i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
            });
            ctx.closePath(); ctx.stroke();
            ctx.fillStyle = 'rgba(167,139,250,0.08)';
            ctx.fill();

            // Determinante e info
            const absdet = Math.abs(det);
            const detColor = absdet < 0.3 ? '#f87171' : absdet > 2 ? '#fbbf24' : '#34d399';
            txt(`J = [[${a00.toFixed(2)}, ${a01.toFixed(2)}], [${a10.toFixed(2)}, ${a11.toFixed(2)}]]`,
                16, H - 44, '#e2e8f0', 10, true);
            txt(`det(J) = ${det.toFixed(4)}  → área del paralelogramo morado`,
                16, H - 28, detColor, 11, true);
            txt(det < 0 ? '← negativo: invierte orientación' : det === 0 ? '← singular: colapsa dimensión' : '',
                16, H - 12, '#f87171', 10);
        }

        // ── MODO: Estructura matricial ───────────────────────────────────────
        if (mode === 'matrix') {
            txt('Estructura de la Jacobiana: filas = gradientes, columnas = ∂f/∂xⱼ', 16, 20, '#60a5fa', 11, true);

            // Ejemplo f: R³ → R⁴
            const m = 4, n = 3;
            const J_ex = [
                [0.8, -0.3, 1.2],
                [-0.5, 1.7, 0.4],
                [0.2, -0.9, -0.6],
                [1.1, 0.3, -0.2],
            ];

            const cellW = 72, cellH = 34;
            const ox = 130, oy = 55;

            // Etiquetas columnas (xⱼ)
            ['x₁', 'x₂', 'x₃'].forEach((label, j) => {
                txt(label, ox + j * cellW + cellW / 2 - 8, oy - 10, '#60a5fa', 11, true);
                // Highlight columna j (derivada respecto a xⱼ)
                ctx.fillStyle = `rgba(96,165,250,0.06)`;
                ctx.fillRect(ox + j * cellW, oy, cellW, m * cellH);
            });

            // Etiquetas filas (fᵢ)
            ['f₁', 'f₂', 'f₃', 'f₄'].forEach((label, i) => {
                txt(label, ox - 32, oy + i * cellH + cellH / 2 + 4, '#34d399', 11, true);
                // Highlight fila i (gradiente de fᵢ)
                ctx.fillStyle = `rgba(52,211,153,0.05)`;
                ctx.fillRect(ox, oy + i * cellH, n * cellW, cellH);
            });

            // Celdas de la Jacobiana
            J_ex.forEach((row, i) => {
                row.forEach((val, j) => {
                    const cx2 = ox + j * cellW;
                    const cy2 = oy + i * cellH;
                    const alpha = Math.min(Math.abs(val) / 2.0, 0.7);
                    ctx.fillStyle = (val >= 0 ? '#60a5fa' : '#f87171') +
                        Math.round(alpha * 255).toString(16).padStart(2, '0');
                    ctx.fillRect(cx2 + 1, cy2 + 1, cellW - 2, cellH - 2);
                    ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 1;
                    ctx.strokeRect(cx2 + 1, cy2 + 1, cellW - 2, cellH - 2);
                    txt(`∂f${i + 1}/∂x${j + 1}`, cx2 + 6, cy2 + 14, '#94a3b8', 8);
                    txt(val.toFixed(2), cx2 + cellW / 2 - 14, cy2 + cellH / 2 + 8, '#e2e8f0', 11, true);
                });
            });

            // Corchetes
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(ox - 8, oy); ctx.lineTo(ox - 14, oy);
            ctx.lineTo(ox - 14, oy + m * cellH); ctx.lineTo(ox - 8, oy + m * cellH); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(ox + n * cellW + 8, oy); ctx.lineTo(ox + n * cellW + 14, oy);
            ctx.lineTo(ox + n * cellW + 14, oy + m * cellH); ctx.lineTo(ox + n * cellW + 8, oy + m * cellH); ctx.stroke();

            // Etiqueta dimensión
            txt(`J_f  ∈  ℝ^{${m}×${n}}`, ox, oy + m * cellH + 22, '#a78bfa', 11, true);
            txt(`(m=4 salidas, n=3 entradas)`, ox, oy + m * cellH + 38, '#475569', 10);

            // Leyenda
            txt('Fila i  = ∇fᵢ  (gradiente de la i-ésima salida)', 16, H - 42, '#34d399', 10, true);
            txt('Col j   = ∂f/∂xⱼ  (cómo cambia todo f al perturbar xⱼ)', 16, H - 27, '#60a5fa', 10, true);
            txt('Azul > 0 = incremento | Rojo < 0 = decremento', 16, H - 12, '#475569', 10);

            // VJP/JVP labels
            txt('VJP: vᵀJ  ← modo reverso (1 backward pass = n gradientes)',
                ox + n * cellW + 24, oy + m * cellH / 2, '#f87171', 9);
            txt('JVP: J·u  ↓ modo directo (1 forward pass = m outputs)',
                ox + n * cellW / 2 - 40, oy - 28, '#fbbf24', 9);
        }

        // ── MODO: Jacobiana Softmax ──────────────────────────────────────────
        if (mode === 'softmax') {
            txt('Jacobiana del Softmax: J = diag(σ) − σσᵀ', 16, 20, '#60a5fa', 12, true);

            const s = softmax(zVec);
            const n = s.length;

            // J_softmax
            const J_s = s.map((si, i) =>
                s.map((sj, j) => si * ((i === j ? 1 : 0) - sj))
            );

            const cellW = 80, cellH = 38;
            const ox = 110, oy = 52;

            // Etiquetas
            ['σ₁', 'σ₂', 'σ₃', 'σ₄'].forEach((label, j) => {
                txt(label, ox + j * cellW + cellW / 2 - 10, oy - 10, '#60a5fa', 10);
                txt(`${s[j].toFixed(3)}`, ox + j * cellW + cellW / 2 - 14, oy - 24, '#475569', 9);
            });
            ['∂σ₁/∂z', '∂σ₂/∂z', '∂σ₃/∂z', '∂σ₄/∂z'].forEach((label, i) => {
                txt(`σ${i + 1}=${s[i].toFixed(3)}`, ox - 98, oy + i * cellH + cellH / 2 + 4, '#34d399', 9);
            });

            // Celdas
            const maxVal = Math.max(...J_s.flat().map(Math.abs));
            J_s.forEach((row, i) => {
                row.forEach((val, j) => {
                    const cx2 = ox + j * cellW, cy2 = oy + i * cellH;
                    const alpha = Math.abs(val) / maxVal * 0.85;
                    // Diagonal = σᵢ(1−σᵢ) > 0 (azul), fuera diagonal = −σᵢσⱼ < 0 (rojo)
                    const color = i === j ? '#34d399' : '#f87171';
                    ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
                    ctx.fillRect(cx2 + 1, cy2 + 1, cellW - 2, cellH - 2);
                    if (i === j) {
                        ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.5;
                        ctx.strokeRect(cx2 + 1, cy2 + 1, cellW - 2, cellH - 2);
                    }
                    txt(val.toFixed(4), cx2 + 4, cy2 + cellH / 2 + 5, '#e2e8f0', 9);
                });
            });

            // Corchetes
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(ox - 8, oy); ctx.lineTo(ox - 14, oy);
            ctx.lineTo(ox - 14, oy + n * cellH); ctx.lineTo(ox - 8, oy + n * cellH); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(ox + n * cellW + 8, oy); ctx.lineTo(ox + n * cellW + 14, oy);
            ctx.lineTo(ox + n * cellW + 14, oy + n * cellH); ctx.lineTo(ox + n * cellW + 8, oy + n * cellH); ctx.stroke();

            // Propiedades
            const rowSums = J_s.map(row => row.reduce((a, b) => a + b, 0));
            const selectedRow = J_s[zIdx];

            txt(`J ∈ ℝ^{4×4}  (n=4, m=n: softmax preserva dimensión)`,
                ox, oy + n * cellH + 18, '#a78bfa', 10, true);
            txt(`Diagonal: σᵢ(1−σᵢ) ≥ 0  (verde)`, 16, H - 54, '#34d399', 10, true);
            txt(`Fuera diagonal: −σᵢσⱼ ≤ 0  (rojo)`, 16, H - 39, '#f87171', 10, true);
            txt(`Suma por filas ≡ 0: [${rowSums.map(v => v.toFixed(4)).join(', ')}]`,
                16, H - 24, '#475569', 10);
            txt(`σ = [${s.map(v => v.toFixed(3)).join(', ')}]   z = [${zVec.join(', ')}]`,
                16, H - 9, '#475569', 10);
        }

    }, [mode, a00, a01, a10, a11, zIdx]);

    return (
        <div className="viz-box" style={{ background: '#0b1220', borderRadius: 10, padding: 12 }}>
            <canvas
                ref={canvasRef}
                width={540}
                height={380}
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

                {/* Sliders para deformación */}
                {mode === 'deform' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span style={{ color: '#94a3b8', fontSize: 10 }}>
                            Entradas de J (transformación lineal 2×2):
                        </span>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {[
                                { label: 'J₁₁', val: a00, set: setA00, color: '#fbbf24' },
                                { label: 'J₁₂', val: a01, set: setA01, color: '#fbbf24' },
                                { label: 'J₂₁', val: a10, set: setA10, color: '#34d399' },
                                { label: 'J₂₂', val: a11, set: setA11, color: '#34d399' },
                            ].map(({ label, val, set, color }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 140 }}>
                                    <span style={{ color, fontSize: 10, minWidth: 42, fontFamily: 'monospace' }}>
                                        {label}={val.toFixed(1)}
                                    </span>
                                    <input type="range" min={-2} max={2} step={0.1} value={val}
                                        onChange={e => set(Number(e.target.value))}
                                        style={{ flex: 1, accentColor: color }} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Deformación</b>: J mapea vectores base → columnas de J; det(J) = factor de área.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Estructura</b>: filas = gradientes ∇fᵢ; columnas = ∂f/∂xⱼ; VJP/JVP evitan materializar J.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Softmax</b>: J = diag(σ)−σσᵀ, simétrica, suma de filas = 0, diagonal ≥ 0.
                </p>
            </div>
        </div>
    );
}