import {PRESETS, SCALE, normalizePatch, normalizePattern, stepDuration, voicing} from './engine.mjs';

export const TRACKS = [
  {id:'keys', name:'Dream keys', kind:'keys', color:'#c978ac', icon:'✧', hint:'hazy chords', volume:.78},
  {id:'bass', name:'808 bass', kind:'bass', color:'#9374c7', icon:'〰', hint:'deep & round', volume:.72},
  {id:'kick', name:'Kick', kind:'kick', color:'#cb8493', icon:'◉', hint:'low punch', volume:.82},
  {id:'snare', name:'Snare', kind:'snare', color:'#bd96c9', icon:'▰', hint:'dusty snap', volume:.64},
  {id:'hat', name:'Hi-hat', kind:'hat', color:'#73afc6', icon:'✳', hint:'little shimmer', volume:.47},
  {id:'clap', name:'Clap', kind:'clap', color:'#b69b79', icon:'✦', hint:'soft texture', volume:.48}
];
const notePattern = entries => {const notes=Array(16).fill(null);for(const [step,note] of entries)notes[step]=note;return notes;};
const hitPattern = steps => notePattern(steps.map(step=>[step,0]));
export function newProject(style='haze') {
  const project={version:2,bpm:88,swing:.12,root:0,master:.82,patch:{...PRESETS.haze},chord:'minor7',bassDecay:.8,bassDrive:.28,tracks:TRACKS.map(t=>({...t,muted:false,solo:false,effects:{tone:16000,drive:0,space:0,echo:0},pattern:Array(16).fill(null)}))};
  if(style==='empty')return project;
  const patterns=style==='bounce' ? [
    notePattern([[0,0],[3,2],[6,3],[10,4],[14,2]]),notePattern([[0,0],[3,0],[6,3],[8,3],[11,4],[14,2]]),hitPattern([0,3,6,8,11,14]),hitPattern([4,12]),hitPattern([0,2,4,6,8,10,11,12,14,15]),hitPattern([12])
  ] : [notePattern([[0,0],[6,2],[8,3],[14,4]]),notePattern([[0,0],[6,2],[8,3],[14,4]]),hitPattern([0,6,8,10]),hitPattern([4,12]),hitPattern([0,2,4,6,8,10,12,14]),hitPattern([12])];
  project.tracks.forEach((t,i)=>t.pattern=patterns[i]);
  if(style==='bounce'){project.bpm=96;project.swing=.18;project.patch={...PRESETS.bedroom};project.bassDrive=.4;}
  return project;
}
const clamp=(v,min,max,fallback)=>Number.isFinite(Number(v))?Math.max(min,Math.min(max,Number(v))):fallback;
export function normalizeProject(value) {
  const p=newProject('empty');if(!value||typeof value!=='object')return p;
  p.bpm=clamp(value.bpm,50,160,88);p.swing=clamp(value.swing,0,.4,.12);p.master=clamp(value.master,0,1,.82);
  p.root=[0,2,4,5,7,9,11].includes(value.root)?value.root:0;
  p.patch=normalizePatch(value.patch);p.chord=['single','minor7','major7'].includes(value.chord)?value.chord:'minor7';
  p.bassDecay=clamp(value.bassDecay,.15,1.5,.8);p.bassDrive=clamp(value.bassDrive,0,1,.28);
  for(const saved of Array.isArray(value.tracks)?value.tracks:[]){if(saved?.kind==='sample'&&/^sample-[1-4]$/.test(saved.id)&&!p.tracks.some(t=>t.id===saved.id))p.tracks.push(sampleTrack(saved.id,String(saved.name||'Your sound').slice(0,35)));}
  p.tracks.forEach(t=>{const saved=value.tracks?.find?.(s=>s?.id===t.id);if(saved){t.volume=clamp(saved.volume,0,1,t.volume);t.muted=saved.muted===true;t.solo=saved.solo===true;t.pattern=normalizePattern(saved.pattern).map(n=>n===null?null:(t.kind==='keys'||t.kind==='bass'?n:0));t.effects={tone:clamp(saved.effects?.tone,200,16000,16000),drive:clamp(saved.effects?.drive,0,1,0),space:clamp(saved.effects?.space,0,1,0),echo:clamp(saved.effects?.echo,0,1,0)};if(t.kind==='sample'){t.length=clamp(saved.length,.1,8,3);t.pitch=clamp(saved.pitch,-12,12,0);}}});
  if(!Array.isArray(value.tracks)&&value.pattern)p.tracks[0].pattern=normalizePattern(value.pattern);
  return p;
}
export const audible = (project,track) => !track.muted && (!project.tracks.some(t=>t.solo)||track.solo);
export const sampleTrack=(id,name)=>({id,name,kind:'sample',color:'#739e95',icon:'↗',hint:'your imported sound',volume:.65,muted:false,solo:false,pattern:Array(16).fill(null),effects:{tone:16000,drive:0,space:0,echo:0},length:3,pitch:0});
export const midiFor = (project,track,pitch) => (track.kind==='bass'?36:48)+project.root+SCALE[pitch];
export function loopEvents(project,loops=4) {
  const events=[];let time=0;
  for(let i=0;i<16*loops;i++){const step=i%16,duration=stepDuration(project.bpm,step,project.swing);for(const track of project.tracks){const pitch=track.pattern[step];if(pitch!==null&&audible(project,track)&&track.volume>0)events.push({track:track.id,step,time,pitch,midi:midiFor(project,track,pitch),gate:duration*(track.kind==='keys'?1.4:1),notes:track.kind==='keys'?voicing(midiFor(project,track,pitch),project.chord):[]});}time+=duration;}
  return {events,duration:time};
}
