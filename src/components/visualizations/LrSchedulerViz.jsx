import React, { useState, useEffect, useRef } from 'react';

export default function LrSchedulerViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('schedules'); // schedules | finder | effect
    const [lrMax, setLrMax] = useState(0.10);
    const [lrMin, setLrMin] = useState(0.0001);
    const [warmup, setWarmup] = useState(10);
    const [T, setT] = useState(100);
    const [curStep, setCurStep] = useState(50);
    const [activeSchedules, setActiveSchedules] = useState(
        new Set(['cosine', 'warmup_cosine', 'step', 'sgdr'])
    );

    const MODES = [
        { key: 'schedules', label: 'Comparar schedules' },
        { key: 'finder', label: 'LR Finder' },
        { key: 'effect', label: 'Efecto en training' },
    ];

    const SCHEDULE_DEFS = [
        { key: 'constant', label: 'Constante', color: '#475569' },
        { key: 'step', label: 'Step decay', color: '#fbbf24' },
        { key: 'exponential', label: 'Exponencial', color: '#f87171' },
        { key: 'cosine', label: 'Cosine', color: '#60a5fa' },
        { key: 'warmup_cosine', label: 'Warmup + Cosine', color: '#34d399' },
        { key: 'sgdr', label: 'SGDR', color: '#a78bfa' },
    ];

    const getLr = (key, t, T, lrMax, lrMin, warmup) => {
        const wu = Math.max(1, warmup);
        switch (key) {
            case 'constant': return lrMax;
            case 'step': {
                const k = Math.floor(T / 4);
                return lrMax * Math.pow(0.4, Math.floor(t / k));
            }
            case 'exponential': {
                const lam = -Math.log(lrMin / lrMax) / T;
                return lrMax * Math.exp(-lam * t);
            }
            case 'cosine':
                return lrMin + 0.5 * (lrMax - lrMin) * (1 + Math.cos(Math.PI * t / T));
            case 'warmup_cosine':
                if (t < wu) return lrMax * (t / wu);
                return lrMin + 0.5 * (lrMax - lrMin) * (1 + Math.cos(Math.PI * (t - wu) / (T - wu)));
            case 'sgdr': {
                const T0 = Math.floor(T / 4);
                let tCur = t, Ti = T0;
                while (tCur >= Ti) { tCur -= Ti; Ti = Math.min(Ti * 2, T); }
                return lrMin + 0.5 * (lrMax - lrMin) * (1 + Math.cos(Math.PI * tCur / Ti));
            }
            default: return lrMax;
        }
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

        // ── MODO: Comparar schedules ─────────────────────────────────────────
        if (mode === 'schedules') {
            txt('Learning Rate Schedules  α(t)', 16, 18, '#60a5fa', 12, true);

            const xMin = 0, xMax = T, yMin = 0, yMax = lrMax * 1.08;
            const ox = 52, oy = 28, pw = W - ox - 20, ph = H - oy - 70;
            const tw = t => ox + t / xMax * pw;
            const ty = v => oy + ph - Math.max(0, v) / yMax * ph;

            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
            [0, 0.25, 0.5, 0.75, 1.0].forEach(f2 => {
                const tv = f2 * T;
                ctx.beginPath(); ctx.moveTo(tw(tv), oy); ctx.lineTo(tw(tv), oy + ph); ctx.stroke();
                txt(`${Math.round(tv)}`, tw(tv) - 8, oy + ph + 14, '#475569', 9);
            });
            // Y ticks
            [0, lrMin, lrMax * 0.25, lrMax * 0.5, lrMax * 0.75, lrMax].forEach(v => {
                const y2 = ty(v);
                if (y2 < oy || y2 > oy + ph) return;
                ctx.beginPath(); ctx.moveTo(ox, y2); ctx.lineTo(ox + pw, y2); ctx.stroke();
                txt(v.toExponential(0), 4, y2 + 4, '#475569', 8);
            });

            // Ejes
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.3;
            ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy + ph); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(ox, oy + ph); ctx.lineTo(ox + pw, oy + ph); ctx.stroke();
            txt('paso t', ox + pw - 28, oy + ph + 14, '#475569', 9);
            txt('α', ox - 16, oy + 4, '#475569', 9);

            // Línea vertical: paso actual
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(tw(curStep), oy); ctx.lineTo(tw(curStep), oy + ph); ctx.stroke();
            ctx.setLineDash([]);

            // Zona warm-up
            if (warmup > 0 && activeSchedules.has('warmup_cosine')) {
                ctx.fillStyle = 'rgba(52,211,153,0.06)';
                ctx.fillRect(ox, oy, tw(warmup) - ox, ph);
                txt('WU', ox + 4, oy + 14, '#34d399', 8);
            }

            // Curvas de schedules activos
            SCHEDULE_DEFS.forEach(({ key, color }) => {
                if (!activeSchedules.has(key)) return;
                ctx.strokeStyle = color; ctx.lineWidth = 2.2;
                ctx.beginPath(); let first = true;
                for (let px = 0; px <= pw; px++) {
                    const t2 = px / pw * T;
                    const v = getLr(key, t2, T, lrMax, lrMin, warmup);
                    if (!isFinite(v)) { first = true; continue; }
                    const py = ty(Math.max(0, v));
                    if (py < oy - 2 || py > oy + ph + 2) { first = true; continue; }
                    first ? ctx.moveTo(ox + px, py) : ctx.lineTo(ox + px, py);
                    first = false;
                }
                ctx.stroke();

                // Punto en paso actual
                const vCur = getLr(key, curStep, T, lrMax, lrMin, warmup);
                if (isFinite(vCur) && vCur >= 0) {
                    ctx.beginPath(); ctx.arc(tw(curStep), ty(vCur), 4, 0, 2 * Math.PI);
                    ctx.fillStyle = color; ctx.fill();
                }
            });

            // Leyenda + valores actuales
            let li = 0;
            SCHEDULE_DEFS.forEach(({ key, label, color }) => {
                if (!activeSchedules.has(key)) return;
                const vCur = getLr(key, curStep, T, lrMax, lrMin, warmup);
                ctx.strokeStyle = color; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(ox, oy + ph + 30 + li * 18); ctx.lineTo(ox + 20, oy + ph + 30 + li * 18); ctx.stroke();
                txt(`${label}: ${vCur.toExponential(2)}`, ox + 24, oy + ph + 34 + li * 18, color, 9);
                li++;
            });
        }

        // ── MODO: LR Finder ──────────────────────────────────────────────────
        if (mode === 'finder') {
            txt('LR Finder — pérdida vs log(α)', 16, 18, '#60a5fa', 12, true);

            // Simular curva de pérdida vs lr (determinista con LCG)
            const nSteps = 80;
            const lrStart = 1e-5, lrEnd = 1.0;
            const lrs = Array.from({ length: nSteps }, (_, i) =>
                Math.pow(10, Math.log10(lrStart) + i / (nSteps - 1) * (Math.log10(lrEnd) - Math.log10(lrStart))));

            // Pérdida simulada: decrece con lr hasta cierto punto, luego diverge
            let lossEma = 2.5;
            let w = 2.5;
            let s = 42;
            const lcgR = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return ((s >>> 0) / 0xffffffff - 0.5) * 2; };

            const lossSeq = lrs.map(lr2 => {
                const g = 2 * w + lcgR() * 0.3;
                w = w - lr2 * g;
                const loss = w * w + 0.1;
                lossEma = 0.8 * lossEma + 0.2 * Math.max(0, loss);
                return lossEma;
            });

            // Suavizar
            const smooth = (arr, k = 3) => arr.map((_, i) => {
                const sl = arr.slice(Math.max(0, i - k), i + k + 1);
                return sl.reduce((a, b) => a + b, 0) / sl.length;
            });
            const lossSmooth = smooth(lossSeq, 4);

            const logLrs = lrs.map(v => Math.log10(v));
            const lMin2 = Math.max(0, Math.min(...lossSmooth.filter(isFinite)) - 0.1);
            const lMax2 = Math.min(Math.max(...lossSmooth.filter(isFinite)) + 0.2, 5);

            const ox = 48, oy = 30, pw = W - ox - 24, ph = H - oy - 60;
            const tx2 = v => ox + (v - Math.log10(lrStart)) / (Math.log10(lrEnd) - Math.log10(lrStart)) * pw;
            const ty2 = v => oy + ph - (v - lMin2) / (lMax2 - lMin2) * ph;

            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
            [-5, -4, -3, -2, -1, 0].forEach(exp => {
                if (exp < Math.log10(lrStart) || exp > Math.log10(lrEnd)) return;
                ctx.beginPath(); ctx.moveTo(tx2(exp), oy); ctx.lineTo(tx2(exp), oy + ph); ctx.stroke();
                txt(`10^${exp}`, tx2(exp) - 16, oy + ph + 14, '#475569', 8);
            });
            [0, 1, 2, 3].forEach(v => {
                if (v < lMin2 || v > lMax2) return;
                ctx.beginPath(); ctx.moveTo(ox, ty2(v)); ctx.lineTo(ox + pw, ty2(v)); ctx.stroke();
                txt(`${v}`, 8, ty2(v) + 4, '#475569', 9);
            });

            // Ejes
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.3;
            ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy + ph); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(ox, oy + ph); ctx.lineTo(ox + pw, oy + ph); ctx.stroke();
            txt('log₁₀(α)', ox + pw - 40, oy + ph + 14, '#475569', 9);
            txt('pérdida', 4, oy + 4, '#475569', 9);

            // Curva de pérdida
            ctx.strokeStyle = '#60a5fa'; ctx.lineWidth = 2.5;
            ctx.beginPath(); let first = true;
            lossSmooth.forEach((v, i) => {
                if (!isFinite(v) || v < lMin2 - 0.5 || v > lMax2 + 0.5) { first = true; return; }
                const px = tx2(logLrs[i]), py = ty2(v);
                first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                first = false;
            });
            ctx.stroke();

            // Gradiente de la pérdida (para encontrar mínimo)
            const grads = lossSmooth.map((_, i) => {
                if (i === 0 || i === lossSmooth.length - 1) return 0;
                return (lossSmooth[i + 1] - lossSmooth[i - 1]) / (logLrs[i + 1] - logLrs[i - 1]);
            });
            const minGradIdx = grads.reduce((mi, v, i) => v < grads[mi] ? i : mi, 1);
            const bestLr = lrs[minGradIdx];
            const suggestLr = bestLr / 10;

            // Línea: lr óptimo (gradiente mínimo)
            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(tx2(logLrs[minGradIdx]), oy);
            ctx.lineTo(tx2(logLrs[minGradIdx]), oy + ph); ctx.stroke();
            ctx.setLineDash([]);
            txt(`max |−∂L/∂logα|`, tx2(logLrs[minGradIdx]) + 4, oy + 20, '#fbbf24', 9, true);
            txt(`α_optimo=${bestLr.toExponential(1)}`, tx2(logLrs[minGradIdx]) + 4, oy + 36, '#fbbf24', 9);

            // Línea: lr sugerido (1 orden menos)
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2; ctx.setLineDash([3, 4]);
            ctx.beginPath();
            ctx.moveTo(tx2(Math.log10(suggestLr)), oy);
            ctx.lineTo(tx2(Math.log10(suggestLr)), oy + ph); ctx.stroke();
            ctx.setLineDash([]);
            txt(`α_usar=${suggestLr.toExponential(1)}`, tx2(Math.log10(suggestLr)) + 4, oy + 52, '#34d399', 9, true);

            // Anotaciones de zonas
            txt('← muy pequeño', tx2(-4.5), ty2(lMin2 + (lMax2 - lMin2) * 0.8), '#475569', 9);
            txt('óptimo →', tx2(Math.log10(bestLr) - 1.2), ty2(lMin2 + (lMax2 - lMin2) * 0.3), '#475569', 9);
            txt('diverge →', tx2(Math.log10(bestLr) + 0.3), ty2(lMin2 + (lMax2 - lMin2) * 0.8), '#f87171', 9);

            // Curva de gradiente (escala secundaria)
            const gradMax = Math.max(...grads.map(Math.abs));
            ctx.strokeStyle = 'rgba(248,113,113,0.5)'; ctx.lineWidth = 1.5; ctx.setLineDash([2, 3]);
            ctx.beginPath(); first = true;
            grads.forEach((v, i) => {
                if (!isFinite(v)) { first = true; return; }
                const px = tx2(logLrs[i]);
                const py = oy + ph / 2 - v / gradMax * (ph / 3);
                if (py < oy || py > oy + ph) { first = true; return; }
                first ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                first = false;
            });
            ctx.stroke(); ctx.setLineDash([]);
            txt('∂L/∂logα', W - 100, oy + ph / 2, '#f87171', 9);

            txt('Rojo punteado = gradiente de pérdida. Elegir α donde la pérdida cae más rápido.',
                ox, H - 12, '#475569', 9);
        }

        // ── MODO: Efecto en training ──────────────────────────────────────────
        if (mode === 'effect') {
            txt('Efecto del schedule sobre la pérdida de entrenamiento', 14, 18, '#60a5fa', 11, true);

            // Simular pérdida bajo distintos schedules (LCG determinista)
            const simLoss = (schedKey) => {
                let w = 2.8, loss_ema = 8.0; let s = 99;
                const lcg2 = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return ((s >>> 0) / 0xffffffff - 0.5) * 2; };
                const losses = [loss_ema];
                for (let t = 1; t <= T; t++) {
                    const a = getLr(schedKey, t, T, lrMax, lrMin, warmup);
                    const g = 2 * w + lcg2() * 0.4;
                    w = Math.max(-5, Math.min(5, w - a * g));
                    const v = w * w + 0.05;
                    loss_ema = 0.85 * loss_ema + 0.15 * v;
                    losses.push(Math.max(0, loss_ema));
                }
                return losses;
            };

            const showSchedules = ['constant', 'step', 'cosine', 'warmup_cosine', 'sgdr'];
            const simResults = showSchedules.map(k => ({ key: k, losses: simLoss(k) }));

            const allL = simResults.flatMap(r => r.losses).filter(isFinite);
            const lMin3 = Math.max(0, Math.min(...allL) - 0.05);
            const lMax3 = Math.min(Math.max(...allL) + 0.3, 9);

            const ox = 48, oy = 28, pw = W - ox - 130, ph = H - oy - 50;
            const tw3 = t => ox + t / T * pw;
            const ty3 = v => oy + ph - (Math.max(0, v) - lMin3) / (lMax3 - lMin3) * ph;

            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
            [0, 25, 50, 75, 100].forEach(t2 => {
                if (t2 > T) return;
                ctx.beginPath(); ctx.moveTo(tw3(t2), oy); ctx.lineTo(tw3(t2), oy + ph); ctx.stroke();
                txt(`${t2}`, tw3(t2) - 8, oy + ph + 14, '#475569', 9);
            });

            // Ejes
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.3;
            ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy + ph); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(ox, oy + ph); ctx.lineTo(ox + pw, oy + ph); ctx.stroke();
            txt('paso', ox + pw - 20, oy + ph + 14, '#475569', 9);
            txt('pérdida', 4, oy + 4, '#475569', 9);

            // Zona warmup
            if (warmup > 0) {
                ctx.fillStyle = 'rgba(52,211,153,0.06)';
                ctx.fillRect(ox, oy, tw3(warmup) - ox, ph);
            }

            // Línea paso actual
            ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(tw3(curStep), oy); ctx.lineTo(tw3(curStep), oy + ph); ctx.stroke();
            ctx.setLineDash([]);

            // Curvas de pérdida
            simResults.forEach(({ key, losses }) => {
                const def = SCHEDULE_DEFS.find(d => d.key === key);
                if (!def) return;
                ctx.strokeStyle = def.color; ctx.lineWidth = 2;
                ctx.beginPath(); let first = true;
                losses.forEach((v, t2) => {
                    if (!isFinite(v) || v < lMin3 - 0.5 || v > lMax3 + 0.5) { first = true; return; }
                    first ? ctx.moveTo(tw3(t2), ty3(v)) : ctx.lineTo(tw3(t2), ty3(v));
                    first = false;
                });
                ctx.stroke();
                // Punto actual
                const vCur = losses[Math.min(curStep, losses.length - 1)];
                if (isFinite(vCur)) {
                    ctx.beginPath(); ctx.arc(tw3(curStep), ty3(vCur), 4, 0, 2 * Math.PI);
                    ctx.fillStyle = def.color; ctx.fill();
                }
            });

            // Leyenda lateral
            const lx = ox + pw + 12;
            txt('Schedule  L_final', lx, oy + 14, '#475569', 9, true);
            simResults.forEach(({ key, losses }, i) => {
                const def = SCHEDULE_DEFS.find(d => d.key === key);
                if (!def) return;
                const finalL = losses[losses.length - 1];
                ctx.strokeStyle = def.color; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(lx, oy + 28 + i * 22); ctx.lineTo(lx + 14, oy + 28 + i * 22); ctx.stroke();
                txt(`${def.label.slice(0, 10)}`, lx + 18, oy + 32 + i * 22, def.color, 9);
                txt(`${finalL.toFixed(3)}`, lx + 18, oy + 42 + i * 22, '#475569', 8);
            });
        }

    }, [mode, lrMax, lrMin, warmup, T, curStep, activeSchedules]);

    const toggleSchedule = (key) => {
        setActiveSchedules(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    return (
        <div className="viz-box" style={{ background: '#0b1220', borderRadius: 10, padding: 12 }}>
            <canvas ref={canvasRef} width={530} height={370}
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

                {/* Toggle schedules (solo modo schedules) */}
                {mode === 'schedules' && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {SCHEDULE_DEFS.map(({ key, label, color }) => (
                            <button key={key} onClick={() => toggleSchedule(key)} style={{
                                padding: '3px 7px', fontSize: 9, cursor: 'pointer', borderRadius: 6,
                                border: `1.5px solid ${activeSchedules.has(key) ? color : '#334155'}`,
                                background: activeSchedules.has(key) ? color + '22' : 'transparent',
                                color: activeSchedules.has(key) ? color : '#475569',
                                fontFamily: 'monospace',
                            }}>{label}</button>
                        ))}
                    </div>
                )}

                {/* Parámetros comunes */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[
                        { label: 'α_max', val: lrMax, set: setLrMax, min: 0.001, max: 0.5, step: 0.005, color: '#60a5fa' },
                        { label: 'α_min', val: lrMin, set: setLrMin, min: 0.00001, max: 0.01, step: 0.00005, color: '#34d399' },
                        { label: 'warmup', val: warmup, set: setWarmup, min: 0, max: 30, step: 1, color: '#34d399' },
                    ].map(({ label, val, set, min, max, step, color }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 120 }}>
                            <span style={{ color, fontSize: 10, minWidth: 56, fontFamily: 'monospace', fontWeight: 'bold' }}>
                                {label}={label === 'warmup' ? val : val.toExponential(1)}
                            </span>
                            <input type="range" min={min} max={max} step={step} value={val}
                                onChange={e => set(Number(e.target.value))}
                                style={{ flex: 1, accentColor: color }} />
                        </div>
                    ))}
                </div>

                {/* Slider paso actual (schedules y effect) */}
                {(mode === 'schedules' || mode === 'effect') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#fbbf24', fontSize: 11, minWidth: 80, fontFamily: 'monospace' }}>
                            t={curStep}/{T}
                        </span>
                        <input type="range" min={0} max={T} step={1} value={curStep}
                            onChange={e => setCurStep(Number(e.target.value))}
                            style={{ flex: 1, accentColor: '#fbbf24' }} />
                    </div>
                )}

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Schedules</b>: activa/desactiva curvas; desliza t para ver α en cada paso y comparar valores.&nbsp;
                    <b style={{ color: '#94a3b8' }}>LR Finder</b>: la pérdida cae, alcanza un mínimo y diverge — elegir α donde cae más rápido.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Efecto</b>: warm-up estabiliza inicio; cosine converge suavemente; SGDR escapa con reinicios.
                </p>
            </div>
        </div>
    );
}