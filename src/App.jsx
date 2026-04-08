import { useState, useEffect, useRef } from "react";
import { concepts } from './data/concepts.js';

const katexCSS = document.createElement("link");
katexCSS.rel = "stylesheet";
katexCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css";
document.head.appendChild(katexCSS);
const katexScript = document.createElement("script");
katexScript.src = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js";
document.head.appendChild(katexScript);

function KTex({ tex, display = false }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(!!window.katex);
  useEffect(() => {
    if (window.katex) { setReady(true); return; }
    const iv = setInterval(() => { if (window.katex) { setReady(true); clearInterval(iv); } }, 80);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => {
    if (!ready || !ref.current) return;
    try { window.katex.render(tex, ref.current, { displayMode: display, throwOnError: false, errorColor: "#f87171" }); }
    catch (e) { ref.current.textContent = tex; }
  }, [tex, display, ready]);
  return <span ref={ref} />;
}

function MathText({ text }) {
  if (!text) return null;
  const parts = text.split(/(\$[^$]+\$)/g);
  return <>{parts.map((p, i) => p.startsWith("$") && p.endsWith("$") ? <KTex key={i} tex={p.slice(1,-1)} /> : <span key={i}>{p}</span>)}</>;
}

function DevBody({ text }) {
  const parts = text.split(/((?:\$\$[\s\S]*?\$\$)|(?:\$[^$\n]+\$))/g);
  return (
    <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.85, fontFamily: "'IBM Plex Mono', monospace" }}>
      {parts.map((part, i) => {
        if (part.startsWith("$$") && part.endsWith("$$"))
          return <div key={i} style={{ margin: "10px 0", padding: "8px 14px", background: "rgba(96,165,250,0.06)", borderRadius: 6, textAlign: "center" }}><KTex tex={part.slice(2,-2).trim()} display /></div>;
        if (part.startsWith("$") && part.endsWith("$"))
          return <KTex key={i} tex={part.slice(1,-1)} />;
        return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part}</span>;
      })}
    </div>
  );
}


// ---- Visualizations ----

