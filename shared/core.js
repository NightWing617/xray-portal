export const CONTRACT_VERSION = '0.1.0';
export const STORAGE_KEY = 'orthopaedic-synthetic-studies-v1';
const deepCopy = value => JSON.parse(JSON.stringify(value));
const svg = (kind, view, side) => {
  const fracture = kind === 'fracture' ? '<path d="M125 160l18 12-13 10 15 12" stroke="#f1f5f9" stroke-width="3" fill="none"/>' : '';
  const drawing = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 340"><rect width="260" height="340" fill="#111827"/><path d="M100 20 Q90 90 112 165 L100 292 Q130 315 157 291 L144 165 Q164 90 153 20Z" fill="#8c99a8" stroke="#d1d5db" stroke-width="3"/><path d="M111 165Q128 155 145 166" stroke="#202b36" stroke-width="7" fill="none"/>${fracture}<text x="15" y="30" fill="#fff" font-size="14">${side.toUpperCase()} · ${view}</text><text x="15" y="324" fill="#cbd5e1" font-size="12">SYNTHETIC · NOT RADIOGRAPH</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(drawing)}`;
};
const spec = [
  ['S-100','P-100','E-100','wrist','left','adult','fall','initial','fracture',['PA','lateral'],'direct_export'],
  ['S-101','P-101','E-101','wrist','right','adult','fall','initial','negative',['PA','lateral'],'direct_export'],
  ['S-102','P-102','E-102','wrist','unknown','adult','sport','initial','indeterminate',['PA'],'direct_export'],
  ['S-103','P-103','E-103','wrist','left','paediatric','fall','initial','fracture',['PA','lateral'],'direct_export'],
  ['S-104','P-104','E-104','ankle','right','adult','twist','initial','fracture',['AP','lateral'],'direct_export'],
  ['S-105','P-105','E-105','wrist','right','adult','fall','post_reduction','fracture',['PA','lateral'],'direct_export'],
  ['S-106','P-105','E-105','wrist','right','adult','fall','initial','fracture',['PA','lateral'],'direct_export'],
  ['S-107','P-107','E-107','wrist','left','adult','fall','initial','indeterminate',['PA','lateral'],'monitor_photo']
];
export function seedStudies() {
  return spec.map(([id,patient_id,episode_id,anatomy,laterality,age_group,mechanism,phase,target,views,capture_domain],i)=>({
    schema_version:CONTRACT_VERSION,id,version:1,patient_id,episode_id,encounter_id:`C-${i}`,institution_id:i===7?'SITE-B':'SITE-A',age_years:age_group==='adult'?34+i:12,age_group,anatomy,laterality,laterality_source:id==='S-102'?'conflict':'reviewed',mechanism,phase,capture_domain,
    acquired_at:`2026-10-${String(10+i).padStart(2,'0')}T10:00:00Z`,indication:'Synthetic demonstration of acute injury assessment',expected_views:anatomy==='wrist'?['PA','lateral']:['AP','lateral'],
    images:views.map((view,j)=>({id:`${id}-I${j+1}`,series_id:`${id}-SER1`,view,view_source:'entered',format:'synthetic-svg',width:260,height:340,bits_stored:null,photometric:null,hash:null,source_image_id:null,capture_domain,deid:'reviewed',src:svg(target,view,laterality)})),
    examination:{open_wound:'not_assessed',perfusion:id==='S-101'?'indeterminate':'not_assessed',nerve:'not_assessed',timestamp:null},
    findings:target==='fracture'?[{id:`F-${id}`,status:'present',bone:anatomy==='wrist'?'distal radius':'distal fibula',site:'distal',morphology:'not_assessed',regions:[],source:'human',certainty:'provisional'}]:[],
    review:{state:i<2?'accepted':i===4?'independent_review':'draft',author:'synthetic-author',reviewer:i<2?'synthetic-reviewer':null,decision:i===0?'positive':i===1?'negative':'not_assessed'},
    governance:{deid:'reviewed',rights:i<2?'training':'unknown',withdrawn:false,excluded:false},linked_study_ids:id==='S-105'?['S-106']:id==='S-106'?['S-105']:[],history:[{at:'2026-11-08',actor:'synthetic-fixture',action:'created'}],note:target==='negative'?'No visible abnormality in synthetic label; clinical concern remains possible.':'Synthetic fixture only.'
  }));
}
export function loadStudies(storage=globalThis.localStorage) { try { const data=JSON.parse(storage.getItem(STORAGE_KEY)); return Array.isArray(data)?data:seedStudies(); } catch { return seedStudies(); } }
export function saveStudies(studies,storage=globalThis.localStorage) { storage.setItem(STORAGE_KEY,JSON.stringify(studies)); }
export function countEntities(studies) {return {patients:new Set(studies.map(s=>s.patient_id)).size,episodes:new Set(studies.map(s=>s.episode_id)).size,studies:studies.length,images:studies.reduce((n,s)=>n+s.images.length,0)};}
export function eligible(s) {return s.review.state==='accepted'&&['positive','negative'].includes(s.review.decision)&&s.governance.deid==='reviewed'&&s.governance.rights==='training'&&!s.governance.withdrawn&&!s.governance.excluded&&s.images.every(i=>i.deid==='reviewed');}
export function filterStudies(studies,f={}) {return studies.filter(s=>{
  const q=(f.search||'').toLowerCase();if(q&&!`${s.id} ${s.patient_id} ${s.episode_id} ${s.anatomy} ${s.mechanism}`.toLowerCase().includes(q))return false;
  for(const k of ['anatomy','laterality','age_group','mechanism','phase','capture_domain'])if(f[k]&&s[k]!==f[k])return false;
  if(f.finding&&s.review.decision!==f.finding)return false;
  if(f.review&&s.review.state!==f.review)return false;
  if(f.eligibility&&String(eligible(s))!==f.eligibility)return false;
  if(f.views==='complete'&&!s.expected_views.every(v=>s.images.some(i=>i.view===v)))return false;
  if(f.views==='incomplete'&&s.expected_views.every(v=>s.images.some(i=>i.view===v)))return false;
  return true;
}).sort((a,b)=>f.sort==='oldest'?a.acquired_at.localeCompare(b.acquired_at):f.sort==='id'?a.id.localeCompare(b.id):b.acquired_at.localeCompare(a.acquired_at));}
export function validateBox(b) {return ['x','y','w','h'].every(k=>Number.isFinite(b[k]))&&b.x>=0&&b.y>=0&&b.w>0&&b.h>0&&b.x+b.w<=1&&b.y+b.h<=1;}
export function canIndependentReview(s,actor) {return !!actor&&s.review.author!==actor&&['draft','independent_review','disagreement'].includes(s.review.state);}
export function reviewStudy(s,actor,decision) {if(!canIndependentReview(s,actor))throw Error('Independent reviewer must differ from author');if(!['positive','negative','indeterminate'].includes(decision))throw Error('Invalid decision');const copy=deepCopy(s);copy.review.reviewer=actor;copy.review.decision=decision;copy.review.state='accepted';copy.version++;copy.history.push({at:new Date().toISOString(),actor,action:`independent review: ${decision}`});return copy;}
export function exportManifest(studies,seed='research-v1') {const records=studies.filter(eligible).map(s=>({study_id:s.id,patient_group:s.patient_id,episode_id:s.episode_id,image_ids:s.images.map(i=>i.id),label:s.review.decision,ontology:'adult-wrist-fracture-0.1',rights:s.governance.rights,split:splitForPatient(s.patient_id,seed)}));return {schema_version:CONTRACT_VERSION,seed,created_at:new Date().toISOString(),records};}
export function splitForPatient(patient,seed='research-v1') {let h=2166136261;for(const c of `${seed}:${patient}`)h=Math.imul(h^c.charCodeAt(0),16777619)>>>0;const n=h%10;return n<7?'development':n<9?'calibration':'test';}
export function modelScope(s) {if(s.age_group!=='adult'||s.anatomy!=='wrist'||s.phase!=='initial')return {supported:false,reason:'outside_adult_initial_wrist_scope'};if(!['native_dicom','direct_export'].includes(s.capture_domain))return {supported:false,reason:'capture_domain_unsupported'};if(s.laterality==='unknown'||s.laterality_source==='conflict')return {supported:false,reason:'laterality_unresolved'};if(!s.expected_views.every(v=>s.images.some(i=>i.view===v)))return {supported:false,reason:'missing_expected_view'};return {supported:true,reason:'demo_fixture_only'};}
export function mockAnalysis(s) {const scope=modelScope(s);const scripted=s.id==='S-100'&&s.images[0]?[{id:'DEMO-PROPOSAL',status:'indeterminate',bone:'distal radius',site:'distal',morphology:'not_assessed',regions:[{image_id:s.images[0].id,x:.42,y:.44,w:.2,h:.15}],source:'mock',certainty:'provisional'}]:[];return {schema_version:CONTRACT_VERSION,study_id:s.id,study_version:s.version,mode:'demo',run_state:'completed',model:{id:'deterministic-synthetic-fixture',artifact_hash:null},scope:{supported:false,reason:'demonstration_only',input_scope:scope},input_summary:{views:s.images.map(i=>i.view),laterality:s.laterality,image_ids:s.images.map(i=>i.id)},quality:{status:scope.supported?'fixture_complete':'limited',limitations:scope.supported?[]:[scope.reason]},findings:scope.supported?scripted:[],assessment:{status:'not_assessed',probability:null,target:'adult_acute_wrist_fracture'},limitations:['Synthetic demonstration; no trained or validated model.','Image appearance does not establish wound, perfusion or nerve status.'],review:{state:'draft',training_eligible:false}};}
