import { useState, useEffect, useRef } from "react";

export default function DotProductViz() {
  const canvasRef = useRef(null);
  const [angle, setAngle] = useState(45);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"), W = c.width, H = c.height, cx = W/2, cy = H/2, sc = 80;
    ctx.clearRect(0,0,W,H);
    for (let x=0;x<=W;x+=40){ctx.strokeStyle="rgba(255,255,255,0.04)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
    for (let y=0;y<=H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    ctx.strokeStyle="rgba(255,255,255,0.12)";
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
    const rad=(angle*Math.PI)/180, u=[2,0], v=[2*Math.cos(rad),2*Math.sin(rad)];
    const dot=u[0]*v[0]+u[1]*v[1];
    const arrow=(vx,vy,col,lbl)=>{
      const ex=cx+vx*sc,ey=cy-vy*sc;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(ex,ey);ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.stroke();
      const hl=12,a=Math.atan2(ey-cy,ex-cx);
      ctx.beginPath();ctx.moveTo(ex,ey);
      ctx.lineTo(ex-hl*Math.cos(a-0.4),ey-hl*Math.sin(a-0.4));
      ctx.lineTo(ex-hl*Math.cos(a+0.4),ey-hl*Math.sin(a+0.4));
      ctx.closePath();ctx.fillStyle=col;ctx.fill();
      ctx.font="bold 13px monospace";ctx.fillStyle=col;ctx.fillText(lbl,ex+8,ey-6);
    };
    const pL=dot/(u[0]**2+u[1]**2);
    ctx.beginPath();ctx.setLineDash([4,4]);
    ctx.moveTo(cx+v[0]*sc,cy-v[1]*sc);ctx.lineTo(cx+pL*u[0]*sc,cy);
    ctx.strokeStyle="rgba(251,191,36,0.4)";ctx.lineWidth=1.5;ctx.stroke();ctx.setLineDash([]);
    arrow(u[0],u[1],"#60a5fa","u");arrow(v[0],v[1],"#34d399","v");
    ctx.beginPath();ctx.arc(cx,cy,36,-rad,0,true);ctx.strokeStyle="rgba(251,191,36,0.8)";ctx.lineWidth=1.5;ctx.stroke();
    ctx.font="12px monospace";ctx.fillStyle="#fbbf24";ctx.fillText("θ",cx+40,cy-10);
    ctx.font="bold 13px monospace";ctx.fillStyle=dot>0.01?"#34d399":dot<-0.01?"#f87171":"#94a3b8";
    ctx.fillText(`u·v = ${dot.toFixed(2)}`,10,H-28);
    ctx.fillStyle="rgba(255,255,255,0.3)";ctx.font="11px monospace";
    ctx.fillText(`cos θ = ${Math.cos(rad).toFixed(3)}`,10,H-10);
  },[angle]);
  return (
    <div className="viz-box">
      <canvas ref={canvasRef} width={340} height={220} style={{width:"100%",borderRadius:8}}/>
      <div className="viz-ctrl">
        <span style={{color:"#475569",fontSize:11}}>θ = {angle}°</span>
        <input type="range" min={0} max={180} value={angle} onChange={e=>setAngle(+e.target.value)} style={{flex:1,accentColor:"#60a5fa"}}/>
      </div>
    </div>
  );
}
