// Deterministic summary of entered synthetic context. It makes no diagnosis or referral decision.
const readable=value=>String(value??'').replaceAll('_',' ');
const stated=value=>value&&value!=='not_assessed'&&value!=='unknown'?readable(value):'Not assessed';

export function handoverData(study){
  const missing=[],warnings=[];
  if(study.age_years===null||study.age_years===undefined||study.age_years==='')missing.push('Age');
  else if(!Number.isFinite(Number(study.age_years))||Number(study.age_years)<0||Number(study.age_years)>120)warnings.push('Age is outside the accepted entry range.');
  if(!study.mechanism||study.mechanism==='unknown')missing.push('Mechanism');
  if(!study.injury_timing)missing.push('Injury timing');
  if(!study.indication)missing.push('Clinical question');
  if(!study.laterality||study.laterality==='unknown'||study.laterality_source==='conflict')warnings.push('Laterality needs confirmation.');
  const available=new Set(study.images.map(i=>i.view));
  const missingViews=study.expected_views.filter(view=>!available.has(view));
  if(missingViews.length)warnings.push(`Expected views missing: ${missingViews.join(', ')}.`);
  for(const [field,label] of [['open_wound','Open wound'],['perfusion','Perfusion'],['nerve','Nerve']]){
    if(study.examination[field]==='present')warnings.push(`${label} concern marked present; use the approved local clinical pathway.`);
    else if(study.examination[field]==='not_assessed'||!study.examination[field])missing.push(`${label} assessment`);
  }
  if(study.capture_domain!=='native_dicom'&&study.capture_domain!=='direct_export')warnings.push('Image capture domain is outside the proposed model scope.');
  return {missing,warnings,views:[...available],missingViews};
}

export function handoverText(study){
  const data=handoverData(study),exam=study.examination;
  const lines=[
    'SYNTHETIC HANDOVER DRAFT — clinician review required',
    `Study: ${study.id} · Episode: ${study.episode_id} · Version: ${study.version}`,
    `Clinical question: ${study.indication||'Not recorded'}`,
    `Age: ${study.age_years??'Not recorded'} · Anatomy: ${readable(study.anatomy)} · Side: ${readable(study.laterality)}`,
    `Mechanism: ${stated(study.mechanism)} · Injury timing: ${study.injury_timing||'Not recorded'}`,
    `Views: ${data.views.join(', ')||'None'} · Capture domain: ${readable(study.capture_domain)}`,
    `Open wound: ${stated(exam.open_wound)} · Perfusion: ${stated(exam.perfusion)} · Nerve: ${stated(exam.nerve)}`,
    `Manual concern note: ${study.concern||'Not recorded'}`,
    `Missing information: ${data.missing.join('; ')||'No listed field is missing; accuracy still requires review.'}`,
    `Review flags: ${data.warnings.join(' ')||'None recorded; this does not exclude injury or need for review.'}`,
    'This draft summarises entered information only. No image inference, diagnosis, urgency or referral decision was generated.'
  ];
  return lines.join('\n');
}
