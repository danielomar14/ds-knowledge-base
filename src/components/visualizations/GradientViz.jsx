import { useState, useEffect, useRef } from "react";

export default function GradientViz() {
  const canvasRef=useRef(null),[pt,setPt]=useState({x:2.5,y:2.0}),[run,setRun]=useState(false);
  const animRef=useRef(null);
  const f=(x,y)=>x*x+2*y*y, gr=(x,y)=>[2*x,4*y];
  useEffect(()=>{
    const c=canvasRef.current;if(!c)return;
    const ctx=c.getContext("2d"),W=c.width,H=c.height,cx=W/2,cy=H/2,sc=50;
    ctx.clearRect(0,0,W,H);
    [0.5,2,4.5,8,12.5,18,24.5].forEach((lv,li)=>{
      ctx.strokeStyle=`rgba(96,165,250,${0.1+li*0.04})`;ctx.lineWidth=1;ctx.beginPath();let first=true;
      for(let t=0;t<=360;t+=2){const r2=(t*Math.PI)/180,r=Math.sqrt(lv),rx=r*Math.cos(r2),ry=r*Math.sin(r2)/Math.sqrt(2);const px=cx+rx*sc,py=cy-ry*sc;if(first){ctx.moveTo(px,py);first=false;}else ctx.lineTo(px,py);}
      ctx.closePath();ctx.stroke();
    });
    ctx.strokeStyle="rgba(255,255,255,0.1)";ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(W,cy);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,H);ctx.stroke();
    const {x,y}=pt,[gx,gy]=gr(x,y),gm=Math.sqrt(gx*gx+gy*gy)||1;
    const nx=gx/gm,ny=gy/gm,as=40,px2=cx+x*sc,py2=cy-y*sc;
    [[nx,ny,"#f87171","∇f"],[-nx,-ny,"#34d399","-∇f"]].forEach(([dx,dy,col,lbl])=>{
      ctx.beginPath();ctx.moveTo(px2,py2);ctx.lineTo(px2+dx*as,py2-dy*as);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();
      ctx.font="10px monospace";ctx.fillStyle=col;ctx.fillText(lbl,px2+dx*as+3,py2-dy*as+4);
    });
    ctx.beginPath();ctx.arc(px2,py2,5,0,Math.PI*2);ctx.fillStyle="#fbbf24";ctx.fill();
    ctx.beginPath();ctx.arc(cx,cy,4,0,Math.PI*2);ctx.fillStyle="#60a5fa";ctx.fill();
    ctx.font="11px monospace";ctx.fillStyle="rgba(255,255,255,0.35)";
    ctx.fillText(`f(${x.toFixed(2)}, ${y.toFixed(2)}) = ${f(x,y).toFixed(3)}`,8,H-10);
  },[pt]);
  useEffect(()=>{
    if(run){animRef.current=setInterval(()=>{setPt(p=>{const[gx,gy]=gr(p.x,p.y),nx=p.x-0.08*gx,ny=p.y-0.08*gy;if(Math.abs(nx)<0.05&&Math.abs(ny)<0.05){setRun(false);return{x:0,y:0};}return{x:nx,y:ny};});},60);}
    else clearInterval(animRef.current);
    return()=>clearInterval(animRef.current);
  },[run]);
  return (
    <div className="viz-box">
      <canvas ref={canvasRef} width={340} height={220} style={{width:"100%",borderRadius:8}}/>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <button onClick={()=>{setPt({x:2.5,y:2.0});setRun(false);}} style={{flex:1,padding:"6px 0",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:6,color:"#64748b",cursor:"pointer",fontSize:12}}>Reset</button>
        <button onClick={()=>setRun(r=>!r)} style={{flex:2,padding:"6px 0",background:run?"rgba(248,113,113,0.1)":"rgba(52,211,153,0.1)",border:`1px solid ${run?"#f87171":"#34d399"}`,borderRadius:6,color:run?"#f87171":"#34d399",cursor:"pointer",fontSize:12,fontWeight:600}}>
          {run?"⏸ Pausar":"▶ Gradient Descent"}
        </button>
      </div>
    </div>
  );
}
