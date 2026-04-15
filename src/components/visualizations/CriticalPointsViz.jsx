import React, { useState, useEffect, useRef } from 'react';

export default function CriticalPointsViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('landscape');  // landscape | classify | escape
    const [fnKey, setFnKey] = useState('saddle');
    const [noise, setNoise] = useState(0.12);
    const [step, setStep] = useState(0);
    const [running, setRunning] = useState(false);
    const trajRef = useRef({ gd: [], sgd: [] });
    const animRef = useRef(null);
    const stepRef = useRef(0);

    const MODES = [
        { key: 'landscape', label: 'Paisaje de pérdida' },
        { key: 'classify', label: 'Clasificar punto' },
        { key: 'escape', label: 'GD vs SGD en silla' },
    ];

    const FUNS = {
        saddle: {
            label: 'x²−y² (silla)',
            f: (x, y) => x * x - y * y,
            grad: (x, y) => [2 * x, -2 * y],
            criticals: [{ x: 0, y: 0, type: 'saddle', color: '#a78bfa' }],
        },
        double: {
            label: 'x⁴/4−x²/2+y² (doble pozo)',
            f: (x, y) => x * x * x * x / 4 - x * x / 2 + y * y,
            grad: (x, y) => [x * x * x - x, 2 * y],
            criticals: [
                { x: -1, y: 0, type: 'min', color: '#34d399' },
                { x: 0, y: 0, type: 'saddle', color: '#a78bfa' },
                { x: 1, y: 0, type: 'min', color: '#34d399' },
            ],
        },
        monkey: {
            label: 'x³−3xy² (silla mono)',
            f: (x, y) => x * x * x - 3 * x * y * y,
            grad: (x, y) => [3 * x * x - 3 * y * y, -6 * x * y],
            criticals: [{ x: 0, y: 0, type: 'saddle', color: '#a78bfa' }],
        },
    };

    // Pre-calcular trayectorias cuando cambian parámetros relevantes
    const computeTrajs = (fnKey, noise) => {
        const fn = FUNS[fnKey];
        const maxSteps = 120;
        const lr = 0.04;
        const seed = 7;

        // LCG para reproducibilidad visual
        let s = seed;
        const rand = () => {
            s = (s * 1664525 + 1013904223) & 0xffffffff;
            return ((s >>> 0) / 0xffffffff - 0.5) * 2;
        };

        const x0 = fnKey === 'double' ? [0.05, 1.8] : [0.05, 0.05];
        let xGD = [...x0], xSGD = [...x0];
        const gd = [[...xGD]];
        const sgd = [[...xSGD]];

        for (let k = 0; k < maxSteps; k++) {
            const [gx, gy] = fn.grad(xGD[0], xGD[1]);
            xGD = [xGD[0] - lr * gx, xGD[1] - lr * gy];
            gd.push([...xGD]);

            const [sx, sy] = fn.grad(xSGD[0], xSGD[1]);
            xSGD = [
                xSGD[0] - lr * (sx + noise * rand()),
                xSGD[1] - lr * (sy + noise * rand()),
            ];
            sgd.push([...xSGD]);
        }
        return { gd, sgd };
    };

    useEffect(() => {
        const trajs = computeTrajs(fnKey, noise);
        trajRef.current = trajs;
        stepRef.current = 0;
        setStep(0);
        setRunning(false);
        if (animRef.current) cancelAnimationFrame(animRef.current);
    }, [fnKey, noise]);

    useEffect(() => {
        if (!running) return;
        const maxSteps = trajRef.current.gd.length - 1;
        const tick = () => {
            stepRef.current = Math.min(stepRef.current + 1, maxSteps);
            setStep(stepRef.current);
            if (stepRef.current < maxSteps) {
                animRef.current = requestAnimationFrame(tick);
            } else {
                setRunning(false);
            }
        };
        animRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(animRef.current);
    }, [running]);

    // Hessiana numérica 2x2
    const hessNum = (f, x, y, h = 1e-4) => {
        const fpp = f(x + h, y + h), fpm = f(x + h, y - h);
        const fmp = f(x - h, y + h), fmm = f(x - h, y - h);
        const f0 = f(x, y), fp0 = f(x + h, y), fm0 = f(x - h, y);
        const f0p = f(x, y + h), f0m = f(x, y - h);
        return [
            [(fp0 - 2 * f0 + fm0) / (h * h), (fpp - fpm - fmp + fmm) / (4 * h * h)],
            [(fpp - fpm - fmp + fmm) / (4 * h * h), (f0p - 2 * f0 + f0m) / (h * h)],
        ];
    };

    const eigenvals2x2 = (H) => {
        const tr = H[0][0] + H[1][1], det = H[0][0] * H[1][1] - H[0][1] * H[1][0];
        const disc = Math.sqrt(Math.max(0, (tr / 2) ** 2 - det));
        return [tr / 2 + disc, tr / 2 - disc];
    };

    const classifyPoint = (eigs) => {
        const [l1, l2] = eigs;
        if (l1 > 1e-6 && l2 > 1e-6) return { label: 'Mínimo local', color: '#34d399', sym: '▼' };
        if (l1 < -1e-6 && l2 < -1e-6) return { label: 'Máximo local', color: '#f87171', sym: '▲' };
        if (Math.abs(l1) < 1e-5 || Math.abs(l2) < 1e-5) return { label: 'Inconcluso', color: '#fbbf24', sym: '◆' };
        return { label: 'Punto de silla', color: '#a78bfa', sym: '✕' };
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

        const fn = FUNS[fnKey];

        const xMin = -2.5, xMax = 2.5, yMin = -2.5, yMax = 2.5;
        const tw = x => 24 + (x - xMin) / (xMax - xMin) * (W - 40);
        const ty = y => H - 24 - (y - yMin) / (yMax - yMin) * (H - 48);

        // Función auxiliar: curvas de nivel
        const drawContours = (fFn, nLv = 12, alpha = 0.35) => {
            const res = 80;
            let zMn = Infinity, zMx = -Infinity;
            const zG = [];
            for (let i = 0; i < res; i++) {
                zG[i] = [];
                for (let j = 0; j < res; j++) {
                    const x = xMin + i / (res - 1) * (xMax - xMin);
                    const y = yMin + j / (res - 1) * (yMax - yMin);
                    const z = fFn(x, y); zG[i][j] = z;
                    if (isFinite(z) && z < zMn) zMn = z;
                    if (isFinite(z) && z > zMx) zMx = z;
                }
            }
            zMn = Math.max(zMn, -8); zMx = Math.min(zMx, 8);
            const levels = Array.from({ length: nLv }, (_, k) => zMn + (k + 0.5) * (zMx - zMn) / nLv);
            levels.forEach((level, k) => {
                const t = k / nLv;
                const r = Math.round(11 + t * (248 - 11));
                const g = Math.round(18 + t * (113 - 18));
                const b = Math.round(250 + t * (113 - 250));
                ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
                ctx.lineWidth = 1.2;
                for (let i = 0; i < res - 1; i++) {
                    for (let j = 0; j < res - 1; j++) {
                        const x = xMin + i / (res - 1) * (xMax - xMin);
                        const y = yMin + j / (res - 1) * (yMax - yMin);
                        const ddx = (xMax - xMin) / (res - 1), ddy = (yMax - yMin) / (res - 1);
                        const z00 = zG[i][j], z10 = zG[i + 1][j], z01 = zG[i][j + 1], z11 = zG[i + 1][j + 1];
                        if (![z00, z10, z01, z11].every(isFinite)) return;
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
        };

        // Ejes comunes
        const drawAxes = () => {
            ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
            ctx.beginPath(); ctx.moveTo(tw(0), 24); ctx.lineTo(tw(0), H - 24); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(24, ty(0)); ctx.lineTo(W - 16, ty(0)); ctx.stroke();
            ctx.setLineDash([]);
            txt('x', W - 14, ty(0) + 4, '#475569', 9);
            txt('y', tw(0) - 14, 28, '#475569', 9);
        };

        // Dibujar punto crítico con símbolo
        const drawCritical = (xc, yc, tipo, color, r = 7) => {
            ctx.beginPath(); ctx.arc(tw(xc), ty(yc), r, 0, 2 * Math.PI);
            ctx.fillStyle = color + '33'; ctx.fill();
            ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
        };

        // ── MODO: Paisaje de pérdida ─────────────────────────────────────────
        if (mode === 'landscape') {
            drawContours(fn.f);
            drawAxes();

            // Campo de gradiente
            const step2 = 0.6;
            for (let xi = -2.2; xi <= 2.2; xi += step2) {
                for (let yi = -2.2; yi <= 2.2; yi += step2) {
                    const [gx, gy] = fn.grad(xi, yi);
                    const mag = Math.sqrt(gx * gx + gy * gy) + 1e-9;
                    const sc = 16 / (mag + 2);
                    const ex = tw(xi) + gx * sc, ey = ty(yi) - gy * sc;
                    ctx.strokeStyle = 'rgba(251,191,36,0.35)'; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(tw(xi), ty(yi)); ctx.lineTo(ex, ey); ctx.stroke();
                }
            }

            // Puntos críticos
            fn.criticals.forEach(({ x: xc, y: yc, type, color }) => {
                drawCritical(xc, yc, type, color, 8);
                const lbl = type === 'min' ? 'mín' : type === 'max' ? 'máx' : 'silla';
                txt(lbl, tw(xc) + 10, ty(yc) - 8, color, 10, true);
            });

            // Hessiana en punto crítico (primero)
            const { x: xc, y: yc } = fn.criticals[0];
            const H2 = hessNum(fn.f, xc, yc);
            const eigs = eigenvals2x2(H2);
            const cls = classifyPoint(eigs);
            txt(`f(x,y) = ${fn.label}`, 16, 18, '#60a5fa', 11, true);
            txt(`En (${xc},${yc}): λ=[${eigs.map(v => v.toFixed(2)).join(', ')}]`,
                16, H - 28, cls.color, 10, true);
            txt(cls.label, 16, H - 13, cls.color, 11, true);

            // Eigenvectores en punto de silla
            if (cls.label.includes('silla')) {
                const tr = H2[0][0] + H2[1][1];
                const det2 = H2[0][0] * H2[1][1] - H2[0][1] * H2[1][0];
                const disc = Math.sqrt(Math.max(0, (tr / 2) ** 2 - det2));
                const l2 = tr / 2 - disc;
                const vEsc = H2[0][1] !== 0
                    ? [l2 - H2[1][1], H2[1][0]]
                    : [0, 1];
                const vN = Math.sqrt(vEsc[0] ** 2 + vEsc[1] ** 2) + 1e-9;
                const [ux, uy] = [vEsc[0] / vN, vEsc[1] / vN];
                const sc2 = 60;
                // Dirección de escape
                ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(tw(xc) - ux * sc2, ty(yc) + uy * sc2);
                ctx.lineTo(tw(xc) + ux * sc2, ty(yc) - uy * sc2);
                ctx.stroke();
                txt('← dir. escape', tw(xc) + ux * sc2 + 4, ty(yc) - uy * sc2 - 4, '#f87171', 9);
            }
        }

        // ── MODO: Clasificar punto ───────────────────────────────────────────
        if (mode === 'classify') {
            txt('Clasificación de puntos críticos por tipo', W / 2 - 130, 20, '#60a5fa', 12, true);

            // Cuatro funciones canónicas
            const ejemplos = [
                { f: (x, y) => x * x + y * y, label: 'x²+y²', tipo: 'Mínimo', color: '#34d399', cx: -1.3, cy: 1.3 },
                { f: (x, y) => -(x * x + y * y), label: '−x²−y²', tipo: 'Máximo', color: '#f87171', cx: 1.3, cy: 1.3 },
                { f: (x, y) => x * x - y * y, label: 'x²−y²', tipo: 'Silla', color: '#a78bfa', cx: -1.3, cy: -1.0 },
                { f: (x, y) => x * x, label: 'x²', tipo: 'Inconcl.', color: '#fbbf24', cx: 1.3, cy: -1.0 },
            ];

            // Margen para cuatro sub-paneles (2x2)
            const pw = (W - 30) / 2 - 8, ph = (H - 50) / 2 - 8;
            const panels = [[16, 30], [16 + pw + 8, 30], [16, 30 + ph + 8], [16 + pw + 8, 30 + ph + 8]];

            ejemplos.forEach(({ f: fej, label, tipo, color }, idx) => {
                const [ox, oy] = panels[idx];
                // Contorno en sub-panel
                const res2 = 50;
                const lMin = -1.8, lMax = 1.8;
                const twL = x => ox + (x - lMin) / (lMax - lMin) * pw;
                const tyL = y => oy + ph - (y - lMin) / (lMax - lMin) * ph;

                let zMn2 = Infinity, zMx2 = -Infinity;
                const zG2 = [];
                for (let i = 0; i < res2; i++) {
                    zG2[i] = [];
                    for (let j = 0; j < res2; j++) {
                        const x = lMin + i / (res2 - 1) * (lMax - lMin);
                        const y = lMin + j / (res2 - 1) * (lMax - lMin);
                        const z = fej(x, y); zG2[i][j] = z;
                        if (z < zMn2) zMn2 = z; if (z > zMx2) zMx2 = z;
                    }
                }
                const nLv2 = 8;
                Array.from({ length: nLv2 }, (_, k) => zMn2 + (k + 0.5) * (zMx2 - zMn2) / nLv2).forEach((level, k) => {
                    const t = k / nLv2;
                    const r = Math.round(11 + t * (248 - 11));
                    const g = Math.round(18 + t * (113 - 18));
                    const b = Math.round(250 + t * (113 - 250));
                    ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`; ctx.lineWidth = 1;
                    for (let i = 0; i < res2 - 1; i++) {
                        for (let j = 0; j < res2 - 1; j++) {
                            const x = lMin + i / (res2 - 1) * (lMax - lMin);
                            const y = lMin + j / (res2 - 1) * (lMax - lMin);
                            const ddx = (lMax - lMin) / (res2 - 1), ddy = (lMax - lMin) / (res2 - 1);
                            const z00 = zG2[i][j], z10 = zG2[i + 1][j], z01 = zG2[i][j + 1], z11 = zG2[i + 1][j + 1];
                            const cross2 = (za, zb) => (za < level) !== (zb < level) ? (level - za) / (zb - za) : null;
                            const pts2 = [];
                            const t01 = cross2(z00, z10); if (t01 != null) pts2.push([twL(x + t01 * ddx), tyL(y)]);
                            const t12 = cross2(z10, z11); if (t12 != null) pts2.push([twL(x + ddx), tyL(y + t12 * ddy)]);
                            const t23 = cross2(z11, z01); if (t23 != null) pts2.push([twL(x + (1 - t23) * ddx), tyL(y + ddy)]);
                            const t30 = cross2(z01, z00); if (t30 != null) pts2.push([twL(x), tyL(y + t30 * ddy)]);
                            if (pts2.length === 2) {
                                ctx.beginPath(); ctx.moveTo(pts2[0][0], pts2[0][1]);
                                ctx.lineTo(pts2[1][0], pts2[1][1]); ctx.stroke();
                            }
                        }
                    }
                });

                // Borde panel
                ctx.strokeStyle = color + '66'; ctx.lineWidth = 1.5;
                ctx.strokeRect(ox, oy, pw, ph);

                // Punto crítico en centro
                ctx.beginPath(); ctx.arc(twL(0), tyL(0), 7, 0, 2 * Math.PI);
                ctx.fillStyle = color + '44'; ctx.fill();
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();

                // Labels
                txt(label, ox + 4, oy + 14, color, 10, true);
                txt(tipo, ox + 4, oy + ph - 6, color, 11, true);

                // Hessiana y eigenvalores
                const H2ej = hessNum(fej, 0, 0);
                const eigsej = eigenvals2x2(H2ej);
                txt(`λ=[${eigsej.map(v => v.toFixed(1)).join(',')}]`,
                    ox + pw - 90, oy + ph - 6, '#475569', 9);
            });
        }

        // ── MODO: Escape ─────────────────────────────────────────────────────
        if (mode === 'escape') {
            drawContours(fn.f, 10, 0.28);
            drawAxes();

            const trajs = trajRef.current;
            const maxS = Math.min(step, trajs.gd.length - 1);

            // Dibujar trayectorias hasta paso actual
            const drawTraj = (path, color, dash = []) => {
                if (!path || path.length < 2) return;
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash);
                ctx.beginPath();
                path.slice(0, maxS + 1).forEach(([x, y], i) => {
                    const px = tw(x), py = ty(y);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                });
                ctx.stroke(); ctx.setLineDash([]);
                // Punto actual
                if (maxS < path.length) {
                    const [cx2, cy2] = path[maxS];
                    ctx.beginPath(); ctx.arc(tw(cx2), ty(cy2), 5, 0, 2 * Math.PI);
                    ctx.fillStyle = color; ctx.fill();
                }
            };

            drawTraj(trajs.gd, '#f87171');
            drawTraj(trajs.sgd, '#34d399', [5, 4]);

            // Puntos de inicio
            if (trajs.gd.length > 0) {
                const [x0i, y0i] = trajs.gd[0];
                ctx.beginPath(); ctx.arc(tw(x0i), ty(y0i), 6, 0, 2 * Math.PI);
                ctx.fillStyle = '#e2e8f0'; ctx.fill();
                txt('inicio', tw(x0i) + 7, ty(y0i) - 6, '#94a3b8', 9);
            }

            // Puntos críticos
            fn.criticals.forEach(({ x: xc, y: yc, type, color }) => {
                drawCritical(xc, yc, type, color, 7);
            });

            // Paso actual
            const gdNow = trajs.gd[maxS] || [0, 0];
            const sgdNow = trajs.sgd[maxS] || [0, 0];
            const fdGD = fn.f(gdNow[0], gdNow[1]);
            const fdSGD = fn.f(sgdNow[0], sgdNow[1]);

            // Leyenda
            ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(16, H - 40); ctx.lineTo(46, H - 40); ctx.stroke();
            txt(`GD puro   f=${fdGD.toFixed(3)}`, 52, H - 36, '#f87171', 10);
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
            ctx.beginPath(); ctx.moveTo(16, H - 24); ctx.lineTo(46, H - 24); ctx.stroke();
            ctx.setLineDash([]);
            txt(`SGD (σ=${noise.toFixed(2)})  f=${fdSGD.toFixed(3)}`, 52, H - 20, '#34d399', 10);

            txt(`Paso ${maxS}/${trajs.gd.length - 1}`, W - 100, 18, '#475569', 10);
        }

    }, [mode, fnKey, noise, step]);

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
                        <button key={key} onClick={() => { setMode(key); setRunning(false); }} style={{
                            flex: 1, padding: '5px 4px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                            border: `1.5px solid ${mode === key ? '#60a5fa' : '#334155'}`,
                            background: mode === key ? '#60a5fa22' : 'transparent',
                            color: mode === key ? '#60a5fa' : '#64748b',
                            fontFamily: 'monospace', transition: 'all 0.15s',
                        }}>{label}</button>
                    ))}
                </div>

                {/* Selector función (landscape y escape) */}
                {(mode === 'landscape' || mode === 'escape') && (
                    <div style={{ display: 'flex', gap: 6 }}>
                        {Object.entries(FUNS).map(([key, { label }]) => (
                            <button key={key} onClick={() => setFnKey(key)} style={{
                                flex: 1, padding: '4px 3px', fontSize: 9, cursor: 'pointer', borderRadius: 6,
                                border: `1.5px solid ${fnKey === key ? '#a78bfa' : '#334155'}`,
                                background: fnKey === key ? '#a78bfa22' : 'transparent',
                                color: fnKey === key ? '#a78bfa' : '#64748b',
                                fontFamily: 'monospace',
                            }}>{label}</button>
                        ))}
                    </div>
                )}

                {/* Controles escape */}
                {mode === 'escape' && (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ color: '#34d399', fontSize: 11, minWidth: 120, fontFamily: 'monospace' }}>
                                Ruido SGD σ={noise.toFixed(2)}
                            </span>
                            <input type="range" min={0} max={0.5} step={0.01} value={noise}
                                onChange={e => setNoise(Number(e.target.value))}
                                style={{ flex: 1, accentColor: '#34d399' }} />
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => { stepRef.current = 0; setStep(0); setRunning(false); }} style={{
                                flex: 1, padding: '5px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                                border: '1.5px solid #334155', background: 'transparent', color: '#64748b', fontFamily: 'monospace',
                            }}>⟳ Reset</button>
                            <button onClick={() => setRunning(r => !r)} style={{
                                flex: 2, padding: '5px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                                border: `1.5px solid ${running ? '#f87171' : '#60a5fa'}`,
                                background: running ? '#f8717122' : '#60a5fa22',
                                color: running ? '#f87171' : '#60a5fa', fontFamily: 'monospace', fontWeight: 'bold',
                            }}>{running ? '⏸ Pausar' : '▶ Animar'}</button>
                            <input type="range" min={0} max={(trajRef.current.gd?.length || 1) - 1}
                                step={1} value={step}
                                onChange={e => { setRunning(false); stepRef.current = Number(e.target.value); setStep(Number(e.target.value)); }}
                                style={{ flex: 2, accentColor: '#f87171' }} />
                        </div>
                    </>
                )}

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Paisaje</b>: curvas de nivel + campo ∇f; línea roja = dirección de escape del punto de silla.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Clasificar</b>: cuatro tipos canónicos con sus eigenvalores.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Escape</b>: GD puro (rojo) queda atascado; SGD (verde) escapa gracias al ruido. Ajusta σ.
                </p>
            </div>
        </div>
    );
}