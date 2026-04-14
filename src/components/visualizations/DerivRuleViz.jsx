import React, { useState, useEffect, useRef } from 'react';

export default function DerivRuleViz() {
    const canvasRef = useRef(null);
    const [x0, setX0] = useState(1.2);
    const [mode, setMode] = useState('tangent');  // tangent | chain | activation
    const [actFn, setActFn] = useState('sigmoid');

    const MODES = [
        { key: 'tangent', label: 'Tangente & Δx' },
        { key: 'chain', label: 'Regla de cadena' },
        { key: 'activation', label: 'Activaciones DL' },
    ];

    // Funciones y sus derivadas
    const fns = {
        f: x => Math.sin(x) * Math.exp(-0.15 * x * x),
        df: x => Math.cos(x) * Math.exp(-0.15 * x * x)
            - 0.3 * x * Math.sin(x) * Math.exp(-0.15 * x * x),
    };

    const activations = {
        sigmoid: { f: x => 1 / (1 + Math.exp(-x)), df: x => { const s = 1 / (1 + Math.exp(-x)); return s * (1 - s); }, color: '#60a5fa', max: '0.25 @ x=0' },
        relu: { f: x => Math.max(0, x), df: x => x > 0 ? 1 : 0, color: '#34d399', max: '1  @ x>0' },
        tanh: { f: x => Math.tanh(x), df: x => 1 - Math.tanh(x) ** 2, color: '#fbbf24', max: '1  @ x=0' },
        gelu: {
            f: x => 0.5 * x * (1 + Math.tanh(0.7978 * (x + 0.044715 * x ** 3))),
            df: x => {
                const t = Math.tanh(0.7978 * (x + 0.044715 * x ** 3));
                return 0.5 * (1 + t) + 0.5 * x * (1 - t * t) * 0.7978 * (1 + 3 * 0.044715 * x ** 2);
            },
            color: '#a78bfa', max: '≈1 @ x≈0.8'
        },
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
            ctx.fillStyle = color; ctx.font = `${bold ? 'bold ' : ''}${size}px monospace`;
            ctx.fillText(t, x, y);
        };

        // ── MODO: Tangente ───────────────────────────────────────────────────
        if (mode === 'tangent') {
            const xMin = -3.5, xMax = 3.5, yMin = -1.1, yMax = 1.1;
            const tx = x => 28 + (x - xMin) / (xMax - xMin) * (W - 40);
            const ty = y => H - 28 - (y - yMin) / (yMax - yMin) * (H - 56);

            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
            [-3, -2, -1, 0, 1, 2, 3].forEach(g => {
                ctx.beginPath(); ctx.moveTo(tx(g), 28); ctx.lineTo(tx(g), H - 28); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(28, ty(g * 0.4)); ctx.lineTo(W - 12, ty(g * 0.4)); ctx.stroke();
            });

            // Ejes
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(tx(0), 28); ctx.lineTo(tx(0), H - 28); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(28, ty(0)); ctx.lineTo(W - 12, ty(0)); ctx.stroke();
            txt('x', W - 10, ty(0) + 4, '#475569', 10); txt('y', tx(0) - 14, 32, '#475569', 10);

            // Curva f(x)
            ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2.2;
            ctx.beginPath();
            let first = true;
            for (let px = 28; px <= W - 12; px++) {
                const x = (px - 28) / (W - 40) * (xMax - xMin) + xMin;
                const y = fns.f(x);
                if (y < yMin || y > yMax) { first = true; continue; }
                first ? ctx.moveTo(px, ty(y)) : ctx.lineTo(px, ty(y));
                first = false;
            }
            ctx.stroke();

            // Punto x0
            const y0 = fns.f(x0), dy = fns.df(x0);
            ctx.beginPath(); ctx.arc(tx(x0), ty(y0), 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#f87171'; ctx.fill();

            // Recta tangente
            const tLen = 1.4;
            ctx.strokeStyle = '#f87171'; ctx.lineWidth = 1.8; ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(tx(x0 - tLen), ty(y0 - tLen * dy));
            ctx.lineTo(tx(x0 + tLen), ty(y0 + tLen * dy));
            ctx.stroke(); ctx.setLineDash([]);

            // Triángulo Δx / Δy
            const dx = 0.6;
            ctx.strokeStyle = 'rgba(251,191,36,0.7)'; ctx.lineWidth = 1.2; ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(tx(x0), ty(y0));
            ctx.lineTo(tx(x0 + dx), ty(y0));
            ctx.lineTo(tx(x0 + dx), ty(y0 + dx * dy));
            ctx.stroke(); ctx.setLineDash([]);

            txt(`Δx`, tx(x0 + dx / 2) - 8, ty(y0) + 14, '#fbbf24', 10);
            txt(`Δy`, tx(x0 + dx) + 4, ty(y0 + dx * dy / 2), '#fbbf24', 10);

            // Labels
            txt(`f(x) = sin(x)·e^(−0.15x²)`, tx(-3.4), ty(0.95), '#60a5fa', 10, true);
            txt(`x₀ = ${x0.toFixed(2)}`, tx(-3.4), ty(0.80), '#f87171', 10);
            txt(`f(x₀) = ${y0.toFixed(3)}`, tx(-3.4), ty(0.65), '#94a3b8', 10);
            txt(`f ′(x₀) = ${dy.toFixed(3)}  ← pendiente`, tx(-3.4), ty(0.50), '#f87171', 10, true);

            // Cociente diferencial
            const hNum = 0.5;
            const approx = (fns.f(x0 + hNum) - fns.f(x0)) / hNum;
            txt(`[f(x₀+h)−f(x₀)]/h ≈ ${approx.toFixed(3)}  (h=${hNum})`,
                tx(-3.4), H - 10, '#475569', 10);
        }

        // ── MODO: Regla de cadena ────────────────────────────────────────────
        if (mode === 'chain') {
            txt('Regla de la cadena — grafo computacional', W / 2 - 130, 22, '#60a5fa', 13, true);

            // Nodos del grafo: x → y₁=sin(x) → y₂=y₁²+1 → z=log(y₂)
            const nodes = [
                { id: 'x', label: 'x', sub: `${x0.toFixed(2)}`, x: 60, y: 180, color: '#60a5fa' },
                { id: 'y1', label: 'y₁=sin(x)', sub: `${Math.sin(x0).toFixed(3)}`, x: 190, y: 180, color: '#34d399' },
                { id: 'y2', label: 'y₂=y₁²+1', sub: `${(Math.sin(x0) ** 2 + 1).toFixed(3)}`, x: 330, y: 180, color: '#fbbf24' },
                { id: 'z', label: 'z=log(y₂)', sub: `${Math.log(Math.sin(x0) ** 2 + 1).toFixed(3)}`, x: 460, y: 180, color: '#a78bfa' },
            ];

            const edges = [
                { from: 0, to: 1, fwd: 'sin', bwd: "cos(x)", bwdVal: Math.cos(x0).toFixed(3) },
                { from: 1, to: 2, fwd: '(·)²+1', bwd: "2y₁", bwdVal: (2 * Math.sin(x0)).toFixed(3) },
                { from: 2, to: 3, fwd: 'log', bwd: "1/y₂", bwdVal: (1 / (Math.sin(x0) ** 2 + 1)).toFixed(3) },
            ];

            const r = 26;
            // Aristas forward
            edges.forEach(({ from, to, fwd, bwd, bwdVal }) => {
                const n1 = nodes[from], n2 = nodes[to];
                // Forward
                ctx.strokeStyle = 'rgba(96,165,250,0.5)'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(n1.x + r, n1.y); ctx.lineTo(n2.x - r, n2.y); ctx.stroke();
                txt(fwd, (n1.x + n2.x) / 2 - 14, n1.y - 14, '#60a5fa', 10);
                // Backward
                ctx.strokeStyle = 'rgba(248,113,113,0.5)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
                ctx.beginPath(); ctx.moveTo(n2.x - r, n2.y + 8); ctx.lineTo(n1.x + r, n1.y + 8); ctx.stroke();
                ctx.setLineDash([]);
                txt(`${bwd}=${bwdVal}`, (n1.x + n2.x) / 2 - 22, n1.y + 28, '#f87171', 10);
            });

            // Nodos
            nodes.forEach(({ label, sub, x, y, color }) => {
                ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
                ctx.fillStyle = color + '22'; ctx.fill();
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
                txt(label.split('=')[0], x - 14, y - 4, color, 10, true);
                txt(sub, x - 16, y + 12, '#e2e8f0', 10);
            });

            // Leyenda
            ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(30, 280); ctx.lineTo(60, 280); ctx.stroke();
            txt('Forward pass', 66, 284, '#60a5fa', 10);
            ctx.strokeStyle = '#f87171'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
            ctx.beginPath(); ctx.moveTo(160, 280); ctx.lineTo(190, 280); ctx.stroke();
            ctx.setLineDash([]);
            txt('Backward pass (derivadas locales)', 196, 284, '#f87171', 10);

            // Producto final
            const e1 = edges[0], e2 = edges[1], e3 = edges[2];
            const dz = parseFloat(e3.bwdVal) * parseFloat(e2.bwdVal) * parseFloat(e1.bwdVal);
            txt('dz/dx = (1/y₂) · 2y₁ · cos(x)', 30, 320, '#e2e8f0', 11, true);
            txt(`     = ${e3.bwdVal} × ${e2.bwdVal} × ${e1.bwdVal} = ${dz.toFixed(4)}`,
                30, 338, '#a78bfa', 11);

            txt(`x₀ = ${x0.toFixed(2)}  — mueve el slider para ver cómo cambian las derivadas locales`,
                30, H - 10, '#475569', 10);
        }

        // ── MODO: Activaciones ───────────────────────────────────────────────
        if (mode === 'activation') {
            const act = activations[actFn];
            const xMin = -4, xMax = 4, yMin = -1.5, yMax = 1.5;
            const tx = x => 36 + (x - xMin) / (xMax - xMin) * (W - 52);
            const ty = y => H - 28 - (y - yMin) / (yMax - yMin) * (H - 56);

            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
            [-4, -3, -2, -1, 0, 1, 2, 3, 4].forEach(g => {
                ctx.beginPath(); ctx.moveTo(tx(g), 28); ctx.lineTo(tx(g), H - 28); ctx.stroke();
            });
            [-1, 0, 1].forEach(g => {
                ctx.beginPath(); ctx.moveTo(36, ty(g)); ctx.lineTo(W - 16, ty(g)); ctx.stroke();
            });

            // Ejes
            ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(tx(0), 28); ctx.lineTo(tx(0), H - 28); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(36, ty(0)); ctx.lineTo(W - 16, ty(0)); ctx.stroke();

            // Curva f(x)
            ctx.strokeStyle = act.color; ctx.lineWidth = 2.5;
            ctx.beginPath(); let first = true;
            for (let px = 36; px <= W - 16; px++) {
                const x = (px - 36) / (W - 52) * (xMax - xMin) + xMin;
                const y = act.f(x);
                if (y < yMin - 0.5 || y > yMax + 0.5) { first = true; continue; }
                first ? ctx.moveTo(px, ty(y)) : ctx.lineTo(px, ty(y));
                first = false;
            }
            ctx.stroke();

            // Curva f'(x)
            ctx.strokeStyle = act.color + '88'; ctx.lineWidth = 1.8; ctx.setLineDash([5, 4]);
            ctx.beginPath(); first = true;
            for (let px = 36; px <= W - 16; px++) {
                const x = (px - 36) / (W - 52) * (xMax - xMin) + xMin;
                const y = act.df(x);
                if (y < yMin || y > yMax) { first = true; continue; }
                first ? ctx.moveTo(px, ty(y)) : ctx.lineTo(px, ty(y));
                first = false;
            }
            ctx.stroke(); ctx.setLineDash([]);

            // Punto x0
            const fy = act.f(x0), dfy = act.df(x0);
            ctx.beginPath(); ctx.arc(tx(x0), ty(fy), 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#f87171'; ctx.fill();
            ctx.beginPath(); ctx.arc(tx(x0), ty(dfy), 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#f87171bb'; ctx.fill();

            // Leyenda
            txt(`${actFn}(x)`, 44, 40, act.color, 11, true);
            ctx.setLineDash([5, 4]);
            ctx.strokeStyle = act.color + '88'; ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(44, 54); ctx.lineTo(80, 54); ctx.stroke();
            ctx.setLineDash([]);
            txt(`${actFn}'(x)  [max: ${act.max}]`, 86, 58, act.color + 'bb', 10);

            txt(`x₀=${x0.toFixed(2)}`, tx(x0) + 8, ty(fy) - 8, '#f87171', 10);
            txt(`f(x₀)=${fy.toFixed(3)}`, tx(x0) + 8, ty(fy) + 10, act.color, 10);
            txt(`f′(x₀)=${dfy.toFixed(3)}`, tx(x0) + 8, ty(dfy) - 8, act.color + '99', 10);

            // Vanishing gradient box
            if (actFn === 'sigmoid') {
                ctx.fillStyle = 'rgba(248,113,113,0.08)';
                ctx.fillRect(tx(-4), ty(0.25), tx(4) - tx(-4), ty(0) - ty(0.25));
                txt('⚠ máx derivada = 0.25  →  vanishing gradient en redes profundas',
                    40, H - 10, '#f87171', 10);
            } else {
                txt(`Derivada en x₀: ${dfy.toFixed(4)}`, 40, H - 10, '#475569', 10);
            }
        }

    }, [mode, x0, actFn]);

    return (
        <div className="viz-box" style={{ background: '#0b1220', borderRadius: 10, padding: 12 }}>
            <canvas ref={canvasRef} width={540} height={370}
                style={{ borderRadius: 8, display: 'block', margin: '0 auto' }} />
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

                {/* Slider x0 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#94a3b8', fontSize: 11, minWidth: 120 }}>
                        x₀ = {x0.toFixed(2)}
                    </span>
                    <input type="range" min={-3} max={3} step={0.05} value={x0}
                        onChange={e => setX0(Number(e.target.value))}
                        style={{ flex: 1, accentColor: '#f87171' }} />
                </div>

                {/* Selector activación (solo en modo activation) */}
                {mode === 'activation' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                        {Object.entries(activations).map(([key, { color }]) => (
                            <button key={key} onClick={() => setActFn(key)} style={{
                                flex: 1, padding: '4px 2px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                                border: `1.5px solid ${actFn === key ? color : '#334155'}`,
                                background: actFn === key ? color + '22' : 'transparent',
                                color: actFn === key ? color : '#64748b',
                                fontFamily: 'monospace', transition: 'all 0.15s',
                            }}>{key}</button>
                        ))}
                    </div>
                )}

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Tangente</b>: pendiente = derivada = límite del cociente Δy/Δx.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Cadena</b>: derivadas locales se multiplican hacia atrás (backprop).&nbsp;
                    <b style={{ color: '#94a3b8' }}>Activaciones</b>: sólido = f(x), punteado = f′(x). Sigmoid acumula vanishing gradient.
                </p>
            </div>
        </div>
    );
}