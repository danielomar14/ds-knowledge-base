import { useState, useEffect, useRef } from "react";
import { concepts } from './data/concepts.js';
import DotProductViz from './components/visualizations/DotProductViz';
import BayesViz from './components/visualizations/BayesViz';
import GradientViz from './components/visualizations/GradientViz';
import TemperatureViz from './components/visualizations/TemperatureViz';
import NumeroRealViz from './components/visualizations/NumeroRealViz';
import NumeroComplejoViz from './components/visualizations/NumeroComplejoViz';
import CampoAlgebraViz from './components/visualizations/CampoAlgebraViz';
import VariableViz from './components/visualizations/VariableViz';
import FuncionViz from './components/visualizations/FuncionViz';
import DominioRangoViz from './components/visualizations/DominioRangoViz';
import ComposicionFuncionesViz from './components/visualizations/ComposicionFuncionesViz';
import FuncionInversaViz from './components/visualizations/FuncionInversaViz';
import FuncionLinealNoLinealViz from './components/visualizations/FuncionLinealNoLinealViz';
import FuncionConvexaConcavaViz from './components/visualizations/FuncionConvexaConcavaViz';
import LimitesContinuidadViz from './components/visualizations/LimitesContinuidadViz';
import VectorViz from './components/visualizations/VectorViz';

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



const vizMap={dotproduct:DotProductViz,bayes:BayesViz,gradient:GradientViz,temperature:TemperatureViz,numeroReal:NumeroRealViz,numeroComplejo:NumeroComplejoViz,campoAlgebra:CampoAlgebraViz,variable:VariableViz,funcion:FuncionViz,dominioRango:DominioRangoViz,composicionFunciones:ComposicionFuncionesViz,funcionInversa:FuncionInversaViz,funcionLinealNoLineal:FuncionLinealNoLinealViz,funcionConvexaConcava:FuncionConvexaConcavaViz,limitesContinuidad:LimitesContinuidadViz,vector:VectorViz};
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