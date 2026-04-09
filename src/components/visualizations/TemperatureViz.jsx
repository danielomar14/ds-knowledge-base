import { useState } from "react";

export default function TemperatureViz() {
  const [temp,setTemp]=useState(1.0),[topP,setTopP]=useState(0.9);
  const logits=[4.2,2.1,1.5,0.8,0.3,-0.5,-1.2,-2.0],words=["the","a","this","its","that","one","some","any"];
  const cols=["#60a5fa","#34d399","#a78bfa","#fbbf24","#f87171","#fb923c","#94a3b8","#64748b"];
  const sm=lgts=>{const sc=lgts.map(z=>z/temp),mx=Math.max(...sc),ex=sc.map(z=>Math.exp(z-mx)),s=ex.reduce((a,b)=>a+b,0);return ex.map(e=>e/s);};
  const probs=sm(logits);
  const sorted=[...probs].map((p,i)=>({p,i})).sort((a,b)=>b.p-a.p);
  let cs=0;const nuc=new Set();
  for(const{p,i}of sorted){nuc.add(i);cs+=p;if(cs>=topP)break;}
  return (
    <div className="viz-box">
      <div style={{display:"flex",gap:12,marginBottom:14}}>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:"#475569",marginBottom:4}}>T = {temp.toFixed(1)}</div>
          <input type="range" min={0.1} max={3} step={0.1} value={temp} onChange={e=>setTemp(+e.target.value)} style={{width:"100%",accentColor:"#60a5fa"}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:11,color:"#475569",marginBottom:4}}>Top-p = {topP.toFixed(2)}</div>
          <input type="range" min={0.1} max={1} step={0.01} value={topP} onChange={e=>setTopP(+e.target.value)} style={{width:"100%",accentColor:"#a78bfa"}}/>
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:5}}>
        {probs.map((p,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:34,fontSize:11,fontFamily:"monospace",color:nuc.has(i)?cols[i]:"#1e293b",transition:"color 0.2s"}}>"{words[i]}"</div>
            <div style={{flex:1,height:14,background:"rgba(255,255,255,0.04)",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${p*100}%`,background:nuc.has(i)?cols[i]:"rgba(55,65,81,0.3)",borderRadius:3,transition:"all 0.2s",opacity:nuc.has(i)?1:0.2}}/>
            </div>
            <div style={{width:40,fontSize:10,fontFamily:"monospace",color:"#475569",textAlign:"right"}}>{(p*100).toFixed(1)}%</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:10,fontSize:11,color:"#334155"}}>
        Nucleus ({nuc.size} tokens): <span style={{color:"#a78bfa"}}>{[...nuc].map(i=>`"${words[i]}"`).join(", ")}</span>
      </div>
    </div>
  );
}
