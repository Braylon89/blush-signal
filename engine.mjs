export const NOTE_NAMES=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
export const SCALE=[0,2,3,5,7,10,12];
export const DEFAULT_PATTERN=[0,null,4,null,3,null,2,null,0,4,null,5,3,null,2,null];
export const PRESETS={
 haze:{name:'Pink Haze',tag:'WOOZY / WARM / WIDE',description:'Soft analog chords that drift a little. Your late-night starting point.',wave:'sawtooth',detune:12,tone:2200,attack:.09,release:1.15,chorus:.65,wobble:.4,drive:.18,space:.46,echo:.17,volume:.55},
 bedroom:{name:'Bedroom Keys',tag:'DUSTY / MELLOW / CLOSE',description:'Rounded keys, worn edges, a little tape flutter. Keep it simple.',wave:'triangle',detune:7,tone:3400,attack:.012,release:.55,chorus:.34,wobble:.28,drive:.26,space:.26,echo:.12,volume:.6},
 orbit:{name:'Slow Orbit',tag:'DREAMY / SOFT / FLOATING',description:'A slowly opening pad with a long room around it. Hold a chord.',wave:'sawtooth',detune:19,tone:1500,attack:.65,release:2.1,chorus:.85,wobble:.55,drive:.08,space:.7,echo:.26,volume:.5},
 bass:{name:'Fuzzy Heart',tag:'LOW / FUZZY / SOLID',description:'A warm bass with rough edges. Drop an octave and let it walk.',wave:'square',detune:4,tone:780,attack:.008,release:.21,chorus:.1,wobble:.12,drive:.62,space:.08,echo:.03,volume:.52,bass:true}
};
export const PARAMS={tone:[150,9000],detune:[0,28],attack:[.005,.8],release:[.08,2.5],chorus:[0,1],wobble:[0,1],drive:[0,1],space:[0,1],echo:[0,1],volume:[0,1]};
export const frequency=midi=>440*2**((midi-69)/12);
export const noteName=midi=>NOTE_NAMES[((midi%12)+12)%12]+(Math.floor(midi/12)-1);
export const voicing=(midi,mode)=>[midi,...(mode==='minor7'?[midi+3,midi+7,midi+10]:mode==='major7'?[midi+4,midi+7,midi+11]:[])];
export const stepDuration=(bpm,index,swing)=>60/Math.max(50,Math.min(160,bpm))/4*(index%2?1-swing:1+swing);
export function normalizePatch(value){const patch={...PRESETS.haze};if(value&&typeof value==='object'){for(const[key,[min,max]]of Object.entries(PARAMS))if(Number.isFinite(Number(value[key])))patch[key]=Math.max(min,Math.min(max,Number(value[key])));if(['sine','triangle','sawtooth','square'].includes(value.wave))patch.wave=value.wave;patch.bass=value.bass===true;}return patch;}
export const normalizePattern=value=>Array.from({length:16},(_,i)=>Number.isInteger(value?.[i])&&value[i]>=0&&value[i]<SCALE.length?value[i]:null);
export function patternEvents(pattern,{bpm=88,swing=.12,root=48,chord='single',loops=4}={}){const events=[];let time=0;for(let i=0;i<16*loops;i++){const step=i%16,duration=stepDuration(bpm,step,swing),pitch=pattern[step];if(pitch!==null&&pitch!==undefined)events.push({time,midi:root+SCALE[pitch],gate:duration*.76,notes:voicing(root+SCALE[pitch],chord)});time+=duration;}return {events,duration:time};}
export function encodeWav(channels,sampleRate){const frames=channels[0].length,count=channels.length,bytes=frames*count*2,buffer=new ArrayBuffer(44+bytes),view=new DataView(buffer),write=(offset,s)=>[...s].forEach((c,i)=>view.setUint8(offset+i,c.charCodeAt(0)));write(0,'RIFF');view.setUint32(4,36+bytes,true);write(8,'WAVE');write(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,count,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*count*2,true);view.setUint16(32,count*2,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,bytes,true);let offset=44;for(let i=0;i<frames;i++)for(let c=0;c<count;c++){const value=Math.max(-1,Math.min(1,channels[c][i]));view.setInt16(offset,value<0?value*32768:value*32767,true);offset+=2;}return buffer;}
