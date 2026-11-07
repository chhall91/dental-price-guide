(function(){
const app=document.getElementById("app");const LS="dpg.data",LK="dpg.key";
let D=JSON.parse(localStorage.getItem(LS)||"null")||SEED();let K=JSON.parse(localStorage.getItem(LK)||"null");
let status="",timer=null,view={p:"home"};
const uid=()=>Math.random().toString(36).slice(2,10);
const isIOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
window.smsHref=url=>"sms:"+(isIOS?"&":"?")+"body="+encodeURIComponent(smsBody(url));
function save(){localStorage.setItem(LS,JSON.stringify(D));clearTimeout(timer);timer=setTimeout(publish,600);}
async function publish(){
 status="Publishing…";paintStatus();
 try{let r;
  if(!K){r=await fetch(API+"/api/menus",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:D})});
   if(!r.ok)throw 0;K=await r.json();localStorage.setItem(LK,JSON.stringify(K));}
  else{r=await fetch(API+"/api/menus/"+K.id,{method:"PUT",headers:{"Content-Type":"application/json","Authorization":"Bearer "+K.token},body:JSON.stringify({data:D})});
   if(r.status===401){status="⚠️ This phone's edit key was rejected. Restore your recovery code in Settings.";paintStatus();return false;}
   if(!r.ok)throw 0;}
  status="✓ Published — your link is up to date";paintStatus();if(view.p==="home")render();return true;
 }catch(e){status="Offline — changes saved on this phone and will publish when you're online.";paintStatus();return false;}}
function paintStatus(){const s=document.getElementById("status");if(s)s.textContent=status;}
async function link(){if(!K)await publish();return K?menuUrl(K.id):null;}
function demoOk(){return !hasDemo(D)||confirm("⚠️ "+DEMO_WARN+"\n\nThis list still has EXAMPLE prices that are not your practice's fees. Share anyway?");}
async function share(){if(!demoOk())return;const u=await link();if(!u)return alert("Can't publish right now — check your connection.");
 const text=smsBody(u);
 if(navigator.share){try{await navigator.share({text});return}catch(e){if(e&&e.name==="AbortError")return}}
 try{await navigator.clipboard.writeText(text);alert("Copied:\n\n"+text)}catch(e){prompt("Copy this:",text)}}
