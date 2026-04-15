import React, { useState, useEffect, useRef } from 'react';

export default function TaylorApproxViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('univar');   // univar | error | multivar
    const [order, setOrder] = useState(2);
    const [x0, setX0] = useState(0.0);
    const [fnKey, setFnKey] = useState('exp');
    const [hx, setHx] = useState(0.8);
    const [hy, setHy] = useState(0.6);

    const MODES = [
        { key: 'univar', label: 'Aproximación 1D' },
        { key: 'error', label: 'Convergencia del error' },
        { key: 'multivar', label: 'Taylor 2D (cuadrático)' },
    ];

    const FUNS = {
        exp: { f: x => Math.exp(x), label: 'eˣ', color: '#60a5fa' },
        sin: { f: x => Math.sin(x), label: 'sin(x)', color: '#34d399' },
        sigmoid: { f: x => 1 / (1 + Math.exp(-x)), label: 'σ(x)', color: '#fbbf24' },
        log1p: { f: x => x > -1 ? Math.log(1 + x) : NaN, label: 'ln(1+x)', color: '#a78bfa' },
    };

    // Derivadas numéricas en x0 por diferencias centrales
    const deriv = (f, x, n, h = 1e-4) => {
        if (n === 0) return f(x);
        return (deriv(f, x + h, n - 1, h) - deriv(f, x - h, n - 1, h)) / (2 * h);
    };

    const factorial = n => n <= 1 ? 1 : n * factorial(n - 1);

    const taylorPoly = (f, x0, x, k) => {
        let sum = 0;
        for (let n = 0; n <= k; n++) {
            const dn = deriv(f, x0, n);
            if (!isFinite(dn)) break;
            sum += dn / factorial(n) * Math.pow(x - x0, n);
        }
        return sum;
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
        const f = fn.f;

        // ── MODO: Aproximación 1D ────────────────────────────────────────────
        if (mode === 'univar') {
            const xMin = -3.5, xMax = 3.5;
            let yMin = -2.5, yMax = 4.0;
            // Ajustar yMin/yMax según función
            if (fnKey === 'exp') { yMin = -0.5; yMax = 8.0; }
            if (fnKey === 'log1p') { yMin = -3.0; yMax = 2.5; }

            const tw = x => 26 + (x - xMin) / (xMax - xMin) * (W - 42);
            const ty = y => H - 28 - (y - yMin) / (yMax - yMin) * (H - 52);

            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
            [-3, -2, -1, 0, 1, 2, 3].forEach(g => {
                ctx.beginPath(); ctx.moveTo(tw(g), 24); ctx.lineTo(tw(g), H - 28); ctx.stroke();
            });

            // Ejes
            ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1.2;
            if (yMin < 0 && yMax > 0) {
                ctx.beginPath(); ctx.moveTo(26, ty(0)); ctx.lineTo(W - 16, ty(0)); ctx.stroke();
            }
            ctx.beginPath(); ctx.moveTo(tw(0), 24); ctx.lineTo(tw(0), H - 28); ctx.stroke();

            // Curva exacta f(x)
            ctx.strokeStyle = fn.color; ctx.lineWidth = 2.5;
            ctx.beginPath(); let first = true;
            for (let px = 26; px <= W - 16; px++) {
                const x = xMin + (px - 26) / (W - 42) * (xMax - xMin);
                const y = f(x);
                if (!isFinite(y) || y < yMin - 2 || y > yMax + 2) { first = true; continue; }
                first ? ctx.moveTo(px, ty(y)) : ctx.lineTo(px, ty(y));
                first = false;
            }
            ctx.stroke();

            // Polinomio de Taylor de orden k
            const polyColor = '#f87171';
            ctx.strokeStyle = polyColor; ctx.lineWidth = 2; ctx.setLineDash([6, 4]);
            ctx.beginPath(); first = true;
            for (let px = 26; px <= W - 16; px++) {
                const x = xMin + (px - 26) / (W - 42) * (xMax - xMin);
                const y = taylorPoly(f, x0, x, order);
                if (!isFinite(y) || y < yMin - 3 || y > yMax + 3) { first = true; continue; }
                first ? ctx.moveTo(px, ty(y)) : ctx.lineTo(px, ty(y));
                first = false;
            }
            ctx.stroke(); ctx.setLineDash([]);

            // Punto x0
            const y0 = f(x0);
            if (isFinite(y0) && y0 > yMin && y0 < yMax) {
                ctx.beginPath(); ctx.arc(tw(x0), ty(y0), 6, 0, 2 * Math.PI);
                ctx.fillStyle = '#fbbf24'; ctx.fill();
            }

            // Zona de validez (región donde |error|<0.1)
            ctx.fillStyle = 'rgba(248,113,113,0.06)';
            let validStart = null;
            for (let px = 26; px <= W - 16; px++) {
                const x = xMin + (px - 26) / (W - 42) * (xMax - xMin);
                const yExact = f(x);
                const yApprox = taylorPoly(f, x0, x, order);
                if (!isFinite(yExact) || !isFinite(yApprox)) continue;
                if (Math.abs(yExact - yApprox) < 0.15) {
                    if (validStart === null) validStart = px;
                } else {
                    if (validStart !== null) {
                        ctx.fillRect(validStart, 26, px - validStart, H - 54);
                        validStart = null;
                    }
                }
            }
            if (validStart !== null) ctx.fillRect(validStart, 26, W - 16 - validStart, H - 54);

            // Error en x0+1
            const xTest = x0 + 1.0;
            if (xTest < xMax) {
                const errAbs = Math.abs(f(xTest) - taylorPoly(f, x0, xTest, order));
                txt(`|R_${order}(x₀+1)| = ${errAbs.toFixed(5)}`, 16, H - 12, '#f87171', 10);
            }

            // Labels
            txt(`f(x) = ${fn.label}`, 30, 20, fn.color, 11, true);
            ctx.setLineDash([6, 4]); ctx.strokeStyle = polyColor; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(110, 15); ctx.lineTo(140, 15); ctx.stroke(); ctx.setLineDash([]);
            txt(`P_${order}(x)  orden k=${order}`, 146, 20, polyColor, 11);
            txt(`x₀=${x0.toFixed(2)}`, W - 80, 20, '#fbbf24', 10);

            // Polinomio explícito (primeros 3 términos)
            const d0 = deriv(f, x0, 0).toFixed(3);
            const d1 = deriv(f, x0, 1).toFixed(3);
            const d2 = deriv(f, x0, 2).toFixed(3);
            txt(`P(x) ≈ ${d0} + ${d1}(x-x₀) + ${d2}/2·(x-x₀)²${order > 2 ? '+…' : ''}`,
                16, H - 28, '#94a3b8', 10);
        }

        // ── MODO: Convergencia del error ────────────────────────────────────
        if (mode === 'error') {
            txt('Convergencia del error |f(x) − P_k(x)| vs orden k', 16, 20, '#60a5fa', 12, true);

            const testPoints = [0.5, 1.0, 1.5, 2.0];
            const maxOrder = 10;
            const colors = ['#34d399', '#fbbf24', '#a78bfa', '#f87171'];

            const logCanvas = (val) => Math.log10(Math.max(val, 1e-16));

            const errGrid = testPoints.map(xTest => {
                return Array.from({ length: maxOrder }, (_, k) => {
                    const err = Math.abs(f(xTest) - taylorPoly(f, x0, xTest, k + 1));
                    return err;
                });
            });

            const allLogs = errGrid.flat().map(logCanvas).filter(isFinite);
            const logMin = Math.min(...allLogs) - 0.5;
            const logMax = Math.max(...allLogs) + 0.5;

            const tw = k => 60 + (k) / (maxOrder - 1) * (W - 80);
            const ty = v => H - 32 - (logCanvas(v) - logMin) / (logMax - logMin) * (H - 60);

            // Grid horizontal (décadas)
            ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
            for (let logV = Math.ceil(logMin); logV <= Math.floor(logMax); logV++) {
                const y = H - 32 - (logV - logMin) / (logMax - logMin) * (H - 60);
                ctx.beginPath(); ctx.moveTo(55, y); ctx.lineTo(W - 16, y); ctx.stroke();
                txt(`10^${logV}`, 6, y + 4, '#475569', 9);
            }
            // Grid vertical
            for (let k = 0; k <= maxOrder; k++) {
                ctx.beginPath(); ctx.moveTo(tw(k), 32); ctx.lineTo(tw(k), H - 32); ctx.stroke();
                txt(`${k + 1}`, tw(k) - 4, H - 18, '#475569', 9);
            }

            // Curvas de error para cada punto de evaluación
            errGrid.forEach((errors, pi) => {
                const color = colors[pi];
                ctx.strokeStyle = color; ctx.lineWidth = 2;
                ctx.beginPath();
                errors.forEach((err, k) => {
                    if (!isFinite(err) || err < 1e-17) return;
                    const px = tw(k), py = ty(err);
                    k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                    ctx.arc(px, py, 3, 0, 2 * Math.PI);
                });
                ctx.stroke();
                txt(`x=${testPoints[pi]}`, W - 52, ty(errors[0]) - 4, color, 9, true);
            });

            // Línea de orden actual
            ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(tw(order - 1), 32); ctx.lineTo(tw(order - 1), H - 32); ctx.stroke();
            ctx.setLineDash([]);
            txt(`k=${order}`, tw(order - 1) - 8, 26, '#fbbf24', 10, true);

            txt('Eje y: log₁₀|error|', 16, H - 6, '#475569', 10);
            txt('Eje x: orden k', W / 2 - 30, H - 6, '#475569', 10);
            txt(`f(x)=${fn.label}  x₀=${x0.toFixed(2)}`, W - 160, 18, fn.color, 10, true);
        }

        // ── MODO: Taylor 2D ──────────────────────────────────────────────────
        if (mode === 'multivar') {
            txt('Modelo cuadrático de Taylor (2D) y paso de Newton', 16, 20, '#60a5fa', 12, true);

            // f(x,y) = sin(x)*cos(y) — usamos x0=(0,0) fijo para viz 2D
            const f2 = (x, y) => Math.sin(x) * Math.cos(y);

            // Derivadas en x0=(0,0)
            // fx=cos(0)*cos(0)=1, fy=-sin(0)*sin(0)=0
            // fxx=-sin(0)*cos(0)=0, fxy=cos(0)*(-sin(0))... bueno, usamos numérico
            const eps = 1e-4;
            const p0 = [0, 0];
            const f00 = f2(0, 0);
            const fx = (f2(eps, 0) - f2(-eps, 0)) / (2 * eps);
            const fy = (f2(0, eps) - f2(0, -eps)) / (2 * eps);
            const fxx = (f2(eps, 0) - 2 * f00 + f2(-eps, 0)) / (eps * eps);
            const fyy = (f2(0, eps) - 2 * f00 + f2(0, -eps)) / (eps * eps);
            const fxy = (f2(eps, eps) - f2(eps, -eps) - f2(-eps, eps) + f2(-eps, -eps)) / (4 * eps * eps);

            // Punto de expansión = (hx, hy) del slider, evaluado desde (0,0)
            const evalTaylor1 = (hx, hy) => f00 + fx * hx + fy * hy;
            const evalTaylor2 = (hx, hy) => f00 + fx * hx + fy * hy
                + 0.5 * (fxx * hx * hx + 2 * fxy * hx * hy + fyy * hy * hy);
            const evalExact = (hx, hy) => f2(hx, hy);

            // Curvas de nivel de la función exacta
            const xMin = -2.5, xMax = 2.5, yMin = -2.5, yMax = 2.5;
            const tw = x => 26 + (x - xMin) / (xMax - xMin) * (W - 42);
            const ty = y => H - 26 - (y - yMin) / (yMax - yMin) * (H - 50);

            const res = 70;
            const zG = [];
            let zMn = Infinity, zMx = -Infinity;
            for (let i = 0; i < res; i++) {
                zG[i] = [];
                for (let j = 0; j < res; j++) {
                    const x = xMin + i / (res - 1) * (xMax - xMin);
                    const y = yMin + j / (res - 1) * (yMax - yMin);
                    const z = f2(x, y); zG[i][j] = z;
                    if (z < zMn) zMn = z; if (z > zMx) zMx = z;
                }
            }

            const nLv = 10;
            Array.from({ length: nLv }, (_, k) => zMn + (k + 0.5) * (zMx - zMn) / nLv).forEach(level => {
                ctx.strokeStyle = 'rgba(96,165,250,0.18)'; ctx.lineWidth = 1;
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
            ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(tw(0), 24); ctx.lineTo(tw(0), H - 24); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(26, ty(0)); ctx.lineTo(W - 16, ty(0)); ctx.stroke();
            ctx.setLineDash([]);

            // Punto de expansión (origen)
            ctx.beginPath(); ctx.arc(tw(0), ty(0), 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#fbbf24'; ctx.fill();
            txt('x₀', tw(0) + 8, ty(0) - 8, '#fbbf24', 10, true);

            // Punto h=(hx,hy) del slider
            ctx.beginPath(); ctx.arc(tw(hx), ty(hy), 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#f87171'; ctx.fill();

            // Línea desde origen al punto h
            ctx.strokeStyle = 'rgba(248,113,113,0.5)'; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(tw(0), ty(0)); ctx.lineTo(tw(hx), ty(hy)); ctx.stroke();
            ctx.setLineDash([]);
            txt(`h=(${hx.toFixed(2)},${hy.toFixed(2)})`, tw(hx) + 6, ty(hy) - 8, '#f87171', 9);

            // Flecha gradiente desde x0
            const gScale = 40;
            const gEx = tw(0) + fx * gScale, gEy = ty(0) - fy * gScale;
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(tw(0), ty(0)); ctx.lineTo(gEx, gEy); ctx.stroke();
            ctx.beginPath(); ctx.arc(gEx, gEy, 4, 0, 2 * Math.PI);
            ctx.fillStyle = '#34d399'; ctx.fill();
            txt('∇f', gEx + 5, gEy - 5, '#34d399', 10, true);

            // Panel de valores derecha
            const px2 = W - 220, py2 = 56;
            txt('Valores en h:', px2, py2, '#94a3b8', 10, true);
            const exact2 = evalExact(hx, hy);
            const t1 = evalTaylor1(hx, hy);
            const t2 = evalTaylor2(hx, hy);
            txt(`f(x₀+h) exacta = ${exact2.toFixed(5)}`, px2, py2 + 18, fn.color.replace('exp', '#60a5fa'), 10);
            txt(`P₁(h)  = ${t1.toFixed(5)}`, px2, py2 + 34, '#34d399', 10);
            txt(`P₂(h)  = ${t2.toFixed(5)}`, px2, py2 + 50, '#a78bfa', 10);
            txt(`|err P₁| = ${Math.abs(exact2 - t1).toFixed(5)}`, px2, py2 + 70, '#34d399', 10);
            txt(`|err P₂| = ${Math.abs(exact2 - t2).toFixed(5)}`, px2, py2 + 86, '#a78bfa', 10, true);

            txt('Expansión en x₀=(0,0):', px2, py2 + 112, '#94a3b8', 10, true);
            txt(`f₀=${f00.toFixed(3)}`, px2, py2 + 128, '#475569', 10);
            txt(`∇f=(${fx.toFixed(3)},${fy.toFixed(3)})`, px2, py2 + 144, '#475569', 10);
            txt(`H=[[${fxx.toFixed(2)},${fxy.toFixed(2)}],`, px2, py2 + 160, '#475569', 10);
            txt(`   [${fxy.toFixed(2)},${fyy.toFixed(2)}]]`, px2, py2 + 176, '#475569', 10);

            txt('f(x,y) = sin(x)cos(y)', 16, H - 14, '#60a5fa', 10, true);
        }

    }, [mode, order, x0, fnKey, hx, hy]);

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
                        <button key={key} onClick={() => setMode(key)} style={{
                            flex: 1, padding: '5px 4px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                            border: `1.5px solid ${mode === key ? '#60a5fa' : '#334155'}`,
                            background: mode === key ? '#60a5fa22' : 'transparent',
                            color: mode === key ? '#60a5fa' : '#64748b',
                            fontFamily: 'monospace', transition: 'all 0.15s',
                        }}>{label}</button>
                    ))}
                </div>

                {/* Selector de función */}
                <div style={{ display: 'flex', gap: 6 }}>
                    {Object.entries(FUNS).map(([key, { label, color }]) => (
                        <button key={key} onClick={() => setFnKey(key)} style={{
                            flex: 1, padding: '4px 2px', fontSize: 10, cursor: 'pointer', borderRadius: 6,
                            border: `1.5px solid ${fnKey === key ? color : '#334155'}`,
                            background: fnKey === key ? color + '22' : 'transparent',
                            color: fnKey === key ? color : '#64748b',
                            fontFamily: 'monospace', transition: 'all 0.15s',
                        }}>{label}</button>
                    ))}
                </div>

                {/* Sliders */}
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {(mode === 'univar' || mode === 'error') && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                <span style={{ color: '#fbbf24', fontSize: 11, minWidth: 70, fontFamily: 'monospace' }}>
                                    x₀ = {x0.toFixed(2)}
                                </span>
                                <input type="range" min={-2} max={2} step={0.05} value={x0}
                                    onChange={e => setX0(Number(e.target.value))}
                                    style={{ flex: 1, accentColor: '#fbbf24' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                <span style={{ color: '#f87171', fontSize: 11, minWidth: 70, fontFamily: 'monospace' }}>
                                    orden k = {order}
                                </span>
                                <input type="range" min={1} max={10} step={1} value={order}
                                    onChange={e => setOrder(Number(e.target.value))}
                                    style={{ flex: 1, accentColor: '#f87171' }} />
                            </div>
                        </>
                    )}
                    {mode === 'multivar' && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                <span style={{ color: '#f87171', fontSize: 11, minWidth: 72, fontFamily: 'monospace' }}>
                                    hₓ = {hx.toFixed(2)}
                                </span>
                                <input type="range" min={-2.2} max={2.2} step={0.05} value={hx}
                                    onChange={e => setHx(Number(e.target.value))}
                                    style={{ flex: 1, accentColor: '#f87171' }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                <span style={{ color: '#a78bfa', fontSize: 11, minWidth: 72, fontFamily: 'monospace' }}>
                                    h_y = {hy.toFixed(2)}
                                </span>
                                <input type="range" min={-2.2} max={2.2} step={0.05} value={hy}
                                    onChange={e => setHy(Number(e.target.value))}
                                    style={{ flex: 1, accentColor: '#a78bfa' }} />
                            </div>
                        </>
                    )}
                </div>

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Aprox 1D</b>: zona roja tenue = región donde |error|&lt;0.15; mueve x₀ y k.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Convergencia</b>: cada curva es un punto de evaluación; el error cae como (k+1)! en el denominador.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Taylor 2D</b>: P₂ siempre supera a P₁ — la curvatura de H corrige la linealización.
                </p>
            </div>
        </div>
    );
}