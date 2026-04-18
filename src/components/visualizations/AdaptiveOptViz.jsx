import React, { useState, useEffect, useRef } from 'react';

export default function AdaptiveOptViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('landscape');  // landscape | moments | stepsize
    const [step, setStep] = useState(0);
    const [running, setRunning] = useState(false);
    const [beta1, setBeta1] = useState(0.9);
    const [beta2, setBeta2] = useState(0.999);
    const [lr, setLr] = useState(0.05);
    const [activeOpts, setActiveOpts] = useState(new Set(['adam', 'rmsprop', 'adagrad']));

    const MAX_STEPS = 120;
    const trajRef = useRef({});
    const animRef = useRef(null);
    const stepRef = useRef(0);

    // Función 2D: Rosenbrock rescalada para visualización
    const f = (x, y) => 0.04 * (1 - x) ** 2 + 4 * (y - x * x) ** 2;
    const gfx = (x, y) => -0.08 * (1 - x) - 16 * x * (y - x * x);
    const gfy = (x, y) => 8 * (y - x * x);

    const OPT_DEFS = [
        { key: 'sgd', label: 'SGD', color: '#f87171' },
        { key: 'adagrad', label: 'AdaGrad', color: '#fbbf24' },
        { key: 'rmsprop', label: 'RMSProp', color: '#a78bfa' },
        { key: 'adam', label: 'Adam', color: '#34d399' },
    ];

    const computeAll = (lr, beta1, beta2) => {
        const x0 = -1.5, y0 = 1.5;
        const eps = 1e-8;

        const runSGD = () => {
            let [x, y] = [x0, y0]; const t = [[x, y]];
            for (let i = 0; i < MAX_STEPS; i++) {
                x = clamp(x - lr * 0.3 * gfx(x, y), -2.5, 2.5);
                y = clamp(y - lr * 0.3 * gfy(x, y), -1.5, 3);
                t.push([x, y]);
            }
            return t;
        };

        const runAdaGrad = () => {
            let [x, y] = [x0, y0], Gx = 0, Gy = 0; const t = [[x, y]];
            for (let i = 0; i < MAX_STEPS; i++) {
                const gx = gfx(x, y), gy = gfy(x, y);
                Gx += gx * gx; Gy += gy * gy;
                x = clamp(x - lr / Math.sqrt(Gx + eps) * gx, -2.5, 2.5);
                y = clamp(y - lr / Math.sqrt(Gy + eps) * gy, -1.5, 3);
                t.push([x, y]);
            }
            return t;
        };

        const runRMSProp = () => {
            let [x, y] = [x0, y0], Gx = 0, Gy = 0; const rho = 0.9; const t = [[x, y]];
            for (let i = 0; i < MAX_STEPS; i++) {
                const gx = gfx(x, y), gy = gfy(x, y);
                Gx = rho * Gx + (1 - rho) * gx * gx; Gy = rho * Gy + (1 - rho) * gy * gy;
                x = clamp(x - lr / Math.sqrt(Gx + eps) * gx, -2.5, 2.5);
                y = clamp(y - lr / Math.sqrt(Gy + eps) * gy, -1.5, 3);
                t.push([x, y]);
            }
            return t;
        };

        const runAdam = () => {
            let [x, y] = [x0, y0], mx = 0, my = 0, vx = 0, vy = 0; const t = [[x, y]];
            for (let i = 1; i <= MAX_STEPS; i++) {
                const gx = gfx(x, y), gy = gfy(x, y);
                mx = beta1 * mx + (1 - beta1) * gx; my = beta1 * my + (1 - beta1) * gy;
                vx = beta2 * vx + (1 - beta2) * gx * gx; vy = beta2 * vy + (1 - beta2) * gy * gy;
                const mhx = mx / (1 - beta1 ** i), mhy = my / (1 - beta1 ** i);
                const vhx = vx / (1 - beta2 ** i), vhy = vy / (1 - beta2 ** i);
                x = clamp(x - lr * mhx / (Math.sqrt(vhx) + eps), -2.5, 2.5);
                y = clamp(y - lr * mhy / (Math.sqrt(vhy) + eps), -1.5, 3);
                t.push([x, y]);
            }
            return t;
        };

        return { sgd: runSGD(), adagrad: runAdaGrad(), rmsprop: runRMSProp(), adam: runAdam() };
    };

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    useEffect(() => {
        const t = computeAll(lr, beta1, beta2);
        trajRef.current = t;
        stepRef.current = 0; setStep(0); setRunning(false);
        if (animRef.current) cancelAnimationFrame(animRef.current);
    }, [lr, beta1, beta2]);

    useEffect(() => {
        if (!running) return;
        const tick = () => {
            stepRef.current = Math.min(stepRef.current + 1, MAX_STEPS);
            setStep(stepRef.current);
            if (stepRef.current < MAX_STEPS) animRef.current = requestAnimationFrame(tick);
            else setRunning(false);
        };
        animRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animRef.current);
    }, [running]);

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

        const trajs = trajRef.current;
        if (!trajs.adam) return;
        const curS = Math.min(step, MAX_STEPS);

        // ── MODO: Paisaje 2D ─────────────────────────────────────────────────
        if (mode === 'landscape') {
            const xMin = -2, xMax = 2.2, yMin = -0.5, yMax = 3;
            const tw = x => 22 + (x - xMin) / (xMax - xMin) * (W - 38);
            const ty = y => H - 22 - (y - yMin) / (yMax - yMin) * (H - 44);

            // Curvas de nivel
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
            const nLv = 14;
            Array.from({ length: nLv }, (_, k) => zMn + (k + 0.5) * (zMx - zMn) / nLv).forEach((level, k) => {
                const t2 = k / nLv;
                const r = Math.round(11 + t2 * (96 - 11));
                const g2 = Math.round(18 + t2 * (165 - 18));
                const b = Math.round(250 + t2 * (96 - 250));
                ctx.strokeStyle = `rgba(${r},${g2},${b},0.42)`; ctx.lineWidth = 1;
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

            // Ejes
            ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
            ctx.beginPath(); ctx.moveTo(tw(1), 22); ctx.lineTo(tw(1), H - 22); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(22, ty(1)); ctx.lineTo(W - 16, ty(1)); ctx.stroke();
            ctx.setLineDash([]);

            // Mínimo: (1,1)
            ctx.beginPath(); ctx.arc(tw(1), ty(1), 7, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fill();
            txt('mín(1,1)', tw(1) + 8, ty(1) - 6, '#94a3b8', 9);

            // Trayectorias
            OPT_DEFS.forEach(({ key, color }) => {
                if (!activeOpts.has(key) || !trajs[key]) return;
                const traj = trajs[key];
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash([]);
                ctx.beginPath();
                traj.slice(0, curS + 1).forEach(([x, y], i) => {
                    i === 0 ? ctx.moveTo(tw(x), ty(y)) : ctx.lineTo(tw(x), ty(y));
                });
                ctx.stroke();
                // Punto actual
                const [xc, yc] = traj[Math.min(curS, traj.length - 1)];
                ctx.beginPath(); ctx.arc(tw(xc), ty(yc), 5, 0, 2 * Math.PI);
                ctx.fillStyle = color; ctx.fill();
            });

            // Punto de inicio
            ctx.beginPath(); ctx.arc(tw(trajs.adam[0][0]), ty(trajs.adam[0][1]), 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#e2e8f0'; ctx.fill();
            txt('inicio', tw(trajs.adam[0][0]) + 8, ty(trajs.adam[0][1]) - 6, '#94a3b8', 9);

            // Leyenda + pérdida actual
            let li = 0;
            OPT_DEFS.forEach(({ key, label, color }) => {
                if (!activeOpts.has(key)) return;
                const [xc, yc] = trajs[key][Math.min(curS, MAX_STEPS)];
                ctx.strokeStyle = color; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(W - 200, H - 50 + li * 20); ctx.lineTo(W - 172, H - 50 + li * 20); ctx.stroke();
                txt(`${label}  f=${f(xc, yc).toFixed(4)}`, W - 166, H - 46 + li * 20, color, 9);
                li++;
            });

            txt(`Rosenbrock rescalada  paso ${curS}/${MAX_STEPS}`, 14, 18, '#60a5fa', 10, true);
        }

        // ── MODO: Momentos de Adam ───────────────────────────────────────────
        if (mode === 'moments') {
            txt('Momentos de Adam: m̂ₜ (1er) y v̂ₜ (2do) con corrección de sesgo', 12, 18, '#60a5fa', 11, true);

            // Simular momentos en la dimensión x al seguir el camino de Adam
            const eps2 = 1e-8;
            let [x, y] = [x0_m = -1.5, y0_m = 1.5], mx = 0, my = 0, vx = 0, vy = 0;
            const records = [];
            for (let i = 1; i <= MAX_STEPS; i++) {
                const gx = gfx(x, y);
                mx = beta1 * mx + (1 - beta1) * gx;
                vx = beta2 * vx + (1 - beta2) * gx * gx;
                const mhx = mx / (1 - beta1 ** i);
                const vhx = vx / (1 - beta2 ** i);
                const step_x = lr * mhx / (Math.sqrt(vhx) + eps2);
                records.push({ t: i, gx, mx, mhx, vx: Math.sqrt(vhx), step_x });
                x = clamp(x - step_x, -2.5, 2.5);
                y = clamp(y - lr * (my / (1 - beta1 ** i)) / (Math.sqrt(vy / (1 - beta2 ** i)) + eps2), -1.5, 3);
                my = beta1 * my + (1 - beta1) * gfy(x, y);
                vy = beta2 * vy + (1 - beta2) * gfy(x, y) ** 2;
            }

            const showR = records.slice(0, Math.max(1, curS));
            const vals = {
                gx: showR.map(r => r.gx),
                mx: showR.map(r => r.mhx),
                vx: showR.map(r => r.vx),
                sx: showR.map(r => r.step_x),
            };

            const panH = (H - 80) / 2;
            const panels2 = [
                {
                    label: 'Gradiente gₓ (azul) y m̂ₓ (verde)', series: [
                        { v: vals.gx, color: '#60a5fa', dash: [] },
                        { v: vals.mx, color: '#34d399', dash: [] },
                    ], oy: 32
                },
                {
                    label: '√v̂ₓ — desv. estándar adaptativa (morado)', series: [
                        { v: vals.vx, color: '#a78bfa', dash: [] },
                        { v: vals.sx.map(v => Math.abs(v)), color: '#fbbf24', dash: [4, 4] },
                    ], oy: 32 + panH + 12
                },
            ];

            panels2.forEach(({ label, series, oy }) => {
                const allV = series.flatMap(s => s.v).filter(isFinite);
                const vMax = Math.max(Math.abs(Math.max(...allV)), Math.abs(Math.min(...allV)), 0.01) * 1.1;
                const ox = 44, pw = W - ox - 24, ph = panH - 16;
                const tw2 = t => ox + t / MAX_STEPS * pw;
                const ty2 = v => oy + ph / 2 - v / vMax * (ph / 2);

                // Grid
                ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
                [0, 30, 60, 90, 120].forEach(t2 => {
                    ctx.beginPath(); ctx.moveTo(tw2(t2), oy); ctx.lineTo(tw2(t2), oy + ph); ctx.stroke();
                    txt(`${t2}`, tw2(t2) - 8, oy + ph + 12, '#475569', 8);
                });
                // Eje cero
                ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.moveTo(ox, ty2(0)); ctx.lineTo(ox + pw, ty2(0)); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy + ph); ctx.stroke();
                txt(`+${vMax.toFixed(3)}`, 2, oy + 8, '#475569', 7);
                txt('0', 2, ty2(0) + 4, '#475569', 8);
                txt(`-${vMax.toFixed(3)}`, 2, oy + ph, '#475569', 7);

                // Línea paso actual
                ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                ctx.beginPath(); ctx.moveTo(tw2(curS), oy); ctx.lineTo(tw2(curS), oy + ph); ctx.stroke();
                ctx.setLineDash([]);

                series.forEach(({ v, color, dash }) => {
                    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash);
                    ctx.beginPath(); let first = true;
                    v.forEach((val, i) => {
                        const py = ty2(val);
                        if (!isFinite(py)) { first = true; return; }
                        first ? ctx.moveTo(tw2(i + 1), py) : ctx.lineTo(tw2(i + 1), py);
                        first = false;
                    });
                    ctx.stroke(); ctx.setLineDash([]);
                    if (curS > 0 && v.length >= curS) {
                        const vCur = v[Math.min(curS - 1, v.length - 1)];
                        if (isFinite(vCur)) {
                            ctx.beginPath(); ctx.arc(tw2(curS), ty2(vCur), 3.5, 0, 2 * Math.PI);
                            ctx.fillStyle = color; ctx.fill();
                        }
                    }
                });

                txt(label, ox, oy - 4, '#94a3b8', 9, true);
            });

            // Corrección de sesgo en t=curS
            if (curS > 0 && curS <= records.length) {
                const r = records[curS - 1];
                const mRaw = r.mx * (1 - beta1 ** curS);  // m sin corregir
                txt(`t=${curS}  m=${mRaw.toFixed(4)} → m̂=${r.mhx.toFixed(4)}  (÷${(1 - beta1 ** curS).toFixed(3)})`,
                    44, H - 12, '#34d399', 9, true);
            }
        }

        // ── MODO: Tamaño de paso adaptativo ─────────────────────────────────
        if (mode === 'stepsize') {
            txt('Tamaño de paso efectivo por dimensión: α/√v̂  (escala automática)', 12, 18, '#60a5fa', 10, true);

            // Tres "parámetros" con distintas historias de gradiente
            const paramCases = [
                { label: 'Param frecuente (g grande)', gMean: 2.0, gNoise: 0.5, color: '#f87171' },
                { label: 'Param moderado (g medio)', gMean: 0.5, gNoise: 0.2, color: '#fbbf24' },
                { label: 'Param esparso (g raro)', gMean: 0.1, gNoise: 0.8, color: '#34d399' },
            ];

            const T_s = curS || 1;
            // Simular histórico de pasos efectivos
            const simSteps = (gMean, gNoise) => {
                let m = 0, v = 0; const steps = [];
                let s = 42;
                const lcg = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return ((s >>> 0) / 0xffffffff - 0.5) * 2; };
                for (let t = 1; t <= MAX_STEPS; t++) {
                    const g = gMean + lcg() * gNoise;
                    m = beta1 * m + (1 - beta1) * g;
                    v = beta2 * v + (1 - beta2) * g * g;
                    const mh = m / (1 - beta1 ** t);
                    const vh = v / (1 - beta2 ** t);
                    steps.push({
                        adam_step: lr * Math.abs(mh) / (Math.sqrt(vh) + 1e-8),
                        adagrad_step: lr * Math.abs(g) / Math.sqrt(t * gMean * gMean + 1e-8),
                        rmsprop_step: lr * Math.abs(g) / Math.sqrt(v / (1 - beta2 ** t) + 1e-8),
                    });
                }
                return steps;
            };

            const allSims = paramCases.map(({ gMean, gNoise }) => simSteps(gMean, gNoise));

            const panH2 = (H - 80) / 3;
            paramCases.forEach(({ label, color }, pi) => {
                const oy = 30 + pi * (panH2 + 8);
                const sims = allSims[pi];
                const pw = W - 60, ox = 52, ph = panH2 - 4;

                const maxStep = Math.max(...sims.map(s => Math.max(s.adam_step, s.adagrad_step, s.rmsprop_step))) * 1.1;
                const tw2 = t => ox + t / MAX_STEPS * pw;
                const ty2 = v => oy + ph - v / maxStep * ph;

                // Grid
                ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 1;
                [0, 60, 120].forEach(t2 => {
                    ctx.beginPath(); ctx.moveTo(tw2(t2), oy); ctx.lineTo(tw2(t2), oy + ph); ctx.stroke();
                });
                ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy + ph); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(ox, oy + ph); ctx.lineTo(ox + pw, oy + ph); ctx.stroke();

                // Línea paso actual
                ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                ctx.beginPath(); ctx.moveTo(tw2(curS), oy); ctx.lineTo(tw2(curS), oy + ph); ctx.stroke();
                ctx.setLineDash([]);

                // Curvas AdaGrad, RMSProp, Adam
                const curves2 = [
                    { key: 'adagrad_step', c: '#fbbf24', lbl: 'AdaGrad' },
                    { key: 'rmsprop_step', c: '#a78bfa', lbl: 'RMSProp' },
                    { key: 'adam_step', c: '#34d399', lbl: 'Adam', dash: [5, 4] },
                ];
                curves2.forEach(({ key, c, lbl, dash = [] }) => {
                    ctx.strokeStyle = c; ctx.lineWidth = 1.5; ctx.setLineDash(dash);
                    ctx.beginPath(); let first = true;
                    sims.slice(0, curS).forEach((s, i) => {
                        const v = s[key], py = ty2(v);
                        if (!isFinite(py) || py < oy - 2 || py > oy + ph + 2) { first = true; return; }
                        first ? ctx.moveTo(tw2(i + 1), py) : ctx.lineTo(tw2(i + 1), py);
                        first = false;
                    });
                    ctx.stroke(); ctx.setLineDash([]);
                });

                txt(label, ox + 4, oy + 12, color, 9, true);
                if (curS > 0) {
                    const s = sims[Math.min(curS - 1, sims.length - 1)];
                    txt(`Adam=${s.adam_step.toFixed(4)}  AG=${s.adagrad_step.toFixed(4)}  RMS=${s.rmsprop_step.toFixed(4)}`,
                        ox + 4, oy + ph - 4, '#475569', 8);
                }
            });

            // Leyenda
            const lx = W - 165;
            [['#fbbf24', 'AdaGrad'], ['#a78bfa', 'RMSProp'], ['#34d399', 'Adam']].forEach(([c, lbl], i) => {
                ctx.strokeStyle = c; ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(lx, H - 36 + i * 16); ctx.lineTo(lx + 16, H - 36 + i * 16); ctx.stroke();
                txt(lbl, lx + 20, H - 32 + i * 16, c, 9);
            });
            txt('Adam mantiene paso ~cte. AdaGrad decrece. RMSProp intermedio.', 14, H - 8, '#475569', 9);
        }

    }, [mode, step, beta1, beta2, lr, activeOpts]);

    const toggleOpt = key => setActiveOpts(prev => {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
    });

    return (
        <div className="viz-box" style={{ background: '#0b1220', borderRadius: 10, padding: 12 }}>
            <canvas ref={canvasRef} width={530} height={370}
                style={{ borderRadius: 8, display: 'block', margin: '0 auto' }} />
            <div className="viz-ctrl" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>

                {/* Selector modo */}
                <div style={{ display: 'flex', gap: 6 }}>
                    {[
                        { key: 'landscape', label: 'Paisaje 2D' },
                        { key: 'moments', label: 'Momentos Adam' },
                        { key: 'stepsize', label: 'Paso efectivo' },
                    ].map(({ key, label }) => (
                        <button key={key} onClick={() => { setMode(key); setRunning(false); stepRef.current = 0; setStep(0); }} style={{
                            flex: 1, padding: '5px 4px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                            border: `1.5px solid ${mode === key ? '#60a5fa' : '#334155'}`,
                            background: mode === key ? '#60a5fa22' : 'transparent',
                            color: mode === key ? '#60a5fa' : '#64748b',
                            fontFamily: 'monospace', transition: 'all 0.15s',
                        }}>{label}</button>
                    ))}
                </div>

                {/* Toggle optimizadores (landscape) */}
                {mode === 'landscape' && (
                    <div style={{ display: 'flex', gap: 6 }}>
                        {OPT_DEFS.map(({ key, label, color }) => (
                            <button key={key} onClick={() => toggleOpt(key)} style={{
                                flex: 1, padding: '4px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                                border: `1.5px solid ${activeOpts.has(key) ? color : '#334155'}`,
                                background: activeOpts.has(key) ? color + '22' : 'transparent',
                                color: activeOpts.has(key) ? color : '#64748b',
                                fontFamily: 'monospace',
                            }}>{label}</button>
                        ))}
                    </div>
                )}

                {/* Sliders */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[
                        { label: 'α', val: lr, set: setLr, min: 0.005, max: 0.15, step: 0.005, color: '#60a5fa' },
                        { label: 'β₁', val: beta1, set: setBeta1, min: 0.5, max: 0.99, step: 0.01, color: '#34d399' },
                        { label: 'β₂', val: beta2, set: setBeta2, min: 0.9, max: 0.9999, step: 0.0001, color: '#a78bfa' },
                    ].map(({ label, val, set, min, max, step: s, color }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 120 }}>
                            <span style={{ color, fontSize: 10, minWidth: 62, fontFamily: 'monospace', fontWeight: 'bold' }}>
                                {label}={val.toFixed(label === 'β₂' ? 4 : 3)}
                            </span>
                            <input type="range" min={min} max={max} step={s} value={val}
                                onChange={e => set(Number(e.target.value))}
                                style={{ flex: 1, accentColor: color }} />
                        </div>
                    ))}
                </div>

                {/* Controles animación */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => { stepRef.current = 0; setStep(0); setRunning(false); }} style={{
                        padding: '5px 8px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                        border: '1.5px solid #334155', background: 'transparent', color: '#64748b', fontFamily: 'monospace',
                    }}>⟳</button>
                    <button onClick={() => setRunning(r => !r)} style={{
                        flex: 1, padding: '5px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                        border: `1.5px solid ${running ? '#f87171' : '#60a5fa'}`,
                        background: running ? '#f8717122' : '#60a5fa22',
                        color: running ? '#f87171' : '#60a5fa', fontFamily: 'monospace', fontWeight: 'bold',
                    }}>{running ? '⏸ Pausar' : '▶ Animar'}</button>
                    <input type="range" min={0} max={MAX_STEPS} step={1} value={step}
                        onChange={e => { setRunning(false); stepRef.current = Number(e.target.value); setStep(Number(e.target.value)); }}
                        style={{ flex: 2, accentColor: '#f87171' }} />
                    <span style={{ color: '#475569', fontSize: 10, minWidth: 44 }}>{step}/{MAX_STEPS}</span>
                </div>

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Paisaje</b>: Adam (verde) converge directo; AdaGrad (amarillo) frena con el tiempo; activa/desactiva con botones.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Momentos</b>: m̂ suaviza el gradiente (β₁); corrección de sesgo crítica al inicio.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Paso efectivo</b>: Adam mantiene paso ~constante; AdaGrad lo reduce monótonamente.
                </p>
            </div>
        </div>
    );
}