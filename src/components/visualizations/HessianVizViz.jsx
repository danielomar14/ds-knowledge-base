import React, { useState, useEffect, useRef } from 'react';

export default function HessianVizViz() {
    const canvasRef = useRef(null);
    const [mode, setMode] = useState('surface');  // surface | eigen | convergence
    const [h11, setH11] = useState(3.0);        // entrada H[0][0]
    const [h12, setH12] = useState(0.8);        // entrada H[0][1] = H[1][0]
    const [h22, setH22] = useState(1.5);        // entrada H[1][1]
    const [steps, setSteps] = useState(8);          // pasos GD a mostrar

    const MODES = [
        { key: 'surface', label: 'Superficie & curvatura' },
        { key: 'eigen', label: 'Eigenvalores & tipo' },
        { key: 'convergence', label: 'GD vs Newton' },
    ];

    // Eigenvalores de la Hessiana 2×2 simétrica
    const getEigen = (a, b, c) => {
        // H = [[a,b],[b,c]], eigenvalores de polinomio cuadrático
        const trace = a + c;
        const det = a * c - b * b;
        const disc = Math.sqrt(Math.max(0, (trace / 2) ** 2 - det));
        const l1 = trace / 2 + disc;
        const l2 = trace / 2 - disc;
        // Eigenvectores
        const v1 = b !== 0
            ? normalize([l1 - c, b])
            : (a >= c ? [1, 0] : [0, 1]);
        const v2 = [-v1[1], v1[0]];
        return { l1, l2, v1, v2, det, trace };
    };

    const normalize = ([a, b]) => {
        const n = Math.sqrt(a * a + b * b); return n > 0 ? [a / n, b / n] : [1, 0];
    };

    // Función cuadrática f(x,y) = ½(h11 x² + 2 h12 xy + h22 y²)
    const f = (x, y) => 0.5 * (h11 * x * x + 2 * h12 * x * y + h22 * y * y);
    const gf = (x, y) => [h11 * x + h12 * y, h12 * x + h22 * y];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H_c = canvas.height;
        ctx.clearRect(0, 0, W, H_c);
        ctx.fillStyle = '#0b1220';
        ctx.fillRect(0, 0, W, H_c);

        const txt = (t, x, y, color = '#94a3b8', size = 11, bold = false) => {
            ctx.fillStyle = color;
            ctx.font = `${bold ? 'bold ' : ''}${size}px monospace`;
            ctx.fillText(t, x, y);
        };

        const eigen = getEigen(h11, h12, h22);
        const { l1, l2, v1, v2, det } = eigen;

        const classifyPoint = () => {
            if (l1 > 1e-9 && l2 > 1e-9) return { label: 'Mínimo local  (H ≻ 0)', color: '#34d399' };
            if (l1 < -1e-9 && l2 < -1e-9) return { label: 'Máximo local  (H ≺ 0)', color: '#f87171' };
            if (Math.abs(l1) < 1e-9 || Math.abs(l2) < 1e-9) return { label: 'Inconcluso  (λ = 0)', color: '#fbbf24' };
            return { label: 'Punto de silla  (λ mixtos)', color: '#a78bfa' };
        };
        const classification = classifyPoint();

        // ── MODO: Superficie & curvas de nivel ───────────────────────────────
        if (mode === 'surface') {
            const xMin = -3, xMax = 3, yMin = -3, yMax = 3;
            const tw = x => 22 + (x - xMin) / (xMax - xMin) * (W - 38);
            const ty = y => H_c - 22 - (y - yMin) / (yMax - yMin) * (H_c - 48);

            // Calcular rango de z
            let zMin = Infinity, zMax = -Infinity;
            const res = 80;
            const zGrid = [];
            for (let i = 0; i < res; i++) {
                zGrid[i] = [];
                for (let j = 0; j < res; j++) {
                    const x = xMin + i / (res - 1) * (xMax - xMin);
                    const y = yMin + j / (res - 1) * (yMax - yMin);
                    const z = f(x, y);
                    zGrid[i][j] = z;
                    if (z < zMin) zMin = z;
                    if (z > zMax) zMax = z;
                }
            }

            // Curvas de nivel via marching squares simplificado
            const nLevels = 12;
            const levels = Array.from({ length: nLevels }, (_, k) =>
                zMin + (k + 0.5) * (zMax - zMin) / nLevels);

            levels.forEach((level, k) => {
                const t = k / nLevels;
                // Color: azul frío→rojo cálido
                const r = Math.round(11 + t * 244);
                const g = Math.round(18 + t * (113 - 18));
                const b = Math.round(250 + t * (113 - 250));
                ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
                ctx.lineWidth = 1.3;
                for (let i = 0; i < res - 1; i++) {
                    for (let j = 0; j < res - 1; j++) {
                        const x = xMin + i / (res - 1) * (xMax - xMin);
                        const y = yMin + j / (res - 1) * (yMax - yMin);
                        const ddx = (xMax - xMin) / (res - 1), ddy = (yMax - yMin) / (res - 1);
                        const z00 = zGrid[i][j], z10 = zGrid[i + 1][j];
                        const z01 = zGrid[i][j + 1], z11 = zGrid[i + 1][j + 1];
                        const cross = (za, zb) => (za < level) !== (zb < level) ? (level - za) / (zb - za) : null;
                        const pts = [];
                        const t01 = cross(z00, z10); if (t01 != null) pts.push([tw(x + t01 * ddx), ty(y)]);
                        const t12 = cross(z10, z11); if (t12 != null) pts.push([tw(x + ddx), ty(y + t12 * ddy)]);
                        const t23 = cross(z11, z01); if (t23 != null) pts.push([tw(x + (1 - t23) * ddx), ty(y + ddy)]);
                        const t30 = cross(z01, z00); if (t30 != null) pts.push([tw(x), ty(y + t30 * ddy)]);
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
            ctx.beginPath(); ctx.moveTo(tw(0), 22); ctx.lineTo(tw(0), H_c - 22); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(22, ty(0)); ctx.lineTo(W - 16, ty(0)); ctx.stroke();
            ctx.setLineDash([]);

            // Eigenvectores como flechas desde origen
            const drawArrow = (from, to, color, lw = 2.5, dash = []) => {
                const [x1, y1] = from, [x2, y2] = to;
                const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
                if (len < 2) return;
                const ux = dx / len, uy = dy / len;
                ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw;
                ctx.setLineDash(dash);
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
                ctx.setLineDash([]);
                const hw = 7, hl = 12;
                ctx.beginPath();
                ctx.moveTo(x2, y2);
                ctx.lineTo(x2 - hl * ux + hw * uy, y2 - hl * uy - hw * ux);
                ctx.lineTo(x2 - hl * ux - hw * uy, y2 - hl * uy + hw * ux);
                ctx.closePath(); ctx.fill();
            };

            const sc = 55;
            const mag1 = Math.sqrt(Math.abs(l1)) * 0.9 + 0.3;
            const mag2 = Math.sqrt(Math.abs(l2)) * 0.9 + 0.3;

            drawArrow(
                [tw(0), ty(0)],
                [tw(v1[0] * mag1), ty(v1[1] * mag1)],
                '#34d399', 2.5
            );
            drawArrow(
                [tw(0), ty(0)],
                [tw(v2[0] * mag2), ty(v2[1] * mag2)],
                '#fbbf24', 2.5
            );

            // Labels eigenvectores
            txt(`v₁  λ₁=${l1.toFixed(2)}`,
                tw(v1[0] * mag1) + 6, ty(v1[1] * mag1) - 6, '#34d399', 10, true);
            txt(`v₂  λ₂=${l2.toFixed(2)}`,
                tw(v2[0] * mag2) + 6, ty(v2[1] * mag2) - 6, '#fbbf24', 10, true);

            // Punto crítico
            ctx.beginPath(); ctx.arc(tw(0), ty(0), 7, 0, 2 * Math.PI);
            ctx.fillStyle = classification.color; ctx.fill();

            // Info
            txt(`f(x,y) = ½(${h11}x² + ${(2 * h12).toFixed(1)}xy + ${h22}y²)`,
                16, 18, '#60a5fa', 10, true);
            txt(classification.label, 16, H_c - 28, classification.color, 11, true);
            txt(`det(H)=${det.toFixed(3)}  κ(H)=${(Math.max(Math.abs(l1), Math.abs(l2)) / (Math.min(Math.abs(l1), Math.abs(l2)) + 1e-9)).toFixed(2)}`,
                16, H_c - 13, '#475569', 10);
        }

        // ── MODO: Eigenvalores & tipo ────────────────────────────────────────
        if (mode === 'eigen') {
            txt('Clasificación del punto crítico vía eigenvalores de H', 16, 20, '#60a5fa', 12, true);

            // Diagrama 2D de eigenvalores
            const cx = W / 2, cy = 170, R = 110;

            // Ejes λ₁, λ₂
            ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(cx - R - 20, cy); ctx.lineTo(cx + R + 20, cy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, cy - R - 20); ctx.lineTo(cx, cy + R + 20); ctx.stroke();
            txt('λ₁', cx + R + 8, cy + 4, '#475569', 10);
            txt('λ₂', cx - 8, cy - R - 8, '#475569', 10);

            // Cuadrantes coloreados
            const quadrants = [
                { x: 0, y: -R, w: R, h: R, color: '#34d399', label: 'Mínimo\nλ₁>0,λ₂>0', lx: cx + R / 2, ly: cy - R / 2 },
                { x: -R, y: -R, w: R, h: R, color: '#a78bfa', label: 'Silla', lx: cx - R / 2, ly: cy - R / 2 },
                { x: -R, y: 0, w: R, h: R, color: '#f87171', label: 'Máximo\nλ₁<0,λ₂<0', lx: cx - R / 2, ly: cy + R / 2 },
                { x: 0, y: 0, w: R, h: R, color: '#a78bfa', label: 'Silla', lx: cx + R / 2, ly: cy + R / 2 },
            ];
            quadrants.forEach(({ x, y, w, h, color, label, lx, ly }) => {
                ctx.fillStyle = color + '22'; ctx.fillRect(cx + x, cy + y, w, h);
                ctx.fillStyle = color + '88'; ctx.font = '9px monospace';
                label.split('\n').forEach((line, i) => ctx.fillText(line, lx - 22, ly - 4 + i * 13));
            });

            // Líneas λ=0
            ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 4]);
            ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke();
            ctx.setLineDash([]);

            // Punto actual (l1,l2) en el diagrama
            const scale = R / Math.max(Math.abs(l1), Math.abs(l2), 1.5) * 0.8;
            const px2 = cx + l1 * scale, py2 = cy - l2 * scale;
            ctx.beginPath(); ctx.arc(px2, py2, 8, 0, 2 * Math.PI);
            ctx.fillStyle = classification.color; ctx.fill();
            ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5; ctx.stroke();

            // Etiqueta punto
            txt(`(λ₁=${l1.toFixed(2)}, λ₂=${l2.toFixed(2)})`,
                px2 + 10, py2 - 8, classification.color, 10, true);

            // Hessiana numérica display
            const matY = 300;
            txt('H  =', 30, matY + 30, '#94a3b8', 11, true);
            const mox = 80, moy = matY + 10, mcW = 80, mcH = 32;
            [[h11, h12], [h12, h22]].forEach((row, i) => {
                row.forEach((val, j) => {
                    const alpha = Math.min(Math.abs(val) / 4, 0.6);
                    ctx.fillStyle = (val >= 0 ? '#60a5fa' : '#f87171') +
                        Math.round(alpha * 255).toString(16).padStart(2, '0');
                    ctx.fillRect(mox + j * mcW + 1, moy + i * mcH + 1, mcW - 2, mcH - 2);
                    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
                    ctx.strokeRect(mox + j * mcW + 1, moy + i * mcH + 1, mcW - 2, mcH - 2);
                    txt(val.toFixed(3), mox + j * mcW + 10, moy + i * mcH + mcH / 2 + 5, '#e2e8f0', 10, true);
                });
            });
            // Corchetes
            ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(mox - 4, moy); ctx.lineTo(mox - 9, moy);
            ctx.lineTo(mox - 9, moy + 2 * mcH); ctx.lineTo(mox - 4, moy + 2 * mcH); ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(mox + 2 * mcW + 4, moy); ctx.lineTo(mox + 2 * mcW + 9, moy);
            ctx.lineTo(mox + 2 * mcW + 9, moy + 2 * mcH); ctx.lineTo(mox + 2 * mcW + 4, moy + 2 * mcH); ctx.stroke();

            // Clasificación final
            txt(classification.label, 30, H_c - 28, classification.color, 12, true);
            txt(`tr(H)=${(h11 + h22).toFixed(3)}   det(H)=${det.toFixed(3)}`, 30, H_c - 12, '#475569', 10);
        }

        // ── MODO: Convergencia GD vs Newton ─────────────────────────────────
        if (mode === 'convergence') {
            const xMin = -3.2, xMax = 3.2, yMin = -3.2, yMax = 3.2;
            const tw = x => 20 + (x - xMin) / (xMax - xMin) * (W - 36);
            const ty = y => H_c - 20 - (y - yMin) / (yMax - yMin) * (H_c - 44);

            txt('Trayectorias: GD (rojo) vs Newton (verde)', 16, 20, '#60a5fa', 12, true);

            // Curvas de nivel
            const res = 70;
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
            const nLv = 8;
            Array.from({ length: nLv }, (_, k) => zMn + (k + 0.5) * (zMx - zMn) / nLv).forEach(level => {
                ctx.strokeStyle = 'rgba(96,165,250,0.12)'; ctx.lineWidth = 1;
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
            ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
            ctx.beginPath(); ctx.moveTo(tw(0), 20); ctx.lineTo(tw(0), H_c - 20); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(20, ty(0)); ctx.lineTo(W - 16, ty(0)); ctx.stroke();
            ctx.setLineDash([]);

            // Trayectorias
            const H_mat = [[h11, h12], [h12, h22]];
            const det2 = h11 * h22 - h12 * h12;

            const newtonStep = (x, y) => {
                const [gx, gy] = gf(x, y);
                if (Math.abs(det2) < 1e-9) return [x - 0.1 * gx, y - 0.1 * gy];
                const dx = -(h22 * gx - h12 * gy) / det2;
                const dy = -(-h12 * gx + h11 * gy) / det2;
                return [x + dx, y + dy];
            };

            const alpha = l1 > 1e-9 && l2 > 1e-9 ? 1.0 / Math.max(l1, l2) : 0.05;

            let xGD = [2.5, 2.0], xNT = [2.5, 2.0];
            const pathGD = [[...xGD]], pathNT = [[...xNT]];

            for (let k = 0; k < steps; k++) {
                const [gx, gy] = gf(xGD[0], xGD[1]);
                xGD = [xGD[0] - alpha * gx, xGD[1] - alpha * gy];
                pathGD.push([...xGD]);
                xNT = newtonStep(xNT[0], xNT[1]);
                pathNT.push([...xNT]);
            }

            // Dibujar trayectorias
            const drawPath = (path, color, dash = []) => {
                ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(dash);
                ctx.beginPath();
                path.forEach(([x, y], i) => {
                    i === 0 ? ctx.moveTo(tw(x), ty(y)) : ctx.lineTo(tw(x), ty(y));
                });
                ctx.stroke(); ctx.setLineDash([]);
                path.forEach(([x, y], i) => {
                    ctx.beginPath(); ctx.arc(tw(x), ty(y), 3.5, 0, 2 * Math.PI);
                    ctx.fillStyle = i === 0 ? '#e2e8f0' : color; ctx.fill();
                });
            };

            drawPath(pathGD, '#f87171');
            drawPath(pathNT, '#34d399', [5, 4]);

            // Origen (mínimo para H≻0)
            ctx.beginPath(); ctx.arc(tw(0), ty(0), 6, 0, 2 * Math.PI);
            ctx.fillStyle = '#fbbf24'; ctx.fill();
            txt('x*', (tw(0) + 8), (ty(0) - 6), '#fbbf24', 10, true);

            // Leyenda
            ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(16, H_c - 40); ctx.lineTo(44, H_c - 40); ctx.stroke();
            txt(`GD  α=1/λmax=${alpha.toFixed(3)}`, 50, H_c - 36, '#f87171', 10);
            ctx.strokeStyle = '#34d399'; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
            ctx.beginPath(); ctx.moveTo(16, H_c - 24); ctx.lineTo(44, H_c - 24); ctx.stroke();
            ctx.setLineDash([]);
            txt('Newton  (converge en 1 paso para cuadráticas)', 50, H_c - 20, '#34d399', 10);

            // Error final
            const errGD = Math.sqrt(xGD[0] ** 2 + xGD[1] ** 2);
            const errNT = Math.sqrt(xNT[0] ** 2 + xNT[1] ** 2);
            txt(`‖x_GD−x*‖=${errGD.toFixed(4)}`, W - 200, H_c - 36, '#f87171', 10);
            txt(`‖x_NT−x*‖=${errNT.toFixed(6)}`, W - 200, H_c - 20, '#34d399', 10);
        }

    }, [mode, h11, h12, h22, steps]);

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

                {/* Entradas de la Hessiana */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {[
                        { label: 'H₁₁', val: h11, set: setH11, color: '#60a5fa', min: -4, max: 4 },
                        { label: 'H₁₂', val: h12, set: setH12, color: '#a78bfa', min: -3, max: 3 },
                        { label: 'H₂₂', val: h22, set: setH22, color: '#34d399', min: -4, max: 4 },
                    ].map(({ label, val, set, color, min, max }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 130 }}>
                            <span style={{ color, fontSize: 10, minWidth: 56, fontFamily: 'monospace', fontWeight: 'bold' }}>
                                {label}={val.toFixed(1)}
                            </span>
                            <input type="range" min={min} max={max} step={0.1} value={val}
                                onChange={e => set(Number(e.target.value))}
                                style={{ flex: 1, accentColor: color }} />
                        </div>
                    ))}
                </div>

                {/* Pasos GD (solo convergence) */}
                {mode === 'convergence' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#94a3b8', fontSize: 11, minWidth: 120, fontFamily: 'monospace' }}>
                            Pasos GD/Newton: {steps}
                        </span>
                        <input type="range" min={1} max={20} step={1} value={steps}
                            onChange={e => setSteps(Number(e.target.value))}
                            style={{ flex: 1, accentColor: '#f87171' }} />
                    </div>
                )}

                <p style={{ color: '#475569', fontSize: 10, margin: 0, lineHeight: 1.6 }}>
                    <b style={{ color: '#94a3b8' }}>Superficie</b>: curvas de nivel + eigenvectores de H (direcciones principales de curvatura).&nbsp;
                    <b style={{ color: '#94a3b8' }}>Eigenvalores</b>: punto en diagrama (λ₁,λ₂) clasifica el punto crítico.&nbsp;
                    <b style={{ color: '#94a3b8' }}>Convergencia</b>: GD zigzaguea con κ(H) grande; Newton llega en 1 paso (cuadrática exacta).
                </p>
            </div>
        </div>
    );
}