async function textLink(){if(!demoOk())return;const u=await link();if(!u)return alert("Can't publish right now — check your connection.");location.href=smsHref(u);}
function home(){
 const demo=hasDemo(D);
 app.innerHTML=`${demo?`<div class="warn demo">⚠️ ${esc(DEMO_WARN)} Rows tagged EXAMPLE are general U.S. estimates from public sources — NOT your practice's fees. Edit a price to make it yours.</div>`:""}
 <div class="row"><button id="share">📤 Share price list</button><button id="sms" class="btn2">💬 Text link</button><button id="prev" class="btn2">👁 Preview patient view</button></div>
 <div class="status" id="status">${esc(status)}</div>
 ${K?`<div class="muted">Patient link: <span id="plink">${esc(menuUrl(K.id))}</span></div>`:'<div class="muted">Your patient link is created the first time you publish or share.</div>'}
 <h3>Settings</h3><div class="ed">
 <label>Practice / guide name<input id="pn" maxlength="80" value="${esc(D.practice)}"></label>
 <label>Currency<select id="cur">${["USD","CAD","EUR","GBP","AUD","MXN"].map(c=>`<option ${c===D.currency?"selected":""}>${c}</option>`).join("")}</select></label>
 <label>Contact instructions for patients (optional, plain text)<textarea id="ct" maxlength="400" rows="2" placeholder="e.g. Call the front desk to schedule an exam.">${esc(D.contact)}</textarea></label>
 <div class="row"><button id="sset">Save settings</button><button id="pub" class="btn2">Publish now</button></div></div>
 <h3>Treatment groups</h3><input id="newcat" placeholder="New group name (e.g. Kids' dentistry)"><div class="row"><button id="addcat">＋ Add group</button></div>
 ${D.categories.map((c,ix)=>`<div class="ed ${c.hidden?"hid":""}"><b>${esc(c.emoji)} ${esc(c.name)}</b> <span class="muted">${c.items.length} items${c.hidden?" · hidden":""}</span>
 <div class="row"><button class="btn2" data-a="open" data-i="${ix}">Edit</button><button class="btn2" data-a="up" data-i="${ix}">↑</button><button class="btn2" data-a="down" data-i="${ix}">↓</button><button class="btn2" data-a="hide" data-i="${ix}">${c.hidden?"Show":"Hide"}</button><button class="danger" data-a="del" data-i="${ix}">Delete</button></div></div>`).join("")}
 <h3>Edit key backup</h3><div class="ed"><div class="muted">Only this phone can change your published list. Save this recovery code somewhere private to edit from another device. Never send it to patients.</div>
 <div class="row"><button class="btn2" id="showkey">Show recovery code</button><button class="btn2" id="restore">Restore code</button><button class="danger" id="reset">Reset to example list</button></div><div id="keybox" class="src"></div></div>
 <p class="disc">${esc(DISCLAIMER)} Do not enter patient names, diagnoses, treatment plans or insurance details — this is a general fee menu.</p>`;
 const $=i=>document.getElementById(i);
 $("share").onclick=share;$("sms").onclick=textLink;$("pub").onclick=publish;
 $("prev").onclick=async()=>{const u=await link();if(u)window.open(u,"_blank")};
 $("sset").onclick=()=>{D.practice=$("pn").value.trim()||"Dental Price Guide";D.currency=$("cur").value;D.contact=$("ct").value.trim();save();render();};
 $("addcat").onclick=()=>{const n=$("newcat").value.trim();if(!n)return;D.categories.push({id:uid(),emoji:"🦷",name:n,tagline:"",hidden:false,items:[]});save();render();};
 $("showkey").onclick=()=>{$("keybox").textContent=K?K.id+"."+K.token:"Publish first.";};
 $("restore").onclick=()=>{const v=(prompt("Paste recovery code")||"").trim();const m=/^([A-Za-z0-9_-]{16,40})\.([A-Za-z0-9_-]{30,100})$/.exec(v);if(!m)return v&&alert("That code doesn't look right.");
  K={id:m[1],token:m[2]};localStorage.setItem(LK,JSON.stringify(K));fetch(API+"/api/menus/"+K.id).then(r=>r.json()).then(j=>{if(j.data){D=j.data;localStorage.setItem(LS,JSON.stringify(D));}render();});};
 $("reset").onclick=()=>{if(confirm("Replace your whole list with the example list? Your link stays the same.")){D=SEED();save();render();}};
 app.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{const i=+b.dataset.i,a=b.dataset.a,cs=D.categories;
  if(a==="open"){view={p:"cat",i};return render();}
  if(a==="up"&&i>0)[cs[i-1],cs[i]]=[cs[i],cs[i-1]];
  if(a==="down"&&i<cs.length-1)[cs[i+1],cs[i]]=[cs[i],cs[i+1]];
  if(a==="hide")cs[i].hidden=!cs[i].hidden;
  if(a==="del"&&!confirm(`Delete "${cs[i].name}" and all its prices?`))return;
  if(a==="del")cs.splice(i,1);save();render();});}
function cat(){const c=D.categories[view.i];if(!c){view={p:"home"};return render();}
 app.innerHTML=`<button class="back" id="back">‹ All groups</button><div class="status" id="status">${esc(status)}</div><div class="ed">
 <label>Group name<input id="cn" value="${esc(c.name)}" maxlength="60"></label><label>Emoji<input id="ce" value="${esc(c.emoji)}" maxlength="8"></label>
 <label>Tagline<input id="ctg" value="${esc(c.tagline)}" maxlength="120"></label><div class="row"><button id="csave">Save group</button></div></div>
 <div class="row"><button id="additem">＋ Add item</button></div>
 ${c.items.map((it,ix)=>`<div class="${it.hidden?"hid":""}">${itemHTML(it,D.currency,it.src)}<div class="row"><button class="btn2" data-a="edit" data-i="${ix}">Edit</button><button class="btn2" data-a="up" data-i="${ix}">↑</button><button class="btn2" data-a="down" data-i="${ix}">↓</button><button class="btn2" data-a="hide" data-i="${ix}">${it.hidden?"Show":"Hide"}</button><button class="danger" data-a="del" data-i="${ix}">Delete</button></div></div>`).join("")}`;
 const $=i=>document.getElementById(i);$("back").onclick=()=>{view={p:"home"};render();};
 $("csave").onclick=()=>{c.name=$("cn").value.trim()||"Untitled";c.emoji=$("ce").value.trim();c.tagline=$("ctg").value.trim();save();render();};
 $("additem").onclick=()=>{c.items.push({id:uid(),name:"New item",priceType:"contact",low:null,high:null,unit:"procedure",includes:"",excludes:"",note:"",demo:false,src:"",hidden:false});view={p:"item",i:view.i,j:c.items.length-1};save();render();};
 app.querySelectorAll("[data-a]").forEach(b=>b.onclick=()=>{const i=+b.dataset.i,a=b.dataset.a,is=c.items;
  if(a==="edit"){view={p:"item",i:view.i,j:i};return render();}
  if(a==="up"&&i>0)[is[i-1],is[i]]=[is[i],is[i-1]];if(a==="down"&&i<is.length-1)[is[i+1],is[i]]=[is[i],is[i+1]];
  if(a==="hide")is[i].hidden=!is[i].hidden;if(a==="del"&&!confirm(`Delete "${is[i].name}"?`))return;if(a==="del")is.splice(i,1);save();render();});}
function item(){const c=D.categories[view.i],it=c&&c.items[view.j];if(!it){view={p:"home"};return render();}
 app.innerHTML=`<button class="back" id="back">‹ ${esc(c.name)}</button><div class="ed">
 <label>Treatment name<input id="n" value="${esc(it.name)}" maxlength="100"></label>
 <label>Price type<select id="pt"><option value="range">Range (low – high)</option><option value="fixed">Fixed price</option><option value="contact">Contact practice for estimate</option></select></label>
 <label>Low / fixed price<input id="lo" type="number" inputmode="decimal" min="0" value="${it.low??""}"></label>
 <label>High price (ranges only)<input id="hi" type="number" inputmode="decimal" min="0" value="${it.high??""}"></label>
 <label>Priced…<select id="u">${Object.entries(UNITS).map(([k,v])=>`<option value="${k}" ${k===it.unit?"selected":""}>${esc(v)}</option>`).join("")}</select></label>
 <label>Includes<input id="inc" value="${esc(it.includes)}" maxlength="300"></label>
 <label>Not included<input id="exc" value="${esc(it.excludes)}" maxlength="300"></label>
 <label>Plain-language note<textarea id="nt" rows="2" maxlength="400">${esc(it.note)}</textarea></label>
 <label style="display:flex;gap:8px;align-items:center"><input id="dm" type="checkbox" style="width:auto" ${it.demo?"checked":""}> This is an EXAMPLE price (not our fee)</label>
 <div class="muted">Changing the price marks it as your practice's own price.</div>
 <div class="row"><button id="isave">Save item</button></div></div>`;
 const $=i=>document.getElementById(i);$("pt").value=it.priceType;$("back").onclick=()=>{view={p:"cat",i:view.i};render();};
 $("isave").onclick=()=>{const num=v=>v===""?null:Math.max(0,Number(v));const lo=num($("lo").value),hi=num($("hi").value),pt=$("pt").value;
  if(pt!=="contact"&&lo==null)return alert("Enter a price, or choose 'Contact practice for estimate'.");
  if(pt==="range"&&(hi==null||hi<lo))return alert("High price must be at least the low price.");
  const changed=pt!==it.priceType||lo!==it.low||(pt==="range"?hi:null)!==(it.priceType==="range"?it.high:null);
  Object.assign(it,{name:$("n").value.trim()||"Untitled",priceType:pt,low:pt==="contact"?null:lo,high:pt==="range"?hi:null,unit:$("u").value,includes:$("inc").value.trim(),excludes:$("exc").value.trim(),note:$("nt").value.trim()});
  it.demo=changed?false:$("dm").checked;if(!it.demo)it.src="";save();view={p:"cat",i:view.i};render();};}
function render(){({home,cat,item})[view.p]();}
render();
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
