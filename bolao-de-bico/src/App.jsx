import { useState, useRef, useEffect } from "react";

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{-webkit-font-smoothing:antialiased;background:#040c06;}
@keyframes floatBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
@keyframes popIn{0%{transform:scale(0.6);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes confettiFall{0%{transform:translateY(-30px) rotate(0deg);opacity:1}100%{transform:translateY(110vh) rotate(780deg);opacity:0}}
@keyframes coinSpin{0%{transform:rotateY(0deg) scale(1)}40%{transform:rotateY(720deg) scale(1.3)}70%{transform:rotateY(1440deg) scale(1.1)}100%{transform:rotateY(1800deg) scale(1)}}
@keyframes coinReveal{0%{opacity:0;transform:scale(0.5) translateY(20px)}100%{opacity:1;transform:scale(1) translateY(0)}}
@keyframes tapPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(0.92);opacity:0.7}}
@keyframes glowGreen{0%,100%{box-shadow:0 0 0 0 rgba(76,175,80,0)}50%{box-shadow:0 0 0 8px rgba(76,175,80,0.25)}}
@keyframes tapFlash{0%{opacity:0}25%{opacity:1}100%{opacity:0}}
.float{animation:floatBob 3s ease-in-out infinite;}
.pop{animation:popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards;}
.fadeUp{animation:fadeUp 0.4s ease forwards;}
@media print{.no-print{display:none!important;}body{background:white!important;}#print-chart{background:white!important;color:#111!important;}}
`;

/* ─── TEAMS ──────────────────────────────────────────────────────────────── */
const GROUPS = [
  {id:"A",bg:"#0e2218",teams:[{name:"México",flag:"🇲🇽",rating:76,color:"#006847"},{name:"África do Sul",flag:"🇿🇦",rating:61,color:"#007A4D"},{name:"Coreia do Sul",flag:"🇰🇷",rating:73,color:"#CD2E3A"},{name:"Rep. Tcheca",flag:"🇨🇿",rating:67,color:"#D7141A"}]},
  {id:"B",bg:"#0e1422",teams:[{name:"Canadá",flag:"🇨🇦",rating:71,color:"#FF0000"},{name:"Bósnia",flag:"🇧🇦",rating:65,color:"#0032A0"},{name:"Catar",flag:"🇶🇦",rating:59,color:"#8D1B3D"},{name:"Suíça",flag:"🇨🇭",rating:75,color:"#D52B1E"}]},
  {id:"C",bg:"#220e0e",teams:[{name:"Brasil",flag:"🇧🇷",rating:85,color:"#009C3B"},{name:"Marrocos",flag:"🇲🇦",rating:74,color:"#C1272D"},{name:"Haiti",flag:"🇭🇹",rating:56,color:"#00209F"},{name:"Escócia",flag:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",rating:68,color:"#003078"}]},
  {id:"D",bg:"#102210",teams:[{name:"EUA",flag:"🇺🇸",rating:74,color:"#002868"},{name:"Paraguai",flag:"🇵🇾",rating:66,color:"#D52B1E"},{name:"Austrália",flag:"🇦🇺",rating:69,color:"#00843D"},{name:"Turquia",flag:"🇹🇷",rating:71,color:"#E30A17"}]},
  {id:"E",bg:"#1e1e0a",teams:[{name:"Alemanha",flag:"🇩🇪",rating:83,color:"#555"},{name:"Curaçao",flag:"🇨🇼",rating:57,color:"#003DA5"},{name:"Costa do Marfim",flag:"🇨🇮",rating:70,color:"#F77F00"},{name:"Equador",flag:"🇪🇨",rating:68,color:"#E87722"}]},
  {id:"F",bg:"#0a0a22",teams:[{name:"Holanda",flag:"🇳🇱",rating:82,color:"#FF6600"},{name:"Japão",flag:"🇯🇵",rating:76,color:"#BC002D"},{name:"Suécia",flag:"🇸🇪",rating:71,color:"#006AA7"},{name:"Tunísia",flag:"🇹🇳",rating:64,color:"#E70013"}]},
  {id:"G",bg:"#1e0a1e",teams:[{name:"Bélgica",flag:"🇧🇪",rating:80,color:"#EF3340"},{name:"Egito",flag:"🇪🇬",rating:68,color:"#C8102E"},{name:"Irã",flag:"🇮🇷",rating:67,color:"#239F40"},{name:"Nova Zelândia",flag:"🇳🇿",rating:59,color:"#00247D"}]},
  {id:"H",bg:"#1e0a14",teams:[{name:"Espanha",flag:"🇪🇸",rating:86,color:"#AA151B"},{name:"Cabo Verde",flag:"🇨🇻",rating:61,color:"#003893"},{name:"Arábia Saudita",flag:"🇸🇦",rating:65,color:"#006C35"},{name:"Uruguai",flag:"🇺🇾",rating:77,color:"#75AADB"}]},
  {id:"I",bg:"#081a10",teams:[{name:"França",flag:"🇫🇷",rating:87,color:"#002395"},{name:"Senegal",flag:"🇸🇳",rating:74,color:"#00853F"},{name:"Iraque",flag:"🇮🇶",rating:59,color:"#CE1126"},{name:"Noruega",flag:"🇳🇴",rating:75,color:"#EF2B2D"}]},
  {id:"J",bg:"#0a1a1a",teams:[{name:"Argentina",flag:"🇦🇷",rating:88,color:"#74ACDF"},{name:"Argélia",flag:"🇩🇿",rating:67,color:"#006233"},{name:"Áustria",flag:"🇦🇹",rating:74,color:"#ED2939"},{name:"Jordânia",flag:"🇯🇴",rating:62,color:"#007A3D"}]},
  {id:"K",bg:"#14081e",teams:[{name:"Portugal",flag:"🇵🇹",rating:84,color:"#006600"},{name:"Congo (RD)",flag:"🇨🇩",rating:60,color:"#007FFF"},{name:"Uzbequistão",flag:"🇺🇿",rating:63,color:"#1EB53A"},{name:"Colômbia",flag:"🇨🇴",rating:78,color:"#FCD116"}]},
  {id:"L",bg:"#1e0808",teams:[{name:"Inglaterra",flag:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",rating:83,color:"#012169"},{name:"Croácia",flag:"🇭🇷",rating:74,color:"#FF0000"},{name:"Gana",flag:"🇬🇭",rating:64,color:"#006B3F"},{name:"Panamá",flag:"🇵🇦",rating:62,color:"#DA121A"}]},
];

/* ─── SCORE ENGINE ───────────────────────────────────────────────────────── */
function weighted(opts){const t=opts.reduce((s,[,w])=>s+w,0);let r=Math.random()*t;for(const[v,w]of opts){r-=w;if(r<=0)return v;}return opts[opts.length-1][0];}
function genScore(result,hR,aR){
  const winR=result==="home"?hR:aR,losR=result==="home"?aR:hR,gap=winR-losR;
  if(result==="draw"){const s=gap<=5?weighted([[0,20],[1,45],[2,25],[3,10]]):gap<=14?weighted([[0,30],[1,50],[2,18],[3,2]]):weighted([[0,50],[1,42],[2,8]]);return{h:s,a:s};}
  let wg,lg;
  if(gap>=25){wg=weighted([[2,10],[3,30],[4,35],[5,20],[6,5]]);lg=weighted([[0,70],[1,25],[2,5]]);}
  else if(gap>=15){wg=weighted([[1,10],[2,30],[3,35],[4,20],[5,5]]);lg=weighted([[0,55],[1,35],[2,10]]);}
  else if(gap>=8){wg=weighted([[1,20],[2,38],[3,28],[4,12],[5,2]]);lg=weighted([[0,42],[1,40],[2,16],[3,2]]);}
  else if(gap>=0){wg=weighted([[1,40],[2,35],[3,18],[4,6],[5,1]]);lg=weighted([[0,30],[1,42],[2,22],[3,6]]);}
  else{wg=weighted([[1,55],[2,30],[3,12],[4,3]]);lg=weighted([[0,35],[1,40],[2,20],[3,5]]);}
  lg=Math.min(lg,Math.max(0,wg-1));
  return result==="home"?{h:wg,a:lg}:{h:lg,a:wg};
}
function winPct(hR,aR){const h=Math.min(Math.max(Math.round(50+(hR-aR)*1.25),12),88);return{h,a:100-h};}

/* ─── UTILITIES ──────────────────────────────────────────────────────────── */
function getMatches(g){const t=GROUPS[g].teams,m=[];for(let i=0;i<t.length;i++)for(let j=i+1;j<t.length;j++)m.push({h:i,a:j});return m;}
function calcStandings(g,scores){
  const rows=GROUPS[g].teams.map(t=>({...t,pts:0,w:0,d:0,l:0,gf:0,ga:0,gd:0,mp:0}));
  getMatches(g).forEach((m,mi)=>{
    const s=scores[`g${g}_m${mi}`];if(!s)return;
    const H=rows[m.h],A=rows[m.a];
    H.gf+=s.h;H.ga+=s.a;H.mp++;A.gf+=s.a;A.ga+=s.h;A.mp++;H.gd=H.gf-H.ga;A.gd=A.gf-A.ga;
    if(s.h>s.a){H.pts+=3;H.w++;A.l++;}else if(s.a>s.h){A.pts+=3;A.w++;H.l++;}else{H.pts++;A.pts++;H.d++;A.d++;}
  });
  return rows.sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf);
}
function groupProg(g,preds){let n=0;for(let i=0;i<6;i++)if(preds[`g${g}_m${i}`])n++;return n;}
function buildR32(scores){
  const all=GROUPS.map((_,i)=>calcStandings(i,scores));
  // Grupo indices: A=0 B=1 C=2 D=3 E=4 F=5 G=6 H=7 I=8 J=9 K=10 L=11
  const w=all.map((s,i)=>({...s[0],groupId:GROUPS[i].id,pos:"1º"}));
  const r=all.map((s,i)=>({...s[1],groupId:GROUPS[i].id,pos:"2º"}));

  // Collect 8 best 3rd-place teams sorted by pts/gd/gf
  const thirds=all
    .map((s,i)=>s[2]?{...s[2],groupIdx:i,groupId:GROUPS[i].id,pos:"3º"}:null)
    .filter(Boolean)
    .sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf)
    .slice(0,8);

  // FIFA-defined 3rd-place pools for each R32 slot (group indices)
  // Slot order: [M74, M77, M79, M80, M81, M82, M85, M87]
  const POOLS=[
    [0,1,2,3,5],   // M74: A,B,C,D,F
    [2,3,5,6,7],   // M77: C,D,F,G,H
    [2,4,5,7,8],   // M79: C,E,F,H,I
    [4,7,8,9,10],  // M80: E,H,I,J,K
    [1,4,5,8,9],   // M81: B,E,F,I,J
    [0,4,7,8,9],   // M82: A,E,H,I,J
    [4,5,6,8,9],   // M85: E,F,G,I,J
    [3,4,8,9,11],  // M87: D,E,I,J,L
  ];

  // Greedy pool allocation: assign best available 3rd-place team per slot
  const t3slots=new Array(8).fill(null);
  const usedIdx=new Set();
  for(let slot=0;slot<8;slot++){
    for(const t of thirds){
      if(!usedIdx.has(t.groupIdx)&&POOLS[slot].includes(t.groupIdx)){
        t3slots[slot]=t; usedIdx.add(t.groupIdx); break;
      }
    }
    // Fallback: melhor restante independente do pool
    if(!t3slots[slot]){
      for(const t of thirds){
        if(!usedIdx.has(t.groupIdx)){t3slots[slot]=t;usedIdx.add(t.groupIdx);break;}
      }
    }
  }
  const t=(i)=>{
    const team=t3slots[i];
    if(!team){console.error(`[buildR32] No valid 3rd-place team for slot ${i}. Pool: ${JSON.stringify(POOLS[i])}`);return{name:"???",flag:"❓",rating:60,color:"#888",pos:"3º",groupId:"?"};}
    return team;
  };

  // R32 — exact FIFA 2026 bracket (match numbers 73–88)
  return[
    {h:r[0], a:r[1]},   // M73: Ru-A vs Ru-B
    {h:w[4], a:t(0)},   // M74: W-E  vs 3rd-ABCDF
    {h:w[5], a:r[2]},   // M75: W-F  vs Ru-C
    {h:w[2], a:r[5]},   // M76: W-C  vs Ru-F
    {h:w[8], a:t(1)},   // M77: W-I  vs 3rd-CDFGH
    {h:r[4], a:r[8]},   // M78: Ru-E vs Ru-I
    {h:w[0], a:t(2)},   // M79: W-A  vs 3rd-CEFHI
    {h:w[11],a:t(3)},   // M80: W-L  vs 3rd-EHIJK
    {h:w[3], a:t(4)},   // M81: W-D  vs 3rd-BEFIJ
    {h:w[6], a:t(5)},   // M82: W-G  vs 3rd-AEHIJ
    {h:r[10],a:r[11]},  // M83: Ru-K vs Ru-L
    {h:w[7], a:r[9]},   // M84: W-H  vs Ru-J
    {h:w[1], a:t(6)},   // M85: W-B  vs 3rd-EFGIJ
    {h:w[9], a:r[7]},   // M86: W-J  vs Ru-H
    {h:w[10],a:t(7)},   // M87: W-K  vs 3rd-DEIJL
    {h:r[3], a:r[6]},   // M88: Ru-D vs Ru-G
  ];
}
function simulateAllGroups(){
  const sc={},pr={},dn=new Set();
  GROUPS.forEach((_,gi)=>{
    getMatches(gi).forEach((m,mi)=>{
      const H=GROUPS[gi].teams[m.h],A=GROUPS[gi].teams[m.a];
      const pct=winPct(H.rating,A.rating);
      const dc=Math.max(5,28-Math.abs(H.rating-A.rating)*0.7);
      const rand=Math.random()*100;
      const result=rand<dc?"draw":rand<dc+pct.h*((100-dc)/100)?"home":"away";
      const key=`g${gi}_m${mi}`;pr[key]=result;sc[key]=genScore(result,H.rating,A.rating);
    });dn.add(gi);
  });
  return{sc,pr,dn};
}

/* ─── COIN FLIP ──────────────────────────────────────────────────────────── */
function CoinFlip({homeTeam,awayTeam,onDone}){
  const[phase,setPhase]=useState("flip");const[winner,setWinner]=useState(null);const done=useRef(false);
  const onDoneRef=useRef(onDone);
  useEffect(()=>{onDoneRef.current=onDone;},[onDone]);
  useEffect(()=>{
    const w=Math.random()<0.5?"home":"away";
    const t1=setTimeout(()=>{setWinner(w);setPhase("reveal");},1800);
    const t2=setTimeout(()=>{if(!done.current){done.current=true;onDoneRef.current(w);}},2900);
    return()=>{clearTimeout(t1);clearTimeout(t2);};
  },[]);
  const team=winner==="home"?homeTeam:awayTeam;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:24}}>
      <p style={{fontFamily:"Fredoka One,cursive",fontSize:22,color:"rgba(255,255,255,0.6)"}}>⚡ Vai para os Pênaltis!</p>
      <div style={{width:110,height:110,borderRadius:"50%",background:"linear-gradient(135deg,#FFD700,#FF8C00)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:52,animation:phase==="flip"?"coinSpin 1.8s cubic-bezier(0.22,0.61,0.36,1) forwards":"none",boxShadow:"0 8px 40px rgba(255,215,0,0.5)"}}>🪙</div>
      {phase==="reveal"&&team&&(<div style={{animation:"coinReveal 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",display:"flex",flexDirection:"column",alignItems:"center",gap:10}}><span style={{fontSize:70}}>{team.flag}</span><p style={{fontFamily:"Fredoka One,cursive",fontSize:26,color:"#FFD700"}}>{team.name} vence! 🎉</p></div>)}
    </div>
  );
}

/* ─── SCORE EDITOR ───────────────────────────────────────────────────────── */
function ScoreEditor({score,homeTeam,awayTeam,isPen,penWinner,isKO,onSave,onClose}){
  const[h,setH]=useState(score.h);const[a,setA]=useState(score.a);
  // penWinner: "home"|"away"|null — only relevant when isKO and score is tied
  const initPen=isPen?(penWinner||"home"):null;
  const[pw,setPw]=useState(initPen); // which side won on penalties
  const isTied=h===a;
  const showPenToggle=isKO&&isTied;
  // keep pw in sync when score changes: if not tied anymore, clear it
  const Btn=({onClick,label})=><button onClick={onClick} style={{width:36,height:36,borderRadius:"50%",border:"none",fontSize:18,background:"rgba(255,255,255,0.12)",color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Fredoka One,cursive"}}>{label}</button>;
  const canSave=!isKO||h!==a||pw!=null;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.84)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center",padding:24}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#0e2018",border:"1.5px solid rgba(255,255,255,0.13)",borderRadius:24,padding:"28px 24px",width:"min(320px,92vw)",display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
        <p style={{fontFamily:"Fredoka One,cursive",fontSize:18,color:"#FFD700"}}>✏️ Editar Placar</p>
        {isPen&&!isTied&&<p style={{fontFamily:"Nunito,sans-serif",fontSize:11,color:"rgba(255,152,0,0.8)",textAlign:"center"}}>Decidido nos pênaltis — placar do tempo regulamentar</p>}
        <div style={{display:"flex",alignItems:"center",gap:20,justifyContent:"center"}}>
          {[{t:homeTeam,v:h,set:setH},{t:awayTeam,v:a,set:setA}].map((item,i)=>(
            <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
              <span style={{fontSize:36}}>{item.t.flag}</span>
              <span style={{fontFamily:"Fredoka One,cursive",fontSize:10,color:"rgba(255,255,255,0.6)",textAlign:"center",maxWidth:72,lineHeight:1.2}}>{item.t.name}</span>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Btn onClick={()=>item.set(Math.max(0,item.v-1))} label="−"/>
                <span style={{fontFamily:"Fredoka One,cursive",fontSize:32,color:"white",minWidth:28,textAlign:"center"}}>{item.v}</span>
                <Btn onClick={()=>item.set(item.v+1)} label="+"/>
              </div>
            </div>
          ))}
        </div>
        {/* Pen winner toggle — appears only when score is tied in a KO match */}
        {showPenToggle&&(
          <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
            <p style={{fontFamily:"Nunito,sans-serif",fontSize:11,color:"rgba(255,152,0,0.85)",textAlign:"center"}}>🪙 Quem venceu nos pênaltis?</p>
            <div style={{display:"flex",gap:8,width:"100%"}}>
              {[{side:"home",team:homeTeam},{side:"away",team:awayTeam}].map(({side,team})=>{
                const active=pw===side;
                return(
                  <button key={side} onClick={()=>setPw(side)} style={{flex:1,padding:"10px 6px",borderRadius:14,border:`1.5px solid ${active?"#FFD700":"rgba(255,255,255,0.13)"}`,background:active?"rgba(255,215,0,0.15)":"rgba(255,255,255,0.05)",color:active?"#FFD700":"rgba(255,255,255,0.5)",fontFamily:"Fredoka One,cursive",fontSize:13,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.15s"}}>
                    <span style={{fontSize:26}}>{team.flag}</span>
                    <span style={{fontSize:11,lineHeight:1.2,textAlign:"center"}}>{team.name}</span>
                    {active&&<span style={{fontSize:10}}>🏆</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:10,width:"100%"}}>
          <button onClick={onClose} style={{flex:1,padding:"12px",borderRadius:16,border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.55)",fontFamily:"Fredoka One,cursive",fontSize:14,cursor:"pointer"}}>Cancelar</button>
          <button onClick={()=>canSave&&onSave({h,a,penWinner:isTied?pw:null})} style={{flex:1.4,padding:"12px",borderRadius:16,border:"none",background:canSave?"linear-gradient(135deg,#43A047,#2E7D32)":"rgba(255,255,255,0.1)",color:canSave?"white":"rgba(255,255,255,0.3)",fontFamily:"Fredoka One,cursive",fontSize:15,cursor:canSave?"pointer":"default",transition:"all 0.15s"}}>Salvar ✓</button>
        </div>
      </div>
    </div>
  );
}

/* ─── SWIPE CARD ─────────────────────────────────────────────────────────── */
// Interaction:
//   • Tap left half  → left  (home) team vence
//   • Tap right half → right (away) team vence
//   • Toque em VS center  → draw (group) / coin-flip (KO)  — no emoji on the button
//   • Swipe left/right also still works via window listeners
function SwipeCard({homeTeam,awayTeam,matchNum,total,onResult,isKO=false,is3rd=false}){
  const[offset,setOffset]=useState(0);
  const[stage,setStage]=useState("idle");
  const[showCoin,setShowCoin]=useState(false);
  const[tapFlash,setTapFlash]=useState(null); // "home"|"away"|"draw" for 120ms flash
  const THRESH=85;
  const dr=useRef({active:false,startX:0,offset:0,fired:false});
  const fireRef=useRef(null);

  fireRef.current=(r)=>{
    if(dr.current.fired)return;
    dr.current.fired=true; // lock immediately before any branch
    if((isKO||is3rd)&&r==="draw"){setShowCoin(true);return;}
    dr.current.active=false;
    setStage(r==="home"?"out-l":r==="away"?"out-r":"out-draw");
    setTimeout(()=>onResult(r),r==="draw"?680:520);
  };

  useEffect(()=>{
    const move=(cx)=>{if(!dr.current.active)return;const o=cx-dr.current.startX;dr.current.offset=o;setOffset(o);};
    const end=()=>{
      if(!dr.current.active)return;dr.current.active=false;
      const o=dr.current.offset;
      if(Math.abs(o)>=THRESH)fireRef.current(o<0?"home":"away");
      else{setOffset(0);setStage("idle");}
    };
    const onMM=e=>move(e.clientX);
    const onTM=e=>{e.preventDefault();move(e.touches[0].clientX);};
    window.addEventListener("mousemove",onMM);window.addEventListener("mouseup",end);
    window.addEventListener("touchmove",onTM,{passive:false});window.addEventListener("touchend",end);window.addEventListener("touchcancel",end);
    return()=>{window.removeEventListener("mousemove",onMM);window.removeEventListener("mouseup",end);window.removeEventListener("touchmove",onTM);window.removeEventListener("touchend",end);window.removeEventListener("touchcancel",end);};
  },[]);

  const onDown=(e)=>{
    if(dr.current.fired)return;
    const cx="touches"in e?e.touches[0].clientX:e.clientX;
    dr.current.startX=cx;dr.current.offset=0;dr.current.active=true;setStage("drag");
  };

  // Zone tap — fires only when swipe movement was small (genuine tap)
  const onZoneTap=(r)=>(e)=>{
    if(dr.current.fired)return;
    if(Math.abs(dr.current.offset)>=50)return; // was a swipe — let onEnd handle it
    e.stopPropagation();
    // Flash the tapped side briefly before animating out
    setTapFlash(r);
    setTimeout(()=>fireRef.current(r),110);
  };

  const pct=winPct(homeTeam.rating||72,awayTeam.rating||72);
  const toL=offset<0&&stage==="drag",toR=offset>0&&stage==="drag";
  const prog=Math.min(Math.abs(offset)/THRESH,1);
  const tx=stage==="out-l"?"-160vw":stage==="out-r"?"160vw":`${offset}px`;
  const rot=stage==="drag"?`${offset*0.048}deg`:stage==="out-l"?"-12deg":stage==="out-r"?"12deg":"0deg";
  const tr=stage==="drag"?"none":stage==="idle"?"transform 0.42s cubic-bezier(0.34,1.56,0.64,1)":"transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)";

  const gap=pct.h-pct.a,isEven=Math.abs(gap)<=4;
  const GREEN="linear-gradient(90deg,#66BB6A,#43A047)",RED="linear-gradient(90deg,#EF5350,#C62828)",NEUT="linear-gradient(90deg,#64B5F6,#42A5F5)";
  const homeBarBg=isEven?NEUT:gap>0?GREEN:RED;
  const awayBarBg=isEven?NEUT:gap<0?GREEN:RED;

  // Side background: blend swipe highlight + tap flash
  const homeBg=()=>{
    if(tapFlash==="home")return"rgba(76,175,80,0.32)";
    if(tapFlash==="draw") return"rgba(255,215,0,0.12)";
    return`rgba(76,175,80,${toL?prog*0.18:0})`;
  };
  const awayBg=()=>{
    if(tapFlash==="away")return"rgba(255,82,82,0.32)";
    if(tapFlash==="draw") return"rgba(255,215,0,0.12)";
    return`rgba(255,82,82,${toR?prog*0.18:0})`;
  };

  return(
    <>
      {showCoin&&<CoinFlip homeTeam={homeTeam} awayTeam={awayTeam} onDone={w=>{setShowCoin(false);onResult("pen-"+w);}}/>}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,width:"100%",maxWidth:400}}>
        {/* Dots */}
        <div style={{display:"flex",gap:5}}>
          {Array.from({length:total},(_,i)=>(
            <div key={i} style={{width:i===matchNum-1?22:7,height:7,borderRadius:4,background:i<matchNum-1?"#4CAF50":i===matchNum-1?"#FFD700":"rgba(255,255,255,0.15)",transition:"all 0.3s"}}/>
          ))}
        </div>
        <p style={{fontFamily:"Nunito,sans-serif",color:"rgba(255,255,255,0.38)",fontSize:12,textAlign:"center"}}>
          {isKO||is3rd
            ?"⚡ Toque em um lado · VS = 🪙 pênaltis!"
            :"Toque em um lado · Toque em VS = empate"}
        </p>
        {/* Card */}
        <div
          onMouseDown={e=>{e.preventDefault();onDown(e);}}
          onTouchStart={e=>{e.preventDefault();onDown(e);}}
          style={{width:"min(340px,90vw)",borderRadius:26,background:stage==="out-draw"?"linear-gradient(135deg,#FFFDE7,#FFF9C4)":"white",boxShadow:`0 24px 70px rgba(0,0,0,0.45)${toL?`,0 0 0 ${prog*3.5}px #4CAF50`:toR?`,0 0 0 ${prog*3.5}px #FF5252`:""}`,transform:`translateX(${tx}) rotate(${rot})`,transition:tr,cursor:stage==="drag"?"grabbing":"grab",userSelect:"none",touchAction:"none",overflow:"hidden",display:"flex",flexDirection:"column",position:"relative"}}
        >
          {toL&&prog>0.52&&<div style={{position:"absolute",top:12,left:14,background:"#4CAF50",color:"white",fontFamily:"Fredoka One,cursive",fontSize:13,padding:"3px 13px",borderRadius:20,transform:"rotate(-9deg)",zIndex:5,boxShadow:"0 3px 12px rgba(0,0,0,0.25)"}}>WIN! ✅</div>}
          {toR&&prog>0.52&&<div style={{position:"absolute",top:12,right:14,background:"#FF5252",color:"white",fontFamily:"Fredoka One,cursive",fontSize:13,padding:"3px 13px",borderRadius:20,transform:"rotate(9deg)",zIndex:5,boxShadow:"0 3px 12px rgba(0,0,0,0.25)"}}>WIN! ✅</div>}
          {stage==="out-draw"&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:56,zIndex:10}}>🤝</div>}

          <div style={{display:"flex"}}>
            {/* ── Home half — tap zone ── */}
            <div
              onPointerUp={onZoneTap("home")}
              style={{flex:1,padding:"22px 12px 14px",display:"flex",flexDirection:"column",alignItems:"center",gap:5,background:homeBg(),borderRight:"1px solid rgba(0,0,0,0.07)",transition:"background 0.1s",cursor:"pointer",userSelect:"none"}}
            >
              <div style={{fontSize:48,lineHeight:1}}>{homeTeam.flag}</div>
              <div style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"#111",textAlign:"center",lineHeight:1.25}}>{homeTeam.name}</div>
              <div style={{width:32,height:3,borderRadius:2,background:homeTeam.color||"#ccc"}}/>
              <div style={{height:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {pct.h>=75&&<span style={{fontFamily:"Nunito,sans-serif",fontSize:10,fontWeight:800,color:"#E65100"}}>Grande favorita 🔥</span>}
              </div>
            </div>

            {/* ── VS — tap = draw / penalties ── */}
            <div
              onPointerUp={onZoneTap("draw")}
              style={{width:38,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,cursor:"pointer",flexShrink:0,background:tapFlash==="draw"?"rgba(255,215,0,0.15)":"transparent",transition:"background 0.1s"}}
            >
              <span style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"#bbb"}}>VS</span>
              {/* Small draw hint — text only, no emoji */}
              <span style={{fontFamily:"Nunito,sans-serif",fontSize:8,color:"rgba(0,0,0,0.22)",textAlign:"center",lineHeight:1.2,marginTop:2}}>
                {isKO||is3rd?"pen":"draw"}
              </span>
            </div>

            {/* ── Away half — tap zone ── */}
            <div
              onPointerUp={onZoneTap("away")}
              style={{flex:1,padding:"22px 12px 14px",display:"flex",flexDirection:"column",alignItems:"center",gap:5,background:awayBg(),borderLeft:"1px solid rgba(0,0,0,0.07)",transition:"background 0.1s",cursor:"pointer",userSelect:"none"}}
            >
              <div style={{fontSize:48,lineHeight:1}}>{awayTeam.flag}</div>
              <div style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"#111",textAlign:"center",lineHeight:1.25}}>{awayTeam.name}</div>
              <div style={{width:32,height:3,borderRadius:2,background:awayTeam.color||"#ccc"}}/>
              <div style={{height:18,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {pct.a>=75&&<span style={{fontFamily:"Nunito,sans-serif",fontSize:10,fontWeight:800,color:"#E65100"}}>Grande favorita 🔥</span>}
              </div>
            </div>
          </div>

          {/* Strength bar — always visible */}
          <div style={{padding:"0 16px 14px",display:"flex",flexDirection:"column",gap:4}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"Nunito,sans-serif",fontSize:10,fontWeight:700,color:gap>4?"#388E3C":gap<-4?"#999":"#5C8BC4"}}>{pct.h}%</span>
              <span style={{fontFamily:"Nunito,sans-serif",fontSize:10,color:"rgba(0,0,0,0.32)"}}>quem é mais forte?</span>
              <span style={{fontFamily:"Nunito,sans-serif",fontSize:10,fontWeight:700,color:gap<-4?"#388E3C":gap>4?"#999":"#5C8BC4"}}>{pct.a}%</span>
            </div>
            <div style={{display:"flex",height:7,borderRadius:6,overflow:"hidden",gap:2}}>
              <div style={{flex:pct.h,background:homeBarBg,borderRadius:"6px 0 0 6px"}}/>
              <div style={{flex:pct.a,background:awayBarBg,borderRadius:"0 6px 6px 0"}}/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── CONFETTI ───────────────────────────────────────────────────────────── */
function Confetti(){const c=["#FFD700","#FF6B6B","#4CAF50","#64B5F6","#FF9800","#E91E63","#9C27B0"];return<>{Array.from({length:20},(_,i)=><div key={i} style={{position:"fixed",top:"-30px",left:`${(i*5.1)%100}%`,width:10+(i%4)*3,height:10+(i%3)*4,background:c[i%c.length],borderRadius:i%3===0?"50%":i%3===1?"2px":"0",animation:`confettiFall ${1.8+(i%5)*0.35}s ${(i%6)*0.18}s ease-in infinite`,zIndex:0,pointerEvents:"none"}}/>)}</>;}

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const ROUND_ORDER=["r32","r16","qf","sf","final"];
const ROUND_LABEL={r32:"Rodada de 32",r16:"Oitavas de Final",qf:"Quartas de Final",sf:"Semifinais",final:"⚽ Grande Final!"};
const ROUND_ICON={r32:"🔥",r16:"⚡",qf:"💥",sf:"🌟",final:"👑"};
const ROUND_NEXT={r32:"r16",r16:"qf",qf:"sf",sf:"final"};
const ROUND_PREV={r16:"r32",qf:"r16",sf:"qf",final:"sf"};
// Fixed bracket pairings — index into previous round's winners array
// R16: which two R32 winners meet (0-indexed from the 16-match R32 array)
// QF: which two R16 winners meet, etc.
const KO_PAIRINGS={
  r16:[[1,4],[0,2],[3,5],[6,7],[10,11],[8,9],[13,15],[12,14]],
  // M89=R32[1]vsR32[4], M90=R32[0]vsR32[2], M91=R32[3]vsR32[5], M92=R32[6]vsR32[7]
  // M93=R32[10]vsR32[11], M94=R32[8]vsR32[9], M95=R32[13]vsR32[15], M96=R32[12]vsR32[14]
  qf:[[0,1],[4,5],[2,3],[6,7]],
  // QF1=R16[0]vsR16[1], QF2=R16[4]vsR16[5], QF3=R16[2]vsR16[3], QF4=R16[6]vsR16[7]
  sf:[[0,1],[2,3]],
  // SF1=QF[0]vsQF[1], SF2=QF[2]vsQF[3]
  final:[[0,1]],
};
const BG={minHeight:"100vh",background:"radial-gradient(ellipse at 50% 0%,#0e2616 0%,#040c06 65%)",display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 14px 48px",overflowX:"hidden"};
const BTN={
  green:{background:"linear-gradient(135deg,#43A047,#2E7D32)",color:"white",border:"none",borderRadius:20,padding:"14px 36px",fontSize:17,fontFamily:"Fredoka One,cursive",cursor:"pointer",boxShadow:"0 6px 22px rgba(76,175,80,0.38)"},
  orange:{background:"linear-gradient(135deg,#FB8C00,#E64A19)",color:"white",border:"none",borderRadius:20,padding:"14px 36px",fontSize:17,fontFamily:"Fredoka One,cursive",cursor:"pointer",boxShadow:"0 6px 22px rgba(255,152,0,0.38)"},
  bronze:{background:"linear-gradient(135deg,#A97C50,#7B5232)",color:"white",border:"none",borderRadius:20,padding:"14px 36px",fontSize:17,fontFamily:"Fredoka One,cursive",cursor:"pointer",boxShadow:"0 6px 22px rgba(169,124,80,0.4)"},
  ghost:{background:"rgba(255,255,255,0.07)",color:"rgba(255,255,255,0.75)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:18,padding:"12px 24px",fontSize:15,fontFamily:"Fredoka One,cursive",cursor:"pointer"},
  sim:{background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.5)",border:"1px dashed rgba(255,255,255,0.2)",borderRadius:18,padding:"10px 20px",fontSize:13,fontFamily:"Fredoka One,cursive",cursor:"pointer"},
};

/* ─── ONBOARDING COMPONENTS (exact from approved preview) ───────────────────── */

function MiniCard({ animClass, highlightSide }) {
  return (
    <div className={animClass} style={{ width: 240, borderRadius: 20, background: "white", boxShadow: "0 16px 48px rgba(0,0,0,0.5)", overflow: "hidden", flexShrink: 0 }}>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, padding: "16px 8px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: highlightSide === "home" ? "rgba(76,175,80,0.15)" : "transparent", borderRight: "1px solid rgba(0,0,0,0.07)", transition: "background 0.2s" }}>
          <span style={{ fontSize: 34 }}>🇧🇷</span>
          <span style={{ fontFamily: "Fredoka One,cursive", fontSize: 11, color: "#111" }}>Brasil</span>
          <div style={{ width: 24, height: 2.5, borderRadius: 2, background: "#009C3B" }} />
        </div>
        <div style={{ width: 30, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <span style={{ fontFamily: "Fredoka One,cursive", fontSize: 11, color: "#bbb" }}>VS</span>
          <span style={{ fontFamily: "Nunito,sans-serif", fontSize: 8, color: "rgba(0,0,0,0.25)" }}>draw</span>
        </div>
        <div style={{ flex: 1, padding: "16px 8px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: highlightSide === "away" ? "rgba(255,82,82,0.15)" : "transparent", borderLeft: "1px solid rgba(0,0,0,0.07)", transition: "background 0.2s" }}>
          <span style={{ fontSize: 34 }}>🇭🇹</span>
          <span style={{ fontFamily: "Fredoka One,cursive", fontSize: 11, color: "#111" }}>Haiti</span>
          <div style={{ width: 24, height: 2.5, borderRadius: 2, background: "#00209F" }} />
        </div>
      </div>
      <div style={{ padding: "6px 12px 10px", display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "Nunito,sans-serif", fontSize: 9, fontWeight: 700, color: "#388E3C" }}>86%</span>
          <span style={{ fontFamily: "Nunito,sans-serif", fontSize: 9, color: "rgba(0,0,0,0.3)" }}>quem é mais forte?</span>
          <span style={{ fontFamily: "Nunito,sans-serif", fontSize: 9, color: "#999" }}>14%</span>
        </div>
        <div style={{ display: "flex", height: 5, borderRadius: 4, overflow: "hidden", gap: 2 }}>
          <div style={{ flex: 86, background: "linear-gradient(90deg,#66BB6A,#43A047)", borderRadius: "4px 0 0 4px" }} />
          <div style={{ flex: 14, background: "linear-gradient(90deg,#EF5350,#C62828)", borderRadius: "0 4px 4px 0" }} />
        </div>
      </div>
    </div>
  );
}

function MiniScoreRow({ h, a, hFlag, aFlag, hName, aName, highlight }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: highlight ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)", borderRadius: 12, padding: "8px 12px", border: highlight ? "1px solid rgba(255,215,0,0.3)" : "1px solid rgba(255,255,255,0.07)", transition: "all 0.2s" }}>
      <span style={{ fontSize: 16 }}>{hFlag}</span>
      <span style={{ fontFamily: "Fredoka One,cursive", fontSize: 10, color: h > a ? "#66BB6A" : "rgba(255,255,255,0.5)", flex: 1 }}>{hName}</span>
      <button style={{ fontFamily: "Fredoka One,cursive", fontSize: 15, color: "white", background: highlight ? "rgba(255,215,0,0.2)" : "rgba(255,215,0,0.1)", border: `1px solid ${highlight ? "rgba(255,215,0,0.5)" : "rgba(255,215,0,0.2)"}`, borderRadius: 8, padding: "2px 10px", cursor: "pointer", animation: highlight ? "glowGreen 1.8s ease-in-out infinite" : "none" }}>
        {h}–{a}
      </button>
      <span style={{ fontFamily: "Fredoka One,cursive", fontSize: 10, color: a > h ? "#66BB6A" : "rgba(255,255,255,0.5)", flex: 1, textAlign: "right" }}>{aName}</span>
      <span style={{ fontSize: 16 }}>{aFlag}</span>
    </div>
  );
}

function ObScreen1() {
  const [highlight, setHighlight] = useState(null);
  return (
    <div className="fadeUp" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "Fredoka One,cursive", fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Como jogar · 1 de 3</p>
        <h2 style={{ fontFamily: "Fredoka One,cursive", fontSize: 28, color: "#FFD700", lineHeight: 1.1 }}>Escolhendo o vencedor</h2>
      </div>
      <div style={{ position: "relative", display: "flex", justifyContent: "center", width: "100%" }}>
        <MiniCard animClass="" highlightSide={highlight} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 340 }}>
        <div onMouseEnter={() => setHighlight("home")} onMouseLeave={() => setHighlight(null)} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(76,175,80,0.1)", border: "1px solid rgba(76,175,80,0.25)", borderRadius: 14, padding: "11px 14px", cursor: "default" }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>👈</span>
          <div>
            <p style={{ fontFamily: "Fredoka One,cursive", fontSize: 14, color: "#66BB6A" }}>Toque ou deslize à esquerda</p>
            <p style={{ fontFamily: "Nunito,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>Time da esquerda vence</p>
          </div>
        </div>
        <div onMouseEnter={() => setHighlight("away")} onMouseLeave={() => setHighlight(null)} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,82,82,0.1)", border: "1px solid rgba(255,82,82,0.22)", borderRadius: 14, padding: "11px 14px", cursor: "default" }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>👉</span>
          <div>
            <p style={{ fontFamily: "Fredoka One,cursive", fontSize: 14, color: "#EF9A9A" }}>Toque ou deslize à direita</p>
            <p style={{ fontFamily: "Nunito,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>Time da direita vence</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 14, padding: "11px 14px" }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>⚽</span>
          <div>
            <p style={{ fontFamily: "Fredoka One,cursive", fontSize: 14, color: "#FFD700" }}>Toque em VS</p>
            <p style={{ fontFamily: "Nunito,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>Empate (grupos) ou pênaltis (mata-mata)</p>
          </div>
        </div>
      </div>
      <p style={{ fontFamily: "Nunito,sans-serif", fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>Passe o dedo nas setas acima para visualizar ↑</p>
    </div>
  );
}

function ObScreen2() {
  const [h, setH] = useState(3);
  const [a, setA] = useState(0);
  const Btn = ({ onClick, label }) => (
    <button onClick={onClick} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", fontSize: 16, background: "rgba(255,255,255,0.12)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Fredoka One,cursive" }}>{label}</button>
  );
  return (
    <div className="fadeUp" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "Fredoka One,cursive", fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Como jogar · 2 de 3</p>
        <h2 style={{ fontFamily: "Fredoka One,cursive", fontSize: 28, color: "#FFD700", lineHeight: 1.1 }}>Editando placares</h2>
        <p style={{ fontFamily: "Nunito,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 8, maxWidth: 280 }}>Os gols são gerados automaticamente — qualquer placar pode ser ajustado depois.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7, width: "100%", maxWidth: 340 }}>
        <MiniScoreRow h={2} a={0} hFlag="🇲🇽" aFlag="🇿🇦" hName="México" aName="África do Sul" highlight={false} />
        <MiniScoreRow h={h} a={a} hFlag="🇧🇷" aFlag="🇭🇹" hName="Brasil" aName="Haiti" highlight={true} />
        <MiniScoreRow h={1} a={1} hFlag="🇰🇷" aFlag="🇨🇿" hName="Coreia do Sul" aName="Tchéquia" highlight={false} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div className="tapPulse" style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,215,0,0.2)", border: "1.5px solid rgba(255,215,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>☝️</div>
        <p style={{ fontFamily: "Nunito,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Toque no placar para abrir o editor</p>
      </div>
      <div style={{ width: "100%", maxWidth: 310, background: "#0e2018", border: "1.5px solid rgba(255,255,255,0.13)", borderRadius: 20, padding: "20px 20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <p style={{ fontFamily: "Fredoka One,cursive", fontSize: 15, color: "#FFD700" }}>✏️ Editar Placar</p>
        <div style={{ display: "flex", alignItems: "center", gap: 20, justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 28 }}>🇧🇷</span>
            <span style={{ fontFamily: "Fredoka One,cursive", fontSize: 10, color: "rgba(255,255,255,0.55)" }}>Brasil</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Btn onClick={() => setH(Math.max(0, h - 1))} label="−" />
              <span style={{ fontFamily: "Fredoka One,cursive", fontSize: 26, color: "white", minWidth: 22, textAlign: "center" }}>{h}</span>
              <Btn onClick={() => setH(h + 1)} label="+" />
            </div>
          </div>
          <span style={{ fontFamily: "Fredoka One,cursive", fontSize: 18, color: "rgba(255,255,255,0.25)" }}>–</span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 28 }}>🇭🇹</span>
            <span style={{ fontFamily: "Fredoka One,cursive", fontSize: 10, color: "rgba(255,255,255,0.55)" }}>Haiti</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Btn onClick={() => setA(Math.max(0, a - 1))} label="−" />
              <span style={{ fontFamily: "Fredoka One,cursive", fontSize: 26, color: "white", minWidth: 22, textAlign: "center" }}>{a}</span>
              <Btn onClick={() => setA(a + 1)} label="+" />
            </div>
          </div>
        </div>
        <p style={{ fontFamily: "Nunito,sans-serif", fontSize: 10, color: "rgba(255,255,255,0.28)", textAlign: "center" }}>Funciona nas fases de grupos e mata-mata</p>
      </div>
    </div>
  );
}

function ObScreen3() {
  const examples = [
    { hFlag:"🇦🇷", aFlag:"🇫🇷", hName:"Argentina", aName:"França",   hPct:51, label:"Δ1 — praticamente iguais",      badge:false },
    { hFlag:"🇩🇪", aFlag:"🇨🇴", hName:"Alemanha",   aName:"Colômbia", hPct:56, label:"Δ5 — leve vantagem",     badge:false },
    { hFlag:"🇪🇸", aFlag:"🇺🇾", hName:"Espanha",     aName:"Uruguai",  hPct:66, label:"Δ13 — favorita clara",badge:false },
    { hFlag:"🇧🇷", aFlag:"🇭🇹", hName:"Brasil",    aName:"Haiti",    hPct:86, label:"Δ29 — grande favorita 🔥",badge:true  },
  ];
  return (
    <div className="fadeUp" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontFamily: "Fredoka One,cursive", fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Como jogar · 3 de 3</p>
        <h2 style={{ fontFamily: "Fredoka One,cursive", fontSize: 28, color: "#FFD700", lineHeight: 1.1 }}>Força & placares</h2>
        <p style={{ fontFamily: "Nunito,sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 8, maxWidth: 300, lineHeight: 1.6 }}>
          Cada seleção tem uma nota baseada no <b style={{ color: "rgba(255,255,255,0.7)" }}>ranking oficial da FIFA</b>. A barra mostra a probabilidade de vitória — e os gols gerados refletem a diferença entre as seleções.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 340 }}>
        {examples.map((ex, i) => {
          const aPct = 100 - ex.hPct;
          const G = "linear-gradient(90deg,#66BB6A,#43A047)", R = "linear-gradient(90deg,#EF5350,#C62828)", N = "linear-gradient(90deg,#64B5F6,#42A5F5)";
          const even = Math.abs(ex.hPct - aPct) <= 4;
          return (
            <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 16 }}>{ex.hFlag}</span>
                  <span style={{ fontFamily: "Fredoka One,cursive", fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{ex.hName}</span>
                  <span style={{ fontFamily: "Nunito,sans-serif", fontSize: 9, color: "rgba(255,255,255,0.28)" }}>vs</span>
                  <span style={{ fontFamily: "Fredoka One,cursive", fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{ex.aName}</span>
                  <span style={{ fontSize: 16 }}>{ex.aFlag}</span>
                </div>
                {ex.badge && <span style={{ fontFamily: "Nunito,sans-serif", fontSize: 9, fontWeight: 800, color: "#E65100" }}>Grande favorita 🔥</span>}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontFamily: "Nunito,sans-serif", fontSize: 10, fontWeight: 700, color: ex.hPct >= aPct ? "#66BB6A" : "#999" }}>{ex.hPct}%</span>
                <span style={{ fontFamily: "Nunito,sans-serif", fontSize: 9, color: "rgba(255,255,255,0.22)" }}>{ex.label}</span>
                <span style={{ fontFamily: "Nunito,sans-serif", fontSize: 10, fontWeight: 700, color: aPct > ex.hPct ? "#66BB6A" : "#999" }}>{aPct}%</span>
              </div>
              <div style={{ display: "flex", height: 6, borderRadius: 4, overflow: "hidden", gap: 2 }}>
                <div style={{ flex: ex.hPct, background: even ? N : ex.hPct > aPct ? G : R, borderRadius: "4px 0 0 4px" }} />
                <div style={{ flex: aPct, background: even ? N : aPct > ex.hPct ? G : R, borderRadius: "0 4px 4px 0" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ width: "100%", maxWidth: 340, background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.15)", borderRadius: 14, padding: "12px 14px" }}>
        <p style={{ fontFamily: "Fredoka One,cursive", fontSize: 13, color: "#FFD700", marginBottom: 6 }}>⚽ Como os gols são calculados</p>
        <p style={{ fontFamily: "Nunito,sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
          Após sua escolha, os placares são gerados com base na <b style={{ color: "rgba(255,255,255,0.8)" }}>diferença de notas</b> — favoritas grandes ganham com mais folga (ex: 4–0), jogos equilibrados tendem a 1–0 ou 1–1. Sempre realista.
        </p>
      </div>
    </div>
  );
}

/* ─── BRACKET COMPONENTS ─────────────────────────────────────────────────── */
function BracketTeamCard({ team }) {
  if (!team) return (
    <div style={{ height:40, display:"flex", alignItems:"center", gap:8, padding:"0 10px", background:"rgba(255,255,255,0.03)", borderRadius:10, border:"1px dashed rgba(255,255,255,0.1)" }}>
      <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"Fredoka One,cursive" }}>?</span>
      </div>
      <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)", fontFamily:"Fredoka One,cursive" }}>A definir</span>
    </div>
  );
  return (
    <div style={{ height:40, display:"flex", alignItems:"center", gap:7, padding:"0 9px", background:"rgba(255,255,255,0.06)", borderRadius:10, border:"1px solid rgba(255,255,255,0.11)" }}>
      <span style={{ fontSize:19, lineHeight:1, flexShrink:0 }}>{team.flag}</span>
      <div style={{ flex:1, overflow:"hidden" }}>
        <div style={{ fontFamily:"Fredoka One,cursive", fontSize:12, color:"white", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", lineHeight:1.2 }}>{team.name}</div>
        {team.pos && <div style={{ fontFamily:"Nunito,sans-serif", fontSize:9, color:"rgba(255,255,255,0.32)", marginTop:1 }}>{team.pos}{team.groupId?` · Grp ${team.groupId}`:""}</div>}
      </div>
    </div>
  );
}

function BracketGroup({ matchA, matchB, nextLabel, matchNums }) {
  // Pixel geometry — all positions are exact so SVG lines align perfectly
  const cH = 40;   // card height
  const cG = 4;    // gap between the two cards within one match
  const mG = 12;   // gap between the two matches
  const SVG_W = 52; // width de SVG connector column
  const x1 = 20;   // first bend (match-level)
  const x2 = 34;   // second point (match winner stub)
  const x3 = 41;   // third bend (round-level)

  const totalH = cH * 4 + cG * 2 + mG;

  // Centre y de each card
  const y1   = cH / 2;
  const y2   = cH + cG + cH / 2;
  const y3   = cH * 2 + cG + mG + cH / 2;
  const y4   = cH * 3 + cG * 2 + mG + cH / 2;
  const m12  = (y1 + y2) / 2;   // midpoint de match A
  const m34  = (y3 + y4) / 2;   // midpoint de match B
  const mAll = (m12 + m34) / 2; // centre de entire group → QF/SF arrow

  const C = "#4CAF50"; // line colour
  const SW = 2;        // stroke width

  return (
    <div style={{ display:"flex", alignItems:"flex-start" }}>

      {/* Jogo number labels column */}
      <div style={{ width:30, flexShrink:0, display:"flex", flexDirection:"column" }}>
        <div style={{ height: cH * 2 + cG, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:4 }}>
          <span style={{ fontFamily:"Fredoka One,cursive", fontSize:9, color:"rgba(255,215,0,0.55)" }}>{matchNums?.[0]}</span>
        </div>
        <div style={{ height: mG }} />
        <div style={{ height: cH * 2 + cG, display:"flex", alignItems:"center", justifyContent:"flex-end", paddingRight:4 }}>
          <span style={{ fontFamily:"Fredoka One,cursive", fontSize:9, color:"rgba(255,215,0,0.55)" }}>{matchNums?.[1]}</span>
        </div>
      </div>

      {/* Team cards column */}
      <div style={{ flex:1, display:"flex", flexDirection:"column" }}>
        <BracketTeamCard team={matchA?.h} />
        <div style={{ height:cG }} />
        <BracketTeamCard team={matchA?.a} />
        <div style={{ height:mG }} />
        <BracketTeamCard team={matchB?.h} />
        <div style={{ height:cG }} />
        <BracketTeamCard team={matchB?.a} />
      </div>

      {/* SVG connector — two-level bracket lines */}
      <svg width={SVG_W} height={totalH} style={{ flexShrink:0, overflow:"visible" }}>
        {/* Jogo A: card 1 → bend right → drop to mid12 */}
        <path d={`M0,${y1} H${x1} V${m12} H${x2}`}   fill="none" stroke={C} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"/>
        {/* Jogo A: card 2 → bend right → rise to mid12 */}
        <path d={`M0,${y2} H${x1} V${m12}`}            fill="none" stroke={C} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"/>
        {/* Jogo B: card 3 → bend right → drop to mid34 */}
        <path d={`M0,${y3} H${x1} V${m34} H${x2}`}   fill="none" stroke={C} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"/>
        {/* Jogo B: card 4 → bend right → rise to mid34 */}
        <path d={`M0,${y4} H${x1} V${m34}`}            fill="none" stroke={C} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"/>
        {/* Round level: mid12 → bend → drop to midAll → to edge */}
        <path d={`M${x2},${m12} H${x3} V${mAll} H${SVG_W}`} fill="none" stroke={C} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"/>
        {/* Round level: mid34 → bend → rise to midAll */}
        <path d={`M${x2},${m34} H${x3} V${mAll}`}     fill="none" stroke={C} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round"/>
        {/* Dot at the convergence point */}
        <circle cx={SVG_W} cy={mAll} r={3} fill={C}/>
      </svg>

      {/* Next round box — vertically centred */}
      <div style={{ flexShrink:0, height:totalH, display:"flex", alignItems:"center" }}>
        <div style={{ background:"rgba(76,175,80,0.1)", border:"1.5px solid rgba(76,175,80,0.35)", borderRadius:12, padding:"8px 7px", textAlign:"center", width:54 }}>
          <div style={{ fontSize:16 }}>🏆</div>
          <div style={{ fontFamily:"Fredoka One,cursive", fontSize:9, color:"#66BB6A", lineHeight:1.35, marginTop:2 }}>{nextLabel}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App(){
  const[view,setView]=useState("welcome");
  const[gIdx,setGIdx]=useState(0);const[mIdx,setMIdx]=useState(0);
  const[scores,setScores]=useState({});const[preds,setPreds]=useState({});const[doneG,setDoneG]=useState(new Set());
  const[editG,setEditG]=useState(null);const[editKO,setEditKO]=useState(null);
  const[obScreen,setObScreen]=useState(0);
  const[revTab,setRevTab]=useState("teams");
  const[koReturnView,setKoReturnView]=useState("ko-reveal"); // where ← goes from match 0
  const[koRound,setKoRound]=useState("r32");const[koMIdx,setKoMIdx]=useState(0);
  const[koMatches,setKoMatches]=useState({});const[koScores,setKoScores]=useState({});
  const[koWinners,setKoWinners]=useState({});const[koPen,setKoPen]=useState({});
  // 3rd place match
  const[thirdMatch,setThirdMatch]=useState(null);
  const[thirdScore,setThirdScore]=useState(null);
  const[thirdWinner,setThirdWinner]=useState(null);
  const[thirdLoser,setThirdLoser]=useState(null);
  const[thirdPen,setThirdPen]=useState(false);
  const[champ,setChamp]=useState(null);
  const[showRestartConfirm,setShowRestartConfirm]=useState(false);
  const[showShareModal,setShowShareModal]=useState(false);
  const[copied,setCopied]=useState(false);

  const allDone=doneG.size===12;

  const goGroup=(i)=>{
    setGIdx(i);let next=6;
    for(let m=0;m<6;m++){if(!preds[`g${i}_m${m}`]){next=m;break;}}
    if(next>=6)setView("group-result");else{setMIdx(next);setView("group-predict");}
  };

  const startKO=()=>{
    // Resume if already started — never destroy existing predictions
    if(koMatches.r32?.length>0){setView("ko-reveal");return;}
    setKoMatches({r32:buildR32(scores)});setKoScores({});setKoWinners({});setKoPen({});
    setThirdMatch(null);setThirdScore(null);setThirdWinner(null);setThirdLoser(null);setThirdPen(false);
    setChamp(null);setKoRound("r32");setKoMIdx(0);setRevTab("teams");setKoReturnView("ko-reveal");setView("ko-reveal");
  };

  const restartKO=()=>{
    setKoMatches({r32:buildR32(scores)});setKoScores({});setKoWinners({});setKoPen({});
    setThirdMatch(null);setThirdScore(null);setThirdWinner(null);setThirdLoser(null);setThirdPen(false);
    setChamp(null);setKoRound("r32");setKoMIdx(0);setRevTab("teams");setKoReturnView("ko-reveal");setView("ko-reveal");
  };

  const handleSimulate=()=>{const{sc,pr,dn}=simulateAllGroups();setScores(sc);setPreds(pr);setDoneG(dn);};

  const onGroupResult=(result)=>{
    const key=`g${gIdx}_m${mIdx}`;const m=getMatches(gIdx)[mIdx];
    const hR=GROUPS[gIdx].teams[m.h].rating,aR=GROUPS[gIdx].teams[m.a].rating;
    setPreds(p=>({...p,[key]:result}));setScores(s=>({...s,[key]:genScore(result,hR,aR)}));
    if(mIdx+1<6)setTimeout(()=>setMIdx(m=>m+1),310);
    else{setDoneG(d=>{const n=new Set(d);n.add(gIdx);return n;});setTimeout(()=>setView("group-result"),420);}
  };

  const onKoResult=(result)=>{
    const round=koRound,mi=koMIdx;const match=(koMatches[round]||[])[mi];if(!match)return;
    const isPen=typeof result==="string"&&result.startsWith("pen-");
    const dir=isPen?result.slice(4):result;
    const winner=dir==="home"?match.h:match.a;
    const sc=genScore(dir,match.h.rating||72,match.a.rating||72);
    const displayScore=isPen?genScore("draw",match.h.rating||72,match.a.rating||72):sc;
    const key=`${round}_${mi}`;
    setKoWinners(prev=>({...prev,[key]:winner}));
    setKoScores(prev=>({...prev,[key]:displayScore}));
    setKoPen(prev=>({...prev,[key]:isPen}));
    const total=(koMatches[round]||[]).length;
    if(mi+1<total)setTimeout(()=>setKoMIdx(m=>m+1),310);
    else setTimeout(()=>setView("ko-result"),420);
  };

  // ─── 3rd place result handler ───────────────────────────────────────────
  const onThirdResult=(result)=>{
    if(!thirdMatch)return;
    const isPen=typeof result==="string"&&result.startsWith("pen-");
    const dir=isPen?result.slice(4):result;
    const winner=dir==="home"?thirdMatch.h:thirdMatch.a;
    const loser=dir==="home"?thirdMatch.a:thirdMatch.h;
    const sc=genScore(dir,thirdMatch.h.rating||72,thirdMatch.a.rating||72);
    setThirdScore(isPen?genScore("draw",thirdMatch.h.rating||72,thirdMatch.a.rating||72):sc);
    setThirdWinner(winner);setThirdLoser(loser);setThirdPen(isPen);
    setTimeout(()=>setView("third-result"),420);
  };

  const advanceKORound=()=>{
    const round=koRound;
    const matches=koMatches[round]||[];
    const wins=matches.map((_,i)=>koWinners[`${round}_${i}`]);

    // ── Final: 1 match, reveal champion ───────────────────────────────────
    if(round==="final"){
      const fw=wins[0]||koWinners["final_0"];
      if(fw){setChamp(fw);setView("champion");}
      return;
    }

    const nr=ROUND_NEXT[round];

    // ── After SF: losers → 3rd-place match, winners → final ───────────────
    if(round==="sf"){
      const losers=matches.map((m,i)=>{
        const w=wins[i];if(!w)return null;
        return w.name===m.h.name?m.a:m.h;
      }).filter(Boolean);
      const finalists=[wins[0],wins[1]].filter(Boolean);
      if(finalists.length<2||losers.length<2){alert("Complete ambas as semifinais antes de avançar.");return;}
      setKoMatches(m=>({...m,final:[{h:finalists[0],a:finalists[1]}]}));
      setThirdMatch({h:losers[0],a:losers[1]});
      setKoReturnView("ko-result"); // Final ← goes back to SF results
      setView("third-play");
      return;
    }

    // ── All other rounds: use KO_PAIRINGS for fixed bracket ───────────────
    const pairings=KO_PAIRINGS[nr];
    const missingWinners=pairings.some(([i,j])=>!wins[i]||!wins[j]);
    if(missingWinners){alert("Conclua todos os jogos desta rodada antes de avançar.");return;}
    const next=pairings.map(([i,j])=>({h:wins[i],a:wins[j]}));

    setKoMatches(m=>({...m,[nr]:next}));
    setKoRound(nr);setKoMIdx(0);

    const showPreview=nr==="r16"||nr==="qf";
    setKoReturnView(showPreview?"ko-bracket-preview":"ko-result");
    setView(showPreview?"ko-bracket-preview":"knockout");
  };

  const saveKOScore=({h,a,penWinner})=>{
    const{round,mi,match}=editKO;const key=`${round}_${mi}`;
    let nw,isPenResult;
    if(h!==a){
      // clear score: winner determined by goals
      nw=h>a?match.h:match.a;isPenResult=false;
    }else{
      // tied score: penWinner must be set (enforced by editor UI)
      if(!penWinner)return;
      nw=penWinner==="home"?match.h:match.a;isPenResult=true;
    }
    setKoScores(s=>({...s,[key]:{h,a}}));
    setKoWinners(w=>({...w,[key]:nw}));
    setKoPen(p=>({...p,[key]:isPenResult}));
    setEditKO(null);
  };

  /* ════════════════════ EXPORT ═════════════════════════════════════════ */

  /**
   * Assembles the complete bet prediction into a single portable object.
   * All team references are self-contained (name + flag); no internal IDs leak out.
   */
  const buildExportPayload=()=>{
    // ── Group Stage ──────────────────────────────────────────────────────
    const group_stage=GROUPS.map((g,gi)=>{
      const matches=getMatches(gi);
      return{
        group:g.id,
        matches:matches.map((m,mi)=>{
          const key=`g${gi}_m${mi}`;
          const s=scores[key]||null;
          const p=preds[key]||null;
          return{
            match_number:mi+1,
            team1:{name:g.teams[m.h].name,flag:g.teams[m.h].flag},
            team2:{name:g.teams[m.a].name,flag:g.teams[m.a].flag},
            team1_score:s?s.h:null,
            team2_score:s?s.a:null,
            result:p||null,  // "home"|"away"|"draw"
          };
        }),
        // Derived standings from this participant's predictions
        standings:calcStandings(gi,scores).map((row,rank)=>({
          rank:rank+1,
          team:row.name,
          flag:row.flag,
          pts:row.pts,
          w:row.w,
          d:row.d,
          l:row.l,
          gf:row.gf,
          ga:row.ga,
          gd:row.gd,
          qualified:rank<2,
        })),
      };
    });

    // ── Knockout Phase ───────────────────────────────────────────────────
    const koPhaseOrder=["r32","r16","qf","sf","final"];
    const phaseLabel={r32:"round_of_32",r16:"round_of_16",qf:"quarter_finals",sf:"semi_finals",final:"final"};
    const knockout=koPhaseOrder
      .filter(rnd=>koMatches[rnd]?.length>0)
      .map(rnd=>{
        const matches=(koMatches[rnd]||[]).map((m,mi)=>{
          const key=`${rnd}_${mi}`;
          const s=koScores[key]||null;
          const win=koWinners[key]||null;
          const pen=koPen[key]||false;
          return{
            match_number:mi+1,
            team1:m.h?{name:m.h.name,flag:m.h.flag}:null,
            team2:m.a?{name:m.a.name,flag:m.a.flag}:null,
            team1_score:s?s.h:null,
            team2_score:s?s.a:null,
            penalty_winner:pen&&win?win.name:null,
            qualified_team:win?{name:win.name,flag:win.flag}:null,
          };
        });
        return{phase:phaseLabel[rnd],matches};
      });

    // ── 3rd Place Match ──────────────────────────────────────────────────
    const third_place_match=thirdMatch?{
      team1:thirdMatch.h?{name:thirdMatch.h.name,flag:thirdMatch.h.flag}:null,
      team2:thirdMatch.a?{name:thirdMatch.a.name,flag:thirdMatch.a.flag}:null,
      team1_score:thirdScore?thirdScore.h:null,
      team2_score:thirdScore?thirdScore.a:null,
      penalty_winner:thirdPen&&thirdWinner?thirdWinner.name:null,
      third_place:thirdWinner?{name:thirdWinner.name,flag:thirdWinner.flag}:null,
      fourth_place:thirdLoser?{name:thirdLoser.name,flag:thirdLoser.flag}:null,
    }:null;

    // ── Summary ──────────────────────────────────────────────────────────
    const champion=champ?{name:champ.name,flag:champ.flag,group:champ.groupId||null}:null;

    return{
      schema_version:"bolao-de-bico@1.0",
      exported_at:new Date().toISOString(),
      tournament:"FIFA World Cup 2026",
      group_stage,
      knockout,
      third_place_match,
      champion,
    };
  };

  const exportBet=()=>{
    const payload=buildExportPayload();
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download=`palpite-copa-2026-${Date.now()}.json`;
    document.body.appendChild(a);a.click();
    document.body.removeChild(a);URL.revokeObjectURL(url);
  };

  /**
   * Builds a human-readable plain-text summary of the full bet for copy-paste sharing.
   */
  const buildShareText=()=>{
    const lines=[];
    lines.push("🏆 MEU PALPITE — COPA DO MUNDO 2026");
    lines.push("");
    if(champ)lines.push(`🥇 Campeão: ${champ.flag} ${champ.name}`);
    if(thirdWinner)lines.push(`🥉 3º Lugar: ${thirdWinner.flag} ${thirdWinner.name}`);
    if(thirdLoser)lines.push(`🏅 4º Lugar: ${thirdLoser.flag} ${thirdLoser.name}`);
    lines.push("");

    // ── Knockout ───────────────────────────────────────────────────────
    const koPhaseOrder=["r32","r16","qf","sf","final"];
    const phaseLabel={r32:"Rodada de 32",r16:"Oitavas de Final",qf:"Quartas de Final",sf:"Semifinais",final:"Grande Final"};
    koPhaseOrder.forEach(rnd=>{
      const matches=koMatches[rnd]||[];
      if(!matches.length)return;
      lines.push(`=== ${phaseLabel[rnd].toUpperCase()} ===`);
      matches.forEach((m,mi)=>{
        const key=`${rnd}_${mi}`;
        const s=koScores[key];
        const win=koWinners[key];
        const pen=koPen[key];
        if(!s)return;
        const t1=m.h?`${m.h.flag} ${m.h.name}`:"?";
        const t2=m.a?`${m.a.flag} ${m.a.name}`:"?";
        const score=`${s.h}–${s.a}${pen?" (pên.)":""}`;
        const winner=win?` → ${win.flag} ${win.name}`:"";
        lines.push(`  ${t1}  ${score}  ${t2}${winner}`);
      });
      lines.push("");
    });

    // ── 3rd place ──────────────────────────────────────────────────────
    if(thirdMatch&&thirdScore){
      lines.push("=== DISPUTA DO 3º LUGAR ===");
      const t1=thirdMatch.h?`${thirdMatch.h.flag} ${thirdMatch.h.name}`:"?";
      const t2=thirdMatch.a?`${thirdMatch.a.flag} ${thirdMatch.a.name}`:"?";
      const score=`${thirdScore.h}–${thirdScore.a}${thirdPen?" (pên.)":""}`;
      lines.push(`  ${t1}  ${score}  ${t2}`);
      lines.push("");
    }

    // ── Group Stage ────────────────────────────────────────────────────
    lines.push("=== FASE DE GRUPOS ===");
    GROUPS.forEach((g,gi)=>{
      lines.push(`Grupo ${g.id}:`);
      getMatches(gi).forEach((m,mi)=>{
        const key=`g${gi}_m${mi}`;
        const s=scores[key];
        if(!s)return;
        const H=g.teams[m.h],A=g.teams[m.a];
        lines.push(`  ${H.flag} ${H.name}  ${s.h}–${s.a}  ${A.name} ${A.flag}`);
      });
      const st=calcStandings(gi,scores);
      lines.push(`  Classificação: ${st.map((r,i)=>`${i+1}º ${r.flag} ${r.name} (${r.pts}pts)`).join(" | ")}`);
      lines.push("");
    });

    return lines.join("\n");
  };

  /* ════════════════════ VIEWS ══════════════════════════════════════════ */

  /* ── KO REVEAL — qualifying teams + R32 bracket ──────────────────────── */
  if(view==="ko-reveal"){
    const standings=GROUPS.map((_,i)=>calcStandings(i,scores));
    const firsts=standings.map((s,i)=>({...s[0],groupId:GROUPS[i].id,pos:"1º"}));
    const seconds=standings.map((s,i)=>({...s[1],groupId:GROUPS[i].id,pos:"2º"}));
    const thirds=standings
      .map((s,i)=>s[2]?{...s[2],groupId:GROUPS[i].id,pos:"3º"}:null)
      .filter(Boolean).sort((a,b)=>b.pts-a.pts||b.gd-a.gd||b.gf-a.gf).slice(0,8);
    const r32=koMatches.r32||[];
    return(
      <div style={{...BG,gap:14,paddingTop:22}}>
        <style>{STYLE}</style>
        {/* Consistent top-left ← back to groups (no data loss) */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:420}}>
          <button onClick={()=>setView("group-hub")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.38)",fontSize:24,cursor:"pointer",padding:4}}>←</button>
          <div style={{textAlign:"center"}}>
            <p style={{fontFamily:"Fredoka One,cursive",fontSize:12,color:"rgba(255,255,255,0.38)"}}>Grupo Stage Complete!</p>
            <h2 style={{fontFamily:"Fredoka One,cursive",fontSize:22,color:"#FFD700",lineHeight:1.1}}>🏆 Quem Avançou</h2>
          </div>
          <div style={{width:32}}/>
        </div>
        <p style={{fontFamily:"Nunito,sans-serif",fontSize:12,color:"rgba(255,255,255,0.38)",textAlign:"center",marginTop:-6}}>24 seleções avançam — 2 por grupo + 8 melhores 3os</p>
        {/* Tab toggle */}
        <div style={{display:"flex",gap:6,width:"100%",maxWidth:420}}>
          {[{id:"teams",label:"👥 Quem Avançou"},{id:"bracket",label:"📋 Chave do R32"}].map(t=>(
            <button key={t.id} onClick={()=>setRevTab(t.id)} style={{flex:1,padding:"9px 6px",borderRadius:14,border:"none",cursor:"pointer",fontFamily:"Fredoka One,cursive",fontSize:13,background:revTab===t.id?"#FFD700":"rgba(255,255,255,0.07)",color:revTab===t.id?"#111":"rgba(255,255,255,0.55)",transition:"all 0.2s"}}>
              {t.label}
            </button>
          ))}
        </div>
        {/* Content */}
        <div style={{width:"100%",maxWidth:420,display:"flex",flexDirection:"column",gap:6}}>
          {revTab==="teams"?(
            <>
              {GROUPS.map((g,i)=>(
                <div key={g.id} style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"9px 12px",border:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:22,flexShrink:0,textAlign:"center"}}>
                    <span style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"rgba(255,215,0,0.55)"}}>{g.id}</span>
                  </div>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:20}}>{firsts[i].flag}</span>
                    <div>
                      <div style={{fontFamily:"Fredoka One,cursive",fontSize:11,color:"white",lineHeight:1.2}}>{firsts[i].name}</div>
                      <div style={{fontFamily:"Nunito,sans-serif",fontSize:9,color:"#66BB6A"}}>1º ✓</div>
                    </div>
                  </div>
                  <div style={{width:1,height:28,background:"rgba(255,255,255,0.08)"}}/>
                  <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:20}}>{seconds[i].flag}</span>
                    <div>
                      <div style={{fontFamily:"Fredoka One,cursive",fontSize:11,color:"white",lineHeight:1.2}}>{seconds[i].name}</div>
                      <div style={{fontFamily:"Nunito,sans-serif",fontSize:9,color:"#66BB6A"}}>2º ✓</div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Best 8 thirds */}
              <div style={{background:"rgba(255,152,0,0.07)",border:"1px solid rgba(255,152,0,0.2)",borderRadius:14,padding:"10px 12px",marginTop:2}}>
                <p style={{fontFamily:"Fredoka One,cursive",fontSize:12,color:"#FFB74D",marginBottom:7}}>🌟 8 Melhores Terceiros Colocados</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                  {thirds.map((t,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:6,background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"6px 8px"}}>
                      <span style={{fontSize:18}}>{t.flag}</span>
                      <div>
                        <div style={{fontFamily:"Fredoka One,cursive",fontSize:10,color:"white",lineHeight:1.2}}>{t.name}</div>
                        <div style={{fontFamily:"Nunito,sans-serif",fontSize:9,color:"rgba(255,255,255,0.38)"}}>Grp {t.groupId} · 3º</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ):(
            /* R32 bracket list */
            r32.map((m,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"7px 10px",border:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:7}}>
                <span style={{fontFamily:"Fredoka One,cursive",fontSize:9,color:"rgba(255,215,0,0.5)",width:26,flexShrink:0}}>M{73+i}</span>
                <span style={{fontSize:18,flexShrink:0}}>{m.h.flag}</span>
                <div style={{flex:1,overflow:"hidden"}}>
                  <div style={{fontFamily:"Fredoka One,cursive",fontSize:11,color:"white",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.h.name}</div>
                  <div style={{fontFamily:"Nunito,sans-serif",fontSize:8,color:m.h.pos==="3º"?"#FFB74D":"#66BB6A"}}>{m.h.pos}{m.h.groupId?` · Grp ${m.h.groupId}`:""}</div>
                </div>
                <span style={{fontFamily:"Fredoka One,cursive",fontSize:9,color:"rgba(255,255,255,0.25)",flexShrink:0}}>vs</span>
                <div style={{flex:1,overflow:"hidden",textAlign:"right"}}>
                  <div style={{fontFamily:"Fredoka One,cursive",fontSize:11,color:"white",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.a.name}</div>
                  <div style={{fontFamily:"Nunito,sans-serif",fontSize:8,color:m.a.pos==="3º"?"#FFB74D":"#66BB6A"}}>{m.a.pos}{m.a.groupId?` · Grp ${m.a.groupId}`:""}</div>
                </div>
                <span style={{fontSize:18,flexShrink:0}}>{m.a.flag}</span>
              </div>
            ))
          )}
        </div>
        <button onClick={()=>setView("knockout")} style={{...BTN.orange,fontSize:18,padding:"16px 0",width:"100%",maxWidth:420}}>
          Começa o Mata-mata! 🔥
        </button>
      </div>
    );
  }

  /* ── KO BRACKET PREVIEW — spider bracket before R16 / QF ─────────────── */
  if(view==="ko-bracket-preview"){
    const matches=koMatches[koRound]||[];
    const nr=ROUND_NEXT[koRound];
    const nextPairings=nr?KO_PAIRINGS[nr]:null;
    // Grupo current matches into pairs that will face each other next round
    // nextPairings tells us which current-round winners meet → [i,j] means match i winner vs match j winner
    // So we group by which two current matches feed into the same next-round slot
    const abbrev={r16:"R16",qf:"QF",sf:"SF",final:"Final"};
    const groups=nextPairings
      ?nextPairings.map(([i,j],pi)=>({matchA:matches[i],matchB:matches[j],label:`${abbrev[nr]||nr} ${pi+1}`}))
      :[];
    // Jogo number labels for R16
    const matchLabels={
      r16:["M89","M90","M91","M92","M93","M94","M95","M96"],
      qf:["QF1","QF2","QF3","QF4"],
      sf:["SF1","SF2"],
    };
    const labels=matchLabels[koRound]||[];
    const prevRound=ROUND_PREV[koRound];
    const goBackFromPreview=()=>{
      if(prevRound){setKoRound(prevRound);setView("ko-result");}
      else setView("ko-reveal");
    };
    return(
      <div style={{...BG,gap:14,paddingTop:22}}>
        <style>{STYLE}</style>
        {/* Consistent top-left ← */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:420}}>
          <button onClick={goBackFromPreview} style={{background:"none",border:"none",color:"rgba(255,255,255,0.38)",fontSize:24,cursor:"pointer",padding:4}}>←</button>
          <div className="fadeUp" style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,152,0,0.15)",border:"1.5px solid rgba(255,152,0,0.35)",borderRadius:18,padding:"6px 16px"}}>
            <span style={{fontSize:16}}>{ROUND_ICON[koRound]}</span>
            <span style={{fontFamily:"Fredoka One,cursive",fontSize:15,color:"#FFD700"}}>{ROUND_LABEL[koRound]}</span>
          </div>
          <div style={{width:32}}/>
        </div>
        <p style={{fontFamily:"Nunito,sans-serif",fontSize:12,color:"rgba(255,255,255,0.38)",textAlign:"center"}}>
          {matches.length} jogos · Vencedores avançam para {ROUND_LABEL[nr]||"a Final"}
        </p>
        {/* Bracket groups */}
        <div style={{width:"100%",maxWidth:420,display:"flex",flexDirection:"column",gap:14}}>
          {groups.length>0?groups.map((g,i)=>(
            <BracketGroup
              key={i}
              matchA={g.matchA}
              matchB={g.matchB}
              nextLabel={g.label}
              matchNums={nextPairings[i].map(idx=>labels[idx])}
            />
          )):(
            // Fallback: just list matches
            matches.map((m,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.05)",borderRadius:14,padding:"10px 14px",border:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:28}}>{m.h?.flag}</span>
                <span style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"rgba(255,255,255,0.5)",flex:1,textAlign:"center"}}>vs</span>
                <span style={{fontSize:28}}>{m.a?.flag}</span>
              </div>
            ))
          )}
        </div>
        <button onClick={()=>setView("knockout")} style={{...BTN.orange,fontSize:17,padding:"15px 0",width:"100%",maxWidth:420}}>
          Começar os Palpites! {ROUND_ICON[koRound]}
        </button>
      </div>
    );
  }

  if(view==="welcome")return(
    <div style={{...BG,justifyContent:"center",gap:30,textAlign:"center"}}>
      <style>{STYLE}</style>
      <div className="float" style={{fontSize:88,lineHeight:1}}>⚽</div>
      <div>
        <h1 style={{fontFamily:"Fredoka One,cursive",fontSize:42,color:"#FFD700",lineHeight:1.05,textShadow:"0 4px 24px rgba(255,215,0,0.28)"}}>Bolão de Bico</h1>
        <p style={{fontFamily:"Nunito,sans-serif",fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:8,maxWidth:280,lineHeight:1.5}}>Escolha quem ganha que o resto a gente resolve! ⚽</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12,alignItems:"center",width:"100%",maxWidth:320}}>
        <button onClick={()=>setView("group-hub")} style={{...BTN.green,fontSize:22,padding:"18px 0",width:"100%"}}>Vamos lá! 🚀</button>
        <button onClick={()=>{setObScreen(0);setView("onboarding");}} style={{...BTN.ghost,fontSize:15,width:"100%",padding:"13px 0"}}>
          Como Jogar ❓
        </button>
        <p style={{color:"rgba(255,255,255,0.18)",fontSize:11,fontFamily:"Nunito",marginTop:2}}>EUA · Canadá · México | Junho–Julho 2026</p>
      </div>
    </div>
  );

  /* ── ONBOARDING ───────────────────────────────────────────────────────── */
  if(view==="onboarding"){
    const OB_SCREENS=[ObScreen1,ObScreen2,ObScreen3];
    const Active=OB_SCREENS[obScreen];
    return(
      <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 50% 0%,#0e2616 0%,#040c06 65%)",display:"flex",flexDirection:"column",alignItems:"center",padding:"28px 20px 40px",overflowX:"hidden"}}>
        <style>{STYLE}</style>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",maxWidth:400,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:22}}>⚽</span>
            <span style={{fontFamily:"Fredoka One,cursive",fontSize:18,color:"#FFD700"}}>Como Jogar</span>
          </div>
          <button onClick={()=>setView("welcome")} style={{fontFamily:"Fredoka One,cursive",fontSize:12,color:"rgba(255,255,255,0.38)",background:"none",border:"none",cursor:"pointer",padding:4}}>
            Pular
          </button>
        </div>
        {/* Active screen */}
        <div style={{width:"100%",maxWidth:400,flex:1}}>
          <Active key={obScreen}/>
        </div>
        {/* Footer nav */}
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,marginTop:24,width:"100%",maxWidth:400}}>
          <div style={{display:"flex",gap:7}}>
            {OB_SCREENS.map((_,i)=>(
              <div key={i} onClick={()=>setObScreen(i)} style={{width:i===obScreen?24:7,height:7,borderRadius:4,cursor:"pointer",background:i===obScreen?"#FFD700":"rgba(255,255,255,0.18)",transition:"all 0.3s"}}/>
            ))}
          </div>
          <div style={{display:"flex",gap:10,width:"100%"}}>
            {obScreen>0&&(
              <button onClick={()=>setObScreen(s=>s-1)} style={{flex:1,padding:"13px",borderRadius:18,border:"1px solid rgba(255,255,255,0.14)",background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.65)",fontFamily:"Fredoka One,cursive",fontSize:15,cursor:"pointer"}}>← Voltar</button>
            )}
            <button
              onClick={()=>obScreen<OB_SCREENS.length-1?setObScreen(s=>s+1):setView("group-hub")}
              style={{flex:obScreen===0?1:1.4,padding:"13px",borderRadius:18,border:"none",background:obScreen===OB_SCREENS.length-1?"linear-gradient(135deg,#FB8C00,#E64A19)":"linear-gradient(135deg,#43A047,#2E7D32)",color:"white",fontFamily:"Fredoka One,cursive",fontSize:16,cursor:"pointer",boxShadow:"0 6px 20px rgba(0,0,0,0.3)"}}
            >
              {obScreen===OB_SCREENS.length-1?"Jogar! 🚀":"Próximo →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if(view==="group-hub")return(
    <div style={{...BG,gap:16}}>
      <style>{STYLE}</style>
      {/* Restart confirmation modal — shared with champion screen */}
      {showRestartConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:"#0e2018",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:24,padding:"28px 24px",width:"min(320px,92vw)",display:"flex",flexDirection:"column",alignItems:"center",gap:18,textAlign:"center"}}>
            <span style={{fontSize:44}}>⚠️</span>
            <div>
              <p style={{fontFamily:"Fredoka One,cursive",fontSize:18,color:"#FFD700",marginBottom:8}}>Apagar o palpite atual?</p>
              <p style={{fontFamily:"Nunito,sans-serif",fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>Isso vai resetar todos os resultados do mata-mata. Quer salvar antes?</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
              <button onClick={()=>{setShowRestartConfirm(false);setCopied(false);setShowShareModal(true);}} style={{...BTN.ghost,width:"100%",padding:"13px 0",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span>🔗</span> Compartilhar Palpite antes
              </button>
              <button onClick={()=>{restartKO();setShowRestartConfirm(false);}} style={{background:"rgba(239,83,80,0.15)",border:"1px solid rgba(239,83,80,0.3)",borderRadius:18,padding:"12px 0",width:"100%",color:"#EF5350",fontFamily:"Fredoka One,cursive",fontSize:14,cursor:"pointer"}}>
                🗑️ Apagar e recomeçar
              </button>
              <button onClick={()=>setShowRestartConfirm(false)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"Fredoka One,cursive",fontSize:13,color:"rgba(255,255,255,0.3)",padding:"4px"}}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:420}}>
        <button onClick={()=>setView("welcome")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.38)",fontSize:24,cursor:"pointer",padding:4}}>←</button>
        <h1 style={{fontFamily:"Fredoka One,cursive",fontSize:26,color:"#FFD700"}}>⚽ Fase de Grupos</h1>
        <span style={{fontSize:13,fontFamily:"Nunito",color:"rgba(255,255,255,0.38)"}}>{doneG.size}/12</span>
      </div>
      <div style={{width:"100%",maxWidth:420,background:"rgba(255,255,255,0.08)",borderRadius:8,height:7,overflow:"hidden"}}>
        <div style={{height:"100%",background:"linear-gradient(90deg,#43A047,#8BC34A)",width:`${(doneG.size/12)*100}%`,transition:"width 0.6s",borderRadius:8}}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,width:"100%",maxWidth:420}}>
        {GROUPS.map((g,i)=>{const p=groupProg(i,preds),done=doneG.has(i);return(
          <div key={g.id} onClick={()=>goGroup(i)} style={{background:done?"rgba(76,175,80,0.12)":g.bg,border:done?"2px solid #4CAF50":p>0?"2px solid rgba(255,215,0,0.32)":"2px solid rgba(255,255,255,0.07)",borderRadius:16,padding:"12px 8px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6,transition:"transform 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <div style={{fontFamily:"Fredoka One,cursive",fontSize:21,color:done?"#66BB6A":"#FFD700"}}>{done?"✅":""}{g.id}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:1,lineHeight:1}}>{g.teams.map(t=><span key={t.name} style={{textAlign:"center",fontSize:18}}>{t.flag}</span>)}</div>
            <div style={{width:"100%",background:"rgba(255,255,255,0.09)",borderRadius:4,height:4,overflow:"hidden"}}><div style={{height:"100%",background:"#4CAF50",width:`${(p/6)*100}%`,transition:"width 0.35s",borderRadius:4}}/></div>
            <span style={{fontFamily:"Nunito,sans-serif",fontSize:10,color:"rgba(255,255,255,0.42)"}}>{p}/6</span>
          </div>
        );})}
      </div>
      {allDone
        ? koMatches.r32?.length>0
          ? <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,marginTop:4,width:"100%",maxWidth:420}}>
              <button className="pop" onClick={startKO} style={{...BTN.orange,fontSize:20,padding:"16px 0",width:"100%"}}>▶ Continuar Mata-mata</button>
              <button onClick={()=>setShowRestartConfirm(true)} style={{...BTN.sim,fontSize:12,padding:"8px 0",width:"100%"}}>↺ Recomeçar do zero</button>
            </div>
          : <button className="pop" onClick={startKO} style={{...BTN.orange,fontSize:20,padding:"16px 44px",marginTop:4}}>🏆 Para o Mata-mata!</button>
        :<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,marginTop:4,width:"100%",maxWidth:420}}>
          <p style={{color:"rgba(255,255,255,0.22)",fontFamily:"Nunito",fontSize:13,textAlign:"center"}}>Complete todos os 12 grupos para liberar o mata-mata 🔒</p>
          <button onClick={handleSimulate} style={{...BTN.sim,width:"100%"}}>⚡ Simular todos os grupos</button>
        </div>
      }
    </div>
  );

  if(view==="group-predict"){
    const matches=getMatches(gIdx),m=matches[mIdx];
    return(
      <div style={{...BG,justifyContent:"flex-start",gap:16,paddingTop:28}}>
        <style>{STYLE}</style>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:420}}>
          <button onClick={()=>setView("group-hub")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.38)",fontSize:24,cursor:"pointer",padding:4}}>←</button>
          <div style={{fontFamily:"Fredoka One,cursive",fontSize:24,color:"#FFD700"}}>Grupo {GROUPS[gIdx].id}</div>
          <span style={{fontSize:12,fontFamily:"Nunito",color:"rgba(255,255,255,0.38)"}}>{mIdx+1}/6</span>
        </div>
        <SwipeCard key={`g${gIdx}-m${mIdx}`} homeTeam={GROUPS[gIdx].teams[m.h]} awayTeam={GROUPS[gIdx].teams[m.a]} matchNum={mIdx+1} total={6} onResult={onGroupResult}/>
      </div>
    );
  }

  if(view==="group-result"){
    const standings=calcStandings(gIdx,scores),matches=getMatches(gIdx),g=GROUPS[gIdx];
    const nextInc=GROUPS.findIndex((_,i)=>!doneG.has(i));
    return(
      <div style={{...BG,gap:14,paddingTop:22}}>
        <style>{STYLE}</style>
        {editG&&<ScoreEditor score={scores[editG.key]} homeTeam={g.teams[matches[editG.mi].h]} awayTeam={g.teams[matches[editG.mi].a]} isPen={false} onClose={()=>setEditG(null)} onSave={ns=>{setScores(s=>({...s,[editG.key]:ns}));setEditG(null);}}/>}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:420}}>
          <button onClick={()=>setView("group-hub")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.38)",fontSize:24,cursor:"pointer",padding:4}}>←</button>
          <div style={{fontFamily:"Fredoka One,cursive",fontSize:23,color:"#FFD700"}}>Grupo {g.id} Resultados</div>
          <div style={{width:32}}/>
        </div>
        <div style={{width:"100%",maxWidth:420,background:"rgba(255,255,255,0.04)",borderRadius:18,overflow:"hidden",border:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 28px 28px 28px 36px 36px",gap:4,padding:"9px 14px",background:"rgba(255,215,0,0.07)",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
            {["Team","V","E","D","SG","Pts"].map((h,i)=><span key={i} style={{fontFamily:"Fredoka One,cursive",fontSize:11,color:i===5?"#FFD700":"rgba(255,255,255,0.38)",textAlign:i>0?"center":"left"}}>{h}</span>)}
          </div>
          {standings.map((row,i)=>(
            <div key={row.name} style={{display:"grid",gridTemplateColumns:"1fr 28px 28px 28px 36px 36px",gap:4,padding:"10px 14px",alignItems:"center",borderBottom:i<3?"1px solid rgba(255,255,255,0.05)":"none",background:i<2?"rgba(76,175,80,0.1)":"transparent"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,overflow:"hidden"}}>
                {i<2&&<span style={{fontSize:9,background:"#4CAF50",color:"white",padding:"1px 4px",borderRadius:8,fontFamily:"Fredoka One",flexShrink:0}}>✓</span>}
                <span style={{fontSize:18,flexShrink:0}}>{row.flag}</span>
                <span style={{fontFamily:"Fredoka One,cursive",fontSize:11,color:"white",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{row.name}</span>
              </div>
              {[row.w,row.d,row.l].map((v,j)=><span key={j} style={{textAlign:"center",fontFamily:"Nunito",fontSize:13,color:"rgba(255,255,255,0.6)"}}>{v}</span>)}
              <span style={{textAlign:"center",fontFamily:"Nunito",fontSize:13,color:"rgba(255,255,255,0.6)"}}>{row.gd>0?"+":""}{row.gd}</span>
              <span style={{textAlign:"center",fontFamily:"Fredoka One,cursive",fontSize:16,color:"#FFD700"}}>{row.pts}</span>
            </div>
          ))}
        </div>
        <div style={{width:"100%",maxWidth:420}}>
          <p style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"rgba(255,255,255,0.42)",marginBottom:7}}>📊 All Resultados <span style={{fontSize:10,color:"rgba(255,255,255,0.28)"}}>(toque no placar para editar)</span></p>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {matches.map((m,mi)=>{
              const key=`g${gIdx}_m${mi}`,s=scores[key];if(!s)return null;
              const H=g.teams[m.h],A=g.teams[m.a];
              return(<div key={mi} style={{display:"flex",alignItems:"center",gap:7,background:"rgba(255,255,255,0.04)",borderRadius:12,padding:"8px 11px",border:"1px solid rgba(255,255,255,0.07)"}}>
                <span style={{fontSize:18}}>{H.flag}</span>
                <span style={{fontFamily:"Fredoka One,cursive",fontSize:11,color:s.h>s.a?"#66BB6A":"rgba(255,255,255,0.55)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{H.name}</span>
                <button onClick={()=>setEditG({key,mi})} style={{fontFamily:"Fredoka One,cursive",fontSize:17,color:"white",background:"rgba(255,215,0,0.12)",border:"1px solid rgba(255,215,0,0.25)",borderRadius:10,padding:"3px 11px",cursor:"pointer",minWidth:52,textAlign:"center"}}>{s.h}–{s.a}</button>
                <span style={{fontFamily:"Fredoka One,cursive",fontSize:11,color:s.a>s.h?"#66BB6A":"rgba(255,255,255,0.55)",flex:1,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{A.name}</span>
                <span style={{fontSize:18}}>{A.flag}</span>
              </div>);
            })}
          </div>
        </div>
        <div style={{display:"flex",gap:10,width:"100%",maxWidth:420}}>
          <button onClick={()=>setView("group-hub")} style={{...BTN.ghost,flex:1,fontSize:14}}>📋 Todos os Grupos</button>
          {allDone?<button onClick={startKO} style={{...BTN.orange,flex:1,fontSize:14,padding:"12px 0"}}>🏆 Mata-mata!</button>:nextInc>=0?<button onClick={()=>goGroup(nextInc)} style={{...BTN.green,flex:1,fontSize:14,padding:"12px 0"}}>Grupo {GROUPS[nextInc].id} →</button>:null}
        </div>
      </div>
    );
  }

  if(view==="knockout"){
    const roundMatches=koMatches[koRound]||[],match=roundMatches[koMIdx];

    const goBack=()=>{
      if(koMIdx>0)setKoMIdx(m=>m-1);
      else setView(koReturnView||"ko-reveal");
    };

    if(!match)return(<div style={{...BG,justifyContent:"center",gap:20}}><style>{STYLE}</style><p style={{color:"white",fontFamily:"Fredoka One,cursive",fontSize:20}}>Preparando… ⚽</p><button onClick={()=>setView("ko-result")} style={{...BTN.ghost,fontSize:13}}>← Voltar</button></div>);
    return(
      <div style={{...BG,justifyContent:"flex-start",gap:16,paddingTop:28}}>
        <style>{STYLE}</style>
        {/* Consistent top-left ← — same pattern as group-predict */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",maxWidth:420}}>
          <button onClick={goBack} style={{background:"none",border:"none",color:"rgba(255,255,255,0.38)",fontSize:24,cursor:"pointer",padding:4}}>←</button>
          <div className="fadeUp" style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,152,0,0.15)",border:"1.5px solid rgba(255,152,0,0.35)",borderRadius:18,padding:"6px 16px"}}>
            <span style={{fontSize:16}}>{ROUND_ICON[koRound]}</span>
            <span style={{fontFamily:"Fredoka One,cursive",fontSize:15,color:"#FFD700"}}>{ROUND_LABEL[koRound]}</span>
          </div>
          <span style={{fontFamily:"Nunito,sans-serif",fontSize:12,color:"rgba(255,255,255,0.38)",width:32,textAlign:"right"}}>{koMIdx+1}/{roundMatches.length}</span>
        </div>
        <SwipeCard key={`ko-${koRound}-${koMIdx}`} homeTeam={match.h} awayTeam={match.a} matchNum={koMIdx+1} total={roundMatches.length} onResult={onKoResult} isKO={true}/>
      </div>
    );
  }

  if(view==="ko-result"){
    const roundMatches=koMatches[koRound]||[],isFinal=koRound==="final";
    return(
      <div style={{...BG,gap:14,paddingTop:22}}>
        <style>{STYLE}</style>
        {editKO&&(()=>{const _k=`${editKO.round}_${editKO.mi}`,_ip=koPen[_k],_pw=_ip?(koWinners[_k]?.name===editKO.match.h.name?"home":"away"):null;return<ScoreEditor score={koScores[_k]} homeTeam={editKO.match.h} awayTeam={editKO.match.a} isPen={_ip} penWinner={_pw} isKO={true} onClose={()=>setEditKO(null)} onSave={saveKOScore}/>;})()}
        <div style={{textAlign:"center",marginBottom:4}}>
          <div className="fadeUp" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,152,0,0.15)",border:"1.5px solid rgba(255,152,0,0.35)",borderRadius:22,padding:"8px 22px"}}>
            <span style={{fontSize:20}}>{ROUND_ICON[koRound]}</span>
            <span style={{fontFamily:"Fredoka One,cursive",fontSize:19,color:"#FFD700"}}>{ROUND_LABEL[koRound]} Resultados</span>
          </div>
        </div>
        <p style={{fontFamily:"Nunito,sans-serif",color:"rgba(255,255,255,0.3)",fontSize:11,textAlign:"center"}}>(toque no placar para editar)</p>
        <div style={{width:"100%",maxWidth:420,display:"flex",flexDirection:"column",gap:8}}>
          {roundMatches.map((m,mi)=>{
            const key=`${koRound}_${mi}`,s=koScores[key],win=koWinners[key],isPen=koPen[key];
            if(!m||!s)return null;const homeWon=win?.name===m.h.name;
            return(<div key={mi} style={{background:"rgba(255,255,255,0.04)",borderRadius:14,padding:"12px 14px",border:"1px solid rgba(255,255,255,0.08)",display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{fontSize:28}}>{m.h.flag}</span><span style={{fontFamily:"Fredoka One,cursive",fontSize:10,color:homeWon?"#66BB6A":"rgba(255,255,255,0.5)",textAlign:"center",lineHeight:1.2}}>{m.h.name}</span>{homeWon&&<span style={{fontSize:10,color:"#FFD700"}}>🏆</span>}</div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <button onClick={()=>setEditKO({round:koRound,mi,match:m})} style={{fontFamily:"Fredoka One,cursive",fontSize:20,color:"white",background:"rgba(255,215,0,0.12)",border:"1px solid rgba(255,215,0,0.28)",borderRadius:10,padding:"4px 12px",cursor:"pointer",minWidth:56,textAlign:"center"}}>{s.h}–{s.a}</button>
                {isPen&&<span style={{fontSize:9,color:"rgba(255,152,0,0.85)",fontFamily:"Nunito"}}>pên.</span>}
              </div>
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}><span style={{fontSize:28}}>{m.a.flag}</span><span style={{fontFamily:"Fredoka One,cursive",fontSize:10,color:!homeWon?"#66BB6A":"rgba(255,255,255,0.5)",textAlign:"center",lineHeight:1.2}}>{m.a.name}</span>{!homeWon&&<span style={{fontSize:10,color:"#FFD700"}}>🏆</span>}</div>
            </div>);
          })}
        </div>
        {!isFinal&&(
          <div style={{width:"100%",maxWidth:420,background:"rgba(255,215,0,0.06)",borderRadius:16,padding:"14px",border:"1px solid rgba(255,215,0,0.15)"}}>
            <p style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"#FFD700",marginBottom:8}}>
              ✈️ {koRound==="sf"?"Para a Disputa do 3º Lugar e a Final":"Avançando para "+ROUND_LABEL[ROUND_NEXT[koRound]]}
            </p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {roundMatches.map((_,mi)=>{const win=koWinners[`${koRound}_${mi}`];if(!win)return null;return(<div key={mi} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.06)",borderRadius:10,padding:"5px 10px"}}><span style={{fontSize:18}}>{win.flag}</span><span style={{fontFamily:"Fredoka One,cursive",fontSize:11,color:"white"}}>{win.name}</span></div>);})}
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:10,width:"100%",maxWidth:420}}>
          <button onClick={()=>setView("group-hub")} style={{...BTN.ghost,flex:1,fontSize:13}}>📋 Grupos</button>
          {isFinal
            ? (koWinners[`${koRound}_0`]||koWinners["final_0"])
              ? <button onClick={()=>{const fw=koWinners[`${koRound}_0`]||koWinners["final_0"];setChamp(fw);setView("champion");}} style={{...BTN.orange,flex:1.4,fontSize:14,padding:"14px 0"}}>🏆 Campeão!</button>
              : <button onClick={()=>setView("knockout")} style={{...BTN.green,flex:1.4,fontSize:14,padding:"14px 0"}}>👑 Escolha o vencedor →</button>
            : <button onClick={advanceKORound} style={{...BTN.green,flex:1.4,fontSize:14,padding:"14px 0"}}>
                {koRound==="sf"?"🥉 Disputa do 3º Lugar":ROUND_ICON[ROUND_NEXT[koRound]]+" "+ROUND_LABEL[ROUND_NEXT[koRound]]+" →"}
              </button>
          }
        </div>
      </div>
    );
  }

  /* ── 3rd Place Jogo — pick ── */
  if(view==="third-play"&&thirdMatch)return(
    <div style={{...BG,justifyContent:"flex-start",gap:16,paddingTop:28}}>
      <style>{STYLE}</style>
      <div style={{textAlign:"center"}}>
        <div className="fadeUp" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(169,124,80,0.18)",border:"1.5px solid rgba(169,124,80,0.4)",borderRadius:22,padding:"8px 22px"}}>
          <span style={{fontSize:20}}>🥉</span>
          <span style={{fontFamily:"Fredoka One,cursive",fontSize:19,color:"#D4A96A"}}>3rd Place Match</span>
        </div>
      </div>
      <p style={{fontFamily:"Nunito,sans-serif",color:"rgba(255,255,255,0.35)",fontSize:12,textAlign:"center"}}>Quem fica com o bronze?</p>
      <SwipeCard key="third-place" homeTeam={thirdMatch.h} awayTeam={thirdMatch.a} matchNum={1} total={1} onResult={onThirdResult} is3rd={true}/>
    </div>
  );

  /* ── 3rd Place Jogo — result ── */
  if(view==="third-result"&&thirdWinner&&thirdLoser&&thirdScore)return(
    <div style={{...BG,gap:16,paddingTop:28}}>
      <style>{STYLE}</style>
      <div style={{textAlign:"center"}}>
        <div className="fadeUp" style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(169,124,80,0.18)",border:"1.5px solid rgba(169,124,80,0.4)",borderRadius:22,padding:"8px 22px"}}>
          <span style={{fontSize:20}}>🥉</span>
          <span style={{fontFamily:"Fredoka One,cursive",fontSize:19,color:"#D4A96A"}}>3rd Place Result</span>
        </div>
      </div>
      {/* Result card */}
      <div style={{width:"100%",maxWidth:420,background:"rgba(255,255,255,0.04)",borderRadius:20,border:"1px solid rgba(169,124,80,0.2)",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",padding:"20px 16px",gap:10}}>
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <span style={{fontSize:44}}>{thirdWinner.flag}</span>
            <span style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"#D4A96A",textAlign:"center"}}>{thirdWinner.name}</span>
            <span style={{fontSize:22}}>🥉</span>
            <span style={{fontFamily:"Fredoka One,cursive",fontSize:11,color:"#A97C50"}}>3rd Place</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontFamily:"Fredoka One,cursive",fontSize:26,color:"white"}}>{thirdScore.h}–{thirdScore.a}</span>
            {thirdPen&&<span style={{fontSize:9,color:"rgba(255,152,0,0.85)",fontFamily:"Nunito"}}>pên.</span>}
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
            <span style={{fontSize:44}}>{thirdLoser.flag}</span>
            <span style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"rgba(255,255,255,0.5)",textAlign:"center"}}>{thirdLoser.name}</span>
            <span style={{fontSize:22}}>🏅</span>
            <span style={{fontFamily:"Fredoka One,cursive",fontSize:11,color:"rgba(255,255,255,0.35)"}}>4º Lugar</span>
          </div>
        </div>
      </div>
      <button onClick={()=>{setKoRound("final");setKoMIdx(0);setKoReturnView("third-result");setView("knockout");}} style={{...BTN.orange,fontSize:18,padding:"16px 48px"}}>
        👑 Para a Grande Final!
      </button>
    </div>
  );

  /* ── Print Chart ─────────────────────────────────────────────────── */
  if(view==="print-chart"){
    const koPhaseOrder=["final","sf","qf","r16","r32"];
    const phaseLabel={r32:"Rodada de 32",r16:"Oitavas de Final",qf:"Quartas de Final",sf:"Semifinais",final:"Grande Final"};
    // Share modal rendered here too so it works from this view
    const ShareModalLayer=showShareModal?(()=>{
      const txt=buildShareText();
      return(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
          <div style={{background:"#0d1f14",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"24px 24px 0 0",padding:"22px 20px 32px",width:"min(480px,100vw)",display:"flex",flexDirection:"column",gap:14,maxHeight:"80vh"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontFamily:"Fredoka One,cursive",fontSize:17,color:"#FFD700"}}>📋 Compartilhar Palpite</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <button onClick={exportBet} title="Exportar JSON (para integração)" style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:8,padding:"5px 9px",cursor:"pointer",fontFamily:"monospace",fontSize:12,color:"rgba(255,255,255,0.5)"}}>{"</>"}</button>
                <button onClick={()=>setShowShareModal(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:"rgba(255,255,255,0.4)",lineHeight:1}}>✕</button>
              </div>
            </div>
            <p style={{fontFamily:"Nunito,sans-serif",fontSize:12,color:"rgba(255,255,255,0.38)"}}>Copie o texto abaixo para colar em outro app de palpites.</p>
            <textarea readOnly value={txt} onClick={e=>e.target.select()} style={{flex:1,minHeight:220,maxHeight:"45vh",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"12px 14px",color:"rgba(255,255,255,0.75)",fontFamily:"monospace",fontSize:11,lineHeight:1.7,resize:"none",outline:"none",overflowY:"auto"}}/>
            <button onClick={()=>{navigator.clipboard.writeText(txt).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});}} style={{...BTN.green,width:"100%",padding:"14px 0",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s"}}>
              {copied?<><span>✅</span> Copiado!</>:<><span>📋</span> Copiar Texto</>}
            </button>
          </div>
        </div>
      );
    })():null;
    return(
      <div id="print-chart" style={{minHeight:"100vh",background:"#040c06",padding:"20px 14px 48px",fontFamily:"Nunito,sans-serif"}}>{ShareModalLayer}
        <style>{STYLE}</style>
        {/* Nav bar — hidden on print */}
        <div className="no-print" style={{display:"flex",justifyContent:"space-between",alignItems:"center",maxWidth:480,margin:"0 auto 18px"}}>
          <button onClick={()=>setView("champion")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.45)",fontSize:22,cursor:"pointer",padding:4}}>←</button>
          <span style={{fontFamily:"Fredoka One,cursive",fontSize:16,color:"#FFD700"}}>📋 Meu Palpite Completo</span>
          <div style={{width:32}}/>
        </div>

        <div style={{maxWidth:480,margin:"0 auto",display:"flex",flexDirection:"column",gap:16}}>
          {/* Header */}
          <div style={{textAlign:"center",padding:"14px 0 8px"}}>
            <div style={{fontSize:44,lineHeight:1,marginBottom:6}}>🏆</div>
            <h1 style={{fontFamily:"Fredoka One,cursive",fontSize:26,color:"#FFD700",lineHeight:1.1}}>Meu Palpite — Copa 2026</h1>
          </div>

          {/* Podium */}
          {champ&&(
            <div style={{background:"rgba(255,215,0,0.07)",border:"1px solid rgba(255,215,0,0.2)",borderRadius:16,padding:"12px 16px",display:"flex",flexDirection:"column",gap:7}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:28}}>{champ.flag}</span>
                <div>
                  <div style={{fontFamily:"Fredoka One,cursive",fontSize:17,color:"#FFD700"}}>{champ.name}</div>
                  <div style={{fontFamily:"Nunito,sans-serif",fontSize:11,color:"rgba(255,215,0,0.55)"}}>🥇 Campeão</div>
                </div>
              </div>
              {thirdWinner&&(
                <div style={{display:"flex",alignItems:"center",gap:10,opacity:0.75}}>
                  <span style={{fontSize:22}}>{thirdWinner.flag}</span>
                  <span style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"#D4A96A"}}>{thirdWinner.name} 🥉 3º Lugar</span>
                </div>
              )}
              {thirdLoser&&(
                <div style={{display:"flex",alignItems:"center",gap:10,opacity:0.5}}>
                  <span style={{fontSize:22}}>{thirdLoser.flag}</span>
                  <span style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"rgba(255,255,255,0.5)"}}>{thirdLoser.name} 🏅 4º Lugar</span>
                </div>
              )}
            </div>
          )}

          {/* Knockout phases — order: final → sf → [3rd place] → qf → r16 → r32 */}
          {koPhaseOrder.flatMap(rnd=>{
            const matches=koMatches[rnd]||[];
            if(!matches.length)return[];
            const phaseBlock=(
              <div key={rnd} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,overflow:"hidden"}}>
                <div style={{background:"rgba(255,152,0,0.12)",padding:"7px 12px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                  <span style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"#FFB74D"}}>{phaseLabel[rnd]}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:0}}>
                  {matches.map((m,mi)=>{
                    const key=`${rnd}_${mi}`;
                    const s=koScores[key];
                    const win=koWinners[key];
                    const pen=koPen[key];
                    if(!s)return null;
                    const homeWon=win&&m.h&&win.name===m.h.name;
                    return(
                      <div key={mi} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderBottom:mi<matches.length-1?"1px solid rgba(255,255,255,0.04)":"none"}}>
                        <span style={{fontSize:16,flexShrink:0}}>{m.h?.flag}</span>
                        <span style={{fontFamily:"Fredoka One,cursive",fontSize:11,flex:1,color:homeWon?"#66BB6A":"rgba(255,255,255,0.45)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.h?.name}</span>
                        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,flexShrink:0}}>
                          <span style={{fontFamily:"Fredoka One,cursive",fontSize:14,color:"white"}}>{s.h}–{s.a}</span>
                          {pen&&<span style={{fontSize:8,color:"rgba(255,152,0,0.7)",fontFamily:"Nunito"}}>pên.</span>}
                        </div>
                        <span style={{fontFamily:"Fredoka One,cursive",fontSize:11,flex:1,color:!homeWon?"#66BB6A":"rgba(255,255,255,0.45)",textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.a?.name}</span>
                        <span style={{fontSize:16,flexShrink:0}}>{m.a?.flag}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
            const thirdBlock=rnd==="sf"&&thirdMatch&&thirdScore?(
              <div key="third" style={{background:"rgba(169,124,80,0.07)",border:"1px solid rgba(169,124,80,0.2)",borderRadius:14,overflow:"hidden"}}>
                <div style={{background:"rgba(169,124,80,0.15)",padding:"7px 12px",borderBottom:"1px solid rgba(169,124,80,0.12)"}}>
                  <span style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"#D4A96A"}}>🥉 Disputa do 3º Lugar</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,padding:"9px 12px"}}>
                  <span style={{fontSize:18}}>{thirdMatch.h?.flag}</span>
                  <span style={{fontFamily:"Fredoka One,cursive",fontSize:12,flex:1,color:thirdWinner?.name===thirdMatch.h?.name?"#D4A96A":"rgba(255,255,255,0.45)"}}>{thirdMatch.h?.name}</span>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
                    <span style={{fontFamily:"Fredoka One,cursive",fontSize:15,color:"white"}}>{thirdScore.h}–{thirdScore.a}</span>
                    {thirdPen&&<span style={{fontSize:8,color:"rgba(255,152,0,0.7)",fontFamily:"Nunito"}}>pên.</span>}
                  </div>
                  <span style={{fontFamily:"Fredoka One,cursive",fontSize:12,flex:1,textAlign:"right",color:thirdWinner?.name===thirdMatch.a?.name?"#D4A96A":"rgba(255,255,255,0.45)"}}>{thirdMatch.a?.name}</span>
                  <span style={{fontSize:18}}>{thirdMatch.a?.flag}</span>
                </div>
              </div>
            ):null;
            return thirdBlock?[phaseBlock,thirdBlock]:[phaseBlock];
          })}

          {/* Group Stage */}
          <div style={{fontFamily:"Fredoka One,cursive",fontSize:14,color:"rgba(255,255,255,0.45)",marginBottom:-8,marginTop:4}}>Fase de Grupos</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {GROUPS.map((g,gi)=>{
              const st=calcStandings(gi,scores);
              const groupMatches=getMatches(gi);
              return(
                <div key={g.id} style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,overflow:"hidden"}}>
                  <div style={{background:g.bg||"rgba(255,255,255,0.05)",padding:"5px 9px",borderBottom:"1px solid rgba(255,255,255,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontFamily:"Fredoka One,cursive",fontSize:13,color:"#FFD700"}}>Grupo {g.id}</span>
                    <span style={{fontSize:11}}>{g.teams.map(t=>t.flag).join("")}</span>
                  </div>
                  {/* Matches */}
                  <div style={{padding:"5px 8px",display:"flex",flexDirection:"column",gap:3}}>
                    {groupMatches.map((m,mi)=>{
                      const key=`g${gi}_m${mi}`;
                      const s=scores[key];
                      if(!s)return null;
                      const H=g.teams[m.h],A=g.teams[m.a];
                      return(
                        <div key={mi} style={{display:"flex",alignItems:"center",gap:3,fontSize:10}}>
                          <span style={{fontSize:13}}>{H.flag}</span>
                          <span style={{fontFamily:"Fredoka One,cursive",fontSize:9,color:s.h>s.a?"#66BB6A":"rgba(255,255,255,0.4)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{H.name}</span>
                          <span style={{fontFamily:"Fredoka One,cursive",fontSize:11,color:"white",flexShrink:0}}>{s.h}–{s.a}</span>
                          <span style={{fontFamily:"Fredoka One,cursive",fontSize:9,color:s.a>s.h?"#66BB6A":"rgba(255,255,255,0.4)",flex:1,textAlign:"right",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{A.name}</span>
                          <span style={{fontSize:13}}>{A.flag}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Standings */}
                  <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",padding:"5px 8px",display:"flex",flexDirection:"column",gap:2}}>
                    {st.map((row,ri)=>(
                      <div key={row.name} style={{display:"flex",alignItems:"center",gap:4}}>
                        <span style={{fontFamily:"Fredoka One,cursive",fontSize:9,color:ri<2?"#66BB6A":"rgba(255,255,255,0.25)",width:10}}>{ri+1}º</span>
                        <span style={{fontSize:12}}>{row.flag}</span>
                        <span style={{fontFamily:"Fredoka One,cursive",fontSize:9,color:ri<2?"white":"rgba(255,255,255,0.45)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{row.name}</span>
                        <span style={{fontFamily:"Fredoka One,cursive",fontSize:10,color:"#FFD700"}}>{row.pts}p</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="no-print" style={{display:"flex",gap:10,justifyContent:"center",alignItems:"center",paddingTop:8,paddingBottom:8,flexWrap:"wrap"}}>
            <button onClick={()=>setView("champion")} style={{fontFamily:"Fredoka One,cursive",fontSize:14,color:"rgba(255,255,255,0.45)",background:"none",border:"none",cursor:"pointer"}}>← Voltar ao Campeão</button>
            <button onClick={()=>{setCopied(false);setShowShareModal(true);}} style={{...BTN.ghost,fontSize:14,padding:"10px 20px",display:"flex",alignItems:"center",gap:7}}>
              <span>🔗</span> Compartilhar Palpite
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Champion ── */
  if(view==="champion"&&!champ)return(
    <div style={{...BG,justifyContent:"center"}}>
      <style>{STYLE}</style>
      <p style={{fontFamily:"Fredoka One,cursive",fontSize:20,color:"white"}}>Loading champion… 🏆</p>
    </div>
  );

  if(view==="champion"&&champ)return(
    <div style={{...BG,justifyContent:"center",gap:28,textAlign:"center",position:"relative"}}>
      <style>{STYLE}</style><Confetti/>

      {/* ── Restart confirmation modal ── */}
      {showRestartConfirm&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <div style={{background:"#0e2018",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:24,padding:"28px 24px",width:"min(320px,92vw)",display:"flex",flexDirection:"column",alignItems:"center",gap:18,textAlign:"center"}}>
            <span style={{fontSize:44}}>⚠️</span>
            <div>
              <p style={{fontFamily:"Fredoka One,cursive",fontSize:18,color:"#FFD700",marginBottom:8}}>Apagar o palpite atual?</p>
              <p style={{fontFamily:"Nunito,sans-serif",fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>Isso vai resetar todos os resultados do mata-mata. Quer salvar antes?</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
              <button onClick={()=>{setShowRestartConfirm(false);setCopied(false);setShowShareModal(true);}} style={{...BTN.ghost,width:"100%",padding:"13px 0",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <span>🔗</span> Compartilhar Palpite antes
              </button>
              <button onClick={()=>{restartKO();setShowRestartConfirm(false);}} style={{background:"rgba(239,83,80,0.15)",border:"1px solid rgba(239,83,80,0.3)",borderRadius:18,padding:"12px 0",width:"100%",color:"#EF5350",fontFamily:"Fredoka One,cursive",fontSize:14,cursor:"pointer"}}>
                🗑️ Apagar e recomeçar
              </button>
              <button onClick={()=>setShowRestartConfirm(false)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"Fredoka One,cursive",fontSize:13,color:"rgba(255,255,255,0.3)",padding:"4px"}}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Share / copy-text modal ── */}
      {showShareModal&&(()=>{
        const txt=buildShareText();
        return(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0 0 0 0"}}>
            <div style={{background:"#0d1f14",border:"1.5px solid rgba(255,255,255,0.1)",borderRadius:"24px 24px 0 0",padding:"22px 20px 32px",width:"min(480px,100vw)",display:"flex",flexDirection:"column",gap:14,maxHeight:"80vh"}}>
              {/* Modal header */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontFamily:"Fredoka One,cursive",fontSize:17,color:"#FFD700"}}>📋 Compartilhar Palpite</span>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <button onClick={exportBet} title="Exportar JSON (para integração)" style={{background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:8,padding:"5px 9px",cursor:"pointer",fontFamily:"monospace",fontSize:12,color:"rgba(255,255,255,0.5)"}}>{"</>"}</button>
                  <button onClick={()=>setShowShareModal(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:22,color:"rgba(255,255,255,0.4)",lineHeight:1}}>✕</button>
                </div>
              </div>
              <p style={{fontFamily:"Nunito,sans-serif",fontSize:12,color:"rgba(255,255,255,0.38)"}}>Copie o texto abaixo para colar em outro app de palpites.</p>
              {/* Text area */}
              <textarea readOnly value={txt} onClick={e=>e.target.select()} style={{flex:1,minHeight:220,maxHeight:"45vh",background:"rgba(0,0,0,0.4)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:"12px 14px",color:"rgba(255,255,255,0.75)",fontFamily:"monospace",fontSize:11,lineHeight:1.7,resize:"none",outline:"none",overflowY:"auto"}}/>
              {/* Copy button */}
              <button
                onClick={()=>{
                  navigator.clipboard.writeText(txt).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);});
                }}
                style={{...BTN.green,width:"100%",padding:"14px 0",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s"}}
              >
                {copied?<><span>✅</span> Copiado!</>:<><span>📋</span> Copiar Texto</>}
              </button>
            </div>
          </div>
        );
      })()}
      <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:24}}>
        <div className="float" style={{fontSize:80,lineHeight:1}}>🏆</div>
        <div>
          <p style={{fontFamily:"Nunito,sans-serif",color:"rgba(255,255,255,0.55)",fontSize:17,marginBottom:12}}>O Campeão da Copa do Mundo 2026 é…</p>
          <div className="pop" style={{fontSize:80,lineHeight:1,marginBottom:8}}>{champ.flag}</div>
          <h1 style={{fontFamily:"Fredoka One,cursive",fontSize:46,color:"#FFD700",lineHeight:1.05,textShadow:"0 4px 28px rgba(255,215,0,0.35)"}}>{champ.name}</h1>
          {champ.groupId&&<p style={{fontFamily:"Nunito,sans-serif",color:"rgba(255,255,255,0.35)",fontSize:13,marginTop:8}}>Grupo {champ.groupId}</p>}
        </div>
        {thirdWinner&&(
          <div style={{background:"rgba(169,124,80,0.12)",border:"1px solid rgba(169,124,80,0.25)",borderRadius:16,padding:"10px 24px",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:24}}>{thirdWinner.flag}</span>
            <span style={{fontFamily:"Fredoka One,cursive",fontSize:14,color:"#D4A96A"}}>{thirdWinner.name} 🥉 3º Lugar</span>
          </div>
        )}
        <p style={{fontFamily:"Nunito,sans-serif",color:"rgba(255,255,255,0.55)",fontSize:15,maxWidth:290,lineHeight:1.6}}>🎉 O torneio começa em 11 de junho de 2026!</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,alignItems:"center",width:"100%",maxWidth:340}}>
          {/* 1 — Primary: full bet view */}
          <button onClick={()=>setView("print-chart")} style={{...BTN.green,fontSize:17,padding:"15px 0",width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            <span style={{fontSize:20}}>📋</span> Ver Meu Palpite Completo
          </button>
          {/* 2 — Secondary: share */}
          <div style={{width:"100%",position:"relative"}}>
            <button onClick={()=>{setCopied(false);setShowShareModal(true);}} style={{...BTN.ghost,width:"100%",padding:"13px 0",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
              <span>🔗</span> Compartilhar Palpite
            </button>
            <button onClick={exportBet} title="Exportar JSON (para integração)" style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:8,padding:"4px 7px",cursor:"pointer",fontFamily:"monospace",fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1}}>{"</>"}</button>
          </div>
          {/* 3 — Least prominent: try again (with warning) */}
          <button onClick={()=>setShowRestartConfirm(true)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"Fredoka One,cursive",fontSize:13,color:"rgba(255,255,255,0.28)",padding:"6px 0",marginTop:2}}>🔄 Tentar de Novo</button>
        </div>
      </div>
    </div>
  );

  return null;
}
