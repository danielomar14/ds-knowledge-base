import { useState } from "react";

export default function BayesViz() {
  const [prev, setPrev] = useState(1), [sens, setSens] = useState(99);
  const PE=prev/100, PpE=sens/100, Pps=0.05;
  const Pp=PpE*PE+Pps*(1-PE), post=(PpE*PE)/Pp;
  const col=post>0.7?"#f87171":post>0.3?"#fbbf24":"#34d399";
  return (
    <div className="viz-box">
      <div style={{display:"flex",gap:12,marginBottom:14}}>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:"#475569",marginBottom:4}}>Prevalencia: {prev.toFixed(1)}%</div>
          <input type="range" min={0.1} max={20} step={0.1} value={prev} onChange={e=>setPrev(+e.target.value)} style={{width:"100%",accentColor:"#60a5fa"}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:"#475569",marginBottom:4}}>Sensibilidad: {sens.toFixed(1)}%</div>
          <input type="range" min={50} max={99.9} step={0.1} value={sens} onChange={e=>setSens(+e.target.value)} style={{width:"100%",accentColor:"#34d399"}}/>
        </div>
      </div>
      <div style={{background:"rgba(255,255,255,0.03)",borderRadius:8,padding:12,marginBottom:12}}>
        <div style={{fontSize:11,color:"#334155",marginBottom:8}}>P(enfermo | test positivo)</div>
        <div style={{height:28,background:"rgba(255,255,255,0.05)",borderRadius:6,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${post*100}%`,background:col,borderRadius:6,transition:"all 0.3s",display:"flex",alignItems:"center",paddingLeft:10,fontSize:13,fontWeight:"bold",color:"#0f172a",fontFamily:"monospace"}}>{(post*100).toFixed(1)}%</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
        {[["Prior P(E)",(PE*100).toFixed(2)+"%","#60a5fa"],["Likelihood",sens.toFixed(1)+"%","#a78bfa"],["P(positivo)",(Pp*100).toFixed(2)+"%","#fbbf24"]].map(([l,v,c])=>(
          <div key={l} style={{background:"rgba(255,255,255,0.03)",borderRadius:6,padding:8,textAlign:"center"}}>
            <div style={{fontSize:10,color:"#334155"}}>{l}</div>
            <div style={{fontSize:13,fontWeight:"bold",color:c,fontFamily:"monospace"}}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
