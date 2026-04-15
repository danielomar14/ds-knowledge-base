import React, { useState, useEffect, useRef } from 'react';

export default function LossLandscapeViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('regression');  // regression | classify | compare
    const [delta, setDelta] = useState(1.0);
    const [gamma, setGamma] = useState(2.0);
    const [pred, setPred] = useState(0.7);           // probabilidad predicha
    const [yTrue, setYTrue] = useState(1);             // etiqueta verdadera

    const MODES = [
        { key: 'regression', label: 'Pérdidas regresión' },
        { key: 'classify', label: 'Pérdidas clasificación' },
        { key: 'compare', label: 'Gradientes & robustez' },
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

        const drawAxes = (tw, ty, xLbl, yLbl, xTicks, yTicks) => {
            ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(tw(xTicks[0]), ty(0));
            ctx.lineTo(tw(xTicks[xTicks.length - 1]), ty(0)); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(tw(0), ty(yTicks[0]));
            ctx.lineTo(tw(0), ty(yTicks[yTicks.length - 1])); ctx.stroke();
            ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
            xTicks.forEach(x => {
                ctx.beginPath(); ctx.moveTo(tw(x), ty(yTicks[0]));
                ctx.lineTo(tw(x), ty(yTicks[yTicks.length - 1])); ctx.stroke();
                if (x !== 0) txt(`${x}`, tw(x) - 6, ty(0) + 14, '#475569', 9);
            });
            yTicks.forEach(y => {
                ctx.beginPath(); ctx.moveTo(tw(xTicks[0]), ty(y));
                ctx.lineTo(tw(xTicks[xTicks.length - 1]), ty(y)); ctx.stroke();
                if (y !== 0) txt(`${y}`, tw(0) + 4, ty(y) + 4, '#475569', 9);
            });
            txt(xLbl, tw(xTicks[xTicks.length - 1]) + 4, ty(0) + 4, '#475569', 9);
            txt(yLbl, tw(0) + 4, ty(yTicks[yTicks.length - 1]) - 6, '#475569', 9);
        };

        const drawCurve = (fn, xMin, xMax, tw, ty, yMin, yMax, color, lw = 2.2, dash = []) => {
            ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.setLineDash(dash);
            ctx.beginPath(); let first = true;
            for (let px = 0; px < W; px++) {
                const x = xMin + px / W * (xMax - xMin);
                const y = fn(x);
                if (!isFinite(y) || y < yMin - 1 || y > yMax + 1) { first = true; continue; }
                first ? ctx.moveTo(tw(x), ty(y)) : ctx.lineTo(tw(x), ty(y));
                first = false;
            }
            ctx.stroke(); ctx.setLineDash([]);
        };

        // ── MODO: Pérdidas de regresión ─────────────────────────────────────
        if (mode === 'regression') {
            const rMin = -3.5, rMax = 3.5, lMin = 0, lMax = 7;
            const tw = r => 36 + (r - rMin) / (rMax - rMin) * (W - 52);
            const ty = l => H - 28 - (l - lMin) / (lMax - lMin) * (H - 52);

            drawAxes(tw, ty, 'r', 'ℓ', [-3, -2, -1, 0, 1, 2, 3], [0, 1, 2, 3, 4, 5, 6]);
            txt('Pérdidas de regresión  ℓ(r),  r = ŷ−y', 16, 18, '#60a5fa', 12, true);

            // MSE: r²
            drawCurve(r => r * r, rMin, rMax, tw, ty, lMin, lMax, '#60a5fa');
            // MAE: |r|
            drawCurve(r => Math.abs(r), rMin, rMax, tw, ty, lMin, lMax, '#fbbf24', 2.2, [5, 4]);
            // Huber
            drawCurve(r => Math.abs(r) <= delta ? 0.5 * r * r : delta * (Math.abs(r) - 0.5 * delta),
                rMin, rMax, tw, ty, lMin, lMax, '#34d399', 2.2, [8, 4]);

            // Punto en r=pred-yTrue (usar como ejemplo visual)
            const rEx = 2.2;
            const mseEx = rEx * rEx;
            const maeEx = Math.abs(rEx);
            const hubEx = Math.abs(rEx) <= delta ? 0.5 * rEx * rEx : delta * (Math.abs(rEx) - 0.5 * delta);

            [
                { y: mseEx, color: '#60a5fa' },
                { y: maeEx, color: '#fbbf24' },
                { y: hubEx, color: '#34d399' },
            ].forEach(({ y, color }) => {
                ctx.beginPath(); ctx.arc(tw(rEx), ty(y), 5, 0, 2 * Math.PI);
                ctx.fillStyle = color; ctx.fill();
            });
            ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
            ctx.beginPath(); ctx.moveTo(tw(rEx), ty(0)); ctx.lineTo(tw(rEx), ty(lMax)); ctx.stroke();
            ctx.setLineDash([]);
            txt(`r=${rEx}`, tw(rEx) + 4, ty(lMax / 2), '#94a3b8', 9);

            // Zona Huber
            ctx.fillStyle = 'rgba(52,211,153,0.07)';
            ctx.fillRect(tw(-delta), ty(lMax), tw(delta) - tw(-delta), ty(0) - ty(lMax));
            txt(`|r|≤δ=${delta.toFixed(1)}`, tw(0) - 20, ty(lMax) + 14, '#34d399', 9);

            // Leyenda
            const items = [
                { color: '#60a5fa', label: `MSE: r²`, dash: [] },
                { color: '#fbbf24', label: `MAE: |r|`, dash: [5, 4] },
                { color: '#34d399', label: `Huber(δ=${delta.toFixed(1)})`, dash: [8, 4] },
            ];
            items.forEach(({ color, label, dash }, i) => {
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash);
                ctx.beginPath(); ctx.moveTo(W - 180, H - 52 + i * 20); ctx.lineTo(W - 150, H - 52 + i * 20); ctx.stroke();
                ctx.setLineDash([]);
                txt(label, W - 144, H - 48 + i * 20, color, 10);
            });

            // Info en r=2.2
            txt(`En r=2.2:  MSE=${mseEx.toFixed(2)}  MAE=${maeEx.toFixed(2)}  Huber=${hubEx.toFixed(2)}`,
                16, H - 12, '#475569', 10);
        }

        // ── MODO: Pérdidas de clasificación ─────────────────────────────────
        if (mode === 'classify') {
            const pMin = 0.01, pMax = 0.99, lMin = 0, lMax = 5;
            const tw = p => 36 + (p - pMin) / (pMax - pMin) * (W - 52);
            const ty = l => H - 28 - (l - lMin) / (lMax - lMin) * (H - 52);

            drawAxes(tw, ty, 'p̂', 'ℓ', [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 1, 2, 3, 4]);
            txt('Pérdidas de clasificación  ℓ(p̂, y=1)', 16, 18, '#60a5fa', 12, true);

            // BCE: -log(p)
            drawCurve(p => -Math.log(Math.max(p, 1e-9)), pMin, pMax, tw, ty, lMin, lMax, '#60a5fa');
            // Focal: (1-p)^γ * (-log p)
            drawCurve(p => Math.pow(1 - p, gamma) * (-Math.log(Math.max(p, 1e-9))),
                pMin, pMax, tw, ty, lMin, lMax, '#f87171', 2.2, [5, 4]);
            // Hinge: max(0, 1-2p+1)... usamos 0-1 version: max(0,1-p/(1-p))
            // Equivalente: max(0, 1-(2y-1)*z) con z=logit
            const hingeLoss = p => Math.max(0, 1 - (2 * 1 - 1) * (2 * p - 1));  // y=1, score=2p-1
            drawCurve(hingeLoss, pMin, pMax, tw, ty, lMin, lMax, '#a78bfa', 2.2, [8, 4]);

            // Punto en pred actual
            const pCur = Math.max(0.01, Math.min(0.99, yTrue === 1 ? pred : 1 - pred));
            const bceVal = -Math.log(pCur);
            const focalVal = Math.pow(1 - pCur, gamma) * (-Math.log(pCur));
            const hingeVal = hingeLoss(yTrue === 1 ? pred : 1 - pred);

            [
                { y: bceVal, color: '#60a5fa' },
                { y: focalVal, color: '#f87171' },
                { y: hingeVal, color: '#a78bfa' },
            ].forEach(({ y, color }) => {
                if (!isFinite(y) || y > lMax) return;
                ctx.beginPath(); ctx.arc(tw(yTrue === 1 ? pred : 1 - pred), ty(y), 5, 0, 2 * Math.PI);
                ctx.fillStyle = color; ctx.fill();
            });

            // Línea vertical en pred
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.moveTo(tw(yTrue === 1 ? pred : 1 - pred), ty(0));
            ctx.lineTo(tw(yTrue === 1 ? pred : 1 - pred), ty(lMax));
            ctx.stroke(); ctx.setLineDash([]);
            txt(`p̂=${(yTrue === 1 ? pred : 1 - pred).toFixed(2)}`,
                tw(yTrue === 1 ? pred : 1 - pred) + 4, ty(lMax / 2), '#94a3b8', 9);

            // Leyenda
            const items2 = [
                { color: '#60a5fa', label: `BCE: −log(p̂)`, dash: [] },
                { color: '#f87171', label: `Focal (γ=${gamma.toFixed(1)})`, dash: [5, 4] },
                { color: '#a78bfa', label: `Hinge`, dash: [8, 4] },
            ];
            items2.forEach(({ color, label, dash }, i) => {
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash);
                ctx.beginPath(); ctx.moveTo(W - 185, H - 52 + i * 20); ctx.lineTo(W - 155, H - 52 + i * 20); ctx.stroke();
                ctx.setLineDash([]);
                txt(label, W - 149, H - 48 + i * 20, color, 10);
            });

            txt(`BCE=${bceVal.toFixed(3)}  Focal=${focalVal.toFixed(3)}  Hinge=${hingeVal.toFixed(3)}`,
                16, H - 12, '#475569', 10);
        }

        // ── MODO: Gradientes & robustez ──────────────────────────────────────
        if (mode === 'compare') {
            txt('Gradientes de pérdida vs residuo r', 16, 18, '#60a5fa', 12, true);

            const rMin = -4, rMax = 4, gMin = -4.5, gMax = 4.5;
            const tw = r => 36 + (r - rMin) / (rMax - rMin) * (W - 52);
            const ty = g => H - 28 - (g - gMin) / (gMax - gMin) * (H - 52);

            drawAxes(tw, ty, 'r', '∂ℓ/∂r', [-4, -3, -2, -1, 0, 1, 2, 3, 4], [-4, -2, 0, 2, 4]);

            // Gradientes
            // MSE: 2r
            drawCurve(r => 2 * r, rMin, rMax, tw, ty, gMin, gMax, '#60a5fa');
            // MAE: sign(r)
            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2.2; ctx.setLineDash([5, 4]);
            ctx.beginPath(); ctx.moveTo(tw(rMin), ty(-1)); ctx.lineTo(tw(0), ty(-1)); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(tw(0), ty(1)); ctx.lineTo(tw(rMax), ty(1)); ctx.stroke();
            ctx.setLineDash([]);
            // Huber: r si |r|≤δ, δ·sign(r) sino
            drawCurve(r => Math.abs(r) <= delta ? r : delta * Math.sign(r),
                rMin, rMax, tw, ty, gMin, gMax, '#34d399', 2.2, [8, 4]);

            // Eje horizontal y=0
            ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(tw(rMin), ty(0)); ctx.lineTo(tw(rMax), ty(0)); ctx.stroke();

            // Zona clipping Huber
            ctx.fillStyle = 'rgba(52,211,153,0.07)';
            ctx.fillRect(tw(rMin), ty(delta), tw(-delta) - tw(rMin), ty(-delta) - ty(delta));
            ctx.fillRect(tw(delta), ty(delta), tw(rMax) - tw(delta), ty(-delta) - ty(delta));
            txt(`clip ±δ=${delta.toFixed(1)}`, tw(rMax) - 80, ty(delta) + 14, '#34d399', 9);

            // Comparativa en puntos específicos
            const rows = [
                { r: 0.5, mse: 1.0, mae: 1.0, hub: 0.5 },
                { r: 2.0, mse: 4.0, mae: 1.0, hub: delta },
                { r: -2.5, mse: -5.0, mae: -1.0, hub: -delta },
            ];
            txt('r      ∂MSE    ∂MAE    ∂Huber', W - 230, 46, '#475569', 9, true);
            rows.forEach(({ r, mse, mae, hub }, i) => {
                const mseG = 2 * r, maeG = Math.sign(r), hubG = Math.abs(r) <= delta ? r : delta * Math.sign(r);
                txt(`${r.toFixed(1).padStart(5)}   ${mseG.toFixed(2).padStart(6)}  ${maeG.toFixed(2).padStart(6)}  ${hubG.toFixed(2).padStart(6)}`,
                    W - 230, 62 + i * 16, '#94a3b8', 9);
                // Punto en curvas
                if (isFinite(mseG) && mseG > gMin && mseG < gMax) {
                    ctx.beginPath(); ctx.arc(tw(r), ty(mseG), 4, 0, 2 * Math.PI);
                    ctx.fillStyle = '#60a5fa'; ctx.fill();
                }
            });

            // Insight: gradiente MSE crece ilimitado
            const xOutlier = 3.5;
            ctx.strokeStyle = 'rgba(248,113,113,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(tw(xOutlier), ty(gMin)); ctx.lineTo(tw(xOutlier), ty(gMax)); ctx.stroke();
            ctx.setLineDash([]);
            txt(`outlier`, tw(xOutlier) + 4, ty(gMax) + 12, '#f87171', 9);
            txt(`∂MSE=${(2 * xOutlier).toFixed(1)} ← explosivo`, tw(xOutlier) + 4, ty(2 * xOutlier) - 6, '#60a5fa', 9);
            txt(`∂Huber=${(delta).toFixed(1)} ← acotado`, tw(xOutlier) + 4, ty(delta) + 10, '#34d399', 9);

            // Leyenda
            const items3 = [
                { color: '#60a5fa', label: '∂MSE/∂r = 2r', dash: [] },
                { color: '#fbbf24', label: '∂MAE/∂r = sign(r)', dash: [5, 4] },
                { color: '#34d399', label: `∂Huber/∂r (δ=${delta.toFixed(1)})`, dash: [8, 4] },
            ];
            items3.forEach(({ color, label, dash }, i) => {
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash);
                ctx.beginPath(); ctx.moveTo(W - 195, H - 52 + i * 20); ctx.lineTo(W - 165, H - 52 + i * 20); ctx.stroke();
                ctx.setLineDash([]);
                txt(label, W - 159, H - 48 + i * 20, color, 10);
            });

            txt('MSE: gradiente ilimitado → sensible a outliers. Huber: acotado por δ.',
                16, H - 12, '#475569', 10);
        }

    }, [mode, delta, gamma, pred, yTrue]);

    return (
        <div className="viz-box" style={{ background: '#0b1220', borderRadius: 10, padding: 12 }}>
            <canvas
                ref={canvasRef}
                width={530}
                height={360}
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

                {/* Sliders regresión y gradientes */}
                {(mode === 'regression' || mode === 'compare') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#34d399', fontSize: 11, minWidth: 120, fontFamily: 'monospace' }}>
                            δ (Huber) = {delta.toFixed(2)}
                        </span>
                        <input type="range" min={0.1} max={3.0} step={0.05} value={delta}
                            onChange={e => setDelta(Number(e.target.value))}
                            style={{ flex: 1, accentColor: '#34d399' }} />
                    </div>
                )}

                {/* Controles clasificación */}
                {mode === 'classify' && (
                    <>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                <span style={{ color: '#60a5fa', fontSize: 11, minWidth: 90, fontFamily: 'monospace' }}>
                                    p̂ = {pred.toFixed(2)}
                                </span>
                                <input type="range" min={0.01} max={0.99} step={0.01} value={pred}
                                    onChange={e => setPred(Number(e.target.value))}
                                    style={{ flex: 1, accentColor: '#60a5fa' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                <span style={{ color: '#f87171', fontSize: 11, minWidth: 90, fontFamily: 'monospace' }}>
                                    γ (focal) = {gamma.toFixed(1)}
                                </span>
                                <input type="range" min={0} max={5} step={0.1} value={gamma}
                                    onChange={e => setGamma(Number(e.target.value))}
                                    style={{ flex: 1, accentColor: '#f87171' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {[{ v: 1, label: 'y=1 (positivo)' }, { v: 0, label: 'y=0 (negativo)' }].map(({ v, label }) => (
                                <button key={v} onClick={() => setYTrue(v)} style={{
                                    flex: 1, padding: '5px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                                    border: `1.5px solid ${yTrue === v ? '#fbbf24' : '#334155'}`,
                                    background: yTrue === v ? '#fbbf2422' : 'transparent',
                                    color: yTrue === v ? '#fbbf24' : '#64748b',
                                    fontFamily: 'monospace',
                                }}>{label}</button>
                            ))}
                        </div>
                    </>
                )}

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Regresión</b>: MSE crece cuadráticamente con r; MAE lineal; Huber cuadrático para |r|≤δ y lineal fuera.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Clasificación</b>: BCE penaliza confianza errónea; Focal reduce peso de ejemplos fáciles (γ↑).&nbsp;
                    <b style={{ color: '#94a3b8' }}>Gradientes</b>: el gradiente de MSE crece ilimitado — outliers generan gradientes explosivos que Huber amortigua.
                </p>
            </div>
        </div>
    );
}