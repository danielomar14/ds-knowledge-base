import React, { useState, useEffect, useRef } from 'react';

export default function ChainMultivarViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('graph');   // graph | jacobian | backprop
    const [x1, setX1] = useState(0.5);
    const [x2, setX2] = useState(1.2);
    const [layer, setLayer] = useState(2);         // capa activa en backprop

    const MODES = [
        { key: 'graph', label: 'Grafo computacional' },
        { key: 'jacobian', label: 'Jacobianos & cadena' },
        { key: 'backprop', label: 'Backprop capa a capa' },
    ];

    // Funciones del ejemplo: g: R²→R³, f: R³→R (escalar)
    const sigmoid = x => 1 / (1 + Math.exp(-x));
    const dsigmoid = x => { const s = sigmoid(x); return s * (1 - s); };

    const computeGraph = (x1, x2) => {
        const y1 = Math.sin(x1) * x2;
        const y2 = x1 * x1 - x2 * x2;
        const y3 = Math.exp(Math.min(x1 + x2, 4));
        const z = y1 + y2 * y2 + Math.log(Math.max(y3, 1e-6));
        // Derivadas parciales locales
        const dz_dy1 = 1;
        const dz_dy2 = 2 * y2;
        const dz_dy3 = 1 / y3;
        const dy1_dx1 = Math.cos(x1) * x2;
        const dy1_dx2 = Math.sin(x1);
        const dy2_dx1 = 2 * x1;
        const dy2_dx2 = -2 * x2;
        const dy3_dx1 = y3;
        const dy3_dx2 = y3;
        const dz_dx1 = dz_dy1 * dy1_dx1 + dz_dy2 * dy2_dx1 + dz_dy3 * dy3_dx1;
        const dz_dx2 = dz_dy1 * dy1_dx2 + dz_dy2 * dy2_dx2 + dz_dy3 * dy3_dx2;
        return {
            y1, y2, y3, z, dz_dy1, dz_dy2, dz_dy3,
            dy1_dx1, dy1_dx2, dy2_dx1, dy2_dx2, dy3_dx1, dy3_dx2,
            dz_dx1, dz_dx2
        };
    };

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

        const G = computeGraph(x1, x2);

        // ── MODO: Grafo computacional ────────────────────────────────────────
        if (mode === 'graph') {
            txt('Grafo computacional: z = f(g(x₁,x₂))', 20, 22, '#60a5fa', 13, true);

            // Layout de nodos
            const nodes = [
                { id: 'x1', label: 'x₁', val: x1.toFixed(2), cx: 70, cy: 130, color: '#60a5fa', r: 28 },
                { id: 'x2', label: 'x₂', val: x2.toFixed(2), cx: 70, cy: 250, color: '#60a5fa', r: 28 },
                { id: 'y1', label: 'y₁', val: G.y1.toFixed(2), cx: 210, cy: 100, color: '#34d399', r: 28 },
                { id: 'y2', label: 'y₂', val: G.y2.toFixed(2), cx: 210, cy: 200, color: '#34d399', r: 28 },
                { id: 'y3', label: 'y₃', val: G.y3.toFixed(2), cx: 210, cy: 300, color: '#34d399', r: 28 },
                { id: 'z', label: 'z', val: G.z.toFixed(2), cx: 380, cy: 200, color: '#a78bfa', r: 32 },
            ];

            // Aristas forward con etiqueta de derivada parcial local
            const edges = [
                { from: 0, to: 2, fwdLabel: 'sin(x₁)·x₂', bwdLabel: `∂y₁/∂x₁=${G.dy1_dx1.toFixed(2)}`, bwdColor: '#fbbf24' },
                { from: 1, to: 2, fwdLabel: 'sin(x₁)·x₂', bwdLabel: `∂y₁/∂x₂=${G.dy1_dx2.toFixed(2)}`, bwdColor: '#fbbf24' },
                { from: 0, to: 3, fwdLabel: 'x₁²−x₂²', bwdLabel: `∂y₂/∂x₁=${G.dy2_dx1.toFixed(2)}`, bwdColor: '#fbbf24' },
                { from: 1, to: 3, fwdLabel: 'x₁²−x₂²', bwdLabel: `∂y₂/∂x₂=${G.dy2_dx2.toFixed(2)}`, bwdColor: '#fbbf24' },
                { from: 0, to: 4, fwdLabel: 'e^(x₁+x₂)', bwdLabel: `∂y₃/∂x₁=${G.dy3_dx1.toFixed(1)}`, bwdColor: '#fbbf24' },
                { from: 1, to: 4, fwdLabel: 'e^(x₁+x₂)', bwdLabel: `∂y₃/∂x₂=${G.dy3_dx2.toFixed(1)}`, bwdColor: '#fbbf24' },
                { from: 2, to: 5, fwdLabel: '+y₂²+ln y₃', bwdLabel: `∂z/∂y₁=${G.dz_dy1.toFixed(2)}`, bwdColor: '#f87171' },
                { from: 3, to: 5, fwdLabel: '+y₂²+ln y₃', bwdLabel: `∂z/∂y₂=${G.dz_dy2.toFixed(2)}`, bwdColor: '#f87171' },
                { from: 4, to: 5, fwdLabel: '+y₂²+ln y₃', bwdLabel: `∂z/∂y₃=${G.dz_dy3.toFixed(2)}`, bwdColor: '#f87171' },
            ];

            // Dibujar aristas
            edges.forEach(({ from, to, bwdLabel, bwdColor }) => {
                const n1 = nodes[from], n2 = nodes[to];
                const dx = n2.cx - n1.cx, dy = n2.cy - n1.cy;
                const len = Math.sqrt(dx * dx + dy * dy);
                const ux = dx / len, uy = dy / len;
                const sx = n1.cx + ux * n1.r, sy = n1.cy + uy * n1.r;
                const ex = n2.cx - ux * n2.r, ey = n2.cy - uy * n2.r;

                // Forward (azul)
                ctx.strokeStyle = 'rgba(96,165,250,0.35)';
                ctx.lineWidth = 1.8;
                ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.stroke();

                // Etiqueta derivada local (junto a arista)
                const mx = (sx + ex) / 2, my = (sy + ey) / 2;
                txt(bwdLabel, mx - 28, my + (from < 2 ? -6 : 8), bwdColor, 9);
            });

            // Dibujar nodos
            nodes.forEach(({ label, val, cx, cy, color, r }) => {
                ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI);
                ctx.fillStyle = color + '20'; ctx.fill();
                ctx.strokeStyle = color; ctx.lineWidth = 2.2; ctx.stroke();
                txt(label, cx - 8, cy - 4, color, 12, true);
                txt(val, cx - 14, cy + 12, '#e2e8f0', 10);
            });

            // Gradientes totales
            txt(`∂z/∂x₁ = Σᵢ (∂z/∂yᵢ)(∂yᵢ/∂x₁) = ${G.dz_dx1.toFixed(4)}`,
                20, H - 28, '#34d399', 11, true);
            txt(`∂z/∂x₂ = Σᵢ (∂z/∂yᵢ)(∂yᵢ/∂x₂) = ${G.dz_dx2.toFixed(4)}`,
                20, H - 12, '#34d399', 11, true);
        }

        // ── MODO: Jacobianos ─────────────────────────────────────────────────
        if (mode === 'jacobian') {
            txt('Jacobianos locales y producto de la cadena', 20, 22, '#60a5fa', 13, true);

            const cellW = 72, cellH = 26;

            const drawMatrix = (label, rows, cols, values, x, y, color) => {
                txt(label, x, y - 10, color, 11, true);
                // Corchetes
                ctx.strokeStyle = color + '88';
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(x + 4, y); ctx.lineTo(x, y); ctx.lineTo(x, y + rows * cellH); ctx.lineTo(x + 4, y + rows * cellH); ctx.stroke();
                const rx = x + cols * cellW;
                ctx.beginPath(); ctx.moveTo(rx - 4, y); ctx.lineTo(rx, y); ctx.lineTo(rx, y + rows * cellH); ctx.lineTo(rx - 4, y + rows * cellH); ctx.stroke();
                // Celdas
                values.forEach((row, i) => {
                    row.forEach((val, j) => {
                        const cx2 = x + j * cellW + cellW / 2;
                        const cy2 = y + i * cellH + cellH / 2 + 4;
                        const alpha = Math.min(Math.abs(val) / 3, 0.6);
                        ctx.fillStyle = (val >= 0 ? color : '#f87171') + Math.round(alpha * 255).toString(16).padStart(2, '0');
                        ctx.fillRect(x + j * cellW + 2, y + i * cellH + 2, cellW - 4, cellH - 4);
                        txt(val.toFixed(3), cx2 - 18, cy2, '#e2e8f0', 9);
                    });
                });
                return x + cols * cellW;
            };

            // Jg ∈ R^{3×2}
            const Jg = [
                [G.dy1_dx1, G.dy1_dx2],
                [G.dy2_dx1, G.dy2_dx2],
                [G.dy3_dx1, G.dy3_dx2],
            ];
            // Jf ∈ R^{1×3} (gradiente de z respecto a y)
            const Jf = [[G.dz_dy1, G.dz_dy2, G.dz_dy3]];
            // Jfg = Jf · Jg ∈ R^{1×2}
            const Jfg = [[
                Jf[0][0] * Jg[0][0] + Jf[0][1] * Jg[1][0] + Jf[0][2] * Jg[2][0],
                Jf[0][0] * Jg[0][1] + Jf[0][1] * Jg[1][1] + Jf[0][2] * Jg[2][1],
            ]];

            let xCursor = 18;
            const yBase = 55;

            // Jf
            txt('J_f  ∈ ℝ^{1×3}', xCursor, yBase - 24, '#fbbf24', 10);
            drawMatrix('', 1, 3, Jf, xCursor, yBase, '#fbbf24');
            xCursor += 3 * cellW + 22;

            // ×
            txt('×', xCursor - 14, yBase + 1.5 * cellH, '#e2e8f0', 16, true);

            // Jg
            txt('J_g  ∈ ℝ^{3×2}', xCursor, yBase - 24, '#34d399', 10);
            drawMatrix('', 3, 2, Jg, xCursor, yBase, '#34d399');
            xCursor += 2 * cellW + 22;

            // =
            txt('=', xCursor - 14, yBase + 1.5 * cellH, '#e2e8f0', 16, true);

            // J_fg
            txt('J_{f∘g}  ∈ ℝ^{1×2}', xCursor, yBase - 24, '#a78bfa', 10);
            drawMatrix('', 1, 2, Jfg, xCursor, yBase, '#a78bfa');

            // Dimensiones
            txt('(1×3)   ·   (3×2)   =   (1×2)',
                18, yBase + 3 * cellH + 28, '#475569', 10);
            txt('p×m         m×n         p×n   — el índice intermedio m=3 se contrae',
                18, yBase + 3 * cellH + 44, '#475569', 10);

            // Gradiente resultante = fila de J_fg
            txt(`∇_x z = [∂z/∂x₁, ∂z/∂x₂] = [${Jfg[0][0].toFixed(4)}, ${Jfg[0][1].toFixed(4)}]`,
                18, yBase + 3 * cellH + 72, '#a78bfa', 12, true);

            // Interpretación VJP
            txt('Modo reverso: ∇_x z = J_g^T · (∇_y z)  — un solo backward pass',
                18, H - 28, '#60a5fa', 10, true);
            txt(`∇_y z = [${G.dz_dy1.toFixed(3)}, ${G.dz_dy2.toFixed(3)}, ${G.dz_dy3.toFixed(3)}]  (vector adjunto)`,
                18, H - 12, '#fbbf24', 10);
        }

        // ── MODO: Backprop capa a capa ───────────────────────────────────────
        if (mode === 'backprop') {
            txt('Backpropagation — regla de la cadena en red neuronal', 20, 22, '#60a5fa', 13, true);

            // Red de 3 capas simplificada: x(3) → z1(4) → a1 → z2(2) → L
            const w1_ex = [[0.5, -0.3, 0.8], [0.2, 0.9, -0.4], [-0.6, 0.1, 0.7], [0.3, -0.5, 0.2]];
            const w2_ex = [[0.4, -0.2, 0.6, -0.8], [0.7, 0.3, -0.5, 0.1]];

            // Valores de ejemplo fijos para visualización
            const xEx = [x1, x2, 0.8];
            const z1Ex = w1_ex.map(row => row.reduce((s, w, j) => s + w * xEx[j], 0));
            const a1Ex = z1Ex.map(sigmoid);
            const z2Ex = w2_ex.map(row => row.reduce((s, w, j) => s + w * a1Ex[j], 0));
            const expZ = z2Ex.map(z => Math.exp(z - Math.max(...z2Ex)));
            const softmax = expZ.map(e => e / expZ.reduce((a, b) => a + b, 0));
            const yTrue = [1, 0];
            const loss = -yTrue.reduce((s, y, i) => s + y * Math.log(softmax[i] + 1e-9), 0);

            // Deltas
            const delta2 = softmax.map((p, i) => p - yTrue[i]);
            const delta1 = a1Ex.map((a, j) => {
                const upstream = delta2.reduce((s, d, k) => s + d * w2_ex[k][j], 0);
                return upstream * dsigmoid(z1Ex[j]);
            });

            // Layout visual
            const layers = [
                { name: 'x', vals: xEx, delta: null, color: '#60a5fa', cx: 60 },
                { name: 'a¹', vals: a1Ex, delta: delta1, color: '#34d399', cx: 220 },
                { name: 'ŷ', vals: softmax, delta: delta2, color: '#a78bfa', cx: 380 },
            ];

            const nodeR = 18;
            const yStarts = [120, 80, 150];

            // Conexiones entre capas
            layers.slice(0, -1).forEach((lyr, li) => {
                const nextLyr = layers[li + 1];
                lyr.vals.forEach((_, ni) => {
                    nextLyr.vals.forEach((_, nj) => {
                        const y1p = yStarts[li] + ni * 55;
                        const y2p = yStarts[li + 1] + nj * 55;
                        const isActive = layer === li + 1;
                        ctx.strokeStyle = isActive
                            ? 'rgba(96,165,250,0.4)'
                            : 'rgba(96,165,250,0.12)';
                        ctx.lineWidth = isActive ? 1.5 : 0.8;
                        ctx.beginPath();
                        ctx.moveTo(lyr.cx + nodeR, y1p);
                        ctx.lineTo(nextLyr.cx - nodeR, y2p);
                        ctx.stroke();
                    });
                });
            });

            // Nodos
            layers.forEach((lyr, li) => {
                lyr.vals.forEach((val, ni) => {
                    const nx = lyr.cx, ny = yStarts[li] + ni * 55;
                    const isActive = layer === li || layer === li + 1;
                    ctx.beginPath(); ctx.arc(nx, ny, nodeR, 0, 2 * Math.PI);
                    ctx.fillStyle = lyr.color + (isActive ? '30' : '12');
                    ctx.fill();
                    ctx.strokeStyle = lyr.color + (isActive ? 'ff' : '55');
                    ctx.lineWidth = isActive ? 2.2 : 1;
                    ctx.stroke();
                    txt(val.toFixed(2), nx - 14, ny + 5, '#e2e8f0', 9);

                    // Delta (backward)
                    if (lyr.delta && layer >= li) {
                        const d = lyr.delta[ni];
                        const dColor = Math.abs(d) > 0.2 ? '#f87171' : '#fbbf24';
                        txt(`δ=${d.toFixed(2)}`, nx - 18, ny + nodeR + 14, dColor, 9, true);
                    }
                });
                // Nombre capa
                txt(lyr.name, lyr.cx - 8, yStarts[li] - 18, lyr.color, 12, true);
            });

            // Loss
            txt(`L = ${loss.toFixed(4)}`, 380, 320, '#f87171', 12, true);
            txt('∂L/∂ŷ', 380 - 12, 340, '#f87171', 10);

            // Fórmulas de la capa activa
            const formulas = [
                '',
                `δ¹ = (W²ᵀ δ²) ⊙ σ′(z¹)    [${delta1.map(d => d.toFixed(2)).join(', ')}]`,
                `δ² = ŷ − y                  [${delta2.map(d => d.toFixed(2)).join(', ')}]`,
            ];
            if (layer > 0) {
                txt(formulas[layer], 18, H - 28, '#fbbf24', 10, true);
            }
            txt(`∂L/∂W^(${layer}) = δ^(${layer}) · (a^(${layer - 1}))ᵀ  — regla de la cadena`,
                18, H - 12, '#475569', 10);

            // Indicador de capa
            txt(`Capa activa: ${layer === 2 ? 'Output (L=2)' : 'Hidden (L=1)'}`,
                W - 180, 40, '#94a3b8', 10);
        }

    }, [mode, x1, x2, layer]);

    return (
        <div className="viz-box" style={{ background: '#0b1220', borderRadius: 10, padding: 12 }}>
            <canvas
                ref={canvasRef}
                width={520}
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

                {/* Sliders x1, x2 */}
                {(mode === 'graph' || mode === 'jacobian') && (
                    <div style={{ display: 'flex', gap: 12 }}>
                        {[
                            { label: 'x₁', val: x1, set: setX1, color: '#60a5fa' },
                            { label: 'x₂', val: x2, set: setX2, color: '#34d399' },
                        ].map(({ label, val, set, color }) => (
                            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                <span style={{ color, fontSize: 11, minWidth: 60, fontFamily: 'monospace' }}>
                                    {label} = {val.toFixed(2)}
                                </span>
                                <input type="range" min={-2} max={2} step={0.05} value={val}
                                    onChange={e => set(Number(e.target.value))}
                                    style={{ flex: 1, accentColor: color }} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Selector de capa (backprop) */}
                {mode === 'backprop' && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ color: '#94a3b8', fontSize: 11, minWidth: 130 }}>
                                Capa backward: L={layer}
                            </span>
                            <input type="range" min={1} max={2} step={1} value={layer}
                                onChange={e => setLayer(Number(e.target.value))}
                                style={{ flex: 1, accentColor: '#fbbf24' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            {[
                                { label: 'x₁', val: x1, set: setX1, color: '#60a5fa' },
                                { label: 'x₂', val: x2, set: setX2, color: '#34d399' },
                            ].map(({ label, val, set, color }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                    <span style={{ color, fontSize: 11, minWidth: 60, fontFamily: 'monospace' }}>
                                        {label} = {val.toFixed(2)}
                                    </span>
                                    <input type="range" min={-2} max={2} step={0.05} value={val}
                                        onChange={e => set(Number(e.target.value))}
                                        style={{ flex: 1, accentColor: color }} />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Grafo</b>: derivadas locales en cada arista, suma sobre caminos.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Jacobianos</b>: producto matricial J_f · J_g = J_&#123;f∘g&#125;.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Backprop</b>: δ retropropagado capa a capa con regla de la cadena.
                </p>
            </div>
        </div>
    );
}