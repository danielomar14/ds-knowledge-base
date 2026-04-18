import React, { useState, useEffect, useRef } from 'react';

export default function GradientDescentViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('landscape');  // landscape | lr | convergence
    const [lr, setLr] = useState(0.08);
    const [batch, setBatch] = useState('mini');       // batch | mini | sgd
    const [momentum, setMomentum] = useState(0.0);
    const [step, setStep] = useState(0);
    const [running, setRunning] = useState(false);
    const [schedule, setSchedule] = useState('constant'); // constant | cosine | step

    const trajRef = useRef([]);
    const animRef = useRef(null);
    const stepRef = useRef(0);

    // Función 2D con múltiples valles
    const f = (x, y) => 0.4 * x * x + 2 * y * y + 0.3 * Math.sin(3 * x) * Math.cos(2 * y);
    const gx = (x, y) => 0.8 * x + 0.9 * Math.cos(3 * x) * Math.cos(2 * y);
    const gy = (x, y) => 4 * y - 0.6 * Math.sin(3 * x) * Math.sin(2 * y);

    // LCG para ruido reproducible
    const lcg = (s) => { s = (s * 1664525 + 1013904223) & 0xffffffff; return ((s >>> 0) / 0xffffffff - 0.5) * 2; };

    const getLr = (t, totalSteps) => {
        const base = lr;
        if (schedule === 'constant') return base;
        if (schedule === 'cosine') return 1e-3 + 0.5 * (base - 1e-3) * (1 + Math.cos(Math.PI * t / totalSteps));
        if (schedule === 'step') return base * Math.pow(0.5, Math.floor(t / 15));
        return base;
    };

    const computeTraj = () => {
        const maxSteps = 60;
        let x = -2.2, y = 1.8, vx = 0, vy = 0;
        const pts = [{ x, y, loss: f(x, y) }];
        let seed = 7;
        for (let t = 0; t < maxSteps; t++) {
            const alpha = getLr(t, maxSteps);
            let dgx = gx(x, y), dgy = gy(x, y);
            // Ruido según variante
            if (batch === 'sgd') {
                seed = (seed * 1664525 + 1013904223) & 0xffffffff;
                const n1 = ((seed >>> 0) / 0xffffffff - 0.5) * 2;
                seed = (seed * 1664525 + 1013904223) & 0xffffffff;
                const n2 = ((seed >>> 0) / 0xffffffff - 0.5) * 2;
                dgx += n1 * 0.8; dgy += n2 * 0.8;
            } else if (batch === 'mini') {
                seed = (seed * 1664525 + 1013904223) & 0xffffffff;
                const n1 = ((seed >>> 0) / 0xffffffff - 0.5) * 2;
                seed = (seed * 1664525 + 1013904223) & 0xffffffff;
                const n2 = ((seed >>> 0) / 0xffffffff - 0.5) * 2;
                dgx += n1 * 0.25; dgy += n2 * 0.25;
            }
            // Momentum
            vx = momentum * vx + dgx;
            vy = momentum * vy + dgy;
            x = Math.max(-3.5, Math.min(3.5, x - alpha * vx));
            y = Math.max(-2.5, Math.min(2.5, y - alpha * vy));
            pts.push({ x, y, loss: f(x, y) });
        }
        return pts;
    };

    useEffect(() => {
        const t = computeTraj();
        trajRef.current = t;
        stepRef.current = 0; setStep(0); setRunning(false);
        if (animRef.current) cancelAnimationFrame(animRef.current);
    }, [lr, batch, momentum, schedule]);

    useEffect(() => {
        if (!running) return;
        const maxS = trajRef.current.length - 1;
        const tick = () => {
            stepRef.current = Math.min(stepRef.current + 1, maxS);
            setStep(stepRef.current);
            if (stepRef.current < maxS) animRef.current = requestAnimationFrame(tick);
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

        const traj = trajRef.current;
        const curStep = Math.min(step, traj.length - 1);

        // ── MODO: Paisaje de pérdida + trayectoria ───────────────────────────
        if (mode === 'landscape') {
            const xMin = -3.5, xMax = 3.5, yMin = -2.5, yMax = 2.5;
            const tw = x => 22 + (x - xMin) / (xMax - xMin) * (W - 38);
            const ty = y => H - 22 - (y - yMin) / (yMax - yMin) * (H - 44);

            // Curvas de nivel
            const res = 90;
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
                const r = Math.round(11 + t2 * (167 - 11));
                const g2 = Math.round(18 + t2 * (139 - 18));
                const b = Math.round(250 + t2 * (113 - 250));
                ctx.strokeStyle = `rgba(${r},${g2},${b},0.45)`; ctx.lineWidth = 1.1;
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

            // Trayectoria hasta paso actual
            if (traj.length > 1 && curStep > 0) {
                // Línea de trayectoria
                ctx.strokeStyle = 'rgba(248,113,113,0.8)'; ctx.lineWidth = 2;
                ctx.beginPath();
                traj.slice(0, curStep + 1).forEach(({ x, y }, i) => {
                    i === 0 ? ctx.moveTo(tw(x), ty(y)) : ctx.lineTo(tw(x), ty(y));
                });
                ctx.stroke();

                // Puntos intermedios
                traj.slice(0, curStep + 1).forEach(({ x, y }, i) => {
                    if (i === 0 || i === curStep) {
                        ctx.beginPath(); ctx.arc(tw(x), ty(y), i === 0 ? 6 : 5, 0, 2 * Math.PI);
                        ctx.fillStyle = i === 0 ? '#e2e8f0' : '#f87171'; ctx.fill();
                    } else if (i % 5 === 0) {
                        ctx.beginPath(); ctx.arc(tw(x), ty(y), 2.5, 0, 2 * Math.PI);
                        ctx.fillStyle = 'rgba(248,113,113,0.6)'; ctx.fill();
                    }
                });

                // Flecha gradiente en posición actual
                if (curStep < traj.length - 1) {
                    const { x, y } = traj[curStep];
                    const dgx2 = gx(x, y), dgy2 = gy(x, y);
                    const gmag = Math.sqrt(dgx2 * dgx2 + dgy2 * dgy2) + 1e-9;
                    const sc = 28;
                    const ex = tw(x) - dgx2 / gmag * sc, ey = ty(y) + dgy2 / gmag * sc;
                    ctx.strokeStyle = '#fbbf24'; ctx.fillStyle = '#fbbf24'; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.moveTo(tw(x), ty(y)); ctx.lineTo(ex, ey); ctx.stroke();
                    const dx = ex - tw(x), dy = ey - ty(y), len = Math.sqrt(dx * dx + dy * dy);
                    const ux = dx / len, uy = dy / len, hw = 6, hl = 10;
                    ctx.beginPath();
                    ctx.moveTo(ex, ey);
                    ctx.lineTo(ex - hl * ux + hw * uy, ey - hl * uy - hw * ux);
                    ctx.lineTo(ex - hl * ux - hw * uy, ey - hl * uy + hw * ux);
                    ctx.closePath(); ctx.fill();
                    txt('−∇f', ex + 4, ey - 4, '#fbbf24', 9, true);
                }
            }

            // Labels
            const batchLabel = { batch: 'Batch GD', mini: 'Mini-batch GD', sgd: 'SGD' }[batch];
            const curLoss = traj[curStep]?.loss ?? 0;
            txt(`${batchLabel}  α=${lr.toFixed(3)}  β=${momentum.toFixed(1)}`, 14, 18, '#60a5fa', 10, true);
            txt(`Paso ${curStep}/${traj.length - 1}  f=${curLoss.toFixed(4)}`, 14, H - 10, '#475569', 10);

            // Mínimo aproximado (0,0)
            ctx.beginPath(); ctx.arc(tw(0), ty(0), 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#34d399'; ctx.fill();
            txt('mín', tw(0) + 6, ty(0) - 6, '#34d399', 9);
        }

        // ── MODO: Efecto de α ────────────────────────────────────────────────
        if (mode === 'lr') {
            txt('Efecto de la tasa de aprendizaje α — función 1D', 14, 18, '#60a5fa', 12, true);

            // f1d(x) = x^4/4 - x^2 + 0.1x
            const f1 = x => x * x * x * x / 4 - x * x + 0.1 * x;
            const df1 = x => x * x * x - 2 * x + 0.1;

            const xMin1 = -2.2, xMax1 = 2.2, yMin1 = -0.6, yMax1 = 2.5;
            const tw1 = x => 28 + (x - xMin1) / (xMax1 - xMin1) * (W - 44);
            const ty1 = y => H - 28 - (y - yMin1) / (yMax1 - yMin1) * (H - 52);

            // Curva
            ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
            ctx.beginPath(); let first = true;
            for (let px = 28; px <= W - 16; px++) {
                const x = xMin1 + (px - 28) / (W - 44) * (xMax1 - xMin1);
                const y = f1(x);
                if (!isFinite(y) || y < yMin1 - 0.5 || y > yMax1 + 0.5) { first = true; continue; }
                first ? ctx.moveTo(px, ty1(y)) : ctx.lineTo(px, ty1(y));
                first = false;
            }
            ctx.stroke();

            // Eje x
            ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(28, ty1(0)); ctx.lineTo(W - 16, ty1(0)); ctx.stroke();

            // Trayectorias GD con distintos lr
            const lrCases = [
                { lr: 0.05, color: '#34d399', label: 'α=0.05 lento' },
                { lr: 0.25, color: '#60a5fa', label: 'α=0.25 óptimo' },
                { lr: 0.55, color: '#fbbf24', label: 'α=0.55 oscila' },
                { lr: 0.85, color: '#f87171', label: 'α=0.85 diverge' },
            ];

            lrCases.forEach(({ lr: a, color, label }) => {
                let x0 = 1.8;
                const xs = [x0];
                for (let k = 0; k < curStep && k < 25; k++) {
                    x0 = x0 - a * df1(x0);
                    x0 = Math.max(-3, Math.min(3, x0));
                    xs.push(x0);
                }
                ctx.strokeStyle = color; ctx.lineWidth = 1.8;
                ctx.beginPath();
                xs.forEach((x, i) => {
                    const y = f1(x);
                    if (!isFinite(y) || y < yMin1 - 1 || y > yMax1 + 1) return;
                    i === 0 ? ctx.moveTo(tw1(x), ty1(y)) : ctx.lineTo(tw1(x), ty1(y));
                });
                ctx.stroke();
                // Punto actual
                const xCur = xs[xs.length - 1];
                const yCur = f1(xCur);
                if (isFinite(yCur) && yCur > yMin1 - 0.5 && yCur < yMax1 + 0.5) {
                    ctx.beginPath(); ctx.arc(tw1(xCur), ty1(yCur), 5, 0, 2 * Math.PI);
                    ctx.fillStyle = color; ctx.fill();
                }
            });

            // Leyenda
            lrCases.forEach(({ color, label }, i) => {
                ctx.strokeStyle = color; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(W - 195, 46 + i * 18); ctx.lineTo(W - 167, 46 + i * 18); ctx.stroke();
                txt(label, W - 161, 50 + i * 18, color, 10);
            });

            // Condición L-Lipschitz
            txt('f\'\'(x) = 3x²−2, L=max|f\'\'|≈ condición α<2/L', 14, H - 26, '#475569', 10);
            txt(`Paso actual: ${curStep}/25`, 14, H - 10, '#475569', 10);
        }

        // ── MODO: Convergencia de pérdida ────────────────────────────────────
        if (mode === 'convergence') {
            txt('Curvas de convergencia — pérdida vs paso', 14, 18, '#60a5fa', 12, true);

            // Simular curvas para distintas configuraciones
            const configs = [
                { lr: 0.12, batch: 'batch', mom: 0.0, color: '#60a5fa', label: 'Batch GD α=0.12' },
                { lr: 0.10, batch: 'mini', mom: 0.0, color: '#34d399', label: 'Mini-batch α=0.10' },
                { lr: 0.05, batch: 'sgd', mom: 0.0, color: '#fbbf24', label: 'SGD α=0.05' },
                { lr: 0.10, batch: 'mini', mom: 0.9, color: '#a78bfa', label: 'Mini-batch+mom β=0.9' },
            ];

            // Calcular trayectorias
            const allTrajs = configs.map(({ lr: a, batch: b, mom: m }) => {
                let x = -2.2, y = 1.8, vx = 0, vy = 0; let s = 7;
                const losses = [f(x, y)];
                for (let t = 0; t < 60; t++) {
                    let dgx2 = gx(x, y), dgy2 = gy(x, y);
                    if (b === 'sgd') { s = (s * 1664525 + 1013904223) & 0xffffffff; dgx2 += ((s >>> 0) / 0xffffffff - 0.5) * 2 * 0.8; s = (s * 1664525 + 1013904223) & 0xffffffff; dgy2 += ((s >>> 0) / 0xffffffff - 0.5) * 2 * 0.8; }
                    else if (b === 'mini') { s = (s * 1664525 + 1013904223) & 0xffffffff; dgx2 += ((s >>> 0) / 0xffffffff - 0.5) * 2 * 0.25; s = (s * 1664525 + 1013904223) & 0xffffffff; dgy2 += ((s >>> 0) / 0xffffffff - 0.5) * 2 * 0.25; }
                    vx = m * vx + dgx2; vy = m * vy + dgy2;
                    x = Math.max(-3.5, Math.min(3.5, x - a * vx));
                    y = Math.max(-2.5, Math.min(2.5, y - a * vy));
                    losses.push(f(x, y));
                }
                return losses;
            });

            const allLosses = allTrajs.flat().filter(isFinite);
            const lossMin = Math.max(0, Math.min(...allLosses) - 0.05);
            const lossMax = Math.min(Math.max(...allLosses) + 0.1, 8);

            const tw2 = t => 44 + (t) / (60) * (W - 60);
            const ty2 = v => H - 32 - (v - lossMin) / (lossMax - lossMin) * (H - 56);

            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
            [0, 15, 30, 45, 60].forEach(t => {
                ctx.beginPath(); ctx.moveTo(tw2(t), 32); ctx.lineTo(tw2(t), H - 32); ctx.stroke();
                txt(`${t}`, tw2(t) - 8, H - 16, '#475569', 9);
            });
            [0, 1, 2, 3, 4].forEach(v => {
                if (v < lossMin || v > lossMax) return;
                ctx.beginPath(); ctx.moveTo(44, ty2(v)); ctx.lineTo(W - 16, ty2(v)); ctx.stroke();
                txt(`${v}`, 8, ty2(v) + 4, '#475569', 9);
            });

            // Ejes
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.moveTo(44, 32); ctx.lineTo(44, H - 32); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(44, H - 32); ctx.lineTo(W - 16, H - 32); ctx.stroke();
            txt('paso', W - 30, H - 16, '#475569', 9);
            txt('f(θ)', 14, 32, '#475569', 9);

            // Curvas
            allTrajs.forEach((losses, ci) => {
                const { color } = configs[ci];
                ctx.strokeStyle = color; ctx.lineWidth = 2;
                ctx.beginPath();
                losses.slice(0, curStep + 1).forEach((v, t) => {
                    if (!isFinite(v) || v < lossMin - 0.5 || v > lossMax + 0.5) return;
                    t === 0 ? ctx.moveTo(tw2(t), ty2(v)) : ctx.lineTo(tw2(t), ty2(v));
                });
                ctx.stroke();
                // Punto actual
                const vCur = losses[Math.min(curStep, losses.length - 1)];
                if (isFinite(vCur) && vCur >= lossMin && vCur <= lossMax) {
                    ctx.beginPath(); ctx.arc(tw2(Math.min(curStep, 60)), ty2(vCur), 4, 0, 2 * Math.PI);
                    ctx.fillStyle = color; ctx.fill();
                }
            });

            // Leyenda
            configs.forEach(({ color, label }, i) => {
                ctx.strokeStyle = color; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(W - 200, 36 + i * 18); ctx.lineTo(W - 172, 36 + i * 18); ctx.stroke();
                txt(label, W - 166, 40 + i * 18, color, 9);
            });
            txt(`Paso ${curStep}/60`, 14, H - 12, '#475569', 10);
        }

    }, [mode, step, lr, batch, momentum, schedule]);

    const MODES = [
        { key: 'landscape', label: 'Paisaje 2D' },
        { key: 'lr', label: 'Efecto de α' },
        { key: 'convergence', label: 'Convergencia' },
    ];

    const BATCHES = [
        { key: 'batch', label: 'Batch', color: '#60a5fa' },
        { key: 'mini', label: 'Mini-batch', color: '#34d399' },
        { key: 'sgd', label: 'SGD', color: '#fbbf24' },
    ];

    const SCHEDULES = [
        { key: 'constant', label: 'constante' },
        { key: 'cosine', label: 'cosine' },
        { key: 'step', label: 'step decay' },
    ];

    const maxSteps = mode === 'lr' ? 25 : 60;

    return (
        <div className="viz-box" style={{ background: '#0b1220', borderRadius: 10, padding: 12 }}>
            <canvas ref={canvasRef} width={530} height={370}
                style={{ borderRadius: 8, display: 'block', margin: '0 auto' }} />
            <div className="viz-ctrl" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 9 }}>

                {/* Selector modo */}
                <div style={{ display: 'flex', gap: 6 }}>
                    {MODES.map(({ key, label }) => (
                        <button key={key} onClick={() => { setMode(key); setRunning(false); stepRef.current = 0; setStep(0); }} style={{
                            flex: 1, padding: '5px 4px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                            border: `1.5px solid ${mode === key ? '#60a5fa' : '#334155'}`,
                            background: mode === key ? '#60a5fa22' : 'transparent',
                            color: mode === key ? '#60a5fa' : '#64748b',
                            fontFamily: 'monospace', transition: 'all 0.15s',
                        }}>{label}</button>
                    ))}
                </div>

                {/* Controles landscape y convergence */}
                {(mode === 'landscape' || mode === 'convergence') && (
                    <>
                        {/* Variante */}
                        <div style={{ display: 'flex', gap: 6 }}>
                            {BATCHES.map(({ key, label, color }) => (
                                <button key={key} onClick={() => setBatch(key)} style={{
                                    flex: 1, padding: '4px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                                    border: `1.5px solid ${batch === key ? color : '#334155'}`,
                                    background: batch === key ? color + '22' : 'transparent',
                                    color: batch === key ? color : '#64748b',
                                    fontFamily: 'monospace',
                                }}>{label}</button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                <span style={{ color: '#60a5fa', fontSize: 11, minWidth: 80, fontFamily: 'monospace' }}>
                                    α={lr.toFixed(3)}
                                </span>
                                <input type="range" min={0.01} max={0.3} step={0.005} value={lr}
                                    onChange={e => setLr(Number(e.target.value))}
                                    style={{ flex: 1, accentColor: '#60a5fa' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                <span style={{ color: '#a78bfa', fontSize: 11, minWidth: 80, fontFamily: 'monospace' }}>
                                    β={momentum.toFixed(2)}
                                </span>
                                <input type="range" min={0} max={0.99} step={0.01} value={momentum}
                                    onChange={e => setMomentum(Number(e.target.value))}
                                    style={{ flex: 1, accentColor: '#a78bfa' }} />
                            </div>
                        </div>
                        {/* Schedule */}
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                            <span style={{ color: '#475569', fontSize: 10, minWidth: 60 }}>schedule:</span>
                            {SCHEDULES.map(({ key, label }) => (
                                <button key={key} onClick={() => setSchedule(key)} style={{
                                    flex: 1, padding: '3px', fontSize: 9, cursor: 'pointer', borderRadius: 6,
                                    border: `1.5px solid ${schedule === key ? '#34d399' : '#334155'}`,
                                    background: schedule === key ? '#34d39922' : 'transparent',
                                    color: schedule === key ? '#34d399' : '#64748b',
                                    fontFamily: 'monospace',
                                }}>{label}</button>
                            ))}
                        </div>
                    </>
                )}

                {/* Controles animación */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => { stepRef.current = 0; setStep(0); setRunning(false); }} style={{
                        padding: '5px 10px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                        border: '1.5px solid #334155', background: 'transparent', color: '#64748b', fontFamily: 'monospace',
                    }}>⟳</button>
                    <button onClick={() => setRunning(r => !r)} style={{
                        flex: 1, padding: '5px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                        border: `1.5px solid ${running ? '#f87171' : '#60a5fa'}`,
                        background: running ? '#f8717122' : '#60a5fa22',
                        color: running ? '#f87171' : '#60a5fa',
                        fontFamily: 'monospace', fontWeight: 'bold',
                    }}>{running ? '⏸ Pausar' : '▶ Animar'}</button>
                    <input type="range" min={0} max={maxSteps} step={1} value={step}
                        onChange={e => { setRunning(false); stepRef.current = Number(e.target.value); setStep(Number(e.target.value)); }}
                        style={{ flex: 2, accentColor: '#f87171' }} />
                    <span style={{ color: '#475569', fontSize: 10, minWidth: 40 }}>{step}/{maxSteps}</span>
                </div>

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Paisaje 2D</b>: trayectoria sobre curvas de nivel; flecha amarilla = −∇f; ruido visible en SGD.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Efecto α</b>: α pequeño converge lento; α óptimo converge rápido; α grande oscila o diverge.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Convergencia</b>: Batch suave, SGD ruidoso, momentum acelera. Ajusta α y β.
                </p>
            </div>
        </div>
    );
}