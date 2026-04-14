import React, { useState, useEffect, useRef } from 'react';

export default function TensorOpsViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('shape');   // shape | outer | contract | broadcast
    const [d1, setD1] = useState(3);
    const [d2, setD2] = useState(4);
    const [d3, setD3] = useState(5);

    const MODES = [
        { key: 'shape', label: 'Forma & Orden' },
        { key: 'outer', label: 'Producto Exterior' },
        { key: 'contract', label: 'Contracción (einsum)' },
        { key: 'broadcast', label: 'Broadcasting' },
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(0, 0, W, H);

        const txt = (text, x, y, color = '#94a3b8', size = 11, bold = false) => {
            ctx.fillStyle = color;
            ctx.font = `${bold ? 'bold ' : ''}${size}px monospace`;
            ctx.fillText(text, x, y);
        };

        const rect = (x, y, w, h, color, alpha = 1) => {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
            ctx.restore();
        };

        const strokeRect = (x, y, w, h, color, lw = 1) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = lw;
            ctx.strokeRect(x, y, w, h);
        };

        // ── MODO: Forma & Orden ──────────────────────────────────────────────
        if (mode === 'shape') {
            txt('Jerarquía de tensores por orden', W / 2 - 110, 22, '#60a5fa', 13, true);

            // Escalar (orden 0)
            const cx0 = 60, cy0 = 80;
            rect(cx0, cy0, 22, 22, '#34d399', 0.85);
            strokeRect(cx0, cy0, 22, 22, '#34d399', 1.5);
            txt('Escalar', cx0 - 4, cy0 + 38, '#34d399', 10);
            txt('orden 0', cx0 - 4, cy0 + 50, '#475569', 10);
            txt('()', cx0 + 2, cy0 + 62, '#475569', 10);

            // Vector (orden 1) — columna de celdas
            const cx1 = 140, cy1 = 55;
            for (let i = 0; i < d1; i++) {
                rect(cx1, cy1 + i * 20, 22, 18, '#60a5fa', 0.7);
                strokeRect(cx1, cy1 + i * 20, 22, 18, '#60a5fa', 1);
            }
            txt('Vector', cx1 - 4, cy1 + d1 * 20 + 14, '#60a5fa', 10);
            txt('orden 1', cx1 - 4, cy1 + d1 * 20 + 26, '#475569', 10);
            txt(`(${d1},)`, cx1 - 2, cy1 + d1 * 20 + 38, '#475569', 10);

            // Matriz (orden 2) — grid 2D
            const cx2 = 210, cy2 = 55;
            for (let i = 0; i < d1; i++) {
                for (let j = 0; j < d2; j++) {
                    const alpha = 0.4 + 0.3 * ((i + j) % 2);
                    rect(cx2 + j * 18, cy2 + i * 18, 16, 16, '#fbbf24', alpha);
                    strokeRect(cx2 + j * 18, cy2 + i * 18, 16, 16, '#fbbf24', 0.8);
                }
            }
            txt('Matriz', cx2 + 4, cy2 + d1 * 18 + 14, '#fbbf24', 10);
            txt('orden 2', cx2 + 4, cy2 + d1 * 18 + 26, '#475569', 10);
            txt(`(${d1},${d2})`, cx2 + 2, cy2 + d1 * 18 + 38, '#475569', 10);

            // Tensor orden 3 — capas isométricas
            const cx3 = 360, cy3 = 60;
            const cw = 14, ch = 14, ox = 7, oy = -5; // offsets isométricos
            const layers = Math.min(d3, 5);
            for (let l = layers - 1; l >= 0; l--) {
                for (let i = 0; i < Math.min(d1, 4); i++) {
                    for (let j = 0; j < Math.min(d2, 4); j++) {
                        const px = cx3 + j * cw + l * ox;
                        const py = cy3 + i * ch + l * oy;
                        const alpha = 0.35 + 0.12 * l;
                        rect(px, py, cw - 1, ch - 1, '#a78bfa', alpha);
                        strokeRect(px, py, cw - 1, ch - 1, '#a78bfa', 0.6);
                    }
                }
            }
            txt('Tensor 3D', cx3 + 4, cy3 + Math.min(d1, 4) * ch + 14, '#a78bfa', 10);
            txt('orden 3', cx3 + 4, cy3 + Math.min(d1, 4) * ch + 26, '#475569', 10);
            txt(`(${d1},${d2},${d3})`, cx3 + 2, cy3 + Math.min(d1, 4) * ch + 38, '#475569', 10);

            // Tensor orden 4 — alusión a batch
            const cx4 = 460, cy4 = 60;
            for (let b = 2; b >= 0; b--) {
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        const px = cx4 + j * 12 + b * 6;
                        const py = cy4 + i * 12 + b * (-4);
                        rect(px, py, 11, 11, '#f87171', 0.2 + b * 0.15);
                        strokeRect(px, py, 11, 11, '#f87171', 0.5);
                    }
                }
            }
            txt('Tensor 4D', cx4, cy4 + 3 * 12 + 14, '#f87171', 10);
            txt('orden 4', cx4, cy4 + 3 * 12 + 26, '#475569', 10);
            txt(`(N,${d1},${d2},C)`, cx4 - 4, cy4 + 3 * 12 + 38, '#475569', 10);

            // Total de elementos
            txt(`Elementos tensor 3D: ${d1}×${d2}×${d3} = ${d1 * d2 * d3}`,
                20, H - 30, '#60a5fa', 11, true);
            txt(`Norma Frobenius: sqrt(Σ T²ᵢⱼₖ)  —  ${d1 * d2 * d3} sumas`,
                20, H - 14, '#475569', 10);
        }

        // ── MODO: Producto Exterior ──────────────────────────────────────────
        if (mode === 'outer') {
            txt('Producto exterior: u ⊗ v = uvᵀ  →  tensor rango 1', 20, 22, '#60a5fa', 12, true);

            const u = Array.from({ length: d1 }, (_, i) => Math.round((Math.sin(i + 1) * 2) * 10) / 10);
            const v = Array.from({ length: d2 }, (_, j) => Math.round((Math.cos(j + 1) * 2) * 10) / 10);

            const cellW = 36, cellH = 26;
            const ox = 100, oy = 60;

            // Vector u (columna izquierda)
            txt('u =', ox - 44, oy + 10, '#34d399', 11, true);
            u.forEach((val, i) => {
                rect(ox - 38, oy + i * cellH, 32, cellH - 2,
                    val >= 0 ? '#34d399' : '#f87171', 0.25 + Math.abs(val) * 0.2);
                strokeRect(ox - 38, oy + i * cellH, 32, cellH - 2, '#34d399', 0.8);
                txt(val.toFixed(1), ox - 30, oy + i * cellH + 16, '#34d399', 10);
            });

            // Vector v (fila superior)
            txt('v =', ox + 10, oy - 22, '#fbbf24', 11, true);
            v.forEach((val, j) => {
                rect(ox + j * cellW, oy - 20, cellW - 2, 18,
                    val >= 0 ? '#fbbf24' : '#f87171', 0.25 + Math.abs(val) * 0.2);
                strokeRect(ox + j * cellW, oy - 20, cellW - 2, 18, '#fbbf24', 0.8);
                txt(val.toFixed(1), ox + j * cellW + 4, oy - 6, '#fbbf24', 10);
            });

            // Matriz resultado u⊗v
            const maxVal = Math.max(...u.flatMap(ui => v.map(vj => Math.abs(ui * vj))));
            u.forEach((ui, i) => {
                v.forEach((vj, j) => {
                    const val = ui * vj;
                    const alpha = 0.15 + 0.7 * Math.abs(val) / (maxVal + 1e-9);
                    const color = val >= 0 ? '#a78bfa' : '#f87171';
                    rect(ox + j * cellW, oy + i * cellH, cellW - 2, cellH - 2, color, alpha);
                    strokeRect(ox + j * cellW, oy + i * cellH, cellW - 2, cellH - 2, '#a78bfa', 0.6);
                    txt(val.toFixed(1), ox + j * cellW + 4, oy + i * cellH + 16, '#e2e8f0', 9);
                });
            });

            txt(`u⊗v ∈ ℝ${d1}×${d2}  (rango 1: toda col. es múltiplo de u)`,
                20, H - 18, '#475569', 10);
            txt('einsum("i,j->ij", u, v)', ox, oy + d1 * cellH + 18, '#60a5fa', 10, true);
        }

        // ── MODO: Contracción / einsum ───────────────────────────────────────
        if (mode === 'contract') {
            txt('Contracción de índices  —  einsum("ij,jk->ik", A, B)', 20, 22, '#60a5fa', 12, true);

            const M = d1, K = d2, N = Math.min(d3, 5);
            const cw = 18, ch = 18;

            // Matriz A (M×K)
            const ax = 30, ay = 50;
            txt(`A  (${M}×${K})`, ax, ay - 8, '#34d399', 10, true);
            for (let i = 0; i < M; i++) for (let j = 0; j < K; j++) {
                rect(ax + j * cw, ay + i * ch, cw - 1, ch - 1, '#34d399', 0.2 + 0.1 * ((i + j) % 3));
                strokeRect(ax + j * cw, ay + i * ch, cw - 1, ch - 1, '#34d399', 0.7);
            }
            // Índice j compartido — resaltar última columna de A
            txt('j →', ax + K * cw + 4, ay + M * ch / 2, '#fbbf24', 10, true);

            // Matriz B (K×N)
            const bx = ax + K * cw + 48, by = ay;
            txt(`B  (${K}×${N})`, bx, by - 8, '#60a5fa', 10, true);
            for (let j = 0; j < K; j++) for (let k = 0; k < N; k++) {
                rect(bx + k * cw, by + j * ch, cw - 1, ch - 1, '#60a5fa', 0.2 + 0.1 * ((j + k) % 3));
                strokeRect(bx + k * cw, by + j * ch, cw - 1, ch - 1, '#60a5fa', 0.7);
            }

            // Flecha resultado
            const rx = bx + N * cw + 24, ry = ay;
            txt('→', bx + N * cw + 6, ry + M * ch / 2 + 5, '#fbbf24', 14, true);

            // Resultado C (M×N)
            txt(`C  (${M}×${N})`, rx, ry - 8, '#a78bfa', 10, true);
            for (let i = 0; i < M; i++) for (let k = 0; k < N; k++) {
                rect(rx + k * cw, ry + i * ch, cw - 1, ch - 1, '#a78bfa', 0.35);
                strokeRect(rx + k * cw, ry + i * ch, cw - 1, ch - 1, '#a78bfa', 0.9);
            }

            // Fórmula
            txt(`Cᵢₖ = Σⱼ Aᵢⱼ · Bⱼₖ`, ax, ay + M * ch + 28, '#e2e8f0', 11);
            txt(`j ∈ [1..${K}] se suma (contrae)  —  i,k son índices libres`,
                ax, ay + M * ch + 46, '#475569', 10);

            // FLOPs
            const flops = 2 * M * K * N;
            txt(`FLOPs: 2·${M}·${K}·${N} = ${flops}`, ax, H - 18, '#60a5fa', 10, true);

            // Batch matmul
            txt('Batch: einsum("bij,bjk->bik")  →  B copias independientes',
                ax, H - 4, '#475569', 10);
        }

        // ── MODO: Broadcasting ───────────────────────────────────────────────
        if (mode === 'broadcast') {
            txt('Broadcasting  —  expansión implícita de dimensiones unitarias', 20, 22, '#60a5fa', 12, true);

            const rows = d1, cols = d2;
            const cw = 22, ch = 20;
            let y = 45;

            const drawTensor = (label, shape, color, x, yy, highlight = false) => {
                txt(label, x, yy - 6, color, 10, true);
                const [r, c] = shape;
                for (let i = 0; i < r; i++) {
                    for (let j = 0; j < c; j++) {
                        const alpha = highlight && i === 0 ? 0.6 : 0.22;
                        rect(x + j * cw, yy + i * ch, cw - 2, ch - 2, color, alpha);
                        strokeRect(x + j * cw, yy + i * ch, cw - 2, ch - 2, color,
                            highlight && i === 0 ? 1.2 : 0.6);
                        if (r === 1) txt('b', x + j * cw + 7, yy + ch - 6, color, 9);
                    }
                }
                // Flecha de expansión si r===1
                if (r === 1 && rows > 1) {
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 3]);
                    for (let i = 1; i < rows; i++) {
                        ctx.beginPath();
                        ctx.moveTo(x, yy + ch / 2);
                        ctx.lineTo(x, yy + i * ch + ch / 2);
                        ctx.stroke();
                    }
                    ctx.setLineDash([]);
                }
                return x + c * cw;
            };

            // Caso 1: (rows×cols) + (cols,)
            txt('Caso 1:', 20, y, '#e2e8f0', 11, true);
            y += 14;
            drawTensor(`A (${rows}×${cols})`, [rows, cols], '#60a5fa', 30, y);
            txt('+', 30 + cols * cw + 6, y + rows * ch / 2 + 4, '#e2e8f0', 13, true);
            drawTensor(`b (1×${cols}) → broadcast`, [1, cols], '#fbbf24', 30 + cols * cw + 26, y, true);
            txt('→', 30 + 2 * cols * cw + 48, y + rows * ch / 2 + 4, '#e2e8f0', 13, true);
            drawTensor(`C (${rows}×${cols})`, [rows, cols], '#34d399', 30 + 2 * cols * cw + 68, y);

            // Reglas
            y += rows * ch + 30;
            txt('Reglas de broadcasting (alinear por la derecha):', 20, y, '#94a3b8', 11, true);
            y += 18;
            const rules = [
                ['A:', `(${rows}, ${cols})`],
                ['b:', `      (${cols},)  →  (1, ${cols})  →  (${rows}, ${cols})`],
                ['C:', `(${rows}, ${cols})  ✓ compatible`],
            ];
            rules.forEach(([lbl, val]) => {
                txt(lbl, 30, y, '#fbbf24', 10, true);
                txt(val, 56, y, '#94a3b8', 10);
                y += 16;
            });

            // Caso 2: incompatible
            y += 8;
            txt('Caso incompatible:', 20, y, '#f87171', 11, true);
            y += 16;
            txt(`(${rows}, ${cols})  +  (${rows}, 1)  →  (${rows}, ${cols})  ✓`, 30, y, '#94a3b8', 10);
            y += 16;
            txt(`(${rows}, ${cols})  +  (${cols}, ${rows})  →  ERROR  ✗`, 30, y, '#f87171', 10);

            txt('Sin copia de datos en memoria — solo strides virtuales',
                20, H - 14, '#475569', 10);
        }

    }, [mode, d1, d2, d3]);

    return (
        <div className="viz-box" style={{ background: '#0b1220', borderRadius: 10, padding: 12 }}>
            <canvas
                ref={canvasRef}
                width={560}
                height={360}
                style={{ borderRadius: 8, display: 'block', margin: '0 auto' }}
            />
            <div className="viz-ctrl" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>

                {/* Selector de modo */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {MODES.map(({ key, label }) => (
                        <button key={key} onClick={() => setMode(key)} style={{
                            padding: '5px 10px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                            border: `1.5px solid ${mode === key ? '#60a5fa' : '#334155'}`,
                            background: mode === key ? '#60a5fa22' : 'transparent',
                            color: mode === key ? '#60a5fa' : '#64748b',
                            fontFamily: 'monospace', transition: 'all 0.15s',
                        }}>{label}</button>
                    ))}
                </div>

                {/* Sliders de dimensiones */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {[
                        { label: 'd₁', val: d1, set: setD1, min: 2, max: 5, color: '#34d399' },
                        { label: 'd₂', val: d2, set: setD2, min: 2, max: 6, color: '#fbbf24' },
                        { label: 'd₃', val: d3, set: setD3, min: 2, max: 8, color: '#a78bfa' },
                    ].map(({ label, val, set, min, max, color }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                            <span style={{ color, fontSize: 11, minWidth: 28, fontFamily: 'monospace', fontWeight: 'bold' }}>
                                {label}={val}
                            </span>
                            <input type="range" min={min} max={max} step={1} value={val}
                                onChange={e => set(Number(e.target.value))}
                                style={{ flex: 1, accentColor: color }} />
                        </div>
                    ))}
                </div>

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Forma & Orden</b>: jerarquía escalar→vector→matriz→tensor.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Producto Exterior</b>: u⊗v genera matriz de rango 1.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Contracción</b>: einsum suma sobre índice compartido j.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Broadcasting</b>: expansión implícita sin copiar memoria.
                </p>
            </div>
        </div>
    );
}