function DotProductViz() {
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

function BayesViz() {
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

function GradientViz() {
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

function TemperatureViz() {
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

const vizMap={dotproduct:DotProductViz,bayes:BayesViz,gradient:GradientViz,temperature:TemperatureViz};
const sectionColors={"Álgebra Lineal":"#60a5fa","Probabilidad":"#a78bfa","Cálculo y Optimización":"#34d399","LLMs Avanzados":"#fb923c","Fundamentos Numéricos":"#f472b6","Machine Learning":"#38bdf8","Deep Learning":"#818cf8"};

export default function App() {
  const [sel,setSel]=useState(concepts[0]),[tab,setTab]=useState("definition");
  const [search,setSearch]=useState(""),[sidebar,setSidebar]=useState(true);

  const filtered=search.length>1
    ?concepts.filter(c=>c.name.toLowerCase().includes(search.toLowerCase())||c.section.toLowerCase().includes(search.toLowerCase())||c.tags.some(t=>t.includes(search.toLowerCase())))
    :concepts;

  const VizComp=sel.hasViz?vizMap[sel.vizType]:null;
  const ac=sectionColors[sel.section]||"#60a5fa";

  return (
    <div style={{minHeight:"100vh",background:"#080c14",color:"#e2e8f0",fontFamily:"'IBM Plex Sans',system-ui,sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.07);border-radius:4px;}
        input[type=range]{height:3px;border-radius:2px;cursor:pointer;}
        .tbtn{padding:6px 14px;border-radius:6px;border:none;cursor:pointer;font-size:12px;font-weight:500;transition:all 0.15s;font-family:inherit;}
        .tbtn.on{background:rgba(96,165,250,0.12);color:#60a5fa;}
        .tbtn.off{background:transparent;color:#334155;}
        .tbtn.off:hover{color:#64748b;}
        .ccard{padding:10px 12px;border-radius:8px;cursor:pointer;border:1px solid transparent;transition:all 0.15s;}
        .ccard:hover{background:rgba(255,255,255,0.04);}
        .ccard.sel{background:rgba(96,165,250,0.07);border-color:rgba(96,165,250,0.18);}
        .mblock{background:rgba(255,255,255,0.04);border-left:2px solid rgba(96,165,250,0.3);border-radius:0 6px 6px 0;padding:12px 16px;margin:8px 0;text-align:center;overflow-x:auto;}
        .pitem{padding:7px 12px;background:rgba(255,255,255,0.03);border-radius:5px;margin:4px 0;overflow-x:auto;}
        .dsect{border-left:2px solid rgba(255,255,255,0.07);padding-left:14px;margin:14px 0;}
        .dlbl{font-size:10px;font-weight:600;color:#334155;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;}
        .code{background:#060a10;border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:14px;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#7dd3fc;overflow-x:auto;line-height:1.7;white-space:pre;}
        .rtag{display:inline-block;padding:4px 10px;border-radius:6px;font-size:11px;background:rgba(96,165,250,0.07);color:#60a5fa;margin:3px;border:1px solid rgba(96,165,250,0.14);cursor:pointer;transition:all 0.15s;}
        .rtag:hover{background:rgba(96,165,250,0.14);}
        .stag{display:inline-block;padding:2px 8px;border-radius:12px;font-size:10px;background:rgba(255,255,255,0.05);color:#334155;margin:2px;}
        .viz-box{background:#0b1220;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px;}
        .viz-ctrl{display:flex;align-items:center;gap:12px;margin-top:10px;}
        .slbl{font-size:10px;color:#334155;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;}
        .sidebar-wrap{transition:width 0.25s ease;overflow:hidden;border-right:1px solid rgba(255,255,255,0.06);flex-shrink:0;}
        .sidebar-wrap.open{width:200px;}
        .sidebar-wrap.closed{width:0;border-right:none;}
        .toggle{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:5px 9px;cursor:pointer;color:#334155;transition:all 0.15s;font-size:13px;line-height:1;}
        .toggle:hover{color:#94a3b8;background:rgba(255,255,255,0.08);}
        .katex{font-size:1em;}
        .katex-display{overflow-x:auto;overflow-y:hidden;}
      `}</style>

      {/* Header */}
      <div style={{padding:"11px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <button className="toggle" onClick={()=>setSidebar(s=>!s)} title={sidebar?"Ocultar panel":"Mostrar panel"}>
          {sidebar?"◀":"▶"}
        </button>
        <div style={{fontSize:13,fontWeight:600,color:"#f1f5f9",letterSpacing:"-0.01em"}}>DS·KB</div>
        <div style={{flex:1,maxWidth:380,marginLeft:8}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar concepto..."
            style={{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"6px 12px",color:"#e2e8f0",fontSize:13,outline:"none",fontFamily:"inherit"}}/>
        </div>
        <div style={{fontSize:11,color:"#1e293b",marginLeft:"auto"}}>{concepts.length} conceptos</div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden",height:"calc(100vh - 50px)"}}>

        {/* Sidebar */}
        <div className={`sidebar-wrap ${sidebar?"open":"closed"}`}>
          <div style={{overflowY:"auto",height:"100%",padding:"10px 8px"}}>
            {filtered.map(c=>(
              <div key={c.id} className={`ccard ${sel.id===c.id?"sel":""}`}
                onClick={()=>{setSel(c);setTab("definition");}}>
                <div style={{fontSize:10,color:sectionColors[c.section]||"#64748b",fontWeight:600,marginBottom:2}}>§{c.sectionCode}</div>
                <div style={{fontSize:12,color:sel.id===c.id?"#e2e8f0":"#64748b",fontWeight:500,lineHeight:1.3}}>{c.name}</div>
              </div>
            ))}
            {filtered.length===0&&<div style={{padding:16,color:"#1e293b",fontSize:12,textAlign:"center"}}>Sin resultados</div>}
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
          {/* Header */}
          <div style={{marginBottom:18}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap"}}>
              <span style={{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:4,textTransform:"uppercase",letterSpacing:"0.07em",background:`${ac}18`,color:ac}}>{sel.section}</span>
              {sel.tags.map(t=><span key={t} className="stag">{t}</span>)}
            </div>
            <h1 style={{fontSize:21,fontWeight:600,letterSpacing:"-0.02em",color:"#f1f5f9",marginBottom:8}}>{sel.name}</h1>
            <p style={{fontSize:14,color:"#64748b",lineHeight:1.6}}>{sel.definition}</p>
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:4,marginBottom:20,borderBottom:"1px solid rgba(255,255,255,0.05)",paddingBottom:10}}>
            {[["definition","📐 Formal"],["development","📖 Desarrollo"],["code","💻 Código"]].map(([t,l])=>(
              <button key={t} className={`tbtn ${tab===t?"on":"off"}`} onClick={()=>setTab(t)}>{l}</button>
            ))}
          </div>

          {/* FORMAL */}
          {tab==="definition"&&(
            <div>
              <div style={{marginBottom:18}}>
                <div className="slbl">Definición formal</div>
                <div style={{fontSize:12,color:"#475569",marginBottom:8,fontFamily:"IBM Plex Mono,monospace"}}><MathText text={sel.formal.notation}/></div>
                <div className="mblock"><KTex tex={sel.formal.body} display/></div>
              </div>
              {sel.formal.geometric&&(
                <div style={{marginBottom:18}}>
                  <div className="slbl">Formulación equivalente</div>
                  <div className="mblock"><KTex tex={sel.formal.geometric} display/></div>
                </div>
              )}
              <div style={{marginBottom:20}}>
                <div className="slbl">Propiedades</div>
                {sel.formal.properties.map((p,i)=><div key={i} className="pitem"><KTex tex={p}/></div>)}
              </div>
              <div style={{padding:"12px 16px",background:"rgba(251,191,36,0.04)",border:"1px solid rgba(251,191,36,0.1)",borderRadius:8,marginBottom:20}}>
                <div style={{fontSize:10,color:"#78716c",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.08em"}}>💡 Intuición</div>
                <DevBody text={sel.intuition}/>
              </div>
              {VizComp&&(
                <div style={{marginBottom:20}}>
                  <div className="slbl">📊 Visualización interactiva</div>
                  <VizComp/>
                </div>
              )}
              <div>
                <div className="slbl">Relacionados</div>
                {sel.related.map(r=><span key={r} className="rtag">{r}</span>)}
              </div>
            </div>
          )}

          {/* DEVELOPMENT */}
          {tab==="development"&&(
            <div>
              {sel.development.map((d,i)=>(
                <div key={i} className="dsect">
                  <div className="dlbl">{d.label}</div>
                  <DevBody text={d.body}/>
                </div>
              ))}
            </div>
          )}

          {/* CODE */}
          {tab==="code"&&(
            <div>
              <div className="slbl">Implementación Python</div>
              <div className="code">{sel.code}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}