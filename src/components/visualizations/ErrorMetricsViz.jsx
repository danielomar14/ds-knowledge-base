import React, { useState, useEffect, useRef } from 'react';

export default function ErrorMetricsViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('compare');   // compare | outlier | biasvar
    const [outlierVal, setOutlierVal] = useState(105);
    const [biasVal, setBiasVal] = useState(0.0);
    const [varVal, setVarVal] = useState(1.5);

    const MODES = [
        { key: 'compare', label: 'MSE vs MAE vs MAPE' },
        { key: 'outlier', label: 'Efecto outlier' },
        { key: 'biasvar', label: 'Bias² + Varianza' },
    ];

    // Datos base fijos
    const Y_TRUE = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const Y_PRED = [11, 19, 33, 38, 52, 58, 73, 79, 88, 105];

    const mse = (y, yh) => y.reduce((s, v, i) => s + (v - yh[i]) ** 2, 0) / y.length;
    const rmse = (y, yh) => Math.sqrt(mse(y, yh));
    const mae = (y, yh) => y.reduce((s, v, i) => s + Math.abs(v - yh[i]), 0) / y.length;
    const mape = (y, yh) => {
        const vals = y.map((v, i) => v !== 0 ? Math.abs((v - yh[i]) / v) * 100 : 0);
        return vals.reduce((a, b) => a + b, 0) / vals.length;
    };
    const r2 = (y, yh) => {
        const mn = y.reduce((a, b) => a + b, 0) / y.length;
        const ss_res = y.reduce((s, v, i) => s + (v - yh[i]) ** 2, 0);
        const ss_tot = y.reduce((s, v) => s + (v - mn) ** 2, 0);
        return 1 - ss_res / ss_tot;
    };

    // LCG determinista para "muestras" reproducibles
    const lcgSamples = (seed, n, mean, std) => {
        let s = seed;
        const rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return ((s >>> 0) / 0xffffffff - 0.5) * 2; };
        return Array.from({ length: n }, () => mean + rand() * std * 1.7);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, W, H);

        const txt = (t, x, y, color = '#94a3b8', size = 11, bold = false) => {
            ctx.fillStyle = color;
            ctx.font = `${bold ? 'bold ' : ''}${size}px monospace`;
            ctx.fillText(t, x, y);
        };

        // ── MODO: Comparar métricas ──────────────────────────────────────────
        if (mode === 'compare') {
            txt('Comparación MSE · RMSE · MAE · MAPE sobre los mismos datos', 14, 18, '#60a5fa', 11, true);

            // Scatter: y_true vs y_pred
            const xMin = 0, xMax = 110, yMin = 0, yMax = 115;
            const panW = (W - 40) / 2 - 8, panH = H - 80;
            const ox = 20, oy = 32;
            const tw = x => ox + (x - xMin) / (xMax - xMin) * panW;
            const ty = y => oy + panH - (y - yMin) / (yMax - yMin) * panH;

            // Eje identidad
            ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(tw(0), ty(0)); ctx.lineTo(tw(110), ty(110)); ctx.stroke();
            ctx.setLineDash([]);
            txt('y=ŷ', tw(95), ty(98), '#475569', 9);

            // Puntos con residuos
            Y_TRUE.forEach((yt, i) => {
                const yh = Y_PRED[i];
                const r = yt - yh;
                // Línea residuo
                ctx.strokeStyle = `rgba(248,113,113,0.5)`; ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.moveTo(tw(yt), ty(yt)); ctx.lineTo(tw(yt), ty(yh)); ctx.stroke();
                // Punto pred
                ctx.beginPath(); ctx.arc(tw(yt), ty(yh), 4.5, 0, 2 * Math.PI);
                ctx.fillStyle = '#60a5fa'; ctx.fill();
                // Punto true
                ctx.beginPath(); ctx.arc(tw(yt), ty(yt), 3, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
            });

            // Ejes scatter
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(tw(0), ty(0)); ctx.lineTo(tw(110), ty(0)); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(tw(0), ty(0)); ctx.lineTo(tw(0), ty(115)); ctx.stroke();
            txt('y', tw(0) - 12, ty(115), '#475569', 9);
            txt('ŷ', tw(110), ty(0) + 12, '#475569', 9);
            [0, 25, 50, 75, 100].forEach(v => {
                txt(`${v}`, tw(v) - 8, ty(0) + 12, '#475569', 8);
                txt(`${v}`, tw(0) - 22, ty(v) + 4, '#475569', 8);
            });

            // Panel métricas (barra horizontal)
            const metrics = [
                { name: 'MSE', val: mse(Y_TRUE, Y_PRED), max: 30, color: '#60a5fa', unit: 'u²' },
                { name: 'RMSE', val: rmse(Y_TRUE, Y_PRED), max: 6, color: '#34d399', unit: 'u' },
                { name: 'MAE', val: mae(Y_TRUE, Y_PRED), max: 6, color: '#fbbf24', unit: 'u' },
                { name: 'MAPE', val: mape(Y_TRUE, Y_PRED), max: 10, color: '#a78bfa', unit: '%' },
                { name: 'R²', val: r2(Y_TRUE, Y_PRED), max: 1, color: '#f87171', unit: '' },
            ];

            const bx = ox + panW + 20, by = oy, bw = panW - 10;
            txt('Métricas calculadas', bx, by - 4, '#94a3b8', 10, true);

            metrics.forEach(({ name, val, max, color, unit }, i) => {
                const barY = by + 18 + i * 38;
                const barW = Math.max(0, Math.min(1, Math.abs(val) / max)) * bw;
                // Fondo barra
                ctx.fillStyle = 'rgba(255,255,255,0.04)';
                ctx.fillRect(bx, barY, bw, 22);
                // Barra valor
                ctx.fillStyle = color + '55';
                ctx.fillRect(bx, barY, barW, 22);
                ctx.strokeStyle = color; ctx.lineWidth = 1.5;
                ctx.strokeRect(bx, barY, bw, 22);
                txt(`${name}`, bx + 4, barY + 15, color, 11, true);
                txt(`${val.toFixed(3)} ${unit}`, bx + bw - 86, barY + 15, '#e2e8f0', 11);
            });

            // Leyenda
            ctx.beginPath(); ctx.arc(ox + 30, H - 18, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#60a5fa'; ctx.fill();
            txt('ŷ pred', ox + 38, H - 14, '#60a5fa', 9);
            ctx.strokeStyle = '#f87171'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(ox + 90, H - 18); ctx.lineTo(ox + 90, H - 12); ctx.stroke();
            txt('residuo rᵢ', ox + 96, H - 14, '#f87171', 9);
        }

        // ── MODO: Efecto outlier ─────────────────────────────────────────────
        if (mode === 'outlier') {
            txt('Sensibilidad de métricas al outlier  ŷ₁₀', 14, 18, '#60a5fa', 12, true);

            const yPredMod = [...Y_PRED.slice(0, -1), outlierVal];
            const metricsNorm = [mse(Y_TRUE, Y_PRED), rmse(Y_TRUE, Y_PRED), mae(Y_TRUE, Y_PRED), mape(Y_TRUE, Y_PRED)];
            const metricsOut = [mse(Y_TRUE, yPredMod), rmse(Y_TRUE, yPredMod), mae(Y_TRUE, yPredMod), mape(Y_TRUE, yPredMod)];
            const names = ['MSE', 'RMSE', 'MAE', 'MAPE'];
            const colors = ['#60a5fa', '#34d399', '#fbbf24', '#a78bfa'];
            const maxVals = [metricsOut[0], metricsOut[1], metricsOut[2], metricsOut[3]];

            const bx = 20, by = 45, bw = W - 40, bh = 50;

            names.forEach((name, i) => {
                const yb = by + i * bh;
                const scaleMax = maxVals[i] * 1.1 || 1;

                // Barra normal
                const wNorm = Math.min(1, metricsNorm[i] / scaleMax) * (bw - 120);
                ctx.fillStyle = colors[i] + '33';
                ctx.fillRect(bx + 100, yb, bw - 120, bh - 8);
                ctx.fillStyle = colors[i] + '88';
                ctx.fillRect(bx + 100, yb, wNorm, bh - 8);

                // Barra con outlier
                const wOut = Math.min(1, metricsOut[i] / scaleMax) * (bw - 120);
                ctx.fillStyle = colors[i] + '44';
                ctx.fillRect(bx + 100, yb + (bh - 8) / 2, wOut, (bh - 8) / 2);
                ctx.strokeStyle = colors[i]; ctx.lineWidth = 1.5;
                ctx.strokeRect(bx + 100, yb + (bh - 8) / 2, wOut, (bh - 8) / 2);

                // Labels
                txt(name, bx + 2, yb + (bh - 8) / 2 + 4, colors[i], 12, true);
                const ratio = metricsNorm[i] > 0 ? metricsOut[i] / metricsNorm[i] : 1;
                const ratioColor = ratio > 3 ? '#f87171' : ratio > 1.5 ? '#fbbf24' : '#34d399';
                txt(`${metricsNorm[i].toFixed(2)} → ${metricsOut[i].toFixed(2)}`,
                    bx + 100 + wOut + 6, yb + (bh - 8) * 0.75, '#e2e8f0', 10);
                txt(`×${ratio.toFixed(1)}`, bx + 100 + wOut + 6, yb + (bh - 8) * 0.35, ratioColor, 10, true);
            });

            // Indicador outlier
            const rOutlier = Math.abs(outlierVal - 100);
            ctx.fillStyle = 'rgba(248,113,113,0.15)';
            ctx.fillRect(bx, by + 4 * bh + 4, bw, 36);
            txt(`Outlier: ŷ₁₀=${outlierVal}  y₁₀=100  r₁₀=${(outlierVal - 100 > 0 ? '+' : '')}${outlierVal - 100}`,
                bx + 8, by + 4 * bh + 20, '#f87171', 10, true);
            txt(`MSE pondera este error ×${(rOutlier ** 2).toFixed(0)} (cuadrático)  vs MAE ×${rOutlier} (lineal)`,
                bx + 8, by + 4 * bh + 36, '#475569', 10);

            // Leyenda
            ctx.fillStyle = 'rgba(96,165,250,0.25)'; ctx.fillRect(bx, H - 28, 18, 10);
            txt('sin outlier', bx + 22, H - 20, '#94a3b8', 10);
            ctx.fillStyle = 'rgba(96,165,250,0.4)'; ctx.fillRect(bx + 110, H - 28, 18, 10);
            ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 1.5; ctx.strokeRect(bx + 110, H - 28, 18, 10);
            txt('con outlier', bx + 132, H - 20, '#94a3b8', 10);
        }

        // ── MODO: Bias² + Varianza ───────────────────────────────────────────
        if (mode === 'biasvar') {
            txt('Descomposición: MSE = Bias² + Varianza', 14, 18, '#60a5fa', 12, true);

            const yTrueVal = 5.0;
            const n = 60;
            // Muestras pseudo-aleatorias con bias y varianza controlados
            const samples = lcgSamples(42, n, yTrueVal + biasVal, varVal);

            const meanPred = samples.reduce((a, b) => a + b, 0) / n;
            const bias2 = (meanPred - yTrueVal) ** 2;
            const variance = samples.reduce((s, v) => s + (v - meanPred) ** 2, 0) / n;
            const mseVal = samples.reduce((s, v) => s + (v - yTrueVal) ** 2, 0) / n;

            // Distribución de predicciones
            const xMin = -4, xMax = 14, yMin = 0;
            const tw = x => 24 + (x - xMin) / (xMax - xMin) * (W - 40);
            const ty_h = v => H - 28 - v * (H - 100);

            // Histograma suave (kernel density)
            const kde = (x, bw = 0.6) => samples.reduce((s, xi) =>
                s + Math.exp(-0.5 * ((x - xi) / bw) ** 2) / (bw * Math.sqrt(2 * Math.PI)), 0) / n;

            const kdeMax = kde(meanPred);
            // Área bajo KDE
            ctx.fillStyle = 'rgba(96,165,250,0.15)';
            ctx.beginPath();
            ctx.moveTo(tw(xMin), H - 28);
            for (let px = 24; px <= W - 16; px++) {
                const x = xMin + (px - 24) / (W - 40) * (xMax - xMin);
                ctx.lineTo(px, ty_h(kde(x) / kdeMax * 0.65));
            }
            ctx.lineTo(W - 16, H - 28); ctx.closePath(); ctx.fill();

            // Curva KDE
            ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2;
            ctx.beginPath(); let first = true;
            for (let px = 24; px <= W - 16; px++) {
                const x = xMin + (px - 24) / (W - 40) * (xMax - xMin);
                const y = ty_h(kde(x) / kdeMax * 0.65);
                first ? ctx.moveTo(px, y) : ctx.lineTo(px, y); first = false;
            }
            ctx.stroke();

            // Eje x
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(24, H - 28); ctx.lineTo(W - 16, H - 28); ctx.stroke();
            [-2, 0, 2, 4, 6, 8, 10, 12].forEach(v => {
                if (v < xMin || v > xMax) return;
                txt(`${v}`, tw(v) - 6, H - 14, '#475569', 9);
                ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(tw(v), H - 28); ctx.lineTo(tw(v), 50); ctx.stroke();
            });

            // Línea: valor verdadero
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.moveTo(tw(yTrueVal), H - 28); ctx.lineTo(tw(yTrueVal), 50); ctx.stroke();
            txt(`y=${yTrueVal}`, tw(yTrueVal) + 4, 60, '#34d399', 10, true);

            // Línea: media predicciones
            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
            ctx.setLineDash([5, 4]);
            ctx.beginPath(); ctx.moveTo(tw(meanPred), H - 28); ctx.lineTo(tw(meanPred), 50); ctx.stroke();
            ctx.setLineDash([]);
            txt(`E[ŷ]=${meanPred.toFixed(2)}`, tw(meanPred) + 4, 75, '#fbbf24', 10, true);

            // Flecha bias
            if (Math.abs(meanPred - yTrueVal) > 0.1) {
                const ySym = H - 28 + 20;
                ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(tw(yTrueVal), ySym); ctx.lineTo(tw(meanPred), ySym); ctx.stroke();
                // Cabeza flecha
                const dir = meanPred > yTrueVal ? 1 : -1;
                ctx.fillStyle = '#f87171';
                ctx.beginPath();
                ctx.moveTo(tw(meanPred), ySym);
                ctx.lineTo(tw(meanPred) - dir * 10, ySym - 5);
                ctx.lineTo(tw(meanPred) - dir * 10, ySym + 5);
                ctx.closePath(); ctx.fill();
                txt(`Bias=${(meanPred - yTrueVal > 0 ? '+' : '')}${(meanPred - yTrueVal).toFixed(2)}`,
                    (tw(yTrueVal) + tw(meanPred)) / 2 - 20, ySym + 14, '#f87171', 10, true);
            }

            // Panel descomposición
            const px2 = W - 200, py2 = 90;
            const total = bias2 + variance;
            const barW = 160;

            txt('MSE = Bias² + Varianza', px2, py2, '#94a3b8', 10, true);
            // Stacked bar
            const bY = py2 + 14;
            const b2W = total > 0 ? bias2 / total * barW : 0;
            const vW = total > 0 ? variance / total * barW : 0;
            ctx.fillStyle = '#f87171'; ctx.fillRect(px2, bY, b2W, 22);
            ctx.fillStyle = '#60a5fa'; ctx.fillRect(px2 + b2W, bY, vW, 22);
            ctx.strokeStyle = '#334155'; ctx.lineWidth = 1; ctx.strokeRect(px2, bY, barW, 22);

            txt(`Bias²=${bias2.toFixed(3)}`, px2, bY + 40, '#f87171', 10, true);
            txt(`Var  =${variance.toFixed(3)}`, px2, bY + 56, '#60a5fa', 10, true);
            txt(`MSE  =${mseVal.toFixed(3)}`, px2, bY + 72, '#e2e8f0', 11, true);
            const check = Math.abs(bias2 + variance - mseVal) < 0.001;
            txt(`Bias²+Var=${(bias2 + variance).toFixed(3)} ${check ? '✓' : ''}`,
                px2, bY + 90, '#34d399', 10, check);
        }

    }, [mode, outlierVal, biasVal, varVal]);

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

                {/* Slider outlier */}
                {mode === 'outlier' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#f87171', fontSize: 11, minWidth: 140, fontFamily: 'monospace' }}>
                            ŷ₁₀ (outlier) = {outlierVal}
                        </span>
                        <input type="range" min={100} max={600} step={5} value={outlierVal}
                            onChange={e => setOutlierVal(Number(e.target.value))}
                            style={{ flex: 1, accentColor: '#f87171' }} />
                    </div>
                )}

                {/* Sliders bias-varianza */}
                {mode === 'biasvar' && (
                    <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                            <span style={{ color: '#f87171', fontSize: 11, minWidth: 90, fontFamily: 'monospace' }}>
                                Bias = {biasVal.toFixed(2)}
                            </span>
                            <input type="range" min={-3} max={3} step={0.1} value={biasVal}
                                onChange={e => setBiasVal(Number(e.target.value))}
                                style={{ flex: 1, accentColor: '#f87171' }} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                            <span style={{ color: '#60a5fa', fontSize: 11, minWidth: 90, fontFamily: 'monospace' }}>
                                Var σ = {varVal.toFixed(2)}
                            </span>
                            <input type="range" min={0.1} max={4} step={0.1} value={varVal}
                                onChange={e => setVarVal(Number(e.target.value))}
                                style={{ flex: 1, accentColor: '#60a5fa' }} />
                        </div>
                    </div>
                )}

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Comparar</b>: scatter ŷ vs y con residuos; barras muestran cada métrica calculada.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Outlier</b>: desliza ŷ₁₀ para ver cómo MSE se dispara ×ratio cuadrático mientras MAE crece linealmente.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Bias²+Var</b>: MSE = Bias² + Varianza — ajusta cada componente y verifica la identidad.
                </p>
            </div>
        </div>
    );
}