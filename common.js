// Shared by owner app and patient menu. All text is rendered via esc().
window.API="https://dental-menu.cakebook.workers.dev";
window.SITE="https://chhall91.github.io/dental-price-guide/";
window.UNITS={
 visit:"per visit",tooth:"per tooth",surface:"per tooth (1 surface)",set:"per set of X-rays",quadrant:"per quadrant (¼ of mouth)",
 arch:"per arch (upper OR lower)",bothArches:"both arches (upper AND lower)",
 bridgeUnit:"per bridge unit — each tooth in the bridge, NOT the whole bridge",bridge3:"entire 3-unit bridge (all 3 teeth)",
 implantFixture:"implant post only — abutment & crown NOT included",abutment:"abutment only (connector piece)",implantCrown:"crown on implant only",
 implantComplete:"complete single implant tooth (post + abutment + crown)",procedure:"per procedure",graftSite:"per graft site",
 fullTreatment:"full treatment total (not a monthly payment)",month:"per month — payment amount, NOT total treatment cost",hour:"per hour",item:"each"};
window.DISCLAIMER="Informational estimates only — not a quote. An examination and a written treatment plan are needed for an exact price. Insurance benefits and out-of-pocket costs vary. Additional lab, imaging, sedation and specialist fees may apply unless specifically listed as included. This guide does not give clinical advice.";
window.DEMO_WARN="Contains example prices; not a quote.";
window.esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
window.money=(n,cur)=>{try{return new Intl.NumberFormat("en-US",{style:"currency",currency:cur||"USD",maximumFractionDigits:0}).format(n)}catch(e){return "$"+n}};
window.priceText=(i,cur)=>{
 if(i.priceType==="contact"||i.low==null)return "Contact practice for estimate";
 if(i.priceType==="fixed"||i.high==null||i.high===i.low)return money(i.low,cur);
 return money(i.low,cur)+" – "+money(i.high,cur);};
window.visibleCats=d=>d.categories.filter(c=>!c.hidden).map(c=>({...c,items:c.items.filter(i=>!i.hidden)}));
window.hasDemo=d=>visibleCats(d).some(c=>c.items.some(i=>i.demo));
window.menuUrl=id=>SITE+"menu.html?m="+encodeURIComponent(id);
window.smsBody=url=>"Here is our dental price guide: "+url+" . Prices are estimates, not a treatment quote.";
window.smsHref=url=>"sms:&body="+encodeURIComponent(smsBody(url));
window.itemHTML=(i,cur,src)=>`<div class="item">
 <div class="ih"><div class="in">${esc(i.name)}${i.demo?' <span class="tag">EXAMPLE</span>':''}</div><div class="ip">${esc(priceText(i,cur))}</div></div>
 <div class="unit">${esc(UNITS[i.unit]||"")}</div>
 ${i.includes?`<div class="inc"><b>Includes:</b> ${esc(i.includes)}</div>`:""}
 ${i.excludes?`<div class="exc"><b>Not included:</b> ${esc(i.excludes)}</div>`:""}
 ${i.note?`<div class="note">${esc(i.note)}</div>`:""}
 ${i.demo?`<div class="demo">Example U.S. estimate${src?` from source [${esc(src)}]`:""} — not this practice's fee.</div>`:""}
</div>`;
