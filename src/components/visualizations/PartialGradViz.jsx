import React, { useState, useEffect, useRef } from 'react';

export default function PartialGradViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('surface');  // surface | contour | directional
    const [x0, setX0] = useState(1.0);
    const [y0, setY0] = useState(0.8);
    const [dirAngle, setDirAngle] = useState(45);   // ángulo de dirección u (grados)

    const MODES = [
        { key: 'surface', label: 'Superficie & plano tangente' },
        { key: 'contour', label: 'Curvas de nivel & gradiente' },
        { key: 'directional', label: 'Derivada direccional' },
    ];

    // f(x,y) = 0.4*sin(x)*cos(y) + 0.3*x²*y   (rescalada para visualización)
    const f = (x, y) => 0.5 * Math.sin(x) * Math.cos(y) + 0.2 * x * x * y;
    const dfdx = (x, y) => 0.5 * Math.cos(x) * Math.cos(y) + 0.4 * x * y;
    const dfdy = (x, y) => -0.5 * Math.sin(x) * Math.sin(y) + 0.2 * x * x;

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

        const gx = dfdx(x0, y0);
        const gy = dfdy(x0, y0);
        const gradNorm = Math.sqrt(gx * gx + gy * gy);

        // ── MODO: Superficie 3D simplificada (proyección isométrica) ─────────
        if (mode === 'surface') {
            const xMin = -2.5, xMax = 2.5, yMin = -2.5, yMax = 2.5;
            const steps = 28;
            const dx = (xMax - xMin) / steps;
            const dy = (yMax - yMin) / steps;

            // Proyección isométrica
            const iso = (x, y, z) => ({
                px: W / 2 + (x - y) * 38,
                py: H / 2 - z * 55 + (x + y) * 18,
            });

            // Precalcular z para coloración
            let zMin = Infinity, zMax = -Infinity;
            const grid = [];
            for (let i = 0; i <= steps; i++) {
                grid[i] = [];
                for (let j = 0; j <= steps; j++) {
                    const x = xMin + i * dx, y = yMin + j * dy;
                    const z = f(x, y);
                    grid[i][j] = { x, y, z };
                    if (z < zMin) zMin = z;
                    if (z > zMax) zMax = z;
                }
            }

            const zColor = (z) => {
                const t = (z - zMin) / (zMax - zMin + 1e-9);
                const r = Math.round(11 + t * (96 - 11));
                const g = Math.round(18 + t * (165 - 18));
                const b = Math.round(32 + t * (250 - 32));
                return `rgb(${r},${g},${b})`;
            };

            // Dibujar cuadrícula de la superficie (back-to-front)
            for (let i = steps - 1; i >= 0; i--) {
                for (let j = steps - 1; j >= 0; j--) {
                    const { x: x1, y: y1, z: z1 } = grid[i][j];
                    const { z: z2 } = grid[i + 1][j];
                    const { z: z3 } = grid[i + 1][j + 1];
                    const { z: z4 } = grid[i][j + 1];
                    const zAvg = (z1 + z2 + z3 + z4) / 4;

                    const p1 = iso(x1, y1, z1);
                    const p2 = iso(x1 + dx, y1, z2);
                    const p3 = iso(x1 + dx, y1 + dy, z3);
                    const p4 = iso(x1, y1 + dy, z4);

                    ctx.beginPath();
                    ctx.moveTo(p1.px, p1.py);
                    ctx.lineTo(p2.px, p2.py);
                    ctx.lineTo(p3.px, p3.py);
                    ctx.lineTo(p4.px, p4.py);
                    ctx.closePath();
                    ctx.fillStyle = zColor(zAvg);
                    ctx.globalAlpha = 0.72;
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.strokeStyle = 'rgba(11,18,32,0.5)';
                    ctx.lineWidth = 0.4;
                    ctx.stroke();
                }
            }

            // Punto x0, y0
            const z00 = f(x0, y0);
            const pt = iso(x0, y0, z00);
            ctx.beginPath(); ctx.arc(pt.px, pt.py, 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#f87171'; ctx.fill();

            // Plano tangente (pequeño parche)
            const patchSize = 0.7;
            const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([si, sj]) => {
                const xi = x0 + si * patchSize, yi = y0 + sj * patchSize;
                const zi = z00 + gx * (xi - x0) + gy * (yi - y0);
                return iso(xi, yi, zi);
            });
            ctx.beginPath();
            ctx.moveTo(corners[0].px, corners[0].py);
            corners.slice(1).forEach(c => ctx.lineTo(c.px, c.py));
            ctx.closePath();
            ctx.fillStyle = 'rgba(248,113,113,0.18)';
            ctx.fill();
            ctx.strokeStyle = '#f87171';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Gradiente proyectado en el punto (flecha en la base)
            const base = iso(x0, y0, zMin - 0.1);
            const gScale = 22;
            const gEnd = iso(x0 + gx * 0.4, y0 + gy * 0.4, zMin - 0.1);
            ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(base.px, base.py); ctx.lineTo(gEnd.px, gEnd.py); ctx.stroke();

            // Labels
            txt('f(x,y) = 0.5·sin(x)cos(y) + 0.2x²y', 12, 18, '#60a5fa', 10, true);
            txt(`(x₀,y₀) = (${x0.toFixed(2)}, ${y0.toFixed(2)})`, 12, 32, '#f87171', 10);
            txt(`f(x₀,y₀) = ${z00.toFixed(3)}`, 12, 46, '#94a3b8', 10);
            txt(`∂f/∂x = ${gx.toFixed(3)}`, 12, H - 28, '#34d399', 10, true);
            txt(`∂f/∂y = ${gy.toFixed(3)}`, 12, H - 14, '#34d399', 10, true);
            txt(`Parche rojo = plano tangente`, W - 200, H - 14, '#f87171', 10);
        }

        // ── MODO: Curvas de nivel ────────────────────────────────────────────
        if (mode === 'contour') {
            const xMin = -2.8, xMax = 2.8, yMin = -2.8, yMax = 2.8;
            const tw = x => 24 + (x - xMin) / (xMax - xMin) * (W - 40);
            const ty = y => H - 24 - (y - yMin) / (yMax - yMin) * (H - 48);

            // Calcular campo z en resolución alta
            const res = 180;
            const zGrid = [];
            let zGMin = Infinity, zGMax = -Infinity;
            for (let i = 0; i < res; i++) {
                zGrid[i] = [];
                for (let j = 0; j < res; j++) {
                    const x = xMin + i / (res - 1) * (xMax - xMin);
                    const y = yMin + j / (res - 1) * (yMax - yMin);
                    const z = f(x, y);
                    zGrid[i][j] = z;
                    if (z < zGMin) zGMin = z;
                    if (z > zGMax) zGMax = z;
                }
            }

            // Dibujar curvas de nivel por marching squares simplificado (threshold bands)
            const nLevels = 10;
            const levels = Array.from({ length: nLevels }, (_, k) =>
                zGMin + (k + 0.5) * (zGMax - zGMin) / nLevels);

            const hueLevel = (k) => {
                const t = k / nLevels;
                const r = Math.round(11 + t * (167 - 11));
                const g = Math.round(18 + t * (139 - 18));
                const b = Math.round(32 + t * (250 - 32));
                return `rgba(${r},${g},${b},0.5)`;
            };

            levels.forEach((level, k) => {
                ctx.strokeStyle = hueLevel(k);
                ctx.lineWidth = 1.2;
                for (let i = 0; i < res - 1; i++) {
                    for (let j = 0; j < res - 1; j++) {
                        const x = xMin + i / (res - 1) * (xMax - xMin);
                        const y = yMin + j / (res - 1) * (yMax - yMin);
                        const z00 = zGrid[i][j], z10 = zGrid[i + 1][j];
                        const z01 = zGrid[i][j + 1], z11 = zGrid[i + 1][j + 1];
                        const ddx = (xMax - xMin) / (res - 1), ddy = (yMax - yMin) / (res - 1);
                        // Interpolar cruces de nivel en los 4 lados
                        const cross = (za, zb) =>
                            (za < level) !== (zb < level)
                                ? (level - za) / (zb - za)
                                : null;
                        const pts = [];
                        const t01 = cross(z00, z10);
                        if (t01 != null) pts.push([tw(x + t01 * ddx), ty(y)]);
                        const t12 = cross(z10, z11);
                        if (t12 != null) pts.push([tw(x + ddx), ty(y + t12 * ddy)]);
                        const t23 = cross(z11, z01);
                        if (t23 != null) pts.push([tw(x + (1 - t23) * ddx), ty(y + ddy)]);
                        const t30 = cross(z01, z00);
                        if (t30 != null) pts.push([tw(x), ty(y + t30 * ddy)]);
                        if (pts.length === 2) {
                            ctx.beginPath();
                            ctx.moveTo(pts[0][0], pts[0][1]);
                            ctx.lineTo(pts[1][0], pts[1][1]);
                            ctx.stroke();
                        }
                    }
                }
            });

            // Ejes
            ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
            ctx.setLineDash([4, 4]);
            ctx.beginPath(); ctx.moveTo(tw(0), 24); ctx.lineTo(tw(0), H - 24); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(24, ty(0)); ctx.lineTo(W - 16, ty(0)); ctx.stroke();
            ctx.setLineDash([]);

            // Campo de gradientes (flechas en grilla)
            const arrowStep = 0.8;
            for (let xi = -2.4; xi <= 2.4; xi += arrowStep) {
                for (let yi = -2.4; yi <= 2.4; yi += arrowStep) {
                    const gxi = dfdx(xi, yi), gyi = dfdy(xi, yi);
                    const mag = Math.sqrt(gxi * gxi + gyi * gyi) + 1e-9;
                    const scale = 14 / (mag + 1.5);
                    const ex = tw(xi) + gxi * scale, ey = ty(yi) - gyi * scale;
                    ctx.strokeStyle = 'rgba(251,191,36,0.5)';
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(tw(xi), ty(yi)); ctx.lineTo(ex, ey); ctx.stroke();
                }
            }

            // Gradiente en x0,y0 — flecha grande
            const scaleG = 30 / (gradNorm + 0.5);
            const gEx = tw(x0) + gx * scaleG;
            const gEy = ty(y0) - gy * scaleG;
            ctx.strokeStyle = '#fbbf24'; ctx.fillStyle = '#fbbf24'; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.moveTo(tw(x0), ty(y0)); ctx.lineTo(gEx, gEy); ctx.stroke();
            const ang = Math.atan2(-(gEy - ty(y0)), gEx - tw(x0));
            ctx.beginPath();
            ctx.moveTo(gEx, gEy);
            ctx.lineTo(gEx - 10 * Math.cos(ang - 0.4), gEy + 10 * Math.sin(ang - 0.4));
            ctx.lineTo(gEx - 10 * Math.cos(ang + 0.4), gEy + 10 * Math.sin(ang + 0.4));
            ctx.closePath(); ctx.fill();

            // Punto x0,y0
            ctx.beginPath(); ctx.arc(tw(x0), ty(y0), 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#f87171'; ctx.fill();

            // Labels
            txt('x', W - 18, ty(0) + 4, '#475569', 10);
            txt('y', tw(0) - 14, 30, '#475569', 10);
            txt(`∇f(x₀,y₀) = (${gx.toFixed(3)}, ${gy.toFixed(3)})`, 16, H - 28, '#fbbf24', 11, true);
            txt(`‖∇f‖ = ${gradNorm.toFixed(3)}  ← máxima tasa de cambio`, 16, H - 13, '#fbbf24', 10);
            txt('⊥ curvas de nivel', W - 130, H - 13, '#94a3b8', 10);
        }

        // ── MODO: Derivada direccional ───────────────────────────────────────
        if (mode === 'directional') {
            txt('Derivada direccional  D_u f = ∇f · u = ‖∇f‖ cos θ', 16, 22, '#60a5fa', 12, true);

            // Diagrama polar de D_u f en función del ángulo
            const cx2 = 160, cy2 = 200, R = 110;

            // Fondo polar
            ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1;
            [0.33, 0.67, 1.0].forEach(r => {
                ctx.beginPath(); ctx.arc(cx2, cy2, R * r, 0, 2 * Math.PI); ctx.stroke();
            });
            [0, 45, 90, 135].forEach(deg => {
                const rad = deg * Math.PI / 180;
                ctx.beginPath();
                ctx.moveTo(cx2 - R * Math.cos(rad), cy2 - R * Math.sin(rad));
                ctx.lineTo(cx2 + R * Math.cos(rad), cy2 + R * Math.sin(rad));
                ctx.stroke();
            });

            // Curva polar de |D_u f(θ)| en cada ángulo
            ctx.strokeStyle = 'rgba(96,165,250,0.5)'; ctx.lineWidth = 1.5;
            ctx.beginPath();
            for (let deg = 0; deg <= 360; deg += 2) {
                const rad = deg * Math.PI / 180;
                const ux = Math.cos(rad), uy = Math.sin(rad);
                const Du = gx * ux + gy * uy;
                const rr = Math.abs(Du) / gradNorm * R;
                const color = Du >= 0 ? 'rgba(96,165,250,0.5)' : 'rgba(248,113,113,0.5)';
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(cx2, cy2);
                ctx.lineTo(cx2 + rr * ux, cy2 - rr * uy);
                ctx.stroke();
            }

            // Dirección elegida por slider
            const uRad = dirAngle * Math.PI / 180;
            const ux = Math.cos(uRad), uy = Math.sin(uRad);
            const Du = gx * ux + gy * uy;
            const rr = Math.abs(Du) / gradNorm * R;

            // Flecha u
            ctx.strokeStyle = '#34d399'; ctx.fillStyle = '#34d399'; ctx.lineWidth = 2.5;
            const uEx = cx2 + R * ux, uEy = cy2 - R * uy;
            ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(uEx, uEy); ctx.stroke();
            ctx.beginPath();
            ctx.arc(uEx, uEy, 5, 0, 2 * Math.PI); ctx.fill();
            txt(`u`, uEx + 5, uEy - 5, '#34d399', 11, true);

            // Proyección D_u
            const projEx = cx2 + rr * ux, projEy = cy2 - rr * uy;
            ctx.strokeStyle = Du >= 0 ? '#fbbf24' : '#f87171';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(cx2, cy2); ctx.lineTo(projEx, projEy); ctx.stroke();

            // Dirección gradiente
            const gRad = Math.atan2(-gy, gx);
            ctx.strokeStyle = '#a78bfa'; ctx.fillStyle = '#a78bfa'; ctx.lineWidth = 2;
            ctx.setLineDash([5, 4]);
            ctx.beginPath();
            ctx.moveTo(cx2, cy2);
            ctx.lineTo(cx2 + R * Math.cos(gRad), cy2 + R * Math.sin(gRad));
            ctx.stroke(); ctx.setLineDash([]);
            txt('∇f', cx2 + (R + 8) * Math.cos(gRad), cy2 + (R + 8) * Math.sin(gRad), '#a78bfa', 11, true);

            // Ángulo theta
            const theta = Math.acos(Math.max(-1, Math.min(1, Du / (gradNorm + 1e-9))));

            // Panel de valores derecha
            const px2 = 330;
            txt('Valores en x₀, y₀:', px2, 55, '#94a3b8', 11, true);
            txt(`∂f/∂x = ${gx.toFixed(4)}`, px2, 78, '#60a5fa', 11);
            txt(`∂f/∂y = ${gy.toFixed(4)}`, px2, 96, '#60a5fa', 11);
            txt(`‖∇f‖  = ${gradNorm.toFixed(4)}`, px2, 114, '#a78bfa', 11, true);

            txt('Dirección u:', px2, 146, '#94a3b8', 11, true);
            txt(`θ = ${dirAngle}°`, px2, 166, '#34d399', 11);
            txt(`uₓ = ${ux.toFixed(3)},  u_y = ${uy.toFixed(3)}`, px2, 184, '#34d399', 10);

            txt('Derivada direccional:', px2, 216, '#94a3b8', 11, true);
            txt(`D_u f = ∇f·u`, px2, 234, '#e2e8f0', 11);
            txt(`= ${gx.toFixed(3)}·${ux.toFixed(3)} + ${gy.toFixed(3)}·${uy.toFixed(3)}`, px2, 252, '#e2e8f0', 10);
            txt(`= ${Du.toFixed(4)}`, px2, 270, Du >= 0 ? '#fbbf24' : '#f87171', 13, true);

            txt(`cos θ = ${Math.cos(theta).toFixed(4)}`, px2, 295, '#475569', 10);
            txt(`θ entre u y ∇f: ${(theta * 180 / Math.PI).toFixed(1)}°`, px2, 312, '#475569', 10);

            txt('Azul/Rojo = D_u f > 0 / < 0', 16, H - 28, '#94a3b8', 10);
            txt('Morado = dirección ∇f (máximo ascenso)', 16, H - 13, '#a78bfa', 10);
        }

    }, [mode, x0, y0, dirAngle]);

    return (
        <div className="viz-box" style={{ background: '#0b1220', borderRadius: 10, padding: 12 }}>
            <canvas
                ref={canvasRef}
                width={530}
                height={380}
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

                {/* Sliders x0, y0 */}
                <div style={{ display: 'flex', gap: 12 }}>
                    {[
                        { label: 'x₀', val: x0, set: setX0, color: '#60a5fa' },
                        { label: 'y₀', val: y0, set: setY0, color: '#34d399' },
                    ].map(({ label, val, set, color }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                            <span style={{ color, fontSize: 11, minWidth: 70, fontFamily: 'monospace' }}>
                                {label} = {val.toFixed(2)}
                            </span>
                            <input type="range" min={-2.4} max={2.4} step={0.05} value={val}
                                onChange={e => set(Number(e.target.value))}
                                style={{ flex: 1, accentColor: color }} />
                        </div>
                    ))}
                </div>

                {/* Slider ángulo (solo modo directional) */}
                {mode === 'directional' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#34d399', fontSize: 11, minWidth: 110, fontFamily: 'monospace' }}>
                            ángulo u: {dirAngle}°
                        </span>
                        <input type="range" min={0} max={359} step={1} value={dirAngle}
                            onChange={e => setDirAngle(Number(e.target.value))}
                            style={{ flex: 1, accentColor: '#34d399' }} />
                    </div>
                )}

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Superficie</b>: parche rojo = plano tangente, pendientes parciales ∂f/∂x y ∂f/∂y.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Curvas de nivel</b>: flechas amarillas = campo ∇f, siempre ⊥ a las isolíneas.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Direccional</b>: rota u y observa cómo D_u f = ‖∇f‖ cos θ varía entre −‖∇f‖ y +‖∇f‖.
                </p>
            </div>
        </div>
    );
}