(function(){
const app=document.getElementById("app");let D=null,q="";
const id=new URLSearchParams(location.search).get("m");
function banners(){return (hasDemo(D)?`<div class="warn demo" id="demowarn">⚠️ ${esc(DEMO_WARN)} Rows tagged EXAMPLE are general U.S. estimates from public sources, not this practice's fees.</div>`:"")+
 `<div class="warn">Prices are estimates, not a treatment quote.</div>`;}
function footer(){const used=new Set();visibleCats(D).forEach(c=>c.items.forEach(i=>i.demo&&i.src&&used.add(i.src)));
 const srcs=D.sources.filter(s=>used.has(s.key));
 return `${D.contact?`<div class="item"><b>How to reach us</b><div class="note" style="white-space:pre-wrap">${esc(D.contact)}</div></div>`:""}
 <p class="disc">${esc(DISCLAIMER)}</p>
 ${srcs.length?`<div class="src"><b>Sources for example estimates</b><br>${srcs.map(s=>`[${esc(s.key)}] ${esc(s.title)} — ${s.url?`<a href="${esc(s.url)}" rel="noopener nofollow" target="_blank">${esc(s.url)}</a>`:""} ${esc(s.note)}`).join("<br>")}</div>`:""}`;}
function home(){
 const cats=visibleCats(D);let h=banners()+`<input id="q" type="search" placeholder="Search treatments (e.g. crown, implant)" value="${esc(q)}" aria-label="Search">`;
 if(q){const t=q.toLowerCase();const hits=[];cats.forEach(c=>c.items.forEach(i=>{if((i.name+" "+i.note+" "+i.includes+" "+c.name).toLowerCase().includes(t))hits.push([c,i])}));
  h+=`<div id="results">${hits.length?hits.map(([c,i])=>`<div class="muted">${esc(c.name)}</div>`+itemHTML(i,D.currency,i.src)).join(""):'<p class="muted">No matches.</p>'}</div>`;}
 else h+=`<div class="tiles">${cats.map(c=>`<button class="tile" data-c="${esc(c.id)}"><div class="e">${esc(c.emoji||"🦷")}</div><b>${esc(c.name)}</b><small>${esc(c.tagline)}</small></button>`).join("")}</div>`;
 app.innerHTML=h+footer();
 const qi=document.getElementById("q");qi.oninput=()=>{q=qi.value;home();const n=document.getElementById("q");n.focus();n.setSelectionRange(q.length,q.length);};
 app.querySelectorAll(".tile").forEach(b=>b.onclick=()=>{location.hash="c="+b.dataset.c;});}
function detail(cid){const cats=visibleCats(D);const c=cats.find(x=>x.id===cid);if(!c)return home();
 app.innerHTML=`<button class="back" id="back">‹ All treatments</button>`+banners()+`<h2>${esc(c.emoji)} ${esc(c.name)}</h2>`+
 (c.items.length?c.items.map(i=>itemHTML(i,D.currency,i.src)).join(""):'<p class="muted">Contact us for prices.</p>')+
 `<h3>Other treatments</h3><div class="others">${cats.filter(x=>x.id!==cid).map(x=>`<a href="#c=${encodeURIComponent(x.id)}">${esc(x.emoji)} ${esc(x.name)}</a>`).join("")}</div>`+footer();
 document.getElementById("back").onclick=()=>{location.hash="";};scrollTo(0,0);}
function route(){const m=/c=([^&]+)/.exec(location.hash);m?detail(decodeURIComponent(m[1])):home();}
if(!id||!/^[A-Za-z0-9_-]{16,40}$/.test(id)){app.innerHTML='<p>This price guide link is incomplete.</p>';return;}
fetch(API+"/api/menus/"+id,{cache:"no-store"}).then(r=>{if(!r.ok)throw 0;return r.json()}).then(j=>{D=j.data;
 document.getElementById("title").textContent=D.practice;document.title=D.practice;window.onhashchange=route;route();})
 .catch(()=>{app.innerHTML='<p>Price guide not found or offline. Please try again later.</p>';});
})();
