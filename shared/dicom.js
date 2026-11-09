// Bounded CR/DX single-frame uncompressed DICOM research decoder. Rejects other syntax explicitly.
const LONG_VR = new Set(['OB','OD','OF','OL','OV','OW','SQ','UC','UR','UT','UN']);
const tag = (g,e) => `${g.toString(16).padStart(4,'0')}${e.toString(16).padStart(4,'0')}`;
const textValue = bytes => new TextDecoder().decode(bytes).replace(/\0/g,'').trim();
export function parseDicom(buffer) {
  const data=new DataView(buffer);const u8=new Uint8Array(buffer);if(buffer.byteLength<140||textValue(u8.slice(128,132))!=='DICM')throw Error('Not a DICOM Part 10 file');
  let pos=132,syntax=null,values=new Map(),pixel=null,explicit=true;
  const readElement=()=>{if(pos+8>buffer.byteLength)throw Error('Truncated DICOM element');const start=pos,g=data.getUint16(pos,true),e=data.getUint16(pos+2,true);pos+=4;let vr='',length;
    if(g===2||explicit){vr=String.fromCharCode(u8[pos],u8[pos+1]);pos+=2;if(LONG_VR.has(vr)){pos+=2;length=data.getUint32(pos,true);pos+=4;}else{length=data.getUint16(pos,true);pos+=2;}}
    else{length=data.getUint32(pos,true);pos+=4;}
    if(length===0xffffffff)throw Error('Undefined-length or encapsulated DICOM unsupported');
    if(length>buffer.byteLength-pos)throw Error('Truncated DICOM value');const bytes=u8.slice(pos,pos+length);pos+=length;return {start,g,e,vr,length,bytes,offset:pos-length};};
  while(pos+8<=buffer.byteLength){const g=data.getUint16(pos,true);if(g!==2)break;const el=readElement();if(tag(el.g,el.e)==='00020010')syntax=textValue(el.bytes);}
  if(!['1.2.840.10008.1.2','1.2.840.10008.1.2.1'].includes(syntax))throw Error(`Unsupported transfer syntax: ${syntax||'missing'}`);
  explicit=syntax.endsWith('.1');
  while(pos+8<=buffer.byteLength){const el=readElement();const id=tag(el.g,el.e);if(id==='7fe00010'){pixel=el;break;}if(['00080060','00280002','00280004','00280008','00280010','00280011','00280100','00280101','00280102','00280103','00281050','00281051','00281052','00281053'].includes(id))values.set(id,el);}
  const str=id=>values.has(id)?textValue(values.get(id).bytes):'';
  const num=id=>{const el=values.get(id);if(!el)return NaN;return el.bytes.length===2?new DataView(el.bytes.buffer).getUint16(0,true):Number(str(id));};
  const modality=str('00080060'),samples=num('00280002'),photo=str('00280004'),frames=str('00280008')||'1',height=num('00280010'),width=num('00280011'),allocated=num('00280100'),stored=num('00280101'),high=num('00280102'),representation=num('00280103');
  if(!['CR','DX'].includes(modality))throw Error(`Unsupported modality: ${modality||'missing'}`);
  if(frames!=='1')throw Error('Multi-frame DICOM unsupported');
  if(samples!==1||!['MONOCHROME1','MONOCHROME2'].includes(photo))throw Error('Only single-sample monochrome DICOM supported');
  if(!Number.isInteger(width)||!Number.isInteger(height)||width<1||height<1||width*height>16_000_000)throw Error('Invalid or excessive image dimensions');
  if(![8,16].includes(allocated)||stored<1||stored>allocated||high!==stored-1||![0,1].includes(representation))throw Error('Unsupported bit depth or pixel representation');
  if(!pixel||pixel.length<width*height*(allocated/8))throw Error('Missing or truncated pixel data');
  const bitsMask=(1<<stored)-1,sign=1<<(stored-1),pixels=new Float32Array(width*height),slope=Number(str('00281053')||1),intercept=Number(str('00281052')||0);
  if(!Number.isFinite(slope)||!Number.isFinite(intercept))throw Error('Invalid modality transform');
  for(let i=0;i<pixels.length;i++){let raw=allocated===8?pixel.bytes[i]:new DataView(pixel.bytes.buffer).getUint16(i*2,true);raw&=bitsMask;if(representation&&raw&sign)raw-=1<<stored;pixels[i]=raw*slope+intercept;}
  const wc=Number(str('00281050').split('\\')[0]),ww=Number(str('00281051').split('\\')[0]);
  return {width,height,pixels,photometric:photo,bits_stored:stored,pixel_representation:representation,transfer_syntax:syntax,modality,window_center:Number.isFinite(wc)?wc:null,window_width:Number.isFinite(ww)&&ww>0?ww:null};
}
export function renderDicomImage(parsed,center=parsed.window_center,width=parsed.window_width){const {pixels,photometric}=parsed;let lo,hi;if(center!==null&&width!==null&&width>1){lo=center-0.5-(width-1)/2;hi=center-0.5+(width-1)/2;}else{lo=Infinity;hi=-Infinity;for(const p of pixels){lo=Math.min(lo,p);hi=Math.max(hi,p);}if(hi===lo)hi=lo+1;}
  const rgba=new Uint8ClampedArray(pixels.length*4);for(let i=0;i<pixels.length;i++){let v=Math.round(Math.max(0,Math.min(1,(pixels[i]-lo)/(hi-lo)))*255);if(photometric==='MONOCHROME1')v=255-v;rgba.set([v,v,v,255],i*4);}return rgba;
}
