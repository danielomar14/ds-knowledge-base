import React, { useState, useEffect, useRef } from 'react';

export default function MomentumNAGViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('landscape');  // landscape | velocity | convergence
    const [beta, setBeta] = useState(0.9);
    const [lr, setLr] = useState(0.06);
    const [step, setStep] = useState(0);
    const [running, setRunning] = useState(false);
    const [showNAG, setShowNAG] = useState(true);
    const [showGD, setShowGD] = useState(true);

    const trajRef = useRef({ gd: [], mom: [], nag: [] });
    const animRef = useRef(null);
    const stepRef = useRef(0);

    // Función con valle estrecho: alta curvatura en y, baja en x
    // f(x,y) = 0.5*(x²/8 + 4*y²) — κ = 32
    const f = (x, y) => 0.5 * (x * x / 8 + 4 * y * y);
    const gx_ = (x, _) => x / 8;
    const gy_ = (_, y) => 4 * y;

    const MAX_STEPS = 80;

    const computeTrajs = (lr, beta) => {
        const theta0 = [-3.5, 1.5];

        const runGD = () => {
            let [x, y] = theta0; const t = [[x, y]];
            for (let i = 0; i < MAX_STEPS; i++) {
                x = Math.max(-4, Math.min(4, x - lr * gx_(x, y)));
                y = Math.max(-2.5, Math.min(2.5, y - lr * gy_(x, y)));
                t.push([x, y]);
            }
            return t;
        };

        const runMom = () => {
            let [x, y] = theta0, vx = 0, vy = 0; const t = [[x, y]];
            for (let i = 0; i < MAX_STEPS; i++) {
                vx = beta * vx + gx_(x, y);
                vy = beta * vy + gy_(x, y);
                x = Math.max(-4, Math.min(4, x - lr * vx));
                y = Math.max(-2.5, Math.min(2.5, y - lr * vy));
                t.push([x, y]);
            }
            return t;
        };

        const runNAG = () => {
            let [x, y] = theta0, vx = 0, vy = 0; const t = [[x, y]];
            for (let i = 0; i < MAX_STEPS; i++) {
                // Posición anticipada
                const xl = x - lr * beta * vx;
                const yl = y - lr * beta * vy;
                vx = beta * vx + gx_(xl, yl);
                vy = beta * vy + gy_(xl, yl);
                x = Math.max(-4, Math.min(4, x - lr * vx));
                y = Math.max(-2.5, Math.min(2.5, y - lr * vy));
                t.push([x, y]);
            }
            return t;
        };

        return { gd: runGD(), mom: runMom(), nag: runNAG() };
    };

    useEffect(() => {
        const t = computeTrajs(lr, beta);
        trajRef.current = t;
        stepRef.current = 0; setStep(0); setRunning(false);
        if (animRef.current) cancelAnimationFrame(animRef.current);
    }, [lr, beta]);

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

        const { gd, mom, nag } = trajRef.current;
        if (!gd.length) return;
        const curS = Math.min(step, MAX_STEPS);

        // ── MODO: Paisaje 2D ─────────────────────────────────────────────────
        if (mode === 'landscape') {
            const xMin = -4, xMax = 4, yMin = -2.5, yMax = 2.5;
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
            const nLv = 12;
            Array.from({ length: nLv }, (_, k) => zMn + (k + 0.5) * (zMx - zMn) / nLv).forEach((level, k) => {
                const t2 = k / nLv;
                const r = Math.round(11 + t2 * (96 - 11));
                const g2 = Math.round(18 + t2 * (165 - 18));
                const b = Math.round(250 + t2 * (96 - 250));
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

            // Ejes
            ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.setLineDash([3, 4]);
            ctx.beginPath(); ctx.moveTo(tw(0), 22); ctx.lineTo(tw(0), H - 22); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(22, ty(0)); ctx.lineTo(W - 16, ty(0)); ctx.stroke();
            ctx.setLineDash([]);

            // Función auxiliar: dibujar trayectoria
            const drawTraj = (traj, color, dash = []) => {
                if (traj.length < 2 || curS < 1) return;
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash);
                ctx.beginPath();
                traj.slice(0, curS + 1).forEach(([x, y], i) => {
                    i === 0 ? ctx.moveTo(tw(x), ty(y)) : ctx.lineTo(tw(x), ty(y));
                });
                ctx.stroke(); ctx.setLineDash([]);
                // Punto actual
                const [xc, yc] = traj[Math.min(curS, traj.length - 1)];
                ctx.beginPath(); ctx.arc(tw(xc), ty(yc), 5, 0, 2 * Math.PI);
                ctx.fillStyle = color; ctx.fill();
            };

            // Punto de inicio
            ctx.beginPath(); ctx.arc(tw(gd[0][0]), ty(gd[0][1]), 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#e2e8f0'; ctx.fill();
            txt('inicio', tw(gd[0][0]) + 8, ty(gd[0][1]) - 6, '#94a3b8', 9);

            // Dibujar trayectorias según toggle
            if (showGD) drawTraj(gd, '#f87171');
            drawTraj(mom, '#fbbf24');
            if (showNAG) drawTraj(nag, '#34d399');

            // Flecha: posición anticipada NAG en paso actual
            if (showNAG && curS < nag.length - 1) {
                const [xc, yc] = nag[curS];
                // Recalcular v en ese paso para mostrar la anticipación
                let vx = 0, vy = 0;
                for (let i = 0; i <= curS && i < nag.length - 1; i++) {
                    const [xi, yi] = nag[i];
                    const xl = xi - lr * beta * vx, yl = yi - lr * beta * vy;
                    vx = beta * vx + gx_(xl, yl); vy = beta * vy + gy_(xl, yl);
                }
                const xLook = Math.max(-4, Math.min(4, xc - lr * beta * vx));
                const yLook = Math.max(-2.5, Math.min(2.5, yc - lr * beta * vy));
                // Punto anticipado
                ctx.beginPath(); ctx.arc(tw(xLook), ty(yLook), 4, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(52,211,153,0.6)'; ctx.fill();
                ctx.strokeStyle = '#34d399'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
                ctx.beginPath(); ctx.moveTo(tw(xc), ty(yc)); ctx.lineTo(tw(xLook), ty(yLook)); ctx.stroke();
                ctx.setLineDash([]);
                txt('θ̃(anticipado)', tw(xLook) + 5, ty(yLook) - 5, '#34d399', 8);
            }

            // Mínimo
            ctx.beginPath(); ctx.arc(tw(0), ty(0), 6, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fill();
            txt('mín', tw(0) + 7, ty(0) - 5, '#94a3b8', 9);

            // Leyenda
            const items = [
                { show: showGD, color: '#f87171', label: 'GD puro', dash: [] },
                { show: true, color: '#fbbf24', label: `Momentum β=${beta.toFixed(2)}`, dash: [] },
                { show: showNAG, color: '#34d399', label: 'NAG', dash: [5, 4] },
            ];
            let li = 0;
            items.forEach(({ show, color, label, dash }) => {
                if (!show) return;
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash);
                ctx.beginPath(); ctx.moveTo(W - 200, H - 52 + li * 20); ctx.lineTo(W - 172, H - 52 + li * 20); ctx.stroke();
                ctx.setLineDash([]);
                const lossVal = f(...(show === showGD && li === 0 ? gd : li === 1 ? mom : nag)[Math.min(curS, MAX_STEPS)]);
                txt(`${label}  f=${lossVal.toFixed(3)}`, W - 166, H - 48 + li * 20, color, 9);
                li++;
            });

            txt(`f(x,y)=½(x²/8+4y²)  κ=32  paso ${curS}/${MAX_STEPS}`, 14, 18, '#60a5fa', 10, true);
        }

        // ── MODO: Componentes de velocidad ───────────────────────────────────
        if (mode === 'velocity') {
            txt('Evolución de la velocidad vₓ y v_y a lo largo del entrenamiento', 14, 18, '#60a5fa', 11, true);

            // Recalcular velocidades para mom y NAG
            const computeVelocities = (method) => {
                let [x, y] = [-3.5, 1.5], vx = 0, vy = 0;
                const vxs = [0], vys = [0];
                for (let i = 0; i < MAX_STEPS; i++) {
                    if (method === 'mom') {
                        vx = beta * vx + gx_(x, y); vy = beta * vy + gy_(x, y);
                    } else {
                        const xl = x - lr * beta * vx, yl = y - lr * beta * vy;
                        vx = beta * vx + gx_(xl, yl); vy = beta * vy + gy_(xl, yl);
                    }
                    x = Math.max(-4, Math.min(4, x - lr * vx));
                    y = Math.max(-2.5, Math.min(2.5, y - lr * vy));
                    vxs.push(vx); vys.push(vy);
                }
                return { vxs, vys };
            };

            const { vxs: mom_vx, vys: mom_vy } = computeVelocities('mom');
            const { vxs: nag_vx, vys: nag_vy } = computeVelocities('nag');

            // Dos subpaneles: vx (arriba) y vy (abajo)
            const panH = (H - 70) / 2;
            const panels = [
                {
                    label: 'Velocidad vₓ  (dirección fácil, baja curvatura)',
                    mom: mom_vx, nag: nag_vx, oy: 30
                },
                {
                    label: 'Velocidad v_y  (dirección difícil, alta curvatura)',
                    mom: mom_vy, nag: nag_vy, oy: 30 + panH + 12
                },
            ];

            panels.forEach(({ label, mom: mvs, nag: nvs, oy }) => {
                const allV = [...mvs, ...nvs].filter(isFinite);
                const vMax = Math.max(Math.abs(Math.max(...allV)), Math.abs(Math.min(...allV)), 0.1) * 1.1;
                const ox = 44, pw = W - ox - 20, ph = panH - 16;
                const tw2 = t => ox + t / MAX_STEPS * pw;
                const ty2 = v => oy + ph / 2 - v / vMax * (ph / 2);

                // Grid
                ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
                [0, 20, 40, 60, 80].forEach(t2 => {
                    ctx.beginPath(); ctx.moveTo(tw2(t2), oy); ctx.lineTo(tw2(t2), oy + ph); ctx.stroke();
                    txt(`${t2}`, tw2(t2) - 8, oy + ph + 12, '#475569', 8);
                });
                // Eje cero
                ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.moveTo(ox, ty2(0)); ctx.lineTo(ox + pw, ty2(0)); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy + ph); ctx.stroke();

                txt(`+${vMax.toFixed(2)}`, 4, oy + 8, '#475569', 8);
                txt(`0`, 4, ty2(0) + 4, '#475569', 8);
                txt(`-${vMax.toFixed(2)}`, 4, oy + ph - 4, '#475569', 8);

                // Línea vertical paso actual
                ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
                ctx.beginPath(); ctx.moveTo(tw2(curS), oy); ctx.lineTo(tw2(curS), oy + ph); ctx.stroke();
                ctx.setLineDash([]);

                // Curvas mom y nag
                [[mvs, '#fbbf24', 'Momentum'], [nvs, '#34d399', 'NAG']].forEach(([vs, color, lbl]) => {
                    ctx.strokeStyle = color; ctx.lineWidth = 2;
                    ctx.beginPath(); let first = true;
                    vs.slice(0, curS + 1).forEach((v, t2) => {
                        const py = ty2(v);
                        if (!isFinite(py)) { first = true; return; }
                        first ? ctx.moveTo(tw2(t2), py) : ctx.lineTo(tw2(t2), py);
                        first = false;
                    });
                    ctx.stroke();
                    // Punto actual
                    const vCur = vs[Math.min(curS, vs.length - 1)];
                    if (isFinite(vCur)) {
                        ctx.beginPath(); ctx.arc(tw2(curS), ty2(vCur), 4, 0, 2 * Math.PI);
                        ctx.fillStyle = color; ctx.fill();
                        txt(`${vCur.toFixed(3)}`, tw2(curS) + 4, ty2(vCur) - 4, color, 9);
                    }
                });

                txt(label, ox, oy - 4, '#94a3b8', 9, true);
            });

            // Leyenda
            [['#fbbf24', 'Momentum'], ['#34d399', 'NAG']].forEach(([color, lbl], i) => {
                ctx.strokeStyle = color; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(W - 150, H - 28 + i * 16); ctx.lineTo(W - 122, H - 28 + i * 16); ctx.stroke();
                txt(lbl, W - 116, H - 24 + i * 16, color, 9);
            });
        }

        // ── MODO: Convergencia ───────────────────────────────────────────────
        if (mode === 'convergence') {
            txt('Convergencia: f(θₜ)−f* vs paso t', 14, 18, '#60a5fa', 12, true);

            // Calcular pérdida en cada paso para los tres métodos
            const gdL = gd.map(([x, y]) => f(x, y));
            const momL = mom.map(([x, y]) => f(x, y));
            const nagL = nag.map(([x, y]) => f(x, y));

            // Tasas de convergencia teóricas
            const kappa = 32;
            const rho_gd = (kappa - 1) / (kappa + 1);
            const rho_nag = (Math.sqrt(kappa) - 1) / (Math.sqrt(kappa) + 1);
            const L0 = gdL[0];
            const theoGD = Array.from({ length: MAX_STEPS + 1 }, (_, t) => L0 * Math.pow(rho_gd, t));
            const theoNAG = Array.from({ length: MAX_STEPS + 1 }, (_, t) => L0 * Math.pow(rho_nag, 2 * t));

            const allL = [...gdL, ...momL, ...nagL].filter(v => v > 1e-10);
            const lossMin = 1e-6, lossMax = Math.max(...allL) * 1.5;

            const ox = 52, oy = 30, pw = W - ox - 20, ph = H - oy - 50;
            const tw3 = t => ox + t / MAX_STEPS * pw;
            // Log scale
            const ty3 = v => {
                if (v <= 0) return oy + ph;
                const logV = Math.log10(v);
                const logMin = Math.log10(lossMin), logMax = Math.log10(lossMax);
                return oy + ph - (logV - logMin) / (logMax - logMin) * ph;
            };

            // Grid log
            ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
            for (let exp = -6; exp <= 2; exp++) {
                const y2 = ty3(Math.pow(10, exp));
                if (y2 < oy || y2 > oy + ph) continue;
                ctx.beginPath(); ctx.moveTo(ox, y2); ctx.lineTo(ox + pw, y2); ctx.stroke();
                txt(`10^${exp}`, 4, y2 + 4, '#475569', 8);
            }
            [0, 20, 40, 60, 80].forEach(t2 => {
                ctx.beginPath(); ctx.moveTo(tw3(t2), oy); ctx.lineTo(tw3(t2), oy + ph); ctx.stroke();
                txt(`${t2}`, tw3(t2) - 8, oy + ph + 14, '#475569', 9);
            });

            // Ejes
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.3;
            ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox, oy + ph); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(ox, oy + ph); ctx.lineTo(ox + pw, oy + ph); ctx.stroke();
            txt('paso', ox + pw - 20, oy + ph + 14, '#475569', 9);
            txt('f(θ)', 4, oy + 4, '#475569', 9);

            // Línea paso actual
            ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(tw3(curS), oy); ctx.lineTo(tw3(curS), oy + ph); ctx.stroke();
            ctx.setLineDash([]);

            // Curvas teóricas
            ctx.strokeStyle = 'rgba(248,113,113,0.25)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
            ctx.beginPath(); let first = true;
            theoGD.slice(0, curS + 1).forEach((v, t2) => {
                const py = ty3(v);
                if (py < oy - 2 || py > oy + ph + 2) { first = true; return; }
                first ? ctx.moveTo(tw3(t2), py) : ctx.lineTo(tw3(t2), py); first = false;
            });
            ctx.stroke();

            ctx.strokeStyle = 'rgba(52,211,153,0.25)'; ctx.lineWidth = 1; ctx.setLineDash([2, 4]);
            ctx.beginPath(); first = true;
            theoNAG.slice(0, curS + 1).forEach((v, t2) => {
                const py = ty3(v);
                if (py < oy - 2 || py > oy + ph + 2) { first = true; return; }
                first ? ctx.moveTo(tw3(t2), py) : ctx.lineTo(tw3(t2), py); first = false;
            });
            ctx.stroke(); ctx.setLineDash([]);

            // Curvas reales
            const curves = [
                { data: gdL, color: '#f87171', label: 'GD' },
                { data: momL, color: '#fbbf24', label: `Momentum β=${beta.toFixed(2)}` },
                { data: nagL, color: '#34d399', label: 'NAG' },
            ];
            curves.forEach(({ data, color, label }) => {
                ctx.strokeStyle = color; ctx.lineWidth = 2.2;
                ctx.beginPath(); first = true;
                data.slice(0, curS + 1).forEach((v, t2) => {
                    const py = ty3(v);
                    if (!isFinite(py) || py < oy - 2 || py > oy + ph + 2) { first = true; return; }
                    first ? ctx.moveTo(tw3(t2), py) : ctx.lineTo(tw3(t2), py); first = false;
                });
                ctx.stroke();
                const vCur = data[Math.min(curS, data.length - 1)];
                if (isFinite(vCur) && vCur > 0) {
                    const py = ty3(vCur);
                    if (py >= oy && py <= oy + ph) {
                        ctx.beginPath(); ctx.arc(tw3(curS), py, 4, 0, 2 * Math.PI);
                        ctx.fillStyle = color; ctx.fill();
                    }
                }
            });

            // Leyenda
            curves.forEach(({ color, label, data }, i) => {
                ctx.strokeStyle = color; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.moveTo(ox + 8, H - 46 + i * 18); ctx.lineTo(ox + 28, H - 46 + i * 18); ctx.stroke();
                const vCur = data[Math.min(curS, data.length - 1)];
                txt(`${label}  f=${vCur.toFixed(4)}`, ox + 32, H - 42 + i * 18, color, 9);
            });

            txt(`Teórico GD O(ρ_GD^t) y NAG O(ρ_NAG^2t) — κ=32`, ox + 8, H - 8, '#475569', 9);
        }

    }, [mode, step, lr, beta, showGD, showNAG]);

    const MODES = [
        { key: 'landscape', label: 'Paisaje 2D' },
        { key: 'velocity', label: 'Velocidad' },
        { key: 'convergence', label: 'Convergencia' },
    ];

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

                {/* Sliders β y α */}
                <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <span style={{ color: '#fbbf24', fontSize: 11, minWidth: 80, fontFamily: 'monospace' }}>
                            β={beta.toFixed(2)}
                        </span>
                        <input type="range" min={0} max={0.99} step={0.01} value={beta}
                            onChange={e => setBeta(Number(e.target.value))}
                            style={{ flex: 1, accentColor: '#fbbf24' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <span style={{ color: '#60a5fa', fontSize: 11, minWidth: 80, fontFamily: 'monospace' }}>
                            α={lr.toFixed(3)}
                        </span>
                        <input type="range" min={0.01} max={0.15} step={0.005} value={lr}
                            onChange={e => setLr(Number(e.target.value))}
                            style={{ flex: 1, accentColor: '#60a5fa' }} />
                    </div>
                </div>

                {/* Toggles GD / NAG */}
                {mode === 'landscape' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                        {[
                            { label: 'Mostrar GD', val: showGD, set: setShowGD, color: '#f87171' },
                            { label: 'Mostrar NAG', val: showNAG, set: setShowNAG, color: '#34d399' },
                        ].map(({ label, val, set, color }) => (
                            <button key={label} onClick={() => set(v => !v)} style={{
                                flex: 1, padding: '4px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                                border: `1.5px solid ${val ? color : '#334155'}`,
                                background: val ? color + '22' : 'transparent',
                                color: val ? color : '#64748b', fontFamily: 'monospace',
                            }}>{label}</button>
                        ))}
                    </div>
                )}

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
                    <b style={{ color: '#94a3b8' }}>Paisaje</b>: GD zigzaguea, Momentum acumula velocidad, NAG (punto verde) 'mira adelante' antes de actualizar.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Velocidad</b>: v_y oscila en dir. difícil; Momentum la amortigua, NAG la amortigua mejor.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Convergencia</b>: escala log — NAG ≈ O(1/t²), Momentum intermedio, GD ≈ O(1/t).
                </p>
            </div>
        </div>
    );
}