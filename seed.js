// DEMO example ranges, researched 2026-11-07 from public U.S. cost sources (see SOURCES). NOT any practice's fees.
(function(){
let n=0;const I=(name,low,high,unit,src,o={})=>({id:"i"+(++n),name,priceType:low==null?"contact":"range",low,high,unit,includes:o.inc||"",excludes:o.exc||"",note:o.note||"",demo:true,src:src||"",hidden:false});
const C=(id,emoji,name,tagline,items)=>({id,emoji,name,tagline,hidden:false,items});
window.SEED=()=>({v:1,practice:"Dental Price Guide",currency:"USD",contact:"",categories:[
C("prev","🦷","Exams, X-rays & Prevention","Checkups, cleanings, X-rays",[
 I("Routine exam (checkup)",50,150,"visit","S1"),
 I("Adult cleaning",75,200,"visit","S1",{note:"Routine cleaning for healthy gums. Deep cleaning is listed under Gum Treatment."}),
 I("Bitewing X-rays (set of 4)",40,120,"set","S1"),
 I("Panoramic / full-mouth X-rays",60,250,"set","S1"),
 I("New-patient visit",200,450,"visit","S1",{inc:"Exam, cleaning and routine X-rays"}),
 I("Custom night guard",300,800,"item","S1")]),
C("fill","🪥","Fillings","Tooth-colored fillings",[
 I("Tooth-colored (composite) filling, 1 surface",100,400,"surface","S1",{note:"Price rises with more surfaces and larger fillings."}),
 I("Silver (amalgam) filling",null,null,"tooth","")]),
C("crown","👑","Crowns","Caps for damaged teeth",[
 I("Porcelain / ceramic crown",800,2500,"tooth","S1",{note:"Material and tooth location affect price.",exc:"Root canal, post & core, or build-up if needed"}),
 I("Temporary (provisional) crown",200,700,"tooth","S1"),
 I("Post & core / build-up",null,null,"tooth","")]),
C("bridge","🌉","Bridges","Fixed replacement teeth",[
 I("Traditional fixed bridge — 3 units",2000,5000,"bridge3","S1",{inc:"All 3 units: 2 crowns on the side teeth + 1 replacement tooth",note:"This is the total for the whole 3-unit bridge, not a per-tooth price."}),
 I("Each additional bridge unit",null,null,"bridgeUnit","",{note:"Per-unit fees are not the same as a whole-bridge price — ask for the total."})]),
C("rct","🩺","Root Canals","Treatment inside the tooth",[
 I("Root canal — front tooth",700,1100,"tooth","S1",{exc:"Crown after the root canal (often needed)"}),
 I("Root canal — premolar",null,null,"tooth",""),
 I("Root canal — molar",900,1500,"tooth","S1",{exc:"Crown after the root canal (often needed)"})]),
C("gum","🩸","Gum Treatment","Deep cleaning & gum care",[
 I("Deep cleaning (scaling & root planing)",185,444,"quadrant","S1",{note:"Priced per quarter of the mouth."}),
 I("Deep cleaning — all 4 quadrants",600,1600,"procedure","S1"),
 I("Gum graft — first tooth",580,1450,"tooth","S7",{note:"Additional adjacent teeth usually cost less each."}),
 I("Periodontal maintenance cleaning",null,null,"visit","")]),
C("surg","🔧","Extractions & Oral Surgery","Removals, wisdom teeth, grafts",[
 I("Simple extraction",130,500,"tooth","S1"),
 I("Surgical extraction",250,650,"tooth","S1"),
 I("Wisdom tooth removal",200,1100,"tooth","S1",{exc:"Sedation, unless listed as included",note:"Range runs from simple to impacted teeth."}),
 I("Bone graft (donor, animal or synthetic bone)",549,1575,"graftSite","S6",{exc:"Implant (billed separately)"}),
 I("Sinus lift",null,null,"procedure","")]),
C("impl","🔩","Implants","Implant parts & complete teeth",[
 I("Complete single implant tooth",3000,6000,"implantComplete","S1",{inc:"Implant post, abutment and crown",exc:"Bone graft, sinus lift, extraction, CT scan, sedation"}),
 I("Implant post placement only",1362,2486,"implantFixture","S8",{exc:"Abutment and crown",note:"Example from published dental-school / faculty-practice fees; private offices may charge more."}),
 I("Implant abutment",437,781,"abutment","S8",{note:"Dental-school / faculty-practice fees; private offices may be higher."}),
 I("Crown on implant",793,1759,"implantCrown","S8",{note:"Dental-school / faculty-practice fees; private offices may be higher."}),
 I("All-on-4 style full-arch implants",11642,27505,"arch","S3")]),
C("dent","😁","Dentures","Full & partial",[
 I("Complete denture",1000,3000,"arch","S1"),
 I("Full set of dentures",1509,3620,"bothArches","S3"),
 I("Partial denture",800,2700,"arch","S1"),
 I("Denture reline or repair",null,null,"procedure","")]),
C("ortho","😬","Orthodontics","Braces & clear aligners",[
 I("Traditional braces — full treatment",3000,7000,"fullTreatment","S2"),
 I("Clear aligners — full treatment",3500,9500,"fullTreatment","S5"),
 I("Clear aligners — short/express treatment",1800,3000,"fullTreatment","S5"),
 I("Monthly payment plan",null,null,"month","",{note:"A monthly payment is part of the total — it is not the full treatment cost."}),
 I("Retainers",null,null,"item","")]),
C("cos","✨","Cosmetic Care","Whitening, veneers, bonding",[
 I("Professional teeth whitening",300,1000,"procedure","S3"),
 I("Porcelain veneer",900,2500,"tooth","S1"),
 I("Cosmetic bonding",null,null,"tooth","")]),
C("sed","😴","Sedation","Comfort options",[
 I("Nitrous oxide (laughing gas)",50,150,"visit","S4"),
 I("Oral sedation (pill)",150,500,"visit","S4"),
 I("IV sedation",500,1500,"procedure","S4",{note:"Often billed by time; longer procedures cost more."}),
 I("General anesthesia",1000,3500,"procedure","S4",{note:"Often billed by time."})])
],sources:[
 {key:"S1",title:"Dental Savings Guide — 2026 cost index (compiles Authority Dental, Aflac, Guardian, ValuePenguin, CareCostIndex)",url:"https://dentalsavingsguide.com/cost-of-dental-care",note:"U.S. without-insurance typical ranges. Accessed Nov 7, 2026."},
 {key:"S2",title:"DentalPlans.com — Costs of common dental procedures without insurance",url:"https://www.dentalplans.com/learning/dental-costs-without-insurance/",note:"U.S. ranges. Accessed Nov 7, 2026."},
 {key:"S3",title:"Real Dental Costs — 2026 dental procedure cost list",url:"https://realdentalcosts.com/en/dental-procedure-cost-list/",note:"Editorial U.S. estimate (edition 2026.1), not collected prices. Accessed Nov 7, 2026."},
 {key:"S4",title:"Real Dental Costs — Sedation dentistry cost 2026",url:"https://realdentalcosts.com/en/sedation-dentistry-cost/",note:"U.S. ranges. Accessed Nov 7, 2026."},
 {key:"S5",title:"Authority Dental — Invisalign cost",url:"https://www.authoritydental.org/invisalign-cost",note:"U.S. package ranges. Accessed Nov 7, 2026."},
 {key:"S6",title:"About Dentist — Dental bone graft cost",url:"https://www.aboutdentist.com/cost/dental-bone-graft",note:"Synchrony-based averages by material. Accessed Nov 7, 2026."},
 {key:"S7",title:"MAZP — Gum graft cost 2026",url:"https://www.mazp.com/gum-graft-cost/",note:"Savings-plan and U. Maryland faculty fee schedules. Accessed Nov 7, 2026."},
 {key:"S8",title:"MAZP — Dental school clinic prices 2026 (U. Maryland School of Dentistry fee schedule)",url:"https://www.mazp.com/dental-school-clinic-prices/",note:"Teaching-clinic fees; private practices may charge more. Accessed Nov 7, 2026."}
]});
})();
